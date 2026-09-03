import { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Award, Flame, Zap, CheckCircle2, ArrowRight, Sparkles, 
  Map, Activity, Book, Clock, AlertCircle, Compass, Target 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function LearningDashboardComponent() {
  const [activeTab, setActiveTab] = useState<"summary" | "roadmap" | "building" | "now">("summary");

  const trendData = [
    { month: "Jan", skills: 10 },
    { month: "Feb", skills: 25 },
    { month: "Mar", skills: 45 },
    { month: "Apr", skills: 55 },
    { month: "May", skills: 75 },
    { month: "Jun", skills: 90 },
    { month: "Jul", skills: 110 }
  ];

  // Learning Progress data
  const learningProgress = [
    { name: "React System Mechanics", progress: 72, color: "from-blue-500 to-cyan-400" },
    { name: "Machine Learning Math", progress: 55, color: "from-purple-500 to-indigo-500" },
    { name: "DSA (Graphs & Algorithms)", progress: 45, color: "from-emerald-500 to-teal-400" },
    { name: "Backend Architecture", progress: 60, color: "from-amber-500 to-orange-400" },
    { name: "Next.js Frameworks", progress: 40, color: "from-rose-500 to-pink-500" },
    { name: "System Design Concepts", progress: 20, color: "from-violet-500 to-purple-400" },
    { name: "Cloud & GCP Infrastructures", progress: 15, color: "from-cyan-500 to-blue-400" }
  ];

  // Currently Building
  const buildingProjects = [
    { name: "Fitness OS Pro", desc: "Intelligent athletic dashboard tracking calorie, routines, and progress markers with localized algorithms.", status: "In Development", color: "text-purple-400 border-purple-900/40 bg-purple-950/10" },
    { name: "Finance OS Pro", desc: "Quantitative analytical tool correlating stock EMA crossovers with live social ticker sentiment tags.", status: "Planning / Development", color: "text-cyan-400 border-cyan-900/40 bg-cyan-950/10" },
    { name: "Obsidian Optics Website", desc: "Core hub illustrating custom YOLOv8 object tracking layers and real-time edge computer vision telemetry.", status: "Active Development", color: "text-emerald-400 border-emerald-900/40 bg-emerald-950/10" },
    { name: "Personal Portfolio", desc: "Interactive highly polished developer portfolio with real-time Kolkata ticking clock and modular hubs.", status: "Building", color: "text-rose-400 border-rose-900/40 bg-rose-950/10" }
  ];

  // Roadmap list
  const roadmapSteps = [
    { id: 1, title: "B.Tech Graduation", subtitle: "Core foundations at KIIT", phase: "Current" },
    { id: 2, title: "DSA Dominance", subtitle: "Solving 500+ LeetCode problems", phase: "Current" },
    { id: 3, title: "Side-Projects Portfolio", subtitle: "Deploying high-signal tools", phase: "Active" },
    { id: 4, title: "Industry Internship", subtitle: "Securing corporate exposure", phase: "Upcoming" },
    { id: 5, title: "Open Source Engagement", subtitle: "Pull requests to major frameworks", phase: "Upcoming" },
    { id: 6, title: "AI Specialization", subtitle: "Deep models and fine-tunings", phase: "Upcoming" },
    { id: 7, title: "Software Engineer", subtitle: "Full-scale corporate developer", phase: "Long-Term Goal" },
    { id: 8, title: "Entrepreneurship", subtitle: "Synthesizing AI solutions startups", phase: "Visionary" }
  ];

  return (
    <div className="space-y-12 font-sans relative">
      {/* Light glow blur */}
      <div className="absolute -top-12 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <span className="text-xs text-purple-400 font-mono uppercase tracking-[0.2em] font-bold block">
            Ecosystem Radar
          </span>
          <h2 
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
            className="font-bold tracking-tight text-white font-display mt-1"
          >
            Learning Sandbox
          </h2>
        </div>
        
        {/* Responsive Dashboard Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-zinc-950 border border-zinc-900 rounded-2xl max-w-xl">
          {[
            { id: "summary", label: "Ecosystem Summary", icon: Activity },
            { id: "roadmap", label: "My Roadmap", icon: Map },
            { id: "building", label: "Currently Building", icon: Zap },
            { id: "now", label: "The 'Now' Page", icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 text-xs px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white border-zinc-800 shadow-[0_4px_16px_rgba(139,92,246,0.1)]"
                    : "bg-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-purple-400" : "text-zinc-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DASHBOARD INNER PANELS (Premium Glassmorphism) */}
      <div className="glass-card rounded-3xl p-6 md:p-8 min-h-[460px] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-zinc-900/5 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ECOSYSTEM SUMMARY */}
          {activeTab === "summary" && (
            <motion.div
              key="summary-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left 6 cols: Learning lists */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-display">Active Skill Synthesis</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    A look at my structured syllabus representing academic and personal deep learning targets currently being synchronized.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Learning List */}
                  <div className="p-5 glass-card rounded-2xl space-y-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-xl" />
                    <span className="text-[9px] text-purple-400 font-mono font-bold uppercase tracking-widest block border-b border-zinc-900 pb-2.5">
                      ⚡ Currently Studying
                    </span>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {["Data Structures & Algorithms", "React Core Mechanics", "Git Version Control", "GitHub Workflows", "Artificial Intelligence Basics", "Machine Learning Paradigms", "Full Stack pipelines"].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Next Learning List */}
                  <div className="p-5 glass-card rounded-2xl space-y-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl" />
                    <span className="text-[9px] text-cyan-400 font-mono font-bold uppercase tracking-widest block border-b border-zinc-900 pb-2.5">
                      🎯 Next on Roadmap
                    </span>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {["Next.js SSR Frameworks", "Cloud Infrastructure (GCP)", "System Design Architecture", "Deep Learning Architectures", "Open Source Contribution"].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right 6 cols: Animated progress bars */}
              <div className="lg:col-span-6 space-y-5 glass-card p-6 rounded-3xl">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest block mb-2 font-semibold">
                  Ecosystem Progress Analytics
                </span>
                
                <div className="space-y-4">
                  {learningProgress.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-300">{item.name}</span>
                        <span className="text-cyan-400 font-bold">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                          className={`bg-gradient-to-r ${item.color} h-full rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Acquisition Trend Chart */}
              <div className="lg:col-span-12 space-y-5 glass-card p-6 rounded-3xl mt-2">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest block mb-2 font-semibold">
                  Skills Acquisition Trend Over Time
                </span>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#71717a" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#71717a" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                        itemStyle={{ color: '#c084fc' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="skills" 
                        stroke="#c084fc" 
                        strokeWidth={3}
                        dot={{ fill: '#c084fc', r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#22d3ee', stroke: '#09090b', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: ROADMAP */}
          {activeTab === "roadmap" && (
            <motion.div
              key="roadmap-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white font-display">Academic & Developer Roadmap</h3>
                <p className="text-xs text-zinc-400">
                  Tracing my development milestones from college graduation targets to future engineering ventures.
                </p>
              </div>

              {/* Connected cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {roadmapSteps.map((step, idx) => (
                  <div 
                    key={step.id}
                    className="p-5 glass-card hover:border-purple-500/20 rounded-2xl relative overflow-hidden group transition-all duration-300"
                  >
                    {/* Floating index */}
                    <span className="absolute top-3 right-4 font-mono text-[10px] text-zinc-700 group-hover:text-purple-500 transition-colors font-bold">
                      0{step.id}
                    </span>

                    <div className="space-y-3">
                      <span className={`inline-block text-[9px] font-mono px-2.5 py-0.5 rounded-full border ${
                        step.phase === "Current" ? "bg-purple-950/40 border-purple-800/40 text-purple-400" :
                        step.phase === "Active" ? "bg-cyan-950/40 border-cyan-800/40 text-cyan-400" :
                        "bg-zinc-900 border-zinc-800 text-zinc-500"
                      }`}>
                        {step.phase}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {step.title}
                        </h4>
                        <p className="text-[10px] text-zinc-500 leading-snug mt-1.5">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: CURRENTLY BUILDING */}
          {activeTab === "building" && (
            <motion.div
              key="building-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white font-display">Active Sandbox Projects</h3>
                <p className="text-xs text-zinc-400">
                  Custom applications and system platforms actively being written, compiled, or refactored.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {buildingProjects.map((project, idx) => (
                  <div 
                    key={idx}
                    className="p-6 glass-card hover:border-zinc-800 rounded-3xl flex flex-col justify-between space-y-4 group transition-all duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                          {project.name}
                        </h4>
                        <span className={`text-[9px] font-mono px-2.5 py-0.5 border rounded-full shrink-0 ${project.color}`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {project.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                      <span>COMPILE: SYSTEM ACTIVE</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-cyan-400 animate-spin" /> Live Syncing
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: THE NOW PAGE */}
          {activeTab === "now" && (
            <motion.div
              key="now-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left 4 cols: Currently states */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-display">The Now Agenda</h3>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Inspired by Derek Sivers' now initiative, this records what my attention vectors are locked onto at this exact coordinate.
                  </p>
                </div>

                <div className="glass-card p-5 rounded-2xl space-y-3 font-sans text-xs">
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500 font-mono">Current Book:</span>
                    <span className="text-zinc-200 font-bold truncate max-w-[180px]">Hands-On ML with Keras</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500 font-mono">Sandbox:</span>
                    <span className="text-zinc-200 font-bold">Fitness OS Pro</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500 font-mono">Algorithmic Study:</span>
                    <span className="text-zinc-200 font-bold">Graph Theory (BFS/DFS)</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500 font-mono">Stock Analysis:</span>
                    <span className="text-zinc-200 font-bold">EMA Crossover strategies</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-mono">Primary Goal:</span>
                    <span className="text-zinc-200 font-bold">Expand Core DSA repository</span>
                  </div>
                </div>
              </div>

              {/* Right 7 cols: Weekly focus list styled like notes */}
              <div className="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <span className="text-xs font-bold font-display text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Weekly Priority Agenda</span>
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Active Focus</span>
                </div>

                <div className="space-y-3 text-xs text-zinc-300 font-sans">
                  {[
                    { title: "Finish React System Mechanics", desc: "Solidify state machine triggers and context hooks.", done: true },
                    { title: "Improve DSA Graph Analytics", desc: "Solve 15 medium problems on LeetCode.", done: false },
                    { title: "Publish Interactive Portfolio Dashboard", desc: "Integrate Recharts timelines and radial wheel.", done: true },
                    { title: "Read AI Research Papers on Transformer Attention", desc: "Digest 'Attention Is All You Need' mechanisms.", done: false },
                    { title: "Practice Java Thread Synchronizations", desc: "Analyze concurrent queues and mutex parameters.", done: false }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                        item.done ? "bg-emerald-950/10 border-emerald-900/20" : "bg-zinc-950 border-zinc-900"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                        item.done ? "bg-emerald-500 border-emerald-400 text-zinc-950" : "border-zinc-800"
                      }`}>
                        {item.done && <CheckCircle2 className="w-3 h-3 text-zinc-950" />}
                      </div>
                      <div>
                        <h4 className={`font-bold ${item.done ? "text-zinc-400 line-through font-sans" : "text-white"}`}>
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5 leading-normal">{item.desc}</p>
                      </div>
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

const LearningDashboard = memo(LearningDashboardComponent);
export default LearningDashboard;
