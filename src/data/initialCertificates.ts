import { Certificate } from "../types/certificates";

/**
 * ============================================================================
 * CERTIFICATES & CREDENTIALS ARCHIVE
 * ============================================================================
 * 
 * Manually manage your certificate and credential entries here.
 * Each entry supports the following fields:
 * 
 *   - id: string                (Required: Unique slug identifier)
 *   - title: string             (Required: Name of certificate / credential / honour)
 *   - issuer: string            (Required: Organization or institution that issued it)
 *   - category: string          (Required: "CERTIFICATIONS" | "ACHIEVEMENTS" | "COMPETITIONS" | "COURSES" | "WORKSHOPS" | "OTHER")
 *   - issueDate: string         (Required: e.g. "2026", "2025-06")
 *   - description?: string      (Optional: Brief description of the achievement)
 *   - credentialId?: string     (Optional: Unique certificate or roll identifier)
 *   - credentialUrl?: string    (Optional: Authentic verification or credential URL)
 *   - imageUrl?: string         (Optional: Direct image URL for certificate preview)
 *   - pdfUrl?: string           (Optional: Direct PDF document URL)
 *   - skills: string[]          (Relevant competencies and skills demonstrated)
 *   - verificationStatus: string ("VERIFIED" | "LINK AVAILABLE" | "NO VERIFICATION LINK")
 *   - featured: boolean         (Set to true to highlight in homepage spotlight)
 *   - createdAt: string         (ISO timestamp)
 *   - updatedAt: string         (ISO timestamp)
 * ============================================================================
 */
export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: "dataforge-2026-memory-in-motion",
    title: "DataForge 2026 | Memory in Motion",
    issuer: "Kharagpur Data Analytics Group (KDAG), IIT Kharagpur",
    event: "DataForge 2026",
    platform: "Unstop",
    category: "COMPETITIONS",
    project: "Memory in Motion",
    theme: "In-Context Learning with Recurrent Memory",
    pathway: "Explain the Frontier",
    issueDate: "2026",
    description: "An interactive exploration of in-context learning with recurrent memory, demonstrating how fixed-size state can retain task-relevant information while compression introduces interference and forgetting.",
    fullDescription: "Memory in Motion is an interactive research-exhibit project exploring in-context learning through recurrent memory. It demonstrates how a fixed-size recurrent state can carry task-relevant information forward without growing a token-by-token memory, while also exposing the trade-off: compressing information into a bounded state can introduce interference and forgetting.",
    credentialUrl: "https://intact-black-0mk1uydx.edgeone.dev/",
    skills: [
      "AI Research",
      "Machine Learning",
      "In-Context Learning",
      "Recurrent Memory"
    ],
    tags: [
      "AI Research",
      "Machine Learning",
      "In-Context Learning",
      "Recurrent Memory"
    ],
    verificationStatus: "LINK AVAILABLE",
    featured: true,
    createdAt: "2026-02-15T00:00:00.000Z",
    updatedAt: "2026-02-15T00:00:00.000Z"
  },
  {
    id: "gdg-kiit-operon-2026",
    category: "COMPETITIONS",
    title: "Deploy or Die | HowToAlgo × GDG on Campus KIIT",
    issuer: "GDG on Campus KIIT",
    event: "Deploy or Die | HowToAlgo × GDG on Campus KIIT",
    year: 2026,
    date: "8–9 August 2026",
    issueDate: "2026",
    track: "Track A | Business Process Automation",
    project: "OPERON | Autonomous Operations, Human-Controlled",
    team: "Team Nexus",
    teamMembers: [
      "Sayam Mukherjee",
      "Sounak Chowdhury",
      "Gourab Biswas",
      "Aarush Roy"
    ],
    description:
      "OPERON is an agent-driven operations platform designed to automate business workflows while keeping critical decisions traceable, auditable, policy-controlled, and subject to human approval.",
    fullDescription:
      "OPERON (Autonomous Operations, Human-Controlled) was developed for Deploy or Die, an Agent-Driven Lifecycle Hackathon organized through HowToAlgo × GDG on Campus KIIT. Built under Track A (Business Process Automation), the project explores how multi-agent systems can automate operational workflows while maintaining risk-based reasoning, human approval, validation, recovery, and auditability.",
    contribution:
      "Sayam Mukherjee developed the OPERON website from scratch, implementing the product interface and workflow into a usable application.",
    metrics: {
      developmentTime: "4 Weeks (Hackathon to MVP)",
      codeComplexityScore: "Low Coupling | High Cohesion (Multi-Agent)",
      linesOfCode: "4,200+ Lines"
    },
    skills: [
      "Agentic Systems",
      "Business Process Automation",
      "Multi-Agent Systems",
      "Human-in-the-Loop"
    ],
    tags: [
      "Agentic Systems",
      "Business Process Automation",
      "Multi-Agent Systems",
      "Human-in-the-Loop"
    ],
    credentialUrl: "https://impressive-indigo-lkxz4q1q.edgeone.dev/",
    verificationStatus: "LINK AVAILABLE",
    featured: true,
    createdAt: "2026-08-09T00:00:00.000Z",
    updatedAt: "2026-08-09T00:00:00.000Z"
  },
  {
    id: "comp-toycathon-2021",
    title: "National Finalist | Toycathon",
    issuer: "Ministry of Education & AICTE, Govt. of India",
    category: "COMPETITIONS",
    description: "Reached the National Grand Finale among thousands of competing collegiate teams in the national Toycathon innovation challenge.",
    issueDate: "2021",
    credentialId: "TC-2021-FIN",
    skills: ["Rapid Prototyping", "Hardware/Software Integration", "Problem Solving"],
    verificationStatus: "VERIFIED",
    featured: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "comp-technex-iit-bhu",
    title: "Multi-Event Finalist | Technex'26",
    issuer: "IIT (BHU) Varanasi",
    category: "COMPETITIONS",
    description: "Qualified for the final rounds across 5 out of 6 technical challenges in Technex, the annual technical festival of IIT (BHU).",
    issueDate: "2026",
    credentialId: "TX-2026-IITBHU",
    skills: ["Algorithmic Logic", "Data Analysis", "System Design"],
    verificationStatus: "VERIFIED",
    featured: true,
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z"
  },
  {
    id: "kiit-grade-report-2025-26",
    title: "First-Year Grade Report",
    issuer: "Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar",
    category: "ACADEMIC RECORD",
    year: 2025,
    session: "2025–26",
    credentialType: "Grade Report",
    issueDate: "2025",
    description: "First-year academic grade report covering core engineering, science, mathematics, laboratory, programming, communication, and interdisciplinary coursework.",
    fullDescription: "First-year academic grade report covering core engineering, science, mathematics, laboratory, programming, communication, and interdisciplinary coursework.",
    subjects: [
      "Chemistry",
      "English",
      "Basic Electronics",
      "Chemistry Lab",
      "Engineering Lab",
      "Workshop",
      "Communication Lab",
      "Basic Electrical Engineering",
      "Creativity,Innovation and Entreprneurship",
      "Sports and Yoga",
      "Transforms and Numerical Methods",
      "Physics",
      "Physics Lab",
      "Differential Equations and Linear Algebra",
      "Science of Living Systems",
      "Environmental Science",
      "Engineering Drawing and Graphics",
      "Programming Lab",
      "Basic Civil Engineering",
      "Optimization Technique"
    ],
    credentialUrl: "https://diverse-plum-xc5wzkru.edgeone.dev/",
    skills: [
      "Engineering Sciences",
      "Mathematics",
      "Programming",
      "Laboratory Work"
    ],
    tags: [
      "20 Subjects",
      "2025–26"
    ],
    verificationStatus: "LINK AVAILABLE",
    featured: false,
    createdAt: "2025-06-01T00:00:00.000Z",
    updatedAt: "2025-06-01T00:00:00.000Z"
  },
  {
    id: "ach-cbse-class-10",
    title: "CBSE Class 10 Board Examination (92.6%)",
    issuer: "Central Board of Secondary Education",
    category: "ACHIEVEMENTS",
    description: "Graduated secondary school with distinction scoring 92.6% in the nationwide CBSE Secondary School Examination.",
    issueDate: "2022",
    skills: ["Mathematics", "Science", "Analytical Reasoning"],
    verificationStatus: "VERIFIED",
    featured: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "ach-cbse-class-12",
    title: "CBSE Class 12 Board Examination (86.2%)",
    issuer: "Central Board of Secondary Education",
    category: "ACHIEVEMENTS",
    description: "Completed higher secondary education in the Physics, Chemistry, and Mathematics (PCM) stream with 86.2%.",
    issueDate: "2024",
    skills: ["Advanced Physics", "Calculus", "Chemistry", "Computer Science"],
    verificationStatus: "VERIFIED",
    featured: false,
    createdAt: "2024-07-01T00:00:00.000Z",
    updatedAt: "2024-07-01T00:00:00.000Z"
  },
  {
    id: "ach-table-tennis-championship",
    title: "Inter-School Table Tennis Champion (3x 1st Position)",
    issuer: "Inter-School Sports Championship",
    category: "ACHIEVEMENTS",
    description: "Secured 1st place in three consecutive inter-school table tennis tournaments, demonstrating tactical focus and competitive discipline.",
    issueDate: "2023",
    skills: ["Strategic Play", "Hand-Eye Coordination", "Competitive Focus"],
    verificationStatus: "VERIFIED",
    featured: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }
];
