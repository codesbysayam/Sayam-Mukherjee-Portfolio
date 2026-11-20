import { useState, useMemo, useEffect, memo } from "react";
import { AnimatePresence } from "motion/react";
import { PROJECTS, ProjectItem, getProjectById } from "../data/projects";
import { useGithub } from "../hooks/useGithub";
import { GitHubRepo } from "../services/github";
import { Search, X, Code2 } from "lucide-react";

import { FeaturedProject } from "./projects/FeaturedProject";
import { ProjectCard } from "./projects/ProjectCard";
import { ProjectCaseStudyModal } from "./projects/ProjectCaseStudyModal";
import { ProjectStatsOverview } from "./projects/ProjectStatsOverview";
import { StaggerGroup, StaggerItem } from "../motion/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { ContourBackground } from "./motion/ContourBackground";

type FilterCategory = "ALL" | "AI / ML" | "FULL-STACK" | "SYSTEMS" | "DSA";

interface ProjectsShowcaseProps {
  initialProjectId?: string | null;
  onClearInitialProject?: () => void;
}

const SPOTLIGHT_ORDER = ["operon", "mausam", "sightforge", "memory-in-motion", "axiom"];

function ProjectsShowcaseComponent({
  initialProjectId,
  onClearInitialProject,
}: ProjectsShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("ALL");
  const [selectedTech, setSelectedTech] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ProjectItem | null>(null);

  useEffect(() => {
    if (!initialProjectId) return;
    const match = getProjectById(initialProjectId);
    if (match) {
      setSelectedCaseStudy(match);
    }
    onClearInitialProject?.();
  }, [initialProjectId, onClearInitialProject]);

  const { repos, stats, user, snapshot, loading: githubLoading } = useGithub();

  const repoMap = useMemo(() => {
    const map: Record<string, GitHubRepo> = {};
    repos.forEach((repo) => {
      map[repo.name.toLowerCase()] = repo;
    });
    return map;
  }, [repos]);

  const [featuredProjectId, setFeaturedProjectId] = useState<string>("operon");

  const featuredProject = useMemo(() => {
    return (
      PROJECTS.find((p) => p.id === featuredProjectId) ||
      PROJECTS.find((p) => p.id === "operon") ||
      PROJECTS[0]
    );
  }, [featuredProjectId]);

  const nextSpotlightId = useMemo(() => {
    const idx = SPOTLIGHT_ORDER.indexOf(featuredProject.id);
    return SPOTLIGHT_ORDER[(idx + 1) % SPOTLIGHT_ORDER.length];
  }, [featuredProject.id]);

  const nextSpotlightTitle = useMemo(() => {
    return PROJECTS.find((p) => p.id === nextSpotlightId)?.title || "OPERON";
  }, [nextSpotlightId]);

  const toggleFeaturedCandidate = () => {
    setFeaturedProjectId(nextSpotlightId);
  };

  const matchCategory = (project: ProjectItem, cat: FilterCategory): boolean => {
    if (cat === "ALL") return true;
    return (
      project.categoryFilter === cat ||
      Boolean(project.secondaryCategories?.includes(cat))
    );
  };

  const matchTech = (project: ProjectItem, tech: string): boolean => {
    if (tech === "ALL") return true;
    const techLower = tech.toLowerCase().trim();
    const stackText = [
      ...project.techStack,
      ...(project.technologies || []),
      ...(project.tags || []),
      project.subtitle,
    ]
      .join(" ")
      .toLowerCase();

    if (techLower === "ai / ml" || techLower === "ai/ml" || techLower === "ai") {
      return (
        project.categoryFilter === "AI / ML" ||
        /ai|ml|yolo|bytetrack|multi-agent|bdh|fast weights|composition/.test(stackText)
      );
    }
    if (techLower === "c++ / dsa" || techLower === "c++" || techLower === "dsa") {
      return (
        project.categoryFilter === "DSA" ||
        /c\+\+|dsa|dynamic programming|binary search|leethub/.test(stackText)
      );
    }
    if (techLower === "computer vision" || techLower === "vision") {
      return /yolo|bytetrack|coco|vision|canvas/.test(stackText);
    }
    if (techLower === "node / express" || techLower === "node.js") {
      return /node\.js|express/.test(stackText);
    }
    return (
      project.techStack.some(
        (t) => t.toLowerCase().includes(techLower) || techLower.includes(t.toLowerCase())
      ) ||
      (project.technologies || []).some((t) => t.toLowerCase().includes(techLower)) ||
      (project.tags && project.tags.some((t) => t.toLowerCase().includes(techLower))) ||
      project.subtitle.toLowerCase().includes(techLower)
    );
  };

  const categoryFilters: { id: FilterCategory; label: string; count: number }[] = useMemo(() => {
    const categories: { id: FilterCategory; label: string }[] = [
      { id: "ALL", label: "All" },
      { id: "AI / ML", label: "AI / ML" },
      { id: "FULL-STACK", label: "Full-Stack" },
      { id: "SYSTEMS", label: "Systems" },
      { id: "DSA", label: "DSA" },
    ];
    return categories.map((c) => ({
      ...c,
      count: PROJECTS.filter((p) => matchCategory(p, c.id)).length,
    }));
  }, []);

  const techFilters = useMemo(() => {
    const techs = [
      { id: "ALL", label: "All Tech" },
      { id: "TypeScript", label: "TypeScript" },
      { id: "React", label: "React" },
      { id: "Next.js", label: "Next.js" },
      { id: "Python", label: "Python" },
      { id: "FastAPI", label: "FastAPI" },
      { id: "AI / ML", label: "AI / ML" },
      { id: "Node.js", label: "Node / Express" },
      { id: "C++ / DSA", label: "C++ / DSA" },
    ];
    return techs.map((t) => ({
      ...t,
      count: PROJECTS.filter((p) => matchTech(p, t.id)).length,
    }));
  }, []);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return PROJECTS.filter((project) => {
      if (!matchCategory(project, selectedCategory)) return false;
      if (selectedTech !== "ALL" && !matchTech(project, selectedTech)) return false;
      if (!query) return true;

      return (
        project.title.toLowerCase().includes(query) ||
        project.subtitle.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.longDescription.toLowerCase().includes(query) ||
        project.problem.toLowerCase().includes(query) ||
        project.solution.toLowerCase().includes(query) ||
        project.implementation.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.techStack.some((t) => t.toLowerCase().includes(query)) ||
        (project.githubRepoName && project.githubRepoName.toLowerCase().includes(query))
      );
    });
  }, [selectedCategory, selectedTech, searchQuery]);

  return (
    <div className="w-full space-y-10 sm:space-y-12 pb-10">
      {/* 1. EDITORIAL HEADER */}
      <section
        id="projects-header"
        className="relative py-4 sm:py-6 border-b border-[var(--border)] space-y-5"
      >
        <ContourBackground density="subtle" />

        <div className="relative z-10 space-y-5">
          <SectionHeading
            level="h1"
            immediate
            index="02"
            eyebrow="Engineering Archive · 8 Verified Codebases"
            title="Engineering Projects"
            italicHighlight="& software systems."
            description="Multi-agent platforms, weather & hazard intelligence, real-time YOLOv8 computer vision, mechanistic memory labs, control planes, and synced C++ algorithms—every card backed directly by a public GitHub repository."
            withDivider={false}
          />

          <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-muted)] pt-3 border-t border-[var(--border)] flex-wrap tabular-nums">
            <span className="font-semibold text-[var(--text)]">{PROJECTS.length} Verified Systems</span>
            <span aria-hidden="true">·</span>
            <span className="text-[var(--accent)] font-semibold">Live GitHub Telemetry</span>
            <span aria-hidden="true">·</span>
            <span>{user?.public_repos || 11} Public Repositories Total</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">AI / ML · Full-Stack · Systems · DSA</span>
          </div>
        </div>
      </section>

      {/* 2. PROJECT STATS METRICS OVERVIEW */}
      <div id="projects-overview">
        <ProjectStatsOverview
          repos={repos}
          stats={stats}
          user={user}
          snapshot={snapshot}
          loading={githubLoading}
        />
      </div>

      {/* 3. FEATURED PROJECT */}
      {selectedCategory === "ALL" && !searchQuery.trim() && (
        <section id="projects-featured" className="w-full">
          <FeaturedProject
            project={featuredProject}
            repo={repoMap[featuredProject.githubRepoName?.toLowerCase() || ""] || null}
            onSelectCaseStudy={setSelectedCaseStudy}
            onToggleCandidate={toggleFeaturedCandidate}
            candidateTitle={nextSpotlightTitle}
            onSelectTech={setSelectedTech}
            selectedTech={selectedTech}
          />
        </section>
      )}

      {/* 4. PROJECT EXPLORER */}
      <section id="projects-explorer" className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)]">
              {selectedCategory === "ALL"
                ? "Project Explorer"
                : `${selectedCategory} Systems`}
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
              Showing {filteredProjects.length} of {PROJECTS.length} verified engineering projects
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search systems, tech, algorithms..."
              aria-label="Search engineering projects"
              className="w-full rounded-[6px] pl-9 pr-10 py-2.5 text-base sm:text-xs font-mono bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear project search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] active:scale-95 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Category & Technology Filter Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-mono font-semibold tracking-wider text-[var(--text-muted)] uppercase shrink-0 mr-1">
              Domain:
            </span>
            {categoryFilters.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`btn !min-h-[42px] sm:!min-h-[38px] !py-1.5 !px-3.5 !text-xs shrink-0 active:scale-[0.97] ${
                    isSelected ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[11px] font-mono tabular-nums ${
                      isSelected ? "text-[#20231D]/80" : "text-[var(--text-muted)]"
                    }`}
                  >
                    ({cat.count})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-mono font-semibold tracking-wider text-[var(--text-muted)] uppercase shrink-0 mr-1 flex items-center gap-1">
              <Code2 className="w-3 h-3 text-[var(--accent)]" aria-hidden="true" />
              <span>Stack:</span>
            </span>
            {techFilters.map((tech) => {
              const isSelected = selectedTech === tech.id;
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => setSelectedTech(tech.id)}
                  className={`inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-[6px] text-xs font-mono transition-all cursor-pointer border active:scale-[0.96] ${
                    isSelected
                      ? "bg-[#20231D] dark:bg-[#C7E34A] text-[#F4F4ED] dark:text-[#20231D] border-[#20231D] dark:border-[#C7E34A] font-semibold"
                      : "bg-[var(--surface-2)] hover:bg-[var(--surface)] active:bg-[var(--surface)] active:border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text)] border-[var(--border)]"
                  }`}
                >
                  <span>{tech.label}</span>
                  <span className={`text-[10px] tabular-nums ${isSelected ? "opacity-75" : "text-[var(--text-muted)]"}`}>
                    {tech.count}
                  </span>
                </button>
              );
            })}

            {(selectedTech !== "ALL" || selectedCategory !== "ALL" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSelectedTech("ALL");
                  setSearchQuery("");
                }}
                className="text-xs font-mono text-[var(--accent)] hover:underline active:opacity-75 flex items-center gap-1 ml-auto cursor-pointer py-1 px-2 font-semibold"
              >
                <X className="w-3 h-3" aria-hidden="true" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Bar */}
        {(selectedTech !== "ALL" || selectedCategory !== "ALL" || searchQuery) && (
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-[8px] bg-[var(--surface)] border border-[var(--border-strong)] text-xs font-mono flex-wrap">
            <div className="flex items-center gap-2.5 flex-wrap text-[var(--text-secondary)]">
              <span className="text-[var(--accent)] font-semibold uppercase">Active Filter:</span>
              {selectedCategory !== "ALL" && (
                <span className="px-2 py-0.5 rounded-[4px] bg-[#20231D] text-[#F4F4ED] dark:bg-[#C7E34A] dark:text-[#20231D] font-semibold">
                  Domain: {selectedCategory}
                </span>
              )}
              {selectedTech !== "ALL" && (
                <span className="px-2 py-0.5 rounded-[4px] bg-[#20231D] text-[#F4F4ED] dark:bg-[#C7E34A] dark:text-[#20231D] font-semibold inline-flex items-center gap-1.5">
                  <span>Stack: {selectedTech}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedTech("ALL")}
                    className="hover:opacity-75 active:scale-95 cursor-pointer"
                    aria-label={`Remove ${selectedTech} stack filter`}
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-[4px] border border-[var(--border-strong)] text-[var(--text)]">
                  Query: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
              <span className="text-[var(--text-muted)] tabular-nums">
                ({filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"})
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("ALL");
                setSelectedTech("ALL");
                setSearchQuery("");
              }}
              className="text-[var(--text)] hover:text-[var(--accent)] active:opacity-75 underline shrink-0 font-semibold cursor-pointer"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Explorer Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="card p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-[8px] mx-auto flex items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]">
              <Search className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-mono font-bold tracking-wider text-[var(--text)]">
                No matches found
              </h3>
              <p className="text-xs font-sans text-[var(--text-secondary)]">
                Try another keyword or reset the technology and domain filters.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setSelectedTech("ALL");
              }}
              className="btn btn-secondary !py-2 !px-4 !text-xs mx-auto active:scale-[0.98]"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          <StaggerGroup
            key={`${selectedCategory}-${selectedTech}-${filteredProjects.length}`}
            className={
              filteredProjects.length >= 4 && selectedCategory === "ALL" && selectedTech === "ALL" && !searchQuery.trim()
                ? "projects-grid"
                : "grid grid-cols-1 md:grid-cols-2 gap-6"
            }
          >
            {filteredProjects.map((project, idx) => {
              const repo = repoMap[project.githubRepoName?.toLowerCase() || ""] || null;
              const isLead = project.id === featuredProject.id;
              return (
                <StaggerItem key={project.id} className="project-slot h-full">
                  <ProjectCard
                    project={project}
                    repo={repo}
                    index={idx}
                    onSelectCaseStudy={setSelectedCaseStudy}
                    onSelectTech={(tech) => setSelectedTech(tech)}
                    selectedTech={selectedTech}
                    isFeaturedCandidate={isLead}
                  />
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        )}
      </section>

      {/* CASE STUDY MODAL */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <ProjectCaseStudyModal
            project={selectedCaseStudy}
            repo={repoMap[selectedCaseStudy.githubRepoName?.toLowerCase() || ""] || null}
            projects={filteredProjects.length > 0 ? filteredProjects : PROJECTS}
            onSelectProject={setSelectedCaseStudy}
            onClose={() => setSelectedCaseStudy(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(ProjectsShowcaseComponent);
export const ProjectsShowcase = memo(ProjectsShowcaseComponent);
