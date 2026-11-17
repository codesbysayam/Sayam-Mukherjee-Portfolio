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
    <div
      className="card p-5 sm:p-6"
      style={{
        backgroundColor: "var(--surface-2)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={stats.avatarUrl}
              alt={stats.name || stats.username}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-[10px] border object-cover"
              style={{
                borderColor: "var(--border-strong)",
                backgroundColor: "var(--surface)",
              }}
              loading="lazy"
              width={72}
              height={72}
            />
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
              style={{
                backgroundColor: "#C7E34A",
                borderColor: "var(--surface-2)",
                color: "#20231D",
              }}
              title="Verified public GitHub account"
            >
              <ShieldCheck className="w-3 h-3" />
            </span>
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text)] font-display tracking-tight">
                {stats.name || "Sayam Mukherjee"}
              </h3>
              <span className="text-xs font-mono text-[var(--accent)]">
                @{stats.username}
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)] line-clamp-2 max-w-xl font-sans leading-relaxed">
              {stats.bio ||
                "B.Tech CSE (AI&ML) student at KIIT University · Exploring Python, Machine Learning, and Web Development · Building projects and learning by doing"}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                <strong className="text-[var(--text)] font-semibold tabular-nums">
                  {stats.publicRepos}
                </strong>{" "}
                public repos
              </span>
              <span className="text-[var(--text-faint)] hidden sm:inline">&bull;</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                <strong className="text-[var(--text)] font-semibold tabular-nums">
                  {stats.followers}
                </strong>{" "}
                {stats.followers === 1 ? "follower" : "followers"}
              </span>
              <span className="text-[var(--text-faint)] hidden sm:inline">&bull;</span>
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                <strong className="text-[var(--text)] font-semibold tabular-nums">
                  {stats.following}
                </strong>{" "}
                following
              </span>
              <span className="text-[var(--text-faint)] hidden sm:inline">&bull;</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--text-faint)]" />
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
            className="btn btn-primary w-full sm:w-auto text-xs font-mono"
          >
            <span>Open GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
});

export default GitHubOverview;
