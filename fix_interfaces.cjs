const fs = require('fs');
let content = fs.readFileSync('src/data/extendedData.ts', 'utf8');

content = content.replace(/export interface CertificationItem \{[\s\S]*?\}/, `export interface CertificationItem {
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
}`);

content = content.replace(/export interface ExtendedProject \{[\s\S]*?\}/, `export interface ExtendedProject {
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
  architecture?: string;
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
}`);

fs.writeFileSync('src/data/extendedData.ts', content, 'utf8');
