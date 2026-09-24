import crypto from "crypto";

// Unified Passkey Configuration - Prioritize ADMIN_PASSKEY with fallback to CERTIFICATE_ADMIN_PASSKEY
export function getAdminPasskey(): string | undefined {
  const passkey = process.env.ADMIN_PASSKEY || process.env.CERTIFICATE_ADMIN_PASSKEY;
  return passkey ? passkey.trim() : undefined;
}

export const SESSION_COOKIE_NAME = "vault_session";
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSessionSecret(): string {
  const configuredSecret = process.env.SESSION_SECRET;
  if (configuredSecret) return configuredSecret.trim();
  const passkey = getAdminPasskey();
  if (passkey) return `${passkey}_sayam_vault_secure_hmac_2026`;
  return "sayam_vault_secure_hmac_production_key_2026";
}

// In-memory rate limiting map for brute-force mitigation (max 5 failed attempts per 15 minutes)
interface RateLimitRecord {
  failedAttempts: number;
  lockoutUntil?: number;
  firstAttemptAt: number;
}
const rateLimits = new Map<string, RateLimitRecord>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = rateLimits.get(ip);
  if (!record) return { allowed: true };

  if (record.lockoutUntil && now < record.lockoutUntil) {
    const retryAfterSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  // Reset window after 15 minutes
  if (now - record.firstAttemptAt > 15 * 60 * 1000) {
    rateLimits.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = rateLimits.get(ip) || { failedAttempts: 0, firstAttemptAt: now };
  record.failedAttempts += 1;
  if (record.failedAttempts >= 5) {
    record.lockoutUntil = now + 15 * 60 * 1000; // 15-minute lock
  }
  rateLimits.set(ip, record);
}

export function clearRateLimit(ip: string): void {
  rateLimits.delete(ip);
}

export function getClientIp(headers: Record<string, string | string[] | undefined>, socketAddress?: string): string {
  const forwarded = headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(",")[0].trim();
  }
  return socketAddress || "127.0.0.1";
}

// Timing-safe passkey validation
export function validatePasskey(input: unknown): {
  ok: boolean;
  status: number;
  error?: string;
} {
  const adminPasskey = getAdminPasskey();
  if (!adminPasskey) {
    return {
      ok: false,
      status: 500,
      error: "Authentication service unavailable",
    };
  }

  if (typeof input !== "string" || !input.trim()) {
    return {
      ok: false,
      status: 401,
      error: "Invalid credentials",
    };
  }

  const inputBuffer = Buffer.from(input.trim());
  const targetBuffer = Buffer.from(adminPasskey);

  if (inputBuffer.length !== targetBuffer.length) {
    return {
      ok: false,
      status: 401,
      error: "Invalid credentials",
    };
  }

  const isValid = crypto.timingSafeEqual(inputBuffer, targetBuffer);
  if (!isValid) {
    return {
      ok: false,
      status: 401,
      error: "Invalid credentials",
    };
  }

  return { ok: true, status: 200 };
}

// Generate secure stateless HMAC-SHA256 session token
export function generateSessionToken(): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + SESSION_DURATION_MS;
  const payload = `owner:${issuedAt}:${expiresAt}`;
  const encodedPayload = Buffer.from(payload, "utf-8").toString("base64url");
  const hmac = crypto.createHmac("sha256", getSessionSecret()).update(encodedPayload).digest("hex");
  return `${encodedPayload}.${hmac}`;
}

// Verify stateless HMAC session token
export function verifySessionToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [encodedPayload, hmac] = parts;
    const expectedHmac = crypto.createHmac("sha256", getSessionSecret()).update(encodedPayload).digest("hex");

    const hmacBuf = Buffer.from(hmac);
    const expectedBuf = Buffer.from(expectedHmac);
    if (hmacBuf.length !== expectedBuf.length) return false;
    if (!crypto.timingSafeEqual(hmacBuf, expectedBuf)) return false;

    const payload = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const [role, , expiresAtStr] = payload.split(":");
    if (role !== "owner") return false;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

    return true;
  } catch {
    return false;
  }
}

// Extract session token from cookie, Authorization header, or x-vault-session header
export function extractToken(
  cookieHeader?: string,
  authHeader?: string,
  customHeader?: string
): string | null {
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(`${SESSION_COOKIE_NAME}=`)) {
        return decodeURIComponent(cookie.substring(SESSION_COOKIE_NAME.length + 1));
      }
      // Also check fallback legacy cookie name
      if (cookie.startsWith("admin_session=")) {
        return decodeURIComponent(cookie.substring("admin_session=".length));
      }
    }
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }

  if (customHeader && typeof customHeader === "string") {
    return customHeader.trim();
  }

  return null;
}

// Generate Set-Cookie header for session creation
export function createSessionCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
  const maxAgeSeconds = Math.floor(SESSION_DURATION_MS / 1000);
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${maxAgeSeconds}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isProduction) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

// Generate Set-Cookie header for session invalidation (logout)
export function clearSessionCookie(): string {
  const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isProduction) {
    parts.push("Secure");
  }
  return parts.join("; ");
}
