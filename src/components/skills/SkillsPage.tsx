import { useMemo, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { EditorialSectionHeader } from "../common/EditorialSectionHeader";
import { ContourBackground } from "../motion/ContourBackground";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";
import { SOCIAL_LINKS } from "../../data/siteContent";

interface CapabilityGroup {
  id: string;
  index: string;
  title: string;
  summary: string;
  capabilities: string[];
  depthNote: string;
}

const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    id: "languages",
    index: "01",
    title: "Programming Languages",
    summary:
      "Typed web development, backend automation, numerical scripting, and asymptotic problem solving across complementary languages.",
    capabilities: [
      "TypeScript",
      "Python",
      "C++ (C++20)",
      "JavaScript (ES2023+)",
      "SQL / PLpgSQL",
      "C",
      "Java",
    ],
    depthNote: "Primary focus on TypeScript for application architecture, Python for ML/CV services, and C++ for algorithms.",
  },
  {
    id: "frontend",
    index: "02",
    title: "Frontend Engineering",
    summary:
      "Component architecture, fluid typography, accessible keyboard navigation, interactive visualizations, and synchronized state views.",
    capabilities: [
      "React 19",
      "Next.js 15",
      "Tailwind CSS",
      "HTML5 & Semantic CSS",
      "D3.js & SVG Visualization",
      "HTML5 Canvas",
      "KaTeX Rendering",
      "Motion & GSAP",
    ],
    depthNote: "Focused on responsive layouts, WCAG contrast parity across light and dark themes, and zero layout shift.",
  },
  {
    id: "backend",
    index: "03",
    title: "Backend Engineering",
    summary:
      "Stateless API design, schema validation, rate limiting, streaming event delivery, and clean separation between handlers and domain state.",
    capabilities: [
      "Node.js",
      "Express.js",
      "FastAPI",
      "REST API Design",
      "Zod Schema Validation",
      "Server-Sent Events (SSE)",
      "Middleware & Auth Guards",
    ],
    depthNote: "Emphasizes explicit request/response contracts, defensive validation, and predictable error boundaries.",
  },
  {
    id: "ai-ml",
    index: "04",
    title: "AI & Machine Learning",
    summary:
      "Structured multi-agent workflows with human approval checkpoints, applied deep learning pipelines, and sequence memory exploration.",
    capabilities: [
      "PyTorch",
      "Multi-Agent Orchestration",
      "Human-in-the-Loop Governance",
      "Recurrent & Fast-Weight Models",
      "Mechanistic Interpretability",
      "Model Evaluation & Metrics",
    ],
    depthNote: "Prioritizes transparent model behavior, inspectable state transitions, and bounded execution.",
  },
  {
    id: "computer-vision",
    index: "05",
    title: "Computer Vision",
    summary:
      "Real-time person detection, keypoint pose estimation, identity association across frames, and latency-aware stream rendering.",
    capabilities: [
      "YOLOv8 Detection & Pose",
      "ByteTrack Object Tracking",
      "17-Keypoint Pose Estimation",
      "NMS & IoU Thresholding",
      "Atomic Frame Synchronization",
    ],
    depthNote: "Pairs Python inference backends with low-jitter client canvas synchronization.",
  },
  {
    id: "data-databases",
    index: "06",
    title: "Data & Databases",
    summary:
      "Relational modeling, document persistence, multi-source telemetry normalization, and resilient client-side state caching.",
    capabilities: [
      "PostgreSQL",
      "Firebase / Firestore",
      "Relational Schema Design",
      "Data Normalization Pipelines",
      "Offline-Tolerant Caching",
    ],
    depthNote: "Focused on consistent schemas across upstream data feeds and persistent stores.",
  },
  {
    id: "developer-tools",
    index: "07",
    title: "Developer Tools & Workflow",
    summary:
      "Version control discipline, automated integration testing, containerized local setups, and edge deployment workflows.",
    capabilities: [
      "Git & GitHub",
      "Vitest & Supertest",
      "Docker",
      "Vercel Edge Deployment",
      "Figma Prototyping",
      "VS Code",
    ],
    depthNote: "Uses reproducible tests and type checking to keep rapid iteration safe.",
  },
  {
    id: "core-cs",
    index: "08",
    title: "Core Computer Science",
    summary:
      "Foundational computer science thinking covering algorithmic complexity, state machines, control planes, and failure recovery.",
    capabilities: [
      "Data Structures & Algorithms",
      "Time & Space Complexity",
      "System Architecture",
      "State Machines & Audit Logs",
      "API Boundary Contracts",
      "Graceful Failure Recovery",
    ],
    depthNote: "Continuous daily practice in C++ alongside undergraduate CSE (AI & ML) coursework.",
  },
];

interface SkillsPageProps {
  onNavigateToProject?: (projectId: string) => void;
}

export function SkillsPage(_props: SkillsPageProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string>("all");

  const visibleGroups = useMemo(() => {
    if (selectedGroupId === "all") return CAPABILITY_GROUPS;
    return CAPABILITY_GROUPS.filter((g) => g.id === selectedGroupId);
  }, [selectedGroupId]);

  const navigateTo = (tab: "projects" | "ecosystem") => {
    window.dispatchEvent(new CustomEvent("portfolio-navigate-tab", { detail: tab }));
  };

  return (
    <div className="w-full space-y-12 pb-14">
      {/* 1. EDITORIAL HEADER */}
      <header
        id="skills-hero"
        className="relative py-4 sm:py-6 border-b border-[var(--border)] space-y-6"
      >
        <ContourBackground density="subtle" />

        <div className="relative z-10 space-y-5">
          <EditorialSectionHeader
            level="h1"
            eyebrow="03 · Technical Capabilities"
            title="Capabilities &"
            italicHighlight="engineering index."
            description="A structured overview of the languages, frameworks, machine learning tools, and computer science foundations I work with—organized by discipline without redundant telemetry or noise."
          />

          {/* Compact group filter bar */}
          <div
            className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[var(--border)]"
            role="group"
            aria-label="Filter capability groups"
          >
            <button
              type="button"
              onClick={() => setSelectedGroupId("all")}
              aria-pressed={selectedGroupId === "all"}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-mono border transition-colors cursor-pointer ${
                selectedGroupId === "all"
                  ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] border-[var(--accent-fill)] font-semibold"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)]"
              }`}
            >
              All Areas ({CAPABILITY_GROUPS.length})
            </button>

            {CAPABILITY_GROUPS.map((group) => {
              const isSelected = selectedGroupId === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroupId(isSelected ? "all" : group.id)}
                  aria-pressed={isSelected}
                  className={`px-3 py-1.5 rounded-[6px] text-xs font-mono border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] border-[var(--accent-fill)] font-semibold"
                      : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  {group.index} · {group.title}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 2. EIGHT-GROUP CAPABILITY INDEX */}
      <section id="capability-index" aria-label="Technical capability index" className="space-y-6">
        <StaggerGroup
          key={selectedGroupId}
          stagger={0.04}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {visibleGroups.map((group) => (
            <StaggerItem
              key={group.id}
              className="card p-6 sm:p-7 flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)] tabular-nums">
                    {group.index}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                    {group.capabilities.length} areas
                  </span>
                </div>

                <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--text)] tracking-tight">
                  {group.title}
                </h2>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                  {group.summary}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-mono text-[var(--text)]">
                  {group.capabilities.map((cap, idx) => (
                    <li key={cap} className="inline-flex items-center gap-3">
                      {idx > 0 && (
                        <span className="text-[var(--text-faint)]" aria-hidden="true">
                          ·
                        </span>
                      )}
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                  {group.depthNote}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* 3. CONTEXTUAL FOOTER LINKS (NO PROJECT CARDS OR REPO GRIDS) */}
      <section
        id="skills-context"
        aria-label="Related sections and external profiles"
        className="pt-8 border-t border-[var(--border)] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
      >
        <EditorialReveal className="lg:col-span-7 space-y-2">
          <h2 className="font-display text-lg font-bold text-[var(--text)]">
            Applied in working systems
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Inspect full project case studies, architecture diagrams, and source repositories in the Projects section, or read how boundaries and workflows fit together in Ecosystem.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => navigateTo("projects")}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] hover:underline cursor-pointer group"
            >
              <span>See Projects</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => navigateTo("ecosystem")}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] cursor-pointer"
            >
              <span>System Architecture Principles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </EditorialReveal>

        <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-x-6 gap-y-2 text-xs font-mono">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)]"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
          <a
            href={SOCIAL_LINKS.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)]"
          >
            <span>LeetCode</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
          <a
            href={SOCIAL_LINKS.codolio}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)]"
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
