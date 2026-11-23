import React, { useEffect, useMemo, useState, useRef } from "react";
import { ArrowLeft, Calendar, Clock, BookOpen, User, Check, Share2 } from "lucide-react";
import { journalEntries } from "../data/journal";
import { calculateReadingTime } from "../utils/readingTime";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ReadingProgressBar from "../components/common/ReadingProgressBar";
import { EditorialReveal, LineReveal, StaggerGroup, StaggerItem } from "../motion/Reveal";
import { usePrefersReducedMotion } from "../motion/tokens";

interface JournalDetailProps {
  slug: string;
  onBack: () => void;
  onSelectEntry: (slug: string) => void;
}

export function JournalDetail({ slug, onBack, onSelectEntry }: JournalDetailProps) {
  const reduced = usePrefersReducedMotion();
  const [copied, setCopied] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  const entry = useMemo(() => {
    return journalEntries.find((e) => e.slug === slug) || null;
  }, [slug]);

  const readingStats = useMemo(() => (entry ? calculateReadingTime(entry) : null), [entry]);

  const relatedEntries = useMemo(() => {
    if (!entry) return [];
    return journalEntries.filter((e) => e.slug !== entry.slug).slice(0, 2);
  }, [entry]);

  useEffect(() => {
    if (entry) {
      document.title = `${entry.title} | Sayam Mukherjee Journal`;
    }
    return () => {
      document.title = "Sayam Mukherjee | Engineering Portfolio & Ecosystem";
    };
  }, [entry]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [slug, reduced]);

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
      <div
        className="card max-w-3xl mx-auto py-16 text-center space-y-5 p-8 my-8 font-sans"
        style={{
          backgroundColor: "var(--surface-2)",
          borderColor: "var(--border)",
        }}
      >
        <BookOpen className="w-10 h-10 text-[var(--text-faint)] mx-auto" aria-hidden="true" />
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-[var(--text)] font-display">
            Journal Entry Not Found
          </h2>
          <p className="text-sm text-[var(--text-muted)] font-mono">
            The requested journal entry does not exist or has been moved.
          </p>
        </div>
        <button type="button" onClick={onBack} className="btn btn-primary text-xs font-mono">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <ReadingProgressBar
        targetRef={articleRef}
        height={3}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      />

      <article
        ref={articleRef}
        className="max-w-[var(--reading-max,760px)] mx-auto space-y-8 sm:space-y-10 py-2 sm:py-4 font-sans text-[var(--text-secondary)]"
      >
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Journal", href: "/journal", onClick: onBack },
            { label: entry.title },
          ]}
        />

        {/* Top navigation */}
        <nav aria-label="Journal Navigation" className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary min-h-[40px] px-3.5 py-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Journal</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="btn btn-secondary min-h-[40px] px-3.5 py-1.5 text-xs font-mono"
            title="Copy article link"
            aria-label="Copy link to journal entry"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span className="text-[var(--accent)]">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </nav>

        {/* Editorial Header */}
        <EditorialReveal immediate>
          <header className="space-y-4 pb-6">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono tracking-wider">
              <span className="font-semibold uppercase text-[11px] text-[var(--accent)]">
                {entry.category}
              </span>
              <span className="text-[var(--text-faint)]" aria-hidden="true">
                &bull;
              </span>
              <span className="text-[var(--text-muted)] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                {entry.date}
              </span>
              <span className="text-[var(--text-faint)]" aria-hidden="true">
                &bull;
              </span>
              <span
                className="text-[var(--text-muted)] flex items-center gap-1 tabular-nums"
                title={`Estimated reading time based on 200 WPM (${readingStats?.words || 0} words)`}
              >
                <Clock className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                <span>{readingStats?.formatted || entry.readingTime}</span>
                {readingStats && (
                  <span className="text-[var(--text-faint)] text-[11px]">
                    ({readingStats.words} words)
                  </span>
                )}
              </span>
              <span className="text-[var(--text-faint)]" aria-hidden="true">
                &bull;
              </span>
              <span className="text-[var(--text-muted)] flex items-center gap-1">
                <User className="w-3.5 h-3.5" aria-hidden="true" />
                Sayam Mukherjee
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-[var(--text)] leading-[1.12]">
              {entry.title}
            </h1>

            {/* Lead Summary Callout */}
            <div className="py-4 border-y border-[var(--border)]">
              <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed font-serif-editorial italic">
                &ldquo;{entry.summary}&rdquo;
              </p>
            </div>
          </header>
        </EditorialReveal>

        <LineReveal immediate />

        {/* Main Article Content */}
        <div className="space-y-8 text-base leading-relaxed font-sans">
          {entry.content.map((section, idx) => (
            <EditorialReveal key={idx} delay={Math.min(idx * 0.03, 0.12)}>
              <section className="space-y-3.5">
                {section.heading && (
                  <h2 className="text-lg sm:text-xl font-bold font-display text-[var(--text)] tracking-tight pt-2">
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className="leading-relaxed text-[var(--text-secondary)] text-[15px] sm:text-base"
                  >
                    {p}
                  </p>
                ))}
              </section>
            </EditorialReveal>
          ))}
        </div>

        {/* Bottom Attribution */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary min-h-[40px] text-xs font-mono w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journal</span>
          </button>

          <span className="text-xs font-mono text-[var(--text-faint)]">
            Personal observation note by Sayam Mukherjee
          </span>
        </div>

        {/* Related Journal Links */}
        {relatedEntries.length > 0 && (
          <aside className="pt-8 border-t space-y-4" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
              More Journal Notes
            </h3>
            <StaggerGroup stagger={0.05} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedEntries.map((rel) => (
                <StaggerItem key={rel.slug}>
                  <div
                    onClick={() => onSelectEntry(rel.slug)}
                    className="card group p-4 cursor-pointer hover:-translate-y-0.5 h-full"
                    style={{
                      backgroundColor: "var(--surface-2)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <span className="text-[10px] font-mono text-[var(--accent)] uppercase tracking-wider block mb-1">
                      {rel.category} &bull; {rel.date}
                    </span>
                    <h4 className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)] font-display line-clamp-1 transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1">
                      {rel.summary}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </aside>
        )}
      </article>
    </>
  );
}

export default JournalDetail;
