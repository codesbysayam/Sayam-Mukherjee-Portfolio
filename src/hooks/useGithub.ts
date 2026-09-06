import { useState, useEffect, useCallback, useMemo } from "react";
import {
  github,
  GitHubUser,
  GitHubRepo,
  GitHubEvent,
  GitHubStatsData,
  fetchGitHubStats,
  GITHUB_TTL,
  VERIFIED_USER_BASELINE,
  VERIFIED_REPOS_BASELINE,
  VERIFIED_EVENTS_BASELINE,
  VERIFIED_GITHUB_FALLBACK
} from "../services/github";

export interface GitHubState {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  events: GitHubEvent[];
  stats: GitHubStatsData;
  loading: boolean;
  error: string | null;
  syncedAt: number | null;
  usingCache: boolean;
  rateLimited: boolean;
}

// Global shared state across all components initialized with verified 4-repo data
let globalState: GitHubState = {
  user: VERIFIED_USER_BASELINE,
  repos: VERIFIED_REPOS_BASELINE,
  events: VERIFIED_EVENTS_BASELINE,
  stats: VERIFIED_GITHUB_FALLBACK,
  loading: false,
  error: null,
  syncedAt: Date.now(),
  usingCache: true,
  rateLimited: false
};

const listeners = new Set<(state: GitHubState) => void>();
let inFlightPromise: Promise<void> | null = null;
let hasInitialFetched = false;

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener(globalState);
    } catch (e) {
      console.error("useGithub listener error:", e);
    }
  });
}

/**
 * Fetch GitHub data with singleton deduplication
 */
async function fetchAllGitHubData(force = false): Promise<void> {
  if (inFlightPromise) {
    return inFlightPromise;
  }

  if (force) {
    github.invalidateCache();
  }

  globalState = {
    ...globalState,
    loading: true,
    error: null
  };
  notifyListeners();

  inFlightPromise = (async () => {
    try {
      const [userRes, reposRes, eventsRes, statsRes] = await Promise.all([
        github.user(force).catch((e) => {
          console.warn("GitHub user fetch warning:", e);
          return null;
        }),
        github.repos(force).catch((e) => {
          console.warn("GitHub repos fetch warning:", e);
          return null;
        }),
        github.events(force).catch((e) => {
          console.warn("GitHub events fetch warning:", e);
          return null;
        }),
        fetchGitHubStats(force).catch((e) => {
          console.warn("GitHub stats fetch warning:", e);
          return null;
        })
      ]);

      const isUsingCache = Boolean(
        userRes?.fromCache || reposRes?.fromCache || eventsRes?.fromCache
      );
      const isRateLimited = Boolean(
        userRes?.rateLimited || reposRes?.rateLimited || eventsRes?.rateLimited
      );
      const syncedTimestamp = Math.max(
        userRes?.timestamp || 0,
        reposRes?.timestamp || 0,
        eventsRes?.timestamp || 0,
        Date.now()
      );

      globalState = {
        user: userRes?.data || globalState.user,
        repos: Array.isArray(reposRes?.data) && reposRes.data.length > 0 ? reposRes.data : globalState.repos,
        events: Array.isArray(eventsRes?.data) && eventsRes.data.length > 0 ? eventsRes.data : globalState.events,
        stats: statsRes || globalState.stats,
        loading: false,
        error: null,
        syncedAt: syncedTimestamp,
        usingCache: isUsingCache,
        rateLimited: isRateLimited
      };
    } catch (err: any) {
      console.warn("useGithub overall fetch error:", err);
      globalState = {
        ...globalState,
        loading: false,
        error: null
      };
    } finally {
      inFlightPromise = null;
      notifyListeners();
    }
  })();

  return inFlightPromise;
}

/**
 * Centralized React hook providing access to shared live GitHub data.
 */
export function useGithub() {
  const [state, setState] = useState<GitHubState>(globalState);

  useEffect(() => {
    listeners.add(setState);

    // Initial background fetch to get latest realtime stats from server proxy
    if (!hasInitialFetched && !inFlightPromise) {
      hasInitialFetched = true;
      fetchAllGitHubData(false);
    }

    // Auto-refresh when browser tab becomes visible after TTL
    const handleVisibilityChange = () => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "visible" &&
        globalState.syncedAt &&
        Date.now() - globalState.syncedAt > GITHUB_TTL &&
        !inFlightPromise
      ) {
        fetchAllGitHubData(false);
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      listeners.delete(setState);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, []);

  const refresh = useCallback(async () => {
    await fetchAllGitHubData(true);
  }, []);

  const latestRepo = useMemo(() => {
    return state.repos.length > 0 ? state.repos[0] : null;
  }, [state.repos]);

  const latestEvent = useMemo(() => {
    return state.events.length > 0 ? state.events[0] : null;
  }, [state.events]);

  return {
    ...state,
    latestRepo,
    latestEvent,
    totalReposCount: state.user?.public_repos ?? state.repos.length,
    refresh
  };
}
