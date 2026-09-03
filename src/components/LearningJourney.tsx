import { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Award, BookOpen, Brain, Code, Cpu, Flame,
  GraduationCap, Server, Sparkles, TrendingUp, Zap, ChevronRight,
  MapPin, Activity, CheckCircle2, Star, Clock, Trophy, Layers, Target,
  Medal, Video, Briefcase, Youtube, Building2, Rocket
} from "lucide-react";

export interface TimelineMilestone {
  id: string;
  period: string;
  yearNumber: number;
  title: string;
  description: string;
  category: "Education" | "Sports" | "Competition" | "Content Creation" | "Entrepreneurship" | "Academics" | "Development" | "University" | "Projects" | "Current Focus" | "The Horizon";
  categoryLabel: string;
  icon: any;
  keyHighlights: string[];
  metricsTag: string;
}

export const EXACT_TIMELINE_DATA: TimelineMilestone[] = [
  {
    id: "milestone-2011",
    period: "2011",
    yearNumber: 2011,
    title: "Started Schooling",
    description: "Began my formal schooling journey.",
    category: "Education",
    categoryLabel: "Formal Education",
    icon: BookOpen,
    keyHighlights: ["Beginning of fundamental academic curriculum", "Early curiosity in science and mathematics"],
    metricsTag: "Academic Genesis"
  },
  {
    id: "milestone-2013",
    period: "2013",
    yearNumber: 2013,
    title: "Started Playing Table Tennis",
    description: "Started playing table tennis and developed a long-term passion for the sport.",
    category: "Sports",
    categoryLabel: "Athletics & Sports",
    icon: Trophy,
    keyHighlights: ["Initiation into competitive racket sports", "Focus on agility, reflexes, and athletic discipline"],
    metricsTag: "Long-Term Passion"
  },
  {
    id: "milestone-2019",
    period: "2019",
    yearNumber: 2019,
    title: "Represented District in Table Tennis",
    description: "Represented my district in table tennis at the district level.",
    category: "Sports",
    categoryLabel: "Athletics & Sports",
    icon: Medal,
    keyHighlights: ["District-level tournament selection", "Intensive competitive training and match composure"],
    metricsTag: "District Representation"
  },
  {
    id: "milestone-2021-toycathon",
    period: "2021",
    yearNumber: 2021,
    title: "Reached Finals in Toycathon — Top 15",
    description: "Reached the finals and secured a Top 15 position in Toycathon, a national-level innovation event.",
    category: "Competition",
    categoryLabel: "National Innovation",
    icon: Award,
    keyHighlights: ["National-level innovation challenge finals", "Secured Top 15 national ranking among thousands of entrants"],
    metricsTag: "Top 15 National Finalist"
  },
  {
    id: "milestone-2021-technical-az",
    period: "2021–2023",
    yearNumber: 2021,
    title: "Content Creator — Technical AZ",
    description: "Worked as a content creator on my own YouTube channel, Technical AZ, which grew to 2.06K+ subscribers.",
    category: "Content Creation",
    categoryLabel: "Media & Outreach",
    icon: Video,
    keyHighlights: ["Authored and produced tech tutorial videos", "Grew channel organically to 2.06K+ dedicated subscribers"],
    metricsTag: "2.06K+ Subscribers"
  },
  {
    id: "milestone-2021-agency",
    period: "2021–2023",
    yearNumber: 2021,
    title: "Ran My Own Social Media Agency & Marketing Panel",
    description: "Ran my own social media agency and marketing panel, working on social media growth, digital marketing, and client-focused services.",
    category: "Entrepreneurship",
    categoryLabel: "Agency Operations",
    icon: Briefcase,
    keyHighlights: ["Digital growth marketing and distribution pipelines", "Managed client-focused digital assets and campaign delivery"],
    metricsTag: "Agency Founder"
  },
  {
    id: "milestone-2023-class10",
    period: "2023",
    yearNumber: 2023,
    title: "Scored 92.6% in Class 10 Boards",
    description: "Achieved 92.6% in the CBSE Class 10 Board Examinations.",
    category: "Academics",
    categoryLabel: "Board Examinations",
    icon: GraduationCap,
    keyHighlights: ["CBSE Class 10 Board Examination distinction", "High distinction in Mathematics and Science"],
    metricsTag: "92.6% CBSE"
  },
  {
    id: "milestone-2023-daily-decipher",
    period: "2023–2026",
    yearNumber: 2023,
    title: "Content Creator — Daily Decipher",
    description: "Worked as a content creator on my own YouTube channel, Daily Decipher, which grew to 10K+ subscribers.",
    category: "Content Creation",
    categoryLabel: "Media & Outreach",
    icon: Youtube,
    keyHighlights: ["Produced high-engagement technical and educational content", "Surpassed 10K+ subscribers milestone"],
    metricsTag: "10K+ Subscribers"
  },
  {
    id: "milestone-2025-class12",
    period: "2025",
    yearNumber: 2025,
    title: "Scored 86.2% in Class 12 Boards",
    description: "Achieved 86.2% in the CBSE Class 12 Board Examinations.",
    category: "Academics",
    categoryLabel: "Board Examinations",
    icon: GraduationCap,
    keyHighlights: ["CBSE Class 12 Senior Secondary distinction", "Strong foundation in Physics, Chemistry, and Mathematics"],
    metricsTag: "86.2% CBSE"
  },
  {
    id: "milestone-2025-projects",
    period: "2025",
    yearNumber: 2025,
    title: "Started Building Small Projects",
    description: "Began building small software and web projects to strengthen my development and problem-solving skills.",
    category: "Development",
    categoryLabel: "Software Engineering",
    icon: Code,
    keyHighlights: ["Hands-on web engineering and interactive prototypes", "Focus on clean state management, modular components, and logic"],
    metricsTag: "Practical Development"
  },
  {
    id: "milestone-2025-tmsl",
    period: "2025",
    yearNumber: 2025,
    title: "Joined Techno Main Salt Lake (TMSL)",
    description: "Joined Techno Main Salt Lake (TMSL) to pursue a B.Tech in Computer Science Engineering.",
    category: "University",
    categoryLabel: "Higher Education",
    icon: Building2,
    keyHighlights: ["Enrolled in B.Tech Computer Science Engineering", "Rigorous study in systems, architecture, and mathematics for CS"],
    metricsTag: "B.Tech CSE (TMSL)"
  },
  {
    id: "milestone-2026-technex",
    period: "2026",
    yearNumber: 2026,
    title: "Technex'26 — IIT BHU Finalist",
    description: "Participated in IIT BHU Techfest (Technex'26) and stood as a finalist in 5 out of 6 competitions.",
    category: "Competition",
    categoryLabel: "National Techfest",
    icon: Star,
    keyHighlights: ["IIT BHU Technex'26 national technological festival", "Finalist placement across 5 separate competition categories"],
    metricsTag: "5/6 Finals at IIT BHU"
  },
  {
    id: "milestone-2026-tech-projects",
    period: "2026",
    yearNumber: 2026,
    title: "Built Multiple Technical Projects",
    description: "Built an Interactive Portfolio, a YOLOv8-based Edge CV Motion Tracker, OPERON for a competition, and an enhanced MAUSAM webpage based on IMD government data for SIH 2026.",
    category: "Projects",
    categoryLabel: "Engineering Deliveries",
    icon: Rocket,
    keyHighlights: [
      "Obsidian Optics YOLOv8 real-time edge motion tracker",
      "MAUSAM: SIH 2026 agritech and meteorological portal",
      "OPERON: Competition systems prototype",
      "Interactive Developer Portfolio with live telemetry"
    ],
    metricsTag: "Production Architecture"
  },
  {
    id: "milestone-present",
    period: "Present",
    yearNumber: 2026,
    title: "1st Year B.Tech CSE & Disciplined Skill Building",
    description: "Continuously learning and building. Daily routine: 1 hour coding, 5–7 hours study (8–9 hours weekends), 5 gym sessions/week. Foundations in C++, DSA, Computer Vision, and full-stack web applications.",
    category: "Current Focus",
    categoryLabel: "Active Cadence",
    icon: Cpu,
    keyHighlights: [
      "1 hr/day coding + 5-7 hrs/day weekday study (8-9 hrs weekends)",
      "C++ & foundational Data Structures & Algorithms",
      "Computer Vision exploration (OpenCV & YOLOv8)",
      "Athletic discipline with 5 gym sessions/week"
    ],
    metricsTag: "Active Cadence"
  },
  {
    id: "milestone-future",
    period: "Future",
    yearNumber: 2027,
    title: "The Roadmap Ahead",
    description: "Excelling as a Software Engineer and AI Engineer, building high-impact startups, and contributing to open-source systems.",
    category: "The Horizon",
    categoryLabel: "Long-Term Vision",
    icon: Target,
    keyHighlights: [
      "Industry software engineering and AI systems depth",
      "Contributions to open-source computing stacks",
      "High-impact startup architectures and products"
    ],
    metricsTag: "Engineering Vision"
  }
];

function LearningJourneyComponent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>("milestone-2026-technex");

  const categories = [
    { id: "all", label: "All Milestones (15)" },
    { id: "Academics", label: "Academics & Schooling" },
    { id: "Competition", label: "Competitions & Hackathons" },
    { id: "Content Creation", label: "Content & Outreach" },
    { id: "Projects", label: "Projects & Engineering" },
    { id: "Sports", label: "Athletics & Sports" }
  ];

  const filteredMilestones = useMemo(() => {
    return EXACT_TIMELINE_DATA.filter((m) => {
      if (selectedCategory === "all") return true;
      if (selectedCategory === "Academics") return m.category === "Academics" || m.category === "Education" || m.category === "University";
      return m.category === selectedCategory;
    });
  }, [selectedCategory]);

  const activeMilestone = useMemo(() => {
    return EXACT_TIMELINE_DATA.find((m) => m.id === activeMilestoneId) || EXACT_TIMELINE_DATA[11];
  }, [activeMilestoneId]);

  return (
    <div className="space-y-12 font-sans relative" id="timeline">
      <div className="absolute -top-12 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950/80 border border-zinc-900 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase font-bold">
              CHRONOLOGICAL RECORD (2011 – 2026)
            </span>
          </div>
          <h2
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }}
            className="font-bold tracking-tight text-white font-display leading-tight"
          >
            Engineering & Academic Journey
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            A strictly verified, unembellished chronological timeline from early schooling, district table tennis, and national Toycathon finals to CBSE board distinctions, YouTube creation, TMSL B.Tech, IIT BHU Technex'26, and verified software builds.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-950 border border-zinc-900 rounded-2xl max-w-xl self-start md:self-auto">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-cyan-400 font-bold border border-zinc-800 shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TIMELINE CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Chronological Timeline Spine */}
        <div className="lg:col-span-7 space-y-4 relative pl-5 sm:pl-8 border-l border-zinc-900">
          <div className="absolute top-0 bottom-0 left-5 sm:left-8 w-[1px] bg-gradient-to-b from-purple-500 via-cyan-500 to-zinc-900 pointer-events-none" />

          {filteredMilestones.map((milestone, idx) => {
            const Icon = milestone.icon;
            const isActive = milestone.id === activeMilestoneId;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                onClick={() => setActiveMilestoneId(milestone.id)}
                className={`relative p-5 rounded-2xl transition-all duration-300 cursor-pointer text-left group border ${
                  isActive
                    ? "glass-card border-cyan-500/40 shadow-[0_4px_24px_rgba(34,211,238,0.08)]"
                    : "glass-card border-zinc-850 hover:border-zinc-700"
                }`}
              >
                {/* Node on the vertical line */}
                <div 
                  className={`absolute left-[-26px] sm:left-[-38px] top-6 w-[12px] h-[12px] rounded-full border-2 transition-all duration-300 ${
                    isActive 
                      ? "bg-cyan-400 border-cyan-400 scale-125 shadow-[0_0_10px_rgba(34,211,238,0.7)]" 
                      : "bg-zinc-950 border-zinc-700 group-hover:border-zinc-500"
                  }`} 
                />

                {/* Top metadata */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-cyan-400 font-mono font-bold tracking-wider bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                      {milestone.period}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {milestone.categoryLabel}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-300 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded-full">
                    {milestone.metricsTag}
                  </span>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                    isActive
                      ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-400"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-zinc-200"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className={`text-sm font-bold tracking-tight font-display transition-colors ${
                      isActive ? "text-white" : "text-zinc-200 group-hover:text-white"
                    }`}>
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right 5 Cols: Active Milestone Detail Inspector */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 glass-card rounded-3xl p-6 space-y-6 relative overflow-hidden shadow-2xl border border-zinc-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="border-b border-zinc-900 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-bold">
                    VERIFIED RECORD INSPECTOR
                  </span>
                </div>
                <span className="text-xs text-cyan-400 font-mono font-bold bg-cyan-950/50 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  {activeMilestone.period}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white font-display tracking-tight leading-tight">
                {activeMilestone.title}
              </h3>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block font-bold">
                Analytical Record
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {activeMilestone.description}
              </p>
            </div>

            {/* Key Verified Highlights */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block font-bold">
                Key Verified Highlights
              </span>
              <div className="space-y-2">
                {activeMilestone.keyHighlights.map((highlight, hIdx) => (
                  <div
                    key={hIdx}
                    className="flex items-start gap-2.5 p-3 bg-zinc-950/70 border border-zinc-900 rounded-xl text-xs text-zinc-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Badge Card */}
            <div className="p-4 bg-gradient-to-r from-purple-950/30 via-zinc-950 to-zinc-950 border border-purple-800/40 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
                  <span className="text-[10px] text-purple-300 font-mono font-bold uppercase tracking-wider">
                    Official Recognition
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {activeMilestone.metricsTag}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans pt-1">
                Verified milestone representing factual academic, competitive, or engineering output.
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
