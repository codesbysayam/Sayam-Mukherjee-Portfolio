import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { MotionProvider } from "../src/motion/MotionProvider.tsx";
import { PortfolioProvider } from "../src/context/PortfolioContext.tsx";
import HeroSection from "../src/components/HeroSection.tsx";
import HomeEditorialChapters from "../src/components/HomeEditorialChapters.tsx";
import ProjectsShowcase from "../src/components/ProjectsShowcase.tsx";
import SkillsSection from "../src/components/SkillsSection.tsx";
import EcosystemSection from "../src/components/EcosystemSection.tsx";
import CertificatesPage from "../src/components/certificates/CertificatesPage.tsx";
import Journal from "../src/pages/Journal.tsx";
import ContactSection from "../src/components/ContactSection.tsx";
import { PROJECTS } from "../src/data/projects.ts";
import { journalEntries } from "../src/data/journal.ts";
import { ArcCardCarousel } from "../src/components/motion/ArcCardCarousel.tsx";
import { FocusFrame } from "../src/components/motion/FocusFrame.tsx";
import CommandMenu from "../src/components/CommandMenu.tsx";
import { FullScreenMenu } from "../src/components/layout/FullScreenMenu.tsx";
import MobileBottomNav from "../src/components/common/MobileBottomNav.tsx";
import AcademicRecord from "../src/components/AcademicRecord.tsx";
import { PROFILE_DATA } from "../src/data/profile.ts";
import { CONTACT_INFO, ABOUT_CONTENT } from "../src/data/siteContent.ts";
import { universityEducation } from "../src/data/education.ts";
import { portfolioKnowledge } from "../src/data/portfolioKnowledge.ts";
import { SAYAM_DATA } from "../src/data.ts";
import { generatePortfolioAnswer } from "../src/utils/portfolioAssistantEngine.ts";

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

  it("renders Projects tab (ProjectsShowcase + ArcCardCarousel) cleanly without GitHub telemetry dashboard clutter", () => {
    const html = renderWithProviders(<ProjectsShowcase />);
    expect(html).toContain("3D Arc Project Deck");
    expect(html).toContain("MAUSAM");
    expect(html).not.toContain("Verified Repository Statistics");
  });

  it("renders Skills tab cleanly with all 8 capability groups and without GitHub percentage telemetry", () => {
    const html = renderWithProviders(<SkillsSection />);
    expect(html).toContain("Programming Languages");
    expect(html).toContain("Frontend Engineering");
    expect(html).toContain("Backend Engineering");
    expect(html).toContain("AI &amp; Machine Learning");
    expect(html).toContain("Computer Vision");
    expect(html).toContain("Data &amp; Databases");
    expect(html).toContain("Developer Tools &amp; Workflow");
    expect(html).toContain("Core Computer Science");
    expect(html).not.toContain("LANGUAGES IN PRACTICE");
    expect(html).not.toContain("Technology → Domain → Project → Repository");
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
});
