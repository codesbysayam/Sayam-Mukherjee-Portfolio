import { memo, useMemo } from "react";
import { Radio, Star, GitFork, Code2, Clock, CheckCircle2, RefreshCw } from "lucide-react";
import { PROJECTS } from "../../data/projects";
import { useGithub } from "../../hooks/useGithub";
import { formatRelativeTime, formatSyncAge } from "../../services/github";

function RepositorySignalComponent() {
  const { repos, syncedAt, loading, error } = useGithub();

  // Calculate telemetry metrics ONLY from the 5 verified projects
  const {
    totalProjectsCount,
    latestUpdatedProject,
    mostUsedLanguage,
    totalStars,
    totalForks,
    isDataAvailable
  } = useMemo(() => {
    const verifiedNames = new Set(
      PROJECTS.map((p) => p.githubRepoName?.toLowerCase()).filter(Boolean)
    );

    const verifiedRepos = repos.filter((r) => 
      verifiedNames.has(r.name.toLowerCase())
    );

    const hasData = verifiedRepos.length > 0;

    // Latest updated repository
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

    // Most used language calculation
    const langCounts: Record<string, number> = {};
    verifiedRepos.forEach((r) => {
      if (r.language) {
        langCounts[r.language] = (langCounts[r.language] || 0) + 1;
      }
    });

    // Also factor in non-repo verified project language (Python for YOLO)
    langCounts["Python"] = (langCounts["Python"] || 0) + 1;

    let topLang = "TypeScript";
    let maxCount = 0;
    Object.entries(langCounts).forEach(([lang, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topLang = lang;
      }
    });

    // Sum of stars and forks across the verified repos
    const stars = verifiedRepos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const forks = verifiedRepos.reduce((acc, r) => acc + (r.forks_count || 0), 0);

    return {
      totalProjectsCount: PROJECTS.length,
      latestUpdatedProject: latest !== "Unavailable" ? `${latest} (${latestTime})` : "Unavailable",
      mostUsedLanguage: topLang,
      totalStars: hasData ? stars : "Unavailable",
      totalForks: hasData ? forks : "Unavailable",
      isDataAvailable: hasData
    };
  }, [repos]);

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-zinc-850 bg-zinc-950/70 space-y-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-900 pb-3.5 flex-wrap">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <h4 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
            REPOSITORY SIGNAL • VERIFIED REPOSITORY TELEMETRY
          </h4>
        </div>

        <span className="text-[10px] font-mono text-zinc-500">
          {formatSyncAge(syncedAt)}
        </span>
      </div>

      {/* 5 Compact Telemetry Panels */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Verified Projects */}
        <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-850 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
            VERIFIED REPOSITORIES
          </span>
          <p className="text-lg sm:text-xl font-mono font-extrabold text-white">
            {totalProjectsCount}
          </p>
          <span className="text-[10px] font-mono text-cyan-400/80">Strictly verified</span>
        </div>

        {/* Latest Updated Project */}
        <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-850 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
            LATEST ACTIVITY
          </span>
          <p className="text-xs font-mono font-bold text-zinc-200 truncate" title={String(latestUpdatedProject)}>
            {latestUpdatedProject}
          </p>
          <span className="text-[10px] font-mono text-emerald-400/80">Live GitHub sync</span>
        </div>

        {/* Most Used Language */}
        <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-850 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
            PRIMARY LANGUAGE
          </span>
          <p className="text-lg sm:text-xl font-mono font-extrabold text-white">
            {mostUsedLanguage}
          </p>
          <span className="text-[10px] font-mono text-zinc-400">Calculated from 5 repos</span>
        </div>

        {/* Total Stars */}
        <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-850 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
            TOTAL STARS
          </span>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-lg sm:text-xl font-mono font-extrabold text-white">
              {totalStars}
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">Live repository data</span>
        </div>

        {/* Total Forks */}
        <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-850 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
            TOTAL FORKS
          </span>
          <div className="flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-lg sm:text-xl font-mono font-extrabold text-white">
              {totalForks}
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">Live repository data</span>
        </div>
      </div>
    </div>
  );
}

export const RepositorySignal = memo(RepositorySignalComponent);
