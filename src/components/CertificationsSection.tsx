import React from "react";
import { EXTENDED_DATA } from "../data/extendedData";
import {
  Award, GraduationCap, Trophy, Target, Sparkles, Zap,
  ArrowRight
} from "lucide-react";
import { EditorialReveal, LineReveal, StaggerGroup, StaggerItem } from "../motion/Reveal";

interface CertificationsSectionProps {
  onNavigateToCertificates?: () => void;
}

export default function CertificationsSection({ onNavigateToCertificates }: CertificationsSectionProps) {
  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "Award":
        return <Award className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />;
      case "Code":
        return <Trophy className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />;
      case "Flame":
        return <Zap className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />;
      case "GraduationCap":
        return <GraduationCap className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />;
      case "TrendingUp":
        return <Target className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />;
      default:
        return <Sparkles className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />;
    }
  };

  const handleNavigate = () => {
    if (onNavigateToCertificates) {
      onNavigateToCertificates();
    } else {
      window.dispatchEvent(new CustomEvent("portfolio-navigate-tab", { detail: "certificates" }));
    }
  };

  return (
    <section id="about-achievements" className="font-sans">
      <div className="space-y-10" id="certifications-achievements">
      {/* Header with Callout to Dedicated Vault */}
      <EditorialReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div className="space-y-2">
            <span className="text-xs text-[var(--accent)] font-mono uppercase tracking-wider block font-semibold">
              Honors &amp; Milestones
            </span>
            <h2
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.25rem)" }}
              className="font-extrabold tracking-tight text-[var(--text)] font-display leading-[1.06]"
            >
              Achievements &amp; Honours
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
              Verified competitive records, hackathon finalist positions, and athletic achievements.
            </p>
          </div>

          <button
            type="button"
            onClick={handleNavigate}
            className="btn btn-primary !text-xs font-mono shrink-0 group"
          >
            <Award className="w-4 h-4" aria-hidden="true" />
            <span>View All Certificates</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </div>
        <LineReveal />
      </EditorialReveal>

      {/* Achievements Timeline and Academic Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left timeline layout */}
        <StaggerGroup className="lg:col-span-8 space-y-6 relative">
          <div className="absolute left-3.5 top-4 bottom-4 w-px bg-[var(--border-strong)]" />

          {EXTENDED_DATA.achievements.map((ach) => (
            <StaggerItem key={ach.id} className="relative pl-11 group">
              <div className="absolute left-0 top-3 w-7 h-7 rounded-full bg-[var(--surface-2)] border border-[var(--border-strong)] flex items-center justify-center group-hover:border-[var(--accent)] transition-colors z-10">
                {getAchievementIcon(ach.iconName)}
              </div>

              <div className="card p-5 sm:p-6 space-y-3 transition-colors hover:border-[var(--border-strong)]">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="text-xs text-[var(--accent)] font-mono tracking-wider block font-semibold">
                      {ach.category}
                    </span>
                    <h3 className="text-base font-bold text-[var(--text)] font-display tracking-tight mt-0.5">
                      {ach.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
                    {ach.date}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {ach.description}
                </p>

                <div className="flex items-center gap-1.5 pt-2 border-t border-[var(--border)] text-xs text-[var(--text-muted)] font-mono">
                  <span>Organized by</span>
                  <span className="text-[var(--text)] font-semibold">{ach.organization}</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Right details column */}
        <div className="lg:col-span-4 space-y-5">
          <div className="card p-6 space-y-4">
            <GraduationCap className="w-7 h-7 text-[var(--accent)]" aria-hidden="true" />
            <h3 className="text-base font-bold text-[var(--text)] font-display tracking-tight">
              Academic Profile Summary
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Pursuing B.Tech in Computer Science &amp; Engineering (AI &amp; ML) at Kalinga Institute of Industrial Technology, Bhubaneswar, with focus on algorithmic foundations and system design.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-[var(--surface)] p-3 rounded-[8px] border border-[var(--border)] text-center min-w-0">
                <span className="text-[10px] text-[var(--text-muted)] block uppercase font-mono">First-Year</span>
                <span className="text-xs font-bold text-[var(--text)] block mt-1 font-display tabular-nums">9.06 CGPA</span>
              </div>
              <div className="bg-[var(--surface)] p-3 rounded-[8px] border border-[var(--border)] text-center min-w-0">
                <span className="text-[10px] text-[var(--text-muted)] block uppercase font-mono">Institution</span>
                <span className="text-xs font-bold text-[var(--accent)] block mt-1 font-display">KIIT, Bhubaneswar</span>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <Trophy className="w-7 h-7 text-[var(--accent)]" aria-hidden="true" />
            <h3 className="text-base font-bold text-[var(--text)] font-display tracking-tight">
              Sports &amp; Reflex Skills
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              High-speed rally discipline translates directly into focus and agility. District representative and regional Table Tennis champion.
            </p>
            <div className="flex items-center justify-between bg-[var(--surface)] p-3 rounded-[8px] border border-[var(--border)]">
              <span className="text-xs font-mono text-[var(--text)] font-semibold">
                3× First Position Champion
              </span>
              <span className="text-[11px] font-mono text-[var(--accent)] font-semibold">Verified</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNavigate}
            className="w-full text-left p-6 rounded-[12px] bg-[#20231D] text-[#F4F4ED] border border-[#41443A] hover:border-[#C7E34A] transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <Award className="w-6 h-6 text-[#C7E34A]" aria-hidden="true" />
              <ArrowRight className="w-4 h-4 text-[#C7E34A] group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
            <h4 className="text-sm font-bold text-[#F4F4ED] font-display">
              Explore the Credential Vault
            </h4>
            <p className="text-xs text-[#EAEAE1]/80 leading-relaxed">
              Browse verified certifications, filter by discipline or year, and inspect credentials inside the lightbox viewer.
            </p>
          </button>
        </div>
      </div>
      </div>
    </section>
  );
}
