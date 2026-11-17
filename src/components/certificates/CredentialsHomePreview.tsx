import { useState, useEffect } from "react";
import { Certificate } from "../../types/certificates";
import AchievementGrid from "./AchievementGrid";
import CertificateViewerModal from "./CertificateViewerModal";
import { ArrowRight } from "lucide-react";
import { INITIAL_CERTIFICATES } from "../../data/initialCertificates";
import { EditorialReveal } from "../../motion/Reveal";

interface CredentialsHomePreviewProps {
  onNavigateToCertificates: () => void;
}

export default function CredentialsHomePreview({
  onNavigateToCertificates,
}: CredentialsHomePreviewProps) {
  const [featuredCerts, setFeaturedCerts] = useState<Certificate[]>([]);
  const [viewingCert, setViewingCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/certificates")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ct = res.headers.get("content-type");
        if (!ct || !ct.includes("application/json")) throw new Error("Expected JSON");
        return res.json();
      })
      .then((data: Certificate[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const featured = data.filter((c) => c.featured).slice(0, 4);
          setFeaturedCerts(featured.length > 0 ? featured : data.slice(0, 4));
        } else {
          setFeaturedCerts(INITIAL_CERTIFICATES.filter((c) => c.featured).slice(0, 4));
        }
      })
      .catch(() => {
        setFeaturedCerts(INITIAL_CERTIFICATES.filter((c) => c.featured).slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  if (!loading && featuredCerts.length === 0) {
    return null;
  }

  return (
    <section className="w-full space-y-6 pt-4 pb-6" id="credentials-home-preview">
      <EditorialReveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-[0.14em] block font-semibold text-[var(--accent)]">
              05 / Verified Credentials &amp; Milestones
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-[var(--text)]">
              Selected Certificates &amp;{" "}
              <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                Achievements
              </span>
            </h2>
            <p className="text-sm max-w-xl text-[var(--text-secondary)]">
              Verified hackathon awards, research exhibits, and academic records.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToCertificates}
            className="btn btn-secondary text-xs self-start sm:self-auto group"
          >
            <span>View All Credentials</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </EditorialReveal>

      {loading ? (
        <div className="py-12 text-center font-mono text-xs text-[var(--text-muted)]">
          Loading credentials spotlight...
        </div>
      ) : (
        <AchievementGrid
          records={featuredCerts}
          onView={setViewingCert}
          columns={3}
        />
      )}

      <CertificateViewerModal
        certificate={viewingCert}
        onClose={() => setViewingCert(null)}
      />
    </section>
  );
}
