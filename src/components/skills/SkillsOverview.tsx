import React from "react";
import { 
  Code2, Layout, Database, Cpu, Wrench, Binary, 
  CheckCircle2, Layers 
} from "lucide-react";

interface CategoryBlock {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  skills: string[];
}

const OVERVIEW_CATEGORIES: CategoryBlock[] = [
  {
    title: "LANGUAGES",
    subtitle: "Foundational & systems syntax",
    icon: Code2,
    accentColor: "text-cyan-400",
    accentBg: "bg-cyan-500/10",
    accentBorder: "border-cyan-500/20",
    skills: ["Python", "Java", "JavaScript", "TypeScript", "C++", "HTML", "CSS"]
  },
  {
    title: "FRONTEND",
    subtitle: "Interactive reactive interfaces",
    icon: Layout,
    accentColor: "text-purple-400",
    accentBg: "bg-purple-500/10",
    accentBorder: "border-purple-500/20",
    skills: ["React", "HTML/CSS", "JavaScript", "TypeScript", "Tailwind CSS", "Bootstrap"]
  },
  {
    title: "BACKEND & DATA",
    subtitle: "Service APIs & persistent storage",
    icon: Database,
    accentColor: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/20",
    skills: ["Node.js", "Express.js", "MongoDB", "Firebase"]
  },
  {
    title: "AI / MACHINE LEARNING",
    subtitle: "Computer vision & neural models",
    icon: Cpu,
    accentColor: "text-rose-400",
    accentBg: "bg-rose-500/10",
    accentBorder: "border-rose-500/20",
    skills: ["Machine Learning", "Deep Learning", "Computer Vision", "YOLO / YOLOv8", "PyTorch"]
  },
  {
    title: "TOOLS & DEVOPS",
    subtitle: "Toolchain, design & deployment",
    icon: Wrench,
    accentColor: "text-amber-400",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/20",
    skills: ["Git", "GitHub", "VS Code", "Figma", "Canva", "Vercel"]
  },
  {
    title: "CORE ENGINEERING",
    subtitle: "Algorithms, architecture & protocol",
    icon: Binary,
    accentColor: "text-blue-400",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/20",
    skills: [
      "Data Structures & Algorithms", 
      "System Architecture", 
      "API Integration", 
      "Responsive Web Development", 
      "Version Control"
    ]
  }
];

interface SkillsOverviewProps {
  onSelectSkill?: (skillName: string) => void;
}

export function SkillsOverview({ onSelectSkill }: SkillsOverviewProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-850 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
              TECHNICAL SCOPE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-mono text-zinc-500">6 CORE CATEGORIES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            SKILL OVERVIEW
          </h2>
        </div>
        <p className="text-xs text-zinc-400 font-mono">
          Honest breakdown · No fabricated percentages · Verified implementation
        </p>
      </div>

      {/* Categories Grid (2x3 on desktop, 1 on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {OVERVIEW_CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;

          return (
            <div
              key={cat.title}
              className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-850 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              {/* Category Title & Icon */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className={`text-xs font-mono font-bold tracking-wider ${cat.accentColor}`}>
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                    {cat.subtitle}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-lg ${cat.accentBg} border ${cat.accentBorder} ${cat.accentColor} flex items-center justify-center shrink-0`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cat.skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => onSelectSkill?.(skill)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-900/80 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer text-left"
                    title={`View evidence for ${skill}`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SkillsOverview;
