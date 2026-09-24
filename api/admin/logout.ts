import type { IncomingMessage, ServerResponse } from "http";
import { clearSessionCookie, applyCorsAndSecurityHeaders } from "../_lib/session.ts";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  applyCorsAndSecurityHeaders(req as any, res as any);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
    return;
  }

  const cookieHeader = clearSessionCookie();
  res.setHeader("Set-Cookie", cookieHeader);
  res.statusCode = 200;
  res.end(
    JSON.stringify({
      ok: true,
      success: true,
      message: "Logged out",
    })
  );
}
