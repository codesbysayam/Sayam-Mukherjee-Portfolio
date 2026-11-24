import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { renderToString } from "react-dom/server";
import { MotionProvider } from "../src/motion/MotionProvider.tsx";
import { PortfolioProvider } from "../src/context/PortfolioContext.tsx";
import HeroSection from "../src/components/HeroSection.tsx";
import HomeEditorialChapters from "../src/components/HomeEditorialChapters.tsx";
import ProjectsShowcase from "../src/components/ProjectsShowcase.tsx";
import SkillsSection from "../src/components/SkillsSection.tsx";
import EcosystemSection from "../src/components/EcosystemSection.tsx";
import EcosystemPage from "../src/components/ecosystem/EcosystemPage.tsx";
import CertificatesPage from "../src/components/certificates/CertificatesPage.tsx";
import Journal from "../src/pages/Journal.tsx";
import JournalDetail from "../src/pages/JournalDetail.tsx";
import ContactSection from "../src/components/ContactSection.tsx";
import { PROJECTS } from "../src/data/projects.ts";
import { journalEntries } from "../src/data/journal.ts";
import { ArcCardCarousel } from "../src/components/motion/ArcCardCarousel.tsx";
import { FocusFrame } from "../src/components/motion/FocusFrame.tsx";
import CommandMenu from "../src/components/CommandMenu.tsx";
import { FullScreenMenu } from "../src/components/layout/FullScreenMenu.tsx";
import MobileBottomNav from "../src/components/common/MobileBottomNav.tsx";
import AcademicRecord from "../src/components/AcademicRecord.tsx";
import ResumeModal from "../src/components/ResumeModal.tsx";
import { AssistantHeader } from "../src/components/assistant/AssistantHeader.tsx";
import { AssistantComposer } from "../src/components/assistant/AssistantComposer.tsx";
import { PROFILE_DATA } from "../src/data/profile.ts";
import { CONTACT_INFO, ABOUT_CONTENT } from "../src/data/siteContent.ts";
import { universityEducation } from "../src/data/education.ts";
import { portfolioKnowledge } from "../src/data/portfolioKnowledge.ts";
import { SAYAM_DATA } from "../src/data.ts";
import { generatePortfolioAnswer } from "../src/utils/portfolioAssistantEngine.ts";
import AchievementCard from "../src/components/certificates/AchievementCard.tsx";
import {
  INITIAL_CERTIFICATES,
  EXISTING_CERTIFICATES,
  ADDITIONAL_CERTIFICATES,
  mergeCertificateRecords,
} from "../src/data/initialCertificates.ts";
import { validateAchievementRecords } from "../src/types/certificates.ts";
import { listCertificates } from "../server/repositories/certificates.repository.ts";

function renderWithProviders(element: React.ReactElement): string {
  return renderToString(
    <MotionProvider>
      <PortfolioProvider>{element}</PortfolioProvider>
    </MotionProvider>
  );
}

describe("Portfolio Navigation Tabs, Journal Entries & Interactive Component SSR Smoke Suite", () => {
  it("renders HeroSection cleanly without hook or runtime errors", () => {
    const html = renderWithProviders(
      <HeroSection
        onViewWork={() => {}}
        onOpenResume={() => {}}
        onNavigateContact={() => {}}
      />
    );
    expect(html).toContain("SAYAM");
    expect(html).toContain("MUKHERJEE");
  });

  it("renders HomeEditorialChapters with concise perspective and section index without project dumps", () => {
    const html = renderWithProviders(
      <HomeEditorialChapters onNavigateTab={() => {}} />
    );
    expect(html).toContain("first principles.");
    expect(html).toContain("Selected Projects");
    expect(html).not.toContain("Interactive Evidence Matrix");
  });

  it("renders Projects tab (ProjectsShowcase + ArcCardCarousel) cleanly with tech stack, difficulty, and project type filters/sorting", () => {
    const html = renderWithProviders(<ProjectsShowcase />);
    expect(html).toContain("3D Arc Project Deck");
    expect(html).toContain("MAUSAM");
    expect(html).toContain("Filter projects by difficulty");
    expect(html).toContain("Filter projects by project type");
    expect(html).toContain("Sort projects");
    expect(html).toContain("Sort: Technology Stack");
    expect(html).toContain("Sort: Difficulty (Highest)");
    expect(html).toContain("Sort: Project Type");
    expect(html).not.toContain("Verified Repository Statistics");
  });

  it("renders Skills Observatory cleanly with constellation, capability matrix, project evidence, active learning, and workflow", () => {
    const html = renderWithProviders(<SkillsSection />);
    expect(html).toContain("Interactive Skill Constellation");
    expect(html).toContain("CSE · AI/ML");
    expect(html).toContain("SYSTEMS CORE");
    expect(html).toContain("System Architecture");
    expect(html).toContain("Control Planes &amp; Audit");
    expect(html).toContain("Data Structures &amp; Algorithms");
    expect(html).toContain("Practical Application");
    expect(html).toContain("Programming Languages");
    expect(html).toContain("Frontend Engineering");
    expect(html).toContain("Backend &amp; Data");
    expect(html).toContain("Machine Learning &amp; Computer Vision");
    expect(html).toContain("Development Tools");
    expect(html).toContain("Core Computer Science");
    expect(html).toContain("Evidence Matrix");
    expect(html).toContain("Currently Developing");
    expect(html).toContain("From Idea to Verified Deployment");
    expect(html).not.toContain("LANGUAGES IN PRACTICE");
    expect(html).not.toContain("System Archite…");
  });

  it("renders Ecosystem tab cleanly with conceptual architectural patterns instead of a duplicate project directory", () => {
    const html = renderWithProviders(<EcosystemSection />);
    expect(html).toContain("How software systems");
    expect(html).toContain("API Boundaries");
    expect(html).toContain("HITL Governance");
    expect(html).not.toContain("5.47 MB Polyglot Repository");
  });

  it("renders Certificates tab cleanly", () => {
    const html = renderWithProviders(<CertificatesPage />);
    expect(html.length).toBeGreaterThan(200);
  });

  it("renders Journal tab and verifies all 6 journal entries exist for CommandMenu indexing", () => {
    expect(journalEntries.length).toBeGreaterThanOrEqual(6);
    const html = renderWithProviders(<Journal />);
    expect(html).toContain("Building OPERON From the Interface Up");
  });

  it("renders Contact tab cleanly", () => {
    const html = renderWithProviders(<ContactSection />);
    expect(html).toContain("Send Message");
  });

  it("renders ArcCardCarousel and FocusFrame cleanly", () => {
    const arcHtml = renderWithProviders(
      <ArcCardCarousel projects={PROJECTS} onSelectProject={() => {}} />
    );
    expect(arcHtml).toContain("Inspect Case Study");

    const focusHtml = renderWithProviders(
      <FocusFrame title="Telemetry Frame">
        <div>Inner architecture</div>
      </FocusFrame>
    );
    expect(focusHtml).toContain("Telemetry Frame");
    expect(focusHtml).toContain("Focus View");
  });

  it("renders CommandMenu, FullScreenMenu, and MobileBottomNav with all primary routes", () => {
    const cmdHtml = renderWithProviders(
      <CommandMenu
        isOpen={true}
        onClose={() => {}}
        onNavigate={() => {}}
        onOpenResume={() => {}}
        onTriggerConfetti={() => {}}
      />
    );
    expect(cmdHtml).toContain("Building OPERON From the Interface Up");
    expect(cmdHtml).toContain("Projects");

    const menuHtml = renderWithProviders(
      <FullScreenMenu
        isOpen={true}
        onClose={() => {}}
        activeTab="home"
        onNavigate={() => {}}
        onOpenResume={() => {}}
        onOpenSearch={() => {}}
        theme="dark"
        toggleTheme={() => {}}
      />
    );
    expect(menuHtml).toContain("Projects");
    expect(menuHtml).toContain("Skills");
    expect(menuHtml).toContain("Ecosystem");
    expect(menuHtml).toContain("Certificates");
    expect(menuHtml).toContain("Journal");

    const mobileHtml = renderWithProviders(
      <MobileBottomNav
        activeTab="projects"
        onNavigate={() => {}}
        onOpenSearch={() => {}}
      />
    );
    expect(mobileHtml).toContain("Projects");
  });

  it("enforces consistent 2nd Year, 4th Semester academic status across data, AcademicRecord UI, and English/Hindi assistant answers", () => {
    expect(PROFILE_DATA.semester).toBe("2nd Year, 4th Semester");
    expect(PROFILE_DATA.bio).toContain("2nd Year (4th Semester)");
    expect(CONTACT_INFO.semester).toBe("2nd Year, 4th Semester");
    expect(ABOUT_CONTENT.stats.semester).toBe("2nd Year, 4th Semester");
    expect(ABOUT_CONTENT.bio).toContain("2nd Year (4th Semester)");
    expect(SAYAM_DATA.stats.semester).toBe("2nd Year, 4th Semester");
    expect(SAYAM_DATA.bio).toContain("2nd Year (4th Semester)");
    expect(universityEducation.status).toBe("Undergraduate (2nd Year, 4th Sem)");
    expect(portfolioKnowledge.identity.academicIdentity).toBe(
      "2nd Year, 4th Semester B.Tech Undergraduate at KIIT"
    );
    expect(portfolioKnowledge.education.university.currentStatus).toBe(
      "Undergraduate (2nd Year, 4th Sem)"
    );

    const academicHtml = renderWithProviders(<AcademicRecord />);
    expect(academicHtml).toContain("Undergraduate (2nd Year, 4th Sem)");
    expect(academicHtml).not.toContain("3rd Sem");

    const enSemester = generatePortfolioAnswer("What semester is he in?");
    expect(enSemester).toContain("2nd Year, 4th Semester");
    expect(enSemester).not.toContain("3rd Semester");

    const enEdu = generatePortfolioAnswer("Tell me about his education");
    expect(enEdu).toContain("2nd Year, 4th Semester");
    expect(enEdu).not.toContain("3rd Semester");

    const hiEdu = generatePortfolioAnswer("हिंदी में शिक्षा बताओ");
    expect(hiEdu).toContain("द्वितीय वर्ष (2nd Year, 4th Semester)");
    expect(hiEdu).not.toContain("3rd Semester");

    const hiAbout = generatePortfolioAnswer("हिंदी में बताओ");
    expect(hiAbout).toContain("द्वितीय वर्ष (4th Semester)");
    expect(hiAbout).not.toContain("3rd Semester");
  });

  it("enforces universal responsive containers, coarse-pointer targets, landscape adaptation, and dual-mode detail views", () => {
    const ecosystemHtml = renderWithProviders(<EcosystemPage />);
    expect(ecosystemHtml).toContain("md:hidden");
    expect(ecosystemHtml).toContain("hidden md:block");
    expect(ecosystemHtml).toContain("Inspect Case Studies");

    const journalDetailHtml = renderWithProviders(
      <JournalDetail
        slug={journalEntries[0].slug}
        onBack={() => {}}
        onSelectEntry={() => {}}
      />
    );
    expect(journalDetailHtml).toContain("<details");
    expect(journalDetailHtml).toContain("In This Essay");

    const resumeHtml = renderWithProviders(
      <ResumeModal isOpen={true} onClose={() => {}} />
    );
    expect(resumeHtml).toContain("Academic Record");
    expect(resumeHtml).toContain("9.06/10");

    const assistantHtml = renderWithProviders(
      <>
        <AssistantHeader onClear={() => {}} onClose={() => {}} />
        <AssistantComposer onSend={() => {}} onStop={() => {}} isGenerating={false} />
      </>
    );
    expect(assistantHtml).toContain("min-h-[44px]");
    expect(assistantHtml).toContain("assistant-composer-hint");
    expect(assistantHtml).not.toContain("hidden xs:inline");

    const rootDir = path.resolve(import.meta.dirname, "..");
    const indexCss = fs.readFileSync(path.join(rootDir, "src", "index.css"), "utf8");
    const assistantCss = fs.readFileSync(
      path.join(rootDir, "src", "components", "assistant", "assistant.css"),
      "utf8"
    );

    expect(indexCss).toContain("--container-standard:");
    expect(indexCss).toContain("--accent-fill:");
    expect(indexCss).toContain("--accent-contrast:");
    expect(indexCss).toContain("@media (pointer: coarse)");
    expect(indexCss).toContain("@media (max-height: 440px) and (orientation: landscape)");
    expect(indexCss).toContain("@media (min-width: 2400px)");
    expect(indexCss).toContain("@media (prefers-reduced-motion: reduce)");
    expect(assistantCss).toContain("@media (max-height: 440px)");
  });

  it("integrates all 5 verified certificates cleanly alongside existing records without data fabrication", async () => {
    expect(EXISTING_CERTIFICATES).toHaveLength(8);
    expect(ADDITIONAL_CERTIFICATES).toHaveLength(5);
    expect(INITIAL_CERTIFICATES).toHaveLength(13);
    expect(mergeCertificateRecords(EXISTING_CERTIFICATES, ADDITIONAL_CERTIFICATES)).toHaveLength(13);
    expect(validateAchievementRecords(INITIAL_CERTIFICATES)).toEqual([]);

    const rootDir = path.resolve(import.meta.dirname, "..");

    const expectedFive = [
      {
        id: "automatrix-2-2025",
        url: "https://excellent-ivory-4q97cwpu.edgeone.dev",
        credentialType: "Certificate of Participation",
        dateCheck: "2025-08-19",
      },
      {
        id: "toycathon-2021",
        url: "https://ridiculous-chocolate-nwjqaaa8.edgeone.dev",
        credentialType: "Certificate of Participation",
        dateCheck: "2021",
      },
      {
        id: "microsoft-cbse-exposure-2022",
        url: "https://creepy-aqua-zim8h2zi.edgeone.dev",
        credentialType: "Certificate of Completion",
        dateCheck: "2022-10-30",
      },
      {
        id: "mindquest-quiz-achievement",
        url: "https://musical-peach-anlpglvx.edgeone.dev",
        credentialType: "Certificate of Achievement",
        dateCheck: "",
      },
      {
        id: "decode-dominate-2-2026",
        url: "https://secure-black-gupqskus.edgeone.dev",
        credentialType: "Certificate of Participation",
        dateCheck: "2026-03-07",
      },
    ];

    for (const item of expectedFive) {
      const record = INITIAL_CERTIFICATES.find((c) => c.id === item.id);
      expect(record).toBeDefined();
      expect(record!.certificateUrl).toBe(item.url);
      expect(record!.credentialType).toBe(item.credentialType);
      expect(record!.issueDate).toBe(item.dateCheck);
      expect(record!.pdfUrl).toBeUndefined();
      expect(record!.associatedProjects).toBeUndefined();
      expect(record!.imageUrl).toMatch(/^\/images\/certificates\/.*\.png$/);
      expect(fs.existsSync(path.join(rootDir, "public", record!.imageUrl!))).toBe(true);

      const cardHtml = renderWithProviders(
        <AchievementCard record={record!} onViewDetails={() => {}} onInspect={() => {}} />
      );
      expect(cardHtml).toContain(item.credentialType);
      expect(cardHtml).toContain(item.url);
      expect(cardHtml).toContain("achievement-card__header");
      expect(cardHtml).toContain("achievement-card__identity");
      expect(cardHtml).toContain("achievement-card__metadata");
      expect(cardHtml).toContain("achievement-card__overview");
      expect(cardHtml).toContain("achievement-card__details");
      expect(cardHtml).toContain("achievement-card__topics");
      expect(cardHtml).toContain("achievement-card__footer");
      expect(cardHtml).toContain("Record Details");
      expect(cardHtml).toContain("View Details");
      expect(cardHtml).toContain("Inspect Record");
      expect(cardHtml).toContain("Open Source");
      expect(cardHtml).not.toContain("<img");
      expect(cardHtml).not.toContain("Associated Project");
      expect(cardHtml).not.toContain("Recipient: SAYAM MUKHERJEE");
      expect(cardHtml).not.toContain(">Download<");
      expect(cardHtml).not.toContain(">Source Page<");
      expect(cardHtml).not.toContain("undefined");
      expect(cardHtml).not.toContain("null");
    }

    const dataforge = INITIAL_CERTIFICATES.find((c) => c.id === "dataforge-2026-memory-in-motion")!;
    const dataforgeCardHtml = renderWithProviders(
      <AchievementCard record={dataforge} onViewDetails={() => {}} onInspect={() => {}} />
    );
    expect(dataforgeCardHtml).toContain("achievement-card__header");
    expect(dataforgeCardHtml).toContain("achievement-card__details");
    expect(dataforgeCardHtml).toContain("achievement-card__footer");
    expect(dataforgeCardHtml).toContain("Record Details");
    expect(dataforgeCardHtml).toContain("View Details");
    expect(dataforgeCardHtml).toContain("Inspect Record");
    expect(dataforgeCardHtml).toContain("Open Source");
    expect(dataforgeCardHtml).not.toContain("Associated Project");
    expect(dataforgeCardHtml).not.toContain("Memory in Motion");
    expect(dataforgeCardHtml).not.toContain(">Download<");
    expect(dataforgeCardHtml).not.toContain("<img");

    expect(dataforge.associatedProjects?.[0]?.name).toBe("Memory in Motion");
    expect(dataforge.associatedProjects?.[0]?.url).toBe("https://memoryinmotion.vercel.app");
    expect(dataforge.track).toBe("Explain the Frontier");

    for (const record of INITIAL_CERTIFICATES) {
      const cardHtml = renderWithProviders(
        <AchievementCard record={record} onViewDetails={() => {}} onInspect={() => {}} />
      );
      expect(cardHtml).toContain("achievement-card__header");
      expect(cardHtml).toContain("achievement-card__identity");
      expect(cardHtml).toContain("achievement-card__metadata");
      expect(cardHtml).toContain("achievement-card__overview");
      expect(cardHtml).toContain("achievement-card__details");
      expect(cardHtml).toContain("achievement-card__topics");
      expect(cardHtml).toContain("achievement-card__footer");
      expect(cardHtml).toContain("Record Details");
      expect(cardHtml).toContain("View Details");
      expect(cardHtml).toContain("Inspect Record");
      expect(cardHtml).toContain("Open Source");
      expect(cardHtml).not.toContain("<img");
      expect(cardHtml).not.toContain("Associated Project");
      expect(cardHtml).not.toContain("Recipient: SAYAM MUKHERJEE");
      expect(cardHtml).not.toContain(">Download<");
      expect(cardHtml).not.toContain(">Source Page<");
    }

    const viewerModalSource = fs.readFileSync(
      path.join(rootDir, "src", "components", "certificates", "CertificateViewerModal.tsx"),
      "utf8"
    );
    expect(viewerModalSource).toContain("Inspect Record · Archival & Project Details");
    expect(viewerModalSource).toContain("certificate.associatedProjects");
    expect(viewerModalSource).toContain("Inspect Certificate");

    const cmdHtml = renderWithProviders(
      <CommandMenu
        isOpen={true}
        onClose={() => {}}
        onNavigate={() => {}}
        onOpenResume={() => {}}
        onTriggerConfetti={() => {}}
      />
    );
    expect(cmdHtml).toContain("Automatrix 2.0");
    expect(cmdHtml).toContain("MindQuest Quiz");
    expect(cmdHtml).not.toContain("ACHIEVEMENTS ()");

    const toycathon = INITIAL_CERTIFICATES.find((c) => c.id === "toycathon-2021")!;
    expect(toycathon.team).toBe("ABVB TECHIES");
    expect(toycathon.achievementClaim).toContain("West Bengal");

    const decodeDominate = INITIAL_CERTIFICATES.find((c) => c.id === "decode-dominate-2-2026")!;
    expect(decodeDominate.year).toBe(2026);
    expect(decodeDominate.date).toBe("6–7 March 2026");
    expect(decodeDominate.credentialId).toBe("U2D | KF-D02-2026-EU8R");

    const mindquest = INITIAL_CERTIFICATES.find((c) => c.id === "mindquest-quiz-achievement")!;
    expect(mindquest.issueDate).toBe("");
    expect(mindquest.year).toBeUndefined();
    expect(mindquest.credentialId).toBeUndefined();

    const pageHtml = renderWithProviders(<CertificatesPage />);
    expect(pageHtml).toContain("Automatrix 2.0");
    expect(pageHtml).toContain("Toycathon 2021");
    expect(pageHtml).toContain("Industry Engagement and Technology Exposure Program");
    expect(pageHtml).toContain("MindQuest Quiz");
    expect(pageHtml).toContain("Decode &amp; Dominate 2.0");
    expect(pageHtml).toContain("WCC Launchpad 30");
    expect(pageHtml).toContain("L30-PTQXNX");
    expect(pageHtml).toContain("Technex&#x27;26");
    expect(pageHtml).toContain("DATAFORGE 2026");
    expect(pageHtml).toContain("Workshops");
    expect(pageHtml).toContain("Certifications");
    expect(pageHtml).not.toContain("<img");
    expect(pageHtml).not.toContain("wcc-launchpad-30-shinibali-kumar");
    expect(pageHtml).not.toContain("L30-F3RFRC");
    expect(pageHtml).not.toContain("comp-toycathon-2021");
    expect(pageHtml).not.toContain("TC-2021-FIN");
    expect(pageHtml).not.toContain("National Finalist | Toycathon");

    const wccSayam = INITIAL_CERTIFICATES.find(
      (c) => c.id === "wcc-launchpad-30-participation-2026"
    );
    expect(wccSayam).toBeDefined();
    expect(wccSayam!.recipient).toBe("Sayam Mukherjee");
    expect(wccSayam!.credentialId).toBe("L30-PTQXNX");

    const axiomProject = PROJECTS.find((p) => p.id === "axiom");
    expect(axiomProject).toBeDefined();
    expect(axiomProject!.githubUrl).toContain("AXIOM");
    expect(axiomProject!.liveUrl).toBe("https://axiomwcc.vercel.app");

    const repoAll = await listCertificates();
    expect(repoAll).toHaveLength(13);
    expect(repoAll.some((c) => c.id === "wcc-launchpad-30-shinibali-kumar")).toBe(false);
    expect(repoAll.some((c) => c.id === "comp-toycathon-2021")).toBe(false);
    expect(repoAll.some((c) => c.id === "ach-toycathon")).toBe(false);
    expect(repoAll.some((c) => c.credentialId === "L30-F3RFRC")).toBe(false);
    expect(repoAll.some((c) => c.credentialId === "TC-2021-FIN")).toBe(false);
    expect(repoAll.some((c) => c.id === "wcc-launchpad-30-participation-2026")).toBe(true);
    const repoWorkshops = await listCertificates({ category: "WORKSHOPS" });
    expect(repoWorkshops.some((c) => c.id === "automatrix-2-2025")).toBe(true);
    const repo2022 = await listCertificates({ year: "2022" });
    expect(repo2022.some((c) => c.id === "microsoft-cbse-exposure-2022")).toBe(true);
  });
});


