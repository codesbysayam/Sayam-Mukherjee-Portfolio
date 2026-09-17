export type GitHubSnapshot = {
  source: "GitHub";
  owner: string;
  profile: {
    login: string;
    name: string | null;
    avatar_url: string;
    html_url: string;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
  } | null;

  repositories: Array<{
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    fork: boolean;
    archived: boolean;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    default_branch: string;
    topics?: string[];
    created_at: string;
    updated_at: string;
    pushed_at: string | null;
  }>;

  events: Array<{
    id: string;
    type: string;
    repo: string | null;
    payload?: any;
    created_at: string;
    public: boolean;
  }>;

  languages: Record<string, Record<string, number>>;

  syncedAt: string | null;
  status: "ok" | "pending" | "error";
};

let memoryCache: GitHubSnapshot | null = null;

const FALLBACK_SNAPSHOT: GitHubSnapshot = {
  source: "GitHub",
  owner: "codesbysayam",
  profile: {
    login: "codesbysayam",
    name: "Sayam Mukherjee",
    avatar_url: "https://avatars.githubusercontent.com/u/85777731?v=4",
    html_url: "https://github.com/codesbysayam",
    bio: "👨‍💻 B.Tech CSE (AI&ML) student at KIIT University\r\n🔍 Exploring Python, Machine Learning, and Web Development\r\n📂 Building projects and learning by doing",
    public_repos: 7,
    followers: 0,
    following: 0
  },
  repositories: [
    {
      id: 1368247830,
      name: "codesbysayam",
      full_name: "codesbysayam/codesbysayam",
      description: "Personal GitHub profile and developer portfolio of Sayam Mukherjee.",
      html_url: "https://github.com/codesbysayam/codesbysayam",
      homepage: null,
      language: "Python",
      fork: false,
      archived: false,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-09-13T09:39:25Z",
      updated_at: "2026-09-17T08:37:34Z",
      pushed_at: "2026-09-17T08:37:30Z"
    },
    {
      id: 1370345267,
      name: "RouteLedger",
      full_name: "codesbysayam/RouteLedger",
      description: "Commercial Driver Route & Hours-of-Service Planner",
      html_url: "https://github.com/codesbysayam/RouteLedger",
      homepage: "https://routeledger-six.vercel.app",
      language: "TypeScript",
      fork: false,
      archived: false,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-09-14T17:41:40Z",
      updated_at: "2026-09-14T17:46:17Z",
      pushed_at: "2026-09-14T17:46:13Z"
    },
    {
      id: 1354020967,
      name: "Sayam-Mukherjee-Portfolio",
      full_name: "codesbysayam/Sayam-Mukherjee-Portfolio",
      description: "Personal developer portfolio with verified codebases and live telemetry.",
      html_url: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
      homepage: "https://sayammukherjee.in",
      language: "TypeScript",
      fork: false,
      archived: false,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-09-03T09:37:21Z",
      updated_at: "2026-09-14T15:23:44Z",
      pushed_at: "2026-09-14T15:23:40Z"
    },
    {
      id: 1370044569,
      name: "Memory-in-Motion",
      full_name: "codesbysayam/Memory-in-Motion",
      description: "Interactive mechanistic laboratory exploring recurrent memory and hidden-state dynamics.",
      html_url: "https://github.com/codesbysayam/Memory-in-Motion",
      homepage: "https://memory-in-motion.vercel.app",
      language: "TypeScript",
      fork: false,
      archived: false,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-09-14T12:08:44Z",
      updated_at: "2026-09-14T12:12:47Z",
      pushed_at: "2026-09-14T12:12:43Z"
    },
    {
      id: 1347892011,
      name: "mausam",
      full_name: "codesbysayam/mausam",
      description: "Smart weather intelligence platform built for SIH 2026 by Team Algnite.",
      html_url: "https://github.com/codesbysayam/mausam",
      homepage: "https://mausamgovt.vercel.app",
      language: "TypeScript",
      fork: false,
      archived: false,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-08-25T20:56:02Z",
      updated_at: "2026-09-13T16:32:00Z",
      pushed_at: "2026-09-13T16:31:55Z"
    },
    {
      id: 1358811826,
      name: "sayam-solves",
      full_name: "codesbysayam/sayam-solves",
      description: "Daily coding challenges solved by Sayam, powered by consistent DSA practice.",
      html_url: "https://github.com/codesbysayam/sayam-solves",
      homepage: null,
      language: "C++",
      fork: false,
      archived: false,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-09-06T05:18:47Z",
      updated_at: "2026-09-13T16:20:00Z",
      pushed_at: "2026-09-13T16:19:50Z"
    },
    {
      id: 1350807639,
      name: "Operon",
      full_name: "codesbysayam/Operon",
      description: "Autonomous operations platform built for intelligent, human-controlled workflows.",
      html_url: "https://github.com/codesbysayam/Operon",
      homepage: "https://operonpro.vercel.app",
      language: "TypeScript",
      fork: false,
      archived: false,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-08-29T18:06:43Z",
      updated_at: "2026-09-12T10:14:00Z",
      pushed_at: "2026-09-12T10:13:50Z"
    }
  ],
  events: [
    {
      id: "21074815462",
      type: "PushEvent",
      repo: "codesbysayam/codesbysayam",
      created_at: "2026-09-17T08:37:30Z",
      public: true
    }
  ],
  languages: {
    "codesbysayam/codesbysayam": { "Python": 2500, "Shell": 1200 },
    "codesbysayam/RouteLedger": { "TypeScript": 323332, "Python": 90890, "CSS": 6949, "HTML": 1497 },
    "codesbysayam/Sayam-Mukherjee-Portfolio": { "TypeScript": 582410, "CSS": 42100, "HTML": 8500, "JavaScript": 15400 },
    "codesbysayam/Memory-in-Motion": { "TypeScript": 194200, "Python": 48200, "CSS": 5200 },
    "codesbysayam/mausam": { "TypeScript": 412000, "CSS": 28400, "HTML": 12100, "JavaScript": 8200 },
    "codesbysayam/sayam-solves": { "C++": 86400, "Python": 12400 },
    "codesbysayam/Operon": { "TypeScript": 384000, "JavaScript": 34000, "CSS": 12000 }
  },
  syncedAt: "2026-09-17T08:37:34Z",
  status: "ok"
};

export async function getGitHubSnapshot(): Promise<GitHubSnapshot> {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    const response = await fetch("/data/github.json", {
      cache: "no-store"
    });

    if (response.ok) {
      const data = (await response.json()) as GitHubSnapshot;
      memoryCache = data;
      return data;
    }
  } catch (err) {
    console.warn("Could not fetch /data/github.json, using fallback snapshot:", err);
  }

  return FALLBACK_SNAPSHOT;
}

export function clearGitHubSnapshotCache(): void {
  memoryCache = null;
}

export function findRepositoryInSnapshot(
  snapshot: GitHubSnapshot,
  repoName: string
): GitHubSnapshot["repositories"][number] | null {
  if (!snapshot || !snapshot.repositories) return null;
  const clean = repoName.toLowerCase().trim();
  return (
    snapshot.repositories.find(
      (r) =>
        r.name.toLowerCase() === clean ||
        r.full_name.toLowerCase() === clean ||
        r.full_name.toLowerCase().endsWith(`/${clean}`)
    ) || null
  );
}

export function aggregateLanguageBytes(
  repoLanguages: Record<string, Record<string, number>> | undefined
): Record<string, number> {
  if (!repoLanguages) return {};
  const totalByLang: Record<string, number> = {};

  for (const repoName of Object.keys(repoLanguages)) {
    const langMap = repoLanguages[repoName] || {};
    for (const [lang, bytes] of Object.entries(langMap)) {
      totalByLang[lang] = (totalByLang[lang] || 0) + bytes;
    }
  }

  return totalByLang;
}

export function calculateLanguageDistribution(
  languages: Record<string, number>
): Array<{ language: string; bytes: number; percentage: number }> {
  const entries = Object.entries(languages);

  const total = entries.reduce(
    (sum, [, bytes]) => sum + bytes,
    0
  );

  if (!total) return [];

  return entries
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: Number(
        ((bytes / total) * 100).toFixed(1)
      )
    }))
    .sort((a, b) => b.bytes - a.bytes);
}
