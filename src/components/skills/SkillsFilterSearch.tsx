import React from "react";
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { SKILL_FILTER_TABS, SkillFilterKey } from "../../data/skills";

interface SkillsFilterSearchProps {
  activeFilter: SkillFilterKey;
  setActiveFilter: (key: SkillFilterKey) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultCount: number;
  totalCount: number;
  onReset: () => void;
}

export function SkillsFilterSearch({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  resultCount,
  totalCount,
  onReset,
}: SkillsFilterSearchProps) {
  const isFiltered = activeFilter !== "all" || searchQuery.trim().length > 0;

  return (
    <div className="space-y-3 pt-2">
      {/* Search Bar + Result Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified skills, technologies, or keywords..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 text-sm text-zinc-100 placeholder:text-zinc-500 font-sans transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Counter & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs font-mono text-zinc-400">
            Showing <strong className="text-white">{resultCount}</strong> of {totalCount} verified skills
          </span>

          {isFiltered && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs font-mono">
        {SKILL_FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer font-medium ${
                isActive
                  ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm"
                  : "bg-zinc-950/60 border border-zinc-850 text-zinc-400 hover:text-zinc-200 hover:border-zinc-750"
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
