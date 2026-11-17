export const VALID_PROJECT_IDS = [
  "operon",
  "mausam",
  "sightforge",
  "memory-in-motion",
  "axiom",
  "inkloom",
  "campus-connect",
  "sayam-solves",
] as const;

export type ValidProjectId = typeof VALID_PROJECT_IDS[number];

export interface ProjectMetrics {
  developmentTime?: string;
  codeComplexityScore?: string;
  linesOfCode?: string;
}

export interface ProjectItem {
  id: string;
  name?: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  problem: string;
  solution: string;
  whyItExists: string;
  whatIBuilt: string;
  implementation: string;
  engineeringDecisions: string[];
  resultsAndStatus: string;
  verifiedFacts: string[];
  category: string;
  categoryLabel: string;
  categoryFilter: "AI / ML" | "FULL-STACK" | "SYSTEMS" | "DSA";
  secondaryCategories?: Array<"AI / ML" | "FULL-STACK" | "SYSTEMS" | "DSA">;
  status: string;
  statusType: "live" | "active" | "hackathon" | "opensource";
  technologies?: string[];
  techStack: string[];
  tech?: string[];
  tags: string[];
  repository?: string;
  githubRepoName?: string;
  githubUrl: string;
  defaultBranch?: string;
  isFork?: boolean;
  verificationNote?: string;
  team?: string;
  event?: string;
  liveUrl?: string;
  demoUrl?: string;
  featured: boolean;
  highlights: string[];
  features?: string[];
  role?: string;
  architecture?: string[];
  metrics?: ProjectMetrics;
  evolutionStage: {
    phase: string;
    step: string;
    period: string;
    focus: string;
  };
}

export type RealProject = ProjectItem;
export type VerifiedProject = ProjectItem;

/**
 * Authoritative project registry for Sayam Mukherjee's engineering portfolio.
 * Strictly synchronized to the 8 verified product/algorithm repositories on https://github.com/codesbysayam.
 * Supporting meta/template repositories (codesbysayam, Sayam-Mukherjee-Portfolio, mausam_demo) are intentionally excluded from this showcase grid.
 */
export const PROJECTS: ProjectItem[] = [
  {
    id: "operon",
    name: "OPERON",
    title: "OPERON",
    subtitle: "Multi-Agent Operations Platform & Approval State Machine",
    shortDescription:
      "Multi-agent operations engine across Support, Finance, HR, and Ops that automates task routing while enforcing explicit human-in-the-loop approval gates.",
    longDescription:
      "OPERON is an autonomous operations platform engineered to coordinate role-scoped software agents across Support, Finance, HR, and Operations workflows. Rather than permitting unchecked autonomous mutations, every high-impact step transitions through a deterministic approval state machine where human operators inspect proposed payloads, authorize execution, or halt actions with complete audit logging.",
    problem:
      "Cross-departmental operational tasks frequently stall across disconnected SaaS queues, yet giving unconstrained autonomy to LLM-driven agents creates severe financial, access-control, and compliance risks.",
    solution:
      "Introduced a multi-agent task dispatcher paired with an explicit Human-in-the-Loop (HITL) approval checkpoint layer, isolating intent generation from external side-effect execution.",
    whyItExists:
      "Cross-team workflows break across siloed tools, while unchecked agent scripts cannot be trusted with irreversible mutations. OPERON enforces clear operator sign-off boundaries.",
    whatIBuilt:
      "Designed and implemented the TypeScript/React client workspace, Node.js/Express backend API, role-specific agent router (Support, Finance, HR, Ops), and auditable state transition checkpoints.",
    implementation:
      "Built the decoupled TypeScript frontend (936.6 KB TypeScript across the codebase) connected to modular Express routes that persist workflow state transitions, payload inspection views, and approval/rejection traces.",
    architecture: [
      "Role-scoped Multi-Agent Dispatcher routing Support, Finance, HR, and Ops requests",
      "Deterministic Human-in-the-Loop (HITL) approval state machine blocking unverified mutations",
      "Decoupled React/TypeScript UI communicating with a modular Node.js & Express API",
      "Immutable action log capturing agent proposals, operator signatures, and rollback states",
    ],
    engineeringDecisions: [
      "Separated agent planning from tool execution via explicit PROPOSED -> AWAITING_HUMAN -> APPROVED/HALTED states instead of single-shot function calling.",
      "Standardized shared TypeScript contracts between client dashboards and Express dispatch handlers to eliminate payload drift during rapid hackathon iteration.",
    ],
    resultsAndStatus:
      "Shipped and deployed live at operonpro.vercel.app for Deploy or Die (HowToAlgo x GDG on Campus KIIT) with Team NEXUS. Source code public on github.com/codesbysayam/Operon.",
    verifiedFacts: [
      "Repository: codesbysayam/Operon (branch: main, 1 star)",
      "Deployment: https://operonpro.vercel.app",
      "Dominant Stack: TypeScript (936,622 B), CSS (8,841 B), HTML (1,230 B)",
      "Event & Team: Deploy or Die | HowToAlgo x GDG on Campus KIIT · Team NEXUS",
    ],
    category: "Autonomous Systems & AI",
    categoryLabel: "Multi-Agent Systems",
    categoryFilter: "AI / ML",
    secondaryCategories: ["FULL-STACK", "SYSTEMS"],
    status: "Live · Deploy or Die",
    statusType: "live",
    technologies: ["TypeScript", "React", "Node.js", "Express", "Multi-Agent AI", "Gemini API", "Tailwind CSS", "Vite", "Vercel"],
    techStack: ["TypeScript", "React", "Node.js", "Express", "Multi-Agent AI", "Tailwind CSS"],
    tech: ["TypeScript", "React", "Node.js", "Express", "Multi-Agent AI"],
    tags: ["Multi-Agent Systems", "Human-in-the-Loop", "Workflow Automation", "Team NEXUS"],
    repository: "Operon",
    githubRepoName: "Operon",
    githubUrl: "https://github.com/codesbysayam/Operon",
    defaultBranch: "main",
    isFork: false,
    team: "Team NEXUS",
    event: "Deploy or Die | HowToAlgo x GDG on Campus KIIT",
    verificationNote:
      "Public repository codesbysayam/Operon verified on main branch with live Vercel production deployment.",
    liveUrl: "https://operonpro.vercel.app",
    demoUrl: "https://operonpro.vercel.app",
    featured: true,
    metrics: {
      developmentTime: "Hackathon MVP -> Production",
      codeComplexityScore: "Multi-Agent State Machine",
      linesOfCode: "946 KB Repo Source",
    },
    highlights: [
      "Role-specific agent routing across Support, Finance, HR, and Operations queues",
      "Explicit human-in-the-loop approval gate before committing high-risk operations",
      "Modular Express backend synced with responsive TypeScript/React operator console",
      "Live interactive prototype hosted on Vercel for Deploy or Die showcase",
    ],
    features: [
      "Role-specific agent routing across Support, Finance, HR, and Operations queues",
      "Explicit human-in-the-loop approval gate before committing high-risk operations",
      "Modular Express backend synced with responsive TypeScript/React operator console",
    ],
    role: "Lead Architect & Full-Stack Developer (Team NEXUS)",
    evolutionStage: {
      phase: "MULTI-AGENT AI",
      step: "01",
      period: "Current",
      focus: "Human-governed multi-agent workflows across Support, Finance, HR & Ops",
    },
  },
  {
    id: "mausam",
    name: "MAUSAM",
    title: "MAUSAM",
    subtitle: "Weather Intelligence, Doppler Nowcasting & Civic Hazard Platform",
    shortDescription:
      "SIH 2026 atmospheric intelligence platform unifying Doppler radar nowcasting, SACHET/NDMA alerts, NAQI air quality, INCOIS marine state, and Ask MAUSAM AI.",
    longDescription:
      "Built for Smart India Hackathon (SIH 2026) with Team ALGNITE, MAUSAM consolidates hyper-local weather telemetry, Doppler radar nowcasting, SACHET/NDMA civic alerts, CPCB/NAQI air quality indices, INCOIS marine & coastal advisories, and agrometeorological soil/crop metrics into a single responsive interface supplemented by Ask MAUSAM AI.",
    problem:
      "Critical meteorological, air-quality, coastal tide, and disaster warnings are fragmented across disconnected portals (IMD, CPCB, INCOIS, SACHET), creating friction for farmers, fishermen, and citizens during severe weather.",
    solution:
      "Unified multi-source meteorological aggregation, polyglot data ingestion scripts, hazard threshold alerting, and natural-language Ask MAUSAM query guidance in one accessible TypeScript web system.",
    whyItExists:
      "Citizens, agriculturists, and coastal communities need cohesive weather, NAQI, UV, soil, and ocean safety advisories in one place rather than hunting across separate agency portals.",
    whatIBuilt:
      "Built the React/TypeScript frontend architecture, telemetry visualization views (Doppler nowcasting, NAQI, INCOIS sea conditions, agro indices), Python ingestion utilities, and Ask MAUSAM conversational weather assistant.",
    implementation:
      "Implemented across TypeScript (5.13 MB including spatial/domain datasets), Python (118.6 KB) environmental data utilities, JavaScript/CSS/HTML, C (31.1 KB), Jupyter notebooks, and PLpgSQL schemas in repository codesbysayam/mausam_sample.",
    architecture: [
      "Multi-domain weather dashboard covering atmospheric forecasts, Doppler nowcasting & UV",
      "Civic hazard & environmental layer aggregating SACHET/NDMA alerts & CPCB NAQI metrics",
      "Maritime & agricultural modules surfacing INCOIS coastal states & soil moisture advisories",
      "Ask MAUSAM AI query interface translating raw meteorological telemetry into plain advisories",
    ],
    engineeringDecisions: [
      "Consolidated national agency domain indicators (NDMA SACHET, CPCB NAQI, INCOIS) into modular view layers so agricultural, marine, and urban residents inspect tailored alerts cleanly.",
      "Separated Python data processing utilities from client UI state to keep heavy multi-metric rendering responsive.",
    ],
    resultsAndStatus:
      "Live SIH 2026 Team ALGNITE deployment at mausamgovt.vercel.app. Source verified under codesbysayam/mausam_sample (note: codesbysayam/mausam_demo is an empty AI Studio template placeholder, not a second project).",
    verifiedFacts: [
      "Canonical Repository: codesbysayam/mausam_sample (branch: main)",
      "Placeholder Disclosure: codesbysayam/mausam_demo is an unbuilt AI Studio template placeholder",
      "Deployment: https://mausamgovt.vercel.app",
      "Dominant Stack: TypeScript (5.14 MB), Python (118.6 KB), JS (65.9 KB), CSS (50.0 KB), C (31.1 KB)",
      "Event & Team: Smart India Hackathon (SIH 2026) · Team ALGNITE",
    ],
    category: "Weather & Geospatial Systems",
    categoryLabel: "Civic & Climate Tech",
    categoryFilter: "FULL-STACK",
    secondaryCategories: ["AI / ML", "SYSTEMS"],
    status: "Live · SIH 2026",
    statusType: "hackathon",
    technologies: ["TypeScript", "React", "Python", "Tailwind CSS", "Weather APIs", "C", "PLpgSQL", "Vercel"],
    techStack: ["TypeScript", "React", "Python", "Tailwind CSS", "Weather APIs", "Ask MAUSAM AI"],
    tech: ["TypeScript", "React", "Python", "Tailwind CSS"],
    tags: ["SIH 2026", "Team ALGNITE", "Doppler Nowcasting", "NAQI / INCOIS", "SACHET / NDMA"],
    repository: "mausam_sample",
    githubRepoName: "mausam_sample",
    githubUrl: "https://github.com/codesbysayam/mausam_sample",
    defaultBranch: "main",
    isFork: false,
    team: "Team ALGNITE",
    event: "Smart India Hackathon (SIH 2026)",
    verificationNote:
      "Canonical source repo is codesbysayam/mausam_sample (mausam_demo is an empty template repo).",
    liveUrl: "https://mausamgovt.vercel.app",
    demoUrl: "https://mausamgovt.vercel.app",
    featured: true,
    metrics: {
      developmentTime: "SIH 2026 Sprint",
      codeComplexityScore: "Multi-Source Geospatial UI",
      linesOfCode: "5.47 MB Polyglot Repo",
    },
    highlights: [
      "Doppler radar nowcasting, SACHET/NDMA alerts, and CPCB NAQI air quality integration",
      "INCOIS marine/coastal sea-state monitoring and agrometeorological soil advisories",
      "Ask MAUSAM AI assistant translating complex atmospheric telemetry for end users",
      "Deployed publicly at mausamgovt.vercel.app by Team ALGNITE for SIH 2026",
    ],
    features: [
      "Doppler radar nowcasting, SACHET/NDMA alerts, and CPCB NAQI air quality integration",
      "INCOIS marine/coastal sea-state monitoring and agrometeorological soil advisories",
      "Ask MAUSAM AI assistant translating complex atmospheric telemetry for end users",
    ],
    role: "Frontend & Systems Integration Developer (Team ALGNITE)",
    evolutionStage: {
      phase: "CLIMATE INTELLIGENCE",
      step: "02",
      period: "SIH 2026",
      focus: "Doppler nowcasting, NAQI, SACHET hazards & INCOIS coastal telemetry",
    },
  },
  {
    id: "sightforge",
    name: "SIGHTFORGE",
    title: "SIGHTFORGE",
    subtitle: "Dual-Service YOLOv8 Person, Pose & ByteTrack Edge CV Platform",
    shortDescription:
      "Real-time computer vision platform pairing a Next.js 15 / React 19 16:9 Canvas client with FastAPI YOLOv8 person detection, 17-keypoint pose, and ByteTrack.",
    longDescription:
      "SightForge is a dual-service real-time computer vision workbench combining a Next.js 15, React 19, and TypeScript frontend with a FastAPI / Python inference backend. It executes YOLOv8 Person Detection (COCO Class ID 0), YOLOv8 Pose estimation (17 COCO body keypoints), Non-Max Suppression (IoU 0.45), and ByteTrack persistent ID association while persisting telemetry to PostgreSQL.",
    problem:
      "Browser-rendered computer vision dashboards often suffer from stale bounding-box ghosting during frame drops and lose track identity continuity across brief occlusions.",
    solution:
      "Engineered an atomic CVFrame state replacement contract in a 16:9 HTML5 Canvas renderer backed by FastAPI + YOLOv8 + ByteTrack multi-frame identity tracking and PostgreSQL event storage.",
    whyItExists:
      "Real-time surveillance and spatial analytics need deterministic frame-to-overlay synchronization alongside persistent pose and identity tracking—all runnable cleanly without third-party cloud lock-in.",
    whatIBuilt:
      "Implemented the dual-service architecture uniting the Next.js 15 / React 19 / TypeScript HTML5 Canvas overlay viewer with the FastAPI YOLOv8 detection/pose + ByteTrack backend, Makefile workflows, and PostgreSQL persistence.",
    implementation:
      "Organized into a typed frontend (TypeScript 252.1 KB) rendering synchronized 16:9 Canvas overlays from atomic CVFrame payloads and a Python backend (149.6 KB) orchestrating YOLOv8 COCO-0 inference, IoU 0.45 NMS, 17-keypoint pose skeletons, and ByteTrack IDs.",
    architecture: [
      "Dual-service runtime: Next.js 15 / React 19 frontend paired with FastAPI Python inference service",
      "YOLOv8 Person Detector (COCO Class ID 0) + Non-Max Suppression (IoU 0.45 threshold)",
      "YOLOv8 Pose pipeline extracting 17 COCO anatomical keypoints per tracked subject",
      "ByteTrack multi-object tracker maintaining persistent IDs with PostgreSQL telemetry persistence",
      "Atomic CVFrame state swap on a 16:9 HTML5 Canvas eliminating asynchronous box lag",
    ],
    engineeringDecisions: [
      "Used atomic CVFrame object replacement rather than partial box mutation so Canvas overlays and video frames remain strictly synchronized.",
      "Filtered detection head to COCO Class ID 0 with IoU 0.45 NMS before pose estimation to keep per-frame inference predictable on local hardware.",
    ],
    resultsAndStatus:
      "Full-stack dual-service implementation verified in public repository codesbysayam/SightForge. Designed for local/self-hosted execution via Makefile (no public cloud host URL).",
    verifiedFacts: [
      "Repository: codesbysayam/SightForge (branch: main)",
      "Pipeline Spec: YOLOv8 Person (COCO Class ID 0), YOLOv8 Pose (17 COCO keypoints), NMS IoU 0.45, ByteTrack",
      "Stack: TypeScript / Next.js 15 / React 19 (252.1 KB) + Python / FastAPI (149.6 KB) + PostgreSQL",
      "Hosting Disclosure: Local/self-hosted dual-service repo without a public live URL",
    ],
    category: "Edge Computer Vision & Tracking",
    categoryLabel: "Computer Vision & AI",
    categoryFilter: "AI / ML",
    secondaryCategories: ["SYSTEMS", "FULL-STACK"],
    status: "Open Source · Dual-Service",
    statusType: "opensource",
    technologies: ["Next.js 15", "React 19", "TypeScript", "FastAPI", "Python", "YOLOv8", "ByteTrack", "PostgreSQL"],
    techStack: ["Next.js 15", "React 19", "TypeScript", "FastAPI", "YOLOv8", "ByteTrack", "PostgreSQL"],
    tech: ["Next.js 15", "FastAPI", "YOLOv8", "ByteTrack", "PostgreSQL"],
    tags: ["YOLOv8", "17 COCO Keypoints", "ByteTrack", "FastAPI", "Next.js 15", "HTML5 Canvas"],
    repository: "SightForge",
    githubRepoName: "SightForge",
    githubUrl: "https://github.com/codesbysayam/SightForge",
    defaultBranch: "main",
    isFork: false,
    verificationNote:
      "Verified in codesbysayam/SightForge; local/self-hosted dual Next.js + FastAPI architecture (replaces earlier generic YOLO placeholder).",
    featured: true,
    metrics: {
      developmentTime: "Dual-Service Architecture",
      codeComplexityScore: "Real-Time CVFrame Pipeline",
      linesOfCode: "411 KB TS + Python",
    },
    highlights: [
      "YOLOv8 person detection (COCO Class ID 0) + IoU 0.45 Non-Max Suppression",
      "17-keypoint skeletal pose estimation paired with ByteTrack persistent tracking",
      "Atomic CVFrame replacement in a 16:9 HTML5 Canvas eliminating stale overlay lag",
      "FastAPI backend with PostgreSQL telemetry persistence and Makefile orchestration",
    ],
    features: [
      "YOLOv8 person detection (COCO Class ID 0) + IoU 0.45 Non-Max Suppression",
      "17-keypoint skeletal pose estimation paired with ByteTrack persistent tracking",
      "Atomic CVFrame replacement in a 16:9 HTML5 Canvas eliminating stale overlay lag",
    ],
    role: "Computer Vision & Full-Stack Systems Engineer",
    evolutionStage: {
      phase: "COMPUTER VISION",
      step: "03",
      period: "Current",
      focus: "YOLOv8 COCO-0, 17-keypoint pose, ByteTrack & atomic CVFrame rendering",
    },
  },
  {
    id: "memory-in-motion",
    name: "MEMORY IN MOTION",
    title: "MEMORY IN MOTION",
    subtitle: "Interactive Mechanistic Lab · Fixed-Size Memory & BDH",
    shortDescription:
      "Interactive mechanistic interpretability lab built for DataForge 2026 (IIT Kharagpur) contrasting O(1) recurrent state and Hebbian fast weights against O(T) KV caches.",
    longDescription:
      "Memory in Motion is an interactive visualization and mechanistic interpretability lab created for the 'Explain the Frontier' challenge at DataForge 2026 (IIT Kharagpur) with Team ALGNITE. It makes non-Transformer sequence modeling tangible—demonstrating fixed-size O(1) recurrent memory updates, Hebbian synaptic plasticity, fast-weight dynamics, and the Dragon Hatchling (BDH) architecture alongside O(T) KV-cache attention.",
    problem:
      "Modern frontier research on sub-quadratic sequence models, fast weights, and biologically inspired Hebbian memory often stays locked behind dense equations and static papers.",
    solution:
      "Built an interactive browser lab combining React, TypeScript, D3.js/SVG visualizations, and KaTeX mathematical notation with step-by-step memory state simulations.",
    whyItExists:
      "Researchers and students learning post-Transformer memory mechanics benefit from direct manipulation of state capacity, decay, and retrieval collisions rather than passive reading.",
    whatIBuilt:
      "Developed the interactive simulation interface, asymptotic complexity comparison charts (O(1) fixed-state vs O(T) KV-cache growth), KaTeX mathematical derivations, and Python supporting scripts.",
    implementation:
      "Implemented in TypeScript (1.71 MB across interactive modules, datasets, and visual state engines), CSS (29.7 KB), and Python (12.4 KB) with D3/SVG state visualizations and KaTeX rendering.",
    architecture: [
      "Interactive Memory State Sandbox contrasting O(1) recurrent buffers vs O(T) KV-cache growth",
      "Dragon Hatchling (BDH) & Hebbian fast-weight associative update inspector",
      "KaTeX-rendered mathematical formulation panel synced directly to live simulation sliders",
      "Multi-chapter guided exploratory narrative built for DataForge 2026 evaluation",
    ],
    engineeringDecisions: [
      "Rendered mathematical notation via KaTeX alongside interactive D3/SVG graphs so learners correlate equations directly with matrix activation updates.",
      "Pre-computed deterministic trace states for reproducible explanations without requiring heavy GPU backends in the browser.",
    ],
    resultsAndStatus:
      "Live interactive lab deployed at memoryinmotion.vercel.app for DataForge 2026 (IIT Kharagpur, 'Explain the Frontier') by Team ALGNITE. Repository holds 1 GitHub star.",
    verifiedFacts: [
      "Repository: codesbysayam/Memory-in-Motion (branch: main, 1 star)",
      "Deployment: https://memoryinmotion.vercel.app",
      "Dominant Stack: TypeScript (1.71 MB), CSS (29.7 KB), Python (12.4 KB), HTML (3.1 KB)",
      "Event & Team: DataForge 2026 (IIT Kharagpur · 'Explain the Frontier') · Team ALGNITE",
    ],
    category: "Mechanistic Interpretability & AI Research",
    categoryLabel: "AI Research Lab",
    categoryFilter: "AI / ML",
    secondaryCategories: ["FULL-STACK"],
    status: "Live · IIT KGP DataForge",
    statusType: "hackathon",
    technologies: ["TypeScript", "React", "KaTeX", "D3.js", "Python", "Tailwind CSS", "Vercel"],
    techStack: ["TypeScript", "React", "KaTeX", "D3.js", "Python", "BDH / Fast Weights"],
    tech: ["TypeScript", "React", "KaTeX", "D3.js", "Python"],
    tags: ["DataForge 2026", "IIT Kharagpur", "Team ALGNITE", "Mechanistic Interpretability", "Dragon Hatchling"],
    repository: "Memory-in-Motion",
    githubRepoName: "Memory-in-Motion",
    githubUrl: "https://github.com/codesbysayam/Memory-in-Motion",
    defaultBranch: "main",
    isFork: false,
    team: "Team ALGNITE",
    event: "DataForge 2026 · IIT Kharagpur ('Explain the Frontier')",
    verificationNote:
      "Public repository codesbysayam/Memory-in-Motion with live Vercel interactive lab deployment.",
    liveUrl: "https://memoryinmotion.vercel.app",
    demoUrl: "https://memoryinmotion.vercel.app",
    featured: true,
    metrics: {
      developmentTime: "DataForge 2026 Sprint",
      codeComplexityScore: "O(1) vs O(T) Visual Lab",
      linesOfCode: "1.75 MB Repo Source",
    },
    highlights: [
      "Interactive comparison of O(1) fixed-size recurrent state vs O(T) KV-cache memory growth",
      "Explorable Dragon Hatchling (BDH) & Hebbian fast-weight associative memory mechanics",
      "KaTeX mathematical notation synced with real-time parameter simulations",
      "Built with Team ALGNITE for DataForge 2026 at IIT Kharagpur ('Explain the Frontier')",
    ],
    features: [
      "Interactive comparison of O(1) fixed-size recurrent state vs O(T) KV-cache memory growth",
      "Explorable Dragon Hatchling (BDH) & Hebbian fast-weight associative memory mechanics",
      "KaTeX mathematical notation synced with real-time parameter simulations",
    ],
    role: "Interactive Visualization & Frontend Engineer (Team ALGNITE)",
    evolutionStage: {
      phase: "AI RESEARCH LAB",
      step: "04",
      period: "DataForge 2026",
      focus: "Hebbian fast weights, BDH architecture & O(1) vs O(T) memory modeling",
    },
  },
  {
    id: "axiom",
    name: "AXIOM",
    title: "AXIOM",
    subtitle: "Autonomous Operations Control Plane · Policy, Approval & Audit",
    shortDescription:
      "Autonomous operations control plane built in 36h for WCC Launchpad 30 featuring deterministic policy rules, approval gates, failure recovery, sandboxes, and audit chains.",
    longDescription:
      "AXIOM is an autonomous operations control plane created in 36 hours during WCC Launchpad 30 with Team ALGNITE. It governs high-stakes autonomous workflows through deterministic policy evaluation, human operator approval gates, dry-run simulation sandboxes, failure recovery transitions, and tamper-evident audit data structures.",
    problem:
      "As teams adopt autonomous execution pipelines, existing dashboards lack deterministic pre-flight policy guards, dry-run impact simulation, and tamper-evident execution proofs.",
    solution:
      "Engineered a control plane enforcing static policy boundaries, sandbox simulation previews before dispatch, structured failure recovery, and linked tamper-evident audit entries.",
    whyItExists:
      "Autonomous operations require predictable governance primitives—policy evaluation, human quorum gates, and verifiable execution trails—before touching production systems.",
    whatIBuilt:
      "Developed the TypeScript/React control plane interface, policy rule evaluator visualization, sandbox dry-run simulator view, failure recovery states, and tamper-evident hash-linked audit inspector.",
    implementation:
      "Built in TypeScript (793.5 KB), CSS (61.2 KB), and HTML (1.8 KB) during the 36-hour WCC Launchpad 30 sprint, deployed publicly on Vercel.",
    architecture: [
      "Deterministic Policy Engine evaluating allow, deny, and escalate rules pre-execution",
      "Simulation Sandbox modeling action diffs and blast radius before live dispatch",
      "Human Approval Gate enforcing operator review for escalated workflow intents",
      "Failure Recovery & Tamper-Evident Audit Chain linking every state transition cryptographically",
    ],
    engineeringDecisions: [
      "Modeled audit logs as hash-linked sequential entries in the control plane state so tampering invalidates downstream verification traces.",
      "Separated dry-run sandbox evaluation from live commit pathways to make policy violations inspectable without side effects.",
    ],
    resultsAndStatus:
      "Completed in 36 hours at WCC Launchpad 30 by Team ALGNITE and deployed live at axiomwcc.vercel.app. Source public under codesbysayam/AXIOM.",
    verifiedFacts: [
      "Repository: codesbysayam/AXIOM (branch: main)",
      "Deployment: https://axiomwcc.vercel.app",
      "Dominant Stack: TypeScript (793.5 KB), CSS (61.2 KB), HTML (1.8 KB)",
      "Event & Team: WCC Launchpad 30 (36h hackathon) · Team ALGNITE",
    ],
    category: "Autonomous Control Planes & Governance",
    categoryLabel: "Control Plane Systems",
    categoryFilter: "SYSTEMS",
    secondaryCategories: ["AI / ML", "FULL-STACK"],
    status: "Live · WCC Launchpad 30",
    statusType: "hackathon",
    technologies: ["TypeScript", "React", "Control Plane", "Policy Engine", "Audit Chain", "CSS", "Vercel"],
    techStack: ["TypeScript", "React", "Policy Engine", "Sandbox Simulation", "Audit Chain"],
    tech: ["TypeScript", "React", "Policy Engine", "Audit Chain"],
    tags: ["WCC Launchpad 30", "Team ALGNITE", "Control Plane", "Governance", "Tamper-Evident Audit"],
    repository: "AXIOM",
    githubRepoName: "AXIOM",
    githubUrl: "https://github.com/codesbysayam/AXIOM",
    defaultBranch: "main",
    isFork: false,
    team: "Team ALGNITE",
    event: "WCC Launchpad 30 (36-hour hackathon)",
    verificationNote:
      "Public repository codesbysayam/AXIOM verified on main branch with live Vercel deployment.",
    liveUrl: "https://axiomwcc.vercel.app",
    demoUrl: "https://axiomwcc.vercel.app",
    featured: false,
    metrics: {
      developmentTime: "36 Hours (WCC Launchpad 30)",
      codeComplexityScore: "Policy + Audit State Machine",
      linesOfCode: "856 KB Repo Source",
    },
    highlights: [
      "Deterministic pre-flight policy rules blocking out-of-bounds agent actions",
      "Interactive dry-run simulation sandbox inspecting state mutations safely",
      "Failure recovery transitions with human-in-the-loop approval escalation",
      "Tamper-evident audit structures built during the 36h WCC Launchpad 30 sprint",
    ],
    features: [
      "Deterministic pre-flight policy rules blocking out-of-bounds agent actions",
      "Interactive dry-run simulation sandbox inspecting state mutations safely",
      "Tamper-evident audit structures built during the 36h WCC Launchpad 30 sprint",
    ],
    role: "Control Plane Architect & Frontend Developer (Team ALGNITE)",
    evolutionStage: {
      phase: "CONTROL PLANES",
      step: "05",
      period: "WCC Launchpad 30",
      focus: "Deterministic policy rules, sandboxes, failure recovery & tamper-evident audits",
    },
  },
  {
    id: "inkloom",
    name: "INKLOOM",
    title: "INKLOOM",
    subtitle: "Constructed AI Logo Design & Composition System",
    shortDescription:
      "Forked workspace for specialized AI logo design models—turning brand constraints into constructed typography/symbol marks with composition lockups and clear-space rules.",
    longDescription:
      "INKLOOM explores specialized model pipelines for constructed identity design: a brand-analysis model extracts structured constraints from a business brief, typography and symbol models construct geometric mark primitives, and a composition engine produces lockups and clear-space guidelines. Hosted as an early-access platform at inkloom.art (while underlying logo generation models remain under active construction).",
    problem:
      "Generic raster image generators produce uneditable, typo-prone pixel blobs instead of structured vector geometry, typographic pairings, and repeatable clear-space lockup rules.",
    solution:
      "Decomposes logo synthesis into specialized stages—brand constraint extraction, typographic + symbol construction, and a geometric composition engine outputting structured lockups.",
    whyItExists:
      "Brand identity systems require crisp geometry, proportions, and multi-lockup rules rather than one-off prompt-to-PNG approximations.",
    whatIBuilt:
      "Maintained and explored the forked Inkloom TypeScript/CSS/PostgreSQL/Docker workspace (master branch) supporting the web application shell and structured identity composition interface.",
    implementation:
      "Structured in TypeScript (1.98 MB), CSS (16.9 KB), JavaScript (12.7 KB), PLpgSQL (7.3 KB), and Dockerfile configuration on the repository's default master branch.",
    architecture: [
      "Brand-analysis pipeline extracting structured visual & industry constraints",
      "Decoupled typography selection and geometric symbol construction stages",
      "Deterministic composition engine enforcing proportions, lockups & clear-space rules",
      "Containerized full-stack web workspace backed by TypeScript and PLpgSQL schemas",
    ],
    engineeringDecisions: [
      "Modeled identity generation as a multi-stage geometric composition pipeline instead of end-to-end raster diffusion.",
      "Transparently documented fork origin, master default branch, and early-access model development state.",
    ],
    resultsAndStatus:
      "Early access web presence live at inkloom.art. Public fork at codesbysayam/inkloom (default branch: master, isFork: true); core specialized logo models remain under active construction.",
    verifiedFacts: [
      "Repository: codesbysayam/inkloom (isFork: true, default branch: master)",
      "Deployment: https://inkloom.art (early access)",
      "Dominant Stack: TypeScript (1.98 MB), CSS (16.9 KB), JS (12.7 KB), PLpgSQL (7.3 KB), Dockerfile",
      "Disclosure: Forked repository with specialized logo models under active construction",
    ],
    category: "Generative Design Systems",
    categoryLabel: "Design AI (Fork)",
    categoryFilter: "AI / ML",
    secondaryCategories: ["FULL-STACK"],
    status: "Early Access · Fork (master)",
    statusType: "opensource",
    technologies: ["TypeScript", "React", "PLpgSQL", "Docker", "CSS", "Design Systems"],
    techStack: ["TypeScript", "React", "PLpgSQL", "Docker", "Composition Engine"],
    tech: ["TypeScript", "React", "PLpgSQL", "Docker"],
    tags: ["Forked Repo", "master Branch", "Constructed Logos", "Early Access", "Composition Engine"],
    repository: "inkloom",
    githubRepoName: "inkloom",
    githubUrl: "https://github.com/codesbysayam/inkloom",
    defaultBranch: "master",
    isFork: true,
    verificationNote:
      "Public fork (isFork: true) using default branch 'master'. Early access open at inkloom.art; underlying specialized logo models are under construction.",
    liveUrl: "https://inkloom.art",
    demoUrl: "https://inkloom.art",
    featured: false,
    metrics: {
      developmentTime: "Early Access Build",
      codeComplexityScore: "Multi-Stage Composition",
      linesOfCode: "2.02 MB Fork Source",
    },
    highlights: [
      "Structured brand-constraint analysis separated from geometric composition rules",
      "Lockup and clear-space rule engine designed for scalable identity artifacts",
      "Dockerized workspace with PLpgSQL database schema and TypeScript web client",
      "Disclosed public fork (master branch) while specialized logo models remain in R&D",
    ],
    features: [
      "Structured brand-constraint analysis separated from geometric composition rules",
      "Lockup and clear-space rule engine designed for scalable identity artifacts",
      "Dockerized workspace with PLpgSQL database schema and TypeScript web client",
    ],
    role: "Contributor / Workspace Maintainer (Public Fork)",
    evolutionStage: {
      phase: "GENERATIVE DESIGN",
      step: "06",
      period: "Early Access",
      focus: "Constructed logo systems, composition rules & fork maintenance (master)",
    },
  },
  {
    id: "campus-connect",
    name: "CAMPUS CONNECT",
    title: "CAMPUS CONNECT",
    subtitle: "College Event Discovery, Registration & Organizer Dashboard",
    shortDescription:
      "Next.js & TypeScript campus event management platform pairing student discovery and registration with an organizer dashboard and Vitest suite.",
    longDescription:
      "Campus Connect is a full-stack Next.js and TypeScript web application streamlining campus event discovery and organizer workflows. Students can search, filter, and register for upcoming college events with instant seat updates, while organizers use a dedicated management console to create, edit, and monitor attendance capacity.",
    problem:
      "College clubs and fests rely on scattered spreadsheets and chat blasts for event registrations, causing seat overbooking, broken schedules, and zero centralized discovery for students.",
    solution:
      "Unified a student discovery/registration feed with an organizer CRUD dashboard and real-time seat count synchronization, verified with automated Vitest suites.",
    whyItExists:
      "Campus communities need a responsive single hub where students discover verified events quickly and organizers track seat capacity cleanly.",
    whatIBuilt:
      "Built the Next.js/TypeScript student browsing experience, filtering and search flows, organizer event management dashboard, seat availability sync, and Vitest test coverage.",
    implementation:
      "Engineered in TypeScript (210.5 KB), CSS (9.7 KB), and HTML with seeded in-memory state persistence (per README disclosure, seeded records reset cleanly on server restart).",
    architecture: [
      "Student Discovery & Registration flow with category filtering and search",
      "Organizer Dashboard supporting event creation, updates, and capacity monitoring",
      "Live seat inventory synchronization preventing duplicate or over-capacity signups",
      "Vitest test suite validating core registration and organizer state mutations",
    ],
    engineeringDecisions: [
      "Used a seeded in-memory store for frictionless zero-config evaluation and predictable Vitest runs, explicitly documenting that data resets on server restart.",
      "Shared validation schemas between student registration forms and organizer dashboard endpoints.",
    ],
    resultsAndStatus:
      "Live demo deployed at campusconnect1273.vercel.app with source at codesbysayam/CAMPUSCONNECT_1273. Storage disclosure: seeded in-memory storage resets on process restart.",
    verifiedFacts: [
      "Repository: codesbysayam/CAMPUSCONNECT_1273 (branch: main)",
      "Deployment: https://campusconnect1273.vercel.app/",
      "Dominant Stack: TypeScript / Next.js (210.5 KB), CSS (9.7 KB), Vitest",
      "Storage Disclosure: Uses README-documented seeded in-memory storage that resets on restart",
    ],
    category: "Full-Stack Web Applications",
    categoryLabel: "Full-Stack Platform",
    categoryFilter: "FULL-STACK",
    secondaryCategories: ["SYSTEMS"],
    status: "Live · Demo Deployed",
    statusType: "live",
    technologies: ["Next.js", "TypeScript", "React", "Vitest", "Tailwind CSS", "Vercel"],
    techStack: ["Next.js", "TypeScript", "React", "Vitest", "Tailwind CSS"],
    tech: ["Next.js", "TypeScript", "React", "Vitest"],
    tags: ["Campus Platform", "Event Management", "Next.js", "Vitest", "In-Memory Store"],
    repository: "CAMPUSCONNECT_1273",
    githubRepoName: "CAMPUSCONNECT_1273",
    githubUrl: "https://github.com/codesbysayam/CAMPUSCONNECT_1273",
    defaultBranch: "main",
    isFork: false,
    verificationNote:
      "Uses seeded in-memory storage (resets on restart) per repository README; automated checks powered by Vitest.",
    liveUrl: "https://campusconnect1273.vercel.app/",
    demoUrl: "https://campusconnect1273.vercel.app/",
    featured: false,
    metrics: {
      developmentTime: "Campus System Build",
      codeComplexityScore: "Next.js + Vitest",
      linesOfCode: "221 KB Repo Source",
    },
    highlights: [
      "Student event discovery with live search, category filtering & seat status",
      "Dedicated organizer console to create, update, and monitor event capacity",
      "Vitest unit/integration suite covering event registration state transitions",
      "Transparent README disclosure of seeded in-memory persistence lifecycle",
    ],
    features: [
      "Student event discovery with live search, category filtering & seat status",
      "Dedicated organizer console to create, update, and monitor event capacity",
      "Vitest unit/integration suite covering event registration state transitions",
    ],
    role: "Full-Stack Developer",
    evolutionStage: {
      phase: "FULL-STACK WEB",
      step: "07",
      period: "Campus Platform",
      focus: "Next.js event discovery, organizer capacity controls & Vitest verification",
    },
  },
  {
    id: "sayam-solves",
    name: "SAYAMSOLVES",
    title: "SAYAMSOLVES",
    subtitle: "C++ DSA Solutions & LeetHub V2 Synced Repository",
    shortDescription:
      "Open-source C++ algorithmic archive synced via LeetHub V2, tracking 3 repository problem solutions (LC 0005, 0033, 0115) alongside a 4-problem LeetCode baseline.",
    longDescription:
      "SayamSolves is a disciplined C++ Data Structures & Algorithms repository synced automatically from LeetCode via LeetHub V2. Its verified repository stats.json tracks 3 committed solution directories—0005 Longest Palindromic Substring, 0033 Search in Rotated Sorted Array, and 0115 Distinct Subsequences—complemented by a verified 4-problem LeetCode profile baseline.",
    problem:
      "Ad-hoc coding practice without version control or asymptotic complexity notes makes algorithm patterns hard to revisit and impossible for reviewers to verify.",
    solution:
      "Maintained a structured LeetHub V2 repository storing clean C++ solutions per problem folder with documented time/space complexity invariants and transparent repository telemetry.",
    whyItExists:
      "Building genuine algorithmic fluency requires transparent tracking of actual solved problems rather than inflated or fabricated problem counts.",
    whatIBuilt:
      "Automated LeetHub V2 problem syncing under codesbysayam/sayam-solves with structured C++ implementations across string symmetry expansion, rotated binary search, and 2D dynamic programming.",
    implementation:
      "C++ codebase (2,037 bytes across committed solutions and stats.json) organized by zero-padded LeetCode problem slug on the main branch.",
    architecture: [
      "Automated LeetHub V2 commit synchronization pushing accepted C++ submissions",
      "0005-longest-palindromic-substring: O(n²) time / O(1) space center-expansion solver",
      "0033-search-in-rotated-sorted-array: O(log n) pivot-partitioned binary search",
      "0115-distinct-subsequences: O(|s|·|t|) / O(|t|) dynamic programming state table",
    ],
    engineeringDecisions: [
      "Synced directly through LeetHub V2 to preserve authentic submission timestamps and exact problem slugs instead of manual bulk uploads.",
      "Explicitly reported the exact stats.json count (3 repo files) and LeetCode baseline (4 solved) without inflating numbers.",
    ],
    resultsAndStatus:
      "Active public repository at github.com/codesbysayam/sayam-solves (1 star, branch: main). Tracks 3 solution files in stats.json (LC 0005, 0033, 0115) and 4 solved on LeetCode profile.",
    verifiedFacts: [
      "Repository: codesbysayam/sayam-solves (exact lowercase slug, 1 star)",
      "Tracked Repo Files (stats.json): 3 (0005-longest-palindromic-substring, 0033-search-in-rotated-sorted-array, 0115-distinct-subsequences)",
      "LeetCode Profile Baseline: 4 solved (leetcode.com/u/codesbysayam)",
      "Dominant Stack: C++ (2,037 B) + LeetHub V2 synchronization",
    ],
    category: "Competitive Programming & DSA",
    categoryLabel: "C++ & Algorithms",
    categoryFilter: "DSA",
    status: "Active · 3 Repo / 4 LC",
    statusType: "active",
    technologies: ["C++", "DSA", "Algorithms", "Dynamic Programming", "Binary Search", "LeetHub V2"],
    techStack: ["C++", "DSA", "Dynamic Programming", "Binary Search", "LeetHub V2"],
    tech: ["C++", "DSA", "Algorithms", "LeetCode"],
    tags: ["C++20", "LeetHub V2", "LC 0005", "LC 0033", "LC 0115"],
    repository: "sayam-solves",
    githubRepoName: "sayam-solves",
    githubUrl: "https://github.com/codesbysayam/sayam-solves",
    defaultBranch: "main",
    isFork: false,
    verificationNote:
      "Verified stats.json contains 3 committed C++ problem directories (0005, 0033, 0115); LeetCode profile baseline is 4 solved problems.",
    featured: false,
    metrics: {
      developmentTime: "Continuous Practice",
      codeComplexityScore: "O(log n) to O(|s|·|t|) DP",
      linesOfCode: "3 Repo Files · 4 LC Solved",
    },
    highlights: [
      "Synced automatically via LeetHub V2 to preserve verifiable submission commits",
      "Covers expand-around-center (0005), rotated binary search (0033) & 2D DP (0115)",
      "Honest telemetry reporting 3 tracked repository solutions & 4 LeetCode baseline solved",
    ],
    features: [
      "Synced automatically via LeetHub V2 to preserve verifiable submission commits",
      "Covers expand-around-center (0005), rotated binary search (0033) & 2D DP (0115)",
    ],
    role: "C++ Problem Solver & Repository Maintainer",
    evolutionStage: {
      phase: "ALGORITHMS & C++",
      step: "08",
      period: "Ongoing",
      focus: "LeetHub V2 synced C++ implementations & honest asymptotic logs",
    },
  },
];

export const REAL_PROJECTS: ProjectItem[] = PROJECTS;
export const VERIFIED_PROJECTS: ProjectItem[] = PROJECTS;

// Helper to look up a project by either primary id or legacy/repository alias
export function getProjectById(id: string): ProjectItem | undefined {
  const normalized = id.toLowerCase().replace(/[-_]/g, "");
  if (normalized === "yolo" || normalized === "yoloedgevision") {
    return PROJECTS.find((p) => p.id === "sightforge");
  }
  if (normalized === "mausamsample") {
    return PROJECTS.find((p) => p.id === "mausam");
  }
  if (normalized === "campusconnect1273") {
    return PROJECTS.find((p) => p.id === "campus-connect");
  }
  return PROJECTS.find((p) => {
    const pNorm = p.id.toLowerCase().replace(/[-_]/g, "");
    const repoNorm = (p.githubRepoName || "").toLowerCase().replace(/[-_]/g, "");
    return pNorm === normalized || repoNorm === normalized || p.id === id;
  });
}
