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
      accent: "text-blue-400",
    },
    {
      id: "original",
      label: "Original Repositories",
      value: metrics.originalRepos,
      subtext: "Authored by codesbysayam",
      icon: CheckCircle2,
      accent: "text-emerald-400",
    },
    {
      id: "stars",
      label: "Total Stars Earned",
      value: metrics.totalStars,
      subtext: "Across original repositories",
      icon: Star,
      accent: "text-amber-400",
    },
    {
      id: "forks",
      label: "Total Forks",
      value: metrics.totalForks,
      subtext: "Community forks of original code",
      icon: GitFork,
      accent: "text-purple-400",
    },
    ...(typeof metrics.contributions === "number"
      ? [
          {
            id: "contributions",
            label: "Past Year Contributions",
            value: metrics.contributions,
            subtext: "GitHub contribution graph total",
            icon: Activity,
            accent: "text-cyan-400",
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
            className="p-4 sm:p-5 rounded-2xl bg-zinc-900/40 border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-mono text-zinc-400">
                {card.label}
              </span>
              <Icon className={`w-4 h-4 ${card.accent}`} />
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
                {card.value}
              </div>
              <div className="text-[11px] text-zinc-400 font-sans truncate">
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
