import fs from "fs";
import path from "path";
import { Certificate, CertificateStats, StorageStatus } from "../src/types/certificates.js";
import { INITIAL_CERTIFICATES } from "../src/data/initialCertificates.ts";

const DB_FILE_PATH = path.join(process.cwd(), "data_store.json");

class CertificatesStore {
  private certificates: Certificate[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, "utf8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.certificateVault) && parsed.certificateVault.length > 0) {
          this.certificates = parsed.certificateVault;
          return;
        }
      }
    } catch (err) {
      console.warn("CertificatesStore: Failed to load from file, using initial data.", err);
    }
    this.certificates = [...INITIAL_CERTIFICATES];
    this.save();
  }

  private save(): void {
    if (process.env.VERCEL || process.env.VERCEL_ENV) {
      return;
    }
    try {
      let existingData: any = {};
      if (fs.existsSync(DB_FILE_PATH)) {
        try {
          existingData = JSON.parse(fs.readFileSync(DB_FILE_PATH, "utf8"));
        } catch {
          existingData = {};
        }
      }
      existingData.certificateVault = this.certificates;
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(existingData, null, 2), "utf8");
    } catch (err) {
      console.error("CertificatesStore: Failed to persist certificates.", err);
    }
  }

  public getCertificates(filters?: {
    category?: string;
    search?: string;
    issuer?: string;
    skill?: string;
    year?: string;
    featured?: boolean;
  }): Certificate[] {
    let result = [...this.certificates];

    if (filters?.category && filters.category !== "ALL") {
      result = result.filter(c => c.category === filters.category);
    }

    if (filters?.issuer && filters.issuer !== "ALL") {
      result = result.filter(c => c.issuer.toLowerCase() === filters.issuer?.toLowerCase());
    }

    if (filters?.year && filters.year !== "ALL") {
      result = result.filter(c => c.issueDate.startsWith(filters.year!));
    }

    if (filters?.skill && filters.skill !== "ALL") {
      result = result.filter(c => c.skills.some(s => s.toLowerCase() === filters.skill?.toLowerCase()));
    }

    if (filters?.featured !== undefined) {
      result = result.filter(c => c.featured === filters.featured);
    }

    if (filters?.search && filters.search.trim() !== "") {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        c.skills.some(s => s.toLowerCase().includes(q)) ||
        (c.credentialId && c.credentialId.toLowerCase().includes(q))
      );
    }

    // Sort by issueDate descending (newest first)
    return result.sort((a, b) => b.issueDate.localeCompare(a.issueDate));
  }

  public getById(id: string): Certificate | undefined {
    return this.certificates.find(c => c.id === id);
  }

  public create(data: Omit<Certificate, "id" | "createdAt" | "updatedAt">): Certificate {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 30);
    const id = `cert-${Date.now()}-${slug}`;
    const now = new Date().toISOString();

    const newCert: Certificate = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      skills: Array.isArray(data.skills) ? data.skills : [],
      featured: Boolean(data.featured)
    };

    this.certificates.unshift(newCert);
    this.save();
    return newCert;
  }

  public update(id: string, updates: Partial<Omit<Certificate, "id" | "createdAt">>): Certificate | null {
    const index = this.certificates.findIndex(c => c.id === id);
    if (index === -1) return null;

    const existing = this.certificates[index];
    const updated: Certificate = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.certificates[index] = updated;
    this.save();
    return updated;
  }

  public delete(id: string): boolean {
    const prevLen = this.certificates.length;
    this.certificates = this.certificates.filter(c => c.id !== id);
    if (this.certificates.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  public getStats(): CertificateStats {
    const total = this.certificates.length;
    const technical = this.certificates.filter(c => c.category === "CERTIFICATIONS" || c.category === "COURSES").length;
    const competitions = this.certificates.filter(c => c.category === "COMPETITIONS").length;
    const achievements = this.certificates.filter(c => c.category === "ACHIEVEMENTS").length;

    return {
      total,
      technical,
      competitions,
      achievements
    };
  }

  public getStorageStatus(): StorageStatus {
    const hasPostgres = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
    const hasCloudStorage = Boolean(
      (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) ||
      process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.AWS_S3_BUCKET
    );

    return {
      database: hasPostgres ? "postgresql_configured" : "embedded_store_active",
      objectStorage: hasCloudStorage ? "cloud_configured" : "not_configured",
      message: hasCloudStorage
        ? "Cloud Object Storage is connected and ready for direct uploads."
        : "Cloud Object Storage is not configured. To enable cloud file uploads in production, configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or Vercel Blob) in environment variables. You can still link direct URLs for certificates."
    };
  }
}

export const certificatesStore = new CertificatesStore();
