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
    platform,
    project,
    theme: projectTheme,
    pathway,
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
        {/* Top Hierarchy: Category & Year / Platform */}
        <div className="flex items-center justify-between gap-3 text-xs mb-3">
          <span
            className={`font-semibold tracking-wide uppercase text-[11px] ${
              isLight ? "text-purple-600" : "text-purple-400"
            }`}
          >
            {category}
          </span>
          <span
            className={`font-sans text-xs ${
              isLight ? "text-slate-500" : "text-[#A7ADB8]"
            }`}
          >
            {issueDate}
            {platform ? ` · ${platform}` : ""}
          </span>
        </div>

        {/* Certificate / Achievement Title */}
        <h3
          onClick={() => onView(certificate)}
          className={`text-lg sm:text-xl font-bold tracking-tight leading-snug cursor-pointer transition-colors ${
            isLight
              ? "text-slate-900 group-hover:text-purple-700"
              : "text-[#F5F7FA] group-hover:text-white"
          }`}
          style={{ fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }}
        >
          {title}
        </h3>

        {/* Issuer Name */}
        <div
          className={`text-sm font-medium mt-1 mb-3.5 ${
            isLight ? "text-slate-700" : "text-[#C4C9D2]"
          }`}
        >
          {issuer}
        </div>

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
        ) : project || projectTheme ? (
          /* Structured Project Highlight Box (e.g. Memory in Motion / DataForge) */
          <div
            className={`rounded-xl border p-3.5 mb-4 space-y-1.5 ${
              isLight
                ? "bg-purple-50/50 border-purple-200/70"
                : "bg-white/[0.02] border-white/[0.08]"
            }`}
          >
            {project && (
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`font-semibold ${
                    isLight ? "text-purple-700" : "text-purple-300"
                  }`}
                >
                  Project: {project}
                </span>
                {pathway && (
                  <span
                    className={`text-[11px] ${
                      isLight ? "text-slate-500" : "text-[#737A87]"
                    }`}
                  >
                    {pathway}
                  </span>
                )}
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
            aria-label={`View Credential for ${title}`}
          >
            <span>View Credential</span>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </a>
        ) : (
          <button
            id={`btn-inspect-primary-${id}`}
            onClick={() => onView(certificate)}
            className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer border border-white/10"
            aria-label={`Inspect Record for ${title}`}
          >
            <Eye className="w-4 h-4 text-purple-400" />
            <span>Inspect Record</span>
          </button>
        )}

        {/* Secondary Action: Inspect Details Modal (Only when credentialUrl exists, so user can also inspect) */}
        {credentialUrl && (
          <button
            id={`btn-view-${id}`}
            onClick={() => onView(certificate)}
            className={`min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer border shrink-0 ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                : "bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border-white/10"
            }`}
            aria-label={`Inspect Details of ${title}`}
            title="Inspect Details"
          >
            <Eye className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">Details</span>
          </button>
        )}

        {/* Optional Direct Download Action */}
        {fileUrl && (
          <a
            id={`btn-download-${id}`}
            href={fileUrl}
            download={`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-certificate`}
            target="_blank"
            rel="noopener noreferrer"
            className={`min-h-[44px] w-11 rounded-xl inline-flex items-center justify-center transition-all duration-150 cursor-pointer border shrink-0 ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                : "bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border-white/10"
            }`}
            title="Download Document"
            aria-label={`Download document for ${title}`}
          >
            <Download className="w-4 h-4 text-zinc-400" />
          </a>
        )}
      </div>
    </article>
  );
}
