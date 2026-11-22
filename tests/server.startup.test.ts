import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { parseServerPort } from "../server/config/env.ts";
import { createApp } from "../server/app.ts";

describe("Server Startup, Port Resolution & Production Route Verification", () => {
  const originalEnv = { ...process.env };
  const originalArgv = [...process.argv];

  afterEach(() => {
    process.env = { ...originalEnv };
    process.argv = [...originalArgv];
  });

  describe("parseServerPort()", () => {
    it("prioritizes explicit --port CLI argument over env vars", () => {
      process.argv = ["node", "dist/server.cjs", "--port", "4123"];
      process.env.NODE_ENV = "production";
      process.env.DEFAULT_APP_PORT = "3000";
      process.env.PORT = "8080";
      expect(parseServerPort()).toBe(4123);
    });

    it("uses explicit PORT in production when distinct from NGINX_PORT even if DEFAULT_APP_PORT=3000", () => {
      process.env.NODE_ENV = "production";
      process.env.DEFAULT_APP_PORT = "3000";
      process.env.NGINX_PORT = "8080";
      process.env.PORT = "3098";
      expect(parseServerPort()).toBe(3098);
    });

    it("falls back to DEFAULT_APP_PORT in production when PORT matches NGINX_PORT", () => {
      process.env.NODE_ENV = "production";
      process.env.DEFAULT_APP_PORT = "3000";
      process.env.NGINX_PORT = "8080";
      process.env.PORT = "8080";
      expect(parseServerPort()).toBe(3000);
    });

    it("uses PORT in standalone production hosts without DEFAULT_APP_PORT", () => {
      process.env.NODE_ENV = "production";
      delete process.env.DEFAULT_APP_PORT;
      process.env.NGINX_PORT = "8080";
      process.env.PORT = "8080";
      expect(parseServerPort()).toBe(8080);
    });

    it("keeps dev server on DEFAULT_APP_PORT (3000) when NODE_ENV is development", () => {
      process.env.NODE_ENV = "development";
      process.env.DEFAULT_APP_PORT = "3000";
      process.env.NGINX_PORT = "8080";
      process.env.PORT = "8080";
      expect(parseServerPort()).toBe(3000);
    });
  });

  describe("Core API Endpoints", () => {
    const app = createApp();

    it("returns healthy status from /api/health", async () => {
      const res = await request(app).get("/api/health");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status", "ok");
    });

    it("returns GitHub telemetry snapshot or live payload on /api/github/telemetry", async () => {
      const res = await request(app).get("/api/github/telemetry");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("repositories");
      expect(Array.isArray(res.body.repositories)).toBe(true);
    });
  });
});
