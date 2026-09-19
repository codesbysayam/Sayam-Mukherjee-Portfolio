import { useState, useRef, useEffect, FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, RefreshCw, Mail } from "lucide-react";
import { validateContactForm, ContactFormData, ValidationErrors } from "../utils/validation";
import { trackEvent } from "../services/analytics";

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });
  const [topic, setTopic] = useState<string>("Project Inquiry");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  
  // Anti-bot timestamp tracker
  const mountTimeRef = useRef<number>(Date.now());
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    mountTimeRef.current = Date.now();
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const handleFieldChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for that field if touched
    if (touched[field]) {
      const result = validateContactForm({ ...formData, [field]: value, timestamp: mountTimeRef.current });
      setErrors((prev) => ({ ...prev, [field]: result.errors[field as keyof ValidationErrors] }));
    }
  };

  const handleBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = validateContactForm({ ...formData, timestamp: mountTimeRef.current });
    setErrors((prev) => ({ ...prev, [field]: result.errors[field as keyof ValidationErrors] }));
  };

  const startCooldown = (seconds = 60) => {
    setCooldownRemaining(seconds);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    cooldownTimerRef.current = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (cooldownRemaining > 0) {
      setErrorMessage(`Please wait ${cooldownRemaining}s before sending another message.`);
      return;
    }

    // Touch all fields
    setTouched({ name: true, email: true, message: true });

    const submissionData: ContactFormData = {
      ...formData,
      timestamp: mountTimeRef.current,
    };

    const validation = validateContactForm(submissionData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setSubmitStatus("error");
      setErrorMessage(validation.errors.general || "Please resolve the highlighted issues before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          topic,
          subject: `${topic}: Inquiry from ${formData.name.trim()}`,
          message: formData.message.trim(),
          honeypot: formData.honeypot,
          clientTimestamp: mountTimeRef.current,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || `Server responded with status ${response.status}`);
      }

      // Success
      setSubmitStatus("success");
      trackEvent("contact_form_submit", { topic });
      startCooldown(60);
      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred while transmitting your message.";
      setSubmitStatus("error");
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", message: "", honeypot: "" });
    setTouched({});
    setErrors({});
    setSubmitStatus("idle");
    setErrorMessage("");
    mountTimeRef.current = Date.now();
  };

  const mailtoFallback = `mailto:sayammukherjee1506@gmail.com?subject=${encodeURIComponent(
    `${topic}: Inquiry from ${formData.name || "Portfolio Visitor"}`
  )}&body=${encodeURIComponent(
    `From: ${formData.name}\nEmail: ${formData.email}\nTopic: ${topic}\n\n${formData.message}`
  )}`;

  if (submitStatus === "success") {
    return (
      <div 
        id="contact-form-success"
        className="p-6 md:p-8 rounded-2xl bg-white/[0.04] border border-emerald-500/30 backdrop-blur-md text-center space-y-4 animate-in fade-in zoom-in-95 duration-300"
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-bold font-display text-white">Message Transmitted</h4>
          <p className="text-xs md:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-white">{formData.name}</strong>. Your message has been logged securely. I typically review and reply to inquiries within 24–48 hours.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={cooldownRemaining > 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 border border-white/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Send another message {cooldownRemaining > 0 ? `(${cooldownRemaining}s)` : ""}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form 
      id="contact-submission-form"
      onSubmit={handleSubmit}
      noValidate
      className="p-6 md:p-7 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-5"
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Direct Message
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            Encrypted transmission
          </span>
        </div>
        <h4 className="text-lg font-bold font-display text-white">
          Send a direct dispatch
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Fill out this form to send a verified message directly to my inbox.
        </p>
      </div>

      {/* Honeypot field (hidden from human visitors, traps spam bots) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="hp_website">Leave this empty</label>
        <input
          id="hp_website"
          type="text"
          name="website"
          value={formData.honeypot}
          onChange={(e) => handleFieldChange("honeypot", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Grid: Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name Field */}
        <div className="space-y-1.5">
          <label 
            htmlFor="contact_name" 
            className="block text-xs font-mono font-medium text-zinc-300"
          >
            Your Name <span className="text-purple-400">*</span>
          </label>
          <input
            id="contact_name"
            type="text"
            required
            autoComplete="name"
            value={formData.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            placeholder="e.g. Elena Rostova"
            className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-sans bg-white/[0.04] border ${
              errors.name && touched.name
                ? "border-red-500/70 focus:ring-red-500"
                : "border-white/10 focus:border-purple-500/60"
            } text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-colors`}
          />
          {errors.name && touched.name && (
            <p id="name-error" className="text-[11px] font-mono text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label 
            htmlFor="contact_email" 
            className="block text-xs font-mono font-medium text-zinc-300"
          >
            Your Email <span className="text-purple-400">*</span>
          </label>
          <input
            id="contact_email"
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="elena@organization.org"
            className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-sans bg-white/[0.04] border ${
              errors.email && touched.email
                ? "border-red-500/70 focus:ring-red-500"
                : "border-white/10 focus:border-purple-500/60"
            } text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-colors`}
          />
          {errors.email && touched.email && (
            <p id="email-error" className="text-[11px] font-mono text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>
      </div>

      {/* Topic Selection */}
      <div className="space-y-1.5">
        <label 
          htmlFor="contact_topic" 
          className="block text-xs font-mono font-medium text-zinc-300"
        >
          Topic / Intent
        </label>
        <select
          id="contact_topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm font-sans bg-zinc-900 border border-white/10 text-zinc-200 focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/60 transition-colors"
        >
          <option value="Project Inquiry">Project Inquiry / Freelance</option>
          <option value="Internship Opportunity">Internship Opportunity</option>
          <option value="Hackathon Collaboration">Hackathon / Technical Collaboration</option>
          <option value="Research & Open Source">Research / Open Source</option>
          <option value="General Conversation">General Conversation</option>
        </select>
      </div>

      {/* Message Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label 
            htmlFor="contact_message" 
            className="block text-xs font-mono font-medium text-zinc-300"
          >
            Message <span className="text-purple-400">*</span>
          </label>
          <span 
            className={`text-[11px] font-mono ${
              formData.message.length < 20 
                ? "text-zinc-500" 
                : formData.message.length > 1900 
                ? "text-amber-400" 
                : "text-zinc-400"
            }`}
          >
            {formData.message.length}/2000 chars
          </span>
        </div>
        <textarea
          id="contact_message"
          required
          rows={4}
          value={formData.message}
          onChange={(e) => handleFieldChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Describe your project, team, timeline, or inquiry in detail..."
          className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-sans bg-white/[0.04] border ${
            errors.message && touched.message
              ? "border-red-500/70 focus:ring-red-500"
              : "border-white/10 focus:border-purple-500/60"
          } text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-colors resize-y min-h-[100px]`}
        />
        {errors.message && touched.message && (
          <p id="message-error" className="text-[11px] font-mono text-red-400 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{errors.message}</span>
          </p>
        )}
      </div>

      {/* Error alert banner */}
      {submitStatus === "error" && errorMessage && (
        <div 
          role="alert" 
          className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start justify-between gap-2 animate-in fade-in"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">{errorMessage}</p>
              <p className="text-red-400/80 text-[11px]">
                Alternatively, dispatch directly via email:
              </p>
            </div>
          </div>
          <a
            href={mailtoFallback}
            className="shrink-0 px-2.5 py-1 rounded bg-red-900/60 hover:bg-red-850 text-[11px] font-mono text-white flex items-center gap-1 transition-colors"
          >
            <Mail className="w-3 h-3" />
            <span>Open Mail</span>
          </a>
        </div>
      )}

      {/* Submit Action */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="submit"
          id="contact-form-submit-btn"
          disabled={isSubmitting || cooldownRemaining > 0}
          className="contact-btn-hover px-5 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-[0_2px_14px_rgba(168,85,247,0.3)] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Transmitting...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </>
          )}
        </button>

        <span className="text-[11px] font-mono text-zinc-500">
          Typical response: &lt;24h
        </span>
      </div>
    </form>
  );
}
