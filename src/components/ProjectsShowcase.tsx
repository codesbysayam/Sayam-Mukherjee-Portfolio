import { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EXTENDED_DATA, ExtendedProject } from "../data/extendedData";
import { 
  ExternalLink, Github, Layers, Search, Code, Clock, 
  Sparkles, CheckCircle2, ChevronRight, Play, Server, 
  Database as DbIcon, ShieldAlert, ArrowRight, Eye, BookOpen, FileText, Check, X
} from "lucide-react";

function ProjectsShowcase() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeProject, setActiveProject] = useState<ExtendedProject | null>(null);

  // Filter Categories
  const filters = [
    { id: "all", label: "All Cases" },
    { id: "featured", label: "Featured" },
    { id: "ai", label: "AI Nodes" },
    { id: "ml", label: "Machine Learning" },
    { id: "web", label: "Web Core" },
    { id: "app", label: "App Systems" },
    { id: "finance", label: "Fintech" },
    { id: "fitness", label: "Healthtech" },
  ];

  // Filtering and Searching Logic
  const filteredProjects = useMemo(() => {
    return EXTENDED_DATA.projects.filter((project) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query === "" || 
        project.title.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.longDescription.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (selectedFilter === "all") return true;
      if (selectedFilter === "featured") return project.id === "obsidian-optics-web" || project.id === "fitness-os-pro";
      if (selectedFilter === "ai") return project.tags.some(t => t.toLowerCase().includes("ai") || t.toLowerCase().includes("nlp"));
      if (selectedFilter === "ml") return project.category.toLowerCase().includes("ai") || project.category.toLowerCase().includes("healthtech");
      if (selectedFilter === "web") return project.tags.includes("Next.js") || project.tags.includes("React");
      if (selectedFilter === "app") return project.category.toLowerCase().includes("fitness") || project.category.toLowerCase().includes("fintech");
      if (selectedFilter === "finance") return project.category.toLowerCase().includes("finance") || project.category.toLowerCase().includes("fintech");
      if (selectedFilter === "fitness") return project.category.toLowerCase().includes("fitness") || project.category.toLowerCase().includes("healthtech");

      return true;
    });
  }, [selectedFilter, searchQuery]);

  return (
    <div className="space-y-16 font-sans relative">
      {/* Glow Blur Accent */}
      <div className="absolute top-1/4 right-10 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950/80 border border-zinc-900 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">PRODUCTION LABS</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
          <div className="space-y-3">
            <h2 
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 4.5rem)" }} 
              className="font-bold tracking-tight text-white font-display leading-tight"
            >
              Software Solutions <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Case Directory
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Every card below is a production blueprint. Exploring deep learning math, real-time edge processing, high-CTR media analytics, and modular finance schemas.
            </p>
          </div>

          {/* Real-time search input */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search specifications, stacks, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-purple-500/50 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Animated filter tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-950 border border-zinc-900 rounded-2xl max-w-4xl overflow-x-auto">
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

      {/* Grid: Case studies cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group h-full transition-all duration-300 relative shadow-xl"
            >
              {/* Image Thumbnail with zoom effect */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                {/* Floating Tags */}
                <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 text-cyan-400 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Body details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-widest uppercase">
                      {project.status}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">{project.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display group-hover:text-purple-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Tech tags */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[9px] bg-zinc-950 border border-zinc-900 text-zinc-400 rounded px-2 py-0.5 font-mono">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[9px] text-zinc-500 font-mono self-center px-1">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Call to action panel */}
                  <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-500 text-[10px] font-mono font-normal">BLUEPRINT DATA REVEALED</span>
                    <button
                      onClick={() => setActiveProject(project)}
                      className="flex items-center gap-1.5 text-purple-400 group-hover:text-cyan-400 transition-colors duration-300 cursor-pointer"
                    >
                      <span>Explore Case</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* FULL-SCREEN OVERLAY PORTAL DETAIL PANEL */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Dark glass cover backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="absolute inset-0 bg-zinc-950/85 backdrop-blur-md"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl glass-card rounded-3xl overflow-hidden shadow-2xl relative z-10 max-h-[85vh] flex flex-col"
            >
              {/* Floating Exit Button */}
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Contents Scroll Space */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
                {/* Visual Banner */}
                <div className="relative aspect-video max-h-[300px] w-full rounded-2xl overflow-hidden bg-zinc-900">
                  <img
                    src={activeProject.imageUrl}
                    alt={activeProject.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  {/* Title overlay */}
                  <div className="absolute bottom-6 left-6 space-y-2">
                    <span className="text-[10px] bg-purple-500/30 text-purple-300 font-mono tracking-widest uppercase border border-purple-800/40 px-3 py-1 rounded-full">
                      {activeProject.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                      {activeProject.title}
                    </h3>
                  </div>
                </div>

                {/* Main Split Info pane */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Left core descriptive stack */}
                  <div className="md:col-span-8 space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-400">Problem Statement</h4>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                        {activeProject.problemStatement}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-purple-400">Objectives Mapping</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-400">
                        {activeProject.objectives?.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2.5 bg-zinc-900/30 p-3.5 rounded-2xl border border-zinc-900">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right specifications deck */}
                  <div className="md:col-span-4 space-y-5 glass-card p-5 rounded-2xl">
                    <div className="space-y-4">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-purple-400 border-b border-zinc-900 pb-2.5 font-bold">
                        Product Specs
                      </h3>

                      <div className="space-y-3 font-mono text-[11px] text-zinc-400">
                        <div>
                          <span className="text-[9px] text-zinc-500 block">STATUS</span>
                          <span className="text-zinc-200 font-bold">{activeProject.status}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block">DEVELOPMENT EFFORT</span>
                          <span className="text-zinc-200 font-bold">{activeProject.duration}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block">DATABASE LAYER</span>
                          <span className="text-zinc-200 font-bold flex items-center gap-1.5">
                            <DbIcon className="w-3.5 h-3.5 text-emerald-400" />
                            {activeProject.database}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-zinc-900 pt-4">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block font-bold">Core Architecture</span>
                      <div className="flex flex-wrap gap-1">
                        {activeProject.techStack?.map((tech, idx) => (
                          <span key={idx} className="text-[9px] bg-zinc-950 border border-zinc-900 text-zinc-300 rounded px-2 py-0.5 font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {activeProject.metrics && (
                      <div className="space-y-2 border-t border-zinc-900 pt-4">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block font-bold">Key Performance Indicators</span>
                        <div className="space-y-2">
                          {activeProject.metrics?.map((met, idx) => (
                            <div key={idx} className="flex justify-between text-[11px] font-mono">
                              <span className="text-zinc-500">{met.label}</span>
                              <span className="text-cyan-400 font-bold">{met.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features & Architecture Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-900">
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white font-display tracking-tight flex items-center gap-2">
                      <Code className="w-4 h-4 text-purple-400" />
                      <span>Features Deployed</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-zinc-400 leading-relaxed">
                      {activeProject.features?.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white font-display tracking-tight flex items-center gap-2">
                      <Server className="w-4 h-4 text-cyan-400" />
                      <span>Software Architecture</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-zinc-400 leading-relaxed">
                      {activeProject.architecture?.map((arch, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                          <span>{arch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Challenges, Solutions & Lessons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-900">
                  <div className="space-y-4 glass-card p-5 rounded-2xl">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">Engineering Challenges & Solutions</h4>
                    <div className="space-y-4">
                      {activeProject.challenges?.map((chal, idx) => (
                        <div key={idx} className="space-y-1 bg-zinc-900/20 p-3 rounded-xl border border-zinc-900">
                          <p className="text-xs text-zinc-300 font-bold">Challenge: {chal}</p>
                          <p className="text-xs text-cyan-400 mt-1">Solution: {activeProject.solutions[idx]}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 glass-card p-5 rounded-2xl">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">Lessons Learned & Future Scope</h4>
                    <div className="space-y-3 text-xs text-zinc-400">
                      <p className="font-bold text-zinc-300">Lessons Learned:</p>
                      <ul className="list-disc pl-4 space-y-1.5 leading-relaxed">
                        {activeProject.lessonsLearned?.map((les, idx) => (
                          <li key={idx}>{les}</li>
                        ))}
                      </ul>
                      <p className="font-bold text-zinc-300 mt-4">Planned Future Scope:</p>
                      <ul className="list-disc pl-4 space-y-1.5 leading-relaxed">
                        {activeProject.futureImprovements?.map((imp, idx) => (
                          <li key={idx} className="text-cyan-400/90">{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Interactive Project Development Timeline inside modal */}
                <div className="space-y-4 pt-6 border-t border-zinc-900">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
                    Project Milestones Tracker
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                    {activeProject.timeline?.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3.5 rounded-2xl border text-center relative ${
                          item.status === "completed" 
                            ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400" 
                            : item.status === "current"
                            ? "bg-purple-950/20 border-purple-900/30 text-purple-400 animate-pulse"
                            : "bg-zinc-950 border-zinc-900 text-zinc-600"
                        }`}
                      >
                        <span className="text-[10px] font-mono block uppercase font-bold">{item.step}</span>
                        <span className="text-[8px] mt-1 block uppercase font-mono">
                          {item.status === "completed" ? "Completed" : item.status === "current" ? "Active" : "Upcoming"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons inside footer */}
              <div className="bg-zinc-950 border-t border-zinc-900 p-6 flex flex-col sm:flex-row gap-3">
                {activeProject.githubUrl && (
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl py-3 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    <span>Inspect GitHub Repository</span>
                  </a>
                )}

                {activeProject.demoUrl ? (
                  <a
                    href={activeProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl py-3 text-xs font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch Live Prototype</span>
                  </a>
                ) : (
                  <button
                    onClick={() => alert(`Active demo deployment syncing for ${activeProject.title}...`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white rounded-xl py-3 text-xs font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch Sandbox Proxy</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ROADMAP LIFECYCLE */}
      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase block font-bold">CONTINUOUS INTEGRATION</span>
          <h3 className="text-xl font-bold text-white font-display tracking-tight">System Deployment Lifecycle</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Methods applied to draft, write, test, bundle, and deploy digital products for resilient operation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 relative pt-4 select-none">
          {[
            { step: "Planning", desc: "Scope maps, specifications", color: "from-purple-600 to-purple-500" },
            { step: "Research", desc: "Data models, algebraic schemas", color: "from-indigo-600 to-indigo-500" },
            { step: "Design", desc: "User journeys, visual aesthetic", color: "from-blue-600 to-blue-500" },
            { step: "Development", desc: "State logic, modular structures", color: "from-cyan-600 to-cyan-500" },
            { step: "Testing", desc: "System lints, type checks", color: "from-teal-600 to-teal-500" },
            { step: "Deployment", desc: "Bundling, containers, DNS", color: "from-emerald-600 to-emerald-500" },
            { step: "Maintenance", desc: "Continuous monitoring", color: "from-green-600 to-green-500" }
          ].map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="glass-card rounded-2xl p-4 space-y-3 hover:border-purple-500/20 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-[10px] font-bold text-white font-mono shadow-md mb-2`}>
                    0{idx + 1}
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200 group-hover:text-white font-display transition-colors">{item.step}</h4>
                  <p className="text-[9px] text-zinc-500 leading-relaxed mt-1">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(ProjectsShowcase);
