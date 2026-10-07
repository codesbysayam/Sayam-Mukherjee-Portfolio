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
    title: "DATAFORGE 2026",
    issuer: "IIT Kharagpur / Unstop",
    event: "DATAFORGE 2026",
    platform: "Unstop",
    category: "COMPETITIONS",
    credentialType: "Research Exhibit",
    format: "Explain the Frontier",
    track: "Explain the Frontier",
    project: "Memory in Motion",
    theme: "In-Context Learning with Recurrent Memory",
    pathway: "Explain the Frontier",
    issueDate: "2026",
    year: 2026,
    venue: "IIT Kharagpur",
    organizer: "IIT Kharagpur",
    participant: "Sayam Mukherjee",
    team: "ALGNITE",
    role: "Team Leader",
    teamMembers: [
      "Sayam Mukherjee (Team Leader)",
      "Shinibali Kumar"
    ],
    associatedProjects: [
      {
        name: "Memory in Motion",
        url: "https://memoryinmotion.vercel.app",
        description:
          "An interactive exploration of in-context learning with recurrent memory, demonstrating how fixed-size state can retain task-relevant information while compression introduces interference and forgetting."
      }
    ],
    description:
      "An interactive exploration of in-context learning with recurrent memory, demonstrating how fixed-size state can retain task-relevant information while compression introduces interference and forgetting.",
    fullDescription:
      "Memory in Motion is an interactive research-exhibit project exploring in-context learning through recurrent memory. It demonstrates how a fixed-size recurrent state can carry task-relevant information forward without growing a token-by-token memory, while also exposing the trade-off: compressing information into a bounded state can introduce interference and forgetting.",
    skills: [
      "In-Context Learning",
      "Recurrent Memory",
      "Explain the Frontier",
      "AI Research",
      "Machine Learning"
    ],
    tags: [
      "In-Context Learning",
      "Recurrent Memory",
      "Explain the Frontier",
      "AI Research",
      "Machine Learning"
    ],
    credentialUrl: "https://intact-black-0mk1uydx.edgeone.dev/",
    verificationStatus: "LINK AVAILABLE",
    featured: true,
    createdAt: "2026-02-15T00:00:00.000Z",
    updatedAt: "2026-02-15T00:00:00.000Z"
  },
  {
    id: "gdg-kiit-operon-2026",
    category: "COMPETITIONS",
    title: "Deploy or Die - HowToAlgo × GDG on Campus KIIT",
    issuer: "GDG on Campus KIIT / HowToAlgo",
    event: "Deploy or Die - HowToAlgo × GDG on Campus KIIT",
    organizer: "GDG on Campus KIIT",
    coOrganizer: "HowToAlgo",
    associatedOrganizer: "HowToAlgo",
    credentialType: "Hackathon",
    format: "Agent-Driven Lifecycle Hackathon",
    year: 2026,
    date: "8-9 August 2026",
    issueDate: "2026",
    venue: "KIIT Deemed to be University",
    track: "Track A - Business Process Automation",
    project: "OPERON - Autonomous Operations, Human-Controlled",
    participant: "Sayam Mukherjee",
    team: "NEXUS",
    role: "Team Member",
    teamMembers: [
      "Sayam Mukherjee",
      "Sounak Chowdhury (Team Leader)",
      "Aarush Roy",
      "Jaydeep Dutta"
    ],
    associatedProjects: [
      {
        name: "OPERON",
        url: "https://operonpro.vercel.app",
        description:
          "Autonomous operations platform built for intelligent, human-controlled workflows across Support, Finance, HR, and Operations, combining multi-agent AI with human-in-the-loop governance."
      }
    ],
    description:
      "OPERON is an agent-driven operations platform designed to automate business workflows while keeping critical decisions traceable, auditable, policy-controlled, and subject to human approval.",
    fullDescription:
      "OPERON (Autonomous Operations, Human-Controlled) was developed for Deploy or Die, an Agent-Driven Lifecycle Hackathon organized through HowToAlgo × GDG on Campus KIIT. Built under Track A (Business Process Automation), the project explores how multi-agent systems can automate operational workflows while maintaining risk-based reasoning, human approval, validation, recovery, and auditability.",
    skills: [
      "Agent-Driven Lifecycle",
      "Business Process Automation",
      "OPERON",
      "Human-Controlled Operations",
      "Multi-Agent Systems",
      "Human-in-the-Loop"
    ],
    tags: [
      "Agent-Driven Lifecycle",
      "Business Process Automation",
      "OPERON",
      "Human-Controlled Operations",
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
    id: "ignithon-2-0-participation-2026",
    title: "IGNITHON 2.0",
    issuer: "K-1000 / KIIT & KSAC",
    event: "IGNITHON 2.0",
    format: "12-Hour Offline Hackathon",
    role: "Team Leader",
    participant: "Sayam Mukherjee",
    organizer: "K-1000",
    credentialType: "Certificate of Participation",
    category: "COMPETITIONS",
    issueDate: "2026",
    date: "26th September 2026",
    year: 2026,
    venue: "KIIT Deemed to be University",
    team: "ALGNITE",
    teamMembers: [
      "Sayam Mukherjee (Team Leader)",
      "Shinibali Kumar"
    ],
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
    skills: [
      "12-Hour Hackathon",
      "Team Leadership",
      "Rapid Prototyping",
      "Problem Solving",
      "Technical Excellence"
    ],
    tags: [
      "12-Hour Hackathon",
      "Offline Hackathon",
      "Team ALGNITE",
      "KIIT & KSAC"
    ],
    credentialUrl: "https://marked-aquamarine-cozz1tva.edgeone.dev/",
    verificationStatus: "LINK AVAILABLE",
    featured: true,
    createdAt: "2026-09-26T00:00:00.000Z",
    updatedAt: "2026-09-26T00:00:00.000Z"
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
