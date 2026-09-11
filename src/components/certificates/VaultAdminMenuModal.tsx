import React from "react";
import { Lock, Plus, LogOut, X, ShieldCheck, Award } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import ModalPortal from "../common/ModalPortal";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

interface VaultAdminMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNewCertificate: () => void;
  onLockVault: () => void;
  totalCertificates: number;
}

export default function VaultAdminMenuModal({
  isOpen,
  onClose,
  onAddNewCertificate,
  onLockVault,
  totalCertificates,
}: VaultAdminMenuModalProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  // Lock background scroll
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        id="vault-admin-menu-modal"
        className="certificate-modal-overlay modal-backdrop"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vault-admin-menu-title"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`vault-dialog w-full rounded-2xl border shadow-2xl p-5 sm:p-6 space-y-4 text-left relative overflow-hidden ${
            isLight
              ? "bg-white border-slate-200 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.15)]"
              : "bg-[#09090e] border-zinc-800 text-white shadow-2xl"
          }`}
          style={{
            boxShadow: isLight
              ? "0 24px 60px rgba(15, 23, 42, 0.15), 0 0 35px rgba(109, 40, 217, 0.08)"
              : "0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(168, 85, 247, 0.1)",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className={`flex items-center gap-2 font-mono text-[11px] font-bold ${
              isLight ? "text-emerald-600" : "text-emerald-400"
            }`}>
              <ShieldCheck className="w-4 h-4" />
              <span>VAULT ADMIN ACTIVE</span>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isLight
                  ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-850"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <h3 id="vault-admin-menu-title" className={`text-base font-bold font-display ${isLight ? "text-slate-900" : "text-white"}`}>
              Vault Management Controls
            </h3>
            <p className={`text-xs font-sans ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
              You are authenticated as owner. You have full edit, upload, and deletion capabilities across all {totalCertificates} credentials.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {/* Add Certificate Button */}
            <button
              id="admin-menu-add-certificate-btn"
              onClick={() => {
                onClose();
                onAddNewCertificate();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition-all cursor-pointer font-mono"
            >
              <Plus className="w-4 h-4" />
              <span>+ ADD NEW CERTIFICATE</span>
            </button>

            {/* Lock Vault / Logout Button */}
            <button
              id="admin-menu-lock-vault-btn"
              onClick={() => {
                onClose();
                onLockVault();
              }}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-colors cursor-pointer border ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                  : "bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border-zinc-800"
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>LOCK VAULT (LOGOUT)</span>
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
