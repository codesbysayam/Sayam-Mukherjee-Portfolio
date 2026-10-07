/**
 * Real GitHub Telemetry & Repository Type Definitions
 * Source of Truth: GitHub REST API (https://api.github.com) and GitHub Actions GraphQL sync
 */

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  fork: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  topics?: string[];

  // Compatibility aliases
  fullName?: string;
  url?: string;
  stars?: number;
  forks?: number;
  watchers?: number;
  isFork?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  pushedAt?: string | null;
}

export interface GitHubUser {
  login: string;
  id: number;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location?: string | null;
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubActivity {
  id: string;
  type: string;
  createdAt: string;
  created_at?: string;
  repoName: string | null;
  repo?: {
    id?: number;
    name: string;
    url?: string;
  };
  public: boolean;
  actionLabel?: string;
  details?: string;
}

export interface GitHubContributionDay {
  date: string;
  count: number;
  color: string;
}

export interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

export interface GitHubStats {
  username: string;
  profileUrl: string;
  avatarUrl: string;
  name: string | null;
  bio: string | null;

  publicRepos: number;
  followers: number;
  following: number;
  publicGists: number;

  accountCreatedAt?: string;

  totalStars: number;
  totalForks: number;

  repositories: GitHubRepository[];

  languageCounts: Record<string, number>;
  languageBytes?: Record<string, number>;

  latestPush: string | null;

  recentActivity: GitHubActivity[];

  contributionCalendar?: {
    totalContributions: number;
    weeks: GitHubContributionWeek[];
  } | null;

  fetchedAt: string;
  source: "live" | "snapshot" | "cached" | "github-actions" | "unavailable";
}

export type GitHubDataSource = "live" | "cached" | "snapshot" | "github-actions" | "unavailable";

export interface GitHubTelemetryState {
  data: GitHubStats | null;
  stats: GitHubStats | null;
  source: GitHubDataSource;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  rateLimitRemaining: number | null;
  rateLimitReset: string | null;
  lastUpdated: string | null;
  refresh: (manual?: boolean) => Promise<void>;
}

export function isValidRepository(value: unknown): value is GitHubRepository {
  if (!value || typeof value !== "object") {
    return false;
  }
  const repo = value as Record<string, unknown>;
  return (
    typeof repo.id === "number" &&
    typeof repo.name === "string" &&
    (typeof repo.full_name === "string" || typeof repo.fullName === "string") &&
    (typeof repo.html_url === "string" || typeof repo.url === "string") &&
    (typeof repo.stargazers_count === "number" || typeof repo.stars === "number") &&
    (typeof repo.forks_count === "number" || typeof repo.forks === "number")
  );
}

export function isValidGitHubUser(value: unknown): value is GitHubUser {
  if (!value || typeof value !== "object") {
    return false;
  }
  const user = value as Record<string, unknown>;
  return (
    typeof user.login === "string" &&
    user.login.trim().length > 0 &&
    typeof user.html_url === "string" &&
    typeof user.avatar_url === "string" &&
    typeof user.public_repos === "number"
  );
}

export function isValidGitHubStats(value: unknown): value is GitHubStats {
  if (!value || typeof value !== "object") {
    return false;
  }
  const data = value as Record<string, unknown>;
  const profile = data.profile && typeof data.profile === "object" ? (data.profile as Record<string, unknown>) : null;
  const username = data.username || data.owner || profile?.login;
  const repos = data.repositories;
  return (
    typeof username === "string" &&
    username.trim().length > 0 &&
    Array.isArray(repos)
  );
}
