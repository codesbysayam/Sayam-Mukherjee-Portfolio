import { RESUME_URL } from './config/resume.ts';

export { RESUME_URL };

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
    cgpa: '9.06',
    university: 'Kalinga Institute of Industrial Technology, Bhubaneswar',
    semester: '2nd Year, 3rd Semester',
    location: 'Bhubaneswar, Odisha (Hometown: Hooghly, West Bengal)',
    focus: ['C++', 'DSA', 'Computer Vision', 'Full Stack'],
    githubCommits: 'Live GitHub Activity',
    codingStreak: 'Active Routine',
    projectsCompleted: '8 Verified Projects'
  },
  socials: {
    linkedin: 'https://www.linkedin.com/in/sayammukherjee-portfolio/',
    github: 'https://github.com/codesbysayam',
    instagram: 'https://www.instagram.com/_.wrick._/',
    youtube: 'https://www.youtube.com/@ObsidianOptics_in',
    fiverr: 'https://www.fiverr.com/',
    email: 'wrickbusiness@gmail.com',
    resume: RESUME_URL
  },
  projects: [
    {
      id: 'operon',
      title: 'OPERON',
      description: 'Multi-agent operations engine across Support, Finance, HR & Ops with human-in-the-loop approval gates.',
      longDescription: 'Built for Deploy or Die with Team NEXUS, enforcing deterministic HITL approval state transitions across autonomous agent workflows.',
      tags: ['TypeScript', 'React', 'Node.js', 'Express', 'Multi-Agent AI'],
      category: 'ai_ml',
      githubUrl: 'https://github.com/codesbysayam/Operon',
      demoUrl: 'https://operonpro.vercel.app',
      imageUrl: '',
      featured: true
    },
    {
      id: 'mausam',
      title: 'MAUSAM',
      description: 'SIH 2026 platform unifying Doppler nowcasting, SACHET/NDMA alerts, NAQI, INCOIS marine state & Ask MAUSAM.',
      longDescription: 'Active repository verified at codesbysayam/mausam_sih-26 alongside earlier SIH baseline codesbysayam/mausam_sample.',
      tags: ['TypeScript', 'React', 'Python', 'Tailwind CSS', 'PLpgSQL'],
      category: 'full_stack',
      githubUrl: 'https://github.com/codesbysayam/mausam_sih-26',
      demoUrl: 'https://mausamgovt.vercel.app',
      imageUrl: '',
      featured: true
    },
    {
      id: 'sightforge',
      title: 'SIGHTFORGE',
      description: 'Dual-service Next.js 15 / React 19 Canvas client + FastAPI YOLOv8 COCO-0, 17-keypoint pose, ByteTrack & PostgreSQL pipeline.',
      longDescription: 'Local/self-hosted dual-service computer vision workbench using atomic CVFrame replacement without a public cloud live URL.',
      tags: ['Next.js 15', 'React 19', 'FastAPI', 'YOLOv8', 'ByteTrack', 'PostgreSQL'],
      category: 'ai_ml',
      githubUrl: 'https://github.com/codesbysayam/SightForge',
      imageUrl: '',
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
      solved: 4,
      target: 100,
      easy: 1,
      medium: 2,
      hard: 1
    }
  },
  experience: [
    {
      role: 'Independent Software Projects',
      company: 'Self-Directed / Vercel & Contests',
      period: '2025 – Present',
      description: [
        'Engineered 8 verified public repositories across TypeScript, React, Next.js 15, FastAPI, Node.js, YOLOv8, and C++.',
        'Collaborated with teammates across 5 hackathons and contests in 2026 to deliver working full-stack and AI systems.'
      ],
      skills: ['TypeScript', 'React', 'Next.js 15', 'FastAPI', 'Node.js', 'YOLOv8', 'ByteTrack', 'Hackathons']
    }
  ] as ExperienceItem[],
  certifications: [] as Certification[],
  achievements: [
    'B.Tech CSE (AI & ML) – Kalinga Institute of Industrial Technology, Bhubaneswar | First-Year CGPA: 9.06/10',
    'WCC Launchpad 30 – Team Leader of ALGNITE in a 36-hour hackathon (Oct 2026)',
    'DataForge 2026, IIT Kharagpur – Led Memory in Motion submission to the Pathway Track (Sep 2026)',
    'Technex\'26, IIT (BHU) Varanasi – Advanced to the finals in 5 of 6 competitions (Mar 2026)',
    'Toycathon 2021 – Placed among top 15 national finalists (Jan 2021)',
    'MATLAB Workshop – Institute of Electrical and Electronics Engineers (IEEE) KIIT (Sep 2026)'
  ],
  blogs: [] as Blog[],
  services: []
};
