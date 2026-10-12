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

  // Trap escape key to cancel
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Focus confirm button when modal opens
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-md z-10 text-zinc-900 dark:text-zinc-100"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon & Title */}
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isDestructive
                    ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    : "bg-purple-500/10 text-purple-500 border border-purple-500/20"
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
                  className="text-base sm:text-lg font-bold font-sans tracking-tight"
                >
                  {title}
                </h3>
                <p
                  id="confirm-modal-description"
                  className="mt-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed"
                >
                  {message}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/70 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                {cancelLabel}
              </button>

              <button
                ref={confirmButtonRef}
                type="button"
                onClick={onConfirm}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
                  isDestructive
                    ? "bg-rose-600 hover:bg-rose-500 text-white focus-visible:ring-rose-500 shadow-md shadow-rose-950/20"
                    : "bg-purple-600 hover:bg-purple-500 text-white focus-visible:ring-purple-500 shadow-md shadow-purple-950/20"
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
