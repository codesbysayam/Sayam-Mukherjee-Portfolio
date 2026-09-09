import React from "react";
import { ShieldCheck } from "lucide-react";

export function SkillsHero() {
  return (
    <header className="space-y-4 pt-2 pb-4">
      {/* Editorial Tag */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono font-medium uppercase tracking-[0.16em] text-cyan-400">
          ENGINEERING ECOSYSTEM
        </span>
        <span className="h-px w-8 bg-zinc-800 dark:bg-zinc-800" />
        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
          Evidence-Based Engineering Map
        </span>
      </div>

      {/* Primary Statement */}
      <div className="space-y-1.5">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-display leading-tight">
          How I build, connect and evolve ideas into software.
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed font-sans">
          An evidence-based view of the technologies, engineering practices and projects that shape my work.
        </p>
      </div>

      {/* Verified note */}
      <div className="pt-0.5 flex items-center gap-2 text-[11px] font-mono text-zinc-500">
        <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
        <span>5 verified projects · Real repository telemetry · Zero fabricated statistics</span>
      </div>
    </header>
  );
}

export default SkillsHero;

