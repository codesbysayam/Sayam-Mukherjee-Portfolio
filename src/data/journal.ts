import { calculateReadingTime } from "../utils/readingTime";
import type { JournalDiagramId } from "../components/journal/JournalVisualCover";

export interface JournalCodeSnippet {
  title: string;
  language: string;
  code: string;
}

export interface JournalCallout {
  label: string;
  body: string;
}

export interface JournalSection {
  heading?: string;
  paragraphs: string[];
  callout?: JournalCallout;
  codeSnippet?: JournalCodeSnippet;
  diagramId?: JournalDiagramId;
}

export interface JournalEntry {
  id: string;
  slug: string;
  issueNumber?: string;
  category: string;
  title: string;
  subtitle?: string;
  summary: string;
  date: string;
  readingTime: string;
  coverProjectId?: string;
  coverCaption?: string;
  topics?: string[];
  content: JournalSection[];
  featured?: boolean;
}

/**
 * Authoritative Journal Entries repository.
 * Personal engineering reflections, architectural decisions, and learning notes by Sayam Mukherjee.
 * Written from an authentic, reflective student-engineer perspective without fabricated metrics or external publication claims.
 */
const rawJournalEntries: Omit<JournalEntry, "readingTime">[] = [
  {
    id: "building-operon-from-the-interface-up",
    slug: "building-operon-from-the-interface-up",
    issueNumber: "ISSUE 06",
    category: "BUILDING",
    title: "Building OPERON From the Interface Up",
    subtitle: "Why human-in-the-loop checkpoints belong in the UI contract, not tacked onto a backend webhook.",
    summary: "A look at what I learned while building the website and product interface for OPERON during the Deploy or Die challenge.",
    date: "Feb 2026",
    coverProjectId: "operon",
    coverCaption: "OPERON Control Center showing Support, Finance, HR & Ops agent dispatch queues with explicit operator approval.",
    topics: ["Multi-Agent UI", "Human-in-the-Loop", "TypeScript Contracts"],
    featured: true,
    content: [
      {
        heading: "Starting With the Human Experience",
        paragraphs: [
          "When we started working on OPERON for the Deploy or Die challenge with GDG on Campus KIIT, the core technical idea was already ambitious: coordinating multiple autonomous processes to handle business tasks. But very early in the hackathon, I realized that if the person using the system cannot inspect what an agent is doing, autonomy becomes a liability rather than a feature.",
          "My responsibility in Team Nexus was building the application interface from the ground up. I did not want to treat the frontend as a decorative coat of paint applied after the backend was finished. Instead, I designed the interface around workflow clarity: showing which tasks were pending, what decisions required human intervention, and where each operation fit into the broader system."
        ],
        callout: {
          label: "Design Principle · Agent Visibility",
          body: "An autonomous operation that touches payroll, support escalations, or infrastructure credentials must expose its proposed payload and rollback boundary before mutating state."
        }
      },
      {
        heading: "Traceability Over Complexity",
        paragraphs: [
          "One of the biggest traps in agentic software is presenting a chat box and pretending that is enough. In enterprise operations, people do not want a conversational mystery; they want an audit log. They need to know why a financial document was flagged, what policy was evaluated, and which team member gave the final sign-off.",
          "Designing OPERON forced me to think carefully about visual density. Every action had to feel deliberate. Buttons could not just trigger events; they needed clear state feedback so the operator never wondered if a step had succeeded or stalled."
        ],
        diagramId: "hitl-state-machine",
        codeSnippet: {
          title: "Explicit approval transition contract (TypeScript)",
          language: "typescript",
          code: `type AgentDepartment = "SUPPORT" | "FINANCE" | "HR" | "OPS";

type OperationState =
  | { status: "PROPOSED"; department: AgentDepartment; payloadPreview: string }
  | { status: "AWAITING_HUMAN"; policyRule: string; queuedAt: string }
  | { status: "APPROVED"; reviewerId: string; executedAt: string }
  | { status: "HALTED"; reviewerId: string; reason: string };`
        }
      },
      {
        heading: "Working With Team Nexus",
        paragraphs: [
          "Collaborating under hackathon deadlines always reveals gaps in communication. Working alongside Sounak, Gourab, and Aarush taught me that clean TypeScript interfaces are as much a social contract as a technical one. When the data models between our state management and backend APIs were agreed upon early, we avoided countless last-minute integration bugs.",
          "OPERON reminded me that software engineering is ultimately about trust. An autonomous system only succeeds when the human operator feels fully in control of the outcome."
        ]
      }
    ]
  },
  {
    id: "what-a-906-cgpa-actually-taught-me",
    slug: "what-a-906-cgpa-actually-taught-me",
    issueNumber: "ISSUE 05",
    category: "LEARNING",
    title: "What a 9.06 CGPA Actually Taught Me",
    subtitle: "Why repeatable daily habits bridge university theory and late-night software debugging.",
    summary: "Grades are useful, but the habits behind them have mattered more to me.",
    date: "Jan 2026",
    coverProjectId: "sayam-solves",
    coverCaption: "Daily C++ algorithmic practice paired with B.Tech CSE (AI & ML) foundational theory at KIIT University.",
    topics: ["Academic Discipline", "Mathematics", "CSE Foundations"],
    featured: false,
    content: [
      {
        heading: "The Reality Behind the Number",
        paragraphs: [
          "Finishing my first year of Computer Science Engineering at KIIT with a 9.06 CGPA felt reassuring, especially after the transition from school to university coursework. But looking back at those two semesters, the number on the grade sheet is the least interesting part of the experience.",
          "In engineering college, exams test your immediate recall, but real projects test your mental endurance. What actually kept my grades steady was not cramming the night before an exam, but treating coursework as an extension of my daily programming discipline."
        ]
      },
      {
        heading: "Consistency Across Subjects",
        paragraphs: [
          "The first-year curriculum at KIIT covered twenty distinct subjects, spanning from Linear Algebra and Differential Equations to Basic Electrical Engineering and Programming Lab. Many students tend to neglect theory subjects to focus purely on coding, or vice versa.",
          "I found that understanding the mathematical foundations, particularly transforms and numerical methods, changed how I approached computer vision algorithms later on. When you understand how a matrix represents spatial transformation, graphics and edge detection code stops looking like black magic."
        ],
        callout: {
          label: "Cross-Pollination Note",
          body: "Matrix transformations from first-year Linear Algebra mapped directly to bounding-box scaling and 17-keypoint skeletal projection math in SightForge."
        }
      },
      {
        heading: "Balancing Builds and Academics",
        paragraphs: [
          "The hardest part was time management. I wanted to build real software, participate in hackathons, and practice algorithmic problems on LeetCode while attending lectures and submitting lab records. Setting a strict boundary (one hour of dedicated daily coding, paired with five to seven focused study hours on weekdays) gave me a repeatable structure.",
          "Grades open doors for university verification, but consistent study habits are what keep you calm when a production build breaks at midnight."
        ],
        diagramId: "academic-matrix"
      }
    ]
  },
  {
    id: "when-a-project-stops-being-just-a-project",
    slug: "when-a-project-stops-being-just-a-project",
    issueNumber: "ISSUE 04",
    category: "PROJECTS",
    title: "When a Project Stops Being Just a Project",
    subtitle: "Moving from tutorial copies to testable edge cases, failure recovery, and maintainable types.",
    summary: "Working on different projects changed the way I think about learning and building.",
    date: "Jan 2026",
    coverProjectId: "axiom",
    coverCaption: "AXIOM control plane built with failure recovery, sandbox simulation, and explicit structural boundaries.",
    topics: ["Engineering Craft", "Edge Cases", "Architecture"],
    featured: false,
    content: [
      {
        heading: "The Shift From Tutorial to Ownership",
        paragraphs: [
          "Every beginner starts by following tutorials, copying boilerplate, and tweaking CSS colors. It feels productive, but you rarely learn how software behaves when things go wrong. For me, the shift happened when I stopped treating code as an academic assignment and started treating it as something people might actually use.",
          "When I built SayamSolves, it began as simple notes for C++ problems. But as the repository grew, I started structuring documentation, annotating asymptotic complexities, and explaining the logic so that any student reading it could follow along without confusion."
        ],
        codeSnippet: {
          title: "Complexity & invariant header convention in C++ archive",
          language: "cpp",
          code: `// Problem: Search in Rotated Sorted Array (LC 0033)
// Invariant: At least one half [lo..mid] or [mid..hi] remains strictly sorted.
// Time: O(log n) | Space: O(1)
int searchRotated(const std::vector<int>& nums, int target) {
  int lo = 0, hi = static_cast<int>(nums.size()) - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[lo] <= nums[mid]) {
      (nums[lo] <= target && target < nums[mid]) ? (hi = mid - 1) : (lo = mid + 1);
    } else {
      (nums[mid] < target && target <= nums[hi]) ? (lo = mid + 1) : (hi = mid - 1);
    }
  }
  return -1;
}`
        }
      },
      {
        heading: "Learning From Incomplete Ideas",
        paragraphs: [
          "Not every project survives to production. Over the past two years, I have started prototypes that ended up being discarded because the architecture was flawed or the idea was not well thought through. Early on, that felt like wasted time.",
          "Today, I view those discarded branches as essential milestones. You do not truly understand why clean component separation or type safety matters until you have spent three days untangling a mess you wrote yourself two months prior."
        ]
      },
      {
        heading: "Building for Longevity",
        paragraphs: [
          "A project stops being just a school exercise the moment you care about edge cases. What happens when an API is offline? How does the UI look on a low-end phone? What happens when a user types unexpected inputs? Answering those questions turns code into engineering."
        ],
        diagramId: "ownership-cycle"
      }
    ]
  },
  {
    id: "thinking-about-memory-in-motion",
    slug: "thinking-about-memory-in-motion",
    issueNumber: "ISSUE 03",
    category: "RESEARCH",
    title: "Thinking About Memory in Motion",
    subtitle: "Intuitions on O(1) fixed-size recurrent state versus unbounded O(T) key-value caches.",
    summary: "Exploring what happens when useful context has to survive inside a fixed-size recurrent state.",
    date: "Dec 2025",
    coverProjectId: "memory-in-motion",
    coverCaption: "Interactive DataForge 2026 visual lab comparing fixed-size recurrent compression and Hebbian fast weights.",
    topics: ["Mechanistic Lab", "Fast Weights", "Recurrent State"],
    featured: false,
    content: [
      {
        heading: "The Problem With Infinite Context",
        paragraphs: [
          "Modern language models rely heavily on large attention windows to hold conversation history. While effective, expanding the context window indefinitely comes with severe computational costs and memory overhead. For our DataForge 2026 submission with KDAG at IIT Kharagpur, we explored an alternative question under the 'Explain the Frontier' pathway.",
          "What happens when useful context must survive inside a fixed-size recurrent state? Instead of appending every token forever, the system is forced to compress, retain, and deliberately discard information over time."
        ],
        diagramId: "memory-tradeoff"
      },
      {
        heading: "Compression and Interference",
        paragraphs: [
          "When working with bounded state, every incoming piece of information competes with existing memories. If the memory update function is too aggressive, early facts are overwritten (catastrophic forgetting). If it is too cautious, new information is ignored (saturation).",
          "Visualizing this trade-off helped me appreciate how biological memory operates. Humans do not recall every word uttered over breakfast; we carry forward semantic summaries and emotional markers. Designing systems that balance retention with compression is one of the most compelling challenges in machine learning today."
        ],
        callout: {
          label: "Plasticity vs. Stability",
          body: "In Hebbian fast-weight updates, the decay coefficient acts as an explicit forgetting dial: tuning how fast earlier associations yield to incoming token pairs."
        }
      },
      {
        heading: "Lessons for Practical Software",
        paragraphs: [
          "Even outside machine learning research, the concept of bounded memory applies to everyday frontend engineering. When caching state or handling streaming telemetry, unbounded arrays quickly exhaust browser memory. Designing bounded buffers with eviction policies is a lesson that directly transfers back to web systems."
        ],
        codeSnippet: {
          title: "Bounded ring-buffer telemetry guard in frontend clients",
          language: "typescript",
          code: `export function appendBounded<T>(buffer: readonly T[], next: T, maxItems = 120): T[] {
  if (buffer.length < maxItems) return [...buffer, next];
  return [...buffer.slice(buffer.length - maxItems + 1), next];
}`
        }
      }
    ]
  },
  {
    id: "why-i-still-care-about-making-things-look-good",
    slug: "why-i-still-care-about-making-things-look-good",
    issueNumber: "ISSUE 02",
    category: "CREATIVE WORK",
    title: "Why I Still Care About Making Things Look Good",
    subtitle: "Treating typographic measure, contrast ratios, and motion restraint as core interface engineering.",
    summary: "Design is not separate from engineering. It changes how people understand what we build.",
    date: "Nov 2025",
    coverProjectId: "portfolio",
    coverCaption: "Adaptive editorial paper-and-ink design system enforcing contrast parity across every viewport.",
    topics: ["Design Systems", "Typography", "Accessibility"],
    featured: false,
    content: [
      {
        heading: "Beyond Mere Decoration",
        paragraphs: [
          "There is an old engineering stereotype that says backend logic is 'real work' and interface design is just superficial styling. Having spent time on both sides, I could not disagree more. A powerful algorithm wrapped in a confusing, unreadable interface is functionally useless to most people.",
          "When I started creating content on YouTube at age sixteen, designing thumbnails and visual slides was my first practical lesson in human psychology. You have less than two seconds to convey an idea. If the visual hierarchy is cluttered, people scroll past. The same rule applies to software."
        ]
      },
      {
        heading: "Clarity Over Eye Candy",
        paragraphs: [
          "Making something look good does not mean covering it in neon gradients, excessive animations, or heavy drop shadows. True design quality is about restraint: generous whitespace, comfortable line lengths, consistent typographic scale, and predictable interaction patterns.",
          "When designing this portfolio, semantic surface tokens were chosen so paper mode and ink mode maintain crisp legibility without glare. When a control responds immediately to input with subtle, consistent feedback, the user trusts that the interface is dependable."
        ],
        diagramId: "ui-clarity"
      },
      {
        heading: "Engineering as Craft",
        paragraphs: [
          "Code and design come from the same desire: organizing complex concepts into clear, functional structures. When both are done with care, the finished product feels natural and easy to navigate."
        ],
        callout: {
          label: "Interface Measure",
          body: "Technical prose reads cleanly around 60–68 characters per line with explicit contrast separation between primary text, metadata, and structural borders."
        }
      }
    ]
  },
  {
    id: "why-i-wanted-mausam-to-feel-useful",
    slug: "why-i-wanted-mausam-to-feel-useful",
    issueNumber: "ISSUE 01",
    category: "WEATHER / PROJECTS",
    title: "Why I Wanted MAUSAM to Feel Useful",
    subtitle: "Replacing raw meteorological table dumps with severity-ordered, role-relevant weather signals.",
    summary: "Building a weather platform made me think about the difference between showing data and helping someone use it.",
    date: "Oct 2025",
    coverProjectId: "mausam",
    coverCaption: "MAUSAM unified intelligence view combining Doppler nowcasting, NAQI metrics, INCOIS marine state, and Ask MAUSAM.",
    topics: ["Civic Tech", "SIH 2026", "Data Hierarchies"],
    featured: false,
    content: [
      {
        heading: "More Than Just Temperature",
        paragraphs: [
          "Most weather applications show you the current temperature, a generic rain cloud icon, and a five-day forecast. But when Team Algnite started conceptualizing MAUSAM for the Smart India Hackathon (SIH 2026), we asked ourselves who actually depends on meteorological data every day.",
          "For farmers, knowing air temperature is helpful, but knowing soil moisture, upcoming rain windows, and dew point determines whether to plant crops or hold off. For coastal communities, tidal schedules and wind velocities matter far more than a single humidity percentage."
        ],
        diagramId: "mausam-pipeline"
      },
      {
        heading: "Making Telemetry Readable",
        paragraphs: [
          "My primary role on MAUSAM was developing the frontend interface and integrating real-time telemetry from environmental APIs. The main challenge was avoiding data overload. If you present twenty scientific graphs simultaneously, the screen becomes intimidating.",
          "I organized the dashboard hierarchically: critical warnings and current conditions appear at the top, followed by interactive cards for AQI, UV index, soil moisture, and localized wind trends. Color was reserved strictly for severity indicators so that normal readings did not scream for attention."
        ],
        codeSnippet: {
          title: "Severity normalization pattern across regional feeds",
          language: "typescript",
          code: `type AlertSeverity = "normal" | "advisory" | "warning" | "critical";

export function normalizeHazardRank(severity: AlertSeverity): number {
  const rankMap: Record<AlertSeverity, number> = {
    critical: 0,
    warning: 1,
    advisory: 2,
    normal: 3,
  };
  return rankMap[severity];
}`
        }
      },
      {
        heading: "Practical Utility as the Benchmark",
        paragraphs: [
          "Working on MAUSAM reinforced a core lesson for all my future projects: metrics are only valuable if they help someone make a better decision. Whether it is a farmer checking rainfall or a developer checking server status, software should reduce cognitive load, not add to it."
        ]
      }
    ]
  }
];

/**
 * All journal entries with estimated reading time dynamically computed
 * based on standard average reading speed (200 words per minute).
 */
export const journalEntries: JournalEntry[] = rawJournalEntries.map((entry) => ({
  ...entry,
  readingTime: calculateReadingTime(entry).formatted,
}));

// Backwards compatibility alias
export const JOURNAL_ENTRIES = journalEntries;
