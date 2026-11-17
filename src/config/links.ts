/**
 * Centralized External and Internal Links Registry
 * All URLs and social handles must be referenced from this registry to prevent dead links.
 */

import { RESUME_URL, RESUME_CONFIG } from "./resume";

export { RESUME_URL, RESUME_CONFIG };

export const LINKS = {
  // Resume / CV Document (Authoritative destination)
  resume: RESUME_URL,

  // Primary Developer Profiles
  github: "https://github.com/codesbysayam",
  linkedin: "https://www.linkedin.com/in/sayammukherjee-portfolio/",
  leetcode: "https://leetcode.com/u/codesbysayam/",
  codolio: "https://codolio.com/profile/codesbysayam",
  youtube: "https://www.youtube.com/@ObsidianOptics_in",
  instagram: "https://www.instagram.com/_.wrick._/",
  fiverr: "https://www.fiverr.com/",

  // Contact Information
  email: "mailto:sayammukherjee1506@gmail.com",
  contactEmail: "sayammukherjee1506@gmail.com",
  secondaryEmail: "wrickbusiness@gmail.com",

  // Verified Public GitHub Repositories
  projects: {
    operon: "https://github.com/codesbysayam/Operon",
    mausam: "https://github.com/codesbysayam/mausam_sample",
    sightforge: "https://github.com/codesbysayam/SightForge",
    memoryInMotion: "https://github.com/codesbysayam/Memory-in-Motion",
    axiom: "https://github.com/codesbysayam/AXIOM",
    inkloom: "https://github.com/codesbysayam/inkloom",
    campusConnect: "https://github.com/codesbysayam/CAMPUSCONNECT_1273",
    sayamSolves: "https://github.com/codesbysayam/sayam-solves",
    portfolioRepo: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
    allRepos: "https://github.com/codesbysayam?tab=repositories"
  },

  // Internal Routes
  routes: {
    home: "/",
    about: "/about",
    skills: "/skills",
    ecosystem: "/ecosystem",
    projects: "/projects",
    certificates: "/certificates",
    journal: "/journal",
    contact: "/contact",
    privacy: "/privacy",
    terms: "/terms",
    notFound: "/not-found"
  }
} as const;

export default LINKS;
