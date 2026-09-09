import React, { useState, memo, useCallback } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { SkillsHero } from "./skills/SkillsHero";
import { EngineeringStackSection } from "./skills/EngineeringStackSection";
import { InteractiveEcosystemMap } from "./skills/InteractiveEcosystemMap";
import { SkillProjectEvidence } from "./skills/SkillProjectEvidence";
import { ProjectTechMatrix } from "./skills/ProjectTechMatrix";
import { LiveRepositorySignal } from "./skills/LiveRepositorySignal";
import { CodebaseLanguageDistribution } from "./skills/CodebaseLanguageDistribution";
import { EngineeringWorkflow } from "./skills/EngineeringWorkflow";
import { CurrentlyDeveloping } from "./skills/CurrentlyDeveloping";
import { RecentBuildActivity } from "./skills/RecentBuildActivity";
import { EcosystemCta } from "./skills/EcosystemCta";

function EcosystemSectionComponent() {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const handleNavigateTab = useCallback((tab: string) => {
    try {
      const event = new CustomEvent("portfolio-navigate-tab", {
        detail: tab
      });
      window.dispatchEvent(event);
    } catch (e) {
      console.warn("Tab navigation error", e);
    }
  }, []);

  const handleSelectProject = useCallback((projectId: string) => {
    handleNavigateTab("projects");
  }, [handleNavigateTab]);

  return (
    <ErrorBoundary fallbackTitle="Ecosystem Map Temporarily Unavailable">
      <div id="ecosystem" className="w-full max-w-5xl mx-auto space-y-16 sm:space-y-24 lg:space-y-28 pb-20 px-4 sm:px-6">
        {/* ========================================================
            01 — HERO (Compact editorial statement)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Hero Unavailable">
          <SkillsHero />
        </ErrorBoundary>

        {/* ========================================================
            02 — ENGINEERING STACK (6 verified categories)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Engineering Stack Unavailable">
          <EngineeringStackSection
            selectedTech={selectedTech}
            onSelectTech={setSelectedTech}
          />
        </ErrorBoundary>

        {/* ========================================================
            03 — INTERACTIVE ECOSYSTEM (Centerpiece relationship flow)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Interactive Ecosystem Unavailable">
          <InteractiveEcosystemMap />
        </ErrorBoundary>

        {/* ========================================================
            04 — SKILL → PROJECT EVIDENCE (Direct codebase evidence)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Project Evidence Unavailable">
          <SkillProjectEvidence onSelectProject={handleSelectProject} />
        </ErrorBoundary>

        {/* ========================================================
            05 — PROJECT → TECHNOLOGY MATRIX (Cross-project verification)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Technology Matrix Unavailable">
          <ProjectTechMatrix />
        </ErrorBoundary>

        {/* ========================================================
            06 — LIVE REPOSITORY SIGNAL (Verified GitHub health)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Repository Signal Unavailable">
          <LiveRepositorySignal />
        </ErrorBoundary>

        {/* ========================================================
            07 — CODEBASE LANGUAGE DISTRIBUTION (Proportional roles)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Language Distribution Unavailable">
          <CodebaseLanguageDistribution />
        </ErrorBoundary>

        {/* ========================================================
            08 — ENGINEERING WORKFLOW (7-stage disciplined delivery)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Engineering Workflow Unavailable">
          <EngineeringWorkflow />
        </ErrorBoundary>

        {/* ========================================================
            09 — CURRENTLY DEVELOPING (Specific in-flight focus)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Currently Developing Unavailable">
          <CurrentlyDeveloping />
        </ErrorBoundary>

        {/* ========================================================
            10 — RECENT BUILD ACTIVITY (Real git commit stream)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Recent Build Activity Unavailable">
          <RecentBuildActivity />
        </ErrorBoundary>

        {/* ========================================================
            11 — FINAL CTA (Quiet, professional collaboration)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Collaboration CTA Unavailable">
          <EcosystemCta onNavigateTab={handleNavigateTab} />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

export const EcosystemSection = memo(EcosystemSectionComponent);
export default EcosystemSection;
