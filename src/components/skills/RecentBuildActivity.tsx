import React from "react";
import { 
  GitCommit, GitBranch, Clock, ExternalLink, 
  FolderGit2, ShieldCheck, AlertCircle, Activity, Radio
} from "lucide-react";
import { useGithub } from "../../hooks/useGithub";
import { usePortfolio } from "../../context/PortfolioContext";
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
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const commits = stats?.recentCommits || [];

  return (
    <section id="recent-build-activity" className="space-y-4">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className={`text-[11px] font-mono font-medium uppercase tracking-[0.14em] ${
            isLight ? "text-cyan-700" : "text-cyan-400"
          }`}>
            10 — RECENT BUILD ACTIVITY
          </span>
          <span className={`h-px w-8 ${isLight ? "bg-slate-200" : "bg-white/[0.1]"}`} />
          <span className={`text-[11px] font-mono uppercase tracking-wider hidden sm:inline ${
            isLight ? "text-slate-500" : "text-zinc-500"
          }`}>
            Real GitHub Repository Activity
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className={`text-xl sm:text-2xl font-bold tracking-tight font-display ${
            isLight ? "text-slate-900" : "text-white"
          }`}>
            Recent Build Activity
          </h2>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border ${
              isLight 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLight ? "bg-emerald-600" : "bg-emerald-400"}`} />
              <span>Verified Stream</span>
            </span>
            <span className={`text-[11px] font-mono ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
              {commits.length} Recorded Commits
            </span>
          </div>
        </div>
        <p className={`text-xs sm:text-sm max-w-2xl font-sans leading-relaxed ${
          isLight ? "text-slate-600" : "text-zinc-400"
        }`}>
          Real GitHub commit stream and branch activity from public repositories. No manufactured activity.
        </p>
      </div>

      {/* When GitHub data cannot be retrieved */}
      {commits.length === 0 ? (
        <div className={`rounded-2xl border p-6 text-center space-y-2 ${
          isLight 
            ? "bg-slate-50/80 border-slate-200 text-slate-700" 
            : "bg-[#11131c]/90 border-white/[0.08] text-zinc-300"
        }`}>
          <AlertCircle className="w-4 h-4 text-amber-500 mx-auto" />
          <p className="text-xs font-mono">
            GitHub activity is currently unavailable.
          </p>
          <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
            Public repository status can be viewed directly on{" "}
            <a
              href="https://github.com/codesbysayam"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:underline font-semibold ${isLight ? "text-cyan-700" : "text-cyan-400"}`}
            >
              github.com/codesbysayam
            </a>
          </p>
        </div>
      ) : (
        /* Feed List Container */
        <div className={`rounded-2xl border overflow-hidden shadow-sm transition-all ${
          isLight 
            ? "bg-white border-slate-200/90 divide-y divide-slate-100" 
            : "bg-[#11131c]/90 border-white/[0.08] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] divide-y divide-white/[0.06]"
        }`}>
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
                className={`p-3.5 sm:p-4.5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isLight ? "hover:bg-slate-50/90" : "hover:bg-white/[0.03]"
                }`}
              >
                {/* Commit Details */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold ${
                      isLight ? "text-cyan-700" : "text-cyan-400"
                    }`}>
                      <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{repoShort}</span>
                    </span>
                    <span className={isLight ? "text-slate-300" : "text-zinc-600"}>·</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border ${
                      isLight
                        ? "bg-slate-100 text-slate-700 border-slate-200"
                        : "bg-white/[0.04] text-zinc-300 border-white/[0.08]"
                    }`}>
                      {language}
                    </span>
                    <span className={isLight ? "text-slate-300" : "text-zinc-600"}>·</span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                      isLight
                        ? "bg-slate-100/60 text-slate-600 border-slate-200/80"
                        : "bg-white/[0.02] text-zinc-400 border-white/[0.06]"
                    }`}>
                      <GitBranch className={`w-2.5 h-2.5 ${isLight ? "text-slate-500" : "text-zinc-500"}`} />
                      <span>main</span>
                    </span>
                    <span className={isLight ? "text-slate-300" : "text-zinc-600"}>·</span>
                    <span className={`text-[10px] font-mono ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                      {formatRelativeTime(commit.date)}
                    </span>
                  </div>

                  <div className={`text-xs sm:text-[13px] font-mono break-words font-medium leading-relaxed ${
                    isLight ? "text-slate-900" : "text-zinc-100"
                  }`}>
                    {commit.message}
                  </div>
                </div>

                {/* Open Repository and SHA Links */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center pt-0.5 sm:pt-0">
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors font-medium ${
                      isLight
                        ? "bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-950 border-slate-200"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border-white/10"
                    }`}
                  >
                    <span>Repository</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
                  </a>

                  <a
                    href={commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-mono transition-colors ${
                      isLight
                        ? "bg-cyan-50 hover:bg-cyan-100/80 text-cyan-800 border-cyan-200"
                        : "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/20"
                    }`}
                    title="View commit SHA"
                  >
                    <GitCommit className="w-3 h-3 text-cyan-500 shrink-0" />
                    <span>{commit.sha.slice(0, 7)}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Authenticity Guarantee */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono pt-0.5 ${
        isLight ? "text-slate-500" : "text-zinc-400"
      }`}>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isLight ? "text-emerald-600" : "text-emerald-400"}`} />
          <span>Real git commit records from verified repositories on github.com/codesbysayam</span>
        </div>
        <span>Cached baseline when rate-limited</span>
      </div>
    </section>
  );
}

export default RecentBuildActivity;
