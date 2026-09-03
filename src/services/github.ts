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
  bio: "👨‍💻 B.Tech CSE student at Techno Main Salt Lake (TMSL) | Exploring Python, Machine Learning, and Web Development | Building projects and learning by doing",
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
