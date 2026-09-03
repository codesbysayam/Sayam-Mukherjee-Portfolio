export interface JournalEntry {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  excerpt?: string;
  category: "Systems" | "Learning" | "Reflections" | "Engineering" | string;
  date: string;
  readTime: string;
  tags: string[];
  content: string[] | string;
  likes?: number;
  comments?: any[];
}

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "obsidian-optics-notes",
    title: "Building an Autonomous Vision Pipeline: Notes from Obsidian Optics",
    subtitle: "Setting up YOLOv8 edge inference and optimizing bounding-box latencies on consumer hardware.",
    summary: "Notes on setting up YOLOv8 edge inference and optimizing bounding-box latencies.",
    category: "Systems",
    date: "Feb 2026",
    readTime: "4 min",
    tags: ["Computer Vision", "YOLOv8", "OpenCV", "Edge AI", "Python"],
    content: [
      "When starting work on Obsidian Optics, the primary objective was simple: build a computer vision pipeline capable of detecting objects in real time on resource-constrained hardware, without relying on expensive cloud GPUs for every single frame.",
      "Most computer vision tutorials showcase YOLOv8 running in a clean Jupyter Notebook on high-end desktop hardware. However, deploying the model to an active video feed exposes immediate bottlenecks: frame buffer queuing, thread blocking during inference, and latency spikes when processing high-resolution video streams.",
      "To resolve this, we restructured the pipeline into distinct asynchronous stages using Python and OpenCV. Frame capture runs on a dedicated background worker, dropping stale frames rather than buffering them, while the inference loop consumes only the most recent complete frame. Converting weights from raw PyTorch checkpoints to ONNX runtime models reduced inference latency significantly while maintaining spatial detection accuracy.",
      "The result is a responsive vision pipeline that delivers stable bounding telemetry. Building Obsidian Optics reinforced a crucial engineering lesson: real-time performance is as much about stream management and pipeline architecture as it is about model architecture."
    ]
  },
  {
    id: "learning-dsa-from-scratch",
    title: "The Reality of Learning DSA from Scratch",
    subtitle: "Reflections on starting LeetCode systematically and building algorithmic intuition over memorization.",
    summary: "Reflections on starting LeetCode systematically and building algorithmic intuition.",
    category: "Learning",
    date: "Jan 2026",
    readTime: "3 min",
    tags: ["Algorithms", "LeetCode", "Data Structures", "Problem Solving"],
    content: [
      "There is a persistent misconception among computer science students that proficiency in Data Structures and Algorithms is measured by the sheer volume of problems solved. Websites and forums often encourage racing to 300, 400, or 500 problems without questioning whether genuine problem-solving intuition is being cultivated.",
      "Starting my LeetCode journey, I quickly realized that solving four problems deeply—understanding edge cases, calculating space-time trade-offs, and writing clean, optimal solutions—is far more valuable than blindly memorizing dozens of solutions. My verified LeetCode count currently stands at 4 solved problems, and each one represents a concept thoroughly understood.",
      "Rather than rushing through patterns, my focus is on deliberate practice: mastering pointer arithmetic, understanding how recursion unwinds on the call stack, and analyzing when a hash map's space penalty is worth the constant-time lookup. Building solid fundamentals takes patience, but it creates enduring engineering confidence that flashy numbers cannot fake."
    ]
  },
  {
    id: "designing-developer-portfolio",
    title: "Designing My Developer Portfolio: Form Follows Function",
    subtitle: "Why I chose a minimal, liquid-glass aesthetic and prioritized real telemetry over inflated stats.",
    summary: "Why I chose a minimal, liquid-glass aesthetic and prioritized real telemetry over inflated stats.",
    category: "Reflections",
    date: "Mar 2026",
    readTime: "4 min",
    tags: ["Design", "UI/UX", "Tailwind CSS", "Architecture", "Philosophy"],
    content: [
      "A developer portfolio is a personal statement. It reflects not just technical competence, but values: how you communicate, how you respect user attention, and whether you value substance over theatricality.",
      "In designing this portfolio, two guiding principles emerged early on: a dark, Apple-inspired 'liquid glass' visual aesthetic and an absolute commitment to authentic, unembellished telemetry. Many developer portfolios fall into the trap of exaggerating metrics—claiming thousands of contributions, invented client counts, or fictional production microservices. That approach undermines trust.",
      "Instead, this portfolio connects to live, verified data sources. When a visitor views my GitHub stats, they see my real public repositories (like Mausam, Operon, and this portfolio), my actual contribution events, and my verified LeetCode record. If live data is unavailable, the interface honestly communicates that state rather than substituting fabricated placeholders.",
      "Good design is not about piling on decorations or inflated numbers; it is about creating clarity, elegant typography, purposeful whitespace, and authentic craftsmanship. Form must always follow function."
    ]
  }
];
