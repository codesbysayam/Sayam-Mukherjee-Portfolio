import { SAYAM_DATA } from "../../src/data.ts";
import {
  getFirestoreDoc,
  queryFirestoreCollection,
  upsertFirestoreDoc,
} from "../services/firestoreRest.ts";

export interface PublicTestimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  approved: boolean;
  avatar: string;
  date: string;
  createdAt?: string;
}

export interface PublicPortfolioProjection {
  projects: typeof SAYAM_DATA.projects;
  blogs: typeof SAYAM_DATA.blogs;
  certifications: typeof SAYAM_DATA.certifications;
  skills: typeof SAYAM_DATA.skills;
  experience: typeof SAYAM_DATA.experience;
  achievements: typeof SAYAM_DATA.achievements;
  learningDashboard: typeof SAYAM_DATA.learningDashboard;
  stats: typeof SAYAM_DATA.stats;
  socials: typeof SAYAM_DATA.socials;
  testimonials: PublicTestimonial[];
  updatedAt?: string;
}

export const INITIAL_VERIFIED_TESTIMONIALS: PublicTestimonial[] = [
  {
    id: "test_1",
    name: "Dr. S. Panda",
    role: "Lead Researcher at KIIT AI Group",
    content:
      "Sayam has shown exceptional analytical speed. His implementation of the YOLOv8 tracking zones in the research group was highly performant, proving his capacity to digest and deploy complex ML papers rapidly.",
    approved: true,
    avatar: "",
    date: "May 2025",
  },
];

export function getBaselinePublicContent(): Omit<PublicPortfolioProjection, "testimonials"> {
  return {
    projects: SAYAM_DATA.projects,
    blogs: SAYAM_DATA.blogs,
    certifications: SAYAM_DATA.certifications,
    skills: SAYAM_DATA.skills,
    experience: SAYAM_DATA.experience,
    achievements: SAYAM_DATA.achievements,
    learningDashboard: SAYAM_DATA.learningDashboard,
    stats: SAYAM_DATA.stats,
    socials: SAYAM_DATA.socials,
    updatedAt: new Date("2026-11-18T00:00:00.000Z").toISOString(),
  };
}

export async function getPublicPortfolioProjection(): Promise<PublicPortfolioProjection> {
  const baseline = getBaselinePublicContent();

  let contentDoc: Record<string, any> | null = null;
  try {
    contentDoc = await getFirestoreDoc("portfolio_content", "public");
  } catch {
    contentDoc = null;
  }

  let approvedTestimonials: PublicTestimonial[] = [];
  try {
    const dbTestimonials = await queryFirestoreCollection<PublicTestimonial>(
      "testimonials",
      { whereEquals: { field: "approved", value: true } }
    );
    const mergedMap = new Map<string, PublicTestimonial>();
    for (const item of INITIAL_VERIFIED_TESTIMONIALS) {
      mergedMap.set(item.id, item);
    }
    for (const item of dbTestimonials) {
      if (item && item.id && item.approved === true) {
        mergedMap.set(item.id, item);
      }
    }
    approvedTestimonials = Array.from(mergedMap.values());
  } catch {
    approvedTestimonials = [...INITIAL_VERIFIED_TESTIMONIALS];
  }

  return {
    projects: contentDoc?.projects ?? baseline.projects,
    blogs: contentDoc?.blogs ?? baseline.blogs,
    certifications: contentDoc?.certifications ?? baseline.certifications,
    skills: contentDoc?.skills ?? baseline.skills,
    experience: contentDoc?.experience ?? baseline.experience,
    achievements: contentDoc?.achievements ?? baseline.achievements,
    learningDashboard: contentDoc?.learningDashboard ?? baseline.learningDashboard,
    stats: contentDoc?.stats ?? baseline.stats,
    socials: contentDoc?.socials ?? baseline.socials,
    testimonials: approvedTestimonials,
    updatedAt: contentDoc?.updatedAt ?? baseline.updatedAt,
  };
}

export async function updatePublicPortfolioContent(
  updates: Record<string, any>,
  adminBearerToken: string
): Promise<PublicPortfolioProjection> {
  const current = await getPublicPortfolioProjection();
  const nextDoc = {
    projects: updates.projects ?? current.projects,
    blogs: updates.blogs ?? current.blogs,
    certifications: updates.certifications ?? current.certifications,
    skills: updates.skills ?? current.skills,
    experience: updates.experience ?? current.experience,
    achievements: updates.achievements ?? current.achievements,
    learningDashboard: updates.learningDashboard ?? current.learningDashboard,
    stats: updates.stats ?? current.stats,
    socials: updates.socials ?? current.socials,
    updatedAt: new Date().toISOString(),
  };

  await upsertFirestoreDoc(
    "portfolio_content",
    "public",
    nextDoc,
    adminBearerToken
  );

  return {
    ...nextDoc,
    testimonials: current.testimonials,
  };
}
