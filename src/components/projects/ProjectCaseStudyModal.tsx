import { useEffect, useRef, useMemo, useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProjectItem } from "../../data/projects";
import { getProjectMedia } from "../../data/projectMedia";
import { GitHubRepo, formatRelativeTime } from "../../services/github";
import { ProjectMetricsSummary } from "./ProjectMetricsSummary";
import ReadingProgressBar from "../common/ReadingProgressBar";
import { calculateReadingTime } from "../../utils/readingTime";
import { computeProjectLifecycle } from "../../utils/projectLifecycle";
import { ContourBackground } from "../motion/ContourBackground";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";
import {
  X,
  ExternalLink,
  Github,
  Star,
  GitFork,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  ShieldCheck,
  AlertCircle,
  Compass,
  Maximize2,
} from "lucide-react";

interface ProjectCaseStudyModalProps {
  project: ProjectItem | null;
  repo: GitHubRepo | null;
  onClose: () => void;
  projects?: ProjectItem[];
  onSelectProject?: (project: ProjectItem) => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#ca8a04",
  Python: "#3572A5",
  "C++": "#be123c",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

function ProjectCaseStudyModalComponent({
  project,
  repo,
  onClose,
  projects,
  onSelectProject,
}: ProjectCaseStudyModalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    setImgError(false);
    setIsLightboxOpen(false);
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
  }, [project?.id]);

  // Manage dynamic document title & meta description while open, restoring cleanly on close
  useEffect(() => {
    if (!project) return;
    const prevTitle = document.title;
    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevMetaDesc = metaDesc?.getAttribute("content") ?? null;

    document.title = `${project.title} · Case Study — Sayam Mukherjee`;
    if (metaDesc) {
      metaDesc.setAttribute("content", `${project.subtitle}: ${project.shortDescription}`);
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevMetaDesc !== null) {
        metaDesc.setAttribute("content", prevMetaDesc);
      }
    };
  }, [project]);

  const readingStats = useMemo(
    () => (project ? calculateReadingTime(project) : { formatted: "", words: 0 }),
    [project]
  );

  const currentIndex = useMemo(() => {
    if (!project || !projects || projects.length === 0) return -1;
    return projects.findIndex((p) => p.id === project.id);
  }, [project, projects]);

  const canStep = Boolean(projects && projects.length > 1 && onSelectProject && currentIndex !== -1);

  useEffect(() => {
    if (!project) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose();
        }
      } else if (!isLightboxOpen && e.key === "ArrowLeft" && canStep && projects && onSelectProject) {
        const nextIdx = (currentIndex - 1 + projects.length) % projects.length;
        onSelectProject(projects[nextIdx]);
      } else if (!isLightboxOpen && e.key === "ArrowRight" && canStep && projects && onSelectProject) {
        const nextIdx = (currentIndex + 1) % projects.length;
        onSelectProject(projects[nextIdx]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose, canStep, projects, onSelectProject, currentIndex, isLightboxOpen]);

  const handleStep = (direction: -1 | 1) => {
    if (!canStep || !projects || !onSelectProject) return;
    const nextIdx = (currentIndex + direction + projects.length) % projects.length;
    onSelectProject(projects[nextIdx]);
  };

  if (!project) return null;

  const language = repo?.language || project.techStack[0];
  const langColor = LANGUAGE_COLORS[language] || "#69734A";
  const starsCount = repo ? repo.stargazers_count : 0;
  const forksCount = repo ? repo.forks_count : 0;
  const branchName = repo?.default_branch || project.defaultBranch || "main";
  const isForkRepo = repo?.fork ?? project.isFork ?? false;
  const lastUpdated = repo
    ? formatRelativeTime(repo.pushed_at || repo.updated_at)
    : "recently";
  const media = getProjectMedia(project.id);
  const lifecycle = computeProjectLifecycle(project, repo);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-[max(0.75rem,env(safe-area-inset-top,0.75rem))] sm:p-6 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-modal-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : MOTION_DURATION.normal }}
        onClick={onClose}
        className="fixed inset-0 bg-[#151713]/80 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Container */}
      <motion.div
        initial={
          reduced
            ? { opacity: 0 }
            : {
                opacity: 0,
                scale: 0.96,
                y: 16,
                clipPath: "inset(4% 2% 4% 2% round 12px)",
              }
        }
        animate={
          reduced
            ? { opacity: 1 }
            : {
                opacity: 1,
                scale: 1,
                y: 0,
                clipPath: "inset(0% 0% 0% 0% round 12px)",
              }
        }
        exit={
          reduced
            ? { opacity: 0 }
            : {
                opacity: 0,
                scale: 0.97,
                y: 12,
                clipPath: "inset(3% 2% 3% 2% round 12px)",
              }
        }
        transition={{
          duration: reduced ? 0 : 0.38,
          ease: MOTION_EASE.emphasis,
        }}
        className="w-full max-w-3xl rounded-[12px] overflow-hidden shadow-2xl relative z-10 max-h-[92dvh] flex flex-col bg-[var(--surface-2)] border border-[var(--border-strong)]"
      >
        {/* Sticky Header */}
        <div className="relative overflow-hidden flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-2)] sticky top-0 z-20">
          <ContourBackground density="subtle" className="opacity-35" />
          <div className="relative z-10 flex items-center gap-2.5 flex-wrap text-xs font-mono text-[var(--text-muted)]">
            <span className="text-[var(--accent)] font-bold uppercase tracking-wider">
              {project.categoryLabel || project.category}
            </span>
            <span
              title={lifecycle.title}
              className={`px-2 py-0.5 rounded-[4px] font-bold uppercase tracking-wider text-[10px] ${lifecycle.badgeClass}`}
            >
              {lifecycle.label}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[var(--text)]">{project.status}</span>
            <span aria-hidden="true">·</span>
            <span
              className="inline-flex items-center gap-1"
              title={`Estimated reading time (${readingStats.words} words)`}
            >
              <Clock className="w-3 h-3 text-[var(--accent)]" aria-hidden="true" />
              <span>{readingStats.formatted}</span>
              <span className="hidden sm:inline">({readingStats.words} words)</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {canStep && (
              <div className="hidden sm:flex items-center gap-1 mr-1">
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  className="w-8 h-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:text-[var(--text)] active:scale-95 active:bg-[var(--surface-2)] text-[var(--text-muted)] flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Previous project case study"
                  title="Previous case study (Left Arrow)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono tabular-nums text-[var(--text-muted)] px-1">
                  {currentIndex + 1}/{projects?.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  className="w-8 h-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:text-[var(--text)] active:scale-95 active:bg-[var(--surface-2)] text-[var(--text-muted)] flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next project case study"
                  title="Next case study (Right Arrow)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-[6px] bg-[var(--surface)] hover:bg-[var(--text)] active:scale-95 active:bg-[var(--text)] active:text-[var(--bg)] border border-[var(--border-strong)] flex items-center justify-center text-[var(--text)] hover:text-[var(--bg)] transition-all cursor-pointer"
              title="Close modal (Esc)"
              aria-label="Close case study modal"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <ReadingProgressBar containerRef={bodyRef} height={3} className="shrink-0" />

        {/* Quick Section Jump Anchors */}
        <nav
          aria-label="Case study sections"
          className="hidden sm:flex items-center gap-1.5 px-6 py-2 border-b border-[var(--border)] bg-[var(--surface)] overflow-x-auto scrollbar-none shrink-0 text-[11px] font-mono text-[var(--text-muted)]"
        >
          {[
            { id: "cs-overview", label: "01 Overview" },
            { id: "cs-problem-solution", label: "02 Problem & Solution" },
            ...(project.architecture?.length ? [{ id: "cs-architecture", label: "04 Architecture" }] : []),
            { id: "cs-implementation", label: "05 Implementation" },
            { id: "cs-verification", label: "08 Verification" },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                const container = bodyRef.current;
                const el = document.getElementById(sec.id);
                if (container && el) {
                  container.scrollTo({
                    top: Math.max(0, el.offsetTop - 16),
                    behavior: reduced ? "auto" : "smooth",
                  });
                }
              }}
              className="px-2.5 py-1 rounded-[4px] border border-transparent hover:border-[var(--border-strong)] hover:text-[var(--text)] active:text-[var(--accent)] transition-colors cursor-pointer whitespace-nowrap"
            >
              {sec.label}
            </button>
          ))}
        </nav>

        {/* Scrollable Body */}
        <div ref={bodyRef} className="relative overflow-y-auto p-5 sm:p-8 space-y-6 flex-1 text-[var(--text-secondary)]">
          {/* Media Preview Banner */}
          <div className="rounded-[10px] overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={
                  reduced
                    ? false
                    : { clipPath: "inset(0 100% 0 0)", scale: 1.03, opacity: 0.75 }
                }
                animate={{
                  clipPath: "inset(0 0% 0 0)",
                  scale: 1,
                  opacity: 1,
                }}
                exit={
                  reduced
                    ? undefined
                    : { clipPath: "inset(0 0 0 100%)", opacity: 0.7 }
                }
                transition={{
                  duration: MOTION_DURATION.enter,
                  ease: MOTION_EASE.emphasis,
                }}
              >
                {!imgError && !media.isMissing && media.src ? (
                  <div className="relative group/preview aspect-[16/10] w-full overflow-hidden bg-[#151713]">
                    <img
                      src={media.src}
                      alt={media.alt}
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      onClick={() => setIsLightboxOpen(true)}
                      className="project-screenshot w-full aspect-[16/10] h-full object-cover object-top cursor-zoom-in transition-transform duration-300 group-hover/preview:scale-[1.015]"
                    />
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] bg-[#151713]/88 hover:bg-[#20231D] text-[#F4F4ED] border border-[#565A4E] text-[11px] font-mono backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
                      aria-label={`Expand preview image for ${project.title}`}
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#C7E34A]" aria-hidden="true" />
                      <span>Expand View</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full aspect-[16/10] flex flex-col items-center justify-center gap-1 p-6 bg-[#151713]">
                    <span className="font-mono text-xs font-semibold text-[#F4F4ED]">{project.title}</span>
                    <span className="font-mono text-[10px] text-[#8C8F82] uppercase tracking-wider">Preview Unavailable</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="px-4 py-2 border-t border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)] flex flex-wrap items-center justify-between gap-2">
              <span className="min-w-0">{media.caption}</span>
              {canStep && (
                <div className="flex sm:hidden items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStep(-1)}
                    className="min-h-[40px] min-w-[52px] px-3 py-1.5 rounded-[6px] border border-[var(--border-strong)] active:scale-95 active:bg-[var(--surface-2)] text-[var(--text)] font-semibold cursor-pointer"
                    aria-label="Previous project"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStep(1)}
                    className="min-h-[40px] min-w-[52px] px-3 py-1.5 rounded-[6px] border border-[var(--border-strong)] active:scale-95 active:bg-[var(--surface-2)] text-[var(--text)] font-semibold cursor-pointer"
                    aria-label="Next project"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title & Metadata Badges */}
          <div className="space-y-2 border-b border-[var(--border)] pb-5">
            <h3 id="case-study-modal-title" className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-display">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-xs sm:text-sm text-[var(--accent)] font-mono font-semibold">
                {project.subtitle}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs font-mono text-[var(--text-muted)]">
              {project.role && <span>Role: {project.role}</span>}
              {project.team && <span>· Team: {project.team}</span>}
              {project.event && <span>· Event: {project.event}</span>}
              <span className="inline-flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-[var(--accent)]" aria-hidden="true" />
                <span>Branch: {branchName}</span>
              </span>
              {isForkRepo && (
                <span className="px-2 py-0.5 rounded-[4px] border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] font-semibold">
                  Public Fork
                </span>
              )}
            </div>
          </div>

          {/* 1. Overview */}
          <div id="cs-overview" className="space-y-2 scroll-mt-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">
              01 · Overview
            </h4>
            <p className="text-sm leading-relaxed font-sans text-[var(--text-secondary)]">
              {project.longDescription}
            </p>
          </div>

          {/* 2 & 3. Problem & Solution Split */}
          <div id="cs-problem-solution" className="grid grid-cols-1 md:grid-cols-2 gap-4 scroll-mt-4">
            <div className="space-y-2 p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text)] font-semibold">
                02 · Problem &amp; Purpose
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed font-sans text-[var(--text-secondary)]">
                {project.problem || project.whyItExists}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">
                03 · Solution Overview
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed font-sans text-[var(--text-secondary)]">
                {project.solution || project.whatIBuilt}
              </p>
            </div>
          </div>

          {/* 4. System Architecture & Pipeline */}
          {project.architecture && project.architecture.length > 0 && (
            <div id="cs-architecture" className="space-y-2.5 scroll-mt-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">
                04 · System Architecture &amp; Pipeline
              </h4>
              <ul className="space-y-2 text-xs">
                {project.architecture.map((arch, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-[var(--surface)] p-3 rounded-[8px] border border-[var(--border)] font-mono">
                    <span className="text-[var(--accent)] font-bold tabular-nums">0{idx + 1}.</span>
                    <span className="leading-relaxed text-[var(--text-secondary)]">{arch}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 5. Engineering Implementation */}
          {(project.implementation || project.whatIBuilt) && (
            <div id="cs-implementation" className="space-y-2 p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] scroll-mt-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">
                05 · Engineering Implementation
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed font-sans text-[var(--text-secondary)]">
                {project.implementation || project.whatIBuilt}
              </p>
            </div>
          )}

          {project.metrics && (
            <ProjectMetricsSummary metrics={project.metrics} projectName={project.title} />
          )}

          {/* 6. Key Capabilities & Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">
                06 · Key Capabilities &amp; Highlights
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {project.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[var(--surface)] p-3 rounded-[8px] border border-[var(--border)] text-[var(--text-secondary)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 7. Engineering Decisions & Trade-offs */}
          {project.engineeringDecisions && project.engineeringDecisions.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                <span>07 · Engineering Decisions &amp; Trade-offs</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {project.engineeringDecisions.map((decision, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 bg-[var(--surface)] p-3.5 rounded-[8px] border border-[var(--border)] text-[var(--text-secondary)]"
                  >
                    <span className="font-mono text-xs font-bold text-[var(--accent)] shrink-0 mt-0.5">
                      →
                    </span>
                    <span className="leading-relaxed font-sans">{decision}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 8. Results, Status & Disclosures */}
          <div id="cs-verification" className="space-y-3 p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] scroll-mt-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>08 · Results, Status &amp; Verification Notes</span>
            </h4>
            {project.resultsAndStatus && (
              <p className="text-xs sm:text-sm leading-relaxed font-sans text-[var(--text-secondary)]">
                {project.resultsAndStatus}
              </p>
            )}
            {project.verificationNote && (
              <div className="flex items-start gap-2 p-3 rounded-[6px] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono text-[var(--text)]">
                <AlertCircle className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed">{project.verificationNote}</span>
              </div>
            )}
            {project.verifiedFacts && project.verifiedFacts.length > 0 && (
              <ul className="space-y-1.5 pt-1 text-xs font-mono text-[var(--text-muted)]">
                {project.verifiedFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[var(--accent)]">·</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Technology Stack */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-semibold">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-[4px] bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 9. Repository Record & Live Telemetry */}
          <div className="space-y-2 p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-semibold">
              09 · GitHub Repository Record
            </h4>
            <div className="flex items-center gap-4 text-xs font-mono text-[var(--text)] flex-wrap pt-1 tabular-nums">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: langColor }} />
                <span>{language}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                <span>{starsCount} {starsCount === 1 ? "star" : "stars"}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                <span>{forksCount} {forksCount === 1 ? "fork" : "forks"}</span>
              </div>
              <div className="flex items-center gap-1 text-[var(--text-muted)]">
                <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{branchName}</span>
              </div>
              <div className="flex items-center gap-1 text-[var(--text-muted)]">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Updated {lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[var(--border)] flex items-center gap-3 flex-wrap">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary active:scale-[0.98]"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              <span>View on GitHub ↗</span>
            </a>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary active:scale-[0.98]"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                <span>Open Live Project ↗</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isLightboxOpen && !media.isMissing && media.src && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[70] bg-[#151713]/94 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} full-resolution preview`}
          >
            <div className="w-full max-w-6xl flex items-center justify-between gap-4 pb-3 text-[#F4F4ED]">
              <p className="text-xs font-mono truncate text-[#B5B8AA]">{media.caption}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(false);
                }}
                className="w-10 h-10 rounded-[6px] bg-[#20231D] hover:bg-[#C7E34A] hover:text-[#20231D] border border-[#565A4E] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close full-resolution preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl max-h-[82dvh] rounded-[10px] overflow-hidden border border-[#565A4E] bg-[#151713] shadow-2xl flex items-center justify-center"
            >
              <img
                src={media.src}
                alt={media.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[82dvh] object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const ProjectCaseStudyModal = memo(ProjectCaseStudyModalComponent);
