import { memo, useMemo } from "react";
import { FolderGit2, Star, GitFork, Activity, CheckCircle2 } from "lucide-react";
import { GitHubStats as IGitHubStats } from "../../data/githubTypes";

interface GitHubStatsProps {
  stats: IGitHubStats;
}

export const GitHubStats = memo(function GitHubStats({ stats }: GitHubStatsProps) {
  const metrics = useMemo(() => {
    const repos = stats.repositories || [];
    const originalRepos = repos.filter((r) => !r.fork && !r.isFork);
    const totalStars = originalRepos.reduce(
      (sum, r) => sum + (r.stargazers_count ?? r.stars ?? 0),
      0
    );
    const totalForks = originalRepos.reduce(
      (sum, r) => sum + (r.forks_count ?? r.forks ?? 0),
      0
    );

    return {
      publicRepos: stats.publicRepos || repos.length,
      originalRepos: originalRepos.length,
      totalStars,
      totalForks,
      contributions: stats.contributionCalendar?.totalContributions,
    };
  }, [stats]);

  const cards = [
    {
      id: "repos",
      label: "Public Repositories",
      value: metrics.publicRepos,
      subtext: `${metrics.originalRepos} original repositories`,
      icon: FolderGit2,
    },
    {
      id: "original",
      label: "Original Repositories",
      value: metrics.originalRepos,
      subtext: "Authored by codesbysayam",
      icon: CheckCircle2,
    },
    {
      id: "stars",
      label: "Total Stars Earned",
      value: metrics.totalStars,
      subtext: "Across original repositories",
      icon: Star,
    },
    {
      id: "forks",
      label: "Total Forks",
      value: metrics.totalForks,
      subtext: "Community forks of original code",
      icon: GitFork,
    },
    ...(typeof metrics.contributions === "number"
      ? [
          {
            id: "contributions",
            label: "Past Year Contributions",
            value: metrics.contributions,
            subtext: "GitHub contribution graph total",
            icon: Activity,
          },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="card p-4 sm:p-5 flex flex-col justify-between"
            style={{
              backgroundColor: "var(--surface-2)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between pb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                {card.label}
              </span>
              <Icon className="w-4 h-4 text-[var(--accent)] shrink-0" />
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-display tabular-nums tracking-tight">
                {card.value}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] font-sans truncate">
                {card.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default GitHubStats;
