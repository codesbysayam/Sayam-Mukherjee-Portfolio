import React from "react";
import LegalLayout from "../components/legal/LegalLayout";
import LegalSection from "../components/legal/LegalSection";
import { TOCSection } from "../components/legal/LegalTableOfContents";

interface TermsPageProps {
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: "privacy" | "terms" | "contact") => void;
}

const TERMS_SECTIONS: TOCSection[] = [
  { id: "introduction", number: "01", title: "Introduction" },
  { id: "acceptance-of-terms", number: "02", title: "Acceptance of Terms" },
  { id: "permitted-use", number: "03", title: "Permitted Website Use" },
  { id: "intellectual-property", number: "04", title: "Intellectual Property" },
  { id: "portfolio-code", number: "05", title: "Portfolio Content & Code" },
  { id: "external-links", number: "06", title: "External Links" },
  { id: "user-submitted-info", number: "07", title: "User-Submitted Information" },
  { id: "availability-accuracy", number: "08", title: "Availability & Accuracy" },
  { id: "no-professional-advice", number: "09", title: "No Professional Advice" },
  { id: "limitation-of-liability", number: "10", title: "Limitation of Liability" },
  { id: "third-party-services", number: "11", title: "Third-Party Services" },
  { id: "changes-to-terms", number: "12", title: "Changes to These Terms" },
  { id: "governing-law", number: "13", title: "Governing Law" },
  { id: "contact", number: "14", title: "Contact Information" },
];

export const Terms: React.FC<TermsPageProps> = ({
  onNavigateHome,
  onNavigateTab,
}) => {
  return (
    <LegalLayout
      eyebrow="LEGAL"
      title="Terms & Conditions"
      lastUpdated="September 19, 2026"
      intro="These terms govern your access to and use of this personal developer portfolio website and its accompanying project resources."
      sections={TERMS_SECTIONS}
      onNavigateHome={onNavigateHome}
      onNavigateTab={onNavigateTab}
    >
      {/* 01 Introduction */}
      <LegalSection id="introduction" number="01" title="Introduction">
        <p>
          Welcome to Sayam Mukherjee's personal software engineering portfolio. These Terms &amp;
          Conditions ("Terms") establish the terms and rules governing access to and use of this
          website, including its content, demonstrations, and related materials.
        </p>
      </LegalSection>

      {/* 02 Acceptance of Terms */}
      <LegalSection id="acceptance-of-terms" number="02" title="Acceptance of Terms">
        <p>
          By accessing, browsing, or interacting with this website, you acknowledge that you have
          read, understood, and agreed to be bound by these Terms.
        </p>
        <p>
          If you do not agree with any part of these Terms, you should discontinue use of this website.
        </p>
      </LegalSection>

      {/* 03 Permitted Website Use */}
      <LegalSection id="permitted-use" number="03" title="Permitted Website Use">
        <p>
          You are welcome to browse website content, review project documentation, read articles,
          explore interactive software samples, and contact the site owner for professional or
          academic reasons.
        </p>
        <p>
          When accessing this website, you agree not to:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-zinc-600 dark:text-zinc-300">
          <li>Attempt to disrupt, compromise, or impair the website's infrastructure, servers, or networks</li>
          <li>Circumvent security, rate limits, or access controls implemented on the website</li>
          <li>Scrape or extract website data at abusive volumes that degrade system performance for other visitors</li>
          <li>Use the website or its contact channels for unlawful, harassing, defamatory, or fraudulent purposes</li>
        </ul>
      </LegalSection>

      {/* 04 Intellectual Property */}
      <LegalSection id="intellectual-property" number="04" title="Intellectual Property">
        <p>
          Unless otherwise explicitly noted, all written text, layout design, branding, graphic
          arrangements, and personal presentation materials on this website are the personal
          work of Sayam Mukherjee and are protected by applicable copyright and intellectual
          property laws.
        </p>
        <p>
          Third-party trademarks, project logos, framework badges, and company names referenced on
          this site belong to their respective owners and are used purely for nominative,
          informational, and descriptive purposes.
        </p>
      </LegalSection>

      {/* 05 Portfolio Content & Code */}
      <LegalSection id="portfolio-code" number="05" title="Portfolio Content & Code">
        <p>
          Individual software engineering projects, algorithmic solutions, and repositories
          highlighted on this portfolio are typically hosted publicly on GitHub.
        </p>
        <p>
          Where a specific repository provides an open-source license (such as MIT, Apache 2.0, or
          similar), that license governs your use, reproduction, and modification of that repository's
          source code. The portfolio presentation itself does not grant broader rights than those
          expressly stated in each respective project's license file.
        </p>
      </LegalSection>

      {/* 06 External Links */}
      <LegalSection id="external-links" number="06" title="External Links">
        <p>
          This portfolio contains links to external websites, including code repositories, social
          networks, professional profiles, and live project deployments.
        </p>
        <p>
          These links are provided solely for convenience and reference. Sayam Mukherjee has no
          control over third-party websites and accepts no responsibility for their content, accuracy,
          or operational policies. Accessing external links is done at your own risk.
        </p>
      </LegalSection>

      {/* 07 User-Submitted Information */}
      <LegalSection id="user-submitted-info" number="07" title="User-Submitted Information">
        <p>
          When submitting messages through the contact form or sending emails, you agree that your
          submissions:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-zinc-600 dark:text-zinc-300">
          <li>Do not contain malicious scripts, viruses, or harmful payloads</li>
          <li>Do not infringe on third-party intellectual property or confidentiality agreements</li>
          <li>Do not include unsolicited commercial spam, unlawful threats, or harassing messages</li>
        </ul>
      </LegalSection>

      {/* 08 Availability & Accuracy */}
      <LegalSection id="availability-accuracy" number="08" title="Availability & Accuracy">
        <p>
          This website is a personal developer portfolio provided on an "as is" and "as available"
          basis. While reasonable efforts are made to maintain accurate project descriptions, metrics,
          and live demonstrations, no guarantee is given that the site will always be uninterrupted,
          error-free, or entirely up to date.
        </p>
        <p>
          Content, featured projects, and site capabilities may be updated, modified, or removed at
          any time without prior notice.
        </p>
      </LegalSection>

      {/* 09 No Professional Advice */}
      <LegalSection id="no-professional-advice" number="09" title="No Professional Advice">
        <p>
          All information, articles, and architectural demonstrations published on this website are
          provided strictly for educational, portfolio demonstration, and informational purposes.
        </p>
        <p>
          Nothing on this website constitutes formal legal, financial, architectural, or professional
          engineering advice.
        </p>
      </LegalSection>

      {/* 10 Limitation of Liability */}
      <LegalSection id="limitation-of-liability" number="10" title="Limitation of Liability">
        <p>
          To the fullest extent permitted by applicable law, Sayam Mukherjee shall not be liable
          for any direct, indirect, incidental, consequential, or special damages resulting from
          your access to, reliance upon, or inability to access this website or any external links
          contained within it.
        </p>
      </LegalSection>

      {/* 11 Third-Party Services */}
      <LegalSection id="third-party-services" number="11" title="Third-Party Services">
        <p>
          This portfolio relies on third-party infrastructure and cloud service providers (including
          Vercel, GitHub, and DNS registrars) to host code, deliver assets, and serve pages.
        </p>
        <p>
          The availability, speed, and continuous delivery of the site may be influenced by these
          providers' operations and maintenance schedules.
        </p>
      </LegalSection>

      {/* 12 Changes to These Terms */}
      <LegalSection id="changes-to-terms" number="12" title="Changes to These Terms">
        <p>
          These Terms may be revised periodically. Any updates will take effect upon posting to
          this page, with the revised date indicated at the top of the document.
        </p>
        <p>
          Your continued use of the website following any modifications signifies your acceptance of
          the updated Terms.
        </p>
      </LegalSection>

      {/* 13 Governing Law */}
      <LegalSection id="governing-law" number="13" title="Governing Law">
        <p>
          These terms are intended to be interpreted in accordance with applicable law. Any specific
          governing-law or jurisdiction provision should be finalized by the site owner with
          appropriate legal advice.
        </p>
      </LegalSection>

      {/* 14 Contact Information */}
      <LegalSection id="contact" number="14" title="Contact Information">
        <p>
          If you have questions, inquiries, or notices regarding these Terms, please contact
          Sayam Mukherjee directly:
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

export default Terms;
