import React, { useState } from "react";
import { 
  ExternalLink, Github, ArrowUpRight, Filter, ArrowRight
} from "lucide-react";
import { PROJECTS, ProjectItem } from "../../data/projects";

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
    statusBadge: "ACTIVE PRODUCTION"
  },
  {
    id: "mausam",
    projectTitle: "MAUSAM",
    projectSubtitle: "Weather Intelligence Platform (SIH 2026)",
    skills: ["TypeScript", "React", "Tailwind CSS", "REST API Integration", "Data Normalization"],
    evidence: "Aggregated multi-provider meteorological telemetry (AQI, UV, tides, soil moisture) with resilient local caching and sub-100ms client state rendering.",
    githubUrl: "https://github.com/codesbysayam/mausam",
    liveUrl: "https://mausamgovt.vercel.app",
    statusBadge: "SIH 2026 COMPETITION"
  },
  {
    id: "sayamsolves",
    projectTitle: "SayamSolves",
    projectSubtitle: "DSA Practice Repository",
    skills: ["C++", "Data Structures & Algorithms", "Space-Time Optimization", "LeetCode"],
    evidence: "Verifiable implementation of dynamic programming recurrence relations, graph traversals (BFS/DFS), and memory-bounded algorithmic routines.",
    githubUrl: "https://github.com/codesbysayam/sayam-solves",
    liveUrl: "https://github.com/codesbysayam/sayam-solves",
    statusBadge: "CONTINUOUS PRACTICE"
  },
  {
    id: "portfolio",
    projectTitle: "Interactive Portfolio",
    projectSubtitle: "Full-Stack Portfolio Ecosystem",
    skills: ["React 18", "TypeScript", "Tailwind CSS", "Express Backend", "GitHub API"],
    evidence: "Engineered responsive client architecture, server-side caching proxies, zero-CLS layout rendering, and live GitHub commit telemetry pipeline.",
    githubUrl: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
    liveUrl: "https://sayammukherjee.in",
    statusBadge: "LIVE ECOSYSTEM"
  },
  {
    id: "yolo",
    projectTitle: "YOLO Edge Vision",
    projectSubtitle: "Edge Computer Vision & Tracking",
    skills: ["Python", "Computer Vision", "PyTorch", "YOLO / YOLOv8", "Edge Inference"],
    evidence: "Trained and benchmarked real-time bounding box object detection, polygon ROI boundary monitoring, and frame latency optimization for embedded feeds.",
    githubUrl: "https://github.com/codesbysayam/yolo",
    statusBadge: "RESEARCH PROTOTYPE"
  }
];

interface SkillProjectEvidenceProps {
  onSelectProject?: (projectId: string) => void;
}

export function SkillProjectEvidence({ onSelectProject }: SkillProjectEvidenceProps) {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string | null>(null);

  // Collect key skills across rows
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
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">
            PROJECT EVIDENCE
          </span>
          <span className="h-px w-8 bg-zinc-300 dark:border-white/[0.08]" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            5 Verified Projects
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
            Skill Application &amp; Evidence Matrix
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            SKILL → PROJECT → EVIDENCE
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans leading-relaxed">
          How engineering capabilities are translated into verified codebases. Every relationship corresponds to verifiable repository implementations.
        </p>
      </div>

      {/* Filter Chips Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        <span className="text-zinc-500 flex items-center gap-1 shrink-0 mr-1 text-xs">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </span>

        <button
          type="button"
          onClick={() => setSelectedSkillFilter(null)}
          className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
            selectedSkillFilter === null
              ? "btn-primary !py-1 !px-3 !text-xs"
              : "btn-secondary !py-1 !px-3 !text-xs"
          }`}
        >
          All (5)
        </button>

        {keySkills.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => setSelectedSkillFilter(selectedSkillFilter === skill ? null : skill)}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
              selectedSkillFilter === skill
                ? "btn-primary !py-1 !px-3 !text-xs"
                : "btn-secondary !py-1 !px-3 !text-xs"
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Relationship Matrix: SKILL → PROJECT → EVIDENCE */}
      <div className="space-y-3">
        {filteredRows.map((row) => (
          <div
            key={row.id}
            className="card p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
          >
            {/* Column 1: SKILL STACK */}
            <div className="lg:w-1/4 space-y-1.5 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-medium block">
                SKILLS APPLIED
              </span>
              <div className="flex flex-wrap gap-1">
                {(row.skills || []).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-md text-xs font-mono bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border border-zinc-250/70 dark:border-white/[0.06]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Middle Divider / Arrow indicator for large screens */}
            <div className="hidden lg:flex items-center text-zinc-400 dark:text-zinc-600 shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Column 2: VERIFIED PROJECT */}
            <div className="lg:w-1/4 space-y-1 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-medium block">
                VERIFIED PROJECT
              </span>
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white font-display">
                  {row.projectTitle}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                  {row.projectSubtitle}
                </p>
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 mt-1">
                  {row.statusBadge}
                </span>
              </div>
            </div>

            {/* Middle Divider / Arrow indicator for large screens */}
            <div className="hidden lg:flex items-center text-zinc-400 dark:text-zinc-600 shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Column 3: ARCHITECTURAL EVIDENCE & ACTION */}
            <div className="lg:w-2/5 flex flex-col justify-between space-y-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-medium block">
                  ARCHITECTURAL EVIDENCE
                </span>
                <p className="text-xs sm:text-[13px] text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                  {row.evidence}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-0.5">
                {row.githubUrl && (
                  <a
                    href={row.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary !py-1.5 !px-3 !text-xs"
                    title="View GitHub Repository"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Repository</span>
                  </a>
                )}
                {row.liveUrl && (
                  <a
                    href={row.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary !py-1.5 !px-3 !text-xs"
                    title="Open Live Deployment"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live</span>
                  </a>
                )}
                {onSelectProject && (
                  <button
                    type="button"
                    onClick={() => onSelectProject(row.id)}
                    className="btn btn-ghost !py-1.5 !px-3 !text-xs text-purple-700 dark:text-purple-400"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
