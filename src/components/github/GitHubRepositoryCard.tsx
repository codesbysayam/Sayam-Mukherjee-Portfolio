import { memo } from "react";
import { FolderGit2, GitFork, ExternalLink, Star, Archive } from "lucide-react";
import { GitHubRepository } from "../../data/githubTypes";
import { formatRelativeDate } from "../../lib/github";

interface GitHubRepositoryCardProps {
  repo: GitHubRepository;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#d4b429",
  Python: "#3572A5",
  "C++": "#b94a48",
  C: "#585B52",
  HTML: "#d65d3b",
  CSS: "#69734A",
  Shell: "#A9C52F",
  Rust: "#c47d58",
  Go: "#2b8a9c",
  Java: "#9a6621",
};

export const GitHubRepositoryCard = memo(function GitHubRepositoryCard({
  repo,
}: GitHubRepositoryCardProps) {
  const isFork = Boolean(repo.fork ?? repo.isFork);
  const isArchived = Boolean(repo.archived ?? repo.isArchived);
  const starsCount =
    typeof repo.stargazers_count === "number" ? repo.stargazers_count : repo.stars ?? 0;
  const forksCount =
    typeof repo.forks_count === "number" ? repo.forks_count : repo.forks ?? 0;
  const repoUrl =
    repo.html_url || repo.url || `https://github.com/codesbysayam/${repo.name}`;
  const relativeDate = formatRelativeDate(
    repo.pushed_at ?? repo.pushedAt ?? repo.updated_at ?? repo.updatedAt
  );
  const langColor = repo.language
    ? LANGUAGE_COLORS[repo.language] || "#69734A"
    : null;

  return (
    <article
      className="github-repository-card card group flex flex-col justify-between p-4 sm:p-5 relative overflow-hidden hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--surface-2)",
        borderColor: "var(--border)",
      }}
    >
      <div className="space-y-3">
        {/* Card Top */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="p-1.5 rounded-[6px] border shrink-0"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--accent)",
              }}
              title={isFork ? "Forked repository" : "Original repository"}
            >
              {isFork ? (
                <GitFork className="w-4 h-4" />
              ) : (
                <FolderGit2 className="w-4 h-4" />
              )}
            </span>

            {isFork && (
              <span
                className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] border font-semibold"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                Fork
              </span>
            )}

            {isArchived && (
              <span
                className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] border flex items-center gap-1"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                <Archive className="w-2.5 h-2.5" /> Archived
              </span>
            )}
          </div>

          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${repo.name} on GitHub`}
            className="p-1.5 rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors shrink-0"
            title="Open on GitHub"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Repository Name */}
        <div>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block group-hover:text-[var(--accent)] transition-colors"
          >
            <h3 className="text-sm sm:text-base font-bold text-[var(--text)] group-hover:text-[var(--accent)] tracking-tight break-words [overflow-wrap:anywhere] font-display">
              {repo.name}
            </h3>
          </a>
        </div>

        {/* Description */}
        <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3 min-h-[2.5rem]">
          {repo.description || "No repository description available."}
        </p>

        {/* Topics */}
        {Array.isArray(repo.topics) && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {repo.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="text-[10px] font-mono text-[var(--text-muted)] px-2 py-0.5 rounded-[4px] border"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                #{topic}
              </span>
            ))}
            {repo.topics.length > 4 && (
              <span className="text-[10px] font-mono text-[var(--text-faint)] self-center">
                +{repo.topics.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div
        className="pt-4 mt-3 border-t flex items-center justify-between text-xs text-[var(--text-muted)] font-mono gap-2"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3 shrink-0 tabular-nums">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-[2px] shrink-0"
                style={{ backgroundColor: langColor || "#69734A" }}
              />
              <span className="text-[var(--text-secondary)] truncate max-w-[80px] sm:max-w-none">
                {repo.language}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1" title={`${starsCount} stars`}>
            <Star className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{starsCount}</span>
          </div>

          <div className="flex items-center gap-1" title={`${forksCount} forks`}>
            <GitFork className="w-3.5 h-3.5 text-[var(--text-faint)]" />
            <span>{forksCount}</span>
          </div>
        </div>

        <span className="text-[11px] text-[var(--text-faint)] shrink-0 text-right">
          {relativeDate}
        </span>
      </div>
    </article>
  );
});

export default GitHubRepositoryCard;
