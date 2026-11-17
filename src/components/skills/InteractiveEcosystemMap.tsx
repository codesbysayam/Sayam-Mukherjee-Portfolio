import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ExternalLink, ArrowRight, Layers,
  FolderGit2, Code2, Cpu, CheckCircle2, RotateCcw
} from "lucide-react";
import { PROJECTS } from "../../data/projects";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, MOTION_VIEWPORT, usePrefersReducedMotion } from "../../motion/tokens";

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

interface InteractiveEcosystemMapProps {
  selectedTechExternal?: string | null;
  onClearExternalTech?: () => void;
}

export function InteractiveEcosystemMap({
  selectedTechExternal,
  onClearExternalTech,
}: InteractiveEcosystemMapProps = {}) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"tech" | "project">("tech");
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (selectedTechExternal) {
      setSelectedTech(selectedTechExternal);
      setSelectedProject(null);
    }
  }, [selectedTechExternal]);

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
    onClearExternalTech?.();
  };

  const isFiltered = Boolean(selectedTech || selectedProject);

  return (
    <section id="ecosystem-map" className="space-y-6">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            03 · INTERACTIVE ECOSYSTEM MAP
          </span>
          <span className="h-px w-8 bg-[var(--border)]" />
          <span className="text-[11px] font-mono text-[var(--text-faint)] uppercase tracking-wider hidden sm:inline">
            Architecture &amp; Repository Map
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            Technology → Domain → Project → Repository
          </h2>
          <div className="flex items-center gap-2">
            {isFiltered && (
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary !min-h-[40px] sm:!min-h-[34px] !px-2.5 !py-0.5 text-[11px] font-mono"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset View</span>
              </button>
            )}
            <span className="text-[11px] font-mono text-[var(--text-faint)] hidden sm:inline">
              Click any node to trace relationships
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-3xl font-sans leading-relaxed">
          How individual technologies compound into domain skills, real-world projects, and verifiable public source repositories.
        </p>
      </div>

      {/* Desktop 4-Column Flow */}
      <EditorialReveal>
      <div className="hidden lg:block card p-5 sm:p-6 space-y-5">
        <div className="relative space-y-2 pb-3 border-b border-[var(--border)]">
          <div className="grid grid-cols-4 gap-4 text-[11px] font-mono font-medium text-[var(--text-faint)] uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-[var(--text-secondary)] font-semibold">01 · Technology</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-[var(--text-secondary)] font-semibold">02 · Domain Skill</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-[var(--text-secondary)] font-semibold">03 · Verified Project</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-[var(--text-secondary)] font-semibold">04 · Repository</span>
            </div>
          </div>

          {/* Animated SVG Architectural Trace Line */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 8"
            className="w-full h-2 overflow-visible"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="4"
              x2="1000"
              y2="4"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <motion.line
              key={selectedTech || selectedProject || "all"}
              x1="0"
              y1="4"
              x2="1000"
              y2="4"
              stroke={isFiltered ? "#C7E34A" : "var(--accent)"}
              strokeWidth={isFiltered ? "2" : "1.5"}
              initial={reduced ? false : { pathLength: 0, opacity: 0.4 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={MOTION_VIEWPORT}
              transition={{ duration: MOTION_DURATION.enter, ease: MOTION_EASE.out }}
            />
          </svg>
        </div>

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
                  className={`w-full text-left p-3 rounded-[8px] border text-xs font-mono transition-all flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? "bg-[#C7E34A] border-[#A9C52F] text-[#20231D]"
                      : isDimmed
                      ? "bg-[var(--surface)] border-[var(--border)] text-[var(--text-faint)] opacity-40 hover:opacity-100"
                      : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
                  }`}
                >
                  <span className="font-semibold">{tech}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? "text-[#20231D] translate-x-0.5" : "text-[var(--text-faint)] group-hover:text-[var(--text)]"
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
                  className={`p-3 rounded-[8px] border text-xs transition-all space-y-1 ${
                    isActive && isFiltered
                      ? "bg-[var(--surface-2)] border-[var(--accent)] text-[var(--text)]"
                      : isDimmed
                      ? "bg-[var(--surface)] border-[var(--border)] text-[var(--text-faint)] opacity-40"
                      : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)]"
                  }`}
                >
                  <div className="font-bold text-[var(--text)] font-sans">{chain.domain}</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono line-clamp-1">{chain.name}</div>
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
                  className={`w-full text-left p-3 rounded-[8px] border text-xs transition-all space-y-1 group cursor-pointer ${
                    isSelected
                      ? "bg-[#C7E34A] border-[#A9C52F] text-[#20231D]"
                      : isDimmed
                      ? "bg-[var(--surface)] border-[var(--border)] text-[var(--text-faint)] opacity-40 hover:opacity-100"
                      : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-bold font-display ${isSelected ? "text-[#20231D]" : "text-[var(--text)] group-hover:text-[var(--accent)]"} transition-colors`}>
                      {project.title}
                    </span>
                    <span className={`text-[10px] font-mono uppercase ${isSelected ? "text-[#20231D]/80" : "text-[var(--text-faint)]"}`}>
                      {project.statusType}
                    </span>
                  </div>
                  <p className={`text-[11px] line-clamp-1 font-sans ${isSelected ? "text-[#20231D]/80" : "text-[var(--text-muted)]"}`}>
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
                  className={`p-3 rounded-[8px] border text-xs transition-all space-y-2 ${
                    isActive && isFiltered
                      ? "bg-[var(--surface-2)] border-[var(--accent)] text-[var(--text)]"
                      : isDimmed
                      ? "bg-[var(--surface)] border-[var(--border)] text-[var(--text-faint)] opacity-40"
                      : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[var(--text)] truncate">
                      <FolderGit2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                      <span className="truncate">{chain.repoName}</span>
                    </div>
                    <a
                      href={chain.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-[4px] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] transition-colors shrink-0"
                      title="Open Verified GitHub Repository"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-snug line-clamp-2 font-sans">
                    {chain.evidence}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text-faint)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" />
            <span>Strict mapping: Zero unverified connections or synthetic nodes</span>
          </div>
          <span className="tabular-nums">Active Connections: {activeChains.length} / 5</span>
        </div>
      </div>
      </EditorialReveal>

      {/* Mobile Responsive Accordion & Chain Explorer */}
      <div className="block lg:hidden space-y-4">
        <div className="flex rounded-[8px] bg-[var(--surface)] p-1 border border-[var(--border)] text-xs font-mono">
          <button
            type="button"
            onClick={() => setMobileTab("tech")}
            className={`flex-1 min-h-[44px] py-2 rounded-[6px] font-semibold transition-all cursor-pointer ${
              mobileTab === "tech"
                ? "bg-[#C7E34A] text-[#20231D]"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            By Technology
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("project")}
            className={`flex-1 min-h-[44px] py-2 rounded-[6px] font-semibold transition-all cursor-pointer ${
              mobileTab === "project"
                ? "bg-[#C7E34A] text-[#20231D]"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            By Verified Project
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mobileTab === "tech" ? (
            <motion.div
              key="mobile-tech"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: MOTION_DURATION.normal, ease: MOTION_EASE.out }}
              className="space-y-3"
            >
              <div className="flex flex-wrap gap-1.5">
                {SELECTABLE_TECHS.map((tech) => {
                  const isSelected = selectedTech?.toLowerCase() === tech.toLowerCase();
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => handleSelectTech(tech)}
                      className={`min-h-[40px] px-3 py-1.5 rounded-[6px] text-xs font-mono transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#C7E34A] text-[#20231D] border-[#A9C52F] font-semibold"
                          : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]"
                      }`}
                    >
                      {tech}
                    </button>
                  );
                })}
              </div>

              <StaggerGroup
                key={selectedTech || "all"}
                immediate
                className="space-y-3 pt-2"
              >
                {activeChains.map((chain) => (
                  <StaggerItem
                    key={chain.id}
                    className="card p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase">
                        {chain.domain}
                      </span>
                      <a
                        href={chain.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 min-w-0 max-w-full text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)]"
                      >
                        <FolderGit2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{chain.repoName}</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 shrink-0" />
                      </a>
                    </div>

                    <div className="text-sm font-bold text-[var(--text)] font-display">
                      {chain.projectName} · {chain.name}
                    </div>

                    <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                      {chain.evidence}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-[10px] font-mono text-[var(--text-secondary)]">
                      {chain.techs.map((t, idx) => (
                        <span key={t} className="inline-flex items-center gap-2">
                          {idx > 0 && <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>}
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </motion.div>
          ) : (
            <motion.div
              key="mobile-project"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: MOTION_DURATION.normal, ease: MOTION_EASE.out }}
              className="space-y-3"
            >
              {VERIFIED_PROJECTS_LIST.map((proj) => {
                const chain = ECOSYSTEM_CHAINS.find((c) => c.projectId === proj.id);
                return (
                  <div
                    key={proj.id}
                    className="card p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-[var(--text)] font-display">
                        {proj.title}
                      </h3>
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 min-w-0 max-w-full text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)]"
                      >
                        <FolderGit2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{proj.githubRepoName || proj.name}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                      {proj.shortDescription}
                    </p>

                    {chain && (
                      <div className="text-xs font-mono text-[var(--accent)]">
                        Domain: {chain.domain}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-[10px] font-mono text-[var(--text-secondary)]">
                      {(proj.technologies || proj.techStack).map((t, idx) => (
                        <span key={t} className="inline-flex items-center gap-2">
                          {idx > 0 && <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>}
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default InteractiveEcosystemMap;
