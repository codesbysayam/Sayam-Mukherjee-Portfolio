#!/usr/bin/env node
/**
 * Automated Project Cover Capture Script
 * Captures 1440x900 desktop screenshots of public live project deployments
 * using Playwright Chromium with strict SSRF & private-IP protection.
 */

import fs from "fs";
import path from "path";
import dns from "dns/promises";
import net from "net";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const ROOT = process.cwd();
const TARGETS_PATH = path.join(ROOT, "scripts", "project-cover-targets.json");
const OUT_DIR = path.join(ROOT, "public", "images", "project-covers");
const MANIFEST_PATH = path.join(OUT_DIR, "capture-manifest.json");

function isPrivateOrReservedIp(ip) {
  if (!ip) return true;
  if (ip === "::1" || ip === "::" || ip.startsWith("fe80:") || ip.startsWith("fc") || ip.startsWith("fd")) {
    return true;
  }
  const normalized = ip.startsWith("::ffff:") ? ip.slice(7) : ip;
  if (!net.isIPv4(normalized)) return net.isIPv6(ip) ? false : true;

  const parts = normalized.split(".").map((n) => Number.parseInt(n, 10));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;

  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

async function assertSafePublicHttpsUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }

  if (parsed.protocol !== "https:") {
    throw new Error(`Blocked non-HTTPS URL protocol: ${parsed.protocol}`);
  }

  const host = parsed.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new Error(`Blocked local hostname: ${host}`);
  }

  if (net.isIP(host)) {
    if (isPrivateOrReservedIp(host)) {
      throw new Error(`Blocked private/reserved IP target: ${host}`);
    }
    return parsed.toString();
  }

  const records = await dns.lookup(host, { all: true });
  if (!records || records.length === 0) {
    throw new Error(`DNS lookup returned no addresses for ${host}`);
  }
  for (const record of records) {
    if (isPrivateOrReservedIp(record.address)) {
      throw new Error(`Blocked DNS resolution to private IP (${record.address}) for ${host}`);
    }
  }

  return parsed.toString();
}

async function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    const globalFallback = "/usr/local/share/bun-global/node_modules/playwright";
    if (fs.existsSync(globalFallback)) {
      return require(globalFallback);
    }
    throw new Error(
      "Playwright is not installed. Run `npx playwright install chromium` or install playwright."
    );
  }
}

async function main() {
  if (!fs.existsSync(TARGETS_PATH)) {
    throw new Error(`Missing targets manifest: ${TARGETS_PATH}`);
  }

  const targets = JSON.parse(fs.readFileSync(TARGETS_PATH, "utf-8"));
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const results = [];

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      ignoreHTTPSErrors: false,
    });

    for (const target of targets) {
      const outputFile = path.join(OUT_DIR, path.basename(target.output));
      const tempFile = `${outputFile}.tmp`;
      const startedAt = new Date().toISOString();

      try {
        const safeUrl = await assertSafePublicHttpsUrl(target.url);
        const page = await context.newPage();

        await page.route("**/*", async (route) => {
          const reqUrl = route.request().url();
          if (reqUrl.startsWith("https://") || reqUrl.startsWith("data:") || reqUrl.startsWith("blob:")) {
            return route.continue();
          }
          return route.abort();
        });

        await page.goto(safeUrl, { waitUntil: "domcontentloaded", timeout: 25000 });
        await page.waitForTimeout(Number(target.waitMs) || 2000);

        if (target.preClickSelector) {
          const trigger = page.locator(target.preClickSelector).first();
          if (await trigger.count()) {
            await trigger.click({ timeout: 3000 }).catch(() => {});
            await page.waitForTimeout(1400);
          }
        }

        for (const dismissText of ["Reject Optional", "Reject optional", "Necessary only"]) {
          const btn = page.locator(`button:has-text("${dismissText}")`).first();
          if (await btn.count()) {
            await btn.click({ timeout: 1500 }).catch(() => {});
            await page.waitForTimeout(350);
          }
        }

        await page.screenshot({
          path: tempFile,
          type: "jpeg",
          quality: 88,
          fullPage: false,
        });

        fs.renameSync(tempFile, outputFile);
        await page.close();

        results.push({
          id: target.id,
          url: safeUrl,
          output: `/images/project-covers/${path.basename(outputFile)}`,
          status: "captured",
          capturedAt: startedAt,
        });
        console.log(`[capture:covers] Captured ${target.id} -> ${path.basename(outputFile)}`);
      } catch (err) {
        if (fs.existsSync(tempFile)) {
          fs.rmSync(tempFile, { force: true });
        }
        const reason = err instanceof Error ? err.message : String(err);
        results.push({
          id: target.id,
          url: target.url,
          output: `/images/project-covers/${path.basename(outputFile)}`,
          status: "skipped",
          reason,
          attemptedAt: startedAt,
        });
        console.warn(`[capture:covers] Skipped ${target.id}: ${reason}`);
      }
    }
  } finally {
    await browser.close();
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    viewport: "1440x900",
    targets: results,
  };
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf-8");
  console.log(`[capture:covers] Manifest written to ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error("[capture:covers] Fatal error:", err);
  process.exit(1);
});
