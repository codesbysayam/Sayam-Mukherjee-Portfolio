import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowUpRight, Github, Code2, Cpu, Tv, Trophy } from "lucide-react";
import { PROJECTS, ProjectItem } from "../data/projects";
import { getProjectMedia } from "../data/projectMedia";
import { useGithub } from "../hooks/useGithub";
import { ProjectCaseStudyModal } from "./projects/ProjectCaseStudyModal";
import { ProjectMedia } from "./projects/ProjectMedia";
import { computeProjectLifecycle } from "../utils/projectLifecycle";
import { EditorialReveal, MaskMediaReveal } from "../motion/Reveal";
import { ContourBackground } from "./motion/ContourBackground";
import { SectionHeading } from "./ui/SectionHeading";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../motion/tokens";

interface HomeEditorialChaptersProps {
  onNavigateTab: (
    tab: "about" | "projects" | "skills" | "ecosystem" | "journal" | "showcase" | "contact"
  ) => void;
}

export const HomeEditorialChapters: React.FC<HomeEditorialChaptersProps> = ({
  onNavigateTab,
}) => {
  const { repos } = useGithub();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const reduced = usePrefersReducedMotion();

  const featuredLead = PROJECTS.find((p) => p.id === "operon") || PROJECTS[0];
  const secondaryFeatured = PROJECTS.filter((p) =>
    ["mausam", "sightforge", "memory-in-motion"].includes(p.id)
  );
  const homeFeaturedPool = [featuredLead, ...secondaryFeatured];

  const findRepoForProject = (project: ProjectItem) => {
    const repoName = (project.githubRepoName || project.repository || "").toLowerCase();
    return repos.find((r) => r.name.toLowerCase() === repoName) || null;
  };

  return (
    <>
      {/* ====================================================================
          CHAPTER 1: EDITORIAL ABOUT SPLIT
          ==================================================================== */}
      <section
        id="home-about-chapter"
        aria-labelledby="home-about-heading"
        className="relative overflow-hidden w-full rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-5 py-9 sm:px-10 sm:py-12 lg:px-12"
      >
        <ContourBackground density="subtle" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-5">
            <EditorialReveal delay={0}>
              <span className="inline-block editorial-overline text-[var(--accent)]">
                01 / A Little About Me
              </span>
            </EditorialReveal>

            <EditorialReveal delay={0.06}>
              <h2
                id="home-about-heading"
                className="font-display text-2xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-[-0.03em] leading-[1.06] text-[var(--text)]"
              >
                Building systems from{" "}
                <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                  first principles
                </span>{" "}
                with disciplined execution.
              </h2>
            </EditorialReveal>

            <EditorialReveal delay={0.12}>
              <p className="text-base leading-relaxed text-[var(--text-secondary)] max-w-2xl">
                I am a 2nd-year Computer Science &amp; Engineering (AI &amp; ML) undergraduate at KIIT University, Bhubaneswar, originally from Hooghly, West Bengal. Alongside maintaining a 9.06 first-year CGPA, I engineer full-stack React and TypeScript systems, multi-agent human-in-the-loop workflows, and daily C++20 algorithmic implementations.
              </p>
            </EditorialReveal>

            <EditorialReveal delay={0.18}>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigateTab("about")}
                  className="btn btn-primary group"
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab("skills")}
                  className="btn btn-secondary"
                >
                  <span>Inspect Technical Stack</span>
                </button>
              </div>
            </EditorialReveal>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <EditorialReveal delay={0.08}>
              <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] p-5 transition-colors hover:border-[var(--border-strong)]">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  ACADEMIC BENCHMARK
                </div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono tabular-nums text-[var(--text)]">
                    9.06
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    / 10.0 CGPA · Year 1
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                  KIIT Deemed to be University · B.Tech CSE (Artificial Intelligence &amp; Machine Learning).
                </p>
              </div>
            </EditorialReveal>

            <EditorialReveal delay={0.16}>
              <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] p-5 transition-colors hover:border-[var(--border-strong)]">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  SYSTEMS &amp; DISCOVERY
                </div>
                <div className="mt-1.5 text-lg font-bold text-[var(--text)]">
                  8 Verified Builds · Active Telemetry
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                  Every architecture note, hackathon outcome, and codebase link on this portfolio maps directly to real public repositories and verified records.
                </p>
              </div>
            </EditorialReveal>
          </div>
        </div>
      </section>

      {/* ====================================================================
          CHAPTER 2: FEATURED ENGINEERING WORK (Deep Ink Contrast Chapter)
          ==================================================================== */}
      <section
        id="home-work-chapter"
        aria-labelledby="home-featured-work-heading"
        className="relative overflow-hidden w-full rounded-[12px] bg-[#151713] text-[#F4F4ED] border border-[#41443A] px-5 py-10 sm:px-10 sm:py-14 lg:px-12"
      >
        <ContourBackground density="medium" tone="lime-on-dark" />

        <div className="relative z-10">
          <SectionHeading
            index="02"
            eyebrow="Selected Engineering Work"
            title="Systems built for"
            italicHighlight="clarity & control."
            description="From multi-agent enterprise lifecycles with human approval checkpoints to regional climate telemetry and local computer-vision pipelines."
            darkSurface
            className="mb-10"
            rightSlot={
              <button
                type="button"
                onClick={() => onNavigateTab("projects")}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-[6px] bg-[#C7E34A] text-[#20231D] font-bold text-sm hover:bg-[#A9C52F] active:bg-[#9BB827] active:scale-[0.98] transition-all cursor-pointer group"
              >
                <span>VIEW ALL {PROJECTS.length} PROJECTS</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            }
          />

          {/* LEAD FEATURED CASE STUDY: OPERON */}
          {(() => {
            const media = getProjectMedia(featuredLead.id);
            const leadRepo = findRepoForProject(featuredLead);
            const leadLifecycle = computeProjectLifecycle(featuredLead, leadRepo);
            return (
              <motion.article
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: "some" }}
                transition={{ duration: MOTION_DURATION.enter, ease: MOTION_EASE.out }}
                className="rounded-[10px] border border-[#41443A] focus-within:border-[#C7E34A] bg-[#20231D] overflow-hidden mb-8 transition-colors group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <MaskMediaReveal className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[360px] h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-[#41443A] bg-[#151713]">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(featuredLead)}
                      aria-label={`Open ${featuredLead.title} case study`}
                      className="block h-full w-full cursor-pointer text-left"
                    >
                      <img
                        src={media.src}
                        alt={media.alt}
                        loading="lazy"
                        decoding="async"
                        className="!h-full w-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-[#C7E34A] text-[#20231D] flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </button>
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="px-2 py-0.5 rounded-[4px] bg-[#20231D]/92 text-[#C7E34A] border border-[#C7E34A]/60 text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-sm">
                        Lead System
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 pointer-events-none">
                      <span
                        title={leadLifecycle.title}
                        className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase tracking-wider ${leadLifecycle.badgeClass}`}
                      >
                        {leadLifecycle.label}
                      </span>
                    </div>
                  </MaskMediaReveal>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-[#C7E34A] uppercase tracking-[0.1em] font-semibold">
                        01 · LEAD SYSTEM · {featuredLead.categoryFilter}
                      </span>
                      <span className="text-[#B5B8AA]">{featuredLead.status}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F4ED]">
                      {featuredLead.title}
                    </h3>

                    <p className="text-sm font-mono text-[#B5B8AA]">
                      {featuredLead.subtitle}
                    </p>

                    <p className="text-sm sm:text-base leading-relaxed text-[#D4D6CA]">
                      {featuredLead.shortDescription}
                    </p>

                    <div className="pt-2 border-t border-[#41443A] flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-mono text-[#B5B8AA]">
                      {featuredLead.techStack.slice(0, 5).map((tech) => (
                        <span key={tech}>· {tech}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(featuredLead)}
                      className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-[6px] bg-[#C7E34A] text-[#20231D] text-xs font-bold uppercase tracking-wider hover:bg-[#A9C52F] active:bg-[#9BB827] active:scale-[0.98] transition-all cursor-pointer group/btn"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </button>

                    {featuredLead.liveUrl && (
                      <a
                        href={featuredLead.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-[6px] border border-[#41443A] text-[#F4F4ED] text-xs font-semibold hover:bg-[#F4F4ED] hover:text-[#20231D] active:bg-[#2E3229] active:border-[#C7E34A] active:scale-[0.98] transition-all"
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <a
                      href={featuredLead.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-[6px] border border-[#41443A] text-[#B5B8AA] text-xs font-semibold hover:text-[#F4F4ED] hover:border-[#F4F4ED] active:bg-[#2E3229] active:border-[#C7E34A] active:text-[#F4F4ED] active:scale-[0.98] transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })()}

        {/* ALTERNATING SECONDARY FEATURED WORK GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {secondaryFeatured.map((project, index) => {
            const media = getProjectMedia(project.id);
            const repo = findRepoForProject(project);
            return (
              <motion.article
                key={project.id}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: "some" }}
                transition={{
                  duration: MOTION_DURATION.enter,
                  delay: index * 0.06,
                  ease: MOTION_EASE.out,
                }}
                className="project-card rounded-[10px] border border-[#41443A] focus-within:border-[#C7E34A] hover:border-[#69734A] bg-[#151713] justify-between group transition-colors"
              >
                <div>
                  <MaskMediaReveal delay={index * 0.05} className="w-full">
                    <ProjectMedia
                      project={project}
                      media={media}
                      repo={repo}
                      onPreview={() => setSelectedProject(project)}
                      className="!border-[#41443A]"
                      imgClassName="group-hover:scale-[1.03]"
                    />
                  </MaskMediaReveal>

                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[#B5B8AA]">
                      <span className="text-[#C7E34A] font-semibold uppercase tracking-wider">
                        0{index + 2} · {project.categoryFilter}
                      </span>
                      <span>{project.status}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-[#F4F4ED]">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm leading-relaxed text-[#D4D6CA]">
                      {project.shortDescription}
                    </p>

                    <div className="pt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-mono text-[#B5B8AA]">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span key={tech}>· {tech}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-[#41443A] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-mono font-bold uppercase tracking-wider text-[#C7E34A] hover:underline active:opacity-75 active:scale-[0.97] transition-all inline-flex items-center gap-1 cursor-pointer min-h-[44px] group/cs"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/cs:translate-x-1" />
                  </button>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F4F4ED] hover:text-[#C7E34A] active:text-[#C7E34A] active:scale-[0.97] inline-flex items-center gap-1 transition-all min-h-[40px] px-1.5"
                      >
                        <span>Live</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B5B8AA] hover:text-[#F4F4ED] active:text-[#C7E34A] active:scale-[0.97] inline-flex items-center gap-1 transition-all min-h-[40px] px-1.5"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Repo</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
        </div>
      </section>

      {/* ====================================================================
          CHAPTER 4: BUILD / EXPLORE DUALITY BAND (Paper-Soft Surface)
          ==================================================================== */}
      <section
        id="home-duality-chapter"
        aria-label="Engineering vs Creative Exploration"
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <EditorialReveal delay={0} className="h-full">
          <div className="h-full rounded-[12px] border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface)] p-6 sm:p-8 flex flex-col justify-between gap-6 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                  03A / BUILD
                </span>
                <Cpu className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
                Architecture,{" "}
                <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                  Algorithms &amp; AI
                </span>
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                Deep practice across C++20 pointer mechanics, React + TypeScript system interfaces, Express backends, and YOLOv8 edge computer vision pipelines.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-[var(--text-muted)] border-t border-[var(--border)]">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-[var(--accent)]" /> C++20 · TypeScript · Python
                </span>
                <span>React · Node · Express · PyTorch</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => onNavigateTab("skills")}
                className="btn btn-primary group"
              >
                <span>Skills &amp; Stack</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab("ecosystem")}
                className="btn btn-secondary"
              >
                <span>System Blueprints</span>
              </button>
            </div>
          </div>
        </EditorialReveal>

        <EditorialReveal delay={0.08} className="h-full">
          <div className="h-full rounded-[12px] border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-2)] p-6 sm:p-8 flex flex-col justify-between gap-6 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                  03B / EXPLORE
                </span>
                <Tv className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
                Visual Media,{" "}
                <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                  Notes &amp; Athletics
                </span>
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                Outside engineering: directing digital media on Obsidian Optics (153,049 snapshot views as of Oct 2026), publishing technical reflections, and competing as a 3× inter-school table tennis champion.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-[var(--text-muted)] border-t border-[var(--border)]">
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[var(--accent)]" /> 3× Table Tennis Champion
                </span>
                <span>Obsidian Optics · Journal</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => onNavigateTab("showcase")}
                className="btn btn-secondary group"
              >
                <span>YouTube Showcase</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab("journal")}
                className="btn btn-secondary"
              >
                <span>Engineering Journal</span>
              </button>
            </div>
          </div>
        </EditorialReveal>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <ProjectCaseStudyModal
            project={selectedProject}
            repo={findRepoForProject(selectedProject)}
            projects={homeFeaturedPool}
            onSelectProject={setSelectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default HomeEditorialChapters;
