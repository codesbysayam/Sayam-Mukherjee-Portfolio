import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowUpRight, Search, Sun, Moon, FileText } from "lucide-react";
import ContourBackground from "../motion/ContourBackground";
import { NAVIGATION, SOCIAL_LINKS, CONTACT_INFO } from "../../data/siteContent";
import { MOTION_EASE, MOTION_DURATION, usePrefersReducedMotion } from "../../motion/tokens";
import sightforgeImg from "../../assets/projects/sightforge-cover.png";

const operonImg = "/images/project-covers/operon.jpg";
const mausamImg = "/images/project-covers/mausam.jpg";
const memoryImg = "/images/project-covers/memory-in-motion.jpg";

export type FullScreenMenuTab =
  | "home"
  | "about"
  | "skills"
  | "ecosystem"
  | "projects"
  | "certificates"
  | "journal"
  | "contact"
  | "github"
  | "showcase";

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onNavigate: (tab: FullScreenMenuTab) => void;
  onOpenResume: () => void;
  onOpenSearch: () => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  returnFocusToRef?: React.RefObject<HTMLButtonElement | null>;
}

const PORTRAIT_URL = "https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg";

const ROUTE_PREVIEWS: Record<
  string,
  {
    eyebrow: string;
    headline: string;
    caption: string;
    image: string;
    alt: string;
    meta: string;
  }
> = {
  home: {
    eyebrow: "01 / OVERVIEW",
    headline: "Sayam Mukherjee",
    caption: "B.Tech CSE (AI & ML) · Autonomous multi-agent systems, computer vision, and full-stack web architecture.",
    image: PORTRAIT_URL,
    alt: "Sayam Mukherjee portrait",
    meta: "KIIT'29 · 9.06 CGPA",
  },
  about: {
    eyebrow: "02 / PROFILE & ROUTINE",
    headline: "Discipline & Craft",
    caption: "Focused engineering habits, 9.06 first-year CGPA across 20 subjects, and daily C++ / system practice.",
    image: PORTRAIT_URL,
    alt: "Sayam Mukherjee academic and engineering background",
    meta: "Bhubaneswar · Hooghly",
  },
  skills: {
    eyebrow: "03 / CAPABILITY MATRIX",
    headline: "TypeScript, Python & C++",
    caption: "Verified technical stack across React 19, Next.js 15, FastAPI, YOLOv8, ByteTrack, PostgreSQL, and D3.",
    image: sightforgeImg,
    alt: "SightForge computer vision telemetry",
    meta: "Full-Stack + AI/ML",
  },
  ecosystem: {
    eyebrow: "04 / ARCHITECTURE",
    headline: "System Topology",
    caption: "How control planes, ML inference pipelines, pre-rendered GitHub snapshots, and persistent APIs connect.",
    image: operonImg,
    alt: "OPERON multi-agent workflow topology",
    meta: "Live System Map",
  },
  projects: {
    eyebrow: "05 / SELECTED WORK",
    headline: "8 Engineering Systems",
    caption: "OPERON, MAUSAM, SightForge, Memory in Motion, AXIOM, INKLOOM, Campus Connect, and SayamSolves.",
    image: mausamImg,
    alt: "MAUSAM weather intelligence showcase",
    meta: "Verified Codebases",
  },
  certificates: {
    eyebrow: "06 / CREDENTIALS",
    headline: "Competitions & Honors",
    caption: "DataForge IIT Kharagpur, WCC Launchpad 30, IGNITHON 2.0, Deploy or Die, Toycathon, and Technex'26.",
    image: memoryImg,
    alt: "Memory in Motion research exhibit",
    meta: "Issuer Verified",
  },
  journal: {
    eyebrow: "07 / FIELD NOTES",
    headline: "Engineering Journal",
    caption: "Written reflections on building OPERON, fixed-size recurrent state, MAUSAM utility, and study discipline.",
    image: memoryImg,
    alt: "Engineering journal notes",
    meta: "6 Technical Essays",
  },
  contact: {
    eyebrow: "08 / CORRESPONDENCE",
    headline: "Direct Inquiry",
    caption: "Internships, hackathon collaborations, applied AI research, and full-stack software engineering.",
    image: PORTRAIT_URL,
    alt: "Contact Sayam Mukherjee",
    meta: "wrickbusiness@gmail.com",
  },
  github: {
    eyebrow: "LIVE REPOSITORY FEED",
    headline: "11 Public Repositories",
    caption: "D3 53-week contribution calendar heatmap, language breakdown, and live commit stream.",
    image: operonImg,
    alt: "GitHub engineering telemetry",
    meta: "@codesbysayam",
  },
  showcase: {
    eyebrow: "MEDIA & STORYTELLING",
    headline: "YouTube Channels",
    caption: "12K+ cumulative reach across Daily Decipher, Technical AZ, and Obsidian Optics visual storytelling.",
    image: mausamImg,
    alt: "Creator and media showcase",
    meta: "3 Active Channels",
  },
};

export function FullScreenMenu({
  isOpen,
  onClose,
  activeTab,
  onNavigate,
  onOpenResume,
  onOpenSearch,
  theme,
  toggleTheme,
  returnFocusToRef,
}: FullScreenMenuProps) {
  const reduced = usePrefersReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [hoveredRoute, setHoveredRoute] = useState<string>(activeTab || "home");

  useEffect(() => {
    if (isOpen) {
      setHoveredRoute(activeTab || "home");
    }
  }, [isOpen, activeTab]);

  // Focus entry, Escape key close, focus restoration & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        returnFocusToRef?.current?.focus();
        return;
      }

      if (e.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, returnFocusToRef]);

  const handleClose = () => {
    onClose();
    requestAnimationFrame(() => {
      returnFocusToRef?.current?.focus();
    });
  };

  const handleSelectRoute = (tab: FullScreenMenuTab) => {
    onNavigate(tab);
    onClose();
  };

  const activePreview = ROUTE_PREVIEWS[hoveredRoute] || ROUTE_PREVIEWS.home;
  const isPortraitPreview = activePreview.image === PORTRAIT_URL;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          id="fullscreen-navigation-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation menu"
          initial={reduced ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0% 0)" }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: reduced ? 0.12 : 0.44, ease: MOTION_EASE.inOut }}
          className="fixed inset-0 z-[90] bg-[#1D201A] text-[#F4F4ED] flex flex-col justify-between overflow-y-auto overscroll-contain"
        >
          <ContourBackground density="medium" tone="lime-on-dark" />

          {/* Top Bar */}
          <div
            className="relative z-10 w-full flex items-center justify-between gap-2 sm:gap-4 py-4 sm:py-5 border-b border-[#41443A]/70 shrink-0"
            style={{
              width: "min(100%, var(--content-max, 1440px))",
              marginInline: "auto",
              paddingInline: "var(--page-gutter, clamp(1rem, 4vw, 3rem))",
            }}
          >
            <button
              type="button"
              onClick={() => handleSelectRoute("home")}
              className="min-h-[44px] min-w-0 flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7E34A] rounded-[4px]"
            >
              <span className="w-9 h-9 rounded-[6px] bg-[#C7E34A] text-[#151713] font-display font-extrabold text-sm flex items-center justify-center tracking-tight shrink-0">
                SM
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-display text-sm sm:text-base font-extrabold tracking-[0.04em] uppercase text-[#F4F4ED] leading-none truncate">
                  Sayam Mukherjee
                </span>
                <span className="hidden min-[380px]:block font-mono text-[11px] uppercase tracking-[0.12em] text-[#B5B8AA] mt-1 truncate">
                  CSE · AI &amp; ML · KIIT University
                </span>
              </div>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="hidden sm:inline-flex items-center gap-2 min-h-[44px] px-3 rounded-[6px] border border-[#41443A] bg-[#151713]/70 text-xs font-mono text-[#D4D6CA] hover:border-[#C7E34A] hover:text-[#C7E34A] transition-colors cursor-pointer"
                aria-label="Open command palette search"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search ⌘K</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="min-h-[44px] min-w-[44px] px-2.5 sm:px-3 rounded-[6px] border border-[#41443A] bg-[#151713]/70 text-xs font-mono text-[#D4D6CA] hover:border-[#C7E34A] hover:text-[#C7E34A] transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                aria-label={theme === "dark" ? "Switch to Paper light mode" : "Switch to Ink dark mode"}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#C7E34A]" />
                    <span className="hidden md:inline">Paper</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#C7E34A]" />
                    <span className="hidden md:inline">Ink</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenResume();
                }}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-3 sm:px-3.5 rounded-[6px] bg-[#C7E34A] text-[#151713] hover:bg-[#A9C52F] text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Résumé</span>
              </button>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={handleClose}
                className="w-[44px] h-[44px] rounded-[6px] bg-[#F4F4ED] text-[#151713] hover:bg-[#C7E34A] active:scale-[0.95] flex items-center justify-center transition-all cursor-pointer shrink-0"
                aria-label="Close navigation overlay"
                title="Close menu (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Main Split: Dynamic Route Preview (Desktop) + Oversized Route Index */}
          <div
            className="relative z-10 flex-1 w-full py-5 sm:py-10 [@media(max-height:500px)]:py-4 flex items-center"
            style={{
              width: "min(100%, var(--content-max, 1440px))",
              marginInline: "auto",
              paddingInline: "var(--page-gutter, clamp(1rem, 4vw, 3rem))",
            }}
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* LEFT DYNAMIC ROUTE-REACTIVE EDITORIAL PREVIEW (Desktop only) */}
              <div className="hidden lg:flex lg:col-span-6 flex-col gap-5 pr-4">
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={hoveredRoute}
                        initial={reduced ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduced ? undefined : { opacity: 0, y: -10 }}
                        transition={{ duration: reduced ? 0 : MOTION_DURATION.normal, ease: MOTION_EASE.out }}
                        className="relative rounded-[10px] overflow-hidden border border-[#41443A] bg-[#151713]"
                      >
                        <div className={isPortraitPreview ? "aspect-[4/4.2]" : "aspect-[16/10]"}>
                          <img
                            src={activePreview.image}
                            alt={activePreview.alt}
                            referrerPolicy="no-referrer"
                            className={`h-full w-full object-cover ${
                              isPortraitPreview
                                ? "object-[50%_18%] contrast-[1.04]"
                                : "object-top"
                            }`}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151713] via-[#151713]/20 to-transparent pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#C7E34A] block">
                              {activePreview.eyebrow}
                            </span>
                            <p className="font-display text-lg font-extrabold text-[#F4F4ED] tracking-tight truncate">
                              {activePreview.headline}
                            </p>
                          </div>
                          <span className="font-mono text-[11px] uppercase tracking-wider text-[#B5B8AA] shrink-0">
                            {activePreview.meta}
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Secondary Accent Stack */}
                  <div className="col-span-4 space-y-4">
                    <div className="rounded-[8px] overflow-hidden border border-[#41443A] bg-[#151713] aspect-[16/10]">
                      <img
                        src={operonImg}
                        alt="OPERON multi-agent platform"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
                      />
                    </div>
                    <div className="rounded-[8px] overflow-hidden border border-[#41443A] bg-[#151713] aspect-[16/10]">
                      <img
                        src={mausamImg}
                        alt="MAUSAM weather intelligence platform"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={`caption-${hoveredRoute}`}
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.16 }}
                    className="text-sm text-[#B5B8AA] max-w-lg leading-relaxed border-t border-[#41443A]/70 pt-3"
                  >
                    {activePreview.caption}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* RIGHT OVERSIZED STAGGERED ROUTE LINKS */}
              <div className="lg:col-span-6 flex flex-col justify-center lg:pl-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#C7E34A] mb-4">
                  Directory Index · 01 — 08
                </div>

                <nav aria-label="Full screen directory" className="flex flex-col space-y-1 sm:space-y-1.5">
                  {NAVIGATION.map((item, idx) => {
                    const isActive = activeTab === item.id;
                    return (
                      <div key={item.id} className="overflow-hidden">
                        <motion.button
                          type="button"
                          initial={reduced ? false : { y: "100%", opacity: 0 }}
                          animate={{ y: "0%", opacity: 1 }}
                          transition={{
                            duration: reduced ? 0.05 : 0.45,
                            delay: reduced ? 0 : Math.min(0.08 + idx * 0.045, 0.48),
                            ease: MOTION_EASE.out,
                          }}
                          onMouseEnter={() => setHoveredRoute(item.id)}
                          onFocus={() => setHoveredRoute(item.id)}
                          onClick={() => handleSelectRoute(item.id as FullScreenMenuTab)}
                          aria-current={isActive ? "page" : undefined}
                          className="group relative w-full text-left flex items-baseline justify-between gap-4 py-1.5 min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:text-[#C7E34A]"
                        >
                          <div className="relative inline-flex items-baseline gap-3 sm:gap-4">
                            <span className="font-mono text-xs text-[#8C8F82] group-hover:text-[#C7E34A] tabular-nums transition-colors">
                              0{idx + 1}
                            </span>
                            <span
                              className={`relative font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.98] transition-colors ${
                                isActive
                                  ? "text-[#F4F4ED]/65"
                                  : "text-[#F4F4ED] group-hover:text-[#C7E34A]"
                              }`}
                              style={{ fontSize: "clamp(1.65rem, 3.8vw, 3.35rem)" }}
                            >
                              {item.label}
                              {isActive && (
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 220 18"
                                  preserveAspectRatio="none"
                                  className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full h-4 text-[#C7E34A]"
                                >
                                  <path
                                    d="M2 10 Q 40 2, 74 10 T 146 10 T 218 9"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              )}
                            </span>
                          </div>

                          <span className="font-mono text-xs text-[#8C8F82] group-hover:text-[#C7E34A] transition-colors inline-flex items-center gap-1.5 shrink-0">
                            <span className="hidden sm:inline opacity-60">[{item.shortcut}]</span>
                            <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </span>
                        </motion.button>
                      </div>
                    );
                  })}
                </nav>

                {/* Quick Extra Routes */}
                <div className="mt-6 pt-5 border-t border-[#41443A]/70 flex flex-wrap items-center gap-3 text-xs font-mono">
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredRoute("github")}
                    onFocus={() => setHoveredRoute("github")}
                    onClick={() => handleSelectRoute("github")}
                    className={`min-h-[44px] sm:min-h-[38px] inline-flex items-center px-3.5 py-1.5 rounded-[4px] border transition-colors cursor-pointer ${
                      activeTab === "github"
                        ? "border-[#C7E34A] text-[#151713] bg-[#C7E34A] font-bold"
                        : "border-[#41443A] text-[#D4D6CA] hover:border-[#C7E34A] hover:text-[#C7E34A]"
                    }`}
                  >
                    Live GitHub Inventory ↗
                  </button>
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredRoute("showcase")}
                    onFocus={() => setHoveredRoute("showcase")}
                    onClick={() => handleSelectRoute("showcase")}
                    className={`min-h-[44px] sm:min-h-[38px] inline-flex items-center px-3.5 py-1.5 rounded-[4px] border transition-colors cursor-pointer ${
                      activeTab === "showcase"
                        ? "border-[#C7E34A] text-[#151713] bg-[#C7E34A] font-bold"
                        : "border-[#41443A] text-[#D4D6CA] hover:border-[#C7E34A] hover:text-[#C7E34A]"
                    }`}
                  >
                    YouTube Video Showcase ↗
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Metadata & Socials Bar */}
          <div
            className="relative z-10 w-full border-t border-[#41443A]/70 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 text-xs font-mono text-[#B5B8AA] shrink-0"
            style={{
              width: "min(100%, var(--content-max, 1440px))",
              marginInline: "auto",
              paddingInline: "var(--page-gutter, clamp(1rem, 4vw, 3rem))",
            }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[#F4F4ED] font-semibold">INQUIRIES</span>
              <span aria-hidden="true">·</span>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-[#C7E34A] hover:underline inline-flex items-center min-h-[44px] sm:min-h-[36px]"
              >
                {CONTACT_INFO.email}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 uppercase tracking-wider">
              {[
                { label: "GitHub", url: SOCIAL_LINKS.github },
                { label: "LinkedIn", url: SOCIAL_LINKS.linkedin },
                { label: "LeetCode", url: SOCIAL_LINKS.leetcode },
                { label: "Codolio", url: SOCIAL_LINKS.codolio },
                { label: "YouTube", url: SOCIAL_LINKS.youtube },
                { label: "Instagram", url: SOCIAL_LINKS.instagram },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4D6CA] hover:text-[#C7E34A] transition-colors inline-flex items-center gap-1 min-h-[44px] sm:min-h-[36px]"
                >
                  <span>{social.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FullScreenMenu;
