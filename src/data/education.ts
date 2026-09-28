export interface EducationRecord {
  id: string;
  category: "ACADEMICS";
  session: string;
  title: string;
  institution: string;
  board: string;
  percentage: string;
  stream?: string;
  subjects: string[];
  description: string;
  documentAvailable: boolean;
}

export const schoolEducation: EducationRecord[] = [
  {
    id: "cbse-class-12",
    category: "ACADEMICS",
    session: "2024–2025",
    title: "CBSE Class 12 Board Examination",
    institution: "Central Board of Secondary Education",
    board: "CBSE",
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
      "Completed the CBSE Class 12 Board Examination with an overall score of 86.2% in the Science stream.",
    documentAvailable: false,
  },

  {
    id: "cbse-class-10",
    category: "ACADEMICS",
    session: "2022–2023",
    title: "CBSE Class 10 Board Examination",
    institution: "Central Board of Secondary Education",
    board: "CBSE",
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
      "Completed the CBSE Class 10 Board Examination with an overall score of 92.6%.",
    documentAvailable: false,
  },
];

export interface UniversityEducation {
  id: string;
  category: "ACADEMICS";
  institution: string;
  institutionShort: string;
  degree: string;
  specialization: string;
  expectedGraduation: string;
  cgpa: string;
  cgpaScale: string;
  status: string;
  description: string;
  schoolName: string;
}

export const universityEducation: UniversityEducation = {
  id: "kiit-university",
  category: "ACADEMICS",
  institution: "Kalinga Institute of Industrial Technology (KIIT)",
  institutionShort: "KIIT, Bhubaneswar",
  degree: "B.Tech Computer Science and Engineering",
  specialization: "AI & ML",
  expectedGraduation: "2029",
  cgpa: "9.06",
  cgpaScale: "10.0",
  status: "Undergraduate (2nd Year, 3rd Sem)",
  description: "Core coursework in Data Structures & Algorithms, Object-Oriented Programming, Computer Organization, and Discrete Mathematics.",
  schoolName: "Aditya Birla Vani Bharati",
};

export const schoolInfo = {
  name: "Aditya Birla Vani Bharati",
  affiliation: "Central Board of Secondary Education (CBSE)",
};
