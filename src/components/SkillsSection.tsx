import React, { useState, useMemo, memo } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { SkillsHero } from "./skills/SkillsHero";
import { SkillsOverview } from "./skills/SkillsOverview";
import { SkillsFilterSearch } from "./skills/SkillsFilterSearch";
import { SkillEcosystem } from "./skills/SkillEcosystem";
import { SkillProjectEvidence } from "./skills/SkillProjectEvidence";
import { GitHubLanguageDistribution } from "./skills/GitHubLanguageDistribution";
import { CurrentlyDeveloping } from "./skills/CurrentlyDeveloping";
import { RecentBuildActivity } from "./skills/RecentBuildActivity";
import { CodingProfilesSection } from "./skills/CodingProfilesSection";
import { EngineeringToolchain } from "./skills/EngineeringToolchain";
import { SkillsCta } from "./skills/SkillsCta";
import { 
  SKILLS_DATA, 
  SkillFilterKey, 
  filterSkills 
} from "../data/skills";

function SkillsSectionComponent() {
  // Search & Filter State
  const [activeFilter, setActiveFilter] = useState<SkillFilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  // Filtered skills list computed instantaneously
  const filteredSkills = useMemo(() => {
    try {
      return filterSkills(activeFilter, searchQuery) || [];
    } catch {
      return SKILLS_DATA || [];
    }
  }, [activeFilter, searchQuery]);

  const handleResetFilters = () => {
    setActiveFilter("all");
    setSearchQuery("");
    setSelectedSkillId(null);
  };

  const handleOverviewSkillSelect = (skillName: string) => {
    try {
      const found = (SKILLS_DATA || []).find(
        (s) => s.name.toLowerCase() === skillName.toLowerCase() || s.id.toLowerCase() === skillName.toLowerCase()
      );
      if (found) {
        setSelectedSkillId(found.id);
      } else {
        setSearchQuery(skillName);
      }

      // Smooth scroll down to ecosystem section
      const el = document.getElementById("skill-ecosystem-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (e) {
      console.warn("Skill select error", e);
    }
  };

  const handleSelectProject = (projectId: string) => {
    try {
      const event = new CustomEvent("portfolio-navigate-tab", {
        detail: "projects"
      });
      window.dispatchEvent(event);
    } catch (e) {
      console.warn("Navigation event error", e);
    }
  };

  const handleNavigateToContact = () => {
    try {
      const event = new CustomEvent("portfolio-navigate-tab", {
        detail: "contact"
      });
      window.dispatchEvent(event);
    } catch (e) {
      console.warn("Navigation event error", e);
    }
  };

  return (
    <ErrorBoundary fallbackTitle="Skills Section Temporarily Unavailable">
      <section id="skills" className="w-full max-w-5xl mx-auto space-y-20 sm:space-y-28 lg:space-y-32 pb-24">
        {/* ========================================================
            01 — SKILLS (Restrained hero statement & authenticity)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Hero Unavailable">
          <SkillsHero />
        </ErrorBoundary>

        {/* ========================================================
            02 — TECHNOLOGY STACK (6 core categories, compact cards)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Skills Overview Unavailable">
          <SkillsOverview onSelectSkill={handleOverviewSkillSelect} />
        </ErrorBoundary>

        {/* ========================================================
            03 — SKILL ECOSYSTEM (Interactive centerpiece)
           ======================================================== */}
        <div id="skill-ecosystem-section" className="space-y-6 pt-4">
          <ErrorBoundary fallbackTitle="Skill Search & Filter Unavailable">
            <SkillsFilterSearch
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              resultCount={filteredSkills.length}
              totalCount={SKILLS_DATA.length}
              onReset={handleResetFilters}
            />
          </ErrorBoundary>

          <ErrorBoundary fallbackTitle="Skill Ecosystem Unavailable">
            <SkillEcosystem
              skills={filteredSkills}
              onSelectProject={handleSelectProject}
              selectedSkillId={selectedSkillId}
              onClearSelection={() => setSelectedSkillId(null)}
              onSkillSelect={(id) => setSelectedSkillId(id)}
            />
          </ErrorBoundary>
        </div>

        {/* ========================================================
            04 — PROJECT EVIDENCE (SKILL → PROJECT → EVIDENCE)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Project Evidence Matrix Unavailable">
          <SkillProjectEvidence onSelectProject={handleSelectProject} />
        </ErrorBoundary>

        {/* ========================================================
            05 — CODEBASE LANGUAGE DISTRIBUTION (Simple horizontal bars)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="GitHub Language Distribution Unavailable">
          <GitHubLanguageDistribution />
        </ErrorBoundary>

        {/* ========================================================
            06 — CURRENTLY DEVELOPING (Editorial 2x2 grid, no fake bars)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Currently Developing Unavailable">
          <CurrentlyDeveloping />
        </ErrorBoundary>

        {/* ========================================================
            07 — RECENT BUILD ACTIVITY (Clean public commit timeline)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Recent Build Activity Unavailable">
          <RecentBuildActivity />
        </ErrorBoundary>

        {/* ========================================================
            08 — CODING PROFILES (GitHub, LeetCode, Codolio, LinkedIn)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Coding Profiles Unavailable">
          <CodingProfilesSection />
        </ErrorBoundary>

        {/* ========================================================
            09 — ENGINEERING TOOLCHAIN (5-Stage Ideation → Deployment)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Engineering Toolchain Unavailable">
          <EngineeringToolchain />
        </ErrorBoundary>

        {/* ========================================================
            COLLABORATE — Closing Call to Action & Direct Email
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Call to Action Unavailable">
          <SkillsCta
            onNavigateToProjects={() => handleSelectProject("operon")}
            onNavigateToContact={handleNavigateToContact}
          />
        </ErrorBoundary>
      </section>
    </ErrorBoundary>
  );
}

export const SkillsSection = memo(SkillsSectionComponent);
export default SkillsSection;
