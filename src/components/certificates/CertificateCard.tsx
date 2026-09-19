import React from "react";
import { Certificate } from "../../types/certificates";
import { usePortfolio } from "../../context/PortfolioContext";
import { 
  Award, ExternalLink, Eye, FileText, CheckCircle2, 
  Link as LinkIcon, ShieldAlert, Star, Edit3, Trash2,
  Calendar, Hash, Sparkles, Download
} from "lucide-react";

interface CertificateCardProps {
  certificate: Certificate;
  onView: (cert: Certificate) => void;
  onEdit?: (cert: Certificate) => void;
  onDelete?: (id: string) => void;
  onToggleFeatured?: (cert: Certificate) => void;
  isOwner?: boolean;
}

export default function CertificateCard({
  certificate,
  onView,
  onEdit,
  onDelete,
  onToggleFeatured,
  isOwner = false,
}: CertificateCardProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";
  const [imageError, setImageError] = React.useState(false);

  const {
    id,
    title,
    issuer,
    category,
    description,
    issueDate,
    credentialId,
    credentialUrl,
    skills = [],
    imageUrl,
    pdfUrl,
    verificationStatus,
    featured
  } = certificate;

  // Verification Badge
  const renderVerificationBadge = () => {
    switch (verificationStatus) {
      case "VERIFIED":
        return (
          <span 
            className={`inline-flex items-center gap-1 text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border transition-colors ${
              isLight 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-emerald-950/40 text-emerald-300 border-emerald-800/40"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Verified
          </span>
        );
      case "LINK AVAILABLE":
        return (
          <span 
            className={`inline-flex items-center gap-1 text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border transition-colors ${
              isLight 
                ? "bg-cyan-50 text-cyan-700 border-cyan-200" 
                : "bg-cyan-950/40 text-cyan-300 border-cyan-800/40"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-cyan-500" />
            Link Available
          </span>
        );
      default:
        return (
          <span 
            className={`inline-flex items-center gap-1 text-xs font-mono font-medium px-2.5 py-0.5 rounded-full border transition-colors ${
              isLight 
                ? "bg-slate-100 text-slate-500 border-slate-200" 
                : "bg-zinc-900/80 text-zinc-400 border-zinc-800/70"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
            No verification link
          </span>
        );
    }
  };

  // Category Badge Styles
  const getCategoryBadgeStyle = () => {
    switch (category) {
      case "CERTIFICATIONS":
        return isLight
          ? "bg-purple-50 text-purple-700 border-purple-200"
          : "bg-purple-950/40 text-purple-300 border-purple-800/40";
      case "COMPETITIONS":
        return isLight
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-amber-950/40 text-amber-300 border-amber-800/40";
      case "ACHIEVEMENTS":
        return isLight
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-blue-950/40 text-blue-300 border-blue-800/40";
      case "COURSES":
        return isLight
          ? "bg-teal-50 text-teal-700 border-teal-200"
          : "bg-teal-950/40 text-teal-300 border-teal-800/40";
      case "WORKSHOPS":
        return isLight
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : "bg-rose-950/40 text-rose-300 border-rose-800/40";
      default:
        return isLight
          ? "bg-slate-100 text-slate-700 border-slate-200"
          : "bg-zinc-900 text-zinc-300 border-zinc-800";
    }
  };

  // Helper to extract clean initials / monogram from issuer
  const getIssuerMonogram = (name: string) => {
    if (!name) return "CERT";
    if (name.includes("IIT")) return "IIT";
    if (name.includes("Ministry") || name.includes("Govt")) return "GOI";
    if (name.includes("KIIT")) return "KIIT";
    if (name.includes("CBSE")) return "CBSE";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
    return parts.map(p => p[0]).slice(0, 3).join("").toUpperCase();
  };

  const fileUrl = imageUrl || pdfUrl;

  return (
    <div
      id={`cert-card-${id}`}
      className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full ${
        isLight
          ? "bg-white border-slate-200/90 hover:border-purple-300 shadow-[0_4px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_36px_rgba(109,40,217,0.08)]"
          : "bg-[#0c0c14] border-zinc-800/80 hover:border-zinc-700 shadow-lg hover:shadow-[0_16px_36px_rgba(0,0,0,0.6)]"
      }`}
    >
      {/* Featured Star Subtle Glow */}
      {featured && (
        <div 
          className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl pointer-events-none ${
            isLight ? "bg-amber-400/15" : "bg-amber-500/15"
          }`} 
        />
      )}

      {/* Main Card Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Top Header Row: Category Badge + Status & Featured Pills */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className={`text-[10px] font-mono tracking-wider uppercase font-bold px-2.5 py-0.5 rounded-md border ${getCategoryBadgeStyle()}`}>
            {category}
          </span>
          
          <div className="flex items-center gap-1.5 shrink-0">
            {featured && (
              <span 
                className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                  isLight
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-amber-950/30 text-amber-400 border-amber-800/40"
                }`}
                title="Featured Credential"
              >
                <Star className="w-2.5 h-2.5 fill-current" />
                FEATURED
              </span>
            )}
            {renderVerificationBadge()}
          </div>
        </div>

        {/* Credential Visual Preview Frame */}
        <div
          onClick={() => onView(certificate)}
          className={`relative w-full h-44 mb-4 rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 flex items-center justify-center ${
            isLight
              ? "bg-slate-50 border-slate-200 group-hover:border-purple-300"
              : "bg-[#08080d] border-zinc-800/80 group-hover:border-zinc-700"
          }`}
        >
          {imageUrl && !imageError ? (
            /* High-res Image Preview */
            <img
              src={imageUrl}
              alt={`Official Certificate Credential: ${title} issued by ${issuer}`}
              width={360}
              height={220}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-contain p-2.5 group-hover:scale-105 transition-transform duration-300"
            />
          ) : pdfUrl ? (
            /* Official PDF Document Badge */
            <div className="flex flex-col items-center justify-center text-center p-4 space-y-2">
              <div 
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${
                  isLight ? "bg-red-50 text-red-600 border border-red-200" : "bg-red-950/40 text-red-400 border border-red-800/50"
                }`}
              >
                <FileText className="w-6 h-6" />
              </div>
              <span className={`text-xs font-mono font-semibold ${isLight ? "text-slate-800" : "text-zinc-200"}`}>
                PDF Certificate Document
              </span>
              <span className={`text-[10px] font-mono ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
                Click to inspect document
              </span>
            </div>
          ) : (
            /* Credential Crest Plaque for Verified Records without file */
            <div className="relative w-full h-full p-4 flex flex-col justify-between overflow-hidden select-none">
              {/* Geometric Archival Background Pattern */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: isLight
                    ? "radial-gradient(#6d28d9 1px, transparent 1px)"
                    : "radial-gradient(#a855f7 1px, transparent 1px)",
                  backgroundSize: "14px 14px"
                }}
              />
              
              {/* Ambient Corner Accent */}
              <div 
                className={`absolute -top-12 -left-12 w-28 h-28 rounded-full blur-xl pointer-events-none ${
                  category === "COMPETITIONS"
                    ? isLight ? "bg-amber-400/20" : "bg-amber-600/15"
                    : category === "ACHIEVEMENTS"
                    ? isLight ? "bg-blue-400/20" : "bg-blue-600/15"
                    : isLight ? "bg-purple-400/20" : "bg-purple-600/15"
                }`}
              />

              {/* Plaque Header: Monogram & Credential Seal */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shadow-sm border ${
                      isLight 
                        ? "bg-white text-slate-900 border-slate-200 shadow-sm" 
                        : "bg-zinc-900 text-white border-zinc-750"
                    }`}
                  >
                    {getIssuerMonogram(issuer)}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
                      {issuer.split(",")[0].slice(0, 24)}
                    </span>
                    <span className={`text-[9px] font-mono ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                      Verified Milestone • {issueDate}
                    </span>
                  </div>
                </div>

                <div 
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                    isLight 
                      ? "bg-purple-50 text-purple-700 border-purple-200" 
                      : "bg-purple-950/50 text-purple-300 border-purple-800/50"
                  }`}
                >
                  ACCREDITED
                </div>
              </div>

              {/* Plaque Center: Title & Recipient */}
              <div className="relative z-10 my-auto py-1">
                <p className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                  CONFERRED UPON
                </p>
                <p className={`text-xs font-semibold font-display tracking-tight mt-0.5 ${isLight ? "text-slate-900" : "text-white"}`}>
                  Sayam Mukherjee
                </p>
                <p className={`text-xs font-bold line-clamp-1 mt-1 font-display ${isLight ? "text-purple-700" : "text-purple-300"}`}>
                  {title}
                </p>
              </div>

              {/* Plaque Footer: Credential ID & Watermark */}
              <div className="relative z-10 flex items-center justify-between pt-1 border-t border-dashed border-zinc-700/20 text-[9px] font-mono">
                <span className={`truncate max-w-[170px] ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  ID: {credentialId || "VERIFIED-RECORD"}
                </span>
                <span className={`font-semibold ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>
                  AUTHENTICATED
                </span>
              </div>
            </div>
          )}

          {/* Quick Inspection Hover Overlay */}
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono text-white bg-zinc-900/90 border border-zinc-700 px-3.5 py-1.5 rounded-lg shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inspect Credential</span>
            </span>
          </div>
        </div>

        {/* Certificate Metadata Section */}
        <div className="space-y-2 mb-3">
          <h3 
            onClick={() => onView(certificate)}
            className={`text-base font-bold transition-colors line-clamp-2 leading-snug font-display cursor-pointer ${
              isLight 
                ? "text-slate-900 group-hover:text-purple-700" 
                : "text-zinc-100 group-hover:text-white"
            }`}
          >
            {title}
          </h3>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className={`font-semibold truncate max-w-[200px] ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
              {issuer}
            </span>
            <span className={`shrink-0 text-[11px] ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
              {issueDate}
            </span>
          </div>

          {credentialId && (
            <div className={`flex items-center gap-1 text-[11px] font-mono ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              <Hash className="w-3 h-3 shrink-0 opacity-60" />
              <span className="truncate">ID: {credentialId}</span>
            </div>
          )}

          {description && (
            <p className={`text-xs line-clamp-2 leading-relaxed pt-0.5 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
              {description}
            </p>
          )}
        </div>

        {/* Demonstrated Skills Chips */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isLight
                    ? "bg-slate-100 text-slate-700 border-slate-200"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800"
                }`}
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                +{skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div 
        className={`px-5 py-3.5 border-t flex flex-col gap-2.5 ${
          isLight 
            ? "bg-slate-50/70 border-slate-200/80" 
            : "bg-[#09090e]/80 border-zinc-850/80"
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Inspect / View Button */}
          <button
            id={`btn-view-${id}`}
            onClick={() => onView(certificate)}
            className="btn btn-secondary !py-2 !px-3 !text-xs flex-1 inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-500" />
            <span>Inspect</span>
          </button>

          {/* Verify Link Button (if credentialUrl exists) */}
          {credentialUrl && (
            <a
              id={`btn-verify-${id}`}
              href={credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary !py-2 !px-3 !text-xs flex-1 inline-flex items-center justify-center gap-1.5 cursor-pointer"
              title="Verify credential on official registry"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Verify</span>
            </a>
          )}

          {/* Download Button (if fileUrl exists) */}
          {fileUrl && (
            <a
              id={`btn-download-${id}`}
              href={fileUrl}
              download={`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-certificate`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary !p-2 !text-xs cursor-pointer inline-flex items-center justify-center"
              title="Download Credential Document"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Owner Management Controls (Visible only when authenticated) */}
        {isOwner && (
          <div className={`flex items-center justify-between gap-2 pt-2 border-t text-xs ${isLight ? "border-slate-200" : "border-zinc-850"}`}>
            <button
              onClick={() => onToggleFeatured?.(certificate)}
              className={`flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded border transition-colors cursor-pointer ${
                featured 
                  ? isLight
                    ? "bg-amber-50 text-amber-700 border-amber-300 font-bold"
                    : "bg-amber-950/40 text-amber-300 border-amber-800/40 font-bold"
                  : isLight
                    ? "bg-white text-slate-600 border-slate-200 hover:text-slate-900"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
              }`}
              title={featured ? "Unfeature credential" : "Feature on homepage spotlight"}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>{featured ? "Featured" : "Feature"}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEdit?.(certificate)}
                className={`p-1.5 rounded border transition-colors cursor-pointer ${
                  isLight
                    ? "text-slate-700 hover:text-purple-700 bg-white hover:bg-slate-100 border-slate-300"
                    : "text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border-zinc-800"
                }`}
                title="Edit Certificate Details"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete?.(id)}
                className={`p-1.5 rounded border transition-colors cursor-pointer ${
                  isLight
                    ? "text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border-red-200"
                    : "text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border-red-900/40"
                }`}
                title="Delete Certificate"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
