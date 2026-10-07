import { memo } from "react";
import { useGitHubStats } from "../hooks/useGitHubStats";
import { GitHubDataStatus } from "./github/GitHubDataStatus";
import { GitHubOverview } from "./github/GitHubOverview";
import { GitHubStats as GitHubMetricsCards } from "./github/GitHubStats";
import { GitHubContributionGraph } from "./github/GitHubContributionGraph";
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
    <div className="space-y-6 animate-pulse" aria-label="Loading GitHub data">
      {/* Status Bar Skeleton */}
      <div className="h-12 bg-zinc-900/60 rounded-2xl border border-white/[0.06]" />

      {/* Overview Skeleton */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.06] flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-40 bg-zinc-800 rounded" />
          <div className="h-3 w-64 bg-zinc-800/60 rounded" />
          <div className="h-3 w-48 bg-zinc-800/40 rounded" />
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-zinc-900/50 border border-white/[0.06] p-4 space-y-2">
            <div className="h-3 w-20 bg-zinc-800 rounded" />
            <div className="h-6 w-12 bg-zinc-700 rounded" />
          </div>
        ))}
      </div>

      {!compact && (
        <>
          <div className="h-44 rounded-2xl bg-zinc-900/40 border border-white/[0.06]" />
          <div className="h-32 rounded-2xl bg-zinc-900/40 border border-white/[0.06]" />
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
      <div className={`p-8 text-center rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-3 ${className}`}>
        <p className="text-sm font-mono text-zinc-300">GitHub repositories are temporarily unavailable.</p>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Could not establish connection to the GitHub API. Click below to retry.
        </p>
        <button
          type="button"
          onClick={() => refresh()}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-white transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Telemetry Data Source Status Indicator */}
      <GitHubDataStatus
        source={source}
        lastSyncedLabel={lastUpdated || "Latest synced data"}
        refreshing={refreshing}
        onRefresh={() => refresh()}
        rateLimitRemaining={rateLimitRemaining}
        rateLimitReset={rateLimitReset}
        error={error}
      />

      {/* 2. Public Profile Overview */}
      <GitHubOverview stats={data} />

      {/* 3. Core Verified Metrics Cards */}
      <GitHubMetricsCards stats={data} />

      {/* 4. Active Repositories List with Live Search, Tabs & Sorting */}
      {showRepositories && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="text-base font-bold text-white font-display tracking-tight">
              Public Repositories ({data.repositories.length})
            </h4>
            <span className="text-xs font-mono text-zinc-400">
              Direct official inventory from github.com/{data.username}
            </span>
          </div>

          <GitHubRepositories
            repositories={data.repositories}
            onRefresh={() => refresh(true)}
          />
        </div>
      )}

      {/* 5. Language Breakdown */}
      {showLanguages && (
        <GitHubLanguageBreakdown
          languageBytes={data.languageBytes}
          languageCounts={data.languageCounts}
        />
      )}

      {/* 6. Contribution Calendar (from GraphQL snapshot) */}
      {!compact && data.contributionCalendar && (
        <GitHubContributionGraph calendar={data.contributionCalendar} />
      )}

      {/* 7. Recent Public Activity Timeline */}
      {showActivity && data.recentActivity && data.recentActivity.length > 0 && (
        <GitHubActivity
          activity={data.recentActivity}
          limit={limitEvents}
        />
      )}
    </div>
  );
});

export default GitHubStats;
