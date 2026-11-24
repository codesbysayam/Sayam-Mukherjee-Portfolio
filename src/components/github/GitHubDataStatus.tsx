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
  const syncLabel = lastSyncedLabel
    ? `Synced ${lastSyncedLabel.replace(/^Updated\s+/i, "")}`
    : "Latest synced data";

  return (
    <div
      className="card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:px-5 text-xs"
      style={{
        backgroundColor: "var(--surface-2)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="font-bold text-[var(--text)] tracking-wide font-display text-xs">
          GitHub Activity
        </span>
        <span className="text-[var(--text-faint)] hidden sm:inline">&bull;</span>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-[11px] font-mono text-[var(--accent)]"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Latest synced data</span>
        </div>
        <span className="text-[var(--text-muted)] font-mono text-[11px]">
          {syncLabel}
        </span>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 font-mono text-[11px]">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="btn btn-secondary min-h-[44px] sm:min-h-[38px] px-3 py-1.5 text-xs font-mono disabled:opacity-50"
          title="Reload GitHub snapshot from /data/github.json"
          aria-label="Refresh Data"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Reloading..." : "Refresh Data"}</span>
        </button>
      </div>

      {error && (
        <div
          className="w-full mt-2 p-2.5 rounded-[6px] border text-[11px] flex items-center gap-1.5"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--danger)",
            color: "var(--danger)",
          }}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

export default GitHubDataStatus;
