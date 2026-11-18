import nodemailer from "nodemailer";
import { env } from "../config/env.ts";

export type DeliveryStatus = "sent" | "stored_pending_email_config" | "failed";

export interface EmailSendResult {
  delivered: boolean;
  deliveryStatus: DeliveryStatus;
  provider: "resend" | "smtp" | "none";
  messageId?: string;
  error?: string;
}

export interface ContactNotificationPayload {
  submissionId: string;
  name: string;
  email: string;
  topic?: string;
  subject: string;
  message: string;
  company?: string;
  country?: string;
  budget?: string;
  timeline?: string;
  attachmentName?: string | null;
}

export interface NewsletterDispatchPayload {
  subject: string;
  body: string;
  recipients: string[];
}

export interface NewsletterDispatchResult {
  success: boolean;
  deliveryStatus: DeliveryStatus;
  provider: "resend" | "smtp" | "none";
  sentCount: number;
  failedCount: number;
  error?: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetries<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts) {
        await delay(250 * Math.pow(2, attempt - 1));
      }
    }
  }
  throw lastErr;
}

export function isEmailTransportConfigured(): boolean {
  if (env.resendApiKey && env.contactFromEmail) return true;
  if (env.smtpHost && env.smtpUser && env.smtpPass) return true;
  return false;
}

async function sendViaResend(params: {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<{ id?: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.contactFromEmail,
      to: Array.isArray(params.to) ? params.to : [params.to],
      subject: params.subject,
      text: params.text,
      html: params.html,
      ...(params.replyTo ? { reply_to: params.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error (${res.status}): ${body.slice(0, 240)}`);
  }

  return (await res.json()) as { id?: string };
}

async function sendViaSmtp(params: {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<{ messageId?: string }> {
  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  const info = await transporter.sendMail({
    from: env.contactFromEmail || env.smtpUser,
    to: Array.isArray(params.to) ? params.to.join(", ") : params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
    ...(params.replyTo ? { replyTo: params.replyTo } : {}),
  });

  return { messageId: info.messageId };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactNotification(
  payload: ContactNotificationPayload
): Promise<EmailSendResult> {
  if (!isEmailTransportConfigured()) {
    return {
      delivered: false,
      deliveryStatus: "stored_pending_email_config",
      provider: "none",
      error:
        "External email transport (RESEND_API_KEY + CONTACT_FROM_EMAIL or SMTP_*) is not configured. Inquiry is persisted in the database.",
    };
  }

  const text = [
    `New portfolio contact submission (${payload.submissionId})`,
    `From: ${payload.name} <${payload.email}>`,
    `Topic: ${payload.topic || "General"}`,
    payload.company ? `Organization: ${payload.company}` : null,
    payload.country ? `Location: ${payload.country}` : null,
    payload.budget ? `Budget: ${payload.budget}` : null,
    payload.timeline ? `Timeline: ${payload.timeline}` : null,
    payload.attachmentName ? `Attachment metadata: ${payload.attachmentName}` : null,
    "",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family: sans-serif; color: #20231D; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">New Portfolio Inquiry</h2>
      <p style="font-size: 13px; color: #565A4E;">ID: ${escapeHtml(payload.submissionId)}</p>
      <p><strong>From:</strong> ${escapeHtml(payload.name)} (${escapeHtml(payload.email)})</p>
      <p><strong>Topic:</strong> ${escapeHtml(payload.topic || "General")}</p>
      ${payload.company ? `<p><strong>Organization:</strong> ${escapeHtml(payload.company)}</p>` : ""}
      ${payload.budget ? `<p><strong>Budget:</strong> ${escapeHtml(payload.budget)}</p>` : ""}
      ${payload.timeline ? `<p><strong>Timeline:</strong> ${escapeHtml(payload.timeline)}</p>` : ""}
      ${payload.attachmentName ? `<p><strong>Attachment:</strong> ${escapeHtml(payload.attachmentName)}</p>` : ""}
      <hr style="border: 0; border-top: 1px solid #DCDFD5; margin: 16px 0;" />
      <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(payload.message)}</pre>
    </div>
  `;

  try {
    if (env.resendApiKey && env.contactFromEmail) {
      const res = await withRetries(() =>
        sendViaResend({
          to: env.contactToEmail,
          subject: payload.subject,
          text,
          html,
          replyTo: payload.email,
        })
      );
      return {
        delivered: true,
        deliveryStatus: "sent",
        provider: "resend",
        messageId: res.id,
      };
    }

    const res = await withRetries(() =>
      sendViaSmtp({
        to: env.contactToEmail,
        subject: payload.subject,
        text,
        html,
        replyTo: payload.email,
      })
    );
    return {
      delivered: true,
      deliveryStatus: "sent",
      provider: "smtp",
      messageId: res.messageId,
    };
  } catch (err) {
    return {
      delivered: false,
      deliveryStatus: "failed",
      provider: env.resendApiKey ? "resend" : "smtp",
      error: err instanceof Error ? err.message : "Email dispatch failed",
    };
  }
}

export async function dispatchNewsletterBroadcast(
  payload: NewsletterDispatchPayload
): Promise<NewsletterDispatchResult> {
  if (!isEmailTransportConfigured()) {
    return {
      success: false,
      deliveryStatus: "stored_pending_email_config",
      provider: "none",
      sentCount: 0,
      failedCount: payload.recipients.length,
      error:
        "Email transport is not configured. Configure RESEND_API_KEY + CONTACT_FROM_EMAIL or SMTP credentials in server environment variables.",
    };
  }

  let sentCount = 0;
  let failedCount = 0;
  const html = `<div style="font-family: sans-serif; color: #20231D; line-height: 1.6;"><pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(
    payload.body
  )}</pre></div>`;

  const provider: "resend" | "smtp" =
    env.resendApiKey && env.contactFromEmail ? "resend" : "smtp";

  for (const recipient of payload.recipients) {
    try {
      await withRetries(async () => {
        if (provider === "resend") {
          await sendViaResend({
            to: recipient,
            subject: payload.subject,
            text: payload.body,
            html,
          });
        } else {
          await sendViaSmtp({
            to: recipient,
            subject: payload.subject,
            text: payload.body,
            html,
          });
        }
      });
      sentCount++;
    } catch {
      failedCount++;
    }
  }

  return {
    success: failedCount === 0 && sentCount > 0,
    deliveryStatus: sentCount > 0 && failedCount === 0 ? "sent" : "failed",
    provider,
    sentCount,
    failedCount,
    error:
      failedCount > 0
        ? `Delivered to ${sentCount} subscribers; ${failedCount} failed.`
        : undefined,
  };
}
