import { CANONICAL_DOMAIN } from "../config/seo";

/**
 * Valid Schema.org structured data types for Sayam Mukherjee's Portfolio.
 * Validated against Schema.org specification for Person, WebSite, and ProfilePage.
 */

export interface SchemaGraph {
  "@context": string;
  "@graph": Array<Record<string, unknown>>;
}

/**
 * Generates the Schema.org Person definition for Sayam Mukherjee.
 */
export function getPersonSchema(domain: string = CANONICAL_DOMAIN): Record<string, unknown> {
  return {
    "@type": "Person",
    "@id": `${domain}/#person`,
    "name": "Sayam Mukherjee",
    "givenName": "Sayam",
    "familyName": "Mukherjee",
    "jobTitle": "AI & ML Undergraduate · Software Engineer",
    "description":
      "Computer Science Engineering undergraduate specializing in Artificial Intelligence, Machine Learning, Computer Vision, and scalable full-stack software development.",
    "url": domain,
    "image": `${domain}/og-image.png`,
    "email": "mailto:sayammukherjee700@gmail.com",
    "affiliation": {
      "@type": "CollegeOrUniversity",
      "name": "Kalinga Institute of Industrial Technology, Bhubaneswar",
      "url": "https://kiit.ac.in",
    },
    "sameAs": [
      "https://github.com/codesbysayam",
      "https://www.linkedin.com/in/sayammukherjee-portfolio/",
      "https://leetcode.com/u/codesbysayam/",
      "https://codolio.com/profile/codesbysayam",
      "https://www.youtube.com/@ObsidianOptics_in",
    ],
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "Computer Vision",
      "PyTorch",
      "YOLOv8",
      "TypeScript",
      "React",
      "C++",
      "Python",
      "Edge Computing",
      "Data Structures and Algorithms",
      "Full-Stack Development",
    ],
  };
}

/**
 * Generates the Schema.org WebSite definition for sayammukherjee.in.
 */
export function getWebSiteSchema(domain: string = CANONICAL_DOMAIN): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": `${domain}/#website`,
    "url": domain,
    "name": "Sayam Mukherjee | Portfolio",
    "alternateName": "Sayam Mukherjee Engineering Portfolio",
    "description":
      "Personal engineering portfolio of Sayam Mukherjee. Undergraduate in Computer Science Engineering (AI & ML) building scalable systems, computer vision, and verified open-source software.",
    "inLanguage": "en",
    "publisher": {
      "@id": `${domain}/#person`,
    },
  };
}

/**
 * Generates the Schema.org ProfilePage schema linking to Person.
 */
export function getProfilePageSchema(domain: string = CANONICAL_DOMAIN): Record<string, unknown> {
  return {
    "@type": "ProfilePage",
    "@id": `${domain}/#profilepage`,
    "url": domain,
    "name": "Sayam Mukherjee - Engineering Profile",
    "isPartOf": {
      "@id": `${domain}/#website`,
    },
    "mainEntity": {
      "@id": `${domain}/#person`,
    },
  };
}

/**
 * Generates a BreadcrumbList schema for navigation and deep routes.
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

/**
 * Comprehensive JSON-LD structured data graph for the homepage.
 */
export function getHomeStructuredData(domain: string = CANONICAL_DOMAIN): SchemaGraph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      getPersonSchema(domain),
      getWebSiteSchema(domain),
      getProfilePageSchema(domain),
    ],
  };
}
