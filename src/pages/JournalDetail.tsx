import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  User,
  Check,
  Share2,
  Copy,
  List,
  Info,
} from "lucide-react";
import { journalEntries } from "../data/journal";
import { calculateReadingTime } from "../utils/readingTime";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ReadingProgressBar from "../components/common/ReadingProgressBar";
import {
  JournalVisualCover,
  JournalDiagramBlock,
} from "../components/journal/JournalVisualCover";
import { EditorialReveal, LineReveal, StaggerGroup, StaggerItem } from "../motion/Reveal";
import { usePrefersReducedMotion } from "../motion/tokens";

interface JournalDetailProps {
  slug: string;
  onBack: () => void;
  onSelectEntry: (slug: string) => void;
}

function slugifyHeading(text: string, idx: number): string {
  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return clean || `section-${idx + 1}`;
}

export function JournalDetail({ slug, onBack, onSelectEntry }: JournalDetailProps) {
  const reduced = usePrefersReducedMotion();
  const [copied, setCopied] = useState(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const articleRef = useRef<HTMLElement>(null);

  const entry = useMemo(() => {
    return journalEntries.find((e) => e.slug === slug) || null;
  }, [slug]);

  const readingStats = useMemo(() => (entry ? calculateReadingTime(entry) : null), [entry]);

  const tocItems = useMemo(() => {
    if (!entry) return [];
    return entry.content
      .map((sec, idx) =>
        sec.heading
          ? { id: slugifyHeading(sec.heading, idx), title: sec.heading, index: idx + 1 }
          : null
      )
      .filter((item): item is { id: string; title: string; index: number } => Boolean(item));
  }, [entry]);

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
    if (tocItems[0]) {
      setActiveSectionId(tocItems[0].id);
    }
  }, [slug, reduced, tocItems]);

  useEffect(() => {
    if (tocItems.length === 0 || typeof IntersectionObserver === "undefined") return;

    const elements = tocItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      { rootMargin: "-18% 0px -65% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [tocItems, slug]);

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/journal/${slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard denials
    }
  };

  const handleCopyCode = async (code: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeIdx(idx);
      setTimeout(() => setCopiedCodeIdx(null), 1800);
    } catch {
      // Ignore clipboard denials
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveSectionId(id);
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  if (!entry) {
    return (
      <div className="card max-w-3xl mx-auto py-16 text-center space-y-5 p-8 my-8 font-sans bg-[var(--surface-2)] border-[var(--border)]">
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
        className="max-w-[var(--container-standard)] mx-auto space-y-8 sm:space-y-10 py-2 sm:py-4 font-sans text-[var(--text-secondary)]"
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
            className="btn btn-secondary !min-h-[44px] sm:!min-h-[40px] !px-3.5 !py-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Journal</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="btn btn-secondary !min-h-[44px] sm:!min-h-[40px] !px-3.5 !py-1.5 text-xs font-mono"
            title="Copy article link"
            aria-label="Copy link to journal entry"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                <span className="text-[var(--accent)]">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Share</span>
              </>
            )}
          </button>
        </nav>

        {/* Editorial Hero Header & Visual Cover */}
        <EditorialReveal immediate>
          <header className="space-y-6 pb-2">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono tracking-wider text-[var(--text-muted)]">
                {entry.issueNumber && (
                  <>
                    <span className="font-bold text-[var(--accent)]">
                      {entry.issueNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <span className="font-semibold uppercase text-[var(--text)]">
                  {entry.category}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  {entry.date}
                </span>
                <span aria-hidden="true">·</span>
                <span
                  className="inline-flex items-center gap-1 tabular-nums text-[var(--text)]"
                  title={`Estimated reading time based on 200 WPM (${readingStats?.words || 0} words)`}
                >
                  <Clock className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  <span>{readingStats?.formatted || entry.readingTime}</span>
                  {readingStats && (
                    <span className="text-[var(--text-muted)] text-[11px]">
                      ({readingStats.words} words)
                    </span>
                  )}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <User className="w-3.5 h-3.5" aria-hidden="true" />
                  Sayam Mukherjee
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold font-display tracking-tight text-[var(--text)] leading-[1.08]">
                {entry.title}
              </h1>

              {entry.subtitle && (
                <p className="text-base sm:text-xl font-serif-editorial italic text-[var(--text)] leading-snug">
                  {entry.subtitle}
                </p>
              )}

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed border-y border-[var(--border)] py-3.5">
                {entry.summary}
              </p>
            </div>

            <JournalVisualCover
              projectId={entry.coverProjectId}
              issueNumber={entry.issueNumber}
              category={entry.category}
              title={entry.title}
              caption={entry.coverCaption}
              variant="hero"
              immediate
            />
          </header>
        </EditorialReveal>

        <LineReveal immediate />

        {/* Two-Column Publication Body + Sticky Desktop Table of Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Table of Contents: Collapsible drawer on <1024px; sticky sidebar on lg+ */}
          {tocItems.length > 0 && (
            <aside
              aria-label="Article table of contents"
              className="lg:col-span-4 desktop-only-pinning lg:sticky lg:top-24 min-w-0"
            >
              <details className="lg:hidden card p-4 bg-[var(--surface-2)] border-[var(--border)] group">
                <summary className="list-none flex items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold cursor-pointer min-h-[44px] -my-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <List className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>In This Essay ({tocItems.length} Sections)</span>
                  </span>
                  <span className="text-[var(--text-muted)] group-open:hidden">Expand</span>
                  <span className="text-[var(--text-muted)] hidden group-open:inline">Hide</span>
                </summary>
                <div className="pt-3 mt-3 border-t border-[var(--border)] space-y-3">
                  <ol className="space-y-1">
                    {tocItems.map((item) => {
                      const isCurrent = activeSectionId === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => scrollToSection(item.id)}
                            className={`w-full min-h-[44px] text-left px-3 py-2 rounded-[6px] text-xs font-mono transition-colors cursor-pointer flex items-baseline gap-2.5 ${
                              isCurrent
                                ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] font-bold"
                                : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                            }`}
                          >
                            <span className="text-[11px] opacity-80 tabular-nums shrink-0">
                              0{item.index}
                            </span>
                            <span className="leading-snug">{item.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </details>

              <div className="hidden lg:block card p-4 sm:p-5 space-y-3 bg-[var(--surface-2)] border-[var(--border)]">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold border-b border-[var(--border)] pb-2.5">
                  <span className="inline-flex items-center gap-1.5">
                    <List className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>In This Essay</span>
                  </span>
                  <span className="text-[var(--text-muted)] tabular-nums">
                    {tocItems.length} Sections
                  </span>
                </div>

                <ol className="space-y-1">
                  {tocItems.map((item) => {
                    const isCurrent = activeSectionId === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left px-2.5 py-2 rounded-[6px] text-xs font-mono transition-colors cursor-pointer flex items-baseline gap-2.5 ${
                            isCurrent
                              ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] font-bold"
                              : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                          }`}
                        >
                          <span className="text-[11px] opacity-80 tabular-nums shrink-0">
                            0{item.index}
                          </span>
                          <span className="leading-snug">{item.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {entry.topics && entry.topics.length > 0 && (
                  <div className="pt-2.5 border-t border-[var(--border)] flex flex-wrap gap-1.5 text-[11px] font-mono text-[var(--text-muted)]">
                    {entry.topics.map((topic, idx) => (
                      <React.Fragment key={topic}>
                        {idx > 0 && <span aria-hidden="true">·</span>}
                        <span>{topic}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* Main Prose Column */}
          <div
            className={`${
              tocItems.length > 0 ? "lg:col-span-8" : "lg:col-span-12 max-w-[var(--reading-max,760px)]"
            } space-y-9 min-w-0 max-w-[66ch]`}
          >
            {entry.content.map((section, idx) => {
              const secId = section.heading
                ? slugifyHeading(section.heading, idx)
                : `section-${idx + 1}`;

              return (
                <EditorialReveal key={secId} delay={Math.min(idx * 0.03, 0.1)}>
                  <section id={secId} className="space-y-4 scroll-mt-28">
                    {section.heading && (
                      <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)] tracking-tight pt-1">
                        {section.heading}
                      </h2>
                    )}

                    {section.paragraphs.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        className="leading-[1.72] text-[var(--text-secondary)] text-[15px] sm:text-base"
                      >
                        {p}
                      </p>
                    ))}

                    {section.callout && (
                      <aside
                        aria-label={section.callout.label}
                        className="rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface-2)] p-4 sm:p-5 space-y-1.5 my-4"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                          <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{section.callout.label}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">
                          {section.callout.body}
                        </p>
                      </aside>
                    )}

                    {section.diagramId && (
                      <JournalDiagramBlock diagramId={section.diagramId} />
                    )}

                    {section.codeSnippet && (
                      <div className="my-5 rounded-[8px] border border-[var(--border-strong)] bg-[#171B16] text-[#F2F1E9] overflow-hidden">
                        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-[#41483B] bg-[#1F241D] text-[11px] font-mono">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[#C7E34A] font-bold uppercase">
                              {section.codeSnippet.language}
                            </span>
                            <span className="text-[#92988A]" aria-hidden="true">·</span>
                            <span className="truncate text-[#EAE9DF]">
                              {section.codeSnippet.title}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(section.codeSnippet!.code, idx)}
                            className="inline-flex items-center gap-1 min-h-[36px] [@media(pointer:coarse)]:min-h-[44px] px-2.5 py-1 rounded-[4px] border border-[#41483B] hover:border-[#C7E34A] text-[#EAE9DF] hover:text-[#C7E34A] transition-colors cursor-pointer shrink-0"
                            aria-label={`Copy ${section.codeSnippet.title} snippet`}
                          >
                            {copiedCodeIdx === idx ? (
                              <>
                                <Check className="w-3 h-3 text-[#C7E34A]" aria-hidden="true" />
                                <span className="text-[#C7E34A]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" aria-hidden="true" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        <pre className="p-4 text-xs leading-relaxed font-mono overflow-x-auto m-0">
                          <code>{section.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}
                  </section>
                </EditorialReveal>
              );
            })}

            {/* Bottom Attribution */}
            <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={onBack}
                className="btn btn-secondary !min-h-[44px] sm:!min-h-[40px] text-xs font-mono w-fit"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back to Journal</span>
              </button>

              <span className="text-xs font-mono text-[var(--text-muted)]">
                Technical field note by Sayam Mukherjee
              </span>
            </div>
          </div>
        </div>

        {/* Related Journal Links */}
        {relatedEntries.length > 0 && (
          <aside className="pt-8 border-t border-[var(--border)] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
              Continue Reading
            </h3>
            <StaggerGroup stagger={0.05} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedEntries.map((rel) => (
                <StaggerItem key={rel.slug}>
                  <button
                    type="button"
                    onClick={() => onSelectEntry(rel.slug)}
                    className="card group p-4 sm:p-5 text-left w-full min-h-[44px] cursor-pointer hover:-translate-y-0.5 h-full bg-[var(--surface-2)] border-[var(--border)] space-y-1.5"
                  >
                    <span className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider block">
                      {rel.issueNumber ? `${rel.issueNumber} · ` : ""}{rel.category} · {rel.date}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[var(--text)] group-hover:text-[var(--accent)] font-display line-clamp-1 transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                      {rel.summary}
                    </p>
                  </button>
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
