import React, { useState, useEffect, useMemo } from "react";
import { Code2, GitBranch, ExternalLink, Terminal, Cpu, FileSpreadsheet, Layers, Palette, FileCode2, ShieldCheck } from "lucide-react";
import { fetchGitHubLanguages, LanguageStat } from "../../services/github";
import { usePortfolio } from "../../context/PortfolioContext";

const LANGUAGE_COLORS: Record<string, { bar: string; dot: string; text: string; border: string }> = {
  TypeScript: { bar: "bg-sky-400", dot: "bg-sky-400", text: "text-sky-400", border: "border-sky-500/20" },
  JavaScript: { bar: "bg-amber-400", dot: "bg-amber-400", text: "text-amber-400", border: "border-amber-500/20" },
  CSS: { bar: "bg-indigo-400", dot: "bg-indigo-400", text: "text-indigo-400", border: "border-indigo-500/20" },
  HTML: { bar: "bg-rose-400", dot: "bg-rose-400", text: "text-rose-400", border: "border-rose-500/20" },
  Python: { bar: "bg-emerald-400", dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-500/20" },
  "C++": { bar: "bg-blue-400", dot: "bg-blue-400", text: "text-blue-400", border: "border-blue-500/20" },
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
    role: "System architecture, full-stack microservices, and React application state",
    category: "Primary Stack",
    sourcePath: "operon, mausam, routeledger, portfolio",
    icon: Layers
  },
  {
    language: "Python",
    role: "Edge computer vision, recurrent hidden-state simulation, and data pipelines",
    category: "AI & Systems",
    sourcePath: "yolo, memory-in-motion, tools/*",
    icon: ShieldCheck
  },
  {
    language: "C++",
    role: "Algorithmic problem-solving, optimal data structures, and asymptotic efficiency",
    category: "Algorithms & Systems",
    sourcePath: "sayam-solves (LeetCode)",
    icon: Cpu
  },
  {
    language: "JavaScript",
    role: "Build automation, serverless scripts, and lightweight tooling utilities",
    category: "Tooling & Node",
    sourcePath: "scripts/*, config/*",
    icon: Terminal
  },
  {
    language: "CSS",
    role: "Design token architecture, typography clamp scales, and fluid layout containers",
    category: "Visual Design",
    sourcePath: "src/index.css",
    icon: Palette
  },
  {
    language: "HTML",
    role: "Semantic entry points, document hierarchy, and viewport metadata",
    category: "DOM Structure",
    sourcePath: "index.html",
    icon: FileCode2
  }
];

export function CodebaseLanguageDistribution() {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const [languageStats, setLanguageStats] = useState<LanguageStat[]>([
    { language: "TypeScript", bytes: 6955191, percentage: 94.1, color: "#3178c6" },
    { language: "Python", bytes: 181108, percentage: 2.4, color: "#3572A5" },
    { language: "CSS", bytes: 106236, percentage: 1.4, color: "#563d7c" },
    { language: "JavaScript", bytes: 55813, percentage: 0.8, color: "#f1e05a" },
    { language: "HTML", bytes: 32368, percentage: 0.4, color: "#e34c26" },
    { language: "C++", bytes: 2037, percentage: 0.1, color: "#f43f5e" }
  ]);
  const [totalBytes, setTotalBytes] = useState<number>(7392863);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("Verified GitHub API Baseline");
  const [sourceType, setSourceType] = useState<string>("Aggregated GitHub Repositories");

  useEffect(() => {
    let isCancelled = false;

    async function loadLanguages() {
      try {
        const data = await fetchGitHubLanguages();
        if (!isCancelled && data && data.languages && data.languages.length > 0) {
          setLanguageStats(data.languages);
          setTotalBytes(data.totalBytes);
          setLastSyncedTime(data.lastSynced || "Live GitHub API");
          setSourceType(data.source === "github-api" ? "Live GitHub Multi-Repo API" : "Verified Multi-Repo Baseline");
        }
      } catch (err) {
        console.warn("Language distribution fallback active:", err);
      }
    }

    loadLanguages();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section id="language-distribution" className="space-y-5">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-cyan-600 dark:text-cyan-400">
            01 — GITHUB REPOSITORY LANGUAGE DISTRIBUTION
          </span>
          <span className="h-px w-8 bg-zinc-300 dark:bg-zinc-800" />
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
            Aggregated Multi-Repo Byte Distribution
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
            Repository Byte Distribution
          </h2>
          <span className="text-[11px] font-mono text-zinc-500">
            {sourceType}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans leading-relaxed">
          Aggregated bytes calculated directly from Sayam&apos;s verified public repositories on GitHub (<span className="font-mono text-zinc-700 dark:text-zinc-300">mausam</span>, <span className="font-mono text-zinc-700 dark:text-zinc-300">operon</span>, <span className="font-mono text-zinc-700 dark:text-zinc-300">routeledger</span>, <span className="font-mono text-zinc-700 dark:text-zinc-300">memory-in-motion</span>, <span className="font-mono text-zinc-700 dark:text-zinc-300">sayam-solves</span>, and portfolio).
        </p>
      </div>

      {/* Main Container */}
      <div className={`p-5 sm:p-6 rounded-2xl border transition-colors space-y-6 ${
        isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-950/40 border-zinc-850"
      }`}>
        {/* Dynamic Proportional Distribution Bar */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Multi-Repository Composition</span>
            <span className="text-[11px]">
              {(totalBytes / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} KB Total Verified Source
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-900 overflow-hidden flex p-0.5 border border-zinc-300 dark:border-zinc-800/80">
            {languageStats.map((item) => {
              const color = LANGUAGE_COLORS[item.language] || { bar: "bg-zinc-500" };
              return (
                <div
                  key={item.language}
                  style={{ width: `${Math.max(item.percentage, 0.8)}%` }}
                  className={`${color.bar} h-full first:rounded-l-full last:rounded-r-full transition-all duration-300`}
                  title={`${item.language}: ${item.percentage}% (${(item.bytes / 1024).toFixed(1)} KB)`}
                />
              );
            })}
          </div>

          {/* Dynamic Compact Language Tags */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs font-mono">
            {languageStats.map((item) => {
              const color = LANGUAGE_COLORS[item.language] || { dot: "bg-zinc-400", text: "text-zinc-600 dark:text-zinc-300" };
              return (
                <div key={item.language} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">{item.language}</span>
                  <span className="text-[11px] text-zinc-500 font-normal">{item.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language Roles Grid */}
        <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-850/80">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Languages in Practice &amp; Engineering Roles
            </h3>
            <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
              Verified Repositories · Authentic Artifacts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {LANGUAGE_ROLES.map((roleItem) => {
              const Icon = roleItem.icon;
              const detected = languageStats.find((l) => l.language.toLowerCase() === roleItem.language.toLowerCase());

              return (
                <div
                  key={roleItem.language}
                  className={`p-3.5 rounded-xl border transition-colors flex flex-col justify-between space-y-2.5 ${
                    isLight 
                      ? "bg-slate-50/80 border-slate-200/90 hover:border-slate-300" 
                      : "bg-zinc-900/40 border-zinc-850 hover:border-zinc-800"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                          {roleItem.language}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400">
                        {roleItem.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                      {roleItem.role}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/40 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span className="truncate max-w-[170px]" title={roleItem.sourcePath}>
                      {roleItem.sourcePath}
                    </span>
                    {detected ? (
                      <span className="text-cyan-600 dark:text-cyan-400 shrink-0 font-medium">
                        {detected.percentage}% share
                      </span>
                    ) : (
                      <span className="text-zinc-500 shrink-0">
                        Core algorithm
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Principle Banner: Distinction between Codebase Composition and Skills */}
        <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans ${
          isLight 
            ? "bg-slate-50 border-slate-200 text-slate-700" 
            : "bg-zinc-900/30 border-zinc-800/60 text-zinc-400"
        }`}>
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5 sm:mt-0" />
            <p className="text-[12px] leading-relaxed">
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">Core Principle:</strong> Repository language percentages describe physical code composition, not human capability. High TypeScript volume stems from full-stack system architecture, while high-signal algorithmic C++ solutions are compact by design.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300">
              Composition ≠ Capability
            </span>
          </div>
        </div>

        {/* Data Source Label */}
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-850/80 flex flex-wrap items-center justify-between gap-y-2 text-[11px] font-mono text-zinc-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              <strong className="text-zinc-700 dark:text-zinc-400">SOURCE:</strong> GitHub Languages API across 6 verified repos
            </span>
            <span>
              <strong className="text-zinc-700 dark:text-zinc-400">PROFILE:</strong>{" "}
              <a
                href="https://github.com/codesbysayam"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-700 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
              >
                github.com/codesbysayam
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </span>
          </div>
          <div>
            <strong className="text-zinc-700 dark:text-zinc-400">LAST SYNCED:</strong> {lastSyncedTime}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CodebaseLanguageDistribution;
