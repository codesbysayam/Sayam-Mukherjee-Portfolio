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
export function mergeCertificateRecords<T extends { id: string }>(
  existing: T[],
  additions: T[]
): T[] {
  const byId = new Map<string, T>();
  for (const item of existing) {
    byId.set(item.id, item);
  }
  for (const item of additions) {
    if (!byId.has(item.id)) {
      byId.set(item.id, item);
    }
  }
  return Array.from(byId.values());
}

export const EXISTING_CERTIFICATES: Certificate[] = [
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
    pdfUrl: "https://intact-black-0mk1uydx.edgeone.dev/",
    verificationStatus: "NO VERIFICATION LINK",
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
    pdfUrl: "https://impressive-indigo-lkxz4q1q.edgeone.dev/",
    verificationStatus: "NO VERIFICATION LINK",
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
    pdfUrl: "https://marked-aquamarine-cozz1tva.edgeone.dev/",
    verificationStatus: "NO VERIFICATION LINK",
    featured: true,
    createdAt: "2026-09-26T00:00:00.000Z",
    updatedAt: "2026-09-26T00:00:00.000Z"
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
    associatedOrganizer: "inkloom",
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
    createdAt: "2026-10-15T00:00:00.000Z",
    updatedAt: "2026-10-15T00:00:00.000Z"
  },
  {
    id: "matlab-workshop-ieee-kiit-2026",
    title: "MATLAB Workshop",
    issuer: "IEEE KIIT Student Branch / IEEE PES KIIT Student Branch Chapter",
    event: "MATLAB Workshop",
    category: "WORKSHOPS",
    credentialType: "Participation",
    year: 2026,
    issueDate: "2026",
    date: "25 September 2026",
    venue: "KIIT Deemed to be University",
    organizer: "IEEE KIIT Student Branch",
    coOrganizer: "IEEE PES KIIT Student Branch Chapter",
    associatedOrganizer: "IEEE PES KIIT Student Branch Chapter",
    participant: "Sayam Mukherjee",
    overview:
      "Sayam Mukherjee participated in and successfully completed the MATLAB Workshop organized by the IEEE KIIT Student Branch in association with the IEEE PES KIIT Student Branch Chapter on 25 September 2026 at KIIT Deemed to be University.",
    description:
      "Sayam Mukherjee participated in and successfully completed the MATLAB Workshop organized by the IEEE KIIT Student Branch in association with the IEEE PES KIIT Student Branch Chapter on 25 September 2026 at KIIT Deemed to be University.",
    fullDescription:
      "Sayam Mukherjee participated in and successfully completed the MATLAB Workshop organized by the IEEE KIIT Student Branch in association with the IEEE PES KIIT Student Branch Chapter on 25 September 2026 at KIIT Deemed to be University.",
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
    pdfUrl: "https://increased-purple-oeuuxfwu.edgeone.dev/",
    verificationStatus: "VERIFIED",
    verified: true,
    featured: true,
    createdAt: "2026-09-25T00:00:00.000Z",
    updatedAt: "2026-09-25T00:00:00.000Z"
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
    pdfUrl: "https://diverse-plum-xc5wzkru.edgeone.dev/",
    tags: [
      "20 Subjects",
      "2025–26"
    ],
    skills: [
      "Differential Equations & Linear Algebra",
      "Transforms & Numerical Methods",
      "Optimization Technique",
      "Computer Programming"
    ],
    verificationStatus: "NO VERIFICATION LINK",
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

export const ADDITIONAL_CERTIFICATES: Certificate[] = [
  {
    id: "automatrix-2-2025",
    title: "Automatrix 2.0 — Agentic AI Workshop",
    issuer: "USC KIIT",
    event: "Automatrix 2.0",
    format: "Agentic AI Workshop",
    category: "WORKSHOPS",
    credentialType: "Certificate of Participation",
    issueDate: "2025-08-19",
    date: "16 August 2025",
    eventDateDisplay: "16 August 2025",
    year: 2025,
    venue: "KIIT",
    organizer: "USC KIIT",
    coOrganizer: "Training & Placement Department, KIIT",
    associatedOrganizer: "Training & Placement Department, KIIT",
    recipient: "Sayam Mukherjee",
    participant: "Sayam Mukherjee",
    role: "Participant",
    sessionLeader: "Mr. Manoj Batra",
    signatories: [
      {
        name: "Dr. Abhishek Roy",
        designation: "Dean, Industry Engagement, KIIT-DU"
      },
      {
        name: "J. Sivasubramanian",
        designation: "Global Community Advocacy Manager, UiPath"
      }
    ],
    overview:
      "Participated in Automatrix 2.0, a workshop on Agentic AI conducted by USC KIIT under the Training & Placement Department of KIIT. The session was led by Mr. Manoj Batra and featured discussions along with a hands-on segment.",
    description:
      "Participated in Automatrix 2.0, a workshop on Agentic AI conducted by USC KIIT under the Training & Placement Department of KIIT, led by Mr. Manoj Batra.",
    skills: [
      "Agentic AI",
      "Automation",
      "UiPath",
      "Workflow Innovation",
      "Hands-on Learning"
    ],
    tags: [
      "Agentic AI",
      "Automation",
      "UiPath",
      "Workflow Innovation",
      "Hands-on Learning"
    ],
    imageUrl: "/images/certificates/automatrix-2-2025.png",
    imageAlt:
      "Automatrix 2.0 Certificate of Participation awarded to Sayam Mukherjee for the Agentic AI workshop conducted by USC KIIT and Training & Placement Department, KIIT, dated 19.08.2025.",
    certificateUrl: "https://excellent-ivory-4q97cwpu.edgeone.dev",
    verificationStatus: "NO VERIFICATION LINK",
    featured: false,
    createdAt: "2025-08-19T00:00:00.000Z",
    updatedAt: "2025-08-19T00:00:00.000Z"
  },
  {
    id: "toycathon-2021",
    title: "Toycathon 2021",
    issuer: "Ministry of Education's Innovation Cell / AICTE",
    event: "Toycathon 2021",
    format: "National Innovation Competition",
    category: "COMPETITIONS",
    credentialType: "Certificate of Participation",
    issueDate: "2021",
    date: "2021",
    year: 2021,
    organizer: "Ministry of Education's Innovation Cell",
    coOrganizer: "AICTE",
    associatedOrganizer: "AICTE",
    recipient: "SAYAM MUKHERJEE",
    participant: "Sayam Mukherjee",
    team: "ABVB TECHIES",
    role: "Team Member",
    achievementClaim:
      "National-level finalist; the LinkedIn record describes Team ABVB TECHIES as the only finalist team from a school background in West Bengal.",
    sourceNote:
      "The official certificate states Participation. Finalist status comes from the recipient's LinkedIn account rather than the credential wording itself. Digimyth is cited only as the historical team concept and not as an active portfolio project.",
    signatories: [
      {
        name: "Prof. Anil Sahasrabudhe",
        designation: "Chairman, AICTE"
      },
      {
        name: "Dr. Abhay Jere",
        designation: "Chief Innovation Officer, Ministry of Education Innovation Cell"
      },
      {
        name: "Dr. Mohit Gambhir",
        designation: "Innovation Director, Ministry of Education Innovation Cell"
      }
    ],
    overview:
      "Participated in Toycathon 2021 as a member of Team ABVB TECHIES from Aditya Birla Vani Bharati. The team developed a concept-based game titled Digimyth, designed to represent Indian culture through a digital gaming experience.",
    description:
      "Certificate of Participation for Toycathon 2021 as Team ABVB TECHIES (Aditya Birla Vani Bharati). Historical team concept: Digimyth.",
    skills: [
      "Innovation",
      "Game Development",
      "Indian Culture",
      "Creative Problem Solving",
      "Teamwork",
      "C#",
      "Maya",
      "JavaScript",
      "Kotlin",
      "Python",
      "Node.js",
      "PHP"
    ],
    tags: [
      "Innovation",
      "Game Development",
      "Indian Culture",
      "Creative Problem Solving",
      "Teamwork",
      "C#",
      "Maya",
      "JavaScript",
      "Kotlin",
      "Python",
      "Node.js",
      "PHP"
    ],
    imageUrl: "/images/certificates/toycathon-2021.png",
    imageAlt:
      "Toycathon 2021 Certificate of Participation awarded to Sayam Mukherjee of Team ABVB TECHIES, issued by Ministry of Education's Innovation Cell and AICTE.",
    certificateUrl: "https://ridiculous-chocolate-nwjqaaa8.edgeone.dev",
    verificationStatus: "NO VERIFICATION LINK",
    featured: false,
    createdAt: "2021-06-01T00:00:00.000Z",
    updatedAt: "2021-06-01T00:00:00.000Z"
  },
  {
    id: "microsoft-cbse-exposure-2022",
    title: "Industry Engagement and Technology Exposure Program",
    issuer: "Central Board of Secondary Education (CBSE)",
    event: "Industry Engagement and Technology Exposure Program",
    format: "Industry Engagement Program",
    category: "CERTIFICATIONS",
    credentialType: "Certificate of Completion",
    issueDate: "2022-10-30",
    date: "19–30 October 2022",
    eventDateDisplay: "19–30 October 2022",
    year: 2022,
    organizer: "Central Board of Secondary Education",
    coOrganizer: "Microsoft",
    associatedOrganizer: "Microsoft",
    facilitator: "Hypershift",
    recipient: "SAYAM MUKHERJEE",
    participant: "Sayam Mukherjee",
    role: "Participant",
    sourceNote:
      "The document heading reads Certificate of Completion, while the certificate body states that the recipient participated in the program for CBSE students in collaboration with Microsoft, facilitated by Hypershift.",
    signatories: [
      {
        name: "Anand Swamy",
        designation: "Country Head, Education, Microsoft India"
      },
      {
        name: "Dr. Biswajit Saha",
        designation: "Director (Skill Education & Training), CBSE"
      }
    ],
    overview:
      "Participated in the Industry Engagement and Technology Exposure Program for CBSE students, conducted in collaboration with Microsoft and facilitated by Hypershift during 19–30 October 2022. Covered real-world technology workflows, productivity tools, and digital problem-solving.",
    description:
      "Certificate of Completion for participating in the CBSE Industry Engagement and Technology Exposure Program with Microsoft, facilitated by Hypershift (19–30 October 2022).",
    skills: [
      "Technology Exposure",
      "Industry Engagement",
      "Microsoft",
      "Digital Skills",
      "Productivity Tools",
      "Problem Solving"
    ],
    tags: [
      "Technology Exposure",
      "Industry Engagement",
      "Microsoft",
      "Digital Skills",
      "Productivity Tools",
      "Problem Solving"
    ],
    imageUrl: "/images/certificates/microsoft-cbse-exposure-2022.png",
    imageAlt:
      "CBSE and Microsoft Certificate of Completion awarded to Sayam Mukherjee for the Industry Engagement and Technology Exposure Program facilitated by Hypershift (19–30 October 2022).",
    certificateUrl: "https://creepy-aqua-zim8h2zi.edgeone.dev",
    verificationStatus: "NO VERIFICATION LINK",
    featured: false,
    createdAt: "2022-10-30T00:00:00.000Z",
    updatedAt: "2022-10-30T00:00:00.000Z"
  },
  {
    id: "mindquest-quiz-achievement",
    title: "MindQuest Quiz",
    issuer: "H & P Projects / Next Gen Care Foundation / Unstop",
    event: "MindQuest Quiz",
    platform: "Unstop",
    format: "Quiz Competition",
    category: "ACHIEVEMENTS",
    credentialType: "Certificate of Achievement",
    issueDate: "",
    organizer: "H & P Projects",
    coOrganizer: "Next Gen Care Foundation & Unstop",
    associatedOrganizer: "Next Gen Care Foundation & Unstop",
    recipient: "SAYAM MUKHERJEE",
    participant: "Sayam Mukherjee",
    role: "Participant",
    sourceNote:
      "No event date or credential ID appears on the original certificate image and the date is unrecorded.",
    signatories: [
      {
        name: "Koushik Paul",
        designation: "Co-Founder, H & P Projects"
      },
      {
        name: "Abhradeep Hazra",
        designation: "Co-Founder, H & P Projects"
      }
    ],
    overview:
      "Awarded a Certificate of Achievement for performance in the MindQuest Quiz organized by H & P Projects, Next Gen Care Foundation, and Unstop, recognizing analytical thinking, problem-solving, and decision-making.",
    description:
      "Certificate of Achievement for outstanding performance in MindQuest Quiz organized by H & P Projects, Next Gen Care Foundation, and Unstop.",
    skills: [
      "Quiz Competition",
      "Analytical Thinking",
      "Problem Solving",
      "Decision Making",
      "Knowledge Application"
    ],
    tags: [
      "Quiz Competition",
      "Analytical Thinking",
      "Problem Solving",
      "Decision Making",
      "Knowledge Application"
    ],
    imageUrl: "/images/certificates/mindquest-quiz-achievement.png",
    imageAlt:
      "MindQuest Quiz Certificate of Achievement awarded to Sayam Mukherjee, organized by H & P Projects, Next Gen Care Foundation, and Unstop.",
    certificateUrl: "https://musical-peach-anlpglvx.edgeone.dev",
    verificationStatus: "NO VERIFICATION LINK",
    featured: false,
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z"
  },
  {
    id: "decode-dominate-2-2026",
    title: "Decode & Dominate 2.0",
    issuer: "KIIT Fest 9.0 / KIIT School of Computer Engineering",
    event: "Decode & Dominate 2.0",
    format: "Flagship Technical Event",
    theme: "Pixels to Purpose",
    category: "COMPETITIONS",
    credentialType: "Certificate of Participation",
    issueDate: "2026-03-07",
    date: "6–7 March 2026",
    eventDateDisplay: "6–7 March 2026",
    year: 2026,
    venue: "KIIT School of Computer Engineering",
    organizer: "KIIT Fest 9.0",
    coOrganizer: "KIIT School of Computer Engineering",
    associatedOrganizer: "KIIT School of Computer Engineering",
    recipient: "Sayam Mukherjee",
    participant: "Sayam Mukherjee",
    role: "Participant",
    credentialId: "U2D | KF-D02-2026-EU8R",
    signatories: [
      {
        name: "Dr. Roshni Mohanty",
        designation: "Chairperson, KIIT Fest 9.0"
      }
    ],
    overview:
      "Participated in Decode & Dominate 2.0, the flagship technical event of KIIT Fest 9.0, organized under the theme Pixels to Purpose on 6–7 March 2026 with challenges in technical proficiency and innovative problem-solving.",
    description:
      "Certificate of Participation for Decode & Dominate 2.0 at KIIT Fest 9.0 (KIIT School of Computer Engineering), conducted 6–7 March 2026.",
    skills: [
      "Technical Problem Solving",
      "Analytical Thinking",
      "Innovation",
      "Computer Science",
      "Collaborative Learning"
    ],
    tags: [
      "Technical Problem Solving",
      "Analytical Thinking",
      "Innovation",
      "Computer Science",
      "Collaborative Learning"
    ],
    imageUrl: "/images/certificates/decode-dominate-2-2026.png",
    imageAlt:
      "Decode & Dominate 2.0 Certificate of Participation awarded to Sayam Mukherjee at KIIT Fest 9.0 (6–7 March 2026), code U2D | KF-D02-2026-EU8R.",
    certificateUrl: "https://secure-black-gupqskus.edgeone.dev",
    verificationStatus: "NO VERIFICATION LINK",
    featured: false,
    createdAt: "2026-03-07T00:00:00.000Z",
    updatedAt: "2026-03-07T00:00:00.000Z"
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = mergeCertificateRecords(
  EXISTING_CERTIFICATES,
  ADDITIONAL_CERTIFICATES
);
