import React, { memo } from "react";
import { Search, X, ArrowUpDown } from "lucide-react";

interface JournalFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  sortOrder: "newest" | "oldest";
  onSortChange: (sort: "newest" | "oldest") => void;
  totalResults: number;
}

export const JournalFilters = memo(function JournalFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortOrder,
  onSortChange,
  totalResults,
}: JournalFiltersProps) {
  return (
    <div className="space-y-4 pt-2 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
      {/* Search + Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-[var(--text-faint)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search entries by topic, title, or keywords..."
            className="w-full border rounded-[6px] pl-9 pr-9 py-2 text-sm outline-none transition-colors font-sans"
            style={{
              backgroundColor: "var(--surface-2)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
            aria-label="Search journal entries"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
            {totalResults} {totalResults === 1 ? "entry" : "entries"}
          </span>

          <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
            <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
            <button
              type="button"
              onClick={() =>
                onSortChange(sortOrder === "newest" ? "oldest" : "newest")
              }
              className="hover:text-[var(--accent)] transition-colors cursor-pointer capitalize font-medium underline underline-offset-4"
              aria-label={`Sort order: currently ${sortOrder}`}
            >
              {sortOrder}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div
        className="flex flex-wrap items-center gap-1.5 pt-1"
        role="tablist"
        aria-label="Journal categories"
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onCategoryChange(cat)}
              className="px-3 py-1.5 rounded-[6px] text-xs font-mono tracking-wider transition-colors cursor-pointer border"
              style={{
                backgroundColor: isSelected ? "#C7E34A" : "var(--surface-2)",
                borderColor: isSelected ? "#C7E34A" : "var(--border)",
                color: isSelected ? "#20231D" : "var(--text-muted)",
                fontWeight: isSelected ? 700 : 500,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
});
