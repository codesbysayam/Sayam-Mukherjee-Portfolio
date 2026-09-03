import { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, Award, MapPin, Calendar, Heart, Shield, Compass, 
  Sparkles, CheckCircle2, AlertTriangle, BookOpen, Camera, Play, 
  Smile, Flame, Quote, Volume2, User, HelpCircle, Layers, Target, Eye, Cpu
} from "lucide-react";

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

  // Timeline events
  const timelineEvents = [
    { year: "2011", title: "Started School Journey", desc: "Aditya Birla Vani Bharati. Began foundations of rigorous logical thinking, science projects, and sports.", icon: BookOpen, type: "school" },
    { year: "2021", title: "Reached Top 15 in Toycathon", desc: "National gaming/innovation competition. Designed intelligent board game concepts bridging education and culture.", icon: Award, type: "achievement" },
    { year: "2023", title: "Completed Class X Board", desc: "Scored high distinction, focusing deeply on Information Technology, Computer Science basics, and science labs.", icon: CheckCircle2, type: "school" },
    { year: "2025", title: "Completed Class XII Board", desc: "Advanced studies in Physics, Chemistry, Mathematics, and Computer Science.", icon: CheckCircle2, type: "school" },
    { year: "2025", title: "Joined KIIT University", desc: "B.Tech in Computer Science Engineering, specializing in Artificial Intelligence and Machine Learning. Discovered deep learning.", icon: GraduationCap, type: "university" },
    { year: "2025", title: "Started Freelance Design Agency", desc: "Partnered with 25+ global digital review and tutorial creators. Specialized in high-CTR click patterns and media layout graphics.", icon: Heart, type: "freelance" },
    { year: "2025", title: "Pioneered Obsidian Optics", desc: "Began compiling the Edge CV monitoring system and PyTorch deep neural network trackers.", icon: Flame, type: "project" },
    { year: "2025", title: "Started Building Production Projects", desc: "Built Daily Decipher (summarization node), BullRun Analytics (news sentiment engine), and visual canvas editors.", icon: Compass, type: "project" },
    { year: "2026", title: "Technex IIT BHU", desc: "Participated and ranked in national level algorithm and deep learning developer tracks.", icon: Award, type: "achievement" },
    { year: "2026", title: "National Level Hackathons", desc: "Collaborated in high-intensity 36-hour hackathons, deploying live full-stack telemetry dashboards.", icon: Sparkles, type: "achievement" },
    { year: "Present", title: "Disciplined Skill Synthesis", desc: "Deepening knowledge in AI models, React, Advanced DSA (Dynamic Programming, Graphs), and System Architecture designs.", icon: Flame, type: "present" },
    { year: "Future", title: "The Roadmap Ahead", desc: "Excelling as a Software Engineer & AI Engineer, building high-impact startups, and contributing to open-source models.", icon: Target, type: "future" }
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
            Operating at the intersection of quantitative computation and creative aesthetic engineering. As an undergraduate student at <strong className="text-white">KIIT University</strong>, I devote my hours to decoding neural net layers, designing modular full-stack interfaces, and compiling high-efficiency software architectures.
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
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  A timeline documenting my academic progression, competitive milestones, and freelance design agency highlights.
                </p>
              </div>

              {/* Storytelling Timeline structure */}
              <div className="relative border-l border-zinc-900 ml-4 md:ml-32 pl-6 md:pl-12 space-y-10 py-4">
                {timelineEvents.map((ev, idx) => {
                  const Icon = ev.icon;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.04 }}
                      className="relative group"
                    >
                      {/* Floating year column on large devices */}
                      <span className="hidden md:block absolute -left-44 top-1.5 text-right w-24 font-mono font-bold text-zinc-500 group-hover:text-purple-400 transition-colors">
                        {ev.year}
                      </span>

                      {/* Timeline dot badge */}
                      <span className="absolute -left-[31px] md:-left-[55px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-zinc-800 flex items-center justify-center group-hover:border-purple-500 transition-all duration-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-purple-500 transition-colors" />
                      </span>

                      <div className="glass-card p-5 rounded-2xl hover:border-zinc-800 transition-all duration-300">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-900 pb-2.5 mb-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-850">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <h4 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">{ev.title}</h4>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2.5 py-0.5 border border-zinc-850 rounded-full capitalize">
                            {ev.type}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{ev.desc}</p>
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
                    <span>2024 - 2029 (Expected)</span>
                    <span>•</span>
                    <span>KIIT UNIVERSITY</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-display mt-2">B.Tech in Computer Science Engineering</h3>
                  <p className="text-xs text-purple-400 font-mono mt-0.5">Specialization: Artificial Intelligence & Machine Learning</p>
                  
                  <div className="mt-4 space-y-2 text-xs text-zinc-400 leading-relaxed">
                    <p>Currently deep inside semesters, building foundational expertise. Core academic curriculum centers on Data Structures, Object Oriented Systems, Discrete Mathematics, and Computer System Organization.</p>
                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-900 font-mono mt-4">
                      <span className="text-[10px] text-zinc-500 uppercase">CGPA INDEX:</span>
                      <span className="text-xs font-bold text-white bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/30">9.06 Cumulative</span>
                    </div>
                  </div>
                </div>

                {/* Institute 2 */}
                <div className="glass-card p-6 rounded-3xl relative overflow-hidden hover:border-purple-500/20 transition-all duration-300 group">
                  <div className="absolute top-4 right-4 text-purple-500/5">
                    <BookOpen className="w-20 h-20" />
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-purple-400 font-mono">
                    <span>Secondary & High School</span>
                    <span>•</span>
                    <span>ADITYA BIRLA VANI BHARATI</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-display mt-2">High School Certification</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Focus areas: Advanced Mathematics, Physics, Chemistry, Computer Sciences.</p>

                  <div className="mt-4 space-y-2 text-xs text-zinc-400 leading-relaxed">
                    <p>Mastered robust foundations of logic proofs, inorganic chemical metrics, classical Newtonian dynamics, and procedural computer sciences using basic paradigms.</p>
                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-900 font-mono mt-4">
                      <span className="text-[10px] text-zinc-500 uppercase">Performance Status:</span>
                      <span className="text-xs font-bold text-white bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/30">Science Stream Honors</span>
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
                    { name: "Biology", desc: "Deciphing complex multicellular patterns, organic neural pathways, and evolutionary sorting algorithms." },
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
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Accreditation Registry</span>
                <h3 className="text-lg font-bold text-white font-display">Credentials & Specialized Certificates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {[
                    "Stanford Machine Learning Specialization",
                    "Meta Front-End Developer Professional",
                    "Google Cloud Engineer Associate Scope",
                    "KIIT Algorithmic Competitive Index"
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
