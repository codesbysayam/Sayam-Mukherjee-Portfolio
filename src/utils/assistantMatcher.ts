import {
  KNOWLEDGE_INTENTS,
  CONVERSATIONAL_INTENTS,
  FALLBACK_RESPONSE,
  UNVERIFIED_STAT_RESPONSE,
  KnowledgeIntent,
  IntentAction,
} from "../data/assistantKnowledge";

export interface MatcherResult {
  intentId: string;
  answer: string;
  action?: IntentAction;
  suggestions: string[];
  confidence: number;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "in", "on", "at", "to", "for", "of", "with", "by", "from",
  "up", "about", "into", "over", "after", "is", "are", "was", "were", "be",
  "been", "being", "have", "has", "had", "do", "does", "did", "can", "could",
  "should", "would", "will", "shall", "me", "my", "myself", "we", "our", "ours",
  "you", "your", "yours", "he", "him", "his", "she", "her", "it", "its", "they",
  "them", "their", "what", "which", "who", "whom", "this", "that", "these",
  "those", "am", "tell", "show", "give", "please", "i", "want", "know", "see",
  "find", "any", "some"
]);

/**
 * Normalizes input:
 * 1. lowercases
 * 2. replaces non-alphanumeric punctuation with space
 * 3. collapses consecutive spaces
 * 4. trims edges
 */
export const normalize = (text: string): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Checks for requests asking for exact unverified numbers (followers, stars, counts)
 * to strictly prevent hallucination.
 */
const UNVERIFIED_PATTERNS = [
  "how many stars",
  "github stars",
  "repo stars",
  "how many followers",
  "follower count",
  "subscriber count",
  "how many subscribers",
  "how many leetcode problems",
  "exact problems solved",
  "study hours",
  "how many hours",
  "certification count",
  "cgpa number",
  "exact gpa",
];

export function findIntent(query: string): MatcherResult {
  const normQuery = normalize(query);

  if (!normQuery) {
    return {
      intentId: "fallback",
      answer: FALLBACK_RESPONSE.answer,
      suggestions: FALLBACK_RESPONSE.suggestions,
      confidence: 0,
    };
  }

  // 1. Unverified statistics guard
  for (const pattern of UNVERIFIED_PATTERNS) {
    if (normQuery.includes(pattern)) {
      return {
        intentId: "unverified_stat",
        answer: UNVERIFIED_STAT_RESPONSE.answer,
        suggestions: UNVERIFIED_STAT_RESPONSE.suggestions,
        confidence: 1,
      };
    }
  }

  // 2. Conversational greetings
  for (const pattern of CONVERSATIONAL_INTENTS.greetings.patterns) {
    const normPattern = normalize(pattern);
    if (
      normQuery === normPattern ||
      normQuery.startsWith(normPattern + " ") ||
      normQuery.endsWith(" " + normPattern)
    ) {
      return {
        intentId: "greeting",
        answer: CONVERSATIONAL_INTENTS.greetings.answer,
        suggestions: CONVERSATIONAL_INTENTS.greetings.suggestions,
        confidence: 1,
      };
    }
  }

  // 3. Conversational thanks
  for (const pattern of CONVERSATIONAL_INTENTS.thanks.patterns) {
    const normPattern = normalize(pattern);
    if (normQuery === normPattern || normQuery.includes(normPattern)) {
      return {
        intentId: "thanks",
        answer: CONVERSATIONAL_INTENTS.thanks.answer,
        suggestions: CONVERSATIONAL_INTENTS.thanks.suggestions,
        confidence: 1,
      };
    }
  }

  // 4. Conversational bye
  for (const pattern of CONVERSATIONAL_INTENTS.bye.patterns) {
    const normPattern = normalize(pattern);
    if (normQuery === normPattern || normQuery.includes(normPattern)) {
      return {
        intentId: "bye",
        answer: CONVERSATIONAL_INTENTS.bye.answer,
        suggestions: CONVERSATIONAL_INTENTS.bye.suggestions,
        confidence: 1,
      };
    }
  }

  // 5. Weighted intent scoring
  const queryWords = normQuery.split(" ").filter((w) => w.length > 0);
  const contentWords = queryWords.filter((w) => !STOP_WORDS.has(w) && w.length > 1);

  let bestIntent: KnowledgeIntent | null = null;
  let bestScore = 0;

  for (const intent of KNOWLEDGE_INTENTS) {
    let score = 0;
    let matchedKeywordsCount = 0;

    // Check exact phrases (+5 to +8 points)
    if (intent.phrases && intent.phrases.length > 0) {
      for (const phrase of intent.phrases) {
        const normPhrase = normalize(phrase);
        if (normQuery === normPhrase) {
          score += 8;
        } else if (normQuery.includes(normPhrase)) {
          score += 5.5;
        } else if (normPhrase.includes(normQuery) && normQuery.length > 5) {
          score += 4;
        }
      }
    }

    // Check intent id & title match (+3 to +5 points)
    const normTitle = normalize(intent.title);
    if (normQuery === intent.id || normQuery === normTitle) {
      score += 5;
    } else if (normQuery.includes(intent.id)) {
      score += 3;
    }

    // Keyword scoring (+2 points each, with phrase bonuses)
    for (const keyword of intent.keywords) {
      const normKw = normalize(keyword);
      if (!normKw) continue;

      if (normQuery === normKw) {
        score += 4;
        matchedKeywordsCount++;
      } else if (normKw.includes(" ") && normQuery.includes(normKw)) {
        // Multi-word keyword (e.g. "table tennis", "machine learning")
        score += 3.5;
        matchedKeywordsCount++;
      } else if (queryWords.includes(normKw)) {
        score += 2;
        matchedKeywordsCount++;
      } else if (
        normKw.length >= 4 &&
        contentWords.some((cw) => {
          // Precise stem matching (e.g. project -> projects, skill -> skills, achieve -> achievements)
          return (
            (cw.startsWith(normKw) || normKw.startsWith(cw)) &&
            Math.abs(cw.length - normKw.length) <= 4 &&
            Math.min(cw.length, normKw.length) >= 4
          );
        })
      ) {
        score += 1.5;
        matchedKeywordsCount++;
      }
    }

    // Bonus for multiple distinct matching keywords
    if (matchedKeywordsCount > 1) {
      score += (matchedKeywordsCount - 1) * 1.5;
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  // Require minimum confidence threshold to prevent false positives
  const MIN_CONFIDENCE_THRESHOLD = 2.0;

  if (bestIntent && bestScore >= MIN_CONFIDENCE_THRESHOLD) {
    return {
      intentId: bestIntent.id,
      answer: bestIntent.answer,
      action: bestIntent.action,
      suggestions: bestIntent.suggestions,
      confidence: bestScore,
    };
  }

  // Fallback if no confident match
  return {
    intentId: "fallback",
    answer: FALLBACK_RESPONSE.answer,
    suggestions: FALLBACK_RESPONSE.suggestions,
    confidence: 0,
  };
}
