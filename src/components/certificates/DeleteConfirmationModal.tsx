import React, { useState } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { Certificate } from "../../types/certificates";
import { usePortfolio } from "../../context/PortfolioContext";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  certificate: Certificate | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function DeleteConfirmationModal({
  isOpen,
  certificate,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen || !certificate) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage("");
    try {
      await onConfirm(certificate.id);
      onClose();
    } catch (err: any) {
      console.error("Failed to delete certificate:", err);
      setErrorMessage(err.message || "Failed to remove certificate. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      id="delete-confirmation-modal"
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 sm:p-7 space-y-5 text-left relative overflow-hidden ${
          isLight
            ? "bg-white border-red-200 text-slate-900 shadow-[0_25px_60px_rgba(239,68,68,0.12)]"
            : "bg-[#0a0a0f] border-red-950/60 text-white shadow-2xl"
        }`}
        style={{
          boxShadow: isLight
            ? "0 24px 60px rgba(15, 23, 42, 0.15), 0 0 35px rgba(239, 68, 68, 0.1)"
            : "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(239, 68, 68, 0.12)",
        }}
      >
        {/* Top warning line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-600 to-red-600" />

        <div className="flex items-start justify-between gap-3 pt-1">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            isLight ? "bg-red-50 border-red-200 text-red-600" : "bg-red-950/40 border-red-800/40 text-red-400"
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100" : "text-zinc-400 hover:text-white hover:bg-zinc-850"
            }`}
            aria-label="Cancel deletion"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold">
            CONFIRM PERMANENT REMOVAL
          </span>
          <h2 className={`text-lg font-bold font-display ${isLight ? "text-slate-900" : "text-white"}`}>
            Permanently delete this credential?
          </h2>
          <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
            This action cannot be undone. The certificate record will be removed from your public registry and persistent storage.
          </p>
        </div>

        {/* Certificate Item Preview */}
        <div className={`p-3.5 rounded-xl border space-y-1 ${
          isLight ? "bg-slate-50 border-slate-200" : "bg-zinc-950 border-zinc-850"
        }`}>
          <div className={`text-[10px] font-mono uppercase tracking-wider font-bold ${isLight ? "text-purple-700" : "text-purple-400"}`}>
            {certificate.category}
          </div>
          <h3 className={`text-sm font-semibold truncate ${isLight ? "text-slate-900" : "text-white"}`}>
            {certificate.title}
          </h3>
          <div className={`text-xs font-mono flex items-center justify-between pt-0.5 ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
            <span>{certificate.issuer}</span>
            <span className={isLight ? "text-slate-400" : "text-zinc-500"}>{certificate.issueDate}</span>
          </div>
        </div>

        {errorMessage && (
          <div className={`p-3 border rounded-xl text-xs ${
            isLight ? "bg-red-50 border-red-200 text-red-700" : "bg-red-950/40 border-red-900/50 text-red-300"
          }`}>
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            id="cancel-delete-cert-btn"
            onClick={onClose}
            disabled={isDeleting}
            className={`px-4 py-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${
              isLight
                ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                : "bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border-zinc-800"
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-delete-cert-btn"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50 select-none font-mono"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Removing...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
