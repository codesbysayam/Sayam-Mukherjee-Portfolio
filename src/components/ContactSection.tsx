import { useState, useEffect, useRef } from "react";
import {
  Mail,
  ArrowRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Award,
  Youtube,
  Sparkles,
  Share2,
} from "lucide-react";
import { showToast } from "./Toast";
import { ContactForm } from "./ContactForm";
import ClosingFluidCanvas from "./motion/ClosingFluidCanvas";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../motion/Reveal";

const OPEN_ROLES = [
  "Internships",
  "Freelance work",
  "Collaborations",
  "Research",
  "Hackathons",
];

const SOCIAL_PROFILES = [
  {
    name: "LinkedIn",
    description: "Connect professionally",
    url: "https://www.linkedin.com/in/sayammukherjee-portfolio/",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    description: "Explore my code",
    url: "https://github.com/codesbysayam",
    icon: Github,
  },
  {
    name: "Codolio",
    description: "View coding profile",
    url: "https://codolio.com/profile/codesbysayam",
    icon: Award,
  },
  {
    name: "YouTube",
    description: "Explore my content",
    url: "https://youtube.com/@technicalaz",
    icon: Youtube,
  },
];

export default function ContactSection() {
  const businessEmail = "wrickbusiness@gmail.com";
  const contactEmail = "sayammukherjee1506@gmail.com";
  const verifiedLinkedin = "https://www.linkedin.com/in/sayammukherjee-portfolio/";
  const verifiedGithub = "https://github.com/codesbysayam";
  const verifiedCodolio = "https://codolio.com/profile/codesbysayam";

  const [copiedBusiness, setCopiedBusiness] = useState(false);
  const [copiedContact, setCopiedContact] = useState(false);
  const copyBusinessTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const copyContactTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanShare(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (copyBusinessTimeoutRef.current) clearTimeout(copyBusinessTimeoutRef.current);
      if (copyContactTimeoutRef.current) clearTimeout(copyContactTimeoutRef.current);
    };
  }, []);

  const copyTextToClipboard = async (text: string) => {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  const handleCopyBusiness = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await copyTextToClipboard(businessEmail);
      setCopiedBusiness(true);
      showToast(`Copied ${businessEmail} for business & hackathons!`, "success");

      if (copyBusinessTimeoutRef.current) clearTimeout(copyBusinessTimeoutRef.current);
      copyBusinessTimeoutRef.current = setTimeout(() => {
        setCopiedBusiness(false);
      }, 1500);
    } catch {
      window.location.href = `mailto:${businessEmail}?subject=Business%20%2F%20Collaboration%20Inquiry`;
    }
  };

  const handleCopyContact = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await copyTextToClipboard(contactEmail);
      setCopiedContact(true);
      showToast(`Copied ${contactEmail} for contact & internships!`, "success");

      if (copyContactTimeoutRef.current) clearTimeout(copyContactTimeoutRef.current);
      copyContactTimeoutRef.current = setTimeout(() => {
        setCopiedContact(false);
      }, 1500);
    } catch {
      window.location.href = `mailto:${contactEmail}?subject=Internship%20%2F%20Contact%20Inquiry`;
    }
  };

  const handleStartConversation = () => {
    window.location.href = `mailto:${businessEmail}?subject=Business%20%2F%20Collaboration%20Inquiry`;
  };

  const handleSharePortfolio = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Sayam Mukherjee | Portfolio",
          text: "Explore Sayam Mukherjee's portfolio.",
          url: window.location.href,
        });
      } catch {
        // Abort ignored
      }
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full py-6 sm:py-10 font-sans text-[var(--text)] overflow-hidden rounded-[12px]"
    >
      <ClosingFluidCanvas tone="adaptive" />

      {/* Editorial Hero Header */}
      <EditorialReveal>
        <header className="relative z-10 space-y-4 mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent)] font-semibold">
              Contact &amp; Inquiries
            </span>
            <span className="text-[var(--text-faint)]">&bull;</span>
            <span
              className="text-xs font-mono font-medium text-[var(--text-muted)]"
              role="status"
              aria-label="Available for opportunities"
            >
              Available for opportunities
            </span>

            {canShare && (
              <button
                type="button"
                onClick={handleSharePortfolio}
                className="btn btn-secondary min-h-[36px] px-3 py-1 text-xs font-mono ml-auto"
                aria-label="Share Sayam's Portfolio"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Portfolio</span>
              </button>
            )}
          </div>

          <h1
            className="font-display font-extrabold text-[var(--text)] tracking-tight leading-[0.98]"
            style={{ fontSize: "clamp(1.85rem, 5.2vw, 4.75rem)", maxWidth: "820px" }}
          >
            Let&rsquo;s build
            <br />
            something{" "}
            <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
              meaningful.
            </span>
          </h1>

          <p
            className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed"
            style={{ maxWidth: "660px" }}
          >
            Whether it&rsquo;s an internship, freelance build, research collaboration,
            hackathon, or technical conversation, reach out through whichever channel
            works best.
          </p>
        </header>
      </EditorialReveal>

      {/* 2-Column Editorial Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Open Roles & Direct Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className="card p-5 md:p-6 space-y-3"
            style={{
              backgroundColor: "var(--surface-2)",
              borderColor: "var(--border)",
            }}
          >
            <span className="text-xs font-mono tracking-wider uppercase text-[var(--accent)] font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Currently Open To
            </span>

            <div className="flex flex-wrap gap-2 pt-1">
              {OPEN_ROLES.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border text-xs font-mono text-[var(--text-secondary)]"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-display text-[var(--text)] tracking-tight">
                Direct Channels
              </h2>
              <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
                Copy an address directly or inspect active engineering profiles.
              </p>
            </div>

            <StaggerGroup stagger={0.04} className="space-y-2.5 pt-1">
              {/* Business & Hackathons Email */}
              <StaggerItem>
                <div
                  onClick={() => handleCopyBusiness()}
                  className="card card-interactive group cursor-pointer p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4 min-w-0 hover:-translate-y-0.5 active:scale-[0.985] active:border-[var(--accent)]"
                style={{
                  backgroundColor: "var(--surface-2)",
                  borderColor: "var(--border)",
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCopyBusiness();
                  }
                }}
                aria-label={`Copy business email: ${businessEmail}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-[8px] border flex items-center justify-center shrink-0 text-[var(--accent)]"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[var(--accent)] block font-semibold">
                      Business &amp; Hackathons
                    </span>
                    <span className="text-xs md:text-sm font-mono text-[var(--text)] font-medium truncate block mt-0.5 select-all">
                      {businessEmail}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] block truncate">
                      Collaborations, hackathons &amp; business
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyBusiness}
                  className="btn btn-secondary min-h-[40px] px-3 py-1.5 text-xs font-mono shrink-0"
                  aria-label="Copy business email address"
                >
                  {copiedBusiness ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                </div>
              </StaggerItem>

              {/* Contact & Internships Email */}
              <StaggerItem>
                <div
                  onClick={() => handleCopyContact()}
                  className="card card-interactive group cursor-pointer p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4 min-w-0 hover:-translate-y-0.5 active:scale-[0.985] active:border-[var(--accent)]"
                style={{
                  backgroundColor: "var(--surface-2)",
                  borderColor: "var(--border)",
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCopyContact();
                  }
                }}
                aria-label={`Copy contact email: ${contactEmail}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-[8px] border flex items-center justify-center shrink-0 text-[var(--accent)]"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[var(--accent)] block font-semibold">
                      Contact &amp; Internships
                    </span>
                    <span className="text-xs md:text-sm font-mono text-[var(--text)] font-medium truncate block mt-0.5 select-all">
                      {contactEmail}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] block truncate">
                      Internships, student outreach &amp; queries
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyContact}
                  className="btn btn-secondary min-h-[40px] px-3 py-1.5 text-xs font-mono shrink-0"
                  aria-label="Copy contact email address"
                >
                  {copiedContact ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                </div>
              </StaggerItem>

              {/* Quick Social Cards */}
              <StaggerItem>
                <a
                  href={verifiedLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card card-interactive group p-4 flex items-center justify-between gap-4 hover:-translate-y-0.5 active:scale-[0.985] active:border-[var(--accent)]"
                style={{
                  backgroundColor: "var(--surface-2)",
                  borderColor: "var(--border)",
                }}
                aria-label="Open Sayam Mukherjee's LinkedIn profile in new tab"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-[8px] border flex items-center justify-center shrink-0 text-[var(--accent)]"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block font-semibold">
                      LINKEDIN
                    </span>
                    <span className="text-xs md:text-sm text-[var(--text)] font-medium truncate block mt-0.5">
                      Connect professionally
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>
              </StaggerItem>

              <StaggerItem>
                <a
                  href={verifiedGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card card-interactive group p-4 flex items-center justify-between gap-4 hover:-translate-y-0.5 active:scale-[0.985] active:border-[var(--accent)]"
                style={{
                  backgroundColor: "var(--surface-2)",
                  borderColor: "var(--border)",
                }}
                aria-label="Open Sayam Mukherjee's GitHub profile in new tab"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-[8px] border flex items-center justify-center shrink-0 text-[var(--accent)]"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block font-semibold">
                      GITHUB
                    </span>
                    <span className="text-xs md:text-sm text-[var(--text)] font-medium truncate block mt-0.5">
                      Explore my code
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>
              </StaggerItem>

              <StaggerItem>
                <a
                  href={verifiedCodolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card card-interactive group p-4 flex items-center justify-between gap-4 hover:-translate-y-0.5 active:scale-[0.985] active:border-[var(--accent)]"
                style={{
                  backgroundColor: "var(--surface-2)",
                  borderColor: "var(--border)",
                }}
                aria-label="Open Sayam Mukherjee's Codolio profile in new tab"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-[8px] border flex items-center justify-center shrink-0 text-[var(--accent)]"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block font-semibold">
                      CODOLIO
                    </span>
                    <span className="text-xs md:text-sm text-[var(--text)] font-medium truncate block mt-0.5">
                      View coding profile
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>
              </StaggerItem>
            </StaggerGroup>
          </div>
        </div>

        {/* Right Column: Let's Connect Hub */}
        <div
          className="lg:col-span-7 card p-5 sm:p-8 space-y-6"
          style={{
            backgroundColor: "var(--surface-2)",
            borderColor: "var(--border)",
          }}
        >
          <div className="border-b pb-4 space-y-1.5" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold font-display text-[var(--text)] tracking-tight">
                Let&rsquo;s connect
              </h2>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
                Response &lt; 24h
              </span>
            </div>
            <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
              Have an opportunity, project, or idea? Send a direct dispatch below or reach out via email.
            </p>
          </div>

          <ContactForm />

          {/* Dual Email Action Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div
              className="p-4 rounded-[8px] border space-y-2.5"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[var(--accent)] font-semibold">
                <Mail className="w-3.5 h-3.5" />
                <span>Business &amp; Hackathons</span>
              </div>
              <div className="font-mono text-xs sm:text-sm text-[var(--text)] font-semibold select-text break-all">
                {businessEmail}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyBusiness}
                  className="btn btn-secondary min-h-[40px] px-3 py-1 text-xs font-mono"
                >
                  {copiedBusiness ? "Copied" : "Copy"}
                </button>
                <a
                  href={`mailto:${businessEmail}?subject=Business%20%2F%20Collaboration%20Inquiry`}
                  className="btn btn-primary min-h-[40px] px-3 py-1 text-xs font-mono"
                >
                  Email
                </a>
              </div>
            </div>

            <div
              className="p-4 rounded-[8px] border space-y-2.5"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[var(--accent)] font-semibold">
                <Mail className="w-3.5 h-3.5" />
                <span>Contact &amp; Internships</span>
              </div>
              <div className="font-mono text-xs sm:text-sm text-[var(--text)] font-semibold select-text break-all">
                {contactEmail}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyContact}
                  className="btn btn-secondary min-h-[40px] px-3 py-1 text-xs font-mono"
                >
                  {copiedContact ? "Copied" : "Copy"}
                </button>
                <a
                  href={`mailto:${contactEmail}?subject=Internship%20%2F%20Contact%20Inquiry`}
                  className="btn btn-primary min-h-[40px] px-3 py-1 text-xs font-mono"
                >
                  Email
                </a>
              </div>
            </div>
          </div>

          {/* 2x2 Social Grid */}
          <div className="space-y-2.5 pt-1">
            <span className="text-xs font-mono tracking-wider text-[var(--text-muted)] uppercase font-semibold block">
              Profiles
            </span>
            <StaggerGroup stagger={0.04} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SOCIAL_PROFILES.map((profile) => {
                const IconComponent = profile.icon;
                return (
                  <StaggerItem key={profile.name}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3.5 rounded-[8px] border hover:border-[var(--border-strong)] active:scale-[0.975] active:border-[var(--accent)] transition-all flex items-center justify-between gap-3 h-full"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                      }}
                      aria-label={`Open Sayam Mukherjee's ${profile.name} profile in new tab`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded-[6px] border flex items-center justify-center shrink-0 text-[var(--accent)]"
                          style={{
                            backgroundColor: "var(--surface-2)",
                            borderColor: "var(--border)",
                          }}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block font-semibold">
                            {profile.name}
                          </span>
                          <span className="text-xs text-[var(--text)] font-medium block truncate">
                            {profile.description}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </a>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>

          <div
            className="space-y-2 pt-3 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              type="button"
              onClick={handleStartConversation}
              className="btn btn-primary w-full py-3 text-xs font-mono"
              aria-label="Start a conversation via email"
            >
              <span>Start a conversation &rarr;</span>
            </button>
            <p className="text-xs font-mono text-[var(--text-faint)] text-center">
              Opens your default email client
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
