import { memo } from "react";
import { ExternalLink, RefreshCw, Radio } from "lucide-react";
import { useGithub } from "../../hooks/useGithub";
import { formatRelativeTime, formatSyncAge } from "../../services/github";

function EngineeringSnapshotComponent() {
  const {
    repos,
    syncedAt,
    loading,
    refresh
  } = useGithub();

  const latestRepo = repos.length > 0 ? repos[0] : null;

  return (
    <div className="card p-5 flex flex-col justify-between space-y-5 h-full relative overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-[2px] bg-[#C7E34A] border border-[#69734A]" aria-hidden="true" />
          <span className="text-[11px] font-mono font-semibold tracking-wider text-[var(--text)] uppercase">
            ENGINEERING SNAPSHOT
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-faint)]">
          <span>{formatSyncAge(syncedAt)}</span>
          <button
            onClick={refresh}
            disabled={loading}
            title="Refresh GitHub telemetry"
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] rounded-[4px] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin text-[var(--accent)]" : ""}`} />
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)] font-semibold block">
          CURRENT FOCUS
        </span>
        <div className="grid grid-cols-2 gap-2">
          {["AI / ML", "Full-Stack Dev", "Advanced DSA", "System Arch"].map((label) => (
            <div key={label} className="flex items-center gap-2 p-2 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-[2px] bg-[var(--accent)] shrink-0" aria-hidden="true" />
              <span className="font-mono text-[11px] truncate">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] font-semibold flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[var(--accent)]" />
            ACTIVE SIGNAL
          </span>
          {latestRepo && (
            <span className="text-[10px] font-mono text-[var(--text-faint)]">
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
                className="text-xs font-mono font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1 group"
              >
                <span>{latestRepo.name}</span>
                <ExternalLink className="w-3 h-3 text-[var(--text-faint)] group-hover:text-[var(--accent)] transition-colors" />
              </a>
              {latestRepo.language && (
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  · {latestRepo.language}
                </span>
              )}
            </div>
            {latestRepo.description && (
              <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-snug">
                {latestRepo.description}
              </p>
            )}
          </div>
        ) : (
          <p className="text-[11px] font-mono text-[var(--text-faint)]">
            GitHub data temporarily unavailable.
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-faint)]">GITHUB</span>
          <span className="text-[var(--text)] font-semibold">@codesbysayam</span>
        </div>

        <a
          href="https://github.com/codesbysayam"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline text-[11px] font-medium transition-colors cursor-pointer group"
        >
          <span>Open Profile</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}

export const EngineeringSnapshot = memo(EngineeringSnapshotComponent);
