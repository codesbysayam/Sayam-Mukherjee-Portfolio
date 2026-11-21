import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { generatePortfolioAnswer } from "../../src/utils/portfolioAssistantEngine.ts";

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
            publicRepos: parsed.publicRepos ?? parsed.profile.public_repos ?? 11,
            followers: parsed.profile.followers ?? 1,
            following: parsed.profile.following ?? 0,
            totalStars: parsed.totalStars ?? parsed.stats?.totalStars ?? 6,
            totalForks: parsed.totalForks ?? parsed.stats?.totalForks ?? 0,
            repositories: Array.isArray(parsed.repositories)
              ? parsed.repositories.slice(0, 11).map((r: any) => ({
                  name: r.name,
                  description: r.description,
                  language: r.language,
                  stars: r.stars ?? r.stargazers_count ?? 0,
                  forks: r.forks ?? r.forks_count ?? 0,
                  url: r.url ?? r.html_url,
                  updatedAt: r.updatedAt ?? r.updated_at,
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
 * verified portfolio data. Handles all specific queries and multilingual requests cleanly.
 */
export function generateDeterministicAnswer(query: string): string {
  const liveStats = getLiveGitHubSummary();
  return generatePortfolioAnswer(query, liveStats);
}

/**
 * Express Route Handler: POST /api/assistant
 * Handles both SSE streaming and standard JSON responses using the deterministic
 * portfolio knowledge engine grounded in live GitHub cache & verified portfolio records.
 */
export async function assistantHandler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, stream = true } = req.body ?? {};

  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (message.length > 4000) {
    return res.status(413).json({ error: "Message is too long" });
  }

  const answer = generateDeterministicAnswer(message);

  if (stream) {
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    res.write(`data: ${JSON.stringify({ text: answer })}\n\n`);
    res.write("data: [DONE]\n\n");
    return res.end();
  }

  return res.json({ text: answer });
}
