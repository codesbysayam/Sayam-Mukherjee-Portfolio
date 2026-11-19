import { memo, useRef, useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ProjectItem } from "../../data/projects";
import { getProjectMedia } from "../../data/projectMedia";
import { GitHubRepo, formatRelativeTime } from "../../services/github";
import { calculateReadingTime } from "../../utils/readingTime";
import { computeProjectLifecycle } from "../../utils/projectLifecycle";
import { ProjectMedia } from "./ProjectMedia";
import {
  Star, GitFork, ExternalLink, Github, ArrowRight,
  Clock, Share2, Check, GitBranch
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
  const branchName = repo?.default_branch || project.defaultBranch || "main";
  const lastUpdated = repo
    ? formatRelativeTime(repo.pushed_at || repo.updated_at)
    : "recently";

  const readingStats = useMemo(() => calculateReadingTime(project), [project]);
  const media = useMemo(() => getProjectMedia(project.id), [project.id]);
  const lifecycle = useMemo(() => computeProjectLifecycle(project, repo), [project, repo]);

  const cardRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);
  const [shared, setShared] = useState(false);

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
        className="card card-interactive project-card h-full relative focus-within:border-[var(--accent)] active:border-[var(--accent)] group"
      >
        <ProjectMedia
          project={project}
          media={media}
          repo={repo}
          isFeaturedCandidate={isFeaturedCandidate}
          imgClassName="group-hover:scale-[1.025]"
        />

        <div className="project-content p-5 sm:p-6 flex-1 space-y-4">
          {/* Unboxed Metadata Line */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)] flex-wrap">
              <span className="font-semibold text-[var(--accent)] uppercase tracking-wider">
                {project.categoryLabel || project.category}
              </span>
              <div className="flex items-center gap-2">
                <span title={lifecycle.title}>{project.status}</span>
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
              <div className="border-l-2 border-[var(--accent)] pl-3.5 py-0.5 space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                  {project.team || project.event ? `${project.team ?? ""} ${project.event ? `· ${project.event}` : ""}`.trim() : "Why it exists"}
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
                    className={`text-xs font-mono px-2 py-0.5 rounded-[4px] transition-all cursor-pointer border active:scale-[0.96] ${
                      isActive
                        ? "bg-[#20231D] dark:bg-[#C7E34A] text-[#F4F4ED] dark:text-[#20231D] border-[#20231D] dark:border-[#C7E34A] font-semibold"
                        : "bg-[var(--surface)] hover:border-[var(--border-strong)] active:bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border)]"
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
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: langColor }}
                />
                <span className="text-[var(--text)] font-medium">{language}</span>
                {branchName !== "main" && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] text-[var(--text-muted)]">
                    <GitBranch className="w-3 h-3" aria-hidden="true" />
                    {branchName}
                  </span>
                )}
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
                  className="btn btn-secondary !min-h-[42px] sm:!min-h-[38px] !py-1.5 !px-3 !text-xs active:scale-[0.98]"
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
                    className="btn btn-secondary !min-h-[42px] sm:!min-h-[38px] !py-1.5 !px-3 !text-xs active:scale-[0.98]"
                    title="Launch Live Deployment"
                  >
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Demo ↗</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleShare}
                  className="btn btn-ghost !min-h-[42px] sm:!min-h-[38px] !py-1.5 !px-2.5 !text-xs active:scale-[0.98]"
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
                className="btn btn-primary !min-h-[42px] sm:!min-h-[38px] !py-1.5 !px-3.5 !text-xs group/cs active:scale-[0.98]"
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
