import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

interface FirebaseAppletConfig {
  projectId: string;
  apiKey: string;
  firestoreDatabaseId?: string;
}

function loadFirebaseAppletConfig(): FirebaseAppletConfig {
  const candidates = [
    path.resolve(process.cwd(), "firebase-applet-config.json"),
    path.resolve(process.cwd(), "../firebase-applet-config.json"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      try {
        return JSON.parse(fs.readFileSync(candidate, "utf-8")) as FirebaseAppletConfig;
      } catch {
        // Fall through to empty config so startup diagnostics report actionable error
      }
    }
  }
  return { projectId: "", apiKey: "", firestoreDatabaseId: "(default)" };
}

const firebaseConfig = loadFirebaseAppletConfig();

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

export interface EnvironmentDiagnostic {
  mandatoryOk: boolean;
  missingMandatory: string[];
  optionalDisabled: Array<{ variable: string; integration: string }>;
}

export const env = {
  // Development & Runtime Deployment Configuration
  port: parseServerPort(),
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: Boolean(process.env.VITEST || process.env.NODE_ENV === "test"),
  isServerless: Boolean(
    process.env.VERCEL ||
      process.env.VERCEL_ENV ||
      process.env.AWS_LAMBDA_FUNCTION_NAME
  ),
  disableHmr: process.env.DISABLE_HMR === "true",

  // Mandatory Application Configuration (with verified defaults)
  adminEmail: (process.env.ADMIN_EMAIL || "wrickbusiness@gmail.com")
    .trim()
    .toLowerCase(),
  appUrl: (process.env.APP_URL || "https://sayammukherjee.in").trim(),
  firebase: {
    projectId: firebaseConfig.projectId,
    apiKey: firebaseConfig.apiKey,
    firestoreDatabaseId: firebaseConfig.firestoreDatabaseId || "(default)",
  },

  // Optional Integrations (non-blocking)
  geminiApiKey: (process.env.GEMINI_API_KEY || "").trim(),
  resendApiKey: (process.env.RESEND_API_KEY || "").trim(),
  contactFromEmail: (
    process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev"
  ).trim(),
  contactToEmail: (
    process.env.CONTACT_TO_EMAIL || "sayammukherjee1506@gmail.com"
  ).trim(),
  youtubeApiKey: (process.env.YOUTUBE_API_KEY || "").trim(),
};

export function validateServerEnvironment(): EnvironmentDiagnostic {
  const missingMandatory: string[] = [];
  if (!env.firebase.projectId) missingMandatory.push("firebase-applet-config.json:projectId");
  if (!env.firebase.apiKey) missingMandatory.push("firebase-applet-config.json:apiKey");
  if (!env.adminEmail) missingMandatory.push("ADMIN_EMAIL");

  const optionalDisabled: Array<{ variable: string; integration: string }> = [];
  if (!env.resendApiKey) {
    optionalDisabled.push({
      variable: "RESEND_API_KEY",
      integration: "Transactional email delivery (Resend)",
    });
  }
  if (!env.geminiApiKey) {
    optionalDisabled.push({
      variable: "GEMINI_API_KEY",
      integration: "Generative AI Assistant (knowledge-grounded engine active)",
    });
  }
  if (!env.youtubeApiKey) {
    optionalDisabled.push({
      variable: "YOUTUBE_API_KEY",
      integration: "Live YouTube channel stats refresh",
    });
  }

  return {
    mandatoryOk: missingMandatory.length === 0,
    missingMandatory,
    optionalDisabled,
  };
}

export function logEnvironmentDiagnostics(): void {
  if (env.isTest) return;
  const diag = validateServerEnvironment();
  if (!diag.mandatoryOk) {
    console.error(
      `[Config Error] Missing mandatory configuration: ${diag.missingMandatory.join(", ")}`
    );
  }
  if (diag.optionalDisabled.length > 0) {
    const names = diag.optionalDisabled.map((d) => d.variable).join(", ");
    console.info(
      `[Config] Optional integrations running in fallback mode (unconfigured: ${names}).`
    );
  }
}
