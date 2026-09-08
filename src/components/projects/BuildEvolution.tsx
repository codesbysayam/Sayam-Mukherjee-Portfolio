import { memo } from "react";
import { GitBranch, ArrowDown, CheckCircle2, ChevronRight } from "lucide-react";
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
    narrative: "Production full-stack portfolio with liquid glass aesthetics, server-side caching proxy, and zero fabricated metrics.",
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

function BuildEvolutionComponent({ onSelectProject }: BuildEvolutionProps) {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-7 border border-zinc-850 bg-zinc-950/70 space-y-6">
      {/* Header */}
      <div className="space-y-1 border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm sm:text-base font-bold text-white font-display uppercase tracking-wider">
            BUILD EVOLUTION &amp; ARCHITECTURAL LIFECYCLE
          </h3>
        </div>
        <p className="text-xs text-zinc-400 font-sans">
          Progression of software systems from early algorithmic foundations to autonomous multi-agent pipelines.
        </p>
      </div>

      {/* Evolution Timeline List */}
      <div className="space-y-3 relative">
        {/* Subtle vertical spine */}
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-zinc-800 -z-0" />

        {EVOLUTION_STAGES.map((stage, idx) => {
          const isLast = idx === EVOLUTION_STAGES.length - 1;
          return (
            <div key={stage.step} className="relative z-10 flex items-start gap-4 group">
              {/* Step indicator circle */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 border transition-all ${
                isLast
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 group-hover:border-zinc-700"
              }`}>
                {stage.step}
              </div>

              {/* Card Body */}
              <div className="flex-1 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-850/80 hover:border-zinc-750 transition-colors space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                    {stage.stage}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {stage.domain}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white font-display">
                  {stage.title}
                </h4>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {stage.narrative}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {stage.tech.map((t, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-950 text-zinc-400 border border-zinc-850"
                    >
                      {t}
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
