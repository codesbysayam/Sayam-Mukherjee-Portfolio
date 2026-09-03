import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EXTENDED_DATA, CertificationItem, AchievementItem } from "../data/extendedData";
import { 
  Award, GraduationCap, Calendar, ShieldCheck, CheckCircle2, 
  ExternalLink, Download, FileCheck, Trophy, Target, Sparkles, RefreshCw, Zap,
  Brain, Cloud
} from "lucide-react";

export default function CertificationsSection() {
  const [selectedSubSection, setSelectedSubSection] = useState<'certs' | 'achievements'>('certs');
  const [expandedCert, setExpandedCert] = useState<string | null>(null);

  // Certifications list
  const activeCerts = EXTENDED_DATA.certifications.filter(c => c.status === 'Active');
  const futureCerts = EXTENDED_DATA.certifications.filter(c => c.status === 'Future');

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award': return <Award className="w-5 h-5 text-purple-400" />;
      case 'Code': return <Trophy className="w-5 h-5 text-cyan-400" />;
      case 'Flame': return <Zap className="w-5 h-5 text-amber-500 animate-pulse" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-emerald-400" />;
      case 'TrendingUp': return <Target className="w-5 h-5 text-pink-400" />;
      default: return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const getCertIcon = (logo: string) => {
    switch (logo) {
      case 'Brain': return <Brain className="w-5.5 h-5.5 text-purple-400" />;
      case 'Cloud': return <Cloud className="w-5.5 h-5.5 text-cyan-400" />;
      default: return <Award className="w-5.5 h-5.5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-10 font-sans" id="certifications-achievements">
      {/* Segmented Controller Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs text-cyan-400 font-mono uppercase tracking-widest block font-bold">
            HONORS & CERTIFICATES
          </span>
          <h2 
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
            className="font-bold tracking-tight text-white font-display"
          >
            Credentials & Achievements
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
            Industry-certified engineering credentials validating theoretical depth paired with tangible competitive milestones.
          </p>
        </div>

        {/* Toggle between Certifications and Achievements */}
        <div className="flex glass-card p-1 shrink-0 self-start md:self-end">
          <button
            onClick={() => setSelectedSubSection('certs')}
            className={`text-xs px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              selectedSubSection === 'certs'
                ? "bg-zinc-900 text-white shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Certifications ({EXTENDED_DATA.certifications.length})
          </button>
          <button
            onClick={() => setSelectedSubSection('achievements')}
            className={`text-xs px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              selectedSubSection === 'achievements'
                ? "bg-zinc-900 text-white shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Achievements Timeline ({EXTENDED_DATA.achievements.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedSubSection === 'certs' ? (
          <motion.div
            key="certs"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="space-y-10"
          >
            {/* Active Credentials Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">
                VALIDATED LICENSES & CERTIFICATIONS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCerts.map((cert) => {
                  const isExpanded = expandedCert === cert.id;
                  return (
                    <div
                      key={cert.id}
                      className="glass-card rounded-2xl border border-zinc-850/60 p-6 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between group h-full relative"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                            {getCertIcon(cert.logo)}
                          </div>
                          <span className="text-[9px] font-mono text-cyan-400 font-bold tracking-wider bg-cyan-950/20 px-2.5 py-1 rounded-full border border-cyan-800/20">
                            ACTIVE
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors font-display tracking-tight">
                            {cert.name}
                          </h4>
                          <p className="text-[11px] text-zinc-400 font-mono">{cert.issuer}</p>
                        </div>
                      </div>

                      {/* Expandable Skills learned drawer */}
                      <div className="mt-4 pt-4 border-t border-zinc-900 space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-zinc-500">Issued {cert.date}</span>
                          <button
                            onClick={() => setExpandedCert(isExpanded ? null : cert.id)}
                            className="text-purple-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                          >
                            <span>{isExpanded ? "Hide Skills" : "Show Skills"}</span>
                            <RefreshCw className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {cert.skillsLearned.map((skill, idx) => (
                                  <span key={idx} className="text-[9px] bg-zinc-900/60 text-zinc-400 border border-zinc-850 px-2 py-0.5 rounded font-mono">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex gap-2.5 pt-2">
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`Opening verification registry for ${cert.name}...`);
                              }}
                              className="flex-1 text-center bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-[10px] font-mono font-bold py-2 rounded-lg border border-zinc-850 hover:border-zinc-700 transition-colors"
                            >
                              Verify Link
                            </a>
                          )}
                          <button
                            onClick={() => alert(`Initiating secure container download of ${cert.name} PDF...`)}
                            className="flex items-center justify-center p-2 bg-zinc-950 hover:bg-zinc-900 text-purple-400 hover:text-white rounded-lg border border-zinc-850 hover:border-purple-500/30 transition-all cursor-pointer"
                            title="Download Certificate"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Future/Target Certifications List */}
            <div className="space-y-4 pt-6 border-t border-zinc-900">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">
                FUTURE ENGINEERING GOALS (Q3/Q4 2026)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {futureCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="glass-card p-4 rounded-xl flex items-center justify-between hover:border-zinc-800 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                        {getCertIcon(cert.logo)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white font-display tracking-tight">{cert.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{cert.issuer}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest border border-zinc-800 px-2.5 py-1 rounded-full">
                      🎯 Targeted
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
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
                  Consistently ranking in the top tier of my Computer Science & Engineering department through continuous practice of algorithm design.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850/60 text-center">
                    <span className="text-[9px] text-zinc-500 block uppercase font-mono">CURRENT CGPA</span>
                    <span className="text-xl font-bold text-white block mt-0.5 font-display">9.06</span>
                  </div>
                  <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850/60 text-center">
                    <span className="text-[9px] text-zinc-500 block uppercase font-mono">CSE COHORT</span>
                    <span className="text-sm font-bold text-cyan-400 block mt-1.5 font-display">TOP 10%</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl space-y-4">
                <Trophy className="w-8 h-8 text-pink-400" />
                <h4 className="text-base font-bold text-white font-display tracking-tight">Sports & Reflex Skills</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  High-speed dynamic processing translates into gaming and athletics. Securing multiple first positions in regional Table Tennis tournaments.
                </p>
                <div className="flex items-center gap-2.5 bg-zinc-900/40 p-3 rounded-xl border border-zinc-850">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono text-zinc-300 font-bold">3× First Position Champion</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
