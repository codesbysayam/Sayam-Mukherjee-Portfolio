import React from "react";
import { ENGINEERING_STACK_CATEGORIES } from "../../data/skills";
import { Code2, Layout, Database, Brain, Wrench, Cpu, CheckCircle2 } from "lucide-react";

interface EngineeringStackSectionProps {
  selectedTech?: string | null;
  onSelectTech?: (tech: string | null) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  languages: <Code2 className="w-4 h-4 text-cyan-400" />,
  frontend: <Layout className="w-4 h-4 text-sky-400" />,
  "backend-data": <Database className="w-4 h-4 text-emerald-400" />,
  "ai-ml": <Brain className="w-4 h-4 text-violet-400" />,
  tools: <Wrench className="w-4 h-4 text-amber-400" />,
  "core-engineering": <Cpu className="w-4 h-4 text-rose-400" />
};

export function EngineeringStackSection({ selectedTech, onSelectTech }: EngineeringStackSectionProps) {
  return (
    <section id="engineering-stack" className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-cyan-400">
            02 — ENGINEERING STACK
          </span>
          <span className="h-px w-8 bg-zinc-800" />
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
            Verified Technologies &amp; Foundations
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
            Core Technologies &amp; Domains
          </h2>
          <span className="text-[11px] font-mono text-zinc-500">
            6 Disciplines · 29 Technologies
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans leading-relaxed">
          A technology overview organized by discipline. These represent verified tools and concepts actively applied across projects, algorithmic problem-solving, and coursework.
        </p>
      </div>

      {/* 6-Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {ENGINEERING_STACK_CATEGORIES.map((group) => {
          const icon = CATEGORY_ICONS[group.id] || <Code2 className="w-4 h-4 text-cyan-400" />;

          return (
            <div
              key={group.id}
              className="p-4 sm:p-5 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-zinc-800 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                      {icon}
                    </div>
                    <h3 className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase">
                      {group.category}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {group.skills.length} items
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed min-h-[32px]">
                  {group.description}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="pt-2.5 border-t border-zinc-850/80 flex flex-wrap gap-1.5">
                {group.skills.map((skillName) => {
                  const isSelected = selectedTech?.toLowerCase() === skillName.toLowerCase();

                  return (
                    <button
                      key={skillName}
                      type="button"
                      onClick={() => onSelectTech?.(isSelected ? null : skillName)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all text-left flex items-center gap-1 ${
                        isSelected
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
                          : "bg-zinc-900/70 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      <span>{skillName}</span>
                      {isSelected && <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default EngineeringStackSection;
