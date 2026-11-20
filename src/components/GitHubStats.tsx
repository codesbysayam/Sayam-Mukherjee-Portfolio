import { memo } from "react";
import { useGitHubStats } from "../hooks/useGitHubStats";
import { GitHubDataStatus } from "./github/GitHubDataStatus";
import { GitHubOverview } from "./github/GitHubOverview";
import { GitHubStats as GitHubMetricsCards } from "./github/GitHubStats";
import { GitHubStatsHeatmap } from "./github/GitHubStatsHeatmap";
import { GitHubLanguageBreakdown } from "./github/GitHubLanguageBreakdown";
import { GitHubRepositories } from "./github/GitHubRepositories";
import { GitHubActivity } from "./github/GitHubActivity";
import { isValidGitHubStats } from "../data/githubTypes";

export interface GitHubStatsProps {
  className?: string;
  showRepositories?: boolean;
  showLanguages?: boolean;
  showActivity?: boolean;
  limitRepos?: number;
  limitEvents?: number;
  compact?: boolean;
}

function GitHubStatsSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div className="space-y-6" aria-label="Loading GitHub data">
      <div
        className="h-12 rounded-[10px] border"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      />

      <div
        className="p-6 rounded-[10px] border flex items-center gap-4"
        style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}
      >
        <div
          className="w-16 h-16 rounded-[10px] shrink-0"
          style={{ backgroundColor: "var(--surface)" }}
        />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-40 rounded" style={{ backgroundColor: "var(--surface)" }} />
          <div className="h-3 w-64 rounded" style={{ backgroundColor: "var(--surface)" }} />
          <div className="h-3 w-48 rounded" style={{ backgroundColor: "var(--surface)" }} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-[10px] border p-4 space-y-2"
            style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}
          >
            <div className="h-3 w-20 rounded" style={{ backgroundColor: "var(--surface)" }} />
            <div className="h-6 w-12 rounded" style={{ backgroundColor: "var(--surface)" }} />
          </div>
        ))}
      </div>

      {!compact && (
        <>
          <div
            className="h-44 rounded-[10px] border"
            style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}
          />
          <div
            className="h-32 rounded-[10px] border"
            style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}
          />
        </>
      )}
    </div>
  );
}

export const GitHubStats = memo(function GitHubStats({
  className = "",
  showRepositories = true,
  showLanguages = true,
  showActivity = true,
  limitEvents = 8,
  compact = false,
}: GitHubStatsProps) {
  const {
    data,
    loading,
    refreshing,
    error,
    source,
    lastUpdated,
    rateLimitRemaining,
    rateLimitReset,
    refresh,
  } = useGitHubStats();

  if (loading && !data) {
    return (
      <div className={`space-y-6 ${className}`}>
        <GitHubStatsSkeleton compact={compact} />
      </div>
    );
  }

  if (!data || !isValidGitHubStats(data)) {
    return (
      <div
        className={`card p-8 text-center space-y-3 ${className}`}
        style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}
      >
        <p className="text-sm font-mono text-[var(--text)]">
          GitHub repositories are temporarily unavailable.
        </p>
        <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
          Could not establish connection to the GitHub API. Click below to retry.
        </p>
        <button
          type="button"
          onClick={() => refresh()}
          className="btn btn-primary text-xs font-mono"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <GitHubDataStatus
        source={source}
        lastSyncedLabel={lastUpdated || "Latest synced data"}
        refreshing={refreshing}
        onRefresh={() => refresh()}
        rateLimitRemaining={rateLimitRemaining}
        rateLimitReset={rateLimitReset}
        error={error}
      />

      <GitHubOverview stats={data} />

      <GitHubMetricsCards stats={data} />

      {showRepositories && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="text-base font-bold text-[var(--text)] font-display tracking-tight">
              Public Repositories ({data.repositories.length})
            </h4>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Direct official inventory from github.com/{data.username}
            </span>
          </div>

          <GitHubRepositories
            repositories={data.repositories}
            onRefresh={() => refresh(true)}
          />
        </div>
      )}

      {showLanguages && (
        <GitHubLanguageBreakdown
          languageBytes={data.languageBytes}
          languageCounts={data.languageCounts}
        />
      )}

      {!compact && data.contributionCalendar && (
        <GitHubStatsHeatmap contributions={data.contributionCalendar} />
      )}

      {showActivity && data.recentActivity && data.recentActivity.length > 0 && (
        <GitHubActivity activity={data.recentActivity} limit={limitEvents} />
      )}
    </div>
  );
});

export default GitHubStats;
