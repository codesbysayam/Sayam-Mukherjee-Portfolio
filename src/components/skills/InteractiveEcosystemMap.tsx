import React, { useState, useMemo } from "react";
import { 
  ExternalLink, ArrowRight, Layers, Sparkles, 
  FolderGit2, Code2, Globe, Cpu, CheckCircle2, RotateCcw
} from "lucide-react";
import { PROJECTS, ProjectItem } from "../../data/projects";

// The 5 verified projects
const VERIFIED_PROJECTS_LIST = PROJECTS;

interface EcoNode {
  id: string;
  name: string;
  techs: string[];
  domain: string;
  projectId: string;
  projectName: string;
  repoName: string;
  repoUrl: string;
  evidence: string;
}

const ECOSYSTEM_CHAINS: EcoNode[] = [
  {
    id: "operon-chain",
    name: "Autonomous Multi-Agent Systems",
    techs: ["TypeScript", "Node.js", "Express", "React", "Git"],
    domain: "Autonomous Systems & Governance",
    projectId: "operon",
    projectName: "OPERON",
    repoName: "codesbysayam/Operon",
    repoUrl: "https://github.com/codesbysayam/Operon",
    evidence: "Multi-agent task dispatching with human-in-the-loop state machine governance."
  },
  {
    id: "sayamsolves-chain",
    name: "Algorithmic Problem Solving",
    techs: ["C++", "DSA", "Algorithms", "Git"],
    domain: "Data Structures & Computational Complexity",
    projectId: "sayamsolves",
    projectName: "SayamSolves",
    repoName: "codesbysayam/sayam-solves",
    repoUrl: "https://github.com/codesbysayam/sayam-solves",
    evidence: "Daily LeetCode algorithmic solutions in C++ with asymptotic runtime analysis."
  },
  {
    id: "mausam-chain",
    name: "Meteorological Intelligence Platform",
    techs: ["TypeScript", "React", "Tailwind CSS", "API Integration", "Python", "Git"],
    domain: "Data-Driven Applications & APIs",
    projectId: "mausam",
    projectName: "MAUSAM",
    repoName: "codesbysayam/mausam",
    repoUrl: "https://github.com/codesbysayam/mausam",
    evidence: "Smart India Hackathon (SIH 2026) verified climate telemetry aggregator."
  },
  {
    id: "portfolio-chain",
    name: "Interactive Engineering Architecture",
    techs: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "Git"],
    domain: "Full-Stack Web Engineering",
    projectId: "portfolio",
    projectName: "Portfolio",
    repoName: "codesbysayam/Sayam-Mukherjee-Portfolio",
    repoUrl: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
    evidence: "Live server-proxied GitHub telemetry, clamp() typography, and fluid design system."
  },
  {
    id: "yolo-chain",
    name: "Edge Computer Vision & Tracking",
    techs: ["Python", "YOLO / YOLOv8", "OpenCV", "PyTorch", "Git"],
    domain: "Computer Vision & Edge Inference",
    projectId: "yolo",
    projectName: "YOLO / Edge Vision",
    repoName: "codesbysayam",
    repoUrl: "https://github.com/codesbysayam",
    evidence: "Real-time edge frame processing with OpenCV and YOLOv8 spatial bounding coordinates."
  }
];

const SELECTABLE_TECHS = [
  "TypeScript",
  "Python",
  "C++",
  "React",
  "Node.js",
  "OpenCV",
  "Git",
  "Tailwind CSS",
  "DSA",
  "API Integration"
];

export function InteractiveEcosystemMap() {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"tech" | "project">("tech");

  // Determine active chains based on selection
  const activeChains = useMemo(() => {
    if (selectedTech) {
      return ECOSYSTEM_CHAINS.filter((c) =>
        c.techs.some((t) => t.toLowerCase() === selectedTech.toLowerCase())
      );
    }
    if (selectedProject) {
      return ECOSYSTEM_CHAINS.filter((c) => c.projectId === selectedProject);
    }
    return ECOSYSTEM_CHAINS;
  }, [selectedTech, selectedProject]);

  const handleSelectTech = (tech: string) => {
    if (selectedTech === tech) {
      setSelectedTech(null);
    } else {
      setSelectedTech(tech);
      setSelectedProject(null);
    }
  };

  const handleSelectProject = (projectId: string) => {
    if (selectedProject === projectId) {
      setSelectedProject(null);
    } else {
      setSelectedProject(projectId);
      setSelectedTech(null);
    }
  };

  const handleReset = () => {
    setSelectedTech(null);
    setSelectedProject(null);
  };

  const isFiltered = Boolean(selectedTech || selectedProject);

  return (
    <section id="ecosystem-map" className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-cyan-400">
            03 — INTERACTIVE ECOSYSTEM MAP
          </span>
          <span className="h-px w-8 bg-zinc-800" />
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
            Architecture &amp; Repository Map
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
            Technology → Domain → Project → Repository
          </h2>
          <div className="flex items-center gap-2">
            {isFiltered && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900 text-[11px] font-mono text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset View</span>
              </button>
            )}
            <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
              Click any node to trace relationships
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl font-sans leading-relaxed">
          How individual technologies compound into domain skills, real-world projects, and verifiable public source repositories.
        </p>
      </div>

      {/* Desktop 4-Column Flow (Hidden on Mobile) */}
      <div className="hidden lg:block rounded-xl bg-zinc-950/40 border border-zinc-850 p-5 space-y-5">
        {/* Column Labels */}
        <div className="grid grid-cols-4 gap-4 pb-2.5 border-b border-zinc-850 text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Code2 className="w-3 h-3 text-cyan-400" />
            <span>01 · Technology</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-sky-400" />
            <span>02 · Domain Skill</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>03 · Verified Project</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderGit2 className="w-3 h-3 text-purple-400" />
            <span>04 · Repository</span>
          </div>
        </div>

        {/* 4-Tier Interactive Matrix */}
        <div className="grid grid-cols-4 gap-4 items-start">
          {/* Col 1: Technologies */}
          <div className="space-y-2">
            {SELECTABLE_TECHS.map((tech) => {
              const isSelected = selectedTech?.toLowerCase() === tech.toLowerCase();
              const isLinked = activeChains.some((c) =>
                c.techs.some((t) => t.toLowerCase() === tech.toLowerCase())
              );
              const isDimmed = isFiltered && !isSelected && !isLinked;

              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleSelectTech(tech)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-500/60 text-cyan-300 shadow-sm"
                      : isDimmed
                      ? "bg-zinc-950/20 border-zinc-900 text-zinc-600 opacity-40 hover:opacity-100"
                      : "bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  <span className="font-semibold">{tech}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? "text-cyan-400 translate-x-0.5" : "text-zinc-600 group-hover:text-zinc-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Col 2: Domain Focus */}
          <div className="space-y-2">
            {ECOSYSTEM_CHAINS.map((chain) => {
              const isActive = activeChains.some((c) => c.id === chain.id);
              const isDimmed = isFiltered && !isActive;

              return (
                <div
                  key={chain.id}
                  className={`p-3 rounded-xl border text-xs transition-all space-y-1 ${
                    isActive
                      ? "bg-sky-500/10 border-sky-500/40 text-sky-200"
                      : isDimmed
                      ? "bg-zinc-950/20 border-zinc-900 text-zinc-600 opacity-40"
                      : "bg-zinc-900/40 border-zinc-850 text-zinc-400"
                  }`}
                >
                  <div className="font-bold text-zinc-200 font-sans">{chain.domain}</div>
                  <div className="text-[11px] text-zinc-500 font-mono line-clamp-1">{chain.name}</div>
                </div>
              );
            })}
          </div>

          {/* Col 3: Verified Projects */}
          <div className="space-y-2">
            {VERIFIED_PROJECTS_LIST.map((project) => {
              const isSelected = selectedProject === project.id;
              const isLinked = activeChains.some((c) => c.projectId === project.id);
              const isDimmed = isFiltered && !isSelected && !isLinked;

              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => handleSelectProject(project.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all space-y-1 group ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-500/60 text-emerald-300 shadow-sm"
                      : isDimmed
                      ? "bg-zinc-950/20 border-zinc-900 text-zinc-600 opacity-40 hover:opacity-100"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-display group-hover:text-emerald-300 transition-colors">
                      {project.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {project.statusType}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 font-sans">
                    {project.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Col 4: Verified Repositories */}
          <div className="space-y-2">
            {ECOSYSTEM_CHAINS.map((chain) => {
              const isActive = activeChains.some((c) => c.id === chain.id);
              const isDimmed = isFiltered && !isActive;

              return (
                <div
                  key={chain.id}
                  className={`p-3 rounded-xl border text-xs transition-all space-y-2 ${
                    isActive
                      ? "bg-purple-500/10 border-purple-500/40 text-purple-200"
                      : isDimmed
                      ? "bg-zinc-950/20 border-zinc-900 text-zinc-600 opacity-40"
                      : "bg-zinc-900/40 border-zinc-850 text-zinc-400"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-zinc-300 truncate">
                      <FolderGit2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{chain.repoName}</span>
                    </div>
                    <a
                      href={chain.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors shrink-0"
                      title="Open Verified GitHub Repository"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2 font-sans">
                    {chain.evidence}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evidence Status Footer */}
        <div className="pt-4 border-t border-zinc-850 flex items-center justify-between text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict mapping: Zero unverified connections or synthetic nodes</span>
          </div>
          <span>Active Connections: {activeChains.length} / 5</span>
        </div>
      </div>

      {/* Mobile Responsive Accordion & Chain Explorer (Visible on &lt; lg) */}
      <div className="block lg:hidden space-y-4">
        {/* Toggle between viewing by Technology or by Project */}
        <div className="flex rounded-xl bg-zinc-900/90 p-1 border border-zinc-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setMobileTab("tech")}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              mobileTab === "tech"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            By Technology
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("project")}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              mobileTab === "project"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            By Verified Project
          </button>
        </div>

        {mobileTab === "tech" ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {SELECTABLE_TECHS.map((tech) => {
                const isSelected = selectedTech?.toLowerCase() === tech.toLowerCase();
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => handleSelectTech(tech)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 font-semibold"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 pt-2">
              {activeChains.map((chain) => (
                <div
                  key={chain.id}
                  className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-850 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                      {chain.domain}
                    </span>
                    <a
                      href={chain.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-purple-400 hover:text-purple-300"
                    >
                      <FolderGit2 className="w-3 h-3" />
                      <span>{chain.repoName}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>

                  <div className="text-sm font-bold text-white font-display">
                    {chain.projectName} · {chain.name}
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {chain.evidence}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {chain.techs.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {VERIFIED_PROJECTS_LIST.map((proj) => {
              const chain = ECOSYSTEM_CHAINS.find((c) => c.projectId === proj.id);
              return (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-850 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white font-display">
                      {proj.title}
                    </h3>
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-purple-400 hover:text-purple-300"
                    >
                      <FolderGit2 className="w-3 h-3" />
                      <span>{proj.githubRepoName || proj.name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {proj.shortDescription}
                  </p>

                  {chain && (
                    <div className="text-xs font-mono text-sky-400">
                      Domain: {chain.domain}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(proj.technologies || proj.techStack).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-[10px] font-mono text-zinc-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default InteractiveEcosystemMap;
