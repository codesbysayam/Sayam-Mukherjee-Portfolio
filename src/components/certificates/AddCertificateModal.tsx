import React, { useState, useEffect } from "react";
import { Certificate, CertificateCategory, StorageStatus } from "../../types/certificates";
import { usePortfolio } from "../../context/PortfolioContext";
import { 
  X, Upload, Link as LinkIcon, FileText, Check, AlertCircle, 
  ShieldAlert, Sparkles, CheckCircle2, ShieldCheck, Loader2
} from "lucide-react";

interface AddCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingCertificate?: Certificate | null;
  vaultToken: string;
}

const CATEGORIES: Exclude<CertificateCategory, "ALL">[] = [
  "CERTIFICATIONS",
  "ACHIEVEMENTS",
  "COMPETITIONS",
  "COURSES",
  "WORKSHOPS",
  "OTHER"
];

export default function AddCertificateModal({
  isOpen,
  onClose,
  onSaved,
  editingCertificate,
  vaultToken
}: AddCertificateModalProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    category: "CERTIFICATIONS" as Exclude<CertificateCategory, "ALL">,
    issueDate: new Date().getFullYear().toString(),
    expiryDate: "",
    credentialId: "",
    credentialUrl: "",
    description: "",
    skills: "",
    imageUrl: "",
    pdfUrl: "",
    featured: false,
  });

  const [storageStatus, setStorageStatus] = useState<StorageStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerifyingUrl, setIsVerifyingUrl] = useState(false);
  const [urlVerifiedResult, setUrlVerifiedResult] = useState<string | null>(null);

  // Check cloud storage status on modal open
  useEffect(() => {
    if (isOpen) {
      fetch("/api/certificates/storage-status")
        .then((res) => res.json())
        .then((data) => setStorageStatus(data))
        .catch(() => {
          setStorageStatus({
            database: "embedded_store_active",
            objectStorage: "not_configured",
            message: "Unable to retrieve storage status"
          });
        });
    }
  }, [isOpen]);

  // Pre-fill form if editing
  useEffect(() => {
    if (editingCertificate) {
      setFormData({
        title: editingCertificate.title || "",
        issuer: editingCertificate.issuer || "",
        category: editingCertificate.category || "CERTIFICATIONS",
        issueDate: editingCertificate.issueDate || "",
        expiryDate: editingCertificate.expiryDate || "",
        credentialId: editingCertificate.credentialId || "",
        credentialUrl: editingCertificate.credentialUrl || "",
        description: editingCertificate.description || "",
        skills: Array.isArray(editingCertificate.skills) ? editingCertificate.skills.join(", ") : "",
        imageUrl: editingCertificate.imageUrl || "",
        pdfUrl: editingCertificate.pdfUrl || "",
        featured: Boolean(editingCertificate.featured),
      });
    } else {
      setFormData({
        title: "",
        issuer: "",
        category: "CERTIFICATIONS",
        issueDate: new Date().getFullYear().toString(),
        expiryDate: "",
        credentialId: "",
        credentialUrl: "",
        description: "",
        skills: "",
        imageUrl: "",
        pdfUrl: "",
        featured: false,
      });
    }
    setErrorMessage("");
    setSuccessMessage("");
    setUrlVerifiedResult(null);
  }, [editingCertificate, isOpen]);

  if (!isOpen) return null;

  const handleVerifyCredentialUrl = async () => {
    if (!formData.credentialUrl) return;
    setIsVerifyingUrl(true);
    setUrlVerifiedResult(null);
    try {
      const res = await fetch("/api/certificates/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentialUrl: formData.credentialUrl }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setUrlVerifiedResult(`Valid registry format: ${data.host}`);
      } else {
        setUrlVerifiedResult(data.message || "Invalid URL");
      }
    } catch {
      setUrlVerifiedResult("Failed to reach verification endpoint");
    } finally {
      setIsVerifyingUrl(false);
    }
  };

  const handleFileUploadAttempt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if cloud storage is configured
    if (storageStatus?.objectStorage === "not_configured") {
      setErrorMessage(
        "STORAGE NOT CONFIGURED: Cloud Object Storage credentials (SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY or Vercel Blob) are not detected in environment variables. Local browser storage is strictly disabled for permanent files. Please paste a direct image or PDF URL instead."
      );
      e.target.value = "";
      return;
    }

    // If storage is configured, read and submit file
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        const effectiveToken = vaultToken || (typeof window !== "undefined" ? sessionStorage.getItem("vault_token") : null);
        if (effectiveToken) {
          headers["Authorization"] = `Bearer ${effectiveToken}`;
        }
        const uploadRes = await fetch("/api/certificates/upload", {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileData: base64Data,
            title: formData.title,
            issuer: formData.issuer,
            year: formData.issueDate,
          }),
        });
        const uploadJson = await uploadRes.json();
        if (uploadRes.status === 401) {
          setErrorMessage("SESSION EXPIRED. Please close this window and unlock owner access again.");
          return;
        }
        if (uploadRes.ok && uploadJson.url) {
          if (file.type.includes("pdf")) {
            setFormData(prev => ({ ...prev, pdfUrl: uploadJson.url }));
          } else {
            setFormData(prev => ({ ...prev, imageUrl: uploadJson.url }));
          }
          setSuccessMessage("File attached and uploaded successfully!");
        } else {
          setErrorMessage(uploadJson.error || "File upload failed.");
        }
      } catch (err: any) {
        setErrorMessage(err.message || "File upload processing failed.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const isEditing = Boolean(editingCertificate && editingCertificate.id);
      const url = isEditing ? `/api/certificates/${editingCertificate!.id}` : "/api/certificates";
      const method = isEditing ? "PUT" : "POST";

      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        title: formData.title.trim(),
        issuer: formData.issuer.trim(),
        category: formData.category,
        issueDate: formData.issueDate.trim(),
        expiryDate: formData.expiryDate ? formData.expiryDate.trim() : undefined,
        credentialId: formData.credentialId ? formData.credentialId.trim() : undefined,
        credentialUrl: formData.credentialUrl ? formData.credentialUrl.trim() : undefined,
        description: formData.description ? formData.description.trim() : undefined,
        skills: skillsArray,
        imageUrl: formData.imageUrl ? formData.imageUrl.trim() : undefined,
        pdfUrl: formData.pdfUrl ? formData.pdfUrl.trim() : undefined,
        featured: Boolean(formData.featured),
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      const effectiveToken = vaultToken || (typeof window !== "undefined" ? sessionStorage.getItem("vault_token") : null);
      if (effectiveToken) {
        headers["Authorization"] = `Bearer ${effectiveToken}`;
      }

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 401) {
        throw new Error("SESSION EXPIRED. Please close this window and unlock owner access again.");
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to save certificate.");
      }

      setSuccessMessage(isEditing ? "Certificate updated successfully!" : "Certificate created successfully!");
      setTimeout(() => {
        onSaved();
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = isLight
    ? "w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
    : "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl my-8 rounded-2xl border shadow-2xl p-6 sm:p-8 space-y-6 ${
          isLight
            ? "bg-white border-slate-200 text-slate-800 shadow-[0_25px_60px_rgba(15,23,42,0.15)]"
            : "bg-[#0b0b10] border-zinc-800 text-zinc-200 shadow-2xl"
        }`}
      >
        {/* Header */}
        <div className={`flex items-start justify-between border-b pb-4 ${isLight ? "border-slate-200" : "border-zinc-850"}`}>
          <div>
            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${isLight ? "text-purple-700" : "text-cyan-400"}`}>
              VAULT ADMINISTRATION
            </span>
            <h2 className={`text-xl font-bold font-display mt-0.5 ${isLight ? "text-slate-900" : "text-white"}`}>
              {editingCertificate ? "Edit Certificate Record" : "Add New Credential"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isLight ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cloud Object Storage Status Warning */}
        {storageStatus && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
            storageStatus.objectStorage === "cloud_configured"
              ? isLight
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
              : isLight
                ? "bg-slate-100 border-slate-200 text-slate-700"
                : "bg-zinc-900/80 border-zinc-800 text-zinc-400"
          }`}>
            <div className="shrink-0 mt-0.5">
              {storageStatus.objectStorage === "cloud_configured" ? (
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${isLight ? "text-slate-900" : "text-zinc-200"}`}>Storage Architecture:</span>
                <span className={`font-mono text-[11px] px-2 py-0.5 rounded uppercase border ${
                  isLight ? "bg-white border-slate-200 text-slate-800" : "bg-black/40 border-zinc-800 text-zinc-300"
                }`}>
                  {storageStatus.objectStorage === "cloud_configured" ? "Cloud Storage Connected" : "STORAGE NOT CONFIGURED"}
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                {storageStatus.objectStorage === "cloud_configured"
                  ? "Direct binary uploads will be persisted to your cloud object store."
                  : "Cloud storage secrets not present. To preserve zero-loss permanent storage without risking ephemeral container resets, use direct URLs for images & PDFs."}
              </p>
            </div>
          </div>
        )}

        {/* Error / Success Messages */}
        {errorMessage && (
          <div className={`p-3 border rounded-xl text-xs flex items-start gap-2 ${
            isLight ? "bg-red-50 border-red-200 text-red-700" : "bg-red-950/30 border-red-900/50 text-red-300"
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className={`p-3 border rounded-xl text-xs flex items-start gap-2 ${
            isLight ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-emerald-950/30 border-emerald-900/50 text-emerald-300"
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Certificate Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className={`text-xs font-mono block font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
                Certificate / Credential Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Deep Learning Specialization"
                className={inputClasses}
              />
            </div>

            {/* Issuer */}
            <div className="space-y-1.5">
              <label className={`text-xs font-mono block font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
                Issuing Organization *
              </label>
              <input
                type="text"
                required
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="e.g. Stanford Online, Coursera, Google"
                className={inputClasses}
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className={`text-xs font-mono block font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className={inputClasses}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Date */}
            <div className="space-y-1.5">
              <label className={`text-xs font-mono block font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
                Issue Date * (e.g. 2026, 2025-10)
              </label>
              <input
                type="text"
                required
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                placeholder="2026"
                className={`${inputClasses} font-mono`}
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-1.5">
              <label className={`text-xs font-mono block font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
                Expiry Date (Optional)
              </label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                placeholder="None or YYYY"
                className={`${inputClasses} font-mono`}
              />
            </div>

            {/* Credential ID */}
            <div className="space-y-1.5">
              <label className={`text-xs font-mono block font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
                Credential ID / License #
              </label>
              <input
                type="text"
                value={formData.credentialId}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                placeholder="e.g. ABCD-1234-EFGH"
                className={`${inputClasses} font-mono`}
              />
            </div>

            {/* Credential URL & Verify Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={`text-xs font-mono block font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
                  Verification Registry URL
                </label>
                {formData.credentialUrl && (
                  <button
                    type="button"
                    onClick={handleVerifyCredentialUrl}
                    disabled={isVerifyingUrl}
                    className="text-[10px] font-mono text-cyan-500 hover:text-cyan-400 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifyingUrl ? "Testing..." : "Test URL"}
                  </button>
                )}
              </div>
              <input
                type="url"
                value={formData.credentialUrl}
                onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                placeholder="https://..."
                className={`${inputClasses} font-mono`}
              />
              {urlVerifiedResult && (
                <p className="text-[10px] font-mono text-cyan-600 pt-0.5">{urlVerifiedResult}</p>
              )}
            </div>

            {/* Skills Learned */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className={`text-xs font-mono block font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
                Skills / Topics (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Python, PyTorch, Model Optimization, Distributed Systems"
                className={inputClasses}
              />
            </div>

            {/* Direct Image URL */}
            <div className="space-y-1.5">
              <label className={`text-xs font-mono block font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
                Direct Image URL (PNG/JPG/WEBP)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                className={`${inputClasses} font-mono`}
              />
            </div>

            {/* Direct PDF URL */}
            <div className="space-y-1.5">
              <label className={`text-xs font-mono block font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
                Direct PDF URL
              </label>
              <input
                type="url"
                value={formData.pdfUrl}
                onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                placeholder="https://...file.pdf"
                className={`${inputClasses} font-mono`}
              />
            </div>

            {/* File Upload Field */}
            <div className="sm:col-span-2 space-y-1.5 pt-1">
              <label className={`text-xs font-mono block font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
                Attach File to Object Storage (PNG, JPG, PDF)
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                onChange={handleFileUploadAttempt}
                className={`block w-full text-xs cursor-pointer ${
                  isLight
                    ? "text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-purple-700 hover:file:bg-slate-200"
                    : "text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-purple-400 hover:file:bg-zinc-850"
                }`}
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className={`text-xs font-mono block font-medium ${isLight ? "text-slate-700" : "text-zinc-400"}`}>
                Description / Highlights
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Summary of credential requirements, capstone projects, or competitive standing..."
                className={`${inputClasses} resize-none`}
              />
            </div>

            {/* Featured Checkbox */}
            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="featured-checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="featured-checkbox" className={`text-xs font-medium cursor-pointer ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
                Feature on Homepage &amp; Top Credential Spotlight
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className={`flex items-center justify-end gap-3 pt-6 border-t ${isLight ? "border-slate-200" : "border-zinc-850"}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                isLight
                  ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl shadow-lg shadow-purple-600/20 transition-all cursor-pointer font-mono"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editingCertificate ? "Update Certificate" : "Save Credential"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
