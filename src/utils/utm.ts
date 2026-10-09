/**
 * Privacy-Conscious UTM Attribution Utility
 * -----------------------------------------
 * Captures, sanitizes, and stores standard UTM query parameters
 * in sessionStorage for the duration of the browsing session.
 * 
 * Standard parameters:
 *  - utm_source
 *  - utm_medium
 *  - utm_campaign
 *  - utm_term
 *  - utm_content
 * 
 * Never collects PII. Respects browser storage rules and cookie consent.
 */

import { isAnalyticsAllowed } from "../services/consent";

export interface UtmParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  captured_at?: string;
}

const STORAGE_KEY = "sayam_portfolio_utm_params";
const MAX_PARAM_LENGTH = 120;

// Sanitize parameter to avoid script injection or malformed strings
function sanitizeParam(val: string | null): string | undefined {
  if (!val) return undefined;
  const trimmed = val.trim().slice(0, MAX_PARAM_LENGTH);
  // Allow alphanumeric, dashes, underscores, dots, and colons
  const clean = trimmed.replace(/[^a-zA-Z0-9_\-\.:]/g, "");
  return clean.length > 0 ? clean : undefined;
}

/**
 * Initializes UTM tracking on page load.
 * Extracts parameters from window.location.search and stores in sessionStorage.
 */
export function initUtmTracking(): UtmParameters | null {
  if (typeof window === "undefined") return null;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const source = sanitizeParam(urlParams.get("utm_source"));
    const medium = sanitizeParam(urlParams.get("utm_medium"));
    const campaign = sanitizeParam(urlParams.get("utm_campaign"));
    const term = sanitizeParam(urlParams.get("utm_term"));
    const content = sanitizeParam(urlParams.get("utm_content"));

    // Check if any UTM parameter is present in current URL
    if (source || medium || campaign || term || content) {
      const utmData: UtmParameters = {
        utm_source: source,
        utm_medium: medium,
        utm_campaign: campaign,
        utm_term: term,
        utm_content: content,
        captured_at: new Date().toISOString(),
      };

      // Store in session storage if permitted
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utmData));
      }
      return utmData;
    }

    // Otherwise, return existing session UTMs if present
    return getStoredUtmParameters();
  } catch (err) {
    console.debug("UTM initialization skipped:", err);
    return null;
  }
}

/**
 * Retrieves stored UTM parameters if available and consent is permitted.
 */
export function getStoredUtmParameters(): UtmParameters | null {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return null;
  }

  // Check consent before accessing analytics attribution
  if (!isAnalyticsAllowed()) {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UtmParameters;
  } catch {
    return null;
  }
}
