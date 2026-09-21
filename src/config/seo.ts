/**
 * Centralized SEO Metadata Registry
 * Provides route-specific meta titles, descriptions, canonical URLs, and OpenGraph/Twitter card tags.
 */

export interface RouteSEO {
  title: string;
  description: string;
  canonicalPath: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  twitterTitle: string;
  twitterDescription: string;
}

export const CANONICAL_DOMAIN = "https://sayammukherjee.in";

export const SEO_CONFIG: Record<string, RouteSEO> = {
  home: {
    title: "Sayam Mukherjee — AI & ML Student | Full-Stack Developer",
    description: "Personal engineering portfolio of Sayam Mukherjee. Undergraduate in Computer Science Engineering (AI & ML) building scalable systems, computer vision, and verified open-source software.",
    canonicalPath: "/",
    robots: "index, follow",
    ogTitle: "Sayam Mukherjee — AI & ML Student | Full-Stack Developer",
    ogDescription: "Undergraduate software developer focusing on AI, full-stack architectures, and algorithms. Explore verified projects and live telemetry.",
    ogType: "website",
    twitterTitle: "Sayam Mukherjee — AI & ML Student | Full-Stack Developer",
    twitterDescription: "Explore verified projects, computer vision models, and engineering systems by Sayam Mukherjee."
  },
  about: {
    title: "About Sayam Mukherjee — AI & ML & Software Engineering",
    description: "Learn about Sayam Mukherjee's background, education at Kalinga Institute of Industrial Technology, engineering philosophy, and structured daily routine.",
    canonicalPath: "/about",
    robots: "index, follow",
    ogTitle: "About Sayam Mukherjee — Background & Education",
    ogDescription: "2nd Year CSE Undergraduate specializing in AI & Machine Learning. Academic journey, experience, and verified technical discipline.",
    ogType: "profile",
    twitterTitle: "About Sayam Mukherjee — AI & ML Student",
    twitterDescription: "Academic journey, disciplined routine, and software engineering philosophy of Sayam Mukherjee."
  },
  skills: {
    title: "Skills & Engineering Stack — Sayam Mukherjee",
    description: "Comprehensive breakdown of Sayam Mukherjee's technical toolkit: Python, C++, TypeScript, PyTorch, YOLOv8, React, PostgreSQL, and Linux systems.",
    canonicalPath: "/skills",
    robots: "index, follow",
    ogTitle: "Skills & Technical Stack — Sayam Mukherjee",
    ogDescription: "Verified toolkit across AI/ML, Full-Stack Development, Algorithmic Problem Solving, and Cloud Infrastructure.",
    ogType: "website",
    twitterTitle: "Skills & Stack — Sayam Mukherjee",
    twitterDescription: "PyTorch, C++, React, TypeScript, and AI engineering stack by Sayam Mukherjee."
  },
  ecosystem: {
    title: "System Ecosystem & Architecture — Sayam Mukherjee",
    description: "Interactive system architecture map displaying active services, edge deployment pipelines, and telemetry flow across Sayam's software stack.",
    canonicalPath: "/ecosystem",
    robots: "index, follow",
    ogTitle: "System Ecosystem & Architecture — Sayam Mukherjee",
    ogDescription: "Architectural overview of operational systems, edge nodes, APIs, and cloud services.",
    ogType: "website",
    twitterTitle: "System Ecosystem — Sayam Mukherjee",
    twitterDescription: "Interactive architecture and real-time telemetry ecosystem."
  },
  projects: {
    title: "Projects — Sayam Mukherjee",
    description: "Explore verified real-world projects by Sayam Mukherjee, including OPERON (Autonomous Operations), MAUSAM (Weather & AQI), and YOLOv8 Edge Vision.",
    canonicalPath: "/projects",
    robots: "index, follow",
    ogTitle: "Projects & Engineering Work — Sayam Mukherjee",
    ogDescription: "Autonomous platforms, climate telemetry dashboards, and computer vision models with verified GitHub repositories.",
    ogType: "website",
    twitterTitle: "Projects — Sayam Mukherjee",
    twitterDescription: "Real-world engineering projects: OPERON, MAUSAM, and computer vision models."
  },
  certificates: {
    title: "Credentials & Certifications — Sayam Mukherjee",
    description: "Verified certifications, academic honors, and credentials earned by Sayam Mukherjee across machine learning, software development, and computer science.",
    canonicalPath: "/certificates",
    robots: "index, follow",
    ogTitle: "Verified Credentials & Certifications — Sayam Mukherjee",
    ogDescription: "Verifiable certificates and academic credentials in AI/ML and software engineering.",
    ogType: "website",
    twitterTitle: "Credentials & Certifications — Sayam Mukherjee",
    twitterDescription: "Verified academic and technical certifications of Sayam Mukherjee."
  },
  journal: {
    title: "Engineering Journal — Sayam Mukherjee",
    description: "Technical writings, architectural post-mortems, and engineering insights by Sayam Mukherjee on algorithms, AI models, and software design.",
    canonicalPath: "/journal",
    robots: "index, follow",
    ogTitle: "Engineering Journal & Articles — Sayam Mukherjee",
    ogDescription: "Technical reflections on algorithmic mastery, full-stack systems, and machine learning architectures.",
    ogType: "article",
    twitterTitle: "Engineering Journal — Sayam Mukherjee",
    twitterDescription: "Technical reflections and articles on software engineering and AI."
  },
  contact: {
    title: "Contact Sayam Mukherjee — Let's Build Something",
    description: "Get in touch with Sayam Mukherjee for internship opportunities, technical collaborations, open-source projects, or software inquiries.",
    canonicalPath: "/contact",
    robots: "index, follow",
    ogTitle: "Contact Sayam Mukherjee — Professional Inquiries",
    ogDescription: "Reach out to discuss software engineering, machine learning projects, or professional opportunities.",
    ogType: "website",
    twitterTitle: "Contact Sayam Mukherjee",
    twitterDescription: "Connect with Sayam Mukherjee for collaborations and software engineering inquiries."
  },
  privacy: {
    title: "Privacy Policy — Sayam Mukherjee",
    description: "Read the privacy policy for Sayam Mukherjee's personal portfolio website.",
    canonicalPath: "/privacy",
    robots: "index, follow",
    ogTitle: "Privacy Policy — Sayam Mukherjee",
    ogDescription: "Read the privacy policy for Sayam Mukherjee's personal portfolio website.",
    ogType: "website",
    twitterTitle: "Privacy Policy — Sayam Mukherjee",
    twitterDescription: "Read the privacy policy for Sayam Mukherjee's personal portfolio website."
  },
  terms: {
    title: "Terms & Conditions — Sayam Mukherjee",
    description: "Read the terms and conditions governing use of Sayam Mukherjee's personal portfolio website.",
    canonicalPath: "/terms",
    robots: "index, follow",
    ogTitle: "Terms & Conditions — Sayam Mukherjee",
    ogDescription: "Read the terms and conditions governing use of Sayam Mukherjee's personal portfolio website.",
    ogType: "website",
    twitterTitle: "Terms & Conditions — Sayam Mukherjee",
    twitterDescription: "Read the terms and conditions governing use of Sayam Mukherjee's personal portfolio website."
  },
  "404": {
    title: "Page Not Found (404) — Sayam Mukherjee",
    description: "The requested route was not found on Sayam Mukherjee's engineering portfolio.",
    canonicalPath: "/404",
    robots: "noindex, nofollow",
    ogTitle: "404 · Page Not Found — Sayam Mukherjee",
    ogDescription: "The requested route does not exist. Explore projects or return to the portfolio home.",
    ogType: "website",
    twitterTitle: "404 · Page Not Found",
    twitterDescription: "Requested page not found on Sayam Mukherjee's portfolio."
  },
  notFound: {
    title: "Page Not Found (404) — Sayam Mukherjee",
    description: "The requested route was not found on Sayam Mukherjee's engineering portfolio.",
    canonicalPath: "/not-found",
    robots: "noindex, nofollow",
    ogTitle: "404 · Page Not Found — Sayam Mukherjee",
    ogDescription: "The requested route does not exist. Explore projects or return to the portfolio home.",
    ogType: "website",
    twitterTitle: "404 · Page Not Found",
    twitterDescription: "Requested page not found on Sayam Mukherjee's portfolio."
  }
};

export default SEO_CONFIG;
