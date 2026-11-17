import { useEffect, useRef, useMemo, useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProjectItem } from "../../data/projects";
import { getProjectMedia } from "../../data/projectMedia";
import { GitHubRepo, formatRelativeTime } from "../../services/github";
import { ProjectMetricsSummary } from "./ProjectMetricsSummary";
import ReadingProgressBar from "../common/ReadingProgressBar";
import { calculateReadingTime } from "../../utils/readingTime";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";
import {
  X, ExternalLink, Github, Star, GitFork,
  Calendar, CheckCircle2, Clock, ChevronLeft, ChevronRight
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
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    setImgError(false);
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  const readingStats = useMemo(
    () => (project ? calculateReadingTime(project) : { formatted: "", words: 0 }),
    [project]
  );

  const currentIndex = useMemo(() => {
    if (!project || !projects || projects.length === 0) return -1;
    return projects.findIndex((p) => p.id === project.id);
  }, [project, projects]);

  const canStep = Boolean(projects && projects.length > 1 && onSelectProject && currentIndex !== -1);

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
  const lastUpdated = repo
    ? formatRelativeTime(repo.pushed_at || repo.updated_at)
    : "recently";
  const media = getProjectMedia(project.id);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-8"
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

      {/* Modal Container with Geometric Mask Entrance */}
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
        className="w-full max-w-3xl rounded-[12px] overflow-hidden shadow-2xl relative z-10 max-h-[88vh] flex flex-col bg-[var(--surface-2)] border border-[var(--border-strong)]"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-2)] sticky top-0 z-20">
          <div className="flex items-center gap-2.5 flex-wrap text-xs font-mono text-[var(--text-muted)]">
            <span className="text-[var(--accent)] font-bold uppercase tracking-wider">
              {project.categoryLabel || project.category}
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
                  className="w-8 h-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:text-[var(--text)] text-[var(--text-muted)] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous project case study"
                  title="Previous case study"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono tabular-nums text-[var(--text-muted)] px-1">
                  {currentIndex + 1}/{projects?.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  className="w-8 h-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:text-[var(--text)] text-[var(--text-muted)] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next project case study"
                  title="Next case study"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-[6px] bg-[var(--surface)] hover:bg-[var(--text)] border border-[var(--border-strong)] flex items-center justify-center text-[var(--text)] hover:text-[var(--bg)] transition-colors cursor-pointer"
              title="Close modal (Esc)"
              aria-label="Close case study modal"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <ReadingProgressBar containerRef={bodyRef} height={3} className="shrink-0" />

        {/* Scrollable Body */}
        <div ref={bodyRef} className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1 text-[var(--text-secondary)]">
          {/* Media Preview Banner with Masked Image-to-Image Wipe */}
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
                {!imgError ? (
                  <img
                    src={media.src}
                    alt={media.alt}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full aspect-[16/9] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[16/9] flex items-center justify-center p-6">
                    <span className="font-mono text-xs text-[var(--text-muted)]">{project.title}</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="px-4 py-2 border-t border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between gap-2">
              <span>{media.caption}</span>
              {canStep && (
                <div className="flex sm:hidden items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStep(-1)}
                    className="px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text)]"
                    aria-label="Previous project"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStep(1)}
                    className="px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text)]"
                    aria-label="Next project"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5 border-b border-[var(--border)] pb-5">
            <h3 id="case-study-modal-title" className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-display">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-xs sm:text-sm text-[var(--accent)] font-mono font-semibold">
                {project.subtitle}
              </p>
            )}
            {project.role && (
              <p className="text-xs text-[var(--text-muted)] font-mono pt-1">
                Role: {project.role}
              </p>
            )}
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">
              Overview
            </h4>
            <p className="text-sm leading-relaxed font-sans text-[var(--text-secondary)]">
              {project.longDescription}
            </p>
          </div>

          {project.whyItExists && (
            <div className="space-y-2 p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text)] font-semibold">
                Problem &amp; Purpose
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed font-sans text-[var(--text-secondary)]">
                {project.whyItExists}
              </p>
            </div>
          )}

          {project.whatIBuilt && (
            <div className="space-y-2 p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">
                Engineering Implementation
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed font-sans text-[var(--text-secondary)]">
                {project.whatIBuilt}
              </p>
            </div>
          )}

          {project.metrics && (
            <ProjectMetricsSummary metrics={project.metrics} projectName={project.title} />
          )}

          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">
                Key Capabilities &amp; Highlights
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

          {project.architecture && project.architecture.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">
                System Architecture &amp; Pipeline
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

          {/* GitHub Telemetry */}
          <div className="space-y-2 p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-semibold">
              GitHub Repository Record
            </h4>
            <div className="flex items-center gap-4 text-xs font-mono text-[var(--text)] flex-wrap pt-1 tabular-nums">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: langColor }} />
                <span>{language}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                <span>{starsCount} stars</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                <span>{forksCount} forks</span>
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
              className="btn btn-secondary"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              <span>View on GitHub ↗</span>
            </a>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                <span>Open Live Project ↗</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export const ProjectCaseStudyModal = memo(ProjectCaseStudyModalComponent);
