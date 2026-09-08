import { useState, useMemo, useEffect, memo } from "react";
import { AnimatePresence } from "motion/react";
import { PROJECTS, ProjectItem } from "../data/projects";
import { useGithub } from "../hooks/useGithub";
import { GitHubRepo } from "../services/github";
import { Search, X, Filter, Sparkles, Terminal, Code2, Database } from "lucide-react";

import { EngineeringSnapshot } from "./projects/EngineeringSnapshot";
import { FeaturedProject } from "./projects/FeaturedProject";
import { ProjectCard } from "./projects/ProjectCard";
import { RecentBuildActivity } from "./projects/RecentBuildActivity";
import { TechnologyLandscape } from "./projects/TechnologyLandscape";
import { BuildEvolution } from "./projects/BuildEvolution";
import { RepositorySignal } from "./projects/RepositorySignal";
import { ProjectCaseStudyModal } from "./projects/ProjectCaseStudyModal";

type FilterCategory = "ALL" | "AI / ML" | "FULL-STACK" | "SYSTEMS";

function ProjectsShowcaseComponent() {
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
        id: "AI / ML",
        label: "AI / ML",
        count: PROJECTS.filter((p) => p.categoryFilter === "AI / ML" || p.id === "yolo" || p.id === "operon").length
      },
      {
        id: "FULL-STACK",
        label: "FULL-STACK",
        count: PROJECTS.filter((p) => p.categoryFilter === "FULL-STACK").length
      },
      {
        id: "SYSTEMS",
        label: "SYSTEMS",
        count: PROJECTS.filter((p) => p.categoryFilter === "SYSTEMS").length
      }
    ];
  }, []);

  // Filter & Search Logic
  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return PROJECTS.filter((project) => {
      // Category Match
      if (selectedCategory !== "ALL") {
        if (selectedCategory === "AI / ML") {
          const isAiMl = project.categoryFilter === "AI / ML" || project.id === "yolo" || project.id === "operon";
          if (!isAiMl) return false;
        } else if (project.categoryFilter !== selectedCategory) {
          return false;
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
    <div className="w-full space-y-12 sm:space-y-16">
      {/* 1. COMPACT HERO */}
      <section className="space-y-5 pt-2">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
              ENGINEERING ARCHIVE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-mono text-zinc-500">VERIFIED CODEBASE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-display tracking-tight leading-[1.1]">
            ENGINEERING PROJECTS <br />
            <span className="text-zinc-400">&amp; SOFTWARE SYSTEMS</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed pt-1">
            A collection of software, AI/ML and systems work I’ve actually built, explored and maintained.
          </p>
        </div>

        {/* Compact Engineering Snapshot Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-2">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-bold text-white">{PROJECTS.length} PROJECTS</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>LIVE GITHUB DATA</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span>2021–PRESENT BUILD JOURNEY</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-cyan-300/90 hidden md:flex items-center gap-2">
            <span>AI · WEB · SYSTEMS CORE FOCUS</span>
          </div>
        </div>
      </section>

      {/* 2 & 3. TOP FOLD: FEATURED PROJECT + ENGINEERING SNAPSHOT */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Featured Project Editorial Block (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <FeaturedProject
            project={featuredProject}
            repo={repoMap[featuredProject.githubRepoName?.toLowerCase() || ""] || null}
            onSelectCaseStudy={setSelectedCaseStudy}
            onToggleCandidate={toggleFeaturedCandidate}
            candidateTitle={alternativeFeaturedCandidate}
          />
        </div>

        {/* Engineering Snapshot (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <EngineeringSnapshot />
        </div>
      </section>

      {/* 4 & 5. PROJECT EXPLORER (SEARCH + FILTER + CARDS) */}
      <section className="space-y-6 pt-4">
        {/* Explorer Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-5">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              PROJECT EXPLORER
            </h2>
            <p className="text-xs font-mono text-zinc-400">
              {PROJECTS.length} verified projects • {filteredProjects.length} matching criteria
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search systems, tech, algorithms..."
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-8 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-0.5 rounded cursor-pointer"
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-850 hover:border-zinc-750"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-cyan-500/20 text-cyan-200" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explorer Project Cards Grid */}
        {explorerProjects.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-zinc-850 bg-zinc-950/40 space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-zinc-500">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider">
                NO MATCHES
              </h3>
              <p className="text-xs text-zinc-500 font-sans">
                Try another keyword or reset the category filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
              }}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-cyan-400 border border-zinc-800 transition-colors cursor-pointer"
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

      {/* 7. RECENT BUILD ACTIVITY (LIVE GITHUB EVENTS) */}
      <section className="pt-2">
        <RecentBuildActivity />
      </section>

      {/* 8 & 9. TECHNOLOGY LANDSCAPE + BUILD EVOLUTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pt-2">
        {/* Technology Landscape */}
        <div>
          <TechnologyLandscape />
        </div>

        {/* Project Lifecycle / Build Evolution */}
        <div>
          <BuildEvolution onSelectProject={setSelectedCaseStudy} />
        </div>
      </section>

      {/* 10. REPOSITORY SIGNAL */}
      <section className="pt-2">
        <RepositorySignal />
      </section>

      {/* 11. CASE STUDY MODAL */}
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
