/**
 * ============================================================================
 * CENTRAL CONTENT & DATA LAYER FOR SAYAM MUKHERJEE'S ENGINEERING PORTFOLIO
 * ============================================================================
 * 
 * Single source of truth for static website copy, navigation, credentials,
 * project metadata, and external canonical URLs.
 * 
 * Factual data principles:
 * - Real URLs and verified credentials only
 * - No fabricated metrics, users, or rankings
 * - Clean, human-written tone without AI buzzwords or em dashes
 */

export const SITE_URL = "https://sayammukherjee.in";
export const SITE_NAME = "Sayam Mukherjee | Engineering Portfolio & Ecosystem";

export const SOCIAL_LINKS = {
  github: "https://github.com/codesbysayam",
  linkedin: "https://www.linkedin.com/in/sayammukherjee-portfolio/",
  instagram: "https://www.instagram.com/_.wrick._/",
  youtube: "https://www.youtube.com/@ObsidianOptics_in",
  leetcode: "https://leetcode.com/u/codesbysayam/",
  codolio: "https://codolio.com/profile/codesbysayam/",
  fiverr: "https://www.fiverr.com/wrickmukherjee/buying?source=avatar_menu_profile",
} as const;

export { RESUME_URL } from "../config/resume.ts";

export const CONTACT_INFO = {
  name: "Sayam Mukherjee",
  email: "wrickbusiness@gmail.com",
  phone: "+91-6290921813",
  location: "Bhubaneswar, Odisha (Hometown: Hooghly, West Bengal)",
  university: "Kalinga Institute of Industrial Technology, Bhubaneswar",
  program: "B.Tech in Computer Science & Engineering (AI & ML)",
  semester: "2nd Year, 3rd Semester",
  cgpa: "9.06",
} as const;

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  shortcut: string;
}

export const NAVIGATION: readonly NavigationItem[] = [
  { id: "home", label: "Home", href: "/", shortcut: "H" },
  { id: "about", label: "About", href: "/about", shortcut: "A" },
  { id: "projects", label: "Projects", href: "/projects", shortcut: "P" },
  { id: "skills", label: "Skills", href: "/skills", shortcut: "S" },
  { id: "ecosystem", label: "Ecosystem", href: "/ecosystem", shortcut: "E" },
  { id: "certificates", label: "Certificates", href: "/certificates", shortcut: "C" },
  { id: "journal", label: "Journal", href: "/journal", shortcut: "J" },
  { id: "contact", label: "Contact", href: "/contact", shortcut: "M" },
] as const;

export const HERO_CONTENT = {
  name: "Sayam Mukherjee",
  eyebrow: "AI & ML Student | Full-Stack Developer",
  title: "Sayam Mukherjee",
  subtitle: "AI & ML Student | Full-Stack Developer",
  description:
    "I’m a CSE student at KIIT exploring AI, machine learning, full-stack development, and the systems that connect them.",
  badge: "Open to internships · collaborations · freelance",
  primaryCta: "View my work",
  secondaryCta: "GitHub ↗",
} as const;

export const UI_COPY = {
  viewProject: "View Project",
  viewDetails: "View Details",
  viewCredential: "View Credential",
  inspectRecord: "Inspect Record",
  contactMe: "Contact Me",
  viewResume: "View Resume",
  downloadResume: "Download Resume",
  searchPlaceholder: "Search projects, technologies, or credentials...",
  noResults: "No results found matching your query.",
  filterAll: "All",
  tryAgain: "Try Again",
  reloadSection: "Reload Section",
  reloadPage: "Reload Page",
  componentUnavailable: "Component Temporarily Unavailable",
  componentErrorDesc:
    "An unexpected error occurred while rendering this section. You can try refreshing or browsing other sections.",
} as const;

export const ABOUT_CONTENT = {
  title: "About Sayam",
  subtitle: "Engineer, Builder & Athlete",
  description:
    "Undergraduate Computer Science student at KIIT Bhubaneswar, content creator with 12K+ total community reach, district table tennis athlete, and software developer.",
  storyTitle: "Building Practical Systems from Solid Fundamentals",
  quote:
    "I believe great engineering is not about writing the maximum amount of code, but about constructing reliable boundaries where systems fail gracefully and users feel empowered.",
  bio: "I am a 2nd Year (3rd Semester) Computer Science Engineering student at Kalinga Institute of Industrial Technology, Bhubaneswar (hometown: Hooghly, West Bengal), passionate about building scalable software, intelligent systems, and meaningful digital experiences. I enjoy transforming ideas into real-world products through continuous learning, disciplined execution, and creative problem-solving.",
  strengths: [
    {
      title: "Rapid System Synthesis",
      desc: "Turns documentation, technical papers, and API specifications into clean, working prototypes.",
    },
    {
      title: "Rigorous Algorithmic Discipline",
      desc: "Practices C++ fundamentals and core DSA deliberately, focusing on pointer mechanics, memory layout, and runtime guarantees.",
    },
    {
      title: "Full-Stack System Architecture",
      desc: "Connects modern React interfaces with type-safe Node.js and Express backends, focusing on clean error handling and predictable data flow.",
    },
  ],
  academics: [
    {
      degree: "B.Tech - Computer Science & Engineering",
      period: "2025-2029",
      institution: "Kalinga Institute of Industrial Technology, Bhubaneswar",
      scoreLabel: "CGPA",
      score: "9.06",
    },
    {
      degree: "Senior Secondary (12th - CBSE)",
      period: "2024–2025",
      institution: "Aditya Birla Vani Bharati, Rishra, Hooghly",
      scoreLabel: "Percentage",
      score: "86.2%",
    },
    {
      degree: "Secondary (10th - CBSE)",
      period: "2022–2023",
      institution: "Aditya Birla Vani Bharati, Rishra, Hooghly",
      scoreLabel: "Percentage",
      score: "92.6%",
    },
  ],
  stats: {
    cgpa: "9.06",
    university: "Kalinga Institute of Industrial Technology, Bhubaneswar",
    semester: "2nd Year, 3rd Semester",
    location: "Bhubaneswar, Odisha (Hometown: Hooghly, West Bengal)",
    focus: ["C++", "DSA", "Computer Vision", "Full Stack"],
  },
} as const;

export interface ProjectContent {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  whyItExists: string;
  whatIBuilt: string;
  category: string;
  categoryLabel: string;
  categoryFilter: "AI / ML" | "FULL-STACK" | "SYSTEMS" | "DSA";
  status: string;
  statusType: "live" | "active" | "hackathon" | "opensource";
  technologies: readonly string[];
  techStack: readonly string[];
  tags: readonly string[];
  repository?: string;
  githubRepoName?: string;
  githubUrl: string;
  liveUrl?: string;
  demoUrl?: string;
  featured: boolean;
  highlights: readonly string[];
  metrics?: {
    developmentTime?: string;
    codeComplexityScore?: string;
    linesOfCode?: string;
  };
}

export const PROJECTS: readonly ProjectContent[] = [
  {
    id: "operon",
    name: "OPERON",
    title: "OPERON",
    subtitle: "Multi-Agent Operations Platform & Approval State Machine",
    shortDescription:
      "Multi-agent operations engine across Support, Finance, HR, and Ops that automates task routing while enforcing explicit human-in-the-loop approval gates.",
    description:
      "OPERON coordinates role-scoped software agents across Support, Finance, HR, and Operations workflows while halting sensitive mutations at an explicit human-in-the-loop approval gate with complete audit logging.",
    whyItExists:
      "Cross-team operational workflows stall across fragmented tools, yet unchecked autonomous agents introduce unacceptable financial and compliance risk.",
    whatIBuilt:
      "Designed and implemented the TypeScript/React client workspace, Node.js/Express backend API, role-specific agent router, and auditable state transition checkpoints.",
    category: "Autonomous Systems & AI",
    categoryLabel: "Autonomous Systems & AI",
    categoryFilter: "AI / ML",
    status: "Live · Deploy or Die",
    statusType: "live",
    technologies: ["TypeScript", "React", "Node.js", "Express", "Multi-Agent AI", "Gemini API", "Tailwind CSS", "Vite", "Vercel"],
    techStack: ["TypeScript", "React", "Node.js", "Express", "Multi-Agent AI", "Tailwind CSS"],
    tags: ["Multi-Agent Systems", "Human-in-the-Loop", "Workflow Automation", "Team NEXUS"],
    repository: "Operon",
    githubRepoName: "Operon",
    githubUrl: "https://github.com/codesbysayam/Operon",
    liveUrl: "https://operonpro.vercel.app",
    demoUrl: "https://operonpro.vercel.app",
    featured: true,
    highlights: [
      "Role-specific agent routing across Support, Finance, HR, and Operations queues",
      "Explicit human-in-the-loop approval gate before committing high-risk operations",
      "Modular Express backend synced with responsive TypeScript/React console",
    ],
    metrics: {
      developmentTime: "Deploy or Die Hackathon",
      codeComplexityScore: "Multi-Agent State Machine",
      linesOfCode: "946 KB Repo Source",
    },
  },
  {
    id: "mausam",
    name: "MAUSAM",
    title: "MAUSAM",
    subtitle: "Weather Intelligence, Doppler Nowcasting & Civic Hazard Platform",
    shortDescription:
      "SIH 2026 atmospheric intelligence platform unifying Doppler radar nowcasting, SACHET/NDMA alerts, NAQI air quality, INCOIS marine state, and Ask MAUSAM AI.",
    description:
      "Built for Smart India Hackathon (SIH 2026) with Team ALGNITE, MAUSAM consolidates hyper-local weather telemetry, Doppler radar nowcasting, SACHET/NDMA civic alerts, CPCB/NAQI air quality indices, INCOIS marine advisories, and Ask MAUSAM AI guidance (active repo: codesbysayam/mausam_sih-26; earlier snapshot: mausam_sample).",
    whyItExists:
      "Weather, air quality, coastal tide, and disaster warnings are fragmented across separate portals; MAUSAM unifies them for citizens, farmers, and coastal communities.",
    whatIBuilt:
      "Built the React/TypeScript frontend architecture, telemetry visualization views, Python climate utilities, and Ask MAUSAM conversational weather assistant.",
    category: "Full-Stack Web & Data",
    categoryLabel: "Civic & Climate Tech",
    categoryFilter: "FULL-STACK",
    status: "Live · SIH 2026",
    statusType: "hackathon",
    technologies: ["TypeScript", "React", "Python", "Tailwind CSS", "Weather APIs", "C", "PLpgSQL", "Vercel"],
    techStack: ["TypeScript", "React", "Python", "Tailwind CSS", "Weather APIs", "Ask MAUSAM AI"],
    tags: ["SIH 2026", "Team ALGNITE", "Doppler Nowcasting", "NAQI / INCOIS", "SACHET / NDMA"],
    repository: "mausam_sih-26",
    githubRepoName: "mausam_sih-26",
    githubUrl: "https://github.com/codesbysayam/mausam_sih-26",
    liveUrl: "https://mausamgovt.vercel.app",
    demoUrl: "https://mausamgovt.vercel.app",
    featured: true,
    highlights: [
      "Doppler radar nowcasting, SACHET/NDMA alerts, and CPCB NAQI air quality integration",
      "INCOIS marine/coastal sea-state monitoring and agrometeorological soil advisories",
      "Active repository maintained in codesbysayam/mausam_sih-26",
    ],
    metrics: {
      developmentTime: "SIH 2026 Sprint",
      codeComplexityScore: "Multi-Source Geospatial UI",
      linesOfCode: "5.47 MB Polyglot Repo",
    },
  },
  {
    id: "sightforge",
    name: "SIGHTFORGE",
    title: "SIGHTFORGE",
    subtitle: "Dual-Service YOLOv8 Person, Pose & ByteTrack Edge CV Platform",
    shortDescription:
      "Real-time computer vision platform pairing a Next.js 15 / React 19 16:9 Canvas client with FastAPI YOLOv8 person detection, 17-keypoint pose, and ByteTrack.",
    description:
      "SightForge pairs a Next.js 15 / React 19 16:9 HTML5 Canvas client with a FastAPI YOLOv8 inference service performing COCO Class ID 0 person detection, 17-keypoint skeletal pose estimation, Non-Max Suppression (IoU 0.45), ByteTrack tracking, and PostgreSQL telemetry persistence (local/self-hosted, no public live URL).",
    whyItExists:
      "Real-time spatial analytics need deterministic frame-to-overlay synchronization alongside persistent pose and identity tracking without cloud lock-in.",
    whatIBuilt:
      "Implemented the Next.js 15 / React 19 atomic CVFrame Canvas viewer, FastAPI YOLOv8 + ByteTrack pipeline, Makefile orchestration, and PostgreSQL telemetry persistence.",
    category: "Edge Computer Vision & Tracking",
    categoryLabel: "Computer Vision & AI",
    categoryFilter: "AI / ML",
    status: "Open Source · Dual-Service",
    statusType: "opensource",
    technologies: ["Next.js 15", "React 19", "TypeScript", "FastAPI", "Python", "YOLOv8", "ByteTrack", "PostgreSQL"],
    techStack: ["Next.js 15", "React 19", "TypeScript", "FastAPI", "YOLOv8", "ByteTrack", "PostgreSQL"],
    tags: ["YOLOv8", "17 COCO Keypoints", "ByteTrack", "FastAPI", "Next.js 15", "HTML5 Canvas"],
    repository: "SightForge",
    githubRepoName: "SightForge",
    githubUrl: "https://github.com/codesbysayam/SightForge",
    featured: true,
    highlights: [
      "YOLOv8 person detection (COCO Class ID 0) + IoU 0.45 Non-Max Suppression",
      "17-keypoint skeletal pose estimation paired with ByteTrack persistent tracking",
      "Atomic CVFrame replacement in a 16:9 HTML5 Canvas + PostgreSQL storage",
    ],
    metrics: {
      developmentTime: "Dual-Service Architecture",
      codeComplexityScore: "Real-Time CVFrame Pipeline",
      linesOfCode: "411 KB TS + Python",
    },
  },
  {
    id: "memory-in-motion",
    name: "MEMORY IN MOTION",
    title: "MEMORY IN MOTION",
    subtitle: "Interactive Mechanistic Lab · Fixed-Size Memory & BDH",
    shortDescription:
      "Interactive mechanistic interpretability lab built for DataForge 2026 (IIT Kharagpur) contrasting O(1) recurrent state and Hebbian fast weights against O(T) KV caches.",
    description:
      "Created for DataForge 2026 ('Explain the Frontier') at IIT Kharagpur with Team ALGNITE, Memory in Motion demonstrates fixed-size O(1) recurrent memory updates, Hebbian plasticity, fast weights, and Dragon Hatchling (BDH) architecture alongside O(T) KV caches using KaTeX and D3.js/SVG.",
    whyItExists:
      "Students and researchers benefit from interactive manipulation of memory capacity, decay, and retrieval collisions rather than static paper equations.",
    whatIBuilt:
      "Built the interactive simulation interface, O(1) vs O(T) complexity visualizations, KaTeX mathematical derivations, and supporting Python scripts.",
    category: "Mechanistic Interpretability & AI Research",
    categoryLabel: "AI Research Lab",
    categoryFilter: "AI / ML",
    status: "Live · IIT KGP DataForge",
    statusType: "hackathon",
    technologies: ["TypeScript", "React", "KaTeX", "D3.js", "Python", "Tailwind CSS", "Vercel"],
    techStack: ["TypeScript", "React", "KaTeX", "D3.js", "Python", "BDH / Fast Weights"],
    tags: ["DataForge 2026", "IIT Kharagpur", "Team ALGNITE", "Mechanistic Interpretability", "Dragon Hatchling"],
    repository: "Memory-in-Motion",
    githubRepoName: "Memory-in-Motion",
    githubUrl: "https://github.com/codesbysayam/Memory-in-Motion",
    liveUrl: "https://memoryinmotion.vercel.app",
    demoUrl: "https://memoryinmotion.vercel.app",
    featured: true,
    highlights: [
      "Interactive comparison of O(1) fixed-size recurrent state vs O(T) KV-cache growth",
      "Dragon Hatchling (BDH) & Hebbian fast-weight associative memory mechanics",
      "KaTeX mathematical notation synced with real-time parameter simulations",
    ],
    metrics: {
      developmentTime: "DataForge 2026 Sprint",
      codeComplexityScore: "O(1) vs O(T) Visual Lab",
      linesOfCode: "1.75 MB Repo Source",
    },
  },
  {
    id: "axiom",
    name: "AXIOM",
    title: "AXIOM",
    subtitle: "Autonomous Operations Control Plane · Policy, Approval & Audit",
    shortDescription:
      "Autonomous operations control plane built in 36h for WCC Launchpad 30 featuring deterministic policy rules, approval gates, failure recovery, sandboxes, and audit chains.",
    description:
      "Built in 36 hours at WCC Launchpad 30 with Team ALGNITE, AXIOM governs automated operations with deterministic pre-flight policy rules, dry-run simulation sandboxes, human quorum approval gates, failure recovery transitions, and tamper-evident hash-linked audit chains.",
    whyItExists:
      "Autonomous pipelines need deterministic policy boundaries, impact previews, and verifiable audit trails before mutating production environments.",
    whatIBuilt:
      "Developed the TypeScript/React control plane interface, policy evaluator view, simulation sandbox, failure recovery states, and tamper-evident audit inspector.",
    category: "Autonomous Control Planes & Governance",
    categoryLabel: "Control Plane Systems",
    categoryFilter: "SYSTEMS",
    status: "Live · WCC Launchpad 30",
    statusType: "hackathon",
    technologies: ["TypeScript", "React", "Control Plane", "Policy Engine", "Audit Chain", "CSS", "Vercel"],
    techStack: ["TypeScript", "React", "Policy Engine", "Sandbox Simulation", "Audit Chain"],
    tags: ["WCC Launchpad 30", "Team ALGNITE", "Control Plane", "Governance", "Tamper-Evident Audit"],
    repository: "AXIOM",
    githubRepoName: "AXIOM",
    githubUrl: "https://github.com/codesbysayam/AXIOM",
    liveUrl: "https://axiomwcc.vercel.app",
    demoUrl: "https://axiomwcc.vercel.app",
    featured: false,
    highlights: [
      "Deterministic pre-flight policy rules blocking out-of-bounds agent actions",
      "Interactive dry-run simulation sandbox and failure recovery state transitions",
      "Tamper-evident audit structures delivered in 36h at WCC Launchpad 30",
    ],
    metrics: {
      developmentTime: "36 Hours (WCC Launchpad 30)",
      codeComplexityScore: "Policy + Audit State Machine",
      linesOfCode: "856 KB Repo Source",
    },
  },
  {
    id: "inkloom",
    name: "INKLOOM",
    title: "INKLOOM",
    subtitle: "Constructed AI Logo Design & Composition System",
    shortDescription:
      "Forked workspace for specialized AI logo design models—turning brand constraints into constructed typography/symbol marks with composition lockups and clear-space rules.",
    description:
      "Public fork (isFork: true, default branch: master) exploring constructed brand identity workflows: brand-constraint analysis, typography and symbol construction stages, and deterministic composition lockups & clear-space rules. Live in early access at inkloom.art while specialized logo models remain under active construction.",
    whyItExists:
      "Brand identity systems require crisp geometry, proportions, and multi-lockup rules rather than uneditable raster pixels.",
    whatIBuilt:
      "Maintained the forked TypeScript/CSS/PLpgSQL/Docker workspace (master branch) supporting structured composition and early-access web delivery.",
    category: "Generative Design Systems",
    categoryLabel: "Design AI (Fork)",
    categoryFilter: "AI / ML",
    status: "Early Access · Fork (master)",
    statusType: "opensource",
    technologies: ["TypeScript", "React", "PLpgSQL", "Docker", "CSS", "Design Systems"],
    techStack: ["TypeScript", "React", "PLpgSQL", "Docker", "Composition Engine"],
    tags: ["Forked Repo", "master Branch", "Constructed Logos", "Early Access"],
    repository: "inkloom",
    githubRepoName: "inkloom",
    githubUrl: "https://github.com/codesbysayam/inkloom",
    liveUrl: "https://inkloom.art",
    demoUrl: "https://inkloom.art",
    featured: false,
    highlights: [
      "Structured brand-constraint analysis separated from geometric composition rules",
      "Lockup and clear-space rule engine backed by PLpgSQL & Docker workspace",
      "Disclosed public fork (master branch); specialized logo models under R&D",
    ],
    metrics: {
      developmentTime: "Early Access Build",
      codeComplexityScore: "Multi-Stage Composition",
      linesOfCode: "2.02 MB Fork Source",
    },
  },
  {
    id: "campus-connect",
    name: "CAMPUS CONNECT",
    title: "CAMPUS CONNECT",
    subtitle: "College Event Discovery, Registration & Organizer Dashboard",
    shortDescription:
      "Next.js & TypeScript campus event management platform pairing student discovery and registration with an organizer dashboard and Vitest suite.",
    description:
      "Next.js and TypeScript campus event platform uniting student event discovery, search/filtering, and seat registration with an organizer console and automated Vitest suite (uses README-disclosed seeded in-memory storage that resets on restart).",
    whyItExists:
      "Campus clubs need one central hub for verified event listings and live capacity tracking instead of scattered spreadsheets.",
    whatIBuilt:
      "Built the student browsing/registration UI, organizer CRUD console, seat capacity validation, and Vitest test coverage.",
    category: "Full-Stack Web Applications",
    categoryLabel: "Full-Stack Platform",
    categoryFilter: "FULL-STACK",
    status: "Live · Demo Deployed",
    statusType: "live",
    technologies: ["Next.js", "TypeScript", "React", "Vitest", "Tailwind CSS", "Vercel"],
    techStack: ["Next.js", "TypeScript", "React", "Vitest", "Tailwind CSS"],
    tags: ["Campus Platform", "Event Management", "Next.js", "Vitest", "In-Memory Store"],
    repository: "CAMPUSCONNECT_1273",
    githubRepoName: "CAMPUSCONNECT_1273",
    githubUrl: "https://github.com/codesbysayam/CAMPUSCONNECT_1273",
    liveUrl: "https://campusconnect1273.vercel.app/",
    demoUrl: "https://campusconnect1273.vercel.app/",
    featured: false,
    highlights: [
      "Student event discovery with live search, filtering & seat registration",
      "Organizer dashboard for creating, editing, and tracking event capacity",
      "Vitest coverage + explicit README disclosure of seeded in-memory storage",
    ],
    metrics: {
      developmentTime: "Campus System Build",
      codeComplexityScore: "Next.js + Vitest",
      linesOfCode: "221 KB Repo Source",
    },
  },
  {
    id: "sayam-solves",
    name: "SAYAMSOLVES",
    title: "SAYAMSOLVES",
    subtitle: "C++ DSA Solutions & LeetHub V2 Synced Repository",
    shortDescription:
      "Open-source C++ algorithmic archive synced via LeetHub V2, tracking 3 repository problem solutions (LC 0005, 0033, 0115) alongside a 4-problem LeetCode baseline.",
    description:
      "C++ Data Structures & Algorithms repository synced automatically via LeetHub V2. Verified stats.json records 3 committed solution files (0005 Longest Palindromic Substring, 0033 Search in Rotated Sorted Array, and 0115 Distinct Subsequences) alongside a 4-problem LeetCode profile baseline.",
    whyItExists:
      "Algorithmic practice benefits from transparent, version-controlled C++ implementations with honest progress counts.",
    whatIBuilt:
      "Maintained LeetHub V2 automated synchronization under lowercase codesbysayam/sayam-solves with documented time and space complexity invariants.",
    category: "Competitive Programming & DSA",
    categoryLabel: "C++ & Algorithms",
    categoryFilter: "DSA",
    status: "Active · 3 Repo / 4 LC",
    statusType: "active",
    technologies: ["C++", "DSA", "Algorithms", "Dynamic Programming", "Binary Search", "LeetHub V2"],
    techStack: ["C++", "DSA", "Dynamic Programming", "Binary Search", "LeetHub V2"],
    tags: ["C++20", "LeetHub V2", "LC 0005", "LC 0033", "LC 0115"],
    repository: "sayam-solves",
    githubRepoName: "sayam-solves",
    githubUrl: "https://github.com/codesbysayam/sayam-solves",
    featured: false,
    highlights: [
      "Automated LeetHub V2 sync preserving verified accepted C++ submissions",
      "Covers LC 0005 (center expansion), LC 0033 (rotated binary search) & LC 0115 (2D DP)",
      "Transparent stats.json count (3 repo files) & 4-problem LeetCode baseline",
    ],
    metrics: {
      developmentTime: "Continuous Practice",
      codeComplexityScore: "O(log n) to O(|s|·|t|) DP",
      linesOfCode: "3 Repo Files · 4 LC Solved",
    },
  },
] as const;

export interface CertificateContent {
  id: string;
  title: string;
  issuer: string;
  category: "CERTIFICATIONS" | "ACHIEVEMENTS" | "COMPETITIONS" | "ACADEMIC RECORD" | "COURSES" | "WORKSHOPS" | "OTHER";
  issueDate: string;
  description: string;
  fullDescription?: string;
  overview?: string;
  credentialUrl?: string;
  credentialId?: string;
  imageUrl?: string;
  pdfUrl?: string;
  verificationStatus: "VERIFIED" | "LINK AVAILABLE" | "NO VERIFICATION LINK";
  verified?: boolean;
  featured: boolean;
  skills: readonly string[];
  tags?: readonly string[];
  event?: string;
  platform?: string;
  year?: number;
  track?: string;
  project?: string;
  team?: string;
  date?: string;
  venue?: string;
  format?: string;
  role?: string;
  participant?: string;
  recipient?: string;
  contribution?: string;
  imageAlt?: string;
  organizer?: string;
  coOrganizer?: string;
  associatedOrganizer?: string;
  credentialType?: string;
  teamMembers?: readonly string[];
  signatories?: readonly (string | { readonly name: string; readonly designation?: string })[];
  associatedProjects?: readonly {
    readonly name: string;
    readonly url: string;
    readonly description?: string;
  }[];
}

export const CERTIFICATES: readonly CertificateContent[] = [
  {
    id: "dataforge-2026-memory-in-motion",
    title: "DATAFORGE 2026",
    issuer: "IIT Kharagpur / Unstop",
    category: "COMPETITIONS",
    credentialType: "Research Exhibit",
    issueDate: "2026",
    year: 2026,
    event: "DATAFORGE 2026",
    platform: "Unstop",
    format: "Explain the Frontier",
    track: "Explain the Frontier",
    project: "Memory in Motion",
    venue: "IIT Kharagpur",
    organizer: "IIT Kharagpur",
    participant: "Sayam Mukherjee",
    team: "ALGNITE",
    role: "Team Leader",
    teamMembers: ["Sayam Mukherjee (Team Leader)", "Shinibali Kumar"],
    associatedProjects: [
      {
        name: "Memory in Motion",
        url: "https://memoryinmotion.vercel.app",
        description:
          "An interactive exploration of in-context learning with recurrent memory, demonstrating how fixed-size state can retain task-relevant information while compression introduces interference and forgetting.",
      },
    ],
    description:
      "An interactive exploration of in-context learning with recurrent memory, demonstrating how fixed-size state can retain task-relevant information while compression introduces interference and forgetting.",
    fullDescription:
      "Memory in Motion is an interactive research-exhibit project exploring in-context learning through recurrent memory. It demonstrates how a fixed-size recurrent state can carry task-relevant information forward without growing a token-by-token memory, while also exposing the trade-off: compressing information into a bounded state can introduce interference and forgetting.",
    credentialUrl: "https://intact-black-0mk1uydx.edgeone.dev/",
    verificationStatus: "LINK AVAILABLE",
    featured: true,
    skills: ["In-Context Learning", "Recurrent Memory", "Explain the Frontier", "AI Research", "Machine Learning"],
    tags: ["In-Context Learning", "Recurrent Memory", "Explain the Frontier", "AI Research", "Machine Learning"],
  },
  {
    id: "gdg-kiit-operon-2026",
    title: "Deploy or Die - HowToAlgo × GDG on Campus KIIT",
    issuer: "GDG on Campus KIIT / HowToAlgo",
    category: "COMPETITIONS",
    credentialType: "Hackathon",
    event: "Deploy or Die - HowToAlgo × GDG on Campus KIIT",
    format: "Agent-Driven Lifecycle Hackathon",
    organizer: "GDG on Campus KIIT",
    coOrganizer: "HowToAlgo",
    issueDate: "2026",
    date: "8-9 August 2026",
    venue: "KIIT Deemed to be University",
    year: 2026,
    track: "Track A - Business Process Automation",
    project: "OPERON - Autonomous Operations, Human-Controlled",
    participant: "Sayam Mukherjee",
    team: "NEXUS",
    role: "Team Member",
    teamMembers: [
      "Sayam Mukherjee",
      "Sounak Chowdhury (Team Leader)",
      "Aarush Roy",
      "Jaydeep Dutta",
    ],
    associatedProjects: [
      {
        name: "OPERON",
        url: "https://operonpro.vercel.app",
        description:
          "Autonomous operations platform built for intelligent, human-controlled workflows across Support, Finance, HR, and Operations, combining multi-agent AI with human-in-the-loop governance.",
      },
    ],
    description:
      "OPERON is an agent-driven operations platform designed to automate business workflows while keeping critical decisions traceable, auditable, policy-controlled, and subject to human approval.",
    fullDescription:
      "OPERON (Autonomous Operations, Human-Controlled) was developed for Deploy or Die, an Agent-Driven Lifecycle Hackathon organized through HowToAlgo × GDG on Campus KIIT. Built under Track A (Business Process Automation), the project explores how multi-agent systems can automate operational workflows while maintaining risk-based reasoning, human approval, validation, recovery, and auditability.",
    credentialUrl: "https://impressive-indigo-lkxz4q1q.edgeone.dev/",
    verificationStatus: "LINK AVAILABLE",
    featured: true,
    skills: [
      "Agent-Driven Lifecycle",
      "Business Process Automation",
      "OPERON",
      "Human-Controlled Operations",
      "Multi-Agent Systems",
      "Human-in-the-Loop",
    ],
    tags: [
      "Agent-Driven Lifecycle",
      "Business Process Automation",
      "OPERON",
      "Human-Controlled Operations",
      "Multi-Agent Systems",
      "Human-in-the-Loop",
    ],
  },
  {
    id: "ignithon-2-0-participation-2026",
    title: "IGNITHON 2.0",
    issuer: "K-1000 / KIIT & KSAC",
    category: "COMPETITIONS",
    credentialType: "Certificate of Participation",
    issueDate: "2026",
    year: 2026,
    date: "26th September 2026",
    venue: "KIIT Deemed to be University",
    format: "12-Hour Offline Hackathon",
    role: "Team Leader",
    participant: "Sayam Mukherjee",
    organizer: "K-1000",
    event: "IGNITHON 2.0",
    team: "ALGNITE",
    teamMembers: ["Sayam Mukherjee (Team Leader)", "Shinibali Kumar"],
    signatories: [
      "Dr. Ajit Kumar Pasayat, Assoc. Dean - KSAC",
      "Dr. Ayesha Dash, Faculty In-Charge (K-1000)"
    ],
    associatedProjects: [
      {
        name: "AlertSetu",
        url: "https://alertsetu1273.vercel.app",
        description: "Emergency alert and notification platform built by Team ALGNITE"
      },
      {
        name: "CampusConnect",
        url: "https://campusconnect1273.vercel.app",
        description: "Campus networking and student community hub built by Team ALGNITE"
      }
    ],
    description:
      "12-Hour Offline Hackathon at KIIT Deemed to be University organized by K-1000 with KIIT and KSAC, recognizing participation involving dedication, creativity, teamwork, technical excellence, innovation, and problem-solving.",
    fullDescription:
      "Certificate of Participation awarded to Sayam Mukherjee for actively participating in IGNITHON 2.0, a 12-Hour Offline Hackathon organized by K-1000 in association with KIIT and KSAC at KIIT Deemed to be University on 26th September 2026. Recognizes participation demonstrating dedication, creativity, teamwork, technical excellence, innovation, and problem-solving with Team ALGNITE.",
    credentialUrl: "https://marked-aquamarine-cozz1tva.edgeone.dev/",
    verificationStatus: "LINK AVAILABLE",
    featured: true,
    skills: ["12-Hour Hackathon", "Team Leadership", "Rapid Prototyping", "Problem Solving", "Technical Excellence"],
    tags: ["12-Hour Hackathon", "Offline Hackathon", "Team ALGNITE", "KIIT & KSAC"],
  },
  {
    id: "wcc-launchpad-30-participation-2026",
    title: "WCC Launchpad 30",
    issuer: "We Code Coders / inkloom",
    event: "WCC Launchpad 30",
    format: "36-Hour Hackathon",
    role: "Team Leader",
    participant: "Sayam Mukherjee",
    recipient: "Sayam Mukherjee",
    organizer: "We Code Coders",
    coOrganizer: "inkloom",
    credentialType: "Certificate of Participation",
    category: "COMPETITIONS",
    issueDate: "2026",
    date: "4–5 October 2026",
    year: 2026,
    team: "ALGNITE",
    teamMembers: [
      "Sayam Mukherjee (Team Leader)",
      "Shinibali Kumar (Team Member)"
    ],
    track: "Frontend, Backend and AI / ML",
    associatedProjects: [
      {
        name: "AXIOM",
        url: "https://axiomwcc.vercel.app",
        description: "Led the development of AXIOM as the team lead and built the primary React and TypeScript control plane interface, including the Command Center."
      }
    ],
    description:
      "Led the development of AXIOM as the team lead and built the primary architecture during WCC Launchpad 30, a 36-hour hackathon organized by We Code Coders with title sponsor inkloom across Frontend, Backend, and AI / ML categories.",
    fullDescription:
      "Certificate of Participation awarded to Sayam Mukherjee for actively participating in WCC Launchpad 30, a 36-Hour Hackathon organized by We Code Coders with title sponsor inkloom on 4–5 October 2026. Recognizes participation as Team Leader of Team ALGNITE across Frontend, Backend, and AI / ML tracks. Led the development of AXIOM as the team lead and built the primary architecture.",
    skills: [
      "36-Hour Hackathon",
      "Team Leadership",
      "Agentic AI",
      "Frontend",
      "Backend",
      "AI / ML",
      "System Architecture"
    ],
    tags: [
      "36-Hour Hackathon",
      "We Code Coders",
      "inkloom",
      "Team ALGNITE",
      "Sayam Mukherjee",
      "Team Leader",
      "AXIOM",
      "Frontend",
      "Backend",
      "AI / ML"
    ],
    credentialId: "L30-PTQXNX",
    credentialUrl: "https://wecodecoders.in/verify/L30-PTQXNX",
    pdfUrl: "https://heavy-sapphire-gc08crqu.edgeone.dev/",
    imageAlt: "WCC Launchpad 30 certificate issued to Sayam Mukherjee, Team Leader of team ALGNITE, certificate ID L30-PTQXNX.",
    verificationStatus: "LINK AVAILABLE",
    featured: true,
  },
  {
    id: "wcc-launchpad-30-shinibali-kumar",
    title: "WCC Launchpad 30",
    issuer: "We Code Coders / inkloom",
    event: "WCC Launchpad 30",
    format: "36-Hour Hackathon",
    role: "Team Member",
    participant: "Shinibali Kumar",
    recipient: "Shinibali Kumar",
    organizer: "We Code Coders",
    coOrganizer: "inkloom",
    credentialType: "Certificate of Participation",
    category: "COMPETITIONS",
    issueDate: "2026",
    date: "4–5 October 2026",
    year: 2026,
    team: "ALGNITE",
    teamMembers: [
      "Shinibali Kumar (Team Member)",
      "Sayam Mukherjee (Team Leader)"
    ],
    track: "Product / Research and Presentation / Demo",
    associatedProjects: [
      {
        name: "AXIOM",
        url: "https://axiomwcc.vercel.app",
        description: "Agentic AI platform built by Team ALGNITE during the 36-hour hackathon, contributing to workflow, agent execution logic, and policy validation."
      }
    ],
    description:
      "Contributed to the technical development and validation of AXIOM by working on the work flow and agent execution logic, supporting policy and evaluation design, validity system behaviour across different execution scenarios and helping structure the project requirements and research. Contributed to testing the multi agent work flow, identifying execution and UI issues, validating human approval and policy control flows and preparing the project for demonstration and evaluation.",
    fullDescription:
      "Certificate of Participation awarded to Shinibali Kumar for actively participating in WCC Launchpad 30, a 36-Hour National Online Hackathon organized by We Code Coders with title sponsor inkloom on 4–5 October 2026. Recognised as a participant in team ALGNITE as a team member on Product / Research and Presentation / Demo tracks. Contributed to the technical development and validation of AXIOM by working on the work flow and agent execution logic, supporting policy and evaluation design, validating system behaviour across different execution scenarios, testing multi-agent workflows, and preparing the project for demonstration and evaluation.",
    contribution:
      "Contributed to the technical development and validation of AXIOM by working on the work flow and agent execution logic, supporting policy and evaluation design, validity system behaviour across different execution scenarios and helping structure the project requirements and research. Contributed to testing the multi agent work flow, identifying execution and UI issues, validating human approval and policy control flows and preparing the project for demonstration and evaluation.",
    skills: [
      "36-Hour Hackathon",
      "Product / Research",
      "Presentation / Demo",
      "Agent Execution Logic",
      "Workflow Validation",
      "Multi-Agent AI",
      "Policy Control"
    ],
    tags: [
      "36-Hour Hackathon",
      "We Code Coders",
      "inkloom",
      "Team ALGNITE",
      "Shinibali Kumar",
      "Team Member",
      "AXIOM",
      "Product / Research",
      "Presentation / Demo"
    ],
    credentialId: "L30-F3RFRC",
    credentialUrl: "https://wecodecoders.in/verify/L30-F3RFRC",
    imageAlt: "WCC Launchpad 30 certificate issued to Shinibali Kumar, team ALGNITE, certificate ID L30-F3RFRC.",
    verificationStatus: "LINK AVAILABLE",
    featured: true,
  },
  {
    id: "matlab-workshop-ieee-kiit-2026",
    title: "MATLAB Workshop",
    issuer: "IEEE KIIT Student Branch / IEEE PES KIIT Student Branch Chapter",
    category: "WORKSHOPS",
    credentialType: "Participation",
    event: "MATLAB Workshop",
    issueDate: "2026",
    date: "25 September 2026",
    year: 2026,
    venue: "KIIT Deemed to be University",
    organizer: "IEEE KIIT Student Branch",
    coOrganizer: "IEEE PES KIIT Student Branch Chapter",
    participant: "Sayam Mukherjee",
    overview:
      "Sayam Mukherjee participated in and successfully completed the MATLAB Workshop organized by the IEEE KIIT Student Branch in association with the IEEE PES KIIT Student Branch Chapter on 25 September 2026 at KIIT Deemed to be University.",
    description:
      "Sayam Mukherjee participated in and successfully completed the MATLAB Workshop organized by the IEEE KIIT Student Branch in association with the IEEE PES KIIT Student Branch Chapter on 25 September 2026 at KIIT Deemed to be University.",
    fullDescription:
      "Sayam Mukherjee participated in and successfully completed the MATLAB Workshop organized by the IEEE KIIT Student Branch in association with the IEEE PES KIIT Student Branch Chapter on 25 September 2026 at KIIT Deemed to be University.",
    credentialUrl: "https://increased-purple-oeuuxfwu.edgeone.dev/",
    verificationStatus: "VERIFIED",
    verified: true,
    featured: true,
    skills: ["MATLAB", "Engineering Simulation", "Numerical Computing"],
    tags: ["MATLAB", "IEEE KIIT", "IEEE PES"],
    signatories: [
      {
        name: "Dr. Satya Ranjan Jena",
        designation: "Resource Person"
      },
      {
        name: "Dr. Chinmoy Ku. Panigrahi",
        designation: "Counselor, IEEE KIIT Student Branch"
      }
    ],
  },
  {
    id: "kiit-grade-report-2025-26",
    title: "First-Year Grade Report",
    issuer: "Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar",
    category: "ACADEMIC RECORD",
    issueDate: "2025",
    year: 2025,
    description:
      "First-year academic grade report covering core engineering, science, mathematics, laboratory, programming, communication, and interdisciplinary coursework.",
    fullDescription:
      "First-year academic grade report covering core engineering, science, mathematics, laboratory, programming, communication, and interdisciplinary coursework at KIIT.",
    credentialUrl: "https://diverse-plum-xc5wzkru.edgeone.dev/",
    verificationStatus: "LINK AVAILABLE",
    featured: false,
    skills: ["Engineering Sciences", "Mathematics", "Programming", "Laboratory Work"],
    tags: ["20 Subjects", "2025–26"],
  },
  {
    id: "comp-toycathon-2021",
    title: "National Finalist | Toycathon",
    issuer: "Ministry of Education & AICTE, Govt. of India",
    category: "COMPETITIONS",
    issueDate: "2021",
    credentialId: "TC-2021-FIN",
    description:
      "Reached the National Grand Finale among thousands of competing collegiate teams in the national Toycathon innovation challenge.",
    verificationStatus: "VERIFIED",
    featured: true,
    skills: ["Rapid Prototyping", "Hardware/Software Integration", "Problem Solving"],
  },
  {
    id: "comp-technex-iit-bhu",
    title: "Multi-Event Finalist | Technex'26",
    issuer: "IIT (BHU) Varanasi",
    category: "COMPETITIONS",
    issueDate: "2026",
    credentialId: "TX-2026-IITBHU",
    description:
      "Qualified for the final rounds across 5 out of 6 technical challenges in Technex, the annual technical festival of IIT (BHU).",
    verificationStatus: "VERIFIED",
    featured: true,
    skills: ["Algorithmic Logic", "Data Analysis", "System Design"],
  },
  {
    id: "ach-table-tennis-championship",
    title: "Inter-School Table Tennis Champion (3x 1st Position)",
    issuer: "Inter-School Sports Championship",
    category: "ACHIEVEMENTS",
    issueDate: "2023",
    description:
      "Secured 1st place in three consecutive inter-school table tennis tournaments, demonstrating tactical focus and competitive discipline.",
    verificationStatus: "VERIFIED",
    featured: false,
    skills: ["Strategic Play", "Hand-Eye Coordination", "Competitive Focus"],
  },
] as const;

export const SKILLS_CONTENT = {
  title: "Skills & Technical Stack",
  subtitle:
    "Languages, frameworks, and developer tools I work with daily across coursework and projects.",
  categories: [
    {
      category: "Languages & Core",
      skills: ["TypeScript", "Python", "C++", "JavaScript", "C", "SQL / PLpgSQL"],
    },
    {
      category: "Frameworks & Backend",
      skills: ["React", "Next.js 15", "FastAPI", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
    },
    {
      category: "Tools & DevOps",
      skills: ["Git", "GitHub", "Docker", "Vitest", "Vercel", "VS Code"],
    },
    {
      category: "AI, Vision & Systems",
      skills: ["YOLOv8", "ByteTrack", "PyTorch", "KaTeX / D3.js", "Multi-Agent HITL", "Control Planes"],
    },
  ],
} as const;

export const ECOSYSTEM_CONTENT = {
  title: "Engineering Ecosystem & System Blueprints",
  subtitle: "Architectural blueprints, state machine designs, and system integration patterns.",
  description:
    "Software is rarely built in isolation; it works best as an interconnected ecosystem of state machines, data contracts, and human checkpoints.",
} as const;

import { JOURNAL_ENTRIES, JournalEntry } from "./journal";
export { JOURNAL_ENTRIES };
export type { JournalEntry };

export const CONTACT_CONTENT = {
  title: "Get in Touch",
  subtitle: "Let's connect and discuss software, AI, or opportunities.",
  description:
    "Have a project, collaboration, or opportunity in mind? You can reach me by email, phone, or LinkedIn.",
  emailPrompt: "Prefer direct email? Drop me a line anytime:",
  email: CONTACT_INFO.email,
  phone: CONTACT_INFO.phone,
  location: CONTACT_INFO.location,
} as const;

export const FOOTER_CONTENT = {
  name: "Sayam Mukherjee",
  title: "AI & ML CSE Undergraduate · Developer Portfolio",
  copyright: "© 2026 Sayam Mukherjee. All rights reserved.",
  bio: "Sayam Mukherjee is an undergraduate Computer Science Engineering student at KIIT University exploring machine learning, full-stack development, and autonomous systems.",
} as const;

/**
 * Backward-compatible object export preserving legacy component bindings.
 */
export const siteContent = {
  hero: HERO_CONTENT,
  about: ABOUT_CONTENT,
  projects: {
    title: "Selected Projects",
    subtitle:
      "Software systems, algorithmic archives, and applied machine learning models I have built.",
  },
  skills: SKILLS_CONTENT,
  ecosystem: ECOSYSTEM_CONTENT,
  certificates: {
    title: "Credentials & Milestones",
    subtitle:
      "Verified competition certificates, academic grade records, and hackathon milestones.",
  },
  journal: JOURNAL_ENTRIES,
  contact: CONTACT_CONTENT,
  footer: FOOTER_CONTENT,
};

export default siteContent;
