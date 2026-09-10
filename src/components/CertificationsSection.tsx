import React from "react";
import { EXTENDED_DATA } from "../data/extendedData";
import { 
  Award, GraduationCap, Trophy, Target, Sparkles, Zap,
  ArrowRight, CheckCircle2, ShieldCheck, ExternalLink
} from "lucide-react";

interface CertificationsSectionProps {
  onNavigateToCertificates?: () => void;
}

export default function CertificationsSection({ onNavigateToCertificates }: CertificationsSectionProps) {
  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award': return <Award className="w-4 h-4 text-purple-400" />;
      case 'Code': return <Trophy className="w-4 h-4 text-cyan-400" />;
      case 'Flame': return <Zap className="w-4 h-4 text-amber-500 animate-pulse" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      case 'TrendingUp': return <Target className="w-4 h-4 text-pink-400" />;
      default: return <Sparkles className="w-4 h-4 text-purple-400" />;
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
    <div className="space-y-10 font-sans" id="certifications-achievements">
      {/* Header with Callout to Dedicated Vault */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-850/80 pb-6">
        <div className="space-y-2">
          <span className="text-xs text-purple-400 font-mono uppercase tracking-widest block font-bold">
            HONORS &amp; MILESTONES
          </span>
          <h2 
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
            className="font-bold tracking-tight text-white font-display"
          >
            Achievements &amp; Honours
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
            Verified competitive records, hackathon finalist positions, and athletic achievements.
          </p>
        </div>

        {/* Dedicated Vault Gateway Button */}
        <button
          onClick={handleNavigate}
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 hover:border-purple-500/60 text-xs font-mono font-semibold transition-all shrink-0 cursor-pointer shadow-lg shadow-purple-950/40 group"
        >
          <Award className="w-4 h-4 text-purple-400" />
          <span>OPEN CERTIFICATE VAULT</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Achievements Timeline and Academic Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left timeline layout */}
        <div className="lg:col-span-8 space-y-8 relative">
          <div className="absolute left-6 top-4 bottom-4 w-[1px] bg-zinc-900" />

          {EXTENDED_DATA.achievements.map((ach) => (
            <div key={ach.id} className="relative pl-14 group">
              {/* Timeline node icon container */}
              <div className="absolute left-3 top-1 w-7 h-7 rounded-full bg-zinc-950 border border-zinc-850 flex items-center justify-center group-hover:border-purple-500/40 transition-colors z-10 shadow-md">
                {getAchievementIcon(ach.iconName)}
              </div>

              <div className="glass-card rounded-2xl p-6 border border-zinc-850/60 hover:border-purple-500/20 transition-all duration-300 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-purple-400 font-mono uppercase tracking-widest block font-bold">
                      {ach.category}
                    </span>
                    <h4 className="text-base font-bold text-white font-display tracking-tight mt-1">
                      {ach.title}
                    </h4>
                  </div>
                  <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-850 text-zinc-400 px-2 py-0.5 rounded-md">
                    {ach.date}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {ach.description}
                </p>

                <div className="flex items-center gap-1.5 pt-2 text-[10px] text-zinc-500 font-mono">
                  <span>Organized by:</span>
                  <span className="text-zinc-300 font-bold">{ach.organization}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right details stats box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <GraduationCap className="w-8 h-8 text-cyan-400" />
            <h4 className="text-base font-bold text-white font-display tracking-tight">Academic Profile Summary</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pursuing B.Tech in Computer Science &amp; Engineering (AI &amp; ML) at Kalinga Institute of Industrial Technology, Bhubaneswar, with a dedicated focus on algorithmic foundations and system design.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850/60 text-center">
                <span className="text-[9px] text-zinc-500 block uppercase font-mono">CURRENT STATUS</span>
                <span className="text-xs font-bold text-white block mt-1 font-display">2nd Year, 3rd Sem</span>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850/60 text-center">
                <span className="text-[9px] text-zinc-500 block uppercase font-mono">INSTITUTION</span>
                <span className="text-xs font-bold text-cyan-400 block mt-1 font-display">KIIT, Bhubaneswar</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4">
            <Trophy className="w-8 h-8 text-pink-400" />
            <h4 className="text-base font-bold text-white font-display tracking-tight">Sports &amp; Reflex Skills</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              High-speed dynamic processing translates into gaming and athletics. Securing multiple first positions in regional Table Tennis tournaments.
            </p>
            <div className="flex items-center gap-2.5 bg-zinc-900/40 p-3 rounded-xl border border-zinc-850">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-zinc-300 font-bold">3× First Position Champion</span>
            </div>
          </div>

          {/* Quick link card to Credential Vault */}
          <div 
            onClick={handleNavigate}
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/30 to-zinc-950 border border-purple-900/30 hover:border-purple-600/50 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <Award className="w-6 h-6 text-purple-400" />
              <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-sm font-bold text-white font-display">Explore the Credential Vault</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Browse industry-verified technical certifications, filter by skill or year, and inspect credentials with the integrated viewer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
