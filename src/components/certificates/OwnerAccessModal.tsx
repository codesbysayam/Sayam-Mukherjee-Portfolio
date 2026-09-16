import React, { useState } from "react";
import { Lock, KeyRound, Eye, EyeOff, X, AlertCircle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import ModalPortal from "../common/ModalPortal";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

interface OwnerAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

export default function OwnerAccessModal({
  isOpen,
  onClose,
  onSuccess,
}: OwnerAccessModalProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const [passkey, setPasskey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Body scroll locking
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) {
      setErrorTitle("PASSKEY REQUIRED");
      setErrorMessage("Please enter the owner passkey to continue.");
      return;
    }

    setLoading(true);
    setErrorTitle("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ passkey: passkey.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        const token = data.token || "";
        if (token) {
          try {
            sessionStorage.setItem("vault_token", token);
          } catch {
            // Ignore if sessionStorage restricted
          }
        }
        setTimeout(() => {
          onSuccess(token);
          onClose();
          setPasskey("");
          setSuccess(false);
        }, 650);
      } else if (res.status === 429) {
        setErrorTitle("ACCESS TEMPORARILY LOCKED");
        setErrorMessage(
          data.message ||
            "Too many failed attempts. Security cooldown active. Please wait a few minutes before trying again."
        );
      } else if (res.status === 401) {
        setErrorTitle("INVALID PASSKEY");
        setErrorMessage(data.message || "Access denied. Please check your credentials and try again.");
      } else {
        setErrorTitle("AUTHENTICATION FAILED");
        setErrorMessage(data.message || data.error || "Authentication request rejected. Please retry.");
      }
    } catch (err: any) {
      console.error("Auth request failed:", err);
      setErrorTitle("AUTHENTICATION SERVICE UNAVAILABLE");
      setErrorMessage("Unable to connect to security gateway. Please verify network connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrorTitle("");
    setErrorMessage("");
    setPasskey("");
    setSuccess(false);
    onClose();
  };

  return (
    <ModalPortal>
      <div
        id="owner-access-modal"
        className="certificate-modal-overlay modal-backdrop"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="owner-access-modal-title"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`vault-dialog w-full rounded-2xl border shadow-2xl p-6 sm:p-7 space-y-5 text-left relative overflow-hidden transition-all ${
            isLight
              ? "bg-white border-slate-200 text-slate-900 shadow-[0_25px_60px_rgba(15,23,42,0.15)]"
              : "bg-[#09090e] border-zinc-800/90 text-white shadow-2xl"
          }`}
          style={{
            boxShadow: isLight
              ? "0 24px 60px rgba(15, 23, 42, 0.15), 0 0 40px rgba(109, 40, 217, 0.08)"
              : "0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(168, 85, 247, 0.08)",
          }}
        >
          {/* Subtle accent glow top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500" />

          {/* Modal Header */}
          <div className="flex items-start justify-between gap-3 pt-1">
            <div className="space-y-1">
              <div className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                isLight
                  ? "bg-purple-50 border-purple-200 text-purple-700"
                  : "bg-purple-950/40 border-purple-800/40 text-purple-400"
              }`}>
                <Lock className="w-3.5 h-3.5" />
                <span>OWNER ACCESS</span>
              </div>
              <h2 id="owner-access-modal-title" className={`text-xl font-bold font-display ${isLight ? "text-slate-900" : "text-white"}`}>
                Certificate Vault
              </h2>
            <p className={`text-xs leading-relaxed font-sans ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
              Enter the authorized owner passkey to unlock administrative controls, credential editing, and removal.
            </p>
          </div>
          <button
            id="owner-access-cancel-top-btn"
            onClick={handleClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
              isLight
                ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                : "text-zinc-400 hover:text-white hover:bg-zinc-850"
            }`}
            aria-label="Close owner access modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Messages */}
        {errorTitle && (
          <div className={`p-3.5 border rounded-xl space-y-1 text-xs ${
            isLight ? "bg-red-50 border-red-200" : "bg-red-950/30 border-red-900/60"
          }`}>
            <div className={`flex items-center gap-2 font-mono font-bold tracking-wide ${
              isLight ? "text-red-700" : "text-red-400"
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorTitle}</span>
            </div>
            <p className={`text-[11px] leading-relaxed pl-6 ${
              isLight ? "text-red-600" : "text-red-300"
            }`}>
              {errorMessage}
            </p>
          </div>
        )}

        {success && (
          <div className={`p-3.5 border rounded-xl flex items-center gap-3 text-xs ${
            isLight
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-emerald-950/30 border-emerald-900/60 text-emerald-300"
          }`}>
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 animate-bounce" />
            <div>
              <span className={`font-mono font-bold tracking-wider uppercase block ${
                isLight ? "text-emerald-700" : "text-emerald-400"
              }`}>
                ACCESS GRANTED
              </span>
              <span className={`text-[11px] ${isLight ? "text-emerald-600" : "text-emerald-300/90"}`}>
                Owner session unlocked successfully. Initializing vault controls...
              </span>
            </div>
          </div>
        )}

        {/* Passkey Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="owner-passkey-input" className={`text-xs font-mono flex items-center justify-between font-medium ${
              isLight ? "text-slate-700" : "text-zinc-300"
            }`}>
              <span>Owner Passkey</span>
              <span className={`text-xs font-sans ${isLight ? "text-slate-400" : "text-zinc-500"}`}>Required</span>
            </label>
            <div className="relative">
              <KeyRound className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                isLight ? "text-slate-400" : "text-zinc-500"
              }`} />
              <input
                id="owner-passkey-input"
                type={showPassword ? "text" : "password"}
                autoFocus
                required
                aria-label="Owner Passkey"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter owner passkey"
                className={`w-full border rounded-xl pl-10 pr-11 py-2.5 text-xs font-mono transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                  isLight
                    ? "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:bg-white"
                    : "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 focus:border-purple-500"
                }`}
              />
              <button
                type="button"
                id="toggle-owner-passkey-visibility"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors cursor-pointer ${
                  isLight ? "text-slate-400 hover:text-slate-700" : "text-zinc-400 hover:text-zinc-200"
                }`}
                title={showPassword ? "Hide passkey" : "Show passkey"}
                aria-label={showPassword ? "Hide passkey" : "Show passkey"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons: Unlock & Cancel */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              id="owner-access-cancel-btn"
              onClick={handleClose}
              disabled={loading || success}
              className={`px-4 py-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${
                isLight
                  ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                  : "bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border-zinc-800"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="owner-access-unlock-btn"
              disabled={loading || success || !passkey.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50 select-none font-mono"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : success ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Unlocked</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </ModalPortal>
  );
}
