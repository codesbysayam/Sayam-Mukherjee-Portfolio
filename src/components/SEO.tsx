import React, { useEffect } from "react";
import { SEO_CONFIG, CANONICAL_DOMAIN, RouteSEO } from "../config/seo";

export interface SEOProps {
  routeKey?: string;
  title?: string;
  description?: string;
  canonicalPath?: string;
  robots?: string;
  imageUrl?: string;
  ogType?: string;
}

export function useRouteSEO(routeKey: string) {
  useEffect(() => {
    const config: RouteSEO = SEO_CONFIG[routeKey] || SEO_CONFIG.home;
    const origin = typeof window !== "undefined" ? window.location.origin : CANONICAL_DOMAIN;
    const canonicalUrl = `${origin}${config.canonicalPath}`;
    const imageUrl = `${origin}/og-image.png`;

    // 1. Update document title
    document.title = config.title;

    // Helper to create or update meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attributeName, attributeValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Standard Meta Tags
    setMetaTag("name", "description", config.description);
    setMetaTag("name", "robots", config.robots);
    setMetaTag("name", "author", "Sayam Mukherjee");

    // Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // OpenGraph Meta Tags
    setMetaTag("property", "og:title", config.ogTitle);
    setMetaTag("property", "og:description", config.ogDescription);
    setMetaTag("property", "og:type", config.ogType);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:image", imageUrl);
    setMetaTag("property", "og:image:width", "1200");
    setMetaTag("property", "og:image:height", "630");
    setMetaTag("property", "og:site_name", "Sayam Mukherjee — Portfolio");

    // Twitter Card Meta Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", config.twitterTitle);
    setMetaTag("name", "twitter:description", config.twitterDescription);
    setMetaTag("name", "twitter:image", imageUrl);

    // Structured Data (JSON-LD)
    let schemaScript = document.getElementById("structured-data-schema") as HTMLScriptElement;
    if (schemaScript) {
      schemaScript.remove();
    }

    schemaScript = document.createElement("script");
    schemaScript.id = "structured-data-schema";
    schemaScript.type = "application/ld+json";

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Sayam Mukherjee",
      "jobTitle": "Undergraduate Student · AI & ML Developer",
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Kalinga Institute of Industrial Technology, Bhubaneswar"
      },
      "url": canonicalUrl,
      "image": imageUrl,
      "sameAs": [
        "https://github.com/codesbysayam",
        "https://www.linkedin.com/in/sayam-mukherjee-b96209324/",
        "https://leetcode.com/u/sayammukherjee/",
        "https://codolio.com/profile/codesbysayam"
      ],
      "knowsAbout": [
        "Artificial Intelligence",
        "Machine Learning",
        "Computer Vision",
        "React",
        "TypeScript",
        "C++",
        "Python"
      ]
    };

    schemaScript.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(schemaScript);

  }, [routeKey]);
}

export const SEO: React.FC<SEOProps> = ({ routeKey = "home" }) => {
  useRouteSEO(routeKey);
  return null;
};

export default SEO;
