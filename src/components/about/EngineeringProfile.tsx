import React, { useState, useRef, useCallback } from "react";
import { ArrowRight, ArrowUpRight, Code2, Cpu, Layers, Compass, Terminal } from "lucide-react";

type TabTarget =
  | "about"
  | "projects"
  | "skills"
  | "ecosystem"
  | "journal"
  | "showcase"
  | "contact";

interface EngineeringProfileProps {
  onNavigateTab: (tab: TabTarget) => void;
  onSelectProject?: (projectId: string) => void;
}

interface CapabilityItem {
  id: string;
  index: string;
  title: string;
  summary: string;
  focus: string;
  stack: string[];
  linkedProjects: Array<{ id: string; label: string; context: string }>;
  actionLabel: string;
  actionTab: TabTarget;
  icon: React.ComponentType<{ className?: string }>;
}

const CAPABILITIES: CapabilityItem[] = [
  {
    id: "fullstack",
    index: "01",
    title: "Full-Stack Engineering",
    summary:
      "End-to-end TypeScript, React, Next.js, and Express systems built with deterministic state transitions and clean API contracts.",
    focus: "Production interfaces, REST & SSE endpoints, auth-guarded admin workflows",
    stack: ["TypeScript", "React 19", "Next.js 15", "Node.js", "Express", "PostgreSQL"],
    linkedProjects: [
      { id: "operon", label: "OPERON", context: "Multi-agent ops workspace" },
      { id: "mausam", label: "MAUSAM", context: "SIH 2026 telemetry UI" },
      { id: "campus-connect", label: "Campus Connect", context: "Event & organizer portal" },
    ],
    actionLabel: "Explore Live Projects",
    actionTab: "projects",
    icon: Layers,
  },
  {
    id: "ml-vision",
    index: "02",
    title: "Machine Learning & Vision",
    summary:
      "Real-time inference pipelines and mechanistic interpretability experiments grounded in measurable runtime constraints.",
    focus: "YOLOv8 pose estimation, ByteTrack tracking, O(1) recurrent state labs",
    stack: ["PyTorch", "YOLOv8", "ByteTrack", "FastAPI", "OpenCV", "Scikit-Learn"],
    linkedProjects: [
      { id: "sightforge", label: "SightForge", context: "Dual-service CV workbench" },
      { id: "memory-in-motion", label: "Memory in Motion", context: "DataForge 2026 lab" },
    ],
    actionLabel: "Inspect ML & Vision Stack",
    actionTab: "skills",
    icon: Cpu,
  },
  {
    id: "systems-algo",
    index: "03",
    title: "Systems & Algorithms",
    summary:
      "Daily C++20 problem solving alongside deterministic control planes, policy evaluation rules, and tamper-evident audit chains.",
    focus: "Algorithmic complexity, policy engines, sandbox simulation",
    stack: ["C++20", "Python", "Data Structures", "Policy Engine", "Audit Chains"],
    linkedProjects: [
      { id: "axiom", label: "AXIOM", context: "WCC Launchpad 30 control plane" },
      { id: "sayam-solves", label: "SayamSolves", context: "LeetHub V2 C++ archive" },
    ],
    actionLabel: "View System Blueprints",
    actionTab: "ecosystem",
    icon: Terminal,
  },
  {
    id: "product",
    index: "04",
    title: "Product Development",
    summary:
      "Shipping cohesive user-facing products under tight hackathon sprints from problem framing to public deployment.",
    focus: "36h hackathon leadership, multi-agency data consolidation, design systems",
    stack: ["Tailwind CSS", "D3.js", "Figma", "Vercel", "Vitest"],
    linkedProjects: [
      { id: "mausam", label: "MAUSAM", context: "Team ALGNITE · SIH 2026" },
      { id: "axiom", label: "AXIOM", context: "Team ALGNITE · 36h build" },
      { id: "inkloom", label: "INKLOOM", context: "Constructed logo workspace" },
    ],
    actionLabel: "Read Background & Routine",
    actionTab: "about",
    icon: Compass,
  },
  {
    id: "selected-work",
    index: "05",
    title: "Selected Work",
    summary:
      "Direct entry into verified case studies, architecture breakdowns, and live public deployments across repositories.",
    focus: "8 flagship builds mapped directly to public GitHub repositories",
    stack: ["OPERON", "MAUSAM", "SightForge", "Memory in Motion", "AXIOM"],
    linkedProjects: [
      { id: "operon", label: "OPERON", context: "Deploy or Die · NEXUS" },
      { id: "mausam", label: "MAUSAM", context: "mausamgovt.vercel.app" },
      { id: "memory-in-motion", label: "Memory in Motion", context: "IIT Kharagpur" },
    ],
    actionLabel: "Open All Case Studies",
    actionTab: "projects",
    icon: Code2,
  },
];

export const EngineeringProfile: React.FC<EngineeringProfileProps> = ({
  onNavigateTab,
  onSelectProject,
}) => {
  const [activeId, setActiveId] = useState<string>(CAPABILITIES[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeItem =
    CAPABILITIES.find((item) => item.id === activeId) || CAPABILITIES[0];
  const ActiveIcon = activeItem.icon;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      let nextIndex = -1;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        nextIndex = (idx + 1) % CAPABILITIES.length;
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        nextIndex = (idx - 1 + CAPABILITIES.length) % CAPABILITIES.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIndex = CAPABILITIES.length - 1;
      }

      if (nextIndex !== -1) {
        setActiveId(CAPABILITIES[nextIndex].id);
        tabRefs.current[nextIndex]?.focus();
      }
    },
    []
  );

  return (
    <div
      className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
      aria-label="Engineering Capability Profile"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Engineering Focus · Index
        </span>
        <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
          {activeItem.index} / 0{CAPABILITIES.length}
        </span>
      </div>

      {/* Interactive Domain Tabs */}
      <div
        role="tablist"
        aria-label="Engineering discipline areas"
        className="divide-y divide-[var(--border)] border-b border-[var(--border)]"
      >
        {CAPABILITIES.map((item, idx) => {
          const isSelected = item.id === activeItem.id;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              id={`capability-tab-${item.id}`}
              aria-selected={isSelected}
              aria-controls={`capability-panel-${item.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)] ${
                isSelected
                  ? "bg-[var(--surface-2)] text-[var(--text)]"
                  : "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-2)]/60 hover:text-[var(--text)]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`font-mono text-xs tabular-nums shrink-0 ${
                    isSelected ? "text-[var(--accent)] font-bold" : "text-[var(--text-muted)]"
                  }`}
                >
                  {item.index}
                </span>
                <span className="font-display text-sm sm:text-[15px] font-bold tracking-tight truncate">
                  {item.title}
                </span>
              </div>

              <ArrowRight
                className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                  isSelected
                    ? "text-[var(--accent)] translate-x-0.5"
                    : "text-[var(--text-faint)]"
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      {/* Active Capability Details Panel */}
      <div
        role="tabpanel"
        id={`capability-panel-${activeItem.id}`}
        aria-labelledby={`capability-tab-${activeItem.id}`}
        className="p-4 sm:p-6 bg-[var(--surface-2)] space-y-5"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-[0.1em]">
            <ActiveIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{activeItem.title}</span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {activeItem.summary}
          </p>
          <p className="text-xs font-mono text-[var(--text-muted)]">
            {activeItem.focus}
          </p>
        </div>

        {/* Core Technologies */}
        <div className="pt-3 border-t border-[var(--border)] flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-mono text-[var(--text-muted)]">
          {activeItem.stack.map((tech) => (
            <span key={tech}>· {tech}</span>
          ))}
        </div>

        {/* Linked Case Studies */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] block">
            Verified Builds
          </span>
          <div className="flex flex-wrap gap-2">
            {activeItem.linkedProjects.map((proj) => (
              <button
                key={proj.id}
                type="button"
                onClick={() => {
                  if (onSelectProject) {
                    onSelectProject(proj.id);
                  } else {
                    onNavigateTab("projects");
                  }
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] text-xs font-mono text-[var(--text)] transition-colors cursor-pointer group"
              >
                <span className="font-semibold">{proj.label}</span>
                <span className="text-[var(--text-muted)] hidden sm:inline">
                  · {proj.context}
                </span>
                <ArrowUpRight className="w-3 h-3 text-[var(--accent)] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Section Action */}
        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onNavigateTab(activeItem.actionTab)}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] hover:underline cursor-pointer min-h-[36px] group"
          >
            <span>{activeItem.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EngineeringProfile;
