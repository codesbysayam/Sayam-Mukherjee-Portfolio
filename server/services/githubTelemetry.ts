import fs from "fs";
import path from "path";

export const DEFAULT_GITHUB_USERNAME = "codesbysayam";
export const TELEMETRY_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
export const MANUAL_REFRESH_COOLDOWN_MS = 30 * 1000; // 30 seconds
const GITHUB_API_TIMEOUT_MS = 8000;
const LANGUAGE_FETCH_CONCURRENCY = 4;

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  url: string;
  homepage: string;
  description: string | null;
  stars: number;
  forks: number;
  watchers: number;
  sizeKB: number;
  codeBytes: number;
  language: string | null;
  languages: Record<string, number>;
  updatedAt: string;
  pushedAt: string;
  createdAt: string;
  defaultBranch: string;
  isFork: boolean;
  isArchived: boolean;
  topics: string[];
  languageFetchStatus: "ok" | "failed" | "skipped";
}

export interface LanguageMetric {
  name: string;
  bytes: number;
  percentage: number;
  formattedPercentage: string;
  repoCount: number;
  repos: string[];
  color: string;
}

export interface RepositoryMetric {
  id: number;
  name: string;
  fullName: string;
  url: string;
  homepage: string;
  stars: number;
  forks: number;
  sizeKB: number;
  codeBytes: number;
  language: string | null;
  languages: Record<string, number>;
  updatedAt: string;
  pushedAt: string;
  defaultBranch: string;
  isFork: boolean;
  isArchived: boolean;
}

export interface TelemetryFilteringPolicy {
  includeForksInRepoList: boolean;
  includeArchivedInRepoList: boolean;
  excludeForksFromLanguageBytes: boolean;
  excludeArchivedFromLanguageBytes: boolean;
  description: string;
}

export interface GitHubTelemetry {
  username: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
  bio: string;
  totalRepos: number;
  ownedReposCount: number;
  forkedReposCount: number;
  archivedReposCount: number;
  activeReposCount: number;
  totalStars: number;
  totalForks: number;
  totalCodeBytes: number;
  totalRepoSizeKB: number;
  generatedAt: string;
  status: "success" | "partial" | "error";
  source: "github-api" | "snapshot-fallback";
  failedLanguageRepos: string[];
  errorMessage?: string;
  filteringPolicy: TelemetryFilteringPolicy;
  languages: LanguageMetric[];
  repositories: RepositoryMetric[];
}

export const LANGUAGE_PALETTE: Record<string, string> = {
  TypeScript: "#69734A",
  Python: "#3E4A35",
  CSS: "#8D947E",
  JavaScript: "#A9C52F",
  HTML: "#585B52",
  C: "#777A70",
  "Jupyter Notebook": "#B5B8AA",
  PLpgSQL: "#4D5E10",
  Makefile: "#51564A",
  "C++": "#C7E34A",
  Dockerfile: "#41483B",
  Shell: "#8EA82A",
};

export function formatPercentage(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0%";
  if (value < 0.01) return "<0.01%";
  if (value < 0.1) return `${Number(value.toFixed(2))}%`;
  return `${value.toFixed(1)}%`;
}

export function formatBytesCompact(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function extractNextLink(linkHeader: string | null): string | null {
  if (!linkHeader) return null;
  const parts = linkHeader.split(",");
  for (const part of parts) {
    const match = part.match(/<([^>]+)>;\s*rel="next"/);
    if (match && match[1]) {
      try {
        const parsed = new URL(match[1]);
        if (parsed.protocol === "https:" && parsed.hostname === "api.github.com") {
          return parsed.toString();
        }
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function aggregateLanguages(
  repositories: Array<{
    name: string;
    isFork?: boolean;
    isArchived?: boolean;
    languages?: Record<string, number>;
  }>,
  options: { excludeForks?: boolean; excludeArchived?: boolean } = {}
): { languages: LanguageMetric[]; totalCodeBytes: number } {
  const { excludeForks = true, excludeArchived = false } = options;
  const byteTotals = new Map<string, number>();
  const repoSets = new Map<string, Set<string>>();

  for (const repo of repositories) {
    if (excludeForks && repo.isFork) continue;
    if (excludeArchived && repo.isArchived) continue;
    const langMap = repo.languages || {};
    for (const [lang, rawBytes] of Object.entries(langMap)) {
      if (typeof rawBytes !== "number" || !Number.isFinite(rawBytes) || rawBytes <= 0) {
        continue;
      }
      byteTotals.set(lang, (byteTotals.get(lang) || 0) + rawBytes);
      if (!repoSets.has(lang)) {
        repoSets.set(lang, new Set<string>());
      }
      repoSets.get(lang)!.add(repo.name);
    }
  }

  let totalCodeBytes = 0;
  for (const bytes of byteTotals.values()) {
    totalCodeBytes += bytes;
  }

  const languages: LanguageMetric[] = Array.from(byteTotals.entries())
    .map(([name, bytes]) => {
      const percentage = totalCodeBytes > 0 ? (bytes / totalCodeBytes) * 100 : 0;
      const repos = Array.from(repoSets.get(name) || []);
      return {
        name,
        bytes,
        percentage,
        formattedPercentage: formatPercentage(percentage),
        repoCount: repos.length,
        repos,
        color: LANGUAGE_PALETTE[name] || "#69734A",
      };
    })
    .sort((a, b) => b.bytes - a.bytes);

  return { languages, totalCodeBytes };
}

async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function next() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]);
    }
  }

  const workerCount = Math.min(limit, Math.max(1, items.length));
  await Promise.all(Array.from({ length: workerCount }, () => next()));
  return results;
}

function getGitHubHeaders(): Record<string, string> {
  const token = (process.env.GITHUB_TOKEN || "").trim();
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "sayam-mukherjee-portfolio-telemetry",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function assertGitHubApiUrl(rawUrl: string): URL {
  const parsed = new URL(rawUrl);
  if (parsed.protocol !== "https:" || parsed.hostname !== "api.github.com") {
    throw new Error(`Disallowed telemetry host: ${parsed.hostname}`);
  }
  return parsed;
}

async function fetchGitHubJson<T>(url: string): Promise<{ data: T; linkHeader: string | null }> {
  const safeUrl = assertGitHubApiUrl(url);
  const res = await fetch(safeUrl.toString(), {
    headers: getGitHubHeaders(),
    signal: AbortSignal.timeout(GITHUB_API_TIMEOUT_MS),
  });

  const remaining = res.headers.get("x-ratelimit-remaining");
  if (res.status === 403 || res.status === 429 || (remaining !== null && Number(remaining) === 0)) {
    const resetHeader = res.headers.get("x-ratelimit-reset");
    const resetIso = resetHeader ? new Date(Number(resetHeader) * 1000).toISOString() : "";
    throw new Error(
      `GitHub API rate limit exceeded (${res.status})${resetIso ? `; resets at ${resetIso}` : ""}`
    );
  }

  if (!res.ok) {
    throw new Error(`GitHub API request failed [${res.status}]`);
  }

  const data = (await res.json()) as T;
  return {
    data,
    linkHeader: res.headers.get("link"),
  };
}

export function buildTelemetryFromSnapshot(
  rawSnapshot: any,
  options: {
    status?: "success" | "partial" | "error";
    source?: "github-api" | "snapshot-fallback";
    failedLanguageRepos?: string[];
    errorMessage?: string;
  } = {}
): GitHubTelemetry {
  const reposRaw = Array.isArray(rawSnapshot?.repositories) ? rawSnapshot.repositories : [];
  const rawLanguagesMap: Record<string, Record<string, number>> =
    rawSnapshot?.languages && typeof rawSnapshot.languages === "object"
      ? rawSnapshot.languages
      : {};

  const normalizedRepos: GitHubRepository[] = reposRaw.map((r: any) => {
    const fullName = r.full_name || r.fullName || `${DEFAULT_GITHUB_USERNAME}/${r.name}`;
    const repoLangMap =
      rawLanguagesMap[fullName] ||
      rawLanguagesMap[r.name] ||
      (r.languages && typeof r.languages === "object" ? r.languages : {}) ||
      {};

    const codeBytes: number = Object.values(repoLangMap).reduce<number>(
      (sum, val) =>
        sum + (typeof val === "number" && Number.isFinite(val) && val > 0 ? val : 0),
      0
    );

    const sizeKB =
      typeof r.size === "number" && Number.isFinite(r.size)
        ? r.size
        : typeof r.sizeKB === "number" && Number.isFinite(r.sizeKB)
          ? r.sizeKB
          : Math.round(codeBytes / 1024);

    return {
      id: Number(r.id) || 0,
      name: String(r.name || ""),
      fullName,
      url: String(r.html_url || r.url || `https://github.com/${fullName}`),
      homepage: String(r.homepage || ""),
      description: r.description ?? null,
      stars: typeof r.stargazers_count === "number" ? r.stargazers_count : Number(r.stars || 0),
      forks: typeof r.forks_count === "number" ? r.forks_count : Number(r.forks || 0),
      watchers: typeof r.watchers_count === "number" ? r.watchers_count : Number(r.watchers || 0),
      sizeKB,
      codeBytes,
      language: r.language || null,
      languages: repoLangMap,
      updatedAt: String(r.updated_at || r.updatedAt || ""),
      pushedAt: String(r.pushed_at || r.pushedAt || r.updated_at || r.updatedAt || ""),
      createdAt: String(r.created_at || r.createdAt || ""),
      defaultBranch: String(r.default_branch || r.defaultBranch || "main"),
      isFork: Boolean(r.fork ?? r.isFork),
      isArchived: Boolean(r.archived ?? r.isArchived),
      topics: Array.isArray(r.topics) ? r.topics : [],
      languageFetchStatus: "ok",
    };
  });

  const { languages, totalCodeBytes } = aggregateLanguages(normalizedRepos, {
    excludeForks: true,
    excludeArchived: false,
  });

  const ownedReposCount = normalizedRepos.filter((r) => !r.isFork).length;
  const forkedReposCount = normalizedRepos.filter((r) => r.isFork).length;
  const archivedReposCount = normalizedRepos.filter((r) => r.isArchived).length;
  const activeReposCount = normalizedRepos.filter((r) => !r.isArchived).length;

  const totalStars = normalizedRepos.reduce((sum, r) => sum + r.stars, 0);
  const totalForks = normalizedRepos.reduce((sum, r) => sum + r.forks, 0);
  const totalRepoSizeKB = normalizedRepos.reduce((sum, r) => sum + r.sizeKB, 0);

  const profile = rawSnapshot?.profile || {};
  const failedRepos = options.failedLanguageRepos || [];

  return {
    username: String(rawSnapshot?.username || profile.login || DEFAULT_GITHUB_USERNAME),
    name: String(rawSnapshot?.name || profile.name || "Sayam Mukherjee"),
    avatarUrl: String(
      rawSnapshot?.avatarUrl ||
        profile.avatar_url ||
        "https://avatars.githubusercontent.com/u/85777731?v=4"
    ),
    profileUrl: String(
      rawSnapshot?.profileUrl || profile.html_url || `https://github.com/${DEFAULT_GITHUB_USERNAME}`
    ),
    bio: String(rawSnapshot?.bio || profile.bio || ""),
    totalRepos: normalizedRepos.length,
    ownedReposCount,
    forkedReposCount,
    archivedReposCount,
    activeReposCount,
    totalStars,
    totalForks,
    totalCodeBytes,
    totalRepoSizeKB,
    generatedAt: String(
      rawSnapshot?.syncedAt || rawSnapshot?.fetchedAt || new Date().toISOString()
    ),
    status: options.status || (failedRepos.length > 0 ? "partial" : "success"),
    source: options.source || "snapshot-fallback",
    failedLanguageRepos: failedRepos,
    ...(options.errorMessage ? { errorMessage: options.errorMessage } : {}),
    filteringPolicy: {
      includeForksInRepoList: true,
      includeArchivedInRepoList: true,
      excludeForksFromLanguageBytes: true,
      excludeArchivedFromLanguageBytes: false,
      description:
        "All public repositories appear in Repository Activity. Language composition aggregates source bytes across owned non-fork repositories.",
    },
    languages,
    repositories: normalizedRepos.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.fullName,
      url: r.url,
      homepage: r.homepage,
      stars: r.stars,
      forks: r.forks,
      sizeKB: r.sizeKB,
      codeBytes: r.codeBytes,
      language: r.language,
      languages: r.languages,
      updatedAt: r.updatedAt,
      pushedAt: r.pushedAt,
      defaultBranch: r.defaultBranch,
      isFork: r.isFork,
      isArchived: r.isArchived,
    })),
  };
}

export function readLocalSnapshotJson(): any | null {
  const candidates = [
    path.join(process.cwd(), "public", "data", "github.json"),
    path.join(process.cwd(), "dist", "data", "github.json"),
    path.join(process.cwd(), "public", "github-data.json"),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        return JSON.parse(fs.readFileSync(candidate, "utf-8"));
      }
    } catch {
      // Try next path
    }
  }
  return null;
}

export async function fetchLiveGitHubTelemetry(
  username = DEFAULT_GITHUB_USERNAME
): Promise<GitHubTelemetry> {
  const safeUser = encodeURIComponent(username);
  const allRawRepos: any[] = [];
  let nextUrl: string | null =
    `https://api.github.com/users/${safeUser}/repos?per_page=100&page=1&type=all&sort=updated`;
  let pageCount = 0;

  while (nextUrl && pageCount < 10) {
    const { data, linkHeader } = await fetchGitHubJson<any[]>(nextUrl);
    if (!Array.isArray(data)) {
      throw new Error("Unexpected non-array repository response from GitHub API");
    }
    allRawRepos.push(...data);
    nextUrl = extractNextLink(linkHeader);
    pageCount += 1;
  }

  let profileData: any = null;
  try {
    const userRes = await fetchGitHubJson<any>(`https://api.github.com/users/${safeUser}`);
    profileData = userRes.data;
  } catch {
    profileData = null;
  }

  const failedLanguageRepos: string[] = [];

  const enrichedRepos = await runWithConcurrency(
    allRawRepos,
    LANGUAGE_FETCH_CONCURRENCY,
    async (repo): Promise<GitHubRepository> => {
      const fullName = String(repo.full_name || `${username}/${repo.name}`);
      const isFork = Boolean(repo.fork);
      const isArchived = Boolean(repo.archived);
      let repoLangMap: Record<string, number> = {};
      let languageFetchStatus: "ok" | "failed" | "skipped" = "ok";

      if (isFork) {
        languageFetchStatus = "skipped";
      } else if (typeof repo.languages_url === "string" && repo.languages_url) {
        try {
          const langRes = await fetchGitHubJson<Record<string, number>>(repo.languages_url);
          repoLangMap = langRes.data || {};
        } catch {
          languageFetchStatus = "failed";
          failedLanguageRepos.push(fullName);
        }
      }

      const codeBytes = Object.values(repoLangMap).reduce(
        (sum, val) => sum + (typeof val === "number" && Number.isFinite(val) && val > 0 ? val : 0),
        0
      );

      return {
        id: Number(repo.id) || 0,
        name: String(repo.name || ""),
        fullName,
        url: String(repo.html_url || `https://github.com/${fullName}`),
        homepage: String(repo.homepage || ""),
        description: repo.description ?? null,
        stars: Number(repo.stargazers_count || 0),
        forks: Number(repo.forks_count || 0),
        watchers: Number(repo.watchers_count || 0),
        sizeKB: Number(repo.size || 0),
        codeBytes,
        language: repo.language || null,
        languages: repoLangMap,
        updatedAt: String(repo.updated_at || ""),
        pushedAt: String(repo.pushed_at || repo.updated_at || ""),
        createdAt: String(repo.created_at || ""),
        defaultBranch: String(repo.default_branch || "main"),
        isFork,
        isArchived,
        topics: Array.isArray(repo.topics) ? repo.topics : [],
        languageFetchStatus,
      };
    }
  );

  const { languages, totalCodeBytes } = aggregateLanguages(enrichedRepos, {
    excludeForks: true,
    excludeArchived: false,
  });

  const ownedReposCount = enrichedRepos.filter((r) => !r.isFork).length;
  const forkedReposCount = enrichedRepos.filter((r) => r.isFork).length;
  const archivedReposCount = enrichedRepos.filter((r) => r.isArchived).length;
  const activeReposCount = enrichedRepos.filter((r) => !r.isArchived).length;

  return {
    username: profileData?.login || username,
    name: profileData?.name || "Sayam Mukherjee",
    avatarUrl:
      profileData?.avatar_url || "https://avatars.githubusercontent.com/u/85777731?v=4",
    profileUrl: profileData?.html_url || `https://github.com/${username}`,
    bio: profileData?.bio || "",
    totalRepos: enrichedRepos.length,
    ownedReposCount,
    forkedReposCount,
    archivedReposCount,
    activeReposCount,
    totalStars: enrichedRepos.reduce((s, r) => s + r.stars, 0),
    totalForks: enrichedRepos.reduce((s, r) => s + r.forks, 0),
    totalCodeBytes,
    totalRepoSizeKB: enrichedRepos.reduce((s, r) => s + r.sizeKB, 0),
    generatedAt: new Date().toISOString(),
    status: failedLanguageRepos.length > 0 ? "partial" : "success",
    source: "github-api",
    failedLanguageRepos,
    filteringPolicy: {
      includeForksInRepoList: true,
      includeArchivedInRepoList: true,
      excludeForksFromLanguageBytes: true,
      excludeArchivedFromLanguageBytes: false,
      description:
        "All public repositories appear in Repository Activity. Language composition aggregates source bytes across owned non-fork repositories.",
    },
    languages,
    repositories: enrichedRepos.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.fullName,
      url: r.url,
      homepage: r.homepage,
      stars: r.stars,
      forks: r.forks,
      sizeKB: r.sizeKB,
      codeBytes: r.codeBytes,
      language: r.language,
      languages: r.languages,
      updatedAt: r.updatedAt,
      pushedAt: r.pushedAt,
      defaultBranch: r.defaultBranch,
      isFork: r.isFork,
      isArchived: r.isArchived,
    })),
  };
}

let cachedTelemetry: { timestamp: number; data: GitHubTelemetry } | null = null;
let lastManualRefreshMs = 0;

export function resetTelemetryCacheForTests(): void {
  cachedTelemetry = null;
  lastManualRefreshMs = 0;
}

export async function getCanonicalGitHubTelemetry(options: {
  force?: boolean;
  preferLive?: boolean;
} = {}): Promise<GitHubTelemetry> {
  const { force = false, preferLive = true } = options;
  const now = Date.now();

  if (!force && cachedTelemetry && now - cachedTelemetry.timestamp < TELEMETRY_CACHE_TTL_MS) {
    return cachedTelemetry.data;
  }

  if (force && cachedTelemetry && now - lastManualRefreshMs < MANUAL_REFRESH_COOLDOWN_MS) {
    return cachedTelemetry.data;
  }

  if (force) {
    lastManualRefreshMs = now;
  }

  if (preferLive && process.env.VITEST !== "true") {
    try {
      const live = await fetchLiveGitHubTelemetry(DEFAULT_GITHUB_USERNAME);
      cachedTelemetry = { timestamp: now, data: live };
      return live;
    } catch (err: any) {
      const snapshot = readLocalSnapshotJson();
      if (snapshot) {
        const fallback = buildTelemetryFromSnapshot(snapshot, {
          status: "partial",
          source: "snapshot-fallback",
          errorMessage: `Live GitHub API unavailable (${err?.message || "network fallback"}); serving verified repository snapshot.`,
        });
        cachedTelemetry = { timestamp: now, data: fallback };
        return fallback;
      }
      if (cachedTelemetry?.data) {
        return {
          ...cachedTelemetry.data,
          status: "partial",
          errorMessage: err?.message || "Live GitHub refresh failed; serving stale cache.",
        };
      }
      throw err;
    }
  }

  const localSnapshot = readLocalSnapshotJson();
  if (localSnapshot) {
    const telemetry = buildTelemetryFromSnapshot(localSnapshot, {
      status: "success",
      source: "snapshot-fallback",
    });
    cachedTelemetry = { timestamp: now, data: telemetry };
    return telemetry;
  }

  return {
    username: DEFAULT_GITHUB_USERNAME,
    name: "Sayam Mukherjee",
    avatarUrl: "https://avatars.githubusercontent.com/u/85777731?v=4",
    profileUrl: `https://github.com/${DEFAULT_GITHUB_USERNAME}`,
    bio: "B.Tech CSE student at KIIT University",
    totalRepos: 0,
    ownedReposCount: 0,
    forkedReposCount: 0,
    archivedReposCount: 0,
    activeReposCount: 0,
    totalStars: 0,
    totalForks: 0,
    totalCodeBytes: 0,
    totalRepoSizeKB: 0,
    generatedAt: new Date().toISOString(),
    status: "error",
    source: "snapshot-fallback",
    failedLanguageRepos: [],
    errorMessage: "GitHub telemetry snapshot unavailable.",
    filteringPolicy: {
      includeForksInRepoList: true,
      includeArchivedInRepoList: true,
      excludeForksFromLanguageBytes: true,
      excludeArchivedFromLanguageBytes: false,
      description:
        "All public repositories appear in Repository Activity. Language composition aggregates source bytes across owned non-fork repositories.",
    },
    languages: [],
    repositories: [],
  };
}
