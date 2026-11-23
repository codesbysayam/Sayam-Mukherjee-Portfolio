import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Check,
  Copy,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { showToast } from "./Toast";
import { ContactForm } from "./ContactForm";
import { EditorialSectionHeader } from "./common/EditorialSectionHeader";
import { ContourBackground } from "./motion/ContourBackground";
import { EditorialReveal } from "../motion/Reveal";
import { SOCIAL_LINKS } from "../data/siteContent";

const CONTACT_PROFILES = [
  { name: "LinkedIn", url: SOCIAL_LINKS.linkedin },
  { name: "GitHub", url: SOCIAL_LINKS.github },
  { name: "Codolio", url: SOCIAL_LINKS.codolio },
  { name: "YouTube", url: SOCIAL_LINKS.youtube },
];

export default function ContactSection() {
  const contactEmail = "sayammukherjee1506@gmail.com";
  const businessEmail = "wrickbusiness@gmail.com";

  const [copiedKey, setCopiedKey] = useState<"contact" | "business" | null>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const copyEmail = async (email: string, key: "contact" | "business") => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedKey(key);
      showToast(`Copied ${email}`, "success");
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full py-4 sm:py-8 font-sans text-[var(--text)]"
    >
      <ContourBackground density="subtle" />

      <EditorialReveal>
        <header className="relative z-10 pb-8 mb-10 border-b border-[var(--border)]">
          <EditorialSectionHeader
            level="h1"
            eyebrow="07 · Contact"
            title="Get in"
            italicHighlight="touch."
            description="Open to conversations around software engineering internships, applied machine learning research, and thoughtful collaborative builds."
          />
        </header>
      </EditorialReveal>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Direct Details (No Duplication) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Location</span>
            </div>
            <p className="text-sm text-[var(--text)] font-medium">
              Bhubaneswar, Odisha (KIIT University)
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Originally from Hooghly, West Bengal · Available for remote &amp; hybrid collaboration
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-[var(--border)]">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold block">
              Direct Email
            </span>

            <div className="space-y-3">
              {[
                {
                  key: "contact" as const,
                  label: "Internships & General Inquiries",
                  email: contactEmail,
                },
                {
                  key: "business" as const,
                  label: "Collaborations & Hackathons",
                  email: businessEmail,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-4 rounded-[8px] border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[11px] font-mono text-[var(--text-muted)] block">
                      {item.label}
                    </span>
                    <a
                      href={`mailto:${item.email}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-semibold text-[var(--text)] hover:text-[var(--accent)] break-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" aria-hidden="true" />
                      <span>{item.email}</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyEmail(item.email, item.key)}
                    aria-label={`Copy ${item.email}`}
                    className="btn btn-secondary !min-h-[36px] !px-2.5 !py-1 !text-xs font-mono shrink-0"
                  >
                    {copiedKey === item.key ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-[var(--border)]">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
              Elsewhere
            </span>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono">
              {CONTACT_PROFILES.map((profile) => (
                <li key={profile.name}>
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors py-1"
                  >
                    <span>{profile.name}</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Contact Form Only */}
        <div
          className="lg:col-span-7 card p-5 sm:p-8 space-y-5"
          style={{
            backgroundColor: "var(--surface-2)",
            borderColor: "var(--border)",
          }}
        >
          <div className="border-b pb-4 space-y-1" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-xl font-bold font-display text-[var(--text)] tracking-tight">
              Send a message
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Share context about a role, project, or question below.
            </p>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
