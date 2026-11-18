import { Router } from "express";
import { requireAdmin, AuthenticatedAdminRequest } from "../middleware/auth.ts";
import {
  getPublicPortfolioProjection,
  updatePublicPortfolioContent,
} from "../repositories/portfolio.repository.ts";
import { portfolioUpdateSchema } from "../validation/schemas.ts";

export function createPortfolioRouter(): Router {
  const router = Router();

  // Public projection only — never exposes messages, subscribers, visitors, or attachments
  router.get("/api/portfolio-data", async (_req, res) => {
    try {
      const projection = await getPublicPortfolioProjection();
      res.json(projection);
    } catch (err) {
      console.error("GET /api/portfolio-data error:", err);
      res.status(500).json({ error: "Failed to load portfolio data" });
    }
  });

  // Admin-only portfolio CMS update
  router.post(
    "/api/portfolio-data/update",
    requireAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
      const parsed = portfolioUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.issues[0]?.message || "Invalid portfolio update payload",
        });
      }

      try {
        const updated = await updatePublicPortfolioContent(
          parsed.data,
          req.adminUser!.bearerToken
        );
        return res.json({ success: true, data: updated });
      } catch (err) {
        console.error("POST /api/portfolio-data/update error:", err);
        return res.status(500).json({ error: "Failed to persist portfolio update" });
      }
    }
  );

  return router;
}
