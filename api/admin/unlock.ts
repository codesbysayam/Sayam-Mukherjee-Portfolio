import type { IncomingMessage, ServerResponse } from "http";
import { 
  validatePasskey, 
  generateSessionToken, 
  createSessionCookie, 
  checkRateLimit, 
  recordFailedAttempt, 
  clearRateLimit, 
  getClientIp,
  applyCorsAndSecurityHeaders
} from "../_lib/session.ts";

interface CustomRequest extends IncomingMessage {
  body?: any;
  query?: any;
}

export default async function handler(req: CustomRequest, res: ServerResponse) {
  // CORS & Security Headers
  applyCorsAndSecurityHeaders(req as any, res as any);

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  // 1. Accept POST only
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
    return;
  }

  // Rate Limiting (Brute-Force Protection)
  const ip = getClientIp(req.headers || {}, req.socket?.remoteAddress);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    res.statusCode = 429;
    res.setHeader("Retry-After", String(rateLimit.retryAfterSeconds || 900));
    res.end(
      JSON.stringify({
        ok: false,
        error: "Too many failed attempts. Security cooldown active. Please wait a few minutes before trying again.",
      })
    );
    return;
  }

  // Parse Body safely
  let body: any = req.body;
  if (!body) {
    try {
      const buffers: Buffer[] = [];
      for await (const chunk of req) {
        buffers.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      const rawText = Buffer.concat(buffers).toString("utf-8");
      body = rawText ? JSON.parse(rawText) : {};
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ ok: false, error: "Malformed JSON payload" }));
      return;
    }
  }

  const passkey = body?.passkey;

  // 2. Validate passkey exists & compare against ADMIN_PASSKEY
  const result = validatePasskey(passkey);

  if (!result.ok) {
    recordFailedAttempt(ip);
    res.statusCode = result.status;
    res.end(
      JSON.stringify({
        ok: false,
        error: result.error || "Invalid credentials",
      })
    );
    return;
  }

  // Passkey is valid: clear rate limit, issue session cookie & return success
  clearRateLimit(ip);
  const sessionToken = generateSessionToken();
  const cookieHeader = createSessionCookie(sessionToken);

  res.statusCode = 200;
  res.setHeader("Set-Cookie", cookieHeader);
  res.end(
    JSON.stringify({
      ok: true,
      success: true,
      message: "ACCESS GRANTED",
      role: "owner",
    })
  );
}
