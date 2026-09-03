import React, { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  imageUrl?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  schemaType?: "Person" | "WebSite" | "TechArticle" | "CreativeWork";
  schemaData?: any;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Sayam Mukherjee - AI & ML Developer Portfolio Node",
  description = "Portfolio of Sayam Mukherjee, Computer Science student at Techno Main Salt Lake (TMSL). AI Developer, Full Stack Engineer, Content Creator, and Freelancer.",
  keywords = "Sayam Mukherjee, AI Student, Machine Learning Engineer, Techno Main Salt Lake, TMSL, Full Stack Developer, Kolkata Developer",
  canonicalUrl = "https://sayammukherjee.com",
  imageUrl = "https://picsum.photos/seed/sayam-portfolio/1200/630",
  type = "website",
  author = "Sayam Mukherjee",
  schemaType = "Person",
  schemaData,
}) => {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Selectors for standard meta tags
    const updateMetaTag = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        const match = selector.match(/\[([^=]+)=["']?([^"']+)["']?\]/);
        if (match) {
          element.setAttribute(match[1], match[2]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // Standard Tags
    updateMetaTag('meta[name="description"]', "content", description);
    updateMetaTag('meta[name="keywords"]', "content", keywords);
    updateMetaTag('meta[name="author"]', "content", author);

    // Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // Open Graph Tags
    updateMetaTag('meta[property="og:title"]', "content", title);
    updateMetaTag('meta[property="og:description"]', "content", description);
    updateMetaTag('meta[property="og:type"]', "content", type);
    updateMetaTag('meta[property="og:url"]', "content", canonicalUrl);
    updateMetaTag('meta[property="og:image"]', "content", imageUrl);
    updateMetaTag('meta[property="og:site_name"]', "content", "Sayam Mukherjee Hub");

    // Twitter Card Tags
    updateMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
    updateMetaTag('meta[name="twitter:creator"]', "content", "@sayam_mukherjee");
    updateMetaTag('meta[name="twitter:title"]', "content", title);
    updateMetaTag('meta[name="twitter:description"]', "content", description);
    updateMetaTag('meta[name="twitter:image"]', "content", imageUrl);

    // Schema.org Structured Data
    let schemaScript = document.getElementById("structured-data-schema") as HTMLScriptElement;
    if (schemaScript) {
      schemaScript.remove();
    }

    schemaScript = document.createElement("script");
    schemaScript.id = "structured-data-schema";
    schemaScript.type = "application/ld+json";

    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "name": "Sayam Mukherjee",
      "jobTitle": "AI & ML Specialist Student & Full Stack Web Engineer",
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Techno Main Salt Lake (TMSL)"
      },
      "url": canonicalUrl,
      "image": imageUrl,
      "sameAs": [
        "https://github.com/codesbysayam",
        "https://www.linkedin.com/in/sayam-mukherjee-b96209324/",
        "https://www.instagram.com/_.wrick._/"
      ],
      "knowsAbout": [
        "Computer Vision",
        "Machine Learning",
        "Deep Learning",
        "React",
        "Node.js",
        "TypeScript",
        "UI Psychology"
      ]
    };

    schemaScript.innerHTML = JSON.stringify(schemaData || defaultSchema);
    document.head.appendChild(schemaScript);

  }, [title, description, keywords, canonicalUrl, imageUrl, type, author, schemaType, schemaData]);

  return null;
};
export default SEO;
