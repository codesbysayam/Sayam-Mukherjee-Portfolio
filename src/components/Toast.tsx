import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "info" | "error";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const TOAST_EVENT_NAME = "app:show-toast";

export function showToast(message: string, type: ToastType = "success", duration: number = 3200) {
  if (typeof window !== "undefined") {
    const event = new CustomEvent(TOAST_EVENT_NAME, {
      detail: {
        id: Math.random().toString(36).substring(2, 9),
        message,
        type,
        duration,
      },
    });
    window.dispatchEvent(event);
  }
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastItem>;
      if (!customEvent.detail) return;

      const newToast = customEvent.detail;
      setToasts((prev) => [...prev.slice(-2), newToast]);

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration || 3200);

      return () => clearTimeout(timer);
    };

    window.addEventListener(TOAST_EVENT_NAME, handleToastEvent);
    return () => {
      window.removeEventListener(TOAST_EVENT_NAME, handleToastEvent);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <aside
      aria-label="Notifications"
      className="fixed bottom-[calc(68px+env(safe-area-inset-bottom,0px)+0.75rem)] xl:bottom-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] left-1/2 -translate-x-1/2 z-[80] flex flex-col items-center gap-2 pointer-events-none max-w-[92vw] sm:max-w-md w-full px-4"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            className="pointer-events-auto card flex items-center justify-between gap-3 px-4 py-3 shadow-xl w-full sm:w-auto min-w-0 sm:min-w-[280px] max-w-full bg-[var(--surface-2)] border-[var(--border-strong)]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="shrink-0">
                {toast.type === "success" && (
                  <div className="w-6 h-6 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--success)]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
                {toast.type === "info" && (
                  <div className="w-6 h-6 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                )}
                {toast.type === "error" && (
                  <div className="w-6 h-6 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--danger)]">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <p className="text-xs font-mono font-medium text-[var(--text)] truncate leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors cursor-pointer shrink-0"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
}
