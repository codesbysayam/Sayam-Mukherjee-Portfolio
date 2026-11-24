import React from "react";
import { Certificate, AchievementRecord } from "../../types/certificates";
import { CertificateAchievementCard } from "./AchievementCard";

export interface CertificateCardProps {
  certificate: Certificate;
  onViewDetails?: (record: AchievementRecord) => void;
  onInspect?: (record: AchievementRecord) => void;
  onView?: (cert: Certificate) => void;
  className?: string;
}

/**
 * CertificateCard (Unified Achievement Design System)
 * Re-exports the unified CertificateAchievementCard to guarantee 100% visual consistency
 * across every competition, hackathon, workshop, academic record, and certificate.
 */
export default function CertificateCard({
  certificate,
  onViewDetails,
  onInspect,
  onView,
  className = "",
}: CertificateCardProps) {
  return (
    <CertificateAchievementCard
      record={certificate as AchievementRecord}
      onViewDetails={onViewDetails}
      onInspect={onInspect}
      onView={onView}
      className={className}
    />
  );
}
