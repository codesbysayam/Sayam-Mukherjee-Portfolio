import React from "react";
import { 
  Lightbulb, Code2, Terminal, GitBranch, Rocket, 
  ArrowRight, ArrowDown, Layers, CheckCircle2 
} from "lucide-react";

interface WorkflowStage {
  step: string;
  name: string;
  tools: string[];
  description: string;
  icon: React.ElementType;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
}

const TOOLCHAIN_STAGES: WorkflowStage[] = [
  {
    step: "01",
    name: "IDEATION",
    tools: ["Figma", "Canva"],
    description: "Component hierarchies, wireframing, UX ergonomics, and typographic rhythm design.",
    icon: Lightbulb,
    accentColor: "text-amber-400",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/20"
  },
  {
    step: "02",
    name: "DESIGN & SPEC",
    tools: ["VS Code", "TypeScript Specs"],
    description: "Architectural contracts, interface typing, data modeling, and state machine scaffolding.",
    icon: Code2,
    accentColor: "text-cyan-400",
    accentBg: "bg-cyan-500/10",
    accentBorder: "border-cyan-500/20"
  },
  {
    step: "03",
    name: "DEVELOPMENT",
    tools: ["React", "TypeScript", "Python", "C++"],
    description: "Building responsive web interfaces, robust backend services, and machine learning pipelines.",
    icon: Terminal,
    accentColor: "text-purple-400",
    accentBg: "bg-purple-500/10",
    accentBorder: "border-purple-500/20"
  },
  {
    step: "04",
    name: "VERSION CONTROL",
    tools: ["Git", "GitHub"],
    description: "Semantic commits, branching workflows, peer review cycles, and repository history management.",
    icon: GitBranch,
    accentColor: "text-blue-400",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/20"
  },
  {
    step: "05",
    name: "DEPLOYMENT",
    tools: ["Vercel", "Edge Network"],
    description: "Automated CI/CD git integrations, HTTPS termination, and edge caching for instant global delivery.",
    icon: Rocket,
    accentColor: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/20"
  }
];

export function EngineeringToolchain() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-850 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
              WORKFLOW PIPELINE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-mono text-zinc-500">
              5-STAGE SHIP CYCLE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            ENGINEERING TOOLCHAIN
          </h2>
        </div>
        <p className="text-xs text-zinc-400 font-mono">
          From concept to production edge delivery
        </p>
      </div>

      {/* Visual Workflow Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {TOOLCHAIN_STAGES.map((stage, idx) => {
          const IconComponent = stage.icon;
          const isLast = idx === TOOLCHAIN_STAGES.length - 1;

          return (
            <div key={stage.name} className="relative flex flex-col">
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-850 hover:border-zinc-750 transition-all flex flex-col justify-between space-y-3 h-full">
                <div className="space-y-2.5">
                  {/* Step and Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold">
                      {stage.step}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg ${stage.accentBg} ${stage.accentBorder} ${stage.accentColor} border flex items-center justify-center shrink-0`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      {stage.name}
                    </h3>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    {stage.description}
                  </p>
                </div>

                {/* Tools Chips */}
                <div className="pt-2 border-t border-zinc-850/80">
                  <div className="flex flex-wrap gap-1">
                    {stage.tools.map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connecting arrow (visible on desktop between items) */}
              {!isLast && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 items-center justify-center">
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EngineeringToolchain;
