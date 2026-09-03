const fs = require('fs');

let content = fs.readFileSync('src/data/extendedData.ts', 'utf8');

const interfaces = `
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
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  status: 'Active' | 'Future';
  skills: string[];
}

export interface ExtendedProject {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  category: string;
  imageUrl: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  stats?: {
    stars?: number;
    forks?: number;
    commits?: number;
  };
}
`;

content = content.replace("import { AchievementItem, YouTubeVideo, FreelanceService, TestimonialItem, BlogArticle } from '../types';", interfaces);

// Now I also need to add certifications and projects arrays back to EXTENDED_DATA if they were missing.
const certs = `  certifications: [
    {
      id: "cert-1",
      title: 'Machine Learning Specialization',
      issuer: 'DeepLearning.AI',
      issueDate: 'Dec 2024',
      status: 'Active',
      skills: ['Python', 'PyTorch']
    },
    {
      id: "cert-2",
      title: 'Google Cloud Certified',
      issuer: 'Google',
      issueDate: 'Feb 2025',
      status: 'Future',
      skills: ['Cloud Compute', 'GCP']
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
  ] as ExtendedProject[],`;

content = content.replace(/achievements: \[/, certs + '\n  achievements: [');

fs.writeFileSync('src/data/extendedData.ts', content, 'utf8');
