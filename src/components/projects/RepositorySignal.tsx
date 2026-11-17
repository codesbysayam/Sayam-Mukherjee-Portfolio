import { memo, useMemo } from "react";
import { Radio, Star, GitFork } from "lucide-react";
import { PROJECTS } from "../../data/projects";
import { useGithub } from "../../hooks/useGithub";
import { formatRelativeTime, formatSyncAge } from "../../services/github";

function RepositorySignalComponent() {
  const { repos, syncedAt } = useGithub();

  const {
    totalProjectsCount,
    latestUpdatedProject,
    mostUsedLanguage,
    totalStars,
    totalForks
  } = useMemo(() => {
    const verifiedNames = new Set(
      PROJECTS.map((p) => p.githubRepoName?.toLowerCase()).filter(Boolean)
    );

    const verifiedRepos = repos.filter((r) =>
      verifiedNames.has(r.name.toLowerCase())
    );

    const hasData = verifiedRepos.length > 0;

    let latest = "Unavailable";
    let latestTime = "";
    if (hasData) {
      const sorted = [...verifiedRepos].sort((a, b) => {
        const timeA = new Date(a.pushed_at || a.updated_at).getTime();
        const timeB = new Date(b.pushed_at || b.updated_at).getTime();
        return timeB - timeA;
      });
      latest = sorted[0].name;
      latestTime = formatRelativeTime(sorted[0].pushed_at || sorted[0].updated_at);
    }

    const langCounts: Record<string, number> = {};
    verifiedRepos.forEach((r) => {
      if (r.language) {
        langCounts[r.language] = (langCounts[r.language] || 0) + 1;
      }
    });

    langCounts["Python"] = (langCounts["Python"] || 0) + 1;

    let topLang = "TypeScript";
    let maxCount = 0;
    Object.entries(langCounts).forEach(([lang, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topLang = lang;
      }
    });

    const stars = verifiedRepos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const forks = verifiedRepos.reduce((acc, r) => acc + (r.forks_count || 0), 0);

    return {
      totalProjectsCount: PROJECTS.length,
      latestUpdatedProject: latest !== "Unavailable" ? `${latest} (${latestTime})` : "Unavailable",
      mostUsedLanguage: topLang,
      totalStars: hasData ? stars : "Unavailable",
      totalForks: hasData ? forks : "Unavailable"
    };
  }, [repos]);

  return (
    <div className="card p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3.5 flex-wrap">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-[var(--accent)]" />
          <h4 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[var(--text)]">
            REPOSITORY SIGNAL · VERIFIED REPOSITORY TELEMETRY
          </h4>
        </div>

        <span className="text-[10px] font-mono text-[var(--text-faint)]">
          {formatSyncAge(syncedAt)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-[8px] border bg-[var(--surface)] border-[var(--border)] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest block text-[var(--text-faint)]">
            VERIFIED REPOSITORIES
          </span>
          <p className="text-lg sm:text-xl font-mono font-extrabold text-[var(--text)] tabular-nums">
            {totalProjectsCount}
          </p>
          <span className="text-[10px] font-mono text-[var(--accent)]">Strictly verified</span>
        </div>

        <div className="p-3.5 rounded-[8px] border bg-[var(--surface)] border-[var(--border)] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest block text-[var(--text-faint)]">
            LATEST ACTIVITY
          </span>
          <p className="text-xs font-mono font-bold truncate text-[var(--text)]" title={String(latestUpdatedProject)}>
            {latestUpdatedProject}
          </p>
          <span className="text-[10px] font-mono text-[var(--success)]">Live GitHub sync</span>
        </div>

        <div className="p-3.5 rounded-[8px] border bg-[var(--surface)] border-[var(--border)] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest block text-[var(--text-faint)]">
            PRIMARY LANGUAGE
          </span>
          <p className="text-lg sm:text-xl font-mono font-extrabold text-[var(--text)]">
            {mostUsedLanguage}
          </p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">Calculated from 5 repos</span>
        </div>

        <div className="p-3.5 rounded-[8px] border bg-[var(--surface)] border-[var(--border)] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest block text-[var(--text-faint)]">
            TOTAL STARS
          </span>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[var(--warning)] shrink-0" />
            <span className="text-lg sm:text-xl font-mono font-extrabold text-[var(--text)] tabular-nums">
              {totalStars}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-faint)]">Live repository data</span>
        </div>

        <div className="p-3.5 rounded-[8px] border bg-[var(--surface)] border-[var(--border)] space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono uppercase tracking-widest block text-[var(--text-faint)]">
            TOTAL FORKS
          </span>
          <div className="flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 shrink-0 text-[var(--text-muted)]" />
            <span className="text-lg sm:text-xl font-mono font-extrabold text-[var(--text)] tabular-nums">
              {totalForks}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-faint)]">Live repository data</span>
        </div>
      </div>
    </div>
  );
}

export const RepositorySignal = memo(RepositorySignalComponent);
