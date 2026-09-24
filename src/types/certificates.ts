export type CertificateCategory = 
  | 'ALL'
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
  category: Exclude<CertificateCategory, 'ALL'>;
  description?: string;
  fullDescription?: string;
  issueDate: string; // e.g. "2026-02", "2025", "2024"
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
  tags?: string[];
  imageUrl?: string;
  pdfUrl?: string;
  verificationStatus: VerificationStatus;
  featured: boolean;
  event?: string;
  platform?: string;
  project?: string;
  theme?: string;
  pathway?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateStats {
  total: number;
  technical: number;
  competitions: number;
  achievements: number;
}

export interface StorageStatus {
  database: 'postgresql_configured' | 'embedded_store_active';
  objectStorage: 'cloud_configured' | 'not_configured';
  message: string;
}
