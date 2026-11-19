export type DeliveryStatus = "sent" | "stored_pending_email_config" | "failed";

export interface EmailSendResult {
  delivered: boolean;
  deliveryStatus: DeliveryStatus;
  provider: "none";
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
  provider: "none";
  sentCount: number;
  failedCount: number;
  error?: string;
}

/**
 * External email delivery is disabled so the portfolio operates cleanly
 * with zero email-provider credentials. Inquiries are persisted directly in Firestore.
 */
export function isEmailTransportConfigured(): boolean {
  return false;
}

export async function sendContactNotification(
  _payload: ContactNotificationPayload
): Promise<EmailSendResult> {
  return {
    delivered: false,
    deliveryStatus: "stored_pending_email_config",
    provider: "none",
  };
}

export async function dispatchNewsletterBroadcast(
  payload: NewsletterDispatchPayload
): Promise<NewsletterDispatchResult> {
  return {
    success: false,
    deliveryStatus: "stored_pending_email_config",
    provider: "none",
    sentCount: 0,
    failedCount: payload.recipients.length,
    error:
      "External email delivery is disabled. Subscribers remain persisted in Cloud Firestore.",
  };
}
