import React from "react";
import { ENGINEERING_STACK_CATEGORIES } from "../../data/skills";
import { Code2, Layout, Database, Brain, Wrench, Cpu, CheckCircle2 } from "lucide-react";

interface EngineeringStackSectionProps {
  selectedTech?: string | null;
  onSelectTech?: (tech: string | null) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  languages: <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
  frontend: <Layout className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
  "backend-data": <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  "ai-ml": <Brain className="w-4 h-4 text-violet-600 dark:text-violet-400" />,
  tools: <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
  "core-engineering": <Cpu className="w-4 h-4 text-rose-600 dark:text-rose-400" />
};

export function EngineeringStackSection({ selectedTech, onSelectTech }: EngineeringStackSectionProps) {
  return (
    <section id="engineering-stack" className="space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">
            ENGINEERING STACK
          </span>
          <span className="h-px w-8 bg-zinc-300 dark:border-white/[0.08]" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
            Verified Technologies &amp; Foundations
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
            Core Technologies &amp; Domains
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            6 Disciplines · 29 Technologies
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans leading-relaxed">
          A technology overview organized by discipline. These represent verified tools and concepts actively applied across projects, algorithmic problem-solving, and coursework.
        </p>
      </div>

      {/* 6-Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ENGINEERING_STACK_CATEGORIES.map((group) => {
          const icon = CATEGORY_ICONS[group.id] || <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />;

          return (
            <div
              key={group.id}
              className="card p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-white/[0.04] border border-zinc-250/70 dark:border-white/[0.06]">
                      {icon}
                    </div>
                    <h3 className="text-xs font-mono font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                      {group.category}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">
                    {group.skills.length} items
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed min-h-[32px] font-sans">
                  {group.description}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="pt-3 border-t border-zinc-250/60 dark:border-white/[0.06] flex flex-wrap gap-1.5">
                {group.skills.map((skillName) => {
                  const isSelected = selectedTech?.toLowerCase() === skillName.toLowerCase();

                  return (
                    <button
                      key={skillName}
                      type="button"
                      onClick={() => onSelectTech?.(isSelected ? null : skillName)}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all text-left flex items-center gap-1 cursor-pointer ${
                        isSelected
                          ? "bg-purple-600 text-white font-medium shadow-sm"
                          : "bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border border-zinc-250/70 dark:border-white/[0.06] hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <span>{skillName}</span>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-white shrink-0" />}
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
