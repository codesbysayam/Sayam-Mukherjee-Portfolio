import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  X, 
  Printer, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Sparkles, 
  Code, 
  Copy, 
  Check, 
  Globe, 
  Github, 
  Linkedin,
  Search,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RESUME_URL, RESUME_CONFIG } from "../config/resume";
import { RESUME_DATA } from "../data/resumeData";
import { ResumeGlyph } from "./ResumeGlyph";
import { ResumeSectionNav } from "./ResumeSectionNav";
import { ResumeProjectCard } from "./ResumeProjectCard";
import { ResumeSourceFooter } from "./ResumeSourceFooter";
import ReadingProgressBar from "./common/ReadingProgressBar";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const webBodyRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press and lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    } catch {
      // Safe fallback for iframe restrictions
    }
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  // Filter resume projects based on in-viewer search
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return RESUME_DATA.projects;
    const q = searchQuery.toLowerCase();
    return RESUME_DATA.projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q)) ||
        p.role.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filter skills based on in-viewer search
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) return RESUME_DATA.skills;
    const q = searchQuery.toLowerCase();
    return {
      programmingLanguages: RESUME_DATA.skills.programmingLanguages.filter((s) => s.toLowerCase().includes(q)),
      webTechnologies: RESUME_DATA.skills.webTechnologies.filter((s) => s.toLowerCase().includes(q)),
      databases: RESUME_DATA.skills.databases.filter((s) => s.toLowerCase().includes(q)),
      aiAndMachineLearning: RESUME_DATA.skills.aiAndMachineLearning.filter((s) => s.toLowerCase().includes(q)),
      developerTools: RESUME_DATA.skills.developerTools.filter((s) => s.toLowerCase().includes(q)),
      csFundamentals: RESUME_DATA.skills.csFundamentals.filter((s) => s.toLowerCase().includes(q)),
      softSkills: RESUME_DATA.skills.softSkills.filter((s) => s.toLowerCase().includes(q)),
    };
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] px-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      onClick={onClose}
    >
      
      {/* ==============================================================
          1. PRINTABLE LAYOUT - Clean A4 Document Format (Hidden on Screen)
          ============================================================== */}
      <div id="resume-print-root" className="hidden print:block bg-white text-black p-8 font-sans w-[210mm] min-h-[297mm] mx-auto text-[11px] leading-relaxed">
        <header className="border-b-2 border-zinc-900 pb-3 mb-4 text-center">
          <h1 className="text-2xl font-black uppercase tracking-wider text-zinc-900">{RESUME_DATA.name}</h1>
          <p className="text-xs font-semibold text-zinc-700 mt-0.5">{RESUME_DATA.headline}</p>
          <div className="flex flex-wrap justify-center gap-3 text-[10px] text-zinc-600 mt-1.5 font-mono">
            <span>{RESUME_DATA.contact.location}</span>
            <span>•</span>
            <span>{RESUME_DATA.contact.email}</span>
            <span>•</span>
            <span>{RESUME_DATA.contact.phone}</span>
            <span>•</span>
            <span>{RESUME_DATA.contact.linkedin.display}</span>
            <span>•</span>
            <span>{RESUME_DATA.contact.github.display}</span>
            <span>•</span>
            <span>{RESUME_DATA.contact.portfolio.display}</span>
          </div>
        </header>

        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">PROFESSIONAL SUMMARY</h2>
          <p className="text-[11px] text-zinc-800 text-justify leading-relaxed">{RESUME_DATA.summary}</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">EDUCATION</h2>
          <div className="space-y-2">
            {RESUME_DATA.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start text-[11px]">
                <div>
                  <span className="font-bold text-zinc-900">{edu.degree}</span>
                  <p className="text-zinc-700">{edu.institution} | {edu.metricLabel}: {edu.metricValue}</p>
                </div>
                <span className="font-mono text-zinc-600 shrink-0 ml-2">{edu.period}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">RELEVANT EXPERIENCE</h2>
          {RESUME_DATA.experience.map((exp, idx) => (
            <div key={idx} className="text-[11px]">
              <div className="flex justify-between items-center font-bold text-zinc-900">
                <span>{exp.role}</span>
                <span className="font-mono text-zinc-600">{exp.period}</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-800 mt-1 pl-1">
                {exp.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">PROJECTS</h2>
          <div className="space-y-2 text-[11px]">
            {RESUME_DATA.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-center font-bold text-zinc-900">
                  <span>{proj.title}</span>
                  <span className="font-mono text-zinc-600 text-[10px]">{proj.period}</span>
                </div>
                <p className="text-zinc-700 text-[10px] italic">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">SKILLS</h2>
          <div className="text-[10px] space-y-1 text-zinc-800">
            <p><strong>Programming Languages:</strong> {RESUME_DATA.skills.programmingLanguages.join(", ")}</p>
            <p><strong>Web Technologies:</strong> {RESUME_DATA.skills.webTechnologies.join(", ")}</p>
            <p><strong>Databases:</strong> {RESUME_DATA.skills.databases.join(", ")}</p>
            <p><strong>AI &amp; Machine Learning:</strong> {RESUME_DATA.skills.aiAndMachineLearning.join(", ")}</p>
            <p><strong>Developer Tools:</strong> {RESUME_DATA.skills.developerTools.join(", ")}</p>
            <p><strong>CS Fundamentals:</strong> {RESUME_DATA.skills.csFundamentals.join(", ")}</p>
            <p><strong>Soft Skills:</strong> {RESUME_DATA.skills.softSkills.join(", ")}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">CERTIFICATIONS AND ACHIEVEMENTS</h2>
          <ul className="list-disc list-inside text-[10px] text-zinc-800 space-y-0.5 pl-1">
            {RESUME_DATA.certificationsAndAchievements.map((cert) => (
              <li key={cert.id}>
                <strong>{cert.title}:</strong> {cert.description} ({cert.date})
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ==============================================================
          2. INTERACTIVE REDESIGNED MODAL VIEWER
          ============================================================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[var(--bg)] border border-[var(--border-strong)] rounded-[12px] w-full max-w-4xl shadow-2xl flex flex-col h-[92dvh] sm:h-[90dvh] max-h-[920px] overflow-hidden text-[var(--text)]"
      >
        
        {/* REFINED TOP HEADER */}
        <header className="px-4 sm:px-6 py-3.5 bg-[var(--surface-2)] border-b border-[var(--border)] flex flex-wrap items-center justify-between z-30 shrink-0 gap-2 sm:gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0">
              <ResumeGlyph className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--accent)] font-semibold block leading-none mb-1">
                Résumé / Profile
              </span>
              <h2 id="resume-modal-title" className="text-sm sm:text-base font-bold text-[var(--text)] font-display tracking-tight truncate flex items-center gap-2">
                <span>{RESUME_DATA.name}</span>
                <span className="hidden md:inline-block text-xs font-mono font-normal text-[var(--text-muted)]">
                  · AI &amp; ML Engineer
                </span>
              </h2>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex items-center gap-2 shrink-0">
            {RESUME_CONFIG.isPdfAvailable ? (
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={RESUME_CONFIG.ariaLabel}
                className="btn btn-primary min-h-[40px] px-3 sm:px-4 py-2 text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>{RESUME_CONFIG.label} <span className="hidden sm:inline">(PDF)</span></span>
              </a>
            ) : (
              <button
                onClick={handlePrint}
                type="button"
                aria-label="Save or print resume as A4 PDF"
                className="btn btn-primary min-h-[40px] px-3 sm:px-4 py-2 text-xs"
                title="Save or print resume as A4 PDF"
              >
                <Printer className="w-3.5 h-3.5 shrink-0" />
                <span>Print / Save PDF</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              type="button"
              aria-label="Print resume document"
              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center bg-[var(--surface)] hover:bg-[var(--surface-3)] border border-[var(--border)] rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer transition-colors"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              type="button"
              aria-label="Close resume modal (or press Esc)"
              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center bg-[var(--surface)] hover:bg-[var(--surface-3)] border border-[var(--border)] rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* READING PROGRESS BAR */}
        <ReadingProgressBar containerRef={webBodyRef} height={2} className="shrink-0 z-30" />

        {/* VERIFIED HIGHLIGHTS SUMMARY STRIP */}
        <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 sm:px-6 py-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-5 text-xs font-mono min-w-max tabular-nums">
            {RESUME_DATA.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[var(--text-muted)]">
                <span>{h.label}:</span>
                <span className="text-[var(--text)] font-semibold">{h.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* INTERACTIVE SECTION NAVIGATION & FAST IN-VIEWER SEARCH */}
        <ResumeSectionNav 
          scrollContainerRef={webBodyRef}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* SCROLLABLE RESUME CONTENT BODY */}
        <div 
          ref={webBodyRef} 
          tabIndex={0}
          aria-label="Resume document content"
          className="relative flex-1 overflow-y-auto p-4 sm:p-7 md:p-8 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] space-y-9 custom-scrollbar focus:outline-none bg-[var(--bg)]"
        >
          
          {/* ==============================================================
              SECTION 1: OVERVIEW & PROFILE CARD
              ============================================================== */}
          <section id="resume-overview" className="scroll-mt-6">
            <div className="card p-5 sm:p-6 flex flex-col md:flex-row items-center gap-5 sm:gap-6">
              
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-[var(--border-strong)] bg-[var(--surface)] flex items-center justify-center shrink-0">
                <img 
                  src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg" 
                  alt="Sayam Mukherjee portrait" 
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="text-center md:text-left space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight font-display">
                    {RESUME_DATA.name}
                  </h1>
                  <span className="text-[11px] font-mono font-semibold text-[var(--accent)]">
                    / Verified Profile
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] font-mono text-xs sm:text-sm tracking-wide font-semibold">
                  {RESUME_DATA.headline}
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2.5 sm:gap-4 text-xs text-[var(--text-muted)] pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                    <span>{RESUME_DATA.contact.location}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(RESUME_DATA.contact.email, "email")}
                    className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors cursor-pointer group/btn max-w-full min-w-0"
                    title="Click to copy email address"
                  >
                    <Mail className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                    <span className="font-mono text-[var(--text-secondary)] break-all text-left">{RESUME_DATA.contact.email}</span>
                    {copiedField === "email" ? (
                      <Check className="w-3 h-3 text-[var(--success)]" />
                    ) : (
                      <Copy className="w-3 h-3 text-[var(--text-faint)] group-hover/btn:text-[var(--text)]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(RESUME_DATA.contact.phone, "phone")}
                    className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors cursor-pointer group/btn"
                    title="Click to copy phone number"
                  >
                    <Phone className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                    <span className="font-mono text-[var(--text-secondary)] tabular-nums">{RESUME_DATA.contact.phone}</span>
                    {copiedField === "phone" ? (
                      <Check className="w-3 h-3 text-[var(--success)]" />
                    ) : (
                      <Copy className="w-3 h-3 text-[var(--text-faint)] group-hover/btn:text-[var(--text)]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-2 text-xs font-mono font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Executive Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {RESUME_DATA.summary}
              </p>
            </div>
          </section>

          {/* ==============================================================
              SECTION 2: EDUCATION (Academic Timeline)
              ============================================================== */}
          <section id="resume-education" className="scroll-mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <h3 className="text-base font-bold text-[var(--text)] font-display tracking-tight">
                  Academic Record
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
                3 Educational Milestones
              </span>
            </div>

            <div className="space-y-3">
              {RESUME_DATA.education.map((edu, index) => (
                <div 
                  key={index} 
                  className="card p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-[var(--text)]">
                        {edu.degree}
                      </h4>
                      <span className="text-[11px] font-mono text-[var(--accent)]">
                        · {edu.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">{edu.institution}</p>
                  </div>

                  <div className="text-left sm:text-right shrink-0 tabular-nums">
                    <span className="text-xs font-mono text-[var(--text-muted)] block">{edu.period}</span>
                    <span className="inline-block mt-1 px-2.5 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-[6px] text-xs font-bold text-[var(--text)] font-mono">
                      {edu.metricLabel}: <span className="text-[var(--accent)]">{edu.metricValue}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ==============================================================
              SECTION 3: RELEVANT EXPERIENCE
              ============================================================== */}
          <section id="resume-experience" className="scroll-mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <h3 className="text-base font-bold text-[var(--text)] font-display tracking-tight">
                  Relevant Experience
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Software Engineering &amp; Hackathons
              </span>
            </div>

            {RESUME_DATA.experience.map((exp, idx) => (
              <div key={idx} className="card p-5 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[var(--text)]">
                      {exp.role}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                      {exp.organization}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[var(--surface)] text-xs font-mono font-semibold text-[var(--text)] border border-[var(--border)] rounded-[6px] shrink-0 w-fit tabular-nums">
                    {exp.period}
                  </span>
                </div>

                <ul className="space-y-2 list-disc pl-5 text-xs sm:text-sm text-[var(--text-secondary)]">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">{bullet}</li>
                  ))}
                </ul>

                <div className="text-xs font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
                  {exp.technologies.join(" · ")}
                </div>
              </div>
            ))}
          </section>

          {/* ==============================================================
              SECTION 4: KEY RESUME PROJECTS
              ============================================================== */}
          <section id="resume-projects" className="scroll-mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <h3 className="text-base font-bold text-[var(--text)] font-display tracking-tight">
                  Key Projects
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
                {filteredProjects.length} Verified Platforms
              </span>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted)] text-xs font-mono bg-[var(--surface)] rounded-[10px] border border-[var(--border)]">
                No projects matched &ldquo;{searchQuery}&rdquo;. Try searching for React, AI, or Vision.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((project) => (
                  <ResumeProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </section>

          {/* ==============================================================
              SECTION 5: CERTIFICATIONS & ACHIEVEMENTS
              ============================================================== */}
          <section id="resume-achievements" className="scroll-mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <h3 className="text-base font-bold text-[var(--text)] font-display tracking-tight">
                  Honors &amp; Certifications
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                National Competitions &amp; Hackathons
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {RESUME_DATA.certificationsAndAchievements.map((cert) => (
                <div 
                  key={cert.id} 
                  className="card p-4 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono tabular-nums">
                      <span className="font-semibold text-[var(--accent)] uppercase tracking-wider">
                        {cert.badge}
                      </span>
                      <span className="text-[var(--text-muted)] font-semibold">{cert.date}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-[var(--text)]">
                      {cert.title}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono">{cert.issuer}</p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-1">{cert.description}</p>
                  </div>

                  {cert.credentialUrl && (
                    <div className="pt-2 border-t border-[var(--border)]">
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[var(--accent)] hover:underline underline-offset-4 transition-colors"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ==============================================================
              SECTION 6: TECHNICAL & SOFT SKILLS
              ============================================================== */}
          <section id="resume-skills" className="scroll-mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <h3 className="text-base font-bold text-[var(--text)] font-display tracking-tight">
                  Categorized Skills
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Verified Technical Taxonomy
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Programming Languages", items: filteredSkills.programmingLanguages },
                { title: "Web Technologies", items: filteredSkills.webTechnologies },
                { title: "AI & Machine Learning", items: filteredSkills.aiAndMachineLearning },
                { title: "Tools & Databases", items: [...filteredSkills.databases, ...filteredSkills.developerTools] },
                { title: "CS Fundamentals", items: filteredSkills.csFundamentals },
                { title: "Soft Skills", items: filteredSkills.softSkills },
              ].map((group) => (
                <div key={group.title} className="card p-4 space-y-2.5">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-[0.12em] text-[var(--accent)] border-b border-[var(--border)] pb-1.5">
                    {group.title}
                  </h4>
                  <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
                    {group.items.length > 0 ? group.items.join(" · ") : "No matching entries."}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ==============================================================
              SECTION 7: PROFESSIONAL PROFILES & HOBBIES
              ============================================================== */}
          <section id="resume-profiles" className="scroll-mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <h3 className="text-base font-bold text-[var(--text)] font-display tracking-tight">
                  Profiles &amp; Personal Interests
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Direct External Connections
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={RESUME_DATA.contact.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-4 flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Linkedin className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[var(--text)] block">LinkedIn</span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)] truncate block">
                      {RESUME_DATA.contact.linkedin.display}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-[var(--text)] shrink-0 ml-2" />
              </a>

              <a
                href={RESUME_DATA.contact.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-4 flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Github className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[var(--text)] block">GitHub</span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)] truncate block">
                      {RESUME_DATA.contact.github.display}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-[var(--text)] shrink-0 ml-2" />
              </a>

              <a
                href={RESUME_DATA.contact.portfolio.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-4 flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Globe className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[var(--text)] block">Website</span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)] truncate block">
                      {RESUME_DATA.contact.portfolio.display}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-[var(--text)] shrink-0 ml-2" />
              </a>
            </div>

            <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[10px] text-xs font-mono text-[var(--text-secondary)]">
              <span className="text-[var(--text-muted)] mr-2">Hobbies &amp; Interests:</span>
              <span>{RESUME_DATA.hobbies.join(" · ")}</span>
            </div>
          </section>

          {/* ==============================================================
              SECTION 8: ACCESSIBLE NON-OBTRUSIVE PROVENANCE FOOTER
              ============================================================== */}
          <ResumeSourceFooter lastVerified={RESUME_DATA.lastVerified} />

        </div>
      </motion.div>
    </div>
  );
}
