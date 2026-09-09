import React, { useState, useEffect, useMemo } from "react";
import { Code2, GitBranch, ExternalLink, Terminal, Cpu, FileSpreadsheet, Layers, Palette, FileCode2, ShieldCheck } from "lucide-react";

// Actual detected repository bytes from codesbysayam/Sayam-Mukherjee-Portfolio
const VERIFIED_INITIAL_BYTES: Record<string, number> = {
  TypeScript: 846240,
  CSS: 36875,
  JavaScript: 9649,
  HTML: 2016
};

const LANGUAGE_COLORS: Record<string, { bar: string; dot: string; text: string; border: string }> = {
  TypeScript: { bar: "bg-sky-400", dot: "bg-sky-400", text: "text-sky-400", border: "border-sky-500/20" },
  JavaScript: { bar: "bg-amber-400", dot: "bg-amber-400", text: "text-amber-400", border: "border-amber-500/20" },
  CSS: { bar: "bg-indigo-400", dot: "bg-indigo-400", text: "text-indigo-400", border: "border-indigo-500/20" },
  HTML: { bar: "bg-rose-400", dot: "bg-rose-400", text: "text-rose-400", border: "border-rose-500/20" },
  Python: { bar: "bg-emerald-400", dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-500/20" },
  C: { bar: "bg-blue-400", dot: "bg-blue-400", text: "text-blue-400", border: "border-blue-500/20" },
  "Jupyter Notebook": { bar: "bg-orange-400", dot: "bg-orange-400", text: "text-orange-400", border: "border-orange-500/20" }
};

interface LanguageRole {
  language: string;
  role: string;
  category: string;
  sourcePath: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LANGUAGE_ROLES: LanguageRole[] = [
  {
    language: "TypeScript",
    role: "Application architecture & React state synchronization",
    category: "Application Core",
    sourcePath: "src/App.tsx, src/components/*",
    icon: Layers
  },
  {
    language: "JavaScript",
    role: "Build-time manifest generation & runtime automation",
    category: "Tooling / Runtime",
    sourcePath: "scripts/generate_build_manifest.js",
    icon: Terminal
  },
  {
    language: "CSS",
    role: "Tailwind design tokens, typography scales & responsive layouts",
    category: "Visual System",
    sourcePath: "src/index.css",
    icon: Palette
  },
  {
    language: "HTML",
    role: "Semantic entry point, viewport configuration & metadata tags",
    category: "Document Structure",
    sourcePath: "index.html",
    icon: FileCode2
  },
  {
    language: "Python",
    role: "Portfolio schema validation & data integrity checks",
    category: "Data Validation",
    sourcePath: "tools/python/portfolio_data_validator.py",
    icon: ShieldCheck
  },
  {
    language: "C",
    role: "High-efficiency systems utility for project code metric calculation",
    category: "Systems Utility",
    sourcePath: "tools/c/portfolio_metrics.c",
    icon: Cpu
  },
  {
    language: "Jupyter Notebook",
    role: "Repository codebase analysis & metric exploration artifact",
    category: "Analysis Artifact",
    sourcePath: "tools/notebooks/portfolio_repository_analysis.ipynb",
    icon: FileSpreadsheet
  }
];

export function CodebaseLanguageDistribution() {
  const [bytesMap, setBytesMap] = useState<Record<string, number>>(VERIFIED_INITIAL_BYTES);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("Cached baseline");
  const [isApiFetched, setIsApiFetched] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function fetchLanguages() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/codesbysayam/Sayam-Mukherjee-Portfolio/languages",
          { headers: { Accept: "application/vnd.github.v3+json" } }
        );

        if (res.ok) {
          const data = (await res.json()) as Record<string, number>;
          if (!isCancelled && data && Object.keys(data).length > 0) {
            setBytesMap(data);
            setIsApiFetched(true);
            const now = new Date();
            setLastSyncedTime(
              now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
                " " +
                now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
            );
          }
        }
      } catch (err) {
        // Fall back gracefully to verified repository bytes snapshot
        console.warn("GitHub Language API fallback to verified repository baseline:", err);
      }
    }

    fetchLanguages();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Compute strictly from GitHub language statistics
  const { languages, totalBytes } = useMemo(() => {
    const total = Object.values(bytesMap).reduce((a, b) => a + b, 0);
    if (total === 0) return { languages: [], totalBytes: 0 };

    const list = Object.entries(bytesMap)
      .map(([language, bytes]) => ({
        language,
        bytes,
        percentage: Number(((bytes / total) * 100).toFixed(1))
      }))
      .sort((a, b) => b.bytes - a.bytes);

    return { languages: list, totalBytes: total };
  }, [bytesMap]);

  return (
    <section id="language-distribution" className="space-y-5">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-cyan-400">
            07 — CODEBASE LANGUAGE MAP
          </span>
          <span className="h-px w-8 bg-zinc-800" />
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
            Repository Composition
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
            Codebase Language Map
          </h2>
          <span className="text-[11px] font-mono text-zinc-500">
            {isApiFetched ? "Synced from GitHub API" : "Verified Snapshot"}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans leading-relaxed">
          How this repository is actually composed, based on GitHub's language statistics.
        </p>
      </div>

      {/* Main Container */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/40 border border-zinc-850 space-y-6">
        {/* Dynamic Proportional Distribution Bar */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="font-medium text-zinc-300">Codebase Composition</span>
            <span className="text-[11px] text-zinc-500">
              {(totalBytes / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} KB Total Source
            </span>
          </div>

          <div className="h-2.5 sm:h-3 w-full rounded-full bg-zinc-900 overflow-hidden flex p-0.5 border border-zinc-800/80">
            {languages.map((item) => {
              const color = LANGUAGE_COLORS[item.language] || { bar: "bg-zinc-500" };
              return (
                <div
                  key={item.language}
                  style={{ width: `${Math.max(item.percentage, 1)}%` }}
                  className={`${color.bar} h-full first:rounded-l-full last:rounded-r-full transition-all duration-300`}
                  title={`${item.language}: ${item.percentage}% (${(item.bytes / 1024).toFixed(1)} KB)`}
                />
              );
            })}
          </div>

          {/* Dynamic Compact Language Tags */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs font-mono">
            {languages.map((item) => {
              const color = LANGUAGE_COLORS[item.language] || { dot: "bg-zinc-400", text: "text-zinc-300" };
              return (
                <div key={item.language} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                  <span className="text-zinc-300 font-medium">{item.language}</span>
                  <span className="text-[11px] text-zinc-500 font-normal">{item.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language Roles Grid */}
        <div className="space-y-3 pt-4 border-t border-zinc-850/80">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
              Codebase Languages &amp; Engineering Roles
            </h3>
            <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
              Purposeful Code · No Filler
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {LANGUAGE_ROLES.map((roleItem) => {
              const Icon = roleItem.icon;
              const color = LANGUAGE_COLORS[roleItem.language] || { dot: "bg-zinc-400", text: "text-zinc-300", border: "border-zinc-800" };
              const detected = languages.find((l) => l.language === roleItem.language);

              return (
                <div
                  key={roleItem.language}
                  className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-850 hover:border-zinc-800 transition-colors flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="text-sm font-semibold text-zinc-200">
                          {roleItem.language}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400">
                        {roleItem.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      {roleItem.role}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-zinc-800/40 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span className="truncate max-w-[170px]" title={roleItem.sourcePath}>
                      {roleItem.sourcePath}
                    </span>
                    {detected ? (
                      <span className="text-zinc-400 shrink-0 font-medium">
                        {detected.percentage}% share
                      </span>
                    ) : (
                      <span className="text-zinc-500 shrink-0">
                        {roleItem.language === "Jupyter Notebook" ? "Analysis artifact" : "Utility module"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Principle Banner: Distinction between Codebase Composition and Skills */}
        <div className="p-3.5 rounded-xl bg-zinc-900/30 border border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400 font-sans">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5 sm:mt-0" />
            <p className="text-[12px] leading-relaxed">
              <strong className="text-zinc-200 font-medium">Core Principle:</strong> Repository language percentages describe code composition, not developer proficiency. Volume reflects framework templates, markup, and tooling requirements.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-zinc-800/90 text-zinc-300">
              Code Composition ≠ Skill Level
            </span>
          </div>
        </div>

        {/* Data Source Label */}
        <div className="pt-3 border-t border-zinc-850/80 flex flex-wrap items-center justify-between gap-y-2 text-[11px] font-mono text-zinc-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              <strong className="text-zinc-400">SOURCE:</strong> GitHub Repository Language API
            </span>
            <span>
              <strong className="text-zinc-400">REPOSITORY:</strong>{" "}
              <a
                href="https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
              >
                codesbysayam/Sayam-Mukherjee-Portfolio
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </span>
          </div>
          <div>
            <strong className="text-zinc-400">LAST SYNCED:</strong> {lastSyncedTime}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CodebaseLanguageDistribution;
