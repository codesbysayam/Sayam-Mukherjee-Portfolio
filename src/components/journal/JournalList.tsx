import React, { useState, useMemo, memo } from "react";
import { BookOpen, SearchX, Sparkles } from "lucide-react";
import { journalEntries } from "../../data/journal";
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

    // Sort order
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
      {/* Editorial Masthead Header */}
      <header className="space-y-3 pt-2 sm:pt-4 border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-purple-400 uppercase">
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Technical Field Notes &bull; Observations &bull; Systems Design</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white">
            Journal
          </h1>
          <span className="text-xs font-mono text-zinc-400">
            Written by Sayam Mukherjee
          </span>
        </div>
        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
          Personal reflections on software architecture, interface craft, academic rigor, and machine learning experiments. Authentic engineering observations, not third-party publications.
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
        <div className="py-16 text-center space-y-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] p-8">
          <SearchX className="w-8 h-8 text-zinc-500 mx-auto" aria-hidden="true" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white font-display">
              No journal entries match your search.
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Try adjusting your query or resetting category filters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-200 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/20 transition-all cursor-pointer"
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

          {/* Responsive Editorial Grid */}
          {gridEntries.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {gridEntries.map((entry, idx) => (
                <JournalCard
                  key={entry.slug}
                  entry={entry}
                  onClick={onSelectEntry}
                  featured={false}
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
