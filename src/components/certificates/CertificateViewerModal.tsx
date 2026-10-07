import React, { useState, useEffect } from "react";
import { Certificate } from "../../types/certificates";
import { usePortfolio } from "../../context/PortfolioContext";
import ModalPortal from "../common/ModalPortal";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { ProjectMetricsSummary } from "../projects/ProjectMetricsSummary";
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ExternalLink,
  Download,
  FileText,
  Calendar,
  Hash,
  Copy,
  Check,
  Building2,
  Layers,
  Sparkles,
} from "lucide-react";

interface CertificateViewerModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export default function CertificateViewerModal({
  certificate,
  onClose,
}: CertificateViewerModalProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Lock background page scroll without layout jump
  useBodyScrollLock(Boolean(certificate));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Reset zoom & copy state whenever a new certificate is opened
  useEffect(() => {
    setZoom(1);
    setCopiedId(false);
    setImageError(false);
  }, [certificate]);

  if (!certificate) return null;

  const isPdf = Boolean(
    certificate.pdfUrl ||
      (certificate.imageUrl && certificate.imageUrl.endsWith(".pdf"))
  );
  const fileUrl = certificate.imageUrl || certificate.pdfUrl;

  const cleanModalTitle = (rawTitle: string) => {
    if (!rawTitle) return "";
    const cleaned = rawTitle
      .replace(/^Certificate of Participation\s*[-|:]\s*/i, "")
      .replace(/^Certificate of Completion\s*[-|:]\s*/i, "")
      .replace(/^Certificate of Participation$/i, "")
      .replace(/^Certificate of Completion$/i, "")
      .trim();
    if (!cleaned && certificate.event) return certificate.event;
    return cleaned || rawTitle;
  };

  const formatCredentialTypeDisplay = (type?: string) => {
    if (!type) return "";
    if (type.toLowerCase() === "certificate of participation") return "Participation";
    if (type.toLowerCase() === "certificate of completion") return "Completion";
    return type.replace(/^Certificate of\s+/i, "");
  };

  const formatCredentialTypeBadge = (type?: string) => {
    if (!type) return "";
    if (type.toLowerCase() === "certificate of participation") return "PARTICIPATION";
    if (type.toLowerCase() === "certificate of completion") return "COMPLETION";
    return type.replace(/^Certificate of\s+/i, "").toUpperCase();
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const toggleFullscreen = () => {
    const el = document.getElementById("certificate-modal-container");
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  const handleCopyId = () => {
    if (!certificate.credentialId) return;
    navigator.clipboard.writeText(certificate.credentialId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const allTags =
    certificate.tags && certificate.tags.length > 0
      ? certificate.tags
      : certificate.skills || [];

  const displayDescription =
    certificate.fullDescription || certificate.description;

  return (
    <ModalPortal>
      <div
        className="certificate-modal-overlay modal-backdrop"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-modal-title"
      >
        <div
          id="certificate-modal-container"
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full ${
            isFullscreen
              ? "h-screen max-w-none rounded-none"
              : "certificate-modal max-w-3xl"
          } border shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
            isLight
              ? "bg-white border-slate-200 text-slate-900 shadow-[0_25px_60px_rgba(15,23,42,0.18)]"
              : "bg-[#111318] border-white/10 text-white shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
          }`}
        >
          {/* Top Header Bar */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
              isLight
                ? "bg-slate-50/90 border-slate-200"
                : "bg-[#161920] border-white/10"
            }`}
          >
            <div className="truncate pr-4">
              <h2
                id="certificate-modal-title"
                className="text-base sm:text-lg font-bold truncate leading-snug font-sans"
              >
                {cleanModalTitle(certificate.title)}
              </h2>
              <p
                className={`text-xs font-sans truncate ${
                  isLight ? "text-slate-500" : "text-[#A7ADB8]"
                }`}
              >
                {certificate.issuer} · {certificate.issueDate}
                {certificate.platform ? ` · ${certificate.platform}` : ""}
              </p>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Zoom Controls for Images */}
              {!isPdf && fileUrl && !imageError && (
                <div
                  className={`hidden sm:flex items-center gap-1 p-1 rounded-lg border ${
                    isLight
                      ? "bg-white border-slate-200"
                      : "bg-white/[0.05] border-white/10"
                  }`}
                >
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="p-1 rounded cursor-pointer disabled:opacity-30 hover:text-purple-400"
                    title="Zoom Out"
                    aria-label="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono px-1">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="p-1 rounded cursor-pointer disabled:opacity-30 hover:text-purple-400"
                    title="Zoom In"
                    aria-label="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isLight
                    ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-700"
                    : "bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-zinc-300"
                }`}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isLight
                    ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-700"
                    : "bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-zinc-300"
                }`}
                title="Close modal (Esc)"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Visual Media Viewer (if available) */}
            {certificate.imageUrl && !imageError ? (
              <div
                className={`relative w-full min-h-[260px] max-h-[440px] rounded-2xl border overflow-auto p-4 flex items-center justify-center ${
                  isLight
                    ? "bg-slate-50 border-slate-200"
                    : "bg-black/30 border-white/10"
                }`}
              >
                <img
                  src={certificate.imageUrl}
                  alt={`${certificate.title} credential document`}
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                  className="max-h-[380px] w-auto object-contain transition-transform duration-150"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : certificate.pdfUrl ? (
              <div
                className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center space-y-3 ${
                  isLight
                    ? "bg-slate-50 border-slate-200"
                    : "bg-white/[0.02] border-white/10"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                    isLight
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-red-950/40 text-red-400 border-red-800/40"
                  }`}
                >
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    Official PDF Document
                  </h4>
                  <p
                    className={`text-xs mt-1 ${
                      isLight ? "text-slate-500" : "text-[#737A87]"
                    }`}
                  >
                    Direct PDF document for this achievement is available.
                  </p>
                </div>
                <a
                  href={certificate.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                >
                  <span>Open PDF in new tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : null}

            {/* Structured Information Panel */}
            <div className="space-y-4">
              {/* Category, Year & Subtle Credential Type Pill */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold uppercase tracking-wider text-[11px] ${
                      isLight ? "text-purple-600" : "text-purple-400"
                    }`}
                  >
                    {certificate.category.replace(/S$/, "")}
                  </span>
                  {certificate.credentialType && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-sans uppercase font-semibold ${
                        isLight
                          ? "bg-purple-100 text-purple-700"
                          : "bg-purple-950/40 text-purple-300 border border-purple-800/40"
                      }`}
                    >
                      {formatCredentialTypeBadge(certificate.credentialType)}
                    </span>
                  )}
                </div>

                <div
                  className={`flex items-center gap-2 ${
                    isLight ? "text-slate-500" : "text-[#A7ADB8]"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{certificate.issueDate}</span>
                  {certificate.platform && (
                    <>
                      <span>·</span>
                      <span>Platform: {certificate.platform}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Title & Issuer */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {cleanModalTitle(certificate.title)}
                </h3>
                <p
                  className={`text-sm sm:text-base font-medium mt-1 ${
                    isLight ? "text-slate-700" : "text-zinc-300"
                  }`}
                >
                  {certificate.issuer}
                </p>
              </div>

              {/* Structured Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {certificate.credentialType && (
                  <div
                    className={`p-3 rounded-xl border ${
                      isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-white/[0.02] border-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider block ${
                        isLight ? "text-slate-500" : "text-[#737A87]"
                      }`}
                    >
                      Credential Type
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold mt-1 block truncate ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {formatCredentialTypeDisplay(certificate.credentialType)}
                    </span>
                  </div>
                )}

                {certificate.event && (
                  <div
                    className={`p-3 rounded-xl border ${
                      isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-white/[0.02] border-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider block ${
                        isLight ? "text-slate-500" : "text-[#737A87]"
                      }`}
                    >
                      Event
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold mt-1 block truncate ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {certificate.event}
                    </span>
                  </div>
                )}

                {certificate.format && (
                  <div
                    className={`p-3 rounded-xl border ${
                      isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-white/[0.02] border-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider block ${
                        isLight ? "text-slate-500" : "text-[#737A87]"
                      }`}
                    >
                      Format
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold mt-1 block truncate ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {certificate.format}
                    </span>
                  </div>
                )}

                {(certificate.date || certificate.year || certificate.issueDate) && (
                  <div
                    className={`p-3 rounded-xl border ${
                      isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-white/[0.02] border-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider block ${
                        isLight ? "text-slate-500" : "text-[#737A87]"
                      }`}
                    >
                      Date
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold mt-1 block truncate ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {certificate.date || certificate.year || certificate.issueDate}
                    </span>
                  </div>
                )}

                {certificate.venue && (
                  <div
                    className={`p-3 rounded-xl border ${
                      isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-white/[0.02] border-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider block ${
                        isLight ? "text-slate-500" : "text-[#737A87]"
                      }`}
                    >
                      Venue
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold mt-1 block truncate ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                      title={certificate.venue}
                    >
                      {certificate.venue}
                    </span>
                  </div>
                )}

                {certificate.organizer && (
                  <div
                    className={`p-3 rounded-xl border ${
                      isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-white/[0.02] border-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider block ${
                        isLight ? "text-slate-500" : "text-[#737A87]"
                      }`}
                    >
                      Organizer
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold mt-1 block truncate ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {certificate.organizer}
                    </span>
                  </div>
                )}

                {certificate.participant && (
                  <div
                    className={`p-3 rounded-xl border ${
                      isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-white/[0.02] border-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider block ${
                        isLight ? "text-slate-500" : "text-[#737A87]"
                      }`}
                    >
                      Participant
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold mt-1 block truncate ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {certificate.participant}
                    </span>
                  </div>
                )}

                {certificate.team && (
                  <div
                    className={`p-3 rounded-xl border ${
                      isLight
                        ? "bg-purple-50/50 border-purple-200/80"
                        : "bg-purple-950/20 border-purple-800/40"
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider block ${
                        isLight ? "text-purple-700" : "text-purple-400"
                      }`}
                    >
                      Team
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold mt-1 block truncate ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {certificate.team}
                    </span>
                  </div>
                )}

                {certificate.role && (
                  <div
                    className={`p-3 rounded-xl border ${
                      isLight
                        ? "bg-purple-50/50 border-purple-200/80"
                        : "bg-purple-950/20 border-purple-800/40"
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider block ${
                        isLight ? "text-purple-700" : "text-purple-400"
                      }`}
                    >
                      Role
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold mt-1 block truncate ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {certificate.role}
                    </span>
                  </div>
                )}

                {certificate.project && (
                  <div
                    className={`p-3 rounded-xl border ${
                      isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-white/[0.02] border-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider block ${
                        isLight ? "text-slate-500" : "text-[#737A87]"
                      }`}
                    >
                      Project
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold mt-1 block truncate ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {certificate.project}
                    </span>
                  </div>
                )}

                {certificate.track && (
                  <div
                    className={`p-3 rounded-xl border ${
                      isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-white/[0.02] border-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider block ${
                        isLight ? "text-slate-500" : "text-[#737A87]"
                      }`}
                    >
                      Track
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold mt-1 block truncate ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {certificate.track}
                    </span>
                  </div>
                )}

                {certificate.session && (
                  <div
                    className={`p-3 rounded-xl border ${
                      isLight
                        ? "bg-purple-50/60 border-purple-200/80"
                        : "bg-purple-950/20 border-purple-800/30"
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider block ${
                        isLight ? "text-purple-700" : "text-purple-400"
                      }`}
                    >
                      Academic Session
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold mt-1 block truncate ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {certificate.session}
                    </span>
                  </div>
                )}
              </div>

              {/* Research Theme / Pathway Highlight (e.g. for Memory in Motion) */}
              {(certificate.theme || certificate.pathway) && (
                <div
                  className={`rounded-xl border p-3.5 space-y-1 text-xs ${
                    isLight
                      ? "bg-purple-50/40 border-purple-200"
                      : "bg-white/[0.02] border-white/[0.08]"
                  }`}
                >
                  {certificate.theme && (
                    <div className="leading-relaxed">
                      <span className="font-semibold text-purple-400">Theme: </span>
                      <span className={isLight ? "text-slate-700" : "text-[#A7ADB8]"}>
                        {certificate.theme}
                      </span>
                    </div>
                  )}
                  {certificate.pathway && (
                    <div className="leading-relaxed">
                      <span className="font-semibold text-purple-400">Pathway: </span>
                      <span className={isLight ? "text-slate-700" : "text-[#A7ADB8]"}>
                        {certificate.pathway}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {displayDescription && (
                <div className="space-y-1.5">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider block ${
                      isLight ? "text-slate-500" : "text-[#737A87]"
                    }`}
                  >
                    Overview
                  </span>
                  <p
                    className={`text-sm leading-relaxed ${
                      isLight ? "text-slate-600" : "text-[#A7ADB8]"
                    }`}
                  >
                    {displayDescription}
                  </p>
                </div>
              )}

              {/* My Contribution (only in expanded details) */}
              {certificate.contribution && (
                <div className="space-y-1.5 pt-1">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider block ${
                      isLight ? "text-purple-700" : "text-purple-400"
                    }`}
                  >
                    My Contribution
                  </span>
                  <div
                    className={`p-3.5 rounded-xl border text-sm leading-relaxed ${
                      isLight
                        ? "bg-purple-50/50 border-purple-200/80 text-slate-800"
                        : "bg-purple-950/20 border-purple-800/40 text-zinc-200"
                    }`}
                  >
                    {certificate.contribution}
                  </div>
                </div>
              )}

              {/* Technical Effort & Metrics Summary (e.g. for OPERON) */}
              {certificate.metrics && (
                <div className="pt-1">
                  <ProjectMetricsSummary
                    metrics={certificate.metrics}
                    projectName={certificate.project || certificate.title}
                  />
                </div>
              )}

              {/* Team Members */}
              {certificate.teamMembers && certificate.teamMembers.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider block ${
                      isLight ? "text-slate-500" : "text-[#737A87]"
                    }`}
                  >
                    Team Members ({certificate.team || "Team"})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {certificate.teamMembers.map((member, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-sans ${
                          isLight
                            ? "bg-slate-50 border-slate-200 text-slate-800"
                            : "bg-white/[0.02] border-white/[0.07] text-zinc-200"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span className="font-medium">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Authorized Signatories */}
              {certificate.signatories && certificate.signatories.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider block ${
                      isLight ? "text-slate-500" : "text-[#737A87]"
                    }`}
                  >
                    Authorized Signatories
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {certificate.signatories.map((sig, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-sans ${
                          isLight
                            ? "bg-slate-50 border-slate-200 text-slate-800"
                            : "bg-white/[0.02] border-white/[0.07] text-zinc-200"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="font-medium">{sig}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Associated Team Projects */}
              {certificate.associatedProjects && certificate.associatedProjects.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider block ${
                      isLight ? "text-purple-700" : "text-purple-400"
                    }`}
                  >
                    Associated Team Projects ({certificate.team || "Team Project"})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {certificate.associatedProjects.map((p, idx) => (
                      <a
                        key={idx}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-xl border flex flex-col justify-between group transition-all duration-150 cursor-pointer ${
                          isLight
                            ? "bg-purple-50/40 hover:bg-purple-50/80 border-purple-200/80 hover:border-purple-300"
                            : "bg-purple-950/20 hover:bg-purple-950/40 border-purple-800/30 hover:border-purple-700/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-semibold text-xs sm:text-sm ${
                            isLight ? "text-purple-900 group-hover:text-purple-700" : "text-purple-200 group-hover:text-white"
                          }`}>
                            {p.name}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                        </div>
                        {p.description && (
                          <p className={`text-[11px] mt-1 leading-relaxed ${
                            isLight ? "text-slate-600" : "text-zinc-400"
                          }`}>
                            {p.description}
                          </p>
                        )}
                        <span className="text-[10px] font-mono text-purple-500 mt-2 truncate">
                          {p.url.replace(/^https?:\/\//, "")}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Subjects / Courses (Clean two-column grid on desktop, single on mobile) */}
              {certificate.subjects && certificate.subjects.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider block ${
                        isLight ? "text-slate-500" : "text-[#737A87]"
                      }`}
                    >
                      Subjects / Courses
                    </span>
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                        isLight
                          ? "bg-slate-100 text-slate-600"
                          : "bg-white/[0.06] text-zinc-400"
                      }`}
                    >
                      {certificate.subjects.length} Subjects
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                    {certificate.subjects.map((subject, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-sans transition-colors ${
                          isLight
                            ? "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70"
                            : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="font-mono text-purple-400 font-bold text-xs shrink-0 w-5 select-none">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-medium ${
                            isLight ? "text-slate-800" : "text-zinc-200"
                          }`}
                        >
                          {subject}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags / Competencies */}
              {allTags.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider block ${
                      isLight ? "text-slate-500" : "text-[#737A87]"
                    }`}
                  >
                    Relevant Topics &amp; Competencies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-3 py-1.5 rounded-lg border ${
                          isLight
                            ? "bg-slate-100 border-slate-200 text-slate-700"
                            : "bg-white/[0.05] border-white/[0.08] text-zinc-300"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Credential ID / Verification Record */}
              {certificate.credentialId && (
                <div
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-700"
                      : "bg-white/[0.02] border-white/[0.06] text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-purple-400" />
                    <span>ID: {certificate.credentialId}</span>
                  </div>
                  <button
                    onClick={handleCopyId}
                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 cursor-pointer font-sans"
                  >
                    {copiedId ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId ? "Copied" : "Copy ID"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div
            className={`px-6 py-4 border-t flex items-center justify-between gap-3 shrink-0 ${
              isLight
                ? "bg-slate-50 border-slate-200"
                : "bg-[#161920] border-white/10"
            }`}
          >
            <button
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                isLight
                  ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                  : "bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border-white/10"
              }`}
            >
              Close
            </button>

            <div className="flex items-center gap-2.5">
              {fileUrl && (
                <a
                  href={fileUrl}
                  download={`${certificate.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-certificate`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border inline-flex items-center gap-2 transition-colors cursor-pointer ${
                    isLight
                      ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                      : "bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border-white/10"
                  }`}
                >
                  <Download className="w-4 h-4 text-zinc-400" />
                  <span>Download</span>
                </a>
              )}

              {certificate.credentialUrl && (
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>View Credential</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
