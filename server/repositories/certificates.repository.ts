import { Certificate, CertificateStats, StorageStatus } from "../../src/types/certificates.ts";
import { INITIAL_CERTIFICATES } from "../../src/data/initialCertificates.ts";
import {
  deleteFirestoreDoc,
  getFirestoreDoc,
  queryFirestoreCollection,
  upsertFirestoreDoc,
} from "../services/firestoreRest.ts";
import { isEmailTransportConfigured } from "../services/email.service.ts";

type StoredCertificate = Certificate & { published?: boolean };

function normalizeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

const RETIRED_CERTIFICATE_IDS = new Set([
  "wcc-launchpad-30-shinibali-kumar",
  "comp-toycathon-2021",
  "ach-toycathon",
]);

const RETIRED_CREDENTIAL_IDS = new Set([
  "L30-F3RFRC",
  "TC-2021-FIN",
]);

function isRetiredCertificate(cert: Partial<Certificate>): boolean {
  if (cert.id && RETIRED_CERTIFICATE_IDS.has(cert.id)) return true;
  if (cert.credentialId && RETIRED_CREDENTIAL_IDS.has(cert.credentialId.trim().toUpperCase())) {
    return true;
  }
  return false;
}

async function getMergedCertificates(bearerToken?: string): Promise<StoredCertificate[]> {
  const byId = new Map<string, StoredCertificate>();
  for (const cert of INITIAL_CERTIFICATES) {
    if (!isRetiredCertificate(cert)) {
      byId.set(cert.id, { ...cert, published: true });
    }
  }

  try {
    const dbCerts = await queryFirestoreCollection<StoredCertificate>(
      "certificates",
      bearerToken
        ? { bearerToken }
        : { whereEquals: { field: "published", value: true } }
    );
    for (const cert of dbCerts) {
      if (cert && cert.id && !isRetiredCertificate(cert)) {
        byId.set(cert.id, cert);
      }
    }
  } catch {
    // Fallback to verified baseline catalog if collection has no readable overrides yet
  }

  return Array.from(byId.values()).filter(
    (c) => c.published !== false && !isRetiredCertificate(c)
  );
}

export async function listCertificates(filters?: {
  category?: string;
  search?: string;
  issuer?: string;
  skill?: string;
  year?: string;
  featured?: boolean;
}): Promise<Certificate[]> {
  let result = await getMergedCertificates();

  if (filters?.category && filters.category !== "ALL") {
    const targetCat = filters.category.toUpperCase().replace(/S$/, "");
    result = result.filter(
      (c) => c.category.toUpperCase().replace(/S$/, "") === targetCat
    );
  }
  if (filters?.issuer && filters.issuer !== "ALL") {
    result = result.filter(
      (c) => c.issuer.toLowerCase() === filters.issuer?.toLowerCase()
    );
  }
  if (filters?.year && filters.year !== "ALL") {
    result = result.filter(
      (c) =>
        (c.issueDate || "").includes(filters.year!) ||
        String(c.year || "") === filters.year!
    );
  }
  if (filters?.skill && filters.skill !== "ALL") {
    result = result.filter((c) =>
      c.skills.some((s) => s.toLowerCase() === filters.skill?.toLowerCase())
    );
  }
  if (filters?.featured !== undefined) {
    result = result.filter((c) => c.featured === filters.featured);
  }
  if (filters?.search && filters.search.trim() !== "") {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        Boolean(c.description && c.description.toLowerCase().includes(q)) ||
        Boolean(c.overview && c.overview.toLowerCase().includes(q)) ||
        Boolean(c.fullDescription && c.fullDescription.toLowerCase().includes(q)) ||
        Boolean(c.event && c.event.toLowerCase().includes(q)) ||
        Boolean(c.theme && c.theme.toLowerCase().includes(q)) ||
        Boolean(c.team && c.team.toLowerCase().includes(q)) ||
        Boolean(c.organizer && c.organizer.toLowerCase().includes(q)) ||
        Boolean(c.facilitator && c.facilitator.toLowerCase().includes(q)) ||
        Boolean(c.sessionLeader && c.sessionLeader.toLowerCase().includes(q)) ||
        Boolean(c.achievementClaim && c.achievementClaim.toLowerCase().includes(q)) ||
        Boolean(c.project && c.project.toLowerCase().includes(q)) ||
        Boolean(c.track && c.track.toLowerCase().includes(q)) ||
        c.skills.some((s) => s.toLowerCase().includes(q)) ||
        Boolean(c.credentialId && c.credentialId.toLowerCase().includes(q))
    );
  }

  return result.sort((a, b) => {
    const dateA = a.issueDate || (a.year ? String(a.year) : "");
    const dateB = b.issueDate || (b.year ? String(b.year) : "");
    if (!dateA && !dateB) return a.title.localeCompare(b.title);
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateB.localeCompare(dateA);
  });
}

export async function getCertificateById(id: string): Promise<Certificate | null> {
  const all = await getMergedCertificates();
  return all.find((c) => c.id === id || c.credentialId === id) || null;
}

export async function createCertificate(
  data: Omit<Certificate, "id" | "createdAt" | "updatedAt"> & { published?: boolean },
  adminBearerToken: string
): Promise<Certificate> {
  const slug = normalizeSlug(data.title) || "credential";
  const id = `cert-${Date.now()}-${slug}`.slice(0, 78);
  const now = new Date().toISOString();

  const newCert: StoredCertificate = {
    ...data,
    id,
    skills: Array.isArray(data.skills) ? data.skills : [],
    featured: Boolean(data.featured),
    published: data.published ?? true,
    verificationStatus: data.verificationStatus || "LINK AVAILABLE",
    createdAt: now,
    updatedAt: now,
  };

  await upsertFirestoreDoc(
    "certificates",
    id,
    newCert as unknown as Record<string, unknown>,
    adminBearerToken
  );
  return newCert;
}

export async function updateCertificate(
  id: string,
  updates: Partial<Omit<Certificate, "id" | "createdAt">> & { published?: boolean },
  adminBearerToken: string
): Promise<Certificate | null> {
  let existing: StoredCertificate | null = null;

  try {
    existing = await getFirestoreDoc<StoredCertificate>(
      "certificates",
      id,
      adminBearerToken
    );
  } catch {
    existing = null;
  }

  if (!existing) {
    const baseline = INITIAL_CERTIFICATES.find((c) => c.id === id);
    if (!baseline) return null;
    existing = { ...baseline, published: true };
  }

  const now = new Date().toISOString();
  const updated: StoredCertificate = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt || now,
    updatedAt: now,
    published: updates.published ?? existing.published ?? true,
  };

  await upsertFirestoreDoc(
    "certificates",
    id,
    updated as unknown as Record<string, unknown>,
    adminBearerToken
  );
  return updated;
}

export async function deleteCertificate(
  id: string,
  adminBearerToken: string
): Promise<boolean> {
  const baseline = INITIAL_CERTIFICATES.find((c) => c.id === id);
  if (baseline) {
    // Tombstone baseline catalog item as unpublished in Firestore
    const tombstone: StoredCertificate = {
      ...baseline,
      published: false,
      updatedAt: new Date().toISOString(),
    };
    await upsertFirestoreDoc(
      "certificates",
      id,
      tombstone as unknown as Record<string, unknown>,
      adminBearerToken
    );
    return true;
  }

  return deleteFirestoreDoc("certificates", id, adminBearerToken);
}

export async function getCertificateStats(): Promise<CertificateStats> {
  const list = await getMergedCertificates();
  return {
    total: list.length,
    technical: list.filter((c) => {
      const cat = c.category.toUpperCase();
      return cat === "CERTIFICATIONS" || cat === "COURSES";
    }).length,
    competitions: list.filter(
      (c) => c.category.toUpperCase() === "COMPETITIONS"
    ).length,
    achievements: list.filter(
      (c) => c.category.toUpperCase() === "ACHIEVEMENTS"
    ).length,
    academic: list.filter(
      (c) => c.category.toUpperCase() === "ACADEMIC RECORD"
    ).length,
  };
}

export function getCertificateStorageStatus(): StorageStatus {
  const emailConfigured = isEmailTransportConfigured();
  return {
    database: "firestore_active",
    objectStorage: emailConfigured ? "configured" : "direct_url_mode",
    message:
      "Credentials vault is backed by Cloud Firestore with strict schema validation and role-gated administrative updates.",
  };
}
