import { useState, useMemo, memo } from "react";
import { Search, ArrowUpDown, RotateCcw, FolderGit2 } from "lucide-react";
import { GitHubRepository } from "../../data/githubTypes";
import { GitHubRepositoryCard } from "./GitHubRepositoryCard";
import { StaggerGroup, StaggerItem } from "../../motion/Reveal";

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

  const filteredRepositories = useMemo(() => {
    return repositories.filter((repo) => {
      if (activeFilter === "original" && (repo.fork || repo.isFork)) return false;
      if (activeFilter === "forks" && !(repo.fork || repo.isFork)) return false;
      if (activeFilter === "archived" && !(repo.archived || repo.isArchived)) return false;

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
            new Date(
              b.pushed_at ?? b.pushedAt ?? b.updated_at ?? b.updatedAt ?? 0
            ).getTime() -
            new Date(
              a.pushed_at ?? a.pushedAt ?? a.updated_at ?? a.updatedAt ?? 0
            ).getTime()
        );
    }
  }, [filteredRepositories, sortBy]);

  const displayedRepositories = useMemo(() => {
    if (showAll || sortedRepositories.length <= 12) return sortedRepositories;
    return sortedRepositories.slice(0, 12);
  }, [sortedRepositories, showAll]);

  const tabs: { id: FilterType; label: string; count: number }[] = [
    { id: "all", label: "All", count: allCount },
    { id: "original", label: "Original", count: originalCount },
    { id: "forks", label: "Forks", count: forkCount },
    { id: "archived", label: "Archived", count: archivedCount },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div
          role="tablist"
          aria-label="Repository categories"
          className="flex items-center gap-1.5 p-1 rounded-[8px] border overflow-x-auto no-scrollbar"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          {tabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveFilter(tab.id)}
                className="min-h-[40px] sm:min-h-[36px] px-3 py-1.5 rounded-[6px] text-xs font-mono transition-colors shrink-0 cursor-pointer tabular-nums"
                style={{
                  backgroundColor: isSelected ? "#C7E34A" : "transparent",
                  color: isSelected ? "#20231D" : "var(--text-muted)",
                  fontWeight: isSelected ? 700 : 500,
                }}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative w-full sm:w-auto sm:min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search repositories..."
              aria-label="Search repositories"
              className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-[6px] border text-base sm:text-xs focus:outline-none transition-colors"
              style={{
                backgroundColor: "var(--surface-2)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort repositories by"
              className="w-full sm:w-auto min-h-[40px] px-3 py-2 rounded-[6px] border text-base sm:text-xs font-mono focus:outline-none transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--surface-2)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
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
        <StaggerGroup
          key={`${activeFilter}-${sortBy}-${showAll}-${displayedRepositories.length}`}
          stagger={0.035}
          className="github-repository-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {displayedRepositories.map((repo) => (
            <StaggerItem key={repo.id} className="h-full">
              <GitHubRepositoryCard repo={repo} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : repositories.length === 0 ? (
        <div
          className="card p-8 sm:p-12 text-center space-y-3"
          style={{
            backgroundColor: "var(--surface-2)",
            borderColor: "var(--border)",
          }}
        >
          <FolderGit2 className="w-8 h-8 text-[var(--text-faint)] mx-auto" />
          <p className="text-sm text-[var(--text)] font-medium">
            GitHub repositories are temporarily unavailable.
          </p>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Unable to reach GitHub API at this moment. You can retry the request or inspect the profile directly.
          </p>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="btn btn-primary text-xs mt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Try Again
            </button>
          )}
        </div>
      ) : (
        <div
          className="card p-8 sm:p-12 text-center space-y-3"
          style={{
            backgroundColor: "var(--surface-2)",
            borderColor: "var(--border)",
          }}
        >
          <Search className="w-8 h-8 text-[var(--text-faint)] mx-auto" />
          <p className="text-sm text-[var(--text)] font-medium">
            No repositories match your search.
          </p>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            No matching items found for &ldquo;{query}&rdquo; under the {activeFilter} filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveFilter("all");
            }}
            className="btn btn-secondary text-xs mt-2"
          >
            Clear Search
          </button>
        </div>
      )}

      {!showAll && sortedRepositories.length > 12 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="btn btn-secondary text-xs font-mono"
          >
            Show More ({sortedRepositories.length - 12} remaining)
          </button>
        </div>
      )}
    </div>
  );
});

export default GitHubRepositories;
