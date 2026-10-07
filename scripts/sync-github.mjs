/**
 * ============================================================================
 * GITHUB TELEMETRY ACTIONS SYNC SCRIPT
 * ============================================================================
 * Fetches verified repository data, profile info, language bytes, and recent
 * activity for 'codesbysayam' from the official GitHub API.
 *
 * Output: public/data/github.json (and public/github-data.json)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERNAME = "codesbysayam";
const API_BASE = "https://api.github.com";
const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const TOKEN = process.env.GITHUB_TOKEN;

const HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "sayam-mukherjee-portfolio-sync",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

function getRateLimitReset(response) {
  const reset = response.headers.get("x-ratelimit-reset");
  if (!reset) return null;
  const timestamp = Number(reset) * 1000;
  return Number.isFinite(timestamp) ? timestamp : null;
}

async function fetchRest(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, { headers: HEADERS });

  const remaining = res.headers.get("x-ratelimit-remaining");
  if (res.status === 403 || res.status === 429 || (remaining !== null && Number(remaining) === 0)) {
    const resetTimestamp = getRateLimitReset(res);
    const resetMsg = resetTimestamp
      ? ` Rate limit reset at ${new Date(resetTimestamp).toISOString()}`
      : "";
    throw new Error(`GitHub rate limit reached.${resetMsg}`);
  }

  if (!res.ok) {
    throw new Error(`REST request failed [${res.status}] for ${endpoint}: ${await res.text()}`);
  }
  return res.json();
}

async function fetchGraphQL(query, variables) {
  if (!TOKEN) {
    console.log("[sync-github] Skipping GraphQL contribution query: GITHUB_TOKEN not provided.");
    return null;
  }

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      ...HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    console.warn(`[sync-github] GraphQL query failed [${res.status}]: ${await res.text()}`);
    return null;
  }

  const json = await res.json();
  if (json.errors) {
    console.warn("[sync-github] GraphQL errors:", json.errors);
    return null;
  }

  return json.data;
}

function formatActivityEvent(event) {
  const rawType = event.type;
  const repoName = event.repo?.name ? event.repo.name.replace(/^codesbysayam\//, "") : null;

  let actionLabel = "GitHub activity";
  let details = undefined;

  switch (rawType) {
    case "PushEvent": {
      const commitCount = event.payload?.commits?.length || 1;
      actionLabel = `Pushed ${commitCount} commit${commitCount === 1 ? "" : "s"}`;
      if (event.payload?.commits?.[0]?.message) {
        details = event.payload.commits[0].message.split("\n")[0];
      }
      break;
    }
    case "CreateEvent": {
      const refType = event.payload?.ref_type || "repository";
      actionLabel = `Created ${refType}${event.payload?.ref ? ` '${event.payload.ref}'` : ""}`;
      break;
    }
    case "PullRequestEvent": {
      const action = event.payload?.action || "updated";
      actionLabel = `${action.charAt(0).toUpperCase() + action.slice(1)} pull request`;
      break;
    }
    case "IssuesEvent": {
      const action = event.payload?.action || "updated";
      actionLabel = `${action.charAt(0).toUpperCase() + action.slice(1)} issue`;
      break;
    }
    case "IssueCommentEvent": {
      actionLabel = "Commented on issue";
      break;
    }
    case "WatchEvent": {
      actionLabel = "Starred repository";
      break;
    }
    case "ForkEvent": {
      actionLabel = "Forked repository";
      break;
    }
    default:
      actionLabel = rawType.replace(/Event$/, "");
  }

  return {
    id: String(event.id),
    type: rawType,
    createdAt: event.created_at,
    created_at: event.created_at,
    repoName,
    repo: {
      id: event.repo?.id,
      name: event.repo?.name || `codesbysayam/${repoName}`,
      url: `https://github.com/${event.repo?.name || `codesbysayam/${repoName}`}`,
    },
    public: Boolean(event.public),
    actionLabel,
    details,
  };
}

async function main() {
  console.log(`[sync-github] Starting GitHub repository & telemetry sync for '${USERNAME}'...`);

  const primaryTarget = path.resolve(__dirname, "../public/data/github.json");
  const secondaryTarget = path.resolve(__dirname, "../public/github-data.json");

  // 1. Fetch user profile
  console.log("[sync-github] Fetching user profile...");
  const user = await fetchRest(`/users/${USERNAME}`);

  // 2. Fetch all public repositories
  console.log("[sync-github] Fetching user repositories...");
  const rawRepos = await fetchRest(`/users/${USERNAME}/repos?per_page=100&sort=updated`);

  if (!Array.isArray(rawRepos)) {
    throw new Error("Invalid repositories payload received from GitHub API.");
  }

  // 3. Normalize repositories
  const repositories = rawRepos.map((r) => ({
    id: r.id,
    name: r.name,
    full_name: r.full_name,
    fullName: r.full_name,
    html_url: r.html_url,
    url: r.html_url,
    description: r.description || null,
    homepage: r.homepage || "",
    language: r.language || null,
    stargazers_count: r.stargazers_count || 0,
    stars: r.stargazers_count || 0,
    forks_count: r.forks_count || 0,
    forks: r.forks_count || 0,
    watchers_count: r.watchers_count || 0,
    watchers: r.watchers_count || 0,
    fork: Boolean(r.fork),
    isFork: Boolean(r.fork),
    archived: Boolean(r.archived),
    isArchived: Boolean(r.archived),
    open_issues_count: r.open_issues_count || 0,
    default_branch: r.default_branch || "main",
    created_at: r.created_at,
    createdAt: r.created_at,
    updated_at: r.updated_at,
    updatedAt: r.updated_at,
    pushed_at: r.pushed_at,
    pushedAt: r.pushed_at,
    topics: Array.isArray(r.topics) ? r.topics : [],
  }));

  const ownedRepos = repositories.filter((r) => !r.fork);
  const totalStars = ownedRepos.reduce((acc, r) => acc + r.stargazers_count, 0);
  const totalForks = ownedRepos.reduce((acc, r) => acc + r.forks_count, 0);

  // 4. Primary language counts
  const languageCounts = {};
  for (const r of ownedRepos) {
    if (r.language) {
      languageCounts[r.language] = (languageCounts[r.language] ?? 0) + 1;
    }
  }

  // 5. Fetch language byte statistics sequentially to protect against rate limits
  const languageBytes = {};
  const repoLanguagesMap = {};
  console.log("[sync-github] Fetching repository language breakdowns...");
  for (const r of ownedRepos.slice(0, 15)) {
    try {
      const repoLangs = await fetchRest(`/repos/${r.full_name}/languages`);
      repoLanguagesMap[r.full_name] = repoLangs;
      for (const [lang, bytes] of Object.entries(repoLangs)) {
        languageBytes[lang] = (languageBytes[lang] ?? 0) + bytes;
      }
    } catch (err) {
      console.warn(`[sync-github] Warning: Could not fetch languages for ${r.full_name}: ${err.message}`);
    }
  }

  // 6. Fetch recent public activity
  console.log("[sync-github] Fetching recent public activity events...");
  let rawEvents = [];
  let recentActivity = [];
  try {
    rawEvents = await fetchRest(`/users/${USERNAME}/events/public?per_page=30`);
    if (Array.isArray(rawEvents)) {
      recentActivity = rawEvents.map(formatActivityEvent);
    }
  } catch (err) {
    console.warn(`[sync-github] Warning: Could not fetch public events: ${err.message}`);
  }

  // 7. Latest push timestamp
  const latestPush = ownedRepos
    .map((r) => r.pushed_at || r.updated_at)
    .filter(Boolean)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? null;

  // 8. Fetch contribution calendar via GraphQL (if token provided)
  let contributionCalendar = null;
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const calendarQuery = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const gqlData = await fetchGraphQL(calendarQuery, {
      login: USERNAME,
      from: oneYearAgo.toISOString(),
      to: now.toISOString(),
    });

    if (gqlData?.user?.contributionsCollection?.contributionCalendar) {
      const rawCalendar = gqlData.user.contributionsCollection.contributionCalendar;
      contributionCalendar = {
        totalContributions: rawCalendar.totalContributions,
        weeks: rawCalendar.weeks.map((week) => ({
          contributionDays: week.contributionDays.map((d) => ({
            date: d.date,
            count: d.contributionCount,
            color: d.color,
          })),
        })),
      };
      console.log(`[sync-github] Fetched contribution calendar with ${contributionCalendar.totalContributions} contributions.`);
    }
  } catch (err) {
    console.warn("[sync-github] Warning: GraphQL calendar query error:", err.message);
  }

  // Preserve existing calendar if GraphQL was unavailable or rate-limited
  if (!contributionCalendar) {
    try {
      const existingRaw = await fs.readFile(primaryTarget, "utf-8");
      const existing = JSON.parse(existingRaw);
      if (existing.contributionCalendar) {
        contributionCalendar = existing.contributionCalendar;
      }
    } catch {}
  }

  // Assemble canonical GitHubStats snapshot containing both top-level and nested schemas
  const nowIso = new Date().toISOString();
  const payload = {
    source: "GitHub",
    owner: user.login,
    username: user.login,
    profileUrl: user.html_url,
    avatarUrl: user.avatar_url,
    name: user.name || "Sayam Mukherjee",
    bio: user.bio || "",
    publicRepos: repositories.length || user.public_repos,
    followers: user.followers ?? 1,
    following: user.following ?? 0,
    publicGists: user.public_gists ?? 0,
    accountCreatedAt: user.created_at,
    profile: {
      login: user.login,
      name: user.name || "Sayam Mukherjee",
      avatar_url: user.avatar_url,
      html_url: user.html_url,
      bio: user.bio,
      public_repos: repositories.length || user.public_repos,
      followers: user.followers ?? 1,
      following: user.following ?? 0,
    },
    totalStars,
    totalForks,
    repositories,
    events: rawEvents.length > 0 ? rawEvents.map((e) => ({
      id: String(e.id),
      type: e.type,
      repo: typeof e.repo === "string" ? e.repo : (e.repo?.name || `codesbysayam/${e.repoName || "portfolio"}`),
      created_at: e.created_at,
      public: Boolean(e.public),
      payload: e.payload,
    })) : [],
    recentActivity,
    languages: repoLanguagesMap,
    languageCounts,
    languageBytes,
    latestPush,
    contributionCalendar,
    fetchedAt: nowIso,
    syncedAt: nowIso,
    status: "ok",
  };

  const jsonString = JSON.stringify(payload, null, 2);

  // Write to public/data/github.json
  await fs.mkdir(path.dirname(primaryTarget), { recursive: true });
  await fs.writeFile(primaryTarget, jsonString, "utf-8");
  console.log(`[sync-github] Wrote snapshot to ${primaryTarget}`);

  // Write to public/github-data.json
  await fs.mkdir(path.dirname(secondaryTarget), { recursive: true });
  await fs.writeFile(secondaryTarget, jsonString, "utf-8");
  console.log(`[sync-github] Wrote mirror snapshot to ${secondaryTarget}`);

  console.log(`[sync-github] Completed successfully! Synced ${repositories.length} repositories, ${totalStars} stars, ${totalForks} forks.`);
}

main().catch(async (err) => {
  const isRateLimit = err?.message?.includes("rate limit") || err?.message?.includes("403") || err?.message?.includes("429");
  const targetPath = path.resolve(__dirname, "../public/data/github.json");
  let hasExisting = false;
  try {
    await fs.access(targetPath);
    hasExisting = true;
  } catch {}

  if (hasExisting) {
    console.warn(`[sync-github] Sync halted safely (${err.message}). Existing public/data/github.json preserved.`);
    process.exit(0);
  }

  console.error("[sync-github] Fatal error during sync:", err);
  process.exit(1);
});
