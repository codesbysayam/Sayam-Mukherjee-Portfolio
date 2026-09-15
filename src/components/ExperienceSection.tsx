import { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EXTENDED_DATA } from "../data/extendedData";
import { usePortfolio } from "../context/PortfolioContext";
import { 
  Briefcase, Palette, Youtube, Users, GitBranch, Sparkles, 
  ExternalLink, ArrowUpRight, Award, GraduationCap, CheckCircle2 
} from "lucide-react";

function ExperienceSectionComponent() {
  const [activeTab, setActiveTab] = useState<'Freelancing' | 'Content Creation' | 'Volunteer' | 'Open Source'>('Freelancing');
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const tabs = [
    { id: 'Freelancing', label: 'Freelancing', icon: Briefcase, color: isLight ? 'text-purple-600' : 'text-purple-400' },
    { id: 'Content Creation', label: 'Content Creation', icon: Youtube, color: isLight ? 'text-rose-600' : 'text-red-400' },
    { id: 'Volunteer', label: 'Volunteer Labs', icon: Users, color: isLight ? 'text-cyan-600' : 'text-cyan-400' },
    { id: 'Open Source', label: 'Open Source Map', icon: GitBranch, color: isLight ? 'text-emerald-600' : 'text-emerald-400' }
  ];

  const currentExperience = EXTENDED_DATA.experience.find(exp => exp.type === activeTab);

  return (
    <div className="space-y-8 font-sans" id="professional-experience">
      {/* Section title */}
      <div className="space-y-2">
        <span className={`text-xs font-mono uppercase tracking-widest block font-bold ${
          isLight ? "text-purple-700" : "text-purple-400"
        }`}>
          JOURNEY TIMELINE
        </span>
        <h2 
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
          className={`font-bold tracking-tight font-display ${
            isLight ? "text-slate-900" : "text-white"
          }`}
        >
          Experience
        </h2>
        <p className={`text-sm max-w-2xl leading-relaxed ${
          isLight ? "text-slate-600" : "text-zinc-400"
        }`}>
          Learning by building, collaborating, and continuously improving—organizing my work into specialized fields of visual editing, content education, and community efforts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Tabs Controller */}
        <div className={`lg:col-span-4 flex flex-col gap-2 p-3 rounded-2xl border transition-all ${
          isLight 
            ? "bg-white border-slate-200/90 shadow-sm" 
            : "bg-[#11131c]/90 border-white/[0.08] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)]"
        }`}>
          <span className={`text-[9px] font-mono uppercase tracking-widest px-3 py-1 block ${
            isLight ? "text-slate-400" : "text-zinc-500"
          }`}>
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
                    ? isLight
                      ? "bg-slate-100 border-slate-300 text-slate-900 shadow-sm"
                      : "bg-white/[0.08] border-white/10 text-white shadow-md"
                    : isLight
                    ? "bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    : "bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${
                    isLight 
                      ? "bg-slate-50 border-slate-200" 
                      : "bg-zinc-950/80 border-white/[0.08]"
                  }`}>
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
                className={`p-6 md:p-8 rounded-2xl space-y-6 min-h-[380px] flex flex-col justify-between border transition-all ${
                  isLight
                    ? "bg-white border-slate-200/90 shadow-sm"
                    : "bg-[#11131c]/90 border-white/[0.08] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)]"
                }`}
              >
                <div className="space-y-4">
                  {/* Title Bar */}
                  <div className={`flex flex-wrap items-start justify-between gap-4 border-b pb-4 ${
                    isLight ? "border-slate-100" : "border-white/[0.06]"
                  }`}>
                    <div>
                      <h3 className={`text-xl font-bold font-display tracking-tight leading-tight ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}>
                        {currentExperience.role}
                      </h3>
                      <p className={`text-xs mt-1.5 font-mono flex items-center gap-1.5 ${
                        isLight ? "text-purple-700" : "text-purple-400"
                      }`}>
                        <span>{currentExperience.company}</span>
                        {currentExperience.platform && (
                          <>
                            <span className={isLight ? "text-slate-300" : "text-zinc-600"}>•</span>
                            <span className={isLight ? "text-slate-500" : "text-zinc-400"}>{currentExperience.platform}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <span className={`text-[10px] px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider border ${
                      isLight
                        ? "bg-slate-100 border-slate-200 text-slate-700"
                        : "bg-white/[0.04] border-white/[0.08] text-zinc-300"
                    }`}>
                      {currentExperience.period}
                    </span>
                  </div>

                  {/* Bullet description block */}
                  <ul className="space-y-3.5">
                    {currentExperience.description.map((bullet, idx) => (
                      <li key={idx} className={`text-xs flex items-start gap-3 leading-relaxed ${
                        isLight ? "text-slate-700" : "text-zinc-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${
                          isLight ? "bg-purple-600" : "bg-purple-400"
                        }`} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`space-y-4 pt-4 border-t ${
                  isLight ? "border-slate-100" : "border-white/[0.06]"
                }`}>
                  <span className={`text-[9px] font-mono uppercase tracking-widest block ${
                    isLight ? "text-slate-400" : "text-zinc-500"
                  }`}>
                    Core Competency Deployed
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentExperience.skills?.map((skill, sIdx) => (
                      <span key={sIdx} className={`text-[10px] px-3 py-1 rounded-lg font-mono border ${
                        isLight
                          ? "bg-slate-100 border-slate-200 text-slate-800"
                          : "bg-white/[0.04] border-white/[0.08] text-zinc-300"
                      }`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Additional custom links/widgets based on tab type */}
                {activeTab === 'Freelancing' && (
                  <div className={`pt-4 flex items-center justify-between text-xs font-mono border-t ${
                    isLight ? "border-slate-100 text-slate-500" : "border-white/[0.06] text-zinc-400"
                  }`}>
                    <span>Fiverr Global Rating: 🟢 5.0 (25+ orders)</span>
                    <a 
                      href="https://fiverr.com/sayam-mukherjee-placeholder"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`transition-colors flex items-center gap-1 font-semibold ${
                        isLight ? "text-purple-700 hover:text-purple-900" : "text-purple-400 hover:text-cyan-300"
                      }`}
                    >
                      <span>Hire Me on Fiverr</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {activeTab === 'Content Creation' && (
                  <div className={`pt-4 flex items-center justify-between text-xs font-mono border-t ${
                    isLight ? "border-slate-100 text-slate-500" : "border-white/[0.06] text-zinc-400"
                  }`}>
                    <span>Educational Hub: Technical Learning & AI</span>
                    <a 
                      href="#creator-showcase"
                      className={`transition-colors flex items-center gap-1 font-semibold ${
                        isLight ? "text-rose-600 hover:text-rose-800" : "text-red-400 hover:text-red-300"
                      }`}
                    >
                      <span>View Video Showcase</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {activeTab === 'Open Source' && (
                  <div className={`p-4 rounded-xl flex items-start gap-3 mt-4 border ${
                    isLight
                      ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                      : "bg-emerald-500/10 border-emerald-500/20 text-zinc-200"
                  }`}>
                    <GitBranch className={`w-5 h-5 shrink-0 mt-0.5 ${
                      isLight ? "text-emerald-700" : "text-emerald-400"
                    }`} />
                    <div className="space-y-1">
                      <h4 className={`text-xs font-bold font-display ${
                        isLight ? "text-emerald-900" : "text-white"
                      }`}>Hacktoberfest preparation Roadmap</h4>
                      <p className={`text-[10px] leading-relaxed ${
                        isLight ? "text-emerald-800" : "text-zinc-400"
                      }`}>
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
