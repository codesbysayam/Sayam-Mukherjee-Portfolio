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
    public_repos: 11,
    followers: 1,
    following: 0
  },
  repositories: [
    {
      id: 1361090226,
      name: "Memory-in-Motion",
      full_name: "codesbysayam/Memory-in-Motion",
      description: "Interactive mechanistic lab contrasting O(1) recurrent state, Hebbian fast weights & BDH against O(T) KV caches.",
      html_url: "https://github.com/codesbysayam/Memory-in-Motion",
      homepage: "https://memoryinmotion.vercel.app",
      language: "TypeScript",
      fork: false,
      archived: false,
      stargazers_count: 1,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-09-08T07:59:51Z",
      updated_at: "2026-10-25T16:44:06Z",
      pushed_at: "2026-11-18T09:10:56Z"
    },
    {
      id: 1368247830,
      name: "codesbysayam",
      full_name: "codesbysayam/codesbysayam",
      description: "Developer portfolio and GitHub profile of Sayam Mukherjee.",
      html_url: "https://github.com/codesbysayam/codesbysayam",
      homepage: null,
      language: null,
      fork: false,
      archived: false,
      stargazers_count: 1,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-09-13T09:39:25Z",
      updated_at: "2026-11-12T11:00:18Z",
      pushed_at: "2026-11-18T07:29:56Z"
    },
    {
      id: 1355576736,
      name: "Sayam-Mukherjee-Portfolio",
      full_name: "codesbysayam/Sayam-Mukherjee-Portfolio",
      description: "Personal developer portfolio with verified codebases and live telemetry.",
      html_url: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
      homepage: "www.sayammukherjee.in",
      language: "TypeScript",
      fork: false,
      archived: false,
      stargazers_count: 2,
      forks_count: 0,
      open_issues_count: 1,
      default_branch: "main",
      created_at: "2026-09-03T06:02:37Z",
      updated_at: "2026-11-17T08:00:59Z",
      pushed_at: "2026-11-18T04:06:22Z"
    },
    {
      id: 1461749225,
      name: "mausam_sih-26",
      full_name: "codesbysayam/mausam_sih-26",
      description: "Smart weather intelligence platform built for SIH 2026 by Team ALGNITE.",
      html_url: "https://github.com/codesbysayam/mausam_sih-26",
      homepage: "https://mausamgovt.vercel.app",
      language: "TypeScript",
      fork: false,
      archived: false,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-11-17T17:31:45Z",
      updated_at: "2026-11-18T02:37:29Z",
      pushed_at: "2026-11-18T02:32:07Z"
    },
    {
      id: 1406277351,
      name: "SightForge",
      full_name: "codesbysayam/SightForge",
      description: "YOLOv8 Edge CV Pipeline (Next.js 15 + FastAPI + ByteTrack)",
      html_url: "https://github.com/codesbysayam/SightForge",
      homepage: null,
      language: "TypeScript",
      fork: false,
      archived: false,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-10-05T19:18:39Z",
      updated_at: "2026-10-25T09:11:28Z",
      pushed_at: "2026-10-25T09:11:24Z"
    },
    {
      id: 1403521263,
      name: "AXIOM",
      full_name: "codesbysayam/AXIOM",
      description: "Autonomous operations control plane built for WCC Launchpad 30.",
      html_url: "https://github.com/codesbysayam/AXIOM",
      homepage: "https://axiomwcc.vercel.app",
      language: "TypeScript",
      fork: false,
      archived: false,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-10-03T18:28:37Z",
      updated_at: "2026-10-04T20:37:37Z",
      pushed_at: "2026-10-04T18:39:23Z"
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
      stargazers_count: 1,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-09-01T14:21:00Z",
      updated_at: "2026-10-03T17:02:09Z",
      pushed_at: "2026-10-03T17:02:09Z"
    },
    {
      id: 1403759281,
      name: "mausam_sample",
      full_name: "codesbysayam/mausam_sample",
      description: "SIH 2026 Team ALGNITE baseline weather intelligence snapshot.",
      html_url: "https://github.com/codesbysayam/mausam_sample",
      homepage: "https://mausamgovt.vercel.app",
      language: "TypeScript",
      fork: false,
      archived: false,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-09-30T18:22:07Z",
      updated_at: "2026-09-30T18:22:07Z",
      pushed_at: "2026-09-30T18:22:07Z"
    },
    {
      id: 1393521230,
      name: "CAMPUSCONNECT_1273",
      full_name: "codesbysayam/CAMPUSCONNECT_1273",
      description: "Full-stack Next.js college event management platform with Vitest verification.",
      html_url: "https://github.com/codesbysayam/CAMPUSCONNECT_1273",
      homepage: "https://campusconnect1273.vercel.app/",
      language: "TypeScript",
      fork: false,
      archived: false,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-09-28T18:11:59Z",
      updated_at: "2026-09-28T18:11:59Z",
      pushed_at: "2026-09-28T18:11:59Z"
    },
    {
      id: 1398291823,
      name: "inkloom",
      full_name: "codesbysayam/inkloom",
      description: "Forked workspace for constructed AI logo design and composition systems.",
      html_url: "https://github.com/codesbysayam/inkloom",
      homepage: "https://inkloom.art",
      language: null,
      fork: true,
      archived: false,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "master",
      created_at: "2026-09-26T13:29:22Z",
      updated_at: "2026-09-26T13:29:22Z",
      pushed_at: "2026-09-26T13:29:22Z"
    },
    {
      id: 1358811826,
      name: "sayam-solves",
      full_name: "codesbysayam/sayam-solves",
      description: "C++ DSA solutions synced via LeetHub V2.",
      html_url: "https://github.com/codesbysayam/sayam-solves",
      homepage: null,
      language: "C++",
      fork: false,
      archived: false,
      stargazers_count: 1,
      forks_count: 0,
      open_issues_count: 0,
      default_branch: "main",
      created_at: "2026-09-07T06:02:43Z",
      updated_at: "2026-09-07T06:02:43Z",
      pushed_at: "2026-09-07T06:02:43Z"
    }
  ],
  events: [
    {
      id: "21074815462",
      type: "PushEvent",
      repo: "codesbysayam/Memory-in-Motion",
      created_at: "2026-11-18T09:10:56Z",
      public: true
    },
    {
      id: "21074815461",
      type: "PushEvent",
      repo: "codesbysayam/mausam_sih-26",
      created_at: "2026-11-18T02:32:07Z",
      public: true
    }
  ],
  languages: {
    "codesbysayam/Memory-in-Motion": { "TypeScript": 1712000, "CSS": 29700, "Python": 12400, "HTML": 3100 },
    "codesbysayam/codesbysayam": { "Python": 2500, "Shell": 569 },
    "codesbysayam/Sayam-Mukherjee-Portfolio": { "TypeScript": 2100000, "CSS": 65000, "HTML": 15000, "JavaScript": 25000 },
    "codesbysayam/mausam_sih-26": { "TypeScript": 5140000, "Python": 118600, "JavaScript": 65900, "CSS": 50000, "C": 31100, "PLpgSQL": 6100 },
    "codesbysayam/SightForge": { "TypeScript": 252100, "Python": 149600, "Makefile": 5200 },
    "codesbysayam/AXIOM": { "TypeScript": 793500, "CSS": 61200, "HTML": 1800 },
    "codesbysayam/Operon": { "TypeScript": 936622, "CSS": 8841, "HTML": 1230 },
    "codesbysayam/mausam_sample": { "TypeScript": 5130000, "Python": 118600, "JavaScript": 65900, "CSS": 34000, "C": 37473 },
    "codesbysayam/CAMPUSCONNECT_1273": { "TypeScript": 210500, "CSS": 9700, "HTML": 800 },
    "codesbysayam/inkloom": { "TypeScript": 1980000, "CSS": 16900, "JavaScript": 12700, "PLpgSQL": 7319, "Dockerfile": 600 },
    "codesbysayam/sayam-solves": { "C++": 2037 }
  },
  syncedAt: "2026-11-18T09:10:56Z",
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

    if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
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
