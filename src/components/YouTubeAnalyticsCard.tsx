import React from "react";
import {
  Youtube,
  ExternalLink,
  Calendar,
  Clock,
  Eye,
  Users,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
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
  if (!metric) return { text: "Not available", isAvailable: false };

  const display =
    metric.displayValue ??
    (metric.value === null
      ? null
      : new Intl.NumberFormat("en-IN").format(metric.value));

  if (display === null) return { text: "Not available", isAvailable: false };

  return {
    text: suffix ? `${display} ${suffix}` : display,
    isAvailable: true,
  };
}

function periodLabel(metric: YouTubeMetricSnapshot | null): string {
  if (!metric) return "No verified snapshot";
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
    <div
      className="flex flex-col min-w-0 p-3 rounded-[8px] border"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px] font-mono mb-1 truncate">
        {Icon && <Icon className="w-3 h-3 text-[var(--text-faint)] shrink-0" />}
        <span className="truncate">{label}</span>
      </div>
      <span
        className={`font-display tabular-nums truncate ${
          isAvailable
            ? "text-sm sm:text-base font-bold text-[var(--text)]"
            : "text-[var(--text-faint)] font-mono text-xs italic font-normal"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function YouTubeAnalyticsCard({
  channel,
  className = "",
}: YouTubeAnalyticsCardProps) {
  const isObsidian =
    channel.channelId === "obsidianoptics" ||
    channel.channelId === "obsidian-optics";
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
      className={`card p-5 sm:p-6 flex flex-col justify-between space-y-6 ${className}`}
      style={{
        backgroundColor: "var(--surface-2)",
        borderColor: "var(--border)",
      }}
      aria-labelledby={`analytics-${channel.channelId}-title`}
    >
      <header
        className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-[8px] border flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <Youtube className="w-5 h-5 text-[#DC2626]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                id={`analytics-${channel.channelId}-title`}
                className="text-base sm:text-lg font-bold font-display text-[var(--text)] truncate"
              >
                {channel.name}
              </h3>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] border font-semibold"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border-strong)",
                  color: "var(--accent)",
                }}
              >
                Verified Studio Snapshot
              </span>
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5 truncate">
              {channel.handle}
            </p>
          </div>
        </div>

        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${channel.name} on YouTube`}
          className="btn btn-secondary min-h-[34px] px-3 py-1.5 text-xs font-mono shrink-0"
        >
          <span>Visit Channel</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </header>

      {/* Lifetime Analytics */}
      <section className="space-y-2.5" aria-label="Lifetime analytics">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Lifetime Telemetry</span>
          </h4>
          <span className="text-[10px] font-mono text-[var(--text-faint)]">
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
          <div
            className="p-3 rounded-[8px] border text-[11px] font-mono text-[var(--text-muted)] flex items-center"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            {isObsidian ? (
              <span>Verified lifetime milestone from Studio Overview header.</span>
            ) : (
              <span>Lifetime view tile omitted in 2026 selected period view.</span>
            )}
          </div>
        </div>
      </section>

      {/* Selected Period Analytics */}
      <section
        className="space-y-2.5 pt-3 border-t"
        style={{ borderColor: "var(--border)" }}
        aria-label="Selected-period analytics"
      >
        <div className="flex items-center justify-between flex-wrap gap-1">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text)] font-bold flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-[var(--accent)]" />
            <span>Selected Period Performance</span>
          </h4>
          <span
            className="text-[10px] font-mono text-[var(--text-secondary)] border px-2 py-0.5 rounded-[4px]"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
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

      {/* Realtime Snapshot Panel */}
      <section
        className="space-y-2.5 pt-3 border-t"
        style={{ borderColor: "var(--border)" }}
        aria-label="Realtime snapshot"
      >
        <div className="flex items-center justify-between flex-wrap gap-1">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-bold flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span>Realtime Snapshot (Studio Panel)</span>
          </h4>
          <span className="text-[10px] font-mono text-[var(--text-faint)]">
            Captured 21 Oct 2026 &bull; Static snapshot
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

      <footer
        className="pt-3 border-t flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] flex-wrap gap-2"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[var(--text-faint)]" />
          <span>Source: Official YouTube Studio Analytics screenshot (21 Oct 2026)</span>
        </span>
        <span className="text-[var(--text-faint)]">
          Static verified snapshot
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
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[var(--accent)]">
            CONTENT CREATION AUDIT
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <span className="text-[10px] font-mono text-[var(--text-faint)]">
            Verified Studio Records
          </span>
        </div>
        <h3
          id="youtube-analytics-heading"
          className="text-xl sm:text-2xl font-bold font-display text-[var(--text)] tracking-tight"
        >
          YouTube Studio Analytics Snapshots
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-3xl leading-relaxed">
          Ground-truth metrics from YouTube Studio dashboard for{" "}
          <strong className="text-[var(--text)]">Obsidian Optics</strong>.
          Distinguishing lifetime reach, selected-period watch time, and 48-hour
          realtime velocity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {youtubeChannelAnalytics.map((channel) => (
          <YouTubeAnalyticsCard key={channel.channelId} channel={channel} />
        ))}
      </div>
    </section>
  );
}
