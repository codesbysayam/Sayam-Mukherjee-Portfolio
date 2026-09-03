import { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EXTENDED_DATA } from "../data/extendedData";
import { 
  Briefcase, Palette, Youtube, Users, GitBranch, Sparkles, 
  ExternalLink, ArrowUpRight, Award, GraduationCap, CheckCircle2 
} from "lucide-react";

function ExperienceSectionComponent() {
  const [activeTab, setActiveTab] = useState<'Freelancing' | 'Content Creation' | 'Volunteer' | 'Open Source'>('Freelancing');

  const tabs = [
    { id: 'Freelancing', label: 'Freelancing', icon: Briefcase, color: 'text-purple-400' },
    { id: 'Content Creation', label: 'Content Creation', icon: Youtube, color: 'text-red-400' },
    { id: 'Volunteer', label: 'Volunteer Labs', icon: Users, color: 'text-cyan-400' },
    { id: 'Open Source', label: 'Open Source Map', icon: GitBranch, color: 'text-emerald-400' }
  ];

  const currentExperience = EXTENDED_DATA.experience.find(exp => exp.type === activeTab);

  return (
    <div className="space-y-10 font-sans" id="professional-experience">
      {/* Section title */}
      <div className="space-y-2">
        <span className="text-xs text-purple-400 font-mono uppercase tracking-widest block font-bold">
          JOURNEY TIMELINE
        </span>
        <h2 
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
          className="font-bold tracking-tight text-white font-display"
        >
          Experience
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Learning by building, collaborating, and continuously improving.organizing my work into specialized fields of visual editing, content education, and community efforts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Tabs Controller */}
        <div className="lg:col-span-4 flex flex-col gap-2 glass-card p-3 rounded-2xl">
          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest px-3 py-1 block">
            Select Track
          </span>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-300 cursor-pointer group ${
                  isSelected
                    ? "bg-zinc-900 border-zinc-800 text-white shadow-md"
                    : "bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-zinc-950 ${isSelected ? "border border-zinc-800" : ""}`}>
                    <IconComponent className={`w-4 h-4 ${tab.color}`} />
                  </div>
                  <span className="text-xs font-bold font-display">{tab.label}</span>
                </div>
                <ArrowUpRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${tab.color}`} />
              </button>
            );
          })}
        </div>

        {/* Right Tab Content Viewer */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {currentExperience && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-6 md:p-8 rounded-2xl space-y-6 min-h-[380px] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Title Bar */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-900 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white font-display tracking-tight leading-tight">
                        {currentExperience.role}
                      </h3>
                      <p className="text-xs text-purple-400 mt-1.5 font-mono flex items-center gap-1.5">
                        <span>{currentExperience.company}</span>
                        {currentExperience.platform && (
                          <>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-400">{currentExperience.platform}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <span className="text-[10px] bg-zinc-900 border border-zinc-850 px-3 py-1 rounded-full text-zinc-300 font-mono font-bold uppercase tracking-wider">
                      {currentExperience.period}
                    </span>
                  </div>

                  {/* Bullet description block */}
                  <ul className="space-y-3.5">
                    {currentExperience.description.map((bullet, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex items-start gap-3 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-2" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-900">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block">
                    Core Competency Deployed
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentExperience.skills?.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-300 px-3 py-1 rounded-lg font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Additional custom links/widgets based on tab type */}
                {activeTab === 'Freelancing' && (
                  <div className="pt-4 flex items-center justify-between text-xs font-mono border-t border-zinc-900/60 text-zinc-500">
                    <span>Fiverr Global Rating: 🟢 5.0 (25+ orders)</span>
                    <a 
                      href="https://fiverr.com/sayam-mukherjee-placeholder"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-semibold"
                    >
                      <span>Hire Me on Fiverr</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {activeTab === 'Content Creation' && (
                  <div className="pt-4 flex items-center justify-between text-xs font-mono border-t border-zinc-900/60 text-zinc-500">
                    <span>Educational Hub: Obsidian Optics</span>
                    <a 
                      href="#creator-showcase"
                      className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 font-semibold"
                    >
                      <span>View Video Showcase</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {activeTab === 'Open Source' && (
                  <div className="bg-emerald-950/15 border border-emerald-900/30 p-4 rounded-xl flex items-start gap-3 mt-4">
                    <GitBranch className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white font-display">Hacktoberfest preparation Roadmap</h4>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">
                        Setting weekly goals to identify open-source repositories matching PyTorch CV pipelines and custom React utility libraries to make certified contributions in Oct 2026.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const ExperienceSection = memo(ExperienceSectionComponent);
export default ExperienceSection;
