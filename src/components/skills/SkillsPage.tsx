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

      {/* 2. Real Aggregated GitHub Language Distribution */}
      <section>
        <CodebaseLanguageDistribution />
      </section>

      {/* 3. Structured Engineering Stack Across 6 Disciplines */}
      <section>
        <EngineeringStackSection
          selectedTech={selectedTech}
          onSelectTech={setSelectedTech}
        />
      </section>

      {/* 4. Interactive Technology -> Domain -> Project -> Repo Map */}
      <InteractiveEcosystemMap
        selectedTechExternal={selectedTech}
        onClearExternalTech={() => setSelectedTech(null)}
      />

      {/* 5. Skill-to-Project Direct Evidence */}
      <section>
        <SkillProjectEvidence onSelectProject={onNavigateToProject} />
      </section>

      {/* 6. External Coding Profiles & Algorithmic Practice */}
      <section>
        <CodingProfilesSection />
      </section>
    </div>
  );
}

export default SkillsPage;
