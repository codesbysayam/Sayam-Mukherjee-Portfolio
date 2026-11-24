import { memo, useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProjectItem } from "../../data/projects";
import { getProjectMedia } from "../../data/projectMedia";
import { GitHubRepo, formatRelativeTime } from "../../services/github";
import { ProjectMetricsSummary } from "./ProjectMetricsSummary";
import { calculateReadingTime } from "../../utils/readingTime";
import { computeProjectLifecycle } from "../../utils/projectLifecycle";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";
import { FocusFrame } from "../motion/FocusFrame";
import {
  Star, GitFork, ExternalLink, Github, ArrowRight,
  CheckCircle2, Calendar, Layers, Share2, Check, Clock, ArrowLeftRight
} from "lucide-react";

interface FeaturedProjectProps {
  project: ProjectItem;
  repo: GitHubRepo | null;
  onSelectCaseStudy: (project: ProjectItem) => void;
  onToggleCandidate?: () => void;
  candidateTitle?: string;
  onSelectTech?: (tech: string) => void;
  selectedTech?: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#ca8a04",
  Python: "#3572A5",
  "C++": "#be123c",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

function FeaturedProjectComponent({
  project,
  repo,
  onSelectCaseStudy,
  onToggleCandidate,
  candidateTitle,
  onSelectTech,
  selectedTech = "ALL"
}: FeaturedProjectProps) {
  const language = repo?.language || project.techStack[0];
  const langColor = LANGUAGE_COLORS[language] || "#69734A";
  const starsCount = repo ? repo.stargazers_count : 0;
  const forksCount = repo ? repo.forks_count : 0;
  const lastUpdated = repo
    ? formatRelativeTime(repo.pushed_at || repo.updated_at)
    : "recently";

  const readingStats = useMemo(() => calculateReadingTime(project), [project]);
  const media = useMemo(() => getProjectMedia(project.id), [project.id]);
  const lifecycle = useMemo(() => computeProjectLifecycle(project, repo), [project, repo]);
  const [shared, setShared] = useState(false);
  const [resolvedSrc, setResolvedSrc] = useState(media.src);
  const [imgError, setImgError] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    setResolvedSrc(media.src);
    setImgError(false);
  }, [media.src, project.id]);

  const handleImageError = () => {
    if (media.fallbackSrc && resolvedSrc !== media.fallbackSrc) {
      setResolvedSrc(media.fallbackSrc);
      return;
    }
    setImgError(true);
  };

  const handleShare = async () => {
    const shareUrl = project.liveUrl || project.githubUrl;
    const shareData = {
      title: project.title,
      text: `${project.title} - ${project.shortDescription}`,
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          try {
            await navigator.clipboard.writeText(shareUrl);
            setShared(true);
            setTimeout(() => setShared(false), 2000);
          } catch {}
        }
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {}
    }
  };

  return (
    <article className="featured-project rounded-[14px] bg-[#20231D] text-[#F4F4ED] border border-[#41443A] p-4 sm:p-8 lg:p-10">
      {/* Top Lead Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-7 border-b border-[#41443A]">
        <div className="flex items-center gap-2.5 flex-wrap text-xs font-mono text-[#B5B8AA]">
          <span className="px-2.5 py-1 rounded-[4px] bg-[#C7E34A] text-[#20231D] font-bold uppercase tracking-wider text-[11px]">
            Featured Exhibit
          </span>
          <span
            title={lifecycle.title}
            className={`px-2 py-0.5 rounded-[4px] font-bold uppercase tracking-wider text-[11px] ${lifecycle.badgeClass}`}
          >
            {lifecycle.label}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-[#F4F4ED]">{project.category}</span>
          <span aria-hidden="true">·</span>
          <span
            className="inline-flex items-center gap-1"
            title={`Estimated reading time (${readingStats.words} words)`}
          >
            <Clock className="w-3.5 h-3.5 text-[#C7E34A]" aria-hidden="true" />
            <span>{readingStats.formatted}</span>
          </span>
          {project.event && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[#C7E34A] font-semibold">{project.event}</span>
            </>
          )}
        </div>

        {onToggleCandidate && candidateTitle && (
          <button
            type="button"
            onClick={onToggleCandidate}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-[6px] border border-[#41443A] hover:border-[#C7E34A] active:scale-[0.97] active:bg-[#151713] text-xs font-mono text-[#F4F4ED] transition-all cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#C7E34A]" aria-hidden="true" />
            <span>Next Spotlight: {candidateTitle}</span>
          </button>
        )}
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* LEFT COLUMN (7 cols) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: MOTION_DURATION.normal, ease: MOTION_EASE.out }}
            className="lg:col-span-7 space-y-5"
          >
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F4F4ED] font-display tracking-tight leading-tight">
                {project.title}
              </h2>
              {project.subtitle && (
                <p className="text-xs sm:text-sm font-mono text-[#C7E34A] font-medium">
                  {project.subtitle}
                </p>
              )}
              <p className="text-sm text-[#EAEAE1]/85 leading-relaxed font-sans pt-1">
                {project.longDescription}
              </p>
            </div>

          <div className="p-4 rounded-[8px] bg-[#151713] border border-[#41443A] space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#C7E34A] font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              Problem &amp; Design Intent
            </span>
            <p className="text-xs sm:text-sm text-[#EAEAE1]/85 leading-relaxed font-sans">
              {project.problem || project.whyItExists}
            </p>
          </div>

          {project.metrics && (
            <ProjectMetricsSummary metrics={project.metrics} projectName={project.title} darkSurface />
          )}

          {/* Stack */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#B5B8AA] font-semibold block">
              Technologies Used
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, idx) => {
                const isActive = selectedTech !== "ALL" && selectedTech?.toLowerCase() === tech.toLowerCase();
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectTech && onSelectTech(isActive ? "ALL" : tech)}
                    title={onSelectTech ? `Filter projects by ${tech}` : tech}
                    className={`min-h-[40px] [@media(pointer:coarse)]:min-h-[44px] sm:min-h-[34px] text-xs px-2.5 py-1 rounded-[4px] font-mono transition-all cursor-pointer border active:scale-[0.96] ${
                      isActive
                        ? "bg-[#C7E34A] text-[#20231D] border-[#C7E34A] font-bold"
                        : "bg-[#151713] hover:border-[#C7E34A]/60 active:bg-[#20231D] text-[#EAEAE1] border-[#41443A]"
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Actions */}
          <div className="pt-2 flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => onSelectCaseStudy(project)}
              className="btn btn-primary active:scale-[0.98]"
            >
              <span>View Case Study</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn !bg-transparent !border-[#41443A] hover:!border-[#C7E34A] active:!bg-[#151713] active:scale-[0.98] !text-[#F4F4ED]"
              title="Open Repository on GitHub"
            >
              <Github className="w-3.5 h-3.5" aria-hidden="true" />
              <span>GitHub ↗</span>
            </a>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn !bg-transparent !border-[#41443A] hover:!border-[#C7E34A] active:!bg-[#151713] active:scale-[0.98] !text-[#F4F4ED]"
                title="Launch Live Deployment"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Live Demo ↗</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="btn !bg-transparent !border-[#41443A] hover:!border-[#C7E34A] active:!bg-[#151713] active:scale-[0.98] !text-[#F4F4ED]"
              title="Share Project"
              aria-label={`Share ${project.title}`}
            >
              {shared ? (
                <Check className="w-3.5 h-3.5 text-[#C7E34A]" aria-hidden="true" />
              ) : (
                <Share2 className="w-3.5 h-3.5 text-[#B5B8AA]" aria-hidden="true" />
              )}
              <span>{shared ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </motion.div>
        </AnimatePresence>

        {/* RIGHT COLUMN: Artwork Preview & Repository Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <FocusFrame
            darkSurface
            eyebrow="Featured Media Frame"
            title={project.title}
            summary={media.caption}
            expandedContent={
              project.architecture?.length ? (
                <ul className="space-y-1.5 text-xs font-mono text-[#D4D6CA]">
                  {project.architecture.slice(0, 3).map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#C7E34A] font-bold">0{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              ) : null
            }
          >
            <div className="overflow-hidden bg-[#151713]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={project.id}
                  initial={
                    reduced
                      ? false
                      : { clipPath: "inset(0 100% 0 0)", scale: 1.035, opacity: 0.7 }
                  }
                  animate={{
                    clipPath: "inset(0 0% 0 0)",
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={
                    reduced
                      ? undefined
                      : { clipPath: "inset(0 0 0 100%)", opacity: 0.6 }
                  }
                  transition={{
                    duration: MOTION_DURATION.enter,
                    ease: MOTION_EASE.emphasis,
                  }}
                >
                  {!imgError ? (
                    <img
                      src={resolvedSrc}
                      alt={media.alt}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className={`project-screenshot w-full aspect-[16/10] h-full ${
                        media.objectFit === "contain" ? "!object-contain bg-[#151713]" : "object-cover"
                      } ${media.objectPosition || "object-top"}`}
                    />
                  ) : (
                    <div className="w-full aspect-[16/10] flex items-center justify-center p-6 text-center bg-[#151713]">
                      <span className="font-mono text-xs text-[#B5B8AA]">{project.title}</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="px-4 py-2.5 border-t border-[#41443A] text-[11px] font-mono text-[#B5B8AA]">
                {media.caption}
              </div>
            </div>
          </FocusFrame>

          <div className="p-4 sm:p-5 rounded-[10px] bg-[#151713] border border-[#41443A] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="uppercase tracking-wider text-[#C7E34A] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                Implementation
              </span>
              <span className="text-[#B5B8AA]">{project.githubRepoName}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#EAEAE1]/85 leading-relaxed font-sans">
              {project.implementation || project.whatIBuilt}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-[10px] bg-[#151713] border border-[#41443A] space-y-3">
            <div className="flex items-center justify-between border-b border-[#41443A] pb-2.5 text-xs font-mono">
              <span className="uppercase tracking-wider text-[#B5B8AA] font-semibold">
                Repository Metrics
              </span>
              <span className="text-[#C7E34A] font-semibold">Verified Sync</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 tabular-nums">
              <div className="p-3 rounded-[6px] bg-[#20231D] border border-[#41443A]">
                <span className="text-[11px] font-mono text-[#B5B8AA] uppercase block">Primary Stack</span>
                <div className="flex items-center gap-1.5 pt-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 inline-block"
                    style={{ backgroundColor: langColor }}
                  />
                  <span className="text-xs font-mono font-bold text-[#F4F4ED] truncate">{language}</span>
                </div>
              </div>

              <div className="p-3 rounded-[6px] bg-[#20231D] border border-[#41443A]">
                <span className="text-[11px] font-mono text-[#B5B8AA] uppercase block">Last Push</span>
                <div className="flex items-center gap-1.5 pt-1 text-xs font-mono text-[#EAEAE1]">
                  <Calendar className="w-3 h-3 text-[#C7E34A] shrink-0" aria-hidden="true" />
                  <span className="truncate">{lastUpdated}</span>
                </div>
              </div>

              <div className="p-3 rounded-[6px] bg-[#20231D] border border-[#41443A]">
                <span className="text-[11px] font-mono text-[#B5B8AA] uppercase block">Stars</span>
                <div className="flex items-center gap-1.5 pt-1">
                  <Star className="w-3.5 h-3.5 text-[#C7E34A]" aria-hidden="true" />
                  <span className="text-xs font-mono font-bold text-[#F4F4ED]">{starsCount}</span>
                </div>
              </div>

              <div className="p-3 rounded-[6px] bg-[#20231D] border border-[#41443A]">
                <span className="text-[11px] font-mono text-[#B5B8AA] uppercase block">Forks</span>
                <div className="flex items-center gap-1.5 pt-1">
                  <GitFork className="w-3.5 h-3.5 text-[#C7E34A]" aria-hidden="true" />
                  <span className="text-xs font-mono font-bold text-[#F4F4ED]">{forksCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export const FeaturedProject = memo(FeaturedProjectComponent);
