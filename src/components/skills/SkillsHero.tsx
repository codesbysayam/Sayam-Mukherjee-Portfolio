import { ShieldCheck, Code2 } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { ContourBackground } from "../motion/ContourBackground";

export function SkillsHero() {
  return (
    <header
      id="skills-hero"
      className="relative overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-5 py-8 sm:px-9 sm:py-10 space-y-5"
    >
      <ContourBackground density="subtle" />

      <div className="relative z-10 space-y-5">
        <SectionHeading
          level="h1"
          immediate
          index="03"
          eyebrow="Technical Capabilities · Verified Competencies"
          title="Skills & Technical"
          italicHighlight="competency ledger."
          description="An evidence-based ledger of verified engineering capabilities spanning multi-agent AI systems, full-stack web platforms, asymptotic algorithmic problem solving, and repository telemetry."
          withDivider={false}
        />

        <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-[var(--text-muted)] tabular-nums">
          <div className="flex items-center gap-1.5 text-[var(--text)] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" aria-hidden="true" />
            <span>8 Verified Projects</span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5 text-[var(--accent)] font-semibold">
            <Code2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Verified GitHub Source</span>
          </div>
          <span aria-hidden="true">·</span>
          <span>LeetCode: 100% Acceptance Rate</span>
        </div>
      </div>
    </header>
  );
}

export default SkillsHero;
