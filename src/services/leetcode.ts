export interface LeetCodeSubmission {
  title: string;
  titleSlug: string;
  statusDisplay: string;
  lang: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  date?: string;
}

export interface LeetCodeStatsData {
  username: string;
  profileUrl: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number | string;
  acceptanceRate: string;
  recentSubmissions: LeetCodeSubmission[];
  isLive: boolean;
  lastSynced: string;
  error?: string;
}

export const VERIFIED_LEETCODE_FALLBACK: LeetCodeStatsData = {
  username: "codesbysayam",
  profileUrl: "https://leetcode.com/u/codesbysayam/",
  totalSolved: 4,
  easySolved: 1,
  mediumSolved: 2,
  hardSolved: 1,
  ranking: "5,000,000+",
  acceptanceRate: "100%",
  recentSubmissions: [
    {
      title: "Department Top Three Salaries",
      titleSlug: "department-top-three-salaries",
      statusDisplay: "Accepted",
      lang: "mysql",
      difficulty: "Hard"
    },
    {
      title: "Generate Parentheses",
      titleSlug: "generate-parentheses",
      statusDisplay: "Accepted",
      lang: "cpp",
      difficulty: "Medium"
    },
    {
      title: "Check if Object Instance of Class",
      titleSlug: "check-if-object-instance-of-class",
      statusDisplay: "Accepted",
      lang: "javascript",
      difficulty: "Medium"
    },
    {
      title: "Array Prototype Last",
      titleSlug: "array-prototype-last",
      statusDisplay: "Accepted",
      lang: "javascript",
      difficulty: "Easy"
    }
  ],
  isLive: false,
  lastSynced: "Just now"
};

export async function fetchLeetCodeStats(): Promise<LeetCodeStatsData> {
  try {
    const res = await fetch("/api/leetcode/profile");
    if (!res.ok) {
      throw new Error(`LeetCode proxy returned ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn("Using verified LeetCode baseline:", err.message);
    return {
      ...VERIFIED_LEETCODE_FALLBACK,
      error: err.message || "Live statistics unavailable"
    };
  }
}
