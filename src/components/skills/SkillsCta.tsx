import React, { useState } from "react";
import { 
  Mail, Copy, Check, ExternalLink, Github, 
  FolderGit2, ArrowRight, Sparkles 
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
    <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-850 relative overflow-hidden space-y-6">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="space-y-3 relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LET'S BUILD SOMETHING RELIABLE</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
          Ready to collaborate or discuss an engineering role?
        </h2>

        <p className="text-sm text-zinc-300 leading-relaxed font-sans">
          I'm currently seeking software engineering internships, research fellowships, and high-impact hackathon collaborations. Reach out through the direct channels below.
        </p>
      </div>

      {/* Direct Contact Channels Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
        {/* Business & Collaborations */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
              BUSINESS &amp; COLLABORATIONS
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Hackathons / Projects</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <a
              href={`mailto:${businessEmail}`}
              className="text-xs font-mono text-white hover:text-cyan-300 transition-colors truncate"
              title={`Email ${businessEmail}`}
            >
              {businessEmail}
            </a>

            <button
              type="button"
              onClick={() => copyEmail(businessEmail, "business")}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-white transition-colors shrink-0 cursor-pointer"
              title="Copy business email"
            >
              {copiedBusiness ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Contact & Internships */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
              CONTACT &amp; INTERNSHIPS
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Recruitment &amp; Roles</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <a
              href={`mailto:${contactEmail}`}
              className="text-xs font-mono text-white hover:text-emerald-300 transition-colors truncate"
              title={`Email ${contactEmail}`}
            >
              {contactEmail}
            </a>

            <button
              type="button"
              onClick={() => copyEmail(contactEmail, "contact")}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-white transition-colors shrink-0 cursor-pointer"
              title="Copy personal contact email"
            >
              {copiedContact ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-3 pt-2 relative z-10">
        {onNavigateToProjects && (
          <button
            onClick={onNavigateToProjects}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Explore Verified Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        <a
          href="https://github.com/codesbysayam"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white font-medium text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
        >
          <Github className="w-4 h-4" />
          <span>View GitHub Codebases</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
        </a>

        {onNavigateToContact && (
          <button
            onClick={onNavigateToContact}
            className="px-5 py-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white font-medium text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Open Contact Form</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default SkillsCta;
