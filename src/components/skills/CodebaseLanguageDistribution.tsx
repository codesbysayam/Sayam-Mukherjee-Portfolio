import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ExternalLink, Terminal, Cpu, Layers, Palette, FileCode2, ShieldCheck } from "lucide-react";
import { fetchGitHubLanguages, LanguageStat } from "../../services/github";
import { StaggerGroup, StaggerItem } from "../../motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, MOTION_VIEWPORT, usePrefersReducedMotion } from "../../motion/tokens";

const LANGUAGE_SWATCH: Record<string, string> = {
  TypeScript: "#69734A",
  Python: "#3E4A35",
  CSS: "#8D947E",
  JavaScript: "#A9C52F",
  HTML: "#585B52",
  "C++": "#C7E34A",
  C: "#777A70",
  "Jupyter Notebook": "#B5B8AA"
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
    sourcePath: "operon, mausam_sample, sightforge, memory-in-motion, axiom, inkloom, campus-connect, portfolio",
    icon: Layers
  },
  {
    language: "Python",
    role: "YOLOv8 computer vision inference, FastAPI backend, and climate utilities",
    category: "AI & Systems",
    sourcePath: "SightForge, mausam_sample, Memory-in-Motion, tools/*",
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
  const reduced = usePrefersReducedMotion();
  const [languageStats, setLanguageStats] = useState<LanguageStat[]>([
    { language: "TypeScript", bytes: 10676896, percentage: 93.6, color: "#69734A" },
    { language: "Python", bytes: 286374, percentage: 2.5, color: "#3E4A35" },
    { language: "CSS", bytes: 236453, percentage: 2.1, color: "#8D947E" },
    { language: "JavaScript", bytes: 99492, percentage: 0.9, color: "#A9C52F" },
    { language: "HTML", bytes: 44171, percentage: 0.4, color: "#585B52" },
    { language: "C", bytes: 37466, percentage: 0.3, color: "#777A70" },
    { language: "C++", bytes: 2037, percentage: 0.02, color: "#C7E34A" }
  ]);
  const [totalBytes, setTotalBytes] = useState<number>(11409944);
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
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-muted)]">
          <span className="font-semibold uppercase tracking-wider text-[var(--accent)]">
            Repository Language Distribution
          </span>
          <span className="hidden sm:inline" aria-hidden="true">/</span>
          <span className="hidden sm:inline uppercase tracking-wider">Aggregated Multi-Repo Bytes</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            Repository Byte Distribution
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)]">{sourceType}</span>
        </div>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans leading-relaxed">
          Aggregated bytes calculated directly across 11 public repositories on GitHub (<span className="font-mono text-[var(--text)]">Operon</span>, <span className="font-mono text-[var(--text)]">mausam_sample</span>, <span className="font-mono text-[var(--text)]">SightForge</span>, <span className="font-mono text-[var(--text)]">Memory-in-Motion</span>, <span className="font-mono text-[var(--text)]">AXIOM</span>, <span className="font-mono text-[var(--text)]">inkloom</span>, <span className="font-mono text-[var(--text)]">CAMPUSCONNECT_1273</span>, <span className="font-mono text-[var(--text)]">sayam-solves</span>, and portfolio).
        </p>
      </div>

      {/* Main Card */}
      <div className="card p-5 sm:p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)] tabular-nums">
            <span className="font-semibold text-[var(--text)]">Multi-Repository Composition</span>
            <span>{(totalBytes / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} KB Verified Source</span>
          </div>

          <motion.div
            initial={reduced ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={MOTION_VIEWPORT}
            transition={{ duration: MOTION_DURATION.scene, ease: MOTION_EASE.out }}
            style={{ originX: 0 }}
            className="h-3.5 w-full rounded-[4px] bg-[var(--surface)] overflow-hidden flex border border-[var(--border-strong)]"
          >
            {languageStats.map((item) => {
              const fill = LANGUAGE_SWATCH[item.language] || "#69734A";
              return (
                <div
                  key={item.language}
                  style={{ width: `${Math.max(item.percentage, 0.8)}%`, backgroundColor: fill }}
                  className="h-full transition-all duration-300"
                  title={`${item.language}: ${item.percentage}% (${(item.bytes / 1024).toFixed(1)} KB)`}
                />
              );
            })}
          </motion.div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-mono tabular-nums">
            {languageStats.map((item) => {
              const fill = LANGUAGE_SWATCH[item.language] || "#69734A";
              return (
                <div key={item.language} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] inline-block" style={{ backgroundColor: fill }} />
                  <span className="text-[var(--text)] font-semibold">{item.language}</span>
                  <span className="text-[var(--text-muted)]">{item.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language Roles Grid */}
        <div className="space-y-3 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <h3 className="uppercase tracking-wider font-semibold">
              Languages in Practice &amp; Engineering Roles
            </h3>
            <span className="hidden sm:inline">Verified Repositories</span>
          </div>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {LANGUAGE_ROLES.map((roleItem) => {
              const Icon = roleItem.icon;
              const detected = languageStats.find((l) => l.language.toLowerCase() === roleItem.language.toLowerCase());

              return (
                <StaggerItem
                  key={roleItem.language}
                  className="p-4 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-colors flex flex-col justify-between space-y-2.5"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                        <span className="text-sm font-bold text-[var(--text)]">{roleItem.language}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">{roleItem.category}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                      {roleItem.role}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2 text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
                    <span className="truncate min-w-0" title={roleItem.sourcePath}>
                      {roleItem.sourcePath}
                    </span>
                    {detected ? (
                      <span className="text-[var(--accent)] shrink-0 font-semibold">{detected.percentage}% share</span>
                    ) : (
                      <span className="shrink-0">Core algorithm</span>
                    )}
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>

        {/* Principle Banner */}
        <div className="p-4 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans text-[var(--text-secondary)]">
          <p className="leading-relaxed">
            <strong className="text-[var(--text)] font-semibold">Core Principle:</strong> Repository language percentages describe physical code composition, not human capability. High TypeScript volume stems from full-stack system architecture, while algorithmic C++ solutions are compact by design.
          </p>
          <span className="font-mono text-[11px] text-[var(--accent)] font-semibold shrink-0">
            Composition ≠ Capability
          </span>
        </div>

        {/* Footer Attribution */}
        <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-y-2 text-[11px] font-mono text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              <strong className="text-[var(--text)]">SOURCE:</strong> GitHub Languages API across verified repos
            </span>
            <span>
              <strong className="text-[var(--text)]">PROFILE:</strong>{" "}
              <a
                href="https://github.com/codesbysayam"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text)] hover:text-[var(--accent)] active:opacity-75 underline inline-flex items-center gap-1"
              >
                github.com/codesbysayam
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </span>
          </div>
          <div>
            <strong className="text-[var(--text)]">LAST SYNCED:</strong> {lastSyncedTime}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CodebaseLanguageDistribution;
