import { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EXTENDED_DATA } from "../data/extendedData";
import { SOCIAL_LINKS } from "../data/siteContent";
import { EditorialSectionHeader } from "./common/EditorialSectionHeader";
import {
  Briefcase, Youtube, Users, GitBranch,
  ExternalLink, ArrowUpRight, ArrowRight
} from "lucide-react";
import { LineReveal, StaggerGroup, StaggerItem } from "../motion/Reveal";
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
    { id: "Volunteer", label: "Volunteer Work", icon: Users },
    { id: "Open Source", label: "Open Source", icon: GitBranch }
  ] as const;

  const currentExperience = EXTENDED_DATA.experience.find((exp) => exp.type === activeTab);

  const handleShowcaseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToShowcase) {
      onNavigateToShowcase();
    } else {
      window.dispatchEvent(new CustomEvent("portfolio-navigate-tab", { detail: "showcase" }));
    }
  };

  return (
    <section id="about-experience" className="space-y-8 font-sans">
      <div id="professional-experience" className="space-y-6">
        <EditorialSectionHeader
          eyebrow="Experience"
          title="Hands-on work &"
          italicHighlight="collaboration."
          description="Practical experience across freelance design delivery, technical communication, community initiatives, and open-source collaboration."
        />
        <LineReveal />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Interactive Track Selector */}
          <div className="lg:col-span-4 card p-3 flex flex-col gap-1.5" role="tablist" aria-label="Experience tracks">
            <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 block text-[var(--text-muted)]">
              Tracks
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
                  className={`relative w-full flex items-center justify-between p-3.5 rounded-[8px] border text-left transition-colors duration-200 cursor-pointer group ${
                    isSelected
                      ? "border-[#20231D] dark:border-[#C7E34A] text-[#F4F4ED] dark:text-[#20231D]"
                      : "bg-transparent border-transparent text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="experience-active-pill"
                      transition={{ duration: reduced ? 0 : 0.24, ease: MOTION_EASE.out }}
                      className="absolute inset-0 rounded-[7px] bg-[#20231D] dark:bg-[#C7E34A]"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
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
                  <ArrowUpRight className="relative z-10 w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
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
                  className="card p-6 md:p-8 space-y-6 lg:min-h-[320px] flex flex-col justify-between"
                >
                  <div className="space-y-5">
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

                    <StaggerGroup immediate stagger={0.04} className="space-y-3.5">
                      {activeTab === "Content Creation" ? (
                        <>
                          <StaggerItem className="text-xs sm:text-sm flex items-start gap-3 leading-relaxed text-[var(--text-secondary)]">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2 bg-[var(--accent)]" aria-hidden="true" />
                            <span>
                              Produced technical tutorials, algorithmic breakdowns, and visual explainer series across educational YouTube channels (Technical AZ, Daily Decipher, and Obsidian Optics).
                            </span>
                          </StaggerItem>
                          <StaggerItem className="text-xs sm:text-sm flex items-start gap-3 leading-relaxed text-[var(--text-secondary)]">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2 bg-[var(--accent)]" aria-hidden="true" />
                            <span>
                              Practiced visual storytelling, clear pacing, and audience-centered framing—lessons that carry directly into software interface design.
                            </span>
                          </StaggerItem>
                        </>
                      ) : (
                        currentExperience.description.map((bullet, idx) => (
                          <StaggerItem key={idx} className="text-xs sm:text-sm flex items-start gap-3 leading-relaxed text-[var(--text-secondary)]">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2 bg-[var(--accent)]" aria-hidden="true" />
                            <span>{bullet}</span>
                          </StaggerItem>
                        ))
                      )}
                    </StaggerGroup>
                  </div>

                  {/* Subtle inline capabilities */}
                  <div className="space-y-2 pt-4 border-t border-[var(--border)]">
                    <span className="text-[11px] font-mono tracking-wider block text-[var(--text-muted)] uppercase">
                      Focus Areas
                    </span>
                    <p className="text-xs font-mono text-[var(--text-secondary)]">
                      {(activeTab === "Content Creation"
                        ? ["Video Editing", "Technical Storytelling", "Visual Hierarchy", "Audience Clarity"]
                        : currentExperience.skills || []
                      ).join(" · ")}
                    </p>
                  </div>

                  {activeTab === "Freelancing" && (
                    <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-t border-[var(--border)] text-[var(--text-muted)]">
                      <span>Fiverr Profile · Client Design Delivery</span>
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
                      <span>Channels &amp; video archive live on Video Showcase</span>
                      <button
                        type="button"
                        onClick={handleShowcaseClick}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent)] hover:underline cursor-pointer"
                        aria-label="View YouTube video showcase"
                      >
                        <span>View Video Showcase</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
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
