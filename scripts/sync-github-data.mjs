import fs from "node:fs/promises";

const OWNER = "codesbysayam";
const API = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  throw new Error("GITHUB_TOKEN is available only inside GitHub Actions.");
}

async function github(path) {
  const response = await fetch(`${API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "sayam-mukherjee-portfolio-sync"
    }
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API ${response.status}: ${path}`
    );
  }

  return response.json();
}

const profile = await github(`/users/${OWNER}`);

const repositories = await github(
  `/users/${OWNER}/repos?sort=updated&direction=desc&per_page=100`
);

const events = await github(
  `/users/${OWNER}/events/public?per_page=30`
);

// Fetch languages SERIALly.
// Never fire dozens of requests concurrently.

const languages = {};

for (const repo of repositories) {
  if (repo.fork) continue;

  try {
    const langData = await github(
      `/repos/${OWNER}/${repo.name}/languages`
    );
    if (langData && typeof langData === "object" && !langData.message) {
      languages[repo.full_name] = langData;
    } else {
      languages[repo.full_name] = {};
    }
  } catch (error) {
    console.warn(
      `Language fetch failed for ${repo.name}:`,
      error.message
    );

    languages[repo.full_name] = {};
  }
}

const snapshot = {
  source: "GitHub",
  owner: OWNER,
  profile: {
    login: profile.login,
    name: profile.name,
    avatar_url: profile.avatar_url,
    html_url: profile.html_url,
    bio: profile.bio,
    public_repos: profile.public_repos,
    followers: profile.followers,
    following: profile.following
  },

  repositories: repositories.map(repo => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    html_url: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    fork: repo.fork,
    archived: repo.archived,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    open_issues_count: repo.open_issues_count,
    default_branch: repo.default_branch,
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    pushed_at: repo.pushed_at
  })),

  events: events.map(event => ({
    id: event.id,
    type: event.type,
    repo: event.repo?.name ?? null,
    created_at: event.created_at,
    public: event.public
  })),

  languages,

  syncedAt: new Date().toISOString(),
  status: "ok"
};

await fs.mkdir("public/data", { recursive: true });

const jsonContent = JSON.stringify(snapshot, null, 2) + "\n";

await fs.writeFile(
  "public/data/github.json",
  jsonContent,
  "utf8"
);

await fs.writeFile(
  "public/github-data.json",
  jsonContent,
  "utf8"
);

console.log(
  `GitHub snapshot generated: ${repositories.length} repositories`
);
