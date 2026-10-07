import { GitHubStats } from "../data/githubTypes";

export const GITHUB_CACHE_STORAGE_KEY = "sayam_github_telemetry_cache_v3";
export const GITHUB_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export interface CachedGitHubEnvelope {
  timestamp: number;
  stats: GitHubStats;
  rateLimit?: {
    remaining: number;
    reset: number;
  };
}

// In-memory fallback if localStorage/sessionStorage is blocked in iframe sandbox
let memoryCache: CachedGitHubEnvelope | null = null;

function getStorage(): Storage | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      // Test read/write to ensure not blocked by browser security
      const testKey = "__gh_cache_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch {
    // Storage blocked (e.g. sandboxed iframe without allow-same-origin)
  }
  return null;
}

/**
 * Check whether a timestamp exceeds the given TTL in milliseconds
 */
export function isCacheStale(timestamp: number, ttlMs = GITHUB_CACHE_TTL_MS): boolean {
  return Date.now() - timestamp > ttlMs;
}

/**
 * Retrieve cached GitHub stats, optionally accepting stale entries
 */
export function getCachedStats(
  allowStale = false,
  ttlMs = GITHUB_CACHE_TTL_MS
): { stats: GitHubStats; timestamp: number; isStale: boolean } | null {
  try {
    const storage = getStorage();
    let raw = storage ? storage.getItem(GITHUB_CACHE_STORAGE_KEY) : null;
    let envelope: CachedGitHubEnvelope | null = null;

    if (raw) {
      envelope = JSON.parse(raw) as CachedGitHubEnvelope;
    } else if (memoryCache) {
      envelope = memoryCache;
    }

    if (!envelope || !envelope.stats) {
      return null;
    }

    const stale = isCacheStale(envelope.timestamp, ttlMs);
    if (stale && !allowStale) {
      return null;
    }

    return {
      stats: envelope.stats,
      timestamp: envelope.timestamp,
      isStale: stale,
    };
  } catch (err) {
    console.warn("[githubCache] Failed to read cache:", err);
    if (memoryCache) {
      const stale = isCacheStale(memoryCache.timestamp, ttlMs);
      if (!stale || allowStale) {
        return {
          stats: memoryCache.stats,
          timestamp: memoryCache.timestamp,
          isStale: stale,
        };
      }
    }
    return null;
  }
}

/**
 * Store fresh GitHub stats into cache
 */
export function setCachedStats(
  stats: GitHubStats,
  rateLimit?: { remaining: number; reset: number }
): void {
  try {
    const envelope: CachedGitHubEnvelope = {
      timestamp: Date.now(),
      stats,
      rateLimit,
    };
    memoryCache = envelope;

    const storage = getStorage();
    if (storage) {
      storage.setItem(GITHUB_CACHE_STORAGE_KEY, JSON.stringify(envelope));
    }
  } catch (err) {
    console.warn("[githubCache] Failed to write cache:", err);
  }
}

/**
 * Clear the local cache
 */
export function clearCachedStats(): void {
  try {
    memoryCache = null;
    const storage = getStorage();
    if (storage) {
      storage.removeItem(GITHUB_CACHE_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

/**
 * Human-readable relative time formatting (e.g., "just now", "2m ago", "1h ago")
 */
export function formatRelativeTime(dateInput: string | number | Date): string {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "recently";

    const diffMs = Date.now() - date.getTime();
    if (diffMs < 0) return "just now";

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 45) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "recently";
  }
}
