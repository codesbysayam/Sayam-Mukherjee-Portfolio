import { useState, useMemo, useEffect, memo } from "react";
import { AnimatePresence } from "motion/react";
import { usePortfolio } from "../context/PortfolioContext";
import { PROJECTS, ProjectItem } from "../data/projects";
import { useGithub } from "../hooks/useGithub";
import { GitHubRepo } from "../services/github";
import { Search, X, Filter, Sparkles, Terminal, Code2, Database } from "lucide-react";

import { FeaturedProject } from "./projects/FeaturedProject";
import { ProjectCard } from "./projects/ProjectCard";
import { ProjectCaseStudyModal } from "./projects/ProjectCaseStudyModal";

type FilterCategory = "ALL" | "FULL-STACK" | "AI & SYSTEMS" | "DSA";

function ProjectsShowcaseComponent() {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ProjectItem | null>(null);

  // Live GitHub telemetry hook
  const { repos, loading: githubLoading } = useGithub();

  // Map each project to its verified live GitHub repo if applicable
  const repoMap = useMemo(() => {
    const map: Record<string, GitHubRepo> = {};
    repos.forEach((repo) => {
      map[repo.name.toLowerCase()] = repo;
    });
    return map;
  }, [repos]);

  // Featured Project Candidate Determination
  // Dynamically inspects MAUSAM and OPERON updated_at timestamps
  const [featuredProjectId, setFeaturedProjectId] = useState<string>("mausam");

  useEffect(() => {
    const mausamRepo = repoMap["mausam"];
    const operonRepo = repoMap["operon"];
    if (mausamRepo && operonRepo) {
      const mausamTime = new Date(mausamRepo.pushed_at || mausamRepo.updated_at).getTime();
      const operonTime = new Date(operonRepo.pushed_at || operonRepo.updated_at).getTime();
      if (operonTime > mausamTime) {
        setFeaturedProjectId("operon");
      } else {
        setFeaturedProjectId("mausam");
      }
    }
  }, [repoMap]);

  const featuredProject = useMemo(() => {
    return (
      PROJECTS.find((p) => p.id === featuredProjectId) ||
      PROJECTS.find((p) => p.id === "mausam") ||
      PROJECTS[0]
    );
  }, [featuredProjectId]);

  const alternativeFeaturedCandidate = useMemo(() => {
    return featuredProject.id === "mausam" ? "OPERON" : "MAUSAM";
  }, [featuredProject.id]);

  const toggleFeaturedCandidate = () => {
    setFeaturedProjectId((prev) => (prev === "mausam" ? "operon" : "mausam"));
  };

  // Category Filter Definitions with dynamic item counts
  const categoryFilters: { id: FilterCategory; label: string; count: number }[] = useMemo(() => {
    return [
      { id: "ALL", label: "ALL", count: PROJECTS.length },
      {
        id: "FULL-STACK",
        label: "FULL-STACK",
        count: PROJECTS.filter((p) => p.categoryFilter === "FULL-STACK").length
      },
      {
        id: "AI & SYSTEMS",
        label: "AI & SYSTEMS",
        count: PROJECTS.filter((p) => p.categoryFilter === "SYSTEMS" || p.categoryFilter === "AI / ML" || p.id === "operon" || p.id === "yolo" || p.id === "memory-in-motion").length
      },
      {
        id: "DSA",
        label: "DSA PRACTICE",
        count: PROJECTS.filter((p) => p.categoryFilter === "DSA" || p.id === "sayam-solves").length
      }
    ];
  }, []);

  // Filter & Search Logic
  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return PROJECTS.filter((project) => {
      // Category Match
      if (selectedCategory !== "ALL") {
        if (selectedCategory === "FULL-STACK") {
          if (project.categoryFilter !== "FULL-STACK") return false;
        } else if (selectedCategory === "AI & SYSTEMS") {
          const isAiSys = project.categoryFilter === "SYSTEMS" || project.categoryFilter === "AI / ML" || project.id === "operon" || project.id === "yolo" || project.id === "memory-in-motion";
          if (!isAiSys) return false;
        } else if (selectedCategory === "DSA") {
          const isDsa = project.categoryFilter === "DSA" || project.id === "sayam-solves";
          if (!isDsa) return false;
        }
      }

      // Search Match
      if (!query) return true;

      return (
        project.title.toLowerCase().includes(query) ||
        project.subtitle.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.longDescription.toLowerCase().includes(query) ||
        project.whyItExists.toLowerCase().includes(query) ||
        project.whatIBuilt.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.techStack.some((t) => t.toLowerCase().includes(query)) ||
        (project.githubRepoName && project.githubRepoName.toLowerCase().includes(query))
      );
    });
  }, [selectedCategory, searchQuery]);

  // Remaining projects for explorer when in "ALL" mode vs filtered
  // When in ALL mode, the grid highlights the remaining verified projects plus featured
  const explorerProjects = useMemo(() => {
    if (searchQuery.trim().length > 0 || selectedCategory !== "ALL") {
      return filteredProjects;
    }
    // In default ALL mode, show all 5 verified projects so visitors can browse every system
    return filteredProjects;
  }, [filteredProjects, searchQuery, selectedCategory]);

  return (
    <div className="w-full space-y-8 sm:space-y-12">
      {/* 1. COMPACT HERO */}
      <section className="space-y-4 pt-1">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-cyan-600 dark:text-cyan-400 uppercase font-semibold">
              ENGINEERING ARCHIVE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            <span className="text-[11px] font-mono text-zinc-500">VERIFIED CODEBASE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white font-display tracking-tight leading-[1.1]">
            ENGINEERING PROJECTS <br />
            <span className="text-zinc-500 dark:text-zinc-400">&amp; SOFTWARE SYSTEMS</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed pt-0.5">
            A collection of software, AI/ML and systems work I’ve actually built, explored and maintained.
          </p>
        </div>

        {/* Compact Metadata Line */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-xs font-mono text-zinc-500 dark:text-zinc-400 pt-1 flex-wrap">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{PROJECTS.length} Verified Projects</span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Live GitHub Data
          </span>
          <span>·</span>
          <span>2021–Present</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline text-cyan-600 dark:text-cyan-400 font-medium">AI · Web · Systems</span>
        </div>
      </section>

      {/* 2. FEATURED PROJECT (Full-Width Editorial Card) */}
      <section className="w-full">
        <FeaturedProject
          project={featuredProject}
          repo={repoMap[featuredProject.githubRepoName?.toLowerCase() || ""] || null}
          onSelectCaseStudy={setSelectedCaseStudy}
          onToggleCandidate={toggleFeaturedCandidate}
          candidateTitle={alternativeFeaturedCandidate}
        />
      </section>

      {/* 4 & 5. PROJECT EXPLORER (SEARCH + FILTER + CARDS) */}
      <section className="space-y-6 pt-4">
        {/* Explorer Header & Controls */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 transition-colors ${
          isLight ? "border-slate-200" : "border-white/[0.08]"
        }`}>
          <div className="space-y-1">
            <h2 className={`text-xl sm:text-2xl font-bold font-display ${
              isLight ? "text-slate-900" : "text-white"
            }`}>
              PROJECT EXPLORER
            </h2>
            <p className={`text-xs font-mono ${
              isLight ? "text-slate-500" : "text-zinc-400"
            }`}>
              {PROJECTS.length} verified projects • {filteredProjects.length} matching criteria
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
              isLight ? "text-slate-400" : "text-zinc-500"
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search systems, tech, algorithms..."
              className={`w-full rounded-xl pl-9 pr-8 py-2 text-xs font-mono transition-colors focus:outline-none ${
                isLight
                  ? "bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 shadow-sm"
                  : "bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-500 focus:border-cyan-500/50"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded cursor-pointer ${
                  isLight ? "text-slate-400 hover:text-slate-700" : "text-zinc-500 hover:text-white"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters (Horizontally scrollable with no overflow) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categoryFilters.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? isLight
                      ? "bg-cyan-50 text-cyan-800 border-cyan-300 shadow-sm"
                      : "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm"
                    : isLight
                    ? "bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300"
                    : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-zinc-850 hover:border-zinc-750"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected 
                    ? isLight ? "bg-cyan-100 text-cyan-900" : "bg-cyan-500/20 text-cyan-200"
                    : isLight ? "bg-slate-200 text-slate-600" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explorer Project Cards Grid */}
        {explorerProjects.length === 0 ? (
          <div className={`glass-card rounded-2xl p-12 text-center border space-y-4 ${
            isLight ? "border-slate-200 bg-white/70" : "border-zinc-850 bg-zinc-950/40"
          }`}>
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center border ${
              isLight ? "bg-slate-100 border-slate-200 text-slate-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"
            }`}>
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className={`text-sm font-mono font-bold uppercase tracking-wider ${
                isLight ? "text-slate-800" : "text-zinc-300"
              }`}>
                NO MATCHES
              </h3>
              <p className={`text-xs font-sans ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
                Try another keyword or reset the category filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono border transition-colors cursor-pointer ${
                isLight
                  ? "bg-white hover:bg-slate-50 text-cyan-700 border-slate-300 shadow-sm"
                  : "bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border-zinc-800"
              }`}
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {explorerProjects.map((project) => {
              const repo = repoMap[project.githubRepoName?.toLowerCase() || ""] || null;
              const isLead = project.id === featuredProject.id;
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  repo={repo}
                  onSelectCaseStudy={setSelectedCaseStudy}
                  isFeaturedCandidate={isLead}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* CASE STUDY MODAL */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <ProjectCaseStudyModal
            project={selectedCaseStudy}
            repo={repoMap[selectedCaseStudy.githubRepoName?.toLowerCase() || ""] || null}
            onClose={() => setSelectedCaseStudy(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(ProjectsShowcaseComponent);
export const ProjectsShowcase = memo(ProjectsShowcaseComponent);
