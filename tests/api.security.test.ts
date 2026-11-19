import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../server/app.ts";
import {
  SERVER_CONFIG,
  validateServerEnvironment,
} from "../server/config/env.ts";
import {
  isEmailTransportConfigured,
  sendContactNotification,
} from "../server/services/email.service.ts";
import { setTokenVerifierForTesting } from "../server/lib/firebaseAdmin.ts";
import { resetInMemoryStoreForTests } from "../server/services/firestoreRest.ts";

describe("Portfolio Security, Auth, Validation & Environment API Suite", () => {
  const app = createApp();

  beforeEach(() => {
    resetInMemoryStoreForTests();
    setTokenVerifierForTesting(async (token: string) => {
      if (token === "admin-valid-token") {
        return {
          uid: "uid-admin-sayam",
          email: "wrickbusiness@gmail.com",
          email_verified: true,
          name: "Sayam Mukherjee",
        };
      }
      if (token === "admin-unverified-token") {
        return {
          uid: "uid-unverified",
          email: "wrickbusiness@gmail.com",
          email_verified: false,
        };
      }
      if (token === "non-admin-token") {
        return {
          uid: "uid-stranger",
          email: "stranger@example.com",
          email_verified: true,
        };
      }
      throw new Error("Invalid Firebase token");
    });
  });

  afterEach(() => {
    setTokenVerifierForTesting(null);
    delete process.env.ADMIN_EMAIL;
    delete process.env.CONTACT_FROM_EMAIL;
    delete process.env.CONTACT_TO_EMAIL;
  });

  describe("Environment Configuration & Credential-Free Email Abstraction", () => {
    it("passes mandatory validation cleanly with zero email API credentials", () => {
      const diag = validateServerEnvironment();
      expect(diag.mandatoryOk).toBe(true);
      expect(diag.missingMandatory).toEqual([]);
      expect(isEmailTransportConfigured()).toBe(false);
    });

    it("stores fixed non-secret email addresses in SERVER_CONFIG and ignores obsolete email env vars", () => {
      process.env.ADMIN_EMAIL = "override-ignored@example.com";
      process.env.CONTACT_FROM_EMAIL = "ignored-from@example.com";
      process.env.CONTACT_TO_EMAIL = "ignored-to@example.com";

      expect(SERVER_CONFIG).toEqual({
        adminEmail: "wrickbusiness@gmail.com",
        contactToEmail: "sayammukherjee1506@gmail.com",
      });
    });

    it("reports honest disabled email delivery status without throwing when email transport is disabled", async () => {
      const result = await sendContactNotification({
        submissionId: "msg_disabled_1",
        name: "Test Sender",
        email: "sender@example.com",
        subject: "Database-only contact test",
        message: "Testing database persistence with email notifications disabled.",
      });

      expect(result.delivered).toBe(false);
      expect(result.deliveryStatus).toBe("stored_pending_email_config");
      expect(result.provider).toBe("none");
    });
  });

  describe("Public Projection Security", () => {
    it("GET /api/portfolio-data returns only public portfolio fields and never exposes private collections or fabricated personas", async () => {
      const res = await request(app).get("/api/portfolio-data");
      expect(res.status).toBe(200);
      expect(res.body).not.toHaveProperty("messages");
      expect(res.body).not.toHaveProperty("subscribers");
      expect(res.body).not.toHaveProperty("visitors");
      expect(res.body).not.toHaveProperty("otpSimulated");
      expect(JSON.stringify(res.body)).not.toContain("Nathan Drake");
      expect(Array.isArray(res.body.projects)).toBe(true);
      expect(Array.isArray(res.body.testimonials)).toBe(true);
      expect(
        res.body.testimonials.every((t: any) => t.approved === true)
      ).toBe(true);
    });
  });

  describe("Administrative Endpoint Authorization", () => {
    const protectedEndpoints: Array<{ method: "get" | "post" | "patch" | "delete"; path: string; body?: any }> = [
      { method: "get", path: "/api/admin/session" },
      { method: "get", path: "/api/admin/messages" },
      { method: "post", path: "/api/admin/messages/action", body: { id: "msg_1", action: "archive" } },
      { method: "get", path: "/api/admin/subscribers" },
      { method: "post", path: "/api/admin/subscribers/delete", body: { id: "sub_1" } },
      { method: "post", path: "/api/admin/newsletter/broadcast", body: { subject: "Test", body: "Hello world" } },
      { method: "get", path: "/api/admin/testimonials" },
      { method: "post", path: "/api/admin/testimonials/action", body: { id: "test_1", action: "approve" } },
      { method: "get", path: "/api/admin/analytics" },
      { method: "post", path: "/api/portfolio-data/update", body: { achievements: [] } },
      {
        method: "post",
        path: "/api/certificates",
        body: { title: "Cert", issuer: "Org", category: "CERTIFICATIONS", issueDate: "2026" },
      },
      { method: "patch", path: "/api/certificates/cert-1", body: { title: "Updated" } },
      { method: "delete", path: "/api/certificates/cert-1" },
    ];

    it("rejects unauthenticated requests with 401 across all protected routes", async () => {
      for (const ep of protectedEndpoints) {
        const res = await (request(app)[ep.method](ep.path) as any).send(ep.body ?? {});
        expect(res.status, `${ep.method.toUpperCase()} ${ep.path}`).toBe(401);
      }
    });

    it("rejects verified non-admin email tokens and unverified admin email tokens with 403", async () => {
      const nonAdminRes = await request(app)
        .get("/api/admin/messages")
        .set("Authorization", "Bearer non-admin-token");
      expect(nonAdminRes.status).toBe(403);

      const unverifiedRes = await request(app)
        .get("/api/admin/messages")
        .set("Authorization", "Bearer admin-unverified-token");
      expect(unverifiedRes.status).toBe(403);
    });

    it("retires legacy simulated OTP login endpoint with 410 Gone", async () => {
      const res = await request(app)
        .post("/api/admin/login")
        .send({ email: "wrickbusiness@gmail.com", password: "test" });
      expect(res.status).toBe(410);
      expect(res.body).not.toHaveProperty("otpSimulated");
      expect(res.body).not.toHaveProperty("tempToken");
    });

    it("allows verified owner token on admin routes", async () => {
      const res = await request(app)
        .get("/api/admin/session")
        .set("Authorization", "Bearer admin-valid-token");
      expect(res.status).toBe(200);
      expect(res.body.authenticated).toBe(true);
      expect(res.body.email).toBe("wrickbusiness@gmail.com");
    });
  });

  describe("Contact Form Validation, Rate Limiting & Persistence", () => {
    it("persists valid contact submissions and reports honest delivery status without an external email provider", async () => {
      const res = await request(app)
        .post("/api/contact")
        .set("X-Forwarded-For", "198.51.100.10")
        .send({
          name: "Aarav Sharma",
          email: "aarav@example.org",
          topic: "Project Inquiry",
          subject: "Collaboration on YOLOv8 project",
          message: "Hello Sayam, let us collaborate on an open-source computer vision project.",
          clientTimestamp: Date.now() - 5000,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.submissionId).toMatch(/^msg_/);
      expect(res.body.delivered).toBe(false);
      expect(res.body.deliveryStatus).toBe("stored_pending_email_config");

      const adminMsgs = await request(app)
        .get("/api/admin/messages")
        .set("Authorization", "Bearer admin-valid-token");
      expect(adminMsgs.status).toBe(200);
      expect(adminMsgs.body.length).toBe(1);
      expect(adminMsgs.body[0].id).toBe(res.body.submissionId);
    });

    it("rejects honeypot spam, rapid submissions, and >2MB attachments", async () => {
      const honeypotRes = await request(app)
        .post("/api/contact")
        .set("X-Forwarded-For", "198.51.100.11")
        .send({
          name: "Bot",
          email: "bot@example.com",
          message: "Spam message body content here.",
          honeypot: "http://spam.example",
        });
      expect(honeypotRes.status).toBe(400);

      const oversizedAttachment = "A".repeat(3 * 1024 * 1024);
      const largeRes = await request(app)
        .post("/api/contact")
        .set("X-Forwarded-For", "198.51.100.12")
        .send({
          name: "User",
          email: "user@example.com",
          message: "Message with oversized attachment bytes.",
          attachmentName: "portfolio.pdf",
          attachmentMimeType: "application/pdf",
          attachmentData: oversizedAttachment,
          clientTimestamp: Date.now() - 5000,
        });
      expect(largeRes.status).toBe(400);
    });

    it("throttles repeated contact submissions from the same IP after 5 requests (429)", async () => {
      const ip = "203.0.113.42";
      for (let i = 0; i < 5; i++) {
        const okRes = await request(app)
          .post("/api/contact")
          .set("X-Forwarded-For", ip)
          .send({
            name: "Rate Test",
            email: "rate@example.com",
            message: `Inquiry attempt number ${i + 1} valid payload.`,
            clientTimestamp: Date.now() - 5000,
          });
        expect(okRes.status).toBe(200);
      }

      const throttled = await request(app)
        .post("/api/contact")
        .set("X-Forwarded-For", ip)
        .send({
          name: "Rate Test",
          email: "rate@example.com",
          message: "Sixth inquiry that should trigger rate limiter.",
          clientTimestamp: Date.now() - 5000,
        });
      expect(throttled.status).toBe(429);
    });
  });

  describe("Newsletter, Testimonials, Certificates CRUD & Honest Analytics", () => {
    it("deduplicates newsletter subscribers deterministically", async () => {
      const first = await request(app)
        .post("/api/newsletter/subscribe")
        .send({ email: "Reader@Example.com" });
      expect(first.status).toBe(200);
      expect(first.body.already).toBe(false);

      const second = await request(app)
        .post("/api/newsletter/subscribe")
        .send({ email: "reader@example.com" });
      expect(second.status).toBe(200);
      expect(second.body.already).toBe(true);
    });

    it("keeps newly submitted testimonials pending until admin approves them", async () => {
      const submitRes = await request(app)
        .post("/api/testimonials")
        .send({
          name: "Priya Sen",
          role: "Hackathon Teammate",
          content: "Consistent, fast, and thorough full-stack engineering.",
        });
      expect(submitRes.status).toBe(201);
      expect(submitRes.body.pendingApproval).toBe(true);
      const createdId = submitRes.body.testimonial.id;

      // Not visible on public endpoint yet
      const pubBefore = await request(app).get("/api/portfolio-data");
      expect(pubBefore.body.testimonials.some((t: any) => t.id === createdId)).toBe(false);

      // Visible to admin & approvable
      const approveRes = await request(app)
        .post("/api/admin/testimonials/action")
        .set("Authorization", "Bearer admin-valid-token")
        .send({ id: createdId, action: "approve" });
      expect(approveRes.status).toBe(200);

      const pubAfter = await request(app).get("/api/portfolio-data");
      expect(pubAfter.body.testimonials.some((t: any) => t.id === createdId)).toBe(true);
    });

    it("supports full admin CRUD on /api/certificates", async () => {
      const created = await request(app)
        .post("/api/certificates")
        .set("Authorization", "Bearer admin-valid-token")
        .send({
          title: "Distributed Systems Specialization",
          issuer: "Coursera",
          category: "CERTIFICATIONS",
          issueDate: "2026-04",
          skills: ["Distributed Systems", "Go"],
        });
      expect(created.status).toBe(201);
      const id = created.body.id;

      const updated = await request(app)
        .patch(`/api/certificates/${encodeURIComponent(id)}`)
        .set("Authorization", "Bearer admin-valid-token")
        .send({ issuer: "Coursera Verified", featured: true });
      expect(updated.status).toBe(200);
      expect(updated.body.issuer).toBe("Coursera Verified");
      expect(updated.body.featured).toBe(true);

      const del = await request(app)
        .delete(`/api/certificates/${encodeURIComponent(id)}`)
        .set("Authorization", "Bearer admin-valid-token");
      expect(del.status).toBe(200);

      const afterGet = await request(app).get(`/api/certificates/${encodeURIComponent(id)}`);
      expect(afterGet.status).toBe(404);
    });

    it("computes honest zero analytics initially and updates from real telemetry beacons", async () => {
      const emptySummary = await request(app)
        .get("/api/admin/analytics")
        .set("Authorization", "Bearer admin-valid-token");
      expect(emptySummary.status).toBe(200);
      expect(emptySummary.body.totalVisits).toBe(0);
      expect(emptySummary.body.avgDurationSec).toBe(0);
      expect(emptySummary.body.countryChart).toEqual([]);

      await request(app).post("/api/analytics/visit").send({
        eventType: "page_view",
        sessionId: "sess_real_1",
        page: "PROJECTS Page",
        device: "Desktop",
        source: "GitHub",
        durationSec: 0,
      });
      await request(app).post("/api/analytics/visit").send({
        eventType: "session_duration",
        sessionId: "sess_real_1",
        page: "PROJECTS Page",
        device: "Desktop",
        source: "GitHub",
        durationSec: 45,
      });

      const liveSummary = await request(app)
        .get("/api/admin/analytics")
        .set("Authorization", "Bearer admin-valid-token");
      expect(liveSummary.status).toBe(200);
      expect(liveSummary.body.totalVisits).toBe(1);
      expect(liveSummary.body.uniqueSessions).toBe(1);
      expect(liveSummary.body.avgDurationSec).toBe(45);
      expect(liveSummary.body.sourceChart).toEqual([{ name: "GitHub", value: 1 }]);
    });
  });
});
