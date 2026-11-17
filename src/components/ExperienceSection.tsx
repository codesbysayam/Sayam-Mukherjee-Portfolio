import { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EXTENDED_DATA } from "../data/extendedData";
import { SOCIAL_LINKS } from "../data/siteContent";
import { youtubeChannels } from "../data/channels";
import { youtubeChannelAnalytics } from "../data/youtubeAnalytics";
import { YouTubeAnalyticsCard } from "./YouTubeAnalyticsCard";
import {
  Briefcase, Youtube, Users, GitBranch,
  ExternalLink, ArrowUpRight, ArrowRight, History
} from "lucide-react";
import { EditorialReveal, LineReveal } from "../motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../motion/tokens";

interface ExperienceSectionProps {
  onNavigateToShowcase?: () => void;
}

function ExperienceSectionComponent({ onNavigateToShowcase }: ExperienceSectionProps) {
  const [activeTab, setActiveTab] = useState<"Freelancing" | "Content Creation" | "Volunteer" | "Open Source">("Freelancing");
  const reduced = usePrefersReducedMotion();

  const tabs = [
    { id: "Freelancing", label: "Freelancing", icon: Briefcase },
    { id: "Content Creation", label: "Content Creation", icon: Youtube },
    { id: "Volunteer", label: "Volunteer Labs", icon: Users },
    { id: "Open Source", label: "Open Source Map", icon: GitBranch }
  ] as const;

  const currentExperience = EXTENDED_DATA.experience.find((exp) => exp.type === activeTab);

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
    <section id="about-experience" className="space-y-8 font-sans">
      <div id="professional-experience" className="space-y-6">
      {/* Section Header */}
      <EditorialReveal className="space-y-2 pb-4">
        <span className="text-xs font-mono tracking-wider uppercase block font-semibold text-[var(--accent)]">
          Experience Ledger
        </span>
        <h2
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.25rem)" }}
          className="font-extrabold tracking-tight font-display text-[var(--text)] leading-[1.06]"
        >
          Experience
        </h2>
        <p className="text-sm max-w-2xl leading-relaxed text-[var(--text-secondary)]">
          Learning by building, collaborating, and continuously improving — organizing hands-on work across visual editing, technical content creation, and community initiatives.
        </p>
      </EditorialReveal>
      <LineReveal />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Track Selector */}
        <div className="lg:col-span-4 card p-3 flex flex-col gap-1.5" role="tablist" aria-label="Experience tracks">
          <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 block text-[var(--text-muted)]">
            Select Track
          </span>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-[8px] border text-left transition-all duration-200 cursor-pointer group ${
                  isSelected
                    ? "bg-[#20231D] dark:bg-[#C7E34A] border-[#20231D] dark:border-[#C7E34A] text-[#F4F4ED] dark:text-[#20231D]"
                    : "bg-transparent border-transparent text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-[6px] border ${
                      isSelected
                        ? "bg-white/10 dark:bg-[#20231D]/15 border-white/15 dark:border-[#20231D]/20"
                        : "bg-[var(--surface)] border-[var(--border)]"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold font-display">{tab.label}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </button>
            );
          })}
        </div>

        {/* Right Track Details Viewer */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {currentExperience && (
              <motion.div
                key={activeTab}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: MOTION_DURATION.normal, ease: MOTION_EASE.out }}
                className="card p-6 md:p-8 space-y-6 lg:min-h-[380px] flex flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Title Bar */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
                    <div>
                      <h3 className="text-xl font-bold font-display tracking-tight leading-tight text-[var(--text)]">
                        {currentExperience.role}
                      </h3>
                      <p className="text-xs mt-1.5 font-mono flex items-center gap-1.5 text-[var(--accent)] font-semibold">
                        <span>{currentExperience.company}</span>
                        {currentExperience.platform && (
                          <>
                            <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>
                            <span className="text-[var(--text-muted)] font-normal">{currentExperience.platform}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <span className="text-xs font-mono font-medium text-[var(--text-secondary)] tabular-nums">
                      {currentExperience.period}
                    </span>
                  </div>

                  {/* Bullet descriptions */}
                  <ul className="space-y-3.5">
                    {activeTab === "Content Creation" ? (
                      <>
                        <li className="text-xs sm:text-sm flex items-start gap-3 leading-relaxed text-[var(--text-secondary)]">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2 bg-[var(--accent)]" aria-hidden="true" />
                          <span>
                            Operating educational, technical, and entertainment YouTube channels with organic reach spanning tutorials, algorithmic breakdowns, and visual essays.
                          </span>
                        </li>
                        <li className="text-xs sm:text-sm flex items-start gap-3 leading-relaxed text-[var(--text-secondary)]">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2 bg-[var(--accent)]" aria-hidden="true" />
                          <span>
                            Applying viewer psychology, high-CTR thumbnail compositions, script pacing, and visual storytelling to communicate complex concepts cleanly.
                          </span>
                        </li>
                      </>
                    ) : (
                      currentExperience.description.map((bullet, idx) => (
                        <li key={idx} className="text-xs sm:text-sm flex items-start gap-3 leading-relaxed text-[var(--text-secondary)]">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2 bg-[var(--accent)]" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))
                    )}
                  </ul>

                  {/* Integrated YouTube Channels & Analytics Showcase */}
                  {activeTab === "Content Creation" && (
                    <div className="space-y-4 pt-3 border-t border-[var(--border)]">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-mono tracking-wider font-semibold text-[var(--text)]">
                          YouTube Channels &amp; Media Platforms ({youtubeChannels.length})
                        </span>
                        <span className="text-[11px] font-mono text-[var(--text-muted)]">
                          Historical records clearly labeled
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
                              className="p-4 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between transition-colors hover:border-[var(--border-strong)]"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-[6px] bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0">
                                      <Youtube className="w-3.5 h-3.5 text-red-600 dark:text-red-400" aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="text-xs font-bold font-display truncate text-[var(--text)]">
                                        {channel.name}
                                      </h4>
                                      <span className="text-[11px] font-mono text-[var(--text-muted)] block truncate">
                                        {channel.handle || "YouTube Channel"}
                                      </span>
                                    </div>
                                  </div>

                                  {isHistorical ? (
                                    <span className="text-[10px] font-mono text-[var(--accent)] font-semibold uppercase shrink-0">
                                      Historical
                                    </span>
                                  ) : channel.category ? (
                                    <span className="text-[10px] font-mono text-[var(--text-muted)] max-w-[110px] truncate shrink-0">
                                      {channel.category}
                                    </span>
                                  ) : null}
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-[var(--text-secondary)]">
                                  <span>
                                    {isHistorical && channel.historicalSubscribers ? (
                                      <span>
                                        {channel.historicalSubscribers >= 1000
                                          ? `${(channel.historicalSubscribers / 1000).toFixed(1).replace(/\.0$/, "")}K+ historical subs`
                                          : `${channel.historicalSubscribers} historical subs`}
                                      </span>
                                    ) : channel.currentSubscribers ? (
                                      <span className="text-[var(--text)] font-semibold">
                                        {channel.currentSubscribers} subs
                                      </span>
                                    ) : (
                                      <span className="text-[var(--text-muted)]">Stats unverified</span>
                                    )}
                                  </span>

                                  {period && (
                                    <span className="text-[var(--text-muted)] flex items-center gap-1 tabular-nums">
                                      <History className="w-3 h-3" aria-hidden="true" />
                                      {period}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="pt-2.5 mt-3 border-t border-[var(--border)] flex justify-end">
                                <a
                                  href={channel.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] font-mono text-[var(--text)] hover:text-[var(--accent)] font-semibold flex items-center gap-1 transition-colors"
                                >
                                  <span>Visit Channel</span>
                                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* YouTube Channel Analytics Snapshots */}
                      <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                        <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                          <span className="tracking-wider font-bold uppercase text-[var(--accent)]">
                            YouTube Studio Snapshots
                          </span>
                          <span className="text-[11px] text-[var(--text-muted)]">
                            Obsidian Optics · Snapshot as of 21 Oct 2026
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

                {/* Core Competencies */}
                <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                  <span className="text-xs font-mono tracking-wider block text-[var(--text-muted)] uppercase">
                    Core Competency Deployed
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(activeTab === "Content Creation"
                      ? ["Video Editing", "Content Strategy", "Visual Psychology", "Audience Retention"]
                      : currentExperience.skills || []
                    ).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-xs px-2.5 py-1 rounded-[4px] font-mono border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Links */}
                {activeTab === "Freelancing" && (
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-t border-[var(--border)] text-[var(--text-muted)]">
                    <span>Fiverr Track · 5.0 Client Rating (25+ orders delivered)</span>
                    <a
                      href={SOCIAL_LINKS.fiverr}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors flex items-center gap-1.5 font-semibold text-[var(--text)] hover:text-[var(--accent)]"
                    >
                      <span>View Fiverr Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                )}

                {activeTab === "Content Creation" && (
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-t border-[var(--border)] text-[var(--text-muted)]">
                    <span>Educational Hub · Technical Learning &amp; AI Media</span>
                    <button
                      type="button"
                      onClick={handleShowcaseClick}
                      className="btn btn-secondary !min-h-[44px] !py-1.5 !px-3.5 !text-xs"
                      aria-label="View YouTube video showcase"
                    >
                      <span>View Video Showcase</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}

                {activeTab === "Open Source" && (
                  <div className="p-4 rounded-[8px] flex items-start gap-3 border border-[var(--border)] bg-[var(--surface)]">
                    <GitBranch className="w-5 h-5 shrink-0 mt-0.5 text-[var(--accent)]" aria-hidden="true" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold font-display text-[var(--text)]">
                        Hacktoberfest Preparation Roadmap
                      </h4>
                      <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                        Setting weekly goals to identify open-source repositories matching PyTorch CV pipelines and React utility libraries for certified contributions.
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
    </section>
  );
}

const ExperienceSection = memo(ExperienceSectionComponent);
export default ExperienceSection;
