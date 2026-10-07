import { useState, useMemo, memo } from "react";
import { Search, ArrowUpDown, RotateCcw, FolderGit2 } from "lucide-react";
import { GitHubRepository } from "../../data/githubTypes";
import { GitHubRepositoryCard } from "./GitHubRepositoryCard";

interface GitHubRepositoriesProps {
  repositories: GitHubRepository[];
  onRefresh?: () => void;
}

type FilterType = "all" | "original" | "forks" | "archived";
type SortOption = "pushed" | "updated" | "stars" | "forks" | "alphabetical";

export const GitHubRepositories = memo(function GitHubRepositories({
  repositories,
  onRefresh,
}: GitHubRepositoriesProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortOption>("pushed");
  const [showAll, setShowAll] = useState(false);

  // Dynamic calculated counts for tabs
  const allCount = repositories.length;
  const originalCount = useMemo(
    () => repositories.filter((r) => !r.fork && !r.isFork).length,
    [repositories]
  );
  const forkCount = useMemo(
    () => repositories.filter((r) => Boolean(r.fork || r.isFork)).length,
    [repositories]
  );
  const archivedCount = useMemo(
    () => repositories.filter((r) => Boolean(r.archived || r.isArchived)).length,
    [repositories]
  );

  // Filtering
  const filteredRepositories = useMemo(() => {
    return repositories.filter((repo) => {
      // 1. Tab filter
      if (activeFilter === "original" && (repo.fork || repo.isFork)) {
        return false;
      }
      if (activeFilter === "forks" && !(repo.fork || repo.isFork)) {
        return false;
      }
      if (activeFilter === "archived" && !(repo.archived || repo.isArchived)) {
        return false;
      }

      // 2. Search query haystack
      if (query.trim()) {
        const haystack = [
          repo.name,
          repo.description ?? "",
          repo.language ?? "",
          ...(repo.topics ?? []),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(query.toLowerCase().trim());
      }

      return true;
    });
  }, [repositories, activeFilter, query]);

  // Sorting
  const sortedRepositories = useMemo(() => {
    const list = [...filteredRepositories];
    switch (sortBy) {
      case "updated":
        return list.sort(
          (a, b) =>
            new Date(b.updated_at ?? b.updatedAt ?? 0).getTime() -
            new Date(a.updated_at ?? a.updatedAt ?? 0).getTime()
        );
      case "stars":
        return list.sort((a, b) => {
          const starsA = a.stargazers_count ?? a.stars ?? 0;
          const starsB = b.stargazers_count ?? b.stars ?? 0;
          return starsB - starsA;
        });
      case "forks":
        return list.sort((a, b) => {
          const forksA = a.forks_count ?? a.forks ?? 0;
          const forksB = b.forks_count ?? b.forks ?? 0;
          return forksB - forksA;
        });
      case "alphabetical":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "pushed":
      default:
        return list.sort(
          (a, b) =>
            new Date(b.pushed_at ?? b.pushedAt ?? b.updated_at ?? b.updatedAt ?? 0).getTime() -
            new Date(a.pushed_at ?? a.pushedAt ?? a.updated_at ?? a.updatedAt ?? 0).getTime()
        );
    }
  }, [filteredRepositories, sortBy]);

  // Pagination / Show more logic (12 per page)
  const displayedRepositories = useMemo(() => {
    if (showAll || sortedRepositories.length <= 12) {
      return sortedRepositories;
    }
    return sortedRepositories.slice(0, 12);
  }, [sortedRepositories, showAll]);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Pills with real counts */}
        <div
          role="tablist"
          aria-label="Repository categories"
          className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/60 border border-white/[0.08] overflow-x-auto no-scrollbar"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
              activeFilter === "all"
                ? "bg-white text-zinc-950 font-bold shadow-xs"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            All ({allCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "original"}
            onClick={() => setActiveFilter("original")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
              activeFilter === "original"
                ? "bg-white text-zinc-950 font-bold shadow-xs"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            Original ({originalCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "forks"}
            onClick={() => setActiveFilter("forks")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
              activeFilter === "forks"
                ? "bg-white text-zinc-950 font-bold shadow-xs"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            Forks ({forkCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "archived"}
            onClick={() => setActiveFilter("archived")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
              activeFilter === "archived"
                ? "bg-white text-zinc-950 font-bold shadow-xs"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            Archived ({archivedCount})
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search repositories..."
              aria-label="Search repositories"
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900/60 border border-white/[0.08] focus:border-purple-500/50 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort repositories by"
              className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-zinc-900/60 border border-white/[0.08] text-xs font-mono text-zinc-300 focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
            >
              <option value="pushed">Latest Pushed</option>
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Stars</option>
              <option value="forks">Most Forks</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid or Empty States */}
      {displayedRepositories.length > 0 ? (
        <div className="github-repository-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayedRepositories.map((repo) => (
            <GitHubRepositoryCard key={repo.id} repo={repo} />
          ))}
        </div>
      ) : repositories.length === 0 ? (
        /* Empty State: Repositories unavailable */
        <div className="p-8 sm:p-12 text-center rounded-2xl bg-zinc-900/40 border border-white/[0.06] space-y-3">
          <FolderGit2 className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-sm text-zinc-300 font-medium">
            GitHub repositories are temporarily unavailable.
          </p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Unable to reach GitHub API at this moment. You can retry the request or inspect the profile directly.
          </p>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-xl text-xs font-medium bg-white text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Try Again
            </button>
          )}
        </div>
      ) : (
        /* Empty State: Search yielded no matches */
        <div className="p-8 sm:p-12 text-center rounded-2xl bg-zinc-900/40 border border-white/[0.06] space-y-3">
          <Search className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-sm text-zinc-300 font-medium">
            No repositories match your search.
          </p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            No matching items found for &ldquo;{query}&rdquo; under the {activeFilter} filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveFilter("all");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-xl text-xs font-medium bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Show More Button if > 12 repositories */}
      {!showAll && sortedRepositories.length > 12 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="px-6 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer shadow-xs"
          >
            Show More ({sortedRepositories.length - 12} remaining)
          </button>
        </div>
      )}
    </div>
  );
});

export default GitHubRepositories;
