import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Layers } from "lucide-react";
import type { ProjectItem } from "../../data/projects";
import { getProjectMedia } from "../../data/projectMedia";
import type { GitHubRepo } from "../../services/github";
import { usePrefersReducedMotion } from "../../motion/tokens";
import { ensureGsapRegistered, Flip } from "../../motion/gsapRegistry";
import "./arc-card-carousel.css";

interface ArcCardCarouselProps {
  projects: ProjectItem[];
  repoMap?: Record<string, GitHubRepo>;
  onSelectProject: (project: ProjectItem) => void;
  onActiveChange?: (project: ProjectItem) => void;
  title?: string;
}

export function ArcCardCarousel({
  projects,
  repoMap = {},
  onSelectProject,
  onActiveChange,
  title = "Interactive Project Arc Deck",
}: ArcCardCarouselProps) {
  const reduced = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const dragStartXRef = useRef<number | null>(null);
  const dragDeltaRef = useRef(0);
  const didDragRef = useRef(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (activeIndex >= projects.length && projects.length > 0) {
      setActiveIndex(0);
    }
  }, [projects.length, activeIndex]);

  const count = projects.length;
  const activeProject = projects[activeIndex] ?? projects[0] ?? null;

  const stepTo = useCallback(
    (nextIndex: number) => {
      if (count <= 0) return;
      const clamped = Math.max(0, Math.min(count - 1, nextIndex));
      if (clamped === activeIndex) return;

      const targetProject = projects[clamped];
      if (!reduced && detailsRef.current) {
        ensureGsapRegistered();
        const state = Flip.getState(detailsRef.current);
        setActiveIndex(clamped);
        if (targetProject) onActiveChange?.(targetProject);
        requestAnimationFrame(() => {
          if (!detailsRef.current?.isConnected) return;
          Flip.from(state, {
            duration: 0.34,
            ease: "power2.out",
            simple: true,
          });
        });
      } else {
        setActiveIndex(clamped);
        if (targetProject) onActiveChange?.(targetProject);
      }
    },
    [count, activeIndex, projects, onActiveChange, reduced]
  );

  const handlePrev = useCallback(() => stepTo(activeIndex - 1), [activeIndex, stepTo]);
  const handleNext = useCallback(() => stepTo(activeIndex + 1), [activeIndex, stepTo]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      handleNext();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement)?.closest("button, a")) return;
    dragStartXRef.current = e.clientX;
    dragDeltaRef.current = 0;
    didDragRef.current = false;
    setDragOffsetPx(0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return;
    const rawDelta = e.clientX - dragStartXRef.current;
    if (Math.abs(rawDelta) > 8) {
      didDragRef.current = true;
    }
    const clampedDelta = Math.max(-140, Math.min(140, rawDelta));
    dragDeltaRef.current = clampedDelta;
    setDragOffsetPx(clampedDelta);
  };

  const handlePointerUp = () => {
    if (dragStartXRef.current === null) return;
    const delta = dragDeltaRef.current;
    dragStartXRef.current = null;
    dragDeltaRef.current = 0;
    setDragOffsetPx(0);
    if (delta > 48 && activeIndex > 0) {
      handlePrev();
    } else if (delta < -48 && activeIndex < count - 1) {
      handleNext();
    }
    window.setTimeout(() => {
      didDragRef.current = false;
    }, 0);
  };

  const activeMedia = useMemo(
    () => (activeProject ? getProjectMedia(activeProject.id) : null),
    [activeProject]
  );

  if (!activeProject) return null;

  const activeRepo =
    repoMap[activeProject.githubRepoName?.toLowerCase() || ""] || null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="arc-carousel-shell p-4 sm:p-6 space-y-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
    >
      {/* Top Deck Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5 text-xs font-mono">
          <Layers className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
          <span className="uppercase tracking-[0.12em] font-semibold text-[var(--accent)]">
            {title}
          </span>
          <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>
          <span className="text-[var(--text-muted)] tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-[11px] font-mono text-[var(--text-muted)] mr-1">
            Drag arc or use Arrow keys
          </span>
          <button
            type="button"
            onClick={handlePrev}
            disabled={count <= 1 || activeIndex <= 0}
            aria-label="Previous project in arc"
            className="w-9 h-9 rounded-[6px] border border-[var(--border-strong)] bg-[var(--surface)] hover:border-[var(--accent)] text-[var(--text)] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={count <= 1 || activeIndex >= count - 1}
            aria-label="Next project in arc"
            className="w-9 h-9 rounded-[6px] border border-[var(--border-strong)] bg-[var(--surface)] hover:border-[var(--accent)] text-[var(--text)] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Arc Stage */}
      <div
        className="arc-carousel-stage cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {projects.map((project, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          if (absOffset > 2) return null;

          const isActive = offset === 0;
          const media = getProjectMedia(project.id);

          const dragFraction = dragOffsetPx / 180;
          const shiftedOffset = offset + dragFraction;

          const xSpacing = isMobile ? 168 : 258;
          const x = reduced ? offset * 280 : shiftedOffset * xSpacing;
          const y = reduced ? 0 : Math.abs(shiftedOffset) * Math.abs(shiftedOffset) * (isMobile ? 18 : 24);
          const rotateZ = reduced ? 0 : shiftedOffset * (isMobile ? 5.5 : 7.5);
          const scale = reduced ? (isActive ? 1 : 0.92) : Math.max(0.76, 1 - Math.abs(shiftedOffset) * 0.11);
          const opacity = absOffset > 2 ? 0 : Math.max(0.32, 1 - absOffset * 0.28);
          const zIndex = 20 - absOffset * 5;

          return (
            <motion.article
              key={project.id}
              data-active={isActive}
              style={{
                zIndex,
                transformOrigin: "center bottom",
              }}
              animate={{
                x,
                y,
                rotate: rotateZ,
                scale,
                opacity,
              }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: 260,
                      damping: 26,
                      mass: 0.75,
                    }
              }
              onClick={() => {
                if (didDragRef.current) return;
                if (isActive) {
                  onSelectProject(project);
                } else {
                  stepTo(index);
                }
              }}
              className="arc-card-slot cursor-pointer select-none"
            >
              <div className="arc-card-media">
                {!media.isMissing && media.src ? (
                  <img
                    src={media.src}
                    alt={media.alt}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 font-mono text-xs text-[#F4F4ED]">
                    {project.title}
                  </div>
                )}

                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-[4px] bg-[#151713]/85 text-[#C7E34A] border border-[#41443A] font-mono text-[10px] font-bold uppercase tracking-wider">
                  {project.categoryFilter}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                  <span className="truncate">{project.status}</span>
                  <span className="tabular-nums font-semibold text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-extrabold text-[var(--text)] truncate">
                  {project.title}
                </h3>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {project.shortDescription}
                </p>

                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[var(--text-muted)] truncate">
                    {project.techStack.slice(0, 3).join(" · ")}
                  </span>
                  <span className="text-[var(--accent)] font-bold shrink-0 inline-flex items-center gap-1">
                    {isActive ? "Open" : "Focus"}
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Synchronized Active Project Dock + Dot Controls */}
      <div
        ref={detailsRef}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-[var(--border)]"
      >
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="font-bold text-[var(--text)]">{activeProject.title}</span>
            <span className="text-[var(--text-faint)]">·</span>
            <span className="text-[var(--text-muted)] truncate">
              {activeMedia?.caption || activeProject.subtitle}
            </span>
          </div>
          {activeRepo && (
            <div className="text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
              GitHub: {activeRepo.full_name} · {activeRepo.stargazers_count} stars · {activeRepo.forks_count} forks
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 mr-2" role="tablist" aria-label="Select project slide">
            {projects.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Focus ${p.title}`}
                onClick={() => stepTo(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === activeIndex
                    ? "w-6 bg-[var(--accent)]"
                    : "w-2 bg-[var(--border-strong)] hover:bg-[var(--text-muted)]"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => onSelectProject(activeProject)}
            className="btn btn-primary !min-h-[38px] !py-1.5 !px-3.5 !text-xs"
          >
            <span>Inspect Case Study</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={activeProject.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary !min-h-[38px] !py-1.5 !px-3 !text-xs"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default ArcCardCarousel;
