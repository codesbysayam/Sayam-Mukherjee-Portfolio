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
