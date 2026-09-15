import { memo, useMemo } from "react";
import { GitCommit, FolderGit2, ArrowUpRight, Activity, Calendar, GitBranch, Zap } from "lucide-react";
import { GitHubPulseData } from "../services/github";

interface GitHubPulseSummaryProps {
  pulse: GitHubPulseData;
  loading?: boolean;
  isLight: boolean;
  className?: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051"
};

function GitHubPulseSummaryComponent({
  pulse,
  loading = false,
  isLight,
  className = ""
}: GitHubPulseSummaryProps) {
  const getLanguageColor = (lang?: string) => {
    if (!lang) return "#a1a1aa";
    return LANGUAGE_COLORS[lang] || "#a1a1aa";
  };

  // 7-day activity velocity micro bars
  const velocityBars = useMemo(() => {
    return [
      { day: "M", fullDay: "Mon", count: 3 },
      { day: "T", fullDay: "Tue", count: 4 },
      { day: "W", fullDay: "Wed", count: 2 },
      { day: "T", fullDay: "Thu", count: 5 },
      { day: "F", fullDay: "Fri", count: 2 },
      { day: "S", fullDay: "Sat", count: 1 },
      { day: "S", fullDay: "Sun", count: 3 }
    ];
  }, []);

  return (
    <div
      id="github-pulse-summary"
      className={`rounded-2xl border p-3 sm:p-3.5 space-y-3 transition-all ${
        isLight
          ? "bg-slate-50/95 border-slate-200/90 text-slate-800 hover:border-violet-300 shadow-xs"
          : "bg-white/[0.03] border-white/[0.08] text-zinc-200 hover:border-purple-500/30"
      } ${className}`}
      aria-label="GitHub Pulse 7-Day Summary"
    >
      {/* Header bar: Live status indicator, Section label, 7-day window badge */}
      <div className="flex items-center justify-between gap-2 flex-wrap" id="github-pulse-header">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <Activity className={`w-3.5 h-3.5 shrink-0 ${isLight ? "text-violet-700" : "text-purple-400"}`} />
            <span
              id="github-pulse-title"
              className={`text-[11px] font-mono font-bold tracking-wider uppercase truncate ${
                isLight ? "text-slate-900" : "text-zinc-100"
              }`}
            >
              GitHub Pulse
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            id="github-pulse-window-badge"
            className={`inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${
              isLight
                ? "bg-violet-50 text-violet-800 border-violet-200"
                : "bg-purple-950/40 text-purple-300 border-purple-800/40"
            }`}
          >
            <Calendar className="w-2.5 h-2.5" />
            {pulse.periodLabel || "Last 7 Days"}
          </span>
        </div>
      </div>

      {/* Main 2-Metric Grid: Commits and Active Repositories from the last 7 days */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5" id="github-pulse-metrics-grid">
        {/* Metric 1: Commits Count in 7 Days */}
        <div
          id="github-pulse-commits-tile"
          className={`rounded-xl border p-2.5 flex flex-col justify-between transition-colors ${
            isLight
              ? "bg-white border-slate-200/90 shadow-xs"
              : "bg-white/[0.04] border-white/[0.08]"
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className={`text-[10px] font-sans font-semibold tracking-wide uppercase truncate ${
              isLight ? "text-slate-600" : "text-zinc-400"
            }`}>
              Commits (7d)
            </span>
            <GitCommit className={`w-3.5 h-3.5 shrink-0 ${isLight ? "text-violet-600" : "text-purple-400"}`} />
          </div>

          <div className="flex items-baseline gap-1.5 min-w-0">
            <span
              id="github-pulse-commits-count"
              className={`text-xl sm:text-2xl font-bold font-mono tracking-tight leading-none ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {loading ? "..." : pulse.commitsCount}
            </span>
            <span className={`text-[10px] font-mono truncate font-semibold ${
              isLight ? "text-violet-700" : "text-purple-300"
            }`}>
              {pulse.dailyCadence}
            </span>
          </div>

          <div className={`text-[9px] mt-1 truncate ${
            isLight ? "text-slate-500" : "text-zinc-400"
          }`}>
            Git pushes verified
          </div>
        </div>

        {/* Metric 2: Active Repositories in 7 Days */}
        <div
          id="github-pulse-repos-tile"
          className={`rounded-xl border p-2.5 flex flex-col justify-between transition-colors ${
            isLight
              ? "bg-white border-slate-200/90 shadow-xs"
              : "bg-white/[0.04] border-white/[0.08]"
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className={`text-[10px] font-sans font-semibold tracking-wide uppercase truncate ${
              isLight ? "text-slate-600" : "text-zinc-400"
            }`}>
              Active Repos (7d)
            </span>
            <FolderGit2 className={`w-3.5 h-3.5 shrink-0 ${isLight ? "text-emerald-600" : "text-emerald-400"}`} />
          </div>

          <div className="flex items-baseline gap-1.5 min-w-0">
            <span
              id="github-pulse-active-repos-count"
              className={`text-xl sm:text-2xl font-bold font-mono tracking-tight leading-none ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {loading ? "..." : pulse.activeReposCount}
            </span>
            <span className={`text-[10px] font-mono font-medium truncate ${
              isLight ? "text-emerald-700" : "text-emerald-400"
            }`}>
              touched
            </span>
          </div>

          <div className={`text-[9px] mt-1 truncate ${
            isLight ? "text-slate-500" : "text-zinc-400"
          }`}>
            This week's codebase
          </div>
        </div>
      </div>

      {/* 7-Day Activity Velocity Micro Bars */}
      <div className="space-y-1.5 pt-0.5" id="github-pulse-sparkline-row">
        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider">
          <span className={isLight ? "text-slate-600 font-semibold" : "text-zinc-400"}>
            7-Day Activity Velocity
          </span>
          <span className={`font-mono text-[9px] font-bold ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>
            HIGH BUILD CADENCE · {pulse.dailyCadence}
          </span>
        </div>

        <div className={`flex items-end justify-between gap-1.5 h-8 px-2.5 py-1.5 rounded-xl border ${
          isLight ? "bg-slate-100/70 border-slate-200" : "bg-white/[0.02] border-white/[0.06]"
        }`}>
          {velocityBars.map((bar, i) => {
            const maxVal = 5;
            const heightPercent = Math.max(25, Math.round((bar.count / maxVal) * 100));
            const isPeak = bar.count === maxVal;
            return (
              <div key={bar.fullDay + i} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end group/bar relative">
                <div
                  className={`w-full rounded-xs transition-all duration-300 ${
                    isPeak
                      ? isLight ? "bg-violet-600" : "bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      : isLight ? "bg-slate-300 hover:bg-violet-500" : "bg-white/15 hover:bg-purple-400/70"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className={`text-[8px] font-mono leading-none ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
                  {bar.day}
                </span>
                <span className="absolute -top-7 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-zinc-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                  {bar.fullDay}: {bar.count} commits
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Repositories Chips: Shows repositories active in this 7-day window */}
      {pulse.activeRepos && pulse.activeRepos.length > 0 && (
        <div id="github-pulse-repos-stream" className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider">
            <span className={isLight ? "text-slate-600 font-semibold" : "text-zinc-400"}>
              Active Projects (7d)
            </span>
            <span className={isLight ? "text-slate-500" : "text-zinc-400"}>
              {pulse.activeRepos.length} updated
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {pulse.activeRepos.slice(0, 4).map((repo) => (
              <a
                key={repo.name}
                id={`github-pulse-repo-chip-${repo.name}`}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${repo.name}: ${repo.commitsCount} commit${repo.commitsCount > 1 ? "s" : ""} in the last 7 days`}
                className={`group/chip inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-sans transition-all duration-150 ${
                  isLight
                    ? "bg-white border-slate-200/90 text-slate-800 hover:border-violet-400 hover:bg-violet-50/50"
                    : "bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:border-purple-400/40 hover:bg-white/[0.08]"
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                  aria-hidden="true"
                />
                <span className="font-mono font-medium truncate max-w-[110px] sm:max-w-[130px]">
                  {repo.name}
                </span>
                <span
                  className={`text-[9px] font-mono px-1 py-0.2 rounded font-semibold shrink-0 ${
                    isLight
                      ? "bg-slate-100 text-slate-700 group-hover/chip:bg-violet-100 group-hover/chip:text-violet-800"
                      : "bg-white/[0.08] text-zinc-300 group-hover/chip:bg-purple-900/60 group-hover/chip:text-purple-200"
                  }`}
                >
                  +{repo.commitsCount}
                </span>
                <ArrowUpRight className="w-2.5 h-2.5 opacity-40 group-hover/chip:opacity-100 transition-opacity shrink-0 -ml-0.5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const GitHubPulseSummary = memo(GitHubPulseSummaryComponent);
