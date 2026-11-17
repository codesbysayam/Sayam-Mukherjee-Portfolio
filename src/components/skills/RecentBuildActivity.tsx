import {
  GitCommit, GitBranch, ExternalLink,
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
  const { stats, repos } = useGithub();

  const commits = stats?.recentCommits || [];

  return (
    <section id="recent-build-activity" className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            10 · RECENT BUILD ACTIVITY
          </span>
          <span className="h-px w-8 bg-[var(--border)]" />
          <span className="text-[11px] font-mono uppercase tracking-wider hidden sm:inline text-[var(--text-faint)]">
            Real GitHub Repository Activity
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-display text-[var(--text)]">
            Recent Build Activity
          </h2>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-[var(--success)] font-semibold uppercase tracking-wider">
              Verified Stream
            </span>
            <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>
            <span className="text-[var(--text-faint)] tabular-nums">
              {commits.length} Recorded Commits
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm max-w-2xl font-sans leading-relaxed text-[var(--text-muted)]">
          Real GitHub commit stream and branch activity from public repositories. No manufactured activity.
        </p>
      </div>

      {commits.length === 0 ? (
        <div className="card p-6 text-center space-y-2">
          <AlertCircle className="w-4 h-4 text-[var(--warning)] mx-auto" />
          <p className="text-xs font-mono text-[var(--text)]">
            GitHub activity is currently unavailable.
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">
            Public repository status can be viewed directly on{" "}
            <a
              href="https://github.com/codesbysayam"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-semibold text-[var(--accent)]"
            >
              github.com/codesbysayam
            </a>
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden divide-y divide-[var(--border)]">
          {commits.map((commit) => {
            const repoShort = commit.repo.replace(/^[^/]+\//, "");
            const repoUrl = `https://github.com/${commit.repo}`;
            const commitUrl = `${repoUrl}/commit/${commit.sha}`;

            const matchedRepo = repos.find(
              (r) => r.name.toLowerCase() === repoShort.toLowerCase() || r.full_name.toLowerCase() === commit.repo.toLowerCase()
            );
            const language = matchedRepo?.language || REPO_LANGUAGES[repoShort] || "TypeScript";

            return (
              <div
                key={commit.sha}
                className="p-3.5 sm:p-4.5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--surface)]"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                    <span className="inline-flex items-center gap-1 font-semibold text-[var(--accent)]">
                      <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{repoShort}</span>
                    </span>
                    <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      {language}
                    </span>
                    <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                      <GitBranch className="w-2.5 h-2.5 text-[var(--text-faint)]" />
                      <span>main</span>
                    </span>
                    <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>
                    <span className="text-[10px] text-[var(--text-faint)]">
                      {formatRelativeTime(commit.date)}
                    </span>
                  </div>

                  <div className="text-xs sm:text-[13px] font-mono break-words font-medium leading-relaxed text-[var(--text)]">
                    {commit.message}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center pt-0.5 sm:pt-0">
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary !min-h-[28px] !px-2.5 !py-1 text-[11px] font-mono"
                  >
                    <span>Repository</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
                  </a>

                  <a
                    href={commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-[var(--surface)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--accent)] text-[11px] font-mono transition-colors tabular-nums"
                    title="View commit SHA"
                  >
                    <GitCommit className="w-3 h-3 shrink-0" />
                    <span>{commit.sha.slice(0, 7)}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono pt-0.5 text-[var(--text-faint)]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[var(--success)]" />
          <span>Real git commit records from verified repositories on github.com/codesbysayam</span>
        </div>
        <span>Cached baseline when rate-limited</span>
      </div>
    </section>
  );
}

export default RecentBuildActivity;
