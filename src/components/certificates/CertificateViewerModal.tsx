import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Certificate } from "../../types/certificates";
import ModalPortal from "../common/ModalPortal";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { ProjectMetricsSummary } from "../projects/ProjectMetricsSummary";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CertificateViewerModalProps {
  certificate: Certificate | null;
  certificates?: Certificate[];
  onSelectCertificate?: (certificate: Certificate) => void;
  onClose: () => void;
}

export default function CertificateViewerModal({
  certificate,
  certificates,
  onSelectCertificate,
  onClose,
}: CertificateViewerModalProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [imageError, setImageError] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  useBodyScrollLock(Boolean(certificate));

  const currentIndex = useMemo(() => {
    if (!certificate || !certificates || certificates.length === 0) return -1;
    return certificates.findIndex((c) => c.id === certificate.id);
  }, [certificate, certificates]);

  const canStep = Boolean(
    certificates && certificates.length > 1 && onSelectCertificate && currentIndex !== -1
  );

  const handleStep = (direction: -1 | 1) => {
    if (!canStep || !certificates || !onSelectCertificate) return;
    const nextIdx = (currentIndex + direction + certificates.length) % certificates.length;
    onSelectCertificate(certificates[nextIdx]);
  };

  useEffect(() => {
    if (!certificate) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && canStep && certificates && onSelectCertificate) {
        const nextIdx = (currentIndex - 1 + certificates.length) % certificates.length;
        onSelectCertificate(certificates[nextIdx]);
      } else if (e.key === "ArrowRight" && canStep && certificates && onSelectCertificate) {
        const nextIdx = (currentIndex + 1) % certificates.length;
        onSelectCertificate(certificates[nextIdx]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [certificate, onClose, canStep, certificates, onSelectCertificate, currentIndex]);

  useEffect(() => {
    setZoom(1);
    setCopiedId(false);
    setImageError(false);
    setIsFullscreen(false);
  }, [certificate]);

  const isPdf = Boolean(
    certificate?.pdfUrl ||
      (certificate?.imageUrl && certificate.imageUrl.endsWith(".pdf"))
  );
  const fileUrl = certificate?.imageUrl || certificate?.pdfUrl;

  const cleanModalTitle = (rawTitle: string) => {
    if (!rawTitle) return "";
    const cleaned = rawTitle
      .replace(/^Certificate of Participation\s*[-|:]\s*/i, "")
      .replace(/^Certificate of Completion\s*[-|:]\s*/i, "")
      .replace(/^Certificate of Participation$/i, "")
      .replace(/^Certificate of Completion$/i, "")
      .trim();
    if (!cleaned && certificate?.event) return certificate.event;
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

  const toggleFullscreen = () => {
    const el = document.getElementById("certificate-modal-container");
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  const handleCopyId = () => {
    if (!certificate?.credentialId) return;
    navigator.clipboard.writeText(certificate.credentialId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const allTags =
    certificate?.tags && certificate.tags.length > 0
      ? certificate.tags
      : certificate?.skills || [];

  const displayDescription =
    certificate?.overview ||
    certificate?.fullDescription ||
    certificate?.description;

  const metaCellStyle: React.CSSProperties = {
    backgroundColor: "var(--surface)",
    borderColor: "var(--border)",
  };

  return (
    <AnimatePresence>
      {certificate && (
        <ModalPortal key={certificate.id}>
          <motion.div
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.fast, ease: MOTION_EASE.out }}
            className="certificate-modal-overlay modal-backdrop"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-modal-title"
          >
            <motion.div
              id="certificate-modal-container"
              initial={prefersReduced ? false : { opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.ui, ease: MOTION_EASE.out }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full ${
                isFullscreen
                  ? "h-screen max-w-none rounded-none"
                  : "certificate-modal max-w-3xl rounded-[10px]"
              } border shadow-2xl flex flex-col overflow-hidden`}
              style={{
                backgroundColor: "var(--surface-2)",
                borderColor: "var(--border-strong)",
                color: "var(--text)",
              }}
            >
          {/* Header Bar */}
          <div
            className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b shrink-0"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="min-w-0 flex-1 pr-2">
              <h2
                id="certificate-modal-title"
                className="text-base sm:text-lg font-bold truncate leading-snug font-display"
              >
                {cleanModalTitle(certificate.title)}
              </h2>
              <p className="text-xs font-mono sm:truncate leading-normal mt-0.5 text-[var(--text-muted)]">
                {certificate.issuer} · {certificate.year || certificate.issueDate}
              </p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {canStep && (
                <div
                  className="flex items-center gap-0.5 p-0.5 sm:p-1 rounded-[6px] border"
                  style={{
                    backgroundColor: "var(--surface-2)",
                    borderColor: "var(--border)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleStep(-1)}
                    className="min-w-[34px] min-h-[34px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center rounded cursor-pointer hover:text-[var(--accent)]"
                    title="Previous credential (Left Arrow)"
                    aria-label="Previous credential"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono px-1 tabular-nums text-[var(--text-muted)]">
                    {currentIndex + 1}/{certificates?.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStep(1)}
                    className="min-w-[34px] min-h-[34px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center rounded cursor-pointer hover:text-[var(--accent)]"
                    title="Next credential (Right Arrow)"
                    aria-label="Next credential"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {!isPdf && fileUrl && !imageError && (
                <div
                  className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-[6px] border"
                  style={{
                    backgroundColor: "var(--surface-2)",
                    borderColor: "var(--border)",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="min-w-[34px] min-h-[34px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center rounded cursor-pointer disabled:opacity-30 hover:text-[var(--accent)]"
                    title="Zoom Out"
                    aria-label="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono px-1 sm:px-1.5 tabular-nums">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="min-w-[34px] min-h-[34px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center rounded cursor-pointer disabled:opacity-30 hover:text-[var(--accent)]"
                    title="Zoom In"
                    aria-label="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={toggleFullscreen}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-[6px] border transition-colors cursor-pointer hover:border-[var(--border-strong)]"
                style={{
                  backgroundColor: "var(--surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-[6px] border transition-colors cursor-pointer hover:border-[var(--border-strong)]"
                style={{
                  backgroundColor: "var(--surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
                title="Close modal (Esc)"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div
            onTouchStart={(e) => {
              touchStartXRef.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (!canStep || touchStartXRef.current === null) return;
              const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
              const diff = endX - touchStartXRef.current;
              touchStartXRef.current = null;
              if (Math.abs(diff) > 54 && zoom <= 1) {
                handleStep(diff < 0 ? 1 : -1);
              }
            }}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
          >
            {certificate.imageUrl && !imageError ? (
              <div
                className="relative w-full min-h-[200px] sm:min-h-[260px] max-h-[440px] rounded-[10px] border overflow-auto p-3 sm:p-4 flex items-center justify-center"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={certificate.id}
                    src={certificate.imageUrl}
                    alt={certificate.imageAlt || `${certificate.title} credential document`}
                    referrerPolicy="no-referrer"
                    initial={prefersReduced ? false : { opacity: 0.25 }}
                    animate={{ opacity: 1 }}
                    exit={prefersReduced ? undefined : { opacity: 0.25 }}
                    transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.fast }}
                    style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                    className="max-h-[380px] w-auto object-contain transition-transform duration-150"
                    onError={() => setImageError(true)}
                  />
                </AnimatePresence>
              </div>
            ) : certificate.pdfUrl ? (
              <div
                className="p-5 sm:p-6 rounded-[10px] border flex flex-col items-center justify-center text-center space-y-3"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-[10px] flex items-center justify-center border"
                  style={{
                    backgroundColor: "var(--surface-2)",
                    borderColor: "var(--border)",
                    color: "var(--accent)",
                  }}
                >
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--text)]">
                    Official PDF Document
                  </h4>
                  <p className="text-xs mt-1 text-[var(--text-muted)]">
                    Official PDF document for this achievement is available.
                  </p>
                </div>
                <a
                  href={certificate.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary text-xs"
                >
                  <span>Open PDF in new tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div
                className="p-4 sm:p-5 rounded-[10px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-[8px] flex items-center justify-center border shrink-0"
                    style={{
                      backgroundColor: "var(--surface-2)",
                      borderColor: "var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-[var(--text)]">
                      Verified Credential Record
                    </h4>
                    <p className="text-xs mt-0.5 text-[var(--text-muted)] leading-relaxed">
                      Structured metadata, credential details, and associated links are documented below.
                    </p>
                  </div>
                </div>
                {certificate.credentialUrl && (
                  <a
                    href={certificate.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary text-xs shrink-0"
                  >
                    <span>Verify with Issuer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Structured Information */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold uppercase tracking-wider text-[11px] text-[var(--accent)]">
                    {certificate.category.replace(/S$/, "")}
                  </span>
                  {certificate.credentialType && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-[4px] border font-mono uppercase font-semibold"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border-strong)",
                        color: "var(--text)",
                      }}
                    >
                      {formatCredentialTypeBadge(certificate.credentialType)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono text-[var(--text-muted)]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{certificate.issueDate || certificate.year}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight font-display">
                  {cleanModalTitle(certificate.title)}
                </h3>
                <p className="text-sm sm:text-base font-medium mt-1 text-[var(--text-secondary)]">
                  {certificate.issuer}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {certificate.credentialType && (
                  <div className="p-3 rounded-[8px] border" style={metaCellStyle}>
                    <span className="text-[10px] font-mono uppercase tracking-wider block text-[var(--text-muted)]">
                      Credential Type
                    </span>
                    <span className="text-xs sm:text-sm font-bold mt-1 block truncate text-[var(--text)]">
                      {formatCredentialTypeDisplay(certificate.credentialType)}
                    </span>
                  </div>
                )}

                {certificate.event && (
                  <div className="p-3 rounded-[8px] border" style={metaCellStyle}>
                    <span className="text-[10px] font-mono uppercase tracking-wider block text-[var(--text-muted)]">
                      Event
                    </span>
                    <span className="text-xs sm:text-sm font-bold mt-1 block truncate text-[var(--text)]">
                      {certificate.event}
                    </span>
                  </div>
                )}

                {certificate.format && (
                  <div className="p-3 rounded-[8px] border" style={metaCellStyle}>
                    <span className="text-[10px] font-mono uppercase tracking-wider block text-[var(--text-muted)]">
                      Format
                    </span>
                    <span className="text-xs sm:text-sm font-bold mt-1 block truncate text-[var(--text)]">
                      {certificate.format}
                    </span>
                  </div>
                )}

                {(certificate.date || certificate.year || certificate.issueDate) && (
                  <div className="p-3 rounded-[8px] border" style={metaCellStyle}>
                    <span className="text-[10px] font-mono uppercase tracking-wider block text-[var(--text-muted)]">
                      Date
                    </span>
                    <span className="text-xs sm:text-sm font-bold mt-1 block truncate text-[var(--text)]">
                      {certificate.date || certificate.year || certificate.issueDate}
                    </span>
                  </div>
                )}

                {certificate.venue && (
                  <div className="p-3 rounded-[8px] border" style={metaCellStyle}>
                    <span className="text-[10px] font-mono uppercase tracking-wider block text-[var(--text-muted)]">
                      Venue
                    </span>
                    <span
                      className="text-xs sm:text-sm font-bold mt-1 block truncate text-[var(--text)]"
                      title={certificate.venue}
                    >
                      {certificate.venue}
                    </span>
                  </div>
                )}

                {certificate.organizer && (
                  <div className="p-3 rounded-[8px] border" style={metaCellStyle}>
                    <span className="text-[10px] font-mono uppercase tracking-wider block text-[var(--text-muted)]">
                      Organizer
                    </span>
                    <span className="text-xs sm:text-sm font-bold mt-1 block truncate text-[var(--text)]">
                      {certificate.organizer}
                    </span>
                  </div>
                )}

                {(certificate.coOrganizer || certificate.associatedOrganizer) && (
                  <div className="p-3 rounded-[8px] border" style={metaCellStyle}>
                    <span className="text-[10px] font-mono uppercase tracking-wider block text-[var(--text-muted)]">
                      Associated Organization
                    </span>
                    <span
                      className="text-xs sm:text-sm font-bold mt-1 block truncate text-[var(--text)]"
                      title={certificate.coOrganizer || certificate.associatedOrganizer}
                    >
                      {certificate.coOrganizer || certificate.associatedOrganizer}
                    </span>
                  </div>
                )}

                {(certificate.recipient || certificate.participant) && (
                  <div className="p-3 rounded-[8px] border" style={metaCellStyle}>
                    <span className="text-[10px] font-mono uppercase tracking-wider block text-[var(--text-muted)]">
                      Certificate Holder
                    </span>
                    <span className="text-xs sm:text-sm font-bold mt-1 block truncate text-[var(--text)]">
                      {certificate.recipient || certificate.participant}
                    </span>
                  </div>
                )}

                {certificate.team && (
                  <div
                    className="p-3 rounded-[8px] border"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border-strong)",
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider block text-[var(--accent)]">
                      Team
                    </span>
                    <span className="text-xs sm:text-sm font-bold mt-1 block truncate text-[var(--text)]">
                      {certificate.team}
                    </span>
                  </div>
                )}

                {certificate.role && (
                  <div
                    className="p-3 rounded-[8px] border"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border-strong)",
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider block text-[var(--accent)]">
                      Role
                    </span>
                    <span className="text-xs sm:text-sm font-bold mt-1 block truncate text-[var(--text)]">
                      {certificate.role}
                    </span>
                  </div>
                )}

                {certificate.session && (
                  <div
                    className="p-3 rounded-[8px] border"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border-strong)",
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider block text-[var(--accent)]">
                      Academic Session
                    </span>
                    <span className="text-xs sm:text-sm font-bold mt-1 block truncate text-[var(--text)]">
                      {certificate.session}
                    </span>
                  </div>
                )}
              </div>

              {(certificate.theme ||
                certificate.pathway ||
                (certificate.track && certificate.track !== certificate.format)) && (
                <div
                  className="rounded-[8px] border p-3.5 space-y-1 text-xs"
                  style={metaCellStyle}
                >
                  {certificate.track && certificate.track !== certificate.format && (
                    <div className="leading-relaxed">
                      <span className="font-mono font-semibold text-[var(--accent)]">
                        Track:{" "}
                      </span>
                      <span className="text-[var(--text-secondary)]">
                        {certificate.track}
                      </span>
                    </div>
                  )}
                  {certificate.theme && (
                    <div className="leading-relaxed">
                      <span className="font-mono font-semibold text-[var(--accent)]">
                        Theme:{" "}
                      </span>
                      <span className="text-[var(--text-secondary)]">
                        {certificate.theme}
                      </span>
                    </div>
                  )}
                  {certificate.pathway && (
                    <div className="leading-relaxed">
                      <span className="font-mono font-semibold text-[var(--accent)]">
                        Pathway:{" "}
                      </span>
                      <span className="text-[var(--text-secondary)]">
                        {certificate.pathway}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {displayDescription && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider block text-[var(--text-muted)]">
                    Overview
                  </span>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {displayDescription}
                  </p>
                </div>
              )}

              {certificate.contribution && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider block text-[var(--accent)]">
                    {(certificate.recipient || certificate.participant) &&
                    (certificate.recipient || certificate.participant) !== "Sayam Mukherjee"
                      ? `${certificate.recipient || certificate.participant}'s Contribution`
                      : "Individual Contribution"}
                  </span>
                  <div
                    className="p-3.5 rounded-[8px] border text-sm leading-relaxed text-[var(--text)]"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border-strong)",
                    }}
                  >
                    {certificate.contribution}
                  </div>
                </div>
              )}

              {certificate.metrics && (
                <div className="pt-1">
                  <ProjectMetricsSummary
                    metrics={certificate.metrics}
                    projectName={certificate.project || certificate.title}
                  />
                </div>
              )}

              {certificate.teamMembers && certificate.teamMembers.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider block text-[var(--text-muted)]">
                    Team Members ({certificate.team || "Team"})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {certificate.teamMembers.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] border text-xs font-sans text-[var(--text)]"
                        style={metaCellStyle}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: "var(--accent)" }}
                        />
                        <span className="font-medium">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {certificate.signatories && certificate.signatories.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider block text-[var(--text-muted)]">
                    Authorized Signatories
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {certificate.signatories.map((sig, idx) => {
                      let name = typeof sig === "string" ? sig : (sig as any).name || "";
                      let designation =
                        typeof sig === "string" ? "" : (sig as any).designation || "";
                      if (typeof sig === "string" && sig.includes(",")) {
                        const parts = sig.split(/,\s*(.+)/);
                        name = parts[0];
                        designation = parts[1];
                      }
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 px-3 py-2 rounded-[6px] border text-xs font-sans text-[var(--text)]"
                          style={metaCellStyle}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: "#69734A" }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium truncate">{name}</span>
                            {designation && (
                              <span className="text-[11px] truncate text-[var(--text-muted)]">
                                {designation}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {certificate.associatedProjects && certificate.associatedProjects.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider block text-[var(--accent)]">
                    Associated Team Projects ({certificate.team || "Team Project"})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {certificate.associatedProjects.map((p, idx) => (
                      <a
                        key={idx}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-[8px] border flex flex-col justify-between group transition-colors cursor-pointer hover:border-[var(--border-strong)]"
                        style={metaCellStyle}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-xs sm:text-sm text-[var(--text)] group-hover:text-[var(--accent)]">
                            {p.name}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                        </div>
                        {p.description && (
                          <p className="text-[11px] mt-1 leading-relaxed text-[var(--text-muted)]">
                            {p.description}
                          </p>
                        )}
                        <span className="text-[10px] font-mono text-[var(--accent)] mt-2 truncate">
                          {p.url.replace(/^https?:\/\//, "")}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {certificate.subjects && certificate.subjects.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider block text-[var(--text-muted)]">
                      Subjects / Courses
                    </span>
                    <span
                      className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] border"
                      style={metaCellStyle}
                    >
                      {certificate.subjects.length} Subjects
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                    {certificate.subjects.map((subject, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-[6px] border text-xs sm:text-sm font-sans"
                        style={metaCellStyle}
                      >
                        <span className="font-mono text-[var(--accent)] font-bold text-xs shrink-0 w-5 select-none">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="font-medium text-[var(--text)]">{subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {allTags.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider block text-[var(--text-muted)]">
                    Relevant Topics &amp; Competencies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-2.5 py-1 rounded-[4px] border text-[var(--text-secondary)]"
                        style={metaCellStyle}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {certificate.credentialId && (
                <div
                  className="flex items-center justify-between p-3 rounded-[8px] border text-xs font-mono"
                  style={metaCellStyle}
                >
                  <div className="flex items-center gap-2 text-[var(--text)]">
                    <Hash className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>ID: {certificate.credentialId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="flex items-center gap-1.5 text-[var(--accent)] hover:underline cursor-pointer font-mono font-semibold"
                  >
                    {copiedId ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId ? "Copied" : "Copy ID"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div
            className="px-4 sm:px-6 py-3 sm:py-4 border-t flex flex-wrap items-center justify-between gap-2.5 shrink-0"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary text-xs sm:text-sm"
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
                  className="btn btn-secondary text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              )}

              {certificate.credentialUrl && (
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary text-xs sm:text-sm"
                >
                  <span>Verify with Issuer</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
            </motion.div>
          </motion.div>
        </ModalPortal>
      )}
    </AnimatePresence>
  );
}
