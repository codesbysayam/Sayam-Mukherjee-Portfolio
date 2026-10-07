import { memo } from "react";
import { RefreshCw, Database, AlertCircle } from "lucide-react";

interface GitHubDataStatusProps {
  source?: string;
  lastSyncedLabel?: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  error?: string | null;
  rateLimitRemaining?: number | null;
  rateLimitReset?: string | null;
}

export const GitHubDataStatus = memo(function GitHubDataStatus({
  lastSyncedLabel,
  refreshing,
  onRefresh,
  error,
}: GitHubDataStatusProps) {
  const syncLabel = lastSyncedLabel ? `Synced ${lastSyncedLabel.replace(/^Updated\s+/i, "")}` : "Latest synced data";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] text-xs">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="font-semibold text-white tracking-wide font-display text-xs">
          GitHub Activity
        </span>
        <span className="text-zinc-600 hidden sm:inline">&bull;</span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border-cyan-500/20">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Latest synced data</span>
        </div>
        <span className="text-zinc-400 font-mono text-[11px]">
          {syncLabel}
        </span>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 text-zinc-400 font-mono text-[11px]">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 text-zinc-200 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          title="Reload GitHub snapshot from /data/github.json"
          aria-label="Refresh Data"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin text-purple-400" : ""}`} />
          <span>{refreshing ? "Reloading..." : "Refresh Data"}</span>
        </button>
      </div>

      {error && (
        <div className="w-full mt-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

export default GitHubDataStatus;
