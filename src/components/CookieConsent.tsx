import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Settings, Check, X, Info, ExternalLink } from "lucide-react";
import { 
  getConsentPreferences, 
  saveConsentPreferences, 
  ConsentPreferences 
} from "../services/consent";
import { usePortfolio } from "../context/PortfolioContext";

export default function CookieConsent() {
  const { theme } = usePortfolio();
  const isLight = theme === "light";
  
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);

  useEffect(() => {
    // Check if consent has already been given
    const existing = getConsentPreferences();
    if (!existing) {
      // Small delay for smooth entry after initial page load
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for open settings event from footer
  useEffect(() => {
    const handleOpenSettings = () => {
      const existing = getConsentPreferences();
      if (existing) {
        setAnalyticsAllowed(existing.anonymousAnalytics);
      }
      setShowPreferences(true);
      setIsVisible(true);
    };

    window.addEventListener("sayam_open_privacy_settings", handleOpenSettings);
    return () => window.removeEventListener("sayam_open_privacy_settings", handleOpenSettings);
  }, []);

  const handleAcceptAll = () => {
    saveConsentPreferences({
      mode: "all",
      functionalStorage: true,
      anonymousAnalytics: true
    });
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleRejectNonEssential = () => {
    saveConsentPreferences({
      mode: "essential-only",
      functionalStorage: true,
      anonymousAnalytics: false
    });
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleSaveCustom = () => {
    saveConsentPreferences({
      mode: "custom",
      functionalStorage: true,
      anonymousAnalytics: analyticsAllowed
    });
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-label="Privacy and Storage Preferences"
        aria-modal="false"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-auto z-50 max-w-lg w-auto pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <div
          className={`rounded-2xl p-4 sm:p-5 border backdrop-blur-xl shadow-2xl transition-all ${
            isLight
              ? "bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/40"
              : "bg-zinc-950/90 border-zinc-800 text-zinc-100 shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
          }`}
        >
          {/* Main compact banner */}
          {!showPreferences ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold font-display tracking-tight flex items-center gap-1.5">
                    <span>Privacy &amp; Transparent Storage</span>
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    This portfolio uses local storage for visual themes and cached repository summaries. We do <strong>not</strong> use advertising trackers. Anonymous, cookie-free telemetry helps measure visitor traffic.
                  </p>
                </div>
              </div>

              {/* Action buttons with >=44px touch targets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  Accept All
                </button>
                <button
                  onClick={handleRejectNonEssential}
                  className={`flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer active:scale-95 ${
                    isLight
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-750"
                  }`}
                >
                  Reject Non-Essential
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    isLight ? "text-slate-600 hover:text-slate-900" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                  title="Customize Preferences"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Preferences</span>
                </button>
              </div>
            </div>
          ) : (
            /* Detailed preferences view */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">
                    Privacy Preferences
                  </span>
                </div>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  aria-label="Close preferences view"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Essential Local Storage */}
                <div className="p-3 rounded-xl border bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <span>Essential Local Storage</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 uppercase">
                        Required
                      </span>
                    </div>
                    <p className="text-zinc-500 text-[11px] leading-relaxed">
                      Maintains your selected Dark/Light theme, command menu usage, and cached GitHub snapshot to avoid API rate limiting.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="accent-purple-600 mt-1 cursor-not-allowed"
                    aria-label="Essential storage (Always active)"
                  />
                </div>

                {/* Anonymous Analytics */}
                <div className="p-3 rounded-xl border bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-zinc-900 dark:text-white">
                      Anonymous Analytics Telemetry
                    </div>
                    <p className="text-zinc-500 text-[11px] leading-relaxed">
                      Privacy-respecting Vercel Web Analytics. Does not use cookies or store IP addresses.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsAllowed}
                    onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                    className="accent-purple-600 mt-1 w-4 h-4 cursor-pointer"
                    aria-label="Enable anonymous analytics"
                  />
                </div>
              </div>

              {/* Preferences action controls */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  onClick={handleSaveCustom}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer shadow-sm"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowPreferences(false)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-mono ${
                    isLight ? "text-slate-500 hover:text-slate-900" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
