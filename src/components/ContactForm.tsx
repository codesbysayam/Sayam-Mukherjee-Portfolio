import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  RefreshCw,
  Mail,
} from "lucide-react";
import {
  validateContactForm,
  ContactFormData,
  ValidationErrors,
} from "../utils/validation";
import { trackEvent } from "../services/analytics";
import { getStoredUtmParameters } from "../utils/utm";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../motion/tokens";

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const prefersReduced = usePrefersReducedMotion();
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
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [deliveryResult, setDeliveryResult] = useState<{
    submissionId?: string;
    delivered?: boolean;
    deliveryStatus?: "sent" | "stored_pending_email_config" | "failed";
    deliveryMessage?: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

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
    if (touched[field]) {
      const result = validateContactForm({
        ...formData,
        [field]: value,
        timestamp: mountTimeRef.current,
      });
      setErrors((prev) => ({
        ...prev,
        [field]: result.errors[field as keyof ValidationErrors],
      }));
    }
  };

  const handleBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = validateContactForm({
      ...formData,
      timestamp: mountTimeRef.current,
    });
    setErrors((prev) => ({
      ...prev,
      [field]: result.errors[field as keyof ValidationErrors],
    }));
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
      setErrorMessage(
        `Please wait ${cooldownRemaining}s before sending another message.`
      );
      return;
    }

    setTouched({ name: true, email: true, message: true });

    const submissionData: ContactFormData = {
      ...formData,
      timestamp: mountTimeRef.current,
    };

    const validation = validateContactForm(submissionData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setSubmitStatus("error");
      setErrorMessage(
        validation.errors.general ||
          "Please resolve the highlighted issues before submitting."
      );
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
          utm: getStoredUtmParameters() || undefined,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || `Server responded with status ${response.status}`
        );
      }

      setDeliveryResult({
        submissionId: result.submissionId,
        delivered: result.delivered,
        deliveryStatus: result.deliveryStatus,
        deliveryMessage: result.deliveryMessage,
      });
      setSubmitStatus("success");
      trackEvent("contact_form_submit", { topic });
      startCooldown(60);
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while transmitting your message.";
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
    setDeliveryResult(null);
    setErrorMessage("");
    mountTimeRef.current = Date.now();
  };

  const mailtoFallback = `mailto:sayammukherjee1506@gmail.com?subject=${encodeURIComponent(
    `${topic}: Inquiry from ${formData.name || "Portfolio Visitor"}`
  )}&body=${encodeURIComponent(
    `From: ${formData.name}\nEmail: ${formData.email}\nTopic: ${topic}\n\n${formData.message}`
  )}`;

  const inputStyle: React.CSSProperties = {
    backgroundColor: "var(--surface)",
    borderColor: "var(--border)",
    color: "var(--text)",
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {submitStatus === "success" ? (
        <motion.div
          key="success"
          id="contact-form-success"
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.ui, ease: MOTION_EASE.out }}
          className="p-6 md:p-8 rounded-[10px] border text-center space-y-4"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--accent)",
          }}
        >
          <div
            className="w-12 h-12 rounded-[10px] border flex items-center justify-center mx-auto text-[var(--accent)]"
            style={{
              backgroundColor: "var(--surface-2)",
              borderColor: "var(--border)",
            }}
          >
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-lg font-bold font-display text-[var(--text)]">
              {deliveryResult?.deliveryStatus === "sent"
                ? "Message Delivered"
                : "Message Saved to Database"}
            </h4>
            <p className="text-xs md:text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
              Thank you,{" "}
              <strong className="text-[var(--text)]">{formData.name}</strong>.{" "}
              {deliveryResult?.deliveryMessage ||
                "Your inquiry has been persisted securely to Cloud Firestore."}
            </p>
            {deliveryResult?.submissionId && (
              <p className="text-[11px] font-mono text-[var(--text-faint)]">
                Reference ID: {deliveryResult.submissionId}
              </p>
            )}
            {deliveryResult && deliveryResult.delivered === false && (
              <p className="text-[11px] font-mono text-[var(--warning)] max-w-md mx-auto">
                External email relay is currently unconfigured or delayed; your message is safely stored for review or you can{" "}
                <a href={mailtoFallback} className="underline hover:text-[var(--text)]">
                  open direct email
                </a>.
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={cooldownRemaining > 0}
              className="btn btn-secondary text-xs font-mono disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>
                Send another message{" "}
                {cooldownRemaining > 0 ? `(${cooldownRemaining}s)` : ""}
              </span>
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          id="contact-submission-form"
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.ui, ease: MOTION_EASE.out }}
          onSubmit={handleSubmit}
          noValidate
          className="p-5 sm:p-6 rounded-[10px] border space-y-5"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono tracking-wider uppercase text-[var(--accent)] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Direct Message
          </span>
          <span className="text-[11px] font-mono text-[var(--text-faint)]">
            Encrypted transmission
          </span>
        </div>
        <h4 className="text-lg font-bold font-display text-[var(--text)]">
          Send a direct dispatch
        </h4>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Fill out this form to send a verified message directly to my inbox.
        </p>
      </div>

      {/* Honeypot field */}
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

      {/* Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="contact_name"
            className="block text-xs font-mono font-medium text-[var(--text-secondary)]"
          >
            Your Name <span className="text-[var(--accent)]">*</span>
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
            className="w-full px-3.5 py-2.5 rounded-[6px] text-base sm:text-sm font-sans border focus:outline-none transition-colors"
            style={{
              ...inputStyle,
              borderColor:
                errors.name && touched.name ? "var(--danger)" : "var(--border)",
            }}
          />
          {errors.name && touched.name && (
            <p
              id="name-error"
              className="text-[11px] font-mono flex items-center gap-1 mt-1"
              style={{ color: "var(--danger)" }}
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact_email"
            className="block text-xs font-mono font-medium text-[var(--text-secondary)]"
          >
            Your Email <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="contact_email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="elena@organization.org"
            className="w-full px-3.5 py-2.5 rounded-[6px] text-base sm:text-sm font-sans border focus:outline-none transition-colors"
            style={{
              ...inputStyle,
              borderColor:
                errors.email && touched.email
                  ? "var(--danger)"
                  : "var(--border)",
            }}
          />
          {errors.email && touched.email && (
            <p
              id="email-error"
              className="text-[11px] font-mono flex items-center gap-1 mt-1"
              style={{ color: "var(--danger)" }}
            >
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
          className="block text-xs font-mono font-medium text-[var(--text-secondary)]"
        >
          Topic / Intent
        </label>
        <select
          id="contact_topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-[6px] text-base sm:text-sm font-sans border focus:outline-none transition-colors"
          style={inputStyle}
        >
          <option value="Project Inquiry">Project Inquiry / Freelance</option>
          <option value="Internship Opportunity">Internship Opportunity</option>
          <option value="Hackathon Collaboration">
            Hackathon / Technical Collaboration
          </option>
          <option value="Research & Open Source">Research / Open Source</option>
          <option value="General Conversation">General Conversation</option>
        </select>
      </div>

      {/* Message Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="contact_message"
            className="block text-xs font-mono font-medium text-[var(--text-secondary)]"
          >
            Message <span className="text-[var(--accent)]">*</span>
          </label>
          <span
            className="text-[11px] font-mono tabular-nums"
            style={{
              color:
                formData.message.length > 1900
                  ? "var(--warning)"
                  : "var(--text-muted)",
            }}
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
          className="w-full px-3.5 py-2.5 rounded-[6px] text-base sm:text-sm font-sans border focus:outline-none transition-colors resize-y min-h-[100px]"
          style={{
            ...inputStyle,
            borderColor:
              errors.message && touched.message
                ? "var(--danger)"
                : "var(--border)",
          }}
        />
        {errors.message && touched.message && (
          <p
            id="message-error"
            className="text-[11px] font-mono flex items-center gap-1 mt-1"
            style={{ color: "var(--danger)" }}
          >
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{errors.message}</span>
          </p>
        )}
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {submitStatus === "error" && errorMessage && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.fast, ease: MOTION_EASE.out }}
            role="alert"
            className="p-3 rounded-[8px] border text-xs flex flex-wrap sm:flex-nowrap items-start justify-between gap-2"
            style={{
              backgroundColor: "var(--surface-2)",
              borderColor: "var(--danger)",
              color: "var(--danger)",
            }}
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">{errorMessage}</p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Alternatively, dispatch directly via email:
                </p>
              </div>
            </div>
            <a
              href={mailtoFallback}
              className="btn btn-secondary min-h-[32px] px-2.5 py-1 text-[11px] font-mono shrink-0"
            >
              <Mail className="w-3 h-3" />
              <span>Open Mail</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          type="submit"
          id="contact-form-submit-btn"
          disabled={isSubmitting || cooldownRemaining > 0}
          className="btn btn-primary text-xs font-mono disabled:opacity-50 disabled:cursor-not-allowed"
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

        <span className="text-[11px] font-mono text-[var(--text-faint)]">
          Typical response: &lt;24h
        </span>
      </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
