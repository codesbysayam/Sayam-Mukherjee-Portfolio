import { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { EditorialReveal, MaskMediaReveal, ScrollScaleImage, StaggerGroup, StaggerItem } from "../motion/Reveal";
import { ContourBackground } from "./motion/ContourBackground";
import { PinnedHeadingSection } from "./motion/PinnedHeadingSection";
import { HorizontalNarrative, type NarrativeStop } from "./motion/HorizontalNarrative";
import { EditorialSectionHeader } from "./common/EditorialSectionHeader";
import { requestScrollTriggerRefresh } from "../motion/gsapRegistry";
import { usePrefersReducedMotion } from "../motion/tokens";
import { universityEducation, schoolEducation } from "../data/education";
import {
  GraduationCap, Award, Calendar, Shield, Compass,
  Sparkles, CheckCircle2, BookOpen, User, Target,
  Trophy, Medal, Video, Briefcase, Youtube, Code, Building2, Star, Rocket,
  Flame, Quote, Camera, ArrowRight
} from "lucide-react";

interface JourneyMilestone {
  period: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  status?: "past" | "present" | "future";
}

function ChronologicalTimeline({ items }: { items: JourneyMilestone[] }) {
  const reduced = usePrefersReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 65%"],
  });
  const spineScaleY = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div
      ref={timelineRef}
      className="relative ml-3 sm:ml-6 pl-6 sm:pl-8 space-y-6 py-2"
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--border)]"
      />
      <motion.span
        aria-hidden="true"
        style={
          reduced
            ? { scaleY: 1, originY: 0 }
            : { scaleY: spineScaleY, originY: 0 }
        }
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C7E34A]"
      />

      {items.map((item, idx) => {
        const Icon = item.icon;
        const isCurrent = item.status === "present";
        const isFuture = item.status === "future";

        return (
          <EditorialReveal
            key={idx}
            delay={Math.min(idx * 0.04, 0.24)}
            distance={14}
          >
            <div className="relative group">
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-4 w-3.5 h-3.5 rounded-full border-2 transition-colors ${
                  isCurrent
                    ? "bg-[#C7E34A] border-[#20231D] dark:border-[#151713]"
                    : isFuture
                    ? "bg-[var(--accent)] border-[var(--bg)]"
                    : "bg-[var(--surface)] border-[var(--border-strong)] group-hover:border-[#C7E34A]"
                }`}
              />

              <div className="card p-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2.5 text-[var(--text-muted)]">
                    <Icon className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                    <span className={`font-bold tabular-nums ${isCurrent ? "text-[var(--text)]" : "text-[var(--text-secondary)]"}`}>
                      {item.period}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.category}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-[11px] font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold font-display text-[var(--text)]">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </div>
          </EditorialReveal>
        );
      })}
    </div>
  );
}

const JOURNEY_HORIZONTAL_STOPS: NarrativeStop[] = [
  {
    id: "stop-2013",
    index: "01",
    eyebrow: "2013 · Athletics",
    title: "Competitive Table Tennis",
    body: "Started formal table tennis training, progressing to district representation and developing composure under fast rally pressure.",
    meta: "Focus: Reflex discipline & patience",
  },
  {
    id: "stop-2021",
    index: "02",
    eyebrow: "2021 · Early Prototyping",
    title: "Toycathon National Finals",
    body: "Reached the national Top 15 in Toycathon, learning how to frame practical problem statements into testable prototypes.",
    meta: "Focus: Structured product thinking",
  },
  {
    id: "stop-youtube",
    index: "03",
    eyebrow: "2021–2026 · Communication",
    title: "Technical Media & Teaching",
    body: "Started Technical AZ and Daily Decipher to break down technical ideas visually, discovering how clarity shapes user trust.",
    meta: "Focus: Narrative & visual clarity",
  },
  {
    id: "stop-kiit",
    index: "04",
    eyebrow: "2025 · University",
    title: "KIIT B.Tech CSE (AI & ML)",
    body: "Began undergraduate study in Computer Science & Engineering at KIIT Bhubaneswar, grounding practical software work in theory.",
    meta: "Focus: Mathematics, C++ & systems",
  },
  {
    id: "stop-technex",
    index: "05",
    eyebrow: "2026 · Collaboration",
    title: "Hackathons & Team Engineering",
    body: "Collaborated across campus and national techfests such as Technex'26 IIT BHU and SIH 2026 under tight sprint constraints.",
    meta: "Focus: Rapid multi-role execution",
  },
  {
    id: "stop-systems",
    index: "06",
    eyebrow: "Present · Craft",
    title: "End-to-End Systems Focus",
    body: "Exploring human-in-the-loop workflows, full-stack TypeScript architectures, computer vision pipelines, and algorithmic rigor.",
    meta: "Focus: Maintainable engineering",
  },
];

interface AboutSectionProps {
  onNavigateTab?: (tab: "certificates" | "projects" | "contact") => void;
}

function AboutSectionComponent({ onNavigateTab }: AboutSectionProps) {
  const [activeTab, setActiveTab] = useState<"narrative" | "timeline" | "education">("narrative");
  const [portraitFailed, setPortraitFailed] = useState(false);

  useEffect(() => {
    requestScrollTriggerRefresh(220);
  }, [activeTab]);

  const values = [
    { name: "Continuous Learning", desc: "A steady commitment to understanding fundamentals beneath abstractions.", icon: BookOpen },
    { name: "Integrity", desc: "Alignment between design decisions, communication, and honest engineering claims.", icon: Shield },
    { name: "Curiosity", desc: "Digging into how complex systems behave under failure and edge conditions.", icon: Compass },
    { name: "Consistency", desc: "Compounding capability through quiet, regular daily problem solving.", icon: Flame },
    { name: "Discipline", desc: "Protecting deep focus time for writing, reading, and careful debugging.", icon: Target },
    { name: "Collaboration", desc: "Communicating clearly across teammates so everyone ships with confidence.", icon: Sparkles }
  ];

  const strengths = [
    { title: "Rapid System Synthesis", desc: "Turns documentation, technical papers, and API specifications into clean, working implementations." },
    { title: "Algorithmic Discipline", desc: "Approaches data structures with space-time bounds awareness rather than memorizing patterns." },
    { title: "Full-Cycle Ownership", desc: "Connects frontend interface details with backend contracts from initial design through deployment." },
    { title: "Composure Under Constraints", desc: "Maintains clean structure and steady communication during time-boxed sprints and competitions." }
  ];

  const improvements = [
    {
      title: "Over-Polishing & Perfectionism",
      area: "Time Management",
      desc: "Prone to spending extra hours refining visual micro-details. Mitigated by setting strict prototype timeboxes before polishing."
    },
    {
      title: "Breadth vs. Depth Scheduling",
      area: "Focus Allocation",
      desc: "Interest across ML theory, systems, and web interfaces can compete for time. Managed through dedicated study blocks."
    },
    {
      title: "Large-Team Codebase Scale",
      area: "Industry Exposure",
      desc: "Experienced in building standalone and small-team systems; continuing to grow familiarity with large multi-team production repositories."
    }
  ];

  const extracurriculars = [
    { name: "Competitive Table Tennis", desc: "District-level representative; trains agility, reflex speed, and calm decision-making under rally pressure.", icon: Trophy },
    { name: "Educational Media", desc: "Created technical explainer videos on YouTube, practicing concise storytelling and visual clarity.", icon: Youtube },
    { name: "Financial Markets Study", desc: "Reads about market structure, macroeconomic liquidity cycles, and quantitative reasoning.", icon: Briefcase },
    { name: "Nature & Urban Photography", desc: "Practices observational patience, framing geometry, and lighting attention away from screens.", icon: Camera }
  ];

  const engineeringJourney: JourneyMilestone[] = [
    {
      period: "2011",
      title: "Began Formal Schooling",
      description: "Started formal education with early curiosity toward mathematics and natural sciences.",
      category: "Education",
      icon: BookOpen,
      status: "past"
    },
    {
      period: "2013",
      title: "Began Table Tennis Training",
      description: "Started competitive table tennis training, instilling habits of deliberate repetition and focus.",
      category: "Athletics",
      icon: Trophy,
      status: "past"
    },
    {
      period: "2019",
      title: "Represented District in Table Tennis",
      description: "Selected to represent Hooghly district in competitive table tennis tournaments.",
      category: "Athletics",
      icon: Medal,
      status: "past"
    },
    {
      period: "2021",
      title: "Toycathon National Finals",
      description: "Reached national finals (Top 15) in Toycathon, an innovation challenge organized by the Government of India.",
      category: "Innovation",
      icon: Award,
      status: "past"
    },
    {
      period: "2021–2023",
      title: "Technical AZ (YouTube)",
      description: "Produced tutorials and consumer technology explainers on Technical AZ, learning visual communication firsthand.",
      category: "Media",
      icon: Video,
      status: "past"
    },
    {
      period: "2021–2023",
      title: "Freelance Digital Media & Client Work",
      description: "Worked with independent creators and small teams on visual strategy and thumbnail design.",
      category: "Freelancing",
      icon: Briefcase,
      status: "past"
    },
    {
      period: "2023",
      title: "CBSE Class 10 Completion",
      description: "Completed secondary school examinations at Aditya Birla Vani Bharati.",
      category: "Academics",
      icon: GraduationCap,
      status: "past"
    },
    {
      period: "2023–2026",
      title: "Daily Decipher (YouTube)",
      description: "Launched Daily Decipher to turn complex topics into accessible visual breakdowns for an organic learner audience.",
      category: "Media",
      icon: Youtube,
      status: "past"
    },
    {
      period: "2025",
      title: "CBSE Class 12 Completion (Science)",
      description: "Completed higher secondary studies in Science at Aditya Birla Vani Bharati.",
      category: "Academics",
      icon: GraduationCap,
      status: "past"
    },
    {
      period: "2025",
      title: "Deepened Software & Algorithmic Practice",
      description: "Shifted focus toward building full-stack web systems, studying machine learning, and practicing C++ algorithms.",
      category: "Engineering",
      icon: Code,
      status: "past"
    },
    {
      period: "2025 – Present",
      title: "B.Tech CSE (AI & ML) at KIIT Bhubaneswar",
      description: "Undergraduate study at Kalinga Institute of Industrial Technology focusing on systems engineering, data structures, and applied AI.",
      category: "University",
      icon: Building2,
      status: "present"
    },
    {
      period: "2026",
      title: "Inter-Collegiate Technical Competitions",
      description: "Participated in national sprints including Technex'26 at IIT (BHU) and Smart India Hackathon workflows.",
      category: "Collaboration",
      icon: Star,
      status: "past"
    },
    {
      period: "Present",
      title: "Systems, AI Tooling & Full-Stack Engineering",
      description: "Continuing to refine human-in-the-loop workflow software, vision pipelines, and clean frontend engineering.",
      category: "Practice",
      icon: Rocket,
      status: "present"
    },
    {
      period: "Horizon",
      title: "AI Systems & Reliable Software Craft",
      description: "Aiming to contribute to thoughtful engineering teams working on resilient AI tooling and developer infrastructure.",
      category: "Direction",
      icon: Target,
      status: "future"
    }
  ];

  const handleNavigate = (tab: "certificates" | "projects" | "contact") => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      window.dispatchEvent(new CustomEvent("portfolio-navigate-tab", { detail: tab }));
    }
  };

  return (
    <div className="w-full space-y-12 sm:space-y-14 pb-12">
      {/* 1. EDITORIAL HEADER */}
      <header
        id="about-hero"
        className="relative py-4 sm:py-6 border-b border-[var(--border)] space-y-6"
      >
        <ContourBackground density="subtle" />

        <div className="relative z-10 space-y-6">
          <EditorialSectionHeader
            level="h1"
            eyebrow="01 · Background & Approach"
            title="Background,"
            italicHighlight="journey & engineering principles."
            description="Computer Science undergraduate at KIIT University originally from Hooghly, West Bengal—shaped by competitive table tennis, visual communication, and systems-minded software development."
          />

          {/* Section View Switcher */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--border)]" role="tablist" aria-label="About sections">
            {[
              { id: "narrative", label: "Narrative & Approach", icon: User },
              { id: "timeline", label: "Timeline (2011–Present)", icon: Calendar },
              { id: "education", label: "Academic Background", icon: GraduationCap }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(tab.id as "narrative" | "timeline" | "education")}
                  className={`btn !min-h-[44px] !py-2 !px-4 !text-xs ${
                    isSelected ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 2. TAB CONTENT PANELS */}
      <AnimatePresence mode="wait">
        {activeTab === "narrative" && (
          <motion.div
            key="narrative-tab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-12"
          >
            {/* Open Editorial Biography Spread */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-10 border-b border-[var(--border)]">
              {/* Portrait & Grounded Facts */}
              <div className="lg:col-span-4 space-y-5">
                <MaskMediaReveal immediate delay={0.1} className="aspect-[4/5] w-full rounded-[10px] overflow-hidden border border-[var(--border-strong)] bg-[var(--surface)]">
                  {portraitFailed ? (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-[#151713] p-6 text-center text-[#F4F4ED]">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C7E34A]">
                        SM · Hooghly / Bhubaneswar
                      </span>
                      <span className="mt-2 font-display text-xl font-bold tracking-tight">
                        Sayam Mukherjee
                      </span>
                    </div>
                  ) : (
                    <ScrollScaleImage className="w-full h-full">
                      <img
                        src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg"
                        alt="Portrait of Sayam Mukherjee, Computer Science and Engineering student at KIIT"
                        width={400}
                        height={500}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() => setPortraitFailed(true)}
                        className="w-full h-full object-cover object-[50%_20%]"
                      />
                    </ScrollScaleImage>
                  )}
                </MaskMediaReveal>

                <dl className="divide-y divide-[var(--border)] border-y border-[var(--border)] text-xs font-mono">
                  <div className="flex flex-wrap justify-between gap-2 py-2.5 min-w-0">
                    <dt className="text-[var(--text-muted)] shrink-0">Hometown / Study</dt>
                    <dd className="font-semibold text-[var(--text)] text-right break-words min-w-0">Hooghly / Bhubaneswar</dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2 py-2.5 min-w-0">
                    <dt className="text-[var(--text-muted)] shrink-0">University</dt>
                    <dd className="font-semibold text-[var(--text)] text-right break-words min-w-0">KIIT University</dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2 py-2.5 min-w-0">
                    <dt className="text-[var(--text-muted)] shrink-0">Degree Track</dt>
                    <dd className="font-semibold text-[var(--text)] text-right break-words min-w-0">B.Tech CSE (AI &amp; ML)</dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2 py-2.5 min-w-0">
                    <dt className="text-[var(--text-muted)] shrink-0">Outside Code</dt>
                    <dd className="font-semibold text-[var(--accent)] text-right">Table Tennis · Photography</dd>
                  </div>
                </dl>
              </div>

              {/* Narrative Prose */}
              <div className="lg:col-span-8 space-y-5">
                <div className="space-y-2">
                  <span className="text-xs font-mono tracking-wider text-[var(--accent)] font-semibold uppercase">
                    Personal Story &amp; Motivation
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)] leading-tight text-balance">
                    Building practical systems from{" "}
                    <span className="font-serif-editorial italic font-normal">solid fundamentals.</span>
                  </h2>
                </div>

                <div className="space-y-4 text-sm sm:text-[15.5px] text-[var(--text-secondary)] leading-[1.7] font-sans max-w-[66ch]">
                  <p>
                    I am a Computer Science undergraduate at KIIT University in Bhubaneswar, originally from Hooghly, West Bengal. Growing up, my routine was split between competitive table tennis halls and experimenting with software, video editing, and visual design on my computer.
                  </p>
                  <p>
                    Starting YouTube channels in my teens taught me something that still shapes how I build software today: complexity is easy, clarity is hard. If an interface or explanation forces people to work too hard to understand what is happening, it fails regardless of how clever the underlying machinery is.
                  </p>
                  <p>
                    Today, I apply that mindset across full-stack TypeScript web applications, machine learning and computer vision workflows, and daily C++ algorithmic practice—focusing on predictable state boundaries, thoughtful ergonomics, and systems that fail gracefully.
                  </p>
                </div>

                {/* Editorial Pull-Quote */}
                <blockquote className="mt-6 py-4 border-y border-[var(--border)] flex items-start gap-3.5 max-w-[66ch]">
                  <Quote className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm sm:text-base font-serif-editorial italic leading-relaxed text-[var(--text)]">
                    &ldquo;Good engineering is less about maximizing lines of code and more about constructing clear boundaries where systems remain understandable and people stay in control.&rdquo;
                  </p>
                </blockquote>
              </div>
            </div>

            {/* Sideways Milestone Progression */}
            <HorizontalNarrative
              eyebrow="Progression · 2013 — Present"
              title="From competitive rallies to systems engineering"
              stops={JOURNEY_HORIZONTAL_STOPS}
            />

            {/* Operating Values & Principles */}
            <div id="about-values" className="space-y-5">
              <EditorialReveal className="space-y-1">
                <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
                  Working Philosophy
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)]">
                  Values &amp; Engineering Habits
                </h3>
              </EditorialReveal>

              <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {values.map((v) => {
                  const Icon = v.icon;
                  return (
                    <StaggerItem key={v.name} className="card p-5 space-y-2 transition-colors hover:border-[var(--border-strong)]">
                      <div className="flex items-center gap-2.5 text-[var(--accent)]">
                        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <h4 className="text-sm font-bold font-display text-[var(--text)]">
                          {v.name}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                        {v.desc}
                      </p>
                    </StaggerItem>
                  );
                })}
              </StaggerGroup>
            </div>

            {/* Strengths & Honest Areas of Growth */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6 space-y-4">
                <div className="space-y-1 border-b border-[var(--border)] pb-3">
                  <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
                    Strengths
                  </span>
                  <h3 className="text-lg font-bold font-display text-[var(--text)]">
                    How I Work
                  </h3>
                </div>

                <div className="space-y-4">
                  {strengths.map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" aria-hidden="true" />
                        <h4 className="text-sm font-bold text-[var(--text)] font-sans">
                          {s.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pl-5.5 font-sans">
                        {s.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6 space-y-4">
                <div className="space-y-1 border-b border-[var(--border)] pb-3">
                  <span className="text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Self-Reflection
                  </span>
                  <h3 className="text-lg font-bold font-display text-[var(--text)]">
                    Areas of Ongoing Growth
                  </h3>
                </div>

                <div className="space-y-4">
                  {improvements.map((imp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-[var(--text)] font-sans">
                          {imp.title}
                        </h4>
                        <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0">
                          {imp.area}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                        {imp.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Extracurriculars */}
            <div className="space-y-5">
              <EditorialReveal className="space-y-1">
                <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
                  Beyond the Terminal
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)]">
                  Interests &amp; Athletics
                </h3>
              </EditorialReveal>

              <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {extracurriculars.map((e, idx) => {
                  const Icon = e.icon;
                  return (
                    <StaggerItem key={idx} className="card p-5 space-y-2.5 transition-colors hover:border-[var(--border-strong)]">
                      <Icon className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                      <h4 className="text-sm font-bold font-display text-[var(--text)]">
                        {e.name}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                        {e.desc}
                      </p>
                    </StaggerItem>
                  );
                })}
              </StaggerGroup>
            </div>
          </motion.div>
        )}

        {activeTab === "timeline" && (
          <motion.div
            key="timeline-tab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-8"
          >
            <PinnedHeadingSection
              heading={
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider block">
                      Chronology
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)] leading-tight">
                      Personal &amp; Academic Journey{" "}
                      <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                        (2011 – Present)
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed max-w-md">
                      Key milestones across schooling, athletics, technical communication, and undergraduate engineering.
                    </p>
                  </div>
                </div>
              }
            >
              <ChronologicalTimeline items={engineeringJourney} />
            </PinnedHeadingSection>
          </motion.div>
        )}

        {activeTab === "education" && (
          <motion.div
            key="education-tab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            <div className="card p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-[var(--border)] pb-4">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">
                  University Study
                </span>
                <h3 className="text-xl font-bold font-display text-[var(--text)]">
                  {universityEducation.degree} — {universityEducation.specialization}
                </h3>
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  {universityEducation.institution} · Expected {universityEducation.expectedGraduation}
                </p>
              </div>

              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-[66ch]">
                {universityEducation.description} Completed first-year coursework with a{" "}
                <span className="font-semibold text-[var(--text)]">
                  {universityEducation.cgpa} / {universityEducation.cgpaScale} CGPA
                </span>
                , focusing on core data structures, object-oriented programming, discrete mathematics, and applied machine learning foundations.
              </p>

              <div className="pt-4 border-t border-[var(--border)] grid grid-cols-1 md:grid-cols-2 gap-4">
                {schoolEducation.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                      <span>{rec.title}</span>
                      <span>{rec.session}</span>
                    </div>
                    <div className="text-sm font-bold font-display text-[var(--text)]">
                      {rec.institution}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {rec.board} · {rec.percentage}
                      {rec.stream ? ` (${rec.stream})` : ""}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Official board mark sheets, competition certificates, and full academic records live in Credentials.
                </p>
                <button
                  type="button"
                  onClick={() => handleNavigate("certificates")}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] hover:underline cursor-pointer"
                >
                  <span>View Certificates &amp; Academic Records</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const AboutSection = memo(AboutSectionComponent);
export default AboutSection;
