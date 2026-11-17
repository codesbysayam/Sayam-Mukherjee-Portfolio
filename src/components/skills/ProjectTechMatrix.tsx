import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { PROJECTS, ProjectItem } from "../../data/projects";

interface MatrixTech {
  id: string;
  name: string;
  category: string;
}

const MATRIX_TECHNOLOGIES: MatrixTech[] = [
  { id: "typescript", name: "TypeScript", category: "Languages" },
  { id: "python", name: "Python", category: "Languages" },
  { id: "cpp", name: "C++", category: "Languages" },
  { id: "react", name: "React", category: "Frontend" },
  { id: "nextjs", name: "Next.js", category: "Frontend" },
  { id: "tailwind", name: "Tailwind CSS", category: "Frontend" },
  { id: "katex-d3", name: "KaTeX / D3.js", category: "Frontend" },
  { id: "node", name: "Node.js", category: "Backend" },
  { id: "express", name: "Express", category: "Backend" },
  { id: "fastapi", name: "FastAPI", category: "Backend" },
  { id: "postgres", name: "PostgreSQL / PLpgSQL", category: "Data" },
  { id: "multi-agent", name: "Multi-Agent AI", category: "AI / ML" },
  { id: "yolo", name: "YOLOv8 / ByteTrack", category: "AI / ML" },
  { id: "vitest", name: "Vitest", category: "Testing" },
  { id: "docker", name: "Docker", category: "DevOps" },
  { id: "dsa", name: "Data Structures & Algorithms", category: "Core" },
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
    return true;
  }
  if (tech.id === "dsa") {
    return allProjectTechs.some((t) => t.includes("dsa") || t.includes("algorithm") || t.includes("data structure"));
  }
  if (tech.id === "cpp") {
    return allProjectTechs.some((t) => t === "c++" || t.includes("c++"));
  }
  if (tech.id === "react") {
    return allProjectTechs.some((t) => t.includes("react"));
  }
  if (tech.id === "nextjs") {
    return allProjectTechs.some((t) => t.includes("next.js"));
  }
  if (tech.id === "katex-d3") {
    return allProjectTechs.some((t) => t.includes("katex") || t.includes("d3"));
  }
  if (tech.id === "postgres") {
    return allProjectTechs.some((t) => t.includes("postgres") || t.includes("plpgsql"));
  }
  if (tech.id === "multi-agent") {
    return allProjectTechs.some((t) => t.includes("agent") || t.includes("control plane") || t.includes("policy"));
  }
  if (tech.id === "yolo") {
    return allProjectTechs.some((t) => t.includes("yolo") || t.includes("bytetrack"));
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

  const verifiedProjects = PROJECTS;

  return (
    <section id="tech-matrix" className="space-y-6">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            05 · PROJECT → TECHNOLOGY MATRIX
          </span>
          <span className="h-px w-8 bg-[var(--border)]" />
          <span className="text-[11px] font-mono text-[var(--text-faint)] uppercase tracking-wider hidden sm:inline">
            Cross-Project Verification
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            Project &amp; Technology Matrix
          </h2>
          <span className="text-[11px] font-mono text-[var(--text-faint)]">
            {verifiedProjects.length} Verified Projects · {MATRIX_TECHNOLOGIES.length} Key Technologies
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl font-sans leading-relaxed">
          A verifiable mapping of technologies across public codebases. Generated directly from central repository metadata without arbitrary claims.
        </p>
      </div>

      {/* Desktop Matrix View */}
      <div className="hidden md:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                <th className="py-3 px-4 text-[11px] font-mono font-medium text-[var(--text-muted)] uppercase tracking-wider w-1/3">
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
                        isHovered ? "bg-[var(--surface-3)] text-[var(--accent)]" : "text-[var(--text)]"
                      }`}
                    >
                      <div className="truncate max-w-[110px] mx-auto font-display font-bold">
                        {p.title}
                      </div>
                      <span className="text-[10px] text-[var(--text-faint)] font-normal uppercase block">
                        {p.statusType}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] font-mono text-xs">
              {MATRIX_TECHNOLOGIES.map((tech) => {
                const isRowHovered = hoveredTech === tech.id;

                return (
                  <tr
                    key={tech.id}
                    onMouseEnter={() => setHoveredTech(tech.id)}
                    onMouseLeave={() => setHoveredTech(null)}
                    className={`transition-colors ${
                      isRowHovered ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]/60"
                    }`}
                  >
                    <td className="py-2.5 px-4 flex items-center justify-between gap-2">
                      <span className={`font-semibold ${isRowHovered ? "text-[var(--accent)]" : "text-[var(--text)]"}`}>
                        {tech.name}
                      </span>
                      <span className="text-[10px] text-[var(--text-faint)] uppercase">
                        {tech.category}
                      </span>
                    </td>

                    {verifiedProjects.map((project) => {
                      const hasTech = checkTechInProject(tech, project);
                      const isColHovered = hoveredProject === project.id;

                      return (
                        <td
                          key={project.id}
                          className={`py-2.5 px-3 text-center transition-colors ${
                            isColHovered ? "bg-[var(--surface)]/70" : ""
                          }`}
                        >
                          {hasTech ? (
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 rounded-[4px] bg-[#C7E34A] text-[#20231D] border border-[#A9C52F]"
                              title={`${tech.name} verified in ${project.title}`}
                            >
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="inline-block w-1.5 h-1.5 rounded-[2px] bg-[var(--border)]" />
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

        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-[4px] bg-[#C7E34A] text-[#20231D] border border-[#A9C52F] flex items-center justify-center">
                <Check className="w-2.5 h-2.5" />
              </span>
              <span>Verified in codebase</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-[2px] bg-[var(--border-strong)]" />
              <span>Not actively utilized</span>
            </div>
          </div>
          <span>Strict metadata analysis</span>
        </div>
      </div>

      {/* Mobile Responsive Accordion */}
      <div className="block md:hidden space-y-3">
        {verifiedProjects.map((project) => {
          const isExpanded = expandedProject === project.id;
          const activeTechs = MATRIX_TECHNOLOGIES.filter((t) => checkTechInProject(t, project));

          return (
            <div
              key={project.id}
              className="card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--surface)] active:bg-[var(--surface-2)] transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-bold text-[var(--text)] font-display">
                    {project.title}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] font-mono tabular-nums">
                    {activeTechs.length} verified technologies
                  </div>
                </div>

                <div className="p-1 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 border-t border-[var(--border)] space-y-3">
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans pt-3">
                    {project.shortDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs font-mono text-[var(--text-secondary)]">
                    {activeTechs.map((tech, idx) => (
                      <span
                        key={tech.id}
                        className="inline-flex items-center gap-1"
                      >
                        {idx > 0 && <span className="text-[var(--text-faint)] mr-1" aria-hidden="true">·</span>}
                        <Check className="w-3 h-3 text-[var(--accent)]" />
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
