import { memo, useMemo, Suspense } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowDown, RotateCw, Github, GitCommit } from "lucide-react";
import { useGithub } from "../hooks/useGithub";
import { siteContent, SOCIAL_LINKS } from "../data/siteContent";
import { formatRelativeTime, formatSyncAge } from "../services/github";
import { ResumeSpotlight } from "./ResumeSpotlight";
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
      className="relative w-full overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg)] px-4 py-6 sm:px-9 sm:py-11 lg:px-12 lg:py-14"
    >
      {/* Subtle Architectural Contour Lines */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 640"
        fill="none"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.055] dark:opacity-[0.07]"
      >
        <path
          d="M-60 480C180 410 290 540 520 460C760 375 880 180 1260 220"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          d="M-40 530C220 470 360 595 590 505C830 410 930 240 1280 280"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M-80 140C160 190 340 60 590 120C820 175 940 310 1240 110"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M-80 190C190 235 380 115 620 170C850 225 970 355 1260 165"
          stroke="currentColor"
          strokeWidth="0.9"
        />
      </svg>

      <div className="relative z-10 hero-grid">
        {/* LEFT EDITORIAL COLUMN */}
        <div className="flex flex-col justify-start text-left min-w-0">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION_DURATION.normal, ease: MOTION_EASE.out }}
            className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)] mb-4"
          >
            COMPUTER SCIENCE · AI &amp; ML · KIIT UNIVERSITY
          </motion.p>

          <h1 className="hero-title font-display font-extrabold tracking-[-0.035em] text-[var(--text)]">
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
            className="mt-5 max-w-2xl text-xl sm:text-2xl lg:text-[1.75rem] leading-[1.22] text-[var(--text)] font-medium"
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
            className="mt-7 flex flex-wrap items-center gap-3"
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

        {/* RIGHT PORTRAIT, INTERACTIVE 3D CORE & VERIFIED GITHUB TELEMETRY COLUMN */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: MOTION_DURATION.enter,
            delay: 0.14,
            ease: MOTION_EASE.out,
          }}
          className="flex flex-col gap-4 w-full lg:items-end"
        >
          <div className="w-full max-w-[500px] overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)]">
            {/* Visual Dual Stage: Portrait + Procedural Three.js Machined Logic Core */}
            <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-[var(--border)]">
              <MaskMediaReveal
                immediate
                delay={0.18}
                className="sm:col-span-7 relative h-[220px] sm:h-[244px] overflow-hidden bg-[var(--surface)] border-b sm:border-b-0 sm:border-r border-[var(--border)]"
              >
                <img
                  src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg"
                  alt="Sayam Mukherjee portrait"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover object-[50%_20%] contrast-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#151713]/85 via-[#151713]/30 to-transparent px-3.5 py-2.5 text-[#F4F4ED]">
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.08em]">
                    <span>SAYAM MUKHERJEE</span>
                    <span className="text-[#C7E34A] tabular-nums">CGPA 9.06 · KIIT&apos;29</span>
                  </div>
                </div>
              </MaskMediaReveal>

              <div className="sm:col-span-5 h-[210px] sm:h-[244px] bg-[#151713]">
                <Suspense
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-[#151713] font-mono text-[10px] uppercase tracking-wider text-[#B5B8AA]">
                      3D Stage
                    </div>
                  }
                >
                  <HeroOrbitalSculpture />
                </Suspense>
              </div>
            </div>

            {/* Verified GitHub Compact Telemetry Readout */}
            <div className="p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <a
                  href={user?.html_url || SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--text)] hover:underline inline-flex items-center gap-1.5"
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
                    className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-[var(--border)] border-y border-[var(--border)] py-2.5 text-center">
                <div>
                  <div className="text-base font-bold font-mono tabular-nums text-[var(--text)]">
                    {user ? user.public_repos : repos.length || 5}
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Repos
                  </div>
                </div>
                <div>
                  <div className="text-base font-bold font-mono tabular-nums text-[var(--text)]">
                    {stats?.totalStars ?? 0}
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Stars
                  </div>
                </div>
                <div>
                  <div className="text-base font-bold font-mono tabular-nums text-[var(--text)]">
                    {user?.followers ?? 0}
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Followers
                  </div>
                </div>
              </div>

              <a
                href={latestCommitInfo.commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 hover:border-[var(--border-strong)] transition-colors group"
              >
                <div className="flex items-center justify-between gap-2 min-w-0 text-[11px] font-mono text-[var(--text-muted)] mb-1">
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
      <div className="relative z-10 mt-8">
        <LineReveal immediate delay={0.34} className="mb-5" />
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
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7E34A] rounded px-1.5 py-1"
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
