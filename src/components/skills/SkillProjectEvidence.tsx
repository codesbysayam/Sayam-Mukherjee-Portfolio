import React, { useState } from "react";
import { 
  FolderGit2, ExternalLink, Github, CheckCircle2, 
  Layers, ArrowUpRight, Filter, Sparkles 
} from "lucide-react";
import { PROJECTS, ProjectItem } from "../../data/projects";

interface SkillProjectEvidenceProps {
  onSelectProject?: (projectId: string) => void;
}

export function SkillProjectEvidence({ onSelectProject }: SkillProjectEvidenceProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Collect all unique tech tags from the 5 projects
  const allTechs = Array.from(
    new Set(PROJECTS.flatMap((p) => p.techStack || p.tech || []))
  ).slice(0, 14);

  const filteredProjects = selectedTech
    ? PROJECTS.filter((p) =>
        (p.techStack || p.tech || []).some(
          (t) => t.toLowerCase() === selectedTech.toLowerCase()
        )
      )
    : PROJECTS;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-850 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
              PROJECT EVIDENCE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-mono text-zinc-500">
              5 VERIFIED CODEBASES
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            SKILL → PROJECT EVIDENCE MATRIX
          </h2>
        </div>
        <p className="text-xs text-zinc-400 font-mono">
          Strictly verified · No fictitious projects
        </p>
      </div>

      {/* Technology Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        <span className="text-zinc-500 flex items-center gap-1 shrink-0 mr-1 text-[11px]">
          <Filter className="w-3 h-3" />
          <span>Filter by tech:</span>
        </span>

        <button
          onClick={() => setSelectedTech(null)}
          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
            selectedTech === null
              ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-medium"
              : "bg-zinc-950/60 border border-zinc-850 text-zinc-400 hover:text-white"
          }`}
        >
          All (5)
        </button>

        {allTechs.map((tech) => (
          <button
            key={tech}
            onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedTech === tech
                ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-medium"
                : "bg-zinc-950/60 border border-zinc-850 text-zinc-400 hover:text-white"
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-850 hover:border-zinc-750 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Project Title & Category */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {project.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      {project.statusType.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {project.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                      title="View GitHub Repository"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {(project.liveUrl || project.demoUrl) && (
                    <a
                      href={project.liveUrl || project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                      title="Open Live Deployment"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-300 leading-relaxed">
                {project.shortDescription}
              </p>

              {/* Architectural Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-850 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                    Architectural Highlights
                  </span>
                  <ul className="space-y-1">
                    {project.highlights.slice(0, 2).map((h, i) => (
                      <li
                        key={i}
                        className="text-xs text-zinc-300 flex items-start gap-1.5 leading-snug"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Verified Tech Stack Chips */}
            <div className="pt-3 border-t border-zinc-850/80 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Verified Technologies Implemented:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(project.techStack || project.tech || []).map((t) => (
                  <span
                    key={t}
                    onClick={() => setSelectedTech(t)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono cursor-pointer transition-colors ${
                      selectedTech === t
                        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                        : "bg-zinc-900/80 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillProjectEvidence;
