import React from "react";
import { Cpu, ShieldCheck, Code2, Sparkles, Layers } from "lucide-react";

export function SkillsHero() {
  return (
    <div className="space-y-4 pt-2 sm:pt-4">
      {/* Top Academic & Authenticity Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>KIIT UNIVERSITY · B.TECH CSE (AI &amp; ML)</span>
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono font-medium tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>EVIDENCE-BASED · ZERO FABRICATED TELEMETRY</span>
        </span>
      </div>

      {/* Main Compact Hero Heading & Subtitle */}
      <div className="space-y-2 border-b border-zinc-850/80 pb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display">
          SKILLS &amp; ENGINEERING STACK
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
          Technologies I use to build, experiment, and ship software. Every item links to genuine project code, repository metrics, or active academic practice.
        </p>
      </div>
    </div>
  );
}

export default SkillsHero;
