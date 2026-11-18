import crypto from "crypto";
import {
  createFirestoreDocStrict,
  queryFirestoreCollection,
} from "../services/firestoreRest.ts";
import { listContactMessages } from "./communications.repository.ts";

export interface AnalyticsEventRecord {
  id: string;
  eventType: "page_view" | "session_duration" | "contact_conversion";
  sessionId: string;
  page: string;
  device: "Desktop" | "Mobile" | "Tablet";
  source: string;
  durationSec: number;
  createdAt?: string;
}

export async function recordAnalyticsEvent(input: {
  eventType: "page_view" | "session_duration" | "contact_conversion";
  sessionId: string;
  page: string;
  device: "Desktop" | "Mobile" | "Tablet";
  source: string;
  durationSec: number;
}): Promise<{ id: string }> {
  const id = `evt_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  await createFirestoreDocStrict(
    "analytics_events",
    id,
    {
      id,
      eventType: input.eventType,
      sessionId: input.sessionId,
      page: input.page,
      device: input.device,
      source: input.source,
      durationSec: Math.max(0, Math.min(86400, Math.round(input.durationSec))),
    },
    { useServerTimestampCreatedAt: true }
  );
  return { id };
}

export async function getAdminAnalyticsSummary(adminBearerToken: string) {
  const [events, messages] = await Promise.all([
    queryFirestoreCollection<AnalyticsEventRecord>("analytics_events", {
      bearerToken: adminBearerToken,
    }),
    listContactMessages(adminBearerToken),
  ]);

  const pageViews = events.filter((e) => e.eventType === "page_view");
  const durationEvents = events.filter(
    (e) => e.eventType === "session_duration" || e.durationSec > 0
  );

  const uniqueSessions = new Set(events.map((e) => e.sessionId));
  const totalVisits = pageViews.length > 0 ? pageViews.length : uniqueSessions.size;

  const deviceCounts: Record<string, number> = {
    Desktop: 0,
    Mobile: 0,
    Tablet: 0,
  };
  const sourceCounts: Record<string, number> = {};
  const pageCounts: Record<string, number> = {};

  const last14Days: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    last14Days[label] = 0;
  }

  for (const ev of pageViews) {
    if (ev.device in deviceCounts) {
      deviceCounts[ev.device]++;
    }
    if (ev.source) {
      sourceCounts[ev.source] = (sourceCounts[ev.source] || 0) + 1;
    }
    if (ev.page) {
      pageCounts[ev.page] = (pageCounts[ev.page] || 0) + 1;
    }
    if (ev.createdAt) {
      const label = new Date(ev.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (label in last14Days) {
        last14Days[label]++;
      }
    }
  }

  const sessionMaxDurations = new Map<string, number>();
  for (const ev of durationEvents) {
    const prev = sessionMaxDurations.get(ev.sessionId) || 0;
    if (ev.durationSec > prev) {
      sessionMaxDurations.set(ev.sessionId, ev.durationSec);
    }
  }

  const durationValues = Array.from(sessionMaxDurations.values());
  const avgDurationSec =
    durationValues.length > 0
      ? Math.round(
          durationValues.reduce((sum, v) => sum + v, 0) / durationValues.length
        )
      : 0;

  const bouncedSessions = Array.from(uniqueSessions).filter((sid) => {
    const sessEvents = pageViews.filter((e) => e.sessionId === sid);
    const maxDur = sessionMaxDurations.get(sid) || 0;
    return sessEvents.length <= 1 && maxDur < 10;
  }).length;

  const bounceRatePct =
    uniqueSessions.size > 0
      ? Math.round((bouncedSessions / uniqueSessions.size) * 100)
      : 0;

  const conversionRatePct =
    uniqueSessions.size > 0
      ? Number(((messages.length / uniqueSessions.size) * 100).toFixed(1))
      : 0;

  const deviceChart = Object.entries(deviceCounts)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  const sourceChart = Object.entries(sourceCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const pageChart = Object.entries(pageCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const timelineChart = Object.entries(last14Days).map(([date, Visitors]) => ({
    date,
    Visitors,
  }));

  return {
    totalVisits,
    uniqueSessions: uniqueSessions.size,
    avgDurationSec,
    bounceRatePct,
    conversionRatePct,
    timelineChart,
    countryChart: [], // Real geo-IP lookup omitted to remain privacy-preserving without storing raw IPs
    deviceChart,
    sourceChart,
    pageChart,
  };
}
