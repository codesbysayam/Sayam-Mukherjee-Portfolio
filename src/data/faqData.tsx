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
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
        <p>
          Sayam Mukherjee is pursuing a Bachelor of Technology (<strong>B.Tech</strong>) in{" "}
          <strong>Computer Science &amp; Engineering</strong> with a specialization in{" "}
          <strong>Artificial Intelligence and Machine Learning (AI &amp; ML)</strong> at{" "}
          <strong>Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar</strong> (expected graduation:{" "}
          <strong>2029</strong>).
        </p>
        <p>
          He maintained an overall first-year CGPA of <strong>9.06 / 10.0</strong>, with fundamental coursework in{" "}
          <em>Data Structures &amp; Algorithms</em>, <em>Object-Oriented Programming in C++</em>,{" "}
          <em>Computer Organization</em>, and <em>Discrete Mathematics</em>. Prior to university, he completed his CBSE Class 12 (Science) with <strong>86.2%</strong> and Class 10 with <strong>92.6%</strong> at Aditya Birla Vani Bharati.
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
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
        <p>Key documented milestones and academic honors include:</p>
        <ul className="list-disc list-inside space-y-1 pl-1">
          <li>
            <strong>First-Year Academic Distinction:</strong> Maintained a <strong>9.06 / 10.0 CGPA</strong> across rigorous engineering, mathematics, and computing foundation semesters.
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
      "The portfolio features five verified projects: OPERON (autonomous multi-agent workflow engine), MAUSAM (SIH 2026 climate and weather dashboard), SayamSolves (open-source C++ algorithmic problem-solving repository), Edge Computer Vision (real-time YOLOv8 OpenCV spatial pipeline), and the full-stack Engineering Portfolio itself.",
    keywords: ["projects", "OPERON", "MAUSAM", "SayamSolves", "YOLO", "portfolio", "codebase", "features"],
    answer: (
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
        <p>The portfolio showcases five verified software engineering systems backed by live GitHub repositories:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-zinc-100/80 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06]">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              OPERON
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Autonomous operations platform coordinating specialized agents with human-in-the-loop checkpoint gates and audit tracking.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-100/80 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06]">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              MAUSAM
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              SIH 2026 localized climate telemetry and severe weather prediction dashboard engineered by Team Algnite.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-100/80 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06]">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              SayamSolves
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Documented algorithmic repository with clean C++ solutions and complexity analyses for LeetCode problem patterns.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-100/80 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06]">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Edge Computer Vision
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Real-time spatial motion detection and object tracking pipeline utilizing YOLOv8 and OpenCV on constrained edge camera hardware.
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
      "Key engineering hurdles addressed include multi-agent race conditions and safety checkpoints in OPERON, edge-constrained real-time inference latency in OpenCV YOLOv8, and zero-rate-limit client-side caching for live GitHub API telemetry.",
    keywords: ["challenges", "architecture", "tradeoffs", "concurrency", "rate limits", "inference", "optimization"],
    answer: (
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
        <p>Across these projects, several non-trivial engineering trade-offs were solved:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>
            <strong>Autonomous Multi-Agent Boundaries (OPERON):</strong> Preventing runaway agent execution by architecting an immutable state transition machine where financial and HR decisions pause at strict human authorization gates.
          </li>
          <li>
            <strong>Edge Inference Latency (YOLO / Vision):</strong> Overcoming frame drops on edge micro-hardware by quantizing YOLO weights and stripping non-essential visual channels before running spatial vector calculations.
          </li>
          <li>
            <strong>Zero-Rate-Limit API Telemetry (Portfolio):</strong> Eliminating the standard 60-req/hour unauthenticated GitHub API ceiling by establishing a background CI/CD sync script that pre-renders metrics to static JSON files.
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
      "Applications are structured in modular TypeScript and React with strict type safety, tested with automated type checking (tsc --noEmit) and Vite production builds, and deployed via modern edge platforms like EdgeOne, Cloudflare, and Node production runtimes.",
    keywords: ["structure", "testing", "deployment", "CI/CD", "TypeScript", "build", "Vite", "esbuild"],
    answer: (
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
        <p>
          Codebases adhere to strict separation of concerns: modular UI components in React 19, strongly typed domain schemas in TypeScript, and minimal external dependencies.
        </p>
        <p>
          <strong>Testing &amp; Validation:</strong> Every pull request and release is validated using TypeScript compiler checks (<code>tsc --noEmit</code>) and production Vite bundling. For full-stack backends, <code>esbuild</code> compiles the Express server into an optimized <code>dist/server.cjs</code> bundle.
        </p>
        <p>
          <strong>Deployment:</strong> Static assets are distributed via global edge CDNs (Cloudflare / EdgeOne) with HTTP caching headers, while automated GitHub Actions handle scheduled repository telemetry and profile synchronization.
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
      "Languages: Python, C++, TypeScript, JavaScript, SQL. Frontend: React 19, Vite, Tailwind CSS, Motion, Recharts. Backend: Node.js, Express, REST APIs. AI/ML: PyTorch, OpenCV, YOLOv8, Google GenAI SDK. Tooling: Git, GitHub Actions, Linux CLI.",
    keywords: ["languages", "stack", "Python", "C++", "TypeScript", "React", "Node.js", "PyTorch", "OpenCV", "Tailwind"],
    answer: (
      <div className="space-y-2.5 text-zinc-600 dark:text-zinc-300">
        <p>Sayam&apos;s technical toolkit is verified by concrete project implementations:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-zinc-100/60 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05]">
            <span className="text-purple-600 dark:text-purple-400 font-semibold block uppercase">Languages</span>
            <span className="text-zinc-800 dark:text-zinc-200">Python · C++ (Modern) · TypeScript · JavaScript · SQL</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-100/60 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05]">
            <span className="text-purple-600 dark:text-purple-400 font-semibold block uppercase">Frontend &amp; UI</span>
            <span className="text-zinc-800 dark:text-zinc-200">React 19 · Vite · Tailwind CSS 4 · Motion · Recharts</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-100/60 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05]">
            <span className="text-purple-600 dark:text-purple-400 font-semibold block uppercase">Backend &amp; Systems</span>
            <span className="text-zinc-800 dark:text-zinc-200">Node.js · Express · RESTful APIs · Linux CLI · Bash</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-100/60 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05]">
            <span className="text-purple-600 dark:text-purple-400 font-semibold block uppercase">AI / ML &amp; Vision</span>
            <span className="text-zinc-800 dark:text-zinc-200">PyTorch · OpenCV · YOLOv8 · Google GenAI SDK · Multi-Agent</span>
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
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
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
      "The portfolio utilizes a pre-rendered static snapshot pipeline. A scheduled GitHub Action (sync-github.yml) runs hourly using authenticated credentials to fetch repository stats and language breakdowns, saving them into public/github-data.json. The web client loads this local static file, completely eliminating visitor rate limits and API token requirements.",
    keywords: ["GitHub", "telemetry", "rate limit", "API key", "Actions", "sync", "snapshot", "SWR", "caching"],
    answer: (
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
        <p>
          Visitors never need personal GitHub tokens, nor do they encounter GitHub&apos;s standard unauthenticated limit of 60 requests per hour.
        </p>
        <p>
          Instead, an automated GitHub Actions workflow (<code>.github/workflows/sync-github.yml</code>) runs hourly. It authenticates with a secure repository secret, retrieves real-time statistics (stars, forks, commits, and byte-level language distributions) across all public repositories, and commits the result to <code>public/github-data.json</code>.
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
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
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
      "Only two essential external touchpoints are used: GitHub REST API (executed asynchronously in background CI/CD) and the authoritative resume distribution CDN (EdgeOne). All UI rendering, charts, and routing operate client-side without third-party tracking scripts.",
    keywords: ["external services", "APIs", "privacy", "EdgeOne", "CDN", "tracking", "telemetry"],
    answer: (
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
        <p>
          External dependencies are kept minimal to protect privacy and maintain maximum uptime:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-1">
          <li>
            <strong>GitHub REST API:</strong> Queried exclusively in the background by automated GitHub Actions, keeping browser execution independent of GitHub server status.
          </li>
          <li>
            <strong>Authoritative Resume CDN:</strong> Hosted on a fast global edge network (Tencent EdgeOne) at <code>https://exciting-brown-6y14ojmv.edgeone.dev/</code> for reliable high-speed PDF delivery.
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
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
        <p>Sayam is actively seeking professional and collaborative opportunities including:</p>
        <ul className="list-disc list-inside space-y-1 pl-1">
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
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
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
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
        <p>Direct communication channels for recruiters, hiring managers, and engineers:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
          <a
            href="mailto:wrickbusiness@gmail.com"
            className="p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/20 text-purple-700 dark:text-purple-300 transition-colors flex flex-col gap-0.5"
          >
            <span className="font-mono font-semibold uppercase text-[10px] text-purple-600 dark:text-purple-400">
              Business &amp; Collaborations
            </span>
            <span className="font-mono break-all font-medium">wrickbusiness@gmail.com ↗</span>
          </a>
          <a
            href="mailto:sayammukherjee1506@gmail.com"
            className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-colors flex flex-col gap-0.5"
          >
            <span className="font-mono font-semibold uppercase text-[10px] text-emerald-600 dark:text-emerald-400">
              Direct &amp; Internship Inquiries
            </span>
            <span className="font-mono break-all font-medium">sayammukherjee1506@gmail.com ↗</span>
          </a>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-1">
          Professional profiles:{" "}
          <a
            href="https://linkedin.com/in/codesbysayam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 dark:text-purple-400 hover:underline font-mono"
          >
            LinkedIn ↗
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/codesbysayam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 dark:text-purple-400 hover:underline font-mono"
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
      "The authoritative resume is hosted at https://exciting-brown-6y14ojmv.edgeone.dev/ and can be accessed directly through the Resume Spotlight button in the hero section or the portfolio's dedicated resume viewer.",
    keywords: ["resume", "CV", "curriculum vitae", "PDF", "download", "official resume", "verification"],
    answer: (
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
        <p>
          The authoritative single source of truth for Sayam&apos;s latest verified resume is hosted at:
        </p>
        <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] flex items-center justify-between gap-3 flex-wrap">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold block">
              Authoritative Destination
            </span>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-zinc-800 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-300 underline break-all"
            >
              {RESUME_URL} ↗
            </a>
          </div>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary !py-1.5 !px-3.5 !text-xs font-mono shrink-0"
          >
            Open Official Resume ↗
          </a>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          You can also click the <strong>Explore My Resume</strong> spotlight in the hero section for a modal summary and direct download.
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
      <div className="space-y-2 text-zinc-600 dark:text-zinc-300">
        <p>
          Every project featured in this portfolio is backed by public source code and verifiable commits:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-1">
          <li>
            <strong>GitHub Profile:</strong> Explore public repositories, commit histories, and pull requests directly at{" "}
            <a
              href="https://github.com/codesbysayam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 font-mono underline hover:text-purple-500"
            >
              github.com/codesbysayam ↗
            </a>.
          </li>
          <li>
            <strong>Projects Showcase:</strong> Use the interactive technology tags and domain filters in the <em>Engineering Projects &amp; Software Systems</em> section to filter by React, Python, AI/ML, C++, or Node.js.
          </li>
          <li>
            <strong>Case Studies &amp; Demos:</strong> Click &ldquo;Case Study&rdquo; on any project card to inspect architecture diagrams, problem statements, and implementation trade-offs, or click &ldquo;Demo ↗&rdquo; to launch live production deployments.
          </li>
        </ul>
      </div>
    ),
  },
];
