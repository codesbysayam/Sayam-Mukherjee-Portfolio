import React, { useState } from "react";
import { 
  Mail, Copy, Check, ExternalLink, Github, 
  FolderGit2, ArrowRight
} from "lucide-react";

interface SkillsCtaProps {
  onNavigateToProjects?: () => void;
  onNavigateToContact?: () => void;
}

export function SkillsCta({ onNavigateToProjects, onNavigateToContact }: SkillsCtaProps) {
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
    <div className="p-6 sm:p-7 rounded-2xl bg-zinc-950/40 border border-zinc-850 space-y-6">
      {/* Header Statement */}
      <div className="space-y-2 max-w-2xl">
        <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-cyan-400">
          COLLABORATE
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
          Let’s build something meaningful.
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
          B.Tech CSE (AI &amp; ML) student at KIIT University available for software engineering internships, machine learning research projects, and hackathons.
        </p>
      </div>

      {/* Direct Email Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Business Email */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-850 flex flex-col justify-between space-y-2.5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-medium tracking-wider">
              PROJECTS &amp; COLLABORATION
            </span>
            <div className="text-xs sm:text-sm font-mono text-zinc-200 truncate">
              {businessEmail}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href={`mailto:${businessEmail}`}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Compose email ↗
            </a>

            <button
              type="button"
              onClick={() => copyEmail(businessEmail, "business")}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-750 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Copy email"
            >
              {copiedBusiness ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
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

        {/* Contact Email */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-850 flex flex-col justify-between space-y-2.5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-medium tracking-wider">
              RECRUITMENT &amp; ACADEMIC
            </span>
            <div className="text-xs sm:text-sm font-mono text-zinc-200 truncate">
              {contactEmail}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href={`mailto:${contactEmail}`}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Compose email ↗
            </a>

            <button
              type="button"
              onClick={() => copyEmail(contactEmail, "contact")}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-750 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Copy email"
            >
              {copiedContact ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
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
            className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
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
          className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub Profile</span>
          <ExternalLink className="w-3 h-3 text-zinc-500" />
        </a>

        {onNavigateToContact && (
          <button
            type="button"
            onClick={onNavigateToContact}
            className="px-4 py-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
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
