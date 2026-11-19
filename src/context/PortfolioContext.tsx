import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import {
  Project,
  SkillGroup,
  Blog,
  ExperienceItem,
  Certification,
  SAYAM_DATA,
} from "../data";
import { Certificate } from "../types/certificates";
import {
  ADMIN_OWNER_EMAIL,
  auth,
  googleAuthProvider,
} from "../lib/firebase";
import { isAnalyticsAllowed } from "../services/consent";

interface ContactFormFields {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  country: string;
  phone: string;
  subject: string;
  message: string;
  budget: string;
  timeline: string;
  attachmentName?: string | null;
  attachmentData?: string | null;
}

export interface ContactSubmissionResult {
  success: boolean;
  submissionId?: string;
  delivered?: boolean;
  deliveryStatus?: "sent" | "stored_pending_email_config" | "failed";
  deliveryMessage?: string;
  error?: string;
}

export interface NewsletterBroadcastResult {
  success: boolean;
  deliveryStatus?: "sent" | "stored_pending_email_config" | "failed";
  provider?: "resend" | "none";
  sentCount?: number;
  failedCount?: number;
  error?: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  approved: boolean;
  avatar: string;
  date: string;
}

interface PortfolioData {
  projects: Project[];
  blogs: Blog[];
  certifications: Certification[];
  skills: SkillGroup[];
  experience: ExperienceItem[];
  achievements: string[];
  learningDashboard: typeof SAYAM_DATA.learningDashboard;
  stats: typeof SAYAM_DATA.stats;
  socials: typeof SAYAM_DATA.socials;
  testimonials: Testimonial[];
}

interface PortfolioContextType {
  portfolioData: PortfolioData;
  isLoading: boolean;
  authReady: boolean;
  isAdmin: boolean;
  adminEmail: string | null;
  adminToken: string | null;
  signInWithAdminGoogle: () => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  submitContactForm: (
    fields: ContactFormFields
  ) => Promise<ContactSubmissionResult>;
  subscribeNewsletter: (
    email: string
  ) => Promise<{ success: boolean; already?: boolean; error?: string }>;
  submitTestimonial: (fields: {
    name: string;
    role: string;
    content: string;
    avatar?: string;
  }) => Promise<boolean>;

  // Admin Operations
  updatePortfolioSection: (
    updatedState: Partial<PortfolioData>
  ) => Promise<boolean>;
  fetchAdminMessages: () => Promise<any[]>;
  actionAdminMessage: (
    id: string,
    action: "archive" | "delete" | "reply"
  ) => Promise<any[]>;
  fetchAdminSubscribers: () => Promise<any[]>;
  deleteAdminSubscriber: (id: string) => Promise<any[]>;
  sendAdminNewsletterBroadcast: (
    subject: string,
    body: string
  ) => Promise<NewsletterBroadcastResult>;
  fetchAdminTestimonials: () => Promise<Testimonial[]>;
  actionAdminTestimonial: (
    id: string,
    action: "approve" | "reject"
  ) => Promise<any[]>;
  fetchAdminAnalytics: () => Promise<any>;

  // Certificates CRUD
  fetchAdminCertificates: () => Promise<Certificate[]>;
  createAdminCertificate: (
    payload: Partial<Certificate>
  ) => Promise<{ success: boolean; certificate?: Certificate; error?: string }>;
  updateAdminCertificate: (
    id: string,
    payload: Partial<Certificate>
  ) => Promise<{ success: boolean; certificate?: Certificate; error?: string }>;
  deleteAdminCertificate: (
    id: string
  ) => Promise<{ success: boolean; error?: string }>;

  // Theme state
  theme: "dark" | "light";
  toggleTheme: () => void;

  // Tracking
  trackVisit: (page: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined
);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "sess_ssr";
  try {
    const existing = window.sessionStorage.getItem("sayam_session_id");
    if (existing) return existing;
    const generated =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? `sess_${crypto.randomUUID()}`
        : `sess_${Date.now().toString(36)}_${Math.random()
            .toString(36)
            .slice(2, 10)}`;
    window.sessionStorage.setItem("sayam_session_id", generated);
    return generated;
  } catch {
    return `sess_${Date.now().toString(36)}`;
  }
}

function detectDeviceType(): "Desktop" | "Mobile" | "Tablet" {
  if (typeof navigator === "undefined") return "Desktop";
  const ua = navigator.userAgent || "";
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) {
    return "Tablet";
  }
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

function detectReferrerSource(): string {
  if (typeof document === "undefined" || !document.referrer) return "Direct";
  const ref = document.referrer.toLowerCase();
  if (ref.includes("linkedin")) return "LinkedIn";
  if (ref.includes("github")) return "GitHub";
  if (ref.includes("google")) return "Google";
  if (ref.includes("youtube")) return "YouTube";
  if (ref.includes("instagram")) return "Instagram";
  if (ref.includes("twitter") || ref.includes("x.com")) return "X / Twitter";
  try {
    const hostname = new URL(document.referrer).hostname.replace(/^www\./, "");
    return hostname || "Referral";
  } catch {
    return "Direct";
  }
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    projects: [],
    blogs: [],
    certifications: [],
    skills: [],
    experience: [],
    achievements: [],
    learningDashboard: SAYAM_DATA.learningDashboard,
    stats: SAYAM_DATA.stats,
    socials: SAYAM_DATA.socials,
    testimonials: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved =
        localStorage.getItem("sayam_theme") || localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
    }
    return "light";
  });

  // Active page timing refs for real dwell tracking
  const activePageRef = useRef<{
    page: string;
    enteredAt: number;
    device: "Desktop" | "Mobile" | "Tablet";
    source: string;
    lastSentForEntry: boolean;
  } | null>(null);
  const lastTrackedPageRef = useRef<{ page: string; ts: number } | null>(null);

  const applyTheme = (t: "dark" | "light") => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t);
    if (t === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    }
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        t === "light" ? "#F4F4ED" : "#20231D"
      );
    }
  };

  // Load Public Portfolio Data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts && isMounted) {
        try {
          const res = await fetch("/api/portfolio-data");
          if (res.ok) {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await res.json();
              if (isMounted) {
                setPortfolioData({
                  projects: data.projects || [],
                  blogs: data.blogs || [],
                  certifications: data.certifications || [],
                  skills: data.skills || [],
                  experience: data.experience || [],
                  achievements: data.achievements || [],
                  learningDashboard:
                    data.learningDashboard || SAYAM_DATA.learningDashboard,
                  stats: data.stats || SAYAM_DATA.stats,
                  socials: data.socials || SAYAM_DATA.socials,
                  testimonials: data.testimonials || [],
                });
              }
              return;
            }
          }
        } catch {
          // Server may be momentarily initializing
        }

        attempts++;
        if (attempts < maxAttempts && isMounted) {
          await new Promise((r) => setTimeout(r, 500 * attempts));
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    fetchData().finally(() => {
      if (isMounted) setIsLoading(false);
    });

    const savedTheme = (localStorage.getItem("sayam_theme") ||
      localStorage.getItem("theme")) as "dark" | "light" | null;
    const resolvedTheme = savedTheme === "dark" ? "dark" : "light";
    setTheme(resolvedTheme);
    applyTheme(resolvedTheme);

    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize Firebase Auth state with server admin session check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setAdminEmail(null);
        setAdminToken(null);
        setAuthReady(true);
        return;
      }

      const normalized = (user.email || "").toLowerCase();
      if (!user.emailVerified || normalized !== ADMIN_OWNER_EMAIL) {
        setIsAdmin(false);
        setAdminEmail(null);
        setAdminToken(null);
        setAuthReady(true);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/session", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setIsAdmin(true);
          setAdminEmail(user.email || ADMIN_OWNER_EMAIL);
          setAdminToken(token);
        } else {
          setIsAdmin(false);
          setAdminEmail(null);
          setAdminToken(null);
        }
      } catch {
        setIsAdmin(false);
        setAdminEmail(null);
        setAdminToken(null);
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Flush real page dwell duration on visibilitychange / pagehide
  useEffect(() => {
    const flushDuration = () => {
      const active = activePageRef.current;
      if (!active || active.lastSentForEntry || !isAnalyticsAllowed()) return;
      const elapsedSec = Math.round((Date.now() - active.enteredAt) / 1000);
      if (elapsedSec < 1) return;

      active.lastSentForEntry = true;
      const payload = JSON.stringify({
        eventType: "session_duration",
        sessionId: getOrCreateSessionId(),
        page: active.page,
        device: active.device,
        source: active.source,
        durationSec: elapsedSec,
      });

      try {
        if (
          typeof navigator !== "undefined" &&
          typeof navigator.sendBeacon === "function"
        ) {
          const blob = new Blob([payload], { type: "application/json" });
          navigator.sendBeacon("/api/analytics/visit", blob);
        } else {
          void fetch("/api/analytics/visit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          });
        }
      } catch {
        // Non-blocking telemetry
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushDuration();
      }
    };

    window.addEventListener("pagehide", flushDuration);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", flushDuration);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("sayam_theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  };

  // Privacy & consent-respecting analytics tracking
  const trackVisit = useCallback((page: string) => {
    if (!isAnalyticsAllowed()) return;

    const now = Date.now();
    // Prevent mount + initial activeTab effect double-firing within 400ms
    if (
      lastTrackedPageRef.current &&
      now - lastTrackedPageRef.current.ts < 400
    ) {
      return;
    }
    lastTrackedPageRef.current = { page, ts: now };

    const sessionId = getOrCreateSessionId();
    const device = detectDeviceType();
    const source = detectReferrerSource();

    // Flush elapsed dwell time for the prior active page view before starting the new page timer
    const prev = activePageRef.current;
    if (prev && !prev.lastSentForEntry) {
      const elapsedSec = Math.round((now - prev.enteredAt) / 1000);
      if (elapsedSec >= 1) {
        prev.lastSentForEntry = true;
        void fetch("/api/analytics/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "session_duration",
            sessionId,
            page: prev.page,
            device: prev.device,
            source: prev.source,
            durationSec: elapsedSec,
          }),
          keepalive: true,
        }).catch(() => {});
      }
    }

    activePageRef.current = {
      page,
      enteredAt: now,
      device,
      source,
      lastSentForEntry: false,
    };

    void fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "page_view",
        sessionId,
        page,
        device,
        source,
        durationSec: 0,
      }),
    }).catch(() => {});
  }, []);

  // Build fresh Bearer auth headers for server admin endpoints
  const getAdminHeaders = async (): Promise<Record<string, string> | null> => {
    const user = auth.currentUser;
    if (!user) return null;
    try {
      const token = await user.getIdToken();
      setAdminToken(token);
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    } catch {
      return null;
    }
  };

  // Real Firebase Google Sign-In
  const signInWithAdminGoogle = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const credential = await signInWithPopup(auth, googleAuthProvider);
      const user = credential.user;
      const email = (user.email || "").toLowerCase();

      if (!user.emailVerified || email !== ADMIN_OWNER_EMAIL) {
        await signOut(auth);
        setIsAdmin(false);
        setAdminEmail(null);
        setAdminToken(null);
        return {
          success: false,
          error: `Access denied. Only verified administrator ${ADMIN_OWNER_EMAIL} is permitted.`,
        };
      }

      const token = await user.getIdToken(true);
      const res = await fetch("/api/admin/session", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        await signOut(auth);
        return {
          success: false,
          error:
            errBody.error ||
            "Server rejected administrative session credentials.",
        };
      }

      setIsAdmin(true);
      setAdminEmail(user.email || ADMIN_OWNER_EMAIL);
      setAdminToken(token);
      return { success: true };
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/popup-closed-by-user") {
        return { success: false, error: "Google sign-in popup was closed." };
      }
      if (code === "auth/popup-blocked") {
        return {
          success: false,
          error: "Sign-in popup was blocked by your browser. Please allow popups and retry.",
        };
      }
      return {
        success: false,
        error: err?.message || "Firebase Google authentication failed.",
      };
    }
  };

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
    } finally {
      setAdminToken(null);
      setAdminEmail(null);
      setIsAdmin(false);
    }
  };

  // Contact form post
  const submitContactForm = async (
    fields: ContactFormFields
  ): Promise<ContactSubmissionResult> => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        return {
          success: true,
          submissionId: data.submissionId,
          delivered: data.delivered,
          deliveryStatus: data.deliveryStatus,
          deliveryMessage: data.deliveryMessage,
        };
      }
      return {
        success: false,
        error: data.error || `Request failed with status ${res.status}`,
      };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error ? err.message : "Network error submitting form.",
      };
    }
  };

  // Subscriber newsletter
  const subscribeNewsletter = async (email: string) => {
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, already: data.already };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: "Connection error" };
    }
  };

  // Submit dynamic testimonials
  const submitTestimonial = async (fields: {
    name: string;
    role: string;
    content: string;
    avatar?: string;
  }) => {
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        try {
          const pRes = await fetch("/api/portfolio-data");
          if (
            pRes.ok &&
            pRes.headers.get("content-type")?.includes("application/json")
          ) {
            const d = await pRes.json();
            setPortfolioData((prev) => ({
              ...prev,
              testimonials: d.testimonials || prev.testimonials,
            }));
          }
        } catch {}
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // ADMIN CMS ACTIONS (all Bearer authenticated)
  const updatePortfolioSection = async (
    updatedState: Partial<PortfolioData>
  ) => {
    try {
      const headers = await getAdminHeaders();
      if (!headers) return false;
      const merged = { ...portfolioData, ...updatedState };
      const res = await fetch("/api/portfolio-data/update", {
        method: "POST",
        headers,
        body: JSON.stringify(merged),
      });
      if (res.ok) {
        setPortfolioData(merged);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const fetchAdminMessages = async () => {
    try {
      const headers = await getAdminHeaders();
      if (!headers) return [];
      const res = await fetch("/api/admin/messages", { headers });
      if (!res.ok) return [];
      const ct = res.headers.get("content-type");
      return ct && ct.includes("application/json") ? await res.json() : [];
    } catch {
      return [];
    }
  };

  const actionAdminMessage = async (
    id: string,
    action: "archive" | "delete" | "reply"
  ) => {
    const headers = await getAdminHeaders();
    if (!headers) return [];
    const res = await fetch("/api/admin/messages/action", {
      method: "POST",
      headers,
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.messages || [];
    }
    return [];
  };

  const fetchAdminSubscribers = async () => {
    const headers = await getAdminHeaders();
    if (!headers) return [];
    const res = await fetch("/api/admin/subscribers", { headers });
    return res.ok ? await res.json() : [];
  };

  const deleteAdminSubscriber = async (id: string) => {
    const headers = await getAdminHeaders();
    if (!headers) return [];
    const res = await fetch("/api/admin/subscribers/delete", {
      method: "POST",
      headers,
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.subscribers || [];
    }
    return [];
  };

  const sendAdminNewsletterBroadcast = async (
    subject: string,
    body: string
  ): Promise<NewsletterBroadcastResult> => {
    const headers = await getAdminHeaders();
    if (!headers) {
      return { success: false, error: "Administrator session expired." };
    }
    try {
      const res = await fetch("/api/admin/newsletter/broadcast", {
        method: "POST",
        headers,
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json().catch(() => ({}));
      return {
        success: Boolean(res.ok && data.success),
        deliveryStatus: data.deliveryStatus,
        provider: data.provider,
        sentCount: data.sentCount,
        failedCount: data.failedCount,
        error: data.error,
      };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to dispatch newsletter broadcast.",
      };
    }
  };

  const fetchAdminTestimonials = async (): Promise<Testimonial[]> => {
    try {
      const headers = await getAdminHeaders();
      if (!headers) return [];
      const res = await fetch("/api/admin/testimonials", { headers });
      if (!res.ok) return [];
      const list = await res.json();
      if (Array.isArray(list)) {
        return list;
      }
    } catch {
      // Fallback empty
    }
    return [];
  };

  const actionAdminTestimonial = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    const headers = await getAdminHeaders();
    if (!headers) return [];
    const res = await fetch("/api/admin/testimonials/action", {
      method: "POST",
      headers,
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) {
      const data = await res.json();
      const updated = data.testimonials || [];
      setPortfolioData((prev) => ({
        ...prev,
        testimonials: updated.filter((t: Testimonial) => t.approved),
      }));
      return updated;
    }
    return [];
  };

  const fetchAdminAnalytics = async () => {
    const headers = await getAdminHeaders();
    if (!headers) return null;
    const res = await fetch("/api/admin/analytics", { headers });
    return res.ok ? await res.json() : null;
  };

  // Certificates CRUD backed by /api/certificates
  const fetchAdminCertificates = async (): Promise<Certificate[]> => {
    try {
      const res = await fetch("/api/certificates");
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  const createAdminCertificate = async (
    payload: Partial<Certificate>
  ): Promise<{ success: boolean; certificate?: Certificate; error?: string }> => {
    const headers = await getAdminHeaders();
    if (!headers) {
      return { success: false, error: "Administrator session required." };
    }
    const res = await fetch("/api/certificates", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return { success: true, certificate: data };
    }
    return {
      success: false,
      error: data.error || "Failed to create certificate",
    };
  };

  const updateAdminCertificate = async (
    id: string,
    payload: Partial<Certificate>
  ): Promise<{ success: boolean; certificate?: Certificate; error?: string }> => {
    const headers = await getAdminHeaders();
    if (!headers) {
      return { success: false, error: "Administrator session required." };
    }
    const res = await fetch(`/api/certificates/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return { success: true, certificate: data };
    }
    return {
      success: false,
      error: data.error || "Failed to update certificate",
    };
  };

  const deleteAdminCertificate = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    const headers = await getAdminHeaders();
    if (!headers) {
      return { success: false, error: "Administrator session required." };
    }
    const res = await fetch(`/api/certificates/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return { success: true };
    }
    return {
      success: false,
      error: data.error || "Failed to delete certificate",
    };
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolioData,
        isLoading,
        authReady,
        isAdmin,
        adminEmail,
        adminToken,
        signInWithAdminGoogle,
        logoutAdmin,
        submitContactForm,
        subscribeNewsletter,
        submitTestimonial,
        updatePortfolioSection,
        fetchAdminMessages,
        actionAdminMessage,
        fetchAdminSubscribers,
        deleteAdminSubscriber,
        sendAdminNewsletterBroadcast,
        fetchAdminTestimonials,
        actionAdminTestimonial,
        fetchAdminAnalytics,
        fetchAdminCertificates,
        createAdminCertificate,
        updateAdminCertificate,
        deleteAdminCertificate,
        theme,
        toggleTheme,
        trackVisit,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
