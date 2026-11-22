import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { MotionProvider } from "../src/motion/MotionProvider.tsx";
import { PortfolioProvider } from "../src/context/PortfolioContext.tsx";
import HeroSection from "../src/components/HeroSection.tsx";
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

  it("renders Projects tab (ProjectsShowcase + ArcCardCarousel) cleanly", () => {
    const html = renderWithProviders(<ProjectsShowcase />);
    expect(html).toContain("3D Arc Project Deck");
    expect(html).toContain("MAUSAM");
  });

  it("renders Skills tab cleanly", () => {
    const html = renderWithProviders(<SkillsSection />);
    expect(html).toContain("TypeScript");
  });

  it("renders Ecosystem tab cleanly", () => {
    const html = renderWithProviders(<EcosystemSection />);
    expect(html).toContain("Verified Project Evidence");
    expect(html).toContain("8 Verified Architectures");
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
});
