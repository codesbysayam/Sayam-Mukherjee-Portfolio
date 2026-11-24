import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { EditorialSectionHeader } from "../common/EditorialSectionHeader";
import { ContourBackground } from "../motion/ContourBackground";
import { EditorialReveal } from "../../motion/Reveal";
import { requestScrollTriggerRefresh } from "../../motion/gsapRegistry";
import { SOCIAL_LINKS } from "../../data/siteContent";
import {
  ENGINEERING_STACK_CATEGORIES,
  TOTAL_VERIFIED_TECHNOLOGIES,
} from "../../data/skills";
import { PROJECTS } from "../../data/projects";
import { SkillConstellation } from "./SkillConstellation";
import { EngineeringStackSection } from "./EngineeringStackSection";
import { SkillProjectEvidence } from "./SkillProjectEvidence";
import { CurrentlyDeveloping } from "./CurrentlyDeveloping";
import { EngineeringWorkflow } from "./EngineeringWorkflow";

const CORE_MARQUEE_STACK = [
  "TypeScript",
  "React 19",
  "Next.js 15",
  "Python",
  "FastAPI",
  "PyTorch",
  "YOLOv8 & ByteTrack",
  "Node.js",
  "PostgreSQL",
  "C++20",
  "GSAP ScrollTrigger",
  "Three.js",
];

interface SkillsPageProps {
  onNavigateToProject?: (projectId: string) => void;
}

export function SkillsPage({ onNavigateToProject }: SkillsPageProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  useEffect(() => {
    requestScrollTriggerRefresh(120);
  }, [selectedTech]);

  const navigateTo = (tab: "projects" | "ecosystem") => {
    window.dispatchEvent(new CustomEvent("portfolio-navigate-tab", { detail: tab }));
  };

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-14">
      {/* 1. EDITORIAL OBSERVATORY HERO */}
      <header
        id="skills-hero"
        className="relative py-4 sm:py-6 border-b border-[var(--border)] space-y-6"
      >
        <ContourBackground density="subtle" />

        <div className="relative z-10 space-y-5">
          <EditorialSectionHeader
            level="h1"
            eyebrow="03 · Engineering Capability Observatory"
            title="Capabilities &"
            italicHighlight="verified depth."
            description="An interactive topology of the languages, frameworks, computer vision tools, backend systems, and computer science foundations powering shipped work—without synthetic proficiency percentages."
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[var(--text-muted)] tabular-nums">
              <span>{ENGINEERING_STACK_CATEGORIES.length} Disciplines</span>
              <span aria-hidden="true">·</span>
              <span>{TOTAL_VERIFIED_TECHNOLOGIES} Verified Technologies</span>
              <span aria-hidden="true">·</span>
              <span>{PROJECTS.length} Linked Systems</span>
            </div>
          </EditorialSectionHeader>

          {/* Subtle Pause-on-Hover Technology Ribbon */}
          <div
            className="tech-marquee-wrapper pt-3 border-t border-[var(--border)]"
            aria-label="Core engineering technologies"
          >
            <div className="tech-marquee-track py-1">
              {CORE_MARQUEE_STACK.map((item) => (
                <span
                  key={item}
                  className="shrink-0 px-3 py-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] font-mono text-xs text-[var(--text-secondary)]"
                >
                  {item}
                </span>
              ))}
              {CORE_MARQUEE_STACK.map((item) => (
                <span
                  key={`dup-${item}`}
                  aria-hidden="true"
                  className="shrink-0 px-3 py-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] font-mono text-xs text-[var(--text-secondary)] hidden motion-safe:inline-flex"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 2. INTERACTIVE SKILL CONSTELLATION */}
      <SkillConstellation
        selectedTech={selectedTech}
        onSelectTech={setSelectedTech}
        onNavigateToProject={onNavigateToProject}
      />

      {/* 3. INTERACTIVE CAPABILITY MATRIX & VERIFIED STACK */}
      <section id="capability-index" className="pt-2">
        <EngineeringStackSection
          selectedTech={selectedTech}
          onSelectTech={setSelectedTech}
          onNavigateToProject={onNavigateToProject}
        />
      </section>

      {/* 4. SKILLS IN PRACTICE — SYNCED PROJECT EVIDENCE */}
      <SkillProjectEvidence
        onSelectProject={onNavigateToProject}
        selectedSkillFilter={selectedTech}
        onSkillFilterChange={setSelectedTech}
      />

      {/* 5. CURRENTLY DEVELOPING (QUALITATIVE ONLY) */}
      <CurrentlyDeveloping />

      {/* 6. 7-STAGE ENGINEERING WORKFLOW */}
      <EngineeringWorkflow />

      {/* 7. CONTEXTUAL FOOTER LINKS */}
      <section
        id="skills-context"
        aria-label="Related sections and external profiles"
        className="pt-8 border-t border-[var(--border)] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
      >
        <EditorialReveal className="lg:col-span-7 space-y-2">
          <h2 className="font-display text-lg font-bold text-[var(--text)]">
            Explore working architectures
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Inspect full project case studies and interactive demos in Projects, or trace how system layers interact in Ecosystem.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => navigateTo("projects")}
              className="min-h-[44px] sm:min-h-[36px] inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] hover:underline cursor-pointer group"
            >
              <span>See Projects</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => navigateTo("ecosystem")}
              className="min-h-[44px] sm:min-h-[36px] inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] cursor-pointer"
            >
              <span>System Architecture Principles</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </EditorialReveal>

        <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-x-6 gap-y-2 text-xs font-mono">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] sm:min-h-[36px] inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)]"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
          <a
            href={SOCIAL_LINKS.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] sm:min-h-[36px] inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)]"
          >
            <span>LeetCode</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
          <a
            href={SOCIAL_LINKS.codolio}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] sm:min-h-[36px] inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)]"
          >
            <span>Codolio</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}

export default SkillsPage;
