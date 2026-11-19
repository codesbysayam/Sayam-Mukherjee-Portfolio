import express from "express";
import { assistantHandler, generateDeterministicAnswer } from "./routes/assistant.ts";
import { getAllChannelsHandler } from "./routes/youtube.ts";
import { createPortfolioRouter } from "./routes/portfolio.routes.ts";
import { createCertificatesRouter } from "./routes/certificates.routes.ts";
import { createCommunicationsRouter } from "./routes/communications.routes.ts";
import { createAdminRouter } from "./routes/admin.routes.ts";
import { createTelemetryRouter } from "./routes/telemetry.routes.ts";

export function createApp() {
  const app = express();

  // Bounded JSON limit (max 4mb to accommodate optional <=2MB contact attachment metadata safely)
  app.use(express.json({ limit: "4mb" }));

  // Production HTTPS and Security Headers
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    res.setHeader("Content-Security-Policy", "upgrade-insecure-requests");
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );
    next();
  });

  // Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Domain API Routers
  app.use(createPortfolioRouter());
  app.use(createCertificatesRouter());
  app.use(createCommunicationsRouter());
  app.use(createAdminRouter());
  app.use(createTelemetryRouter());

  // Knowledge-Grounded Portfolio Assistant & YouTube Channels
  app.post("/api/assistant", assistantHandler);
  app.post("/api/gemini/chat", (req, res) => {
    const { userMessage, message } = req.body ?? {};
    const query = (userMessage || message || "").trim();
    const responseText = generateDeterministicAnswer(query);
    res.json({ response: responseText, sources: [] });
  });
  app.get("/api/youtube/channels", getAllChannelsHandler);

  // Unmatched API endpoint 404 handler (prevents falling through to SPA HTML)
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "Endpoint not found", path: req.path });
  });

  return app;
}
