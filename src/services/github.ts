export interface GitHubRepoItem {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  updatedAt: string;
  topics: string[];
}

export interface GitHubRecentCommit {
  repo: string;
  message: string;
  date: string;
  sha: string;
}

export interface GitHubLanguageShare {
  name: string;
  percent: number;
  bytes: number;
  color?: string;
}

export interface GitHubContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface GitHubStatsData {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  commitsThisYear: number;
  totalContributionsThisYear: number;
  currentStreak: number;
  longestStreak: number;
  repositories: GitHubRepoItem[];
  recentCommits: GitHubRecentCommit[];
  languages: GitHubLanguageShare[];
  contributionCalendar: GitHubContributionDay[];
  isLive: boolean;
  lastSynced: string;
  error?: string;
}

// Verified fallback representation based on real data
export const VERIFIED_GITHUB_FALLBACK: GitHubStatsData = {
  username: "codesbysayam",
  name: "Sayam Mukherjee",
  avatarUrl: "https://avatars.githubusercontent.com/u/85777731?v=4",
  bio: "👨‍💻 2nd Year (3rd Sem) B.Tech CSE student at Kalinga Institute of Industrial Technology, Bhubaneswar | Exploring Python, Machine Learning, and Web Development | Building projects and learning by doing",
  publicRepos: 3,
  followers: 0,
  following: 0,
  totalStars: 0,
  totalForks: 0,
  commitsThisYear: 37,
  totalContributionsThisYear: 37,
  currentStreak: 1,
  longestStreak: 2,
  repositories: [
    {
      name: "mausam",
      fullName: "codesbysayam/mausam",
      description: "Weather forecasting and localized climate analytics dashboard for Smart India Hackathon 2026.",
      stars: 0,
      forks: 0,
      language: "TypeScript",
      url: "https://github.com/codesbysayam/mausam",
      updatedAt: "2026-09-01T08:48:46Z",
      topics: ["sih2026", "weather", "forecast", "react", "typescript"]
    },
    {
      name: "Operon",
      fullName: "codesbysayam/Operon",
      description: "Academic systems level project exploring compute workflows and architecture.",
      stars: 0,
      forks: 0,
      language: "TypeScript",
      url: "https://github.com/codesbysayam/Operon",
      updatedAt: "2026-08-30T10:12:00Z",
      topics: ["systems", "architecture", "computational"]
    },
    {
      name: "Sayam-Mukherjee-Portfolio",
      fullName: "codesbysayam/Sayam-Mukherjee-Portfolio",
      description: "Interactive AI-powered portfolio showcasing skills, projects, verified telemetry, and engineering journey.",
      stars: 0,
      forks: 0,
      language: "TypeScript",
      url: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
      updatedAt: "2026-09-03T09:38:46Z",
      topics: ["portfolio", "react", "typescript", "tailwindcss", "vite", "full-stack"]
    }
  ],
  recentCommits: [
    {
      repo: "codesbysayam/mausam",
      message: "feat: update telemetry charts and forecasting visual components",
      date: "2026-09-01T08:48:46Z",
      sha: "3dbbe75"
    },
    {
      repo: "codesbysayam/Sayam-Mukherjee-Portfolio",
      message: "refactor: integrate verified metrics and authentic data structures",
      date: "2026-09-03T09:37:21Z",
      sha: "7a1b4c2"
    }
  ],
  languages: [
    { name: "TypeScript", percent: 85, bytes: 4287547, color: "#3178c6" },
    { name: "JavaScript", percent: 8, bytes: 38506, color: "#f7df1e" },
    { name: "CSS", percent: 5, bytes: 53807, color: "#563d7c" },
    { name: "HTML", percent: 2, bytes: 4373, color: "#e34c26" }
  ],
  contributionCalendar: [],
  isLive: false,
  lastSynced: "Just now"
};

export async function fetchGitHubStats(): Promise<GitHubStatsData> {
  try {
    const res = await fetch("/api/github/profile");
    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn("Error fetching live GitHub data, using verified baseline:", err.message);
    return {
      ...VERIFIED_GITHUB_FALLBACK,
      error: err.message || "Live data unavailable"
    };
  }
}

// ==========================================
// PUBLIC GITHUB REPOSITORIES REST API TYPES & SERVICE
// Endpoint: https://api.github.com/users/codesbysayam/repos?sort=updated&direction=desc&per_page=6
// ==========================================

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  homepage?: string | null;
  topics?: string[];
}

export type GitHubApiRepo = GitHubRepo;

export interface CachedReposData {
  timestamp: number;
  data: GitHubRepo[];
}

export interface GetReposResult {
  repos: GitHubRepo[];
  timestamp: number;
  fromCache: boolean;
  rateLimited?: boolean;
}

export const GITHUB_REPOS_ENDPOINT =
  "https://api.github.com/users/codesbysayam/repos?sort=updated&direction=desc&per_page=6";
export const CACHE_KEY = "sayam-github-repos";
export const CACHE_TTL = 15 * 60 * 1000; // 15 minutes TTL

/**
 * Fetches public repositories for codesbysayam with client-side caching.
 * Caches in localStorage/sessionStorage for 15 minutes to respect GitHub unauthenticated rate limits.
 */
export async function getGitHubRepos(forceRefresh = false): Promise<GetReposResult> {
  let cached: CachedReposData | null = null;
  
  // Safely check storage
  try {
    const raw = typeof window !== "undefined" ? (localStorage.getItem(CACHE_KEY) || sessionStorage.getItem(CACHE_KEY)) : null;
    if (raw) {
      cached = JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Failed to access web storage:", e);
  }

  // Use valid cached data unless forceRefresh is triggered
  if (!forceRefresh && cached && Array.isArray(cached.data) && cached.data.length > 0) {
    const age = Date.now() - cached.timestamp;
    if (age < CACHE_TTL) {
      return {
        repos: cached.data,
        timestamp: cached.timestamp,
        fromCache: true
      };
    }
  }

  try {
    const response = await fetch(GITHUB_REPOS_ENDPOINT, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    // Check for rate limit responses (HTTP 403 or 429)
    if (response.status === 403 || response.status === 429) {
      if (cached && Array.isArray(cached.data) && cached.data.length > 0) {
        return {
          repos: cached.data,
          timestamp: cached.timestamp,
          fromCache: true,
          rateLimited: true
        };
      }
      throw new Error("GitHub rate limit reached. Try again later.");
    }

    if (!response.ok) {
      if (cached && Array.isArray(cached.data) && cached.data.length > 0) {
        return {
          repos: cached.data,
          timestamp: cached.timestamp,
          fromCache: true
        };
      }
      throw new Error("GitHub data is temporarily unavailable.");
    }

    const data: GitHubRepo[] = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid response format from GitHub API");
    }

    // Save to storage
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            data
          })
        );
      }
    } catch (e) {
      console.warn("Could not write to localStorage:", e);
    }

    return {
      repos: data,
      timestamp: Date.now(),
      fromCache: false
    };
  } catch (err: any) {
    // If we have cached repositories, return them with appropriate rate limit flag
    if (cached && Array.isArray(cached.data) && cached.data.length > 0) {
      return {
        repos: cached.data,
        timestamp: cached.timestamp,
        fromCache: true,
        rateLimited: err?.message?.toLowerCase().includes("rate limit")
      };
    }
    throw err;
  }
}

/**
 * Convenience wrapper returning GitHubRepo[] directly, matching the exact contract:
 * getGithubRepos().then(repos => setLatest(repos?.[0] ?? null))
 */
export async function getGithubRepos(force = false): Promise<GitHubRepo[]> {
  const result = await getGitHubRepos(force);
  return result.repos || [];
}

/**
 * Converts a GitHub timestamp to a human-readable relative string.
 * Example: "Updated today", "Updated 2 days ago", "Updated 3 weeks ago"
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "Updated just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `Updated ${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return diffHours === 1 ? "Updated 1 hour ago" : `Updated ${diffHours} hours ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 0) return "Updated today";
    if (diffDays === 1) return "Updated yesterday";
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) {
      return diffWeeks === 1 ? "Updated 1 week ago" : `Updated ${diffWeeks} weeks ago`;
    }
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return diffMonths === 1 ? "Updated 1 month ago" : `Updated ${diffMonths} months ago`;
    }
    const diffYears = Math.floor(diffDays / 365);
    return diffYears === 1 ? "Updated 1 year ago" : `Updated ${diffYears} years ago`;
  } catch {
    return "Recently updated";
  }
}

/**
 * Formats the sync status time for display in the footer.
 */
export function formatSyncAge(timestamp: number, isLive: boolean): string {
  if (isLive) return "Live · synced just now";
  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSeconds < 60) return "Cached · synced just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes === 1) return "Cached · synced 1 min ago";
  if (diffMinutes < 60) return `Cached · synced ${diffMinutes} mins ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  return diffHours === 1 ? "Cached · synced 1 hr ago" : `Cached · synced ${diffHours} hrs ago`;
}

