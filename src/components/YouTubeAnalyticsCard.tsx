import React from "react";
import { Youtube, ExternalLink, Calendar, Clock, Eye, Users, ShieldAlert, Sparkles } from "lucide-react";
import {
  youtubeChannelAnalytics,
  type YouTubeChannelAnalytics,
  type YouTubeMetricSnapshot,
} from "../data/youtubeAnalytics";

interface YouTubeAnalyticsCardProps {
  channel: YouTubeChannelAnalytics;
  className?: string;
}

function displayMetric(
  metric: YouTubeMetricSnapshot | null,
  suffix = ""
): { text: string; isAvailable: boolean } {
  if (!metric) {
    return { text: "Not available", isAvailable: false };
  }

  const display =
    metric.displayValue ??
    (metric.value === null
      ? null
      : new Intl.NumberFormat("en-IN").format(metric.value));

  if (display === null) {
    return { text: "Not available", isAvailable: false };
  }

  return {
    text: suffix ? `${display} ${suffix}` : display,
    isAvailable: true,
  };
}

function periodLabel(metric: YouTubeMetricSnapshot | null): string {
  if (!metric) {
    return "No verified snapshot";
  }

  if (metric.periodStart && metric.periodEnd) {
    return `${metric.periodStart} to ${metric.periodEnd}`;
  }

  return "Snapshot as of 21 Oct 2026";
}

function MetricTile({
  label,
  value,
  isAvailable,
  icon: Icon,
}: {
  label: string;
  value: string;
  isAvailable: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col min-w-0 p-3 rounded-xl border border-zinc-900/80 bg-zinc-900/30">
      <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono mb-1 truncate">
        {Icon && <Icon className="w-3 h-3 text-zinc-500 shrink-0" />}
        <span className="truncate">{label}</span>
      </div>
      <span
        className={`font-display text-sm sm:text-base font-bold truncate ${
          isAvailable ? "text-zinc-100" : "text-zinc-500 font-mono text-xs italic font-normal"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function YouTubeAnalyticsCard({ channel, className = "" }: YouTubeAnalyticsCardProps) {
  const isObsidian = channel.channelId === "obsidianoptics" || channel.channelId === "obsidian-optics";
  const primaryPeriod = channel.periodViews ?? channel.watchTimeHours;

  const totalViews = displayMetric(channel.lifetimeViews);
  const periodViews = displayMetric(channel.periodViews);
  const watchTime = displayMetric(channel.watchTimeHours, "hours");
  const subGained = displayMetric(channel.subscribersGained);
  const realtimeSubs = displayMetric(channel.currentSubscribers);
  const last48hViews = displayMetric(channel.viewsLast48Hours);
  const engagedViews = displayMetric(channel.engagedViews);

  return (
    <article
      className={`rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-5 sm:p-6 flex flex-col justify-between space-y-6 transition-all duration-300 hover:border-zinc-700/80 shadow-xl ${className}`}
      aria-labelledby={`analytics-${channel.channelId}-title`}
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-zinc-900">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-red-950/30 border border-red-900/40 flex items-center justify-center shrink-0">
            <Youtube className="w-5 h-5 text-red-500" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                id={`analytics-${channel.channelId}-title`}
                className="text-base sm:text-lg font-bold font-display text-white truncate"
              >
                {channel.name}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-purple-900/50 bg-purple-950/30 text-purple-300">
                Verified Studio Snapshot
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400 mt-0.5 truncate">
              {channel.handle}
            </p>
          </div>
        </div>

        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${channel.name} on YouTube`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-mono font-medium text-zinc-200 hover:text-white hover:bg-zinc-850 hover:border-red-500/40 transition-colors shrink-0"
        >
          <span>Visit Channel</span>
          <ExternalLink className="w-3 h-3 text-red-400" />
        </a>
      </header>

      {/* Section 1: Lifetime Analytics */}
      <section className="space-y-2.5" aria-label="Lifetime analytics">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Lifetime Telemetry</span>
          </h4>
          <span className="text-[10px] font-mono text-zinc-500">
            {isObsidian ? "Exact studio metric" : "Not exposed in screenshot"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <MetricTile
            label="Total Channel Views"
            value={totalViews.text}
            isAvailable={totalViews.isAvailable}
            icon={Eye}
          />
          <div className="p-3 rounded-xl border border-zinc-900/60 bg-zinc-900/20 text-[11px] font-mono text-zinc-400 flex items-center">
            {isObsidian ? (
              <span>Verified lifetime milestone from Studio Overview header.</span>
            ) : (
              <span>Lifetime view tile omitted in 2026 selected period view.</span>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Selected Period Analytics */}
      <section className="space-y-2.5 pt-3 border-t border-zinc-900" aria-label="Selected-period analytics">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <h4 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            <span>Selected Period Performance</span>
          </h4>
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
            {periodLabel(primaryPeriod)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <MetricTile
            label="Period Views"
            value={periodViews.text}
            isAvailable={periodViews.isAvailable}
            icon={Eye}
          />
          <MetricTile
            label="Watch Time"
            value={watchTime.text}
            isAvailable={watchTime.isAvailable}
            icon={Clock}
          />
          <MetricTile
            label="Subscribers Gained"
            value={subGained.text}
            isAvailable={subGained.isAvailable}
            icon={Users}
          />
        </div>
      </section>

      {/* Section 3: Realtime Snapshot Panel */}
      <section className="space-y-2.5 pt-3 border-t border-zinc-900" aria-label="Realtime snapshot">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Realtime Snapshot (Studio Panel)</span>
          </h4>
          <span className="text-[10px] font-mono text-zinc-500">
            Captured 21 Oct 2026 • Static snapshot
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <MetricTile
            label="Realtime Subscribers"
            value={realtimeSubs.text}
            isAvailable={realtimeSubs.isAvailable}
            icon={Users}
          />
          <MetricTile
            label="Views (Last 48 Hours)"
            value={last48hViews.text}
            isAvailable={last48hViews.isAvailable}
            icon={Eye}
          />
          <MetricTile
            label="Engaged Views"
            value={engagedViews.text}
            isAvailable={engagedViews.isAvailable}
            icon={Sparkles}
          />
        </div>
      </section>

      {/* Footer attribution */}
      <footer className="pt-3 border-t border-zinc-900/80 flex items-center justify-between text-[11px] font-mono text-zinc-500 flex-wrap gap-2">
        <span className="flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
          <span>Source: Official YouTube Studio Analytics screenshot (21 Oct 2026)</span>
        </span>
        <span className="text-zinc-600">
          Not automatically updating live metrics
        </span>
      </footer>
    </article>
  );
}

export function YouTubeChannelAnalyticsSection() {
  return (
    <section
      className="space-y-6 pt-6"
      aria-labelledby="youtube-analytics-heading"
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-purple-400">
            CONTENT CREATION AUDIT
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span className="text-[10px] font-mono text-zinc-500">
            Verified Studio Records
          </span>
        </div>
        <h3
          id="youtube-analytics-heading"
          className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight"
        >
          YouTube Studio Analytics Snapshots
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Ground-truth metrics from YouTube Studio dashboards for <strong>Obsidian Optics</strong> and <strong>BEASTIFIED</strong>. Distinguishing lifetime reach, selected-period watch time, and 48-hour realtime velocity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {youtubeChannelAnalytics.map((channel) => (
          <YouTubeAnalyticsCard
            key={channel.channelId}
            channel={channel}
          />
        ))}
      </div>
    </section>
  );
}
