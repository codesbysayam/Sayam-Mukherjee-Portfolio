import React from "react";
import { ShieldCheck } from "lucide-react";

export function SkillsHero() {
  return (
    <header className="space-y-6 pt-4 pb-2">
      {/* 01 Section Label */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-semibold uppercase tracking-[0.14em] text-cyan-400">
          01 — SKILLS
        </span>
        <span className="h-px w-12 bg-zinc-800" />
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
          KIIT University · B.Tech CSE (AI &amp; ML)
        </span>
      </div>

      {/* Primary Statement */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display leading-[1.15]">
          Technologies I use to build, experiment and ship software.
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 max-w-3xl leading-relaxed font-sans">
          A deliberate overview of languages, frameworks, and engineering foundations. 
          Every skill documented here is grounded in real project code, verifiable GitHub repositories, 
          or active coursework—strictly free of arbitrary percentages or fabricated mastery ratings.
        </p>
      </div>

      {/* Restrained authenticity note */}
      <div className="pt-2 flex items-center gap-2 text-xs font-mono text-zinc-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Evidence-based documentation · 5 verified projects · Real repository telemetry</span>
      </div>
    </header>
  );
}

export default SkillsHero;
