import { X, Printer, Download, Mail, Phone, MapPin, Calendar, GraduationCap, Briefcase, Award, Sparkles, Languages, Check } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    window.open("https://above-violet-me5e9swh.edgeone.dev/25155271_SayamMukherjee.pdf", "_blank");
  };

  // Resume details
  const resumeData = {
    name: "Sayam Mukherjee",
    title: "B.Tech – CSE (AI & ML)",
    contact: {
      phone: "+91-6290921813",
      email: "wrickbusiness@gmail.com",
      location: "Kolkata, West Bengal, India",
      dob: "15.06.2006"
    },
    skills: ["Communication", "Teamwork", "Problem Solving", "Time Management", "Adaptability"],
    technicalSkills: ["C", "C++", "Python", "JavaScript", "Kotlin", "Django"],
    hobbies: ["Coding", "Photography", "Stock Market", "Content Creation", "Table Tennis"],
    languages: ["Bengali", "Hindi", "English"],
    careerObjective: "To pursue a challenging role in a dynamic organization where I can apply my foundational knowledge in Computer Science and Artificial Intelligence & Machine Learning, enhance my technical skills, and contribute effectively while continuously learning and growing as a professional.",
    academics: [
      {
        degree: "B.Tech - Computer Science & Engineering",
        period: "2025-2029",
        institution: "Techno Main Salt Lake (TMSL), Kolkata",
        scoreLabel: "Status",
        score: "1st Year (Enrolled 2025)"
      },
      {
        degree: "Senior Secondary (12th - CBSE)",
        period: "2025",
        institution: "Aditya Birla Vani Bharati, Rishra, Hooghly",
        scoreLabel: "Percentage",
        score: "86.2%"
      },
      {
        degree: "Secondary (10th - CBSE)",
        period: "2023",
        institution: "Aditya Birla Vani Bharati, Rishra, Hooghly",
        scoreLabel: "Percentage",
        score: "92.6%"
      }
    ],
    experience: {
      internship: {
        title: "Internship at Tata Consultancy Services (TCS)",
        duration: "2 Months",
        bullets: [
          "Gained exposure to industry-level problem-solving approaches",
          "Developed understanding of professional workflows and team collaboration"
        ]
      },
      workshops: [
        "Aagaz 2.0 – Physics Wallah",
        "TED Talk – Benedetto Vigna (CEO of Ferrari)",
        "Microsoft Industry Engagement and Technology Exposure Program"
      ]
    },
    awards: [
      "1st Position – Inter-school Table Tennis (3x)",
      "Finalist – Toycathon (Government of India)",
      "Certifications – Microsoft, Coursera, Udemy"
    ]
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      {/* Printable Area - Hidden on Web Screen, Only visible during Print */}
      <div id="resume-print-root" className="hidden print:block bg-white text-black p-8 font-sans w-[210mm] min-h-[297mm] mx-auto text-[13px] leading-relaxed">
        {/* Print Layout styling */}
        <div className="grid grid-cols-12 gap-8 h-full">
          
          {/* Left Column (Sidebar) */}
          <div className="col-span-4 border-r border-zinc-200 pr-6 flex flex-col justify-between">
            <div>
              {/* Profile image with perfect border */}
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-zinc-300 mx-auto mb-6 bg-zinc-100 flex items-center justify-center">
                <img 
                  src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg" 
                  alt="Sayam Mukherjee" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTACT SECTION */}
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-1 mb-3">CONTACT</h3>
                <ul className="space-y-2.5 text-zinc-600 text-[11px]">
                  <li className="flex items-start gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-700 shrink-0 mt-0.5" />
                    <span>{resumeData.contact.phone}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-700 shrink-0 mt-0.5" />
                    <span className="break-all">{resumeData.contact.email}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-700 shrink-0 mt-0.5" />
                    <span>{resumeData.contact.location}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-700 shrink-0 mt-0.5" />
                    <span>DOB: {resumeData.contact.dob}</span>
                  </li>
                </ul>
              </div>

              {/* SKILLS SECTION */}
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-1 mb-3">SKILLS</h3>
                <ul className="space-y-1 text-zinc-600 text-[11px] list-disc list-inside">
                  {resumeData.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>

              {/* TECHNICAL SKILLS */}
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-1 mb-3">TECHNICAL SKILLS</h3>
                <ul className="space-y-1 text-zinc-600 text-[11px] list-disc list-inside">
                  {resumeData.technicalSkills.map((tech, index) => (
                    <li key={index}>{tech}</li>
                  ))}
                </ul>
              </div>

              {/* HOBBIES */}
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-1 mb-3">HOBBIES</h3>
                <ul className="space-y-1 text-zinc-600 text-[11px] list-disc list-inside">
                  {resumeData.hobbies.map((hobby, index) => (
                    <li key={index}>{hobby}</li>
                  ))}
                </ul>
              </div>

              {/* LANGUAGES */}
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-1 mb-3">LANGUAGES</h3>
                <ul className="space-y-1 text-zinc-600 text-[11px] list-disc list-inside">
                  {resumeData.languages.map((lang, index) => (
                    <li key={index}>{lang}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column (Content) */}
          <div className="col-span-8 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="border-b border-zinc-300 pb-4 mb-6">
                <h1 className="text-3xl font-extrabold uppercase tracking-wide text-zinc-900 font-display">{resumeData.name}</h1>
                <h2 className="text-sm font-bold text-zinc-600 tracking-wider font-mono mt-1">{resumeData.title}</h2>
              </div>

              {/* CAREER OBJECTIVE */}
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-1 mb-2.5">CAREER OBJECTIVE</h3>
                <p className="text-zinc-600 text-[11px] leading-relaxed text-justify">{resumeData.careerObjective}</p>
              </div>

              {/* ACADEMIC QUALIFICATION */}
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-1 mb-3">ACADEMIC QUALIFICATION</h3>
                <div className="space-y-4">
                  {resumeData.academics.map((academic, index) => (
                    <div key={index} className="flex justify-between items-start text-[11px]">
                      <div>
                        <h4 className="font-bold text-zinc-800">{academic.degree}</h4>
                        <p className="text-zinc-500 font-medium">{academic.institution}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="font-mono text-zinc-500 block">{academic.period}</span>
                        <span className="font-bold text-zinc-800">{academic.scoreLabel}: {academic.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EXPERIENCE */}
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-1 mb-3">EXPERIENCE</h3>
                
                {/* Internship */}
                <div className="mb-4">
                  <div className="flex justify-between items-center text-[11px] mb-1.5">
                    <h4 className="font-bold text-zinc-800">{resumeData.experience.internship.title}</h4>
                    <span className="font-mono text-zinc-500 shrink-0">{resumeData.experience.internship.duration}</span>
                  </div>
                  <ul className="space-y-1 text-zinc-600 text-[11px] list-disc list-inside pl-1">
                    {resumeData.experience.internship.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-justify">{bullet}</li>
                    ))}
                  </ul>
                </div>

                {/* Workshops */}
                <div>
                  <h4 className="font-bold text-zinc-800 text-[11px] mb-1.5">Workshops / Seminars / Programs</h4>
                  <ul className="space-y-1 text-zinc-600 text-[11px] list-disc list-inside pl-1">
                    {resumeData.experience.workshops.map((workshop, idx) => (
                      <li key={idx}>{workshop}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AWARDS & ACHIEVEMENTS */}
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-1 mb-2.5">AWARDS & ACHIEVEMENTS</h3>
                <ul className="space-y-1 text-zinc-600 text-[11px] list-disc list-inside pl-1">
                  {resumeData.awards.map((award, idx) => (
                    <li key={idx}>{award}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Web Modal View */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        
        {/* Header Options */}
        <div className="px-6 py-4.5 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-base font-bold text-white font-display tracking-tight">Interactive Resume Viewer</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Resume Link Button */}
            <button
              onClick={handleDownload}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white`}
            >
              <Download className="w-4 h-4" />
              <span>Download Resume</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded-xl text-zinc-400 hover:text-white cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Web Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          
          {/* Header Card */}
          <div className="bg-zinc-900/40 border border-zinc-900/80 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 pointer-events-none" />
            
            {/* Rounded avatar matching original */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center shrink-0 shadow-lg">
              <img 
                src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg" 
                alt="Sayam Mukherjee" 
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
            </div>

            <div className="text-center md:text-left space-y-1.5">
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">{resumeData.name}</h1>
              <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest font-semibold">{resumeData.title}</p>
              
              {/* DOB and details */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-zinc-400 pt-1">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-zinc-500" /> DOB: {resumeData.contact.dob}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-zinc-500" /> {resumeData.contact.location}</span>
              </div>
            </div>
          </div>

          {/* Two-Column Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Main Stream */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Objective */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                  <Sparkles className="w-4.5 h-4.5 text-purple-400" />
                  <h3 className="text-base font-bold text-white uppercase font-display tracking-wider">Career Objective</h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed text-justify bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/60">
                  {resumeData.careerObjective}
                </p>
              </section>

              {/* Education */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                  <GraduationCap className="w-4.5 h-4.5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white uppercase font-display tracking-wider">Academic Qualification</h3>
                </div>
                <div className="space-y-4">
                  {resumeData.academics.map((academic, index) => (
                    <div 
                      key={index} 
                      className="bg-zinc-900/20 border border-zinc-900/50 p-4 rounded-xl flex flex-col sm:flex-row justify-between gap-3 hover:border-zinc-850 transition-all group"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{academic.degree}</h4>
                        <p className="text-xs text-zinc-400">{academic.institution}</p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">{academic.period}</span>
                        <span className="inline-block mt-1 px-2.5 py-1 bg-zinc-900 border border-zinc-850 rounded-lg text-xs font-bold text-white">
                          {academic.scoreLabel}: <span className="text-cyan-400">{academic.score}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Work Experience */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                  <Briefcase className="w-4.5 h-4.5 text-purple-400" />
                  <h3 className="text-base font-bold text-white uppercase font-display tracking-wider">Professional Experience</h3>
                </div>

                {/* TCS Internship card */}
                <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900/80 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white text-purple-300">Internship at Tata Consultancy Services (TCS)</h4>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">Industry-level problem-solving approaches</p>
                    </div>
                    <span className="px-2.5 py-1 bg-zinc-900 text-[10px] font-mono font-bold text-zinc-400 border border-zinc-800 rounded-lg shrink-0 w-fit">
                      {resumeData.experience.internship.duration}
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {resumeData.experience.internship.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Workshops list */}
                <div className="bg-zinc-950/40 border border-zinc-900 p-4.5 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">Workshops / Seminars / Programs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resumeData.experience.workshops.map((workshop, idx) => (
                      <div key={idx} className="p-3 bg-zinc-900/40 border border-zinc-900/80 rounded-xl text-xs text-zinc-300 flex items-center gap-2.5">
                        <span className="w-1 h-1 rounded-full bg-purple-400 shrink-0" />
                        <span>{workshop}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Awards */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                  <Award className="w-4.5 h-4.5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white uppercase font-display tracking-wider">Awards & Achievements</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {resumeData.awards.map((award, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 bg-zinc-900/20 border border-zinc-900/60 hover:border-zinc-800/80 rounded-xl text-xs text-zinc-300 flex flex-col justify-between gap-3 group transition-all"
                    >
                      <Award className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                      <p className="font-semibold leading-relaxed">{award}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Right Sidebar Stream */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Live Coordinates */}
              <div className="bg-zinc-950/80 border border-zinc-900 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono border-b border-zinc-900 pb-2 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Resume Contacts</span>
                </h4>
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Mobile Node</span>
                    <a href={`tel:${resumeData.contact.phone}`} className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{resumeData.contact.phone}</span>
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Educational Mail</span>
                    <a href={`mailto:${resumeData.contact.email}`} className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 font-semibold break-all">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{resumeData.contact.email}</span>
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Academic Campus</span>
                    <div className="text-zinc-300 flex items-start gap-1.5 leading-relaxed font-medium">
                      <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                      <span>{resumeData.contact.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Card */}
              <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono border-b border-zinc-900 pb-2">
                  Professional Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-2.5 py-1 bg-zinc-950 border border-zinc-850 rounded-lg text-xs font-semibold text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Skills Card */}
              <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono border-b border-zinc-900 pb-2">
                  Technical Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.technicalSkills.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-2.5 py-1 bg-gradient-to-br from-purple-950/20 to-zinc-950 border border-purple-900/40 rounded-lg text-xs font-bold text-purple-300 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages Card */}
              <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-purple-400" />
                  <span>Languages Spoken</span>
                </h4>
                <div className="space-y-2.5">
                  {resumeData.languages.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between text-xs font-medium text-zinc-300">
                      <span>{lang}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Fluent Node</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Tennis & Creative Hobbies */}
              <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono border-b border-zinc-900 pb-2">
                  Creative & Hobbies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.hobbies.map((hobby, index) => (
                    <span 
                      key={index} 
                      className="px-2.5 py-1 bg-zinc-950 border border-zinc-900 rounded-lg text-xs font-medium text-zinc-400"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Footer info text */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-900 text-center text-[10px] text-zinc-500 font-mono">
          Clicking "Print / Save as PDF" will format this resume into a perfect single A4 vector-sharp executive document.
        </div>

      </motion.div>
    </div>
  );
}
