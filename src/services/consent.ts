/**
 * Privacy & Cookie / Telemetry Consent Service
 * Manages visitor choices for functional storage and privacy-respecting telemetry.
 */

export type ConsentMode = "all" | "essential-only" | "custom";

export interface ConsentPreferences {
  mode: ConsentMode;
  functionalStorage: boolean; // Theme, command menu, cached github snapshots (always true for site to function)
  anonymousAnalytics: boolean; // Vercel cookieless analytics
  timestamp: number;
}

const CONSENT_STORAGE_KEY = "sayam_cookie_consent";

const DEFAULT_PREFERENCES: ConsentPreferences = {
  mode: "all",
  functionalStorage: true,
  anonymousAnalytics: true,
  timestamp: Date.now()
};

export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!item) return null;
    return JSON.parse(item) as ConsentPreferences;
  } catch {
    return null;
  }
}

export function saveConsentPreferences(prefs: Omit<ConsentPreferences, "timestamp">): ConsentPreferences {
  const completePrefs: ConsentPreferences = {
    ...prefs,
    timestamp: Date.now()
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(completePrefs));
      window.dispatchEvent(new CustomEvent("sayam_consent_updated", { detail: completePrefs }));
    } catch {}
  }

  return completePrefs;
}

export function resetConsentPreferences(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("sayam_consent_reset"));
    } catch {}
  }
}
