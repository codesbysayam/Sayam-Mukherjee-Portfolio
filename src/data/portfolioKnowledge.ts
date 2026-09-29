/**
 * Authoritative Single Source of Truth for Sayam Mukherjee's Portfolio Knowledge
 * 
 * Used by the Portfolio Knowledge Assistant and server-side Gemini intelligence.
 * Strictly verified data only: no fabricated statistics, marks, or rankings.
 */

export interface ProjectKnowledge {
  id: string;
  name: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  role?: string;
  team?: string;
  event?: string;
  links: {
    github?: string;
    demo?: string;
    paper?: string;
  };
}

export interface PortfolioKnowledge {
  identity: {
    name: string;
    fullName: string;
    role: string;
    headline: string;
    location: string;
    hometown: string;
    currentResidence: string;
    primaryEmail: string;
    academicEmail: string;
    academicIdentity: string;
  };
  education: {
    university: {
      institution: string;
      institutionShort: string;
      location: string;
      degree: string;
      specialization: string;
      currentStatus: string;
      expectedGraduation: string;
      firstYearCGPA: string;
      cgpaScale: string;
      coursework: string[];
      description: string;
    };
    school: {
      class12: {
        session: string;
        examination: string;
        board: string;
        schoolName: string;
        percentage: string;
        stream: string;
        subjects: string[];
        description: string;
      };
      class10: {
        session: string;
        examination: string;
        board: string;
        schoolName: string;
        percentage: string;
        subjects: string[];
        description: string;
      };
    };
  };
  projects: ProjectKnowledge[];
  skills: {
    programmingLanguages: string[];
    frontend: string[];
    backend: string[];
    aiAndMachineLearning: string[];
    developerToolsAndDevOps: string[];
    creativeMedia: string[];
  };
  competitionsAndHonors: Array<{
    title: string;
    issuer: string;
    year: string;
    category: string;
    description: string;
    credentialId?: string;
    verificationLink?: string;
  }>;
  contentCreation: {
    totalCommunityReach: string;
    channels: Array<{
      id: string;
      name: string;
      url: string;
      subscribers: string;
      focus: string;
      description: string;
      foundedAge?: number;
    }>;
    categories: string[];
    description: string;
  };
  freelancing: {
    status: string;
    services: Array<{
      title: string;
      description: string;
    }>;
    inquiries: string;
  };
  disciplineAndRoutine: {
    codingPractice: string;
    studyWeekdays: string;
    studyWeekends: string;
    fitnessRoutine: string;
    leetCodePractice: string;
  };
  links: {
    github: string;
    linkedin: string;
    leetcode: string;
    codolio: string;
    resume: string;
    instagram: string;
    email: string;
    academicEmail?: string;
    youtube?: string;
    youtubeDailyDecipher?: string;
  };
  navigationRoutes: Array<{
    tab: string;
    path: string;
    label: string;
    description: string;
  }>;
}

export const portfolioKnowledge: PortfolioKnowledge = {
  identity: {
    name: "Sayam Mukherjee",
    fullName: "Sayam Mukherjee",
    role: "B.Tech CSE (AI & ML) Student & Systems Developer",
    headline: "AI & ML Undergraduate, Systems Architect & Full-Stack Developer",
    location: "Bhubaneswar, Odisha, India",
    hometown: "Hooghly, West Bengal, India",
    currentResidence: "Bhubaneswar, Odisha, India",
    primaryEmail: "wrickbusiness@gmail.com",
    academicEmail: "24051052@kiit.ac.in",
    academicIdentity: "2nd Year, 3rd Semester B.Tech Undergraduate at KIIT",
  },

  education: {
    university: {
      institution: "Kalinga Institute of Industrial Technology (KIIT)",
      institutionShort: "KIIT, Bhubaneswar",
      location: "Bhubaneswar, Odisha",
      degree: "B.Tech Computer Science and Engineering",
      specialization: "AI & ML",
      currentStatus: "Undergraduate (2nd Year, 3rd Sem)",
      expectedGraduation: "2029",
      firstYearCGPA: "9.06",
      cgpaScale: "10.0",
      coursework: [
        "Data Structures & Algorithms",
        "Object-Oriented Programming",
        "Computer Organization",
        "Discrete Mathematics",
        "Linear Algebra & Differential Equations",
        "Transforms and Numerical Methods",
        "Optimization Techniques",
        "Basic Electrical & Electronics Engineering",
      ],
      description:
        "Pursuing B.Tech CSE with AI & ML specialization at KIIT, maintaining a 9.06 CGPA across the completed first-year curriculum.",
    },

    school: {
      class12: {
        session: "2024–2025",
        examination: "CBSE Class 12 Board Examination",
        board: "Central Board of Secondary Education",
        schoolName: "Aditya Birla Vani Bharati",
        percentage: "86.2%",
        stream: "Science",
        subjects: [
          "English",
          "Hindi",
          "Mathematics",
          "Physics",
          "Biology",
          "Chemistry",
        ],
        description:
          "Completed the CBSE Class 12 Board Examination with an overall score of 86.2% in the Science stream. Note: Stream includes Biology; do not describe as PCM.",
      },

      class10: {
        session: "2022–2023",
        examination: "CBSE Class 10 Board Examination",
        board: "Central Board of Secondary Education",
        schoolName: "Aditya Birla Vani Bharati",
        percentage: "92.6%",
        subjects: [
          "English",
          "Hindi",
          "Science",
          "Social Science",
          "Mathematics",
          "Information Technology",
        ],
        description:
          "Completed the CBSE Class 10 Board Examination with distinction, scoring an overall 92.6%.",
      },
    },
  },

  projects: [
    {
      id: "operon",
      name: "OPERON",
      title: "OPERON | Autonomous Operations, Human-Controlled",
      category: "Agentic Systems & Enterprise Automation",
      description:
        "Agent-driven operations platform designed to automate business workflows while keeping critical decisions traceable, auditable, policy-controlled, and subject to human approval.",
      technologies: [
        "TypeScript",
        "Node.js",
        "Express",
        "React",
        "Tailwind CSS",
        "Multi-Agent Lifecycle",
        "Human-in-the-Loop Governance",
      ],
      role: "Lead Full-Stack Developer",
      team: "Team Nexus (Sayam Mukherjee, Sounak Chowdhury, Gourab Biswas, Aarush Roy)",
      event: "Deploy or Die | HowToAlgo × GDG on Campus KIIT (Track A: Business Process Automation)",
      links: {
        demo: "https://impressive-indigo-lkxz4q1q.edgeone.dev/",
        github: "https://github.com/codesbysayam/Operon",
      },
    },
    {
      id: "sayamsolves",
      name: "SayamSolves",
      title: "SayamSolves | Algorithmic Problem Solving Repository",
      category: "Algorithms & Data Structures",
      description:
        "Consistent daily algorithmic problem solving in C++ focusing on optimal time-space complexity, verified invariants, and rigorous data structure fundamentals on LeetCode.",
      technologies: [
        "C++",
        "Data Structures",
        "Algorithms",
        "Asymptotic Analysis",
        "LeetCode",
      ],
      role: "Solo Creator & Maintainer",
      links: {
        github: "https://github.com/codesbysayam/SayamSolves",
      },
    },
    {
      id: "mausam",
      name: "MAUSAM",
      title: "MAUSAM | Smart Weather Intelligence Platform",
      category: "Environmental Telemetry & SIH 2026",
      description:
        "Smart weather intelligence platform built for Smart India Hackathon (SIH 2026) by Team Algnite. Delivers real-time weather analytics, AQI, UV index, humidity, wind, pollen, sea conditions, tides, and soil moisture across India.",
      technologies: [
        "TypeScript",
        "React",
        "Python",
        "Tailwind CSS",
        "Weather APIs",
        "Open-Meteo",
        "Environmental Telemetry",
      ],
      role: "Frontend & Interface Engineer",
      team: "Team Algnite",
      event: "Smart India Hackathon (SIH 2026)",
      links: {
        demo: "https://mausamgovt.vercel.app",
        github: "https://github.com/codesbysayam/mausam",
      },
    },
    {
      id: "portfolio",
      name: "Sayam Mukherjee Interactive Portfolio",
      title: "Sayam Mukherjee | Interactive Developer Portfolio",
      category: "Full-Stack System Architecture",
      description:
        "Personal developer portfolio built with dark/light liquid glass aesthetics, real-time GitHub telemetry synchronization, client chunk recovery, and an authentic knowledge-grounded assistant.",
      technologies: [
        "TypeScript",
        "React",
        "Vite",
        "Tailwind CSS",
        "Express",
        "Node.js",
        "Motion",
      ],
      role: "Solo Architect & Developer",
      links: {
        github: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
      },
    },
    {
      id: "yolo",
      name: "YOLO / YOLOv8 Edge Computer Vision",
      title: "Autonomous Edge Computer Vision & Motion Tracking",
      category: "Computer Vision & Edge AI",
      description:
        "Autonomous edge camera pipeline detecting movement vectors and spatial telemetry using lightweight YOLOv8 models optimized for low-latency inference on edge hardware.",
      technologies: [
        "Python",
        "PyTorch",
        "OpenCV",
        "YOLOv8",
        "Computer Vision",
        "Edge AI Inference",
      ],
      role: "ML & Computer Vision Developer",
      links: {
        github: "https://github.com/codesbysayam/codesbysayam",
      },
    },
  ],

  skills: {
    programmingLanguages: [
      "C++",
      "Python",
      "TypeScript",
      "JavaScript",
      "Java",
      "SQL",
      "HTML5",
      "CSS3",
    ],
    frontend: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Vite",
      "Motion",
      "Responsive UI",
    ],
    backend: [
      "Node.js",
      "Express",
      "RESTful APIs",
      "SSE (Server-Sent Events)",
      "Middleware Architecture",
    ],
    aiAndMachineLearning: [
      "PyTorch",
      "OpenCV",
      "YOLOv8",
      "Scikit-Learn",
      "Gemini API (@google/genai)",
      "In-Context Learning",
    ],
    developerToolsAndDevOps: [
      "Git",
      "GitHub",
      "Docker",
      "Linux",
      "VS Code",
      "EdgeOne",
      "Vercel",
    ],
    creativeMedia: [
      "Adobe Photoshop",
      "Adobe Premiere Pro",
      "Figma",
      "Visual User Psychology",
    ],
  },

  competitionsAndHonors: [
    {
      title: "DataForge 2026 | Memory in Motion",
      issuer: "Kharagpur Data Analytics Group (KDAG), IIT Kharagpur",
      year: "2026",
      category: "COMPETITIONS",
      description:
        "Interactive exploration of in-context learning with recurrent memory under the 'Explain the Frontier' pathway, demonstrating how bounded state retains task-relevant data without unbounded token growth.",
      verificationLink: "https://intact-black-0mk1uydx.edgeone.dev/",
    },
    {
      title: "Deploy or Die | HowToAlgo × GDG on Campus KIIT",
      issuer: "GDG on Campus KIIT",
      year: "2026",
      category: "COMPETITIONS",
      description:
        "Built OPERON under Track A (Business Process Automation). Developed the complete application interface and human-in-the-loop workflows.",
      verificationLink: "https://impressive-indigo-lkxz4q1q.edgeone.dev/",
    },
    {
      title: "National Finalist | Toycathon",
      issuer: "Ministry of Education & AICTE, Govt. of India",
      year: "2021",
      category: "COMPETITIONS",
      description:
        "Reached National Grand Finale among thousands of competing collegiate teams in the national Toycathon innovation challenge.",
      credentialId: "TC-2021-FIN",
    },
    {
      title: "Multi-Event Finalist | Technex'26",
      issuer: "IIT (BHU) Varanasi",
      year: "2026",
      category: "COMPETITIONS",
      description:
        "Qualified for final rounds across 5 out of 6 technical challenges in Technex, the annual technical festival of IIT (BHU).",
      credentialId: "TX-2026-IITBHU",
    },
    {
      title: "First-Year Grade Report",
      issuer: "Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar",
      year: "2025",
      category: "ACADEMIC RECORD",
      description:
        "First-year university grade report covering 20 engineering coursework subjects including Differential Equations, Numerical Methods, Electronics, and Programming Lab.",
      verificationLink: "https://diverse-plum-xc5wzkru.edgeone.dev/",
    },
    {
      title: "Inter-School Table Tennis Champion (3x 1st Position)",
      issuer: "Inter-School Sports Championship",
      year: "2023",
      category: "ACHIEVEMENTS",
      description:
        "Secured 1st place in three consecutive inter-school table tennis tournaments, demonstrating tactical focus and competitive discipline.",
    },
  ],

  contentCreation: {
    totalCommunityReach: "12K+ subscribers across YouTube channels",
    channels: [
      {
        id: "technicalaz",
        name: "Technical AZ",
        url: "https://youtube.com/@technicalaz",
        subscribers: "2.06K+",
        focus: "Emerging consumer technologies, computer science tutorials, and software tools",
        description:
          "Started at age 16; scaled to over 2,000 subscribers producing clear, hands-on tutorials on technology, consumer software, and developer tools.",
        foundedAge: 16,
      },
      {
        id: "dailydecipher",
        name: "Daily Decipher",
        url: "https://youtube.com/@dailydecipher",
        subscribers: "10K+",
        focus: "Educational breakdowns, algorithmic explanations, and technical deep dives",
        description:
          "Educational channel scaled to an organic community of 10,000+ subscribers, focusing on distilling complex computer science concepts into clear visual narratives.",
      },
    ],
    categories: [
      "Technology",
      "Artificial Intelligence",
      "Computer Science",
      "Software Engineering",
      "Personal Finance",
      "Psychology",
    ],
    description:
      "Content creator with 12K+ total community reach across Technical AZ and Daily Decipher, distilling dense technical concepts into high-signal tutorials.",
  },

  freelancing: {
    status: "Open to internships, engineering collaborations, and select freelance opportunities",
    services: [
      {
        title: "Full-Stack Web Application Development",
        description: "Building responsive, performant React/TypeScript web apps and REST/SSE API backends.",
      },
      {
        title: "Click-Driven YouTube Thumbnail & Graphic Design",
        description: "Visual user psychology, high-CTR YouTube thumbnails, and digital brand design.",
      },
      {
        title: "Technical Writing & Video Tutorials",
        description: "Step-by-step developer documentation, educational scripts, and technical breakdown guides.",
      },
    ],
    inquiries: "Available via the Contact section form or by emailing wrickbusiness@gmail.com directly.",
  },

  disciplineAndRoutine: {
    codingPractice: "1 hour/day disciplined practice",
    studyWeekdays: "5–7 hours on weekdays",
    studyWeekends: "8–9 hours on weekends",
    fitnessRoutine: "5 gym sessions per week",
    leetCodePractice: "4 fundamental problems deliberately solved",
  },

  links: {
    github: "https://github.com/codesbysayam",
    linkedin: "https://www.linkedin.com/in/sayammukherjee-portfolio/",
    leetcode: "https://leetcode.com/u/codesbysayam/",
    codolio: "https://codolio.com/profile/codesbysayam",
    resume: "https://homely-scarlet-j1yvfmgp.edgeone.dev/Resume-Professional.pdf",
    instagram: "https://www.instagram.com/_.wrick._/",
    email: "wrickbusiness@gmail.com",
    academicEmail: "24051052@kiit.ac.in",
    youtube: "https://youtube.com/@technicalaz",
    youtubeDailyDecipher: "https://youtube.com/@dailydecipher",
  },

  navigationRoutes: [
    { tab: "home", path: "/", label: "Home", description: "Portfolio overview, hero introduction, and core engineering philosophy." },
    { tab: "about", path: "/about", label: "About", description: "Background, routine, and full academic record." },
    { tab: "skills", path: "/skills", label: "Skills", description: "Technical competencies, programming languages, and toolsets." },
    { tab: "ecosystem", path: "/ecosystem", label: "Ecosystem", description: "Deep-dive architectural mechanics and system node graphs." },
    { tab: "projects", path: "/projects", label: "Projects", description: "Showcase of all 5 verified engineering platforms." },
    { tab: "certificates", path: "/certificates", label: "Certificates", description: "Verified competition honours, grade reports, and credentials." },
    { tab: "journal", path: "/journal", label: "Journal", description: "Technical reflections, architecture journals, and articles." },
    { tab: "contact", path: "/contact", label: "Contact", description: "Direct communication form and verified social links." },
  ],
};
