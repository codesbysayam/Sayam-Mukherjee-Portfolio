import { useState, useEffect, useRef } from "react";
import { 
  Mail, ArrowRight, Check, Copy, ExternalLink,
  Github, Linkedin, Award, Youtube, Sparkles,
  Share2
} from "lucide-react";
import { showToast } from "./Toast";

// Opportunities Sayam is actively open to
const OPEN_ROLES = [
  "Internships",
  "Freelance work",
  "Collaborations",
  "Research",
  "Hackathons"
];

// Verified Social & Professional Connections
const SOCIAL_PROFILES = [
  {
    name: "LINKEDIN",
    description: "Connect professionally",
    url: "https://www.linkedin.com/in/sayam-mukherjee-b96209324/",
    icon: Linkedin,
    bgClass: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    hoverBorder: "hover:border-cyan-500/40"
  },
  {
    name: "GITHUB",
    description: "Explore my code",
    url: "https://github.com/codesbysayam",
    icon: Github,
    bgClass: "bg-purple-500/10 border-purple-500/20 text-purple-300",
    hoverBorder: "hover:border-purple-500/40"
  },
  {
    name: "CODOLIO",
    description: "View coding profile",
    url: "https://codolio.com/profile/codesbysayam",
    icon: Award,
    bgClass: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    hoverBorder: "hover:border-amber-500/40"
  },
  {
    name: "YOUTUBE",
    description: "Explore my content",
    url: "https://www.youtube.com/@ObsidianOptics_in",
    icon: Youtube,
    bgClass: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    hoverBorder: "hover:border-rose-500/40"
  }
];

export default function ContactSection() {
  // Verified primary email & social links
  const primaryEmail = "wrickbusiness@gmail.com";
  const verifiedLinkedin = "https://www.linkedin.com/in/sayam-mukherjee-b96209324/";
  const verifiedGithub = "https://github.com/codesbysayam";
  const verifiedCodolio = "https://codolio.com/profile/codesbysayam";

  // Copy email feedback state
  const [copiedEmail, setCopiedEmail] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Native share support detection
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanShare(true);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  // Copy email handler with ~1.5s reset and mailto fallback
  const handleCopyEmail = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(primaryEmail);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = primaryEmail;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      
      setCopiedEmail(true);
      showToast(`Copied ${primaryEmail} to clipboard!`, "success");
      
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => {
        setCopiedEmail(false);
      }, 1500);
    } catch {
      // Graceful fallback to opening mail client if clipboard fails
      window.location.href = `mailto:${primaryEmail}`;
    }
  };

  // Direct quick conversation action
  const handleStartConversation = () => {
    window.location.href = `mailto:${primaryEmail}?subject=Portfolio%20Inquiry`;
  };

  // Optional Web Share action
  const handleSharePortfolio = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Sayam Mukherjee — Portfolio",
          text: "Explore Sayam Mukherjee's portfolio.",
          url: window.location.href
        });
      } catch {
        // User dismiss or abort is non-breaking
      }
    }
  };

  return (
    <section 
      id="contact" 
      className="contact-section relative w-full max-w-7xl mx-auto font-sans text-zinc-100"
    >
      {/* Component-scoped precise layout styles */}
      <style>{`
        .contact-section {
          padding: clamp(48px, 6vw, 80px) clamp(16px, 4vw, 48px) !important;
        }

        .contact-heading {
          font-size: clamp(3rem, 5.2vw, 5rem);
          line-height: 0.95;
          letter-spacing: -0.045em;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: minmax(280px, 0.85fr) minmax(380px, 1.15fr);
          gap: clamp(28px, 5vw, 64px);
          align-items: start;
        }

        @media (max-width: 900px) {
          .contact-heading {
            font-size: clamp(2.75rem, 8vw, 4rem);
            line-height: 0.98;
          }
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }

        /* Right-Side Connect Card */
        .connect-card {
          padding: clamp(28px, 4vw, 44px);
          border-radius: 28px;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.055),
            rgba(255, 255, 255, 0.018)
          );
          border: 1px solid rgba(255, 255, 255, 0.10);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
        }

        .contact-card-interactive {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, background-color 0.2s ease;
        }

        .contact-card-interactive:hover {
          transform: translateY(-2px);
        }

        .contact-btn-hover {
          transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
        }

        .contact-btn-hover:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-card-interactive:hover,
          .contact-btn-hover:hover {
            transform: none !important;
          }
        }

        /* Light Mode Adaptations */
        html.light .contact-section,
        html[data-theme="light"] .contact-section {
          color: #18181b !important;
        }

        html.light .contact-heading,
        html[data-theme="light"] .contact-heading,
        html.light .contact-section h3,
        html[data-theme="light"] .contact-section h3 {
          color: #09090b !important;
        }

        html.light .contact-section p,
        html[data-theme="light"] .contact-section p {
          color: #52525b !important;
        }

        html.light .connect-card,
        html[data-theme="light"] .connect-card {
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.95),
            rgba(244, 244, 248, 0.98)
          ) !important;
          border: 1px solid rgba(0, 0, 0, 0.09) !important;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.06), inset 0 1px rgba(255, 255, 255, 1) !important;
          color: #18181b !important;
        }

        html.light .contact-card-interactive,
        html[data-theme="light"] .contact-card-interactive {
          background: rgba(255, 255, 255, 0.8) !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
          color: #18181b !important;
        }

        html.light .contact-card-interactive:hover,
        html[data-theme="light"] .contact-card-interactive:hover {
          background: rgba(255, 255, 255, 0.98) !important;
          border-color: rgba(168, 85, 247, 0.4) !important;
        }

        html.light .contact-card-interactive span.text-white,
        html[data-theme="light"] .contact-card-interactive span.text-white {
          color: #09090b !important;
        }
      `}</style>

      {/* Subtle Ambient Glows */}
      <div 
        className="absolute top-12 left-1/4 w-[400px] h-[400px] bg-purple-600/[0.04] rounded-full blur-[140px] pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-12 right-1/4 w-[400px] h-[400px] bg-cyan-600/[0.04] rounded-full blur-[140px] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      {/* ==================================================
          1. HERO / HEADER AREA
          ================================================== */}
      <header 
        className="space-y-4"
        style={{ marginBottom: "clamp(32px, 4.5vw, 56px)" }}
      >
        {/* Availability Status Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase border border-emerald-500/25 bg-emerald-950/20 text-emerald-400 backdrop-blur-sm select-none"
            role="status"
            aria-label="Available for opportunities"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AVAILABLE FOR OPPORTUNITIES</span>
          </div>

          <span className="text-[11px] font-mono tracking-[0.2em] text-purple-400 uppercase font-semibold">
            CONTACT
          </span>

          {/* Optional Native Share button if supported by browser */}
          {canShare && (
            <button
              type="button"
              onClick={handleSharePortfolio}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer ml-auto"
              aria-label="Share Sayam's Portfolio"
            >
              <Share2 className="w-3 h-3 text-purple-400" />
              <span>Share Portfolio</span>
            </button>
          )}
        </div>

        {/* Heading */}
        <h2 
          className="contact-heading font-display font-extrabold text-white"
          style={{ maxWidth: "800px" }}
        >
          Let’s build<br />
          something<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
            meaningful.
          </span>
        </h2>

        {/* Subtitle */}
        <p 
          className="text-sm md:text-base text-zinc-400 leading-relaxed font-normal"
          style={{ maxWidth: "680px" }}
        >
          Whether it’s an internship, freelance project, research collaboration, hackathon or technical conversation, reach out through whichever channel works best.
        </p>
      </header>

      {/* ==================================================
          2-COLUMN CONTACT GRID
          ================================================== */}
      <div className="contact-grid">
        
        {/* ==================================================
            LEFT COLUMN: CURRENTLY OPEN TO & DIRECT CHANNELS
            ================================================== */}
        <div className="space-y-6">

          {/* Currently Open To Card */}
          <div className="rounded-2xl p-5 md:p-6 bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              CURRENTLY OPEN TO
            </span>

            <div className="flex flex-wrap gap-2 pt-1">
              {OPEN_ROLES.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-zinc-300 bg-white/[0.04] border border-white/[0.08] select-none hover:border-purple-500/30 hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* "Get in touch" Header and Channels */}
          <div className="space-y-3 pt-1">
            <div>
              <h3 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight">
                Get in touch
              </h3>
              <p className="text-xs md:text-sm text-zinc-400 mt-1 leading-relaxed">
                Direct links to reach out or explore my active engineering work.
              </p>
            </div>

            {/* Contact Cards Container */}
            <div className="space-y-2.5 pt-1">
              
              {/* CARD 1: EMAIL */}
              <div 
                onClick={() => handleCopyEmail()}
                className="contact-card-interactive group cursor-pointer p-4 rounded-2xl bg-white/[0.035] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] flex items-center justify-between gap-4"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCopyEmail(); } }}
                aria-label={`Copy primary email: ${primaryEmail}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                      EMAIL
                    </span>
                    <span className="text-xs md:text-sm font-mono text-white font-medium truncate block mt-0.5 select-all">
                      {primaryEmail}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="contact-btn-hover shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium border border-white/10 bg-white/[0.04] text-zinc-300 group-hover:text-white group-hover:border-purple-500/40 flex items-center gap-1.5 cursor-pointer"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-zinc-400" />
                      <span>Copy →</span>
                    </>
                  )}
                </button>
              </div>

              {/* CARD 2: LINKEDIN */}
              <a
                href={verifiedLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-interactive group p-4 rounded-2xl bg-white/[0.035] border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.05] flex items-center justify-between gap-4 block"
                aria-label="Open Sayam Mukherjee's LinkedIn profile in new tab"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                      LINKEDIN
                    </span>
                    <span className="text-xs md:text-sm font-sans text-white font-medium truncate block mt-0.5">
                      Connect professionally
                    </span>
                  </div>
                </div>

                <div className="contact-btn-hover shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium border border-white/10 bg-white/[0.04] text-zinc-300 group-hover:text-white group-hover:border-cyan-500/40 flex items-center gap-1">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </a>

              {/* CARD 3: GITHUB */}
              <a
                href={verifiedGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-interactive group p-4 rounded-2xl bg-white/[0.035] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] flex items-center justify-between gap-4 block"
                aria-label="Open Sayam Mukherjee's GitHub profile in new tab"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                      GITHUB
                    </span>
                    <span className="text-xs md:text-sm font-sans text-white font-medium truncate block mt-0.5">
                      Explore my code
                    </span>
                  </div>
                </div>

                <div className="contact-btn-hover shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium border border-white/10 bg-white/[0.04] text-zinc-300 group-hover:text-white group-hover:border-purple-500/40 flex items-center gap-1">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </a>

              {/* CARD 4: CODOLIO */}
              <a
                href={verifiedCodolio}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-interactive group p-4 rounded-2xl bg-white/[0.035] border border-white/10 hover:border-amber-500/40 hover:bg-white/[0.05] flex items-center justify-between gap-4 block"
                aria-label="Open Sayam Mukherjee's Codolio profile in new tab"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                      CODOLIO
                    </span>
                    <span className="text-xs md:text-sm font-sans text-white font-medium truncate block mt-0.5">
                      View coding profile
                    </span>
                  </div>
                </div>

                <div className="contact-btn-hover shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium border border-white/10 bg-white/[0.04] text-zinc-300 group-hover:text-white group-hover:border-amber-500/40 flex items-center gap-1">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </a>

            </div>
          </div>

        </div>

        {/* ==================================================
            RIGHT COLUMN: "LET’S CONNECT" DIRECT-CONTACT HUB
            ================================================== */}
        <div className="connect-card space-y-6">
          
          {/* Header */}
          <div className="border-b border-white/10 pb-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight">
                LET’S CONNECT
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-normal">
              Have an opportunity, project or idea? Reach out through whichever channel works best.
            </p>
          </div>

          {/* ==================================================
              PRIMARY EMAIL BLOCK
              ================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <span>EMAIL</span>
            </div>

            <div className="font-mono text-sm sm:text-base text-white font-semibold select-text break-all">
              {primaryEmail}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Copy Email Button */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="contact-btn-hover px-4 py-2 rounded-xl text-xs font-mono font-semibold border border-white/10 bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                aria-label="Copy email address"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              {/* Direct Mailto Anchor */}
              <a
                href={`mailto:${primaryEmail}`}
                className="contact-btn-hover px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-colors shadow-[0_2px_12px_rgba(168,85,247,0.3)]"
                aria-label="Email Sayam Mukherjee directly"
              >
                <span>Email Me →</span>
              </a>
            </div>
          </div>

          {/* ==================================================
              "BEST FOR" PILLS
              ================================================== */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold block">
              BEST FOR
            </span>
            <div className="flex flex-wrap gap-1.5">
              {OPEN_ROLES.map((role) => (
                <span
                  key={role}
                  className="px-2.5 py-1 rounded-full text-[11px] font-mono text-zinc-300 bg-white/[0.04] border border-white/[0.08]"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* ==================================================
              SOCIAL / PROFESSIONAL CONNECTIONS (2x2 GRID)
              ================================================== */}
          <div className="space-y-2.5 pt-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold block">
              PROFILES
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SOCIAL_PROFILES.map((profile) => {
                const IconComponent = profile.icon;
                return (
                  <a
                    key={profile.name}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`contact-card-interactive group p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 ${profile.hoverBorder} transition-all flex flex-col justify-between gap-3 text-left`}
                    aria-label={`Open Sayam Mukherjee's ${profile.name} profile in new tab`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${profile.bgClass}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 group-hover:text-white transition-colors">
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                        {profile.name}
                      </span>
                      <span className="text-xs text-zinc-200 group-hover:text-white font-medium block mt-0.5">
                        {profile.description}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* ==================================================
              QUICK CONTACT ACTION CTA
              ================================================== */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handleStartConversation}
              className="contact-btn-hover w-full py-3.5 px-6 rounded-xl font-mono text-xs font-bold tracking-wider uppercase text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-[0_4px_24px_rgba(168,85,247,0.25)] flex items-center justify-center gap-2 cursor-pointer transition-all"
              aria-label="Start a conversation via email"
            >
              <span>Start a conversation →</span>
            </button>
            <p className="text-[11px] font-mono text-zinc-400 text-center">
              Opens your email app
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
