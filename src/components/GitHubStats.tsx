import React from "react";
import { 
  Github, Star, GitFork, ExternalLink, RefreshCw, 
  Layers, Clock, AlertCircle, ArrowUpRight, CheckCircle2,
  Calendar, Code2, Users
} from "lucide-react";
import { useGitHubStats } from "../hooks/useGitHubStats";
import { GitHubRepository, GitHubEvent } from "../lib/github";

export interface GitHubStatsProps {
  className?: string;
  showRepositories?: boolean;
  showLanguages?: boolean;
  showActivity?: boolean;
  limitRepos?: number;
  limitEvents?: number;
  compact?: boolean;
}

/**
 * Format ISO date string to human readable relative or short date
 */
function formatEventDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "recently";
  }
}

/**
 * Get human-readable description for GitHub event
 */
function getEventSummary(event: GitHubEvent): { action: string; repo: string } {
  const repoName = event.repo?.name ? event.repo.name.replace(/^codesbysayam\//, "") : "repository";

  switch (event.type) {
    case "PushEvent":
      const commitCount = event.payload?.commits?.length || 1;
      return {
        action: `Pushed ${commitCount} commit${commitCount > 1 ? "s" : ""}`,
        repo: repoName,
      };
    case "CreateEvent":
      const refType = event.payload?.ref_type || "resource";
      return {
        action: `Created ${refType}`,
        repo: repoName,
      };
    case "WatchEvent":
      return {
        action: "Starred repository",
        repo: repoName,
      };
    case "ForkEvent":
      return {
        action: "Forked repository",
        repo: repoName,
      };
    case "IssuesEvent":
      return {
        action: `${event.payload?.action || "Opened"} issue`,
        repo: repoName,
      };
    case "PullRequestEvent":
      return {
        action: `${event.payload?.action || "Updated"} pull request`,
        repo: repoName,
      };
    default:
      return {
        action: event.type.replace("Event", ""),
        repo: repoName,
      };
  }
}

/**
 * Verified language color mapping
 */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#38bdf8",
  "C++": "#f43f5e",
  Python: "#a855f7",
  JavaScript: "#facc15",
  HTML: "#fb923c",
  CSS: "#c084fc",
};

/**
 * Elegant Apple/iOS-inspired Skeleton Loader
 */
function GitHubStatsSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-label="Loading GitHub data">
      {/* Header Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-850">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            <div className="w-32 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-48 h-3 rounded bg-zinc-150 dark:bg-zinc-850" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="w-28 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-100/50 dark:bg-zinc-900/40 space-y-2">
            <div className="w-16 h-3 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-10 h-6 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-20 h-2.5 rounded bg-zinc-150 dark:bg-zinc-850" />
          </div>
        ))}
      </div>

      {/* Repositories & Languages Skeleton */}
      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          <div className="md:col-span-7 space-y-3">
            <div className="w-36 h-3 rounded bg-zinc-200 dark:bg-zinc-800 mb-2" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-100/40 dark:bg-zinc-900/30 space-y-2">
                <div className="w-40 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-full h-3 rounded bg-zinc-150 dark:bg-zinc-850" />
                <div className="w-28 h-3 rounded bg-zinc-150 dark:bg-zinc-850" />
              </div>
            ))}
          </div>
          <div className="md:col-span-5 space-y-3">
            <div className="w-32 h-3 rounded bg-zinc-200 dark:bg-zinc-800 mb-2" />
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-100/40 dark:bg-zinc-900/30 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between">
                    <div className="w-16 h-3 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="w-8 h-3 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Reusable GitHubStats Component
 * 
 * Subscribes to the centralized useGitHubStats hook.
 * Strictly presents verified GitHub REST API metrics with 5-minute caching.
 * Provides skeleton loading states and non-blocking, state-aware error handling.
 */
export function GitHubStats({
  className = "",
  showRepositories = true,
  showLanguages = true,
  showActivity = true,
  limitRepos = 6,
  limitEvents = 5,
  compact = false,
}: GitHubStatsProps) {
  const { data, loading, refreshing, error, refresh, lastSyncedLabel } = useGitHubStats();

  // If initial load is still in flight and no data exists yet, show skeleton
  if (loading && !data) {
    return (
      <div className={`w-full ${className}`}>
        <GitHubStatsSkeleton compact={compact} />
      </div>
    );
  }

  // If API failed and no cached or fallback data is present
  if (!data) {
    return (
      <div className={`p-6 sm:p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-4 ${className}`}>
        <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-display">
            GitHub Telemetry Temporarily Unavailable
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            {error || "Unable to reach the GitHub REST API. Your connection or rate limit may be constrained."}
          </p>
        </div>
        <button
          onClick={() => void refresh(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Retrying..." : "Retry Connection"}</span>
        </button>
      </div>
    );
  }

  // Calculate language distribution percentages from owned repos
  const languageEntries = Object.entries(data.languages || {});
  const totalLangRepos = languageEntries.reduce((sum, [, count]) => sum + count, 0);
  const languageList = languageEntries
    .map(([lang, count]) => ({
      name: lang,
      count,
      percent: totalLangRepos > 0 ? Math.round((count / totalLangRepos) * 100) : 0,
      color: LANGUAGE_COLORS[lang] || "#94a3b8",
    }))
    .sort((a, b) => b.count - a.count);

  const displayRepos = (data.repositories || []).slice(0, limitRepos);
  const displayEvents = (data.recentActivity || []).slice(0, limitEvents);

  return (
    <div className={`space-y-6 font-sans ${className}`}>
      {/* State-aware soft banner if error occurs while cached data is displayed */}
      {error && (
        <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Displaying cached repository telemetry ({error})</span>
          </div>
          <button
            onClick={() => void refresh(true)}
            disabled={refreshing}
            className="font-medium underline hover:no-underline cursor-pointer disabled:opacity-50 shrink-0"
          >
            {refreshing ? "Retrying..." : "Retry Sync"}
          </button>
        </div>
      )}

      {/* Header Profile & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-850">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0">
            <Github className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white font-display leading-none">
                @{data.username}
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1">
              {data.name || "Sayam Mukherjee"} · {data.publicRepos} Public Repositories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
            {lastSyncedLabel}
          </span>
          <button
            onClick={() => void refresh(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-medium transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh GitHub telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Syncing..." : "Sync"}</span>
          </button>
          <a
            href={data.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <span>GitHub Profile</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Verified Core Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 text-center">
          <span className="text-[10px] text-zinc-500 uppercase font-mono block">PUBLIC REPOSITORIES</span>
          <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white block mt-1 font-display tabular-nums">
            {data.publicRepos}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
            Owned repositories
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 text-center">
          <span className="text-[10px] text-zinc-500 uppercase font-mono block">TOTAL STARS</span>
          <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 block mt-1 font-display tabular-nums">
            {data.totalStars}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
            Across owned projects
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 text-center">
          <span className="text-[10px] text-zinc-500 uppercase font-mono block">COMMUNITY FORKS</span>
          <span className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400 block mt-1 font-display tabular-nums">
            {data.totalForks}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
            Owned repository forks
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 text-center">
          <span className="text-[10px] text-zinc-500 uppercase font-mono block">NETWORK</span>
          <span className="text-xl sm:text-2xl font-bold text-cyan-600 dark:text-cyan-400 block mt-1 font-display tabular-nums">
            {data.followers} <span className="text-xs font-normal text-zinc-400">/ {data.following}</span>
          </span>
          <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
            Followers / Following
          </span>
        </div>
      </div>

      {!compact && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          {/* Repositories Column */}
          {showRepositories && (
            <div className={`${showLanguages || showActivity ? "lg:col-span-7" : "lg:col-span-12"} space-y-3`}>
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  Verified Public Repositories
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {displayRepos.length} projects
                </span>
              </div>

              <div className="space-y-2.5">
                {displayRepos.length === 0 ? (
                  <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 font-mono">
                    No repositories available.
                  </div>
                ) : (
                  displayRepos.map((repo: GitHubRepository) => (
                    <div
                      key={repo.id}
                      className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/40 hover:border-purple-500/40 dark:hover:border-purple-500/30 transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white font-mono flex items-center gap-1.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
                        >
                          <span>{repo.name}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <div className="flex items-center gap-2.5 text-[11px] font-mono text-zinc-500 shrink-0">
                          {repo.stargazers_count > 0 && (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <Star className="w-3 h-3 fill-current" />
                              <span>{repo.stargazers_count}</span>
                            </span>
                          )}
                          {repo.forks_count > 0 && (
                            <span className="flex items-center gap-1 text-purple-500">
                              <GitFork className="w-3 h-3" />
                              <span>{repo.forks_count}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {repo.description && (
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans line-clamp-2">
                          {repo.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-900/60">
                        <div className="flex items-center gap-1.5">
                          {repo.language && (
                            <>
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || "#94a3b8" }}
                              />
                              <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                                {repo.language}
                              </span>
                            </>
                          )}
                        </div>
                        {repo.pushed_at && (
                          <span className="text-[10px] text-zinc-500">
                            Updated {formatEventDate(repo.pushed_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Languages & Activity Column */}
          <div className={`${showRepositories ? "lg:col-span-5" : "lg:col-span-12"} space-y-6`}>
            {/* Languages Breakdown */}
            {showLanguages && (
              <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/40 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                  <span className="text-xs font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-500" />
                    Language Distribution
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Repository Primary
                  </span>
                </div>

                <div className="space-y-3">
                  {languageList.map((item) => (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-zinc-800 dark:text-zinc-200 font-medium">{item.name}</span>
                        </div>
                        <span className="text-zinc-500 tabular-nums">
                          {item.count} {item.count === 1 ? "repo" : "repos"} ({item.percent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-850 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.percent}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real Public Activity Log */}
            {showActivity && displayEvents.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950/40 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                  <span className="text-xs font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    Recent Public Activity
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Official REST Stream
                  </span>
                </div>

                <div className="space-y-3">
                  {displayEvents.map((event: GitHubEvent) => {
                    const { action, repo } = getEventSummary(event);
                    return (
                      <div key={event.id} className="flex items-start justify-between gap-3 text-xs font-mono">
                        <div className="space-y-0.5 min-w-0">
                          <div className="text-zinc-900 dark:text-zinc-200 font-medium truncate">
                            {action}
                          </div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                            {repo}
                          </div>
                        </div>
                        <span className="text-[10px] text-zinc-500 shrink-0 tabular-nums">
                          {formatEventDate(event.created_at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GitHubStats;
