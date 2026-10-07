import type { GitHubStats } from "../data/githubTypes";
import { isValidGitHubStats } from "../data/githubTypes";

/**
 * Authoritative Frontend GitHub Snapshot Loader
 * 
 * Rules:
 * - The browser reads from local snapshot endpoints (/data/github.json, /github-data.json, /api/github-data)
 * - 0 direct browser requests to api.github.com
 * - No rate limits, no personal tokens required
 */
export async function loadGitHubSnapshot(force = false): Promise<GitHubStats> {
  const timestamp = Date.now();
  const candidateUrls = [
    `/data/github.json${force ? `?t=${timestamp}` : ""}`,
    `/github-data.json${force ? `?t=${timestamp}` : ""}`,
    `/api/github-data${force ? `?force=true&t=${timestamp}` : ""}`,
  ];

  let lastError: Error | null = null;

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, {
        cache: force ? "no-store" : "default",
      });

      if (response.ok) {
        const payload: unknown = await response.json();
        if (payload && typeof payload === "object") {
          const raw = ((payload as Record<string, unknown>).data || payload) as Record<string, unknown>;
          if (isValidGitHubStats(raw)) {
            const profile = raw.profile && typeof raw.profile === "object" ? (raw.profile as Record<string, unknown>) : null;
            const repos = Array.isArray(raw.repositories) ? raw.repositories : [];

            const totalStars = typeof raw.totalStars === "number"
              ? raw.totalStars
              : repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || r.stars || 0), 0);

            const totalForks = typeof raw.totalForks === "number"
              ? raw.totalForks
              : repos.reduce((sum: number, r: any) => sum + (r.forks_count || r.forks || 0), 0);

            const normalized: GitHubStats = {
              username: String(raw.username || raw.owner || profile?.login || "codesbysayam"),
              profileUrl: String(raw.profileUrl || profile?.html_url || "https://github.com/codesbysayam"),
              avatarUrl: String(raw.avatarUrl || profile?.avatar_url || "https://avatars.githubusercontent.com/u/85777731?v=4"),
              name: (raw.name || profile?.name || "Sayam Mukherjee") as string | null,
              bio: (raw.bio || profile?.bio || "") as string | null,
              publicRepos: typeof raw.publicRepos === "number"
                ? raw.publicRepos
                : (typeof profile?.public_repos === "number" ? profile.public_repos : repos.length),
              followers: typeof raw.followers === "number"
                ? raw.followers
                : (typeof profile?.followers === "number" ? profile.followers : 1),
              following: typeof raw.following === "number"
                ? raw.following
                : (typeof profile?.following === "number" ? profile.following : 0),
              publicGists: typeof raw.publicGists === "number" ? raw.publicGists : 0,
              accountCreatedAt: (raw.accountCreatedAt || profile?.created_at || "2021-06-12T04:55:46Z") as string,
              totalStars,
              totalForks,
              repositories: repos,
              languageCounts: (raw.languageCounts as Record<string, number>) || {},
              languageBytes: (raw.languageBytes as Record<string, number>) || {},
              latestPush: (raw.latestPush as string) || null,
              recentActivity: Array.isArray(raw.recentActivity)
                ? (raw.recentActivity as any)
                : (Array.isArray(raw.events) ? (raw.events as any) : []),
              contributionCalendar: (raw.contributionCalendar as any) || null,
              fetchedAt: String(raw.fetchedAt || raw.syncedAt || new Date().toISOString()),
              source: (raw.source as any) || "snapshot",
            };

            return normalized;
          }
        }
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error("GitHub snapshot unavailable.");
}

export default loadGitHubSnapshot;
