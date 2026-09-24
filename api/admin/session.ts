import type { IncomingMessage, ServerResponse } from "http";
import { 
  extractToken, 
  verifySessionToken, 
  applyCorsAndSecurityHeaders 
} from "../_lib/session.ts";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  applyCorsAndSecurityHeaders(req as any, res as any);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
    return;
  }

  const cookieHeader = req.headers.cookie;
  const authHeader = req.headers.authorization;
  const customHeader = req.headers["x-vault-session"] as string | undefined;

  const token = extractToken(cookieHeader, authHeader, customHeader);
  const isValid = verifySessionToken(token);

  res.statusCode = 200;
  if (isValid) {
    res.end(
      JSON.stringify({
        authenticated: true,
        role: "owner",
      })
    );
  } else {
    res.end(
      JSON.stringify({
        authenticated: false,
      })
    );
  }
}
