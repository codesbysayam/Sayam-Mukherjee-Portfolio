import React from "react";
import { ShieldCheck, Code2 } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";

export function SkillsHero() {
  return (
    <header className="space-y-4 pt-2 pb-6 border-b border-[var(--border)]">
      <SectionHeader
        level="h1"
        eyebrow="03 · Technical Capabilities"
        badge="Verified Competencies"
        title={
          <>
            Skills &amp; Technical{" "}
            <span className="font-serif-editorial italic font-normal text-[var(--text-secondary)]">
              competency ledger.
            </span>
          </>
        }
        description="An evidence-based ledger of verified engineering capabilities spanning multi-agent AI systems, full-stack web platforms, asymptotic algorithmic problem solving, and repository telemetry."
      />

      <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-[var(--text-muted)] tabular-nums">
        <div className="flex items-center gap-1.5 text-[var(--text)] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" aria-hidden="true" />
          <span>5 Verified Projects</span>
        </div>
        <span aria-hidden="true">·</span>
        <div className="flex items-center gap-1.5 text-[var(--accent)] font-semibold">
          <Code2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Verified GitHub Source</span>
        </div>
        <span aria-hidden="true">·</span>
        <span>LeetCode: 100% Acceptance Rate</span>
      </div>
    </header>
  );
}

export default SkillsHero;
