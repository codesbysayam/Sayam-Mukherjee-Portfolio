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
  filterSkills, 
  SkillItem 
} from "../data/skills";

function SkillsSectionComponent() {
  // Search & Filter State
  const [activeFilter, setActiveFilter] = useState<SkillFilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  // Filtered skills list computed instantaneously
  const filteredSkills = useMemo(() => {
    return filterSkills(activeFilter, searchQuery);
  }, [activeFilter, searchQuery]);

  const handleResetFilters = () => {
    setActiveFilter("all");
    setSearchQuery("");
    setSelectedSkillId(null);
  };

  const handleOverviewSkillSelect = (skillName: string) => {
    // Locate the skill in dataset
    const found = SKILLS_DATA.find(
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
  };

  const handleSelectProject = (projectId: string) => {
    const event = new CustomEvent("portfolio-navigate-tab", {
      detail: "projects"
    });
    window.dispatchEvent(event);
  };

  const handleNavigateToContact = () => {
    const event = new CustomEvent("portfolio-navigate-tab", {
      detail: "contact"
    });
    window.dispatchEvent(event);
  };

  return (
    <ErrorBoundary fallbackTitle="Skills Section Temporarily Unavailable">
      <section id="skills" className="w-full space-y-12 sm:space-y-16 pb-12">
        {/* ========================================================
            1. HERO (Compact, premium, evidence-backed badges)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Hero Unavailable">
          <SkillsHero />
        </ErrorBoundary>

        {/* ========================================================
            2. SKILL OVERVIEW (6 core categories, no fake percentages)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Skills Overview Unavailable">
          <SkillsOverview onSelectSkill={handleOverviewSkillSelect} />
        </ErrorBoundary>

        {/* ========================================================
            3. SEARCH + FILTERS (Immediate live search & chips)
           ======================================================== */}
        <div id="skill-ecosystem-section" className="space-y-6 pt-2">
          <ErrorBoundary fallbackTitle="Search & Filters Unavailable">
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

          {/* ========================================================
              4. INTERACTIVE SKILL ECOSYSTEM (Interactive cards & modal)
             ======================================================== */}
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
            5. SKILL → PROJECT EVIDENCE MATRIX (5 verified projects)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Project Evidence Matrix Unavailable">
          <SkillProjectEvidence onSelectProject={handleSelectProject} />
        </ErrorBoundary>

        {/* ========================================================
            6. LIVE GITHUB LANGUAGE DISTRIBUTION (From public repo bytes)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="GitHub Language Distribution Unavailable">
          <GitHubLanguageDistribution />
        </ErrorBoundary>

        {/* ========================================================
            7. CURRENTLY DEVELOPING (4 active study areas, qualitative)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Currently Developing Unavailable">
          <CurrentlyDeveloping />
        </ErrorBoundary>

        {/* ========================================================
            8. RECENT BUILD ACTIVITY (Real commits, relative time)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Recent Build Activity Unavailable">
          <RecentBuildActivity />
        </ErrorBoundary>

        {/* ========================================================
            9. CODING PROFILES (GitHub, LeetCode, Codolio, LinkedIn)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Coding Profiles Unavailable">
          <CodingProfilesSection />
        </ErrorBoundary>

        {/* ========================================================
            10. ENGINEERING TOOLCHAIN (Ideation → Vercel deployment)
           ======================================================== */}
        <ErrorBoundary fallbackTitle="Engineering Toolchain Unavailable">
          <EngineeringToolchain />
        </ErrorBoundary>

        {/* ========================================================
            11. FINAL CALL TO ACTION (Collaborate & direct emails)
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
