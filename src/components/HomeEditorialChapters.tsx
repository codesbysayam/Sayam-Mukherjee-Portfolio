import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowUpRight, Github, Code2, Cpu, Tv, Trophy, Sparkles } from "lucide-react";
import { PROJECTS, ProjectItem } from "../data/projects";
import { getProjectMedia } from "../data/projectMedia";
import { useGithub } from "../hooks/useGithub";
import { ProjectCaseStudyModal } from "./projects/ProjectCaseStudyModal";
import { ProjectMedia } from "./projects/ProjectMedia";
import { computeProjectLifecycle } from "../utils/projectLifecycle";
import {
  EditorialReveal,
  HorizontalTrack,
  MagneticAction,
  MaskMediaReveal,
  ScrollScaleImage,
  TextMaskReveal,
} from "../motion/Reveal";
import { ContourBackground } from "./motion/ContourBackground";
import { SectionHeading } from "./ui/SectionHeading";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../motion/tokens";

interface HomeEditorialChaptersProps {
  onNavigateTab: (
    tab: "about" | "projects" | "skills" | "ecosystem" | "journal" | "showcase" | "contact"
  ) => void;
}

const CONSTELLATION_SKILLS = [
  {
    id: "typescript",
    label: "TypeScript",
    note: "Type-safe full-stack UI & state planes",
    matchTerms: ["TypeScript", "Next.js", "React"],
  },
  {
    id: "python",
    label: "Python",
    note: "FastAPI inference services & numerical analysis",
    matchTerms: ["Python", "FastAPI", "YOLOv8"],
  },
  {
    id: "ai-agents",
    label: "Multi-Agent & ML",
    note: "Human-in-the-loop governance & recurrent state",
    matchTerms: ["Multi-Agent", "AI", "Neural", "Recurrent", "In-Context", "YOLOv8"],
  },
  {
    id: "cpp",
    label: "C++ & DSA",
    note: "Low-overhead algorithmic foundations",
    matchTerms: ["C++", "Algorithms", "Data Structures"],
  },
  {
    id: "visualization",
    label: "D3 & Telemetry",
    note: "Interactive scientific charts & live canvases",
    matchTerms: ["D3", "KaTeX", "Canvas", "Visualization", "Telemetry"],
  },
] as const;

export const HomeEditorialChapters: React.FC<HomeEditorialChaptersProps> = ({
  onNavigateTab,
}) => {
  const { repos } = useGithub();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeSkillId, setActiveSkillId] = useState<string>(CONSTELLATION_SKILLS[0].id);
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

  const activeSkill = useMemo(
    () => CONSTELLATION_SKILLS.find((s) => s.id === activeSkillId) || CONSTELLATION_SKILLS[0],
    [activeSkillId]
  );

  const connectedProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      const haystack = [
        ...project.techStack,
        project.categoryFilter,
        project.shortDescription,
        project.subtitle,
      ]
        .join(" ")
        .toLowerCase();
      return activeSkill.matchTerms.some((term) => haystack.includes(term.toLowerCase()));
    });
  }, [activeSkill]);

  return (
    <>
      {/* ====================================================================
          CHAPTER 01: OPEN EDITORIAL ABOUT SPREAD (UNBOXED PAPER RHYTHM)
          ==================================================================== */}
      <section
        id="home-about-chapter"
        aria-labelledby="home-about-heading"
        className="relative overflow-hidden w-full border-t border-[var(--border)] py-12 sm:py-16 lg:py-20"
      >
        <ContourBackground density="subtle" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-6">
            <EditorialReveal delay={0}>
              <span className="inline-block editorial-overline text-[var(--accent)]">
                01 / A Little About Me
              </span>
            </EditorialReveal>

            <h2
              id="home-about-heading"
              className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-[-0.03em] leading-[1.03] text-[var(--text)]"
            >
              <TextMaskReveal>Building systems from</TextMaskReveal>{" "}
              <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                first principles
              </span>{" "}
              with disciplined execution.
            </h2>

            <EditorialReveal delay={0.12}>
              <p className="text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] max-w-2xl">
                I am a 2nd-year Computer Science &amp; Engineering (AI &amp; ML) undergraduate at KIIT University, Bhubaneswar, originally from Hooghly, West Bengal. Alongside maintaining a 9.06 first-year CGPA, I engineer full-stack React and TypeScript systems, multi-agent human-in-the-loop workflows, and daily C++ algorithmic implementations.
              </p>
            </EditorialReveal>

            {/* Hairline Editorial Ledger Rows */}
            <EditorialReveal delay={0.16}>
              <div className="border-t border-[var(--border)] divide-y divide-[var(--border)] max-w-2xl">
                <div className="hairline-row py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Academic Benchmark
                  </span>
                  <div className="flex items-baseline gap-2.5 sm:text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-[var(--text)]">
                      9.06
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      / 10.0 CGPA · Year 1 · KIIT CSE (AI &amp; ML)
                    </span>
                  </div>
                </div>

                <div className="hairline-row py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Verified Engineering Output
                  </span>
                  <div className="flex items-baseline gap-2.5 sm:text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-[var(--accent)]">
                      {PROJECTS.length} Builds
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      Mapped directly to public repositories
                    </span>
                  </div>
                </div>
              </div>
            </EditorialReveal>

            <EditorialReveal delay={0.2}>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <MagneticAction strength={0.16}>
                  <button
                    type="button"
                    onClick={() => onNavigateTab("about")}
                    className="btn btn-primary group"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </MagneticAction>
                <button
                  type="button"
                  onClick={() => onNavigateTab("skills")}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors cursor-pointer py-2"
                >
                  <span>Inspect Technical Stack</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </EditorialReveal>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <ScrollScaleImage className="rounded-[8px] overflow-hidden bg-[#151713] aspect-[4/4.4]">
              <img
                src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg"
                alt="Sayam Mukherjee editorial portrait"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-[50%_18%] grayscale hover:grayscale-0 transition-all duration-700"
              />
            </ScrollScaleImage>
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border)]">
              <span>Bhubaneswar, Odisha · India</span>
              <span className="tabular-nums text-[var(--text)] font-semibold">B.Tech&apos;29</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          CHAPTER 02: SELECTED ENGINEERING WORK (DEEP INK CONTRAST CHAPTER)
          ==================================================================== */}
      <section
        id="home-work-chapter"
        aria-labelledby="home-featured-work-heading"
        className="relative overflow-hidden w-full bg-[#151713] text-[#F4F4ED] rounded-[10px] px-5 py-12 sm:px-10 sm:py-16 lg:px-12"
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
            className="mb-12"
            rightSlot={
              <MagneticAction strength={0.14}>
                <button
                  type="button"
                  onClick={() => onNavigateTab("projects")}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-[6px] bg-[#C7E34A] text-[#151713] font-bold text-sm hover:bg-[#A9C52F] active:bg-[#9BB827] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <span>VIEW ALL {PROJECTS.length} PROJECTS</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </MagneticAction>
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
                className="border-t border-b border-[#41443A] py-8 sm:py-10 mb-10 group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                  <MaskMediaReveal className="lg:col-span-7 relative aspect-[16/10] w-full overflow-hidden rounded-[8px] border border-[#41443A] bg-[#20231D]">
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
                        className="!h-full w-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-[#C7E34A] text-[#151713] flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </button>
                  </MaskMediaReveal>

                  <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        <span className="text-[#C7E34A] uppercase tracking-[0.12em] font-semibold">
                          01 · LEAD SYSTEM · {featuredLead.categoryFilter}
                        </span>
                        <span title={leadLifecycle.title} className="text-[#B5B8AA]">
                          {leadLifecycle.label} · {featuredLead.status}
                        </span>
                      </div>

                      <h3 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-[#F4F4ED]">
                        {featuredLead.title}
                      </h3>

                      <p className="text-sm font-mono text-[#B5B8AA]">
                        {featuredLead.subtitle}
                      </p>

                      <p className="text-sm sm:text-base leading-relaxed text-[#D4D6CA]">
                        {featuredLead.shortDescription}
                      </p>

                      <div className="pt-3 border-t border-[#41443A] flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-mono text-[#B5B8AA]">
                        {featuredLead.techStack.slice(0, 5).map((tech) => (
                          <span key={tech}>· {tech}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(featuredLead)}
                        className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-[6px] bg-[#C7E34A] text-[#151713] text-xs font-bold uppercase tracking-wider hover:bg-[#A9C52F] active:bg-[#9BB827] active:scale-[0.98] transition-all cursor-pointer group/btn"
                      >
                        <span>Read Case Study</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </button>

                      {featuredLead.liveUrl && (
                        <a
                          href={featuredLead.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-[6px] border border-[#41443A] text-[#F4F4ED] text-xs font-semibold hover:bg-[#F4F4ED] hover:text-[#151713] transition-all"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <a
                        href={featuredLead.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 min-h-[44px] px-3 text-[#B5B8AA] text-xs font-semibold hover:text-[#C7E34A] transition-colors"
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

          {/* SECONDARY FEATURED WORK: HORIZONTAL EDITORIAL RAIL */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#B5B8AA]">
              <span className="uppercase tracking-[0.14em] text-[#C7E34A]">
                Featured Case Studies · 02 — 04
              </span>
              <span className="hidden sm:inline">Scroll horizontally or inspect any card</span>
            </div>

            <HorizontalTrack>
              {secondaryFeatured.map((project, index) => {
                const media = getProjectMedia(project.id);
                const repo = findRepoForProject(project);
                return (
                  <motion.article
                    key={project.id}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: "some" }}
                    transition={{
                      duration: MOTION_DURATION.enter,
                      delay: index * 0.06,
                      ease: MOTION_EASE.out,
                    }}
                    className="project-card flex flex-col justify-between rounded-[8px] border border-[#41443A] focus-within:border-[#C7E34A] hover:border-[#69734A] bg-[#20231D] group transition-colors"
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

                        <h3 className="text-xl font-extrabold font-display text-[#F4F4ED]">
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
                            className="text-[#F4F4ED] hover:text-[#C7E34A] inline-flex items-center gap-1 transition-all min-h-[40px] px-1.5"
                          >
                            <span>Live</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B5B8AA] hover:text-[#F4F4ED] inline-flex items-center gap-1 transition-all min-h-[40px] px-1.5"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Repo</span>
                        </a>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </HorizontalTrack>
          </div>
        </div>
      </section>

      {/* ====================================================================
          INTERACTIVE SKILL-TO-PROJECT CONSTELLATION
          ==================================================================== */}
      <section
        aria-label="Interactive Skill to Project Constellation"
        className="w-full border-t border-[var(--border)] py-10 sm:py-14 space-y-7"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="editorial-overline text-[var(--accent)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Evidence Matrix
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
              Inspect skills linked to{" "}
              <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                shipped systems.
              </span>
            </h2>
          </div>

          <div
            className="flex flex-wrap items-center gap-1.5 p-1 rounded-[8px] border border-[var(--border)] bg-[var(--surface)]"
            role="tablist"
            aria-label="Select technical competency"
          >
            {CONSTELLATION_SKILLS.map((skill) => {
              const isSelected = skill.id === activeSkillId;
              return (
                <button
                  key={skill.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveSkillId(skill.id)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-[6px] transition-colors cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-[#C7E34A] text-[#151713] font-bold"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {skill.label}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSkill.id}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduced ? 0 : MOTION_DURATION.fast, ease: MOTION_EASE.out }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)] pb-2 border-b border-[var(--border)]">
              <span>{activeSkill.note}</span>
              <span className="tabular-nums text-[var(--accent)] font-semibold">
                {connectedProjects.length} Connected{" "}
                {connectedProjects.length === 1 ? "Project" : "Projects"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="text-left p-5 rounded-[8px] border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface)]/50 hover:bg-[var(--surface)] transition-all cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-[var(--accent)]">
                      <span>{project.categoryFilter}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)] truncate">
                    {project.techStack.slice(0, 4).join(" · ")}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ====================================================================
          CHAPTER 03: BUILD / EXPLORE DUALITY BAND (OPEN EDITORIAL SPLIT)
          ==================================================================== */}
      <section
        id="home-duality-chapter"
        aria-label="Engineering vs Creative Exploration"
        className="w-full border-t border-[var(--border)] py-10 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 md:divide-x md:divide-[var(--border)]"
      >
        <EditorialReveal delay={0} className="md:pr-8 lg:pr-12 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                03A / BUILD
              </span>
              <Cpu className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-[var(--text)]">
              Architecture,{" "}
              <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                Algorithms &amp; AI
              </span>
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
              Deep practice across C++20 pointer mechanics, React + TypeScript system interfaces, Express backends, and YOLOv8 edge computer vision pipelines.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 text-xs font-mono text-[var(--text-muted)] border-t border-[var(--border)]">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[var(--accent)]" /> C++20 · TypeScript · Python
              </span>
              <span>React · Node · Express · PyTorch</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
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
        </EditorialReveal>

        <EditorialReveal delay={0.08} className="md:pl-8 lg:pl-12 pt-8 md:pt-0 border-t md:border-t-0 border-[var(--border)] flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                03B / EXPLORE
              </span>
              <Tv className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-[var(--text)]">
              Visual Media,{" "}
              <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                Notes &amp; Athletics
              </span>
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
              Outside engineering: directing digital media on Obsidian Optics (153,049 snapshot views as of Oct 2026), publishing technical reflections, and competing as a 3× inter-school table tennis champion.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 text-xs font-mono text-[var(--text-muted)] border-t border-[var(--border)]">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[var(--accent)]" /> 3× Table Tennis Champion
              </span>
              <span>Obsidian Optics · Journal</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
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
