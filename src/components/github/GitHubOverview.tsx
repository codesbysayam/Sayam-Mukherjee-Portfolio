import { memo, useMemo } from "react";
import { ExternalLink, Calendar, Users, UserCheck, ShieldCheck, FolderGit2 } from "lucide-react";
import { GitHubStats } from "../../data/githubTypes";

interface GitHubOverviewProps {
  stats: GitHubStats;
}

export const GitHubOverview = memo(function GitHubOverview({ stats }: GitHubOverviewProps) {
  const formattedJoinedDate = useMemo(() => {
    try {
      if (stats.accountCreatedAt) {
        const d = new Date(stats.accountCreatedAt);
        return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      }
      return "Jun 2021";
    } catch {
      return "Jun 2021";
    }
  }, [stats.accountCreatedAt]);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={stats.avatarUrl}
              alt={stats.name || stats.username}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border border-white/[0.12] object-cover shadow-inner bg-zinc-800"
              loading="lazy"
              width={72}
              height={72}
            />
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center"
              title="Verified public GitHub account"
            >
              <ShieldCheck className="w-2.5 h-2.5 text-zinc-950" />
            </span>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-white font-display tracking-tight">
                {stats.name || "Sayam Mukherjee"}
              </h3>
              <span className="text-xs font-mono text-purple-400">@{stats.username}</span>
            </div>

            <p className="text-xs text-zinc-400 line-clamp-2 max-w-xl font-sans leading-relaxed">
              {stats.bio || "👨‍💻 B.Tech CSE (AI&ML) student at KIIT University · Exploring Python, Machine Learning, and Web Development · Building projects and learning by doing"}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-zinc-500" />
                <strong className="text-zinc-200 font-semibold">{stats.publicRepos}</strong> public repos
              </span>
              <span className="text-zinc-600 hidden sm:inline">&bull;</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                <strong className="text-zinc-200 font-semibold">{stats.followers}</strong> {stats.followers === 1 ? "follower" : "followers"}
              </span>
              <span className="text-zinc-600 hidden sm:inline">&bull;</span>
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-zinc-500" />
                <strong className="text-zinc-200 font-semibold">{stats.following}</strong> following
              </span>
              <span className="text-zinc-600 hidden sm:inline">&bull;</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Joined {formattedJoinedDate}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          <a
            href={stats.profileUrl || `https://github.com/${stats.username}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open GitHub Profile"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-mono text-xs font-semibold cursor-pointer group shadow-sm active:scale-95"
          >
            <span>Open GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
});

export default GitHubOverview;
