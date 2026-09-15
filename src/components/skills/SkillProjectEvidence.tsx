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
    githubUrl: "https://github.com/codesbysayam",
    statusBadge: "RESEARCH PROTOTYPE"
  },
  {
    id: "memory-in-motion",
    projectTitle: "Memory-in-Motion",
    projectSubtitle: "Recurrent Memory Laboratory",
    skills: ["TypeScript", "Recurrent State Dynamics", "Phase Portraits", "Information Theory", "Web Workers"],
    evidence: "Interactive mathematical laboratory exploring how recurrent neural networks compress sequential history into continuous latent state trajectories.",
    githubUrl: "https://github.com/codesbysayam/Memory-in-Motion",
    liveUrl: "https://memory-in-motion.vercel.app",
    statusBadge: "RESEARCH / AI"
  },
  {
    id: "routeledger",
    projectTitle: "RouteLedger",
    projectSubtitle: "Fleet Routing & Hours-of-Service Engine",
    skills: ["TypeScript", "Graph Theory", "FMCSR Regulations", "Spatial Algorithms", "Node.js"],
    evidence: "Turn-by-turn commercial routing platform enforcing federal Hours of Service (HOS) rest mandates and optimizing multi-stop carrier dispatch.",
    githubUrl: "https://github.com/codesbysayam/RouteLedger",
    liveUrl: "https://routeledger.vercel.app",
    statusBadge: "LOGISTICS / SYSTEMS"
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
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-cyan-400">
            04 — PROJECT EVIDENCE
          </span>
          <span className="h-px w-8 bg-zinc-800" />
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            5 Verified Projects
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
            Skill Application &amp; Evidence Matrix
          </h2>
          <span className="text-[11px] font-mono text-zinc-500">
            SKILL → PROJECT → EVIDENCE
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
          How engineering capabilities are translated into verified codebases. Every relationship corresponds to verifiable repository implementations.
        </p>
      </div>

      {/* Filter Chips Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
        <span className="text-zinc-500 flex items-center gap-1 shrink-0 mr-1 text-[10px]">
          <Filter className="w-3 h-3" />
          <span>Filter:</span>
        </span>

        <button
          type="button"
          onClick={() => setSelectedSkillFilter(null)}
          className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
            selectedSkillFilter === null
              ? "bg-zinc-800 text-white border border-zinc-700 font-medium"
              : "bg-zinc-950/40 border border-zinc-850/80 text-zinc-400 hover:text-white"
          }`}
        >
          All (5)
        </button>

        {keySkills.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => setSelectedSkillFilter(selectedSkillFilter === skill ? null : skill)}
            className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
              selectedSkillFilter === skill
                ? "bg-zinc-800 text-white border border-zinc-700 font-medium"
                : "bg-zinc-950/40 border border-zinc-850/80 text-zinc-400 hover:text-white"
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
            className="p-4 sm:p-5 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-zinc-800 transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
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
                    className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Middle Divider / Arrow indicator for large screens */}
            <div className="hidden lg:flex items-center text-zinc-700 shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            {/* Column 2: VERIFIED PROJECT */}
            <div className="lg:w-1/4 space-y-1 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-medium block">
                VERIFIED PROJECT
              </span>
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-semibold text-white font-display">
                  {row.projectTitle}
                </h3>
                <p className="text-xs text-zinc-400 font-sans">
                  {row.projectSubtitle}
                </p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900/80 text-zinc-400 border border-zinc-800 mt-0.5">
                  {row.statusBadge}
                </span>
              </div>
            </div>

            {/* Middle Divider / Arrow indicator for large screens */}
            <div className="hidden lg:flex items-center text-zinc-700 shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            {/* Column 3: ARCHITECTURAL EVIDENCE & ACTION */}
            <div className="lg:w-2/5 flex flex-col justify-between space-y-2.5">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-medium block">
                  ARCHITECTURAL EVIDENCE
                </span>
                <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-sans">
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
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-[11px] font-mono transition-colors"
                    title="View GitHub Repository"
                  >
                    <Github className="w-3 h-3" />
                    <span>Repository</span>
                  </a>
                )}
                {row.liveUrl && (
                  <a
                    href={row.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono transition-colors"
                    title="Open Live Deployment"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Deployment</span>
                  </a>
                )}
                {onSelectProject && (
                  <button
                    type="button"
                    onClick={() => onSelectProject(row.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
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
