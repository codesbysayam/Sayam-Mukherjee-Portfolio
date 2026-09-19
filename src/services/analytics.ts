/**
 * Privacy-Preserving Analytics Service
 * Wraps @vercel/analytics/react tracking, respecting user consent choices.
 */

import { track } from "@vercel/analytics";
import { getConsentPreferences } from "./consent";

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === "undefined") return;

  const consent = getConsentPreferences();
  // Only track if consent is not explicitly rejected (null means default banner, 'all' or custom with anonymousAnalytics=true)
  if (consent && !consent.anonymousAnalytics) {
    return;
  }

  try {
    track(eventName, properties);
  } catch {
    // Fail silently without impacting UI
  }
}

export const AnalyticsEvents = {
  NAVIGATE_TAB: "navigate_tab",
  CLICK_CTA: "click_primary_cta",
  VIEW_PROJECT: "view_project",
  GITHUB_SNAPSHOT_RETRY: "github_snapshot_retry",
  OPEN_RESUME: "open_resume",
  SUBMIT_CONTACT: "submit_contact_inquiry"
} as const;
