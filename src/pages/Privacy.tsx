import React, { useEffect, useState } from "react";
import { 
  Shield, 
  Clock, 
  Mail, 
  ArrowLeft, 
  ExternalLink, 
  Lock, 
  Database, 
  Server, 
  CheckCircle2, 
  FileText,
  ChevronRight
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

interface Section {
  id: string;
  title: string;
}

const SECTIONS: Section[] = [
  { id: "introduction", title: "Introduction" },
  { id: "information-we-collect", title: "Information We Collect" },
  { id: "information-you-provide", title: "Information You Provide" },
  { id: "automatically-collected", title: "Automatically Collected Data" },
  { id: "analytics", title: "Analytics & Telemetry" },
  { id: "cookies-local-storage", title: "Cookies & Local Storage" },
  { id: "external-links", title: "External Links & Services" },
  { id: "how-information-is-used", title: "How Information Is Used" },
  { id: "data-retention", title: "Data Retention" },
  { id: "data-security", title: "Data Security" },
  { id: "third-party-services", title: "Third-Party Services" },
  { id: "your-rights-choices", title: "Your Rights and Choices" },
  { id: "childrens-privacy", title: "Children's Privacy" },
  { id: "policy-updates", title: "Policy Updates" },
  { id: "contact", title: "Contact Information" },
];

export default function PrivacyPage({ onNavigateHome }: { onNavigateHome?: () => void }) {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider mb-3 bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Legal Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-zinc-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-3xl">
          This policy transparently explains how Sayam Mukherjee's personal engineering portfolio collects, manages, and protects user information. This site operates with minimal data collection principles.
        </p>
      </div>

      {/* Two-Column Document Layout on Desktop, Single-Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Sticky Desktop Document Navigation Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-2 p-4 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-850">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-3 py-1 block">
            DOCUMENT INDEX
          </span>
          <nav className="space-y-1" aria-label="Privacy sections">
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
              Welcome to the personal website and software portfolio of Sayam Mukherjee (<a href="https://github.com/codesbysayam" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">codesbysayam</a>). I respect your privacy and am committed to maintaining complete transparency regarding how data is handled when you browse this site.
            </p>
            <p>
              This website is an engineering showcase designed to demonstrate technical projects, verifiable open-source contributions, algorithmic problem-solving, and academic credentials. It does not sell products, serve commercial ads, monetize visitor data, or track users across external sites.
            </p>
          </section>

          {/* Section: Information We Collect */}
          <section id="information-we-collect" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">02.</span>
              Information We Collect
            </h2>
            <p>
              Data collection on this portfolio is kept strictly to the functional minimum required to deliver a responsive, accessible user experience and facilitate professional inquiries.
            </p>
          </section>

          {/* Section: Information You Provide */}
          <section id="information-you-provide" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">03.</span>
              Information You Provide Voluntarily
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Contact Form Messages:</strong> When you choose to reach out via the Contact form, you provide your name, email address, and message text. This information is processed exclusively to read and reply to your communication.
              </li>
              <li>
                <strong>Interactive Assistant Prompts:</strong> If you test the interactive AI Representative chat assistant, your message prompts are sent to our server endpoint solely to formulate a relevant reply regarding Sayam's projects and toolkit.
              </li>
              <li>
                <strong>Owner Administrative Passkey:</strong> For administrative management of the Certificate Vault, an owner passkey is verified server-side. Regular visitors are not prompted for credentials.
              </li>
            </ul>
          </section>

          {/* Section: Automatically Collected Information */}
          <section id="automatically-collected" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">04.</span>
              Automatically Collected Information
            </h2>
            <p>
              When you load the portfolio, standard web protocol headers and browser capabilities are evaluated purely client-side to ensure proper rendering:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Viewport dimensions and device orientation to adapt CSS layout.</li>
              <li>Reduced motion preferences (<code>prefers-reduced-motion</code>) to disable intensive animations automatically.</li>
              <li>System dark or light mode preference to initialize the corresponding visual theme.</li>
            </ul>
          </section>

          {/* Section: Analytics & Telemetry */}
          <section id="analytics" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">05.</span>
              Analytics &amp; Visitor Telemetry
            </h2>
            <p>
              This website uses privacy-first, cookieless web analytics powered by Vercel Web Analytics to track high-level aggregate trends (such as page views, referrer domains, and country-level geographic distribution).
            </p>
            <div className="p-4 rounded-xl border bg-zinc-100/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Cookies · Zero Personal Identification</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Vercel Web Analytics does not use cookies, does not store IP addresses, and does not track visitors across sessions or across other websites. All data is aggregated and anonymized.
              </p>
            </div>
          </section>

          {/* Section: Cookies and Local Storage */}
          <section id="cookies-local-storage" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">06.</span>
              Cookies and Local Storage
            </h2>
            <p>
              This site does <strong>not</strong> use advertising cookies, marketing pixels, or third-party behavioral trackers.
            </p>
            <p>
              We utilize browser <code>localStorage</code> purely for client-side functionality and performance:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs font-mono">
              <li><code>sayam_theme</code>: Saves your preferred Dark or Light interface mode.</li>
              <li><code>sayam_cookie_consent</code>: Stores your cookie and telemetry consent decision.</li>
              <li><code>github:snapshot</code>: Caches verified public repository summaries to prevent rate limits.</li>
            </ul>
            <p className="text-xs text-zinc-500 pt-1">
              You can clear your browser's local storage at any time through your browser developer tools or settings without breaking core reading functionality.
            </p>
          </section>

          {/* Section: External Links */}
          <section id="external-links" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">07.</span>
              External Links &amp; Third-Party Services
            </h2>
            <p>
              This portfolio links to external services and developer platforms, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>GitHub (github.com/codesbysayam)</li>
              <li>LinkedIn (linkedin.com/in/codesbysayam)</li>
              <li>LeetCode (leetcode.com/u/sayammukherjee/)</li>
              <li>Codolio (codolio.com/profile/codesbysayam)</li>
              <li>YouTube (youtube.com/@codesbysayam)</li>
            </ul>
            <p>
              Once you click an external link, you are subject to that third party's privacy policy. We encourage you to review their respective privacy practices.
            </p>
          </section>

          {/* Section: How Information Is Used */}
          <section id="how-information-is-used" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">08.</span>
              How Information Is Used
            </h2>
            <p>Any information collected or received is used solely to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Respond directly to professional, academic, or collaboration inquiries sent via email or the contact form.</li>
              <li>Deliver smooth client-side theme transitions and responsive layouts.</li>
              <li>Protect the website from automated bot abuse, spam submissions, or denial-of-service attempts.</li>
            </ul>
          </section>

          {/* Section: Data Retention */}
          <section id="data-retention" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">09.</span>
              Data Retention
            </h2>
            <p>
              We do not maintain a permanent marketing or commercial mailing list. Inquiries received via email are retained only for as long as necessary to conduct professional correspondence. You may request the deletion of any communication history at any time.
            </p>
          </section>

          {/* Section: Data Security */}
          <section id="data-security" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">10.</span>
              Data Security
            </h2>
            <p>
              We maintain security through industry-standard practices:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>HTTPS Encryption:</strong> All traffic is encrypted in transit using modern TLS/SSL certificates and Strict-Transport-Security (HSTS).</li>
              <li><strong>Zero Frontend Secrets:</strong> API credentials and keys are isolated on backend servers and are never bundled or exposed in client JavaScript.</li>
              <li><strong>Security Headers:</strong> Deployment configurations enforce Content-Security-Policy, X-Content-Type-Options (nosniff), and X-Frame-Options (SAMEORIGIN).</li>
            </ul>
          </section>

          {/* Section: Third-Party Services */}
          <section id="third-party-services" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">11.</span>
              Third-Party Service Providers
            </h2>
            <p>
              To host and maintain this website, we rely on established cloud infrastructure providers:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Vercel / Cloud Run:</strong> Secure hosting, static asset delivery, and edge network routing.</li>
              <li><strong>GitHub:</strong> Hosting open-source project code repositories and public build feeds.</li>
            </ul>
          </section>

          {/* Section: Your Rights and Choices */}
          <section id="your-rights-choices" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">12.</span>
              Your Rights and Choices
            </h2>
            <p>
              Regardless of your geographic location, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Browse this entire website anonymously without creating an account or providing personal details.</li>
              <li>Adjust your visual and telemetry preferences at any time via the Cookie and Privacy banner or footer settings.</li>
              <li>Request the review or deletion of any email correspondence you have sent to Sayam Mukherjee.</li>
            </ul>
          </section>

          {/* Section: Children's Privacy */}
          <section id="childrens-privacy" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">13.</span>
              Children's Privacy
            </h2>
            <p>
              This website is an engineering portfolio directed at adult software professionals, recruiters, and university peers. It does not knowingly collect personal identifiable information from children under the age of 13. If you believe such information was submitted, please contact us immediately for prompt deletion.
            </p>
          </section>

          {/* Section: Policy Updates */}
          <section id="policy-updates" className="space-y-3 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">14.</span>
              Policy Updates
            </h2>
            <p>
              This Privacy Policy may be updated periodically to reflect changes in site functionality or applicable regulations. Any revisions will be posted directly to this page with an updated revision date.
            </p>
          </section>

          {/* Section: Contact Information */}
          <section id="contact" className="space-y-3 scroll-mt-24 pt-4 border-t border-zinc-200 dark:border-zinc-850">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="text-purple-400 font-mono text-sm">15.</span>
              Contact Information
            </h2>
            <p>
              For any questions, concerns, or requests regarding this Privacy Policy or your data, please contact Sayam Mukherjee directly at:
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
