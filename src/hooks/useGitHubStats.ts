import { useCallback, useEffect, useState } from "react";
import { fetchGitHubStats, formatRelativeDate, GITHUB_CACHE_DURATION_MS } from "../lib/github";
import { GitHubStats, GitHubDataSource, GitHubTelemetryState } from "../data/githubTypes";

// Module-level shared singleton store across the entire application
let sharedData: GitHubStats | null = null;
let sharedLoading = true;
let sharedRefreshing = false;
let sharedError: string | null = null;
let sharedLastUpdated: string | null = null;
let lastFetchTimestamp = 0;
let activeSnapshotPromise: Promise<GitHubStats | null> | null = null;

const subscribers = new Set<() => void>();

function notifySubscribers() {
  subscribers.forEach((callback) => {
    try {
      callback();
    } catch {
      // Ignore individual subscriber callback errors
    }
  });
}

/**
 * Loads GitHub statistics using single source of truth with a strict 5-minute cache window.
 * Eliminates concurrent duplicate calls and prevents browser rate-limit issues.
 */
async function fetchSharedStats(isManualRefresh = false): Promise<GitHubStats | null> {
  const now = Date.now();

  // If we already have fresh data (< 5 min) and not a manual forced refresh, reuse cache
  if (!isManualRefresh && sharedData && now - lastFetchTimestamp < GITHUB_CACHE_DURATION_MS) {
    return sharedData;
  }

  // Deduplicate active promises
  if (activeSnapshotPromise) {
    return activeSnapshotPromise;
  }

  if (sharedData) {
    sharedRefreshing = true;
  } else {
    sharedLoading = true;
  }
  sharedError = null;
  notifySubscribers();

  activeSnapshotPromise = (async () => {
    try {
      const stats = await fetchGitHubStats({ force: isManualRefresh });
      sharedData = stats;
      lastFetchTimestamp = Date.now();
      sharedLoading = false;
      sharedRefreshing = false;
      sharedError = null;
      sharedLastUpdated = formatRelativeDate(stats.fetchedAt || (stats as any).syncedAt);
      notifySubscribers();
      return stats;
    } catch (err: unknown) {
      // If we already have existing data, preserve it and do not overwrite with an error
      if (!sharedData) {
        sharedError = "GitHub data is temporarily unavailable.";
      }
      sharedLoading = false;
      sharedRefreshing = false;
      notifySubscribers();
      return sharedData;
    } finally {
      activeSnapshotPromise = null;
    }
  })();

  return activeSnapshotPromise;
}

export interface UseGitHubStatsReturn {
  data: GitHubStats | null;
  stats: GitHubStats | null; // Alias
  source: GitHubDataSource;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdated: string | null;
  rateLimitRemaining: number | null;
  rateLimitReset: string | null;
  refresh: (manual?: boolean) => Promise<void>;
}

/**
 * useGitHubStats - Authoritative single source of truth for GitHub repository data.
 * All components consume the same cached data from /data/github.json with a 5-minute cache window.
 * ZERO browser requests are made directly to api.github.com.
 */
export function useGitHubStats(): UseGitHubStatsReturn {
  const [, setTick] = useState(0);

  useEffect(() => {
    const updateListener = () => setTick((t) => (t + 1) % 10000);
    subscribers.add(updateListener);

    // Initial load if not yet fetched or if cache is stale (> 5 minutes)
    const isStale = !sharedData || Date.now() - lastFetchTimestamp >= GITHUB_CACHE_DURATION_MS;
    if (isStale) {
      fetchSharedStats(false);
    } else if (sharedLoading) {
      // Data exists from storage/previous fetch, clear loading
      sharedLoading = false;
    }

    return () => {
      subscribers.delete(updateListener);
    };
  }, []);

  const refresh = useCallback(async (manual = true) => {
    await fetchSharedStats(manual);
  }, []);

  return {
    data: sharedData,
    stats: sharedData,
    source: (sharedData?.source as GitHubDataSource) || "snapshot",
    loading: sharedLoading && !sharedData,
    refreshing: sharedRefreshing,
    error: sharedError,
    lastUpdated: sharedLastUpdated || (sharedData ? formatRelativeDate(sharedData.fetchedAt || (sharedData as any).syncedAt) : null),
    rateLimitRemaining: 60,
    rateLimitReset: null,
    refresh,
  };
}

// Backwards-compatible alias for prompt specification
export const useGitHubSnapshot = useGitHubStats;

export default useGitHubStats;
