import { Router } from "express";
import { requireAdmin, AuthenticatedAdminRequest } from "../middleware/auth.ts";
import {
  createCertificate,
  deleteCertificate,
  getCertificateById,
  getCertificateStats,
  getCertificateStorageStatus,
  listCertificates,
  updateCertificate,
} from "../repositories/certificates.repository.ts";
import {
  certificateCreateSchema,
  certificateUpdateSchema,
} from "../validation/schemas.ts";

export function createCertificatesRouter(): Router {
  const router = Router();

  router.get("/api/certificates", async (req, res) => {
    try {
      const { category, search, issuer, skill, year, featured } = req.query;
      const certs = await listCertificates({
        category: category ? String(category) : undefined,
        search: search ? String(search) : undefined,
        issuer: issuer ? String(issuer) : undefined,
        skill: skill ? String(skill) : undefined,
        year: year ? String(year) : undefined,
        featured: featured !== undefined ? featured === "true" : undefined,
      });
      res.json(certs);
    } catch (err: any) {
      console.error("GET /api/certificates error:", err);
      res.status(500).json({ error: "Failed to retrieve certificates" });
    }
  });

  router.get("/api/certificates/stats", async (_req, res) => {
    try {
      const stats = await getCertificateStats();
      res.json(stats);
    } catch (err: any) {
      console.error("GET /api/certificates/stats error:", err);
      res.status(500).json({ error: "Failed to compute certificate stats" });
    }
  });

  router.get("/api/certificates/storage-status", (_req, res) => {
    try {
      const status = getCertificateStorageStatus();
      res.json(status);
    } catch (err: any) {
      console.error("GET /api/certificates/storage-status error:", err);
      res.status(500).json({ error: "Failed to check storage status" });
    }
  });

  router.get("/api/certificates/:id", async (req, res) => {
    try {
      const cert = await getCertificateById(req.params.id);
      if (!cert) {
        return res.status(404).json({ error: "Certificate not found" });
      }
      return res.json(cert);
    } catch (err: any) {
      console.error(`GET /api/certificates/${req.params.id} error:`, err);
      return res.status(500).json({ error: "Failed to fetch certificate" });
    }
  });

  router.post(
    "/api/certificates",
    requireAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
      const parsed = certificateCreateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.issues[0]?.message || "Invalid certificate payload",
        });
      }

      try {
        const created = await createCertificate(
          parsed.data,
          req.adminUser!.bearerToken
        );
        return res.status(201).json(created);
      } catch (err) {
        console.error("POST /api/certificates error:", err);
        return res.status(500).json({ error: "Failed to create certificate" });
      }
    }
  );

  router.patch(
    "/api/certificates/:id",
    requireAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
      const parsed = certificateUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.issues[0]?.message || "Invalid certificate update payload",
        });
      }

      try {
        const updated = await updateCertificate(
          req.params.id,
          parsed.data,
          req.adminUser!.bearerToken
        );
        if (!updated) {
          return res.status(404).json({ error: "Certificate not found" });
        }
        return res.json(updated);
      } catch (err) {
        console.error(`PATCH /api/certificates/${req.params.id} error:`, err);
        return res.status(500).json({ error: "Failed to update certificate" });
      }
    }
  );

  router.delete(
    "/api/certificates/:id",
    requireAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
      try {
        const deleted = await deleteCertificate(
          req.params.id,
          req.adminUser!.bearerToken
        );
        if (!deleted) {
          return res.status(404).json({ error: "Certificate not found" });
        }
        return res.json({ success: true, id: req.params.id });
      } catch (err) {
        console.error(`DELETE /api/certificates/${req.params.id} error:`, err);
        return res.status(500).json({ error: "Failed to delete certificate" });
      }
    }
  );

  return router;
}
