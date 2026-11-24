import { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EXTENDED_DATA } from "../data/extendedData";
import { LINKS } from "../config/links";
import { youtubeChannels } from "../data/channels";
import { YouTubeChannelCard } from "./YouTubeChannelCard";
import { YouTubeChannelAnalyticsSection } from "./YouTubeAnalyticsCard";
import { getCreatorSummary } from "../utils/contentCreatorStats";
import { StaggerGroup, StaggerItem } from "../motion/Reveal";
import { ContourBackground } from "./motion/ContourBackground";
import { MotionSlider } from "./motion/MotionSlider";
import { SectionHeading } from "./ui/SectionHeading";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../motion/tokens";
import {
  Youtube,
  Eye,
  Play,
  Compass,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface ContentCreatorSectionProps {
  onBack?: () => void;
}

function ContentCreatorSection({ onBack }: ContentCreatorSectionProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [decipherNotice, setDecipherNotice] = useState<string | null>(null);
  const channels = youtubeChannels;
  const creatorSummary = getCreatorSummary(channels);

  const documentedCategories = [
    "Technology & Tutorials",
    "Computer Science",
    "Visual Media & Optics",
    "Algorithmic Explanations",
  ];

  return (
    <div className="space-y-12 font-sans py-2" id="creator-showcase">
      <span id="video-showcase" className="block -mt-12 pt-12" aria-hidden="true" />

      {onBack && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary min-h-[44px] px-3.5 py-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Experience</span>
          </button>
        </div>
      )}

      {/* Header */}
      <header className="relative py-4 sm:py-6 border-b border-[var(--border)]">
        <ContourBackground density="subtle" />
        <div className="relative z-10">
          <SectionHeading
            level="h1"
            immediate
            index="07"
            eyebrow="Media Platform & Video Showcase"
            title="YouTube Video"
            italicHighlight="Showcase."
            description="Sharing knowledge beyond code. Creating high-signal visual guides surrounding software architecture, algorithm breakdowns, and creative media formats across dedicated YouTube channels."
            withDivider={false}
          />
        </div>
      </header>

      {/* Brand Card & Daily Decipher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div
          className="lg:col-span-8 card p-6 md:p-8 flex flex-col justify-between space-y-6"
          style={{
            backgroundColor: "var(--surface-2)",
            borderColor: "var(--border)",
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-[10px] border flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <Youtube className="w-6 h-6 text-[#DC2626]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text)] font-display tracking-tight leading-none">
                  CodesBySayam Media
                </h3>
                <span className="text-[11px] text-[var(--text-muted)] font-mono tracking-wider mt-1 block">
                  TECHNICAL EDUCATION &amp; CREATIVE MEDIA PRODUCTION
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              I operate and maintain channels as educational and creative hubs to explain software concepts, document algorithms, and build visual narrative content for diverse audiences. Historical channel audiences are catalogued transparently without misleading combined aggregate figures.
            </p>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-2 text-[11px] font-mono text-[var(--text-secondary)]">
              {documentedCategories.map((cat, idx) => (
                <span key={idx} className="inline-flex items-center gap-2.5">
                  {idx > 0 && <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>}
                  <span>{cat}</span>
                </span>
              ))}
            </div>
          </div>

          <StaggerGroup
            stagger={0.04}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6"
            style={{ borderColor: "var(--border)" }}
          >
            {creatorSummary.map((metric) => (
              <StaggerItem key={metric.label} className="h-full">
                <article
                  className="min-w-0 h-full rounded-[8px] border p-4 transition-colors hover:border-[var(--border-strong)]"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    {metric.label}
                  </p>
                  <p className="mt-2 break-words text-2xl font-extrabold text-[var(--text)] font-display tabular-nums">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)] font-mono">
                    {metric.detail}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        {/* Daily Decipher Archive Card (Ink surface) */}
        <div
          className="lg:col-span-4 rounded-[10px] border p-6 flex flex-col justify-between"
          style={{
            backgroundColor: "#20231D",
            borderColor: "#41443A",
            color: "#F4F4ED",
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#C7E34A]">
              <Compass className="w-4 h-4" />
              <span>DAILY DECIPHER PROMPT</span>
            </div>

            <h3 className="text-lg font-bold text-[#F4F4ED] font-display tracking-tight">
              Exploring Travel &amp; Culture
            </h3>
            <p className="text-xs text-[#D4D6CA] leading-relaxed">
              An educational channel focused on travel metrics, geographical culture, knowledge extraction, and dynamic landscape explorations. Scaled organically to an archive of 10,000+ subscribers (2023–2026).
            </p>

            <AnimatePresence>
              {decipherNotice && (
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.fast, ease: MOTION_EASE.out }}
                  className="rounded-[6px] border p-2.5 text-xs font-mono"
                  style={{
                    backgroundColor: "#151713",
                    borderColor: "#41443A",
                    color: "#C7E34A",
                  }}
                >
                  {decipherNotice}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() =>
              setDecipherNotice(
                "Localized geopolitical explorer notes are currently archived. Visit @dailydecipher on YouTube for video releases."
              )
            }
            className="btn btn-primary w-full mt-6 text-xs font-mono"
          >
            <span>Decipher Database</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Channels Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
              OFFICIAL CREATOR CHANNELS
            </span>
            <h3 className="font-display text-lg font-bold tracking-tight text-[var(--text)]">
              Channel Directory &amp; Platforms
            </h3>
          </div>
          <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
            {channels.length} Channels Listed
          </span>
        </div>

        <StaggerGroup stagger={0.05} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <StaggerItem key={channel.id} className="h-full">
              <YouTubeChannelCard
                channel={channel}
                featured={channel.id === "obsidianoptics"}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>

      {/* Verified YouTube Studio Analytics Snapshot */}
      <YouTubeChannelAnalyticsSection />

      {/* Featured Video Library Slider */}
      <MotionSlider
        label="Featured Video Library"
        columnsClassName="auto-cols-[84%] sm:auto-cols-[48%] lg:auto-cols-[34%]"
      >
        {EXTENDED_DATA.youtubeVideos.map((video) => (
          <div
            key={video.id}
            className="card overflow-hidden flex flex-col justify-between group h-full"
            style={{
              backgroundColor: "var(--surface-2)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="relative aspect-video w-full overflow-hidden"
              style={{ backgroundColor: "#151713" }}
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151713]/85 via-transparent to-transparent" />

              <span
                className="absolute bottom-2.5 right-2.5 border text-[11px] font-mono px-1.5 py-0.5 rounded-[4px]"
                style={{
                  backgroundColor: "#151713",
                  borderColor: "#41443A",
                  color: "#F4F4ED",
                }}
              >
                {video.duration}
              </span>

              <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 bg-[#151713]/45 md:bg-[#151713]/60 transition-opacity">
                <a
                  href={video.watchUrl || LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch ${video.title} on YouTube`}
                  className="w-12 h-12 rounded-full bg-[#C7E34A] text-[#20231D] flex items-center justify-center hover:scale-105 active:scale-95 active:bg-[#A9C52F] transition-transform cursor-pointer shadow-lg"
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </a>
              </div>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <h4 className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 font-display">
                {video.title}
              </h4>

              <div
                className="flex items-center justify-between pt-2 border-t text-[11px] font-mono text-[var(--text-muted)]"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {video.views} views
                </span>

                <a
                  href={video.watchUrl || LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline active:opacity-75 font-bold cursor-pointer inline-flex items-center min-h-[36px] [@media(pointer:coarse)]:min-h-[44px] px-1"
                >
                  Watch Now ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </MotionSlider>

      {/* Verified Studio Audit Snapshot (21 October 2026) */}
      <div
        className="card p-6 md:p-8 space-y-4"
        style={{
          backgroundColor: "var(--surface-2)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <span className="text-[11px] text-[var(--text-muted)] font-mono tracking-widest uppercase">
                HISTORICAL STUDIO AUDIT
              </span>
            </div>
            <h3 className="text-lg font-bold text-[var(--text)] font-display tracking-tight">
              Obsidian Optics · Recorded Milestone Telemetry
            </h3>
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Snapshot Date: 21 October 2026
          </span>
        </div>

        <StaggerGroup stagger={0.035} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <StaggerItem>
            <div
              className="p-3.5 rounded-[8px] border h-full"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                Lifetime Views
              </span>
              <span className="text-base sm:text-lg font-bold text-[var(--text)] font-display tabular-nums block mt-1">
                153,049
              </span>
              <span className="text-[11px] font-mono text-[var(--text-faint)] mt-0.5 block">
                Overview Header
              </span>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div
              className="p-3.5 rounded-[8px] border h-full"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                Subscribers
              </span>
              <span className="text-base sm:text-lg font-bold text-[var(--text)] font-display tabular-nums block mt-1">
                1,305
              </span>
              <span className="text-[11px] font-mono text-[var(--text-faint)] mt-0.5 block">
                Realtime Panel
              </span>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div
              className="p-3.5 rounded-[8px] border h-full"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                Watch Time
              </span>
              <span className="text-base sm:text-lg font-bold text-[var(--text)] font-display tabular-nums block mt-1">
                3.5K hrs
              </span>
              <span className="text-[11px] font-mono text-[var(--text-faint)] mt-0.5 block">
                13 Jan – 21 Oct
              </span>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div
              className="p-3.5 rounded-[8px] border h-full"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                Subs Gained
              </span>
              <span className="text-base sm:text-lg font-bold text-[var(--accent)] font-display tabular-nums block mt-1">
                +1.1K
              </span>
              <span className="text-[11px] font-mono text-[var(--text-faint)] mt-0.5 block">
                Selected Period
              </span>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div
              className="p-3.5 rounded-[8px] border h-full"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                Views (48h)
              </span>
              <span className="text-base sm:text-lg font-bold text-[var(--text)] font-display tabular-nums block mt-1">
                1,967
              </span>
              <span className="text-[11px] font-mono text-[var(--text-faint)] mt-0.5 block">
                Realtime Metric
              </span>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div
              className="p-3.5 rounded-[8px] border h-full"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                Engaged Views
              </span>
              <span className="text-base sm:text-lg font-bold text-[var(--accent)] font-display tabular-nums block mt-1">
                1,200
              </span>
              <span className="text-[11px] font-mono text-[var(--text-faint)] mt-0.5 block">
                Realtime Panel
              </span>
            </div>
          </StaggerItem>
        </StaggerGroup>

        <p className="text-xs leading-relaxed text-[var(--text-faint)] font-mono pt-2">
          Note: These figures reflect a recorded YouTube Studio snapshot from 21 October 2026 and may not represent current channel analytics. Historical channel figures are preserved separately.
        </p>
      </div>
    </div>
  );
}

export default memo(ContentCreatorSection);
