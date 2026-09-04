import React, { createContext, useContext, useState, useEffect } from "react";
import { Project, SkillGroup, Blog, ExperienceItem, Certification, SAYAM_DATA } from "../data";

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
  isAdmin: boolean;
  adminToken: string | null;
  otpRequired: boolean;
  tempToken: string | null;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; require2FA?: boolean; otpSimulated?: string; tempToken?: string; error?: string }>;
  verify2FA: (code: string) => Promise<boolean>;
  logoutAdmin: () => void;
  submitContactForm: (fields: ContactFormFields) => Promise<boolean>;
  subscribeNewsletter: (email: string) => Promise<{ success: boolean; already?: boolean; error?: string }>;
  submitTestimonial: (fields: { name: string; role: string; content: string; avatar?: string }) => Promise<boolean>;
  
  // Admin Operations
  updatePortfolioSection: (updatedState: Partial<PortfolioData>) => Promise<boolean>;
  fetchAdminMessages: () => Promise<any[]>;
  actionAdminMessage: (id: string, action: "archive" | "delete" | "reply") => Promise<any[]>;
  fetchAdminSubscribers: () => Promise<any[]>;
  deleteAdminSubscriber: (id: string) => Promise<any[]>;
  actionAdminTestimonial: (id: string, action: "approve" | "reject") => Promise<any[]>;
  fetchAdminAnalytics: () => Promise<any>;
  
  // Theme state
  theme: "dark" | "light";
  toggleTheme: () => void;
  
  // Tracking
  trackVisit: (page: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolio must be used within a PortfolioProvider");
  return context;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [otpRequired, setOtpRequired] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [simulatedOTP, setSimulatedOTP] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Load Portfolio Data & Auth State
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/portfolio-data");
        if (res.ok) {
          const data = await res.json();
          setPortfolioData({
            projects: data.projects || [],
            blogs: data.blogs || [],
            certifications: data.certifications || [],
            skills: data.skills || [],
            experience: data.experience || [],
            achievements: data.achievements || [],
            learningDashboard: data.learningDashboard || SAYAM_DATA.learningDashboard,
            stats: data.stats || SAYAM_DATA.stats,
            socials: data.socials || SAYAM_DATA.socials,
            testimonials: data.testimonials || [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch portfolio data, using defaults:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Load credentials & theme preference from localStorage
    const savedToken = localStorage.getItem("sayam_admin_token");
    if (savedToken) {
      setAdminToken(savedToken);
      setIsAdmin(true);
    }

    const savedTheme = (localStorage.getItem("sayam_theme") || localStorage.getItem("theme")) as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
      applyTheme("light");
    } else {
      applyTheme("dark");
    }
  }, []);

  // Set visual theme on document element
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
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("sayam_theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  };

  // Track visit API
  const trackVisit = async (page: string) => {
    try {
      // Get country approximation
      const country = "India"; // Fallback
      const device = /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
      
      let source = "Direct";
      if (document.referrer) {
        if (document.referrer.includes("linkedin")) source = "LinkedIn";
        else if (document.referrer.includes("github")) source = "GitHub";
        else if (document.referrer.includes("google")) source = "Google";
        else if (document.referrer.includes("youtube")) source = "YouTube";
        else if (document.referrer.includes("instagram")) source = "Instagram";
      }

      await fetch("/api/analytics/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page,
          country,
          device,
          source,
          duration: Math.floor(Math.random() * 120) + 30, // Simulated session duration
        }),
      });
    } catch (e) {
      // Slid silent
    }
  };

  // Admin login actions
  const loginAdmin = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error };
      }

      if (data.require2FA) {
        setOtpRequired(true);
        setTempToken(data.tempToken);
        setSimulatedOTP(data.otpSimulated);
        return { success: true, require2FA: true, otpSimulated: data.otpSimulated, tempToken: data.tempToken };
      }

      return { success: false, error: "Authentication failed" };
    } catch (err) {
      return { success: false, error: "Network authentication timeout" };
    }
  };

  // 2FA Verification
  const verify2FA = async (code: string) => {
    if (code === simulatedOTP && tempToken) {
      setAdminToken(tempToken);
      setIsAdmin(true);
      setOtpRequired(false);
      localStorage.setItem("sayam_admin_token", tempToken);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setIsAdmin(false);
    setOtpRequired(false);
    localStorage.removeItem("sayam_admin_token");
  };

  // Contact form post
  const submitContactForm = async (fields: ContactFormFields) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        // Refresh local portfolio messages if logged in
        if (isAdmin) {
          const mRes = await fetchAdminMessages();
          setPortfolioData((prev) => ({ ...prev, messages: mRes }));
        }
        return true;
      }
    } catch (err) {
      console.error("Failed to post message", err);
    }
    return false;
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
    } catch (err) {
      return { success: false, error: "Connection error" };
    }
  };

  // Submit dynamic testimonials
  const submitTestimonial = async (fields: { name: string; role: string; content: string; avatar?: string }) => {
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        // Refresh data
        const pRes = await fetch("/api/portfolio-data");
        if (pRes.ok) {
          const d = await pRes.json();
          setPortfolioData((prev) => ({ ...prev, testimonials: d.testimonials }));
        }
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // ADMIN CMS ACTIONS
  const updatePortfolioSection = async (updatedState: Partial<PortfolioData>) => {
    try {
      const merged = { ...portfolioData, ...updatedState };
      const res = await fetch("/api/portfolio-data/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    const res = await fetch("/api/admin/messages");
    return res.ok ? await res.json() : [];
  };

  const actionAdminMessage = async (id: string, action: "archive" | "delete" | "reply") => {
    const res = await fetch("/api/admin/messages/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) {
      const data = await res.json();
      setPortfolioData((prev) => ({ ...prev, messages: data.messages }));
      return data.messages;
    }
    return [];
  };

  const fetchAdminSubscribers = async () => {
    const res = await fetch("/api/admin/subscribers");
    return res.ok ? await res.json() : [];
  };

  const deleteAdminSubscriber = async (id: string) => {
    const res = await fetch("/api/admin/subscribers/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.subscribers;
    }
    return [];
  };

  const actionAdminTestimonial = async (id: string, action: "approve" | "reject") => {
    const res = await fetch("/api/admin/testimonials/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) {
      const data = await res.json();
      setPortfolioData((prev) => ({ ...prev, testimonials: data.testimonials }));
      return data.testimonials;
    }
    return [];
  };

  const fetchAdminAnalytics = async () => {
    const res = await fetch("/api/admin/analytics");
    return res.ok ? await res.json() : null;
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolioData,
        isLoading,
        isAdmin,
        adminToken,
        otpRequired,
        tempToken,
        loginAdmin,
        verify2FA,
        logoutAdmin,
        submitContactForm,
        subscribeNewsletter,
        submitTestimonial,
        updatePortfolioSection,
        fetchAdminMessages,
        actionAdminMessage,
        fetchAdminSubscribers,
        deleteAdminSubscriber,
        actionAdminTestimonial,
        fetchAdminAnalytics,
        theme,
        toggleTheme,
        trackVisit,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
