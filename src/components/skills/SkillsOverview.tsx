import React from "react";
import { 
  Code2, Layout, Database, Cpu, Wrench, Binary, ArrowDown
} from "lucide-react";

interface CategoryBlock {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  skills: string[];
}

const OVERVIEW_CATEGORIES: CategoryBlock[] = [
  {
    title: "Languages",
    subtitle: "Core syntax & system programming",
    icon: Code2,
    skills: ["Python", "C++", "Java", "TypeScript", "JavaScript", "HTML", "CSS"]
  },
  {
    title: "Frontend",
    subtitle: "Reactive interfaces & design systems",
    icon: Layout,
    skills: ["React", "TypeScript", "Tailwind CSS", "JavaScript", "HTML/CSS", "Bootstrap"]
  },
  {
    title: "Backend & Data",
    subtitle: "APIs, microservices & persistence",
    icon: Database,
    skills: ["Node.js", "Express.js", "MongoDB", "Firebase", "REST APIs"]
  },
  {
    title: "AI / Machine Learning",
    subtitle: "Neural vision models & inference",
    icon: Cpu,
    skills: ["Computer Vision", "PyTorch", "YOLO / YOLOv8", "Deep Learning", "Machine Learning"]
  },
  {
    title: "Tools & DevOps",
    subtitle: "Development environment & delivery",
    icon: Wrench,
    skills: ["Git", "GitHub", "VS Code", "Vercel", "Figma", "Canva"]
  },
  {
    title: "Core Engineering",
    subtitle: "Algorithms, architecture & protocols",
    icon: Binary,
    skills: [
      "Data Structures & Algorithms", 
      "System Architecture", 
      "API Integration", 
      "Responsive Web Design", 
      "State Management"
    ]
  }
];

interface SkillsOverviewProps {
  onSelectSkill?: (skillName: string) => void;
}

export function SkillsOverview({ onSelectSkill }: SkillsOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-cyan-400">
            02 — TECHNOLOGY STACK
          </span>
          <span className="h-px w-8 bg-zinc-800" />
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            6 Core Domains
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
            Organized Technical Domains
          </h2>
          <span className="text-[11px] font-mono text-zinc-500">
            Click any technology to inspect implementation evidence
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
          A structured matrix of active engineering domains. Focus is on depth of implementation rather than superficial familiarity.
        </p>
      </div>

      {/* Categories Grid (2x3 on desktop, 1 on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {OVERVIEW_CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;

          return (
            <div
              key={cat.title}
              className="p-4 sm:p-5 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-zinc-800 transition-all duration-200 flex flex-col justify-between space-y-3"
            >
              {/* Category Title & Icon */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-white font-sans tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans">
                    {cat.subtitle}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cat.skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => onSelectSkill?.(skill)}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer text-left"
                    title={`Inspect evidence for ${skill}`}
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
