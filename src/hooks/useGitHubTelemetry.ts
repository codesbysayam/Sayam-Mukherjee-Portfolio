import { useCallback, useEffect, useState } from "react";
import {
  fetchCanonicalGitHubTelemetry,
  GitHubTelemetry,
  TELEMETRY_CLIENT_CACHE_TTL_MS,
} from "../services/githubTelemetry";

let sharedTelemetry: GitHubTelemetry | null = null;
let sharedLoading = true;
let sharedRefreshing = false;
let sharedError: string | null = null;
let lastFetchedMs = 0;

const subscribers = new Set<() => void>();

function notifyAll() {
  subscribers.forEach((cb) => {
    try {
      cb();
    } catch {
      // Ignore individual subscriber render errors
    }
  });
}

async function loadTelemetry(force = false): Promise<GitHubTelemetry | null> {
  const now = Date.now();
  if (!force && sharedTelemetry && now - lastFetchedMs < TELEMETRY_CLIENT_CACHE_TTL_MS) {
    return sharedTelemetry;
  }

  if (sharedTelemetry) {
    sharedRefreshing = true;
  } else {
    sharedLoading = true;
  }
  sharedError = null;
  notifyAll();

  try {
    const data = await fetchCanonicalGitHubTelemetry(force);
    sharedTelemetry = data;
    lastFetchedMs = Date.now();
    sharedLoading = false;
    sharedRefreshing = false;
    sharedError = data.status === "error" ? data.errorMessage || "Telemetry unavailable." : null;
    notifyAll();
    return data;
  } catch (err: any) {
    sharedLoading = false;
    sharedRefreshing = false;
    sharedError = err?.message || "Failed to load GitHub telemetry.";
    notifyAll();
    return sharedTelemetry;
  }
}

export interface UseGitHubTelemetryResult {
  telemetry: GitHubTelemetry | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useGitHubTelemetry(): UseGitHubTelemetryResult {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((n) => (n + 1) % 100000);
    subscribers.add(listener);

    const isStale =
      !sharedTelemetry || Date.now() - lastFetchedMs >= TELEMETRY_CLIENT_CACHE_TTL_MS;
    if (isStale) {
      void loadTelemetry(false);
    } else if (sharedLoading) {
      sharedLoading = false;
    }

    return () => {
      subscribers.delete(listener);
    };
  }, []);

  const refresh = useCallback(async () => {
    await loadTelemetry(true);
  }, []);

  return {
    telemetry: sharedTelemetry,
    loading: sharedLoading && !sharedTelemetry,
    refreshing: sharedRefreshing,
    error: sharedError,
    refresh,
  };
}

export default useGitHubTelemetry;
