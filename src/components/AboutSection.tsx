import { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePortfolio } from "../context/PortfolioContext";
import { 
  GraduationCap, Award, MapPin, Calendar, Heart, Shield, Compass, 
  Sparkles, CheckCircle2, BookOpen, User, Target, Cpu,
  Trophy, Medal, Video, Briefcase, Youtube, Code, Building2, Star, Rocket,
  Flame, Quote, Dumbbell
} from "lucide-react";

interface JourneyMilestone {
  period: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  status?: "past" | "present" | "future";
}

function AboutSectionComponent() {
  const [activeTab, setActiveTab] = useState<"narrative" | "timeline" | "education">("narrative");
  const [activeValueIndex, setActiveValueIndex] = useState<number>(0);
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  // Operating Values
  const values = [
    { name: "Continuous Learning", desc: "A disciplined commitment to expand domain mastery daily.", icon: BookOpen },
    { name: "Integrity", desc: "Honesty and alignment between architecture, actions, and ethics.", icon: Shield },
    { name: "Curiosity", desc: "Digging deeply into the 'why' of complex systems and neural mechanics.", icon: Compass },
    { name: "Consistency", desc: "Compounding value through quiet, relentless daily problem solving.", icon: Flame },
    { name: "Discipline", desc: "Commanding attention and deep work over instant superficial distractions.", icon: Target },
    { name: "Collaboration", desc: "Empowering engineering peers and succeeding as a cohesive unit.", icon: Sparkles }
  ];

  // Self-Reflective Strengths
  const strengths = [
    { title: "Rapid System Synthesis", desc: "Deconstructs complex documentation, research papers, and API specifications quickly into clean, type-safe working prototypes." },
    { title: "Rigorous Algorithmic Discipline", desc: "Approaches data structures with space-time bounds awareness, maintaining 100% acceptance across practiced LeetCode problems." },
    { title: "Full-Cycle Ownership", desc: "Bridges user intuition, frontend UI precision, and server-side logic from first idea through deployment and monitoring." },
    { title: "Resilience Under Pressure", desc: "Proven under high-stakes hackathon deadlines (SIH 2026, Technex'26 IIT BHU) without compromising architecture or team morale." }
  ];

  // Areas of Continuous Improvement (Honest & Self-Aware)
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

  // Extracurriculars
  const extracurriculars = [
    { name: "Competitive Table Tennis", desc: "District-level representative; trains agility, reflex speed, and mental composure under rally pressure.", icon: Trophy },
    { name: "Content Creation (YouTube)", desc: "Grew Daily Decipher to 10K+ subscribers and Technical AZ to 2.06K+, distilling complex ideas into clear narratives.", icon: Youtube },
    { name: "Financial Markets & Analysis", desc: "Studies quantitative market trends, macroeconomic liquidity cycles, and algorithmic trading foundations.", icon: Briefcase },
    { name: "Nature & Urban Photography", desc: "Cultivates observational patience, composition geometry, and lighting discipline outside the terminal.", icon: CameraIcon }
  ];

  function CameraIcon(props: { className?: string }) {
    return <Sparkles {...props} />;
  }

  // Engineering Journey Timeline Data (Strictly Chronological & Exact)
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
      title: "Toycathon National Finals — Top 15",
      description: "Reached national finals and achieved a Top 15 ranking in Toycathon, an innovation competition organized by the Govt. of India.",
      category: "Innovation",
      icon: Award,
      status: "past"
    },
    {
      period: "2021–2023",
      title: "Content Creator — Technical AZ",
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
      title: "Content Creator — Daily Decipher",
      description: "Founded Daily Decipher on YouTube, producing educational breakdowns and growing an organic community of 10K+ subscribers.",
      category: "Content Creation",
      icon: Youtube,
      status: "past"
    },
    {
      period: "2025",
      title: "86.2% in CBSE Class 12 Board Examinations",
      description: "Graduated higher secondary with science concentration (Physics, Chemistry, Mathematics, Computer Science).",
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
      title: "Technex'26 — IIT BHU Finalist in 5/6 Competitions",
      description: "Competed at IIT Varanasi's national techfest, advancing to the finals across 5 separate technical challenges.",
      category: "Competitions",
      icon: Star,
      status: "past"
    },
    {
      period: "2026",
      title: "Engineered Flagship Systems (Operon, Mausam, RouteLedger)",
      description: "Built the Operon multi-agent engine, Mausam meteorological platform for SIH 2026, RouteLedger HOS compliance router, and Memory-in-Motion neural laboratory.",
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
    <div className="w-full space-y-12 sm:space-y-16 pb-12">
      {/* 1. EDITORIAL HEADER */}
      <header className="space-y-4 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
            BIOGRAPHY &amp; HUMAN CORE · ABOUT SAYAM
          </span>
          <span className="h-px w-8 bg-zinc-300 dark:bg-zinc-800" />
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
            Who I Am, How I Think, What Drives Me
          </span>
        </div>

        <div className="space-y-2 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-display leading-[1.1]">
            SAYAM MUKHERJEE <br />
            <span className="text-zinc-500 dark:text-zinc-400">ENGINEER, BUILDER &amp; ATHLETE</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans pt-1">
            Undergraduate Computer Science student at KIIT Bhubaneswar, content creator with 12K+ total community reach, district table tennis athlete, and full-stack software engineer.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { id: "narrative", label: "Personal Narrative & Values", icon: User },
            { id: "timeline", label: "Lived Chronological Timeline (2011–2026)", icon: Calendar },
            { id: "education", label: "Academics & Honors", icon: GraduationCap }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500 text-white font-semibold shadow-sm"
                    : isLight
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                    : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* 2. TAB CONTENT PANELS */}
      <AnimatePresence mode="wait">
        {/* NARRATIVE & VALUES TAB */}
        {activeTab === "narrative" && (
          <motion.div
            key="narrative-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-12"
          >
            {/* Biography & Profile Hero Card */}
            <div className={`p-6 sm:p-8 rounded-2xl border ${
              isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-950/40 border-zinc-850"
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Photo & Essential Badges */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="aspect-square w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative bg-zinc-100 dark:bg-zinc-900">
                    <img 
                      src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg" 
                      alt="Sayam Mukherjee" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className={`p-4 rounded-xl border space-y-2 text-xs font-mono ${
                    isLight ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-zinc-900/40 border-zinc-850 text-zinc-400"
                  }`}>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">Hooghly / Bhubaneswar, India</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Institution:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">KIIT University (B.Tech CSE)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LeetCode:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% Acceptance Rate</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Audience:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">12K+ Total YouTube Subs</span>
                    </div>
                  </div>
                </div>

                {/* Narrative Text */}
                <div className="lg:col-span-8 space-y-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">
                    PERSONAL STORY &amp; MOTIVATION
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-zinc-900 dark:text-white">
                    Bridging Computational Rigor with Human Impact
                  </h2>

                  <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                    <p>
                      I am a Computer Science undergraduate at KIIT Bhubaneswar with a deep fascination for autonomous AI agents, spatial computing, and high-performance full-stack architectures. Originally from Hooghly, West Bengal, I grew up balancing intense athletic training in table tennis with self-directed explorations in programming and digital media.
                    </p>
                    <p>
                      At age 16, I founded my first tech YouTube channel, <strong>Technical AZ</strong>, growing it to over 2,000 subscribers before launching <strong>Daily Decipher</strong>, which has now reached an organic audience of over 10,000 learners. Running these channels and operating an independent digital marketing agency taught me how real users consume information: they value clarity, speed, and genuine utility above buzzwords.
                    </p>
                    <p>
                      In software engineering, I apply this same philosophy. I don’t build toy applications or decorative cards; I build end-to-end operational systems like <strong>Operon</strong> (a multi-agent AI engine with non-bypassable human governance), <strong>Mausam</strong> (an IMD-grounded climate platform for SIH 2026), and <strong>RouteLedger</strong> (a graph-routing engine enforcing federal trucker rest mandates).
                    </p>
                  </div>

                  {/* Quote Banner */}
                  <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 ${
                    isLight ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-zinc-900/30 border-zinc-850 text-zinc-300"
                  }`}>
                    <Quote className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm italic font-sans leading-relaxed">
                      "I believe great engineering is not about writing the maximum amount of code, but about constructing reliable boundaries where systems fail gracefully and users feel empowered."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Values & Principles */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  CORE PRINCIPLES
                </span>
                <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-white">
                  Values &amp; Working Philosophy
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {values.map((v, i) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.name}
                      className={`p-4 rounded-xl border space-y-2 ${
                        isLight ? "bg-white border-slate-200" : "bg-zinc-950/40 border-zinc-850"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                        <Icon className="w-4 h-4" />
                        <h4 className="text-sm font-bold font-display text-zinc-900 dark:text-zinc-100">
                          {v.name}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                        {v.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strengths & Honest Areas of Improvement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className={`p-6 rounded-2xl border space-y-4 ${
                isLight ? "bg-white border-slate-200" : "bg-zinc-950/40 border-zinc-850"
              }`}>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    PROVEN CAPACITIES
                  </span>
                  <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-white">
                    Core Strengths
                  </h3>
                </div>

                <div className="space-y-3">
                  {strengths.map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-sans">
                          {s.title}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-5 font-sans">
                        {s.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Areas for Growth */}
              <div className={`p-6 rounded-2xl border space-y-4 ${
                isLight ? "bg-white border-slate-200" : "bg-zinc-950/40 border-zinc-850"
              }`}>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    SELF-REFLECTION
                  </span>
                  <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-white">
                    Areas of Continuous Improvement
                  </h3>
                </div>

                <div className="space-y-3">
                  {improvements.map((imp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-sans">
                          {imp.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {imp.area}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                        {imp.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Beyond the Screen / Extracurriculars */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  LIFE BEYOND THE SCREEN
                </span>
                <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-white">
                  Athletics, Content &amp; Inquiries
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {extracurriculars.map((e, idx) => {
                  const Icon = e.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border space-y-2 ${
                        isLight ? "bg-white border-slate-200" : "bg-zinc-950/40 border-zinc-850"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      <h4 className="text-sm font-bold font-display text-zinc-900 dark:text-zinc-100">
                        {e.name}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                        {e.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === "timeline" && (
          <motion.div
            key="timeline-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                LIVED CHRONOLOGY
              </span>
              <h3 className="text-2xl font-bold font-display text-zinc-900 dark:text-white">
                Engineering &amp; Life Milestones (2011 – Present)
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans">
                An authentic chronological account of schooling, athletic achievements, entrepreneurial ventures, and software systems.
              </p>
            </div>

            <div className={`relative border-l ml-3 sm:ml-6 pl-6 sm:pl-8 space-y-8 py-2 ${
              isLight ? "border-slate-300" : "border-zinc-800"
            }`}>
              {engineeringJourney.map((item, idx) => {
                const Icon = item.icon;
                const isCurrent = item.status === "present";
                const isFuture = item.status === "future";

                return (
                  <div key={idx} className="relative group">
                    {/* Timeline Node Dot */}
                    <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      isCurrent
                        ? "bg-emerald-500 border-emerald-300 ring-4 ring-emerald-500/20"
                        : isFuture
                        ? "bg-cyan-500 border-cyan-300"
                        : isLight
                        ? "bg-white border-slate-400 group-hover:border-cyan-500"
                        : "bg-zinc-900 border-zinc-700 group-hover:border-cyan-400"
                    }`} />

                    <div className={`p-4 sm:p-5 rounded-xl border transition-all ${
                      isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-950/40 border-zinc-850"
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold ${
                            isCurrent 
                              ? "text-emerald-600 dark:text-emerald-400" 
                              : isFuture
                              ? "text-cyan-600 dark:text-cyan-400"
                              : "text-zinc-500"
                          }`}>
                            {item.period}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                            {item.category}
                          </span>
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            ACTIVE PHASE
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold font-display text-zinc-900 dark:text-white pt-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans pt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* EDUCATION & HONORS TAB */}
        {activeTab === "education" && (
          <motion.div
            key="education-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                ACADEMIC CREDENTIALS
              </span>
              <h3 className="text-2xl font-bold font-display text-zinc-900 dark:text-white">
                Formal Education &amp; Academic Honors
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* KIIT University */}
              <div className={`p-6 rounded-2xl border space-y-3 ${
                isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-950/40 border-zinc-850"
              }`}>
                <div className="flex items-center justify-between text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                  <span>2025 – PRESENT</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">UNDERGRADUATE</span>
                </div>
                <h4 className="text-lg font-bold font-display text-zinc-900 dark:text-white">
                  B.Tech in Computer Science Engineering
                </h4>
                <p className="text-xs font-mono text-zinc-500">
                  Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans pt-1">
                  Core coursework in Data Structures &amp; Algorithms, Object-Oriented Programming, Computer Organization, and Discrete Mathematics.
                </p>
              </div>

              {/* High School / CBSE */}
              <div className={`p-6 rounded-2xl border space-y-3 ${
                isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-950/40 border-zinc-850"
              }`}>
                <div className="flex items-center justify-between text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                  <span>CBSE BOARD EXAMINATIONS</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">TOP HONORS</span>
                </div>
                <h4 className="text-lg font-bold font-display text-zinc-900 dark:text-white">
                  Aditya Birla Vani Bharati
                </h4>
                <p className="text-xs font-mono text-zinc-500">
                  Secondary &amp; Senior Secondary Education
                </p>
                <div className="pt-2 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                    <span>Class 10 CBSE Board (2023):</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">92.6%</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                    <span>Class 12 CBSE Board (2025):</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">86.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Honors */}
            <div className="space-y-3">
              <h4 className="text-sm font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                Verified Honors &amp; Competitions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "Technex'26 IIT BHU", desc: "Finalist across 5 out of 6 challenges at IIT Varanasi techfest" },
                  { title: "Toycathon National Finals", desc: "Top 15 ranking in Govt. of India national innovation hackathon" },
                  { title: "Smart India Hackathon", desc: "Team Algnite member developing the Mausam platform (2026)" },
                  { title: "District Table Tennis", desc: "Selected and represented district at competitive table tennis tournaments" }
                ].map((h, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border space-y-1 ${
                      isLight ? "bg-white border-slate-200" : "bg-zinc-950/40 border-zinc-850"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <h5 className="text-xs font-bold font-sans text-zinc-900 dark:text-zinc-100 pt-1">
                      {h.title}
                    </h5>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                ))}
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
