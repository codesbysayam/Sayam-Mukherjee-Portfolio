import React, { useState } from "react";
import { ExternalLink, Github, ArrowUpRight, Filter, ArrowRight } from "lucide-react";

interface EvidenceRow {
  id: string;
  projectTitle: string;
  projectSubtitle: string;
  skills: string[];
  evidence: string;
  githubUrl?: string;
  liveUrl?: string;
  statusBadge: string;
}

const PROJECT_EVIDENCE_DATA: EvidenceRow[] = [
  {
    id: "operon",
    projectTitle: "OPERON",
    projectSubtitle: "Autonomous Operations Engine",
    skills: ["TypeScript", "Node.js", "Express.js", "React", "Multi-Agent AI", "State Orchestration"],
    evidence: "Architected role-specific autonomous agents, auditable state machine checkpoints, human-in-the-loop decision boundaries, and REST API service routing.",
    githubUrl: "https://github.com/codesbysayam/Operon",
    liveUrl: "https://operonpro.vercel.app",
    statusBadge: "Active Production"
  },
  {
    id: "mausam",
    projectTitle: "MAUSAM",
    projectSubtitle: "Weather Intelligence Platform (SIH 2026)",
    skills: ["TypeScript", "React", "Tailwind CSS", "REST API Integration", "Data Normalization"],
    evidence: "Aggregated multi-provider meteorological telemetry (AQI, UV, tides, soil moisture) with resilient local caching and sub-100ms client state rendering.",
    githubUrl: "https://github.com/codesbysayam/mausam",
    liveUrl: "https://mausamgovt.vercel.app",
    statusBadge: "SIH 2026 Competition"
  },
  {
    id: "sayamsolves",
    projectTitle: "SayamSolves",
    projectSubtitle: "DSA Practice Repository",
    skills: ["C++", "Data Structures & Algorithms", "Space-Time Optimization", "LeetCode"],
    evidence: "Verifiable implementation of dynamic programming recurrence relations, graph traversals (BFS/DFS), and memory-bounded algorithmic routines.",
    githubUrl: "https://github.com/codesbysayam/sayam-solves",
    liveUrl: "https://github.com/codesbysayam/sayam-solves",
    statusBadge: "Continuous Practice"
  },
  {
    id: "portfolio",
    projectTitle: "Interactive Portfolio",
    projectSubtitle: "Full-Stack Portfolio Ecosystem",
    skills: ["React 19", "TypeScript", "Tailwind CSS", "Express Backend", "GitHub API"],
    evidence: "Engineered responsive client architecture, server-side caching proxies, zero-CLS layout rendering, and live GitHub commit telemetry pipeline.",
    githubUrl: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
    liveUrl: "https://sayammukherjee.in",
    statusBadge: "Live Ecosystem"
  },
  {
    id: "yolo",
    projectTitle: "YOLO Edge Vision",
    projectSubtitle: "Edge Computer Vision & Tracking",
    skills: ["Python", "Computer Vision", "PyTorch", "YOLO / YOLOv8", "Edge Inference"],
    evidence: "Trained and benchmarked real-time bounding box object detection, polygon ROI boundary monitoring, and frame latency optimization for embedded feeds.",
    githubUrl: "https://github.com/codesbysayam/yolo",
    statusBadge: "Research Prototype"
  }
];

interface SkillProjectEvidenceProps {
  onSelectProject?: (projectId: string) => void;
}

export function SkillProjectEvidence({ onSelectProject }: SkillProjectEvidenceProps) {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string | null>(null);

  const keySkills = [
    "TypeScript", "React", "Node.js", "C++", "Python",
    "Computer Vision", "Tailwind CSS", "Express.js"
  ];

  const filteredRows = selectedSkillFilter
    ? PROJECT_EVIDENCE_DATA.filter((r) =>
        (r.skills || []).some(
          (s) => s.toLowerCase() === selectedSkillFilter.toLowerCase()
        )
      )
    : PROJECT_EVIDENCE_DATA;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-muted)]">
          <span className="font-semibold uppercase tracking-wider text-[var(--accent)]">
            Project Evidence
          </span>
          <span aria-hidden="true">/</span>
          <span>5 Verified Projects</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            Skill Application &amp; Evidence Matrix
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Skill → Project → Evidence
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans leading-relaxed">
          How engineering capabilities translate directly into verified production repositories and documented system designs.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        <span className="text-[var(--text-muted)] flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Filter:</span>
        </span>

        <button
          type="button"
          onClick={() => setSelectedSkillFilter(null)}
          className={`btn !min-h-[36px] !py-1 !px-3 !text-xs ${
            selectedSkillFilter === null ? "btn-primary" : "btn-secondary"
          }`}
        >
          All (5)
        </button>

        {keySkills.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => setSelectedSkillFilter(selectedSkillFilter === skill ? null : skill)}
            className={`btn !min-h-[36px] !py-1 !px-3 !text-xs whitespace-nowrap ${
              selectedSkillFilter === skill ? "btn-primary" : "btn-secondary"
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Relationship Matrix */}
      <div className="space-y-3.5">
        {filteredRows.map((row) => (
          <div
            key={row.id}
            className="card p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
          >
            {/* Column 1: SKILL STACK */}
            <div className="lg:w-1/4 space-y-1.5 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                Skills Applied
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(row.skills || []).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-[4px] text-xs font-mono bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex items-center text-[var(--text-muted)] shrink-0">
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </div>

            {/* Column 2: VERIFIED PROJECT */}
            <div className="lg:w-1/4 space-y-1 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                Verified Project
              </span>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-[var(--text)] font-display">
                  {row.projectTitle}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-sans">
                  {row.projectSubtitle}
                </p>
                <span className="inline-block text-[11px] font-mono text-[var(--accent)] font-semibold pt-0.5">
                  {row.statusBadge}
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center text-[var(--text-muted)] shrink-0">
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </div>

            {/* Column 3: ARCHITECTURAL EVIDENCE */}
            <div className="lg:w-2/5 flex flex-col justify-between space-y-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                  Architectural Evidence
                </span>
                <p className="text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed font-sans">
                  {row.evidence}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                {row.githubUrl && (
                  <a
                    href={row.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary !min-h-[36px] !py-1.5 !px-3 !text-xs"
                    title="View GitHub Repository"
                  >
                    <Github className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Repository</span>
                  </a>
                )}
                {row.liveUrl && (
                  <a
                    href={row.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary !min-h-[36px] !py-1.5 !px-3 !text-xs"
                    title="Open Live Deployment"
                  >
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Live</span>
                  </a>
                )}
                {onSelectProject && (
                  <button
                    type="button"
                    onClick={() => onSelectProject(row.id)}
                    className="btn btn-primary !min-h-[36px] !py-1.5 !px-3 !text-xs"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillProjectEvidence;
