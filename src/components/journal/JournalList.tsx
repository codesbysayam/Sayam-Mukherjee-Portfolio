import React, { useState, useMemo, memo } from "react";
import { BookOpen, SearchX, Clock } from "lucide-react";
import { journalEntries } from "../../data/journal";
import { JournalCard } from "./JournalCard";
import { JournalFilters } from "./JournalFilters";
import { calculateReadingTime, STANDARD_READING_SPEED_WPM } from "../../utils/readingTime";

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

  const filteredEntries = useMemo(() => {
    let result = [...journalEntries];

    if (selectedCategory !== "All") {
      result = result.filter(
        (entry) =>
          entry.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          selectedCategory.toLowerCase().includes(entry.category.toLowerCase())
      );
    }

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

  const totalReadingStats = useMemo(() => {
    let totalMinutes = 0;
    let totalWords = 0;
    for (const entry of journalEntries) {
      const s = calculateReadingTime(entry);
      totalMinutes += s.minutes;
      totalWords += s.words;
    }
    return { totalMinutes, totalWords };
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Editorial Masthead Header */}
      <header
        className="space-y-3.5 pt-2 sm:pt-4 border-b pb-6"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[var(--accent)] uppercase font-semibold">
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Technical Field Notes &bull; Observations &bull; Systems Design</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-[var(--text)]">
            Engineering{" "}
            <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
              Journal
            </span>
          </h1>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Written by Sayam Mukherjee
          </span>
        </div>
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Personal reflections on software architecture, interface craft, academic rigor, and machine learning experiments. Authentic engineering observations written directly from practice.
        </p>

        {/* Reading stats */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-[var(--text-muted)]">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-[var(--text-secondary)] tabular-nums"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <Clock className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
            <span>
              ~{totalReadingStats.totalMinutes} mins total reading time (
              {totalReadingStats.totalWords} words)
            </span>
          </span>
          <span className="text-[var(--text-faint)]">
            Estimated at standard {STANDARD_READING_SPEED_WPM} WPM
          </span>
        </div>
      </header>

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

      {filteredEntries.length === 0 ? (
        <div
          className="card py-16 text-center space-y-4 p-8"
          style={{
            backgroundColor: "var(--surface-2)",
            borderColor: "var(--border)",
          }}
        >
          <SearchX className="w-8 h-8 text-[var(--text-faint)] mx-auto" aria-hidden="true" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-[var(--text)] font-display">
              No journal entries match your search.
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Try adjusting your query or resetting category filters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearFilters}
            className="btn btn-primary text-xs font-mono"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {featuredEntry && (
            <div className="mb-2">
              <JournalCard
                entry={featuredEntry}
                onClick={onSelectEntry}
                featured={true}
              />
            </div>
          )}

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
