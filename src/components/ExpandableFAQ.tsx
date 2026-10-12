import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-education",
    question: "What is Sayam's current degree, university, and academic focus?",
    answer: (
      <p>
        Sayam Mukherjee is pursuing a Bachelor of Technology (<strong>B.Tech</strong>) in{" "}
        <strong>Computer Science &amp; Engineering</strong> with a specialization in{" "}
        <strong>Artificial Intelligence and Machine Learning</strong> at{" "}
        <strong>KIIT University, Bhubaneswar</strong> (expected graduation:{" "}
        <strong>2029</strong>). He maintained an overall first-year CGPA of <strong>9.06</strong>.
      </p>
    ),
  },
  {
    id: "faq-projects",
    question: "What are the primary software projects featured in the portfolio?",
    answer: (
      <div className="space-y-2">
        <p>The portfolio features five core software engineering initiatives:</p>
        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-1">
          <li>
            <strong>OPERON:</strong> Operations platform exploring multi-agent workflows with human-in-the-loop checkpoints.
          </li>
          <li>
            <strong>SayamSolves:</strong> Open-source C++ repository documenting deliberate daily algorithmic problem solving on LeetCode.
          </li>
          <li>
            <strong>MAUSAM:</strong> SIH 2026 weather intelligence and localized climate telemetry dashboard by Team Algnite.
          </li>
          <li>
            <strong>Interactive Portfolio:</strong> Full-stack developer ecosystem with pre-rendered GitHub activity telemetry and liquid glass UI.
          </li>
          <li>
            <strong>YOLO / Edge Computer Vision:</strong> Autonomous edge camera pipeline using lightweight YOLOv8 and OpenCV for spatial movement vectors.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "faq-tech-stack",
    question: "What engineering stack and programming languages does Sayam use?",
    answer: (
      <p>
        His core toolkit spans <strong>Python</strong>, <strong>C++</strong>, <strong>TypeScript</strong>, and <strong>JavaScript</strong>, alongside <strong>PyTorch</strong>, <strong>OpenCV</strong>, <strong>YOLOv8</strong>, <strong>React 19</strong>, <strong>Tailwind CSS</strong>, <strong>Node.js</strong>, <strong>Express</strong>, and <strong>Linux</strong> systems.
      </p>
    ),
  },
  {
    id: "faq-github-telemetry",
    question: "How is GitHub telemetry handled without visitor API keys or rate limits?",
    answer: (
      <p>
        The portfolio utilizes a pre-rendered static snapshot pipeline. Scheduled GitHub Actions fetch repository statistics, language breakdowns, and commit activity hourly, storing them into static JSON snapshots. The browser loads this cached snapshot, completely eliminating visitor rate limits and token requirements.
      </p>
    ),
  },
  {
    id: "faq-opportunities",
    question: "What roles and professional opportunities is Sayam open to?",
    answer: (
      <p>
        Sayam is currently open to <strong>Software Engineering Internships</strong>, <strong>AI/ML Research Collaborations</strong>, <strong>Hackathon Team Roles</strong>, and <strong>Open-Source Engineering</strong>.
      </p>
    ),
  },
  {
    id: "faq-contact",
    question: "How can recruiters and collaborators get in touch?",
    answer: (
      <p>
        Reach out directly via email at{" "}
        <a
          href="mailto:wrickbusiness@gmail.com"
          className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
        >
          wrickbusiness@gmail.com
        </a>{" "}
        for business, hackathons, and collaborations, or{" "}
        <a
          href="mailto:sayammukherjee1506@gmail.com"
          className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
        >
          sayammukherjee1506@gmail.com
        </a>{" "}
        for internships and direct inquiries.
      </p>
    ),
  },
];

export const ExpandableFAQ: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>(["faq-education"]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenIds(FAQ_DATA.map((item) => item.id));
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  return (
    <section
      id="faq-section"
      aria-labelledby="faq-section-title"
      className="w-full py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Answered</span>
          </div>
          <h2
            id="faq-section-title"
            className="text-2xl sm:text-3xl font-bold font-display text-zinc-950 dark:text-zinc-50 tracking-tight"
          >
            Engineering &amp; Portfolio FAQ
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
            Verified information addressing common questions about Sayam&apos;s background, technical projects, and systems architecture.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQ_DATA.map((item) => {
          const isOpen = openIds.includes(item.id);
          const buttonId = `button-${item.id}`;
          const panelId = `panel-${item.id}`;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 backdrop-blur-xs ${
                isOpen
                  ? "border-purple-500/40 bg-white/90 dark:bg-zinc-900/90 shadow-sm"
                  : "border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-2xl"
              >
                <span className="text-sm sm:text-base font-semibold font-sans text-zinc-900 dark:text-zinc-100 leading-snug">
                  {item.question}
                </span>
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 ${
                    isOpen
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 rotate-180"
                      : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 mt-1">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExpandableFAQ;
