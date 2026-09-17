import { memo } from "react";
import { ExternalLink, RefreshCw, Radio, Terminal, Sparkles, CheckCircle2 } from "lucide-react";
import { useGithub } from "../../hooks/useGithub";
import { formatRelativeTime, formatSyncAge } from "../../services/github";

function EngineeringSnapshotComponent() {
  const { 
    repos, 
    syncedAt, 
    loading, 
    refresh 
  } = useGithub();

  // Find the latest updated verified project repo or top repo
  const latestRepo = repos.length > 0 ? repos[0] : null;

  return (
    <div className="glass-card rounded-2xl p-5 border border-zinc-850 hover:border-zinc-750 transition-all duration-300 flex flex-col justify-between space-y-5 h-full relative overflow-hidden bg-zinc-950/70 shadow-sm">
      {/* Subtle top indicator bar */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-900 pb-3.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="text-[11px] font-mono font-semibold tracking-wider text-zinc-300 uppercase">
            ENGINEERING SNAPSHOT
          </span>
        </div>

        {/* Live sync age badge */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
          <span>{formatSyncAge(syncedAt)}</span>
          <button
            onClick={refresh}
            disabled={loading}
            title="Refresh GitHub telemetry"
            className="p-1 text-zinc-500 hover:text-cyan-300 rounded transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin text-cyan-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Current Focus Section */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold block">
          CURRENT FOCUS
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-850/70 text-xs text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
            <span className="font-mono text-[11px] truncate">AI / ML</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-850/70 text-xs text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
            <span className="font-mono text-[11px] truncate">Full-Stack Dev</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-850/70 text-xs text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
            <span className="font-mono text-[11px] truncate">Advanced DSA</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-850/70 text-xs text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-mono text-[11px] truncate">System Arch</span>
          </div>
        </div>
      </div>

      {/* Active Signal: Latest verified repo activity */}
      <div className="space-y-2 p-3 rounded-xl bg-zinc-900/40 border border-zinc-850/80">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            ACTIVE SIGNAL
          </span>
          {latestRepo && (
            <span className="text-[10px] font-mono text-zinc-500">
              {formatRelativeTime(latestRepo.pushed_at || latestRepo.updated_at)}
            </span>
          )}
        </div>

        {latestRepo ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <a
                href={latestRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-bold text-white hover:text-cyan-300 transition-colors inline-flex items-center gap-1 group"
              >
                <span>{latestRepo.name}</span>
                <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-cyan-300 transition-colors" />
              </a>
              {latestRepo.language && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                  {latestRepo.language}
                </span>
              )}
            </div>
            {latestRepo.description && (
              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-snug">
                {latestRepo.description}
              </p>
            )}
          </div>
        ) : (
          <p className="text-[11px] font-mono text-zinc-500">
            GitHub data temporarily unavailable.
          </p>
        )}
      </div>

      {/* Footer: GitHub Profile Connection */}
      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">GITHUB</span>
          <span className="text-zinc-300 font-semibold">@codesbysayam</span>
        </div>

        <a
          href="https://github.com/codesbysayam"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-[11px] font-medium transition-colors cursor-pointer group"
        >
          <span>Open Profile</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}

export const EngineeringSnapshot = memo(EngineeringSnapshotComponent);
