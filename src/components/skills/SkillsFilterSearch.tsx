import { Search, X, RotateCcw } from "lucide-react";
import { SKILL_FILTER_TABS, SkillFilterKey } from "../../data/skills";

interface SkillsFilterSearchProps {
  activeFilter: SkillFilterKey;
  setActiveFilter: (key: SkillFilterKey) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultCount?: number;
  totalCount?: number;
  onReset: () => void;
}

export function SkillsFilterSearch({
  activeFilter = "all",
  setActiveFilter,
  searchQuery = "",
  setSearchQuery,
  resultCount = 0,
  totalCount = 0,
  onReset,
}: SkillsFilterSearchProps) {
  const isFiltered =
    activeFilter !== "all" || (searchQuery && searchQuery.trim().length > 0);

  return (
    <div className="space-y-3">
      {/* Search Input & Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            placeholder="Search technologies, frameworks, or concepts..."
            className="w-full pl-10 pr-10 py-2.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--border-strong)] focus:outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] font-sans transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery?.("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 tabular-nums">
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Showing{" "}
            <span className="text-[var(--text)] font-semibold">{resultCount}</span>{" "}
            of {totalCount} verified items
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-secondary px-2.5 py-1 text-xs font-mono rounded-[6px] cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        {(SKILL_FILTER_TABS || []).map((tab) => {
          const isActive = activeFilter === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter?.(tab.key)}
              className={`px-3 py-1.5 rounded-[6px] whitespace-nowrap shrink-0 transition-colors cursor-pointer font-medium border ${
                isActive
                  ? "bg-[#C7E34A] text-[#20231D] border-[#A9C52F] font-semibold"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:border-[var(--border-strong)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SkillsFilterSearch;

