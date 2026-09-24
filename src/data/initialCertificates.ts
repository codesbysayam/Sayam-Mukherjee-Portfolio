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
    id: "comp-toycathon-2021",
    title: "National Finalist — Toycathon",
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
    title: "Multi-Event Finalist — Technex'26",
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
    id: "ach-kiit-academic-excellence",
    title: "First-Year Academic Excellence (9.06 CGPA)",
    issuer: "Kalinga Institute of Industrial Technology, Bhubaneswar",
    category: "ACHIEVEMENTS",
    description: "Maintained a 9.06 cumulative grade point average across the first year of Computer Science and Engineering curriculum.",
    issueDate: "2024",
    skills: ["Data Structures", "Algorithms", "Mathematics for CS", "Digital Systems"],
    verificationStatus: "VERIFIED",
    featured: true,
    createdAt: "2024-07-01T00:00:00.000Z",
    updatedAt: "2024-07-01T00:00:00.000Z"
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
