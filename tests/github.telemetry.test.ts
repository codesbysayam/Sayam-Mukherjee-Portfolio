import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../server/app.ts";
import {
  aggregateLanguages,
  buildTelemetryFromSnapshot,
  extractNextLink,
  formatBytesCompact,
  formatPercentage,
  readLocalSnapshotJson,
  resetTelemetryCacheForTests,
} from "../server/services/githubTelemetry.ts";

describe("Canonical GitHub Telemetry Service & API Consistency", () => {
  const app = createApp();

  beforeEach(() => {
    resetTelemetryCacheForTests();
  });

  it("formats percentages with sub-0.1% precision and never displays 0% for non-zero bytes", () => {
    expect(formatPercentage(93.8123)).toBe("93.8%");
    expect(formatPercentage(0.031)).toBe("0.03%");
    expect(formatPercentage(0.014)).toBe("0.01%");
    expect(formatPercentage(0.0029)).toBe("<0.01%");
    expect(formatPercentage(0)).toBe("0%");
    expect(formatBytesCompact(17758014)).toBe("16.9 MB");
  });

  it("parses safe api.github.com pagination links and rejects untrusted hosts", () => {
    expect(
      extractNextLink(
        '<https://api.github.com/users/codesbysayam/repos?page=2>; rel="next", <https://api.github.com/users/codesbysayam/repos?page=5>; rel="last"'
      )
    ).toBe("https://api.github.com/users/codesbysayam/repos?page=2");

    expect(
      extractNextLink('<http://169.254.169.254/latest>; rel="next"')
    ).toBeNull();
    expect(
      extractNextLink('<https://evil.example/api>; rel="next"')
    ).toBeNull();
  });

  it("excludes forked repositories from owned language aggregation by default", () => {
    const sampleRepos = [
      {
        name: "owned-app",
        isFork: false,
        languages: { TypeScript: 900, Shell: 10 },
      },
      {
        name: "forked-app",
        isFork: true,
        languages: { TypeScript: 5000, Ruby: 1000 },
      },
    ];

    const result = aggregateLanguages(sampleRepos, { excludeForks: true });
    expect(result.totalCodeBytes).toBe(910);
    expect(result.languages.map((l) => l.name)).toEqual(["TypeScript", "Shell"]);
    expect(result.languages.find((l) => l.name === "Ruby")).toBeUndefined();
  });

  it("handles empty repository telemetry inputs without crashing", () => {
    const emptyTelemetry = buildTelemetryFromSnapshot({
      username: "codesbysayam",
      repositories: [],
      languages: {},
    });

    expect(emptyTelemetry.totalRepos).toBe(0);
    expect(emptyTelemetry.totalCodeBytes).toBe(0);
    expect(emptyTelemetry.languages).toEqual([]);
    expect(emptyTelemetry.repositories).toEqual([]);
  });

  it("computes consistent totals from local public/data/github.json snapshot and across telemetry endpoints", async () => {
    const snapshot = readLocalSnapshotJson();
    expect(snapshot).not.toBeNull();

    const [telemetryRes, languagesRes, profileRes, statsRes] = await Promise.all([
      request(app).get("/api/github/telemetry"),
      request(app).get("/api/github/languages"),
      request(app).get("/api/github/profile"),
      request(app).get("/api/github-stats"),
    ]);

    expect(telemetryRes.status).toBe(200);
    expect(languagesRes.status).toBe(200);
    expect(profileRes.status).toBe(200);
    expect(statsRes.status).toBe(200);

    const telemetry = telemetryRes.body;
    const expectedFromSnapshot = buildTelemetryFromSnapshot(snapshot!);
    expect(telemetry.totalRepos).toBe(expectedFromSnapshot.totalRepos);
    expect(telemetry.ownedReposCount).toBe(expectedFromSnapshot.ownedReposCount);
    expect(telemetry.forkedReposCount).toBe(expectedFromSnapshot.forkedReposCount);
    expect(telemetry.totalCodeBytes).toBe(expectedFromSnapshot.totalCodeBytes);
    expect(telemetry.totalCodeBytes).toBeGreaterThan(0);

    // Every non-zero language must format above 0%
    for (const lang of telemetry.languages) {
      expect(lang.bytes).toBeGreaterThan(0);
      expect(lang.formattedPercentage).not.toBe("0%");
    }

    // Cross-endpoint consistency checks
    expect(languagesRes.body.totalBytes).toBe(telemetry.totalCodeBytes);
    expect(languagesRes.body.languages[0].language).toBe("TypeScript");
    expect(languagesRes.body.languages[0].percentage).toBeCloseTo(
      telemetry.languages[0].percentage,
      1
    );

    expect(profileRes.body.publicRepos).toBe(telemetry.totalRepos);
    expect(profileRes.body.totalCodeBytes).toBe(telemetry.totalCodeBytes);
    expect(profileRes.body.totalStars).toBe(telemetry.totalStars);

    expect(statsRes.body.repositories).toBe(telemetry.totalRepos);
    expect(statsRes.body.totalCodeBytes).toBe(telemetry.totalCodeBytes);
    expect(statsRes.body.stars).toBe(telemetry.totalStars);
  });
});
