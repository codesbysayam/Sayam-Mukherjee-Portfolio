
export interface AchievementItem {
  id: string;
  title: string;
  date: string;
  organization: string;
  description: string;
  category: string;
  iconName: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  views: string;
  duration: string;
  watchUrl: string;
}

export interface FreelanceService {
  id: string;
  title: string;
  price: string;
  timeline: string;
  features: string[];
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  content: string;
  type: 'Client' | 'Teacher' | 'Mentor';
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  likes: number;
  comments: any[];
  coverUrl: string;
  contentParagraphs?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  logo: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  status: 'Active' | 'Future';
  skillsLearned: string[];
}

export interface ExtendedProject {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  longDescription?: string;
  problemStatement?: string;
  objectives?: string[];
  database?: string;
  techStack?: string[];
  metrics?: any[];
  features?: string[];
  architecture?: string[];
  challenges?: string[];
  solutions?: string[];
  lessonsLearned?: string[];
  futureImprovements?: string[];
  timeline?: any[];
  status?: string;
  duration?: string;
  tags: string[];
  category: string;
  imageUrl: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  stats?: {
    stars?: number;
    forks?: number;
    commits?: number;
  };
}


export const EXTENDED_DATA = {
  experience: [
    {
      type: 'Freelancing',
      role: 'Freelancer',
      company: 'Self-Employed',
      period: '2023 - Present',
      description: ['Built various projects and helped clients solve their problems.'],
      skills: ['React', 'Node.js']
    },
    {
      type: 'Content Creation',
      role: 'Content Creator',
      company: 'YouTube',
      period: '2023 - Present',
      description: ['Shared technical knowledge on YouTube.'],
      skills: ['Video Editing', 'Content Strategy']
    },
    {
      type: 'Volunteer',
      role: 'Volunteer',
      company: 'Labs',
      period: '2024',
      description: ['Volunteered at college labs.'],
      skills: ['Leadership']
    },
    {
      type: 'Open Source',
      role: 'Contributor',
      company: 'Open Source',
      period: '2023 - Present',
      description: ['Contributed to multiple open-source repositories.'],
      skills: ['Git', 'Collaboration']
    }
  ] as any[],
    certifications: [
    {
      id: "cert-1",
      name: 'Machine Learning Specialization',
      logo: 'Brain',
      issuer: 'DeepLearning.AI',
      date: 'Dec 2024',
      status: 'Active',
      skillsLearned: ['Python', 'PyTorch']
    },
    {
      id: "cert-2",
      name: 'Google Cloud Certified',
      logo: 'Cloud',
      issuer: 'Google',
      date: 'Feb 2025',
      status: 'Future',
      skillsLearned: ['Cloud Compute', 'GCP']
    }
  ] as CertificationItem[],
  projects: [
    {
      id: "proj-1",
      title: "Obsidian Optics",
      description: "YOLOv8 tracking on edge devices.",
      tags: ["Python", "YOLOv8", "OpenCV"],
      category: "AI",
      imageUrl: "https://picsum.photos/seed/proj1/400/300",
      featured: true
    }
  ] as ExtendedProject[],
  achievements: [
    {
      id: 'ach-table-tennis',
      title: '1st Position – Inter-school Table Tennis (3x)',
      date: 'Multiple',
      organization: 'Inter-school Tournaments',
      description: 'Secured 1st position across three separate table tennis championships.',
      category: 'Sports',
      iconName: 'TrendingUp'
    },
    {
      id: 'ach-toycathon',
      title: 'Finalist – Toycathon',
      date: 'Past',
      organization: 'Government of India',
      description: 'Reached the finals of the national Toycathon competition organized by the Government of India.',
      category: 'Hackathons',
      iconName: 'Code'
    },
    {
      id: 'ach-certs',
      title: 'Professional Certifications',
      date: 'Ongoing',
      organization: 'Microsoft, Coursera, Udemy',
      description: 'Completed various industry-recognized certifications across Microsoft, Coursera, and Udemy platforms.',
      category: 'Academics',
      iconName: 'Award'
    }
  ] as AchievementItem[],
  youtubeVideos: [
    {
      id: 'video-1',
      title: 'How I Built a Real-Time Perimetric AI Alert System',
      thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400',
      views: '12K',
      duration: '14:25',
      watchUrl: 'https://youtube.com/sayam-mukherjee-placeholder'
    },
    {
      id: 'video-2',
      title: 'Financial NLP Sentiment Models with Python & FinBERT',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400',
      views: '8.4K',
      duration: '18:10',
      watchUrl: 'https://youtube.com/sayam-mukherjee-placeholder'
    }
  ] as YouTubeVideo[],
  freelanceServices: [
    {
      id: 'service-thumbnail',
      title: 'Click-Driven YouTube Thumbnail Design',
      price: '$25 / Asset',
      timeline: '24-48 Hours',
      features: [
        'Advanced Visual Psychology & Focal Contrast framing',
        'High-Resolution 4K exports',
        '3 Revisions with direct audience analytics adjustments',
        'Perfect typography selection with custom color grading'
      ],
      description: 'Creating premium, high-contrast, clickable graphic templates.'
    }
  ] as FreelanceService[],
  testimonials: [
    {
      id: 'test-1',
      name: 'Rohan Sharma',
      role: 'Lead Visual Strategist',
      organization: 'TechVibe Media',
      content: "Sayam transformed our visual assets. His execution speed and grasp of design clarity are exceptional.",
      type: 'Client'
    }
  ] as TestimonialItem[],
  blogArticles: [] as BlogArticle[]
};
