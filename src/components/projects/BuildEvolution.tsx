import { memo } from "react";
import { GitBranch } from "lucide-react";
import { ProjectItem } from "../../data/projects";

interface BuildEvolutionProps {
  onSelectProject?: (project: ProjectItem) => void;
}

interface EvolutionStage {
  stage: string;
  step: string;
  title: string;
  projectId: string;
  domain: string;
  narrative: string;
  tech: string[];
}

const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    stage: "EARLY BUILDS",
    step: "01",
    title: "SayamSolves",
    projectId: "sayamsolves",
    domain: "Algorithms & DSA",
    narrative: "Foundational problem decomposition, optimal C++ asymptotic memory & runtime discipline through daily LeetCode practice.",
    tech: ["C++", "DSA", "Algorithms", "LeetCode"]
  },
  {
    stage: "SYSTEMS & COMPETITION",
    step: "02",
    title: "MAUSAM",
    projectId: "mausam",
    domain: "SIH 2026 / Weather Platform",
    narrative: "Engineered with Team Algnite for Smart India Hackathon 2026 to consolidate complex meteorological and maritime indices.",
    tech: ["TypeScript", "React", "Weather APIs", "Tailwind"]
  },
  {
    stage: "FULL-STACK",
    step: "03",
    title: "Interactive Portfolio",
    projectId: "portfolio",
    domain: "Web Architecture & Telemetry",
    narrative: "Production full-stack portfolio with editorial architecture, server-side caching proxy, and zero fabricated metrics.",
    tech: ["React", "Express", "Vite", "Motion"]
  },
  {
    stage: "AI / ML",
    step: "04",
    title: "YOLO / YOLOv8 Edge CV",
    projectId: "yolo",
    domain: "Computer Vision & Edge AI",
    narrative: "Research into lightweight YOLOv8 models running on constrained edge nodes with OpenCV spatial tracking.",
    tech: ["Python", "YOLOv8", "OpenCV", "PyTorch"]
  },
  {
    stage: "CURRENT DEVELOPMENT",
    step: "05",
    title: "OPERON",
    projectId: "operon",
    domain: "Autonomous Multi-Agent AI",
    narrative: "Enterprise multi-agent autonomous operations platform with strict human-in-the-loop governance checkpoints.",
    tech: ["TypeScript", "Multi-Agent AI", "Node.js", "Express"]
  }
];

function BuildEvolutionComponent({ onSelectProject: _onSelectProject }: BuildEvolutionProps) {
  return (
    <div className="card p-6 sm:p-7 space-y-6">
      <div className="space-y-1 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="text-sm sm:text-base font-bold font-display uppercase tracking-wider text-[var(--text)]">
            BUILD EVOLUTION &amp; ARCHITECTURAL LIFECYCLE
          </h3>
        </div>
        <p className="text-xs font-sans text-[var(--text-muted)]">
          Progression of software systems from early algorithmic foundations to autonomous multi-agent pipelines.
        </p>
      </div>

      <div className="space-y-3 relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-[var(--border)] -z-0" />

        {EVOLUTION_STAGES.map((stage, idx) => {
          const isLast = idx === EVOLUTION_STAGES.length - 1;
          return (
            <div key={stage.step} className="relative z-10 flex items-start gap-4 group">
              <div
                className={`w-10 h-10 rounded-[8px] flex items-center justify-center font-mono text-xs font-bold shrink-0 border transition-colors tabular-nums ${
                  isLast
                    ? "bg-[#C7E34A] text-[#20231D] border-[#A9C52F]"
                    : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] group-hover:border-[var(--border-strong)]"
                }`}
              >
                {stage.step}
              </div>

              <div className="flex-1 p-3.5 rounded-[10px] border bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)] transition-colors space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-semibold text-[var(--accent)]">
                    {stage.stage}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-faint)]">
                    {stage.domain}
                  </span>
                </div>

                <h4 className="text-sm font-bold font-display text-[var(--text)]">
                  {stage.title}
                </h4>

                <p className="text-xs leading-relaxed font-sans text-[var(--text-muted)]">
                  {stage.narrative}
                </p>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-[10px] font-mono text-[var(--text-secondary)]">
                  {stage.tech.map((t, tIdx) => (
                    <span key={tIdx} className="inline-flex items-center gap-2">
                      {tIdx > 0 && <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>}
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const BuildEvolution = memo(BuildEvolutionComponent);
