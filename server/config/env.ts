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

  const rawPort = process.env.PORT ? parseInt(process.env.PORT, 10) : NaN;
  const hasValidPort = !Number.isNaN(rawPort) && rawPort > 0;
  const defaultPort = process.env.DEFAULT_APP_PORT
    ? parseInt(process.env.DEFAULT_APP_PORT, 10)
    : NaN;
  const hasValidDefaultPort = !Number.isNaN(defaultPort) && defaultPort > 0;

  if (process.env.NODE_ENV === "production") {
    if (
      hasValidPort &&
      (!hasValidDefaultPort || process.env.PORT !== process.env.NGINX_PORT)
    ) {
      return rawPort;
    }
    if (hasValidDefaultPort) return defaultPort;
    return 3000;
  }

  if (hasValidDefaultPort) {
    return defaultPort;
  }
  if (
    process.env.NGINX_PORT &&
    process.env.PORT === process.env.NGINX_PORT
  ) {
    return 3000;
  }
  return hasValidPort ? rawPort : 3000;
}

export interface EnvironmentDiagnostic {
  mandatoryOk: boolean;
  missingMandatory: string[];
}

/**
 * Central non-secret server configuration.
 * These addresses are fixed operational values (not secret env vars).
 */
export const SERVER_CONFIG = {
  adminEmail: "wrickbusiness@gmail.com",
  contactToEmail: "sayammukherjee1506@gmail.com",
} as const;

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

  // Fixed Server Configuration (non-secret)
  adminEmail: SERVER_CONFIG.adminEmail,
  contactToEmail: SERVER_CONFIG.contactToEmail,
  appUrl: (process.env.APP_URL || "https://sayammukherjee.in").trim(),
  firebase: {
    projectId: firebaseConfig.projectId,
    apiKey: firebaseConfig.apiKey,
    firestoreDatabaseId: firebaseConfig.firestoreDatabaseId || "(default)",
  },

  // Lazy optional integrations
  get youtubeApiKey(): string {
    return (process.env.YOUTUBE_API_KEY || "").trim();
  },
};

export function validateServerEnvironment(): EnvironmentDiagnostic {
  const missingMandatory: string[] = [];
  if (!env.firebase.projectId) missingMandatory.push("firebase-applet-config.json:projectId");
  if (!env.firebase.apiKey) missingMandatory.push("firebase-applet-config.json:apiKey");

  return {
    mandatoryOk: missingMandatory.length === 0,
    missingMandatory,
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
}
