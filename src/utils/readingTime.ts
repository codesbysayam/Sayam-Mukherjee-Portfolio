import { JournalEntry, JournalSection } from "../data/journal";

/**
 * Standard adult reading speed:
 * Cognitive science and publishing standards (e.g. Medium, Nielsen Norman Group)
 * place average non-fiction and technical reading speed at 200 - 250 words per minute.
 * We use 200 WPM as the standard baseline for technical essays and engineering notes.
 */
export const STANDARD_READING_SPEED_WPM = 200;

export interface ReadingTimeResult {
  minutes: number;
  words: number;
  formatted: string;
  wpm: number;
}

/**
 * Clean and extract plain text from input to count actual words accurately.
 */
function extractWords(text: string): string[] {
  if (!text) return [];
  const clean = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[#*_~>]/g, " ")
    .trim();

  return clean.split(/\s+/).filter((word) => word.length > 0);
}

/**
 * Calculate the estimated reading time for any content based on standard reading speed.
 */
export function calculateReadingTime(
  content: string | JournalSection[] | JournalEntry | { title?: string; summary?: string; content?: any },
  wpm: number = STANDARD_READING_SPEED_WPM
): ReadingTimeResult {
  const wordsList: string[] = [];

  if (typeof content === "string") {
    wordsList.push(...extractWords(content));
  } else if (Array.isArray(content)) {
    for (const section of content) {
      if (section.heading) {
        wordsList.push(...extractWords(section.heading));
      }
      if (Array.isArray(section.paragraphs)) {
        for (const p of section.paragraphs) {
          wordsList.push(...extractWords(p));
        }
      }
    }
  } else if (content && typeof content === "object") {
    const obj = content as Record<string, any>;
    const stringFields = [
      "title",
      "summary",
      "shortDescription",
      "longDescription",
      "problem",
      "solution",
      "whyItExists",
      "whatIBuilt",
      "implementation",
      "resultsAndStatus",
      "verificationNote",
    ];
    for (const field of stringFields) {
      if (typeof obj[field] === "string") {
        wordsList.push(...extractWords(obj[field]));
      }
    }

    const arrayFields = ["highlights", "architecture", "engineeringDecisions", "verifiedFacts"];
    for (const field of arrayFields) {
      if (Array.isArray(obj[field])) {
        for (const item of obj[field]) {
          if (typeof item === "string") wordsList.push(...extractWords(item));
        }
      }
    }

    if (Array.isArray(obj.content)) {
      for (const section of obj.content) {
        if (section.heading) {
          wordsList.push(...extractWords(section.heading));
        }
        if (Array.isArray(section.paragraphs)) {
          for (const p of section.paragraphs) {
            wordsList.push(...extractWords(p));
          }
        }
      }
    } else if (typeof obj.content === "string") {
      wordsList.push(...extractWords(obj.content));
    }
  }

  const totalWords = wordsList.length;
  const calculatedMinutes = Math.max(1, Math.ceil(totalWords / wpm));

  return {
    minutes: calculatedMinutes,
    words: totalWords,
    formatted: `${calculatedMinutes} min read`,
    wpm,
  };
}

/**
 * Convenience helper to format reading time directly
 */
export function getEstimatedReadingTime(
  entry: JournalEntry | { title?: string; summary?: string; content?: any },
  wpm: number = STANDARD_READING_SPEED_WPM
): string {
  return calculateReadingTime(entry, wpm).formatted;
}
