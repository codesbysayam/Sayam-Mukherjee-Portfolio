import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.ts";
import { verifyFirebaseToken, VerifiedTokenClaims } from "../lib/firebaseAdmin.ts";

export interface AuthenticatedAdminRequest extends Request {
  adminUser?: VerifiedTokenClaims & { bearerToken: string };
}

export async function requireAdmin(
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Authentication required. Missing Bearer ID token.",
    });
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    res.status(401).json({
      error: "Authentication required. Empty Bearer token.",
    });
    return;
  }

  try {
    const claims = await verifyFirebaseToken(token);
    const email = claims.email?.trim().toLowerCase();

    if (!claims.email_verified || !email || email !== env.adminEmail) {
      res.status(403).json({
        error: "Forbidden: administrator privileges required.",
      });
      return;
    }

    req.adminUser = {
      ...claims,
      bearerToken: token,
    };
    next();
  } catch {
    res.status(401).json({
      error: "Invalid or expired authentication token.",
    });
  }
}
