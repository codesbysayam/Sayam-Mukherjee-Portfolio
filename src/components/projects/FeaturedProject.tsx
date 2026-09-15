import { memo } from "react";
import { ProjectItem } from "../../data/projects";
import { GitHubRepo, formatRelativeTime } from "../../services/github";
import { 
  Star, GitFork, ExternalLink, Github, ArrowRight, 
  Sparkles, CheckCircle2, Award, Calendar, Layers 
} from "lucide-react";

interface FeaturedProjectProps {
  project: ProjectItem;
  repo: GitHubRepo | null;
  onSelectCaseStudy: (project: ProjectItem) => void;
  onToggleCandidate?: () => void;
  candidateTitle?: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

function FeaturedProjectComponent({
  project,
  repo,
  onSelectCaseStudy,
  onToggleCandidate,
  candidateTitle
}: FeaturedProjectProps) {
  const language = repo?.language || project.techStack[0];
  const langColor = LANGUAGE_COLORS[language] || "#38bdf8";
  const starsCount = repo ? repo.stargazers_count : 0;
  const forksCount = repo ? repo.forks_count : 0;
  const lastUpdated = repo 
    ? formatRelativeTime(repo.pushed_at || repo.updated_at)
    : "recently";

  return (
    <article className="featured-project p-6 sm:p-8 lg:p-10 relative overflow-hidden">
      {/* Decorative ambient subtle radial glow */}
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Identity, Story, Technology, and Primary Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Eyebrow & Badges */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                FEATURED WORK
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 dark:text-zinc-400 border border-zinc-700/50 bg-zinc-900/60 dark:bg-zinc-900/80">
                {project.category}
              </span>
              {project.id === "mausam" && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-amber-300 border border-amber-500/30 bg-amber-500/10 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  SIH 2026
                </span>
              )}
            </div>

            {/* Switcher between candidate projects */}
            {candidateTitle && onToggleCandidate && (
              <button
                onClick={onToggleCandidate}
                className="text-[11px] font-mono text-zinc-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer bg-zinc-900/60 dark:bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-700/60 hover:border-cyan-500/40"
                title={`Switch featured view to ${candidateTitle}`}
              >
                <span>View {candidateTitle}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Project Title & Subtitle */}
          <div className="space-y-1.5">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 dark:text-white font-display tracking-tight leading-tight">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-xs sm:text-sm font-mono text-cyan-600 dark:text-cyan-400 font-medium">
                {project.subtitle}
              </p>
            )}
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans pt-1">
              {project.longDescription}
            </p>
          </div>

          {/* Why It Exists */}
          <div className="p-3.5 rounded-xl bg-zinc-900/30 dark:bg-white/[0.03] border border-zinc-800/80 dark:border-white/[0.07] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3 h-3" />
              WHY THIS SYSTEM MATTERS
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
              {project.whyItExists}
            </p>
          </div>

          {/* Technology Badges */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold block">
              VERIFIED ARCHITECTURE STACK
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#151824] text-zinc-800 dark:text-zinc-200 border border-zinc-300/80 dark:border-white/[0.08] font-mono shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onSelectCaseStudy(project)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-mono font-semibold transition-all cursor-pointer shadow-md"
            >
              <span>View Case Study</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-600" />
            </button>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white border border-zinc-300 dark:border-zinc-800 text-xs font-mono transition-colors"
              title="Open Repository on GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub ↗</span>
            </a>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-500/50 text-xs font-mono font-semibold transition-colors"
                title="Launch Live Deployment"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Demo ↗</span>
              </a>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Real Repository Telemetry & Verified Solution (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Engineering Solution Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/40 dark:bg-[#121520]/90 border border-zinc-200 dark:border-white/[0.08] space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ENGINEERING IMPLEMENTATION
              </span>
              <span className="text-[10px] font-mono text-zinc-500">PRODUCTION CODE</span>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
              {project.whatIBuilt}
            </p>
          </div>

          {/* GitHub Telemetry Panel */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/40 dark:bg-[#121520]/90 border border-zinc-200 dark:border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/[0.06] pb-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">
                REPOSITORY TELEMETRY
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">VERIFIED</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05]">
                <span className="text-[10px] font-mono text-zinc-500 block">PRIMARY STACK</span>
                <div className="flex items-center gap-1.5 pt-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 inline-block"
                    style={{ backgroundColor: langColor }}
                  />
                  <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white truncate">
                    {language}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05]">
                <span className="text-[10px] font-mono text-zinc-500 block">LAST CODE SYNC</span>
                <div className="flex items-center gap-1 pt-1 text-xs font-mono text-zinc-800 dark:text-zinc-200">
                  <Calendar className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{lastUpdated}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05]">
                <span className="text-[10px] font-mono text-zinc-500 block">STARS</span>
                <div className="flex items-center gap-1.5 pt-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                  <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white">
                    {starsCount}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05]">
                <span className="text-[10px] font-mono text-zinc-500 block">FORKS</span>
                <div className="flex items-center gap-1.5 pt-1">
                  <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white">
                    {forksCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-between pt-1">
              <span>Repo: {project.githubRepoName || "anuragpathak99"}</span>
              <span className="text-cyan-400">Public MIT</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export const FeaturedProject = memo(FeaturedProjectComponent);
