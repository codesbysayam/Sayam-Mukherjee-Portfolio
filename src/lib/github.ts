/**
 * GitHub Data Utilities, API Client & Normalized Types
 * Source of Truth: Verified local snapshot & server endpoints
 *
 * BROWSER POLICY:
 * The frontend client NEVER directly calls api.github.com.
 * All public telemetry is read from the local snapshot (/data/github.json)
 * and server proxy routes with a strict 5-minute caching window.
 */

import {
  GitHubRepository,
  GitHubUser,
  GitHubActivity,
  GitHubStats,
  GitHubDataSource,
  GitHubTelemetryState,
  isValidRepository,
  isValidGitHubUser,
  isValidGitHubStats,
} from "../data/githubTypes";
import { loadGitHubSnapshot } from "./githubSnapshot";

export const GITHUB_USERNAME = "codesbysayam";
export const GITHUB_API = "https://api.github.com";

/** 5-minute cache TTL in milliseconds */
export const GITHUB_CACHE_DURATION_MS = 5 * 60 * 1000;
const STORAGE_CACHE_KEY = "github_stats_cache_v2";

interface CacheWrapper<T> {
  data: T;
  timestamp: number;
}

// Memory cache singleton
let memoryStatsCache: CacheWrapper<GitHubStats> | null = null;
let activeStatsFetchPromise: Promise<GitHubStats> | null = null;

/**
 * Format timestamps into human-readable relative strings
 */
export function formatRelativeDate(dateString: string | null | undefined): string {
  if (!dateString) return "Date unavailable";
  const timestamp = new Date(dateString).getTime();
  if (Number.isNaN(timestamp)) {
    return "Date unavailable";
  }

  const difference = Date.now() - timestamp;
  const seconds = Math.max(0, Math.floor(difference / 1000));

  if (seconds < 60) {
    return "Updated just now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `Updated ${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Updated ${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `Updated ${days} days ago`;
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export const formatRelativeTime = formatRelativeDate;

/**
 * Reads from localStorage cache if still fresh (< 5 minutes)
 */
function readStorageCache(): GitHubStats | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_CACHE_KEY);
    if (!raw) return null;
    const parsed: CacheWrapper<GitHubStats> = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.timestamp === "number" &&
      Date.now() - parsed.timestamp < GITHUB_CACHE_DURATION_MS &&
      isValidGitHubStats(parsed.data)
    ) {
      return parsed.data;
    }
  } catch {
    // Ignore localStorage parse errors
  }
  return null;
}

/**
 * Writes data into localStorage cache with timestamp
 */
function writeStorageCache(data: GitHubStats): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheWrapper<GitHubStats> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Ignore quota or private browsing storage errors
  }
}

export interface FetchGitHubOptions {
  force?: boolean;
}

/**
 * Authoritative single GitHub data fetcher with 5-minute cache window.
 * Eliminates direct browser calls to api.github.com and permanently prevents rate-limit errors.
 */
export async function fetchGitHubStats(options: FetchGitHubOptions = {}): Promise<GitHubStats> {
  const { force = false } = options;
  const now = Date.now();

  // 1. Check in-memory cache if not forced and within 5-minute window
  if (!force && memoryStatsCache && now - memoryStatsCache.timestamp < GITHUB_CACHE_DURATION_MS) {
    return memoryStatsCache.data;
  }

  // 2. Check localStorage cache if not forced and within 5-minute window
  if (!force) {
    const cached = readStorageCache();
    if (cached) {
      memoryStatsCache = { data: cached, timestamp: now };
      return cached;
    }
  }

  // 3. Deduplicate concurrent fetches
  if (activeStatsFetchPromise) {
    return activeStatsFetchPromise;
  }

  activeStatsFetchPromise = (async () => {
    try {
      const stats = await loadGitHubSnapshot(force);

      // Validate repositories array
      if (!Array.isArray(stats.repositories)) {
        throw new Error("GitHub payload is missing repositories array.");
      }

      // Update in-memory and persistent cache
      memoryStatsCache = {
        data: stats,
        timestamp: Date.now(),
      };
      writeStorageCache(stats);

      return stats;
    } catch (err) {
      // If network failed but we have stale cache, return it rather than crashing
      if (memoryStatsCache?.data) {
        return memoryStatsCache.data;
      }
      const cached = readStorageCache();
      if (cached) {
        return cached;
      }
      throw err;
    } finally {
      activeStatsFetchPromise = null;
    }
  })();

  return activeStatsFetchPromise;
}

/**
 * Fetch all GitHub repositories for codesbysayam with 5-minute cache.
 */
export async function fetchGitHubRepositories(options: FetchGitHubOptions = {}): Promise<GitHubRepository[]> {
  const stats = await fetchGitHubStats(options);
  return stats.repositories.filter(isValidRepository);
}

/**
 * Fetch GitHub user profile for codesbysayam with 5-minute cache.
 */
export async function fetchGitHubUser(options: FetchGitHubOptions = {}): Promise<GitHubUser | null> {
  const stats = await fetchGitHubStats(options);
  const user: GitHubUser = {
    login: stats.username,
    id: 85777731,
    name: stats.name,
    avatar_url: stats.avatarUrl,
    html_url: stats.profileUrl,
    bio: stats.bio,
    public_repos: stats.publicRepos,
    followers: stats.followers,
    following: stats.following,
    public_gists: stats.publicGists,
    created_at: stats.accountCreatedAt || "2021-06-12T04:55:46Z",
    updated_at: stats.fetchedAt,
  };

  return isValidGitHubUser(user) ? user : null;
}

/**
 * Fetch recent public activity for codesbysayam with 5-minute cache.
 */
export async function fetchGitHubEvents(options: FetchGitHubOptions = {}): Promise<GitHubActivity[]> {
  const stats = await fetchGitHubStats(options);
  return Array.isArray(stats.recentActivity) ? stats.recentActivity : [];
}

export { loadGitHubSnapshot };
export type {
  GitHubRepository,
  GitHubUser,
  GitHubActivity,
  GitHubStats,
  GitHubDataSource,
  GitHubTelemetryState,
};
export { isValidRepository, isValidGitHubUser, isValidGitHubStats };
export default fetchGitHubStats;
