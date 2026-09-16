import React from "react";
import { ShieldCheck, Code2 } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";

export function SkillsHero() {
  return (
    <header className="space-y-4 pt-2 pb-2">
      <SectionHeader
        level="h1"
        eyebrow="Technical Capabilities · Verified Competencies"
        title={<>Skills &amp; Technical <br /><span className="text-zinc-400 dark:text-zinc-500 font-normal">Competency Ledger</span></>}
        description="An authentic, evidence-based ledger of my engineering competencies. Spanning multi-agent AI systems, full-stack web platforms, asymptotic algorithmic problem solving, and genuine repository language telemetry."
      />

      {/* Verified note */}
      <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>5 Verified Projects</span>
        </div>
        <span>·</span>
        <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 font-medium">
          <Code2 className="w-3.5 h-3.5 shrink-0" />
          <span>Verified GitHub Source</span>
        </div>
        <span>·</span>
        <span>LeetCode: 100% Acceptance Rate</span>
      </div>
    </header>
  );
}

export default SkillsHero;


