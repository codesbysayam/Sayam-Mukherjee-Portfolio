import { z } from "zod";

const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024; // 2MB hard ceiling
const ALLOWED_ATTACHMENT_EXTENSIONS = new Set([
  ".pdf",
  ".txt",
  ".md",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".doc",
  ".docx",
]);
const ALLOWED_MIME_PREFIXES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const contactSubmissionSchema = z
  .object({
    firstName: z.string().trim().max(80).optional(),
    lastName: z.string().trim().max(80).optional(),
    name: z.string().trim().max(160).optional(),
    email: z.string().trim().email("Please provide a valid email address.").max(160),
    company: z.string().trim().max(140).optional(),
    organization: z.string().trim().max(140).optional(),
    country: z.string().trim().max(80).optional(),
    phone: z.string().trim().max(40).optional(),
    subject: z.string().trim().max(200).optional(),
    topic: z.string().trim().max(100).optional(),
    message: z
      .string()
      .trim()
      .min(10, "Message must contain at least 10 characters.")
      .max(4000, "Message cannot exceed 4000 characters."),
    budget: z.string().trim().max(80).optional(),
    timeline: z.string().trim().max(80).optional(),
    attachmentName: z.string().trim().max(200).nullable().optional(),
    attachmentMimeType: z.string().trim().max(100).nullable().optional(),
    attachmentSizeBytes: z.number().int().min(0).optional(),
    attachmentData: z.string().nullable().optional(),
    website: z.string().optional(),
    phone_hp: z.string().optional(),
    honeypot: z.string().optional(),
    clientTimestamp: z.number().optional(),
    timestamp: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    const resolvedName = (data.firstName || data.name || "").trim();
    if (!resolvedName || resolvedName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["name"],
        message: "Please provide your name (minimum 2 characters).",
      });
    }

    if (data.attachmentName) {
      const lower = data.attachmentName.toLowerCase();
      const dotIdx = lower.lastIndexOf(".");
      const ext = dotIdx >= 0 ? lower.slice(dotIdx) : "";
      if (!ALLOWED_ATTACHMENT_EXTENSIONS.has(ext)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["attachmentName"],
          message: "Unsupported attachment extension.",
        });
      }
    }

    if (
      data.attachmentMimeType &&
      !ALLOWED_MIME_PREFIXES.includes(data.attachmentMimeType.toLowerCase())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["attachmentMimeType"],
        message: "Unsupported attachment MIME type.",
      });
    }

    let computedBytes = data.attachmentSizeBytes ?? 0;
    if (data.attachmentData) {
      computedBytes = Math.ceil((data.attachmentData.length * 3) / 4);
    }
    if (computedBytes > MAX_ATTACHMENT_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["attachmentData"],
        message: "Attachment exceeds maximum allowed size of 2MB.",
      });
    }
  });

export const newsletterSubscribeSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(160),
});

export const newsletterBroadcastSchema = z.object({
  subject: z.string().trim().min(2).max(200),
  body: z.string().trim().min(5).max(10000),
});

export const testimonialCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().min(2).max(120).optional().default("Collaborator"),
  content: z.string().trim().min(10).max(1200),
  avatar: z.string().trim().max(400).optional().default(""),
});

export const analyticsEventSchema = z.object({
  eventType: z
    .enum(["page_view", "session_duration", "contact_conversion"])
    .optional()
    .default("page_view"),
  sessionId: z.string().trim().min(3).max(80).optional(),
  page: z.string().trim().min(1).max(120).optional().default("Home"),
  device: z.enum(["Desktop", "Mobile", "Tablet"]).optional().default("Desktop"),
  source: z.string().trim().min(1).max(80).optional().default("Direct"),
  duration: z.number().min(0).max(86400).optional(),
  durationSec: z.number().min(0).max(86400).optional(),
});

export const messageActionSchema = z.object({
  id: z.string().trim().min(3).max(120),
  action: z.enum(["archive", "delete", "reply"]),
});

export const testimonialActionSchema = z.object({
  id: z.string().trim().min(3).max(120),
  action: z.enum(["approve", "reject"]),
});

export const certificateCategoryEnum = z.enum([
  "CERTIFICATIONS",
  "ACHIEVEMENTS",
  "COMPETITIONS",
  "COURSES",
  "WORKSHOPS",
  "ACADEMIC RECORD",
  "OTHER",
]);

export const certificateCreateSchema = z.object({
  title: z.string().trim().min(2).max(200),
  issuer: z.string().trim().min(2).max(160),
  category: certificateCategoryEnum,
  issueDate: z.string().trim().min(2).max(40),
  description: z.string().trim().max(2000).optional(),
  credentialId: z.string().trim().max(120).optional(),
  credentialUrl: z.string().trim().max(500).optional(),
  imageUrl: z.string().trim().max(500).optional(),
  pdfUrl: z.string().trim().max(500).optional(),
  skills: z.array(z.string().trim().min(1).max(80)).max(30).optional().default([]),
  verificationStatus: z
    .enum(["VERIFIED", "LINK AVAILABLE", "NO VERIFICATION LINK"])
    .optional()
    .default("LINK AVAILABLE"),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
});

export const certificateUpdateSchema = certificateCreateSchema.partial();

export const portfolioUpdateSchema = z.object({
  projects: z.array(z.any()).max(100).optional(),
  blogs: z.array(z.any()).max(200).optional(),
  certifications: z.array(z.any()).max(200).optional(),
  skills: z.array(z.any()).max(30).optional(),
  experience: z.array(z.any()).max(50).optional(),
  achievements: z.array(z.any()).max(100).optional(),
  learningDashboard: z.record(z.string(), z.any()).optional(),
  stats: z.record(z.string(), z.any()).optional(),
  socials: z.record(z.string(), z.any()).optional(),
});
