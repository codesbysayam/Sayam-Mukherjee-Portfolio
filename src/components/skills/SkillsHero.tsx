import React from "react";
import { ShieldCheck, Code2 } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

export function SkillsHero() {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  return (
    <header className="space-y-4 pt-2 pb-4">
      {/* Editorial Tag */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono font-medium uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
          TECHNICAL CAPABILITIES · VERIFIED COMPETENCIES
        </span>
        <span className="h-px w-8 bg-zinc-300 dark:bg-zinc-800" />
        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
          What I Know &amp; Have Proven
        </span>
      </div>

      {/* Primary Statement */}
      <div className="space-y-2 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-display leading-[1.1]">
          SKILLS &amp; TECHNICAL <br />
          <span className="text-zinc-500 dark:text-zinc-400">COMPETENCY LEDGER</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans pt-1">
          An authentic, evidence-based ledger of my engineering competencies. Spanning multi-agent AI systems, full-stack web platforms, asymptotic algorithmic problem solving, and genuine repository language telemetry.
        </p>
      </div>

      {/* Verified note */}
      <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>7 Verified Projects</span>
        </div>
        <span>·</span>
        <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-medium">
          <Code2 className="w-3.5 h-3.5 shrink-0" />
          <span>7.39 MB Verified GitHub Source</span>
        </div>
        <span>·</span>
        <span>LeetCode: 100% Acceptance Rate</span>
      </div>
    </header>
  );
}

export default SkillsHero;


