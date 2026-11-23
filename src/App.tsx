import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Menu, Sun, Moon, Search } from "lucide-react";
import FullScreenMenu from "./components/layout/FullScreenMenu";

import AboutSection from "./components/AboutSection";
import ExperienceSection from "./components/ExperienceSection";
import HeroSection from "./components/HeroSection";
import HomeEditorialChapters from "./components/HomeEditorialChapters";
import LiveBuildFeed from "./components/LiveBuildFeed";
import ContactSection from "./components/ContactSection";
import { ErrorBoundary, RootErrorBoundary } from "./components/ErrorBoundary";
import AppErrorBoundary from "./components/AppErrorBoundary";
import PageLoading from "./components/PageLoading";
import SEO from "./components/SEO";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";
import CustomCursor from "./components/CustomCursor";
import ScrollProgressBar from "./components/ScrollProgressBar";
import Toast from "./components/Toast";
import { ResumeGlyph } from "./components/ResumeGlyph";
import { NAVIGATION } from "./data/siteContent";
import { lazyWithRetry, clearChunkReloadFlag } from "./utils/lazyWithRetry";
import ScrollStoryThread, {
  HOME_CHAPTERS,
  type ChapterAnchor,
} from "./components/motion/ScrollStoryThread";
import RouteTransition from "./components/motion/RouteTransition";
import PointerTrailCanvas from "./components/motion/PointerTrailCanvas";
import { requestScrollTriggerRefresh } from "./motion/gsapRegistry";
import { MotionProvider } from "./motion/MotionProvider";
import { EditorialReveal } from "./motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "./motion/tokens";

const ProjectsShowcase = lazyWithRetry(() => import("./components/ProjectsShowcase"));
const PortfolioGuide = lazyWithRetry(() => import("./components/AssistantChat"));
const SkillsSection = lazyWithRetry(() => import("./components/SkillsSection"));
const EcosystemSection = lazyWithRetry(() => import("./components/EcosystemSection"));
const BlogsSection = lazyWithRetry(() => import("./components/BlogsSection"));
const ContentCreatorSection = lazyWithRetry(() => import("./components/ContentCreatorSection"));
const AdminDashboard = lazyWithRetry(() => import("./components/AdminDashboard"));
import ResumeModal from "./components/ResumeModal";
const CommandMenu = lazyWithRetry(() => import("./components/CommandMenu"));
const CertificatesPage = lazyWithRetry(() => import("./components/certificates/CertificatesPage"));
const GitHubStats = lazyWithRetry(() => import("./components/GitHubStats"));
import PrivacyPage from "./pages/Privacy";
import TermsPage from "./pages/Terms";
import NotFound from "./pages/NotFound";
import LegalRouteErrorBoundary from "./components/legal/LegalRouteErrorBoundary";
import SiteFooter from "./components/SiteFooter";
import BackToTop from "./components/BackToTop";
const CookieConsent = lazyWithRetry(() => import("./components/CookieConsent"));
const FloatingContactButton = lazyWithRetry(() => import("./components/FloatingContactButton"));
import MobileBottomNav from "./components/common/MobileBottomNav";

export default function App() {
  return (
    <AppErrorBoundary>
      <RootErrorBoundary>
        <MotionProvider>
          <PortfolioProvider>
            <AppContent />
          </PortfolioProvider>
        </MotionProvider>
      </RootErrorBoundary>
    </AppErrorBoundary>
  );
}

const ROUTE_CHAPTERS: Partial<Record<string, ChapterAnchor[]>> = {
  home: HOME_CHAPTERS,
  about: [
    { id: "about-hero", code: "00", label: "Identity" },
    { id: "about-values", code: "01", label: "Principles" },
    { id: "about-experience", code: "02", label: "Experience" },
  ],
  skills: [
    { id: "skills-hero", code: "00", label: "Overview" },
    { id: "capability-index", code: "01", label: "Capabilities" },
    { id: "skills-context", code: "02", label: "Practice" },
  ],
  ecosystem: [
    { id: "ecosystem-hero", code: "00", label: "Architecture" },
    { id: "ecosystem-pipeline", code: "01", label: "Workflow" },
    { id: "ecosystem-patterns", code: "02", label: "Patterns" },
    { id: "ecosystem-boundaries", code: "03", label: "Practices" },
  ],
  projects: [
    { id: "projects-header", code: "00", label: "Archive" },
    { id: "projects-featured", code: "01", label: "Featured" },
    { id: "projects-explorer", code: "02", label: "Explorer" },
  ],
  certificates: [
    { id: "certificates-hero", code: "00", label: "Credentials" },
    { id: "academics-section", code: "01", label: "Academics" },
    { id: "credentials-vault", code: "02", label: "Vault" },
  ],
  journal: [
    { id: "journal-section", code: "00", label: "Journal" },
  ],
};

function AppContent() {
  const { theme, toggleTheme, trackVisit } = usePortfolio();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    trackVisit("Home Portfolio");
    clearChunkReloadFlag();
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready
        .then(() => {
          requestScrollTriggerRefresh(80);
        })
        .catch(() => {});
    }
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isCommandPaletteHintsVisible, setIsCommandPaletteHintsVisible] = useState(false);
  const [focusedProjectId, setFocusedProjectId] = useState<string | null>(null);

  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenResume = () => setIsResumeModalOpen(true);
    window.addEventListener("open-resume-modal", handleOpenResume);
    return () => window.removeEventListener("open-resume-modal", handleOpenResume);
  }, []);

  useEffect(() => {
    const el = topSentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Accessible mobile drawer body-scroll lock + Escape key close with focus return
  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Meta") {
        setIsCommandPaletteHintsVisible(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Meta") {
        setIsCommandPaletteHintsVisible(false);
      }
    };
    const handleBlur = () => {
      setIsCommandPaletteHintsVisible(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  type TabType =
    | "home"
    | "about"
    | "skills"
    | "ecosystem"
    | "projects"
    | "certificates"
    | "journal"
    | "contact"
    | "privacy"
    | "terms"
    | "github"
    | "404"
    | "showcase";

  const getInitialTab = (): TabType => {
    if (typeof window === "undefined") return "home";
    const rawPath = window.location.pathname.toLowerCase();
    const path = rawPath.replace(/\/+$/, "");

    if (!path || path === "" || path === "/" || path === "/home") return "home";
    if (
      path === "/video-showcase" ||
      path === "/showcase" ||
      path.startsWith("/video-showcase/") ||
      path.startsWith("/showcase/") ||
      path === "/creator-showcase"
    )
      return "showcase";
    if (path === "/privacy" || path.startsWith("/privacy/")) return "privacy";
    if (path === "/terms" || path.startsWith("/terms/")) return "terms";
    if (
      path === "/certificates" ||
      path === "/certificate" ||
      path.startsWith("/certificates/") ||
      path.startsWith("/certificate/")
    )
      return "certificates";
    if (
      path === "/projects" ||
      path === "/project" ||
      path.startsWith("/projects/") ||
      path.startsWith("/project/")
    )
      return "projects";
    if (path === "/github" || path.startsWith("/github/")) return "github";
    if (path === "/about" || path.startsWith("/about/")) return "about";
    if (path === "/skills" || path.startsWith("/skills/")) return "skills";
    if (path === "/ecosystem" || path.startsWith("/ecosystem/")) return "ecosystem";
    if (
      path === "/journal" ||
      path === "/blog" ||
      path.startsWith("/journal/") ||
      path.startsWith("/blog/")
    )
      return "journal";
    if (path === "/contact" || path.startsWith("/contact/")) return "contact";
    if (path === "/404" || path.startsWith("/404/")) return "404";

    const hash = window.location.hash.toLowerCase().replace("#", "").replace(/\/+$/, "");
    if (hash === "video-showcase" || hash === "showcase" || hash === "creator-showcase")
      return "showcase";
    if (hash === "privacy") return "privacy";
    if (hash === "terms") return "terms";
    if (hash === "certificates" || hash === "certificate") return "certificates";
    if (hash === "projects") return "projects";
    if (hash === "github") return "github";
    if (hash === "about") return "about";
    if (hash === "skills") return "skills";
    if (hash === "ecosystem") return "ecosystem";
    if (hash === "journal") return "journal";
    if (hash === "contact") return "contact";
    if (hash === "404") return "404";

    return "404";
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);
  const isLegalPage = activeTab === "privacy" || activeTab === "terms";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("has-legal-page", isLegalPage);
    }
  }, [isLegalPage]);

  const navigateToTab = (
    tab: TabType,
    options?: { customPath?: string; preserveJournalSlug?: boolean }
  ) => {
    const defaultPath = tab === "home" ? "/" : tab === "404" ? "/404" : `/${tab}`;
    const targetPath = options?.customPath || defaultPath;
    const isSameTab = activeTab === tab;

    setActiveTab(tab);

    if (window.location.pathname !== targetPath && window.location.pathname !== "/admin") {
      window.history.pushState(null, "", targetPath);
    }

    if (tab === "journal" && !options?.customPath && !options?.preserveJournalSlug) {
      window.dispatchEvent(new CustomEvent("portfolio-journal-reset"));
    }

    if (isSameTab) {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getInitialTab());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const tabsList: TabType[] = [
      "home",
      "about",
      "skills",
      "ecosystem",
      "projects",
      "certificates",
      "journal",
      "contact",
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLegalPage || isMenuOpen || isCommandMenuOpen || isResumeModalOpen) return;
      const target = e.target as HTMLElement | null;
      if (
        !target ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable ||
        target.closest('[role="textbox"]') ||
        target.closest('[role="dialog"]') ||
        target.closest('[aria-roledescription="carousel"]') ||
        target.closest(".chat-input-container")
      ) {
        return;
      }

      if (e.altKey || e.ctrlKey || e.metaKey) return;

      const key = e.key.toLowerCase();
      const keyToTabMap: Record<string, TabType> = {
        h: "home",
        a: "about",
        s: "skills",
        e: "ecosystem",
        p: "projects",
        c: "certificates",
        j: "journal",
        m: "contact",
      };

      if (keyToTabMap[key]) {
        e.preventDefault();
        navigateToTab(keyToTabMap[key]);
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        const currentIndex = tabsList.indexOf(activeTab);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % tabsList.length;
        navigateToTab(tabsList[nextIndex]);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const currentIndex = tabsList.indexOf(activeTab);
        const prevIndex =
          currentIndex === -1
            ? tabsList.length - 1
            : (currentIndex - 1 + tabsList.length) % tabsList.length;
        navigateToTab(tabsList[prevIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLegalPage, isMenuOpen, isCommandMenuOpen, isResumeModalOpen, activeTab, prefersReducedMotion]);

  useEffect(() => {
    const handleTabNavigate = (e: CustomEvent<string>) => {
      if (e.detail && typeof e.detail === "string") {
        navigateToTab(e.detail as TabType);
      }
    };
    const handleRouteNavigate = (
      e: CustomEvent<{ tab?: TabType; path?: string }>
    ) => {
      const detail = e.detail;
      if (!detail) return;
      if (detail.path && typeof window !== "undefined") {
        if (detail.tab) {
          navigateToTab(detail.tab, {
            customPath: detail.path,
            preserveJournalSlug: true,
          });
          window.dispatchEvent(
            new CustomEvent("portfolio-journal-sync", { detail: { path: detail.path } })
          );
          return;
        }
        window.history.pushState(null, "", detail.path);
        setActiveTab(getInitialTab());
        window.dispatchEvent(
          new CustomEvent("portfolio-journal-sync", { detail: { path: detail.path } })
        );
      } else if (detail.tab) {
        navigateToTab(detail.tab);
      }
    };
    window.addEventListener("portfolio-navigate-tab", handleTabNavigate as EventListener);
    window.addEventListener("portfolio-navigate-route", handleRouteNavigate as EventListener);
    return () => {
      window.removeEventListener("portfolio-navigate-tab", handleTabNavigate as EventListener);
      window.removeEventListener("portfolio-navigate-route", handleRouteNavigate as EventListener);
    };
  }, [activeTab, prefersReducedMotion]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    trackVisit(`${activeTab.toUpperCase()} Page`);
  }, [activeTab]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.8 },
        colors: ["#C7E34A", "#69734A", "#20231D", "#F4F4ED"],
      });
    } catch {
      // Confetti fallback for constrained frames
    }
  };

  if (window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }

  return (
    <>
      <SEO routeKey={activeTab} />

      <div className="site-shell min-h-screen relative font-sans bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 flex flex-col">
        <ScrollProgressBar />
        <CustomCursor disabled={isLegalPage} />
        <PointerTrailCanvas disabled={isLegalPage} />

        {/* Sentinel for sticky header state */}
        <div
          ref={topSentinelRef}
          className="absolute top-0 left-0 w-full h-6 pointer-events-none opacity-0"
          aria-hidden="true"
        />

        {/* Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#C7E34A] focus:text-[#20231D] focus:rounded-[6px] focus:font-mono focus:text-xs focus:font-bold"
        >
          Skip to main content
        </a>

        {/* STICKY EDITORIAL TOP NAVIGATION */}
        <header
          className={`sticky top-0 w-full z-50 border-b transition-colors duration-200 backdrop-blur-md ${
            isScrolled
              ? "bg-[var(--bg)]/95 border-[var(--border-strong)]"
              : "bg-[var(--bg)]/90 border-[var(--border)]"
          }`}
        >
          <div
            className="header-inner w-full flex items-center justify-between gap-3 sm:gap-4 min-h-[60px] sm:min-h-[72px]"
            style={{
              width: "min(100%, var(--content-max, 1440px))",
              marginInline: "auto",
              paddingInline: "var(--page-gutter, clamp(1rem, 4vw, 3rem))",
            }}
          >
            {/* Left Wordmark */}
            <button
              type="button"
              onClick={() => navigateToTab("home")}
              className="flex items-center gap-2.5 text-left shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-[4px] py-1 active:opacity-80 active:scale-[0.98] transition-all"
              aria-label="Sayam Mukherjee Home"
            >
              <span className="w-8 h-8 rounded-[6px] bg-[var(--accent-fill)] text-[var(--accent-contrast)] font-display font-extrabold text-xs flex items-center justify-center tracking-tight shrink-0">
                SM
              </span>
              <span className="font-display text-sm sm:text-base font-extrabold tracking-[0.04em] uppercase text-[var(--text)] leading-none whitespace-nowrap">
                Sayam Mukherjee
              </span>
            </button>

            {/* Center Typographic Nav Links */}
            <nav
              aria-label="Primary navigation"
              className="hidden xl:flex items-center gap-5 shrink-0"
            >
              {NAVIGATION.filter((tab) => tab.id !== "contact").map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => navigateToTab(tab.id as TabType)}
                    title={`${tab.label} (Press '${tab.shortcut}')`}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative py-2 px-1 text-[13px] font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7E34A] rounded-[4px] active:scale-[0.97] active:opacity-80 ${
                      isActive
                        ? "text-[var(--text)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavUnderline"
                        className="absolute left-0 right-0 bottom-0 h-[2px] bg-[var(--accent-fill)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsCommandMenuOpen(true)}
                className="hidden sm:flex items-center gap-2 min-h-[40px] px-2.5 border border-[var(--border-strong)] rounded-[6px] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text)] active:scale-[0.97] active:bg-[var(--surface)] transition-all cursor-pointer"
                title="Search Workspace (Ctrl+K or ⌘K)"
                aria-label="Search Workspace"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">⌘K</span>
              </button>

              <motion.button
                type="button"
                whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                onClick={toggleTheme}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center border border-[var(--border-strong)] rounded-[6px] text-[var(--text)] hover:bg-[var(--surface)] transition-colors cursor-pointer overflow-hidden"
                title={theme === "dark" ? "Switch to Paper theme" : "Switch to Ink theme"}
                aria-label="Toggle visual theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === "dark" ? (
                    <motion.span
                      key="sun"
                      initial={prefersReducedMotion ? false : { rotate: -35, opacity: 0, scale: 0.8 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={prefersReducedMotion ? undefined : { rotate: 35, opacity: 0, scale: 0.8 }}
                      transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.out }}
                      className="flex items-center justify-center"
                    >
                      <Sun className="w-4 h-4 text-[#C7E34A]" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={prefersReducedMotion ? false : { rotate: 35, opacity: 0, scale: 0.8 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={prefersReducedMotion ? undefined : { rotate: -35, opacity: 0, scale: 0.8 }}
                      transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.out }}
                      className="flex items-center justify-center"
                    >
                      <Moon className="w-4 h-4 text-[var(--text)]" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <button
                type="button"
                onClick={() => setIsResumeModalOpen(true)}
                className="hidden md:inline-flex items-center gap-1.5 min-h-[40px] px-3 border border-[var(--border-strong)] rounded-[6px] text-xs font-semibold text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] active:scale-[0.97] active:bg-[var(--surface-3)] transition-all cursor-pointer"
                aria-label="Open official verified resume viewer"
              >
                <ResumeGlyph className="w-3.5 h-3.5 shrink-0" />
                <span>Résumé</span>
              </button>

              <button
                type="button"
                onClick={() => navigateToTab("contact")}
                className={`hidden sm:inline-flex items-center justify-center min-h-[40px] px-4 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-[0.97] ${
                  activeTab === "contact"
                    ? "bg-[var(--text)] text-[var(--bg)]"
                    : "bg-[var(--accent-fill)] text-[var(--accent-contrast)] hover:bg-[var(--accent-strong)]"
                }`}
              >
                Contact
              </button>

              <button
                ref={mobileMenuButtonRef}
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-expanded={isMenuOpen}
                aria-controls="fullscreen-navigation-overlay"
                className="min-h-[42px] px-3 flex items-center gap-2 border border-[var(--border-strong)] rounded-[6px] bg-[var(--surface)] hover:border-[#C7E34A] hover:text-[var(--accent)] text-[var(--text)] active:scale-[0.95] cursor-pointer transition-all font-mono text-xs font-semibold uppercase tracking-wider"
                aria-label="Open full-screen navigation menu"
              >
                <Menu className="w-4 h-4" />
                <span className="hidden sm:inline">Menu</span>
              </button>
            </div>
          </div>
        </header>

        <FullScreenMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          activeTab={activeTab}
          onNavigate={(tab) => navigateToTab(tab as TabType)}
          onOpenResume={() => setIsResumeModalOpen(true)}
          onOpenSearch={() => setIsCommandMenuOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
          returnFocusToRef={mobileMenuButtonRef}
        />

        {/* RESPONSIVE CSS GRID LAYOUT (Main Track + Sticky Desktop Chapter Spine) */}
        <div
          className={
            isLegalPage
              ? "site-layout site-layout--legal"
              : ROUTE_CHAPTERS[activeTab]
                ? "site-layout site-layout--with-nav"
                : "site-layout"
          }
        >
          {/* MAIN CONTENT AREA */}
          <main
            id="main-content"
            tabIndex={-1}
            className="site-main relative z-10 w-full min-w-0 flex-1 pt-5 sm:pt-8 pb-28 sm:pb-24 overflow-x-clip focus:outline-none"
          >
            <RouteTransition routeKey={activeTab}>
            {activeTab === "home" && (
              <ErrorBoundary sectionName="Home Overview">
                <div className="space-y-10 sm:space-y-14">
                  <HeroSection
                    onViewWork={() => navigateToTab("projects")}
                    onOpenResume={() => setIsResumeModalOpen(true)}
                    onNavigateContact={() => navigateToTab("contact")}
                  />

                  <HomeEditorialChapters
                    onNavigateTab={(tab) => navigateToTab(tab)}
                  />
                </div>
              </ErrorBoundary>
            )}

            {activeTab === "privacy" && (
              <LegalRouteErrorBoundary onNavigateHome={() => navigateToTab("home")}>
                <PrivacyPage
                  onNavigateHome={() => navigateToTab("home")}
                  onNavigateTab={(tab) => navigateToTab(tab as TabType)}
                />
              </LegalRouteErrorBoundary>
            )}

            {activeTab === "terms" && (
              <LegalRouteErrorBoundary onNavigateHome={() => navigateToTab("home")}>
                <TermsPage
                  onNavigateHome={() => navigateToTab("home")}
                  onNavigateTab={(tab) => navigateToTab(tab as TabType)}
                />
              </LegalRouteErrorBoundary>
            )}

            {activeTab === "404" && (
              <NotFound onNavigateTab={(tab) => navigateToTab(tab as TabType)} />
            )}

            <ErrorBoundary
              key={activeTab}
              sectionName="Main Tab View"
              onReset={() => navigateToTab(activeTab)}
            >
              <Suspense fallback={<PageLoading />}>
                {activeTab === "about" && (
                  <ErrorBoundary sectionName="About Section">
                    <div className="space-y-12 py-2">
                      <EditorialReveal immediate delay={0}>
                        <AboutSection
                          onNavigateTab={(tab) => navigateToTab(tab)}
                        />
                      </EditorialReveal>
                      <EditorialReveal delay={0.08}>
                        <ExperienceSection
                          onNavigateToShowcase={() => navigateToTab("showcase")}
                        />
                      </EditorialReveal>
                    </div>
                  </ErrorBoundary>
                )}

                {activeTab === "skills" && (
                  <div className="py-2">
                    <ErrorBoundary sectionName="Skills & Technical Stack">
                      <SkillsSection
                        onNavigateToProject={(projectId) => {
                          setFocusedProjectId(projectId);
                          navigateToTab("projects");
                        }}
                      />
                    </ErrorBoundary>
                  </div>
                )}

                {activeTab === "ecosystem" && (
                  <div className="py-2">
                    <ErrorBoundary sectionName="Engineering Ecosystem">
                      <EcosystemSection />
                    </ErrorBoundary>
                  </div>
                )}

                {activeTab === "projects" && (
                  <div className="py-2">
                    <ErrorBoundary sectionName="Projects Showcase">
                      <EditorialReveal immediate delay={0}>
                        <ProjectsShowcase
                          initialProjectId={focusedProjectId}
                          onClearInitialProject={() => setFocusedProjectId(null)}
                        />
                      </EditorialReveal>
                    </ErrorBoundary>
                  </div>
                )}

                {activeTab === "certificates" && (
                  <div className="py-2">
                    <ErrorBoundary sectionName="Certificates & Credentials">
                      <CertificatesPage />
                    </ErrorBoundary>
                  </div>
                )}

                {activeTab === "github" && (
                  <div className="space-y-12 py-2">
                    <ErrorBoundary sectionName="GitHub Repositories & Telemetry">
                      <EditorialReveal immediate delay={0}>
                        <GitHubStats />
                      </EditorialReveal>
                    </ErrorBoundary>
                    <ErrorBoundary sectionName="Live GitHub Repository Feed">
                      <EditorialReveal delay={0.08}>
                        <LiveBuildFeed />
                      </EditorialReveal>
                    </ErrorBoundary>
                  </div>
                )}

                {activeTab === "journal" && (
                  <div className="py-2">
                    <ErrorBoundary sectionName="Journal & Engineering Reflections">
                      <EditorialReveal immediate delay={0}>
                        <BlogsSection />
                      </EditorialReveal>
                    </ErrorBoundary>
                  </div>
                )}

                {activeTab === "contact" && (
                  <div className="w-full py-2">
                    <ErrorBoundary sectionName="Contact Section">
                      <EditorialReveal immediate delay={0}>
                        <ContactSection />
                      </EditorialReveal>
                    </ErrorBoundary>
                  </div>
                )}

                {activeTab === "showcase" && (
                  <div className="w-full py-2">
                    <ErrorBoundary sectionName="YouTube Video Showcase">
                      <EditorialReveal immediate delay={0}>
                        <ContentCreatorSection onBack={() => navigateToTab("about")} />
                      </EditorialReveal>
                    </ErrorBoundary>
                  </div>
                )}
              </Suspense>
            </ErrorBoundary>
            </RouteTransition>
          </main>

          {!isLegalPage && ROUTE_CHAPTERS[activeTab] && (
            <ScrollStoryThread
              chapters={ROUTE_CHAPTERS[activeTab]}
              routeKey={activeTab}
            />
          )}
        </div>

        {!isLegalPage && (
          <SiteFooter
            onNavigateTab={(tab) => navigateToTab(tab as TabType)}
            activeTab={activeTab}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}

        {!isLegalPage && (
          <ErrorBoundary sectionName="Portfolio Guide">
            <Suspense fallback={null}>
              <PortfolioGuide />
            </Suspense>
          </ErrorBoundary>
        )}

        <ErrorBoundary sectionName="Resume Modal">
          {isResumeModalOpen && (
            <ResumeModal
              isOpen={isResumeModalOpen}
              onClose={() => setIsResumeModalOpen(false)}
            />
          )}
        </ErrorBoundary>

        <ErrorBoundary sectionName="Modal System">
          <Suspense fallback={null}>
            {isCommandMenuOpen && (
              <CommandMenu
                isOpen={isCommandMenuOpen}
                onClose={() => setIsCommandMenuOpen(false)}
                onNavigate={(tab) => navigateToTab(tab)}
                onOpenResume={() => setIsResumeModalOpen(true)}
                onTriggerConfetti={triggerConfetti}
              />
            )}
            <CookieConsent />
            {!isLegalPage && (
              <>
                <FloatingContactButton
                  onNavigateContact={() => navigateToTab("contact")}
                />
                <BackToTop />
                <MobileBottomNav
                  activeTab={activeTab}
                  onNavigate={(tab) => navigateToTab(tab)}
                  onOpenSearch={() => setIsCommandMenuOpen(true)}
                />
              </>
            )}
          </Suspense>
        </ErrorBoundary>

        <Toast />

        {/* Command Palette Hints on Ctrl/Meta hold */}
        <AnimatePresence>
          {isCommandPaletteHintsVisible && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-6 left-6 z-[60] w-72 rounded-[10px] border border-[#41443A] bg-[#20231D] text-[#F4F4ED] p-4 shadow-2xl hidden sm:flex flex-col gap-3 font-sans select-none pointer-events-none"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#41443A]">
                <span className="text-[11px] font-bold tracking-[0.12em] font-mono uppercase text-[#C7E34A]">
                  Navigation Shortcuts
                </span>
                <span className="text-[10px] font-mono text-[#B5B8AA]">⌘ / CTRL</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                {[
                  ["Palette", "⌘K"],
                  ["Home", "H"],
                  ["About", "A"],
                  ["Skills", "S"],
                  ["Ecosystem", "E"],
                  ["Projects", "P"],
                  ["Certs", "C"],
                  ["Journal", "J"],
                  ["Contact", "M"],
                  ["Cycle", "← →"],
                ].map(([label, shortcut]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-1.5 px-2 py-1 rounded bg-[#151713] border border-[#41443A]"
                  >
                    <span className="text-[#D4D6CA]">{label}</span>
                    <kbd className="text-[10px] text-[#C7E34A]">{shortcut}</kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
