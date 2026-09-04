import { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, Award, MapPin, Calendar, Heart, Shield, Compass, 
  Sparkles, CheckCircle2, AlertTriangle, BookOpen, Camera, Play, 
  Smile, Flame, Quote, Volume2, User, HelpCircle, Layers, Target, Eye, Cpu,
  Trophy, Medal, Video, Briefcase, Youtube, Code, Building2, TrendingUp, Star, Rocket
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
  const [activeTab, setActiveTab] = useState<"about" | "timeline" | "education">("about");
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  // Values data
  const values = [
    { name: "Continuous Learning", desc: "A commitment to expand knowledge constantly.", icon: BookOpen, color: "from-purple-500 to-indigo-500" },
    { name: "Integrity", desc: "Honesty and alignment between actions and ethics.", icon: Shield, color: "from-emerald-500 to-teal-500" },
    { name: "Curiosity", desc: "Digging deep into the 'why' of complex systems.", icon: Compass, color: "from-cyan-500 to-blue-500" },
    { name: "Consistency", desc: "Doing the small daily work that compounds.", icon: Flame, color: "from-amber-500 to-orange-500" },
    { name: "Discipline", desc: "Commanding focus over instant distractions.", icon: Target, color: "from-rose-500 to-pink-500" },
    { name: "Innovation", desc: "Pioneering creative workflows and structures.", icon: Sparkles, color: "from-violet-500 to-purple-500" },
    { name: "Collaboration", desc: "Empowering cohorts and growing collectively.", icon: Smile, color: "from-teal-500 to-emerald-500" },
    { name: "Growth Mindset", desc: "Embracing obstacles as blueprints for progress.", icon: CheckCircle2, color: "from-blue-500 to-cyan-500" }
  ];

  // Strengths
  const strengths = [
    { title: "Quick Learner", desc: "Deconstructs technical documentation and API specifications in hours, executing clean production-ready implementations.", icon: Sparkles },
    { title: "Consistent & Disciplined", desc: "Maintains high metrics of performance—be it coding streaks, academic lectures, or physical development.", icon: Flame },
    { title: "Problem Solver", desc: "Approaches roadblocks with high structured debug pipelines, tracing logic flows from database records to visual states.", icon: CheckCircle2 },
    { title: "Creative Thinker", desc: "Bridges the gap between technical backends and viewer psychology to craft highly clickable layouts and designs.", icon: Compass },
    { title: "Growth-Oriented", desc: "Actively solicits critical code reviews, iterating rapidly to transform initial feedback into exceptional results.", icon: Target }
  ];

  // Areas of Continuous Improvement
  const improvements = [
    { title: "Perfectionism", area: "Codebase Elegance", desc: "Sometimes spends excessive time polishing layouts or refactoring helper code. Mitigated by setting hard time blocks and focusing on delivering MVP outcomes first." },
    { title: "Taking on Too Much", area: "Resource Scheduling", desc: "Eager to learn everything (React, PyTorch, Market trading) simultaneously. Overcome by implementing a disciplined 3-bucket priority calendar." },
    { title: "Limited Industry Experience", area: "Enterprise Practice", desc: "While highly capable with side-projects and freelance clients, lacks direct large-scale corporate exposure. Mitigated by studying robust system designs and seeking internships." }
  ];

  // Hobbies list
  const hobbies = [
    { name: "Building Software", icon: "💻", color: "hover:bg-purple-950/40 hover:border-purple-500/40" },
    { name: "Artificial Intelligence", icon: "🤖", color: "hover:bg-cyan-950/40 hover:border-cyan-500/40" },
    { name: "Photography", icon: "📷", color: "hover:bg-emerald-950/40 hover:border-emerald-500/40" },
    { name: "Table Tennis", icon: "🏓", color: "hover:bg-rose-950/40 hover:border-rose-500/40" },
    { name: "Content Creation", icon: "🎥", color: "hover:bg-amber-950/40 hover:border-amber-500/40" },
    { name: "Finance & Stock Market", icon: "📈", color: "hover:bg-blue-950/40 hover:border-blue-500/40" },
    { name: "Personal Development", icon: "📚", color: "hover:bg-pink-950/40 hover:border-pink-500/40" },
    { name: "Creative Design", icon: "🎨", color: "hover:bg-indigo-950/40 hover:border-indigo-500/40" },
    { name: "Books", icon: "📖", color: "hover:bg-teal-950/40 hover:border-teal-500/40" },
    { name: "Podcasts", icon: "🎙️", color: "hover:bg-orange-950/40 hover:border-orange-500/40" }
  ];

  // Personality badges
  const personalityBadges = [
    "Curious", "Ambitious", "Self-driven", "Patient", "Creative", "Disciplined", "Growth-focused"
  ];

  // Engineering Journey Timeline Data (Strictly Chronological & Exact)
  const engineeringJourney: JourneyMilestone[] = [
    {
      period: "2011",
      title: "Started Schooling",
      description: "Began my formal schooling journey.",
      category: "Education",
      icon: BookOpen,
      status: "past"
    },
    {
      period: "2013",
      title: "Started Playing Table Tennis",
      description: "Started playing table tennis and developed a long-term passion for the sport.",
      category: "Sports",
      icon: Trophy,
      status: "past"
    },
    {
      period: "2019",
      title: "Represented District in Table Tennis",
      description: "Represented my district in table tennis at the district level.",
      category: "Sports",
      icon: Medal,
      status: "past"
    },
    {
      period: "2021",
      title: "Reached Finals in Toycathon — Top 15",
      description: "Reached the finals and secured a Top 15 position in Toycathon, a national-level innovation event.",
      category: "Competition",
      icon: Award,
      status: "past"
    },
    {
      period: "2021–2023",
      title: "Content Creator — Technical AZ",
      description: "Worked as a content creator on my own YouTube channel, Technical AZ, which grew to 2.06K+ subscribers.",
      category: "Content Creation",
      icon: Video,
      status: "past"
    },
    {
      period: "2021–2023",
      title: "Ran My Own Social Media Agency & Marketing Panel",
      description: "Ran my own social media agency and marketing panel, working on social media growth, digital marketing, and client-focused services.",
      category: "Entrepreneurship",
      icon: Briefcase,
      status: "past"
    },
    {
      period: "2023",
      title: "Scored 92.6% in Class 10 Boards",
      description: "Achieved 92.6% in the CBSE Class 10 Board Examinations.",
      category: "Academics",
      icon: GraduationCap,
      status: "past"
    },
    {
      period: "2023–2026",
      title: "Content Creator — Daily Decipher",
      description: "Worked as a content creator on my own YouTube channel, Daily Decipher, which grew to 10K+ subscribers.",
      category: "Content Creation",
      icon: Youtube,
      status: "past"
    },
    {
      period: "2025",
      title: "Scored 86.2% in Class 12 Boards",
      description: "Achieved 86.2% in the CBSE Class 12 Board Examinations.",
      category: "Academics",
      icon: GraduationCap,
      status: "past"
    },
    {
      period: "2025",
      title: "Started Building Small Projects",
      description: "Began building small software and web projects to strengthen my development and problem-solving skills.",
      category: "Development",
      icon: Code,
      status: "past"
    },
    {
      period: "2025 - Present",
      title: "Pursuing B.Tech CSE at KIIT, Bhubaneswar",
      description: "Enrolled in B.Tech Computer Science Engineering at Kalinga Institute of Industrial Technology, Bhubaneswar.",
      category: "University",
      icon: Building2,
      status: "present"
    },
    {
      period: "2026",
      title: "Technex'26 — IIT BHU Finalist",
      description: "Participated in IIT BHU Techfest (Technex'26) and stood as a finalist in 5 out of 6 competitions.",
      category: "Competition",
      icon: Star,
      status: "past"
    },
    {
      period: "2026",
      title: "Built Multiple Technical Projects",
      description: "Built an Interactive Portfolio, a YOLOv8-based Edge CV Motion Tracker, OPERON for a competition, and an enhanced MAUSAM webpage based on IMD government data for SIH 2026.",
      category: "Projects",
      icon: Rocket,
      status: "past"
    },
    {
      period: "Present",
      title: "Disciplined Skill Synthesis",
      description: "Continuously deepening my knowledge in AI models, React, Advanced DSA including Dynamic Programming and Graphs, and System Architecture.",
      category: "Current Focus",
      icon: Cpu,
      status: "present"
    },
    {
      period: "Future",
      title: "The Roadmap Ahead",
      description: "Excelling as a Software Engineer and AI Engineer, building high-impact startups, and contributing to open-source projects.",
      category: "The Horizon",
      icon: Target,
      status: "future"
    }
  ];

  return (
    <div className="relative font-sans space-y-16 py-12">
      {/* Dynamic Animated background nodes */}
      <div className="absolute inset-0 bg-radial-gradient-to-tr from-purple-500/5 via-transparent to-cyan-500/5 blur-[120px] pointer-events-none -z-10" />

      {/* SECTION HEADER: Luxury/Asymmetric typography */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-zinc-900 pb-12">
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950/80 border border-zinc-900 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
            <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">THE IDENTITY GENESIS</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1]"
          >
            Architect of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              Intelligent Software
            </span>
          </h2>
        </div>
        <div className="lg:col-span-6 lg:pt-8 text-zinc-400 text-sm leading-relaxed space-y-4">
          <p>
            Operating at the intersection of quantitative computation and creative aesthetic engineering. As a 2nd Year (3rd Semester) undergraduate student at <strong className="text-white">Kalinga Institute of Industrial Technology, Bhubaneswar</strong> (originally from Hooghly, West Bengal), I devote my hours to decoding neural net layers, designing modular full-stack interfaces, and compiling high-efficiency software architectures.
          </p>
          
          {/* Custom Aesthetic Tab Switching */}
          <div className="flex flex-wrap gap-2 pt-4">
            {[
              { id: "about", label: "Core Profile", icon: User },
              { id: "timeline", label: "Historical Timeline", icon: Calendar },
              { id: "education", label: "Academic Blueprint", icon: GraduationCap }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 text-white border-purple-500/30 shadow-[0_4px_20px_rgba(139,92,246,0.15)]"
                      : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-purple-400" : "text-zinc-500"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER PANELS */}
      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          
          {/* ABOUT TAB */}
          {activeTab === "about" && (
            <motion.div
              key="about-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left 4 Cols: Values & Personality */}
              <div className="lg:col-span-4 space-y-6">
                {/* Brand Identity / Profile Photo Card */}
                <div className="glass-card p-5 rounded-3xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-cyan-500/5 pointer-events-none" />
                  
                  {/* Photo Frame */}
                  <div className="aspect-square w-full rounded-2xl overflow-hidden border border-zinc-900 relative shadow-2xl bg-zinc-900 flex items-center justify-center">
                    <img 
                      src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg" 
                      alt="Sayam Mukherjee" 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:rotate-1 filter brightness-95 group-hover:brightness-100"
                    />
                    {/* Glowing Accent Border lines */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-zinc-950/80 backdrop-blur border border-zinc-850 rounded font-mono text-[8px] tracking-wider text-purple-400 uppercase select-none z-10">
                      SAYAM MUKHERJEE
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-zinc-950/80 backdrop-blur border border-zinc-850 rounded font-mono text-[8px] tracking-wider text-cyan-400 uppercase select-none z-10">
                      SYS: ONLINE
                    </div>
                  </div>
                </div>

                {/* Personality Badge Box */}
                <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest block">Character Parameters</span>
                  <h3 className="text-lg font-bold text-white font-display mt-1">Personality Matrix</h3>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {personalityBadges.map((badge, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/30 hover:text-purple-300 text-[10px] text-zinc-300 font-mono rounded-full transition-all duration-300"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-zinc-950/50 border border-zinc-900 rounded-2xl relative">
                    <Quote className="absolute -top-3 left-4 w-6 h-6 text-purple-500/20" />
                    <p className="text-xs text-zinc-400 italic leading-relaxed pt-2">
                      "I do not seek paths that are pre-coded. I construct systems that solve challenges with beautiful, modular architecture."
                    </p>
                  </div>
                </div>

                {/* Hobbies list */}
                <div className="glass-card p-6 rounded-3xl">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest block">Extracurricular Nodes</span>
                  <h3 className="text-lg font-bold text-white font-display mt-1">Sectors of Interest</h3>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {hobbies.map((h, i) => (
                      <div 
                        key={i}
                        className={`p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center gap-2.5 text-xs text-zinc-300 transition-all duration-300 border-l-2 hover:border-l-purple-500 cursor-default ${h.color}`}
                      >
                        <span className="text-sm shrink-0">{h.icon}</span>
                        <span className="font-medium truncate">{h.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle 5 Cols: Core Strengths */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-card p-6 rounded-3xl">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest block">Strategic Valuation</span>
                  <h3 className="text-lg font-bold text-white font-display mt-1">Core Strengths</h3>

                  <div className="space-y-4 mt-6">
                    {strengths.map((str, idx) => {
                      const Icon = str.icon;
                      return (
                        <div 
                          key={idx} 
                          className="flex gap-4 p-3.5 hover:bg-zinc-900/30 border border-transparent hover:border-zinc-900 rounded-2xl transition-all duration-300 group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-purple-500/30 group-hover:bg-purple-950/10 transition-colors">
                            <Icon className="w-4 h-4 text-purple-400" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">{str.title}</h4>
                            <p className="text-xs text-zinc-400 leading-normal">{str.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right 3 Cols: Core Values (Interactive hover) */}
              <div className="lg:col-span-3 space-y-6">
                <div className="glass-card p-6 rounded-3xl relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[9px] text-purple-400 font-mono tracking-widest block font-bold">ETHICAL ANCHORS</span>
                    <h3 className="text-xl font-bold text-white font-display">Philosophy & Values</h3>
                    <p className="text-xs text-zinc-400 leading-normal">
                      Systemic ideals guiding my code, academic studies, and collaborative work.
                    </p>

                    <div className="grid grid-cols-1 gap-2 pt-2">
                      {values.slice(0, 5).map((val) => {
                        const Icon = val.icon;
                        const isHovered = hoveredValue === val.name;
                        return (
                          <div
                            key={val.name}
                            onMouseEnter={() => setHoveredValue(val.name)}
                            onMouseLeave={() => setHoveredValue(null)}
                            className={`p-3 border rounded-xl flex items-center justify-between transition-all duration-300 cursor-default ${
                              isHovered 
                                ? "bg-zinc-900/80 border-purple-500/30 shadow-md" 
                                : "bg-zinc-950/50 border-zinc-900"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`w-3.5 h-3.5 ${isHovered ? "text-purple-400" : "text-zinc-500"}`} />
                              <span className="text-xs font-semibold text-zinc-200">{val.name}</span>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-600">0{values.indexOf(val) + 1}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Value Card */}
                  <div className="mt-6 p-4 bg-zinc-950 border border-zinc-900 rounded-2xl min-h-[90px] flex items-center justify-center relative">
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                    <AnimatePresence mode="wait">
                      {hoveredValue ? (
                        <motion.div
                          key={hoveredValue}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="text-center"
                        >
                          <span className="text-[10px] text-purple-400 font-mono block uppercase">Active Axiom</span>
                          <p className="text-xs text-zinc-300 mt-1 font-sans">
                            {values.find(v => v.name === hoveredValue)?.desc}
                          </p>
                        </motion.div>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-mono tracking-wider text-center">
                          Hover an Axiom to retrieve semantic telemetry
                        </span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TIMELINE TAB */}
          {activeTab === "timeline" && (
            <motion.div
              key="timeline-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="text-center space-y-2">
                <span className="text-xs text-purple-400 font-mono uppercase tracking-widest block font-bold">The Chronicles</span>
                <h3 className="text-3xl font-bold text-white font-display">Engineering Journey</h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
                  A chronological chronicle documenting my academic progression, competitive milestones, content ventures, and software engineering projects.
                </p>
              </div>

              {/* Storytelling Timeline structure */}
              <div className="relative border-l border-zinc-900 ml-4 md:ml-36 pl-6 md:pl-10 space-y-8 py-4">
                {engineeringJourney.map((ev, idx) => {
                  const Icon = ev.icon;
                  const isPresent = ev.status === "present";
                  const isFuture = ev.status === "future";

                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.3) }}
                      className="relative group"
                    >
                      {/* Floating year column on desktop screens */}
                      <div className="hidden md:flex flex-col items-end absolute -left-[180px] top-3 w-32 pr-4 text-right select-none">
                        <span className={`font-mono font-bold text-xs tracking-tight transition-colors ${
                          isPresent
                            ? "text-emerald-400"
                            : isFuture
                            ? "text-cyan-400"
                            : "text-zinc-400 group-hover:text-purple-400"
                        }`}>
                          {ev.period}
                        </span>
                        {isPresent && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 uppercase tracking-wider mt-0.5 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Active
                          </span>
                        )}
                        {isFuture && (
                          <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider mt-0.5 font-semibold">
                            Horizon
                          </span>
                        )}
                      </div>

                      {/* Timeline dot node badge */}
                      <span className={`absolute -left-[31px] md:-left-[47px] top-3.5 w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isPresent
                          ? "bg-emerald-950 border-2 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                          : isFuture
                          ? "bg-cyan-950 border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                          : "bg-zinc-950 border-2 border-zinc-800 group-hover:border-purple-500 group-hover:shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          isPresent
                            ? "bg-emerald-400 animate-pulse"
                            : isFuture
                            ? "bg-cyan-400"
                            : "bg-zinc-700 group-hover:bg-purple-400"
                        }`} />
                      </span>

                      {/* Card container */}
                      <div className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                        isPresent
                          ? "bg-gradient-to-br from-purple-950/25 via-zinc-950/80 to-zinc-950 border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.12),inset_0_1px_1px_rgba(255,255,255,0.06)] hover:border-purple-500/70"
                          : isFuture
                          ? "bg-gradient-to-br from-cyan-950/25 via-zinc-950/80 to-zinc-950 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.12),inset_0_1px_1px_rgba(255,255,255,0.06)] hover:border-cyan-500/70"
                          : "glass-card hover:border-zinc-800 hover:bg-zinc-900/40"
                      }`}>
                        {/* Mobile Year & Category Header */}
                        <div className="flex md:hidden items-center justify-between gap-2 border-b border-zinc-900 pb-2 mb-3">
                          <span className={`text-xs font-mono font-bold tracking-tight ${
                            isPresent
                              ? "text-emerald-400"
                              : isFuture
                              ? "text-cyan-400"
                              : "text-purple-400"
                          }`}>
                            {ev.period}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            isPresent
                              ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                              : isFuture
                              ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                              : "bg-zinc-900 text-zinc-400 border-zinc-800"
                          }`}>
                            {ev.category}
                          </span>
                        </div>

                        {/* Card Content */}
                        <div className="flex items-start gap-3 sm:gap-3.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                            isPresent
                              ? "bg-purple-950/50 border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                              : isFuture
                              ? "bg-cyan-950/50 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                              : "bg-zinc-900/90 border-zinc-800 text-zinc-400 group-hover:text-purple-400 group-hover:border-purple-500/40"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <h4 className={`text-sm sm:text-[15px] font-bold font-display tracking-tight leading-snug transition-colors ${
                                isPresent
                                  ? "text-purple-200"
                                  : isFuture
                                  ? "text-cyan-200"
                                  : "text-zinc-100 group-hover:text-white"
                              }`}>
                                {ev.title}
                              </h4>

                              {/* Desktop Category Pill */}
                              <span className={`hidden md:inline-flex items-center text-[10px] font-mono px-2.5 py-0.5 rounded-full border shrink-0 ${
                                isPresent
                                  ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                                  : isFuture
                                  ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                                  : "bg-zinc-900 text-zinc-400 border-zinc-800"
                              }`}>
                                {ev.category}
                              </span>
                            </div>

                            <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed mt-1.5 font-sans">
                              {ev.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* EDUCATION TAB */}
          {activeTab === "education" && (
            <motion.div
              key="education-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12 max-w-4xl mx-auto"
            >
              <div className="text-center space-y-2">
                <span className="text-xs text-cyan-400 font-mono uppercase tracking-widest block font-bold">Intellectual Blueprint</span>
                <h3 className="text-3xl font-bold text-white font-display">Academics & Curriculums</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  A structured matrix highlighting academic milestones, scientific focus scopes, and certified qualifications.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Institute 1 */}
                <div className="glass-card p-6 rounded-3xl relative overflow-hidden hover:border-cyan-500/20 transition-all duration-300 group">
                  <div className="absolute top-4 right-4 text-cyan-400/5">
                    <GraduationCap className="w-20 h-20" />
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-cyan-400 font-mono">
                    <span>2025 - Present</span>
                    <span>•</span>
                    <span>KALINGA INSTITUTE OF INDUSTRIAL TECHNOLOGY, BHUBANESWAR</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-display mt-2">B.Tech in Computer Science Engineering</h3>
                  <p className="text-xs text-purple-400 font-mono mt-0.5">Focus: Core CS, Foundational Algorithms & AI Systems</p>
                  
                  <div className="mt-4 space-y-2 text-xs text-zinc-400 leading-relaxed">
                    <p>Currently in 2nd year (3rd semester) B.Tech CSE at Kalinga Institute of Industrial Technology, Bhubaneswar. Advancing in Data Structures & Algorithms, Systems Architecture, and practical AI implementations.</p>
                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-900 font-mono mt-4">
                      <span className="text-[10px] text-zinc-500 uppercase">ACADEMIC STATUS:</span>
                      <span className="text-xs font-bold text-white bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/30">2nd Year, 3rd Semester (Undergraduate)</span>
                    </div>
                  </div>
                </div>

                {/* Institute 2 */}
                <div className="glass-card p-6 rounded-3xl relative overflow-hidden hover:border-purple-500/20 transition-all duration-300 group">
                  <div className="absolute top-4 right-4 text-purple-500/5">
                    <BookOpen className="w-20 h-20" />
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-purple-400 font-mono">
                    <span>CBSE Board Examinations</span>
                    <span>•</span>
                    <span>ADITYA BIRLA VANI BHARATI</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-display mt-2">Secondary & Senior Secondary</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Rigorous coursework in Mathematics, Physics, Chemistry & Computer Science.</p>

                  <div className="mt-4 space-y-2 text-xs text-zinc-400 leading-relaxed">
                    <p>Scored 92.6% in CBSE Class 10 Board Examinations (2023) and 86.2% in CBSE Class 12 Board Examinations (2025).</p>
                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-900 font-mono mt-4">
                      <span className="text-[10px] text-zinc-500 uppercase">BOARD RESULTS:</span>
                      <span className="text-xs font-bold text-white bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/30">Class 10: 92.6% | Class 12: 86.2%</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Scientific fields */}
              <div className="p-6 glass-card rounded-3xl space-y-4">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Natural Science Core</span>
                <h3 className="text-lg font-bold text-white font-display">Favorite Fields of Scientific Inquiry</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  {[
                    { name: "Biology", desc: "Deciphering complex multicellular patterns, organic neural pathways, and evolutionary structures." },
                    { name: "Chemistry", desc: "Calculating thermodynamic rates, kinetic structures, electron vectors, and balance matrices." },
                    { name: "Information Technology", desc: "Assembling robust compiler sequences, linear data structures, search pathways, and data tables." }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-1.5 hover:border-purple-500/10 transition-colors">
                      <span className="font-bold text-purple-400">{item.name}</span>
                      <p className="text-[11px] text-zinc-400 font-sans leading-normal">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certified listings */}
              <div className="p-6 glass-card rounded-3xl space-y-4">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Verified Honors</span>
                <h3 className="text-lg font-bold text-white font-display">Competitions & Key Achievements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {[
                    "Technex'26 IIT BHU Finalist (5/6)",
                    "Toycathon Finals — Top 15 (National)",
                    "Smart India Hackathon (SIH 2026)",
                    "District Table Tennis Representative"
                  ].map((cert, idx) => (
                    <div key={idx} className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-zinc-300 font-sans font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

const AboutSection = memo(AboutSectionComponent);
export default AboutSection;
