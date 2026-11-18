import crypto from "crypto";
import {
  createFirestoreDocStrict,
  deleteFirestoreDoc,
  patchFirestoreDoc,
  queryFirestoreCollection,
} from "../services/firestoreRest.ts";
import {
  DeliveryStatus,
  dispatchNewsletterBroadcast,
  NewsletterDispatchResult,
  sendContactNotification,
} from "../services/email.service.ts";
import {
  INITIAL_VERIFIED_TESTIMONIALS,
  PublicTestimonial,
} from "./portfolio.repository.ts";

export interface ContactSubmissionRecord {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  company: string;
  country: string;
  phone: string;
  subject: string;
  topic: string;
  message: string;
  budget: string;
  timeline: string;
  attachmentName?: string;
  attachmentMimeType?: string;
  attachmentSizeBytes?: number;
  deliveryStatus: DeliveryStatus;
  deliveryError?: string;
  status: "unread" | "archived" | "replied";
  createdAt?: string;
}

export interface SubscriberRecord {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  createdAt?: string;
}

export async function createContactSubmission(input: {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  company: string;
  country: string;
  phone: string;
  subject: string;
  topic: string;
  message: string;
  budget: string;
  timeline: string;
  attachmentName?: string | null;
  attachmentMimeType?: string | null;
  attachmentSizeBytes?: number;
}): Promise<{
  submissionId: string;
  delivered: boolean;
  deliveryStatus: DeliveryStatus;
  deliveryError?: string;
  createdAt: string;
}> {
  const submissionId = `msg_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

  const emailResult = await sendContactNotification({
    submissionId,
    name: input.name,
    email: input.email,
    topic: input.topic,
    subject: input.subject,
    message: input.message,
    company: input.company,
    country: input.country,
    budget: input.budget,
    timeline: input.timeline,
    attachmentName: input.attachmentName,
  });

  const record: Record<string, unknown> = {
    id: submissionId,
    firstName: input.firstName,
    lastName: input.lastName,
    name: input.name,
    email: input.email.toLowerCase(),
    company: input.company,
    country: input.country,
    phone: input.phone,
    subject: input.subject,
    topic: input.topic,
    message: input.message,
    budget: input.budget,
    timeline: input.timeline,
    deliveryStatus: emailResult.deliveryStatus,
    status: "unread",
  };

  if (input.attachmentName) record.attachmentName = input.attachmentName;
  if (input.attachmentMimeType) record.attachmentMimeType = input.attachmentMimeType;
  if (typeof input.attachmentSizeBytes === "number" && input.attachmentSizeBytes > 0) {
    record.attachmentSizeBytes = input.attachmentSizeBytes;
  }
  if (emailResult.error) {
    record.deliveryError = emailResult.error.slice(0, 290);
  }

  const { createdAtIso } = await createFirestoreDocStrict(
    "contact_messages",
    submissionId,
    record,
    { useServerTimestampCreatedAt: true }
  );

  return {
    submissionId,
    delivered: emailResult.delivered,
    deliveryStatus: emailResult.deliveryStatus,
    deliveryError: emailResult.error,
    createdAt: createdAtIso,
  };
}

export async function listContactMessages(
  adminBearerToken: string
): Promise<ContactSubmissionRecord[]> {
  const docs = await queryFirestoreCollection<ContactSubmissionRecord>(
    "contact_messages",
    { bearerToken: adminBearerToken }
  );
  return docs.sort((a, b) =>
    String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
  );
}

export async function actionContactMessage(
  id: string,
  action: "archive" | "delete" | "reply",
  adminBearerToken: string
): Promise<ContactSubmissionRecord[]> {
  if (action === "delete") {
    await deleteFirestoreDoc("contact_messages", id, adminBearerToken);
  } else {
    await patchFirestoreDoc(
      "contact_messages",
      id,
      { status: action === "archive" ? "archived" : "replied" },
      adminBearerToken
    );
  }
  return listContactMessages(adminBearerToken);
}

export async function subscribeToNewsletter(email: string): Promise<{
  success: boolean;
  already: boolean;
  subscriberId: string;
}> {
  const normalized = email.trim().toLowerCase();
  const hash = crypto.createHash("sha256").update(normalized).digest("hex");
  const subscriberId = `sub_${hash.slice(0, 32)}`;

  const result = await createFirestoreDocStrict(
    "subscribers",
    subscriberId,
    {
      id: subscriberId,
      email: normalized,
      status: "active",
    },
    { useServerTimestampCreatedAt: true }
  );

  return {
    success: true,
    already: result.alreadyExists,
    subscriberId,
  };
}

export async function listSubscribers(
  adminBearerToken: string
): Promise<SubscriberRecord[]> {
  const docs = await queryFirestoreCollection<SubscriberRecord>("subscribers", {
    bearerToken: adminBearerToken,
  });
  return docs.sort((a, b) =>
    String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
  );
}

export async function deleteSubscriber(
  id: string,
  adminBearerToken: string
): Promise<SubscriberRecord[]> {
  await deleteFirestoreDoc("subscribers", id, adminBearerToken);
  return listSubscribers(adminBearerToken);
}

export async function sendNewsletterBroadcast(
  subject: string,
  body: string,
  adminBearerToken: string
): Promise<NewsletterDispatchResult> {
  const subscribers = await listSubscribers(adminBearerToken);
  const emails = subscribers
    .filter((s) => s.status !== "unsubscribed" && s.email)
    .map((s) => s.email);

  if (emails.length === 0) {
    return {
      success: false,
      deliveryStatus: "failed",
      provider: "none",
      sentCount: 0,
      failedCount: 0,
      error: "No active subscribers found to broadcast to.",
    };
  }

  return dispatchNewsletterBroadcast({
    subject,
    body,
    recipients: emails,
  });
}

export async function createTestimonialSubmission(input: {
  name: string;
  role: string;
  content: string;
  avatar?: string;
}): Promise<PublicTestimonial> {
  const id = `test_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
  const dateLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const payload = {
    id,
    name: input.name,
    role: input.role,
    content: input.content,
    approved: false,
    avatar: input.avatar || "",
    date: dateLabel,
  };

  const { createdAtIso } = await createFirestoreDocStrict(
    "testimonials",
    id,
    payload,
    { useServerTimestampCreatedAt: true }
  );

  return {
    ...payload,
    createdAt: createdAtIso,
  };
}

export async function listAdminTestimonials(
  adminBearerToken: string
): Promise<PublicTestimonial[]> {
  const dbDocs = await queryFirestoreCollection<PublicTestimonial>(
    "testimonials",
    { bearerToken: adminBearerToken }
  );
  const merged = new Map<string, PublicTestimonial>();
  for (const item of INITIAL_VERIFIED_TESTIMONIALS) {
    merged.set(item.id, item);
  }
  for (const doc of dbDocs) {
    if (doc && doc.id) {
      merged.set(doc.id, doc);
    }
  }
  return Array.from(merged.values());
}

export async function actionAdminTestimonial(
  id: string,
  action: "approve" | "reject",
  adminBearerToken: string
): Promise<PublicTestimonial[]> {
  if (action === "reject") {
    await deleteFirestoreDoc("testimonials", id, adminBearerToken);
  } else {
    await patchFirestoreDoc(
      "testimonials",
      id,
      { approved: true },
      adminBearerToken
    );
  }
  return listAdminTestimonials(adminBearerToken);
}
