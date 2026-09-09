import React from "react";
import { 
  Lightbulb, BookOpen, PenTool, Code2, 
  CheckSquare, GitBranch, Rocket, ArrowRight
} from "lucide-react";

interface WorkflowStage {
  step: string;
  name: string;
  tools: string;
  description: string;
  icon: React.ReactNode;
}

const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    step: "01",
    name: "IDEA",
    tools: "Obsidian / Notes",
    description: "Problem formulation, system constraints, user requirements, and functional scope.",
    icon: <Lightbulb className="w-4 h-4 text-amber-400" />
  },
  {
    step: "02",
    name: "RESEARCH",
    tools: "Technical Docs / Papers",
    description: "API specifications, algorithmic benchmarks, performance tradeoffs, and architectural RFCs.",
    icon: <BookOpen className="w-4 h-4 text-sky-400" />
  },
  {
    step: "03",
    name: "DESIGN",
    tools: "Figma / Canva",
    description: "Interface ergonomics, design tokens, state machine transitions, and responsive grids.",
    icon: <PenTool className="w-4 h-4 text-pink-400" />
  },
  {
    step: "04",
    name: "BUILD",
    tools: "VS Code · React / TypeScript / Python / C++",
    description: "Type-safe implementation, algorithmic routines, and component modularity.",
    icon: <Code2 className="w-4 h-4 text-cyan-400" />
  },
  {
    step: "05",
    name: "TEST",
    tools: "Manual testing / edge-case validation",
    description: "Asymptotic boundaries, API timeout simulation, mobile viewport stress, and error fallbacks.",
    icon: <CheckSquare className="w-4 h-4 text-emerald-400" />
  },
  {
    step: "06",
    name: "VERSION CONTROL",
    tools: "Git / GitHub",
    description: "Atomic semantic commits, feature isolation, and verifiable repository audit history.",
    icon: <GitBranch className="w-4 h-4 text-purple-400" />
  },
  {
    step: "07",
    name: "DEPLOY",
    tools: "Vercel / Edge Network",
    description: "Automated git-push deployments, server-side proxies, and zero-downtime CDN caching.",
    icon: <Rocket className="w-4 h-4 text-rose-400" />
  }
];

export function EngineeringWorkflow() {
  return (
    <section id="engineering-workflow" className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-cyan-400">
            08 — ENGINEERING WORKFLOW
          </span>
          <span className="h-px w-8 bg-zinc-800" />
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
            7-Stage Disciplined Delivery
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
            From Idea to Verified Deployment
          </h2>
          <span className="text-[11px] font-mono text-zinc-500">
            Idea → Research → Design → Build → Test → Git → Deploy
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans leading-relaxed">
          A disciplined engineering flow connecting initial problem discovery to production deployment. Genuine tools mapped to every operational phase.
        </p>
      </div>

      {/* Desktop Horizontal 7-Stage Flow / Grid on Tablets / Stack on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-2.5">
        {WORKFLOW_STAGES.map((stage, idx) => {
          const isLast = idx === WORKFLOW_STAGES.length - 1;

          return (
            <div
              key={stage.name}
              className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-zinc-800 transition-colors flex flex-col justify-between space-y-2.5 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-1 rounded-md bg-zinc-900 border border-zinc-800">
                    {stage.icon}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 font-semibold">
                    {stage.step}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-semibold text-white font-display group-hover:text-cyan-300 transition-colors">
                    {stage.name}
                  </h3>
                  <div className="text-[10px] font-mono text-cyan-400/90 font-medium">
                    {stage.tools}
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  {stage.description}
                </p>
              </div>

              {!isLast && (
                <div className="hidden lg:flex items-center justify-end text-zinc-700 pt-0.5">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default EngineeringWorkflow;
