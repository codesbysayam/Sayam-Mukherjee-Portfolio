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
    <div className="space-y-4 pt-2 pb-6 border-b border-white/[0.08]">
      {/* Search Bar + Sort Control Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search entries by topic, title, or keywords..."
            className="w-full bg-white/[0.04] border border-white/[0.10] hover:border-white/20 focus:border-purple-400/50 rounded-xl pl-9 pr-9 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all font-sans"
            aria-label="Search journal entries"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Result count */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <span className="text-xs font-mono text-zinc-400">
            {totalResults} {totalResults === 1 ? "entry" : "entries"}
          </span>

          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
            <button
              type="button"
              onClick={() => onSortChange(sortOrder === "newest" ? "oldest" : "newest")}
              className="hover:text-purple-300 transition-colors cursor-pointer capitalize font-medium underline underline-offset-4"
              aria-label={`Sort order: currently ${sortOrder}`}
            >
              {sortOrder}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1" role="tablist" aria-label="Journal categories">
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
                isSelected
                  ? "bg-purple-600/20 text-purple-200 font-semibold border border-purple-500/40 shadow-xs"
                  : "bg-white/[0.03] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:border-white/[0.12]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
});
