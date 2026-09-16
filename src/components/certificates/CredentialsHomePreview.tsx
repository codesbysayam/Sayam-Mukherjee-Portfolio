import React, { useState, useEffect } from "react";
import { Certificate } from "../../types/certificates";
import { usePortfolio } from "../../context/PortfolioContext";
import CertificateCard from "./CertificateCard";
import CertificateViewerModal from "./CertificateViewerModal";
import { Award, ArrowRight, Sparkles } from "lucide-react";
import { INITIAL_CERTIFICATES } from "../../data/initialCertificates";

interface CredentialsHomePreviewProps {
  onNavigateToCertificates: () => void;
}

export default function CredentialsHomePreview({ onNavigateToCertificates }: CredentialsHomePreviewProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const [featuredCerts, setFeaturedCerts] = useState<Certificate[]>([]);
  const [viewingCert, setViewingCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/certificates")
      .then((res) => res.json())
      .then((data: Certificate[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const featured = data.filter((c) => c.featured).slice(0, 3);
          setFeaturedCerts(featured.length > 0 ? featured : data.slice(0, 3));
        } else {
          setFeaturedCerts(INITIAL_CERTIFICATES.filter((c) => c.featured).slice(0, 3));
        }
      })
      .catch((err) => {
        console.error("Error loading featured credentials:", err);
        setFeaturedCerts(INITIAL_CERTIFICATES.filter((c) => c.featured).slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  // If not loading and no certificates exist, gracefully hide section to avoid "under construction" feeling
  if (!loading && featuredCerts.length === 0) {
    return null;
  }

  return (
    <section className="w-full space-y-6 pt-4 pb-8" id="credentials-home-preview">
      <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 ${
        isLight ? "border-slate-200" : "border-zinc-850/80"
      }`}>
        <div className="space-y-1.5">
          <span className={`text-xs font-mono tracking-wider block font-semibold ${
            isLight ? "text-purple-700" : "text-purple-400"
          }`}>
            Credentials &amp; Milestones
          </span>
          <h2 className={`text-xl sm:text-2xl font-bold font-display tracking-tight ${
            isLight ? "text-slate-900" : "text-white"
          }`}>
            Selected Certificates &amp; Achievements
          </h2>
          <p className={`text-sm max-w-xl ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
            Verified milestones, competition honours, and certified technical credentials.
          </p>
        </div>

        <button
          onClick={onNavigateToCertificates}
          className="btn btn-secondary !py-2 !px-4 !text-xs self-start sm:self-auto"
        >
          <span>View all credentials</span>
          <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
        </button>
      </div>

      {loading ? (
        <div className={`py-12 text-center font-mono text-xs ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
          Loading credentials spotlight...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCerts.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onView={setViewingCert}
            />
          ))}
        </div>
      )}

      {/* Modal viewer if clicked from home */}
      <CertificateViewerModal
        certificate={viewingCert}
        onClose={() => setViewingCert(null)}
      />
    </section>
  );
}
