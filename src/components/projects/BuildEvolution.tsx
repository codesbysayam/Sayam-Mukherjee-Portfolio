import { memo } from "react";
import { GitBranch, ArrowDown, CheckCircle2, ChevronRight } from "lucide-react";
import { ProjectItem } from "../../data/projects";
import { usePortfolio } from "../../context/PortfolioContext";

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
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  return (
    <div className={`glass-card rounded-2xl p-6 sm:p-7 border space-y-6 transition-colors ${
      isLight ? "bg-white/80 border-slate-200 shadow-sm" : "border-zinc-850 bg-zinc-950/70"
    }`}>
      {/* Header */}
      <div className={`space-y-1 border-b pb-4 ${
        isLight ? "border-slate-200" : "border-zinc-900"
      }`}>
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-500" />
          <h3 className={`text-sm sm:text-base font-bold font-display uppercase tracking-wider ${
            isLight ? "text-slate-900" : "text-white"
          }`}>
            BUILD EVOLUTION &amp; ARCHITECTURAL LIFECYCLE
          </h3>
        </div>
        <p className={`text-xs font-sans ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
          Progression of software systems from early algorithmic foundations to autonomous multi-agent pipelines.
        </p>
      </div>

      {/* Evolution Timeline List */}
      <div className="space-y-3 relative">
        {/* Subtle vertical spine */}
        <div className={`absolute left-[19px] top-4 bottom-4 w-px -z-0 ${
          isLight ? "bg-slate-200" : "bg-zinc-800"
        }`} />

        {EVOLUTION_STAGES.map((stage, idx) => {
          const isLast = idx === EVOLUTION_STAGES.length - 1;
          return (
            <div key={stage.step} className="relative z-10 flex items-start gap-4 group">
              {/* Step indicator circle */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 border transition-all ${
                isLast
                  ? isLight
                    ? "bg-cyan-50 text-cyan-800 border-cyan-300 shadow-sm"
                    : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm"
                  : isLight
                  ? "bg-slate-100 text-slate-600 border-slate-200 group-hover:border-slate-300"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 group-hover:border-zinc-700"
              }`}>
                {stage.step}
              </div>

              {/* Card Body */}
              <div className={`flex-1 p-3.5 rounded-xl border transition-colors space-y-1.5 ${
                isLight
                  ? "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                  : "bg-zinc-900/40 border-zinc-850/80 hover:border-zinc-750"
              }`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`text-[10px] font-mono uppercase tracking-widest font-semibold ${
                    isLight ? "text-cyan-700" : "text-cyan-400"
                  }`}>
                    {stage.stage}
                  </span>
                  <span className={`text-[10px] font-mono ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
                    {stage.domain}
                  </span>
                </div>

                <h4 className={`text-sm font-bold font-display ${isLight ? "text-slate-900" : "text-white"}`}>
                  {stage.title}
                </h4>

                <p className={`text-xs leading-relaxed font-sans ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                  {stage.narrative}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {stage.tech.map((t, tIdx) => (
                    <span 
                      key={tIdx} 
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                        isLight
                          ? "bg-white text-slate-700 border-slate-200"
                          : "bg-zinc-950 text-zinc-400 border-zinc-850"
                      }`}
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
