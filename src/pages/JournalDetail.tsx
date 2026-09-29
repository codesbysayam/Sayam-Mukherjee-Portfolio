import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Calendar, Clock, BookOpen, User, Check, Copy, Share2 } from "lucide-react";
import { journalEntries } from "../data/journal";

interface JournalDetailProps {
  slug: string;
  onBack: () => void;
  onSelectEntry: (slug: string) => void;
}

export function JournalDetail({ slug, onBack, onSelectEntry }: JournalDetailProps) {
  const [copied, setCopied] = useState(false);

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

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/journal/${slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] p-8 my-8 font-sans">
        <BookOpen className="w-10 h-10 text-zinc-500 mx-auto" aria-hidden="true" />
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto space-y-8 sm:space-y-10 py-2 sm:py-4 font-sans text-zinc-200">
      {/* Top action navigation */}
      <nav aria-label="Journal Navigation" className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
          title="Copy article link"
          aria-label="Copy link to journal entry"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>
      </nav>

      {/* Editorial Header Section */}
      <header className="space-y-4 border-b border-white/[0.08] pb-8">
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono tracking-wider">
          <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/25 font-semibold uppercase text-[11px]">
            {entry.category}
          </span>
          <span className="text-zinc-600" aria-hidden="true">&bull;</span>
          <span className="text-zinc-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            {entry.date}
          </span>
          <span className="text-zinc-600" aria-hidden="true">&bull;</span>
          <span className="text-zinc-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            {entry.readingTime}
          </span>
          <span className="text-zinc-600" aria-hidden="true">&bull;</span>
          <span className="text-zinc-400 flex items-center gap-1">
            <User className="w-3.5 h-3.5" aria-hidden="true" />
            Sayam Mukherjee
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-white leading-tight">
          {entry.title}
        </h1>

        {/* Lead Summary Callout */}
        <div className="p-4 rounded-xl bg-white/[0.03] border-l-2 border-purple-500 border-r border-t border-b border-white/[0.06] backdrop-blur-xs">
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans italic">
            "{entry.summary}"
          </p>
        </div>
      </header>

      {/* Main Article Content */}
      <div className="space-y-8 text-base leading-relaxed text-zinc-300 font-sans">
        {entry.content.map((section, idx) => (
          <section key={idx} className="space-y-3.5">
            {section.heading && (
              <h2 className="text-lg sm:text-xl font-semibold font-display text-white tracking-tight pt-2">
                {section.heading}
              </h2>
            )}
            {section.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="leading-relaxed text-zinc-300 text-[15px] sm:text-base">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      {/* Bottom Author Attribution */}
      <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] transition-all cursor-pointer w-fit"
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
        <aside className="pt-8 border-t border-white/[0.08] space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            More Journal Notes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedEntries.map((rel) => (
              <div
                key={rel.slug}
                onClick={() => onSelectEntry(rel.slug)}
                className="group p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-purple-500/35 transition-all cursor-pointer"
              >
                <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider block mb-1">
                  {rel.category} &bull; {rel.date}
                </span>
                <h4 className="text-sm font-semibold text-white group-hover:text-purple-200 font-display line-clamp-1 transition-colors">
                  {rel.title}
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                  {rel.summary}
                </p>
              </div>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}

export default JournalDetail;
