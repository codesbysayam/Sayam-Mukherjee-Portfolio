import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu, GitBranch, Users, ExternalLink, Eye, CloudRain, Binary, CheckCircle2, Brain, Shield, Sparkles, GraduationCap,
  FolderGit2, ArrowUpRight, BookOpen
} from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { ContourBackground } from "../motion/ContourBackground";
import { StackingCards } from "../motion/StackingCards";
import { PinnedHeadingSection } from "../motion/PinnedHeadingSection";
import { requestScrollTriggerRefresh } from "../../motion/gsapRegistry";
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
    subtitle: "Doppler nowcasting, SACHET/NDMA, NAQI, INCOIS & Ask MAUSAM",
    category: "Weather & Geospatial Systems",
    status: "Live · SIH 2026 (mausam_sih-26)",
    purpose:
      "Consolidates Doppler radar nowcasting, SACHET/NDMA civic alerts, CPCB/NAQI air quality, INCOIS coastal/marine state, and agrometeorological metrics with Ask MAUSAM into one responsive TypeScript platform.",
    nodes: [
      { name: "Multi-Agency Telemetry", description: "Doppler nowcasting, NAQI, SACHET/NDMA, INCOIS feeds", type: "input" },
      { name: "Python & TS Normalizers", description: "Standardizes units across atmospheric & marine metrics", type: "process" },
      { name: "Ask MAUSAM Query Engine", description: "Translates raw telemetry into actionable guidance", type: "process" },
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
      "Active canonical repo is codesbysayam/mausam_sih-26 alongside baseline snapshot mausam_sample",
      "Unified domestic weather, air-quality, coastal & soil views without silos",
      "Verified polyglot TypeScript, Python, JavaScript, CSS, C & PLpgSQL stack"
    ],
    repoUrl: "https://github.com/codesbysayam/mausam_sih-26",
    liveUrl: "https://mausamgovt.vercel.app",
    stats: [
      { label: "Canonical Repo", value: "codesbysayam/mausam_sih-26" },
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

  useEffect(() => {
    requestScrollTriggerRefresh(110);
  }, [activeBlueprint]);

  const flagshipLayerIds: BlueprintId[] = [
    "operon",
    "mausam",
    "sightforge",
    "memory-in-motion",
    "axiom",
  ];

  const handleInspectFromStack = (id: BlueprintId) => {
    setActiveBlueprint(id);
    const el = document.getElementById("ecosystem-blueprints");
    if (el) {
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-12">
      {/* 1. HEADER */}
      <header
        id="ecosystem-hero"
        className="relative py-4 sm:py-6 border-b border-[var(--border)] space-y-5"
      >
        <ContourBackground density="subtle" />

        <div className="relative z-10 space-y-5">
          <SectionHeading
            level="h1"
            immediate
            index="04"
            eyebrow="System Architecture · Process & Blueprints"
            title="Engineering Ecosystem"
            italicHighlight="& system blueprints."
            description="Software works best as an interconnected system of state machines, telemetry pipelines, mathematical invariants, and explicit human oversight."
            withDivider={false}
          />

          <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text)]">8 Verified Architectures</span>
            <span aria-hidden="true">·</span>
            <span>End-to-End Delivery Lifecycle</span>
            <span aria-hidden="true">·</span>
            <span className="text-[var(--accent)] font-semibold">SIH 2026 Collaboration Case Study</span>
          </div>
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

      {/* 3B. STACKING ARCHITECTURE LAYERS (GSAP STICKY DECK) */}
      <section id="ecosystem-stack" className="space-y-6">
        <EditorialReveal className="space-y-2">
          <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
            Phase 02B · Architectural Progression
          </span>
          <h2 className="text-2xl font-bold font-display text-[var(--text)]">
            Flagship System Stack
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans">
            Scroll through the five primary system architectures from autonomous human-gated execution to mechanistic interpretability.
          </p>
        </EditorialReveal>

        <StackingCards
          items={flagshipLayerIds.map((id) => {
            const bp = BLUEPRINTS[id];
            return {
              id: bp.id,
              render: (_isReduced, idx) => (
                <article className="rounded-[12px] border border-[var(--border-strong)] bg-[var(--surface-2)] p-5 sm:p-7 space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[var(--border)]">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className="text-[var(--accent)] font-bold">
                          LAYER 0{idx + 1}
                        </span>
                        <span aria-hidden="true" className="text-[var(--text-faint)]">·</span>
                        <span className="text-[var(--text-muted)] uppercase tracking-wider">
                          {bp.category}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-display text-[var(--text)]">
                        {bp.title}
                      </h3>
                      <p className="text-xs font-mono text-[var(--text-muted)]">
                        {bp.subtitle}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleInspectFromStack(bp.id)}
                      className={`btn !min-h-[38px] !py-1.5 !px-3.5 !text-xs font-mono shrink-0 ${
                        activeBlueprint === bp.id ? "btn-primary" : "btn-secondary"
                      }`}
                    >
                      <span>{activeBlueprint === bp.id ? "Active in Explorer" : "Load Blueprint"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                    {bp.purpose}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-mono">
                    {bp.stats.map((st) => (
                      <div
                        key={st.label}
                        className="px-3 py-2 rounded-[6px] bg-[var(--surface)] border border-[var(--border)]"
                      >
                        <span className="text-[10px] text-[var(--text-muted)] uppercase block">
                          {st.label}
                        </span>
                        <span className="font-semibold text-[var(--text)]">{st.value}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ),
            };
          })}
        />
      </section>

      {/* 4. RELATIONAL INTERCONNECT MATRIX */}
      <PinnedHeadingSection
        id="ecosystem-matrix"
        heading={
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider block">
              Phase 03 · Interdisciplinary Coupling
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)] leading-tight">
              Relational{" "}
              <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                Interconnect Matrix
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md font-sans leading-relaxed">
              How distinct engineering layers coordinate across my software systems — linking computer vision, algorithmic invariants, HITL gates, and resilient telemetry caches.
            </p>
          </div>
        }
      >
        <StaggerGroup className="grid grid-cols-1 gap-4">
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
      </PinnedHeadingSection>

      {/* 5. TEAM ENGINEERING & COLLABORATION — MAUSAM (SIH 2026) */}
      <section id="ecosystem-sih" className="space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--accent)] uppercase tracking-wider">
              Team Engineering &amp; Collaboration
            </span>
            <span aria-hidden="true">·</span>
            <span className="uppercase tracking-wider">
              Smart India Hackathon 2026 — MAUSAM
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            TEAM ENGINEERING &amp; COLLABORATION
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl font-sans leading-relaxed">
            Smart India Hackathon 2026 — MAUSAM · Team Algnite. Consolidated atmospheric, coastal, air-quality, and hazard advisories under rapid multi-contributor sprint constraints.
          </p>
        </div>

        <div className="card p-5 sm:p-8 space-y-8">
          {/* 5.1 Project Context */}
          <div className="space-y-4 pb-6 border-b border-[var(--border)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]">
                  <Users className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-[var(--text)]">
                    01 · Project Context &amp; Domain Scope
                  </h3>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Team Algnite · Frontend &amp; Systems Integration
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-[var(--accent)] font-semibold">
                5.47 MB Polyglot Repository · Live on Vercel
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm font-sans text-[var(--text-secondary)] leading-relaxed">
              <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-1.5">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text)]">
                  Problem &amp; Fragmentation
                </div>
                <p className="text-xs leading-relaxed">
                  Critical weather warnings, CPCB NAQI air quality, INCOIS marine conditions, and NDMA SACHET alerts live across disconnected agency portals, adding friction during severe weather events.
                </p>
              </div>
              <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-1.5">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text)]">
                  Target Communities
                </div>
                <p className="text-xs leading-relaxed">
                  Designed for agriculturalists tracking soil moisture &amp; UV, coastal fishing communities needing sea-state advisories, and urban residents checking hyper-local air quality and rain radar.
                </p>
              </div>
              <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-1.5">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text)]">
                  Sprint Constraints
                </div>
                <p className="text-xs leading-relaxed">
                  Polyglot TypeScript, Python, PLpgSQL, and C data utilities developed across multiple parallel contributors while keeping <span className="font-mono text-[var(--text)]">mausamgovt.vercel.app</span> continuously deployable.
                </p>
              </div>
            </div>
          </div>

          {/* 5.2 Collaboration Timeline */}
          <div className="space-y-4 pb-6 border-b border-[var(--border)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold font-display text-[var(--text)]">
                02 · Collaboration &amp; Delivery Timeline
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                5 Coordinated Engineering Stages
              </span>
            </div>

            <ol className="collaboration-timeline" aria-label="MAUSAM Team Algnite collaboration timeline">
              <li className="collaboration-step">
                <span className="collaboration-step__index">01</span>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text)]">
                    Contract &amp; Schema Definition
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                    Typed TypeScript meteorological interfaces separated Python data utilities from React UI views cleanly.
                  </p>
                </div>
              </li>
              <li className="collaboration-step">
                <span className="collaboration-step__index">02</span>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text)]">
                    Parallel Domain Modules
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                    Built independent views for Doppler nowcasting, NAQI metrics, INCOIS marine conditions, and agrometeorology.
                  </p>
                </div>
              </li>
              <li className="collaboration-step">
                <span className="collaboration-step__index">03</span>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text)]">
                    Hazard &amp; Ask MAUSAM Layer
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                    Integrated SACHET alert thresholds alongside plain-language advisory synthesis via Ask MAUSAM.
                  </p>
                </div>
              </li>
              <li className="collaboration-step">
                <span className="collaboration-step__index">04</span>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text)]">
                    Audit &amp; PR #1 Merge
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                    Consolidated reconstruction via <span className="font-mono text-[var(--accent)]">audit/mausam-full-site-reconstruction</span> (PR #1).
                  </p>
                </div>
              </li>
              <li className="collaboration-step">
                <span className="collaboration-step__index">05</span>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text)]">
                    Production Edge Build
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                    Strict TypeScript build validation and live deployment at <span className="font-mono text-[var(--text)]">mausamgovt.vercel.app</span>.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* 5.3 Engineering Workstreams */}
          <div className="space-y-4 pb-6 border-b border-[var(--border)]">
            <h3 className="text-base font-bold font-display text-[var(--text)]">
              03 · Team Algnite Engineering Workstreams
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between space-y-2.5">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-bold">
                    Workstream 01 · Schema Contracts
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                    Shared TypeScript payload definitions decoupled Python environmental normalization scripts from client UI components, allowing parallel interface assembly.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
                  TypeScript + PLpgSQL Models
                </span>
              </div>

              <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between space-y-2.5">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-bold">
                    Workstream 02 · Branch &amp; PR Audit
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                    Tracked work across <span className="font-mono text-[var(--text)]">mausam_sample</span> (initial sprint) into the canonical <span className="font-mono text-[var(--text)]">mausam_sih-26</span> repo with full-site reconstruction reviewed on branch <span className="font-mono text-[var(--accent)]">audit/mausam-full-site-reconstruction</span> (PR #1).
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
                  codesbysayam/mausam_sih-26 · PR #1
                </span>
              </div>

              <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between space-y-2.5">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-bold">
                    Workstream 03 · Edge Delivery
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                    Automated Vercel preview and production builds verified static type soundness and responsive rendering before merging updates to <span className="font-mono text-[var(--text)]">main</span>.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
                  Vercel Edge · mausamgovt.vercel.app
                </span>
              </div>
            </div>
          </div>

          {/* 5.4 Real MAUSAM System Architecture Diagram */}
          <div className="space-y-4 pb-6 border-b border-[var(--border)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold font-display text-[var(--text)]">
                04 · MAUSAM System Architecture Diagram
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                Multi-Source Telemetry Pipeline
              </span>
            </div>

            <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] overflow-x-auto">
              <svg
                role="img"
                aria-label="MAUSAM system architecture diagram showing external weather agency feeds flowing through Python and TypeScript ingestion normalizers, hazard evaluators and Ask MAUSAM, client telemetry cache, and the geospatial dashboard UI."
                viewBox="0 0 960 220"
                className="w-full min-w-[640px] h-auto"
              >
                <defs>
                  <marker
                    id="mausam-arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M 0 1 L 7 4 L 0 7 z" fill="var(--accent)" />
                  </marker>
                </defs>

                {/* Connectors */}
                <line x1="185" y1="110" x2="225" y2="110" stroke="var(--accent)" strokeWidth="1.75" markerEnd="url(#mausam-arrow)" />
                <line x1="395" y1="110" x2="435" y2="110" stroke="var(--accent)" strokeWidth="1.75" markerEnd="url(#mausam-arrow)" />
                <line x1="605" y1="110" x2="645" y2="110" stroke="var(--accent)" strokeWidth="1.75" markerEnd="url(#mausam-arrow)" />
                <line x1="775" y1="110" x2="815" y2="110" stroke="var(--accent)" strokeWidth="1.75" markerEnd="url(#mausam-arrow)" />

                {/* Node 1: External Agency Feeds */}
                <rect x="10" y="34" width="175" height="152" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth="1.25" />
                <text x="24" y="58" fill="var(--accent)" fontSize="10" fontWeight="700" fontFamily="monospace">01 · AGENCY FEEDS</text>
                <text x="24" y="84" fill="var(--text)" fontSize="11.5" fontWeight="700" fontFamily="sans-serif">External Telemetry</text>
                <text x="24" y="108" fill="var(--text-secondary)" fontSize="10.5" fontFamily="monospace">• IMD Doppler Radar</text>
                <text x="24" y="128" fill="var(--text-secondary)" fontSize="10.5" fontFamily="monospace">• CPCB NAQI Index</text>
                <text x="24" y="148" fill="var(--text-secondary)" fontSize="10.5" fontFamily="monospace">• INCOIS Sea State</text>
                <text x="24" y="168" fill="var(--text-secondary)" fontSize="10.5" fontFamily="monospace">• NDMA SACHET Alerts</text>

                {/* Node 2: Ingestion Normalizers */}
                <rect x="225" y="44" width="170" height="132" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth="1.25" />
                <text x="239" y="68" fill="var(--accent)" fontSize="10" fontWeight="700" fontFamily="monospace">02 · NORMALIZATION</text>
                <text x="239" y="92" fill="var(--text)" fontSize="11.5" fontWeight="700" fontFamily="sans-serif">Polyglot Parsers</text>
                <text x="239" y="116" fill="var(--text-secondary)" fontSize="10.5" fontFamily="sans-serif">Python &amp; TypeScript</text>
                <text x="239" y="134" fill="var(--text-secondary)" fontSize="10.5" fontFamily="sans-serif">ingestion adapters</text>
                <text x="239" y="156" fill="var(--text-muted)" fontSize="10" fontFamily="monospace">Typed JSON + PLpgSQL</text>

                {/* Node 3: Hazard Evaluators & Ask MAUSAM */}
                <rect x="435" y="44" width="170" height="132" rx="8" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="1.5" />
                <text x="449" y="68" fill="var(--accent)" fontSize="10" fontWeight="700" fontFamily="monospace">03 · SYNTHESIS</text>
                <text x="449" y="92" fill="var(--text)" fontSize="11.5" fontWeight="700" fontFamily="sans-serif">Hazard &amp; Ask MAUSAM</text>
                <text x="449" y="116" fill="var(--text-secondary)" fontSize="10.5" fontFamily="sans-serif">Threshold rules for UV,</text>
                <text x="449" y="134" fill="var(--text-secondary)" fontSize="10.5" fontFamily="sans-serif">AQI, soil &amp; storm surges</text>
                <text x="449" y="156" fill="var(--text-muted)" fontSize="10" fontFamily="monospace">Advisory Query Layer</text>

                {/* Node 4: Telemetry Cache */}
                <rect x="645" y="54" width="130" height="112" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth="1.25" />
                <text x="659" y="78" fill="var(--accent)" fontSize="10" fontWeight="700" fontFamily="monospace">04 · CACHE</text>
                <text x="659" y="102" fill="var(--text)" fontSize="11.5" fontWeight="700" fontFamily="sans-serif">Client State</text>
                <text x="659" y="124" fill="var(--text-secondary)" fontSize="10.5" fontFamily="sans-serif">Offline-resilient</text>
                <text x="659" y="142" fill="var(--text-secondary)" fontSize="10.5" fontFamily="sans-serif">region state cache</text>

                {/* Node 5: Geospatial Dashboard UI */}
                <rect x="815" y="44" width="135" height="132" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth="1.25" />
                <text x="829" y="68" fill="var(--accent)" fontSize="10" fontWeight="700" fontFamily="monospace">05 · CLIENT UI</text>
                <text x="829" y="92" fill="var(--text)" fontSize="11.5" fontWeight="700" fontFamily="sans-serif">Dashboard</text>
                <text x="829" y="116" fill="var(--text-secondary)" fontSize="10.5" fontFamily="sans-serif">React + Tailwind</text>
                <text x="829" y="134" fill="var(--text-secondary)" fontSize="10.5" fontFamily="sans-serif">Nowcast &amp; Alerts</text>
                <text x="829" y="156" fill="var(--text-muted)" fontSize="10" fontFamily="monospace">Vercel Edge UI</text>
              </svg>
            </div>
          </div>

          {/* 5.5 Verified Project Evidence */}
          <div className="space-y-3">
            <h3 className="text-base font-bold font-display text-[var(--text)]">
              05 · Verified Project Evidence
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/codesbysayam/mausam_sih-26"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary !text-xs font-mono"
              >
                <FolderGit2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Canonical Repo: mausam_sih-26</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <a
                href="https://github.com/codesbysayam/mausam_sample"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary !text-xs font-mono"
              >
                <FolderGit2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Earlier Sprint: mausam_sample</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <a
                href="https://mausamgovt.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary !text-xs font-mono"
              >
                <span>Live Deployment: mausamgovt.vercel.app</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("portfolio-navigate-route", {
                      detail: {
                        tab: "journal",
                        path: "/journal/why-i-wanted-mausam-to-feel-useful",
                      },
                    })
                  );
                }}
                className="btn btn-secondary !text-xs font-mono cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Read Engineering Journal Note</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EcosystemPage;
