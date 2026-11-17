import React from "react";
import { ENGINEERING_STACK_CATEGORIES } from "../../data/skills";
import { Code2, Layout, Database, Brain, Wrench, Cpu, CheckCircle2 } from "lucide-react";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";

interface EngineeringStackSectionProps {
  selectedTech?: string | null;
  onSelectTech?: (tech: string | null) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  languages: <Code2 className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />,
  frontend: <Layout className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />,
  "backend-data": <Database className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />,
  "ai-ml": <Brain className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />,
  tools: <Wrench className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />,
  "core-engineering": <Cpu className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
};

export function EngineeringStackSection({ selectedTech, onSelectTech }: EngineeringStackSectionProps) {
  return (
    <section id="engineering-stack" className="space-y-6">
      <EditorialReveal className="space-y-2">
        <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-muted)]">
          <span className="font-semibold uppercase tracking-wider text-[var(--accent)]">
            Engineering Stack
          </span>
          <span className="hidden sm:inline" aria-hidden="true">/</span>
          <span className="hidden sm:inline uppercase tracking-wider">Verified Technologies &amp; Foundations</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            Core Technologies &amp; Domains
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
            6 Disciplines · 29 Technologies
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans leading-relaxed">
          Technology ledger organized by discipline — verified tools and fundamentals applied across shipped projects and coursework.
        </p>
      </EditorialReveal>

      <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ENGINEERING_STACK_CATEGORIES.map((group) => {
          const icon = CATEGORY_ICONS[group.id] || <Code2 className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />;

          return (
            <StaggerItem key={group.id} className="card p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-[6px] bg-[var(--surface)] border border-[var(--border)]">
                      {icon}
                    </div>
                    <h3 className="text-xs font-mono font-bold tracking-wider text-[var(--text)] uppercase">
                      {group.category}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
                    {group.skills.length}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed min-h-[32px] font-sans">
                  {group.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex flex-wrap gap-1.5">
                {group.skills.map((skillName) => {
                  const isSelected = selectedTech?.toLowerCase() === skillName.toLowerCase();

                  return (
                    <button
                      key={skillName}
                      type="button"
                      onClick={() => onSelectTech?.(isSelected ? null : skillName)}
                      className={`px-2.5 py-1 rounded-[4px] text-xs font-mono transition-colors text-left flex items-center gap-1 cursor-pointer border ${
                        isSelected
                          ? "bg-[#20231D] dark:bg-[#C7E34A] text-[#F4F4ED] dark:text-[#20231D] border-[#20231D] dark:border-[#C7E34A] font-semibold"
                          : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)]"
                      }`}
                    >
                      <span>{skillName}</span>
                      {isSelected && <CheckCircle2 className="w-3 h-3 shrink-0" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}

export default EngineeringStackSection;
