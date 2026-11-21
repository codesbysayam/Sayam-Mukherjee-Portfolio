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

export const TELEMETRY_CLIENT_CACHE_TTL_MS = 15 * 60 * 1000;

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

export function formatBytesAsKB(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  return `${(bytes / 1024).toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} KB`;
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

export function buildClientTelemetryFromSnapshot(rawSnapshot: any): GitHubTelemetry {
  const reposRaw = Array.isArray(rawSnapshot?.repositories) ? rawSnapshot.repositories : [];
  const rawLanguagesMap: Record<string, Record<string, number>> =
    rawSnapshot?.languages && typeof rawSnapshot.languages === "object"
      ? rawSnapshot.languages
      : {};

  const repositories: RepositoryMetric[] = reposRaw.map((r: any) => {
    const fullName = String(r.full_name || r.fullName || `codesbysayam/${r.name}`);
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
      stars: typeof r.stargazers_count === "number" ? r.stargazers_count : Number(r.stars || 0),
      forks: typeof r.forks_count === "number" ? r.forks_count : Number(r.forks || 0),
      sizeKB,
      codeBytes,
      language: r.language || null,
      languages: repoLangMap,
      updatedAt: String(r.updated_at || r.updatedAt || ""),
      pushedAt: String(r.pushed_at || r.pushedAt || r.updated_at || r.updatedAt || ""),
      defaultBranch: String(r.default_branch || r.defaultBranch || "main"),
      isFork: Boolean(r.fork ?? r.isFork),
      isArchived: Boolean(r.archived ?? r.isArchived),
    };
  });

  const { languages, totalCodeBytes } = aggregateLanguages(repositories, {
    excludeForks: true,
    excludeArchived: false,
  });

  const ownedReposCount = repositories.filter((r) => !r.isFork).length;
  const forkedReposCount = repositories.filter((r) => r.isFork).length;
  const archivedReposCount = repositories.filter((r) => r.isArchived).length;
  const activeReposCount = repositories.filter((r) => !r.isArchived).length;
  const profile = rawSnapshot?.profile || {};

  return {
    username: String(rawSnapshot?.username || profile.login || "codesbysayam"),
    name: String(rawSnapshot?.name || profile.name || "Sayam Mukherjee"),
    avatarUrl: String(
      rawSnapshot?.avatarUrl ||
        profile.avatar_url ||
        "https://avatars.githubusercontent.com/u/85777731?v=4"
    ),
    profileUrl: String(
      rawSnapshot?.profileUrl || profile.html_url || "https://github.com/codesbysayam"
    ),
    bio: String(rawSnapshot?.bio || profile.bio || ""),
    totalRepos: repositories.length,
    ownedReposCount,
    forkedReposCount,
    archivedReposCount,
    activeReposCount,
    totalStars: repositories.reduce((sum, r) => sum + r.stars, 0),
    totalForks: repositories.reduce((sum, r) => sum + r.forks, 0),
    totalCodeBytes,
    totalRepoSizeKB: repositories.reduce((sum, r) => sum + r.sizeKB, 0),
    generatedAt: String(rawSnapshot?.syncedAt || rawSnapshot?.fetchedAt || new Date().toISOString()),
    status: "partial",
    source: "snapshot-fallback",
    failedLanguageRepos: [],
    errorMessage: "Live backend telemetry endpoint unavailable; computed from local snapshot.",
    filteringPolicy: {
      includeForksInRepoList: true,
      includeArchivedInRepoList: true,
      excludeForksFromLanguageBytes: true,
      excludeArchivedFromLanguageBytes: false,
      description:
        "All public repositories appear in Repository Activity. Language composition aggregates source bytes across owned non-fork repositories.",
    },
    languages,
    repositories,
  };
}

let cachedClientTelemetry: { timestamp: number; data: GitHubTelemetry } | null = null;
let inflightTelemetryPromise: Promise<GitHubTelemetry> | null = null;

function isValidTelemetryPayload(payload: any): payload is GitHubTelemetry {
  return Boolean(
    payload &&
      typeof payload === "object" &&
      Array.isArray(payload.languages) &&
      Array.isArray(payload.repositories) &&
      typeof payload.totalCodeBytes === "number"
  );
}

export async function fetchCanonicalGitHubTelemetry(force = false): Promise<GitHubTelemetry> {
  const now = Date.now();
  if (
    !force &&
    cachedClientTelemetry &&
    now - cachedClientTelemetry.timestamp < TELEMETRY_CLIENT_CACHE_TTL_MS
  ) {
    return cachedClientTelemetry.data;
  }

  if (!force && inflightTelemetryPromise) {
    return inflightTelemetryPromise;
  }

  inflightTelemetryPromise = (async () => {
    try {
      const endpoint = force ? `/api/github/telemetry?refresh=1&t=${now}` : "/api/github/telemetry";
      const res = await fetch(endpoint);
      if (res.ok) {
        const json = await res.json();
        if (isValidTelemetryPayload(json)) {
          cachedClientTelemetry = { timestamp: Date.now(), data: json };
          return json;
        }
      }
    } catch {
      // Fall back to static snapshot URLs below
    }

    for (const snapUrl of ["/data/github.json", "/github-data.json"]) {
      try {
        const snapRes = await fetch(snapUrl);
        if (snapRes.ok) {
          const snapJson = await snapRes.json();
          const telemetry = buildClientTelemetryFromSnapshot(snapJson);
          cachedClientTelemetry = { timestamp: Date.now(), data: telemetry };
          return telemetry;
        }
      } catch {
        // Try next snapshot candidate
      }
    }

    if (cachedClientTelemetry?.data) {
      return {
        ...cachedClientTelemetry.data,
        status: "partial",
        errorMessage: "Unable to refresh telemetry; displaying cached snapshot.",
      };
    }

    throw new Error("Unable to load GitHub telemetry from API or local snapshot.");
  })();

  try {
    return await inflightTelemetryPromise;
  } finally {
    inflightTelemetryPromise = null;
  }
}
