import React, { useState, useEffect } from "react";
import {
  getConsentPreferences,
  saveConsentPreferences,
} from "../services/consent";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);

  useEffect(() => {
    const existing = getConsentPreferences();
    if (!existing) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

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
      anonymousAnalytics: true,
    });
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleRejectNonEssential = () => {
    saveConsentPreferences({
      mode: "essential-only",
      functionalStorage: true,
      anonymousAnalytics: false,
    });
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleSaveCustom = () => {
    saveConsentPreferences({
      mode: "custom",
      functionalStorage: true,
      anonymousAnalytics: analyticsAllowed,
    });
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      id="cookie-consent-banner"
      role="region"
      aria-label="Privacy & cookies preference"
      className="fixed bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-auto z-50 max-w-[560px] w-[calc(100%-24px)] sm:w-full font-sans select-text"
    >
      <div className="card p-4 sm:p-5 shadow-xl bg-[var(--surface-2)] border-[var(--border-strong)]">
        {!showPreferences ? (
          <div className="space-y-3">
            <h2 className="text-sm font-bold tracking-tight text-[var(--text)] font-display">
              Privacy &amp; cookies
            </h2>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              We use essential browser storage for site preferences. Optional analytics are handled
              according to your choices.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="btn btn-primary min-h-[40px] px-4 py-2 text-xs"
              >
                Accept
              </button>

              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="btn btn-secondary min-h-[40px] px-3.5 py-2 text-xs"
              >
                Reject optional
              </button>

              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="btn btn-ghost min-h-[40px] px-3 py-2 text-xs"
              >
                Preferences
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h2 className="font-bold text-[var(--text)] font-display">
                Storage preferences
              </h2>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] text-xs px-1.5 py-0.5 rounded-[4px] cursor-pointer"
              >
                Back
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3 p-2.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface)]">
                <div className="space-y-0.5">
                  <div className="font-semibold text-[var(--text)] flex items-center gap-1.5">
                    <span>Essential local storage</span>
                    <span className="text-[10px] font-mono text-[var(--text-faint)] uppercase tracking-wider">
                      (Required)
                    </span>
                  </div>
                  <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                    Saves your theme preference and prevents GitHub API rate limits.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 accent-[#69734A] cursor-not-allowed"
                  aria-label="Essential storage (Always active)"
                />
              </div>

              <div className="flex items-start justify-between gap-3 p-2.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface)]">
                <div className="space-y-0.5">
                  <div className="font-semibold text-[var(--text)]">
                    Optional analytics
                  </div>
                  <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                    Cookieless page view measurement to assess site performance without personal tracking.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#69734A] cursor-pointer"
                  aria-label="Optional analytics"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSaveCustom}
                className="btn btn-primary min-h-[40px] px-4 py-2 text-xs"
              >
                Save preferences
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="btn btn-ghost min-h-[40px] px-3 py-2 text-xs"
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
