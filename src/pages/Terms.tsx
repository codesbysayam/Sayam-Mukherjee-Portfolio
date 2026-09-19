import React, { useEffect, useState } from "react";
import { 
  Scale, 
  Clock, 
  Mail, 
  ArrowLeft, 
  ChevronRight, 
  Code2, 
  AlertTriangle, 
  ShieldCheck, 
  FileCheck 
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

interface Section {
  id: string;
  title: string;
}

const SECTIONS: Section[] = [
  { id: "introduction", title: "Introduction" },
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "website-use", title: "Permitted Website Use" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "portfolio-content", title: "Portfolio Content & Code" },
  { id: "external-links", title: "External Links" },
  { id: "user-submitted-info", title: "User-Submitted Information" },
  { id: "availability-accuracy", title: "Availability and Accuracy" },
  { id: "no-professional-advice", title: "No Professional Advice" },
  { id: "limitation-of-liability", title: "Limitation of Liability" },
  { id: "third-party-services", title: "Third-Party Services" },
  { id: "changes-to-terms", title: "Changes to These Terms" },
  { id: "governing-law", title: "Governing Law / Jurisdiction" },
  { id: "contact", title: "Contact Information" },
];

export default function TermsPage({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";
  const [activeSection, setActiveSection] = useState<string>("introduction");

  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 select-text">
      {/* Top Breadcrumb / Back Button */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onNavigateHome || (() => window.history.back())}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
            isLight
              ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
              : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span>Last Updated: September 19, 2026</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-850">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider mb-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Scale className="w-3.5 h-3.5" />
          <span>Terms of Service</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-zinc-900 dark:text-white">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-3xl">
          These Terms and Conditions govern your access to and browsing of Sayam Mukherjee's personal developer website and engineering ecosystem.
        </p>
      </div>

      {/* Two-Column Document Layout on Desktop, Single-Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Sticky Desktop Document Navigation Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-2 p-4 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-850">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-3 py-1 block">
            DOCUMENT INDEX
          </span>
          <nav className="space-y-1" aria-label="Terms sections">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                  activeSection === sec.id
                    ? "bg-purple-600 text-white font-semibold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                }`}
              >
                <span className="truncate">{sec.title}</span>
                <ChevronRight className="w-3 h-3 shrink-0 opacity-60" />
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Document Content */}
        <article className="lg:col-span-8 space-y-10 max-w-[760px] text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">
          
          {/* Section: Introduction */}
          <section id="introduction" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">01.</span>
              Introduction
            </h2>
            <p>
              These Terms and Conditions constitute a transparent agreement between you (the visitor) and Sayam Mukherjee regarding your use of this personal developer portfolio. Please read these terms carefully before exploring the projects, code samples, and interactive features.
            </p>
          </section>

          {/* Section: Acceptance of Terms */}
          <section id="acceptance" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">02.</span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or interacting with this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions and the accompanying Privacy Policy. If you do not agree to these terms, please discontinue use of this site.
            </p>
          </section>

          {/* Section: Permitted Website Use */}
          <section id="website-use" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">03.</span>
              Permitted Website Use
            </h2>
            <p>
              This website is made available for informational, recruitment, networking, and educational review purposes. You agree to use the site only for lawful activities and in a manner that does not infringe on the rights of or restrict anyone else's use.
            </p>
            <p>You strictly agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Engage in unauthorized automated scraping or denial-of-service attacks that impair website responsiveness.</li>
              <li>Attempt to bypass security headers, brute force administrative vault endpoints, or exploit form submissions.</li>
              <li>Inject malicious scripts, spam links, or defamatory messages into the contact form or chat interface.</li>
            </ul>
          </section>

          {/* Section: Intellectual Property */}
          <section id="intellectual-property" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">04.</span>
              Intellectual Property
            </h2>
            <p>
              Unless explicitly stated otherwise, the original design system, typography styling, written technical documentation, blog entries, and personal branding on this site are the intellectual property of Sayam Mukherjee © 2026.
            </p>
            <p>
              Third-party logos and trademarks (such as GitHub, LeetCode, Codolio, LinkedIn, React, or Python) belong to their respective owners and are referenced solely for factual identification of technological skills and online profiles.
            </p>
          </section>

          {/* Section: Portfolio Content & Code */}
          <section id="portfolio-content" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">05.</span>
              Portfolio Content &amp; Open-Source Code
            </h2>
            <p>
              Projects featured on this site (such as OPERON, MAUSAM, and SayamSolves) are hosted on public GitHub repositories. Code hosted in public repositories is governed by the specific open-source licenses (e.g., MIT, Apache 2.0) provided within their respective GitHub project repositories.
            </p>
            <div className="p-4 rounded-xl border bg-zinc-100/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-purple-400">
                <Code2 className="w-4 h-4" />
                <span>Open Source Transparency</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                You are encouraged to inspect, fork, and learn from open-source repositories linked from this site in accordance with their respective repository licenses.
              </p>
            </div>
          </section>

          {/* Section: External Links */}
          <section id="external-links" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">06.</span>
              External Links
            </h2>
            <p>
              This website provides links to external websites for convenience and verification (e.g., GitHub, LeetCode, LinkedIn, certificate issuer portals). Sayam Mukherjee has no control over the content, uptime, or privacy policies of third-party domains and assumes no responsibility for external content.
            </p>
          </section>

          {/* Section: User-Submitted Information */}
          <section id="user-submitted-info" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">07.</span>
              User-Submitted Information
            </h2>
            <p>
              When you submit messages, inquiries, or feedback through the Contact form or interactive chatbot, you represent that the details provided are accurate and that you have the right to provide them. Do not submit confidential, proprietary, or sensitive personal information through public portfolio forms.
            </p>
          </section>

          {/* Section: Availability and Accuracy */}
          <section id="availability-accuracy" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">08.</span>
              Availability and Accuracy
            </h2>
            <p>
              While reasonable efforts are made to ensure that technical details, project descriptions, and academic credentials are true, current, and verified, the site and its contents are provided on an "as is" and "as available" basis without express or implied warranties of any kind.
            </p>
          </section>

          {/* Section: No Professional Advice */}
          <section id="no-professional-advice" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">09.</span>
              No Professional Advice
            </h2>
            <p>
              Any technical blogs, architectural diagrams, algorithmic solutions, or opinions shared on this website reflect student learning notes, engineering experiments, and developer insights. They do not constitute formal legal, financial, or certified engineering consultancy advice.
            </p>
          </section>

          {/* Section: Limitation of Liability */}
          <section id="limitation-of-liability" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">10.</span>
              Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, Sayam Mukherjee shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your access to, use of, or inability to use this website, including any reliance placed on materials or code snippets found herein.
            </p>
          </section>

          {/* Section: Third-Party Services */}
          <section id="third-party-services" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">11.</span>
              Third-Party Services
            </h2>
            <p>
              Features relying on third-party cloud infrastructure (such as Vercel Edge hosting, GitHub API data snapshots, or Google Gemini AI models) are subject to external service availability and rate constraints.
            </p>
          </section>

          {/* Section: Changes to These Terms */}
          <section id="changes-to-terms" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">12.</span>
              Changes to These Terms
            </h2>
            <p>
              These Terms may be revised from time to time to align with project milestones or new website features. The effective date at the top of this page will indicate the date of the most recent revision. Continued browsing of the site constitutes acceptance of updated terms.
            </p>
          </section>

          {/* Section: Governing Law / Jurisdiction */}
          <section id="governing-law" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">13.</span>
              Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India, within the jurisdiction of West Bengal and Odisha, without regard to its conflict of law principles.
            </p>
          </section>

          {/* Section: Contact Information */}
          <section id="contact" className="space-y-3 scroll-mt-24 pt-4 border-t border-zinc-200 dark:border-zinc-850">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">14.</span>
              Contact Information
            </h2>
            <p>
              If you have any questions, inquiries, or notices regarding these Terms and Conditions, please reach out to Sayam Mukherjee directly at:
            </p>
            <div className="p-4 rounded-xl border bg-purple-500/5 border-purple-500/20 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm font-mono text-purple-400">
                <Mail className="w-4 h-4" />
                <a href="mailto:sayammukherjee1506@gmail.com" className="hover:underline">
                  sayammukherjee1506@gmail.com
                </a>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Bhubaneswar, Odisha, India</span>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
}
