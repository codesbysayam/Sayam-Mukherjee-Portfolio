import { memo, useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ProjectItem } from "../../data/projects";
import { GitHubRepo, formatRelativeTime } from "../../services/github";
import { 
  Star, GitFork, ExternalLink, Github, ArrowRight, 
  CheckCircle2, Clock, Code 
} from "lucide-react";

interface ProjectCardProps {
  project: ProjectItem;
  repo: GitHubRepo | null;
  onSelectCaseStudy: (project: ProjectItem) => void;
  isFeaturedCandidate?: boolean;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

function ProjectCardComponent({
  project,
  repo,
  onSelectCaseStudy,
  isFeaturedCandidate = false
}: ProjectCardProps) {
  const language = repo?.language || project.techStack[0];
  const langColor = LANGUAGE_COLORS[language] || "#38bdf8";
  const starsCount = repo ? repo.stargazers_count : 0;
  const forksCount = repo ? repo.forks_count : 0;
  const lastUpdated = repo 
    ? formatRelativeTime(repo.pushed_at || repo.updated_at)
    : "recently";

  // Card reference and interaction capability detection
  const cardRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQueryHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mediaQueryMotion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    setCanHover(mediaQueryHover.matches && mediaQueryMotion.matches);
  }, []);

  // Motion values for smooth 3D tilt on hover
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth physics-based spring damping so the tilt glides organically
  const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // Subtle tilt: max +/- 4.5 degrees on X and Y axes
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [4.5, -4.5]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-4.5, 4.5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalized offset from center: -0.5 to 0.5
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    // Gracefully springs back to neutral level
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
        whileHover={canHover ? { scale: 1.012, y: -2 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="card p-5 sm:p-6 flex flex-col justify-between group transition-shadow duration-300 h-full relative"
      >
        {/* Top Meta Bar: Category & Status */}
        <div className="space-y-3.5 flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 px-2.5 py-0.5 rounded-md">
              {project.categoryLabel || project.category}
            </span>

            <div className="flex items-center gap-1.5">
              {isFeaturedCandidate && (
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                  Lead System
                </span>
              )}
              <span className={`text-xs font-mono px-2 py-0.5 rounded-md border font-medium ${
                project.statusType === "live"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400"
                  : project.statusType === "hackathon"
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/40 text-amber-700 dark:text-amber-300"
                  : project.statusType === "active"
                  ? "bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800/40 text-purple-700 dark:text-purple-300"
                  : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              }`}>
                {project.status}
              </span>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-display group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-medium">
                {project.subtitle}
              </p>
            )}
          </div>

          {/* What it actually is (1-2 clear sentences) */}
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
            {project.shortDescription}
          </p>

          {/* Why it was built */}
          {project.whyItExists && (
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04] space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold block">
                Why it exists:
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                {project.whyItExists}
              </p>
            </div>
          )}
        </div>

        {/* Card Lower Section: Tech Stack, Live Telemetry & Actions */}
        <div className="pt-4 mt-4 border-t border-zinc-200/80 dark:border-white/[0.06] space-y-3.5">
          {/* Actual tech stack tags (clean pills, max 4-6) */}
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 5).map((tech, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/[0.06]"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 5 && (
              <span className="text-xs font-mono px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 border border-zinc-200 dark:border-white/[0.06]">
                +{project.techStack.length - 5}
              </span>
            )}
          </div>

          {/* GitHub Telemetry Row */}
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span 
                className="w-2 h-2 rounded-full inline-block shrink-0" 
                style={{ backgroundColor: langColor }} 
              />
              <span className="text-zinc-800 dark:text-zinc-200 font-medium">{language}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{starsCount}</span>
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-3 h-3 text-zinc-400" />
                <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{forksCount}</span>
              </span>
              <span className="flex items-center gap-1 text-zinc-500 hidden sm:inline-flex">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span>{lastUpdated}</span>
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="pt-2 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary !py-1.5 !px-3 !text-xs"
                title="Open GitHub Repository"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub ↗</span>
              </a>

              {/* Live Demo ONLY if verified deployment exists */}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary !py-1.5 !px-3 !text-xs !text-purple-700 dark:!text-purple-300"
                  title="Launch Live Deployment"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Demo ↗</span>
                </a>
              )}
            </div>

            <button
              onClick={() => onSelectCaseStudy(project)}
              className="btn btn-ghost !py-1.5 !px-2.5 !text-xs text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
            >
              <span>Case Study</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export const ProjectCard = memo(ProjectCardComponent);
