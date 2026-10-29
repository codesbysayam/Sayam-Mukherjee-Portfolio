import { RESUME_CONFIG } from "../config/resume";

/**
 * Validates and returns the authoritative resume URL.
 * Ensures the destination protocol is HTTPS and resolves strictly
 * to the verified host exciting-brown-6y14ojmv.edgeone.dev.
 */
export function getResumeUrl(): string {
  const url = new URL(RESUME_CONFIG.url);

  if (url.protocol !== "https:") {
    throw new Error("The configured resume URL must use HTTPS.");
  }

  if (url.hostname !== "exciting-brown-6y14ojmv.edgeone.dev") {
    throw new Error(
      "The configured resume URL does not match the approved destination."
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
    return (
      url.protocol === "https:" &&
      url.hostname === "exciting-brown-6y14ojmv.edgeone.dev"
    );
  } catch {
    return false;
  }
}
