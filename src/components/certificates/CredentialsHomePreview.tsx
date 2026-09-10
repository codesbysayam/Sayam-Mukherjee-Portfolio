import React, { useState, useEffect } from "react";
import { Certificate } from "../../types/certificates";
import { usePortfolio } from "../../context/PortfolioContext";
import CertificateCard from "./CertificateCard";
import CertificateViewerModal from "./CertificateViewerModal";
import { Award, ArrowRight, Sparkles } from "lucide-react";

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
        if (Array.isArray(data)) {
          const featured = data.filter((c) => c.featured).slice(0, 3);
          setFeaturedCerts(featured);
        }
      })
      .catch((err) => console.error("Error loading featured credentials:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full space-y-6 pt-4 pb-8" id="credentials-home-preview">
      <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 ${
        isLight ? "border-slate-200" : "border-zinc-850/80"
      }`}>
        <div className="space-y-1.5">
          <span className={`text-xs font-mono uppercase tracking-widest block font-bold ${
            isLight ? "text-purple-700" : "text-purple-400"
          }`}>
            CREDENTIALS
          </span>
          <h2 className={`text-xl sm:text-2xl font-bold font-display tracking-tight ${
            isLight ? "text-slate-900" : "text-white"
          }`}>
            Selected Certificates &amp; Achievements
          </h2>
          <p className={`text-xs max-w-xl ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
            Verified milestones, competition honours, and certified technical credentials.
          </p>
        </div>

        <button
          onClick={onNavigateToCertificates}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all self-start sm:self-auto cursor-pointer border ${
            isLight
              ? "bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs"
              : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border-zinc-800 hover:border-zinc-700"
          }`}
        >
          <span>VIEW ALL CERTIFICATES</span>
          <ArrowRight className="w-3.5 h-3.5 text-purple-500" />
        </button>
      </div>

      {loading ? (
        <div className={`py-12 text-center font-mono text-xs ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
          Loading credentials spotlight...
        </div>
      ) : featuredCerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCerts.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onView={setViewingCert}
            />
          ))}
        </div>
      ) : (
        <div className={`p-8 rounded-2xl border border-dashed text-center space-y-3 ${
          isLight 
            ? "border-slate-300 bg-slate-50/50" 
            : "border-zinc-850 bg-[#09090e]/40"
        }`}>
          <Award className="w-6 h-6 text-zinc-500 mx-auto" />
          <p className={`text-xs font-mono ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
            Certificates will appear here once marked as featured.
          </p>
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
