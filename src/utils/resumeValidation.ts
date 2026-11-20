import { RESUME_CONFIG } from "../config/resume";

const APPROVED_ORIGIN = new URL(RESUME_CONFIG.url).origin;

/**
 * Validates and returns the authoritative resume URL.
 * Ensures the destination protocol is HTTPS and matches the authoritative resume origin.
 */
export function getResumeUrl(): string {
  const url = new URL(RESUME_CONFIG.url);

  if (url.protocol !== "https:") {
    throw new Error("The configured resume URL must use HTTPS.");
  }

  if (url.origin !== APPROVED_ORIGIN) {
    throw new Error(
      "The configured resume URL does not match the approved resume origin."
    );
  }

  return url.toString();
}

/**
 * Helper to test whether any given URL points to the authorized resume destination.
 */
export function validateResumeUrl(candidate: string): boolean {
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" && url.origin === APPROVED_ORIGIN;
  } catch {
    return false;
  }
}
