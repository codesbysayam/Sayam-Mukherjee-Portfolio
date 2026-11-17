import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu, GitBranch, Users, ExternalLink, Eye, CloudRain, Binary, CheckCircle2, Brain, Shield, Sparkles, GraduationCap
} from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";

type BlueprintId =
  | "operon"
  | "mausam"
  | "sightforge"
  | "memory-in-motion"
  | "axiom"
  | "inkloom"
  | "campus-connect"
  | "sayam-solves";

interface SystemBlueprint {
  id: BlueprintId;
  title: string;
  subtitle: string;
  category: string;
  status: string;
  purpose: string;
  nodes: {
    name: string;
    description: string;
    type: "input" | "process" | "decision" | "storage" | "output";
  }[];
  connections: string[];
  invariants: string[];
  repoUrl: string;
  liveUrl?: string;
  stats: { label: string; value: string }[];
}

const BLUEPRINTS: Record<BlueprintId, SystemBlueprint> = {
  operon: {
    id: "operon",
    title: "OPERON Multi-Agent Governance Engine",
    subtitle: "Autonomous operations across Support, Finance, HR & Ops with HITL gates",
    category: "Autonomous Systems & AI",
    status: "Live · Deploy or Die",
    purpose:
      "Coordinates specialized role-scoped agents across Support, Finance, HR, and Operations workflows while guaranteeing that irreversible mutations halt at explicit Human-in-the-Loop (HITL) approval checkpoints.",
    nodes: [
      { name: "Operational Trigger", description: "Support, Finance, HR, or Ops workflow event", type: "input" },
      { name: "Agent Task Router", description: "Evaluates intent and dispatches role-scoped workers", type: "process" },
      { name: "Specialized Agents", description: "Isolated Support, Finance, HR, and Ops agents", type: "process" },
      { name: "HITL Approval Checkpoint", description: "Explicit human sign-off before execution", type: "decision" },
      { name: "State Machine Ledger", description: "Auditable PROPOSED -> AWAITING_HUMAN -> APPROVED trace", type: "storage" },
      { name: "Action Dispatch", description: "Committed external state transition", type: "output" }
    ],
    connections: [
      "Inbound Event -> Router decomposes operational request by department scope",
      "Router -> Dispatches isolated Support, Finance, HR, or Ops workers",
      "Workers -> Propose structured payloads and enter AWAITING_HUMAN checkpoint",
      "Operator Sign-Off -> Authorizes or halts proposed side effects cleanly",
      "Approval -> Commits transition to State Machine Ledger & executes"
    ],
    invariants: [
      "Separated agent intent generation from external mutation execution",
      "Human authorization required before irreversible operational changes",
      "Role-scoped agent contexts verified across codesbysayam/Operon (main)"
    ],
    repoUrl: "https://github.com/codesbysayam/Operon",
    liveUrl: "https://operonpro.vercel.app",
    stats: [
      { label: "Architecture", value: "Multi-Agent HITL" },
      { label: "Codebase", value: "TypeScript (936.6 KB)" },
      { label: "Event", value: "Deploy or Die · NEXUS" }
    ]
  },
  mausam: {
    id: "mausam",
    title: "MAUSAM Meteorological Intelligence Platform",
    subtitle: "Doppler nowcasting, SACHET/NDMA, NAQI, INCOIS & Ask MAUSAM AI",
    category: "Weather & Geospatial Systems",
    status: "Live · SIH 2026 (mausam_sample)",
    purpose:
      "Consolidates Doppler radar nowcasting, SACHET/NDMA civic alerts, CPCB/NAQI air quality, INCOIS coastal/marine state, and agrometeorological metrics with Ask MAUSAM AI into one responsive TypeScript platform.",
    nodes: [
      { name: "Multi-Agency Telemetry", description: "Doppler nowcasting, NAQI, SACHET/NDMA, INCOIS feeds", type: "input" },
      { name: "Python & TS Normalizers", description: "Standardizes units across atmospheric & marine metrics", type: "process" },
      { name: "Ask MAUSAM AI Engine", description: "Translates raw telemetry into actionable guidance", type: "process" },
      { name: "Hazard Threshold Evaluator", description: "Computes localized air, UV, soil & coastal alerts", type: "decision" },
      { name: "Client State Cache", description: "Fast meteorological slice recall", type: "storage" },
      { name: "Geospatial Weather UI", description: "Responsive dashboard served on mausamgovt.vercel.app", type: "output" }
    ],
    connections: [
      "Agency Feeds -> Harmonized into unified atmospheric, NAQI & marine schemas",
      "Python Utilities -> Pre-process environmental & spatial climate vectors",
      "Threshold Evaluator -> Surfaces SACHET/NDMA and coastal hazard advisories",
      "Ask MAUSAM -> Converts live conditions into plain-language summaries",
      "UI Layer -> Renders responsive multi-domain climate cards cleanly"
    ],
    invariants: [
      "Canonical source repo is codesbysayam/mausam_sample (mausam_demo is an empty template)",
      "Unified domestic weather, air-quality, coastal & soil views without silos",
      "Verified polyglot build led by 5.14 MB TypeScript & 118.6 KB Python"
    ],
    repoUrl: "https://github.com/codesbysayam/mausam_sample",
    liveUrl: "https://mausamgovt.vercel.app",
    stats: [
      { label: "Canonical Repo", value: "codesbysayam/mausam_sample" },
      { label: "Coverage", value: "Doppler / NAQI / INCOIS" },
      { label: "Event", value: "SIH 2026 · Team ALGNITE" }
    ]
  },
  sightforge: {
    id: "sightforge",
    title: "SightForge Edge Computer Vision Pipeline",
    subtitle: "Dual-service Next.js 15 / React 19 + FastAPI YOLOv8 & ByteTrack platform",
    category: "Computer Vision & Edge AI",
    status: "Open Source · Dual-Service (Local/Self-Hosted)",
    purpose:
      "Pairs a 16:9 HTML5 Canvas client in Next.js 15 / React 19 with a FastAPI YOLOv8 backend performing COCO Class ID 0 person detection, 17-keypoint pose estimation, NMS (IoU 0.45), ByteTrack tracking, and PostgreSQL telemetry persistence.",
    nodes: [
      { name: "Video / Camera Stream", description: "Local video or edge stream frames ingested by FastAPI", type: "input" },
      { name: "YOLOv8 Person + Pose", description: "COCO Class ID 0 detector + 17 COCO body keypoints", type: "process" },
      { name: "NMS & ByteTrack Tracker", description: "IoU 0.45 filtering & persistent multi-frame track IDs", type: "process" },
      { name: "Atomic CVFrame Contract", description: "Replaces full frame state cleanly without stale box lag", type: "decision" },
      { name: "PostgreSQL Telemetry", description: "Structured persistence for tracked detections & events", type: "storage" },
      { name: "16:9 HTML5 Canvas UI", description: "Next.js 15 / React 19 synchronized overlay renderer", type: "output" }
    ],
    connections: [
      "Frame Stream -> FastAPI decodes frame and runs YOLOv8 person & pose models",
      "Detection Head -> Filters COCO Class ID 0 with Non-Max Suppression (IoU 0.45)",
      "ByteTrack -> Associates 17-keypoint detections into persistent track IDs",
      "PostgreSQL -> Persists session analytics and detection telemetry",
      "Next.js Canvas -> Atomically swaps CVFrame state on a 16:9 HTML5 Canvas"
    ],
    invariants: [
      "Atomic CVFrame state swap prevents partial bounding-box ghosting",
      "Strict COCO Class ID 0 filtering & IoU 0.45 NMS before tracking",
      "Local/self-hosted dual-service repository without a public cloud live URL"
    ],
    repoUrl: "https://github.com/codesbysayam/SightForge",
    stats: [
      { label: "Frontend", value: "Next.js 15 / React 19" },
      { label: "CV Backend", value: "FastAPI / YOLOv8 / ByteTrack" },
      { label: "Hosting", value: "Local / Self-Hosted Repo" }
    ]
  },
  "memory-in-motion": {
    id: "memory-in-motion",
    title: "Memory in Motion Mechanistic Interpretability Lab",
    subtitle: "Interactive O(1) recurrent state, Hebbian fast weights & BDH lab",
    category: "Mechanistic Interpretability & AI Research",
    status: "Live · IIT KGP DataForge 2026",
    purpose:
      "Interactive browser lab engineered with Team ALGNITE for DataForge 2026 (IIT Kharagpur, 'Explain the Frontier'), contrasting O(1) fixed-size recurrent state, Hebbian fast weights, and Dragon Hatchling (BDH) dynamics against O(T) KV caches.",
    nodes: [
      { name: "Parameter Controls", description: "Sequence length, fast-weight decay & capacity sliders", type: "input" },
      { name: "Trace State Engine", description: "Evaluates O(1) recurrent vs O(T) KV-cache growth", type: "process" },
      { name: "Hebbian / BDH Simulator", description: "Models associative memory updates & collisions", type: "process" },
      { name: "KaTeX Math Renderer", description: "Live mathematical formulations synced to state", type: "decision" },
      { name: "Deterministic Trace Store", description: "Reproducible zero-GPU browser trace states", type: "storage" },
      { name: "D3.js / SVG Visual Canvas", description: "Interactive plots served at memoryinmotion.vercel.app", type: "output" }
    ],
    connections: [
      "User Parameters -> Recompute recurrent vs attention memory footprint",
      "Hebbian Simulator -> Updates fast-weight state matrices step-by-step",
      "KaTeX Synchronizer -> Aligns matrix equations with live UI state",
      "D3.js / SVG -> Plots smooth O(1) vs O(T) scaling curves",
      "Exploratory Narrative -> Guides evaluation through DataForge 2026 chapters"
    ],
    invariants: [
      "100% browser-reproducible deterministic simulations with KaTeX derivations",
      "Direct visual contrast between O(1) recurrent memory and O(T) KV caches",
      "Verified under codesbysayam/Memory-in-Motion (1 star, Team ALGNITE)"
    ],
    repoUrl: "https://github.com/codesbysayam/Memory-in-Motion",
    liveUrl: "https://memoryinmotion.vercel.app",
    stats: [
      { label: "Visual Stack", value: "React / D3.js / KaTeX" },
      { label: "Codebase", value: "TypeScript (1.71 MB) + Python" },
      { label: "Event", value: "DataForge 2026 · IIT KGP" }
    ]
  },
  axiom: {
    id: "axiom",
    title: "AXIOM Autonomous Operations Control Plane",
    subtitle: "Policy rules, approval gates, sandboxes, failure recovery & audit chains",
    category: "Autonomous Control Planes & Governance",
    status: "Live · WCC Launchpad 30 (36h)",
    purpose:
      "Built in 36 hours for WCC Launchpad 30 with Team ALGNITE, AXIOM governs automated operations through deterministic policy evaluation, dry-run sandboxes, human quorum gates, structured failure recovery, and tamper-evident audit chains.",
    nodes: [
      { name: "Operational Action Intent", description: "Queued automated mutation awaiting pre-flight check", type: "input" },
      { name: "Deterministic Policy Engine", description: "Evaluates static allow, deny & escalate rules", type: "process" },
      { name: "Dry-Run Simulation Sandbox", description: "Previews state diffs and blast radius safely", type: "process" },
      { name: "Approval & Recovery Gate", description: "Operator sign-off & structured fallback transitions", type: "decision" },
      { name: "Tamper-Evident Audit Chain", description: "Hash-linked sequential execution history", type: "storage" },
      { name: "Control Plane Console", description: "Live dashboard hosted at axiomwcc.vercel.app", type: "output" }
    ],
    connections: [
      "Intent Queue -> Policy Engine evaluates pre-flight compliance boundaries",
      "Simulation Sandbox -> Computes safe dry-run diffs before side effects",
      "Escalation Gate -> Halts high-impact mutations until human operator approval",
      "Failure Recovery -> Transitions degraded actions safely without partial corruption",
      "Audit Chain -> Appends verifiable hash-linked proof entries"
    ],
    invariants: [
      "Pre-flight deterministic policy boundaries precede all execution pathways",
      "Hash-linked audit records expose unauthorized log mutation",
      "Delivered in 36h at WCC Launchpad 30 by Team ALGNITE"
    ],
    repoUrl: "https://github.com/codesbysayam/AXIOM",
    liveUrl: "https://axiomwcc.vercel.app",
    stats: [
      { label: "Sprint", value: "36h · WCC Launchpad 30" },
      { label: "Codebase", value: "TypeScript (793.5 KB)" },
      { label: "Core", value: "Policy / Sandbox / Audit" }
    ]
  },
  inkloom: {
    id: "inkloom",
    title: "INKLOOM Constructed Identity & Logo Workspace",
    subtitle: "Public fork (master branch) · Early access at inkloom.art",
    category: "Generative Design Systems (Fork)",
    status: "Early Access · Fork (default: master)",
    purpose:
      "Explores multi-stage constructed logo design workflows—extracting brand constraints, separating typographic and geometric symbol construction, and applying composition lockup/clear-space rules. Specialized logo generation models remain under active construction.",
    nodes: [
      { name: "Brand Constraint Brief", description: "Industry tone, name & layout parameters", type: "input" },
      { name: "Typographic & Symbol Stages", description: "Decoupled font pairing & vector mark rules", type: "process" },
      { name: "Composition & Lockup Engine", description: "Enforces clear-space ratios & geometric lockups", type: "process" },
      { name: "Model Pipeline Boundary", description: "Specialized logo models under active R&D", type: "decision" },
      { name: "PLpgSQL + Docker Workspace", description: "PostgreSQL schema & containerized runtime", type: "storage" },
      { name: "Early Access Interface", description: "Web showcase hosted at inkloom.art", type: "output" }
    ],
    connections: [
      "Brand Brief -> Parsed into explicit typographic and geometric constraints",
      "Composition Engine -> Aligns symbol mark and wordmark spacing rules",
      "Container Runtime -> Docker + PLpgSQL environment coordinates workspace state",
      "Early Access Web -> Surfaces platform preview on inkloom.art"
    ],
    invariants: [
      "Disclosed public fork (isFork: true) using default branch 'master'",
      "Specialized AI logo generation models remain under active construction",
      "TypeScript, CSS, PLpgSQL & Docker workspace transparency"
    ],
    repoUrl: "https://github.com/codesbysayam/inkloom",
    liveUrl: "https://inkloom.art",
    stats: [
      { label: "Repo Status", value: "Public Fork (master)" },
      { label: "Stack", value: "TS / PLpgSQL / Docker" },
      { label: "Model State", value: "Under Construction" }
    ]
  },
  "campus-connect": {
    id: "campus-connect",
    title: "CampusConnect Event & Organizer Platform",
    subtitle: "Next.js + TypeScript + Vitest campus discovery & seeded in-memory store",
    category: "Full-Stack Web Applications",
    status: "Live Demo · Seeded In-Memory Store",
    purpose:
      "Unifies student campus event discovery, filtering, and seat registration with a dedicated organizer dashboard in Next.js and TypeScript—backed by Vitest automated checks and README-disclosed seeded in-memory storage (resets on restart).",
    nodes: [
      { name: "Student / Organizer Actions", description: "Event browse, RSVP, create & edit requests", type: "input" },
      { name: "Next.js App Handlers", description: "Typed route handlers & form validation", type: "process" },
      { name: "Seat Capacity Manager", description: "Prevents over-booking and duplicate RSVPs", type: "decision" },
      { name: "Seeded In-Memory Store", description: "Fast demo dataset (resets on process restart)", type: "storage" },
      { name: "Vitest Verification Suite", description: "Automated tests for registration & CRUD states", type: "process" },
      { name: "Live Vercel Demo", description: "Published at campusconnect1273.vercel.app/", type: "output" }
    ],
    connections: [
      "Student Discovery -> Filters live campus events by category and availability",
      "Organizer Console -> Creates and updates event schedules & seat limits",
      "Seat Manager -> Validates remaining capacity against seeded store",
      "Vitest Suite -> Verifies deterministic state transitions on changes"
    ],
    invariants: [
      "Seeded in-memory storage resets on server restart (per README disclosure)",
      "Core registration and organizer paths covered by Vitest",
      "Repository verified under codesbysayam/CAMPUSCONNECT_1273 (main)"
    ],
    repoUrl: "https://github.com/codesbysayam/CAMPUSCONNECT_1273",
    liveUrl: "https://campusconnect1273.vercel.app/",
    stats: [
      { label: "Framework", value: "Next.js / TypeScript" },
      { label: "Testing", value: "Vitest Suite" },
      { label: "Persistence", value: "Seeded In-Memory Store" }
    ]
  },
  "sayam-solves": {
    id: "sayam-solves",
    title: "SayamSolves C++ DSA & LeetHub V2 Archive",
    subtitle: "3 tracked C++ repo solutions (LC 0005, 0033, 0115) & 4 LC baseline",
    category: "Competitive Programming & DSA",
    status: "Active · 3 Repo Files / 4 LC Solved",
    purpose:
      "Synchronizes accepted LeetCode C++ solutions directly via LeetHub V2. Verified stats.json records 3 committed solution directories—0005 Longest Palindromic Substring, 0033 Search in Rotated Sorted Array, and 0115 Distinct Subsequences—complemented by a 4-problem LeetCode profile baseline.",
    nodes: [
      { name: "LeetCode Submission", description: "Accepted C++ solution synced via LeetHub V2", type: "input" },
      { name: "Invariant & Complexity Spec", description: "Time & space bounds verified per problem constraint", type: "process" },
      { name: "Zero-Padded Repo Folders", description: "0005, 0033, and 0115 structured on main", type: "storage" },
      { name: "stats.json Telemetry Ledger", description: "Tracks exact committed repo count (3 files)", type: "decision" },
      { name: "Verifiable Public Archive", description: "Hosted at codesbysayam/sayam-solves (1 star)", type: "output" }
    ],
    connections: [
      "LeetCode Judge -> Accepts C++ implementation (LC 0005, 0033, 0115)",
      "LeetHub V2 -> Commits solution + README into lowercase sayam-solves repo",
      "stats.json -> Audits exact count of 3 committed solution folders",
      "Profile Sync -> Cross-referenced honestly with 4-problem LeetCode baseline"
    ],
    invariants: [
      "Exact lowercase slug codesbysayam/sayam-solves (1 star, main branch)",
      "Transparent stats.json reporting: 3 committed repo files & 4 LC solved",
      "Optimal O(n^2)/O(1) expansion, O(log n) pivot search, and O(|s|*|t|) DP"
    ],
    repoUrl: "https://github.com/codesbysayam/sayam-solves",
    stats: [
      { label: "Language", value: "Modern C++ (2,037 B)" },
      { label: "Repo Files", value: "3 Synced (0005, 0033, 0115)" },
      { label: "LeetCode Baseline", value: "4 Problems Solved" }
    ]
  }
};

export function EcosystemPage() {
  const [activeBlueprint, setActiveBlueprint] = useState<BlueprintId>("operon");
  const reduced = usePrefersReducedMotion();
  const blueprint = BLUEPRINTS[activeBlueprint];

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-12">
      {/* 1. HEADER */}
      <header id="ecosystem-hero" className="space-y-4 pt-2 pb-6 border-b border-[var(--border)]">
        <SectionHeader
          level="h1"
          eyebrow="04 · System Architecture"
          badge="Process & Blueprints"
          title={
            <>
              Engineering Ecosystem{" "}
              <span className="font-serif-editorial italic font-normal text-[var(--text-secondary)]">
                &amp; system blueprints.
              </span>
            </>
          }
          description="Software works best as an interconnected system of state machines, telemetry pipelines, mathematical invariants, and explicit human oversight."
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text)]">8 Verified Architectures</span>
          <span aria-hidden="true">·</span>
          <span>End-to-End Delivery Lifecycle</span>
          <span aria-hidden="true">·</span>
          <span className="text-[var(--accent)] font-semibold">SIH 2026 Collaboration Case Study</span>
        </div>
      </header>

      {/* 2. DELIVERY LIFECYCLE */}
      <section id="ecosystem-pipeline" className="space-y-6">
        <EditorialReveal className="space-y-2">
          <span className="text-xs font-mono font-semibold text-[var(--accent)] tracking-wider uppercase">
            Phase 01 · Delivery Lifecycle
          </span>
          <h2 className="text-2xl font-bold font-display text-[var(--text)]">
            The Engineering Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans">
            How abstract requirements progress into verified, resilient production software.
          </p>
        </EditorialReveal>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            {
              step: "01",
              name: "Constraint Modeling",
              focus: "Scope & Invariants",
              desc: "Deconstruct core requirements into boundary conditions, rate limits, and failure modes before writing code."
            },
            {
              step: "02",
              name: "Schema & Architecture",
              focus: "Type Contracts & DAGs",
              desc: "Define strict TypeScript interfaces, REST contracts, state machine transitions, and data models."
            },
            {
              step: "03",
              name: "Edge Prototyping",
              focus: "Micro-benchmarks",
              desc: "Validate algorithmic bottlenecks, API latencies, and critical execution paths in isolated harnesses."
            },
            {
              step: "04",
              name: "Production Hardening",
              focus: "Resilience & Zero CLS",
              desc: "Wrap network calls with exponential backoffs, enforce sub-100ms cached views, and guarantee stable responsive UI."
            },
            {
              step: "05",
              name: "Telemetry & Audit",
              focus: "Observability",
              desc: "Expose health checkpoints, commit logs, and auditable execution ledgers."
            }
          ].map((phase, idx) => (
            <StaggerItem key={phase.step} className="card p-4 flex flex-col justify-between space-y-3 transition-colors hover:border-[var(--border-strong)]">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                  <span className="font-bold text-[var(--accent)]">STEP {phase.step}</span>
                  <span className="text-[var(--text-muted)]">{idx < 4 ? "→" : "✔"}</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--text)] font-display">{phase.name}</h3>
                <span className="text-xs font-mono text-[var(--text-muted)] block">{phase.focus}</span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans pt-1">
                  {phase.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* 3. INTERACTIVE SYSTEM BLUEPRINTS */}
      <section id="ecosystem-blueprints" className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
            Phase 02 · Architectural Blueprints
          </span>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="text-2xl font-bold font-display text-[var(--text)]">
              Core System Blueprints
            </h2>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Interactive architecture explorer
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans">
            Inspect the processing stages, data handshakes, and formal invariants across all eight verified architectures.
          </p>
        </div>

        {/* Selector Tabs */}
        <div className="flex flex-wrap gap-2 pt-1" role="tablist" aria-label="System blueprints">
          {[
            { id: "operon", label: "OPERON · Multi-Agent HITL", icon: Cpu },
            { id: "mausam", label: "MAUSAM · Weather Intelligence", icon: CloudRain },
            { id: "sightforge", label: "SightForge · YOLOv8 & ByteTrack", icon: Eye },
            { id: "memory-in-motion", label: "Memory in Motion · AI Lab", icon: Brain },
            { id: "axiom", label: "AXIOM · Control Plane", icon: Shield },
            { id: "inkloom", label: "Inkloom · Logo Systems (Fork)", icon: Sparkles },
            { id: "campus-connect", label: "CampusConnect · Events", icon: GraduationCap },
            { id: "sayam-solves", label: "SayamSolves · C++ DSA", icon: Binary }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeBlueprint === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveBlueprint(tab.id as BlueprintId)}
                className={`btn !min-h-[40px] !py-2 !px-3.5 !text-xs font-mono active:scale-[0.97] ${
                  isSelected ? "btn-primary" : "btn-secondary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Blueprint Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBlueprint}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: MOTION_DURATION.normal, ease: MOTION_EASE.out }}
            className="card p-4 sm:p-8 space-y-6 sm:space-y-8"
          >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[var(--border)]">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5 flex-wrap text-xs font-mono">
                <span className="text-[var(--accent)] font-semibold uppercase tracking-wider">
                  {blueprint.category}
                </span>
                <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>
                <span className="text-[var(--text-muted)]">{blueprint.status}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)]">
                {blueprint.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
                {blueprint.purpose}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <a
                href={blueprint.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary !py-2 !px-3.5 !text-xs font-mono"
              >
                <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Source Code</span>
                <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
              </a>
              {blueprint.liveUrl && (
                <a
                  href={blueprint.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary !py-2 !px-3.5 !text-xs font-mono"
                >
                  <span>Live App</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {blueprint.stats.map((st) => (
              <div key={st.label} className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-0.5">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase tracking-wider">
                  {st.label}
                </span>
                <span className="text-sm font-semibold text-[var(--text)] font-sans">
                  {st.value}
                </span>
              </div>
            ))}
          </div>

          {/* Architectural Nodes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <h4 className="uppercase tracking-wider font-semibold">
                System Topology &amp; Processing Stages
              </h4>
              <span>Left-to-Right Pipeline</span>
            </div>

            <StaggerGroup immediate stagger={0.035} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {blueprint.nodes.map((node, i) => (
                <StaggerItem
                  key={node.name}
                  className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between space-y-2 transition-colors hover:border-[var(--border-strong)]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                      <span className="text-[var(--text-muted)] font-bold">STAGE 0{i + 1}</span>
                      <span className="text-[var(--accent)] uppercase font-semibold">{node.type}</span>
                    </div>
                    <h5 className="text-sm font-bold text-[var(--text)] font-sans">{node.name}</h5>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                    {node.description}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          {/* Data Flow Chains */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Data Flow Transitions &amp; State Handshakes
            </h4>
            <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-2 text-xs font-mono text-[var(--text-secondary)]">
              {blueprint.connections.map((conn, idx) => (
                <div key={idx} className="flex items-start gap-2.5 min-w-0">
                  <span className="text-[var(--accent)] font-bold mt-0.5 shrink-0">↳</span>
                  <span className="leading-relaxed break-words min-w-0">{conn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Invariants */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Architectural Invariants &amp; Safety Guarantees
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {blueprint.invariants.map((inv, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text)] flex items-start gap-2.5 text-xs font-sans leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[var(--accent)] mt-0.5" aria-hidden="true" />
                  <span>{inv}</span>
                </div>
              ))}
            </div>
          </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 4. RELATIONAL INTERCONNECT MATRIX */}
      <section id="ecosystem-matrix" className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
            Phase 03 · Interdisciplinary Coupling
          </span>
          <h2 className="text-2xl font-bold font-display text-[var(--text)]">
            Relational Interconnect Matrix
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans">
            How distinct engineering layers coordinate across my software systems.
          </p>
        </div>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              domainA: "AI & Computer Vision",
              domainB: "Full-Stack Web Platforms",
              relation: "Edge Vector Streaming",
              details: "OpenCV and YOLO bounding boxes in Python are normalized to compact coordinate payloads and rendered smoothly in React."
            },
            {
              domainA: "Algorithmic Foundations (C++)",
              domainB: "State Machine Ledgers",
              relation: "Asymptotic Complexity Bounds",
              details: "Optimal space-time recurrence relations and graph traversals proven in algorithmic practice inform state transition routines."
            },
            {
              domainA: "Multi-Agent Systems",
              domainB: "Human-in-the-Loop Safeguards",
              relation: "Approval Decision Gates",
              details: "Autonomous LLM workers plan and draft actions, while critical mutations pause until authenticated human operators sign off."
            },
            {
              domainA: "Geospatial Telemetry",
              domainB: "Resilient Offline Caching",
              relation: "Sub-100ms Hydration",
              details: "Multi-provider weather APIs are normalized via worker layers and cached locally for reliable low-bandwidth responsiveness."
            }
          ].map((item, idx) => (
            <StaggerItem key={idx} className="card p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[var(--accent)] font-semibold">{item.domainA}</span>
                <span className="text-[var(--text-muted)]">↔</span>
                <span className="text-[var(--text)] font-semibold">{item.domainB}</span>
              </div>
              <h4 className="text-base font-bold font-display text-[var(--text)]">{item.relation}</h4>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                {item.details}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* 5. SIH 2026 CASE STUDY */}
      <section id="ecosystem-sih" className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
            Phase 04 · Team Collaboration Case Study
          </span>
          <h2 className="text-2xl font-bold font-display text-[var(--text)]">
            Smart India Hackathon (SIH 2026) Architecture
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans">
            How Team Algnite coordinated rapid full-stack delivery under competition constraints.
          </p>
        </div>

        <div className="card p-4 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]">
                <Users className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-[var(--text)]">
                  Team Algnite Collaboration Mechanics
                </h3>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  SIH 2026 National Hackathon Qualification
                </span>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-[4px] bg-[#C7E34A] text-[#20231D] font-bold self-start sm:self-auto">
              Verified Submission
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text)] font-bold">
                01. Contract-First API Mocking
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                Defined strict TypeScript interfaces for meteorological payloads in hour one, letting UI development proceed in parallel with data ingestion.
              </p>
            </div>

            <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text)] font-bold">
                02. Feature Isolation &amp; Git Hygiene
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                Used scoped branch naming (<span className="font-mono text-[var(--accent)]">feat/aqi-thresholds</span>, <span className="font-mono text-[var(--accent)]">feat/tide-chart</span>) and pull request reviews for conflict-free shipping.
              </p>
            </div>

            <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text)] font-bold">
                03. Automated Edge CI/CD
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                Continuous preview deployments on Vercel with strict TypeScript checking ensured judges always accessed a working live build.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EcosystemPage;
