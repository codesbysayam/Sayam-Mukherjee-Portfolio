import React from "react";
import { ArrowRight } from "lucide-react";

interface WorkflowStep {
  step: string;
  name: string;
  tools: string;
  summary: string;
}

const TOOLCHAIN_STEPS: WorkflowStep[] = [
  {
    step: "01",
    name: "Ideation",
    tools: "Figma · Architecture Docs",
    summary: "Component hierarchies, UX ergonomics, and state machine specification."
  },
  {
    step: "02",
    name: "Design & Spec",
    tools: "VS Code · TypeScript",
    summary: "Strict type schemas, interface contracts, and module boundaries."
  },
  {
    step: "03",
    name: "Development",
    tools: "React · Node · C++ · Python",
    summary: "Modular implementation, reactive interfaces, and efficient algorithms."
  },
  {
    step: "04",
    name: "Version Control",
    tools: "Git · GitHub",
    summary: "Atomic semantic commits, feature branching, and verifiable history."
  },
  {
    step: "05",
    name: "Deployment",
    tools: "Vercel · Edge Network",
    summary: "Automated git CI/CD integration, zero-downtime routing, and edge caching."
  }
];

export function EngineeringToolchain() {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.14em] text-cyan-400">
            09 — ENGINEERING TOOLCHAIN
          </span>
          <span className="h-px w-12 bg-zinc-800" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Standard Workflow
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-display">
            Engineering Toolchain &amp; Delivery Flow
          </h2>
          <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
            Ideation → Design → Development → Version Control → Deployment
          </span>
        </div>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-sans">
          A disciplined five-stage development lifecycle guaranteeing clean architecture, verifiable history, and reproducible delivery.
        </p>
      </div>

      {/* Minimalist 5-Stage Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {TOOLCHAIN_STEPS.map((stage, idx) => {
          const isLast = idx === TOOLCHAIN_STEPS.length - 1;

          return (
            <div
              key={stage.name}
              className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-850 flex flex-col justify-between space-y-4 hover:border-zinc-750 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-500">
                    {stage.step}
                  </span>
                  {!isLast && (
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 hidden md:block" />
                  )}
                </div>

                <h3 className="text-base font-bold text-white font-display">
                  {stage.name}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {stage.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-850/80 text-[11px] font-mono text-cyan-400/90">
                {stage.tools}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EngineeringToolchain;
