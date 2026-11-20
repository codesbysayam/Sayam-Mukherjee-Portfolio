import React from "react";
import { RESUME_URL } from "../config/resume";
import {
  GraduationCap,
  FolderGit2,
  Cpu,
  GitBranch,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

export type FAQCategoryId =
  | "all"
  | "academics"
  | "projects"
  | "skills"
  | "architecture"
  | "career"
  | "contact";

export interface FAQCategory {
  id: FAQCategoryId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  { id: "all", label: "All Questions", shortLabel: "All", icon: CheckCircle2 },
  { id: "academics", label: "Academic Background", shortLabel: "Academics", icon: GraduationCap },
  { id: "projects", label: "Projects & Engineering", shortLabel: "Projects", icon: FolderGit2 },
  { id: "skills", label: "Technical Skills", shortLabel: "Skills", icon: Cpu },
  { id: "architecture", label: "GitHub & Architecture", shortLabel: "Architecture", icon: GitBranch },
  { id: "career", label: "Career & Collaboration", shortLabel: "Career", icon: Briefcase },
  { id: "contact", label: "Contact & Verification", shortLabel: "Contact", icon: CheckCircle2 },
];

export interface FAQItem {
  id: string;
  categoryId: Exclude<FAQCategoryId, "all">;
  categoryLabel: string;
  question: string;
  answer: React.ReactNode;
  plainTextAnswer: string;
  keywords: string[];
}

export const FAQ_ITEMS: FAQItem[] = [
  // A. Academic Background
  {
    id: "faq-degree-university",
    categoryId: "academics",
    categoryLabel: "Academic Background",
    question: "What is Sayam's current degree, university, and academic focus?",
    plainTextAnswer:
      "Sayam Mukherjee is pursuing a Bachelor of Technology (B.Tech) in Computer Science & Engineering with specialization in Artificial Intelligence and Machine Learning at Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar (expected graduation: 2029). He maintained an overall first-year CGPA of 9.06 / 10.0.",
    keywords: ["degree", "university", "KIIT", "B.Tech", "computer science", "AI/ML", "CGPA", "GPA", "education", "graduation"],
    answer: (
      <div className="space-y-2.5 text-[var(--text-secondary)]">
        <p>
          Sayam Mukherjee is pursuing a Bachelor of Technology (<strong>B.Tech</strong>) in{" "}
          <strong>Computer Science &amp; Engineering</strong> with a specialization in{" "}
          <strong>Artificial Intelligence and Machine Learning (AI &amp; ML)</strong> at{" "}
          <strong>Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar</strong> (expected graduation:{" "}
          <strong>2029</strong>).
        </p>
        <p>
          He maintained an overall first-year CGPA of <strong className="tabular-nums">9.06 / 10.0</strong>, with fundamental coursework in{" "}
          <em>Data Structures &amp; Algorithms</em>, <em>Object-Oriented Programming in C++</em>,{" "}
          <em>Computer Organization</em>, and <em>Discrete Mathematics</em>. Prior to university, he completed his CBSE Class 12 (Science) with{" "}
          <strong className="tabular-nums">86.2%</strong> and Class 10 with <strong className="tabular-nums">92.6%</strong> at Aditya Birla Vani Bharati.
        </p>
      </div>
    ),
  },
  {
    id: "faq-academic-achievements",
    categoryId: "academics",
    categoryLabel: "Academic Background",
    question: "What academic achievements and milestones are available to review?",
    plainTextAnswer:
      "First-year 9.06 CGPA in B.Tech CSE (AI & ML), qualification in the Smart India Hackathon (SIH 2026) for Project MAUSAM with Team Algnite, and an active algorithmic problem-solving repository on LeetCode (SayamSolves) documenting daily data structure solutions in C++.",
    keywords: ["achievements", "milestones", "CGPA", "honors", "hackathon", "SIH 2026", "academics", "LeetCode"],
    answer: (
      <div className="space-y-2.5 text-[var(--text-secondary)]">
        <p>Key documented milestones and academic honors include:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>
            <strong>First-Year Academic Distinction:</strong> Maintained a <strong className="tabular-nums">9.06 / 10.0 CGPA</strong> across foundational computing, mathematics, and engineering coursework.
          </li>
          <li>
            <strong>Smart India Hackathon (SIH 2026):</strong> Qualified team member with <em>Team Algnite</em>, engineering the frontend architecture and real-time telemetry visualizer for <strong>Project MAUSAM</strong>.
          </li>
          <li>
            <strong>Daily Algorithmic Rigor:</strong> Maintained the public <strong>SayamSolves</strong> repository documenting daily C++ implementations of LeetCode problems spanning arrays, two-pointers, binary search, trees, and dynamic programming.
          </li>
        </ul>
      </div>
    ),
  },

  // B. Projects and Engineering
  {
    id: "faq-primary-projects",
    categoryId: "projects",
    categoryLabel: "Projects & Engineering",
    question: "What are the primary software projects featured in the portfolio?",
    plainTextAnswer:
      "The portfolio features eight verified GitHub projects across @codesbysayam (11 public repos total including meta/snapshot repos): OPERON (multi-agent HITL workflow engine), MAUSAM (SIH 2026 platform in codesbysayam/mausam_sih-26 alongside baseline snapshot mausam_sample), SightForge (dual-service Next.js 15 + FastAPI YOLOv8/ByteTrack pipeline, local/self-hosted), Memory in Motion (IIT KGP DataForge O(1) vs O(T) lab), AXIOM (WCC Launchpad 30 control plane), Inkloom (public fork on master branch, early access at inkloom.art while logo models are under R&D), CampusConnect (Next.js event platform with Vitest and seeded in-memory storage), and SayamSolves (C++ LeetHub V2 archive with 3 repo files in stats.json and 4 LC baseline).",
    keywords: [
      "projects",
      "OPERON",
      "MAUSAM",
      "SightForge",
      "Memory in Motion",
      "AXIOM",
      "Inkloom",
      "CampusConnect",
      "SayamSolves",
      "repositories",
    ],
    answer: (
      <div className="space-y-2.5 text-[var(--text-secondary)]">
        <p>The showcase highlights eight verified engineering and algorithmic repositories backed by public source on <code>github.com/codesbysayam</code>:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
            <div className="font-semibold text-[var(--text)] font-mono text-xs tracking-wide">
              01 · OPERON &amp; AXIOM
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Multi-agent HITL operations platform (Deploy or Die, Team NEXUS) and 36h WCC Launchpad 30 autonomous control plane with policy, sandbox, recovery &amp; audit chains.
            </p>
          </div>
          <div className="p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
            <div className="font-semibold text-[var(--text)] font-mono text-xs tracking-wide">
              02 · MAUSAM &amp; CampusConnect
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              SIH 2026 Doppler/NAQI/INCOIS/SACHET suite in <code>mausam_sih-26</code> (and snapshot <code>mausam_sample</code>) and Next.js + Vitest campus hub (seeded in-memory storage).
            </p>
          </div>
          <div className="p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
            <div className="font-semibold text-[var(--text)] font-mono text-xs tracking-wide">
              03 · SightForge &amp; Memory in Motion
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Local dual-service Next.js 15 + FastAPI YOLOv8 COCO-0/17-keypoint pose/ByteTrack pipeline and IIT KGP DataForge 2026 interactive O(1) vs O(T) lab.
            </p>
          </div>
          <div className="p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
            <div className="font-semibold text-[var(--text)] font-mono text-xs tracking-wide">
              04 · Inkloom (Fork) &amp; SayamSolves
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Forked identity workspace (<code>master</code>, early access on inkloom.art; models under construction) &amp; C++ LeetHub V2 repo (3 files / 4 LC baseline).
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "faq-technical-challenges",
    categoryId: "projects",
    categoryLabel: "Projects & Engineering",
    question: "What technical challenges have these projects addressed?",
    plainTextAnswer:
      "Key engineering trade-offs solved include atomic CVFrame canvas replacement and COCO Class ID 0 / IoU 0.45 NMS synchronization between Next.js 15 and FastAPI + ByteTrack in SightForge; separating agent planning from side-effect execution via deterministic HITL approval and hash-linked audit gates in OPERON and AXIOM; and pre-rendering 11-repo GitHub telemetry into public/data/github.json to avoid visitor rate limits.",
    keywords: ["challenges", "architecture", "tradeoffs", "SightForge", "ByteTrack", "rate limits", "OPERON", "AXIOM"],
    answer: (
      <div className="space-y-2.5 text-[var(--text-secondary)]">
        <p>Across the 8 featured platforms, several non-trivial engineering trade-offs were resolved:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>
            <strong>Autonomous Safety &amp; Control Planes (OPERON &amp; AXIOM):</strong> Isolating agent intent proposal from external mutations behind Human-in-the-Loop approval gates, simulation sandboxes, failure recovery, and tamper-evident audit trails.
          </li>
          <li>
            <strong>Synchronized Computer Vision Overlays (SightForge):</strong> Eliminating bounding-box canvas ghosting via atomic <code>CVFrame</code> state replacement over a 16:9 HTML5 Canvas backed by FastAPI YOLOv8 (COCO-0, 17 keypoints, IoU 0.45 NMS), ByteTrack, and PostgreSQL.
          </li>
          <li>
            <strong>Zero-Rate-Limit Multi-Repo Telemetry (Portfolio):</strong> Serving a static 11-repo GitHub snapshot from <code>public/data/github.json</code> alongside server-side caching proxies so visitor browsers never hit API ceilings.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "faq-structure-testing-deployment",
    categoryId: "projects",
    categoryLabel: "Projects & Engineering",
    question: "How are the applications structured, tested, and deployed?",
    plainTextAnswer:
      "Applications use modular TypeScript (React 19, Next.js 15, Vite) and Python (FastAPI) codebases, validated with TypeScript strict checking (tsc --noEmit), Vitest suites (CampusConnect), Makefile workflows (SightForge), and Vite/Next production builds deployed across Vercel and local dual-service runtimes.",
    keywords: ["structure", "testing", "deployment", "Vitest", "TypeScript", "build", "Vite", "Vercel"],
    answer: (
      <div className="space-y-2.5 text-[var(--text-secondary)]">
        <p>
          Codebases adhere to strict separation of concerns: modular UI components in React 19 / Next.js 15, strongly typed domain schemas in TypeScript, and clean Python FastAPI backends where ML inference applies.
        </p>
        <p>
          <strong>Testing &amp; Validation:</strong> Builds are checked with TypeScript (<code>tsc --noEmit</code>), automated unit/integration tests with <strong>Vitest</strong> (e.g., CampusConnect), and production Vite / Next.js bundling, plus <code>esbuild</code> compilation for this portfolio&apos;s Express API server.
        </p>
        <p>
          <strong>Deployment &amp; Hosting:</strong> Six live web apps run on Vercel / edge hosting (OPERON, MAUSAM, Memory in Motion, AXIOM, Inkloom early access, CampusConnect), while dual-service SightForge runs locally/self-hosted via Makefile and SayamSolves syncs on GitHub via LeetHub V2.
        </p>
      </div>
    ),
  },

  // C. Technical Skills
  {
    id: "faq-engineering-stack",
    categoryId: "skills",
    categoryLabel: "Technical Skills",
    question: "What engineering stack and programming languages does Sayam use?",
    plainTextAnswer:
      "Languages: TypeScript (~93.6% / 10.67 MB verified multi-repo bytes), Python, C++, JavaScript, C, Java, SQL/PLpgSQL. Frontend: React 19, Next.js 15, Vite, Tailwind CSS, KaTeX, D3.js, HTML5 Canvas, Motion. Backend & Data: FastAPI, Node.js, Express, PostgreSQL. AI/ML & Vision: YOLOv8, ByteTrack, PyTorch, Multi-Agent HITL. Tooling: Git, GitHub, Vitest, Docker, Vercel.",
    keywords: ["languages", "stack", "Python", "C++", "TypeScript", "React", "Next.js", "FastAPI", "YOLOv8", "ByteTrack", "PostgreSQL", "Vitest", "Docker"],
    answer: (
      <div className="space-y-2.5 text-[var(--text-secondary)]">
        <p>Sayam&apos;s technical toolkit is verified across 11 public repositories on GitHub:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
            <span className="text-[var(--accent)] font-semibold block uppercase tracking-wide mb-0.5">Languages</span>
            <span className="text-[var(--text)]">TypeScript · Python · C++ · JavaScript · C · SQL / PLpgSQL</span>
          </div>
          <div className="p-2.5 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
            <span className="text-[var(--accent)] font-semibold block uppercase tracking-wide mb-0.5">Frontend &amp; Visuals</span>
            <span className="text-[var(--text)]">React 19 · Next.js 15 · Vite · Tailwind CSS · KaTeX · D3.js</span>
          </div>
          <div className="p-2.5 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
            <span className="text-[var(--accent)] font-semibold block uppercase tracking-wide mb-0.5">Backend, Data &amp; Test</span>
            <span className="text-[var(--text)]">FastAPI · Node.js · Express · PostgreSQL · Vitest · Docker</span>
          </div>
          <div className="p-2.5 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
            <span className="text-[var(--accent)] font-semibold block uppercase tracking-wide mb-0.5">AI / ML &amp; Vision</span>
            <span className="text-[var(--text)]">YOLOv8 · ByteTrack · PyTorch · Multi-Agent HITL · BDH Lab</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "faq-areas-exploring",
    categoryId: "skills",
    categoryLabel: "Technical Skills",
    question: "Which areas of software engineering and AI/ML is Sayam exploring?",
    plainTextAnswer:
      "Sayam is actively exploring multi-agent orchestration architectures, autonomous workflow safety boundaries, edge computer vision optimization, and advanced C++ algorithmic problem-solving for systems-level efficiency.",
    keywords: ["exploration", "learning", "AI/ML", "agents", "edge computing", "computer vision", "algorithms", "systems"],
    answer: (
      <div className="space-y-2.5 text-[var(--text-secondary)]">
        <p>
          Beyond standard web engineering, Sayam focuses on three foundational engineering disciplines:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>
            <strong>Autonomous Multi-Agent Architectures:</strong> Designing systems where multiple agents decompose complex objectives, execute subroutines in parallel, and exchange verified state payloads.
          </li>
          <li>
            <strong>Edge Computer Vision &amp; Spatial Intelligence:</strong> Implementing real-time object tracking and movement vectors using quantized neural networks on embedded devices.
          </li>
          <li>
            <strong>Algorithmic Efficiency in C++:</strong> Analyzing memory bounds, pointer mechanics, and asymptotic complexities across fundamental graph and dynamic programming challenges.
          </li>
        </ul>
      </div>
    ),
  },

  // D. GitHub and System Architecture
  {
    id: "faq-github-telemetry-detail",
    categoryId: "architecture",
    categoryLabel: "GitHub & Architecture",
    question: "How is GitHub telemetry handled without visitor API keys or rate limits?",
    plainTextAnswer:
      "The portfolio utilizes a pre-rendered static snapshot pipeline alongside server-side caching proxies. Verified repository stats and language breakdowns across all 11 public repositories are stored in public/data/github.json, completely eliminating visitor rate limits and client API token requirements.",
    keywords: ["GitHub", "telemetry", "rate limit", "API key", "Actions", "sync", "snapshot", "SWR", "caching"],
    answer: (
      <div className="space-y-2 text-[var(--text-secondary)]">
        <p>
          Visitors never need personal GitHub tokens, nor do they encounter GitHub&apos;s standard unauthenticated limit of 60 requests per hour.
        </p>
        <p>
          Instead, a pre-rendered multi-repo snapshot at <code>public/data/github.json</code> stores verified statistics (stars, forks, commits, and byte-level language distributions across all 11 public repositories), supplemented by server-side caching routes on the backend.
        </p>
        <p>
          The frontend React application loads this static JSON file using a client-side SWR caching hook, delivering instantaneous sub-millisecond render times with zero API failure risk.
        </p>
      </div>
    ),
  },
  {
    id: "faq-fallback-handling",
    categoryId: "architecture",
    categoryLabel: "GitHub & Architecture",
    question: "How does the portfolio handle unavailable, stale, or incomplete API data?",
    plainTextAnswer:
      "The portfolio employs a resilient three-tier fallback architecture: primary cached static JSON snapshot, secondary in-memory immutable FALLBACK_DATA, and transparent syncedAt timestamps ensuring the UI never crashes or misleads visitors.",
    keywords: ["fallback", "resilience", "stale data", "error handling", "offline", "caching", "reliability"],
    answer: (
      <div className="space-y-2 text-[var(--text-secondary)]">
        <p>The application implements a resilient three-tier fallback strategy:</p>
        <ol className="list-decimal list-inside space-y-1.5 pl-1">
          <li>
            <strong>Primary Layer:</strong> Loads the static snapshot generated by the most recent GitHub Actions synchronization.
          </li>
          <li>
            <strong>Secondary Layer:</strong> If network latency or offline browsing prevents loading the JSON file, the application immediately falls back to a verified, compiled in-memory dataset (<code>FALLBACK_DATA</code> in <code>src/services/github.ts</code>).
          </li>
          <li>
            <strong>Transparency Layer:</strong> Every telemetry widget inspects the <code>syncedAt</code> timestamp and provides clear attribution, never presenting cached historical snapshots as live real-time feeds.
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: "faq-external-services",
    categoryId: "architecture",
    categoryLabel: "GitHub & Architecture",
    question: "Which parts of the portfolio rely on external services?",
    plainTextAnswer:
      "Only minimal external dependencies are used: GitHub REST API (executed asynchronously in background CI/CD) and optional email relay configuration, with no third-party tracking scripts.",
    keywords: ["external services", "APIs", "privacy", "CDN", "tracking", "telemetry"],
    answer: (
      <div className="space-y-2 text-[var(--text-secondary)]">
        <p>
          External dependencies are kept minimal to protect privacy and maintain fast, reliable loading:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>
            <strong>GitHub REST API:</strong> Queried exclusively in the background by automated GitHub Actions, keeping browser execution independent of GitHub server status.
          </li>
          <li>
            <strong>Zero Invasive Trackers:</strong> No marketing pixels, third-party analytics trackers, or external advertising scripts are embedded in the application.
          </li>
        </ul>
      </div>
    ),
  },

  // E. Career and Collaboration
  {
    id: "faq-career-roles",
    categoryId: "career",
    categoryLabel: "Career & Collaboration",
    question: "What roles and professional opportunities is Sayam open to?",
    plainTextAnswer:
      "Sayam is actively seeking Software Engineering Internships (Summer / Fall / Off-cycle), AI/ML Engineering & Research Internships, Full-Stack Developer Roles, and Competitive Hackathon Team Collaborations.",
    keywords: ["internship", "career", "roles", "software engineer", "hiring", "opportunities", "SWE intern", "AI engineer"],
    answer: (
      <div className="space-y-2 text-[var(--text-secondary)]">
        <p>Sayam is actively seeking professional and collaborative opportunities including:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>
            <strong>Software Engineering Internships:</strong> Summer, Fall, and off-cycle internships focusing on backend systems, full-stack web applications, or core C++ engineering.
          </li>
          <li>
            <strong>AI / ML Engineering Internships:</strong> Roles in applied machine learning, multi-agent frameworks, computer vision pipelines, or generative AI integration.
          </li>
          <li>
            <strong>Competitive Hackathon Teams:</strong> National and international hackathons requiring strong full-stack execution, spatial telemetry, and rapid prototyping.
          </li>
          <li>
            <strong>Open-Source Engineering:</strong> High-impact open-source contributions in developer tooling, machine learning libraries, or systems programming.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "faq-collaboration-availability",
    categoryId: "career",
    categoryLabel: "Career & Collaboration",
    question: "Is Sayam available for internships, hackathons, freelance projects, or collaborations?",
    plainTextAnswer:
      "Yes. Sayam is available for upcoming 2025/2026 internships, technical collaborations on cutting-edge software and AI systems, and competitive hackathon challenges.",
    keywords: ["availability", "collaborate", "freelance", "hackathon", "partnership", "hire"],
    answer: (
      <div className="space-y-2 text-[var(--text-secondary)]">
        <p>
          <strong>Yes.</strong> Sayam welcomes serious inquiries regarding upcoming internships, technical hackathon partnerships, and research collaborations.
        </p>
        <p>
          He values teams that prioritize clean code, rigorous software architecture, pragmatic engineering trade-offs, and continuous learning. To discuss a project or role, please send an introductory email with project details and expected timelines.
        </p>
      </div>
    ),
  },

  // F. Contact and Verification
  {
    id: "faq-recruiter-contact",
    categoryId: "contact",
    categoryLabel: "Contact & Verification",
    question: "How can recruiters and collaborators get in touch?",
    plainTextAnswer:
      "Contact Sayam via email at wrickbusiness@gmail.com (business, hackathons, and collaborations) or sayammukherjee1506@gmail.com (internships and academic inquiries), or connect on LinkedIn (linkedin.com/in/codesbysayam) and GitHub (github.com/codesbysayam).",
    keywords: ["contact", "email", "LinkedIn", "GitHub", "reach out", "recruiter", "message"],
    answer: (
      <div className="space-y-2.5 text-[var(--text-secondary)]">
        <p>Direct communication channels for recruiters, hiring managers, and engineers:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
          <a
            href="mailto:wrickbusiness@gmail.com"
            className="p-3 rounded-[8px] bg-[var(--surface)] hover:border-[var(--border-strong)] active:scale-[0.985] active:bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] transition-all flex flex-col gap-0.5"
          >
            <span className="font-mono font-semibold uppercase text-[10px] text-[var(--accent)]">
              Business &amp; Collaborations
            </span>
            <span className="font-mono break-all font-medium">wrickbusiness@gmail.com ↗</span>
          </a>
          <a
            href="mailto:sayammukherjee1506@gmail.com"
            className="p-3 rounded-[8px] bg-[var(--surface)] hover:border-[var(--border-strong)] active:scale-[0.985] active:bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] transition-all flex flex-col gap-0.5"
          >
            <span className="font-mono font-semibold uppercase text-[10px] text-[var(--accent)]">
              Direct &amp; Internship Inquiries
            </span>
            <span className="font-mono break-all font-medium">sayammukherjee1506@gmail.com ↗</span>
          </a>
        </div>
        <p className="text-xs text-[var(--text-muted)] pt-1">
          Professional profiles:{" "}
          <a
            href="https://www.linkedin.com/in/sayammukherjee-portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text)] underline decoration-[var(--border-strong)] hover:decoration-[var(--accent)] active:opacity-75 font-mono font-medium"
          >
            LinkedIn ↗
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/codesbysayam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text)] underline decoration-[var(--border-strong)] hover:decoration-[var(--accent)] active:opacity-75 font-mono font-medium"
          >
            GitHub ↗
          </a>
        </p>
      </div>
    ),
  },
  {
    id: "faq-latest-resume",
    categoryId: "contact",
    categoryLabel: "Contact & Verification",
    question: "Where can visitors access Sayam's latest resume?",
    plainTextAnswer:
      "The authoritative resume is hosted at https://exciting-brown-6y14ojmv.edgeone.dev/ and can be viewed or printed directly through the Resume Spotlight button in the hero section or the portfolio's interactive resume viewer.",
    keywords: ["resume", "CV", "curriculum vitae", "PDF", "download", "official resume", "verification"],
    answer: (
      <div className="space-y-2.5 text-[var(--text-secondary)]">
        <p>
          The authoritative single source of truth for Sayam&apos;s latest verified resume is hosted at:
        </p>
        <div className="p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between gap-3 flex-wrap">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold block">
              Authoritative Destination
            </span>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[var(--text)] underline decoration-[var(--border-strong)] hover:decoration-[var(--accent)] active:opacity-75 break-all"
            >
              {RESUME_URL} ↗
            </a>
          </div>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary !py-2 !px-3.5 !text-xs font-mono shrink-0"
          >
            Open Official Resume ↗
          </a>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          You can also open the <strong>Résumé</strong> spotlight in the hero section for a summary and direct PDF access.
        </p>
      </div>
    ),
  },
  {
    id: "faq-explore-source-projects",
    categoryId: "contact",
    categoryLabel: "Contact & Verification",
    question: "How can visitors explore the source code and live projects?",
    plainTextAnswer:
      "All featured projects are public on GitHub at github.com/codesbysayam. Each card in the Projects Showcase provides direct GitHub repository links, live interactive demos where deployed, and deep-dive technical case study modals.",
    keywords: ["source code", "GitHub", "live demo", "case study", "repository", "open source", "explore"],
    answer: (
      <div className="space-y-2 text-[var(--text-secondary)]">
        <p>
          Every project featured in this portfolio is backed by public source code and verifiable commits:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>
            <strong>GitHub Profile:</strong> Explore public repositories, commit histories, and pull requests directly at{" "}
            <a
              href="https://github.com/codesbysayam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text)] font-mono underline decoration-[var(--border-strong)] hover:decoration-[var(--accent)] active:opacity-75"
            >
              github.com/codesbysayam ↗
            </a>.
          </li>
          <li>
            <strong>Projects Showcase:</strong> Use the interactive technology filters and domain tabs in the <em>Engineering Projects &amp; Software Systems</em> archive to filter by React, Python, AI/ML, C++, or Node.js.
          </li>
          <li>
            <strong>Case Studies &amp; Demos:</strong> Click &ldquo;Case Study&rdquo; on any project card to inspect architecture breakdowns, problem statements, and implementation trade-offs, or click &ldquo;Demo ↗&rdquo; to launch live deployments.
          </li>
        </ul>
      </div>
    ),
  },
];
