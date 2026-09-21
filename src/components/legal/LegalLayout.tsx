import React from "react";
import LegalDocumentLayout, {
  LegalDocumentLayoutProps,
  TOCSection,
} from "./LegalDocumentLayout";

export type { TOCSection, LegalDocumentLayoutProps as LegalLayoutProps };

export const LegalLayout: React.FC<LegalDocumentLayoutProps> = (props) => {
  return <LegalDocumentLayout {...props} />;
};

export default LegalLayout;
