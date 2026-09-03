export interface ProfileRoutine {
  coding: {
    title: string;
    value: string;
    description: string;
  };
  study: {
    title: string;
    value: string;
    description: string;
  };
  fitness: {
    title: string;
    value: string;
    description: string;
  };
}

export interface ProfileData {
  name: string;
  title: string;
  university: string;
  degree: string;
  specialization: string;
  semester: string;
  cgpa: string;
  location: string;
  bio: string;
  routine: ProfileRoutine;
  socials: {
    github: string;
    leetcode: string;
    codolio: string;
    linkedin: string;
    youtube: string;
    instagram: string;
    instagramSecondary: string;
    email: string;
  };
}

export const PROFILE_DATA: ProfileData = {
  name: "Sayam Mukherjee",
  title: "AI & ML Student & Full Stack Developer",
  university: "Kalinga Institute of Industrial Technology, Bhubaneswar",
  degree: "B.Tech in Computer Science & Engineering",
  specialization: "Artificial Intelligence & Machine Learning",
  semester: "2nd Year Undergraduate",
  cgpa: "2nd Year Undergraduate",
  location: "Bhubaneswar, Odisha (Hometown: Hooghly, West Bengal)",
  bio: "2nd Year Computer Science Engineering student at Kalinga Institute of Industrial Technology, Bhubaneswar. Focused on building real-world software, exploring computer vision and algorithmic foundations, and writing clean, scalable systems.",
  routine: {
    coding: {
      title: "CODING",
      value: "1 hr / day",
      description: "Consistent problem solving, web engineering, and architecture practice."
    },
    study: {
      title: "STUDY",
      value: "5–7 hrs weekdays, 8–9 hrs weekends",
      description: "Core computer science subjects, mathematics, and technical foundations."
    },
    fitness: {
      title: "FITNESS",
      value: "5 sessions / week",
      description: "Structured gym workouts, athletic conditioning, and discipline."
    }
  },
  socials: {
    github: "https://github.com/codesbysayam",
    leetcode: "https://leetcode.com/u/codesbysayam/",
    codolio: "https://codolio.com/profile/codesbysayam",
    linkedin: "https://www.linkedin.com/in/sayam-mukherjee-b96209324/",
    youtube: "https://www.youtube.com/@ObsidianOptics_in",
    instagram: "https://www.instagram.com/_.wrick._/",
    instagramSecondary: "https://www.instagram.com/obsidianoptics.in/",
    email: "wrickbusiness@gmail.com"
  }
};

export const VERIFIED_DAILY_ROUTINE = {
  coding: "1 hour / day",
  studyWeekdays: "5–7 hours",
  studyWeekends: "8–9 hours",
  gym: "5 days / week",
  gymDetails: "Structured gym workouts, strength training, and conditioning"
};

