/**
 * Engagement persistence abstraction.
 *
 * When UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, events
 * are stored in an Upstash Redis sorted set (durable, serverless-safe).
 *
 * Otherwise, falls back to the local NDJSON file for development.
 */

import type { EngagementEvent } from "@/lib/engagement";

// ---------------------------------------------------------------------------
// Redis backend
// ---------------------------------------------------------------------------

function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  // Lazy-import to avoid bundling when not used
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redis } = require("@upstash/redis") as typeof import("@upstash/redis");
  return new Redis({ url, token });
}

const REDIS_KEY = "engagement:views";

async function redisRecord(slug: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const event: EngagementEvent = { slug, at: new Date().toISOString() };
  // Score = unix timestamp in ms for range queries
  await redis.zadd(REDIS_KEY, { score: Date.now(), member: JSON.stringify(event) });
}

async function redisLoad(sinceDaysAgo: number): Promise<EngagementEvent[]> {
  const redis = getRedisClient();
  if (!redis) return [];

  const cutoff = Date.now() - sinceDaysAgo * 24 * 60 * 60 * 1000;
  const members: string[] = await redis.zrange(REDIS_KEY, cutoff, "+inf", { byScore: true });

  return members
    .map((raw) => {
      try {
        const parsed = JSON.parse(raw) as Partial<EngagementEvent>;
        if (typeof parsed.slug === "string" && typeof parsed.at === "string") {
          return { slug: parsed.slug, at: parsed.at } as EngagementEvent;
        }
      } catch {
        // skip malformed entries
      }
      return undefined;
    })
    .filter((e): e is EngagementEvent => Boolean(e));
}

async function redisPrune(olderThanDays: number): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
  await redis.zremrangebyscore(REDIS_KEY, 0, cutoff);
}

// ---------------------------------------------------------------------------
// Local NDJSON backend (development fallback)
// ---------------------------------------------------------------------------

import fs from "node:fs/promises";
import path from "node:path";

const engagementFilePath = path.join(process.cwd(), "data", "engagement-events.ndjson");

async function localRecord(slug: string): Promise<void> {
  const event: EngagementEvent = { slug, at: new Date().toISOString() };
  await fs.mkdir(path.dirname(engagementFilePath), { recursive: true });
  await fs.appendFile(engagementFilePath, `${JSON.stringify(event)}\n`, "utf8");
}

async function localLoad(): Promise<EngagementEvent[]> {
  try {
    const raw = await fs.readFile(engagementFilePath, "utf8");
    return raw
      .split(/\r?\n/)
      .map((line) => {
        if (!line.trim()) return undefined;
        try {
          const parsed = JSON.parse(line) as Partial<EngagementEvent>;
          if (typeof parsed.slug === "string" && typeof parsed.at === "string") {
            return { slug: parsed.slug, at: parsed.at } as EngagementEvent;
          }
        } catch {
          // skip
        }
        return undefined;
      })
      .filter((e): e is EngagementEvent => Boolean(e));
  } catch (error) {
    const code =
      typeof error === "object" && error && "code" in error
        ? (error as { code?: string }).code
        : undefined;
    if (code === "ENOENT") return [];
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Record a single article view event.
 */
export async function storeRecord(slug: string): Promise<void> {
  if (isRedisConfigured()) {
    await redisRecord(slug);
  } else {
    await localRecord(slug);
  }
}

/**
 * Load engagement events. When Redis is configured, only fetches events
 * within the given window (default 7 days) for efficiency.
 */
export async function storeLoad(sinceDaysAgo = 7): Promise<EngagementEvent[]> {
  if (isRedisConfigured()) {
    return redisLoad(sinceDaysAgo);
  }
  return localLoad();
}

/**
 * Remove stale events older than the given threshold.
 * Called opportunistically to keep the store lean.
 */
export async function storePrune(olderThanDays = 14): Promise<void> {
  if (isRedisConfigured()) {
    await redisPrune(olderThanDays);
  }
  // Local file: no pruning needed for dev
}
