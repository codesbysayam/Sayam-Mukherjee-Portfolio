import { Router } from "express";
import { requireAdmin, AuthenticatedAdminRequest } from "../middleware/auth.ts";
import {
  actionAdminTestimonial,
  actionContactMessage,
  deleteSubscriber,
  listAdminTestimonials,
  listContactMessages,
  listSubscribers,
  sendNewsletterBroadcast,
} from "../repositories/communications.repository.ts";
import { getAdminAnalyticsSummary } from "../repositories/analytics.repository.ts";
import {
  messageActionSchema,
  newsletterBroadcastSchema,
  testimonialActionSchema,
} from "../validation/schemas.ts";

export function createAdminRouter(): Router {
  const router = Router();

  // Retired legacy password/OTP endpoint
  router.post("/api/admin/login", (_req, res) => {
    res.status(410).json({
      error:
        "Legacy password/OTP endpoint has been removed. Authenticate with Google Sign-In via Firebase Authentication.",
    });
  });

  // Verify active Firebase Admin session
  router.get(
    "/api/admin/session",
    requireAdmin,
    (req: AuthenticatedAdminRequest, res) => {
      res.json({
        authenticated: true,
        uid: req.adminUser!.uid,
        email: req.adminUser!.email,
      });
    }
  );

  // Admin Contact Messages
  router.get(
    "/api/admin/messages",
    requireAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
      try {
        const messages = await listContactMessages(req.adminUser!.bearerToken);
        return res.json(messages);
      } catch (err) {
        console.error("GET /api/admin/messages error:", err);
        return res.status(500).json({ error: "Failed to fetch messages" });
      }
    }
  );

  router.post(
    "/api/admin/messages/action",
    requireAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
      const parsed = messageActionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error:
            parsed.error.issues[0]?.message || "Missing id or action parameter",
        });
      }

      try {
        const messages = await actionContactMessage(
          parsed.data.id,
          parsed.data.action,
          req.adminUser!.bearerToken
        );
        return res.json({ success: true, messages });
      } catch (err) {
        console.error("POST /api/admin/messages/action error:", err);
        return res.status(500).json({ error: "Failed to update message" });
      }
    }
  );

  // Admin Newsletter Subscribers
  router.get(
    "/api/admin/subscribers",
    requireAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
      try {
        const subscribers = await listSubscribers(req.adminUser!.bearerToken);
        return res.json(subscribers);
      } catch (err) {
        console.error("GET /api/admin/subscribers error:", err);
        return res.status(500).json({ error: "Failed to fetch subscribers" });
      }
    }
  );

  router.post(
    "/api/admin/subscribers/delete",
    requireAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
      const id = String(req.body?.id || "").trim();
      if (!id) {
        return res.status(400).json({ error: "Missing subscriber id" });
      }

      try {
        const subscribers = await deleteSubscriber(
          id,
          req.adminUser!.bearerToken
        );
        return res.json({ success: true, subscribers });
      } catch (err) {
        console.error("POST /api/admin/subscribers/delete error:", err);
        return res.status(500).json({ error: "Failed to delete subscriber" });
      }
    }
  );

  router.post(
    "/api/admin/newsletter/broadcast",
    requireAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
      const parsed = newsletterBroadcastSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error:
            parsed.error.issues[0]?.message || "Invalid newsletter payload",
        });
      }

      try {
        const result = await sendNewsletterBroadcast(
          parsed.data.subject,
          parsed.data.body,
          req.adminUser!.bearerToken
        );
        return res.status(result.success ? 200 : 422).json(result);
      } catch (err) {
        console.error("POST /api/admin/newsletter/broadcast error:", err);
        return res.status(500).json({ error: "Newsletter dispatch failed" });
      }
    }
  );

  // Admin Testimonials Moderation
  router.get(
    "/api/admin/testimonials",
    requireAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
      try {
        const testimonials = await listAdminTestimonials(
          req.adminUser!.bearerToken
        );
        return res.json(testimonials);
      } catch (err) {
        console.error("GET /api/admin/testimonials error:", err);
        return res.status(500).json({ error: "Failed to load testimonials" });
      }
    }
  );

  router.post(
    "/api/admin/testimonials/action",
    requireAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
      const parsed = testimonialActionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error:
            parsed.error.issues[0]?.message || "Missing id or action parameter",
        });
      }

      try {
        const testimonials = await actionAdminTestimonial(
          parsed.data.id,
          parsed.data.action,
          req.adminUser!.bearerToken
        );
        return res.json({ success: true, testimonials });
      } catch (err) {
        console.error("POST /api/admin/testimonials/action error:", err);
        return res
          .status(500)
          .json({ error: "Failed to process testimonial action" });
      }
    }
  );

  // Admin Analytics Summary
  router.get(
    "/api/admin/analytics",
    requireAdmin,
    async (req: AuthenticatedAdminRequest, res) => {
      try {
        const summary = await getAdminAnalyticsSummary(
          req.adminUser!.bearerToken
        );
        return res.json(summary);
      } catch (err) {
        console.error("GET /api/admin/analytics error:", err);
        return res
          .status(500)
          .json({ error: "Failed to compute analytics summary" });
      }
    }
  );

  return router;
}
