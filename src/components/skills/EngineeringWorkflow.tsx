import React from "react";
import { motion } from "motion/react";
import {
  Lightbulb, BookOpen, PenTool, Code2,
  CheckSquare, GitBranch, Rocket, ArrowRight
} from "lucide-react";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, MOTION_VIEWPORT, usePrefersReducedMotion } from "../../motion/tokens";

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
    icon: <Lightbulb className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
  },
  {
    step: "02",
    name: "RESEARCH",
    tools: "Technical Docs / Papers",
    description: "API specifications, algorithmic benchmarks, performance tradeoffs, and architectural RFCs.",
    icon: <BookOpen className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
  },
  {
    step: "03",
    name: "DESIGN",
    tools: "Figma / Canva",
    description: "Interface ergonomics, design tokens, state machine transitions, and responsive grids.",
    icon: <PenTool className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
  },
  {
    step: "04",
    name: "BUILD",
    tools: "VS Code · TS / Python / C++",
    description: "Type-safe implementation, algorithmic routines, and component modularity.",
    icon: <Code2 className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
  },
  {
    step: "05",
    name: "TEST",
    tools: "Vitest / Edge validation",
    description: "Asymptotic boundaries, API timeout simulation, mobile viewport stress, and error fallbacks.",
    icon: <CheckSquare className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
  },
  {
    step: "06",
    name: "VERSION CONTROL",
    tools: "Git / GitHub",
    description: "Atomic semantic commits, feature isolation, and verifiable repository audit history.",
    icon: <GitBranch className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
  },
  {
    step: "07",
    name: "DEPLOY",
    tools: "Vercel / Edge Network",
    description: "Automated git-push deployments, server-side proxies, and zero-downtime CDN caching.",
    icon: <Rocket className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
  }
];

export function EngineeringWorkflow() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="engineering-workflow" className="space-y-6">
      <EditorialReveal className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            05 · ENGINEERING WORKFLOW
          </span>
          <span className="h-px w-8 bg-[var(--border)]" />
          <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider hidden sm:inline">
            7-Stage Disciplined Delivery
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            From Idea to Verified Deployment
          </h2>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Idea → Research → Design → Build → Test → Git → Deploy
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans leading-relaxed">
          A disciplined engineering flow connecting initial problem discovery to production deployment across every build.
        </p>
      </EditorialReveal>

      {/* Progressive SVG Workflow Signal Trace */}
      <div className="hidden xl:block w-full overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1120 22" className="w-full h-5 block">
          <line
            x1="28"
            y1="11"
            x2="1092"
            y2="11"
            stroke="var(--border)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          <motion.path
            d="M 28 11 L 1092 11"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={MOTION_VIEWPORT}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: MOTION_DURATION.scene, ease: MOTION_EASE.out }
            }
          />
          {WORKFLOW_STAGES.map((stage, idx) => {
            const cx = 28 + idx * ((1092 - 28) / (WORKFLOW_STAGES.length - 1));
            return (
              <circle
                key={stage.step}
                cx={cx}
                cy={11}
                r={4.5}
                fill="var(--surface-2)"
                stroke="var(--accent)"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>

      <StaggerGroup stagger={0.04} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {WORKFLOW_STAGES.map((stage, idx) => {
          const isLast = idx === WORKFLOW_STAGES.length - 1;

          return (
            <StaggerItem
              key={stage.name}
              className="card p-3.5 flex flex-col justify-between space-y-2.5 group h-full"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border)]">
                    {stage.icon}
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-muted)] font-semibold tabular-nums">
                    {stage.step}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-semibold text-[var(--text)] font-display group-hover:text-[var(--accent)] transition-colors">
                    {stage.name}
                  </h3>
                  <div className="text-[10px] font-mono text-[var(--accent)] font-medium">
                    {stage.tools}
                  </div>
                </div>

                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-sans">
                  {stage.description}
                </p>
              </div>

              {!isLast && (
                <div className="hidden xl:flex items-center justify-end text-[var(--text-muted)] pt-0.5">
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </div>
              )}
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}

export default EngineeringWorkflow;
