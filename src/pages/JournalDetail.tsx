import React, { useEffect, useMemo } from "react";
import { ArrowLeft, Calendar, Clock, BookOpen, User, ArrowUpRight } from "lucide-react";
import { journalEntries, JournalEntry } from "../data/journal";

interface JournalDetailProps {
  slug: string;
  onBack: () => void;
  onSelectEntry: (slug: string) => void;
}

export function JournalDetail({ slug, onBack, onSelectEntry }: JournalDetailProps) {
  const entry = useMemo(() => {
    return journalEntries.find((e) => e.slug === slug) || null;
  }, [slug]);

  // Related entries: other entries excluding current
  const relatedEntries = useMemo(() => {
    if (!entry) return [];
    return journalEntries
      .filter((e) => e.slug !== entry.slug)
      .slice(0, 2);
  }, [entry]);

  // Synchronize document title
  useEffect(() => {
    if (entry) {
      document.title = `${entry.title} | Sayam Mukherjee Journal`;
    }
    return () => {
      document.title = "Sayam Mukherjee | Engineering Portfolio & Ecosystem";
    };
  }, [entry]);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 p-8 my-8 font-sans">
        <BookOpen className="w-10 h-10 text-zinc-600 mx-auto" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-display">
            Journal Entry Not Found
          </h2>
          <p className="text-sm text-zinc-400 font-mono">
            The requested journal entry does not exist or has been moved.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto space-y-10 py-4 font-sans text-zinc-200">
      {/* Top navigation */}
      <nav aria-label="Journal Navigation">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal</span>
        </button>
      </nav>

      {/* Header section */}
      <header className="space-y-4 border-b border-zinc-800/80 pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono tracking-wider">
          <span className="text-zinc-200 font-semibold uppercase">
            {entry.category}
          </span>
          <span className="text-zinc-600 dark:text-zinc-500">•</span>
          <span className="text-zinc-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {entry.date}
          </span>
          <span className="text-zinc-600 dark:text-zinc-500">•</span>
          <span className="text-zinc-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {entry.readingTime}
          </span>
          <span className="text-zinc-600 dark:text-zinc-500">•</span>
          <span className="text-zinc-400 flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            Sayam Mukherjee
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-white leading-tight">
          {entry.title}
        </h1>

        <p className="text-base text-zinc-300 dark:text-zinc-300 leading-relaxed font-sans pt-1 italic">
          {entry.summary}
        </p>
      </header>

      {/* Main article content */}
      <div className="space-y-8 text-base leading-relaxed text-zinc-300 font-sans">
        {entry.content.map((section, idx) => (
          <section key={idx} className="space-y-3.5">
            {section.heading && (
              <h2 className="text-lg sm:text-xl font-semibold font-display text-white tracking-tight pt-2">
                {section.heading}
              </h2>
            )}
            {section.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="leading-relaxed text-zinc-300 text-[15px]">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      {/* Bottom Back Button & Author Sign-off */}
      <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-all cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </button>

        <span className="text-xs font-mono text-zinc-400">
          Personal observation note by Sayam Mukherjee
        </span>
      </div>

      {/* Related Journal Links */}
      {relatedEntries.length > 0 && (
        <aside className="pt-8 border-t border-zinc-800/80 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            More Journal Notes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedEntries.map((rel) => (
              <div
                key={rel.slug}
                onClick={() => onSelectEntry(rel.slug)}
                className="group p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-zinc-700 transition-all cursor-pointer"
              >
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                  {rel.category} • {rel.date}
                </span>
                <h4 className="text-sm font-semibold text-white group-hover:text-zinc-100 font-display line-clamp-1">
                  {rel.title}
                </h4>
                <p className="text-xs text-zinc-300 line-clamp-2 mt-1">
                  {rel.summary}
                </p>
                <div className="pt-2 text-[11px] font-mono text-zinc-400 group-hover:text-white inline-flex items-center gap-1">
                  <span>Read note</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}
