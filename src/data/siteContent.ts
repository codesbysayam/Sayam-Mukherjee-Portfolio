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

export const RESUME_URL =
  "https://homely-scarlet-j1yvfmgp.edgeone.dev/Resume-Professional.pdf";

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
    subtitle: "Autonomous Operations & Multi-Agent Workflow Engine",
    shortDescription:
      "An agent-driven operations platform I built to explore multi-agent workflows while keeping key decisions under human control.",
    description:
      "I built OPERON to explore how multiple specialized agents can collaborate on complex business tasks without running unchecked. The platform automates routine handoffs and data passing between roles in Support, Finance, and HR, while pausing high-stakes decisions at explicit checkpoints for human approval, validation, and audit logging.",
    whyItExists:
      "Routine operational tasks often stall across disconnected tools, but fully autonomous scripts can make unchecked mistakes. OPERON explores an architecture where agents do the heavy lifting while people retain clear approval power.",
    whatIBuilt:
      "I developed the OPERON website from scratch, implementing the multi-agent task dispatcher, state machine checkpoints, Node.js and Express backend service, and the full responsive React user interface.",
    category: "Autonomous Systems & AI",
    categoryLabel: "Autonomous Systems & AI",
    categoryFilter: "AI / ML",
    status: "Active / In Development",
    statusType: "active",
    technologies: [
      "TypeScript",
      "Node.js",
      "Express",
      "React",
      "Multi-Agent AI",
      "REST API",
      "Vercel",
      "Git",
      "GitHub",
    ],
    techStack: [
      "TypeScript",
      "Node.js",
      "Express",
      "React",
      "Multi-Agent AI",
      "REST API",
    ],
    tags: [
      "Agentic Systems",
      "Business Process Automation",
      "Multi-Agent Systems",
      "Human-in-the-Loop",
    ],
    repository: "Operon",
    githubRepoName: "Operon",
    githubUrl: "https://github.com/codesbysayam/Operon",
    liveUrl: "https://operonpro.vercel.app",
    demoUrl: "https://operonpro.vercel.app",
    featured: true,
    highlights: [
      "Role-specific agent task routing across support, finance, and operations",
      "Human-in-the-loop approval checkpoints for high-impact actions",
      "Decoupled React interface connected to a modular Node.js/Express service",
    ],
    metrics: {
      developmentTime: "4 Weeks (Hackathon to MVP)",
      codeComplexityScore: "Low Coupling | High Cohesion (Multi-Agent)",
      linesOfCode: "4,200+ Lines",
    },
  },
  {
    id: "sayam-solves",
    name: "sayam-solves",
    title: "sayam-solves",
    subtitle: "Systematic Algorithmic Problem Solving & DSA Repository",
    shortDescription:
      "My curated C++ repository for DSA fundamentals, pointer mechanics, and algorithmic problem-solving with verified complexity analysis.",
    description:
      "I treat data structures and algorithms as foundational engineering practice rather than a numbers race. In sayam-solves, each problem solution includes explicit time and space complexity annotations, memory layout considerations, and notes on trade-offs between iterative and recursive implementations.",
    whyItExists:
      "Many DSA repositories prioritize quantity over comprehension. I built this archive to document my structured learning process in C++, with code that is clean, tested, and self-documenting.",
    whatIBuilt:
      "A structured C++ code repository organized by algorithmic pattern, complete with clean variable naming, edge-case documentation, and verified LeetCode problem solutions.",
    category: "Algorithms & Problem Solving",
    categoryLabel: "Algorithms & Problem Solving",
    categoryFilter: "DSA",
    status: "Ongoing Practice",
    statusType: "opensource",
    technologies: ["C++", "C++20", "STL", "Algorithms", "Data Structures", "Git"],
    techStack: ["C++", "C++20", "STL", "Algorithms", "Data Structures"],
    tags: ["Data Structures", "Algorithms", "C++", "LeetCode", "Memory Layout"],
    repository: "sayam-solves",
    githubRepoName: "sayam-solves",
    githubUrl: "https://github.com/codesbysayam/sayam-solves",
    featured: false,
    highlights: [
      "Consistent C++20 implementations with explicit big-O time and space annotations",
      "Organized by algorithmic pattern: two pointers, binary search, tree traversals",
      "Documented pointer mechanics and memory footprint considerations",
    ],
    metrics: {
      developmentTime: "Ongoing Daily Practice",
      codeComplexityScore: "Optimal Time/Space Guarantees",
      linesOfCode: "1,800+ Lines",
    },
  },
  {
    id: "mausam",
    name: "MAUSAM",
    title: "MAUSAM",
    subtitle: "Real-Time Environmental & Weather Intelligence Platform",
    shortDescription:
      "A weather intelligence dashboard built for SIH 2026, combining real-time meteorology with intuitive regional environmental visualization.",
    description:
      "Built for the Smart India Hackathon (SIH 2026) by Team Algnite, MAUSAM aggregates weather data, air quality metrics (AQI), UV index, humidity, and maritime conditions into a clean, readable dashboard. The platform translates raw sensor figures into actionable guidance for everyday planning.",
    whyItExists:
      "Environmental and weather data is often fragmented across multiple technical sources. MAUSAM unifies critical metrics into a responsive interface that makes environmental conditions easy to understand at a glance.",
    whatIBuilt:
      "The full frontend user interface using TypeScript and React, integrating weather data APIs, designing the responsive layout, and ensuring accurate metric visualization.",
    category: "Full-Stack Web & Data",
    categoryLabel: "Full-Stack Web & Data",
    categoryFilter: "FULL-STACK",
    status: "SIH 2026 Submission",
    statusType: "hackathon",
    technologies: [
      "TypeScript",
      "React",
      "Tailwind CSS",
      "REST APIs",
      "Vite",
      "Chart.js",
      "Git",
    ],
    techStack: ["TypeScript", "React", "Tailwind CSS", "REST APIs", "Vite"],
    tags: ["Weather Intelligence", "Environmental Data", "React", "SIH 2026"],
    repository: "mausam",
    githubRepoName: "mausam",
    githubUrl: "https://github.com/codesbysayam/mausam",
    featured: true,
    highlights: [
      "Multi-metric environmental dashboard with AQI, UV, wind, and forecast data",
      "Responsive design with smooth theme-aware data visualizations",
      "Built collaboratively as part of Team Algnite for SIH 2026",
    ],
    metrics: {
      developmentTime: "3 Weeks (Sprint)",
      codeComplexityScore: "Modular UI Architecture",
      linesOfCode: "3,100+ Lines",
    },
  },
  {
    id: "portfolio",
    name: "Engineering Portfolio",
    title: "Engineering Portfolio & Ecosystem",
    subtitle: "Production Developer Portfolio with Dynamic Telemetry",
    shortDescription:
      "The site you are viewing: a full-stack portfolio built with TypeScript, React, Tailwind CSS, and resilient error recovery.",
    description:
      "I designed this portfolio as an authentic engineering exhibit rather than a marketing flyer. It features dynamic GitHub telemetry, interactive project case studies, verified credential records, and resilient lazy loading so that network hiccup or chunk failure never breaks the user experience.",
    whyItExists:
      "Portfolios often show mock numbers and static screenshots. I wanted to demonstrate real engineering discipline with live telemetry, verified credentials, accessible markup, and graceful degradation.",
    whatIBuilt:
      "The entire application architecture from scratch: custom React components, Express proxy server, resilient chunk loading, interactive modals, and responsive layout.",
    category: "Full-Stack Web Architecture",
    categoryLabel: "Full-Stack Web Architecture",
    categoryFilter: "FULL-STACK",
    status: "Live & Continuously Updated",
    statusType: "live",
    technologies: [
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Vite",
      "Motion",
    ],
    techStack: [
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Vite",
    ],
    tags: ["Portfolio", "Full-Stack", "TypeScript", "React", "Resilience"],
    repository: "Sayam-Mukherjee-Portfolio",
    githubRepoName: "Sayam-Mukherjee-Portfolio",
    githubUrl: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
    liveUrl: "https://sayammukherjee.in",
    demoUrl: "https://sayammukherjee.in",
    featured: false,
    highlights: [
      "Resilient lazy loading and ErrorBoundary protection against chunk failures",
      "Dynamic GitHub statistics with automatic fallback and zero rate-limit risk",
      "Full keyboard navigation and accessible semantic HTML throughout",
    ],
    metrics: {
      developmentTime: "Iterative Engineering",
      codeComplexityScore: "Production Grade SPA + SSR Ready",
      linesOfCode: "8,500+ Lines",
    },
  },
  {
    id: "yolo",
    name: "YOLO Computer Vision",
    title: "YOLO Computer Vision Experiments",
    subtitle: "Object Detection & Tracking Pipelines on the Edge",
    shortDescription:
      "Edge computer vision experiments using YOLOv8, evaluating inference latency and detection accuracy across varied lighting conditions.",
    description:
      "An applied machine learning repository exploring real-time object detection using YOLOv8. I benchmarked inference speeds on consumer hardware, tested tracking across bounding-box occlusion, and integrated OpenCV for video pipeline preprocessing.",
    whyItExists:
      "To bridge theoretical understanding of convolutional neural networks and object detection with practical, hands-on pipeline engineering and edge performance constraints.",
    whatIBuilt:
      "Python scripts and Jupyter notebooks implementing YOLOv8 model loading, inference pipelines, custom bounding-box rendering, and frame-rate benchmarking with OpenCV.",
    category: "Machine Learning & Vision",
    categoryLabel: "Machine Learning & Vision",
    categoryFilter: "AI / ML",
    status: "Experimental Research",
    statusType: "opensource",
    technologies: ["Python", "YOLOv8", "OpenCV", "PyTorch", "NumPy", "Git"],
    techStack: ["Python", "YOLOv8", "OpenCV", "PyTorch", "NumPy"],
    tags: ["Computer Vision", "YOLOv8", "Object Detection", "Machine Learning"],
    repository: "yolo",
    githubRepoName: "yolo",
    githubUrl: "https://github.com/codesbysayam",
    featured: false,
    highlights: [
      "Benchmarked YOLOv8 inference latency across multiple input resolutions",
      "Implemented OpenCV preprocessing pipeline for real-time video streams",
      "Documented trade-offs between model size (nano vs small) and detection confidence",
    ],
    metrics: {
      developmentTime: "2 Weeks Research",
      codeComplexityScore: "Inference Pipeline & Performance Analysis",
      linesOfCode: "1,200+ Lines",
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
  credentialUrl?: string;
  credentialId?: string;
  verificationStatus: "VERIFIED" | "LINK AVAILABLE" | "NO VERIFICATION LINK";
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
  organizer?: string;
  coOrganizer?: string;
  credentialType?: string;
  teamMembers?: readonly string[];
  signatories?: readonly string[];
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
      skills: ["C", "C++", "Python", "TypeScript", "JavaScript"],
    },
    {
      category: "Frameworks & Backend",
      skills: ["React", "Node.js", "Express", "Tailwind CSS", "Vite"],
    },
    {
      category: "Tools & DevOps",
      skills: ["Git", "GitHub", "Vercel", "Linux", "VS Code"],
    },
    {
      category: "AI, Vision & Systems",
      skills: ["PyTorch", "YOLOv8", "OpenCV", "Multi-Agent Workflows", "REST APIs"],
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
