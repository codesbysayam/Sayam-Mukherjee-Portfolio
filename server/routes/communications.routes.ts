import crypto from "crypto";
import { Router } from "express";
import { createRateLimiter } from "../middleware/rateLimit.ts";
import {
  analyticsEventSchema,
  contactSubmissionSchema,
  newsletterSubscribeSchema,
  testimonialCreateSchema,
} from "../validation/schemas.ts";
import {
  createContactSubmission,
  createTestimonialSubmission,
  subscribeToNewsletter,
} from "../repositories/communications.repository.ts";
import { recordAnalyticsEvent } from "../repositories/analytics.repository.ts";

export function createCommunicationsRouter(): Router {
  const router = Router();

  const contactLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message:
      "Too many contact inquiries from this IP address. Please try again later or email directly.",
  });

  const subscribeLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: "Too many subscription attempts. Please try again later.",
  });

  const testimonialLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: "Too many testimonial submissions. Please try again later.",
  });

  const analyticsLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 120,
    message: "Analytics rate limit exceeded.",
  });

  router.post("/api/contact", contactLimiter, async (req, res) => {
    const honeypot = req.body?.website || req.body?.phone_hp || req.body?.honeypot;
    if (honeypot && String(honeypot).trim().length > 0) {
      return res.status(400).json({ error: "Spam submission detected and rejected." });
    }

    const clientTimestamp = Number(req.body?.clientTimestamp || req.body?.timestamp);
    if (clientTimestamp && Date.now() - clientTimestamp < 2500) {
      return res.status(400).json({
        error: "Form submission too rapid. Please take a moment to review before submitting.",
      });
    }

    const parsed = contactSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message || "Invalid contact submission parameters",
      });
    }

    const input = parsed.data;
    const rawName = (input.name || `${input.firstName || ""} ${input.lastName || ""}`).trim();
    const parts = rawName.split(/\s+/);
    const resolvedFirstName = (input.firstName || parts[0] || "").trim();
    const resolvedLastName = (input.lastName || parts.slice(1).join(" ") || "").trim();
    const resolvedCompany = (input.company || input.organization || "").trim();
    const resolvedTopic = (input.topic || "General").trim();
    const resolvedSubject =
      input.subject?.trim() ||
      `Portfolio Contact | ${resolvedTopic} | ${rawName}`.trim();

    const attachmentSizeBytes =
      input.attachmentSizeBytes ??
      (input.attachmentData ? Math.ceil((input.attachmentData.length * 3) / 4) : undefined);

    try {
      const result = await createContactSubmission({
        firstName: resolvedFirstName,
        lastName: resolvedLastName,
        name: rawName,
        email: input.email,
        company: resolvedCompany,
        country: input.country || "",
        phone: input.phone || "",
        subject: resolvedSubject,
        topic: resolvedTopic,
        message: input.message,
        budget: input.budget || "",
        timeline: input.timeline || "",
        attachmentName: input.attachmentName || null,
        attachmentMimeType: input.attachmentMimeType || null,
        attachmentSizeBytes,
      });

      return res.json({
        success: true,
        submissionId: result.submissionId,
        delivered: result.delivered,
        deliveryStatus: result.deliveryStatus,
        deliveryMessage:
          result.deliveryStatus === "sent"
            ? "Inquiry persisted and email notification delivered."
            : result.deliveryStatus === "stored_pending_email_config"
              ? "Inquiry recorded securely in database. Email forwarding is pending external mail provider configuration."
              : "Inquiry recorded in database, though outbound email delivery failed.",
      });
    } catch (err) {
      console.error("POST /api/contact error:", err);
      return res.status(500).json({
        error: "Unable to persist your contact inquiry right now. Please try emailing directly.",
      });
    }
  });

  router.post("/api/newsletter/subscribe", subscribeLimiter, async (req, res) => {
    const parsed = newsletterSubscribeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message || "Invalid email syntax",
      });
    }

    try {
      const result = await subscribeToNewsletter(parsed.data.email);
      return res.json({
        success: true,
        already: result.already,
        subscriberId: result.subscriberId,
        msg: result.already
          ? "Already subscribed to portfolio updates."
          : "Subscribed to portfolio updates.",
      });
    } catch (err) {
      console.error("POST /api/newsletter/subscribe error:", err);
      return res.status(500).json({ error: "Failed to record subscription." });
    }
  });

  router.post("/api/testimonials", testimonialLimiter, async (req, res) => {
    const parsed = testimonialCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message || "Name and content are required",
      });
    }

    try {
      const testimonial = await createTestimonialSubmission(parsed.data);
      return res.status(201).json({
        success: true,
        pendingApproval: true,
        testimonial: {
          id: testimonial.id,
          name: testimonial.name,
          role: testimonial.role,
          approved: testimonial.approved,
          date: testimonial.date,
        },
      });
    } catch (err) {
      console.error("POST /api/testimonials error:", err);
      return res.status(500).json({ error: "Failed to submit testimonial." });
    }
  });

  router.post("/api/analytics/visit", analyticsLimiter, async (req, res) => {
    const parsed = analyticsEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message || "Invalid analytics payload",
      });
    }

    try {
      const data = parsed.data;
      const sessionId =
        data.sessionId || `sess_${crypto.randomBytes(8).toString("hex")}`;
      const durationSec = data.durationSec ?? data.duration ?? 0;

      await recordAnalyticsEvent({
        eventType: data.eventType,
        sessionId,
        page: data.page,
        device: data.device,
        source: data.source,
        durationSec,
      });

      return res.json({ success: true });
    } catch (err) {
      console.error("POST /api/analytics/visit error:", err);
      return res.status(500).json({ error: "Failed to record analytics event." });
    }
  });

  return router;
}
