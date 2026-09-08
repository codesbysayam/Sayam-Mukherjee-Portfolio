import { memo } from "react";
import { GitCommit, ExternalLink, Activity, Radio, RefreshCw } from "lucide-react";
import { useGithub } from "../../hooks/useGithub";
import { formatGitHubEvent, formatSyncAge } from "../../services/github";

function RecentBuildActivityComponent() {
  const { events, syncedAt, loading, refresh } = useGithub();

  // Filter & format only valid real GitHub events
  const parsedEvents = (events || [])
    .map((e) => {
      const parsed = formatGitHubEvent(e);
      return parsed ? { ...parsed, id: e.id, rawType: e.type } : null;
    })
    .filter(Boolean)
    .slice(0, 5);

  return (
    <div className="glass-card rounded-2xl p-6 border border-zinc-850 bg-zinc-950/70 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm sm:text-base font-bold text-white font-display uppercase tracking-wider">
            RECENT BUILD ACTIVITY
          </h3>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse hidden sm:inline-block" />
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
          <span>{formatSyncAge(syncedAt)}</span>
          <button
            onClick={refresh}
            disabled={loading}
            className="p-1 text-zinc-500 hover:text-cyan-300 rounded transition-colors cursor-pointer"
            title="Refresh events feed"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin text-cyan-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Events List */}
      {parsedEvents.length === 0 ? (
        <div className="py-6 text-center text-xs font-mono text-zinc-500">
          Recent public activity unavailable.
        </div>
      ) : (
        <div className="divide-y divide-zinc-900">
          {parsedEvents.map((evt) => {
            if (!evt) return null;
            return (
              <div 
                key={evt.id} 
                className="py-3 flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center shrink-0 text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                    <GitCommit className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                      {evt.text}
                    </p>
                    <span className="text-[10px] font-mono text-zinc-500">
                      repository activity
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-mono text-zinc-500">
                    {evt.time}
                  </span>
                  <a
                    href={evt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md text-zinc-500 hover:text-cyan-300 hover:bg-zinc-900 transition-colors"
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
