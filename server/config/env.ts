import dotenv from "dotenv";
import firebaseConfig from "../../firebase-applet-config.json" with { type: "json" };

dotenv.config();

export function parseServerPort(): number {
  const portArgIndex = process.argv.indexOf("--port");
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const val = parseInt(process.argv[portArgIndex + 1], 10);
    if (!Number.isNaN(val) && val > 0) return val;
  }
  if (process.env.DEFAULT_APP_PORT) {
    const defaultPort = parseInt(process.env.DEFAULT_APP_PORT, 10);
    if (!Number.isNaN(defaultPort) && defaultPort > 0) return defaultPort;
  }
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.NGINX_PORT &&
    process.env.PORT === process.env.NGINX_PORT
  ) {
    return 3000;
  }
  return Number(process.env.PORT) || 3000;
}

export const env = {
  port: parseServerPort(),
  isProduction: process.env.NODE_ENV === "production",
  isTest: Boolean(process.env.VITEST || process.env.NODE_ENV === "test"),
  isServerless: Boolean(
    process.env.VERCEL ||
      process.env.VERCEL_ENV ||
      process.env.AWS_LAMBDA_FUNCTION_NAME
  ),
  adminEmail: (process.env.ADMIN_EMAIL || "wrickbusiness@gmail.com").trim().toLowerCase(),
  appUrl: process.env.APP_URL || "https://sayammukherjee.in",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  contactFromEmail: process.env.CONTACT_FROM_EMAIL || "",
  contactToEmail: process.env.CONTACT_TO_EMAIL || "wrickbusiness@gmail.com",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpSecure: process.env.SMTP_SECURE === "true",
  firebase: {
    projectId: firebaseConfig.projectId,
    apiKey: firebaseConfig.apiKey,
    firestoreDatabaseId: firebaseConfig.firestoreDatabaseId || "(default)",
  },
};
