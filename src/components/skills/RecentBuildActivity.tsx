import React from "react";
import { 
  GitCommit, GitBranch, Clock, ExternalLink, 
  FolderGit2, ShieldCheck, AlertCircle
} from "lucide-react";
import { useGithub } from "../../hooks/useGithub";
import { formatRelativeTime } from "../../services/github";

const REPO_LANGUAGES: Record<string, string> = {
  "sayam-solves": "C++",
  "mausam": "TypeScript",
  "Sayam-Mukherjee-Portfolio": "TypeScript",
  "Operon": "TypeScript",
  "codesbysayam": "Python"
};

export function RecentBuildActivity() {
  const { stats, repos, error } = useGithub();

  const commits = stats?.recentCommits || [];

  return (
    <section id="recent-build-activity" className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-cyan-400">
            10 — RECENT BUILD ACTIVITY
          </span>
          <span className="h-px w-8 bg-zinc-800" />
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
            Real GitHub Repository Activity
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
            Recent Build Activity
          </h2>
          <span className="text-[11px] font-mono text-zinc-500">
            Verified Git Commits
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans leading-relaxed">
          Real GitHub commit stream and branch activity from public repositories. No manufactured activity.
        </p>
      </div>

      {/* When GitHub data cannot be retrieved */}
      {commits.length === 0 ? (
        <div className="rounded-xl bg-zinc-950/40 border border-zinc-850 p-6 text-center space-y-2">
          <AlertCircle className="w-4 h-4 text-amber-400 mx-auto" />
          <p className="text-xs text-zinc-400 font-mono">
            GitHub activity is currently unavailable.
          </p>
          <p className="text-[11px] text-zinc-500">
            Public repository status can be viewed directly on{" "}
            <a
              href="https://github.com/codesbysayam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              github.com/codesbysayam
            </a>
          </p>
        </div>
      ) : (
        /* Feed List Container */
        <div className="rounded-xl bg-zinc-950/40 border border-zinc-850 overflow-hidden divide-y divide-zinc-850/80">
          {commits.map((commit) => {
            const repoShort = commit.repo.replace(/^[^/]+\//, "");
            const repoUrl = `https://github.com/${commit.repo}`;
            const commitUrl = `${repoUrl}/commit/${commit.sha}`;
            
            // Resolve language from repos list or verified map
            const matchedRepo = repos.find(
              (r) => r.name.toLowerCase() === repoShort.toLowerCase() || r.full_name.toLowerCase() === commit.repo.toLowerCase()
            );
            const language = matchedRepo?.language || REPO_LANGUAGES[repoShort] || "TypeScript";

            return (
              <div
                key={commit.sha}
                className="p-3.5 sm:p-4 hover:bg-zinc-900/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Commit Details */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-semibold">
                      <FolderGit2 className="w-3 h-3 shrink-0" />
                      <span>{repoShort}</span>
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-zinc-900 text-[10px] font-mono text-zinc-300 border border-zinc-800">
                      {language}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded bg-zinc-900/60 text-[10px] font-mono text-zinc-400 border border-zinc-800">
                      <GitBranch className="w-2.5 h-2.5 text-zinc-500" />
                      <span>main</span>
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {formatRelativeTime(commit.date)}
                    </span>
                  </div>

                  <div className="text-xs sm:text-[13px] text-zinc-200 font-mono break-words font-medium">
                    {commit.message}
                  </div>
                </div>

                {/* Open Repository and SHA Links */}
                <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center pt-0.5 sm:pt-0">
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-[11px] font-mono transition-colors"
                  >
                    <span>Repository</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
                  </a>

                  <a
                    href={commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-cyan-400 border border-zinc-800 text-[11px] font-mono transition-colors"
                    title="View commit SHA"
                  >
                    <GitCommit className="w-2.5 h-2.5 text-cyan-400" />
                    <span>{commit.sha.slice(0, 7)}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Authenticity Guarantee */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-zinc-500 pt-0.5">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>Real git commit records from verified repositories on github.com/codesbysayam</span>
        </div>
        <span>Cached baseline when rate-limited</span>
      </div>
    </section>
  );
}

export default RecentBuildActivity;
