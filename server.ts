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

  // Guard /documents and /images so missing files never fall back to SPA index.html
  const staticRoot = env.isProduction
    ? path.resolve(process.cwd(), "dist")
    : path.resolve(process.cwd(), "public");

  app.use(["/documents", "/images"], (req, res, next) => {
    const cleanRel = req.originalUrl.split("?")[0];
    const targetPath = path.resolve(staticRoot, "." + cleanRel);
    if (
      !targetPath.startsWith(staticRoot + path.sep) ||
      !fs.existsSync(targetPath) ||
      !fs.statSync(targetPath).isFile()
    ) {
      return res.status(404).json({
        error: "Document or static asset not found",
        path: cleanRel,
      });
    }
    return next();
  });

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
    if (!fs.existsSync(indexHtml)) {
      throw new Error(
        `Production build missing ${indexHtml}. Run "npm run build" before starting in production mode.`
      );
    }
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(indexHtml);
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
    if (err.code === "EADDRINUSE" && !env.isProduction) {
      console.warn(
        `[Server] Port ${env.port} already bound or transitioning. Dev server process remains resilient.`
      );
      return;
    }
    console.error("[Server] Fatal HTTP server error:", err);
    if (env.isProduction) {
      process.exit(1);
    }
  });

  httpServer.listen(env.port, "0.0.0.0", () => {
    console.log(`Server running on port ${env.port}`);
  });
}

if (!env.isServerless && !env.isTest) {
  startServer().catch((err) => {
    console.error("[Startup] Failed to start server:", err);
    process.exit(1);
  });
}
