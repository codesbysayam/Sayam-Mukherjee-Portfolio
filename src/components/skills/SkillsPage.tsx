import { useState } from "react";
import { SkillsHero } from "./SkillsHero";
import { CodebaseLanguageDistribution } from "./CodebaseLanguageDistribution";
import { EngineeringStackSection } from "./EngineeringStackSection";
import { InteractiveEcosystemMap } from "./InteractiveEcosystemMap";
import { SkillProjectEvidence } from "./SkillProjectEvidence";
import { CodingProfilesSection } from "./CodingProfilesSection";

interface SkillsPageProps {
  onNavigateToProject?: (projectId: string) => void;
}

export function SkillsPage({ onNavigateToProject }: SkillsPageProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-12">
      {/* 1. Header / Identity */}
      <SkillsHero />

      {/* 2. Canonical Aggregated GitHub Language Distribution */}
      <CodebaseLanguageDistribution />

      {/* 3. Structured Engineering Stack Across 6 Disciplines */}
      <EngineeringStackSection
        selectedTech={selectedTech}
        onSelectTech={setSelectedTech}
        onNavigateToProject={onNavigateToProject}
      />

      {/* 4. Interactive Technology -> Domain -> Project -> Repo Map */}
      <InteractiveEcosystemMap
        selectedTechExternal={selectedTech}
        onClearExternalTech={() => setSelectedTech(null)}
      />

      {/* 5. Skill-to-Project Direct Evidence */}
      <SkillProjectEvidence onSelectProject={onNavigateToProject} />

      {/* 6. External Coding Profiles & Algorithmic Practice */}
      <CodingProfilesSection />
    </div>
  );
}

export default SkillsPage;
