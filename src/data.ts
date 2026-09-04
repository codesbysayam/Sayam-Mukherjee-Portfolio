export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  category: 'ai_ml' | 'full_stack' | 'design_media' | 'finance';
  demoUrl?: string;
  githubUrl?: string;
  imageUrl: string;
  featured: boolean;
  metrics?: { label: string; value: string }[];
}

export interface SkillGroup {
  category: string;
  skills: { name: string; level: number; icon: string }[];
}

export interface LearningItem {
  name: string;
  progress: number;
  status: 'Learning' | 'Reviewing' | 'Completed';
  resource: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string[];
  skills: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl?: string;
  image?: string;
}

export const SAYAM_DATA = {
  name: 'Sayam Mukherjee',
  title: 'AI & ML Student & Full Stack Developer',
  taglines: [
    'Building Technology That Matters.',
    'Learning. Building. Growing.',
    'Turning Ideas Into Intelligent Solutions.',
    'Engineering Tomorrow.',
    'Learning One Project At A Time.',
    'Curiosity Powered Development.',
    'Building Beyond Code.',
    'Software With Purpose.'
  ],
  bio: 'I am a 2nd Year (3rd Semester) Computer Science Engineering student at Kalinga Institute of Industrial Technology, Bhubaneswar (hometown: Hooghly, West Bengal), passionate about building scalable software, intelligent systems, and meaningful digital experiences. I enjoy transforming ideas into real-world products through continuous learning, disciplined execution, and creative problem-solving.',
  stats: {
    cgpa: '2nd Year (3rd Semester)',
    university: 'Kalinga Institute of Industrial Technology, Bhubaneswar',
    semester: '2nd Year, 3rd Semester',
    location: 'Bhubaneswar, Odisha (Hometown: Hooghly, West Bengal)',
    focus: ['C++', 'DSA', 'Computer Vision', 'Full Stack'],
    githubCommits: 'Live GitHub Activity',
    codingStreak: 'Active Routine',
    projectsCompleted: '7 Verified Projects',
    happyClients: '10'
  },
  socials: {
    linkedin: 'https://www.linkedin.com/in/sayam-mukherjee-b96209324/',
    github: 'https://github.com/codesbysayam',
    instagram: 'https://www.instagram.com/_.wrick._/',
    instagramSecondary: 'https://www.instagram.com/obsidianoptics.in/',
    youtube: 'https://www.youtube.com/@ObsidianOptics_in',
    fiverr: 'https://www.fiverr.com/',
    email: 'wrickbusiness@gmail.com'
  },
  projects: [
    {
      id: 'private-enterprise',
      title: 'Private Enterprise Project',
      description: 'Currently building an exclusive private project on GitHub.',
      longDescription: 'This project is actively under development and hosted in a private repository. Due to confidentiality and ongoing development, the source code and details are currently restricted.',
      tags: ['Python', 'JavaScript', 'Django', 'Kotlin'],
      category: 'full_stack',
      imageUrl: 'https://picsum.photos/seed/private/800/450',
      featured: true
    }
  ] as Project[],
  skills: [
    {
      category: 'Technical Skills',
      skills: [
        { name: 'C', level: 90, icon: 'Code' },
        { name: 'C++', level: 85, icon: 'Terminal' },
        { name: 'Python', level: 80, icon: 'Terminal' },
        { name: 'JavaScript', level: 85, icon: 'Code' },
        { name: 'Kotlin', level: 75, icon: 'Layers' },
        { name: 'Django', level: 70, icon: 'Server' }
      ]
    },
    {
      category: 'Soft Skills',
      skills: [
        { name: 'Communication', level: 95, icon: 'Users' },
        { name: 'Teamwork', level: 90, icon: 'Users' },
        { name: 'Problem Solving', level: 85, icon: 'Brain' },
        { name: 'Time Management', level: 80, icon: 'Clock' },
        { name: 'Adaptability', level: 90, icon: 'Layers' }
      ]
    }
  ] as SkillGroup[],
  learningDashboard: {
    currentFocus: 'Operating Systems, Computer Architecture, Mathematics for CS, C++ DSA, and Computer Vision.',
    books: [
      { title: 'Operating Systems: Three Easy Pieces', author: 'Remzi H. Arpaci-Dusseau', progress: 50 },
      { title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest, Stein', progress: 40 }
    ],
    items: [
      { name: 'Core Foundations: Operating Systems & Architecture', progress: 65, status: 'Learning', resource: 'University Curriculum' },
      { name: 'Programming & DSA: Learning C++ & Foundations', progress: 50, status: 'Learning', resource: 'LeetCode & Problem Sets' },
      { name: 'AI & Vision: Exploring OpenCV & YOLOv8', progress: 55, status: 'Learning', resource: 'Computer Vision Exploration' },
      { name: 'Web Architecture: TypeScript & Next.js/React', progress: 70, status: 'Active', resource: 'Production Deployments' }
    ] as LearningItem[],
    leetcode: {
      solved: 0,
      target: 100,
      easy: 0,
      medium: 0,
      hard: 0
    }
  },
  experience: [
    {
      role: 'Intership at Tata Consultancy Services (TCS)',
      company: 'Tata Consultancy Services (TCS)',
      period: 'Duration: 2 Months',
      description: [
        'Gained exposure to industry-level problem-solving approaches',
        'Developed understanding of professional workflows and team collaboration'
      ],
      skills: ['Industry Experience', 'Workflow Management', 'Problem Solving', 'Team Collaboration']
    }
  ] as ExperienceItem[],
  certifications: [
    {
      name: 'Microsoft Industry Engagement and Technology Exposure Program',
      issuer: 'Microsoft',
      date: 'N/A',
      verificationUrl: '#',
      image: 'https://picsum.photos/seed/cert-ms/100/100'
    },
    {
      name: 'Various Certifications',
      issuer: 'Coursera, Udemy',
      date: 'N/A',
      verificationUrl: '#',
      image: 'https://picsum.photos/seed/cert-misc/100/100'
    }
  ] as Certification[],
  achievements: [
    'B.Tech CSE (AI & ML) – Kalinga Institute of Industrial Technology, Bhubaneswar',
    '1st Position – Inter-school Table Tennis (3x)',
    'Finalist – Toycathon (Government of India)',
    'Aagaz 2.0 – Physics Wallah Workshop',
    'TED Talk Attendance – Benedetto Vigna (CEO of Ferrari)'
  ],
  blogs: [] as Blog[],
  services: []
};
