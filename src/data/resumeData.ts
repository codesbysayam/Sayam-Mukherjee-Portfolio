import resumeDataJson from "./resumeData.json";

export interface ResumeHighlight {
  label: string;
  value: string;
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  period: string;
  metricLabel: string;
  metricValue: string;
  status: string;
}

export interface ResumeExperience {
  role: string;
  organization: string;
  period: string;
  bullets: string[];
  technologies: string[];
}

export interface ResumeProject {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  role: string;
  description: string;
  technologies: string[];
  sourceUrl?: string;
  demoUrl?: string;
}

export interface ResumeSkillMap {
  programmingLanguages: string[];
  webTechnologies: string[];
  databases: string[];
  aiAndMachineLearning: string[];
  developerTools: string[];
  csFundamentals: string[];
  softSkills: string[];
}

export interface ResumeAchievement {
  id: string;
  title: string;
  issuer: string;
  role: string;
  date: string;
  badge: string;
  description: string;
  credentialUrl?: string;
}

export interface ResumeProfile {
  name: string;
  headline: string;
  contact: {
    location: string;
    email: string;
    phone: string;
    linkedin: { display: string; url: string };
    github: { display: string; url: string };
    portfolio: { display: string; url: string };
  };
  summary: string;
  highlights: ResumeHighlight[];
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: ResumeSkillMap;
  certificationsAndAchievements: ResumeAchievement[];
  hobbies: string[];
  authoritativeUrl: string;
  lastVerified: string;
}

export const RESUME_DATA: ResumeProfile = resumeDataJson as ResumeProfile;
export default RESUME_DATA;
