import express from "express";
import fs from "fs";
import http from "http";
import path from "path";
import { env, logEnvironmentDiagnostics, validateServerEnvironment } from "./server/config/env.ts";
import { createApp } from "./server/app.ts";
import { CACHE_TTL_MS, getDynamicGitHubSnapshot } from "./server/routes/telemetry.routes.ts";

const app = createApp();
export default app;

async function startServer() {
  if (env.isServerless || env.isTest) {
    return;
  }

  const diag = validateServerEnvironment();
  logEnvironmentDiagnostics();
  if (!diag.mandatoryOk) {
    console.warn(
      "[Startup] Mandatory server configuration incomplete — verify firebase-applet-config.json."
    );
  }

  const httpServer = http.createServer(app);

  if (!env.isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: { server: httpServer },
        host: "0.0.0.0",
        port: env.port,
        allowedHosts: true,
        hmr: env.disableHmr ? false : { server: httpServer },
        ...(env.disableHmr ? { ws: false as const } : {}),
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const indexHtml = path.join(distPath, "index.html");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }
    app.get("*", (req, res) => {
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).json({ error: "Route not found", path: req.path });
      }
    });
  }

  getDynamicGitHubSnapshot(true).catch((e) =>
    console.warn("Initial GitHub warmup error:", e)
  );
  setInterval(() => {
    getDynamicGitHubSnapshot(true).catch((e) =>
      console.warn("Periodic GitHub sync error:", e)
    );
  }, CACHE_TTL_MS);

  httpServer.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.warn(
        `[Server] Port ${env.port} already bound or transitioning. Dev server process remains resilient.`
      );
    } else {
      console.error("[Server] HTTP server encountered an error:", err);
    }
  });

  httpServer.listen(env.port, "0.0.0.0", () => {
    console.log(`Server running on port ${env.port}`);
  });
}

if (!env.isServerless && !env.isTest) {
  void startServer();
}
