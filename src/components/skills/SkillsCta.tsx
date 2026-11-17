import { useState } from "react";
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Github,
  FolderGit2,
  ArrowRight,
} from "lucide-react";

interface SkillsCtaProps {
  onNavigateToProjects?: () => void;
  onNavigateToContact?: () => void;
}

export function SkillsCta({
  onNavigateToProjects,
  onNavigateToContact,
}: SkillsCtaProps) {
  const [copiedBusiness, setCopiedBusiness] = useState(false);
  const [copiedContact, setCopiedContact] = useState(false);

  const businessEmail = "wrickbusiness@gmail.com";
  const contactEmail = "sayammukherjee1506@gmail.com";

  const copyEmail = async (email: string, type: "business" | "contact") => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      } else {
        const input = document.createElement("textarea");
        input.value = email;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }

      if (type === "business") {
        setCopiedBusiness(true);
        setTimeout(() => setCopiedBusiness(false), 2000);
      } else {
        setCopiedContact(true);
        setTimeout(() => setCopiedContact(false), 2000);
      }
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  };

  return (
    <div className="card p-6 sm:p-8 space-y-6">
      {/* Header Statement */}
      <div className="space-y-2 max-w-2xl">
        <span className="text-xs font-mono font-semibold text-[var(--accent)] block">
          Collaborate
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight font-display">
          Let&apos;s build something meaningful.
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
          B.Tech CSE (AI &amp; ML) student at KIIT University available for software engineering internships, machine learning research projects, and hackathons.
        </p>
      </div>

      {/* Direct Email Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between space-y-2.5">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-[var(--text-muted)] font-medium">
              Projects &amp; Collaboration
            </span>
            <div className="text-xs sm:text-sm font-mono text-[var(--text)] truncate">
              {businessEmail}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href={`mailto:${businessEmail}`}
              className="text-xs font-mono text-[var(--accent)] hover:underline transition-colors"
            >
              Compose email ↗
            </a>

            <button
              type="button"
              onClick={() => copyEmail(businessEmail, "business")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[var(--surface-2)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Copy email"
            >
              {copiedBusiness ? (
                <>
                  <Check className="w-3 h-3 text-[var(--success)]" />
                  <span className="text-[var(--success)]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between space-y-2.5">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-[var(--text-muted)] font-medium">
              Recruitment &amp; Academic
            </span>
            <div className="text-xs sm:text-sm font-mono text-[var(--text)] truncate">
              {contactEmail}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href={`mailto:${contactEmail}`}
              className="text-xs font-mono text-[var(--accent)] hover:underline transition-colors"
            >
              Compose email ↗
            </a>

            <button
              type="button"
              onClick={() => copyEmail(contactEmail, "contact")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[var(--surface-2)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Copy email"
            >
              {copiedContact ? (
                <>
                  <Check className="w-3 h-3 text-[var(--success)]" />
                  <span className="text-[var(--success)]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {onNavigateToProjects && (
          <button
            type="button"
            onClick={onNavigateToProjects}
            className="btn btn-primary text-xs font-mono cursor-pointer whitespace-nowrap shrink-0"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>View Verified Projects</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}

        <a
          href="https://github.com/codesbysayam"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary text-xs font-mono whitespace-nowrap shrink-0"
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub Profile</span>
          <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
        </a>

        {onNavigateToContact && (
          <button
            type="button"
            onClick={onNavigateToContact}
            className="btn btn-secondary text-xs font-mono cursor-pointer whitespace-nowrap shrink-0"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Form</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default SkillsCta;

