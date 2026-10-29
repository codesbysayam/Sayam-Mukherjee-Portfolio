/**
 * Canonical Single Source of Truth for Sayam Mukherjee's Verified Resume
 * 
 * Authoritative Destination URL:
 * https://exciting-brown-6y14ojmv.edgeone.dev/
 */

export const RESUME_CONFIG = {
  url: "https://exciting-brown-6y14ojmv.edgeone.dev/",
  label: "View Resume",
  downloadLabel: "View Resume (PDF)",
  ariaLabel: "Open Sayam Mukherjee latest verified resume",
  lastVerified: "2026-10-24",
} as const;

export const RESUME_URL = RESUME_CONFIG.url;

export default RESUME_CONFIG;
