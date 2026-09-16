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

type FilterCategory = "ALL" | "AI / ML" | "FULL-STACK" | "DSA";

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

  // Category Filter Definitions with exact prompt specification
  const categoryFilters: { id: FilterCategory; label: string; count: number }[] = useMemo(() => {
    return [
      { id: "ALL", label: "All", count: PROJECTS.length },
      {
        id: "AI / ML",
        label: "AI / ML",
        count: PROJECTS.filter((p) => p.id === "operon" || p.id === "yolo").length
      },
      {
        id: "FULL-STACK",
        label: "Full-Stack",
        count: PROJECTS.filter((p) => p.id === "mausam" || p.id === "portfolio" || p.id === "operon").length
      },
      {
        id: "DSA",
        label: "DSA",
        count: PROJECTS.filter((p) => p.id === "sayam-solves").length
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
          if (project.id !== "operon" && project.id !== "yolo") return false;
        } else if (selectedCategory === "FULL-STACK") {
          if (project.id !== "mausam" && project.id !== "portfolio" && project.id !== "operon") return false;
        } else if (selectedCategory === "DSA") {
          if (project.id !== "sayam-solves") return false;
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

  return (
    <div className="w-full space-y-8 sm:space-y-12">
      {/* 1. COMPACT HERO */}
      <section className="space-y-4 pt-1">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tracking-wider text-purple-700 dark:text-purple-400 font-semibold">
              Engineering Archive
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span className="text-xs font-mono text-zinc-500">Verified Codebase</span>
          </div>

          <h1 
            className="font-extrabold text-zinc-900 dark:text-white font-display tracking-tight leading-[1.08]"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3.25rem)" }}
          >
            Engineering Projects <br />
            <span className="text-zinc-500 dark:text-zinc-400">&amp; Software Systems</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed pt-0.5">
            A collection of software, AI/ML, full-stack architectures, and algorithmic systems I have actually built, explored, and maintained.
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
          <span>2024–Present</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline text-purple-700 dark:text-purple-400 font-medium">AI · Full-Stack · Systems · DSA</span>
        </div>
      </section>

      {/* 2. FEATURED PROJECT (Shown primarily in ALL mode when not searching) */}
      {selectedCategory === "ALL" && !searchQuery.trim() && (
        <section className="w-full">
          <FeaturedProject
            project={featuredProject}
            repo={repoMap[featuredProject.githubRepoName?.toLowerCase() || ""] || null}
            onSelectCaseStudy={setSelectedCaseStudy}
            onToggleCandidate={toggleFeaturedCandidate}
            candidateTitle={alternativeFeaturedCandidate}
          />
        </section>
      )}

      {/* 3. PROJECT EXPLORER (SEARCH + FILTER + CARDS) */}
      <section className="space-y-6 pt-2">
        {/* Explorer Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-white/[0.08] pb-5">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white">
              {selectedCategory === "ALL" ? "Project Explorer" : `${selectedCategory.charAt(0) + selectedCategory.slice(1).toLowerCase()} Systems`}
            </h2>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              Showing {filteredProjects.length} of {PROJECTS.length} verified projects
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search systems, tech, algorithms..."
              className="w-full rounded-xl pl-9 pr-8 py-2 text-xs font-mono bg-white dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-purple-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters (Horizontally scrollable with unified buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categoryFilters.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`btn !py-1.5 !px-3.5 !text-xs ${
                  isSelected ? "btn-primary" : "btn-secondary"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-xs px-1.5 py-0.2 rounded-full ${
                  isSelected 
                    ? "bg-white/20 text-white" 
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explorer Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="card p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-400">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-mono font-bold tracking-wider text-zinc-800 dark:text-zinc-200">
                No matches found
              </h3>
              <p className="text-xs font-sans text-zinc-500">
                Try another keyword or reset the category filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
              }}
              className="btn btn-secondary !py-2 !px-4 !text-xs mx-auto"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {filteredProjects.map((project) => {
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
