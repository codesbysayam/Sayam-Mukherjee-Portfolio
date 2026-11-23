import React, { useState, useMemo, memo } from "react";
import { SearchX, LayoutGrid, GalleryHorizontalEnd } from "lucide-react";
import { journalEntries } from "../../data/journal";
import { JournalCard } from "./JournalCard";
import { JournalFilters } from "./JournalFilters";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";
import { ContourBackground } from "../motion/ContourBackground";
import { MotionSlider } from "../motion/MotionSlider";
import { EditorialSectionHeader } from "../common/EditorialSectionHeader";

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
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");

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

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Editorial Masthead Header */}
      <header className="relative py-4 sm:py-6 border-b border-[var(--border)] space-y-4">
        <ContourBackground density="subtle" />

        <div className="relative z-10">
          <EditorialSectionHeader
            level="h1"
            eyebrow="06 · Technical Writing & Field Notes"
            title="Engineering"
            italicHighlight="Journal."
            description="Reflections on software architecture, interface clarity, research exploration, and lessons from building real projects."
          >
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {journalEntries.length} Essays · Sayam Mukherjee
            </span>
          </EditorialSectionHeader>
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
            <EditorialReveal immediate className="mb-2">
              <JournalCard
                entry={featuredEntry}
                onClick={onSelectEntry}
                featured={true}
              />
            </EditorialReveal>
          )}

          {gridEntries.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[var(--text-muted)] uppercase tracking-wider">
                  Archive Notes ({gridEntries.length})
                </span>
                <div className="flex items-center gap-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("slider")}
                    aria-pressed={viewMode === "slider"}
                    className={`inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[11px] font-mono transition-colors cursor-pointer ${
                      viewMode === "slider"
                        ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] font-bold"
                        : "text-[var(--text-muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    <GalleryHorizontalEnd className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Slider</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-pressed={viewMode === "grid"}
                    className={`inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[11px] font-mono transition-colors cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] font-bold"
                        : "text-[var(--text-muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Grid</span>
                  </button>
                </div>
              </div>

              {viewMode === "slider" ? (
                <MotionSlider
                  label="Field Notes"
                  columnsClassName="auto-cols-[90%] sm:auto-cols-[62%] lg:auto-cols-[48%]"
                >
                  {gridEntries.map((entry, idx) => (
                    <JournalCard
                      key={entry.slug}
                      entry={entry}
                      onClick={onSelectEntry}
                      featured={false}
                      index={idx}
                    />
                  ))}
                </MotionSlider>
              ) : (
                <StaggerGroup
                  key={`${selectedCategory}-${sortOrder}-${gridEntries.length}`}
                  stagger={0.045}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
                >
                  {gridEntries.map((entry, idx) => (
                    <StaggerItem key={entry.slug} className="h-full">
                      <JournalCard
                        entry={entry}
                        onClick={onSelectEntry}
                        featured={false}
                        index={idx}
                      />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
