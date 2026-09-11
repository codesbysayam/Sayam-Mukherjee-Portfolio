import React, { useState, useEffect } from "react";
import { Certificate } from "../../types/certificates";
import { usePortfolio } from "../../context/PortfolioContext";
import ModalPortal from "../common/ModalPortal";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { 
  X, ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, 
  ExternalLink, Download, FileText, CheckCircle2, ShieldCheck, 
  Award, Calendar, Hash, Copy, Check, Sparkles, Building2
} from "lucide-react";

interface CertificateViewerModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export default function CertificateViewerModal({ certificate, onClose }: CertificateViewerModalProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fitToScreen, setFitToScreen] = useState(true);
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
    setFitToScreen(true);
    setCopiedId(false);
    setImageError(false);
  }, [certificate]);

  if (!certificate) return null;

  const isPdf = Boolean(certificate.pdfUrl || (certificate.imageUrl && certificate.imageUrl.endsWith(".pdf")));
  const fileUrl = certificate.imageUrl || certificate.pdfUrl;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setFitToScreen(true);
  };

  const toggleFullscreen = () => {
    const el = document.getElementById("certificate-modal-container");
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleCopyId = () => {
    if (!certificate.credentialId) return;
    navigator.clipboard.writeText(certificate.credentialId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

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
            isFullscreen ? "h-screen max-w-none rounded-none" : "certificate-modal max-w-4xl"
          } border shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
            isLight 
              ? "bg-white border-slate-200 text-slate-900 shadow-[0_25px_60px_rgba(15,23,42,0.18)]" 
              : "bg-[#0c0c14] border-zinc-800 text-white shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
          }`}
        >
          {/* Top Control Header Bar */}
          <div 
            className={`flex items-center justify-between px-5 py-3.5 border-b shrink-0 ${
              isLight ? "bg-slate-50/90 border-slate-200" : "bg-[#08080d]/90 border-zinc-800"
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden min-w-0 pr-2">
              <div 
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  isLight 
                    ? "bg-purple-50 border-purple-200 text-purple-700" 
                    : "bg-purple-950/40 border-purple-800/50 text-purple-400"
                }`}
              >
                {isPdf ? <FileText className="w-4 h-4 text-red-500" /> : <Award className="w-4 h-4" />}
              </div>
              
              <div className="truncate">
                <h2 id="certificate-modal-title" className="text-sm sm:text-base font-bold truncate font-display">
                  {certificate.title}
                </h2>
                <p className={`text-xs font-mono truncate ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                  {certificate.issuer} • {certificate.issueDate}
                </p>
              </div>
            </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Image Zoom Controls */}
            {!isPdf && fileUrl && (
              <div 
                className={`hidden sm:flex items-center gap-1 p-1 rounded-lg mr-2 border ${
                  isLight ? "bg-white border-slate-200" : "bg-zinc-900/90 border-zinc-800"
                }`}
              >
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className={`p-1 rounded transition-colors cursor-pointer disabled:opacity-30 ${
                    isLight ? "hover:bg-slate-100 text-slate-700" : "hover:bg-zinc-800 text-zinc-300"
                  }`}
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <span className={`text-[10px] font-mono w-10 text-center select-none font-semibold ${isLight ? "text-slate-700" : "text-zinc-200"}`}>
                  {Math.round(zoom * 100)}%
                </span>

                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className={`p-1 rounded transition-colors cursor-pointer disabled:opacity-30 ${
                    isLight ? "hover:bg-slate-100 text-slate-700" : "hover:bg-zinc-800 text-zinc-300"
                  }`}
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleResetZoom}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    isLight ? "hover:bg-slate-100 text-slate-700" : "hover:bg-zinc-800 text-zinc-300"
                  }`}
                  title="Reset Zoom"
                  aria-label="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isLight ? "hover:bg-slate-200/80 text-slate-600" : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isLight ? "hover:bg-slate-200/80 text-slate-600" : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
              title="Close viewer (Esc)"
              aria-label="Close viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Viewport */}
        <div 
          className={`flex-1 overflow-auto flex items-center justify-center p-4 sm:p-6 min-h-[360px] ${
            isLight ? "bg-slate-100/60" : "bg-[#06060a]"
          }`}
        >
          {isPdf && certificate.pdfUrl ? (
            /* PDF Document Viewer */
            <div className="w-full h-full min-h-[480px] flex flex-col items-center justify-center">
              <iframe
                src={`${certificate.pdfUrl}#toolbar=0`}
                title={certificate.title}
                className={`w-full h-[62vh] rounded-xl border shadow-lg ${
                  isLight ? "border-slate-300 bg-white" : "border-zinc-800 bg-zinc-950"
                }`}
              />
            </div>
          ) : fileUrl && !imageError ? (
            /* Image Document Viewer */
            <div className="relative overflow-auto flex items-center justify-center max-w-full max-h-full">
              <img
                src={fileUrl}
                alt={certificate.title}
                onError={() => setImageError(true)}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: "transform 0.15s ease-out",
                  maxHeight: fitToScreen ? "65vh" : "none",
                  maxWidth: fitToScreen ? "100%" : "none",
                }}
                className={`object-contain rounded-xl shadow-2xl select-none border ${
                  isLight ? "border-slate-200 bg-white" : "border-zinc-800 bg-zinc-950"
                }`}
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            /* Editorial Credential Certificate Diploma / Plaque Display */
            <div 
              className={`w-full max-w-2xl rounded-2xl p-6 sm:p-8 md:p-10 border shadow-xl relative overflow-hidden transition-all ${
                isLight 
                  ? "bg-white border-slate-200 text-slate-900" 
                  : "bg-gradient-to-b from-[#0e0e18] to-[#08080e] border-zinc-750 text-white"
              }`}
            >
              {/* Archival Guilloche Grid Accent */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: isLight
                    ? "radial-gradient(#6d28d9 1px, transparent 1px)"
                    : "radial-gradient(#a855f7 1px, transparent 1px)",
                  backgroundSize: "18px 18px"
                }}
              />

              {/* Decorative Corner Filigree Brackets */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-purple-500/40 pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-purple-500/40 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-purple-500/40 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-purple-500/40 pointer-events-none" />

              <div className="relative z-10 space-y-6 text-center">
                {/* Certificate Crest Header */}
                <div className="flex flex-col items-center space-y-2">
                  <div 
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border ${
                      isLight 
                        ? "bg-purple-50 border-purple-200 text-purple-700" 
                        : "bg-purple-950/50 border-purple-700/50 text-purple-400"
                    }`}
                  >
                    <Award className="w-8 h-8" />
                  </div>
                  
                  <span className={`text-[11px] font-mono tracking-widest uppercase font-bold ${isLight ? "text-purple-700" : "text-purple-400"}`}>
                    OFFICIAL VERIFIED CREDENTIAL
                  </span>

                  <h4 className={`text-xs font-mono font-semibold tracking-wider uppercase ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                    {certificate.issuer}
                  </h4>
                </div>

                {/* Recipient & Distinction Details */}
                <div className="space-y-2 py-2 border-y border-dashed border-zinc-700/30">
                  <p className={`text-xs font-mono uppercase tracking-wider ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                    THIS RECORD CERTIFIES THAT
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
                    Sayam Mukherjee
                  </h3>
                  <p className={`text-sm sm:text-base font-semibold font-display ${isLight ? "text-purple-700" : "text-purple-300"}`}>
                    has successfully achieved {certificate.title}
                  </p>
                </div>

                {/* Description Text */}
                {certificate.description && (
                  <p className={`text-xs sm:text-sm leading-relaxed max-w-lg mx-auto ${isLight ? "text-slate-600" : "text-zinc-300"}`}>
                    {certificate.description}
                  </p>
                )}

                {/* Demonstrated Skills Tags */}
                {certificate.skills && certificate.skills.length > 0 && (
                  <div className="pt-2">
                    <span className={`text-[10px] font-mono uppercase tracking-wider block mb-2 font-semibold ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                      DEMONSTRATED COMPETENCIES
                    </span>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {certificate.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className={`text-xs font-mono px-2.5 py-1 rounded-md border font-medium ${
                            isLight
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : "bg-zinc-900/90 text-zinc-300 border-zinc-800"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification Stamp & Credential ID */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-t border-zinc-750/30">
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 font-semibold ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      AUTHENTICATED RECORD
                    </span>
                    <span className={isLight ? "text-slate-400" : "text-zinc-500"}>•</span>
                    <span className={isLight ? "text-slate-600" : "text-zinc-400"}>{certificate.issueDate}</span>
                  </div>

                  {certificate.credentialId && (
                    <button
                      onClick={handleCopyId}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono transition-colors cursor-pointer ${
                        copiedId
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : isLight
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                          : "bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border-zinc-800"
                      }`}
                      title="Click to copy Credential ID"
                    >
                      {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId ? "COPIED ID" : `ID: ${certificate.credentialId}`}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Details Footer Bar */}
        <div 
          className={`px-5 py-3.5 border-t flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 ${
            isLight ? "bg-slate-50 border-slate-200" : "bg-[#09090e] border-zinc-850"
          }`}
        >
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            {certificate.credentialId && (
              <span className={`flex items-center gap-1 ${isLight ? "text-slate-700 font-semibold" : "text-zinc-300 font-semibold"}`}>
                <Hash className="w-3 h-3 opacity-60" />
                ID: {certificate.credentialId}
              </span>
            )}
            <span className={`flex items-center gap-1 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
              <Calendar className="w-3 h-3 opacity-60" />
              {certificate.issueDate}
            </span>
            <span 
              className={`px-2.5 py-0.5 rounded font-mono font-bold uppercase text-[10px] border ${
                isLight 
                  ? "bg-white border-slate-200 text-slate-700" 
                  : "bg-zinc-900 border-zinc-800 text-zinc-300"
              }`}
            >
              {certificate.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {fileUrl && (
              <a
                href={fileUrl}
                download={`${certificate.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-certificate`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono border transition-all cursor-pointer ${
                  isLight
                    ? "bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm"
                    : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border-zinc-800"
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}

            {certificate.credentialUrl && (
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono border transition-all cursor-pointer ${
                  isLight
                    ? "bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200 shadow-sm"
                    : "bg-cyan-950/40 hover:bg-cyan-950/70 text-cyan-300 border-cyan-800/60"
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Verify Registry</span>
              </a>
            )}

            <button
              onClick={onClose}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono border transition-all cursor-pointer ${
                isLight
                  ? "bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}
