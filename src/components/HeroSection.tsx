import { memo, useMemo, useRef, useState, useEffect, Suspense } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, ArrowDown, RotateCw, Github, GitCommit, Cpu, UserCheck } from "lucide-react";
import { useGithub } from "../hooks/useGithub";
import { siteContent, SOCIAL_LINKS } from "../data/siteContent";
import { formatRelativeTime, formatSyncAge } from "../services/github";
import { ResumeSpotlight } from "./ResumeSpotlight";
import { ContourBackground } from "./motion/ContourBackground";
import { lazyWithRetry } from "../utils/lazyWithRetry";
import {
  LineReveal,
  MaskMediaReveal,
  StaggerGroup,
  StaggerItem,
  TextLineReveal,
} from "../motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../motion/tokens";

const HeroOrbitalSculpture = lazyWithRetry(() => import("./motion/HeroOrbitalSculpture"));

interface HeroSectionProps {
  onViewWork: () => void;
  onOpenResume?: () => void;
  onNavigateContact?: () => void;
}

function HeroSectionComponent({
  onViewWork,
  onOpenResume,
}: HeroSectionProps) {
  const reduced = usePrefersReducedMotion();
  const [stageMode, setStageMode] = useState<"portrait" | "orbital">("portrait");
  const [canTilt, setCanTilt] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const {
    user,
    repos,
    events,
    stats,
    latestRepo,
    latestEvent,
    loading,
    syncedAt,
    refresh,
  } = useGithub();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanTilt(hoverQuery.matches && !reduced);
  }, [reduced]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springConfig = { damping: 26, stiffness: 190, mass: 0.6 };
  const smoothX = useSpring(pointerX, springConfig);
  const smoothY = useSpring(pointerY, springConfig);
  const tiltRotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4]);
  const tiltRotateY = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);
  const parallaxX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const parallaxY = useTransform(smoothY, [-0.5, 0.5], [-6, 6]);

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleStageMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const latestCommitInfo = useMemo(() => {
    const pushEvent =
      events?.find((e) => e.type === "PushEvent" && e.payload?.commits?.length > 0) ||
      (latestEvent?.type === "PushEvent" ? latestEvent : null);
    const branch = pushEvent?.payload?.ref
      ? pushEvent.payload.ref.replace(/^refs\/heads\//, "")
      : latestRepo?.default_branch || "main";
    const commit = pushEvent?.payload?.commits?.[pushEvent.payload.commits.length - 1];
    const sha = commit?.sha
      ? commit.sha.slice(0, 7)
      : stats?.recentCommits?.[0]?.sha?.slice(0, 7) || "5739270";
    const message =
      commit?.message ||
      stats?.recentCommits?.[0]?.message ||
      "Time: 14 ms (47.31%), Space: 9.3 MB (77.48%) - LeetHub";
    const repoName =
      pushEvent?.repo?.name?.replace(/^[^/]+\//, "") || latestRepo?.name || "sayam-solves";
    const time = pushEvent?.created_at
      ? formatRelativeTime(pushEvent.created_at)
      : latestRepo?.updated_at
        ? formatRelativeTime(latestRepo.updated_at)
        : "recently";
    const commitUrl = `https://github.com/codesbysayam/${repoName}/commit/${sha}`;

    return { branch, sha, message, repoName, time, commitUrl };
  }, [events, latestEvent, latestRepo, stats]);

  const scrollToChapters = () => {
    const target = document.getElementById("home-about-chapter");
    if (target) {
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <section
      id="hero"
      aria-label="Hero Introduction"
      className="relative w-full min-h-[calc(100svh-7.5rem)] flex flex-col justify-between overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg)] px-4 py-6 sm:px-9 sm:py-10 lg:px-12 lg:py-12"
    >
      {/* Animated Topographic Contour Canvas */}
      <ContourBackground density="medium" tone="adaptive" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-2">
        {/* LEFT EDITORIAL COLUMN */}
        <div className="lg:col-span-7 flex flex-col justify-start text-left min-w-0">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION_DURATION.normal, ease: MOTION_EASE.out }}
            className="editorial-overline text-[var(--accent)] mb-4"
          >
            COMPUTER SCIENCE · AI &amp; ML · KIIT UNIVERSITY
          </motion.p>

          <h1
            className="font-display font-extrabold tracking-[-0.04em] leading-[0.89] text-[var(--text)]"
            style={{ fontSize: "clamp(2.55rem, 6.8vw, 6.2rem)" }}
          >
            <TextLineReveal delay={0.04}>SAYAM</TextLineReveal>
            <br />
            <TextLineReveal delay={0.12}>MUKHERJEE</TextLineReveal>
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: MOTION_DURATION.enter,
              delay: 0.18,
              ease: MOTION_EASE.out,
            }}
            className="mt-6 max-w-2xl text-xl sm:text-2xl lg:text-[1.8rem] leading-[1.2] text-[var(--text)] font-medium"
          >
            <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
              Designing autonomous workflows,
            </span>{" "}
            full-stack web platforms, and C++ algorithms that hold up under real constraints.
          </motion.p>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: MOTION_DURATION.enter,
              delay: 0.24,
              ease: MOTION_EASE.out,
            }}
            className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]"
          >
            {siteContent.hero.description} Open to software engineering internships, applied AI research, and collaborative product builds.
          </motion.p>

          {/* Primary & Secondary Action Cluster */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: MOTION_DURATION.enter,
              delay: 0.3,
              ease: MOTION_EASE.out,
            }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={onViewWork}
              className="btn btn-primary group"
            >
              <span>EXPLORE MY WORK</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <ResumeSpotlight onOpenViewer={onOpenResume} />

            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary group"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>

        {/* RIGHT SIGNATURE PORTRAIT / INTERACTIVE 3D STAGE & VERIFIED GITHUB LEDGER */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: MOTION_DURATION.enter,
            delay: 0.14,
            ease: MOTION_EASE.out,
          }}
          className="lg:col-span-5 flex flex-col gap-4 w-full min-w-0 lg:items-end"
        >
          <div className="w-full min-w-0 max-w-[460px] overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface-2)] shadow-[var(--shadow-elevated)]">
            {/* Commanding Hero Visual Stage with Switcher */}
            <div
              ref={frameRef}
              onMouseMove={handleStageMouseMove}
              onMouseLeave={handleStageMouseLeave}
              className="relative aspect-[4/4.35] w-full overflow-hidden border-b border-[var(--border)] bg-[#151713] [perspective:900px]"
            >
              <motion.div
                style={
                  canTilt
                    ? {
                        rotateX: tiltRotateX,
                        rotateY: tiltRotateY,
                        x: parallaxX,
                        y: parallaxY,
                        transformStyle: "preserve-3d",
                      }
                    : undefined
                }
                className="h-full w-full"
              >
                {stageMode === "portrait" ? (
                  <MaskMediaReveal immediate delay={0.18} className="h-full w-full">
                    <img
                      src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg"
                      alt="Sayam Mukherjee portrait"
                      referrerPolicy="no-referrer"
                      loading="eager"
                      decoding="async"
                      className="h-full w-full object-cover object-[50%_18%] contrast-[1.04]"
                    />
                  </MaskMediaReveal>
                ) : (
                  <div className="h-full w-full bg-[#151713]">
                    <Suspense
                      fallback={
                        <div className="flex h-full w-full items-center justify-center bg-[#151713] font-mono text-xs uppercase tracking-wider text-[#B5B8AA]">
                          Loading 3D Core...
                        </div>
                      }
                    >
                      <HeroOrbitalSculpture />
                    </Suspense>
                  </div>
                )}
              </motion.div>

              {/* Subtle Editorial Gradient Scrim & Stage Toggle */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#151713]/92 via-[#151713]/45 to-transparent" />

              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-[6px] border border-[#565A4E] bg-[#151713]/88 p-1 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setStageMode("portrait")}
                  className={`inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    stageMode === "portrait"
                      ? "bg-[#C7E34A] text-[#20231D]"
                      : "text-[#D4D6CA] hover:text-[#F4F4ED]"
                  }`}
                  aria-pressed={stageMode === "portrait"}
                >
                  <UserCheck className="w-3 h-3" aria-hidden="true" />
                  <span>Portrait</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStageMode("orbital")}
                  className={`inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    stageMode === "orbital"
                      ? "bg-[#C7E34A] text-[#20231D]"
                      : "text-[#D4D6CA] hover:text-[#F4F4ED]"
                  }`}
                  aria-pressed={stageMode === "orbital"}
                >
                  <Cpu className="w-3 h-3" aria-hidden="true" />
                  <span>3D Core</span>
                </button>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 py-3 text-[#F4F4ED]">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-[0.1em]">
                  <span className="font-semibold">SAYAM MUKHERJEE</span>
                  <span className="text-[#C7E34A] tabular-nums font-bold">
                    CGPA 9.06 · KIIT&apos;29
                  </span>
                </div>
              </div>
            </div>

            {/* Verified GitHub Compact Telemetry Readout */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <a
                  href={user?.html_url || SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--text)] hover:underline active:opacity-75 inline-flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>@{user?.login || "codesbysayam"}</span>
                </a>

                <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                  <span>{formatSyncAge(syncedAt)}</span>
                  <button
                    type="button"
                    onClick={() => refresh()}
                    disabled={loading}
                    title="Refresh live GitHub data"
                    aria-label="Refresh live GitHub data"
                    className="min-w-[34px] min-h-[34px] inline-flex items-center justify-center rounded-[6px] hover:bg-[var(--surface)] active:bg-[var(--surface-3)] active:scale-[0.94] text-[var(--text-muted)] hover:text-[var(--text)] transition-all cursor-pointer"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-[var(--border)] border-y border-[var(--border)] py-2 text-center">
                <div>
                  <div className="text-base font-bold font-mono tabular-nums text-[var(--text)]">
                    {user ? user.public_repos : repos.length || 11}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Repos
                  </div>
                </div>
                <div>
                  <div className="text-base font-bold font-mono tabular-nums text-[var(--text)]">
                    {stats?.totalStars ?? 0}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Stars
                  </div>
                </div>
                <div>
                  <div className="text-base font-bold font-mono tabular-nums text-[var(--text)]">
                    {user?.followers ?? 0}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Followers
                  </div>
                </div>
              </div>

              <a
                href={latestCommitInfo.commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 hover:border-[var(--border-strong)] active:border-[var(--accent)] active:bg-[var(--surface-3)] active:scale-[0.985] transition-all group"
              >
                <div className="flex items-center justify-between gap-2 min-w-0 text-[11px] font-mono text-[var(--text-muted)] mb-0.5">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--text)] min-w-0">
                    <GitCommit className="w-3.5 h-3.5 shrink-0 text-[var(--accent)]" />
                    <span className="truncate">
                      {latestCommitInfo.repoName}/{latestCommitInfo.branch}@{latestCommitInfo.sha}
                    </span>
                  </span>
                  <span className="shrink-0">{latestCommitInfo.time}</span>
                </div>
                <p className="text-xs font-mono text-[var(--text-secondary)] line-clamp-1 group-hover:text-[var(--text)]">
                  {latestCommitInfo.message}
                </p>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM VERIFIED PROOF STRIP + RESTRAINED SCROLL CUE */}
      <div className="relative z-10 mt-6">
        <LineReveal immediate delay={0.34} className="mb-4" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <StaggerGroup
            immediate
            delayChildren={0.32}
            stagger={0.04}
            className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-muted)]"
          >
            <StaggerItem distance={6}>
              <span className="font-semibold text-[var(--text)]">KIIT University, Bhubaneswar</span>
            </StaggerItem>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <StaggerItem distance={6}>
              <span>B.Tech CSE (AI &amp; ML) · Class of 2029</span>
            </StaggerItem>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <StaggerItem distance={6}>
              <span className="tabular-nums font-semibold text-[var(--text)]">9.06 First-Year CGPA</span>
            </StaggerItem>
            <span className="hidden md:inline" aria-hidden="true">·</span>
            <StaggerItem distance={6} className="hidden md:inline-block">
              <span>Hooghly / Bhubaneswar</span>
            </StaggerItem>
          </StaggerGroup>

          <button
            type="button"
            onClick={scrollToChapters}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text)] active:opacity-75 active:scale-[0.97] transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7E34A] rounded px-1.5 py-1"
          >
            <span>Scroll to explore</span>
            <motion.span
              aria-hidden="true"
              animate={reduced ? undefined : { y: [0, 3, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center"
            >
              <ArrowDown className="w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-200 group-hover:translate-y-0.5" />
            </motion.span>
          </button>
        </div>
      </div>
    </section>
  );
}

const HeroSection = memo(HeroSectionComponent);
export default HeroSection;
