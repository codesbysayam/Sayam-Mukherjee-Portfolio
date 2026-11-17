import { memo, useRef, useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ProjectItem } from "../../data/projects";
import { getProjectMedia } from "../../data/projectMedia";
import { GitHubRepo, formatRelativeTime } from "../../services/github";
import { calculateReadingTime } from "../../utils/readingTime";
import {
  Star, GitFork, ExternalLink, Github, ArrowRight,
  Clock, Share2, Check
} from "lucide-react";

interface ProjectCardProps {
  project: ProjectItem;
  repo: GitHubRepo | null;
  onSelectCaseStudy: (project: ProjectItem) => void;
  isFeaturedCandidate?: boolean;
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

function ProjectCardComponent({
  project,
  repo,
  onSelectCaseStudy,
  isFeaturedCandidate = false,
  onSelectTech,
  selectedTech = "ALL"
}: ProjectCardProps) {
  const language = repo?.language || project.techStack[0];
  const langColor = LANGUAGE_COLORS[language] || "#69734A";
  const starsCount = repo ? repo.stargazers_count : 0;
  const forksCount = repo ? repo.forks_count : 0;
  const lastUpdated = repo
    ? formatRelativeTime(repo.pushed_at || repo.updated_at)
    : "recently";

  const readingStats = useMemo(() => calculateReadingTime(project), [project]);
  const media = useMemo(() => getProjectMedia(project.id), [project.id]);

  const cardRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);
  const [shared, setShared] = useState(false);
  const [imgError, setImgError] = useState(false);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQueryHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mediaQueryMotion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    setCanHover(mediaQueryHover.matches && mediaQueryMotion.matches);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="h-full [perspective:1000px]"
    >
      <motion.article
        style={canHover ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        whileHover={canHover ? { y: -2 } : undefined}
        transition={{ duration: 0.18 }}
        className="card overflow-hidden flex flex-col justify-between group h-full relative focus-within:border-[var(--accent)]"
      >
        {/* Clean Editorial Media Header */}
        <div className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--surface)]">
          {!imgError ? (
            <img
              src={media.src}
              alt={media.alt}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full aspect-[16/9] object-cover group-hover:scale-[1.025] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
          ) : (
            <div className="w-full aspect-[16/9] flex items-center justify-center p-4 bg-[var(--surface)]">
              <span className="font-mono text-xs text-[var(--text-muted)]">{project.title}</span>
            </div>
          )}
          {isFeaturedCandidate && (
            <span className="absolute top-3 left-3 px-2 py-0.5 rounded-[4px] bg-[#C7E34A] text-[#20231D] text-[10px] font-mono font-bold uppercase tracking-wider">
              Lead System
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
          {/* Unboxed Metadata Line */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)] flex-wrap">
              <span className="font-semibold text-[var(--accent)] uppercase tracking-wider">
                {project.categoryLabel || project.category}
              </span>
              <div className="flex items-center gap-2">
                <span>{project.status}</span>
                <span aria-hidden="true">·</span>
                <span
                  className="inline-flex items-center gap-1"
                  title={`Estimated reading time (${readingStats.words} words)`}
                >
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  <span>{readingStats.formatted}</span>
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text)] font-display group-hover:text-[var(--accent)] transition-colors">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="text-xs font-mono text-[var(--text-muted)] font-medium">
                  {project.subtitle}
                </p>
              )}
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
              {project.shortDescription}
            </p>

            {project.whyItExists && (
              <div className="p-3.5 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                  Why it exists
                </span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                  {project.whyItExists}
                </p>
              </div>
            )}
          </div>

          {/* Lower Telemetry & Actions */}
          <div className="pt-4 border-t border-[var(--border)] space-y-3.5">
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 5).map((tech, idx) => {
                const isActive = selectedTech !== "ALL" && selectedTech?.toLowerCase() === tech.toLowerCase();
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectTech) onSelectTech(isActive ? "ALL" : tech);
                    }}
                    title={onSelectTech ? `Filter projects by ${tech}` : tech}
                    className={`text-xs font-mono px-2 py-0.5 rounded-[4px] transition-colors cursor-pointer border ${
                      isActive
                        ? "bg-[#20231D] dark:bg-[#C7E34A] text-[#F4F4ED] dark:text-[#20231D] border-[#20231D] dark:border-[#C7E34A] font-semibold"
                        : "bg-[var(--surface)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] border-[var(--border)]"
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
              {project.techStack.length > 5 && (
                <span className="text-xs font-mono px-1.5 py-0.5 text-[var(--text-muted)] tabular-nums">
                  +{project.techStack.length - 5}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] tabular-nums">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: langColor }}
                />
                <span className="text-[var(--text)] font-medium">{language}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-[var(--accent)]" aria-hidden="true" />
                  <span className="text-[var(--text)] font-semibold">{starsCount}</span>
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3 h-3" aria-hidden="true" />
                  <span className="text-[var(--text)] font-semibold">{forksCount}</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  <span>{lastUpdated}</span>
                </span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary !min-h-[38px] !py-1.5 !px-3 !text-xs"
                  title="Open GitHub Repository"
                >
                  <Github className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>GitHub ↗</span>
                </a>

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary !min-h-[38px] !py-1.5 !px-3 !text-xs"
                    title="Launch Live Deployment"
                  >
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Demo ↗</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleShare}
                  className="btn btn-ghost !min-h-[38px] !py-1.5 !px-2.5 !text-xs"
                  title="Share Project"
                  aria-label={`Share ${project.title}`}
                >
                  {shared ? (
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>{shared ? "Copied!" : "Share"}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => onSelectCaseStudy(project)}
                className="btn btn-primary !min-h-[38px] !py-1.5 !px-3.5 !text-xs group/cs"
              >
                <span>Case Study</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/cs:translate-x-1" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export const ProjectCard = memo(ProjectCardComponent);
