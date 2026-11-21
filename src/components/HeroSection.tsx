import { memo, useMemo, useState, Suspense } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowDown, RotateCw, Github, GitCommit, Cpu, UserCheck } from "lucide-react";
import { useGithub } from "../hooks/useGithub";
import { siteContent, SOCIAL_LINKS } from "../data/siteContent";
import { formatRelativeTime, formatSyncAge } from "../services/github";
import { ResumeSpotlight } from "./ResumeSpotlight";
import { ContourBackground } from "./motion/ContourBackground";
import { lazyWithRetry } from "../utils/lazyWithRetry";
import {
  ImageCurtainReveal,
  LineReveal,
  MagneticAction,
  PointerReactiveVisual,
  StaggerGroup,
  StaggerItem,
  TextMaskReveal,
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

  const {
    user,
    events,
    stats,
    latestRepo,
    latestEvent,
    loading,
    syncedAt,
    refresh,
  } = useGithub();

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
      className="relative w-full min-h-0 lg:min-h-[calc(100svh-7rem)] flex flex-col justify-between overflow-hidden bg-[var(--bg)] py-4 sm:py-8 lg:py-12"
    >
      {/* Animated Topographic Contour Canvas */}
      <ContourBackground density="medium" tone="adaptive" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center my-auto py-1 sm:py-2">
        {/* LEFT MONUMENTAL EDITORIAL COLUMN */}
        <div className="lg:col-span-7 flex flex-col justify-start text-left min-w-0">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION_DURATION.normal, ease: MOTION_EASE.out }}
            className="editorial-overline text-[var(--accent)] mb-3 sm:mb-5"
          >
            COMPUTER SCIENCE · AI &amp; ML · KIIT UNIVERSITY
          </motion.p>

          <h1
            className="editorial-display-xl text-[var(--text)]"
            style={{ fontSize: "clamp(2.35rem, 6.8vw, 6.4rem)" }}
          >
            <TextMaskReveal immediate delay={0.04}>SAYAM</TextMaskReveal>
            <br />
            <TextMaskReveal immediate delay={0.14}>MUKHERJEE</TextMaskReveal>
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: MOTION_DURATION.enter,
              delay: 0.22,
              ease: MOTION_EASE.out,
            }}
            className="mt-5 sm:mt-7 max-w-2xl text-lg sm:text-2xl lg:text-[1.95rem] leading-[1.2] text-[var(--text)] font-medium"
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
              delay: 0.28,
              ease: MOTION_EASE.out,
            }}
            className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]"
          >
            {siteContent.hero.description} Open to software engineering internships, systems &amp; ML research, and collaborative product builds.
          </motion.p>

          {/* Primary & Secondary Action Cluster */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: MOTION_DURATION.enter,
              delay: 0.34,
              ease: MOTION_EASE.out,
            }}
            className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3"
          >
            <MagneticAction strength={0.18}>
              <button
                type="button"
                onClick={onViewWork}
                className="btn btn-primary group"
              >
                <span>EXPLORE MY WORK</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </MagneticAction>

            <ResumeSpotlight onOpenViewer={onOpenResume} />

            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors group"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>

        {/* RIGHT GALLERY-SCALE PORTRAIT / 3D ORBITAL STAGE (UNBOXED EDITORIAL COMPOSITION) */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: MOTION_DURATION.enter,
            delay: 0.16,
            ease: MOTION_EASE.out,
          }}
          className="lg:col-span-5 flex flex-col gap-3 w-full min-w-0 lg:items-end"
        >
          <div className="w-full min-w-0 max-w-[470px] space-y-3">
            {/* Clean External Mode Controls (Never overlaid with backdrop-blur on WebGL canvas) */}
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
              <span className="text-[var(--text-muted)] uppercase tracking-[0.12em]">
                {stageMode === "portrait" ? "00 / Portrait" : "00 / 3D Orbital Core"}
              </span>

              <div className="flex items-center gap-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-0.5">
                <button
                  type="button"
                  onClick={() => setStageMode("portrait")}
                  className={`inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    stageMode === "portrait"
                      ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
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
                      ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                  aria-pressed={stageMode === "orbital"}
                >
                  <Cpu className="w-3 h-3" aria-hidden="true" />
                  <span>3D Core</span>
                </button>
              </div>
            </div>

            {/* Portrait / WebGL Mount */}
            <PointerReactiveVisual maxTiltDeg={4.5} className="w-full">
              <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-[8px] bg-[#151713]">
                {stageMode === "portrait" ? (
                  <ImageCurtainReveal immediate delay={0.18} className="h-full w-full">
                    <img
                      src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg"
                      alt="Sayam Mukherjee portrait"
                      loading="eager"
                      decoding="async"
                      className="h-full w-full object-cover object-[50%_18%] contrast-[1.04]"
                    />
                  </ImageCurtainReveal>
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

                {stageMode === "portrait" && (
                  <>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#151713]/90 via-[#151713]/40 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 py-3 text-[#F4F4ED]">
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-[0.1em]">
                        <span className="font-semibold">SAYAM MUKHERJEE</span>
                        <span className="text-[#C7E34A] tabular-nums font-bold">
                          CGPA 9.06 · KIIT&apos;29
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </PointerReactiveVisual>

            {/* Single-Line Commit Ticker (Replaces Heavy Boxed Stats Card) */}
            <div className="flex items-center justify-between gap-3 pt-1 text-[11px] font-mono border-t border-[var(--border)]">
              <a
                href={latestCommitInfo.commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 min-w-0 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors group"
              >
                <GitCommit className="w-3.5 h-3.5 shrink-0 text-[var(--accent)]" />
                <span className="truncate font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
                  {latestCommitInfo.repoName}@{latestCommitInfo.sha}
                </span>
                <span aria-hidden="true" className="hidden sm:inline text-[var(--text-faint)]">·</span>
                <span className="hidden sm:inline truncate text-[var(--text-muted)]">
                  {latestCommitInfo.message}
                </span>
              </a>

              <div className="flex items-center gap-1.5 shrink-0 text-[var(--text-muted)]">
                <span className="tabular-nums">{formatSyncAge(syncedAt)}</span>
                <button
                  type="button"
                  onClick={() => refresh()}
                  disabled={loading}
                  title="Refresh live GitHub commit telemetry"
                  aria-label="Refresh live GitHub commit telemetry"
                  className="min-w-[30px] min-h-[30px] inline-flex items-center justify-center rounded-[4px] hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                >
                  <RotateCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
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
              <a
                href={user?.html_url || SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors"
              >
                @{user?.login || "codesbysayam"}
              </a>
            </StaggerItem>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <StaggerItem distance={6}>
              <span>KIIT University, Bhubaneswar · CSE (AI &amp; ML)</span>
            </StaggerItem>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <StaggerItem distance={6}>
              <span className="tabular-nums font-semibold text-[var(--text)]">9.06 First-Year CGPA</span>
            </StaggerItem>
            <span className="hidden md:inline" aria-hidden="true">·</span>
            <StaggerItem distance={6} className="hidden md:inline-block">
              <span>{user ? `${user.public_repos} Public Repos` : "11 Public Repos"}</span>
            </StaggerItem>
          </StaggerGroup>

          <button
            type="button"
            onClick={scrollToChapters}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text)] active:opacity-75 active:scale-[0.97] transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded px-1.5 py-1"
          >
            <span>Scroll to explore</span>
            <ArrowDown className="w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

const HeroSection = memo(HeroSectionComponent);
export default HeroSection;
