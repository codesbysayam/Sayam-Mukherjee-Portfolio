export interface LearningFocusItem {
  title: string;
  category: string;
  description: string;
  status: "Active" | "Foundational" | "Ongoing";
}

export interface NowPageData {
  primaryFocus: string;
  semesterPhase: string;
  projectsInProgress: {
    name: string;
    description: string;
    status: string;
  }[];
  learningGoals: {
    topic: string;
    detail: string;
  }[];
  physicalDiscipline: {
    routine: string;
    frequency: string;
    notes: string;
  };
}

export const CURRENT_FOCUS_LIST: LearningFocusItem[] = [
  {
    title: "Core Computer Science Fundamentals",
    category: "Academic (B.Tech CSE - KIIT)",
    description: "Operating systems, computer architecture, discrete mathematics, and database management foundations.",
    status: "Foundational"
  },
  {
    title: "Data Structures & Algorithms",
    category: "Algorithmic Practice",
    description: "Systematic LeetCode practice starting with foundational arrays, strings, two pointers, and basic recursion.",
    status: "Active"
  },
  {
    title: "Full-Stack Web Development",
    category: "Software Engineering",
    description: "Modern web applications with React, TypeScript, Node.js, Express, and responsive Tailwind styling.",
    status: "Active"
  },
  {
    title: "Computer Vision Basics",
    category: "AI & Machine Learning",
    description: "Image processing primitives with OpenCV and real-time object detection models with YOLOv8.",
    status: "Ongoing"
  },
  {
    title: "Financial Markets & Stock Analysis",
    category: "Finance & Quantitative",
    description: "Understanding technical indicators, moving average behavior, and structured market analytics.",
    status: "Ongoing"
  }
];

export const NOW_PAGE_DATA: NowPageData = {
  primaryFocus: "Foundational CS, C++ DSA, and project architecture",
  semesterPhase: "2nd Year, 3rd Semester • B.Tech CSE at Kalinga Institute of Industrial Technology, Bhubaneswar",
  projectsInProgress: [
    {
      name: "Fitness OS Pro",
      description: "Health, workout, and nutrition tracking system designed for progressive overload and personal fitness analytics.",
      status: "In Development"
    },
    {
      name: "Finance OS Pro",
      description: "Financial analytics and portfolio tracking dashboard exploring stock market trends and technical indicators.",
      status: "In Development"
    }
  ],
  learningGoals: [
    {
      topic: "React System Mechanics",
      detail: "State coordination, custom hooks, concurrent transitions, and performant re-render boundaries."
    },
    {
      topic: "Data Structures",
      detail: "Daily algorithmic problem solving, time-complexity analysis, and foundational problem patterns."
    }
  ],
  physicalDiscipline: {
    routine: "Gym Workouts & Athletic Training",
    frequency: "5 days a week",
    notes: "Consistent strength training, cardiovascular conditioning, and disciplined athletic recovery."
  }
};

export const LEARNING_ROADMAP = [
  {
    step: 1,
    title: "B.Tech CSE Foundations & Systems Depth",
    detail: "Core computer science fundamentals, algorithmic problem solving, and academic coursework at Kalinga Institute of Industrial Technology, Bhubaneswar.",
    phase: "Current"
  },
  {
    step: 2,
    title: "Data Structures & Algorithms",
    detail: "Systematic problem solving on LeetCode and competitive coding platforms.",
    phase: "Current"
  },
  {
    step: 3,
    title: "Applied Project Development",
    detail: "Building production-quality systems like Fitness OS Pro, Finance OS Pro, and Obsidian Optics.",
    phase: "Active"
  },
  {
    step: 4,
    title: "Open Source & Hackathon Participation",
    detail: "Participating in national hackathons (such as SIH 2026 - Mausam) and contributing to open-source repos.",
    phase: "Active"
  },
  {
    step: 5,
    title: "AI & Computer Vision Engineering",
    detail: "Deepening practical edge AI pipelines and neural network integration for real-world telemetry.",
    phase: "Upcoming"
  }
];

export const VERIFIED_LEARNING_NOW = {
  currentStatus: "2nd Year Undergraduate (3rd Semester)",
  college: "Kalinga Institute of Industrial Technology, Bhubaneswar",
  location: "Bhubaneswar, Odisha",
  hometown: "Hooghly, West Bengal",
  dailyRoutine: {
    coding: "1 hr / day",
    studyWeekdays: "5–7 hrs",
    studyWeekends: "8–9 hrs",
    gym: "5 days / week"
  }
};

export const VERIFIED_CORE_PILLARS = [
  {
    pillar: "Computer Science Foundations",
    status: "Active Curriculum",
    description: "Rigorous study of university core coursework including Operating Systems, Computer Architecture, Discrete Math, and system foundations.",
    topics: ["Operating Systems", "Computer Architecture", "Digital Logic", "Discrete Mathematics"]
  },
  {
    pillar: "Data Structures & Algorithms",
    status: "Daily Practice",
    description: "Systematic problem solving in C++ focusing on time complexity, algorithmic decomposition, arrays, pointers, and recursive techniques.",
    topics: ["C++ STL", "Time Complexity", "Arrays & Strings", "Two Pointers", "Recursion"]
  },
  {
    pillar: "Computer Vision & Edge AI",
    status: "Exploratory / Applied",
    description: "Practical experimentation with image processing pipelines and object detection architectures using OpenCV and YOLOv8 models.",
    topics: ["OpenCV", "YOLOv8", "Object Detection", "Image Processing"]
  },
  {
    pillar: "Full-Stack Software Engineering",
    status: "Active Production",
    description: "Building production-grade web systems with modern React, TypeScript, Next.js, Node.js, Express, and high-performance design patterns.",
    topics: ["React 19", "TypeScript", "Next.js", "Express.js", "Tailwind CSS"]
  }
];

export const VERIFIED_ROADMAP_MILESTONES = [
  {
    timeline: "Year 1 (2025 - 2026)",
    status: "Completed",
    title: "Core Foundations & Discipline",
    description: "Deep mastery of foundational CS curricula, daily C++ programming cadence, and first full-stack application builds."
  },
  {
    timeline: "Year 2 (2026 - 2027)",
    status: "Active",
    title: "Advanced DSA & Systems Depth",
    description: "2nd Year (3rd Semester) B.Tech CSE at Kalinga Institute of Industrial Technology, Bhubaneswar. Advanced algorithmic mastery on LeetCode, systems programming, and computer vision project architecture."
  },
  {
    timeline: "Year 3 (2027 - 2028)",
    status: "Planned",
    title: "Research & Hackathon Leadership",
    description: "Competitive hackathons, open-source maintainership, applied machine learning research, and industry software internships."
  },
  {
    timeline: "Year 4 (2028 - 2029)",
    status: "Planned",
    title: "Production Engineering & Capstone",
    description: "Production software deployment, comprehensive capstone system delivery, and transition to professional engineering roles."
  }
];

