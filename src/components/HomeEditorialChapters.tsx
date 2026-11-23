import React from "react";
import { ArrowRight } from "lucide-react";
import { EditorialReveal, StaggerGroup, StaggerItem, TextMaskReveal } from "../motion/Reveal";
import { EditorialSectionHeader } from "./common/EditorialSectionHeader";

export type HomeNavTarget =
  | "about"
  | "projects"
  | "skills"
  | "ecosystem"
  | "certificates"
  | "journal"
  | "showcase"
  | "contact";

interface HomeEditorialChaptersProps {
  onNavigateTab: (tab: HomeNavTarget) => void;
}

const DIRECTORY_ITEMS: Array<{
  index: string;
  tab: HomeNavTarget;
  title: string;
  subtitle: string;
  actionLabel: string;
}> = [
  {
    index: "01",
    tab: "projects",
    title: "Selected Projects",
    subtitle:
      "Case studies, architecture notes, screenshots, and source repositories across full-stack, AI, and systems work.",
    actionLabel: "View Projects",
  },
  {
    index: "02",
    tab: "skills",
    title: "Technical Capabilities",
    subtitle:
      "Structured capability index spanning programming languages, frontend & backend engineering, ML, computer vision, and core CS.",
    actionLabel: "Explore Skills",
  },
  {
    index: "03",
    tab: "ecosystem",
    title: "Systems & Architecture",
    subtitle:
      "How data flow, API boundaries, state transitions, human-in-the-loop gates, and failure recovery come together in practice.",
    actionLabel: "Read Principles",
  },
  {
    index: "04",
    tab: "journal",
    title: "Engineering Journal",
    subtitle:
      "Long-form reflections on building software, product lessons, research experiments, and design clarity.",
    actionLabel: "Read Essays",
  },
  {
    index: "05",
    tab: "certificates",
    title: "Credentials & Academic Record",
    subtitle:
      "Verified competition milestones, technical certificates, and academic transcripts.",
    actionLabel: "Inspect Records",
  },
  {
    index: "06",
    tab: "contact",
    title: "Contact & Collaboration",
    subtitle:
      "Direct email channels and inquiry form for engineering internships, product builds, and technical conversations.",
    actionLabel: "Get in Touch",
  },
];

export const HomeEditorialChapters: React.FC<HomeEditorialChaptersProps> = ({
  onNavigateTab,
}) => {
  return (
    <>
      {/* 01. PERSONAL STATEMENT & APPROACH */}
      <section
        id="home-about-chapter"
        aria-labelledby="home-about-heading"
        className="w-full border-t border-[var(--border)] py-12 sm:py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-3">
            <EditorialReveal>
              <span className="inline-block editorial-overline text-[var(--accent)]">
                01 · Perspective
              </span>
            </EditorialReveal>
            <h2
              id="home-about-heading"
              className="font-display font-extrabold text-[clamp(1.85rem,3.6vw,3rem)] leading-[1.08] tracking-[-0.03em] text-[var(--text)] text-balance"
            >
              <TextMaskReveal immediate={false}>Building software from</TextMaskReveal>{" "}
              <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                first principles.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <EditorialReveal delay={0.08}>
              <p className="text-base sm:text-[17px] leading-[1.7] text-[var(--text-secondary)] max-w-[64ch]">
                I am a Computer Science &amp; Engineering undergraduate specializing in AI &amp; ML at KIIT University, originally from Hooghly, West Bengal. My work sits at the intersection of clear interface engineering, predictable backend contracts, and applied machine learning.
              </p>
              <p className="mt-4 text-sm sm:text-base leading-[1.7] text-[var(--text-muted)] max-w-[64ch]">
                Whether designing human-gated agent workflows, unifying public weather streams, or practicing algorithmic efficiency in C++, I care about systems that remain transparent to the people using them.
              </p>
            </EditorialReveal>

            <EditorialReveal delay={0.14}>
              <div className="pt-2 flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={() => onNavigateTab("about")}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] hover:underline cursor-pointer group min-h-[40px]"
                >
                  <span>Read Full Background</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </EditorialReveal>
          </div>
        </div>
      </section>

      {/* 02. EDITORIAL PUBLICATION INDEX (CLEAN SECTION NAVIGATION) */}
      <section
        id="home-index-chapter"
        aria-labelledby="home-index-heading"
        className="w-full border-t border-[var(--border)] py-12 sm:py-16 space-y-8"
      >
        <EditorialSectionHeader
          eyebrow="02 · Directory"
          title="Explore the"
          italicHighlight="portfolio."
          description="Each section focuses on one aspect of my engineering background—without repeated widgets or clutter."
        />

        <StaggerGroup
          stagger={0.04}
          className="border-t border-b border-[var(--border)] divide-y divide-[var(--border)]"
        >
          {DIRECTORY_ITEMS.map((item) => (
            <StaggerItem key={item.tab}>
              <button
                type="button"
                onClick={() => onNavigateTab(item.tab)}
                className="w-full py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-8 text-left group cursor-pointer transition-colors hover:bg-[var(--surface)]/60 px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-[6px]"
              >
                <div className="flex items-baseline gap-4 min-w-0">
                  <span className="font-mono text-xs text-[var(--accent)] font-semibold tabular-nums shrink-0">
                    {item.index}
                  </span>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-muted)] group-hover:text-[var(--accent)] shrink-0 pl-8 sm:pl-0">
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </>
  );
};

export default HomeEditorialChapters;
