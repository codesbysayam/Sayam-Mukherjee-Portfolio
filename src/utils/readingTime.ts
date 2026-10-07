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
  // Strip Markdown links, inline code accents, and punctuation, preserving words
  const clean = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // markdown links -> label
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/[#*_~>]/g, " ") // formatting symbols
    .trim();

  return clean.split(/\s+/).filter((word) => word.length > 0);
}

/**
 * Calculate the estimated reading time for any content based on standard reading speed.
 * @param content Text string, array of JournalSections, or full JournalEntry
 * @param wpm Reading speed in words per minute (defaults to 200)
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
    if (content.title) {
      wordsList.push(...extractWords(content.title));
    }
    if (content.summary) {
      wordsList.push(...extractWords(content.summary));
    }
    if (Array.isArray(content.content)) {
      for (const section of content.content) {
        if (section.heading) {
          wordsList.push(...extractWords(section.heading));
        }
        if (Array.isArray(section.paragraphs)) {
          for (const p of section.paragraphs) {
            wordsList.push(...extractWords(p));
          }
        }
      }
    } else if (typeof content.content === "string") {
      wordsList.push(...extractWords(content.content));
    }
  }

  const totalWords = wordsList.length;
  // Standard reading time formula: Math.ceil(totalWords / wpm) with a minimum of 1 minute
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
