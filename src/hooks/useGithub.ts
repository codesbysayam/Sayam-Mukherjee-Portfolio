import { useState, useEffect, useCallback, useMemo } from "react";
import {
  github,
  GitHubUser,
  GitHubRepo,
  GitHubEvent,
  GitHubStatsData,
  GitHubPulseData,
  GitHubRawSnapshot,
  loadGitHubSnapshot,
  computeGitHubPulse,
  fetchGitHubStats,
  GITHUB_TTL,
  VERIFIED_USER_BASELINE,
  VERIFIED_REPOS_BASELINE,
  VERIFIED_EVENTS_BASELINE,
  VERIFIED_PULSE_BASELINE,
  VERIFIED_GITHUB_FALLBACK
} from "../services/github";

export interface GitHubState {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  events: GitHubEvent[];
  stats: GitHubStatsData;
  pulse: GitHubPulseData;
  loading: boolean;
  error: string | null;
  syncedAt: number | null;
  usingCache: boolean;
  rateLimited: boolean;
  snapshot: GitHubRawSnapshot | null;
  snapshotStatus: string;
}

// Global shared state across all components initialized with verified data
let globalState: GitHubState = {
  user: VERIFIED_USER_BASELINE,
  repos: VERIFIED_REPOS_BASELINE,
  events: VERIFIED_EVENTS_BASELINE,
  stats: VERIFIED_GITHUB_FALLBACK,
  pulse: VERIFIED_PULSE_BASELINE,
  loading: false,
  error: null,
  syncedAt: Date.now(),
  usingCache: true,
  rateLimited: false,
  snapshot: null,
  snapshotStatus: "ok"
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
      const [snapshot, userRes, reposRes, eventsRes, statsRes] = await Promise.all([
        loadGitHubSnapshot(force).catch((e) => {
          console.warn("GitHub snapshot fetch warning:", e);
          return null;
        }),
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

      const snapshotStatus = snapshot?.status || "ok";
      const isSnapshotError = snapshotStatus === "error";

      const isUsingCache = Boolean(
        userRes?.fromCache || reposRes?.fromCache || eventsRes?.fromCache
      );
      const isRateLimited = false;
      const syncedTimestamp = Math.max(
        userRes?.timestamp || 0,
        reposRes?.timestamp || 0,
        eventsRes?.timestamp || 0,
        Date.now()
      );

      const finalEvents = isSnapshotError
        ? []
        : (Array.isArray(eventsRes?.data) ? eventsRes.data : globalState.events);
      const finalRepos = isSnapshotError
        ? []
        : (Array.isArray(reposRes?.data) ? reposRes.data : globalState.repos);
      const computedPulse = computeGitHubPulse(finalEvents, finalRepos, syncedTimestamp);

      globalState = {
        user: userRes?.data || globalState.user,
        repos: finalRepos,
        events: finalEvents,
        stats: statsRes || globalState.stats,
        pulse: computedPulse,
        loading: false,
        error: isSnapshotError ? "GitHub repository snapshot status is error" : null,
        syncedAt: syncedTimestamp,
        usingCache: isUsingCache,
        rateLimited: isRateLimited,
        snapshot: snapshot,
        snapshotStatus: snapshotStatus
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

  const pulse = useMemo(() => {
    return computeGitHubPulse(state.events, state.repos, state.syncedAt || Date.now());
  }, [state.events, state.repos, state.syncedAt]);

  const isUnavailable =
    state.snapshotStatus === "error" ||
    state.snapshot?.status === "error" ||
    (!state.loading && state.repos.length === 0);

  return {
    ...state,
    isUnavailable,
    pulse,
    latestRepo,
    latestEvent,
    totalReposCount: state.user?.public_repos ?? state.repos.length,
    refresh
  };
}
