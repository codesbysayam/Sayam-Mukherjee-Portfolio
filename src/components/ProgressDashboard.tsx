import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { 
  Flame, Cpu, Award, Trophy, Dumbbell, Code, BookOpen, Clock, 
  CheckCircle2, Compass, Layers, Heart, TrendingUp, ShieldCheck 
} from "lucide-react";

export default function ProgressDashboard() {
  const [activeTrack, setActiveTrack] = useState<"coding" | "reading" | "gym" | "projects" | "blogs" | "learning">("coding");
  const [graphMetric, setGraphMetric] = useState<"hours" | "items">("hours");

  // Factual telemetry registers
  const codingHours = "1 hr / day";
  const projectsCount = 7; // Verified projects
  const competitionsCount = "5/6 Finals"; // IIT BHU Technex'26
  const hackathonsCount = "SIH 2026"; // Smart India Hackathon MAUSAM

  // Life Balance state (Adjusted manually!)
  const [balanceValues, setBalanceValues] = useState({
    Coding: 85,
    Health: 80,
    Finance: 65,
    Learning: 92,
    Relationships: 75,
    Creativity: 82,
    Productivity: 88,
    Entertainment: 60
  });

  // Pre-seed Heatmap grids depending on track
  const getHeatmapGrid = () => {
    const seedMap: Record<string, number[]> = {
      coding: [3, 2, 0, 1, 3, 2, 1, 0, 3, 2, 3, 1, 0, 2, 3, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 2, 1, 0, 3, 2, 1, 3, 0, 1, 2, 3, 1, 0, 2, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0],
      reading: [1, 0, 2, 3, 0, 1, 2, 1, 0, 1, 2, 0, 1, 2, 3, 0, 1, 0, 2, 3, 0, 1, 2, 1, 0, 1, 2, 0, 1, 2, 3, 0, 1, 0, 2, 3, 0, 1, 2, 1, 0, 1, 2, 0, 1, 2, 3, 0, 1, 0, 2, 3, 0, 1, 2, 1, 0, 1, 2, 0, 1, 2, 3, 0, 1, 0, 2, 3, 0, 1, 2, 1, 0, 1, 2, 0, 1, 2, 3, 0, 1, 0, 2, 3, 0, 1, 2, 1, 0, 1, 2, 0, 1, 2, 3, 0, 1, 0, 2, 3, 0, 1, 2, 1, 0, 1, 2, 0, 1, 2, 3, 0],
      gym: [0, 1, 2, 0, 3, 1, 0, 2, 0, 1, 2, 0, 3, 1, 0, 2, 0, 1, 2, 0, 3, 1, 0, 2, 0, 1, 2, 0, 3, 1, 0, 2, 0, 1, 2, 0, 3, 1, 0, 2, 0, 1, 2, 0, 3, 1, 0, 2, 0, 1, 2, 0, 3, 1, 0, 2, 0, 1, 2, 0, 3, 1, 0, 2, 0, 1, 2, 0, 3, 1, 0, 2, 0, 1, 2, 0, 3, 1, 0, 2, 0, 1, 2, 0, 3, 1, 0, 2, 0, 1, 2, 0, 3, 1, 0, 2, 0, 1, 2, 0, 3, 1, 0, 2, 0, 1, 2, 0, 3, 1, 0, 2],
      projects: [2, 3, 0, 1, 2, 0, 1, 3, 2, 3, 0, 1, 2, 0, 1, 3, 2, 3, 0, 1, 2, 0, 1, 3, 2, 3, 0, 1, 2, 0, 1, 3, 2, 3, 0, 1, 2, 0, 1, 3, 2, 3, 0, 1, 2, 0, 1, 3, 2, 3, 0, 1, 2, 0, 1, 3, 2, 3, 0, 1, 2, 0, 1, 3, 2, 3, 0, 1, 2, 0, 1, 3, 2, 3, 0, 1, 2, 0, 1, 3, 2, 3, 0, 1, 2, 0, 1, 3, 2, 3, 0, 1, 2, 0, 1, 3, 2, 3, 0, 1, 2, 0, 1, 3, 2, 3, 0, 1, 2, 0, 1, 3],
      blogs: [0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1],
      learning: [3, 2, 1, 2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 1, 2, 3]
    };
    return seedMap[activeTrack] || seedMap.coding;
  };

  const getHeatIntensityColor = (level: number) => {
    switch (level) {
      case 0: return "bg-zinc-900 border-zinc-950";
      case 1: return "bg-purple-950/40 text-purple-900 border border-purple-900/10";
      case 2: return "bg-purple-700/50 border border-purple-600/20";
      case 3: return "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.45)]";
      default: return "bg-zinc-900";
    }
  };

  // Monthly Graph Metrics
  const monthlyGraphData = [
    { month: "Jan", studyHours: 110, codingHours: 35, projects: 1, certificates: 2, books: 1 },
    { month: "Feb", studyHours: 120, codingHours: 42, projects: 1, certificates: 1, books: 1 },
    { month: "Mar", studyHours: 135, codingHours: 48, projects: 2, certificates: 2, books: 2 },
    { month: "Apr", studyHours: 115, codingHours: 40, projects: 1, certificates: 1, books: 1 },
    { month: "May", studyHours: 140, codingHours: 52, projects: 3, certificates: 0, books: 2 },
    { month: "Jun", studyHours: 155, codingHours: 64, projects: 3, certificates: 1, books: 1 },
    { month: "Jul", studyHours: 130, codingHours: 50, projects: 1, certificates: 0, books: 1 },
    { month: "Aug", studyHours: 145, codingHours: 58, projects: 2, certificates: 1, books: 2 },
    { month: "Sep", studyHours: 150, codingHours: 60, projects: 2, certificates: 0, books: 1 },
    { month: "Oct", studyHours: 160, codingHours: 72, projects: 4, certificates: 2, books: 3 },
    { month: "Nov", studyHours: 175, codingHours: 85, projects: 3, certificates: 1, books: 2 },
    { month: "Dec", studyHours: 180, codingHours: 90, projects: 4, certificates: 2, books: 3 }
  ];

  const handleSliderChange = (key: keyof typeof balanceValues, value: number) => {
    setBalanceValues(prev => ({ ...prev, [key]: value }));
  };

  // Milestone unlocked badges
  const badges = [
    { title: "First Project", desc: "Compiled and launched first client site.", unlocked: true, icon: CheckCircle2, color: "text-emerald-400 bg-emerald-950/20 border-emerald-900/40" },
    { title: "10 Projects Completed", desc: "Aggregated 10 repository nodes.", unlocked: true, icon: Layers, color: "text-purple-400 bg-purple-950/20 border-purple-900/40" },
    { title: "100 GitHub Commits", desc: "Synchronized 100+ pushes to main.", unlocked: true, icon: Code, color: "text-cyan-400 bg-cyan-950/20 border-cyan-900/40" },
    { title: "Hackathon Finalist", desc: "Ranked top-tier in design hackathon.", unlocked: true, icon: Trophy, color: "text-amber-400 bg-amber-950/20 border-amber-900/40" },
    { title: "100 Days of Coding", desc: "Maintained a continuous daily commit streak.", unlocked: true, icon: Flame, color: "text-rose-400 bg-rose-950/20 border-rose-900/40" },
    { title: "First Internship", desc: "Secured enterprise level practical role.", unlocked: false, icon: Award, color: "text-zinc-500 bg-zinc-900 border-zinc-850/60" },
    { title: "Portfolio Completed", desc: "Deployed fully custom portfolio page.", unlocked: true, icon: ShieldCheck, color: "text-blue-400 bg-blue-950/20 border-blue-900/40" }
  ];

  return (
    <div className="space-y-12 font-sans relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-gradient-to-tr from-cyan-500/5 via-transparent to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <span className="text-xs text-purple-400 font-mono uppercase tracking-[0.2em] font-bold block">
            Systemic Analytics
          </span>
          <h2 
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
            className="font-bold tracking-tight text-white font-display mt-1"
          >
            Growth & Metrics Console
          </h2>
        </div>
        <p className="text-xs text-zinc-400 max-w-sm md:text-right font-mono leading-normal">
          Quantifying qualitative compounding. Daily tracking profiles measuring theoretical, creative, and athletic vectors.
        </p>
      </div>

      {/* TOP STATS DISPLAY & GOALS PROGRESS BARS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Key counters summaries */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest block font-bold">DISCIPLINE TARGETS</span>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="glass-card p-4 rounded-2xl relative overflow-hidden">
                <Code className="w-4 h-4 text-purple-400 mb-2" />
                <span className="text-[9px] text-zinc-500 block uppercase font-mono">Daily Coding Target</span>
                <span className="text-base font-bold text-white font-display mt-0.5 block">1.0 Hour / day</span>
              </div>
              <div className="glass-card p-4 rounded-2xl relative overflow-hidden">
                <BookOpen className="w-4 h-4 text-cyan-400 mb-2" />
                <span className="text-[9px] text-zinc-500 block uppercase font-mono">Academic Study Cadence</span>
                <span className="text-base font-bold text-white font-display mt-0.5 block">5–7h (8–9h w/e)</span>
              </div>
              <div className="glass-card p-4 rounded-2xl relative overflow-hidden">
                <Dumbbell className="w-4 h-4 text-emerald-400 mb-2" />
                <span className="text-[9px] text-zinc-500 block uppercase font-mono">Athletic Conditioning</span>
                <span className="text-base font-bold text-white font-display mt-0.5 block">5 sessions / wk</span>
              </div>
              <div className="glass-card p-4 rounded-2xl relative overflow-hidden">
                <Clock className="w-4 h-4 text-amber-500 mb-2 animate-pulse" />
                <span className="text-[9px] text-zinc-500 block uppercase font-mono">Core Foundations</span>
                <span className="text-base font-bold text-white font-display mt-0.5 block">C++, DSA & OS</span>
              </div>
            </div>
          </div>

          {/* Active Counters (Compiled) */}
          <div className="p-6 glass-card rounded-3xl space-y-4">
            <span className="text-[9px] text-purple-400 font-mono uppercase tracking-widest block font-bold">TELEMETRY REGISTERS</span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-2xl font-extrabold text-white font-display">{projectsCount}</span>
                <p className="text-[10px] text-zinc-500 font-mono uppercase">Verified Projects</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white font-display">{codingHours}</span>
                <p className="text-[10px] text-zinc-500 font-mono uppercase">Coding Cadence</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white font-display">{competitionsCount}</span>
                <p className="text-[10px] text-zinc-500 font-mono uppercase">Technex'26 Finals</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white font-display">{hackathonsCount}</span>
                <p className="text-[10px] text-zinc-500 font-mono uppercase">SIH Hackathon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recharts Monthly Progression curve */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl flex flex-col justify-between min-h-[380px]">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
            <div className="space-y-1">
              <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest block font-bold">COMPILING CURVES</span>
              <h3 className="text-base font-bold text-white font-display">Systemic Progression Chart</h3>
            </div>
            
            {/* Quick Chart Selector Toggle */}
            <div className="flex gap-1 p-1 bg-zinc-950 border border-zinc-900 rounded-xl">
              <button 
                onClick={() => setGraphMetric("hours")}
                className={`px-2.5 py-1 text-[10px] font-mono rounded-lg transition-all cursor-pointer ${
                  graphMetric === "hours" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Hours
              </button>
              <button 
                onClick={() => setGraphMetric("items")}
                className={`px-2.5 py-1 text-[10px] font-mono rounded-lg transition-all cursor-pointer ${
                  graphMetric === "items" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Nodes
              </button>
            </div>
          </div>

          <div className="w-full h-64 select-none">
            <ResponsiveContainer width="100%" height="100%">
              {graphMetric === "hours" ? (
                <LineChart data={monthlyGraphData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="#18181b" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }} />
                  <YAxis tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="studyHours" name="Study Hours" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="codingHours" name="Coding Hours" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              ) : (
                <BarChart data={monthlyGraphData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="#18181b" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }} />
                  <YAxis tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '10px' }} />
                  <Bar dataKey="projects" name="Projects" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="certificates" name="Credentials" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* HEATMAP GRID (The Contribution Matrix) */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
          <div className="space-y-0.5">
            <span className="text-[9px] text-purple-400 font-mono uppercase tracking-widest block font-bold">Activity Grids</span>
            <h3 className="text-base font-bold text-white font-display">Contribution Heatmap</h3>
          </div>

          {/* Active Tracker Toggles */}
          <div className="flex flex-wrap gap-1">
            {(["coding", "reading", "gym", "projects"] as const).map((track) => (
              <button
                key={track}
                onClick={() => setActiveTrack(track)}
                className={`px-3 py-1 text-[10px] font-mono rounded-lg border uppercase tracking-wider transition-all cursor-pointer ${
                  activeTrack === track
                    ? "bg-zinc-900 border-purple-500/30 text-white font-bold"
                    : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        {/* Heatmap Layout */}
        <div className="overflow-x-auto pb-2 select-none">
          <div className="flex gap-2 min-w-[500px]">
            {/* Days indicator */}
            <div className="grid grid-rows-7 gap-[3px] text-[8px] font-mono text-zinc-600 pr-1 select-none">
              <span>Mon</span>
              <span className="invisible">Tue</span>
              <span>Wed</span>
              <span className="invisible">Thu</span>
              <span>Fri</span>
              <span className="invisible">Sat</span>
              <span className="invisible">Sun</span>
            </div>

            {/* Grid Map Cells */}
            <div className="flex-1 grid grid-cols-16 gap-[3px]">
              {getHeatmapGrid().map((level, idx) => (
                <div
                  key={idx}
                  className={`aspect-square rounded-[3px] border border-transparent transition-colors duration-300 ${getHeatIntensityColor(level)}`}
                  title={`Index level: ${level}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 text-[9px] font-mono text-zinc-500">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-900" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-purple-950/40" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-purple-700/50" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-cyan-400" />
          <span>More</span>
        </div>
      </div>

      {/* COMPLETED MILESTONES / BADGE SHELF */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest block">Verifications Index</span>
        <h3 className="text-lg font-bold text-white font-display mt-1">Credentials & Achievements Registry</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div 
                key={idx}
                className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex gap-3 relative overflow-hidden ${
                  badge.unlocked 
                    ? "glass-card hover:border-zinc-800" 
                    : "bg-zinc-950/40 border-dashed border-zinc-900 opacity-50"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                  badge.unlocked ? badge.color : "bg-zinc-950 border-zinc-900 text-zinc-600"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className={`text-xs font-bold font-sans ${badge.unlocked ? "text-white" : "text-zinc-500"}`}>
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 leading-normal">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
