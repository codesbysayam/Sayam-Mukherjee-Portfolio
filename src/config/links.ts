/**
 * Centralized External and Internal Links Registry
 * All URLs and social handles must be referenced from this registry to prevent dead links.
 */

export const LINKS = {
  // Primary Developer Profiles
  github: "https://github.com/codesbysayam",
  linkedin: "https://www.linkedin.com/in/sayam-mukherjee-b96209324/",
  leetcode: "https://leetcode.com/u/sayammukherjee/",
  codolio: "https://codolio.com/profile/codesbysayam",
  youtube: "https://youtube.com/@technicalaz",
  instagram: "https://www.instagram.com/_.wrick._/",
  fiverr: "https://www.fiverr.com/",

  // Contact Information
  email: "mailto:sayammukherjee1506@gmail.com",
  contactEmail: "sayammukherjee1506@gmail.com",
  secondaryEmail: "wrickbusiness@gmail.com",

  // Verified Public GitHub Repositories
  projects: {
    operon: "https://github.com/codesbysayam/operon",
    mausam: "https://github.com/codesbysayam/mausam",
    portfolio: "https://github.com/codesbysayam/codesbysayam",
    sayamSolves: "https://github.com/codesbysayam/sayam-solves",
    yoloVision: "https://github.com/codesbysayam",
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
