import React, { memo } from "react";
import { motion } from "motion/react";
import { Search, X, ArrowUpDown } from "lucide-react";
import { usePrefersReducedMotion } from "../../motion/tokens";

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
  const reduced = usePrefersReducedMotion();

  return (
    <div className="space-y-4 pt-2 pb-6 border-b border-[var(--border)]">
      {/* Search + Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search essays by topic, title, or architecture…"
            className="w-full min-h-[44px] sm:min-h-[42px] border rounded-[6px] pl-9 pr-11 py-2 text-base sm:text-xs bg-[var(--surface-2)] border-[var(--border-strong)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors font-sans"
            aria-label="Search journal entries"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-0.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
            {totalResults} {totalResults === 1 ? "essay" : "essays"}
          </span>

          <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
            <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
            <button
              type="button"
              onClick={() =>
                onSortChange(sortOrder === "newest" ? "oldest" : "newest")
              }
              className="inline-flex items-center min-h-[44px] sm:min-h-[36px] px-2 hover:text-[var(--accent)] transition-colors cursor-pointer capitalize font-medium underline underline-offset-4"
              aria-label={`Sort order: currently ${sortOrder}`}
            >
              {sortOrder}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs with layoutId animated indicator */}
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
              className={`relative inline-flex items-center min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-[6px] text-xs font-mono tracking-wider transition-colors cursor-pointer border ${
                isSelected
                  ? "border-[var(--accent-fill)] text-[var(--accent-contrast)] font-bold"
                  : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)]"
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId={reduced ? undefined : "journalCategoryActiveBg"}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-[5px] bg-[var(--accent-fill)] z-0"
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
