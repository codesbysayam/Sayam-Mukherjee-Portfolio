import { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Award, Flame, Zap, CheckCircle2, ArrowRight, Sparkles, 
  Map, Activity, Book, Clock, AlertCircle, Compass, Target, Dumbbell, Code2, GraduationCap, Laptop
} from "lucide-react";
import { VERIFIED_LEARNING_NOW, VERIFIED_ROADMAP_MILESTONES, VERIFIED_CORE_PILLARS } from "../data/learning";
import { VERIFIED_DAILY_ROUTINE } from "../data/profile";
import { VERIFIED_PROJECTS } from "../data/projects";

function LearningDashboardComponent() {
  const [activeTab, setActiveTab] = useState<"now" | "pillars" | "routine" | "roadmap">("now");

  return (
    <div className="space-y-12 font-sans relative" id="learning-dashboard">
      {/* Light glow blur */}
      <div className="absolute -top-12 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950/80 border border-zinc-900 rounded-full mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase font-bold">
              ACADEMIC & ENGINEERING CADENCE
            </span>
          </div>
          <h2 
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
            className="font-bold tracking-tight text-white font-display mt-1"
          >
            Learning & Daily Rhythm
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1 leading-relaxed">
            2nd Year B.Tech CSE at Kalinga Institute of Industrial Technology, Bhubaneswar. Transparent documentation of active coursework, disciplined routines, and foundational study.
          </p>
        </div>
        
        {/* Responsive Dashboard Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-zinc-950 border border-zinc-900 rounded-2xl max-w-xl">
          {[
            { id: "now", label: "The 'Now' Page", icon: Clock },
            { id: "pillars", label: "Active Learning Pillars", icon: BookOpen },
            { id: "routine", label: "Daily Routine", icon: Activity },
            { id: "roadmap", label: "Academic Roadmap", icon: Map }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 text-xs px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white border border-zinc-800 shadow-[0_4px_16px_rgba(139,92,246,0.1)]"
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

      {/* DASHBOARD INNER PANELS */}
      <div className="glass-card rounded-3xl p-6 md:p-8 min-h-[460px] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-zinc-900/5 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: THE NOW PAGE */}
          {activeTab === "now" && (
            <motion.div
              key="now-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left 5 cols: Current status badge cards */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                    <span>Current Focus: B.Tech CSE (Year 1)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Inspired by Derek Sivers' public /now page. Clear, honest snapshot of my active academic commitments and daily priorities.
                  </p>
                </div>

                <div className="glass-card p-5 rounded-2xl space-y-3 font-sans text-xs border border-zinc-850">
                  <div className="flex justify-between border-b border-zinc-900 pb-2.5">
                    <span className="text-zinc-500 font-mono">Status:</span>
                    <span className="text-zinc-200 font-bold">{VERIFIED_LEARNING_NOW.currentStatus}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2.5">
                    <span className="text-zinc-500 font-mono">Institution:</span>
                    <span className="text-purple-300 font-bold">{VERIFIED_LEARNING_NOW.college}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2.5">
                    <span className="text-zinc-500 font-mono">Location:</span>
                    <span className="text-zinc-300">{VERIFIED_LEARNING_NOW.location}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2.5">
                    <span className="text-zinc-500 font-mono">Daily Coding:</span>
                    <span className="text-emerald-400 font-bold">{VERIFIED_LEARNING_NOW.dailyRoutine.coding}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2.5">
                    <span className="text-zinc-500 font-mono">Weekday Study:</span>
                    <span className="text-cyan-400 font-bold">{VERIFIED_LEARNING_NOW.dailyRoutine.studyWeekdays}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2.5">
                    <span className="text-zinc-500 font-mono">Weekend Study:</span>
                    <span className="text-cyan-400 font-bold">{VERIFIED_LEARNING_NOW.dailyRoutine.studyWeekends}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-mono">Athletic Cadence:</span>
                    <span className="text-amber-400 font-bold">{VERIFIED_LEARNING_NOW.dailyRoutine.gym}</span>
                  </div>
                </div>
              </div>

              {/* Right 7 cols: Active Focus Areas */}
              <div className="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4 border border-zinc-850">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <span className="text-xs font-bold font-display text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span>What I am Actively Learning & Practicing</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                    Spring 2026
                  </span>
                </div>

                <div className="space-y-3">
                  {VERIFIED_CORE_PILLARS.map((pillar, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white font-display flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-400" />
                          {pillar.pillar}
                        </h4>
                        <span className="text-[9px] font-mono text-zinc-500">{pillar.status}</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        {pillar.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {pillar.topics.map((t, i) => (
                          <span key={i} className="text-[9px] font-mono bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: ACTIVE LEARNING PILLARS */}
          {activeTab === "pillars" && (
            <motion.div
              key="pillars-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white font-display">Four Core Engineering Pillars</h3>
                <p className="text-xs text-zinc-400">
                  Disciplined breadth across computer science foundations, algorithmic problem-solving, computer vision, and modern full-stack development.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {VERIFIED_CORE_PILLARS.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-6 glass-card rounded-2xl space-y-3 border border-zinc-850 hover:border-purple-500/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300 font-display">
                        {item.pillar}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="pt-2 border-t border-zinc-900">
                      <span className="text-[9px] text-zinc-500 font-mono uppercase block mb-1.5">Key Subtopics</span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.topics.map((t, tidx) => (
                          <span key={tidx} className="text-[10px] font-mono bg-zinc-900/80 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: DAILY ROUTINE */}
          {activeTab === "routine" && (
            <motion.div
              key="routine-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white font-display">Authentic Daily Routine & Cadence</h3>
                <p className="text-xs text-zinc-400">
                  Disciplined time allocation maintaining academic rigor, athletic recovery, and consistent development.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 glass-card rounded-2xl space-y-3 border border-zinc-850">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">Daily Coding</h4>
                    <span className="text-xl font-bold text-emerald-400 font-mono block mt-1">1 hour / day</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Consistent daily practice focused on C++ programming, problem decomposition, and algorithmic solutions without burnout.
                  </p>
                </div>

                <div className="p-5 glass-card rounded-2xl space-y-3 border border-zinc-850">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">Core Academics</h4>
                    <span className="text-xl font-bold text-cyan-400 font-mono block mt-1">5–7h (wkdays), 8–9h (wknds)</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Deep study of university engineering curricula: Operating Systems, Digital Logic & Computer Architecture, Discrete Math.
                  </p>
                </div>

                <div className="p-5 glass-card rounded-2xl space-y-3 border border-zinc-850">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">Fitness & Health</h4>
                    <span className="text-xl font-bold text-amber-400 font-mono block mt-1">5 days / week</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {VERIFIED_DAILY_ROUTINE.gymDetails} maintaining physical energy, resilience, and mental endurance for problem solving.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: ACADEMIC ROADMAP */}
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
                <h3 className="text-lg font-bold text-white font-display">Academic & Professional Trajectory</h3>
                <p className="text-xs text-zinc-400">
                  Four-year milestones from 1st year B.Tech foundations through graduation and production systems engineering.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {VERIFIED_ROADMAP_MILESTONES.map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-5 glass-card rounded-2xl relative space-y-3 border border-zinc-850 hover:border-purple-500/30 transition-all"
                  >
                    <span className="absolute top-3 right-4 font-mono text-[10px] text-zinc-700 font-bold">
                      0{idx + 1}
                    </span>
                    <span className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                      step.status === "Active" 
                        ? "bg-purple-950/40 border-purple-800/40 text-purple-400" 
                        : "bg-zinc-900 border-zinc-800 text-zinc-400"
                    }`}>
                      {step.timeline} • {step.status}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white font-display">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
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
