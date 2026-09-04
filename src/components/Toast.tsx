import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export type ToastType = "success" | "info" | "error";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const TOAST_EVENT_NAME = "app:show-toast";

/**
 * Global helper to trigger a toast notification from anywhere in the app
 */
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
  const { theme } = usePortfolio();
  const isDark = theme === "dark";
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastItem>;
      if (!customEvent.detail) return;

      const newToast = customEvent.detail;
      setToasts((prev) => [...prev.slice(-2), newToast]); // keep max 3 visible toasts

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
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex flex-col items-center gap-2 pointer-events-none max-w-[92vw] sm:max-w-md w-full px-4"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-2xl transition-colors w-full sm:w-auto min-w-[280px] max-w-full ${
              isDark
                ? "bg-zinc-950/90 text-white border-zinc-800 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
                : "bg-white/95 text-zinc-900 border-zinc-200/80 shadow-[0_16px_40px_rgba(20,20,40,0.12)]"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="shrink-0">
                {toast.type === "success" && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
                {toast.type === "info" && (
                  <div className="w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                )}
                {toast.type === "error" && (
                  <div className="w-6 h-6 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <p className="text-xs font-mono font-medium truncate leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
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
