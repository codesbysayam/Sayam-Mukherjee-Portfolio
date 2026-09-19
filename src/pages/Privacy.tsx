import React from "react";
import LegalLayout from "../components/legal/LegalLayout";
import LegalSection from "../components/legal/LegalSection";
import { TOCSection } from "../components/legal/LegalTableOfContents";

interface PrivacyPageProps {
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: "privacy" | "terms" | "contact") => void;
}

const PRIVACY_SECTIONS: TOCSection[] = [
  { id: "introduction", number: "01", title: "Introduction" },
  { id: "information-we-collect", number: "02", title: "Information We Collect" },
  { id: "information-you-provide", number: "03", title: "Information You Provide" },
  { id: "automatically-collected", number: "04", title: "Automatically Collected Information" },
  { id: "analytics", number: "05", title: "Analytics" },
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
    <LegalLayout
      eyebrow="LEGAL"
      title="Privacy Policy"
      lastUpdated="September 19, 2026"
      intro="This policy outlines how limited personal information and browser data are handled when visiting this personal software engineering portfolio."
      sections={PRIVACY_SECTIONS}
      onNavigateHome={onNavigateHome}
      onNavigateTab={onNavigateTab}
    >
      {/* 01 Introduction */}
      <LegalSection id="introduction" number="01" title="Introduction">
        <p>
          Sayam Mukherjee operates this personal developer portfolio website to present
          software engineering projects, technical research, academic background, and
          contact pathways.
        </p>
        <p>
          Respect for visitor privacy is a fundamental design principle of this website.
          This document explains what limited information may be processed when you browse
          the site, how that data is used, and what choices you have regarding your information.
        </p>
      </LegalSection>

      {/* 02 Information We Collect */}
      <LegalSection id="information-we-collect" number="02" title="Information We Collect">
        <p>
          We differentiate between two basic categories of data:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-300">
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
          This website does not require user registration, does not create visitor accounts, and does
          not participate in behavioral advertising networks or cross-site tracking.
        </p>
      </LegalSection>

      {/* 03 Information You Provide */}
      <LegalSection id="information-you-provide" number="03" title="Information You Provide">
        <p>
          When you use the contact form on this website or reach out by email, you may share:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-zinc-600 dark:text-zinc-300">
          <li>Your name</li>
          <li>Your email address</li>
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
          Like virtually all websites, hosting infrastructure and content delivery networks (such
          as Vercel) process standard HTTP request headers and access logs. These may include:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-zinc-600 dark:text-zinc-300">
          <li>Internet Protocol (IP) address (frequently truncated or anonymized at the edge)</li>
          <li>Browser user agent, browser engine version, and operating system</li>
          <li>Requested URL, HTTP status code, and referral source</li>
          <li>Date, time, and transfer payload size of the request</li>
        </ul>
        <p>
          This data is part of standard internet architecture required to route web traffic,
          mitigate denial-of-service attempts, detect operational bugs, and safeguard server
          reliability.
        </p>
      </LegalSection>

      {/* 05 Analytics */}
      <LegalSection id="analytics" number="05" title="Analytics">
        <p>
          This site may utilize lightweight, privacy-respecting analytics (such as Vercel Web
          Analytics) to understand aggregate page visits, top referring domains, and general
          geographic regions.
        </p>
        <p>
          These measurements do not use advertising identifiers, do not build personal profiles,
          and do not track visitors across other third-party websites. Analytics data is handled in
          aggregate form and is used exclusively to assess site performance and project interest.
        </p>
      </LegalSection>

      {/* 06 Cookies & Local Storage */}
      <LegalSection id="cookies-local-storage" number="06" title="Cookies & Local Storage">
        <p>
          This portfolio emphasizes minimal client storage:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-300">
          <li>
            <strong>Theme Preferences:</strong> We use your browser's standard{" "}
            <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-200">
              localStorage
            </code>{" "}
            to remember your Dark or Light display mode preference across visits.
          </li>
          <li>
            <strong>Consent &amp; Cache:</strong> Browser local storage stores your cookie/storage
            preference and temporarily caches public GitHub project metrics to prevent hitting
            GitHub API rate limits.
          </li>
          <li>
            <strong>Not a Cookie:</strong> Local storage data resides entirely on your device, is
            not automatically transmitted to our servers with HTTP requests, and contains no
            sensitive personal identifiers.
          </li>
        </ul>
        <p>
          You can clear your browser's local storage and cache at any time via your browser
          settings without impairing core document reading on this site.
        </p>
      </LegalSection>

      {/* 07 External Links & Third-Party Services */}
      <LegalSection id="external-links" number="07" title="External Links & Third-Party Services">
        <p>
          This portfolio contains outbound links to external third-party platforms, including:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-zinc-600 dark:text-zinc-300">
          <li>GitHub (source code repositories and issue trackers)</li>
          <li>LinkedIn (professional profile)</li>
          <li>LeetCode and Codolio (coding activity and verified solutions)</li>
          <li>External project demonstration hosts</li>
        </ul>
        <p>
          Once you follow an external link, you leave this website. We have no control over and
          assume no responsibility for the content, privacy practices, or policies of third-party
          sites or services. We encourage you to review the privacy notices of any external site you
          visit.
        </p>
      </LegalSection>

      {/* 08 How Information Is Used */}
      <LegalSection id="how-information-is-used" number="08" title="How Information Is Used">
        <p>
          Any information processed through this website is used strictly for legitimate,
          transparent purposes:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-zinc-600 dark:text-zinc-300">
          <li>To display portfolio content, project documentation, and interactive samples cleanly</li>
          <li>To respond to correspondence, project inquiries, and collaboration requests</li>
          <li>To monitor server availability, maintain uptime, and defend against malicious traffic</li>
          <li>To respect and persist your stated UI choices (such as theme and privacy settings)</li>
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
          We employ reasonable administrative, technical, and architectural precautions appropriate
          for a personal website, including HTTPS transport encryption and modern hosting
          infrastructure.
        </p>
        <p>
          However, no transmission of data over the public internet or method of electronic storage
          can be guaranteed to be 100% secure. Visitors transmit information at their own risk.
        </p>
      </LegalSection>

      {/* 11 Your Rights & Choices */}
      <LegalSection id="your-rights-choices" number="11" title="Your Rights & Choices">
        <p>
          Depending on your location and applicable privacy laws, you may have rights regarding your
          personal data, including:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-zinc-600 dark:text-zinc-300">
          <li>The right to request access to the personal information you provided</li>
          <li>The right to request correction or deletion of your communication records</li>
          <li>The right to withdraw consent for non-essential client storage at any time</li>
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
          infrastructure providers, or legal requirements. Any modifications will be posted directly
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
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
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
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              Formal, Legal &amp; Serious Matters
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
    </LegalLayout>
  );
};

export default Privacy;
