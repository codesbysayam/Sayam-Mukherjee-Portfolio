import { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, ArrowLeft, Search, 
  Terminal, Sparkles, ExternalLink
} from "lucide-react";
import { JOURNAL_ENTRIES, JournalEntry } from "../data/journal";

function BlogsSectionComponent() {
  // Only genuine, published notes from verified data are evaluated
  const publishedEntries = useMemo(() => {
    return JOURNAL_ENTRIES.filter((entry) => entry.published);
  }, []);

  const count = publishedEntries.length;
  const hasEntries = count > 0;

  // Search & Filter state (strictly guarded: only visible if >= 4 genuine entries exist)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [readingEntryId, setReadingEntryId] = useState<string | null>(null);

  // Dynamic categories extracted strictly from real data (never hardcoded)
  const categories = useMemo(() => {
    if (count < 4) return [];
    const unique = Array.from(
      new Set(publishedEntries.map((e) => e.category).filter(Boolean))
    ) as string[];
    return ["All", ...unique];
  }, [publishedEntries, count]);

  // Dynamic search filtering over verified data
  const filteredEntries = useMemo(() => {
    if (!hasEntries) return [];
    if (count < 4) return publishedEntries;

    const q = searchQuery.toLowerCase().trim();

    return publishedEntries.filter((entry) => {
      const matchesSearch = 
        !q ||
        [entry.title, entry.category, ...(entry.tags ?? []), entry.excerpt ?? "", entry.content]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesCategory = 
        selectedCategory === "All" || 
        (entry.category && entry.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [publishedEntries, searchQuery, selectedCategory, hasEntries, count]);

  // Featured entry resolution:
  // If explicitly flagged as featured, prioritize it; otherwise newest genuine entry
  const featuredEntry = useMemo(() => {
    if (!hasEntries) return null;
    return publishedEntries.find((e) => e.featured) || publishedEntries[0];
  }, [publishedEntries, hasEntries]);

  // Entries to render in list (if featured entry is elevated separately, or all items)
  const listEntries = useMemo(() => {
    if (!hasEntries) return [];
    if (featuredEntry && publishedEntries.length > 1) {
      return publishedEntries.filter((e) => e.id !== featuredEntry.id);
    }
    return publishedEntries;
  }, [publishedEntries, featuredEntry, hasEntries]);

  // Reading article modal target
  const activeReadingEntry = useMemo(() => {
    if (!readingEntryId) return null;
    return publishedEntries.find((e) => e.id === readingEntryId) || null;
  }, [publishedEntries, readingEntryId]);

  // Navigate to existing portfolio sections
  const handleNavigate = (tab: "projects" | "contact") => {
    window.dispatchEvent(new CustomEvent("portfolio-navigate-tab", { detail: tab }));
  };

  return (
    <div className="journal-wrapper relative w-full font-sans text-zinc-100 min-h-[70vh]" id="journal">
      {/* Component-scoped precise layout & micro-interaction styles */}
      <style>{`
        .PremiumJournalHeader {
          max-width: 1180px;
          margin: 0 auto;
          padding: clamp(72px, 9vw, 120px) 24px 40px;
          position: relative;
        }

        .journal-container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px 96px;
        }

        /* 4-column editorial grid for genuine entries */
        .journal-entry {
          display: grid;
          grid-template-columns: 90px 150px minmax(0, 1fr) 120px;
          gap: 24px;
          padding: 32px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.10);
          position: relative;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .journal-entry:hover {
          border-top-color: rgba(168, 85, 247, 0.4);
        }

        .journal-entry .title {
          transition: transform 200ms ease, color 200ms ease;
        }

        .journal-entry:hover .title {
          transform: translateX(4px);
        }

        .journal-entry .arrow {
          transition: transform 200ms ease;
        }

        .journal-entry:hover .arrow {
          transform: translateX(4px);
        }

        .journal-entry .accent-line {
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .journal-entry:hover .accent-line {
          transform: scaleX(1);
        }

        @media (max-width: 900px) {
          .journal-entry {
            grid-template-columns: 70px 130px minmax(0, 1fr) 110px;
            gap: 16px;
          }
        }

        @media (max-width: 760px) {
          .journal-entry {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        /* Featured note container */
        .featured-note-card {
          padding: clamp(28px, 4vw, 44px);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.10);
          position: relative;
          overflow: hidden;
          transition: border-color 0.25s ease, background 0.25s ease;
        }

        .featured-note-card:hover {
          border-color: rgba(168, 85, 247, 0.45);
          background: rgba(255, 255, 255, 0.04);
        }

        /* Intentional Empty State Notebook Card */
        .journal-empty-notebook {
          border-radius: 24px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.03) 0%,
            rgba(255, 255, 255, 0.01) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow: 
            0 20px 60px -15px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          position: relative;
          overflow: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
          .journal-entry .title,
          .journal-entry .arrow,
          .journal-entry .accent-line {
            transform: none !important;
          }
        }

        /* Light Mode Harmonization */
        html.light .journal-wrapper,
        html[data-theme="light"] .journal-wrapper {
          color: #18181b !important;
        }

        html.light .journal-entry,
        html[data-theme="light"] .journal-entry {
          border-top-color: rgba(0, 0, 0, 0.10) !important;
        }

        html.light .journal-entry:hover,
        html[data-theme="light"] .journal-entry:hover {
          border-top-color: rgba(147, 51, 234, 0.5) !important;
        }

        html.light .journal-empty-notebook,
        html[data-theme="light"] .journal-empty-notebook {
          background: rgba(255, 255, 255, 0.85) !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
          box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1) !important;
        }

        html.light .featured-note-card,
        html[data-theme="light"] .featured-note-card {
          background: rgba(255, 255, 255, 0.8) !important;
          border-color: rgba(0, 0, 0, 0.09) !important;
        }
      `}</style>

      {/* Subtle Radial Glow Behind Header (Specification Section 19) */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[480px] pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(139,92,246,0.10), transparent 45%)"
        }}
        aria-hidden="true" 
      />

      {/* ==================================================
          PAGE HEADER (Specification Sections 1, 7, 8)
          ================================================== */}
      <header className="PremiumJournalHeader">
        <div className="space-y-4">
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span 
              className="font-mono text-purple-400 font-semibold uppercase tracking-[0.18em]"
              style={{ fontSize: "12px" }}
            >
              PERSONAL ENGINEERING LOG
            </span>
          </div>

          {/* Main Heading */}
          <h1 
            className="font-display font-extrabold text-white tracking-[-0.05em] leading-[0.95]"
            style={{
              fontSize: "clamp(3rem, 6vw, 6rem)"
            }}
          >
            Notes from the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
              build.
            </span>
          </h1>

          {/* Authentic Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed pt-1 font-normal">
            Experiments, lessons and ideas worth keeping.
          </p>

          {/* Thin horizontal rule & Journal Status Line (Section 8) */}
          <div className="pt-6">
            <div className="w-full h-px bg-white/10" />
            <div className="pt-4 flex items-center gap-3 text-xs font-mono text-zinc-400">
              <span className="uppercase tracking-widest text-zinc-500 font-medium">
                JOURNAL STATUS
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-purple-300 font-semibold tracking-wide">
                [ {count === 0 ? "PRIVATE BUILD LOG" : `${count} PUBLISHED NOTE${count === 1 ? "" : "S"}`} ]
              </span>
            </div>
          </div>
        </div>

        {/* Real Search Bar: ONLY rendered if >= 4 genuine notes exist (Section 14) */}
        {count >= 4 && (
          <div className="mt-8 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              aria-label="Search notes"
              placeholder="⌕ Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 focus:border-purple-500/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all"
            />
          </div>
        )}

        {/* Real Category Filter: ONLY rendered if >= 4 genuine notes exist (Section 15) */}
        {count >= 4 && categories.length > 2 && (
          <div className="flex flex-wrap gap-2 mt-4" role="tablist" aria-label="Journal categories">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-purple-500/15 border-purple-500/60 text-purple-200 font-medium"
                      : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* ==================================================
          MAIN BODY: INTENTIONAL EMPTY STATE OR EDITORIAL LOG
          ================================================== */}
      <main className="journal-container">
        {!hasEntries ? (
          /* ==================================================
             INTENTIONAL & PREMIUM EMPTY STATE (Sections 2 & 11)
             ================================================== */
          <div className="journal-empty-notebook p-8 sm:p-14 max-w-3xl mx-auto text-left relative">
            {/* Subtle top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

            <div className="space-y-6">
              {/* Large editorial index marker with restrained pulse indicator */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-zinc-600 select-none">
                  00
                </span>
                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  <span>AWAITING ENTRY</span>
                </div>
              </div>

              {/* Empty state title */}
              <div className="space-y-2 pt-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white uppercase">
                  NOTHING PUBLISHED YET
                </h2>
                <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal max-w-xl">
                  I’m keeping this space for genuine notes from projects, experiments and things I actually learn along the way.
                </p>
              </div>

              {/* Thin notebook divider */}
              <div className="w-full h-px bg-white/10 pt-2" />

              {/* Action Button: Explore Projects (Section 2 & 11) */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleNavigate("projects")}
                  className="px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 hover:border-purple-500/50 text-white font-mono text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 group shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <span className="text-xs font-mono text-zinc-500 italic">
                  // Real code repositories & architecture logs
                </span>
              </div>
            </div>
          </div>
        ) : filteredEntries.length === 0 ? (
          /* SEARCH EMPTY STATE (ONLY WHEN SEARCHING >= 4 ENTRIES) */
          <div className="journal-empty-notebook p-10 text-center max-w-lg mx-auto space-y-3">
            <p className="text-sm font-mono text-zinc-400">No notes matching "{searchQuery}"</p>
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="text-xs font-mono text-purple-400 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* ==================================================
             EDITORIAL LIST & FEATURED ENTRY (Sections 4, 5, 9, 10)
             ================================================== */
          <div className="space-y-12">
            {/* FEATURED NOTE (Section 5: Only when genuine entries exist) */}
            {featuredEntry && (
              <section aria-label="Featured note" className="mb-12">
                <div 
                  onClick={() => setReadingEntryId(featuredEntry.id)}
                  className="featured-note-card group cursor-pointer"
                >
                  {/* Subtle hover accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-6 pb-4 border-b border-white/10">
                    <span className="text-purple-400 uppercase tracking-widest font-semibold">
                      FEATURED NOTE
                    </span>
                    <span className="font-bold text-zinc-400">01</span>
                  </div>

                  <div className="space-y-4 max-w-3xl">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white group-hover:text-purple-300 transition-colors leading-tight">
                      {featuredEntry.title}
                    </h2>

                    {featuredEntry.excerpt && (
                      <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
                        {featuredEntry.excerpt}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs font-mono">
                      <div className="flex items-center gap-3 text-zinc-400">
                        {featuredEntry.category && (
                          <span className="uppercase tracking-wider font-semibold text-purple-300">
                            {featuredEntry.category}
                          </span>
                        )}
                        {featuredEntry.category && featuredEntry.date && <span>·</span>}
                        {featuredEntry.date && (
                          <span className="text-zinc-500">{featuredEntry.date}</span>
                        )}
                        {/* Explicit related project relationship if stored (Section 16) */}
                        {featuredEntry.relatedProject && (
                          <>
                            <span>·</span>
                            <span className="text-cyan-400 font-semibold">
                              RELATED PROJECT: {featuredEntry.relatedProject.name} →
                            </span>
                          </>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1.5 text-purple-400 group-hover:text-cyan-300 font-semibold transition-colors">
                        <span>Read note</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* EDITORIAL LOG LIST (Section 4 & 9) */}
            <section aria-label="Journal entries" className="space-y-0">
              {listEntries.map((entry, index) => {
                const entryNumber = String(index + (featuredEntry && publishedEntries.length > 1 ? 2 : 1)).padStart(2, "0");
                const entryYear = entry.date ? entry.date.split(",")[1]?.trim() || entry.date.split(" ")[2] || "2026" : "2026";

                return (
                  <article
                    key={entry.id}
                    onClick={() => setReadingEntryId(entry.id)}
                    className="journal-entry group cursor-pointer"
                  >
                    {/* Hover accent line */}
                    <div className="accent-line absolute top-0 left-0 right-0 h-[1px] bg-purple-400" />

                    {/* Column 1: NUMBER + Year */}
                    <div className="font-mono text-xs text-zinc-500 space-y-1">
                      <div className="text-lg sm:text-xl font-bold text-zinc-400 group-hover:text-purple-300 transition-colors">
                        {entryNumber}
                      </div>
                      <div className="text-[11px] text-zinc-600">{entryYear}</div>
                    </div>

                    {/* Column 2: CATEGORY (12px uppercase monospace) */}
                    <div className="font-mono text-xs uppercase tracking-wider text-purple-400/90 font-semibold pt-1">
                      {entry.category || "ENGINEERING"}
                    </div>

                    {/* Column 3: CONTENT (Title clamp 1.4-2.2rem, Excerpt 16-18px) */}
                    <div className="space-y-2">
                      <h3 
                        className="title font-display font-bold text-white group-hover:text-purple-300 leading-snug"
                        style={{ fontSize: "clamp(1.4rem, 2.4vw, 2.2rem)" }}
                      >
                        {entry.title}
                      </h3>

                      {entry.excerpt && (
                        <p className="text-base text-zinc-400 leading-relaxed max-w-2xl font-normal">
                          {entry.excerpt}
                        </p>
                      )}

                      {/* Related Project (Section 16: only if explicitly present) */}
                      {entry.relatedProject && (
                        <div className="pt-1 text-xs font-mono text-cyan-400 font-semibold">
                          RELATED PROJECT: {entry.relatedProject.name} →
                        </div>
                      )}
                    </div>

                    {/* Column 4: ACTION */}
                    <div className="flex items-start justify-end pt-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-400 group-hover:text-cyan-300 font-semibold transition-colors whitespace-nowrap">
                        <span>Read note</span>
                        <ArrowRight className="arrow w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        )}

        {/* ==================================================
            EDITORIAL FOOTER (Section 22)
            ================================================== */}
        <footer className="mt-20 pt-8 border-t border-white/10 text-center">
          <p className="text-xs sm:text-sm font-mono text-zinc-500 tracking-wide">
            “Documenting what’s worth remembering.”
          </p>
        </footer>
      </main>

      {/* ==================================================
          READER MODAL (Clean, editorial reading view for full note)
          ================================================== */}
      <AnimatePresence>
        {activeReadingEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setReadingEntryId(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-zinc-950 border border-white/15 p-6 sm:p-10 space-y-6 shadow-2xl text-zinc-200"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <button
                  type="button"
                  onClick={() => setReadingEntryId(null)}
                  className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Journal</span>
                </button>
                {activeReadingEntry.date && (
                  <span className="text-xs font-mono text-zinc-500">
                    {activeReadingEntry.date}
                  </span>
                )}
              </div>

              {/* Note Header */}
              <div className="space-y-3">
                {activeReadingEntry.category && (
                  <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold block">
                    {activeReadingEntry.category}
                  </span>
                )}
                <h1 className="text-2xl sm:text-4xl font-bold font-display text-white leading-tight">
                  {activeReadingEntry.title}
                </h1>
                {activeReadingEntry.excerpt && (
                  <p className="text-base text-zinc-400 italic">
                    {activeReadingEntry.excerpt}
                  </p>
                )}
              </div>

              {/* Note Content */}
              <div className="text-base leading-relaxed space-y-4 text-zinc-300 font-sans whitespace-pre-line pt-2 border-t border-white/5">
                {activeReadingEntry.content}
              </div>

              {/* Modal Bottom Close */}
              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setReadingEntryId(null)}
                  className="px-5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  Close Note
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const BlogsSection = memo(BlogsSectionComponent);
export default BlogsSection;
