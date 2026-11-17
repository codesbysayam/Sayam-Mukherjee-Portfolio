import { useState, useRef, memo } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import AcademicRecord from "./AcademicRecord";
import { EditorialReveal, MaskMediaReveal, StaggerGroup, StaggerItem } from "../motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../motion/tokens";
import {
  GraduationCap, Award, Calendar, Shield, Compass,
  Sparkles, CheckCircle2, BookOpen, User, Target,
  Trophy, Medal, Video, Briefcase, Youtube, Code, Building2, Star, Rocket,
  Flame, Quote, Camera
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
      {/* Static track spine */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--border)]"
      />
      {/* Scroll-drawn Signal Lime spine */}
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
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#C7E34A] text-[#20231D] text-[10px] font-bold uppercase tracking-wider">
                      Active Phase
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

function AboutSectionComponent() {
  const [activeTab, setActiveTab] = useState<"narrative" | "timeline" | "education">("narrative");

  const values = [
    { name: "Continuous Learning", desc: "A disciplined commitment to expand domain mastery daily.", icon: BookOpen },
    { name: "Integrity", desc: "Honesty and alignment between architecture, actions, and ethics.", icon: Shield },
    { name: "Curiosity", desc: "Digging deeply into the 'why' of complex systems and neural mechanics.", icon: Compass },
    { name: "Consistency", desc: "Compounding value through quiet, relentless daily problem solving.", icon: Flame },
    { name: "Discipline", desc: "Commanding attention and deep work over instant superficial distractions.", icon: Target },
    { name: "Collaboration", desc: "Empowering engineering peers and succeeding as a cohesive unit.", icon: Sparkles }
  ];

  const strengths = [
    { title: "Rapid System Synthesis", desc: "Turns documentation, technical papers, and API specifications into clean, working prototypes." },
    { title: "Rigorous Algorithmic Discipline", desc: "Approaches data structures with space-time bounds awareness, focusing on understanding core principles rather than memorizing solutions." },
    { title: "Full-Cycle Ownership", desc: "Connects frontend interface details with server-side logic from first concept through deployment and monitoring." },
    { title: "Resilience Under Pressure", desc: "Proven under high-stakes hackathon deadlines (SIH 2026, Technex'26 IIT BHU) without compromising architecture or team morale." }
  ];

  const improvements = [
    {
      title: "Over-Polishing & Perfectionism",
      area: "Time Management",
      desc: "Prone to spending extra hours obsessing over micro-spacing or aesthetic details. Actively mitigated by establishing strict MVP timeboxes before refactoring."
    },
    {
      title: "Breadth vs. Depth Scheduling",
      area: "Cognitive Load",
      desc: "Desire to master AI theory, market mechanics, and web systems simultaneously can fracture focus. Managed through structured priority sprints."
    },
    {
      title: "Enterprise Scale Exposure",
      area: "Industry Experience",
      desc: "While skilled at building and shipping standalone full-stack apps, still expanding hands-on familiarity with multi-team legacy enterprise codebases."
    }
  ];

  const extracurriculars = [
    { name: "Competitive Table Tennis", desc: "District-level representative; trains agility, reflex speed, and mental composure under rally pressure.", icon: Trophy },
    { name: "Content Creation (YouTube)", desc: "Grew Daily Decipher to 10K+ subscribers and Technical AZ to 2.06K+, distilling complex ideas into clear narratives.", icon: Youtube },
    { name: "Financial Markets & Analysis", desc: "Studies quantitative market trends, macroeconomic liquidity cycles, and algorithmic trading foundations.", icon: Briefcase },
    { name: "Nature & Urban Photography", desc: "Cultivates observational patience, composition geometry, and lighting discipline outside the terminal.", icon: Camera }
  ];

  const engineeringJourney: JourneyMilestone[] = [
    {
      period: "2011",
      title: "Began Formal Schooling",
      description: "Started my formal educational journey with early curiosity for natural sciences and mathematics.",
      category: "Education",
      icon: BookOpen,
      status: "past"
    },
    {
      period: "2013",
      title: "Began Table Tennis Training",
      description: "Started competitive table tennis training, instilling lifelong disciplines of hand-eye reflex and deliberate practice.",
      category: "Athletics",
      icon: Trophy,
      status: "past"
    },
    {
      period: "2019",
      title: "Represented District in Table Tennis",
      description: "Selected to represent my district in competitive table tennis tournaments.",
      category: "Athletics",
      icon: Medal,
      status: "past"
    },
    {
      period: "2021",
      title: "Toycathon National Finals · Top 15",
      description: "Reached national finals and achieved a Top 15 ranking in Toycathon, an innovation competition organized by the Govt. of India.",
      category: "Innovation",
      icon: Award,
      status: "past"
    },
    {
      period: "2021–2023",
      title: "Content Creator · Technical AZ",
      description: "Founded and scaled Technical AZ on YouTube to 2.06K+ subscribers, producing tutorials on emerging consumer technologies and software.",
      category: "Content Creation",
      icon: Video,
      status: "past"
    },
    {
      period: "2021–2023",
      title: "Founded Social Media Agency & Growth Panel",
      description: "Operated an independent digital marketing panel providing audience growth solutions and client consulting.",
      category: "Entrepreneurship",
      icon: Briefcase,
      status: "past"
    },
    {
      period: "2023",
      title: "92.6% in CBSE Class 10 Board Examinations",
      description: "Completed secondary education with top honors at Aditya Birla Vani Bharati.",
      category: "Academics",
      icon: GraduationCap,
      status: "past"
    },
    {
      period: "2023–2026",
      title: "Content Creator · Daily Decipher",
      description: "Founded Daily Decipher on YouTube, producing educational breakdowns and growing an organic community of 10K+ subscribers.",
      category: "Content Creation",
      icon: Youtube,
      status: "past"
    },
    {
      period: "2025",
      title: "86.2% in CBSE Class 12 Board Examinations",
      description: "Completed the CBSE Class 12 Board Examination with 86.2% in the Science stream at Aditya Birla Vani Bharati.",
      category: "Academics",
      icon: GraduationCap,
      status: "past"
    },
    {
      period: "2025",
      title: "Commenced Open Source & Project Building",
      description: "Began crafting production web apps, exploring deep learning architectures, and deepening algorithmic rigor in C++.",
      category: "Engineering",
      icon: Code,
      status: "past"
    },
    {
      period: "2025 – Present",
      title: "B.Tech CSE at KIIT Bhubaneswar",
      description: "Enrolled in undergraduate Computer Science Engineering at Kalinga Institute of Industrial Technology, Bhubaneswar. Focusing on core systems, data structures, and AI engineering.",
      category: "University",
      icon: Building2,
      status: "present"
    },
    {
      period: "2026",
      title: "Technex'26 · IIT BHU Finalist in 5/6 Competitions",
      description: "Competed at IIT Varanasi's national techfest, advancing to the finals across 5 separate technical challenges.",
      category: "Competitions",
      icon: Star,
      status: "past"
    },
    {
      period: "2026",
      title: "Engineered Flagship Systems (Operon, Mausam, SayamSolves)",
      description: "Built the Operon multi-agent engine, Mausam meteorological platform for SIH 2026, SayamSolves algorithmic practice archive, and real-time computer vision workflows.",
      category: "Projects",
      icon: Rocket,
      status: "present"
    },
    {
      period: "Horizon",
      title: "AI Systems Engineering & Startup Impact",
      description: "Aiming to design high-throughput machine learning infrastructure, lead high-impact engineering ventures, and contribute meaningfully to foundational open source.",
      category: "Vision",
      icon: Target,
      status: "future"
    }
  ];

  return (
    <div className="w-full space-y-12 sm:space-y-14 pb-12">
      {/* 1. EDITORIAL HEADER */}
      <header id="about-hero" className="space-y-5 pt-2 border-b border-[var(--border)] pb-8">
        <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--accent)] tracking-wider uppercase">
            01 · Biography &amp; Human Core
          </span>
          <span aria-hidden="true">/</span>
          <span className="hidden sm:inline">Engineering Identity, Values &amp; Story</span>
        </div>

        <div className="space-y-3 max-w-3xl">
          <h1
            className="font-extrabold tracking-tight text-[var(--text)] font-display leading-[1.03] text-balance"
            style={{ fontSize: "clamp(2.1rem, 4vw, 3.6rem)" }}
          >
            Sayam Mukherjee —{" "}
            <span className="font-serif-editorial italic font-normal text-[var(--text-secondary)]">
              engineer, builder &amp; athlete.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans max-w-2xl">
            Undergraduate Computer Science student at KIIT Bhubaneswar, content creator with 12K+ historical community reach across channels, district table tennis athlete, and software systems engineer.
          </p>
        </div>

        {/* Editorial Tabs */}
        <div className="flex flex-wrap gap-2 pt-1" role="tablist" aria-label="About sections">
          {[
            { id: "narrative", label: "Personal Narrative & Values", icon: User },
            { id: "timeline", label: "Chronological Timeline (2011–2026)", icon: Calendar },
            { id: "education", label: "Academics & Honors", icon: GraduationCap }
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
      </header>

      {/* 2. TAB CONTENT PANELS */}
      <AnimatePresence mode="wait">
        {activeTab === "narrative" && (
          <motion.div
            key="narrative-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="space-y-12"
          >
            {/* Biography & Profile Hero Card */}
            <div className="card p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                {/* Portrait & Essential Ledger */}
                <div className="lg:col-span-4 space-y-4">
                  <MaskMediaReveal immediate delay={0.1} className="aspect-[4/5] w-full rounded-[10px] overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
                    <img
                      src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg"
                      alt="Portrait of Sayam Mukherjee, Computer Science and Engineering student at KIIT"
                      width={400}
                      height={500}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-[50%_20%]"
                    />
                  </MaskMediaReveal>

                  <dl className="p-4 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] space-y-2.5 text-xs font-mono">
                    <div className="flex flex-wrap justify-between gap-2 min-w-0">
                      <dt className="text-[var(--text-muted)] shrink-0">Location</dt>
                      <dd className="font-semibold text-[var(--text)] text-right break-words min-w-0">Hooghly / Bhubaneswar</dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-2 border-t border-[var(--border)] pt-2 min-w-0">
                      <dt className="text-[var(--text-muted)] shrink-0">Institution</dt>
                      <dd className="font-semibold text-[var(--text)] text-right break-words min-w-0">KIIT University (B.Tech CSE)</dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-2 border-t border-[var(--border)] pt-2 min-w-0">
                      <dt className="text-[var(--text-muted)] shrink-0">First-Year CGPA</dt>
                      <dd className="font-semibold text-[var(--accent)] tabular-nums text-right">9.06 / 10.0</dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-2 border-t border-[var(--border)] pt-2 min-w-0">
                      <dt className="text-[var(--text-muted)] shrink-0">LeetCode</dt>
                      <dd className="font-semibold text-[var(--text)] tabular-nums text-right">100% Acceptance Rate</dd>
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

                  <div className="space-y-4 text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed font-sans">
                    <p>
                      I am a Computer Science undergraduate at KIIT Bhubaneswar interested in autonomous AI agents, practical computer vision, and reliable full-stack applications. Originally from Hooghly, West Bengal, I grew up balancing competitive table tennis with self-taught programming and digital media.
                    </p>
                    <p>
                      At age 16, I started my first tech YouTube channel, <strong>Technical AZ</strong>, growing it to over 2,000 subscribers before launching <strong>Daily Decipher</strong>, which reached an organic audience of over 10,000 learners. Producing technical breakdowns and working with early clients taught me early on how people actually interact with technology: they value clarity, speed, and real utility over buzzwords.
                    </p>
                    <p>
                      In my software projects, I stick to that same practical focus. Whether building <strong>Operon</strong> (a multi-agent operational platform with human approvals), <strong>Mausam</strong> (a weather analytics app developed for SIH 2026), or maintaining <strong>SayamSolves</strong> (my C++ algorithmic archive), my priority is building reliable code that solves actual problems.
                    </p>
                  </div>

                  {/* Editorial Callout */}
                  <blockquote className="mt-4 p-5 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] flex items-start gap-3.5">
                    <Quote className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm font-serif-editorial italic leading-relaxed text-[var(--text)]">
                      &ldquo;Great engineering is not about writing the maximum amount of code — it is about constructing reliable boundaries where systems fail gracefully and people stay in control.&rdquo;
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Operating Values & Principles */}
            <div id="about-values" className="space-y-5">
              <EditorialReveal className="space-y-1">
                <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
                  Core Principles
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)]">
                  Values &amp; Working Philosophy
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

            {/* Strengths & Honest Areas of Improvement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6 space-y-4">
                <div className="space-y-1 border-b border-[var(--border)] pb-3">
                  <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
                    Proven Capacities
                  </span>
                  <h3 className="text-lg font-bold font-display text-[var(--text)]">
                    Core Strengths
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
                    Areas of Continuous Improvement
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
                  Athletics, Media &amp; Inquiries
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="space-y-8"
          >
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
                Lived Chronology
              </span>
              <h3 className="text-2xl font-bold font-display text-[var(--text)]">
                Engineering &amp; Life Milestones (2011 – Present)
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans max-w-2xl">
                An authentic chronological account of schooling, athletic achievements, entrepreneurial ventures, and software systems.
              </p>
            </div>

            <ChronologicalTimeline items={engineeringJourney} />
          </motion.div>
        )}

        {activeTab === "education" && (
          <motion.div
            key="education-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="space-y-8"
          >
            <AcademicRecord />

            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Verified Honors &amp; Competitions
              </h4>
              <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Technex'26 IIT BHU", desc: "Finalist across 5 out of 6 challenges at IIT Varanasi techfest" },
                  { title: "Toycathon National Finals", desc: "Top 15 ranking in Govt. of India national innovation hackathon" },
                  { title: "Smart India Hackathon", desc: "Team Algnite member developing the Mausam platform (2026)" },
                  { title: "District Table Tennis", desc: "Selected and represented district at competitive table tennis tournaments" }
                ].map((h, i) => (
                  <StaggerItem key={i} className="card p-5 space-y-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                    <h5 className="text-sm font-bold font-display text-[var(--text)]">
                      {h.title}
                    </h5>
                    <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                      {h.desc}
                    </p>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const AboutSection = memo(AboutSectionComponent);
export default AboutSection;
