import { memo } from "react";
import { FolderGit2, GitFork, ExternalLink, Star, Archive } from "lucide-react";
import { GitHubRepository } from "../../data/githubTypes";
import { formatRelativeDate } from "../../lib/github";

interface GitHubRepositoryCardProps {
  repo: GitHubRepository;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
};

export const GitHubRepositoryCard = memo(function GitHubRepositoryCard({
  repo,
}: GitHubRepositoryCardProps) {
  const isFork = Boolean(repo.fork ?? repo.isFork);
  const isArchived = Boolean(repo.archived ?? repo.isArchived);
  const starsCount = typeof repo.stargazers_count === "number" ? repo.stargazers_count : (repo.stars ?? 0);
  const forksCount = typeof repo.forks_count === "number" ? repo.forks_count : (repo.forks ?? 0);
  const repoUrl = repo.html_url || repo.url || `https://github.com/codesbysayam/${repo.name}`;
  const relativeDate = formatRelativeDate(repo.pushed_at ?? repo.pushedAt ?? repo.updated_at ?? repo.updatedAt);
  const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] || "#a1a1aa") : null;

  return (
    <article
      className="github-repository-card group flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-white/[0.08] hover:border-purple-500/30 transition-all duration-200 shadow-xs relative overflow-hidden"
    >
      <div className="space-y-3">
        {/* Card Top: Icon, Badges, External Link */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`p-1.5 rounded-lg shrink-0 ${
                isFork
                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}
              title={isFork ? "Forked repository" : "Original repository"}
            >
              {isFork ? <GitFork className="w-4 h-4" /> : <FolderGit2 className="w-4 h-4" />}
            </span>

            {isFork && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Fork
              </span>
            )}

            {isArchived && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center gap-1">
                <Archive className="w-2.5 h-2.5" /> Archived
              </span>
            )}
          </div>

          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${repo.name} on GitHub`}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors shrink-0"
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
            className="block group-hover:text-purple-400 transition-colors"
          >
            <h3 className="text-sm sm:text-base font-semibold text-zinc-100 tracking-tight break-words [overflow-wrap:anywhere]">
              {repo.name}
            </h3>
          </a>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 min-h-[2.5rem]">
          {repo.description || "No repository description available."}
        </p>

        {/* Topics (if available) */}
        {Array.isArray(repo.topics) && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {repo.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06]"
              >
                #{topic}
              </span>
            ))}
            {repo.topics.length > 4 && (
              <span className="text-[10px] font-mono text-zinc-500 self-center">
                +{repo.topics.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className="pt-4 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-mono gap-2">
        <div className="flex items-center gap-3 shrink-0">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: langColor || "#a1a1aa" }}
              />
              <span className="text-zinc-300 truncate max-w-[80px] sm:max-w-none">
                {repo.language}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1" title={`${starsCount} stars`}>
            <Star className="w-3.5 h-3.5 text-amber-400/80 fill-amber-400/30" />
            <span>{starsCount}</span>
          </div>

          <div className="flex items-center gap-1" title={`${forksCount} forks`}>
            <GitFork className="w-3.5 h-3.5 text-zinc-500" />
            <span>{forksCount}</span>
          </div>
        </div>

        <span className="text-[11px] text-zinc-400 shrink-0 text-right">
          {relativeDate}
        </span>
      </div>
    </article>
  );
});

export default GitHubRepositoryCard;
