import { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EXTENDED_DATA } from "../data/extendedData";
import { usePortfolio } from "../context/PortfolioContext";
import { youtubeChannels } from "../data/channels";
import { youtubeChannelAnalytics } from "../data/youtubeAnalytics";
import { YouTubeAnalyticsCard } from "./YouTubeAnalyticsCard";
import { 
  Briefcase, Youtube, Users, GitBranch, 
  ExternalLink, ArrowUpRight, ArrowRight, History, Sparkles
} from "lucide-react";

interface ExperienceSectionProps {
  onNavigateToShowcase?: () => void;
}

function ExperienceSectionComponent({ onNavigateToShowcase }: ExperienceSectionProps) {
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

  const handleShowcaseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToShowcase) {
      onNavigateToShowcase();
    } else {
      window.dispatchEvent(new CustomEvent("portfolio-navigate-tab", { detail: "showcase" }));
      const target = document.getElementById("creator-showcase") || document.getElementById("video-showcase");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="space-y-8 font-sans" id="professional-experience">
      {/* Section title */}
      <div className="space-y-2">
        <span className={`text-xs font-mono tracking-wide block font-semibold ${
          isLight ? "text-purple-700" : "text-purple-400"
        }`}>
          Journey Timeline
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
          Learning by building, collaborating, and continuously improving, while organizing my work across visual editing, tech content, and community initiatives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Tabs Controller */}
        <div className={`lg:col-span-4 flex flex-col gap-2 p-3 rounded-2xl border transition-all ${
          isLight 
            ? "bg-white border-slate-200/90 shadow-sm" 
            : "bg-[#11131c]/90 border-white/[0.08] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)]"
        }`}>
          <span className={`text-xs font-mono tracking-wider px-3 py-1 block ${
            isLight ? "text-slate-500" : "text-zinc-400"
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

                    <span className={`text-xs px-3 py-1 rounded-full font-mono font-medium border ${
                      isLight
                        ? "bg-slate-100 border-slate-200 text-slate-700"
                        : "bg-white/[0.04] border-white/[0.08] text-zinc-300"
                    }`}>
                      {currentExperience.period}
                    </span>
                  </div>

                  {/* Bullet description block */}
                  <ul className="space-y-3.5">
                    {activeTab === 'Content Creation' ? (
                      <>
                        <li className={`text-xs sm:text-sm flex items-start gap-3 leading-relaxed ${
                          isLight ? "text-slate-700" : "text-zinc-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${
                            isLight ? "bg-purple-600" : "bg-purple-400"
                          }`} />
                          <span>
                            Operating educational, technical, and entertainment YouTube channels with an organic reach spanning tutorials, algorithmic breakdowns, and dynamic video concepts.
                          </span>
                        </li>
                        <li className={`text-xs sm:text-sm flex items-start gap-3 leading-relaxed ${
                          isLight ? "text-slate-700" : "text-zinc-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${
                            isLight ? "bg-purple-600" : "bg-purple-400"
                          }`} />
                          <span>
                            Applying viewer psychology, high-CTR thumbnail compositions, script pacing, and visual storytelling to communicate complex concepts with high signal clarity.
                          </span>
                        </li>
                      </>
                    ) : (
                      currentExperience.description.map((bullet, idx) => (
                        <li key={idx} className={`text-xs sm:text-sm flex items-start gap-3 leading-relaxed ${
                          isLight ? "text-slate-700" : "text-zinc-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${
                            isLight ? "bg-purple-600" : "bg-purple-400"
                          }`} />
                          <span>{bullet}</span>
                        </li>
                      ))
                    )}
                  </ul>

                  {/* Integrated YouTube Channels Showcase inside Content Creation Track */}
                  {activeTab === 'Content Creation' && (
                    <div className="space-y-3 pt-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-mono tracking-wider block font-semibold ${
                          isLight ? "text-slate-600" : "text-zinc-400"
                        }`}>
                          YouTube Channels & Media Platforms ({youtubeChannels.length})
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          Historical figures marked accordingly
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {youtubeChannels.map((channel) => {
                          const isHistorical = channel.status === "historical";
                          const period = channel.startYear
                            ? `${channel.startYear}–${channel.endYear || "Present"}`
                            : null;

                          return (
                            <div
                              key={channel.id}
                              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                                isLight
                                  ? "bg-slate-50 border-slate-200/90 hover:border-slate-300"
                                  : "bg-zinc-950/60 border-zinc-900 hover:border-zinc-800"
                              }`}
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-7 h-7 rounded-lg bg-red-950/20 border border-red-900/30 flex items-center justify-center shrink-0">
                                      <Youtube className="w-3.5 h-3.5 text-red-500" />
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className={`text-xs font-bold font-display truncate ${
                                        isLight ? "text-slate-900" : "text-white"
                                      }`}>
                                        {channel.name}
                                      </h4>
                                      <span className="text-[10px] font-mono text-zinc-500 block truncate">
                                        {channel.handle || "YouTube Channel"}
                                      </span>
                                    </div>
                                  </div>

                                  {isHistorical ? (
                                    <span className="rounded border border-amber-900/40 bg-amber-950/30 px-1.5 py-0.5 font-mono text-[9px] text-amber-400 font-semibold uppercase shrink-0">
                                      Historical
                                    </span>
                                  ) : channel.category ? (
                                    <span className="rounded border border-zinc-850 bg-zinc-900 px-1.5 py-0.5 font-mono text-[9px] text-zinc-400 max-w-[100px] truncate shrink-0">
                                      {channel.category}
                                    </span>
                                  ) : null}
                                </div>

                                {/* Metric & Activity summary */}
                                <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-zinc-400">
                                  <span>
                                    {isHistorical && channel.historicalSubscribers ? (
                                      <span className="text-amber-400/90">
                                        {channel.historicalSubscribers >= 1000 
                                          ? `${(channel.historicalSubscribers / 1000).toFixed(1).replace(/\.0$/, "")}K+ historical subs`
                                          : `${channel.historicalSubscribers} historical subs`}
                                      </span>
                                    ) : channel.currentSubscribers ? (
                                      <span className="text-white">
                                        {channel.currentSubscribers} subs
                                      </span>
                                    ) : (
                                      <span className="text-zinc-500">Stats unverified</span>
                                    )}
                                  </span>

                                  {period && (
                                    <span className="text-zinc-500 flex items-center gap-1">
                                      <History className="w-2.5 h-2.5" />
                                      {period}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="pt-2.5 mt-2 border-t border-zinc-900/60 flex justify-end">
                                <a
                                  href={channel.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-mono text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
                                >
                                  <span>Visit Channel</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Dedicated YouTube Channel Analytics Area */}
                      <div className="space-y-3 pt-5 mt-4 border-t border-zinc-900/80">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-mono tracking-wider font-bold uppercase ${
                              isLight ? "text-purple-700" : "text-purple-400"
                            }`}>
                              YouTube Channel Analytics Snapshots
                            </span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-purple-900/40 bg-purple-950/30 text-purple-300">
                              Studio Dashboards
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">
                            Obsidian Optics & BEASTIFIED • Snapshot as of 21 Oct 2026
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {youtubeChannelAnalytics.map((analytics) => (
                            <YouTubeAnalyticsCard
                              key={analytics.channelId}
                              channel={analytics}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`space-y-4 pt-4 border-t ${
                  isLight ? "border-slate-100" : "border-white/[0.06]"
                }`}>
                  <span className={`text-xs font-mono tracking-wider block ${
                    isLight ? "text-slate-500" : "text-zinc-400"
                  }`}>
                    Core Competency Deployed
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeTab === 'Content Creation' ? (
                      ["Video Editing", "Content Strategy", "Visual Psychology", "Audience Retention"].map((skill, sIdx) => (
                        <span key={sIdx} className={`text-xs px-3 py-1 rounded-lg font-mono border ${
                          isLight
                            ? "bg-slate-100 border-slate-200 text-slate-800"
                            : "bg-white/[0.04] border-white/[0.08] text-zinc-300"
                        }`}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      currentExperience.skills?.map((skill, sIdx) => (
                        <span key={sIdx} className={`text-xs px-3 py-1 rounded-lg font-mono border ${
                          isLight
                            ? "bg-slate-100 border-slate-200 text-slate-800"
                            : "bg-white/[0.04] border-white/[0.08] text-zinc-300"
                        }`}>
                          {skill}
                        </span>
                      ))
                    )}
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
                  <div className={`pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-t ${
                    isLight ? "border-slate-100 text-slate-500" : "border-white/[0.06] text-zinc-400"
                  }`}>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      Educational Hub: Technical Learning & AI Media
                    </span>
                    <button 
                      type="button"
                      onClick={handleShowcaseClick}
                      className={`transition-all flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-lg border cursor-pointer ${
                        isLight 
                          ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100" 
                          : "bg-red-950/30 border-red-900/40 text-red-400 hover:bg-red-900/40 hover:text-red-300"
                      }`}
                      aria-label="View YouTube video showcase"
                    >
                      <span>View Video Showcase</span>
                      <ArrowRight className="w-3.5 h-3.5 text-red-400" />
                    </button>
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
