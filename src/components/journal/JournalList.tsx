import React, { useState, useMemo, memo } from "react";
import { BookOpen, SearchX } from "lucide-react";
import { JournalEntry, journalEntries } from "../../data/journal";
import { JournalCard } from "./JournalCard";
import { JournalFilters } from "./JournalFilters";

interface JournalListProps {
  onSelectEntry: (slug: string) => void;
}

const CATEGORIES = [
  "All",
  "BUILDING",
  "LEARNING",
  "PROJECTS",
  "RESEARCH",
  "CREATIVE WORK",
];

export const JournalList = memo(function JournalList({
  onSelectEntry,
}: JournalListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Filter & Search Logic
  const filteredEntries = useMemo(() => {
    let result = [...journalEntries];

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (entry) =>
          entry.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          selectedCategory.toLowerCase().includes(entry.category.toLowerCase())
      );
    }

    // Search query
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter((entry) => {
        const fullContentText = entry.content
          .flatMap((s) => [s.heading || "", ...s.paragraphs])
          .join(" ")
          .toLowerCase();

        return (
          entry.title.toLowerCase().includes(q) ||
          entry.summary.toLowerCase().includes(q) ||
          entry.category.toLowerCase().includes(q) ||
          fullContentText.includes(q)
        );
      });
    }

    // Sort order (Journal entries are indexed chronologically)
    if (sortOrder === "oldest") {
      result.reverse();
    }

    return result;
  }, [searchQuery, selectedCategory, sortOrder]);

  const featuredEntry = useMemo(() => {
    if (searchQuery.trim().length > 0 || selectedCategory !== "All") {
      return null;
    }
    return filteredEntries.find((e) => e.featured) || filteredEntries[0];
  }, [filteredEntries, searchQuery, selectedCategory]);

  const gridEntries = useMemo(() => {
    if (!featuredEntry) return filteredEntries;
    return filteredEntries.filter((e) => e.slug !== featuredEntry.slug);
  }, [filteredEntries, featuredEntry]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Editorial Header */}
      <header className="space-y-3 pt-2 sm:pt-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Engineering Notes &amp; Observations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white">
          Journal
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 dark:text-zinc-300 max-w-2xl leading-relaxed">
          Reflective notes on building interfaces, academic routines, algorithmic trade-offs, and design decisions. Personal observations, not third-party publications.
        </p>
      </header>

      {/* Filters and Search Bar */}
      <JournalFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={CATEGORIES}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        totalResults={filteredEntries.length}
      />

      {/* Main Content Area */}
      {filteredEntries.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center space-y-4 rounded-2xl bg-zinc-950/40 border border-zinc-900 p-8">
          <SearchX className="w-8 h-8 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white font-display">
              No journal entries match your search.
            </h3>
            <p className="text-xs text-zinc-500 font-mono">
              Try adjusting your query or resetting category filters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
          >
            <span>Clear Search</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Featured Entry Card */}
          {featuredEntry && (
            <div className="mb-2">
              <JournalCard
                entry={featuredEntry}
                onClick={onSelectEntry}
                featured={true}
              />
            </div>
          )}

          {/* 2-Column Responsive Grid */}
          {gridEntries.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {gridEntries.map((entry) => (
                <JournalCard
                  key={entry.slug}
                  entry={entry}
                  onClick={onSelectEntry}
                  featured={false}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
