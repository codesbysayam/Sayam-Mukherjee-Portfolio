import React from "react";
import { Certificate, AchievementRecord } from "../../types/certificates";
import { AchievementCard } from "./AchievementCard";

export interface CertificateCardProps {
  certificate: Certificate;
  onView: (cert: Certificate) => void;
  className?: string;
}

/**
 * CertificateCard (Unified Achievement Design System)
 * Re-exports the unified AchievementCard to guarantee 100% visual consistency
 * across every competition, hackathon, workshop, academic record, and certificate.
 */
export default function CertificateCard({
  certificate,
  onView,
  className = "",
}: CertificateCardProps) {
  return (
    <AchievementCard
      record={certificate as AchievementRecord}
      onView={onView}
      className={className}
    />
  );
}

export { AchievementCard };
