import { useCallback, useEffect, useState, useRef } from "react";
import {
  fetchGitHubStats,
  GitHubStats,
  VERIFIED_FALLBACK_STATS,
  formatSyncTime,
} from "../lib/github";

export const CACHE_KEY = "sayam.github.stats.v1";
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes auto-refresh

interface CachedData {
  timestamp: number;
  data: GitHubStats;
}

// In-memory fallback if sessionStorage is blocked in restricted iframe environments
let inMemoryCache: CachedData | null = null;

function readCache(ignoreTtl = false): GitHubStats | null {
  try {
    if (typeof window === "undefined") {
      return inMemoryCache ? inMemoryCache.data : null;
    }

    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) {
      if (inMemoryCache) {
        if (!ignoreTtl && Date.now() - inMemoryCache.timestamp > CACHE_TTL) {
          return null;
        }
        return inMemoryCache.data;
      }
      return null;
    }

    const cached = JSON.parse(raw) as CachedData;
    inMemoryCache = cached;

    if (!ignoreTtl && Date.now() - cached.timestamp > CACHE_TTL) {
      return null;
    }

    return cached.data;
  } catch (err) {
    console.warn("[GitHub Cache] Failed to read from sessionStorage:", err);
    return inMemoryCache ? inMemoryCache.data : null;
  }
}

function writeCache(data: GitHubStats): void {
  try {
    const value: CachedData = {
      timestamp: Date.now(),
      data,
    };
    inMemoryCache = value;

    if (typeof window !== "undefined") {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(value));
    }
  } catch (err) {
    // Cache write failure must never break the UI
    console.warn("[GitHub Cache] Failed to write to sessionStorage:", err);
  }
}

export interface UseGitHubStatsReturn {
  data: GitHubStats | null;
  stats: GitHubStats | null; // convenient alias
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: (force?: boolean) => Promise<void>;
  lastSyncedLabel: string;
}

/**
 * useGitHubStats Hook
 * 
 * Manages fetching, 5-minute caching, resilient stale fallback, and periodic background auto-refresh
 * for real public GitHub statistics of codesbysayam.
 * 
 * Key guarantees:
 * 1. Strictly relies on real GitHub public REST API responses.
 * 2. 5-minute client-side caching via sessionStorage.
 * 3. Never replaces valid data with zeros on API failures.
 * 4. Pauses periodic refresh when document is hidden (visibilityState === "hidden").
 * 5. Immediate manual refresh control via refresh(true).
 */
export function useGitHubStats(): UseGitHubStatsReturn {
  const [data, setData] = useState<GitHubStats | null>(() => {
    return readCache() || readCache(true) || VERIFIED_FALLBACK_STATS;
  });

  const [loading, setLoading] = useState<boolean>(() => !readCache());
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Keep track of in-flight controller to prevent overlapping duplicate requests
  const activeControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const refresh = useCallback(async (force = false) => {
    // If not forcing and fresh cache is present, load from cache and exit
    if (!force) {
      const cached = readCache();
      if (cached) {
        if (isMountedRef.current) {
          setData(cached);
          setLoading(false);
        }
        return;
      }
    }

    // Abort any pending fetch before starting a new one
    if (activeControllerRef.current) {
      activeControllerRef.current.abort();
    }

    const controller = new AbortController();
    activeControllerRef.current = controller;

    if (isMountedRef.current) {
      setRefreshing(true);
    }

    try {
      const fresh = await fetchGitHubStats(controller.signal);

      if (isMountedRef.current) {
        setData(fresh);
        writeCache(fresh);
        setError(null);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      console.error("[GitHub]", err);

      if (isMountedRef.current) {
        // IMPORTANT: NEVER overwrite existing valid data with zeroes.
        // If data is currently null, fallback to stale cache or verified baseline
        setData((prev) => {
          if (prev) return prev;
          const stale = readCache(true);
          return stale || VERIFIED_FALLBACK_STATS;
        });

        setError("GitHub data is temporarily unavailable.");
      }
    } finally {
      if (activeControllerRef.current === controller) {
        activeControllerRef.current = null;
      }
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Initial fetch on mount
    void refresh(false);

    // Auto-refresh when tab gains focus and cache is expired
    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        const freshCache = readCache();
        // If cache has expired (> 5 minutes), refresh automatically
        if (!freshCache) {
          void refresh(false);
        }
      }
    };

    // Auto-refresh interval (5 minutes) - only fires while page is active
    const intervalId = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        void refresh(false);
      }
    }, REFRESH_INTERVAL);

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
      }
    };
  }, [refresh]);

  return {
    data,
    stats: data,
    loading,
    refreshing,
    error,
    refresh,
    lastSyncedLabel: formatSyncTime(data?.fetchedAt),
  };
}
