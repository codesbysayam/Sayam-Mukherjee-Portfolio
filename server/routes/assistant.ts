import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { portfolioKnowledge } from "../../src/data/portfolioKnowledge.ts";
import { ASSISTANT_SYSTEM_INSTRUCTION } from "../../src/lib/assistant/systemInstruction.ts";
import { generatePortfolioAnswer } from "../../src/utils/portfolioAssistantEngine.ts";

// Helper to determine if an API key is a valid Google Generative Language key
// Keys starting with "AQ." are currently rejected with 401 ACCESS_TOKEN_TYPE_UNSUPPORTED
// by generativelanguage.googleapis.com
function isValidGeminiApiKey(key: string | undefined): boolean {
  if (!key) return false;
  return key.startsWith("AIza");
}

// Lazy-initialized Gemini client instance
let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!isValidGeminiApiKey(apiKey)) return null;

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper to safely load live GitHub cache if present
function getLiveGitHubSummary(): any {
  try {
    const paths = [
      path.join(process.cwd(), "public", "data", "github.json"),
      path.join(process.cwd(), "public", "github-data.json"),
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, "utf8");
        const parsed = JSON.parse(raw);
        if (parsed?.profile) {
          return {
            username: parsed.profile.login || "codesbysayam",
            publicRepos: parsed.profile.public_repos || 9,
            followers: parsed.profile.followers || 0,
            following: parsed.profile.following || 0,
            totalStars: parsed.stats?.totalStars || 2,
            totalForks: parsed.stats?.totalForks || 0,
            repositories: Array.isArray(parsed.repositories)
              ? parsed.repositories.slice(0, 10).map((r: any) => ({
                  name: r.name,
                  description: r.description,
                  language: r.language,
                  stars: r.stargazers_count,
                  forks: r.forks_count,
                  url: r.html_url,
                  updatedAt: r.updated_at,
                }))
              : [],
            syncedAt: parsed.syncedAt,
          };
        }
      }
    }
  } catch {
    // Silently continue
  }
  return null;
}

/**
 * Authoritative deterministic answer generator grounded strictly in Sayam Mukherjee's
 * verified portfolio data. Handles all specific queries and multilingual requests seamlessly.
 */
export function generateDeterministicAnswer(query: string): string {
  const liveStats = getLiveGitHubSummary();
  return generatePortfolioAnswer(query, liveStats);
}

/**
 * Express Route Handler: POST /api/assistant
 * Handles both SSE streaming and standard JSON responses.
 * Uses Google Gemini when a valid API key is present; seamlessly falls back
 * to the verified portfolio knowledge generator on network, quota, or auth issues.
 */
export async function assistantHandler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history = [], stream = true } = req.body ?? {};

  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (message.length > 4000) {
    return res.status(413).json({ error: "Message is too long" });
  }

  const liveGitHub = getLiveGitHubSummary();
  const contextData = {
    ...portfolioKnowledge,
    liveGitHubStats: liveGitHub,
  };
  const contextString = JSON.stringify(contextData, null, 2);

  // If streaming mode
  if (stream) {
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    const writeChunk = (text: string) => {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    };

    const ai = getGenAI();

    // If no valid standard Gemini key is available, use verified knowledge generator
    if (!ai) {
      const answer = generateDeterministicAnswer(message);
      writeChunk(answer);
      res.write("data: [DONE]\n\n");
      return res.end();
    }

    try {
      const contents: any[] = [];

      if (Array.isArray(history)) {
        history.slice(-12).forEach((item: any) => {
          if (item?.role && item?.content) {
            contents.push({
              role: item.role === "assistant" ? "model" : "user",
              parts: [{ text: String(item.content) }],
            });
          }
        });
      }

      contents.push({
        role: "user",
        parts: [
          {
            text: `VERIFIED PORTFOLIO KNOWLEDGE:\n${contextString}\n\nUSER QUESTION:\n${message}`,
          },
        ],
      });

      const candidateModels = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3.8-flash"];
      let streamSuccess = false;

      for (const model of candidateModels) {
        try {
          const responseStream = await ai.models.generateContentStream({
            model,
            contents,
            config: {
              systemInstruction: ASSISTANT_SYSTEM_INSTRUCTION,
              temperature: 0.2,
            },
          });

          for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            if (chunkText) {
              writeChunk(chunkText);
              streamSuccess = true;
            }
          }

          if (streamSuccess) {
            break;
          }
        } catch {
          // Gracefully continue to next model or fallback without throwing alert logs
        }
      }

      if (!streamSuccess) {
        const fallbackText = generateDeterministicAnswer(message);
        writeChunk(fallbackText);
      }

      res.write("data: [DONE]\n\n");
      return res.end();
    } catch {
      const fallbackText = generateDeterministicAnswer(message);
      writeChunk(fallbackText);
      res.write("data: [DONE]\n\n");
      return res.end();
    }
  }

  // Non-streaming JSON mode
  const ai = getGenAI();
  if (!ai) {
    const answer = generateDeterministicAnswer(message);
    return res.json({ text: answer });
  }

  try {
    const contents: any[] = [];
    if (Array.isArray(history)) {
      history.slice(-12).forEach((item: any) => {
        if (item?.role && item?.content) {
          contents.push({
            role: item.role === "assistant" ? "model" : "user",
            parts: [{ text: String(item.content) }],
          });
        }
      });
    }

    contents.push({
      role: "user",
      parts: [
        {
          text: `VERIFIED PORTFOLIO KNOWLEDGE:\n${contextString}\n\nUSER QUESTION:\n${message}`,
        },
      ],
    });

    const candidateModels = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3.8-flash"];
    let finalAnswer = "";

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: ASSISTANT_SYSTEM_INSTRUCTION,
            temperature: 0.2,
          },
        });
        if (response.text) {
          finalAnswer = response.text;
          break;
        }
      } catch {
        // Silently try next model
      }
    }

    if (!finalAnswer) {
      finalAnswer = generateDeterministicAnswer(message);
    }

    return res.json({ text: finalAnswer });
  } catch {
    const fallbackAnswer = generateDeterministicAnswer(message);
    return res.json({ text: fallbackAnswer });
  }
}
