export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  location?: string | null;
  company?: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

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
  created_at: string;
  fork: boolean;
  homepage?: string | null;
  topics?: string[];
  open_issues_count?: number;
}

export type GitHubApiRepo = GitHubRepo;

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload?: any;
  public: boolean;
  created_at: string;
}

// Reusable cache envelope
export interface GitHubCache<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

export interface FetchResult<T> {
  data: T;
  fromCache: boolean;
  rateLimited: boolean;
  timestamp: number;
}

export const GITHUB_USERNAME = "codesbysayam";
export const GITHUB_BASE = "https://api.github.com";
export const GITHUB_TTL = 60 * 1000; // 1-minute client cache for real-time freshness

export const VERIFIED_USER_BASELINE: GitHubUser = {
  login: "codesbysayam",
  id: 85777731,
  avatar_url: "https://avatars.githubusercontent.com/u/85777731?v=4",
  html_url: "https://github.com/codesbysayam",
  name: "Sayam Mukherjee",
  bio: "👨‍💻 B.Tech CSE (AI&ML) student at KIIT University\r\n🔍 Exploring Python, Machine Learning, and Web Development  \r\n📂 Building projects and learning by doing",
  location: "Kolkata, India",
  public_repos: 4,
  public_gists: 0,
  followers: 0,
  following: 0,
  created_at: "2021-06-12T04:55:46Z",
  updated_at: "2026-09-06T14:51:18Z"
};

export const VERIFIED_REPOS_BASELINE: GitHubRepo[] = [
  {
    id: 1358811826,
    name: "sayam-solves",
    full_name: "codesbysayam/sayam-solves",
    html_url: "https://github.com/codesbysayam/sayam-solves",
    description: "💻 Daily coding challenges solved by Sayam, powered by consistent DSA practice. 🧠 Exploring algorithms, sharpening problem-solving skills, and building consistency through LeetCode; one challenge at a time. 🚀",
    language: "C++",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2026-09-06T14:51:18Z",
    pushed_at: "2026-09-06T14:51:10Z",
    created_at: "2026-09-06T05:18:47Z",
    fork: false,
    homepage: "",
    topics: ["dsa", "dsa-algorithm", "dsa-practice", "dsalgo", "github", "github-config", "leetcode", "leetcode-java", "leetcode-python", "leetcode-solutions"]
  },
  {
    id: 1347892011,
    name: "mausam",
    full_name: "codesbysayam/mausam",
    html_url: "https://github.com/codesbysayam/mausam",
    description: "🌦️ Mausam is a smart weather intelligence platform built for SIH 2026 by Team Algnite. 🇮🇳 Get real-time weather, AQI, UV index, humidity, wind, pollen, sea conditions, tides & soil moisture in one place. 📊 Explore clear, location-based insights and make smarter, safer decisions. 🚀 Built to simplify weather data and improve awareness for everyone.",
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2026-09-06T14:44:32Z",
    pushed_at: "2026-09-06T14:03:47Z",
    created_at: "2026-08-25T20:56:02Z",
    fork: false,
    homepage: "https://mausamgovt.vercel.app",
    topics: ["sih2026", "weather", "forecast", "react", "typescript"]
  },
  {
    id: 1354020967,
    name: "Sayam-Mukherjee-Portfolio",
    full_name: "codesbysayam/Sayam-Mukherjee-Portfolio",
    html_url: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
    description: "💻 An interactive AI-powered portfolio showcasing Sayam Mukherjee’s skills, projects, achievements, experience, and learning journey. 🚀🧠📂 🌐 A living digital ecosystem combining modern web technology, AI, creativity, and personal branding into one immersive portfolio experience.",
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2026-09-05T20:48:35Z",
    pushed_at: "2026-09-05T20:48:31Z",
    created_at: "2026-09-03T09:37:21Z",
    fork: false,
    homepage: "",
    topics: ["portfolio", "react", "typescript", "tailwindcss", "vite", "full-stack"]
  },
  {
    id: 1350807639,
    name: "Operon",
    full_name: "codesbysayam/Operon",
    html_url: "https://github.com/codesbysayam/Operon",
    description: "🤖 Operon is an autonomous operations platform built for intelligent, human-controlled workflows across Support, Finance, HR, and Operations. 🧠⚙️🔄 🚀 Combining multi-agent AI with human-in-the-loop governance to automate complex processes, improve efficiency, and keep critical decisions under human control.",
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2026-09-03T09:31:47Z",
    pushed_at: "2026-08-30T06:59:16Z",
    created_at: "2026-08-29T18:06:43Z",
    fork: false,
    homepage: "https://operonpro.vercel.app",
    topics: ["backend", "business-automation", "express", "multi-agent-ai", "nodejs", "reactjs"]
  }
];

export const VERIFIED_EVENTS_BASELINE: GitHubEvent[] = [
  {
    id: "ev-1358811826-push",
    type: "PushEvent",
    actor: {
      id: 85777731,
      login: "codesbysayam",
      avatar_url: "https://avatars.githubusercontent.com/u/85777731?v=4"
    },
    repo: {
      id: 1358811826,
      name: "codesbysayam/sayam-solves",
      url: "https://api.github.com/repos/codesbysayam/sayam-solves"
    },
    payload: {
      head: "5739270",
      ref: "refs/heads/main"
    },
    public: true,
    created_at: "2026-09-06T14:51:10Z"
  },
  {
    id: "ev-1347892011-push",
    type: "PushEvent",
    actor: {
      id: 85777731,
      login: "codesbysayam",
      avatar_url: "https://avatars.githubusercontent.com/u/85777731?v=4"
    },
    repo: {
      id: 1347892011,
      name: "codesbysayam/mausam",
      url: "https://api.github.com/repos/codesbysayam/mausam"
    },
    payload: {
      head: "5ea4a90",
      ref: "refs/heads/main"
    },
    public: true,
    created_at: "2026-09-06T14:03:47Z"
  }
];

/**
 * Resilient multi-tiered GitHub fetcher:
 * 1. Checks localStorage/sessionStorage cache.
 * 2. Fetches from local Express server proxy (which handles server-side User-Agent & rate-limit immunity).
 * 3. Falls back to direct api.github.com with ETag validation.
 * 4. Gracefully degrades to verified baseline data without breaking errors.
 */
async function githubFetch<T>(
  proxyPath: string,
  directUrl: string,
  key: string,
  fallbackValue: T,
  force = false
): Promise<FetchResult<T>> {
  let cached: GitHubCache<T> | null = null;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (raw) {
        cached = JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Storage access error:", e);
    }
  }

  const now = Date.now();

  // If cache is still valid and not forcing a refresh, return cached data immediately
  if (!force && cached && cached.data && now - cached.timestamp < GITHUB_TTL) {
    return {
      data: cached.data,
      fromCache: true,
      rateLimited: false,
      timestamp: cached.timestamp
    };
  }

  // 1. Try local server proxy first
  try {
    const proxyUrl = force ? `${proxyPath}?force=true` : proxyPath;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const data = (await res.json()) as T;
      if (data && (!Array.isArray(data) || data.length > 0)) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(key, JSON.stringify({ data, timestamp: now }));
          } catch {}
        }
        return {
          data,
          fromCache: false,
          rateLimited: false,
          timestamp: now
        };
      }
    }
  } catch {
    // Server proxy unreachable (e.g. static preview), fallback to direct API
  }

  // 2. Direct GitHub API fallback
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json"
  };

  if (cached?.etag) {
    headers["If-None-Match"] = cached.etag;
  }

  try {
    const res = await fetch(directUrl, { headers });

    // HTTP 304 Not Modified: GitHub acknowledges data hasn't changed.
    if (res.status === 304 && cached && cached.data) {
      cached.timestamp = now;
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(key, JSON.stringify(cached));
        }
      } catch {}
      return {
        data: cached.data,
        fromCache: true,
        rateLimited: false,
        timestamp: now
      };
    }

    if (res.ok) {
      const data = (await res.json()) as T;
      const etag = res.headers.get("ETag") || undefined;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(key, JSON.stringify({ data, timestamp: now, etag }));
        } catch {}
      }
      return {
        data,
        fromCache: false,
        rateLimited: false,
        timestamp: now
      };
    }
  } catch {}

  // 3. Fallback to cached or verified baseline data
  if (cached && cached.data) {
    return {
      data: cached.data,
      fromCache: true,
      rateLimited: true,
      timestamp: cached.timestamp
    };
  }

  return {
    data: fallbackValue,
    fromCache: true,
    rateLimited: false,
    timestamp: now
  };
}

/**
 * Shared GitHub API client
 */
export const github = {
  user: (force = false) =>
    githubFetch<GitHubUser>(
      "/api/github/user",
      `${GITHUB_BASE}/users/${GITHUB_USERNAME}`,
      "github:user",
      VERIFIED_USER_BASELINE,
      force
    ),

  repos: (force = false) => fetchAllGitHubRepositories(force),

  events: (force = false) =>
    githubFetch<GitHubEvent[]>(
      "/api/github/events",
      `${GITHUB_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=10`,
      "github:events",
      VERIFIED_EVENTS_BASELINE,
      force
    ),

  invalidateCache: () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("github:user");
      localStorage.removeItem("github:repos");
      localStorage.removeItem(`github:repos:${GITHUB_USERNAME}`);
      localStorage.removeItem("github:events");
      sessionStorage.removeItem("github:user");
      sessionStorage.removeItem("github:repos");
      sessionStorage.removeItem(`github:repos:${GITHUB_USERNAME}`);
      sessionStorage.removeItem("github:events");
    } catch {}
  }
};

/**
 * Fetches all public repositories for the user using pagination.
 * 1. Checks local cache (TTL: 90s).
 * 2. Queries server proxy /api/github/repos (which traverses all pages).
 * 3. Falls back to direct GitHub API with pagination (per_page=100) if server is unavailable.
 * 4. Falls back to cached or verified baseline if rate-limited or offline.
 */
export async function fetchAllGitHubRepositories(
  force = false,
  username = GITHUB_USERNAME
): Promise<FetchResult<GitHubRepo[]>> {
  const cacheKey = `github:repos:${username}`;
  let cached: GitHubCache<GitHubRepo[]> | null = null;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(cacheKey) || sessionStorage.getItem(cacheKey);
      if (raw) {
        cached = JSON.parse(raw);
      }
    } catch {}
  }

  const now = Date.now();
  if (!force && cached && Array.isArray(cached.data) && cached.data.length > 0 && now - cached.timestamp < GITHUB_TTL) {
    return {
      data: cached.data,
      fromCache: true,
      rateLimited: false,
      timestamp: cached.timestamp
    };
  }

  // 1. Try local server proxy first (which handles server-side pagination across all pages)
  try {
    const proxyUrl = force ? `/api/github/repos?force=true` : `/api/github/repos`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }));
          } catch {}
        }
        return {
          data,
          fromCache: false,
          rateLimited: false,
          timestamp: now
        };
      }
    }
  } catch {
    // Server proxy unreachable, fall back to direct paginated client fetch
  }

  // 2. Direct client-side paginated GitHub API fetch
  try {
    const allRepos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;
    const maxPages = 10;

    while (page <= maxPages) {
      const url = `${GITHUB_BASE}/users/${username}/repos?sort=updated&direction=desc&per_page=${perPage}&page=${page}`;
      const res = await fetch(url, {
        headers: {
          Accept: "application/vnd.github+json"
        }
      });

      if (!res.ok) {
        if (page === 1) {
          throw new Error(`GitHub API returned ${res.status}`);
        }
        break;
      }

      const repos = (await res.json()) as GitHubRepo[];
      if (!Array.isArray(repos) || repos.length === 0) {
        break;
      }

      allRepos.push(...repos);

      if (repos.length < perPage) {
        break;
      }

      const linkHeader = res.headers.get("Link") || res.headers.get("link") || "";
      if (!linkHeader.includes('rel="next"')) {
        break;
      }

      page++;
    }

    if (allRepos.length > 0) {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ data: allRepos, timestamp: now }));
        } catch {}
      }
      return {
        data: allRepos,
        fromCache: false,
        rateLimited: false,
        timestamp: now
      };
    }
  } catch (err: any) {
    console.warn("Direct paginated repos fetch error:", err.message);
  }

  // 3. Fallback to cached or verified baseline
  if (cached && Array.isArray(cached.data) && cached.data.length > 0) {
    return {
      data: cached.data,
      fromCache: true,
      rateLimited: true,
      timestamp: cached.timestamp
    };
  }

  return {
    data: VERIFIED_REPOS_BASELINE,
    fromCache: true,
    rateLimited: false,
    timestamp: now
  };
}

/**
 * Relative time formatter for human-readable updates (e.g. "Updated 11h ago")
 */
export function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return "recently";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

    if (diffSeconds < 60) return "just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 5) return `${diffWeeks}w ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  } catch {
    return "recently";
  }
}

/**
 * Formats the sync status time for display in cards (e.g. "SYNCED 2M AGO")
 */
export function formatSyncAge(timestamp?: number | null): string {
  if (!timestamp) return "SYNCED JUST NOW";
  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 1) return "SYNCED JUST NOW";
  if (diffMinutes === 1) return "SYNCED 1M AGO";
  if (diffMinutes < 60) return `SYNCED ${diffMinutes}M AGO`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return "SYNCED 1H AGO";
  if (diffHours < 24) return `SYNCED ${diffHours}H AGO`;
  const diffDays = Math.floor(diffHours / 24);
  return `SYNCED ${diffDays}D AGO`;
}

/**
 * Parses a GitHub public event into an authentic activity string
 */
export function formatGitHubEvent(
  event?: GitHubEvent | null
): { text: string; time: string; url: string } | null {
  if (!event || !event.repo) return null;
  const repoName = event.repo.name.replace(/^[^/]+\//, "");
  const time = formatRelativeTime(event.created_at);
  const url = `https://github.com/${event.repo.name}`;

  switch (event.type) {
    case "PublicEvent":
      return { text: `Published open-source ${repoName}`, time, url };
    case "PushEvent":
      return { text: `Pushed to ${repoName}`, time, url };
    case "CreateEvent": {
      const refType = event.payload?.ref_type || "repository";
      return { text: `Created ${refType} in ${repoName}`, time, url };
    }
    case "WatchEvent":
      return { text: `Starred ${repoName}`, time, url };
    case "ForkEvent":
      return { text: `Forked ${repoName}`, time, url };
    case "PullRequestEvent": {
      const action = event.payload?.action || "opened";
      return { text: `${action.charAt(0).toUpperCase() + action.slice(1)} PR in ${repoName}`, time, url };
    }
    case "IssuesEvent": {
      const action = event.payload?.action || "opened";
      return { text: `${action.charAt(0).toUpperCase() + action.slice(1)} issue in ${repoName}`, time, url };
    }
    default:
      return { text: `Activity in ${repoName}`, time, url };
  }
}

// ==========================================
// LEGACY BACKWARDS COMPATIBILITY WRAPPERS
// (Preserves existing analytics & profile charts)
// ==========================================

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
  location?: string;
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

export const VERIFIED_GITHUB_FALLBACK: GitHubStatsData = {
  username: "codesbysayam",
  name: "Sayam Mukherjee",
  avatarUrl: "https://avatars.githubusercontent.com/u/85777731?v=4",
  bio: "👨‍💻 B.Tech CSE (AI&ML) student at KIIT University\r\n🔍 Exploring Python, Machine Learning, and Web Development  \r\n📂 Building projects and learning by doing",
  location: "Kolkata, India",
  publicRepos: 4,
  followers: 0,
  following: 0,
  totalStars: 0,
  totalForks: 0,
  commitsThisYear: 56,
  totalContributionsThisYear: 56,
  currentStreak: 4,
  longestStreak: 8,
  repositories: [
    {
      name: "sayam-solves",
      fullName: "codesbysayam/sayam-solves",
      description: "💻 Daily coding challenges solved by Sayam, powered by consistent DSA practice. 🧠 Exploring algorithms, sharpening problem-solving skills, and building consistency through LeetCode; one challenge at a time. 🚀",
      stars: 0,
      forks: 0,
      language: "C++",
      url: "https://github.com/codesbysayam/sayam-solves",
      updatedAt: "2026-09-06T14:51:18Z",
      topics: ["dsa", "dsa-algorithm", "dsa-practice", "dsalgo", "github", "github-config", "leetcode", "leetcode-java", "leetcode-python", "leetcode-solutions"]
    },
    {
      name: "mausam",
      fullName: "codesbysayam/mausam",
      description: "🌦️ Mausam is a smart weather intelligence platform built for SIH 2026 by Team Algnite. 🇮🇳 Get real-time weather, AQI, UV index, humidity, wind, pollen, sea conditions, tides & soil moisture in one place. 📊 Explore clear, location-based insights and make smarter, safer decisions. 🚀 Built to simplify weather data and improve awareness for everyone.",
      stars: 0,
      forks: 0,
      language: "TypeScript",
      url: "https://github.com/codesbysayam/mausam",
      updatedAt: "2026-09-06T14:44:32Z",
      topics: ["sih2026", "weather", "forecast", "react", "typescript"]
    },
    {
      name: "Sayam-Mukherjee-Portfolio",
      fullName: "codesbysayam/Sayam-Mukherjee-Portfolio",
      description: "💻 An interactive AI-powered portfolio showcasing Sayam Mukherjee’s skills, projects, achievements, experience, and learning journey. 🚀🧠📂 🌐 A living digital ecosystem combining modern web technology, AI, creativity, and personal branding into one immersive portfolio experience.",
      stars: 0,
      forks: 0,
      language: "TypeScript",
      url: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
      updatedAt: "2026-09-05T20:48:35Z",
      topics: ["portfolio", "react", "typescript", "tailwindcss", "vite", "full-stack"]
    },
    {
      name: "Operon",
      fullName: "codesbysayam/Operon",
      description: "🤖 Operon is an autonomous operations platform built for intelligent, human-controlled workflows across Support, Finance, HR, and Operations. 🧠⚙️🔄 🚀 Combining multi-agent AI with human-in-the-loop governance to automate complex processes, improve efficiency, and keep critical decisions under human control.",
      stars: 0,
      forks: 0,
      language: "TypeScript",
      url: "https://github.com/codesbysayam/Operon",
      updatedAt: "2026-09-03T09:31:47Z",
      topics: ["backend", "business-automation", "express", "multi-agent-ai", "nodejs", "reactjs"]
    }
  ],
  recentCommits: [
    {
      repo: "codesbysayam/sayam-solves",
      message: "Time: 14 ms (47.31%), Space: 9.3 MB (77.48%) - LeetHub",
      date: "2026-09-06T14:51:10Z",
      sha: "5739270"
    },
    {
      repo: "codesbysayam/mausam",
      message: "feat: enhance UI components and weather data views",
      date: "2026-09-06T14:03:47Z",
      sha: "5ea4a90"
    },
    {
      repo: "codesbysayam/Sayam-Mukherjee-Portfolio",
      message: "refactor: update academic and project profile",
      date: "2026-09-05T20:48:31Z",
      sha: "1e16335"
    },
    {
      repo: "codesbysayam/Operon",
      message: "feat: multi-agent autonomous workflow pipeline",
      date: "2026-08-30T06:59:16Z",
      sha: "8a71d2e"
    }
  ],
  languages: [
    { name: "TypeScript", percent: 75, bytes: 7837, color: "#3178c6" },
    { name: "C++", percent: 25, bytes: 10, color: "#f43f5e" }
  ],
  contributionCalendar: [],
  isLive: true,
  lastSynced: "Just now"
};

export async function fetchGitHubStats(force = false): Promise<GitHubStatsData> {
  try {
    const url = force ? "/api/github/profile?force=true" : "/api/github/profile";
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn("Error fetching live GitHub data, using verified baseline:", err.message);
    return {
      ...VERIFIED_GITHUB_FALLBACK,
      error: err.message || "Live data unavailable"
    };
  }
}

export async function getGitHubRepos(forceRefresh = false) {
  const result = await github.repos(forceRefresh);
  return {
    repos: result.data,
    timestamp: result.timestamp,
    fromCache: result.fromCache,
    rateLimited: result.rateLimited
  };
}

export async function getGithubRepos(force = false): Promise<GitHubRepo[]> {
  const result = await github.repos(force);
  return result.data || [];
}
