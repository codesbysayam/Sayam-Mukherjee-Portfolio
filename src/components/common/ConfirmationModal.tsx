import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Info, X } from "lucide-react";

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => {
      confirmButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-description"
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="modal-backdrop absolute inset-0 cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="card relative w-full max-w-md p-6 shadow-2xl z-10 text-[var(--text)]"
          >
            <button
              type="button"
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 border ${
                  isDestructive
                    ? "bg-[var(--surface)] text-[var(--danger)] border-[var(--danger)]/30"
                    : "bg-[var(--surface)] text-[var(--accent)] border-[var(--border-strong)]"
                }`}
              >
                {isDestructive ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <Info className="w-5 h-5" />
                )}
              </div>

              <div className="min-w-0 pr-4">
                <h3
                  id="confirm-modal-title"
                  className="text-base sm:text-lg font-bold font-display tracking-tight text-[var(--text)]"
                >
                  {title}
                </h3>
                <p
                  id="confirm-modal-description"
                  className="mt-1.5 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed"
                >
                  {message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary min-h-[40px] px-4 py-2 text-xs sm:text-sm"
              >
                {cancelLabel}
              </button>

              <button
                ref={confirmButtonRef}
                type="button"
                onClick={onConfirm}
                className={`btn min-h-[40px] px-4 py-2 text-xs sm:text-sm ${
                  isDestructive
                    ? "bg-[var(--danger)] hover:opacity-90 text-white border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--danger)]"
                    : "btn-primary"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
