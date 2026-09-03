import { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VERIFIED_PROJECTS, VerifiedProject } from "../data/projects";
import { 
  ExternalLink, Github, Layers, Search, Code, Clock, 
  Sparkles, CheckCircle2, ChevronRight, Play, Server, 
  Database as DbIcon, ShieldCheck, ArrowRight, Eye, BookOpen, Check, X,
  Cpu, Terminal, Activity
} from "lucide-react";

function ProjectsShowcaseComponent() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeProject, setActiveProject] = useState<VerifiedProject | null>(null);

  // Filter Categories aligned strictly with verified projects
  const filters = [
    { id: "all", label: "All Projects (7)" },
    { id: "web", label: "Full-Stack & Web" },
    { id: "vision", label: "AI & Computer Vision" },
    { id: "systems", label: "Systems Architecture" },
    { id: "hackathon", label: "SIH 2026" }
  ];

  // Filtering and Searching Logic
  const filteredProjects = useMemo(() => {
    return VERIFIED_PROJECTS.filter((project) => {
      const query = searchQuery.toLowerCase().trim();
      const projectTech = project.tech || project.techStack || [];
      const projectFeatures = project.features || project.highlights || [];
      const matchesSearch = query === "" || 
        project.title.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.longDescription.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        projectTech.some(t => t.toLowerCase().includes(query)) ||
        projectFeatures.some(f => f.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (selectedFilter === "all") return true;
      if (selectedFilter === "web") return project.category.includes("Web") || project.category.includes("HealthTech") || project.category.includes("FinTech");
      if (selectedFilter === "vision") return project.category.includes("Computer Vision") || project.category.includes("AgriTech");
      if (selectedFilter === "systems") return project.category.includes("Systems");
      if (selectedFilter === "hackathon") return project.id === "mausam-sih";

      return true;
    });
  }, [selectedFilter, searchQuery]);

  return (
    <div className="space-y-16 font-sans relative" id="projects">
      {/* Glow Blur Accent */}
      <div className="absolute top-1/4 right-10 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950/80 border border-zinc-900 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
            VERIFIED REPERTOIRE
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
          <div className="space-y-3">
            <h2 
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 4.5rem)" }} 
              className="font-bold tracking-tight text-white font-display leading-tight"
            >
              Engineering Projects & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Software Architectures
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Strictly verified software projects spanning edge computer vision pipelines, full-stack productivity dashboards, hackathon solutions, and systems research.
            </p>
          </div>

          {/* Real-time search input */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter by stack, feature, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-purple-500/50 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-950 border border-zinc-900 rounded-2xl max-w-2xl">
        {filters.map((filter) => {
          const isSelected = selectedFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`text-xs px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer font-medium ${
                isSelected
                  ? "bg-zinc-900 text-white shadow-md border-zinc-800 border"
                  : "bg-transparent text-zinc-400 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Grid: 7 Verified Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group h-full transition-all duration-300 relative shadow-xl border border-zinc-850 hover:border-zinc-700"
            >
              {/* Card Header & Badges */}
              <div className="p-6 space-y-4 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-zinc-950/80 border border-zinc-800/80 text-cyan-400 px-2.5 py-1 rounded-full">
                    {project.category}
                  </span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                    project.status.includes("Completed")
                      ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
                      : "bg-purple-950/40 border-purple-800/40 text-purple-300"
                  }`}>
                    {project.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-display group-hover:text-purple-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Key Features preview */}
                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">
                    Core Capabilities
                  </span>
                  <ul className="space-y-1.5">
                    {(project.features || project.highlights || []).slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Tech Tags & CTA */}
              <div className="p-6 pt-0 space-y-4">
                <div className="flex flex-wrap gap-1">
                  {(project.tech || project.techStack || []).map((t, idx) => (
                    <span key={idx} className="text-[9px] bg-zinc-950 border border-zinc-900 text-zinc-400 rounded px-2 py-0.5 font-mono">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white p-1 rounded transition-colors"
                        title="View Source on GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white p-1 rounded transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveProject(project)}
                    className="flex items-center gap-1.5 text-purple-400 group-hover:text-cyan-400 transition-colors duration-300 cursor-pointer text-xs font-mono font-bold"
                  >
                    <span>Inspect Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* SPECIFICATION DETAIL MODAL */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="absolute inset-0 bg-zinc-950/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-3xl glass-card rounded-3xl overflow-hidden shadow-2xl relative z-10 max-h-[85vh] flex flex-col border border-zinc-800"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content scroll */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
                {/* Header */}
                <div className="space-y-2 border-b border-zinc-900 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono tracking-widest uppercase border border-purple-800/40 px-3 py-1 rounded-full">
                      {activeProject.category}
                    </span>
                    <span className="text-[10px] bg-zinc-900 text-zinc-400 font-mono px-2.5 py-1 rounded-full border border-zinc-800">
                      {activeProject.status}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    {activeProject.title}
                  </h3>
                </div>

                {/* Detailed Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-400">Architectural Summary</h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                    {activeProject.longDescription}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-purple-400">Verified Feature Scope</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-300">
                    {(activeProject.features || activeProject.highlights || []).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400">Technology Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeProject.tech || activeProject.techStack || []).map((t, idx) => (
                      <span key={idx} className="text-xs bg-zinc-900 text-zinc-200 px-3 py-1 rounded-xl border border-zinc-800 font-mono font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links */}
                {(activeProject.githubUrl || activeProject.liveUrl) && (
                  <div className="pt-4 border-t border-zinc-900 flex items-center gap-3">
                    {activeProject.githubUrl && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono font-bold text-white transition-all"
                      >
                        <Github className="w-4 h-4" />
                        <span>View Repository</span>
                      </a>
                    )}
                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Live Instance</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ProjectsShowcase = memo(ProjectsShowcaseComponent);
export default ProjectsShowcase;
