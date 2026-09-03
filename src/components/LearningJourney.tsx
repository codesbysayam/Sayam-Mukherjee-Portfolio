import { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Award, BookOpen, Brain, Code, Cpu, Flame,
  GraduationCap, Server, Sparkles, TrendingUp, Zap, ChevronRight,
  MapPin, Activity, CheckCircle2, Star, Clock, Trophy, Layers, Target
} from "lucide-react";

interface TimelineEvent {
  id: string;
  year: number;
  quarter: string;
  title: string;
  subtitle: string;
  category: "academic" | "engineering" | "intelligence" | "systems";
  categoryLabel: string;
  skills: string[];
  skillsProgress: { name: string; value: number; color: string }[];
  details: string;
  projects: string[];
  stats: string;
  badge: { title: string; desc: string };
  icon: any;
}

function LearningJourneyComponent() {
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [activeEventId, setActiveEventId] = useState<string>("ev-2025");

  // Multi-Year Data Aggregation from Skills Section and LearningDashboard
  const timelineEvents: TimelineEvent[] = [
    {
      id: "ev-2023",
      year: 2023,
      quarter: "Q3 - Q4",
      title: "Academic Genesis & Core Foundations",
      subtitle: "KIIT B.Tech CSE (AI & ML) Admission",
      category: "academic",
      categoryLabel: "Academic Foundations",
      skills: ["Java", "C++", "Mathematics for CS", "Data Structures Fundamentals"],
      skillsProgress: [
        { name: "Object-Oriented Programming (Java/C++)", value: 75, color: "from-amber-500 to-orange-400" },
        { name: "Discrete Mathematics & Linear Algebra", value: 80, color: "from-blue-500 to-indigo-500" },
        { name: "Basic Algorithms & Pointers", value: 65, color: "from-emerald-500 to-teal-400" }
      ],
      details: "Began the deep academic undergraduate journey in Computer Science Engineering at Kalinga Institute of Industrial Technology (KIIT), specializing in Artificial Intelligence & Machine Learning. Focused strictly on procedural core logic, compiler design bases, and hardware mechanics.",
      projects: ["Initial Console-based DBMS", "Custom Matrix Operations Engine"],
      stats: "GPA: 8.8+ | 150+ LeetCode Solved",
      badge: {
        title: "Academic Initiate",
        desc: "Established the fundamental computer science and algorithmic reasoning blocks."
      },
      icon: GraduationCap
    },
    {
      id: "ev-2024",
      year: 2024,
      quarter: "Q1 - Q4",
      title: "Client-Side Engineering & Dynamic Web Synthesis",
      subtitle: "Transitioning to asynchronous client architectures & state management",
      category: "engineering",
      categoryLabel: "Software Engineering",
      skills: ["JavaScript", "TypeScript", "React System Mechanics", "Tailwind CSS", "Git & GitHub"],
      skillsProgress: [
        { name: "React System Mechanics (Virtual DOM & Hooks)", value: 72, color: "from-blue-400 to-cyan-400" },
        { name: "Static Typing & TS Contracts", value: 80, color: "from-indigo-500 to-blue-500" },
        { name: "Responsive UI Frameworks (Tailwind)", value: 90, color: "from-pink-500 to-rose-400" }
      ],
      details: "Mastered client-side interaction mechanics. Transitioned from pure procedural structures to modern reactive modular architectures. Designed and engineered over 10 fully responsive, fluid, state-driven interfaces using Tailwind CSS.",
      projects: ["Engineered Developer Portfolio", "Personal Habit & Nutrition Tracker"],
      stats: "300+ LeetCode Milestones | 12+ Production Views Deployed",
      badge: {
        title: "Frontend Architect",
        desc: "Created highly polished responsive components with robust client-side state engines."
      },
      icon: Code
    },
    {
      id: "ev-2025",
      year: 2025,
      quarter: "Q1 - Q4",
      title: "Backend Core, Distributed APIs & Practical AI",
      subtitle: "Connecting distributed servers with mathematical regressions",
      category: "intelligence",
      categoryLabel: "Artificial Intelligence",
      skills: ["Python", "Node.js", "Express", "REST APIs", "Machine Learning Math", "Artificial Intelligence Basics"],
      skillsProgress: [
        { name: "Machine Learning Mathematical Foundations", value: 55, color: "from-purple-500 to-pink-500" },
        { name: "Asynchronous Node.js / Express Servers", value: 84, color: "from-green-500 to-emerald-400" },
        { name: "Database Design (SQL/Drizzle)", value: 60, color: "from-amber-500 to-orange-400" }
      ],
      details: "Bridged the gap between user-facing micro-interfaces and secure background API nodes. Implemented predictive regressions, analytical data visualizations, and automated server-side pipelines.",
      projects: ["Fitness OS Pro", "Finance OS Pro (NLP Sentiments Integration)"],
      stats: "450+ LeetCode Solved | Fully Integrated Microservices Deployed",
      badge: {
        title: "Systems Synthesizer",
        desc: "Developed secure full-stack applications with modular cloud connectors and analytical models."
      },
      icon: Brain
    },
    {
      id: "ev-2026",
      year: 2026,
      quarter: "Present Active Focus",
      title: "Scale Architectures, Cloud & Real-time Vision",
      subtitle: "Deploying high-signal edge computer vision and scalable microservices",
      category: "systems",
      categoryLabel: "Cloud & Systems",
      skills: ["Cloud & GCP", "System Design Concepts", "Next.js SSR Frameworks", "Deep Learning Architectures", "YOLOv8 & Computer Vision"],
      skillsProgress: [
        { name: "System Design (Scalability, Sharding, Event Bus)", value: 45, color: "from-violet-500 to-purple-500" },
        { name: "Deep Learning (YOLOv8 Core & Real-time Video)", value: 40, color: "from-red-500 to-pink-500" },
        { name: "Cloud Infrastructure (GCP Serverless & Engines)", value: 35, color: "from-cyan-500 to-blue-500" }
      ],
      details: "Currently focusing on enterprise-grade performance, high-throughput backend infrastructure, edge telemetry networks, and integrating real-time computer vision detection layers (YOLOv8) with Google Cloud Platform services.",
      projects: ["Obsidian Optics Analytics Layer (YOLOv8)", "Real-time Edge Vision Telemetry Dashboard"],
      stats: "500+ LeetCode Target Achieved | Advanced Cloud Services Architected",
      badge: {
        title: "Enterprise Systems Expert",
        desc: "Orchestrated highly available backend systems with low-latency edge AI prediction pipelines."
      },
      icon: Cpu
    }
  ];

  const filteredEvents = useMemo(() => {
    return timelineEvents.filter((ev) => {
      const yearMatch = selectedYear === "all" || ev.year === selectedYear;
      const categoryMatch = selectedCategory === "all" || ev.category === selectedCategory;
      return yearMatch && categoryMatch;
    });
  }, [selectedYear, selectedCategory]);

  const activeEvent = useMemo(() => {
    return timelineEvents.find((ev) => ev.id === activeEventId) || timelineEvents[2];
  }, [activeEventId]);

  return (
    <div className="space-y-12 font-sans relative">
      <div className="absolute -top-12 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <span className="text-xs text-cyan-400 font-mono uppercase tracking-[0.2em] font-bold block">
            Academic & Tech Mastery Track
          </span>
          <h2
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
            className="font-bold tracking-tight text-white font-display mt-1"
          >
            Interactive Learning Journey
          </h2>
          <p className="text-xs text-zinc-400 mt-2 max-w-xl leading-relaxed">
            A dynamic, multi-year progression detailing my academic foundations, web engineering synthesis, backend microservices, and AI edge computer vision mastery.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 shrink-0">
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">Filter Journey Track:</span>
          <div className="flex flex-wrap gap-2">
            <div className="flex glass-card p-1 rounded-xl">
              {["all", 2023, 2024, 2025, 2026].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr as any)}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-lg transition-all cursor-pointer ${
                    selectedYear === yr
                      ? "bg-zinc-900 text-white font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {yr === "all" ? "All Years" : yr}
                </button>
              ))}
            </div>

            <div className="flex glass-card p-1 rounded-xl">
              {[
                { id: "all", label: "All Sectors" },
                { id: "academic", label: "Academic" },
                { id: "engineering", label: "Engineering" },
                { id: "intelligence", label: "Intelligence" },
                { id: "systems", label: "Systems" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-zinc-900 text-cyan-400 font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE INTERACTIVE CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Columns: Interactive Unified Timeline Track */}
        <div className="lg:col-span-7 space-y-6 relative pl-4 sm:pl-8 border-l border-zinc-900">
          <div className="absolute top-0 bottom-0 left-4 sm:left-8 w-[1px] bg-gradient-to-b from-purple-500 via-cyan-500 to-zinc-900 pointer-events-none" />

          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs font-mono bg-zinc-950/60 rounded-2xl border border-zinc-900">
              No milestones matched the current filter credentials. Reset filters above.
            </div>
          ) : (
            filteredEvents.map((ev, index) => {
              const Icon = ev.icon;
              const isActive = ev.id === activeEventId;
              
              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  onClick={() => setActiveEventId(ev.id)}
                  className={`relative p-5 sm:p-6 rounded-2xl transition-all duration-300 cursor-pointer text-left group ${
                    isActive
                      ? "glass-card border-cyan-500/40 shadow-[0_4px_24px_rgba(34,211,238,0.06)]"
                      : "glass-card hover:border-zinc-800"
                  }`}
                >
                  {/* Timeline Indicator Node */}
                  <div className={`absolute left-[-21px] sm:left-[-41px] top-7 w-[13px] h-[13px] rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    isActive 
                      ? "bg-cyan-400 border-cyan-400 scale-125 shadow-[0_0_12px_rgba(34,211,238,0.5)]" 
                      : "bg-zinc-950 border-zinc-700 group-hover:border-zinc-500"
                  }`} />

                  {/* Top line metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-cyan-400 font-mono font-bold tracking-widest uppercase bg-cyan-950/30 border border-cyan-500/20 px-2 py-0.5 rounded">
                        {ev.year}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono font-semibold">
                        {ev.quarter}
                      </span>
                    </div>

                    <span className="text-[10px] text-zinc-500 uppercase font-mono font-semibold tracking-wider">
                      {ev.categoryLabel}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                      isActive 
                        ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-400" 
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-zinc-300"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <h3 className={`text-sm font-bold tracking-tight transition-colors ${
                        isActive ? "text-white" : "text-zinc-300 group-hover:text-white"
                      }`}>
                        {ev.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono truncate">
                        {ev.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Render inline high-level tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-zinc-900/80">
                    {ev.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-zinc-900/60 text-zinc-400 border border-zinc-800/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Right 5 Columns: Dynamic Era Inspector Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 glass-card rounded-3xl p-6 space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Panel Header */}
            <div className="border-b border-zinc-900 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider font-bold">
                    Era Analysis Engine
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-mono font-bold">
                  {activeEvent.year}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-display tracking-tight leading-tight">
                {activeEvent.title}
              </h3>
            </div>

            {/* Narrative detail paragraph */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block font-bold">
                Analytical Record
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed text-justify">
                {activeEvent.details}
              </p>
            </div>

            {/* Milestone Core Progress bars */}
            <div className="space-y-3">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block font-bold">
                Capability Acquisition Index
              </span>
              <div className="space-y-3 glass-card p-4 rounded-2xl">
                {activeEvent.skillsProgress.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-zinc-400 truncate max-w-[190px]">{item.name}</span>
                      <span className="text-cyan-400 font-bold">{item.value}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`bg-gradient-to-r ${item.color} h-full rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Products/Projects during this era */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block font-bold">
                Associated Products Engineered
              </span>
              <div className="flex flex-col gap-2">
                {activeEvent.projects.map((proj, pIdx) => (
                  <div
                    key={pIdx}
                    className="flex items-center gap-2.5 p-2.5 bg-zinc-950 border border-zinc-900/60 rounded-xl text-xs text-zinc-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{proj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics & Performance Hud */}
            <div className="p-4 bg-zinc-950 border border-cyan-500/10 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block font-bold">
                  Era Metrics
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  {activeEvent.stats}
                </span>
              </div>
              <Trophy className="w-5 h-5 text-yellow-500 shrink-0" />
            </div>

            {/* Custom Milestone Badge earned */}
            <div className="p-4 bg-gradient-to-r from-purple-950/20 via-zinc-950 to-zinc-950 border border-purple-500/20 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
                <span className="text-[10px] text-purple-400 font-mono font-bold uppercase tracking-wider">
                  Badge: {activeEvent.badge.title}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                {activeEvent.badge.desc}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

const LearningJourney = memo(LearningJourneyComponent);
export default LearningJourney;
