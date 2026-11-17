import { useState, useMemo, useEffect, memo } from "react";
import { AnimatePresence } from "motion/react";
import { PROJECTS, ProjectItem } from "../data/projects";
import { useGithub } from "../hooks/useGithub";
import { GitHubRepo } from "../services/github";
import { Search, X, Code2 } from "lucide-react";

import { FeaturedProject } from "./projects/FeaturedProject";
import { ProjectCard } from "./projects/ProjectCard";
import { ProjectCaseStudyModal } from "./projects/ProjectCaseStudyModal";
import { ProjectStatsOverview } from "./projects/ProjectStatsOverview";

type FilterCategory = "ALL" | "AI / ML" | "FULL-STACK" | "DSA";

function ProjectsShowcaseComponent() {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("ALL");
  const [selectedTech, setSelectedTech] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ProjectItem | null>(null);

  const { repos, stats, user, snapshot, loading: githubLoading } = useGithub();

  const repoMap = useMemo(() => {
    const map: Record<string, GitHubRepo> = {};
    repos.forEach((repo) => {
      map[repo.name.toLowerCase()] = repo;
    });
    return map;
  }, [repos]);

  const [featuredProjectId, setFeaturedProjectId] = useState<string>("mausam");

  useEffect(() => {
    const mausamRepo = repoMap["mausam"];
    const operonRepo = repoMap["operon"];
    if (mausamRepo && operonRepo) {
      const mausamTime = new Date(mausamRepo.pushed_at || mausamRepo.updated_at).getTime();
      const operonTime = new Date(operonRepo.pushed_at || operonRepo.updated_at).getTime();
      setFeaturedProjectId(operonTime > mausamTime ? "operon" : "mausam");
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

  const matchTech = (project: ProjectItem, tech: string): boolean => {
    if (tech === "ALL") return true;
    const techLower = tech.toLowerCase().trim();
    if (techLower === "ai/ml" || techLower === "ai / ml" || techLower === "ai") {
      return (
        project.id === "operon" ||
        project.id === "yolo" ||
        project.techStack.some((t) => /ai|ml|yolo|pytorch|vision|agent|ollama|gemini/i.test(t))
      );
    }
    if (techLower === "c++" || techLower === "c++ / dsa" || techLower === "dsa") {
      return (
        project.id === "sayam-solves" ||
        project.techStack.some((t) => /c\+\+|dsa|algorithm|data structure|leetcode/i.test(t))
      );
    }
    if (techLower === "computer vision" || techLower === "vision") {
      return (
        project.id === "yolo" ||
        project.techStack.some((t) => /vision|yolo|opencv|image/i.test(t))
      );
    }
    if (techLower === "node.js" || techLower === "node") {
      return project.techStack.some((t) => /node|express/i.test(t));
    }
    if (techLower === "tailwind css" || techLower === "tailwind") {
      return project.techStack.some((t) => /tailwind/i.test(t));
    }
    return (
      project.techStack.some((t) => t.toLowerCase().includes(techLower) || techLower.includes(t.toLowerCase())) ||
      (project.tags && project.tags.some((t) => t.toLowerCase().includes(techLower))) ||
      project.subtitle.toLowerCase().includes(techLower)
    );
  };

  const categoryFilters: { id: FilterCategory; label: string; count: number }[] = useMemo(() => {
    return [
      { id: "ALL", label: "All", count: PROJECTS.length },
      {
        id: "AI / ML",
        label: "AI / ML",
        count: PROJECTS.filter((p) => p.id === "operon" || p.id === "yolo").length,
      },
      {
        id: "FULL-STACK",
        label: "Full-Stack",
        count: PROJECTS.filter((p) => p.id === "mausam" || p.id === "portfolio" || p.id === "operon").length,
      },
      {
        id: "DSA",
        label: "DSA",
        count: PROJECTS.filter((p) => p.id === "sayam-solves").length,
      },
    ];
  }, []);

  const techFilters = useMemo(() => {
    const techs = [
      { id: "ALL", label: "All Tech" },
      { id: "React", label: "React" },
      { id: "Node.js", label: "Node.js" },
      { id: "AI / ML", label: "AI / ML" },
      { id: "TypeScript", label: "TypeScript" },
      { id: "Python", label: "Python" },
      { id: "C++ / DSA", label: "C++ / DSA" },
      { id: "Computer Vision", label: "Computer Vision" },
      { id: "Tailwind CSS", label: "Tailwind CSS" },
    ];
    return techs.map((t) => ({
      ...t,
      count: PROJECTS.filter((p) => matchTech(p, t.id)).length,
    }));
  }, []);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return PROJECTS.filter((project) => {
      if (selectedCategory !== "ALL") {
        if (selectedCategory === "AI / ML") {
          if (project.id !== "operon" && project.id !== "yolo") return false;
        } else if (selectedCategory === "FULL-STACK") {
          if (project.id !== "mausam" && project.id !== "portfolio" && project.id !== "operon") return false;
        } else if (selectedCategory === "DSA") {
          if (project.id !== "sayam-solves") return false;
        }
      }

      if (selectedTech !== "ALL") {
        if (!matchTech(project, selectedTech)) return false;
      }

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
  }, [selectedCategory, selectedTech, searchQuery]);

  return (
    <div className="w-full space-y-10 sm:space-y-12 pb-10">
      {/* 1. EDITORIAL HEADER */}
      <section className="space-y-4 pt-2 border-b border-[var(--border)] pb-8">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-muted)]">
            <span className="text-[var(--accent)] font-semibold uppercase tracking-wider">
              02 · Engineering Archive
            </span>
            <span aria-hidden="true">/</span>
            <span>Verified Codebase</span>
          </div>

          <h1
            className="font-extrabold text-[var(--text)] font-display tracking-tight leading-[1.04] text-balance"
            style={{ fontSize: "clamp(2.1rem, 4vw, 3.6rem)" }}
          >
            Engineering Projects{" "}
            <span className="font-serif-editorial italic font-normal text-[var(--text-secondary)]">
              &amp; software systems.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed max-w-2xl">
            Production web applications, autonomous AI agents, computer vision pipelines, and documented C++ algorithmic problem-solving archives.
          </p>
        </div>

        {/* Clean Unboxed Metadata Strip */}
        <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-muted)] pt-1 flex-wrap tabular-nums">
          <span className="font-semibold text-[var(--text)]">{PROJECTS.length} Verified Systems</span>
          <span aria-hidden="true">·</span>
          <span className="text-[var(--accent)] font-semibold">Live GitHub Telemetry</span>
          <span aria-hidden="true">·</span>
          <span>2024–Present</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span className="hidden sm:inline">AI / ML · Full-Stack · Systems · DSA</span>
        </div>
      </section>

      {/* 2. PROJECT STATS METRICS OVERVIEW */}
      <ProjectStatsOverview
        repos={repos}
        stats={stats}
        user={user}
        snapshot={snapshot}
        loading={githubLoading}
      />

      {/* 3. FEATURED PROJECT */}
      {selectedCategory === "ALL" && !searchQuery.trim() && (
        <section className="w-full">
          <FeaturedProject
            project={featuredProject}
            repo={repoMap[featuredProject.githubRepoName?.toLowerCase() || ""] || null}
            onSelectCaseStudy={setSelectedCaseStudy}
            onToggleCandidate={toggleFeaturedCandidate}
            candidateTitle={alternativeFeaturedCandidate}
            onSelectTech={setSelectedTech}
            selectedTech={selectedTech}
          />
        </section>
      )}

      {/* 4. PROJECT EXPLORER */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)]">
              {selectedCategory === "ALL"
                ? "Project Explorer"
                : `${selectedCategory.charAt(0) + selectedCategory.slice(1).toLowerCase()} Systems`}
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
              Showing {filteredProjects.length} of {PROJECTS.length} verified projects
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
              className="w-full rounded-[6px] pl-9 pr-8 py-2.5 text-xs font-mono bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear project search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
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
                  className={`btn !min-h-[38px] !py-1.5 !px-3.5 !text-xs shrink-0 ${
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
                  className={`inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-[6px] text-xs font-mono transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-[#20231D] dark:bg-[#C7E34A] text-[#F4F4ED] dark:text-[#20231D] border-[#20231D] dark:border-[#C7E34A] font-semibold"
                      : "bg-[var(--surface-2)] hover:bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text)] border-[var(--border)]"
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
                className="text-xs font-mono text-[var(--accent)] hover:underline flex items-center gap-1 ml-auto cursor-pointer py-1 px-2 font-semibold"
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
                    className="hover:opacity-75 cursor-pointer"
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
              className="text-[var(--text)] hover:text-[var(--accent)] underline shrink-0 font-semibold cursor-pointer"
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
              className="btn btn-secondary !py-2 !px-4 !text-xs mx-auto"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => {
              const repo = repoMap[project.githubRepoName?.toLowerCase() || ""] || null;
              const isLead = project.id === featuredProject.id;
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  repo={repo}
                  onSelectCaseStudy={setSelectedCaseStudy}
                  onSelectTech={(tech) => setSelectedTech(tech)}
                  selectedTech={selectedTech}
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
