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
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden bg-zinc-950/80 shadow-xl flex flex-col justify-between">
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="space-y-6">
        {/* Top Header & Badges */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              FEATURED PROJECT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 border border-zinc-800 bg-zinc-900/80">
              {project.category}
            </span>
          </div>

          {/* Quick switcher between MAUSAM & OPERON if available */}
          {candidateTitle && onToggleCandidate && (
            <button
              onClick={onToggleCandidate}
              className="text-[11px] font-mono text-zinc-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-zinc-850 hover:border-zinc-750"
              title={`Switch featured view to ${candidateTitle}`}
            >
              <span>View {candidateTitle}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Title, Subtitle, and Description */}
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="text-xs sm:text-sm font-mono text-cyan-400/90 font-medium">
              {project.subtitle}
            </p>
          )}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans pt-1 max-w-3xl">
            {project.longDescription}
          </p>
        </div>

        {/* Verified Technical Context: Why it exists & What was built */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-850 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-cyan-400" />
              WHY IT EXISTS
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {project.whyItExists}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-850 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ENGINEERING SOLUTION
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {project.whatIBuilt}
            </p>
          </div>
        </div>

        {/* Technology Stack Chips */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold block">
            VERIFIED TECHNOLOGIES
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Live GitHub Telemetry & Actions */}
      <div className="pt-6 mt-6 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Live GitHub Telemetry */}
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 flex-wrap">
          <div className="flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-850">
            <span 
              className="w-2 h-2 rounded-full inline-block" 
              style={{ backgroundColor: langColor }} 
            />
            <span className="text-zinc-200">{language}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-300 font-bold">{starsCount}</span>
            <span className="text-zinc-500">stars</span>
          </div>

          <div className="flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-300 font-bold">{forksCount}</span>
            <span className="text-zinc-500">forks</span>
          </div>

          <div className="flex items-center gap-1 text-zinc-500">
            <Calendar className="w-3 h-3 text-zinc-600" />
            <span>Updated {lastUpdated}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onSelectCaseStudy(project)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-750 hover:border-zinc-600 text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm"
          >
            <span>View Case Study</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-850 hover:border-zinc-750 text-xs font-mono transition-colors"
            title="Open Repository on GitHub"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub ↗</span>
          </a>

          {/* Real deployment button ONLY if verified liveUrl exists */}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-500/50 text-xs font-mono font-semibold transition-colors"
              title="Launch Live Deployment"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Demo ↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export const FeaturedProject = memo(FeaturedProjectComponent);
