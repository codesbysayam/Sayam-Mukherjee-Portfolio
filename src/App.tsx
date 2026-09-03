import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import confetti from "canvas-confetti";
import { 
  Brain, Cpu, Layers, Server, Palette, TrendingUp, Sparkles, 
  Github, Linkedin, Instagram, Youtube, Mail, FileText, MapPin, 
  Calendar, GraduationCap, Award, CheckCircle2, ArrowUp, 
  Send, Clock, Briefcase, Code, Flame, Menu, X, Check, Sun, Moon, Search, BookOpen, Download
} from "lucide-react";

import { SAYAM_DATA } from "./data";
import Loader from "./components/Loader";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillsSection";
import ExperienceSection from "./components/ExperienceSection";
import AIEngineConsole from "./components/AIEngineConsole";
import CertificationsSection from "./components/CertificationsSection";
import CodingProfiles from "./components/CodingProfiles";
import ContactSection from "./components/ContactSection";
import SEO from "./components/SEO";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";
import CustomCursor from "./components/CustomCursor";
import ScrollProgressBar from "./components/ScrollProgressBar";

// Code-split heavy interactive components to keep initial bundle ultra-light and fast
const AIChatBot = lazy(() => import("./components/AIChatBot"));
const LearningDashboard = lazy(() => import("./components/LearningDashboard"));
const ProjectsShowcase = lazy(() => import("./components/ProjectsShowcase"));
const BlogsSection = lazy(() => import("./components/BlogsSection"));
const ProgressDashboard = lazy(() => import("./components/ProgressDashboard"));
const ContentCreatorSection = lazy(() => import("./components/ContentCreatorSection"));
const TestimonialsSection = lazy(() => import("./components/TestimonialsSection"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const ResumeModal = lazy(() => import("./components/ResumeModal"));
const CommandMenu = lazy(() => import("./components/CommandMenu"));
const LearningJourney = lazy(() => import("./components/LearningJourney"));

export default function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}

// Single-trigger IntersectionObserver reveal component - zero scroll calculations, zero continuous work
function Reveal({ 
  children, 
  delay = 0, 
  className = "",
}: { 
  children: React.ReactNode; 
  delay?: number; 
  direction?: "left" | "right" | "up" | "down" | "none"; 
  distance?: number; 
  stagger?: number;
  lazy?: boolean;
  height?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      el.classList.add("visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, delay * 1000);
          } else {
            entry.target.classList.add("visible");
          }
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div ref={ref} className={`reveal w-full ${className}`}>
      {children}
    </div>
  );
}

// Isolated Live Indian Standard Time Clock (does not re-render entire page)
function LiveISTClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tickTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      setTime(new Date().toLocaleTimeString("en-US", options));
    };
    tickTime();
    const clockInterval = setInterval(tickTime, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  return (
    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-900 rounded-xl text-[10px] text-zinc-400 font-mono tracking-wide">
      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
      <span>{time || "12:00:00 AM"} IST</span>
    </div>
  );
}

// Isolated Hero Typewriter Component (prevents 20 re-renders per second on AppContent)
function TypewriterHeroRole() {
  const roles = [
    "AI & ML Student",
    "Full Stack Developer",
    "Software Engineer",
    "Content Creator",
    "Stock Market Enthusiast",
    "Future AI Engineer"
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState("AI & ML Student");

  useEffect(() => {
    let isMounted = true;
    let currentText = roles[roleIndex];
    let charIndex = 0;
    let isDeleting = false;
    let timer: any = null;

    const tick = () => {
      if (!isMounted) return;

      if (!isDeleting) {
        setTypedRole(currentText.substring(0, charIndex + 1));
        charIndex++;

        if (charIndex === currentText.length) {
          isDeleting = true;
          timer = setTimeout(tick, 3500); // Hold full-text for 3.5 seconds
        } else {
          timer = setTimeout(tick, 100);
        }
      } else {
        setTypedRole(currentText.substring(0, charIndex - 1));
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          setRoleIndex((prev) => (prev + 1) % roles.length);
          return;
        } else {
          timer = setTimeout(tick, 50);
        }
      }
    };

    timer = setTimeout(tick, 800);

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [roleIndex]);

  return (
    <span className="text-cyan-400 font-bold border-r-2 border-cyan-400 pr-1.5 animate-pulse">
      {typedRole}
    </span>
  );
}

// Isolated Rotating Tagline (prevents AppContent re-renders)
function RotatingTagline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SAYAM_DATA.taglines.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={index}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-[10px] text-purple-400 font-mono uppercase tracking-[0.15em] font-bold"
      >
        {SAYAM_DATA.taglines[index]}
      </motion.p>
    </AnimatePresence>
  );
}

function AppContent() {
  const { theme, toggleTheme, trackVisit } = usePortfolio();

  useEffect(() => {
    trackVisit("Home Portfolio");
  }, []);

  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [isCommandPaletteHintsVisible, setIsCommandPaletteHintsVisible] = useState(false);

  // Magnetic Parallax effect motion values for Hero section
  const heroX = useMotionValue(0);
  const heroY = useMotionValue(0);
  const heroRectRef = useRef<DOMRect | null>(null);

  // Smooth springs to map mouse movement without jitter, giving a high-end feel
  const springConfig = { damping: 30, stiffness: 120 };
  const smoothX = useSpring(heroX, springConfig);
  const smoothY = useSpring(heroY, springConfig);

  // Transformations for 3D multi-layered parallax depth
  // Foreground Profile Image Card (shifts up to 35px in direction of cursor)
  const profileX = useTransform(smoothX, [-0.5, 0.5], [-35, 35]);
  const profileY = useTransform(smoothY, [-0.5, 0.5], [-35, 35]);

  // Midground Terminal Console Card (shifts up to 15px in direction of cursor)
  const consoleX = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);
  const consoleY = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);

  // Background Stat Cards & Floating tags (shifts opposite to cursor up to 12px for parallax separation)
  const statsX = useTransform(smoothX, [-0.5, 0.5], [12, -12]);
  const statsY = useTransform(smoothY, [-0.5, 0.5], [12, -12]);

  // Inner image holographic depth (shifts opposite to cursor up to 15px for 3D depth)
  const innerImgX = useTransform(smoothX, [-0.5, 0.5], [15, -15]);
  const innerImgY = useTransform(smoothY, [-0.5, 0.5], [15, -15]);

  // Sentinel ref for zero-CPU scroll threshold detection
  const topSentinelRef = useRef<HTMLDivElement>(null);

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

  // Premium staggered load motion variants for hero content
  const staggerContainerLeft = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      }
    }
  };

  const staggerContainerRight = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.12,
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  // Mouse move and leave handler for the entire Hero section container
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRectRef.current) {
      heroRectRef.current = e.currentTarget.getBoundingClientRect();
    }
    const rect = heroRectRef.current;
    if (rect.width > 0 && rect.height > 0) {
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroX.set(x);
      heroY.set(y);
    }
  };

  const handleHeroMouseLeave = () => {
    heroRectRef.current = null;
    heroX.set(0);
    heroY.set(0);
  };

  // Track Cmd/Ctrl key state for showing the Command Palette Hints
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

  // Command Menu Cmd+K Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandMenuOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Throttled mouse coordinates over glass cards with requestAnimationFrame
  useEffect(() => {
    let activeCard: HTMLElement | null = null;
    let cachedRect: DOMRect | null = null;
    let rafId: number | null = null;
    let lastEvent: MouseEvent | null = null;

    const updateGlow = () => {
      if (!lastEvent) {
        rafId = null;
        return;
      }
      const target = lastEvent.target as HTMLElement;
      if (target) {
        const card = target.closest(".glass-card") as HTMLElement | null;
        if (!card) {
          activeCard = null;
          cachedRect = null;
        } else {
          if (card !== activeCard) {
            activeCard = card;
            cachedRect = card.getBoundingClientRect();
          }
          if (cachedRect) {
            const x = lastEvent.clientX - cachedRect.left;
            const y = lastEvent.clientY - cachedRect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
          }
        }
      }
      rafId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastEvent = e;
      if (rafId === null) {
        rafId = requestAnimationFrame(updateGlow);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Quick Switch Keyboard Shortcuts ('h', 'a', 's', 'e', 'p', 'j', 'c' or Arrow keys)
  useEffect(() => {
    const tabsList: Array<"home" | "about" | "skills" | "ecosystem" | "projects" | "journal" | "contact"> = [
      "home", "about", "skills", "ecosystem", "projects", "journal", "contact"
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in form fields, search inputs, or other text boxes
      const target = e.target as HTMLElement;
      if (
        !target ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest('[role="textbox"]') ||
        target.closest('.chat-input-container')
      ) {
        return;
      }

      // Ignore standard shortcut key combinations to avoid breaking browser/OS controls (e.g. Ctrl+S, Cmd+A, etc.)
      if (e.altKey || e.ctrlKey || e.metaKey) {
        return;
      }

      const key = e.key.toLowerCase();

      // Navigation shortcuts map
      const keyToTabMap: Record<string, typeof tabsList[number]> = {
        h: "home",
        a: "about",
        s: "skills",
        e: "ecosystem",
        p: "projects",
        j: "journal",
        c: "contact"
      };

      if (keyToTabMap[key]) {
        e.preventDefault();
        setActiveTab(keyToTabMap[key]);
        return;
      }

      // Arrow keys to cycle left/right through sections
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveTab((prev) => {
          const currentIndex = tabsList.indexOf(prev);
          const nextIndex = (currentIndex + 1) % tabsList.length;
          return tabsList[nextIndex];
        });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveTab((prev) => {
          const currentIndex = tabsList.indexOf(prev);
          const prevIndex = (currentIndex - 1 + tabsList.length) % tabsList.length;
          return tabsList[prevIndex];
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Categorical Page Router State
  const [activeTab, setActiveTab] = useState<"home" | "about" | "skills" | "ecosystem" | "projects" | "journal" | "contact">("home");

  // Close mobile menu on tab change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [activeTab]);

  // Swipe-to-navigate gestures for mobile view (allows swiping left/right to cycle tabs)
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const tabsList: Array<"home" | "about" | "skills" | "ecosystem" | "projects" | "journal" | "contact"> = [
      "home", "about", "skills", "ecosystem", "projects", "journal", "contact"
    ];

    const isInteractiveElement = (target: HTMLElement | null): boolean => {
      if (!target) return false;
      return (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.isContentEditable ||
        target.closest("input") !== null ||
        target.closest("textarea") !== null ||
        target.closest("button") !== null ||
        target.closest("a") !== null ||
        target.closest(".no-swipe") !== null ||
        target.closest(".recharts-wrapper") !== null ||
        target.closest(".interactive-console") !== null ||
        target.closest("#chat-container") !== null ||
        target.closest(".chat-input-container") !== null ||
        target.closest('[role="slider"]') !== null ||
        target.closest('[role="textbox"]') !== null
      );
    };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (isInteractiveElement(target)) {
        return;
      }
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (isInteractiveElement(target)) {
        return;
      }
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;

      // Only enable gestures for mobile widths (less than 768px)
      if (window.innerWidth >= 768) {
        return;
      }

      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Minimum horizontal swipe distance of 60px
      // Also ensure the swipe is primarily horizontal (horizontal diff is at least 1.5x vertical diff)
      if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        if (diffX < 0) {
          // Swiped left -> navigate to next tab
          setActiveTab((prev) => {
            const currentIndex = tabsList.indexOf(prev);
            const nextIndex = (currentIndex + 1) % tabsList.length;
            return tabsList[nextIndex];
          });
        } else {
          // Swiped right -> navigate to previous tab
          setActiveTab((prev) => {
            const currentIndex = tabsList.indexOf(prev);
            const prevIndex = (currentIndex - 1 + tabsList.length) % tabsList.length;
            return tabsList[prevIndex];
          });
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Scroll back to absolute coordinate on category transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    trackVisit(`${activeTab.toUpperCase()} Page`);
  }, [activeTab]);

  // Contact Form State
  const [formData, setFormData] = useState({ name: "", email: "", service: "Full-Stack Web Engineering", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#8B5CF6", "#3B82F6", "#22D3EE"],
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
      triggerConfetti();
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: "", email: "", service: "Full-Stack Web Engineering", message: "" });
      }, 5000);
    }, 1200);
  };

  if (window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }

  return (
    <>
      <SEO />

      <AnimatePresence mode="wait">
        {!loadingComplete && (
          <Loader onComplete={() => setLoadingComplete(true)} />
        )}
      </AnimatePresence>

      {loadingComplete && (
        <div className={`min-h-screen relative font-sans selection:bg-purple-500/30 selection:text-cyan-200 transition-all duration-700 ${
          theme === "dark" ? "bg-[#05050a] text-white" : "bg-[#f7f7fa] text-zinc-900"
        } ${readingMode ? "sepia-[.4] contrast-90 brightness-95" : ""}`}>
          
          {/* Ambient Background Grid and Floating Nodes */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-950 via-[#030303] to-[#030303] tech-grid-bg pointer-events-none z-0" />
          
          {/* Hardware-accelerated Scroll Progress Bar and Fluid Cursor */}
          <ScrollProgressBar />
          <CustomCursor />

          {/* Zero-CPU Sentinel Element for Scrolled Header detection */}
          <div ref={topSentinelRef} className="absolute top-0 left-0 w-full h-10 pointer-events-none opacity-0" aria-hidden="true" />

          <div className="absolute top-1/4 left-1/4 w-4 h-4 text-purple-500/10 pointer-events-none select-none z-0 hidden lg:block font-mono text-sm">+</div>
          <div className="absolute top-1/4 right-1/4 w-4 h-4 text-cyan-500/10 pointer-events-none select-none z-0 hidden lg:block font-mono text-sm">+</div>
          <div className="absolute bottom-1/4 left-1/3 w-4 h-4 text-indigo-500/10 pointer-events-none select-none z-0 hidden lg:block font-mono text-sm">+</div>
          <div className="absolute bottom-1/3 right-1/3 w-4 h-4 text-pink-500/10 pointer-events-none select-none z-0 hidden lg:block font-mono text-sm">+</div>
          {/* Glowing Animated Ambient iOS 27 Liquid Glass Blobs */}
          <div className="absolute top-[8%] left-[2%] liquid-blob liquid-blob-1 pointer-events-none select-none" />
          <div className="absolute top-[28%] right-[4%] liquid-blob liquid-blob-2 pointer-events-none select-none" />
          <div className="absolute bottom-[22%] left-[5%] liquid-blob liquid-blob-3 pointer-events-none select-none" />
          <div className="absolute bottom-[38%] right-[3%] liquid-blob liquid-blob-4 pointer-events-none select-none" />

          {/* Fixed / Sticky Top Header (Remains static and pinned at the top while page content scrolls) */}
          <header className={`sticky top-0 w-full z-50 border-b transition-all duration-300 backdrop-blur-xl ${
            theme === "dark"
              ? isScrolled
                ? "bg-[#050508]/95 border-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
                : "bg-[#050508]/90 border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              : isScrolled
                ? "bg-white/95 border-zinc-200 shadow-md"
                : "bg-white/90 border-zinc-200/80 shadow-sm"
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
              
              {/* Logotype */}
              <button 
                onClick={() => setActiveTab("home")}
                className="flex items-center gap-3 shrink-0 relative group cursor-pointer text-left focus:outline-none"
                aria-label="Sayam Mukherjee Home"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center shadow-md shrink-0 group-hover:border-purple-500/50 transition-colors">
                  <img 
                    src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg" 
                    alt="Sayam Mukherjee" 
                    width={36}
                    height={36}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold tracking-tight font-sans leading-none transition-colors group-hover:text-purple-400 ${
                    theme === "dark" ? "text-zinc-100" : "text-zinc-900"
                  }`}>
                    Sayam Mukherjee
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono tracking-wider mt-1 font-medium">
                    UNDERGRADUATE • AI &amp; DEV
                  </span>
                </div>
              </button>

              {/* Desktop Directory Menu (Capsule Tab Group) */}
              <nav className={`hidden lg:flex items-center gap-1 p-1 rounded-full backdrop-blur-xl shrink-0 transition-all ${
                theme === "dark" 
                  ? "bg-zinc-900/70 border border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)]" 
                  : "bg-zinc-100/90 border border-zinc-200 shadow-sm"
              }`}>
                {[
                  { id: "home", label: "Home", shortcut: "H" },
                  { id: "about", label: "About", shortcut: "A" },
                  { id: "skills", label: "Skills", shortcut: "S" },
                  { id: "ecosystem", label: "Ecosystem", shortcut: "E" },
                  { id: "projects", label: "Projects", shortcut: "P" },
                  { id: "journal", label: "Journal", shortcut: "J" },
                  { id: "contact", label: "Contact", shortcut: "C" }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      title={`${tab.label} (Press '${tab.shortcut}')`}
                      className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap select-none ${
                        isActive 
                          ? theme === "dark" ? "text-white" : "text-zinc-950"
                          : theme === "dark" ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className={`absolute inset-0 rounded-full -z-10 ${
                            theme === "dark"
                              ? "bg-zinc-800 border border-zinc-700/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_2px_8px_rgba(0,0,0,0.3)]"
                              : "bg-white border border-zinc-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                          }`}
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        />
                      )}
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              {/* Right Action Controls */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                {/* Raycast Quick Search Pill */}
                <button 
                  onClick={() => setIsCommandMenuOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer select-none"
                  title="Search Workspace (Ctrl+K or ⌘K)"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline text-xs">Search</span>
                  <span className="text-[10px] font-mono bg-zinc-800/80 border border-zinc-750 px-1.5 py-0.5 rounded text-zinc-400 uppercase">⌘K</span>
                </button>

                {/* Live IST Clock */}
                <div className="hidden xl:block shrink-0">
                  <LiveISTClock />
                </div>

                {/* Visual Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer shrink-0"
                  title="Toggle Visual Theme"
                  aria-label="Toggle Theme"
                >
                  {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                </button>

                {/* Resume Button */}
                <button
                  onClick={() => {
                    triggerConfetti();
                    setIsResumeModalOpen(true);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer shrink-0"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </button>

                {/* Contact Button */}
                <button
                  onClick={() => setActiveTab("contact")}
                  className="px-3.5 py-1.5 bg-white hover:bg-zinc-100 text-black text-xs font-semibold rounded-lg shadow-sm transition-all duration-200 cursor-pointer shrink-0 border border-zinc-200"
                >
                  Contact
                </button>

                {/* Mobile / Tablet Menu Toggle */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white cursor-pointer shrink-0"
                  aria-label="Toggle navigation menu"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Expandable Drawer Menu (statically positioned under header) */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="lg:hidden border-t border-zinc-800 bg-[#0c0c0f] py-4 px-6 shadow-2xl overflow-hidden"
                >
                  <div className="flex flex-col gap-2.5 text-sm font-medium text-zinc-300">
                    {[
                      { id: "home", label: "Home" },
                      { id: "about", label: "About" },
                      { id: "skills", label: "Skills" },
                      { id: "ecosystem", label: "Ecosystem" },
                      { id: "projects", label: "Projects" },
                      { id: "journal", label: "Journal" },
                      { id: "contact", label: "Contact" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          setIsMenuOpen(false);
                        }}
                        className={`text-left py-2 px-3 rounded-lg hover:bg-zinc-900 transition-colors flex items-center justify-between ${
                          activeTab === tab.id ? "bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20" : "text-zinc-400"
                        }`}
                      >
                        <span>{tab.label}</span>
                        {activeTab === tab.id && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                      </button>
                    ))}
                    
                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-900">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsCommandMenuOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Search (⌘K)</span>
                      </button>
                      <button
                        onClick={() => {
                          triggerConfetti();
                          setIsMenuOpen(false);
                          setIsResumeModalOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </button>
                      <button
                        onClick={() => {
                          toggleTheme();
                          setIsMenuOpen(false);
                        }}
                        className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300"
                        aria-label="Toggle visual theme"
                      >
                        {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* Main Content Layout with Framer Motion tab transition routing */}
          <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 overflow-x-clip">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.99 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full min-h-[60vh]"
              >
                {activeTab === "home" && (
                  <div className="space-y-16">
                    {/* HERO SECTION */}
                    <section 
                      id="hero" 
                      onMouseMove={handleHeroMouseMove}
                      onMouseLeave={handleHeroMouseLeave}
                      className="min-h-[80vh] flex flex-col justify-center relative py-12 md:py-16 px-8 md:px-12 lg:px-16 bg-zinc-950/10 dark:bg-zinc-950/35 border border-zinc-950/5 dark:border-zinc-900/30 rounded-[2.5rem] overflow-hidden backdrop-blur-[36px] shadow-2xl"
                    >
                      {/* Premium rotating light beam border effect */}
                      <div className="hero-border-wrap">
                        <div className="hero-border-spinner" />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                        
                        {/* Hero content details with scroll-triggered fade and scale + staggered entry */}
                        <motion.div 
                          variants={staggerContainerLeft}
                          initial="hidden"
                          animate="visible"
                          className="lg:col-span-7 space-y-8 text-left"
                        >
                          
                          {/* Top Badges Row */}
                          <motion.div 
                            variants={staggerItem}
                            className="flex flex-wrap items-center gap-3"
                          >
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                              <span className="text-[10px] text-zinc-300 font-mono uppercase tracking-wider font-semibold">
                                System Online • Ready for Collaborations
                              </span>
                            </div>

                            <div className="inline-flex h-7 items-center px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full overflow-hidden select-none">
                              <RotatingTagline />
                            </div>
                          </motion.div>
 
                          {/* Character Heading Reveal style */}
                          <motion.div 
                            variants={staggerItem}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-[1px] w-6 bg-purple-500" />
                              <p className="text-xs font-mono font-bold tracking-[0.25em] text-purple-400 uppercase">
                                SAYAM MUKHERJEE
                              </p>
                            </div>
                            <h1 
                              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display leading-[1.1] sm:leading-[1.05]"
                            >
                              Designing the Next <br />
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                                Standard of Software
                              </span>
                            </h1>
                          </motion.div>
 
                          {/* Animated roles typing subtitle */}
                          <motion.h3 
                            variants={staggerItem}
                            className="text-base sm:text-xl md:text-2xl font-mono text-zinc-300 flex items-center gap-2 select-none"
                          >
                            <span className="text-zinc-500">I am a</span>
                            <TypewriterHeroRole />
                          </motion.h3>
 
                          <motion.p 
                            variants={staggerItem}
                            className="text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed max-w-xl"
                          >
                            {SAYAM_DATA.bio}
                          </motion.p>
 
                          {/* Key Hero Stat Cards - REDESIGNED with opposite parallax separation */}
                          <motion.div 
                            variants={staggerItem}
                            style={{ x: statsX, y: statsY, willChange: "transform" }}
                            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2"
                          >
                            <div className="glass-card p-4 rounded-2xl group border border-zinc-900 flex flex-col justify-between hover:scale-[1.02] transition-all">
                              <div className="flex justify-between items-center text-zinc-500">
                                <span className="text-[9px] uppercase font-mono tracking-widest font-semibold">DEGREE TRACK</span>
                                <Brain className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                              </div>
                              <span className="text-xl sm:text-2xl font-extrabold text-white font-display mt-3 block group-hover:text-purple-400 transition-colors">B.Tech CSE</span>
                            </div>
                            <div className="glass-card p-4 rounded-2xl group border border-zinc-900 flex flex-col justify-between hover:scale-[1.02] transition-all">
                              <div className="flex justify-between items-center text-zinc-500">
                                <span className="text-[9px] uppercase font-mono tracking-widest font-semibold">SEMESTER</span>
                                <Calendar className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                              </div>
                              <span className="text-xl sm:text-2xl font-extrabold text-white font-display mt-3 block group-hover:text-cyan-400 transition-colors">{SAYAM_DATA.stats.semester}</span>
                            </div>
                            <div className="glass-card p-4 rounded-2xl group border border-zinc-900 flex flex-col justify-between hover:scale-[1.02] transition-all">
                              <div className="flex justify-between items-center text-zinc-500">
                                <span className="text-[9px] uppercase font-mono tracking-widest font-semibold">COHORTS</span>
                                <Flame className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                              </div>
                              <span className="text-xl sm:text-2xl font-extrabold text-white font-display mt-3 block group-hover:text-indigo-400 transition-colors">{SAYAM_DATA.stats.happyClients}+</span>
                            </div>
                            <div className="glass-card p-4 rounded-2xl group border border-zinc-900 flex flex-col justify-between hover:scale-[1.02] transition-all">
                              <div className="flex justify-between items-center text-zinc-500">
                                <span className="text-[9px] uppercase font-mono tracking-widest font-semibold">LOCATION</span>
                                <MapPin className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
                              </div>
                              <span className="text-xs sm:text-sm font-extrabold text-zinc-200 font-mono mt-3 block leading-tight group-hover:text-pink-400 transition-colors truncate">KOLKATA, IN</span>
                            </div>
                          </motion.div>
 
                          {/* Interactive Call to Actions */}
                          <motion.div 
                            variants={staggerItem}
                            className="flex flex-wrap gap-4 pt-4"
                          >
                            <button
                              onClick={() => {
                                triggerConfetti();
                                setIsResumeModalOpen(true);
                              }}
                              className="liquid-glass-btn liquid-shimmer-sweep text-white hover:text-purple-200 text-[10px] font-mono font-bold tracking-wider uppercase px-6 py-3.5 rounded-xl transition-all duration-300 cursor-pointer"
                            >
                              Get Resume (PDF)
                            </button>
                            <button
                              onClick={() => setActiveTab("projects")}
                              className="liquid-glass-btn liquid-shimmer-sweep text-zinc-300 hover:text-cyan-200 text-[10px] font-mono font-bold tracking-wider uppercase px-6 py-3.5 rounded-xl transition-all duration-300 cursor-pointer"
                            >
                              Explore Case Studies
                            </button>
                            <button
                              onClick={() => setActiveTab("contact")}
                              className="text-zinc-400 hover:text-white hover:underline decoration-purple-500/50 underline-offset-4 text-[10px] font-mono font-bold tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-300 cursor-pointer"
                            >
                              Get in Touch →
                            </button>
                          </motion.div>
 
                          {/* Social links block */}
                          <motion.div 
                            variants={staggerItem}
                            className="flex items-center gap-4 pt-6 border-t border-zinc-900 max-w-md"
                          >
                            <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest">Active Channels:</span>
                            <div className="flex items-center gap-2.5">
                              <a href={SAYAM_DATA.socials.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-900 rounded-xl transition-colors cursor-pointer">
                                <Github className="w-3.5 h-3.5" />
                              </a>
                              <a href={SAYAM_DATA.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-900 rounded-xl transition-colors cursor-pointer">
                                <Linkedin className="w-3.5 h-3.5" />
                              </a>
                              <a href={SAYAM_DATA.socials.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-900 rounded-xl transition-colors cursor-pointer">
                                <Youtube className="w-3.5 h-3.5" />
                              </a>
                              <a href={`mailto:${SAYAM_DATA.socials.email}`} className="p-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-900 rounded-xl transition-colors cursor-pointer">
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </motion.div>
 
                        </motion.div>

                        {/* Right: Immersive Live IDE / Sandbox Console & Parallax Profile Card + staggered entry */}
                        <motion.div 
                          variants={staggerContainerRight}
                          initial="hidden"
                          animate="visible"
                          className="lg:col-span-5 flex flex-col gap-6 items-center justify-center relative"
                        >
                          
                          {/* Profile Image Card with 3D Holographic Parallax Depth */}
                          <motion.div
                            variants={staggerItem}
                            style={{ 
                              x: profileX, 
                              y: profileY,
                              willChange: "transform"
                            }}
                            className="relative w-64 h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden glass-card border border-zinc-900/80 shadow-2xl group cursor-pointer shrink-0 liquid-shimmer-sweep"
                          >
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10 z-10 pointer-events-none" />
                            
                            {/* Inner image has opposite translation to produce 3D holographic window depth */}
                            <motion.img 
                              src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg" 
                              alt="Sayam Mukherjee" 
                              width={288}
                              height={288}
                              loading="eager"
                              decoding="async"
                              style={{ 
                                x: innerImgX,
                                y: innerImgY,
                                scale: 1.15,
                                willChange: "transform"
                              }}
                              className="w-full h-full object-cover filter brightness-[0.85] group-hover:brightness-100 transition-all duration-500 rounded-3xl"
                              referrerPolicy="no-referrer"
                            />

                            {/* Floating decorative high-tech labels */}
                            <div className="absolute top-4 left-4 px-3 py-1 bg-zinc-950/85 backdrop-blur-md border border-zinc-850 rounded-full font-mono text-[8px] tracking-[0.2em] text-purple-400 uppercase select-none z-20 shadow-lg">
                              SAYAM MUKHERJEE
                            </div>
                            <div className="absolute bottom-4 right-4 px-3 py-1 bg-zinc-950/85 backdrop-blur-md border border-zinc-850 rounded-full font-mono text-[8px] tracking-[0.2em] text-cyan-400 uppercase select-none z-20 shadow-lg flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              SYS: ACTIVE
                            </div>
                          </motion.div>

                          {/* Sandbox Console with subtle Parallax */}
                          <motion.div 
                            variants={staggerItem}
                            style={{ 
                              x: consoleX, 
                              y: consoleY,
                              willChange: "transform"
                            }} 
                            className="w-full max-w-md"
                          >
                            <AIEngineConsole />
                          </motion.div>

                        </motion.div>

                      </div>

                      {/* Scroll to continue indicator with smooth CSS fade */}
                      <div 
                        className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none transition-opacity duration-300 ${
                          isScrolled ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <span className="text-[9px] uppercase font-mono tracking-[0.22em] text-zinc-500 font-bold">
                          Scroll to continue
                        </span>
                        <div className="w-[18px] h-[28px] border border-zinc-800 rounded-full flex justify-center p-1 bg-zinc-950/30 backdrop-blur-sm">
                          <motion.div 
                            animate={{ 
                              y: [0, 8, 0],
                            }}
                            transition={{ 
                              duration: 1.6, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            }}
                            className="w-1 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]"
                          />
                        </div>
                      </div>

                    </section>
                  </div>
                )}

                <Suspense fallback={
                  <div className="w-full py-20 flex items-center justify-center text-zinc-500 font-mono text-xs">
                    <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mr-2" />
                    Rendering view...
                  </div>
                }>
                  {activeTab === "about" && (
                    <div className="space-y-16 py-8">
                      <Reveal delay={0}>
                        <AboutSection />
                      </Reveal>
                      <Reveal delay={0.1}>
                        <ExperienceSection />
                      </Reveal>
                      <Reveal delay={0.15}>
                        <CertificationsSection />
                      </Reveal>
                    </div>
                  )}

                  {activeTab === "skills" && (
                    <div className="space-y-16 py-8">
                      <Reveal delay={0}>
                        <SkillsSection />
                      </Reveal>
                      <Reveal delay={0.1}>
                        <CodingProfiles />
                      </Reveal>
                    </div>
                  )}

                  {activeTab === "ecosystem" && (
                    <div className="space-y-16 py-8">
                      <Reveal delay={0}>
                        <LearningDashboard />
                      </Reveal>
                      <Reveal delay={0.1}>
                        <LearningJourney />
                      </Reveal>
                      <Reveal delay={0.15}>
                        <ProgressDashboard />
                      </Reveal>
                    </div>
                  )}

                  {activeTab === "projects" && (
                    <div className="space-y-16 py-8">
                      <Reveal delay={0}>
                        <ProjectsShowcase />
                      </Reveal>
                    </div>
                  )}

                  {activeTab === "journal" && (
                    <div className="space-y-16 py-8">
                      <Reveal delay={0}>
                        <BlogsSection />
                      </Reveal>
                      <Reveal delay={0.1}>
                        <TestimonialsSection />
                      </Reveal>
                    </div>
                  )}

                  {activeTab === "contact" && (
                    <div className="py-8">
                      <Reveal delay={0}>
                        <ContactSection />
                      </Reveal>
                    </div>
                  )}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </main>

          {/* MASTER FOOTER */}
          <footer className="relative bg-[#070709] border-t border-zinc-900/60 z-10 py-12 text-zinc-500 text-xs mt-12 pb-24">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <p className="font-bold text-white font-display tracking-tight text-sm">Sayam Mukherjee</p>
                <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase mt-1">AI & ML CSE undergraduate • Developer Portfolio</p>
                <p className="font-mono text-[10px] text-zinc-600 mt-2 block">© 2026 Sayam Mukherjee. All rights reserved.</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setReadingMode(!readingMode)}
                  className={`p-2 border rounded-xl transition-all cursor-pointer ${
                    readingMode 
                      ? "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20" 
                      : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
                  }`}
                  title="Toggle Eye-Care Reading Mode"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                  title="Toggle System Visual Theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-xl cursor-pointer"
                  title="Return to top coordinate"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* PRINT ONLY SECTION */}
            <div className="hidden print:block max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-zinc-800 text-black dark:text-white">
              <h2 className="text-xl font-bold font-display">Sayam Mukherjee</h2>
              <p className="text-sm font-mono mt-1 text-zinc-600 dark:text-zinc-400">AI & ML CSE undergraduate • Developer Portfolio</p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-zinc-800 dark:text-zinc-300">
                <p><strong>Email:</strong> {SAYAM_DATA.socials.email}</p>
                <p><strong>LinkedIn:</strong> {SAYAM_DATA.socials.linkedin}</p>
                <p><strong>GitHub:</strong> {SAYAM_DATA.socials.github}</p>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-zinc-800 dark:text-zinc-300">{SAYAM_DATA.bio}</p>
            </div>
          </footer>

          {/* Floating AI Representative Bot & Modals */}
          <Suspense fallback={null}>
            <AIChatBot />
            {isResumeModalOpen && (
              <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
            )}
            {isCommandMenuOpen && (
              <CommandMenu
                isOpen={isCommandMenuOpen}
                onClose={() => setIsCommandMenuOpen(false)}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenResume={() => setIsResumeModalOpen(true)}
                onTriggerConfetti={triggerConfetti}
              />
            )}
          </Suspense>

          {/* Command Palette Hints (appearing when holding Cmd/Ctrl) */}
          <AnimatePresence>
            {isCommandPaletteHintsVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="fixed bottom-6 left-6 z-[60] w-72 rounded-2xl glass-card border border-zinc-850/60 p-4 shadow-2xl hidden sm:flex flex-col gap-3 font-sans select-none pointer-events-none"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.15em] text-white font-mono uppercase">
                    Navigation Shortcuts
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center justify-between gap-1.5 p-1.5 bg-zinc-950/20 rounded-lg border border-zinc-900/50">
                    <span className="text-zinc-400 font-medium">Palette</span>
                    <div className="flex items-center gap-0.5">
                      <kbd className="px-1 py-0.5 font-mono text-[9px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300">⌘</kbd>
                      <kbd className="px-1 py-0.5 font-mono text-[9px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300">K</kbd>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-1.5 p-1.5 bg-zinc-950/20 rounded-lg border border-zinc-900/50">
                    <span className="text-zinc-400 font-medium">Home</span>
                    <kbd className="px-1 py-0.5 font-mono text-[9px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300">H</kbd>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 p-1.5 bg-zinc-950/20 rounded-lg border border-zinc-900/50">
                    <span className="text-zinc-400 font-medium">About</span>
                    <kbd className="px-1 py-0.5 font-mono text-[9px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300">A</kbd>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 p-1.5 bg-zinc-950/20 rounded-lg border border-zinc-900/50">
                    <span className="text-zinc-400 font-medium">Skills</span>
                    <kbd className="px-1 py-0.5 font-mono text-[9px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300">S</kbd>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 p-1.5 bg-zinc-950/20 rounded-lg border border-zinc-900/50">
                    <span className="text-zinc-400 font-medium">Ecosys</span>
                    <kbd className="px-1 py-0.5 font-mono text-[9px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300">E</kbd>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 p-1.5 bg-zinc-950/20 rounded-lg border border-zinc-900/50">
                    <span className="text-zinc-400 font-medium">Proj</span>
                    <kbd className="px-1 py-0.5 font-mono text-[9px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300">P</kbd>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 p-1.5 bg-zinc-950/20 rounded-lg border border-zinc-900/50">
                    <span className="text-zinc-400 font-medium">Journal</span>
                    <kbd className="px-1 py-0.5 font-mono text-[9px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300">J</kbd>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 p-1.5 bg-zinc-950/20 rounded-lg border border-zinc-900/50">
                    <span className="text-zinc-400 font-medium">Contact</span>
                    <kbd className="px-1 py-0.5 font-mono text-[9px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300">C</kbd>
                  </div>
                </div>

                <div className="flex items-center justify-between p-1.5 bg-zinc-950/20 rounded-lg border border-zinc-900/50 text-[11px]">
                  <span className="text-zinc-400 font-medium">Next / Prev Section</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 font-mono text-[9px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300">←</kbd>
                    <kbd className="px-1 py-0.5 font-mono text-[9px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300">→</kbd>
                  </div>
                </div>

                <div className="text-[9px] font-mono text-zinc-500 text-center uppercase tracking-wider">
                  Release Cmd / Ctrl to hide
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clean minimal baseline spacer */}
          <div className="h-8" />

        </div>
      )}
    </>
  );
}
