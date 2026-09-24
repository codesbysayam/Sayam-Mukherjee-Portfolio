import type { IncomingMessage, ServerResponse } from "http";
import { clearSessionCookie } from "../../server/session.ts";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

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
