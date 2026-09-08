import React, { useState, useEffect } from "react";
import { 
  GitCommit, ExternalLink, RefreshCw, Github, 
  Clock, AlertCircle, CheckCircle2 
} from "lucide-react";
import { fetchRecentPublicCommits, PublicCommitItem } from "../../services/github";

export function RecentBuildActivity() {
  const [commits, setCommits] = useState<PublicCommitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const loadCommits = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const items = await fetchRecentPublicCommits();
      setCommits(items);
      setIsLive(true);
    } catch (err) {
      console.error("Error fetching build activity:", err);
      setIsLive(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCommits();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-850 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
              PUBLIC LOGS
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-cyan-400"}`} />
            <span className="text-[11px] font-mono text-zinc-500">
              {isLive ? "● LIVE COMMITS" : "VERIFIED REPOSITORY BASELINE"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            RECENT BUILD ACTIVITY
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadCommits(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh recent commits"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Updating..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Commits List */}
      {loading ? (
        <div className="p-8 rounded-2xl bg-zinc-950/60 border border-zinc-850 text-center space-y-2">
          <RefreshCw className="w-5 h-5 mx-auto text-zinc-500 animate-spin" />
          <p className="text-xs font-mono text-zinc-400">
            Checking public repository feed...
          </p>
        </div>
      ) : commits.length === 0 ? (
        <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-850 text-center space-y-3">
          <AlertCircle className="w-5 h-5 mx-auto text-zinc-500" />
          <p className="text-xs font-mono text-zinc-400">
            GitHub activity unavailable right now.
          </p>
          <a
            href="https://github.com/codesbysayam"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-xs font-mono text-cyan-400 hover:text-cyan-300 border border-zinc-800 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>View updates on GitHub Profile</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ) : (
        <div className="space-y-2.5">
          {commits.slice(0, 5).map((c, idx) => (
            <div
              key={c.sha || idx}
              className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-850 hover:border-zinc-750 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <GitCommit className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white font-mono">
                      {c.repo}
                    </span>
                    {c.language && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {c.language}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-300 leading-snug line-clamp-1 font-sans">
                    {c.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-850/60 text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{c.time}</span>
                </span>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                    title="View commit details"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentBuildActivity;
