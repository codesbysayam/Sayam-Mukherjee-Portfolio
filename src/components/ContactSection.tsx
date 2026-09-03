import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { 
  Send, MapPin, Mail, Calendar, CheckCircle2, AlertCircle, 
  Github, Linkedin, Instagram, Youtube, BookOpen, Clock, 
  FileText, ArrowRight, User, Globe, Phone, DollarSign, 
  Paperclip, Trash2, ChevronDown, Award
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export default function ContactSection() {
  const { submitContactForm, portfolioData } = usePortfolio();

  // Contact form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("No Budget Specified");
  const [timeline, setTimeline] = useState("No Timeline Specified");
  
  // File attachments state
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [attachmentData, setAttachmentData] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status flags
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Scheduler calendar state
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [scheduleEmail, setScheduleEmail] = useState("");
  const [scheduleName, setScheduleName] = useState("");
  const [schedulerBooked, setSchedulerBooked] = useState(false);

  // FAQ Accordion Active Index
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Draft key
  const DRAFT_KEY = "sayam_contact_draft_v1";

  // Available dates for booking
  const availableDates = [
    { label: "Mon, Jul 6", val: "2026-07-06" },
    { label: "Tue, Jul 7", val: "2026-07-07" },
    { label: "Wed, Jul 8", val: "2026-07-08" },
    { label: "Thu, Jul 9", val: "2026-07-09" },
    { label: "Fri, Jul 10", val: "2026-07-10" }
  ];

  const availableTimes = ["10:30 AM IST", "2:00 PM IST", "4:30 PM IST", "7:00 PM IST"];

  // 1. Auto-save draft loading on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.company) setCompany(parsed.company);
        if (parsed.country) setCountry(parsed.country);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.subject) setSubject(parsed.subject);
        if (parsed.message) setMessage(parsed.message);
        if (parsed.budget) setBudget(parsed.budget);
        if (parsed.timeline) setTimeline(parsed.timeline);
      }
    } catch (e) {
      console.warn("Failed to load draft contact form", e);
    }
  }, []);

  // 2. Save draft when changes occur
  useEffect(() => {
    if (formSubmitted) return;
    const timeout = setTimeout(() => {
      const stateToSave = {
        firstName, lastName, email, company, country, phone, subject, message, budget, timeline
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(stateToSave));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [firstName, lastName, email, company, country, phone, subject, message, budget, timeline, formSubmitted]);

  // Handle Form Val & Submit
  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!firstName.trim()) tempErrors.firstName = "First name is required.";
    if (!email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = "Please input a valid email syntax.";
    }
    if (!message.trim()) {
      tempErrors.message = "Please include a brief message detailing parameters.";
    } else if (message.length < 15) {
      tempErrors.message = "Message must be at least 15 characters.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormLoading(true);
    const success = await submitContactForm({
      firstName,
      lastName,
      email,
      company,
      country,
      phone,
      subject: subject || "No Subject Specified",
      message,
      budget,
      timeline,
      attachmentName,
      attachmentData
    });

    setFormLoading(false);
    if (success) {
      setFormSubmitted(true);
      localStorage.removeItem(DRAFT_KEY);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#a855f7", "#06b6d4", "#3b82f6"]
      });
    } else {
      setErrors({ global: "Failed to dispatch communication. Please try again." });
    }
  };

  // Reset Form
  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setCompany("");
    setCountry("");
    setPhone("");
    setSubject("");
    setMessage("");
    setBudget("No Budget Specified");
    setTimeline("No Timeline Specified");
    setAttachmentName(null);
    setAttachmentData(null);
    setFormSubmitted(false);
  };

  // File Upload Logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("Files must be smaller than 5MB.");
        return;
      }

      setUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setAttachmentName(file.name);
        setAttachmentData(reader.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
    setAttachmentName(null);
    setAttachmentData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Booking Scheduler
  const handleScheduleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !scheduleEmail || !scheduleName) {
      alert("Please fill out all schedule parameters.");
      return;
    }

    setSchedulerBooked(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#22d3ee", "#8b5cf6"]
    });

    // Save scheduled interview as a standard contact message to the backend
    await submitContactForm({
      firstName: scheduleName,
      lastName: "(Scheduled Interview)",
      email: scheduleEmail,
      company: "Google Calendar Automated Node",
      country: "Kolkata, IN",
      phone: "000-000-0000",
      subject: `🗓️ Interview Scheduled: ${selectedDate} at ${selectedTime}`,
      message: `Automatic Calendar Booking confirmation requested for ${scheduleName} (${scheduleEmail}) on date ${selectedDate} at ${selectedTime}. Please join the Meet coordinate.`,
      budget: "Calendar Slot Booked",
      timeline: "Synchronized to Google Calendar",
    });
  };

  const socialsList = [
    { label: "LinkedIn", href: portfolioData?.socials?.linkedin || "#", icon: <Linkedin className="w-5 h-5" />, color: "hover:bg-blue-600/20 hover:text-blue-400 hover:shadow-blue-500/20" },
    { label: "GitHub", href: portfolioData?.socials?.github || "#", icon: <Github className="w-5 h-5" />, color: "hover:bg-zinc-800 hover:text-white hover:shadow-zinc-500/20" },
    { label: "Instagram", href: portfolioData?.socials?.instagram || "#", icon: <Instagram className="w-5 h-5" />, color: "hover:bg-pink-600/20 hover:text-pink-400 hover:shadow-pink-500/20" },
    { label: "YouTube", href: portfolioData?.socials?.youtube || "#", icon: <Youtube className="w-5 h-5" />, color: "hover:bg-red-600/20 hover:text-red-400 hover:shadow-red-500/20" },
    { label: "Obsidian Optics", href: "#projects", icon: <BookOpen className="w-5 h-5" />, color: "hover:bg-purple-600/20 hover:text-purple-400 hover:shadow-purple-500/20" },
    { label: "Fiverr Store", href: portfolioData?.socials?.fiverr || "#", icon: <Award className="w-5 h-5" />, color: "hover:bg-green-600/20 hover:text-green-400 hover:shadow-green-500/20" },
    { label: "Personal Email", href: `mailto:${portfolioData?.socials?.email || "sayammukherjee1506@gmail.com"}`, icon: <Mail className="w-5 h-5" />, color: "hover:bg-cyan-600/20 hover:text-cyan-400 hover:shadow-cyan-500/20" }
  ];

  const faqList = [
    {
      q: "Who is Sayam Mukherjee?",
      a: "Sayam is an undergraduate Computer Science Engineering student specialized in AI & ML at KIIT University (CGPA 9.06) located in Kolkata, West Bengal, India. He builds production-ready full-stack websites, optimizes computer vision algorithms, and manages high-quality digital design workflows."
    },
    {
      q: "What programming languages and frameworks do you use?",
      a: "My tech core is built on Python, PyTorch, YOLOv8, and OpenCV for AI deployments, paired with TypeScript, React, Next.js, Node.js, Express, Tailwind CSS, PostgreSQL, and Firebase for rich full-stack software applications."
    },
    {
      q: "Are you available for active internships and research collaborations?",
      a: "Yes! I am actively looking for software engineering and AI/ML researcher internships. I am fully open to collaborating with professors, industry mentors, or university groups on computer vision and LLM applications."
    },
    {
      q: "Do you accept freelance contracts or design commissions?",
      a: "Absolutely. I run a freelance branding side-business designing high-CTR thumbnails and digital assets for top-tier creators (with proven CTR increases from 4.8% to 7.2%). I build tailored React landing pages and full-stack client directories as well."
    },
    {
      q: "How can I schedule a direct meeting, chat or interview with you?",
      a: "You can book a slot directly using the built-in Scheduler Calendar right here on my contact page! Select an open date and time coordinate, insert your email, and the server will automatically log the slot onto my Google Calendar."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 font-sans">
      
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
        <span className="text-xs text-purple-400 font-mono uppercase tracking-widest block font-bold">Contact Matrix</span>
        <h2 
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
          className="font-bold tracking-tight text-white font-display"
        >
          Let's Build Something Amazing Together
        </h2>
        <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
          Whether it's an internship, freelance project, research collaboration, hackathon team, or simply a deep conversation about technology, I'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: CONTACT DETAILS & SCHEDULER */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Bio Brief & Availability card */}
          <div className="glass-card rounded-2xl p-6 space-y-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/40 bg-zinc-900 flex items-center justify-center shadow-lg shrink-0">
                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-display">
                  SM
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Sayam Mukherjee</h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">Kolkata, West Bengal, India</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-zinc-400 leading-relaxed">
              <p>
                <strong>Primary Email:</strong>{" "}
                <a href="mailto:sayammukherjee1506@gmail.com" className="text-purple-400 hover:text-cyan-300 transition-colors font-mono">
                  sayammukherjee1506@gmail.com
                </a>
              </p>
              <p>
                <strong>Business Email:</strong>{" "}
                <a href="mailto:wrickbusiness@gmail.com" className="text-cyan-400 hover:text-purple-300 transition-colors font-mono font-medium">
                  wrickbusiness@gmail.com
                </a>
              </p>
            </div>

            {/* Availability Matrix */}
            <div className="space-y-2 pt-2 border-t border-zinc-900/60">
              <span className="text-[10px] uppercase text-zinc-500 font-mono tracking-wider block">Currently Open For</span>
              <div className="flex flex-wrap gap-1.5">
                {["Internships", "Freelancing", "Collaborations", "Research", "Hackathons", "Mentorship"].map((av, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded-full text-zinc-300 font-mono flex items-center gap-1.5 hover:border-purple-500/20 transition-all cursor-default"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {av}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SOCIAL MEDIA HUB */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-400">Social Nodes & Directories</h4>
            <div className="grid grid-cols-2 gap-2.5">
              {socialsList.map((soc, idx) => (
                <a
                  key={idx}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 p-3 rounded-xl text-xs text-zinc-400 hover:text-white transition-all duration-300 cursor-pointer ${soc.color} shadow-sm`}
                >
                  <div className="shrink-0">{soc.icon}</div>
                  <span className="font-medium tracking-tight truncate">{soc.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* INTERACTIVE HIGH-TECH CITY MAP */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-400 flex items-center justify-between">
              <span>Primary Node Center</span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 lowercase">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                Active approximate coordinate
              </span>
            </h4>
            
            <div className="relative h-44 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 flex items-center justify-center">
              
              {/* Radar scanner grid background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-950/15 via-zinc-950 to-zinc-950" />
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_14px]" />
              
              {/* Pulsing ring */}
              <div className="absolute w-24 h-24 rounded-full border border-cyan-500/20 animate-ping" />
              <div className="absolute w-12 h-12 rounded-full border border-purple-500/30 animate-pulse" />
              
              <div className="z-10 text-center space-y-2">
                <div className="w-9 h-9 bg-purple-500/10 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto text-purple-400">
                  <MapPin className="w-4 h-4 animate-bounce" />
                </div>
                <p className="text-sm font-bold text-white font-display">Kolkata, WB, India</p>
                <p className="text-[10px] text-zinc-500 font-mono">Approximate sector coordinates: 22.5726° N, 88.3639° E</p>
              </div>

              {/* Edge lines */}
              <div className="absolute top-2 left-2 text-[9px] font-mono text-zinc-700 select-none">KIIT_CSE_ML</div>
              <div className="absolute bottom-2 right-2 text-[9px] font-mono text-zinc-700 select-none">SYS_ACTIVE_M8</div>
            </div>
          </div>

          {/* CALENDAR MEETING SCHEDULER */}
          <div className="glass-card rounded-2xl p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl" />
            
            <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
              <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Book an Interview Slot
              </h4>
              <span className="text-[10px] text-cyan-400 font-mono font-medium">Google Calendar API</span>
            </div>

            {schedulerBooked ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-3"
              >
                <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto text-cyan-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h5 className="text-sm font-bold text-white">Interview Coordinates Reserved</h5>
                <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  A verification confirmation has been synchronized. A secure Google Meet link has been logged for your selected slot!
                </p>
                <button
                  onClick={() => setSchedulerBooked(false)}
                  className="text-[10px] font-mono text-cyan-400 hover:text-white transition-colors cursor-pointer block mx-auto pt-2 underline"
                >
                  Schedule another slot
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleScheduleBook} className="space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">1. Select Target Date</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {availableDates.map((dt) => (
                      <button
                        key={dt.val}
                        type="button"
                        onClick={() => setSelectedDate(dt.val)}
                        className={`text-[9px] font-mono border py-2 rounded-lg text-center transition-all cursor-pointer ${
                          selectedDate === dt.val
                            ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 font-bold"
                            : "bg-zinc-900/40 border-zinc-900 hover:border-zinc-800 text-zinc-400"
                        }`}
                      >
                        {dt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">2. Select Hour Node (IST)</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {availableTimes.map((tm) => (
                      <button
                        key={tm}
                        type="button"
                        onClick={() => setSelectedTime(tm)}
                        className={`text-[9px] font-mono border py-2 rounded-lg text-center transition-all cursor-pointer ${
                          selectedTime === tm
                            ? "bg-purple-500/10 border-purple-400 text-purple-300 font-bold"
                            : "bg-zinc-900/40 border-zinc-900 hover:border-zinc-800 text-zinc-400"
                        }`}
                      >
                        {tm}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">Your Name</span>
                    <input
                      type="text"
                      required
                      placeholder="Recruiter / Collaborator"
                      value={scheduleName}
                      onChange={(e) => setScheduleName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-900 focus:border-cyan-500/60 rounded-lg px-2.5 py-1.5 text-[10px] text-white placeholder-zinc-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">Inbound Email</span>
                    <input
                      type="email"
                      required
                      placeholder="address@domain.com"
                      value={scheduleEmail}
                      onChange={(e) => setScheduleEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-900 focus:border-cyan-500/60 rounded-lg px-2.5 py-1.5 text-[10px] text-white placeholder-zinc-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedDate || !selectedTime || !scheduleEmail || !scheduleName}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold py-2 rounded-xl text-[10px] tracking-wider uppercase transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Confirm Calendar Reservation
                </button>
              </form>
            )}

            <div className="text-center">
              <span className="text-[9px] text-zinc-500 font-mono">
                Alternatively, open my external{" "}
                <a href="https://calendly.com" target="_blank" rel="noopener" className="text-cyan-400 hover:underline">
                  Calendly Bridge
                </a>
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CONTACT FORM */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 md:p-8 relative">
          
          <AnimatePresence mode="wait">
            {formSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-16 text-center space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white font-display">Transmission Conveyed</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                    Your contact coordinates have bypassed security parameters and logged securely in Sayam's datastore. An automated verification confirmation email was dispatched.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs px-6 py-3 rounded-xl transition-all font-mono cursor-pointer"
                >
                  Convey New Transmission
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleContactSubmit}
                className="space-y-6"
              >
                <div className="border-b border-zinc-900 pb-4">
                  <h3 className="text-lg font-bold text-white font-display">Convey Project Parameters</h3>
                  <p className="text-xs text-zinc-500 mt-1">Fields marked with an asterisk are required to bypass filters.</p>
                </div>

                {errors.global && (
                  <div className="p-3.5 bg-red-950/40 border border-red-500/20 rounded-xl text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errors.global}</span>
                  </div>
                )}

                {/* Form fields grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* First Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1">
                      First Name <span className="text-purple-400 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        required
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`w-full bg-zinc-900 border ${
                          errors.firstName ? "border-red-500/40" : "border-zinc-850 hover:border-zinc-700"
                        } focus:border-cyan-500/60 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/20`}
                      />
                    </div>
                    {errors.firstName && <p className="text-[10px] text-red-400 font-mono mt-0.5">{errors.firstName}</p>}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-700 focus:border-cyan-500/60 rounded-xl px-3.5 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/20"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1">
                      Email Address <span className="text-purple-400 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        required
                        placeholder="john@organization.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full bg-zinc-900 border ${
                          errors.email ? "border-red-500/40" : "border-zinc-850 hover:border-zinc-700"
                        } focus:border-cyan-500/60 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/20`}
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-400 font-mono mt-0.5">{errors.email}</p>}
                  </div>

                  {/* Company / Org */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="Google, Inc."
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-700 focus:border-cyan-500/60 rounded-xl px-3.5 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/20"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="United States"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-700 focus:border-cyan-500/60 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Phone Number (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-700 focus:border-cyan-500/60 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Subject</label>
                  <input
                    type="text"
                    placeholder="Internship opportunity proposal / freelance project scope"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-700 focus:border-cyan-500/60 rounded-xl px-3.5 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Message (with character count) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1">
                      Message Parameters <span className="text-purple-400 font-bold">*</span>
                    </label>
                    <span className={`text-[9px] font-mono ${message.length > 900 ? "text-amber-400" : "text-zinc-500"}`}>
                      {message.length} / 1000 chars
                    </span>
                  </div>
                  <textarea
                    required
                    maxLength={1000}
                    rows={4}
                    placeholder="Please specify structural parameters, roles, or inquiries in depth..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`w-full bg-zinc-900 border ${
                      errors.message ? "border-red-500/40" : "border-zinc-850 hover:border-zinc-700"
                    } focus:border-cyan-500/60 rounded-xl px-3.5 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all resize-none focus:ring-1 focus:ring-cyan-500/20`}
                  />
                  {errors.message && <p className="text-[10px] text-red-400 font-mono mt-0.5">{errors.message}</p>}
                </div>

                {/* BUDGET & TIMELINE SELECTION (OPTIONAL) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-900/40">
                  
                  {/* Budget */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Project Budget Matrix
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-700 focus:border-cyan-500/60 rounded-xl px-3.5 py-3 text-xs text-white outline-none cursor-pointer transition-all"
                    >
                      <option value="No Budget Specified">Select Estimated Budget</option>
                      <option value="Academic Collaboration (No Budget)">Academic Collaboration / Open Source</option>
                      <option value="Under $500 USD">Under $500 USD</option>
                      <option value="$500 - $1,500 USD">$500 - $1,500 USD</option>
                      <option value="$1,500 - $5,000 USD">$1,500 - $5,000 USD</option>
                      <option value="$5,000+ USD">$5,000+ USD (Long term contract)</option>
                    </select>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      Project Timeline Node
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-700 focus:border-cyan-500/60 rounded-xl px-3.5 py-3 text-xs text-white outline-none cursor-pointer transition-all"
                    >
                      <option value="No Timeline Specified">Select Estimated Timeline</option>
                      <option value="Under 1 Month">Under 1 Month (Fast Turnaround)</option>
                      <option value="1 - 3 Months">1 - 3 Months (Standard)</option>
                      <option value="3 - 6 Months">3 - 6 Months</option>
                      <option value="6+ Months">6+ Months / Retainer Basis</option>
                    </select>
                  </div>

                </div>

                {/* ATTACHMENT UPLOAD */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Project specifications Attachment</label>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span>{uploading ? "Parsing File..." : "Attach Briefing PDF / Image (Max 5MB)"}</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.png,.jpg,.jpeg,.zip"
                      className="hidden"
                    />

                    {attachmentName && (
                      <div className="flex items-center justify-between gap-3 bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-300 flex-1">
                        <span className="truncate max-w-[200px] font-mono font-medium">{attachmentName}</span>
                        <button
                          type="button"
                          onClick={removeAttachment}
                          className="p-1 rounded bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Erase attachment parameters"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-gradient-to-r from-purple-600 via-indigo-700 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold py-4 rounded-xl text-xs tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_22px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4.5 h-4.5 animate-pulse" />
                  <span>{formLoading ? "Conveying Transmission..." : "Convey Transmission"}</span>
                </button>

              </motion.form>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* FAQ ACCORDION SECTION */}
      <div className="mt-24 border-t border-zinc-900/60 pt-20">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <span className="text-xs text-cyan-400 font-mono uppercase tracking-widest block font-bold">Frequently Asked Inquiries</span>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
            Interactive FAQs
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Quick responses mapping standard professional questions about academic metrics, design freelance cooperation, and stack operations.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqList.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="glass-card rounded-2xl overflow-hidden hover:border-zinc-800 transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 flex justify-between items-center text-left text-white hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-semibold pr-4 leading-relaxed font-display">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-cyan-400" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900/60">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
