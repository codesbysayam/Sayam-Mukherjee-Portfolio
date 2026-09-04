export interface IntentAction {
  type: "github" | "linkedin" | "leetcode" | "codolio" | "contact" | "resume" | "youtube";
  label: string;
  url: string;
  handle?: string;
  badge?: string;
}

export interface KnowledgeIntent {
  id: string;
  title: string;
  keywords: string[];
  phrases: string[];
  answer: string;
  action?: IntentAction;
  suggestions: string[];
}

export const PROFILE_LINKS = {
  github: "https://github.com/codesbysayam",
  leetcode: "https://leetcode.com/u/codesbysayam/",
  codolio: "https://codolio.com/profile/codesbysayam",
  linkedin: "https://www.linkedin.com/in/sayam-mukherjee-b96209324/",
  youtubeTechnicalAZ: "https://youtube.com/@technicalaz",
  youtubeDailyDecipher: "https://youtube.com/@dailydecipher",
  emailPrimary: "sayam.business@gmail.com",
  emailAcademic: "24051052@kiit.ac.in",
} as const;

export const INITIAL_WELCOME = {
  greeting: "Hi, I'm Sayam's portfolio assistant.",
  subtext: "Ask me anything about Sayam's work, skills, projects, achievements, or coding journey.",
  chips: [
    { label: "⚡ Projects", query: "What projects has he built?" },
    { label: "🛠 Skills", query: "What technologies does he use?" },
    { label: "🎓 Education", query: "Tell me about his education" },
    { label: "🏆 Achievements", query: "What are his achievements?" },
    { label: "💻 GitHub", query: "Show me his GitHub" },
    { label: "📩 Contact", query: "How can I contact him?" },
  ],
};

export const CONVERSATIONAL_INTENTS = {
  greetings: {
    patterns: [
      "hi", "hello", "hey", "good morning", "good evening", "good afternoon",
      "greetings", "sup", "yo", "hola", "namaste", "hi there", "hello there"
    ],
    answer: "Hey! I’m Sayam’s portfolio assistant. I can help you explore his skills, projects, education, achievements and coding profiles.",
    suggestions: ["⚡ Projects", "🛠 Skills", "🎓 Education", "📩 Contact"],
  },
  thanks: {
    patterns: [
      "thanks", "thank you", "thx", "ty", "thank you so much", "appreciate it",
      "great thanks", "thanks a lot", "many thanks"
    ],
    answer: "You’re welcome! Want to explore Sayam’s projects, skills or achievements?",
    suggestions: ["⚡ Projects", "🛠 Skills", "🏆 Achievements"],
  },
  bye: {
    patterns: [
      "bye", "goodbye", "see ya", "cya", "farewell", "good night", "take care", "bye bye"
    ],
    answer: "Thanks for visiting Sayam’s portfolio. Feel free to explore the work or get in touch.",
    suggestions: ["📩 Contact", "💻 GitHub", "LinkedIn"],
  },
};

export const FALLBACK_RESPONSE = {
  answer: `I don't have that information in my portfolio knowledge base yet.

I can help with:
• Skills
• Projects
• Education
• Achievements
• GitHub
• LeetCode
• Codolio
• Contact`,
  suggestions: ["⚡ Projects", "🛠 Skills", "🎓 Education", "🏆 Achievements", "💻 GitHub", "📩 Contact"],
};

export const UNVERIFIED_STAT_RESPONSE = {
  answer: "I don’t have a verified current figure for that in my portfolio records.",
  suggestions: ["⚡ Projects", "🛠 Skills", "💻 GitHub", "📩 Contact"],
};

export const KNOWLEDGE_INTENTS: KnowledgeIntent[] = [
  {
    id: "about",
    title: "About Sayam",
    keywords: [
      "who", "sayam", "about", "yourself", "introduce", "bio", "background",
      "identity", "mukherjee", "profile", "summary", "story"
    ],
    phrases: [
      "who are you",
      "tell me about sayam",
      "who is sayam",
      "who is sayam mukherjee",
      "tell me about yourself",
      "introduce yourself",
      "about sayam",
      "what is his background"
    ],
    answer: "Sayam Mukherjee is a B.Tech CSE (AI & ML) undergraduate at KIIT University, focused on AI, machine learning, full-stack development, DSA and building impactful software.",
    suggestions: ["🛠 Skills", "⚡ Projects", "🎓 Education"],
  },
  {
    id: "education",
    title: "Education & Academics",
    keywords: [
      "education", "college", "university", "degree", "kiit", "semester",
      "study", "studies", "btech", "b tech", "school", "academics",
      "graduation", "campus", "bhubaneswar"
    ],
    phrases: [
      "where does he study",
      "what does he study",
      "tell me about his education",
      "what is his degree",
      "which college",
      "what college does he go to",
      "where is he studying"
    ],
    answer: "Sayam is pursuing B.Tech in Computer Science Engineering (AI & ML) at KIIT University, with expected graduation in 2029.",
    action: {
      type: "resume",
      label: "View Resume",
      url: "#resume",
      handle: "Sayam_Mukherjee_Resume.pdf",
    },
    suggestions: ["🛠 Skills", "🏆 Achievements", "⚡ Projects"],
  },
  {
    id: "skills",
    title: "Technical Skills",
    keywords: [
      "skill", "skills", "technology", "technologies", "stack", "tech stack",
      "language", "languages", "programming", "code", "coding", "react", "python", "javascript",
      "typescript", "ml", "ai", "machine learning", "deep learning", "dl",
      "next", "nextjs", "node", "nodejs", "express", "mongodb", "sql",
      "git", "dsa", "c", "cpp", "java", "html", "css"
    ],
    phrases: [
      "what can he do",
      "what technologies does he use",
      "what technologies does he know",
      "what can he code",
      "does he know python",
      "what is his tech stack",
      "show me his skills",
      "what are his skills"
    ],
    answer: "His core areas include Python, Java, JavaScript, TypeScript, HTML, CSS, React, Next.js, Node.js, Express, MongoDB, SQL, Git/GitHub, ML, DL and DSA.",
    suggestions: ["⚡ Projects", "💻 GitHub", "🎓 Education"],
  },
  {
    id: "projects",
    title: "Featured Projects",
    keywords: [
      "project", "projects", "built", "build", "portfolio", "operon",
      "mausam", "fitness", "finance", "yolov8", "apps", "software",
      "work", "showcase", "creations"
    ],
    phrases: [
      "what has he built",
      "show me his projects",
      "what projects has he built",
      "tell me about his projects",
      "show projects",
      "featured projects"
    ],
    answer: "Featured work includes Fitness OS Pro, Finance OS Pro, OPERON, MAUSAM, an interactive portfolio and a YOLOv8 Edge Computer Vision motion-tracking project.",
    action: {
      type: "github",
      label: "Open GitHub",
      url: PROFILE_LINKS.github,
      handle: "codesbysayam",
    },
    suggestions: ["💻 GitHub", "🛠 Skills", "🏆 Achievements"],
  },
  {
    id: "achievements",
    title: "Achievements & Competitions",
    keywords: [
      "achievement", "achievements", "award", "awards", "competition",
      "competitions", "toycathon", "toycaton", "technex", "finalist",
      "hackathon", "wins", "recognition"
    ],
    phrases: [
      "what has he achieved",
      "tell me his achievements",
      "what are his achievements",
      "tell me about toycathon",
      "what happened at technex",
      "tell me about technex",
      "has he won any competitions"
    ],
    answer: "Highlights include reaching the Top 15/finals of Toycathon 2021 and becoming a finalist in 5 of 6 competitions at Technex'26, IIT BHU.",
    suggestions: ["⚡ Projects", "🎓 Education", "📩 Contact"],
  },
  {
    id: "coding",
    title: "Coding & Problem Solving",
    keywords: [
      "leetcode", "dsa", "coding", "codolio", "competitive",
      "data structures", "algorithms", "problem solving", "profile"
    ],
    phrases: [
      "where can i see his coding profile",
      "where can i find his leetcode",
      "what is his coding profile",
      "does he do competitive programming",
      "tell me about his coding"
    ],
    answer: "Sayam is actively developing his DSA and coding skills. His latest coding activity can be viewed through his LeetCode and Codolio profiles.",
    action: {
      type: "leetcode",
      label: "View LeetCode",
      url: PROFILE_LINKS.leetcode,
      handle: "codesbysayam",
    },
    suggestions: ["LeetCode", "Codolio", "💻 GitHub"],
  },
  {
    id: "github",
    title: "GitHub & Open Source",
    keywords: [
      "github", "repo", "repos", "repository", "repositories",
      "source", "code", "git", "commits"
    ],
    phrases: [
      "show me his github",
      "where is his github",
      "open github",
      "what is his github",
      "github profile"
    ],
    answer: "You can explore Sayam's public repositories, source code and project work on GitHub.",
    action: {
      type: "github",
      label: "Open GitHub",
      url: PROFILE_LINKS.github,
      handle: "codesbysayam",
    },
    suggestions: ["⚡ Projects", "LeetCode", "Codolio"],
  },
  {
    id: "leetcode_profile",
    title: "LeetCode Profile",
    keywords: ["leetcode", "leetcode profile", "leetcode account", "leetcode handle"],
    phrases: [
      "show me his leetcode",
      "where can i find his leetcode",
      "what is his leetcode",
      "leetcode link"
    ],
    answer: "Sayam solves algorithmic challenges on LeetCode to continuously sharpen his data structures and problem-solving abilities.",
    action: {
      type: "leetcode",
      label: "View LeetCode",
      url: PROFILE_LINKS.leetcode,
      handle: "codesbysayam",
    },
    suggestions: ["Codolio", "💻 GitHub", "⚡ Projects"],
  },
  {
    id: "codolio_profile",
    title: "Codolio Profile",
    keywords: ["codolio", "codolio profile", "codolio account", "codolio handle"],
    phrases: [
      "what is codolio",
      "show me his codolio",
      "where can i see his codolio",
      "codolio link"
    ],
    answer: "Sayam's Codolio profile brings together his coding platform and developer activity in one unified hub.",
    action: {
      type: "codolio",
      label: "View Codolio",
      url: PROFILE_LINKS.codolio,
      handle: "codesbysayam",
    },
    suggestions: ["LeetCode", "💻 GitHub", "🛠 Skills"],
  },
  {
    id: "linkedin",
    title: "LinkedIn Profile",
    keywords: ["linkedin", "network", "connect", "social", "professional"],
    phrases: [
      "what is his linkedin",
      "show me his linkedin",
      "connect on linkedin",
      "linkedin profile"
    ],
    answer: "You can connect with Sayam on LinkedIn for professional networking, career updates and collaborations.",
    action: {
      type: "linkedin",
      label: "Open LinkedIn",
      url: PROFILE_LINKS.linkedin,
      handle: "sayam-mukherjee",
    },
    suggestions: ["📩 Contact", "💻 GitHub", "⚡ Projects"],
  },
  {
    id: "contact",
    title: "Contact & Collaboration",
    keywords: [
      "contact", "email", "hire", "freelance", "internship", "internships",
      "collaboration", "work", "available", "reach", "touch", "call", "message", "opportunity"
    ],
    phrases: [
      "how can i contact him",
      "can i contact him",
      "can i hire him",
      "is he open to internships",
      "is he available for internships",
      "how to reach him",
      "get in touch"
    ],
    answer: "Sayam is open to internships, collaborations and freelance opportunities. Use the Contact section to reach him.",
    action: {
      type: "contact",
      label: "Go to Contact Section",
      url: "#contact",
      handle: "sayam.business@gmail.com",
    },
    suggestions: ["LinkedIn", "💻 GitHub", "⚡ Projects"],
  },
  {
    id: "content",
    title: "Content Creation",
    keywords: [
      "youtube", "content", "creator", "channel", "technical az",
      "daily decipher", "video", "videos"
    ],
    phrases: [
      "tell me about youtube",
      "is he a content creator",
      "what youtube channels",
      "tell me about content creation"
    ],
    answer: "Sayam has worked as a content creator through his channels Technical AZ and Daily Decipher.",
    action: {
      type: "youtube",
      label: "Technical AZ YouTube",
      url: PROFILE_LINKS.youtubeTechnicalAZ,
      handle: "@technicalaz",
    },
    suggestions: ["About", "🏆 Achievements", "📩 Contact"],
  },
  {
    id: "sports",
    title: "Sports & Table Tennis",
    keywords: [
      "table tennis", "sports", "district", "ping pong", "tt",
      "athletic", "tabletennis"
    ],
    phrases: [
      "tell me about table tennis",
      "tell me about his table tennis",
      "does he play sports",
      "what sports does he play"
    ],
    answer: "Sayam has a long-term interest in table tennis and has represented his district at the district level.",
    suggestions: ["🏆 Achievements", "About"],
  },
  {
    id: "goals",
    title: "Future Goals & Aspirations",
    keywords: [
      "goal", "goals", "future", "career", "ambition", "roadmap",
      "vision", "aspire", "future plans", "aspirations"
    ],
    phrases: [
      "what are his future goals",
      "what are his goals",
      "what is his ambition",
      "future plans",
      "what does he want to do"
    ],
    answer: "His goal is to grow as a Software Engineer and AI Engineer, build high-impact products/startups and contribute to open source.",
    suggestions: ["🛠 Skills", "⚡ Projects", "📩 Contact"],
  },
];
