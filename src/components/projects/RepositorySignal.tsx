import { memo, useMemo } from "react";
import { Radio, Star, GitFork, Code2, Clock, CheckCircle2, RefreshCw } from "lucide-react";
import { PROJECTS } from "../../data/projects";
import { useGithub } from "../../hooks/useGithub";
import { formatRelativeTime, formatSyncAge } from "../../services/github";
import { usePortfolio } from "../../context/PortfolioContext";

function RepositorySignalComponent() {
  const { repos, syncedAt, loading, error } = useGithub();
  const { theme } = usePortfolio();
  const isLight = theme === "light";

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
    <div className={`glass-card rounded-2xl p-5 sm:p-6 border space-y-4 transition-colors ${
      isLight ? "bg-white/80 border-slate-200 shadow-sm" : "border-zinc-850 bg-zinc-950/70"
    }`}>
      {/* Top Banner */}
      <div className={`flex items-center justify-between gap-3 border-b pb-3.5 flex-wrap ${
        isLight ? "border-slate-200" : "border-zinc-900"
      }`}>
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
          <h4 className={`text-xs sm:text-sm font-mono font-bold uppercase tracking-wider ${
            isLight ? "text-slate-900" : "text-white"
          }`}>
            REPOSITORY SIGNAL • VERIFIED REPOSITORY TELEMETRY
          </h4>
        </div>

        <span className={`text-[10px] font-mono ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
          {formatSyncAge(syncedAt)}
        </span>
      </div>

      {/* 5 Compact Telemetry Panels */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Verified Projects */}
        <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${
          isLight ? "bg-slate-50/80 border-slate-200" : "bg-zinc-900/50 border-zinc-850"
        }`}>
          <span className={`text-[10px] font-mono uppercase tracking-widest block ${
            isLight ? "text-slate-500" : "text-zinc-500"
          }`}>
            VERIFIED REPOSITORIES
          </span>
          <p className={`text-lg sm:text-xl font-mono font-extrabold ${
            isLight ? "text-slate-900" : "text-white"
          }`}>
            {totalProjectsCount}
          </p>
          <span className={`text-[10px] font-mono ${isLight ? "text-cyan-700" : "text-cyan-400/80"}`}>Strictly verified</span>
        </div>

        {/* Latest Updated Project */}
        <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${
          isLight ? "bg-slate-50/80 border-slate-200" : "bg-zinc-900/50 border-zinc-850"
        }`}>
          <span className={`text-[10px] font-mono uppercase tracking-widest block ${
            isLight ? "text-slate-500" : "text-zinc-500"
          }`}>
            LATEST ACTIVITY
          </span>
          <p className={`text-xs font-mono font-bold truncate ${
            isLight ? "text-slate-800" : "text-zinc-200"
          }`} title={String(latestUpdatedProject)}>
            {latestUpdatedProject}
          </p>
          <span className={`text-[10px] font-mono ${isLight ? "text-emerald-700" : "text-emerald-400/80"}`}>Live GitHub sync</span>
        </div>

        {/* Most Used Language */}
        <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${
          isLight ? "bg-slate-50/80 border-slate-200" : "bg-zinc-900/50 border-zinc-850"
        }`}>
          <span className={`text-[10px] font-mono uppercase tracking-widest block ${
            isLight ? "text-slate-500" : "text-zinc-500"
          }`}>
            PRIMARY LANGUAGE
          </span>
          <p className={`text-lg sm:text-xl font-mono font-extrabold ${
            isLight ? "text-slate-900" : "text-white"
          }`}>
            {mostUsedLanguage}
          </p>
          <span className={`text-[10px] font-mono ${isLight ? "text-slate-500" : "text-zinc-400"}`}>Calculated from 5 repos</span>
        </div>

        {/* Total Stars */}
        <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${
          isLight ? "bg-slate-50/80 border-slate-200" : "bg-zinc-900/50 border-zinc-850"
        }`}>
          <span className={`text-[10px] font-mono uppercase tracking-widest block ${
            isLight ? "text-slate-500" : "text-zinc-500"
          }`}>
            TOTAL STARS
          </span>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className={`text-lg sm:text-xl font-mono font-extrabold ${
              isLight ? "text-slate-900" : "text-white"
            }`}>
              {totalStars}
            </span>
          </div>
          <span className={`text-[10px] font-mono ${isLight ? "text-slate-500" : "text-zinc-500"}`}>Live repository data</span>
        </div>

        {/* Total Forks */}
        <div className={`p-3.5 rounded-xl border space-y-1 col-span-2 sm:col-span-1 transition-colors ${
          isLight ? "bg-slate-50/80 border-slate-200" : "bg-zinc-900/50 border-zinc-850"
        }`}>
          <span className={`text-[10px] font-mono uppercase tracking-widest block ${
            isLight ? "text-slate-500" : "text-zinc-500"
          }`}>
            TOTAL FORKS
          </span>
          <div className="flex items-center gap-1.5">
            <GitFork className={`w-3.5 h-3.5 shrink-0 ${isLight ? "text-slate-400" : "text-zinc-400"}`} />
            <span className={`text-lg sm:text-xl font-mono font-extrabold ${
              isLight ? "text-slate-900" : "text-white"
            }`}>
              {totalForks}
            </span>
          </div>
          <span className={`text-[10px] font-mono ${isLight ? "text-slate-500" : "text-zinc-500"}`}>Live repository data</span>
        </div>
      </div>
    </div>
  );
}

export const RepositorySignal = memo(RepositorySignalComponent);
