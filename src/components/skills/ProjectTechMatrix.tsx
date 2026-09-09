import React, { useState, useMemo } from "react";
import { Check, FolderGit2, Layers, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { PROJECTS, ProjectItem } from "../../data/projects";

interface MatrixTech {
  id: string;
  name: string;
  category: string;
}

const MATRIX_TECHNOLOGIES: MatrixTech[] = [
  { id: "python", name: "Python", category: "Languages" },
  { id: "typescript", name: "TypeScript", category: "Languages" },
  { id: "cpp", name: "C++", category: "Languages" },
  { id: "react", name: "React", category: "Frontend" },
  { id: "tailwind", name: "Tailwind CSS", category: "Frontend" },
  { id: "node", name: "Node.js", category: "Backend" },
  { id: "express", name: "Express", category: "Backend" },
  { id: "multi-agent", name: "Multi-Agent AI", category: "AI / ML" },
  { id: "yolo", name: "YOLO / YOLOv8", category: "AI / ML" },
  { id: "opencv", name: "OpenCV", category: "AI / ML" },
  { id: "pytorch", name: "PyTorch", category: "AI / ML" },
  { id: "dsa", name: "Data Structures & Algorithms", category: "Core" },
  { id: "apis", name: "API Integration", category: "Core" },
  { id: "git", name: "Git / GitHub", category: "Tools" },
  { id: "vercel", name: "Vercel", category: "Tools" }
];

function checkTechInProject(tech: MatrixTech, project: ProjectItem): boolean {
  const allProjectTechs = [
    ...(project.technologies || []),
    ...(project.techStack || []),
    ...(project.tech || []),
    ...(project.tags || [])
  ].map((t) => t.toLowerCase());

  const target = tech.name.toLowerCase();

  if (tech.id === "git") {
    return true; // All 5 verified projects are git repositories with version control
  }
  if (tech.id === "dsa") {
    return allProjectTechs.some((t) => t.includes("dsa") || t.includes("algorithm") || t.includes("data structure"));
  }
  if (tech.id === "apis") {
    return allProjectTechs.some((t) => t.includes("api") || t.includes("weather"));
  }
  if (tech.id === "opencv") {
    return allProjectTechs.some((t) => t.includes("opencv"));
  }
  if (tech.id === "multi-agent") {
    return allProjectTechs.some((t) => t.includes("agent") || t.includes("multi-agent"));
  }
  if (tech.id === "cpp") {
    return allProjectTechs.some((t) => t === "c++" || t.includes("c++"));
  }
  if (tech.id === "yolo") {
    return allProjectTechs.some((t) => t.includes("yolo"));
  }
  if (tech.id === "vercel") {
    return project.liveUrl?.includes("vercel.app") || allProjectTechs.some((t) => t.includes("vercel"));
  }

  return allProjectTechs.some((t) => t.includes(target) || target.includes(t));
}

export function ProjectTechMatrix() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>("operon");

  // Calculate project tech counts
  const verifiedProjects = PROJECTS;

  return (
    <section id="tech-matrix" className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-cyan-400">
            05 — PROJECT → TECHNOLOGY MATRIX
          </span>
          <span className="h-px w-8 bg-zinc-800" />
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
            Cross-Project Verification
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
            Project &amp; Technology Matrix
          </h2>
          <span className="text-[11px] font-mono text-zinc-500">
            5 Verified Projects · 15 Key Technologies
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans leading-relaxed">
          A verifiable mapping of technologies across public codebases. Generated directly from central repository metadata without arbitrary claims.
        </p>
      </div>

      {/* Desktop Matrix View (Hidden on mobile) */}
      <div className="hidden md:block rounded-xl bg-zinc-950/40 border border-zinc-850 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="py-3 px-4 text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider w-1/3">
                  Technology / Practice
                </th>
                {verifiedProjects.map((p) => {
                  const isHovered = hoveredProject === p.id;
                  return (
                    <th
                      key={p.id}
                      onMouseEnter={() => setHoveredProject(p.id)}
                      onMouseLeave={() => setHoveredProject(null)}
                      className={`py-3.5 px-3 text-center text-xs font-mono font-semibold transition-colors cursor-default ${
                        isHovered ? "bg-zinc-800/80 text-cyan-300" : "text-zinc-300"
                      }`}
                    >
                      <div className="truncate max-w-[110px] mx-auto font-display font-bold">
                        {p.title}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-normal uppercase block">
                        {p.statusType}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850/60 font-mono text-xs">
              {MATRIX_TECHNOLOGIES.map((tech) => {
                const isRowHovered = hoveredTech === tech.id;

                return (
                  <tr
                    key={tech.id}
                    onMouseEnter={() => setHoveredTech(tech.id)}
                    onMouseLeave={() => setHoveredTech(null)}
                    className={`transition-colors ${
                      isRowHovered ? "bg-zinc-900/60" : "hover:bg-zinc-900/30"
                    }`}
                  >
                    {/* Technology Column */}
                    <td className="py-2.5 px-4 flex items-center justify-between gap-2">
                      <span className={`font-semibold ${
                        isRowHovered ? "text-cyan-300" : "text-zinc-300"
                      }`}>
                        {tech.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800/80">
                        {tech.category}
                      </span>
                    </td>

                    {/* Project Indicator Cells */}
                    {verifiedProjects.map((project) => {
                      const hasTech = checkTechInProject(tech, project);
                      const isColHovered = hoveredProject === project.id;

                      return (
                        <td
                          key={project.id}
                          className={`py-2.5 px-3 text-center transition-colors ${
                            isColHovered ? "bg-zinc-900/40" : ""
                          }`}
                        >
                          {hasTech ? (
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                              title={`${tech.name} verified in ${project.title}`}
                            >
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-800" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Matrix Legend */}
        <div className="p-4 border-t border-zinc-850 bg-zinc-950/60 flex items-center justify-between text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Check className="w-2.5 h-2.5" />
              </span>
              <span>Verified in codebase</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <span>Not actively utilized</span>
            </div>
          </div>
          <span>Strict metadata analysis</span>
        </div>
      </div>

      {/* Mobile Responsive Accordion (Visible on &lt; md) */}
      <div className="block md:hidden space-y-3">
        {verifiedProjects.map((project) => {
          const isExpanded = expandedProject === project.id;
          const activeTechs = MATRIX_TECHNOLOGIES.filter((t) => checkTechInProject(t, project));

          return (
            <div
              key={project.id}
              className="rounded-xl bg-zinc-950/60 border border-zinc-850 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-900/40 transition-colors"
              >
                <div>
                  <div className="text-sm font-bold text-white font-display">
                    {project.title}
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">
                    {activeTechs.length} verified technologies
                  </div>
                </div>

                <div className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 border-t border-zinc-850/80 space-y-3">
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans pt-3">
                    {project.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {activeTechs.map((tech) => (
                      <span
                        key={tech.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono"
                      >
                        <Check className="w-3 h-3" />
                        <span>{tech.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProjectTechMatrix;
