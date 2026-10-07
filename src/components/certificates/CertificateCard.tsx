import React, { useState } from "react";
import { Certificate } from "../../types/certificates";
import { usePortfolio } from "../../context/PortfolioContext";
import { ExternalLink, Eye, FileText, Download } from "lucide-react";

interface CertificateCardProps {
  certificate: Certificate;
  onView: (cert: Certificate) => void;
}

export default function CertificateCard({
  certificate,
  onView,
}: CertificateCardProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";
  const [imageError, setImageError] = useState(false);

  const {
    id,
    title,
    issuer,
    category,
    description,
    issueDate,
    year,
    session,
    credentialType,
    subjects,
    platform,
    project,
    theme: projectTheme,
    pathway,
    track,
    team,
    date,
    event,
    venue,
    format,
    role,
    associatedProjects,
    credentialId,
    credentialUrl,
    skills = [],
    tags = [],
    imageUrl,
    pdfUrl,
  } = certificate;

  // Max 4 visible tags on the card as requested
  const allTags = tags.length > 0 ? tags : skills;
  const visibleTags = allTags.slice(0, 4);
  const remainingCount = allTags.length - visibleTags.length;

  const fileUrl = imageUrl || pdfUrl;

  // Helper to extract clean initials / monogram from issuer
  const getIssuerMonogram = (name: string) => {
    if (!name) return "REC";
    if (name.includes("IIT")) return "IIT";
    if (name.includes("Ministry") || name.includes("Govt")) return "GOI";
    if (name.includes("KIIT")) return "KIIT";
    if (name.includes("CBSE")) return "CBSE";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
    return parts.map((p) => p[0]).slice(0, 3).join("").toUpperCase();
  };

  // Helper ensuring event/credential name is the primary title
  const cleanTitle = (rawTitle: string) => {
    if (!rawTitle) return "";
    return rawTitle
      .replace(/^Certificate of Participation\s*[-|:]\s*/i, "")
      .replace(/^Certificate of Completion\s*[-|:]\s*/i, "")
      .replace(/^Certificate of Participation$/i, "")
      .replace(/^Certificate of Completion$/i, "")
      .trim();
  };

  const displayTitle = (() => {
    const cleaned = cleanTitle(title || "");
    if (!cleaned && event) return event;
    if (cleaned.toLowerCase() === "certificate of participation" && event) return event;
    return cleaned || title;
  })();

  return (
    <article
      id={`cert-card-${id}`}
      className={`group relative flex flex-col justify-between rounded-[20px] border transition-all duration-200 overflow-hidden h-full ${
        isLight
          ? "bg-white border-slate-200/90 hover:border-purple-300 hover:shadow-[0_16px_36px_rgba(109,40,217,0.08)] hover:-translate-y-1"
          : "bg-[#111318]/95 border-white/10 hover:border-purple-500/35 hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)] hover:-translate-y-1"
      }`}
    >
      {/* Main Card Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* 1. small category/year (e.g. COMPETITION · 2026) */}
        <div className="flex items-center justify-between gap-3 text-xs mb-3">
          <span
            className={`font-semibold tracking-wide uppercase text-[11px] ${
              isLight ? "text-purple-600" : "text-purple-400"
            }`}
          >
            {category.replace(/S$/, "")}
            {issueDate || year ? ` · ${issueDate || year}` : ""}
          </span>
          {platform && (
            <span
              className={`font-sans text-xs ${
                isLight ? "text-slate-500" : "text-[#A7ADB8]"
              }`}
            >
              {platform}
            </span>
          )}
        </div>

        {/* 2. large event name (Primary visual focus) */}
        <h3
          onClick={() => onView(certificate)}
          className={`text-lg sm:text-xl font-bold tracking-tight leading-snug cursor-pointer transition-colors ${
            isLight
              ? "text-slate-900 group-hover:text-purple-700"
              : "text-[#F5F7FA] group-hover:text-white"
          }`}
          style={{ fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }}
        >
          {displayTitle}
        </h3>

        {/* 3. issuer / organizer */}
        <div
          className={`text-sm font-medium mt-1 ${
            format || (team && role) ? "mb-1.5" : session ? "mb-1.5" : "mb-3.5"
          } ${
            isLight ? "text-slate-700" : "text-[#C4C9D2]"
          }`}
        >
          {issuer}
        </div>

        {/* 4. event type (e.g. 12-Hour Offline Hackathon) */}
        {format && (
          <div
            className={`text-xs font-sans mb-1.5 ${
              isLight ? "text-slate-600" : "text-[#A7ADB8]"
            }`}
          >
            {format}
          </div>
        )}

        {/* 5. team context (e.g. ALGNITE · Team Leader) */}
        {team && role ? (
          <div
            className={`text-xs font-medium font-sans mb-3.5 ${
              isLight ? "text-purple-700" : "text-purple-300"
            }`}
          >
            {team} · {role}
          </div>
        ) : team ? (
          <div
            className={`text-xs font-medium font-sans mb-3.5 ${
              isLight ? "text-purple-700" : "text-purple-300"
            }`}
          >
            {team}
          </div>
        ) : null}

        {/* Academic Session / Record Context */}
        {session && (
          <div
            className={`text-xs font-medium mb-3.5 ${
              isLight ? "text-slate-600" : "text-[#A7ADB8]"
            }`}
          >
            Academic Session:{" "}
            <span
              className={`font-semibold ${
                isLight ? "text-slate-900" : "text-[#F5F7FA]"
              }`}
            >
              {session}
            </span>
          </div>
        )}

        {/* Visual Preview Section (Only when meaningful) */}
        {imageUrl && !imageError ? (
          <div
            onClick={() => onView(certificate)}
            className={`w-full h-44 rounded-2xl border overflow-hidden cursor-pointer flex items-center justify-center p-2 mb-4 transition-colors ${
              isLight
                ? "bg-slate-50 border-slate-200 hover:border-purple-300"
                : "bg-black/20 border-white/10 hover:border-purple-500/30"
            }`}
          >
            <img
              src={imageUrl}
              alt={`${title} certificate`}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : pdfUrl ? (
          <div
            onClick={() => onView(certificate)}
            className={`w-full py-4 px-4 rounded-2xl border cursor-pointer flex items-center gap-3 mb-4 transition-colors ${
              isLight
                ? "bg-slate-50 border-slate-200 hover:border-purple-300"
                : "bg-white/[0.02] border-white/10 hover:border-purple-500/30"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isLight
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-red-950/40 text-red-400 border-red-800/40"
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span
                className={`text-xs font-semibold block truncate ${
                  isLight ? "text-slate-800" : "text-zinc-200"
                }`}
              >
                Official PDF Document
              </span>
              <span
                className={`text-[11px] ${
                  isLight ? "text-slate-500" : "text-zinc-400"
                }`}
              >
                Click to view credential details
              </span>
            </div>
          </div>
        ) : project || projectTheme || (!team && track) || (associatedProjects && associatedProjects.length > 0) ? (
          /* Structured Project Highlight Box (e.g. Memory in Motion / Operon / Associated Projects) */
          <div
            className={`rounded-xl border p-3.5 mb-4 space-y-1.5 ${
              isLight
                ? "bg-purple-50/50 border-purple-200/70"
                : "bg-white/[0.02] border-white/[0.08]"
            }`}
          >
            {project && (
              <div className="flex items-start justify-between gap-2 text-xs">
                <span
                  className={`font-semibold line-clamp-1 ${
                    isLight ? "text-purple-700" : "text-purple-300"
                  }`}
                  title={project}
                >
                  Project: {project}
                </span>
                {pathway ? (
                  <span
                    className={`text-[11px] shrink-0 ${
                      isLight ? "text-slate-500" : "text-[#737A87]"
                    }`}
                  >
                    {pathway}
                  </span>
                ) : track ? (
                  <span
                    className={`text-[11px] shrink-0 font-medium ${
                      isLight ? "text-purple-700" : "text-purple-300"
                    }`}
                  >
                    {track}
                  </span>
                ) : null}
              </div>
            )}
            {!project && track && !team && (
              <div className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                Track: {track}
              </div>
            )}
            {projectTheme && (
              <p
                className={`text-xs leading-relaxed ${
                  isLight ? "text-slate-700" : "text-[#A7ADB8]"
                }`}
              >
                <span className="font-medium text-zinc-300 dark:text-zinc-300">
                  Theme:{" "}
                </span>
                {projectTheme}
              </p>
            )}
            {associatedProjects && associatedProjects.length > 0 && (
              <div className="text-[11px] pt-0.5">
                <span className={`font-semibold ${isLight ? "text-purple-600" : "text-purple-400"}`}>
                  Team Projects:{" "}
                </span>
                <span className={`font-mono ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
                  {associatedProjects.map((p) => p.name).join(" · ")}
                </span>
              </div>
            )}
          </div>
        ) : credentialId ? (
          /* Subtle Credential Record Identifier for Verified Official Records */
          <div
            className={`flex items-center gap-2.5 p-2.5 rounded-xl border mb-4 ${
              isLight
                ? "bg-slate-50 border-slate-200"
                : "bg-white/[0.02] border-white/[0.06]"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] border ${
                isLight
                  ? "bg-white text-slate-800 border-slate-200"
                  : "bg-zinc-900 text-zinc-200 border-zinc-800"
              }`}
            >
              {getIssuerMonogram(issuer)}
            </div>
            <span
              className={`font-mono text-xs truncate ${
                isLight ? "text-slate-600" : "text-[#A7ADB8]"
              }`}
            >
              Record ID: {credentialId}
            </span>
          </div>
        ) : null}

        {/* Short Description */}
        {description && (
          <p
            className={`text-sm leading-relaxed mb-4 line-clamp-3 ${
              isLight ? "text-slate-600" : "text-[#A7ADB8]"
            }`}
          >
            {description}
          </p>
        )}

        {/* 2–4 Concise Tags (No loud capsules) */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-2">
            {visibleTags.map((tag, idx) => (
              <span
                key={idx}
                className={`text-xs px-2.5 py-1 rounded-lg border font-sans ${
                  isLight
                    ? "bg-slate-100 border-slate-200 text-slate-700"
                    : "bg-white/[0.05] border-white/[0.08] text-[#B8BEC8]"
                }`}
              >
                {tag}
              </span>
            ))}
            {remainingCount > 0 && (
              <button
                type="button"
                onClick={() => onView(certificate)}
                className={`text-xs px-1.5 py-1 font-sans cursor-pointer hover:underline ${
                  isLight ? "text-slate-500" : "text-[#737A87]"
                }`}
                title="View full details for more tags"
              >
                +{remainingCount} more
              </button>
            )}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div
        className={`px-6 py-4 border-t flex items-center gap-2.5 ${
          isLight
            ? "bg-slate-50/60 border-slate-200"
            : "bg-[#0d0e12]/80 border-white/[0.08]"
        }`}
      >
        {/* Primary Action: View Credential (Direct link to authentic credential) */}
        {credentialUrl ? (
          <a
            id={`btn-credential-${id}`}
            href={credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer shadow-sm hover:-translate-y-0.5"
            aria-label={`View Credential for ${displayTitle}`}
          >
            <span>View Credential</span>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </a>
        ) : (
          <button
            id={`btn-inspect-primary-${id}`}
            onClick={() => onView(certificate)}
            className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer border border-white/10"
            aria-label={`Inspect Record for ${displayTitle}`}
          >
            <Eye className="w-4 h-4 text-purple-400" />
            <span>Inspect Record</span>
          </button>
        )}

        {/* Secondary Action: Inspect Details Modal (When credentialUrl exists) */}
        {credentialUrl && (
          <button
            id={`btn-view-${id}`}
            onClick={() => onView(certificate)}
            className={`flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer border ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                : "bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 border-white/10"
            }`}
            aria-label={`Inspect Record for ${displayTitle}`}
            title="Inspect Record"
          >
            <Eye className="w-4 h-4 text-purple-400" />
            <span>Inspect Record</span>
          </button>
        )}

        {/* Optional Direct Download Action */}
        {fileUrl && (
          <a
            id={`btn-download-${id}`}
            href={fileUrl}
            download={`${displayTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-certificate`}
            target="_blank"
            rel="noopener noreferrer"
            className={`min-h-[44px] w-11 rounded-xl inline-flex items-center justify-center transition-all duration-150 cursor-pointer border shrink-0 ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                : "bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border-white/10"
            }`}
            title="Download Document"
            aria-label={`Download document for ${displayTitle}`}
          >
            <Download className="w-4 h-4 text-zinc-400" />
          </a>
        )}
      </div>
    </article>
  );
}
