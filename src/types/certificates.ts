export type CertificateCategory = 
  | 'ALL'
  | 'ACADEMIC RECORD'
  | 'CERTIFICATIONS'
  | 'ACHIEVEMENTS'
  | 'COMPETITIONS'
  | 'COURSES'
  | 'WORKSHOPS'
  | 'OTHER';

export type VerificationStatus = 'VERIFIED' | 'LINK AVAILABLE' | 'NO VERIFICATION LINK';

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  category: Exclude<CertificateCategory, 'ALL'> | 'Academic Record';
  description?: string;
  fullDescription?: string;
  overview?: string;
  issueDate: string; // e.g. "2026-02", "2025", "2024"
  year?: number;
  session?: string;
  credentialType?: string;
  subjects?: string[];
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
  tags?: string[];
  imageUrl?: string;
  pdfUrl?: string;
  verificationStatus: VerificationStatus;
  verified?: boolean;
  featured: boolean;
  event?: string;
  platform?: string;
  project?: string;
  theme?: string;
  pathway?: string;
  track?: string;
  team?: string;
  teamMembers?: string[];
  contribution?: string;
  venue?: string;
  format?: string;
  role?: string;
  participant?: string;
  recipient?: string;
  imageAlt?: string;
  organizer?: string;
  coOrganizer?: string;
  associatedOrganizer?: string;
  signatories?: (string | { name: string; designation?: string })[];
  associatedProjects?: {
    name: string;
    url: string;
    description?: string;
    role?: string;
  }[];
  metrics?: {
    developmentTime?: string;
    codeComplexityScore?: string;
    linesOfCode?: string;
  };
  date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateStats {
  total: number;
  technical: number;
  competitions: number;
  achievements: number;
  academic?: number;
}

export interface StorageStatus {
  database: 'postgresql_configured' | 'embedded_store_active';
  objectStorage: 'cloud_configured' | 'not_configured';
  message: string;
}

export type AchievementKind =
  | "competition"
  | "hackathon"
  | "workshop"
  | "certificate"
  | "recognition"
  | "academic";

export interface AchievementRecord extends Partial<Certificate> {
  id: string;
  title: string;
  issuer: string;
  category: Exclude<CertificateCategory, 'ALL'> | 'Academic Record';
  kind?: AchievementKind;
  organizer?: string;
  sponsor?: string;
  coOrganizer?: string;
  associatedOrganizer?: string;
  year?: number;
  date?: string;
  duration?: string;
  eventFormat?: string;
  format?: string;
  startDate?: string;
  endDate?: string;
  team?: string;
  role?: string;
  categories?: string[];
  description?: string;
  fullDescription?: string;
  overview?: string;
  credentialImage?: string;
  credentialAlt?: string;
  credentialId?: string;
  verificationUrl?: string;
  credentialUrl?: string;
  downloadUrl?: string;
  pdfUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  tags?: string[];
  skills?: string[];
  recipient?: string;
  participant?: string;
  contribution?: string;
  teamMembers?: string[];
  associatedProjects?: {
    name: string;
    url: string;
    description?: string;
    role?: string;
  }[];
  verificationStatus?: VerificationStatus;
  verified?: boolean;
  featured?: boolean;
}

export function validateAchievementRecords(
  records: (AchievementRecord | Certificate)[]
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const record of records) {
    if (!record.id || !record.id.trim()) {
      errors.push("A record is missing its ID.");
    } else if (ids.has(record.id)) {
      errors.push(`Duplicate record ID: ${record.id}`);
    } else {
      ids.add(record.id);
    }

    if (!record.title || !record.title.trim()) {
      errors.push(`Record ${record.id || "unknown"} is missing its title.`);
    }

    const desc = record.description || record.overview || record.fullDescription;
    if (!desc || !desc.trim()) {
      errors.push(`Record ${record.id} is missing its description.`);
    }

    const img = record.imageUrl || (record as AchievementRecord).credentialImage;
    const alt = record.imageAlt || (record as AchievementRecord).credentialAlt;
    if (img && (!alt || !alt.trim())) {
      errors.push(`Record ${record.id} needs meaningful image alt text.`);
    }

    const download = (record as AchievementRecord).downloadUrl;
    if (download && !/^https?:\/\//i.test(download) && !download.startsWith("/")) {
      errors.push(`Record ${record.id} has an unsupported download URL.`);
    }

    const verify = (record as AchievementRecord).verificationUrl || record.credentialUrl;
    if (verify && !/^https?:\/\//i.test(verify) && !verify.startsWith("/")) {
      errors.push(`Record ${record.id} has an unsupported verification URL.`);
    }
  }

  return errors;
}
