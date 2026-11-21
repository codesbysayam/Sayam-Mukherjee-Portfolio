import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Palette,
  FileCode2,
  ShieldCheck,
  Database,
  Wrench,
  BookOpen,
  RefreshCw,
  AlertCircle,
  Info,
} from "lucide-react";
import { useGitHubTelemetry } from "../../hooks/useGitHubTelemetry";
import {
  formatPercentage,
  formatBytesCompact,
  formatBytesAsKB,
  LANGUAGE_PALETTE,
  type LanguageMetric,
} from "../../services/githubTelemetry";
import { StaggerGroup, StaggerItem } from "../../motion/Reveal";
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_VIEWPORT,
  usePrefersReducedMotion,
} from "../../motion/tokens";

interface LanguageRoleMeta {
  role: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LANGUAGE_ROLE_DETAILS: Record<string, LanguageRoleMeta> = {
  TypeScript: {
    role: "System architecture, Express API routes, typed state contracts, and React 19 application interfaces across web platforms.",
    category: "Primary Stack",
    icon: Layers,
  },
  Python: {
    role: "YOLOv8 computer vision inference, ByteTrack tracking, FastAPI backend endpoints, climate utilities, and data validators.",
    category: "Vision & Backend",
    icon: ShieldCheck,
  },
  CSS: {
    role: "Editorial design tokens, dual-theme contrast variables, responsive CSS Grid layouts, and clamp() typography scales.",
    category: "Visual Design",
    icon: Palette,
  },
  JavaScript: {
    role: "Repository telemetry sync scripts, build manifest generation, browser automation, and cross-environment Node utilities.",
    category: "Tooling & Node",
    icon: Code2,
  },
  HTML: {
    role: "Semantic document hierarchy, OpenGraph metadata, accessibility landmarks, and 16:9 Canvas host shells.",
    category: "DOM Structure",
    icon: FileCode2,
  },
  C: {
    role: "Procedural systems utilities, pointer-level telemetry parsing, and low-level metrics inspection.",
    category: "Systems",
    icon: Cpu,
  },
  "Jupyter Notebook": {
    role: "Exploratory repository telemetry analysis notebooks and structured engineering diagnostics.",
    category: "Analysis",
    icon: BookOpen,
  },
  PLpgSQL: {
    role: "Relational database schema definitions, geospatial persistence tables, and transactional Postgres queries.",
    category: "Database",
    icon: Database,
  },
  Makefile: {
    role: "Reproducible local runtime targets and dual-service orchestration commands.",
    category: "Build Tooling",
    icon: Wrench,
  },
  "C++": {
    role: "Algorithmic problem solving, STL container structures, and asymptotic runtime optimization in SayamSolves.",
    category: "Algorithms & DSA",
    icon: Cpu,
  },
  Shell: {
    role: "Workspace setup helpers and command-line automation workflows.",
    category: "Automation",
    icon: Wrench,
  },
};

function formatDateReadable(iso: string): string {
  if (!iso) return "Unavailable";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

interface LanguageCardProps {
  lang: LanguageMetric;
  username: string;
}

function LanguageRoleCard({ lang, username }: LanguageCardProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = LANGUAGE_ROLE_DETAILS[lang.name] || {
    role: `Verified ${lang.name} source files aggregated from owned public repositories.`,
    category: "Source Stack",
    icon: FileCode2,
  };
  const Icon = meta.icon;
  const fill = LANGUAGE_PALETTE[lang.name] || lang.color || "#69734A";

  const hasOverflowRepos = lang.repos.length > 4;
  const visibleRepos = expanded || !hasOverflowRepos ? lang.repos : lang.repos.slice(0, 4);

  return (
    <StaggerItem className="p-4 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-colors flex flex-col justify-between gap-3.5 min-w-0">
      <div className="space-y-2.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-[2px] shrink-0"
              style={{ backgroundColor: fill }}
              aria-hidden="true"
            />
            <Icon className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
            <h4 className="text-sm font-bold text-[var(--text)] font-display break-words">
              {lang.name}
            </h4>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0 text-right">
            {meta.category}
          </span>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
          {meta.role}
        </p>
      </div>

      <div className="pt-3 border-t border-[var(--border)] space-y-2.5 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono tabular-nums">
          <span className="text-[var(--text-muted)]">
            {lang.repoCount} {lang.repoCount === 1 ? "repository" : "repositories"}
          </span>
          <span className="text-[var(--accent)] font-semibold">
            {formatBytesCompact(lang.bytes)} · {formatPercentage(lang.percentage)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5" aria-label={`${lang.name} repositories`}>
          {visibleRepos.map((repoName) => (
            <a
              key={repoName}
              href={`https://github.com/${encodeURIComponent(username)}/${encodeURIComponent(repoName)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--surface-2)] text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors break-all"
            >
              <span>{repoName}</span>
            </a>
          ))}
          {hasOverflowRepos && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              className="px-2 py-0.5 rounded-[4px] border border-[var(--border-strong)] bg-[var(--surface-3)] text-[11px] font-mono font-semibold text-[var(--accent)] hover:opacity-90 cursor-pointer"
            >
              {expanded ? "Show fewer" : `+${lang.repos.length - 4} more`}
            </button>
          )}
        </div>
      </div>
    </StaggerItem>
  );
}

export function CodebaseLanguageDistribution() {
  const reduced = usePrefersReducedMotion();
  const { telemetry, loading, refreshing, error, refresh } = useGitHubTelemetry();

  if (loading) {
    return (
      <section id="language-distribution" className="space-y-5">
        <div className="space-y-2">
          <div className="h-3.5 w-48 rounded bg-[var(--surface-3)] animate-pulse" />
          <div className="h-7 w-72 rounded bg-[var(--surface-3)] animate-pulse" />
        </div>
        <div className="card p-6 space-y-5">
          <div className="h-4 w-full rounded bg-[var(--surface-3)] animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-36 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!telemetry || (error && telemetry.status === "error" && telemetry.languages.length === 0)) {
    return (
      <section id="language-distribution" className="space-y-5">
        <div className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--danger)] font-semibold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              <span>Language Composition Unavailable</span>
            </div>
            <h2 className="text-xl font-bold font-display text-[var(--text)]">
              Unable to Load Codebase Composition
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {error || telemetry?.errorMessage || "Canonical telemetry endpoint could not be reached."}
            </p>
          </div>
          <button type="button" onClick={() => void refresh()} className="btn btn-primary shrink-0">
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Retry Sync</span>
          </button>
        </div>
      </section>
    );
  }

  const languages = telemetry.languages;

  return (
    <section id="language-distribution" className="space-y-5">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-[var(--text-muted)]">
          <span className="font-semibold uppercase tracking-wider text-[var(--accent)]">
            Codebase Language Composition
          </span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span className="hidden sm:inline uppercase tracking-wider">
            Canonical Multi-Repo Bytes
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            LANGUAGES IN PRACTICE &amp; ENGINEERING ROLES
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
            {languages.length} Verified Languages · {formatBytesAsKB(telemetry.totalCodeBytes)} Owned Source
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl font-sans leading-relaxed">
          {telemetry.filteringPolicy.description} Read directly from the shared canonical GitHub telemetry model ({telemetry.ownedReposCount} owned repositories; {telemetry.forkedReposCount} fork excluded from owned source sums).
        </p>
      </div>

      {/* Partial notice if applicable */}
      {(telemetry.status === "partial" || telemetry.failedLanguageRepos.length > 0) && (
        <div className="p-3.5 rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface)] flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
          <Info className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            {telemetry.failedLanguageRepos.length > 0
              ? `Language stats unavailable for: ${telemetry.failedLanguageRepos.join(", ")}.`
              : telemetry.errorMessage || "Serving verified local snapshot with identical calculation policy."}
          </span>
        </div>
      )}

      {/* Main Card */}
      <div className="card p-5 sm:p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)] tabular-nums">
            <span className="font-semibold text-[var(--text)]">
              Proportional Owned-Code Composition
            </span>
            <span>
              {formatBytesCompact(telemetry.totalCodeBytes)} ({formatBytesAsKB(telemetry.totalCodeBytes)})
            </span>
          </div>

          <motion.div
            initial={reduced ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={MOTION_VIEWPORT}
            transition={{ duration: MOTION_DURATION.scene, ease: MOTION_EASE.out }}
            style={{ originX: 0 }}
            className="h-4 w-full rounded-[4px] bg-[var(--surface)] overflow-hidden flex border border-[var(--border-strong)]"
            role="img"
            aria-label={`Language composition bar led by ${languages[0]?.name || "TypeScript"} at ${languages[0] ? formatPercentage(languages[0].percentage) : "0%"}`}
          >
            {languages.map((item) => {
              const fill = LANGUAGE_PALETTE[item.name] || item.color || "#69734A";
              return (
                <div
                  key={item.name}
                  style={{
                    width: `${Math.max(item.percentage, 0.35)}%`,
                    backgroundColor: fill,
                  }}
                  className="h-full transition-all duration-300"
                  title={`${item.name}: ${formatPercentage(item.percentage)} (${formatBytesCompact(item.bytes)} across ${item.repoCount} repos)`}
                />
              );
            })}
          </motion.div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-mono tabular-nums">
            {languages.map((item) => {
              const fill = LANGUAGE_PALETTE[item.name] || item.color || "#69734A";
              return (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-[2px] inline-block shrink-0"
                    style={{ backgroundColor: fill }}
                    aria-hidden="true"
                  />
                  <span className="text-[var(--text)] font-semibold">{item.name}</span>
                  <span className="text-[var(--text-muted)]">
                    {formatPercentage(item.percentage)}
                  </span>
                  <span className="text-[var(--text-faint)] text-[11px]">
                    ({formatBytesCompact(item.bytes)})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language Roles Grid (strictly matched to verified detected languages) */}
        <div className="space-y-3 pt-4 border-t border-[var(--border)]">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)]">
            <h3 className="uppercase tracking-wider font-semibold text-[var(--text)]">
              Verified Language Breakdown by Repository Presence
            </h3>
            <span>{telemetry.ownedReposCount} Owned Repositories Inspected</span>
          </div>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {languages.map((lang) => (
              <LanguageRoleCard
                key={lang.name}
                lang={lang}
                username={telemetry.username}
              />
            ))}
          </StaggerGroup>
        </div>

        {/* Core Principle Banner */}
        <div className="p-4 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans text-[var(--text-secondary)]">
          <p className="leading-relaxed">
            <strong className="text-[var(--text)] font-semibold">Core Principle:</strong>{" "}
            Repository language percentages measure physical source-code composition, not individual proficiency. Full-stack web platforms naturally generate higher TypeScript byte counts than compact C++ algorithmic solutions or SQL schema definitions.
          </p>
          <span className="font-mono text-[11px] text-[var(--accent)] font-semibold shrink-0">
            Composition ≠ Capability
          </span>
        </div>

        {/* Footer Attribution */}
        <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              <strong className="text-[var(--text)]">SOURCE:</strong>{" "}
              {telemetry.source === "github-api"
                ? "Live GitHub Languages API"
                : "Verified Multi-Repo Snapshot"}
            </span>
            <span>
              <strong className="text-[var(--text)]">PROFILE:</strong>{" "}
              <a
                href={telemetry.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text)] hover:text-[var(--accent)] underline inline-flex items-center gap-1"
              >
                github.com/{telemetry.username}
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-[var(--text)]">LAST SYNCED:</strong>{" "}
              {formatDateReadable(telemetry.generatedAt)}
            </span>
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={refreshing}
              className="btn btn-secondary !min-h-[32px] !py-1 !px-2.5 !text-[11px] font-mono"
              aria-label="Refresh language composition telemetry"
            >
              <RefreshCw
                className={`w-3 h-3 ${refreshing && !reduced ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span>{refreshing ? "Syncing…" : "Sync"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CodebaseLanguageDistribution;
