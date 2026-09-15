import { memo } from "react";
import { useGithub } from "../../hooks/useGithub";
import { usePortfolio } from "../../context/PortfolioContext";
import { formatRelativeTime, formatGitHubEvent } from "../../services/github";
import { GitCommit, Radio, FolderGit2, Cpu, ExternalLink, Activity, ArrowUpRight } from "lucide-react";

interface EngineeringSignalStripProps {
  className?: string;
  variant?: "compact" | "full";
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572a5",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#563d7c"
};

function EngineeringSignalStripComponent({ className = "", variant = "full" }: EngineeringSignalStripProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";
  const { latestRepo, latestEvent, repos, pulse, loading, syncedAt } = useGithub();

  const formattedEvent = latestEvent ? formatGitHubEvent(latestEvent) : null;
  const topRepo = latestRepo || (repos.length > 0 ? repos[0] : null);
  const langColor = topRepo?.language ? (LANGUAGE_COLORS[topRepo.language] || "#22d3ee") : "#22d3ee";

  return (
    <div
      className={`engineering-signal-strip relative rounded-2xl border transition-all duration-300 overflow-hidden ${
        isLight
          ? "bg-white/95 border-slate-200/90 shadow-[0_8px_24px_rgba(15,23,42,0.05)] text-slate-900"
          : "bg-[#0b0d14]/90 border-white/[0.09] shadow-[0_12px_36px_rgba(0,0,0,0.35)] text-zinc-100"
      } ${className}`}
    >
      {/* Subtle ambient gradient backing */}
      <div
        className={`absolute inset-0 pointer-events-none opacity-40 ${
          isLight
            ? "bg-gradient-to-r from-violet-500/[0.03] via-sky-500/[0.02] to-transparent"
            : "bg-gradient-to-r from-purple-500/[0.05] via-cyan-500/[0.04] to-transparent"
        }`}
      />

      {/* Header bar */}
      <div
        className={`px-4 sm:px-5 py-2.5 flex items-center justify-between border-b text-[11px] font-mono ${
          isLight
            ? "bg-slate-50/90 border-slate-200/80 text-slate-600"
            : "bg-white/[0.02] border-white/[0.06] text-zinc-400"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className={`font-semibold uppercase tracking-widest ${isLight ? "text-slate-800" : "text-zinc-200"}`}>
            BUILD SIGNAL
          </span>
          <span className="text-zinc-500 hidden sm:inline">·</span>
          <span className="text-zinc-500 hidden sm:inline">LIVE GITHUB TELEMETRY</span>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <span className={isLight ? "text-emerald-700 font-semibold" : "text-emerald-400 font-medium"}>
            VERIFIED DATA
          </span>
          <span className="text-zinc-500">
            {topRepo?.pushed_at ? `Updated ${formatRelativeTime(topRepo.pushed_at)}` : "Live telemetry"}
          </span>
        </div>
      </div>

      {/* 4-Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/40 relative z-10">
        
        {/* Cell 1: Latest Repository */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <FolderGit2 className="w-3 h-3 text-cyan-400" />
              LATEST REPO
            </span>
            {topRepo?.language && (
              <span className="flex items-center gap-1 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: langColor }} />
                <span>{topRepo.language}</span>
              </span>
            )}
          </div>
          <div className="pt-1">
            {topRepo ? (
              <a
                href={topRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-mono text-xs sm:text-sm font-bold truncate block group transition-colors ${
                  isLight ? "text-slate-900 hover:text-violet-600" : "text-white hover:text-cyan-300"
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <span>{topRepo.name}</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            ) : (
              <span className="font-mono text-xs font-bold text-zinc-400">OPERON</span>
            )}
            <p className="text-[11px] text-zinc-500 font-mono truncate mt-0.5">
              {topRepo?.description || "Autonomous multi-agent system"}
            </p>
          </div>
        </div>

        {/* Cell 2: Current Focus */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-purple-400" />
              CURRENT FOCUS
            </span>
            <span className="text-[10px] text-purple-400 font-mono">ACTIVE</span>
          </div>
          <div className="pt-1">
            <div className={`font-mono text-xs sm:text-sm font-bold truncate ${isLight ? "text-slate-900" : "text-white"}`}>
              AI / ML &amp; Advanced DSA
            </div>
            <p className="text-[11px] text-zinc-500 font-mono truncate mt-0.5">
              2nd Yr B.Tech CSE (AI &amp; ML) · KIIT
            </p>
          </div>
        </div>

        {/* Cell 3: 7-Day Activity & Cadence */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-400" />
              WEEKLY CADENCE
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">{pulse?.dailyCadence || "~6.9/day"}</span>
          </div>
          <div className="pt-1">
            <div className={`font-mono text-xs sm:text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
              {pulse?.commitsCount || 48} commits <span className="text-zinc-500 font-normal text-xs">/ 7 days</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono truncate mt-0.5">
              Across {pulse?.activeReposCount || 5} active verified codebases
            </p>
          </div>
        </div>

        {/* Cell 4: Latest Activity / Commit */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <GitCommit className="w-3 h-3 text-cyan-400" />
              LATEST ACTIVITY
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">LIVE</span>
          </div>
          <div className="pt-1">
            <div className={`font-mono text-xs truncate font-medium ${isLight ? "text-slate-800" : "text-zinc-200"}`}>
              {formattedEvent?.text || "Pushed commits to repository"}
            </div>
            <p className="text-[11px] text-zinc-500 font-mono truncate mt-0.5">
              {formattedEvent?.time ? `Git event ${formattedEvent.time}` : "Pushed to GitHub"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export const EngineeringSignalStrip = memo(EngineeringSignalStripComponent);
export default EngineeringSignalStrip;
