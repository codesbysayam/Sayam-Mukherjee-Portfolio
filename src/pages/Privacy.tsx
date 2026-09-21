import React from "react";
import LegalDocumentLayout, {
  TOCSection,
} from "../components/legal/LegalDocumentLayout";
import LegalSection from "../components/legal/LegalSection";

interface PrivacyPageProps {
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: "privacy" | "terms" | "contact") => void;
}

const PRIVACY_SECTIONS: TOCSection[] = [
  { id: "introduction", number: "01", title: "Introduction" },
  { id: "information-we-collect", number: "02", title: "Information We Collect" },
  { id: "information-you-provide", number: "03", title: "Information You Provide" },
  { id: "automatically-collected", number: "04", title: "Automatically Collected Information" },
  { id: "analytics", number: "05", title: "Analytics & Usage Metrics" },
  { id: "cookies-local-storage", number: "06", title: "Cookies & Local Storage" },
  { id: "external-links", number: "07", title: "External Links & Third-Party Services" },
  { id: "how-information-is-used", number: "08", title: "How Information Is Used" },
  { id: "data-retention", number: "09", title: "Data Retention" },
  { id: "data-security", number: "10", title: "Data Security" },
  { id: "your-rights-choices", number: "11", title: "Your Rights & Choices" },
  { id: "childrens-privacy", number: "12", title: "Children's Privacy" },
  { id: "changes-to-this-policy", number: "13", title: "Changes to This Policy" },
  { id: "contact", number: "14", title: "Contact Information" },
];

export const Privacy: React.FC<PrivacyPageProps> = ({
  onNavigateHome,
  onNavigateTab,
}) => {
  return (
    <LegalDocumentLayout
      eyebrow="LEGAL"
      title="Privacy Policy"
      lastUpdated="September 21, 2026"
      intro="This policy outlines how limited personal information and browser storage are handled when visiting this personal software engineering portfolio."
      sections={PRIVACY_SECTIONS}
      onNavigateHome={onNavigateHome}
      onNavigateTab={onNavigateTab}
    >
      {/* 01 Introduction */}
      <LegalSection id="introduction" number="01" title="Introduction">
        <p>
          Sayam Mukherjee operates this personal developer portfolio website to present
          software engineering projects, technical research, academic background, and
          professional contact pathways.
        </p>
        <p>
          Respect for visitor privacy is a fundamental design principle of this website.
          This document explains what limited technical information is processed when you browse
          the site, how that data is used, and what choices you have regarding your information.
        </p>
      </LegalSection>

      {/* 02 Information We Collect */}
      <LegalSection id="information-we-collect" number="02" title="Information We Collect">
        <p>
          We differentiate between two basic categories of data:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
          <li>
            <strong>Information you provide voluntarily:</strong> Data you choose to send when
            submitting a message through the contact form or sending an email directly.
          </li>
          <li>
            <strong>Technical information generated automatically:</strong> Standard network and
            device data transmitted by your browser to web servers during normal page requests.
          </li>
        </ul>
        <p>
          This website does not require public user registration, does not create visitor accounts,
          and does not participate in cross-site behavioral advertising networks or commercial data broker exchanges.
        </p>
      </LegalSection>

      {/* 03 Information You Provide */}
      <LegalSection id="information-you-provide" number="03" title="Information You Provide">
        <p>
          When you use the contact form on this website or reach out by email, you may share:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-zinc-700 dark:text-zinc-300">
          <li>Your full or professional name</li>
          <li>Your contact email address</li>
          <li>The subject or project service of interest</li>
          <li>The contents of your message</li>
        </ul>
        <p>
          This information is used solely to read, evaluate, and respond to your inquiry,
          collaboration request, or employment communication. Your contact information is never
          sold, leased, or distributed to marketing third parties.
        </p>
      </LegalSection>

      {/* 04 Automatically Collected Information */}
      <LegalSection id="automatically-collected" number="04" title="Automatically Collected Information">
        <p>
          Like virtually all web applications, hosting infrastructure and edge delivery networks (such
          as Vercel) process standard HTTP request headers and access logs. These may include:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-zinc-700 dark:text-zinc-300">
          <li>Internet Protocol (IP) address (frequently truncated or anonymized at edge gateways)</li>
          <li>Browser user agent, browser engine version, and operating system</li>
          <li>Requested URL, HTTP status code, and referral source</li>
          <li>Date, time, and transfer payload size of the request</li>
        </ul>
        <p>
          This data is part of standard internet protocol architecture required to route web traffic,
          mitigate denial-of-service attempts, detect operational bugs, and safeguard server
          reliability.
        </p>
      </LegalSection>

      {/* 05 Analytics & Usage Metrics */}
      <LegalSection id="analytics" number="05" title="Analytics & Usage Metrics">
        <p>
          This site may utilize lightweight, privacy-respecting analytics (such as Vercel Web
          Analytics) to understand aggregate page visits, top referring domains, and general
          geographic regions.
        </p>
        <p>
          These measurements do not use advertising identifiers, do not build personal tracking profiles,
          and do not follow visitors across third-party websites. If enabled, analytics telemetry is
          conditioned upon your cookie and privacy consent preferences.
        </p>
      </LegalSection>

      {/* 06 Cookies & Local Storage */}
      <LegalSection id="cookies-local-storage" number="06" title="Cookies & Local Storage">
        <p>
          This portfolio emphasizes transparent, minimal client-side storage:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
          <li>
            <strong>Theme Preference (localStorage):</strong> We use your browser's standard{" "}
            <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-200">
              localStorage
            </code>{" "}
            to remember your Dark or Light display mode preference across visits.
          </li>
          <li>
            <strong>Consent Preferences (localStorage):</strong> Browser local storage remembers your
            cookie consent choices so you are not repeatedly prompted on every page load.
          </li>
          <li>
            <strong>Authentication Session (HttpOnly Cookie):</strong> For administrative functions
            (such as the site owner updating verified certificates), an encrypted, HttpOnly{" "}
            <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-200">
              vault_session
            </code>{" "}
            cookie is used. Regular visitors browsing public pages do not receive this cookie.
          </li>
          <li>
            <strong>Static GitHub Snapshots:</strong> Repository metrics and commit counts are
            periodically retrieved via background GitHub Actions and bundled in static JSON snapshots,
            eliminating browser-side tracking or excessive external API requests.
          </li>
        </ul>
        <p>
          You can clear your browser's local storage and cookies at any time via your browser
          settings without impairing core document reading or portfolio viewing.
        </p>
      </LegalSection>

      {/* 07 External Links & Third-Party Services */}
      <LegalSection id="external-links" number="07" title="External Links & Third-Party Services">
        <p>
          This portfolio contains outbound links to external third-party platforms, including:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-zinc-700 dark:text-zinc-300">
          <li>GitHub (source code repositories and issue trackers)</li>
          <li>LinkedIn (professional profile and network)</li>
          <li>Codolio and LeetCode (coding activity and problem solutions)</li>
          <li>External project demonstration hosts</li>
        </ul>
        <p>
          Once you follow an external link, you navigate outside this website. We have no control over and
          assume no responsibility for the content, privacy practices, or terms of third-party
          platforms.
        </p>
      </LegalSection>

      {/* 08 How Information Is Used */}
      <LegalSection id="how-information-is-used" number="08" title="How Information Is Used">
        <p>
          Any information processed through this website is used strictly for legitimate,
          transparent purposes:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-zinc-700 dark:text-zinc-300">
          <li>To display portfolio content, project documentation, and system architecture cleanly</li>
          <li>To respond to correspondence, inquiries, and collaboration opportunities</li>
          <li>To monitor system availability, maintain uptime, and defend against abusive traffic</li>
          <li>To respect and persist your stated UI choices (such as theme preference)</li>
        </ul>
      </LegalSection>

      {/* 09 Data Retention */}
      <LegalSection id="data-retention" number="09" title="Data Retention">
        <p>
          Communications received via email or contact forms are retained only for as long as
          necessary to respond to your inquiry, maintain professional correspondence, or fulfill
          customary communication records.
        </p>
        <p>
          Standard hosting logs are retained temporarily by cloud infrastructure providers in
          accordance with their routine operational log rotation schedules.
        </p>
      </LegalSection>

      {/* 10 Data Security */}
      <LegalSection id="data-security" number="10" title="Data Security">
        <p>
          We employ administrative, technical, and architectural precautions appropriate
          for a software engineering portfolio, including HTTPS transport encryption, HSTS headers,
          and modern edge infrastructure.
        </p>
        <p>
          However, no transmission of data over the public internet or method of electronic storage
          is completely impervious. Visitors transmit information through public channels at their own discretion.
        </p>
      </LegalSection>

      {/* 11 Your Rights & Choices */}
      <LegalSection id="your-rights-choices" number="11" title="Your Rights & Choices">
        <p>
          Depending on your location and applicable privacy laws, you may have rights regarding your
          personal communications, including:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-zinc-700 dark:text-zinc-300">
          <li>The right to request access to the personal information you previously submitted</li>
          <li>The right to request correction or deletion of your communication records</li>
          <li>The right to clear local browser preferences at any time</li>
        </ul>
        <p>
          To exercise any of these choices, contact the site owner directly at the email addresses
          provided below.
        </p>
      </LegalSection>

      {/* 12 Children's Privacy */}
      <LegalSection id="childrens-privacy" number="12" title="Children's Privacy">
        <p>
          This website is intended for general professional, educational, and recruiting audiences.
          It is not directed toward children under 13 years of age, and we do not knowingly collect
          personal information from children.
        </p>
      </LegalSection>

      {/* 13 Changes to This Policy */}
      <LegalSection id="changes-to-this-policy" number="13" title="Changes to This Policy">
        <p>
          This Privacy Policy may be updated periodically to reflect changes in site functionality,
          infrastructure providers, or legal requirements. Any modifications will be published directly
          on this page with an updated "Last updated" date.
        </p>
      </LegalSection>

      {/* 14 Contact Information */}
      <LegalSection id="contact" number="14" title="Contact Information">
        <p>
          If you have questions, privacy requests, or concerns regarding this policy, please reach
          out directly to Sayam Mukherjee:
        </p>

        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 font-mono">
              General Inquiries &amp; Questions
            </div>
            <a
              href="mailto:sayammukherjee1506@gmail.com"
              className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline break-all"
            >
              sayammukherjee1506@gmail.com
            </a>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 font-mono">
              Formal, Legal &amp; Collaboration
            </div>
            <a
              href="mailto:wrickbusiness@gmail.com"
              className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline break-all"
            >
              wrickbusiness@gmail.com
            </a>
          </div>
        </div>
      </LegalSection>
    </LegalDocumentLayout>
  );
};

export default Privacy;
