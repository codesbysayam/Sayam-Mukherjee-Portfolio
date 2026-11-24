import React, { memo } from "react";
import ErrorBoundary from "./ErrorBoundary";
import EcosystemPage from "./ecosystem/EcosystemPage";

function EcosystemSectionComponent() {
  return (
    <ErrorBoundary fallbackTitle="Ecosystem Architecture Unavailable">
      <div id="ecosystem" className="w-full max-w-[var(--container-standard)] mx-auto px-4 sm:px-6">
        <EcosystemPage />
      </div>
    </ErrorBoundary>
  );
}

export const EcosystemSection = memo(EcosystemSectionComponent);
export default EcosystemSection;
