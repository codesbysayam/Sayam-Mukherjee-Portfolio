import { memo } from "react";
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

  return (
    <article className="rounded-2xl p-5 sm:p-6 border border-zinc-200/90 dark:border-white/[0.08] hover:border-cyan-500/40 dark:hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group bg-white dark:bg-[#11131c]/90 relative shadow-sm hover:shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
      {/* Top Meta Bar: Category, Status & Featured tag if applicable */}
      <div className="space-y-3.5 flex-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 px-2.5 py-0.5 rounded-full">
            {project.category}
          </span>

          <div className="flex items-center gap-1.5">
            {isFeaturedCandidate && (
              <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                Featured System
              </span>
            )}
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              project.statusType === "live"
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400"
                : project.statusType === "hackathon"
                ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/40 text-amber-700 dark:text-amber-300"
                : project.statusType === "active"
                ? "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800/40 text-cyan-700 dark:text-cyan-300"
                : "bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800/40 text-purple-700 dark:text-purple-300"
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white font-display group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 font-medium line-clamp-1">
              {project.subtitle}
            </p>
          )}
        </div>

        {/* Real 2-3 Line Description */}
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans line-clamp-3">
          {project.shortDescription}
        </p>

        {/* Key Architectural Highlight */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="pt-2 border-t border-zinc-100 dark:border-white/[0.06]">
            <div className="flex items-start gap-2 text-[11px] text-zinc-700 dark:text-zinc-300 leading-snug">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5" />
              <span>{project.highlights[0]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Lower Section: Tech Stack, Live Telemetry & Actions */}
      <div className="pt-5 mt-4 border-t border-zinc-100 dark:border-white/[0.06] space-y-4">
        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1">
          {project.techStack.slice(0, 5).map((tech, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/[0.06]"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 border border-zinc-200 dark:border-white/[0.06]">
              +{project.techStack.length - 5}
            </span>
          )}
        </div>

        {/* GitHub Telemetry Row */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400 pt-1">
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
        <div className="pt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-zinc-300 dark:border-zinc-800 text-[11px] font-mono transition-colors"
              title="Open GitHub Repository"
            >
              <Github className="w-3 h-3" />
              <span>GitHub ↗</span>
            </a>

            {/* Live Demo ONLY if verified deployment exists */}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-medium transition-colors"
                title="Launch Live Deployment"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Demo ↗</span>
              </a>
            )}
          </div>

          <button
            onClick={() => onSelectCaseStudy(project)}
            className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 cursor-pointer transition-colors p-1"
          >
            <span>Case Study</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
}

export const ProjectCard = memo(ProjectCardComponent);
