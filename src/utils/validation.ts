/**
 * Robust Client & Server Form Validation Utility
 */

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
  timestamp?: number;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

// RFC 5322 compliant simplified email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function validateContactForm(data: ContactFormData): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  // 1. Name validation
  const trimmedName = (data.name || "").trim();
  if (!trimmedName) {
    errors.name = "Please enter your full name.";
  } else if (trimmedName.length < 2) {
    errors.name = "Name must be at least 2 characters long.";
  } else if (trimmedName.length > 100) {
    errors.name = "Name must not exceed 100 characters.";
  }

  // 2. Email validation
  const trimmedEmail = (data.email || "").trim();
  if (!trimmedEmail) {
    errors.email = "Please provide your email address.";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address (e.g. name@domain.com).";
  } else if (trimmedEmail.length > 150) {
    errors.email = "Email address is too long.";
  }

  // 3. Message validation
  const trimmedMessage = (data.message || "").trim();
  if (!trimmedMessage) {
    errors.message = "Please write a message describing your inquiry.";
  } else if (trimmedMessage.length < 20) {
    errors.message = `Message must be at least 20 characters (currently ${trimmedMessage.length}).`;
  } else if (trimmedMessage.length > 2000) {
    errors.message = "Message must not exceed 2,000 characters.";
  }

  // 4. Honeypot check
  if (data.honeypot && data.honeypot.trim().length > 0) {
    errors.general = "Submission rejected as spam.";
  }

  // 5. Bot speed detection (min 2.5s)
  if (data.timestamp && Date.now() - data.timestamp < 2500) {
    errors.general = "Submission received too quickly. Please take a moment to review before submitting.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
