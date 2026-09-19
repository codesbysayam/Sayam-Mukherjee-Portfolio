import React, { useState, useEffect } from "react";
import { 
  getConsentPreferences, 
  saveConsentPreferences 
} from "../services/consent";
import { usePortfolio } from "../context/PortfolioContext";

export default function CookieConsent() {
  const { theme } = usePortfolio();
  const isLight = theme === "light";
  
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);

  useEffect(() => {
    // Check if consent has already been recorded
    const existing = getConsentPreferences();
    if (!existing) {
      // Small unobtrusive delay after page load
      const timer = setTimeout(() => setIsVisible(true), 1000);
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
    <aside
      role="region"
      aria-label="Privacy & cookies preference"
      className="fixed bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-auto z-50 max-w-[620px] w-[calc(100%-24px)] sm:w-full font-sans select-text"
    >
      <div
        className={`rounded-[18px] p-4 sm:p-5 border shadow-xl transition-all duration-200 ${
          isLight
            ? "bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-300/40"
            : "bg-[#121215]/95 border-zinc-800 text-zinc-100 shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
        }`}
      >
        {!showPreferences ? (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Privacy &amp; cookies
            </h2>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We use essential browser storage for site preferences. Optional analytics are handled
              according to your choices.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-opacity cursor-pointer active:scale-95"
              >
                Accept
              </button>

              <button
                type="button"
                onClick={handleRejectNonEssential}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer active:scale-95 ${
                  isLight
                    ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300"
                    : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700"
                }`}
              >
                Reject optional
              </button>

              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isLight
                    ? "text-zinc-600 hover:text-zinc-900"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                Preferences
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Storage preferences
              </h2>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xs px-1 py-0.5 rounded cursor-pointer"
              >
                Back
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                <div className="space-y-0.5">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <span>Essential local storage</span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                      (Required)
                    </span>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                    Saves your theme preference (Dark/Light) and prevents GitHub API rate limits.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 accent-zinc-900 dark:accent-zinc-100 cursor-not-allowed"
                  aria-label="Essential storage (Always active)"
                />
              </div>

              <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                <div className="space-y-0.5">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    Optional analytics
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                    Cookieless page view measurement to assess site performance without personal tracking.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-purple-600 cursor-pointer"
                  aria-label="Optional analytics"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSaveCustom}
                className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-opacity cursor-pointer"
              >
                Save preferences
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="min-h-[44px] px-3 py-2 rounded-xl text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
