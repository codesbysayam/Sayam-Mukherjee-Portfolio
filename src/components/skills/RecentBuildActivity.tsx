import React, { useState, useEffect } from "react";
import { GitCommit, ExternalLink, RefreshCw, GitBranch } from "lucide-react";
import { fetchRecentPublicCommits, PublicCommitItem } from "../../services/github";

export function RecentBuildActivity() {
  const [commits, setCommits] = useState<PublicCommitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadCommits = async (force = false) => {
    try {
      if (force) setSyncing(true);
      else setLoading(true);

      const items = await fetchRecentPublicCommits(force);
      setCommits(items || []);
    } catch (err) {
      console.error("Error fetching commits:", err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadCommits();
  }, []);

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.14em] text-cyan-400">
            07 — RECENT BUILD ACTIVITY
          </span>
          <span className="h-px w-12 bg-zinc-800" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            GitHub Commits
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-display">
            Public Development Velocity
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">Public commit timeline</span>
            <button
              type="button"
              onClick={() => loadCommits(true)}
              disabled={syncing || loading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh recent commits"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync"}</span>
            </button>
          </div>
        </div>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-sans">
          Verifiable record of engineering activity and iterative commits across public repositories.
        </p>
      </div>

      {/* Clean Timeline / List Container */}
      <div className="rounded-2xl bg-zinc-950/40 border border-zinc-850 overflow-hidden divide-y divide-zinc-850/80">
        {loading && commits.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-zinc-500">
            Fetching recent repository commits...
          </div>
        ) : commits.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-zinc-500">
            No recent public commits found.
          </div>
        ) : (
          commits.slice(0, 5).map((commit, idx) => (
            <div
              key={commit.sha || idx}
              className="p-4 sm:p-5 hover:bg-zinc-900/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Left Column: Repository & Commit Message */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <GitCommit className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-semibold text-cyan-400">
                      {commit.repo.startsWith("codesbysayam/") ? commit.repo : `codesbysayam/${commit.repo}`}
                    </span>
                    <span className="text-zinc-600 hidden sm:inline">·</span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {commit.time || "Recently"}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-200 font-sans line-clamp-2 sm:line-clamp-1 leading-snug">
                    {commit.message}
                  </p>
                </div>
              </div>

              {/* Right Column: Branch / Link */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 pl-11 sm:pl-0">
                <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500">
                  <GitBranch className="w-3 h-3" />
                  <span>main</span>
                </span>
                {commit.url && (
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono transition-colors"
                  >
                    <span>Commit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentBuildActivity;
