import { memo, useEffect, useRef, useState, Suspense } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowDown, Cpu, UserCheck, Mail } from "lucide-react";
import { siteContent, SOCIAL_LINKS } from "../data/siteContent";
import { ContourBackground } from "./motion/ContourBackground";
import { lazyWithRetry } from "../utils/lazyWithRetry";
import {
  ImageCurtainReveal,
  LineReveal,
  MagneticAction,
  PointerReactiveVisual,
  TextMaskReveal,
} from "../motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../motion/tokens";
import {
  ensureGsapRegistered,
  gsap,
  MOTION_BREAKPOINTS,
  requestScrollTriggerRefresh,
} from "../motion/gsapRegistry";

const HeroOrbitalSculpture = lazyWithRetry(() => import("./motion/HeroOrbitalSculpture"));

interface HeroSectionProps {
  onViewWork: () => void;
  onOpenResume?: () => void;
  onNavigateContact?: () => void;
}

function HeroSectionComponent({
  onViewWork,
  onNavigateContact,
}: HeroSectionProps) {
  const reduced = usePrefersReducedMotion();
  const [stageMode, setStageMode] = useState<"portrait" | "orbital">("portrait");
  const [portraitFailed, setPortraitFailed] = useState(false);
  const heroSectionRef = useRef<HTMLElement>(null);
  const bgParallaxRef = useRef<HTMLDivElement>(null);
  const midParallaxRef = useRef<HTMLDivElement>(null);
  const stagePinRef = useRef<HTMLDivElement>(null);
  const fgStageParallaxRef = useRef<HTMLDivElement>(null);
  const heroProgressRef = useRef(0);

  useEffect(() => {
    const heroEl = heroSectionRef.current;
    if (!heroEl || reduced) return;

    ensureGsapRegistered();
    const mm = gsap.matchMedia();

    mm.add(MOTION_BREAKPOINTS.desktopTall, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start: "top top",
          end: "bottom top",
          scrub: 0.45,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            heroProgressRef.current = self.progress;
          },
        },
      });

      if (bgParallaxRef.current) {
        tl.to(bgParallaxRef.current, { yPercent: 12, ease: "none" }, 0);
      }
      if (midParallaxRef.current) {
        tl.to(midParallaxRef.current, { y: -28, ease: "none" }, 0);
      }
      if (fgStageParallaxRef.current) {
        tl.to(fgStageParallaxRef.current, { y: -32, ease: "none" }, 0);
      }
    });

    mm.add(MOTION_BREAKPOINTS.wide, () => {
      const stageEl = stagePinRef.current;
      if (!stageEl) return;

      const availableTravel = Math.max(
        0,
        Math.min(180, heroEl.offsetHeight - stageEl.offsetHeight - 130)
      );

      if (availableTravel < 64) return;

      gsap.to(stageEl, {
        ease: "none",
        scrollTrigger: {
          trigger: heroEl,
          pin: stageEl,
          pinSpacing: false,
          start: "top top+=84",
          end: () => `+=${Math.max(64, Math.min(180, heroEl.offsetHeight - stageEl.offsetHeight - 130))}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, [reduced]);

  const handleStageModeChange = (nextMode: "portrait" | "orbital") => {
    setStageMode(nextMode);
    requestScrollTriggerRefresh(100);
  };

  const scrollToOverview = () => {
    const target = document.getElementById("home-about-chapter");
    if (target) {
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <section
      id="hero"
      ref={heroSectionRef}
      aria-label="Hero Introduction"
      className="full-screen-hero relative w-full min-h-0 lg:min-h-[calc(100svh-8rem)] flex flex-col justify-between overflow-x-clip bg-[var(--bg)] py-4 sm:py-8 lg:py-10"
    >
      {/* Background Plane: Topographic Contours */}
      <div
        ref={bgParallaxRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden will-change-transform"
      >
        <ContourBackground density="subtle" tone="adaptive" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center my-auto py-1 sm:py-2">
        {/* Editorial Intro Column */}
        <div
          ref={midParallaxRef}
          className="lg:col-span-7 flex flex-col justify-start text-left min-w-0 will-change-transform"
        >
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
            style={{ fontSize: "clamp(1.95rem, 6.1vw, 5.6rem)" }}
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
            className="mt-5 sm:mt-6 max-w-2xl text-lg sm:text-2xl lg:text-[1.85rem] leading-[1.24] text-[var(--text)] font-medium"
          >
            <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
              Designing software systems,
            </span>{" "}
            full-stack interfaces, and machine learning pipelines built for clarity under real constraints.
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
            {siteContent.hero.description}
          </motion.p>

          {/* Focused CTA Cluster: 1 Primary CTA + 1 Secondary Contact Link */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: MOTION_DURATION.enter,
              delay: 0.34,
              ease: MOTION_EASE.out,
            }}
            className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4"
          >
            <MagneticAction strength={5}>
              <button
                type="button"
                onClick={onViewWork}
                className="btn btn-primary group"
              >
                <span>Explore Work</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </MagneticAction>

            {onNavigateContact ? (
              <button
                type="button"
                onClick={onNavigateContact}
                className="btn btn-secondary group"
              >
                <Mail className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                <span>Get in Touch</span>
              </button>
            ) : (
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary group"
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </motion.div>
        </div>

        {/* Portrait / 3D Core Visual Stage */}
        <div ref={stagePinRef} className="lg:col-span-5 w-full min-w-0">
          <div
            ref={fgStageParallaxRef}
            className="w-full min-w-0 will-change-transform"
          >
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: MOTION_DURATION.enter,
                delay: 0.16,
                ease: MOTION_EASE.out,
              }}
              className="flex flex-col gap-3 w-full min-w-0 lg:items-end"
            >
              <div className="w-full min-w-0 max-w-[440px] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="text-[var(--text-muted)] uppercase tracking-[0.12em]">
                    {stageMode === "portrait" ? "Portrait" : "3D Orbital Core"}
                  </span>

                  <div className="flex items-center gap-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-0.5">
                    <button
                      type="button"
                      onClick={() => handleStageModeChange("portrait")}
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
                      onClick={() => handleStageModeChange("orbital")}
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

                <PointerReactiveVisual maxTiltDeg={4} className="w-full">
                  <div className="relative aspect-[4/4.4] w-full overflow-hidden rounded-[8px] bg-[#151713]">
                    {stageMode === "portrait" ? (
                      portraitFailed ? (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-[#151713] p-6 text-center text-[#F4F4ED]">
                          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C7E34A]">
                            SM · 2026
                          </span>
                          <span className="mt-2 font-display text-2xl font-bold tracking-tight">
                            Sayam Mukherjee
                          </span>
                          <span className="mt-1 font-mono text-[11px] text-[#B5B8AA]">
                            CSE (AI &amp; ML) · KIIT University
                          </span>
                        </div>
                      ) : (
                        <ImageCurtainReveal immediate delay={0.18} className="h-full w-full">
                          <img
                            src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg"
                            alt="Sayam Mukherjee portrait"
                            loading="eager"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            onError={() => setPortraitFailed(true)}
                            className="h-full w-full object-cover object-[50%_18%] contrast-[1.04]"
                          />
                        </ImageCurtainReveal>
                      )
                    ) : (
                      <div className="h-full w-full bg-[#151713]">
                        <Suspense
                          fallback={
                            <div className="flex h-full w-full items-center justify-center bg-[#151713] font-mono text-xs uppercase tracking-wider text-[#B5B8AA]">
                              Loading 3D Core...
                            </div>
                          }
                        >
                          <HeroOrbitalSculpture scrollProgressRef={heroProgressRef} />
                        </Suspense>
                      </div>
                    )}

                    {stageMode === "portrait" && (
                      <>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#151713]/85 via-[#151713]/30 to-transparent" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 py-3 text-[#F4F4ED]">
                          <div className="flex items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-[0.1em]">
                            <span className="font-semibold">Sayam Mukherjee</span>
                            <span className="text-[#C7E34A]">Bhubaneswar · Hooghly</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </PointerReactiveVisual>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Understated Editorial Bottom Strip */}
      <div className="relative z-10 mt-6">
        <LineReveal immediate delay={0.34} className="mb-4" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
            <span>KIIT University · B.Tech CSE (AI &amp; ML)</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              github.com/codesbysayam ↗
            </a>
          </div>

          <button
            type="button"
            onClick={scrollToOverview}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded px-1.5 py-1"
          >
            <span>Overview</span>
            <ArrowDown className="w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

const HeroSection = memo(HeroSectionComponent);
export default HeroSection;
