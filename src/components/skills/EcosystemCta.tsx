import { Github, FolderGit2, Mail, ExternalLink, ArrowRight } from "lucide-react";

interface EcosystemCtaProps {
  onNavigateTab?: (tab: string) => void;
}

export function EcosystemCta({ onNavigateTab }: EcosystemCtaProps) {
  return (
    <section id="ecosystem-cta" className="pt-4 pb-2">
      <div className="card p-5 sm:p-6 space-y-4">
        <div className="space-y-1.5 max-w-xl">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            COLLABORATION
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            Let’s build something meaningful.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-sans">
            Explore verified public repositories on GitHub, inspect architectural writeups for published projects, or reach out directly for engineering opportunities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="https://github.com/codesbysayam"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary !min-h-[38px] !px-3.5 !py-2 font-mono text-xs"
          >
            <Github className="w-3.5 h-3.5" />
            <span>View GitHub Profile</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
          </a>

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
            className="btn btn-primary !min-h-[38px] !px-3.5 !py-2 font-mono text-xs"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Inspect Projects</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (onNavigateTab) {
                onNavigateTab("contact");
              } else {
                window.location.href = "mailto:sayammukherjee1506@gmail.com";
              }
            }}
            className="btn btn-secondary !min-h-[38px] !px-3.5 !py-2 font-mono text-xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Me</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default EcosystemCta;
