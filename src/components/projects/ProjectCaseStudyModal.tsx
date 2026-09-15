import { useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProjectItem } from "../../data/projects";
import { GitHubRepo, formatRelativeTime } from "../../services/github";
import { 
  X, ExternalLink, Github, Star, GitFork, Check, 
  Layers, Terminal, Cpu, Calendar, Code, CheckCircle2 
} from "lucide-react";

interface ProjectCaseStudyModalProps {
  project: ProjectItem | null;
  repo: GitHubRepo | null;
  onClose: () => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

function ProjectCaseStudyModalComponent({
  project,
  repo,
  onClose
}: ProjectCaseStudyModalProps) {
  // ESC key listener
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const language = repo?.language || project.techStack[0];
  const langColor = LANGUAGE_COLORS[language] || "#38bdf8";
  const starsCount = repo ? repo.stargazers_count : 0;
  const forksCount = repo ? repo.forks_count : 0;
  const lastUpdated = repo 
    ? formatRelativeTime(repo.pushed_at || repo.updated_at)
    : "recently";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl card overflow-hidden shadow-2xl relative z-10 max-h-[88vh] flex flex-col bg-white dark:bg-[#11131c] border border-zinc-200 dark:border-zinc-800"
      >
        {/* Sticky Header / Close Button */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#11131c]/95 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-mono tracking-wider uppercase border border-purple-200 dark:border-purple-800/40 px-2.5 py-0.5 rounded-md font-semibold">
              {project.categoryLabel || project.category}
            </span>
            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700">
              {project.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Close modal (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1 text-zinc-700 dark:text-zinc-300">
          {/* Project Title and Subtitle */}
          <div className="space-y-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-5">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-display">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-400 font-mono">
                {project.subtitle}
              </p>
            )}
            {project.role && (
              <p className="text-[11px] text-zinc-500 font-mono pt-1">
                Role: {project.role}
              </p>
            )}
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 font-semibold">
              OVERVIEW
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed font-sans text-zinc-700 dark:text-zinc-300">
              {project.longDescription}
            </p>
          </div>

          {/* Problem / Purpose (Why it exists) */}
          {project.whyItExists && (
            <div className="space-y-2 p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-zinc-800">
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 font-semibold">
                PROBLEM &amp; PURPOSE (WHY IT EXISTS)
              </h4>
              <p className="text-xs leading-relaxed font-sans text-zinc-700 dark:text-zinc-300">
                {project.whyItExists}
              </p>
            </div>
          )}

          {/* What I Built */}
          {project.whatIBuilt && (
            <div className="space-y-2 p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-zinc-800">
              <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                WHAT I BUILT (ENGINEERING IMPLEMENTATION)
              </h4>
              <p className="text-xs leading-relaxed font-sans text-zinc-700 dark:text-zinc-300">
                {project.whatIBuilt}
              </p>
            </div>
          )}

          {/* Key Capabilities */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 font-semibold">
                KEY CAPABILITIES &amp; HIGHLIGHTS
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {project.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-zinc-50 dark:bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* System Architecture (if present) */}
          {project.architecture && project.architecture.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 font-semibold">
                SYSTEM ARCHITECTURE &amp; PIPELINE
              </h4>
              <ul className="space-y-1.5 text-xs">
                {project.architecture.map((arch, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-zinc-50 dark:bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono text-[11px]">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">0{idx + 1}.</span>
                    <span className="leading-relaxed text-zinc-700 dark:text-zinc-300">{arch}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technology Stack */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-semibold">
              TECHNOLOGY STACK
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Live GitHub Data */}
          <div className="space-y-2 p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 font-semibold">
              GITHUB DATA
            </h4>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-700 dark:text-zinc-300 flex-wrap pt-1">
              <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-800">
                <span 
                  className="w-2 h-2 rounded-full inline-block" 
                  style={{ backgroundColor: langColor }} 
                />
                <span>{language}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>{starsCount} stars</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5 text-zinc-400" />
                <span>{forksCount} forks</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Updated {lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3 flex-wrap">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <Github className="w-4 h-4" />
              <span>Repository on GitHub ↗</span>
            </a>

            {/* ONLY show live demo if liveUrl exists */}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch Live Deployment ↗</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export const ProjectCaseStudyModal = memo(ProjectCaseStudyModalComponent);
