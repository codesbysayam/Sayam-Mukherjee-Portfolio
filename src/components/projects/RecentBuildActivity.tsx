import { memo } from "react";
import { GitCommit, ExternalLink, Activity, RefreshCw } from "lucide-react";
import { useGithub } from "../../hooks/useGithub";
import { formatGitHubEvent, formatSyncAge } from "../../services/github";

function RecentBuildActivityComponent() {
  const { events, syncedAt, loading, refresh } = useGithub();

  const parsedEvents = (events || [])
    .map((e) => {
      const parsed = formatGitHubEvent(e);
      return parsed ? { ...parsed, id: e.id, rawType: e.type } : null;
    })
    .filter(Boolean)
    .slice(0, 5);

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="text-sm sm:text-base font-bold text-[var(--text)] font-display uppercase tracking-wider">
            RECENT BUILD ACTIVITY
          </h3>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-faint)]">
          <span>{formatSyncAge(syncedAt)}</span>
          <button
            onClick={refresh}
            disabled={loading}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] rounded-[4px] transition-colors cursor-pointer"
            title="Refresh events feed"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin text-[var(--accent)]" : ""}`} />
          </button>
        </div>
      </div>

      {parsedEvents.length === 0 ? (
        <div className="py-6 text-center text-xs font-mono text-[var(--text-muted)]">
          Recent public activity unavailable.
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {parsedEvents.map((evt) => {
            if (!evt) return null;
            return (
              <div
                key={evt.id}
                className="py-3 flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--accent)] group-hover:border-[var(--border-strong)] transition-colors">
                    <GitCommit className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-medium text-[var(--text)] truncate">
                      {evt.text}
                    </p>
                    <span className="text-[10px] font-mono text-[var(--text-faint)]">
                      repository activity
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-mono text-[var(--text-faint)]">
                    {evt.time}
                  </span>
                  <a
                    href={evt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
                    title="View event on GitHub"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const RecentBuildActivity = memo(RecentBuildActivityComponent);
