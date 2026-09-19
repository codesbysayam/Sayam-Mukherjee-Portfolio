import React from "react";
import { Github, FolderGit2, Mail, ExternalLink, ArrowRight } from "lucide-react";

interface EcosystemCtaProps {
  onNavigateTab?: (tab: string) => void;
}

export function EcosystemCta({ onNavigateTab }: EcosystemCtaProps) {
  return (
    <section id="ecosystem-cta" className="pt-4 pb-2">
      <div className="rounded-xl bg-zinc-950/50 border border-zinc-850 p-5 sm:p-6 space-y-4">
        <div className="space-y-1.5 max-w-xl">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-cyan-400">
            COLLABORATION
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
            Let’s build something meaningful.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Explore verified public repositories on GitHub, inspect architectural writeups for published projects, or reach out directly for engineering opportunities.
          </p>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View GitHub Profile */}
          <a
            href="https://github.com/codesbysayam"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs border border-zinc-750 hover:border-zinc-600 transition-colors shadow-sm"
          >
            <Github className="w-3.5 h-3.5 text-white" />
            <span>View GitHub Profile</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
          </a>

          {/* Inspect Projects */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateTab) {
                onNavigateTab("projects");
              } else {
                const el = document.getElementById("projects");
                el?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-500/30 hover:border-cyan-500/50 transition-colors"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Inspect Projects</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>

          {/* Contact Me */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateTab) {
                onNavigateTab("contact");
              } else {
                window.location.href = "mailto:sayammukherjee1506@gmail.com";
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <Mail className="w-4 h-4 text-zinc-400" />
            <span>Contact Me</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default EcosystemCta;
