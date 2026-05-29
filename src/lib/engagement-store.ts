/**
 * Engagement persistence abstraction.
 *
 * When UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, events
 * are stored in an Upstash Redis sorted set (durable, serverless-safe).
 *
 * Otherwise, falls back to the local NDJSON file for development.
 *
 * Critically: every Redis call is wrapped so that a backend failure never
 * 500s a page render. Engagement is a "nice to have" enrichment, not a
 * critical-path dependency.
 */

import { Redis } from "@upstash/redis";
import fs from "node:fs/promises";
import path from "node:path";
import type { EngagementEvent } from "@/lib/engagement";

// ---------------------------------------------------------------------------
// Redis backend
// ---------------------------------------------------------------------------

const REDIS_KEY = "engagement:views";

let cachedRedis: Redis | null | undefined;

function getRedisClient(): Redis | null {
  if (cachedRedis !== undefined) return cachedRedis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    cachedRedis = null;
    return null;
  }

  try {
    cachedRedis = new Redis({ url, token });
  } catch (error) {
    console.warn("Failed to construct Upstash Redis client; falling back to no-op.", error);
    cachedRedis = null;
  }

  return cachedRedis;
}

async function redisRecord(slug: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const event: EngagementEvent = { slug, at: new Date().toISOString() };
    await redis.zadd(REDIS_KEY, { score: Date.now(), member: JSON.stringify(event) });
  } catch (error) {
    console.warn("Redis zadd failed; engagement event dropped.", error);
  }
}

async function redisLoad(sinceDaysAgo: number): Promise<EngagementEvent[]> {
  const redis = getRedisClient();
  if (!redis) return [];

  try {
    const cutoff = Date.now() - sinceDaysAgo * 24 * 60 * 60 * 1000;
    const members = (await redis.zrange(REDIS_KEY, cutoff, "+inf", { byScore: true })) as unknown[];

    return members
      .map((raw) => {
        try {
          // Upstash sometimes returns the value already parsed when it
          // was originally stored as JSON; accept both shapes.
          const parsed =
            typeof raw === "string" ? (JSON.parse(raw) as Partial<EngagementEvent>) : (raw as Partial<EngagementEvent>);
          if (typeof parsed.slug === "string" && typeof parsed.at === "string") {
            return { slug: parsed.slug, at: parsed.at } as EngagementEvent;
          }
        } catch {
          // skip malformed entries
        }
        return undefined;
      })
      .filter((e): e is EngagementEvent => Boolean(e));
  } catch (error) {
    console.warn("Redis zrange failed; returning empty engagement set.", error);
    return [];
  }
}

async function redisPrune(olderThanDays: number): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
    await redis.zremrangebyscore(REDIS_KEY, 0, cutoff);
  } catch (error) {
    console.warn("Redis zremrangebyscore failed; pruning skipped.", error);
  }
}

// ---------------------------------------------------------------------------
// Local NDJSON backend (development fallback)
// ---------------------------------------------------------------------------

const engagementFilePath = path.join(process.cwd(), "data", "engagement-events.ndjson");

async function localRecord(slug: string): Promise<void> {
  try {
    const event: EngagementEvent = { slug, at: new Date().toISOString() };
    await fs.mkdir(path.dirname(engagementFilePath), { recursive: true });
    await fs.appendFile(engagementFilePath, `${JSON.stringify(event)}\n`, "utf8");
  } catch (error) {
    // On Vercel the filesystem is read-only; treat as best-effort.
    console.warn("Local engagement record failed (expected on serverless).", error);
  }
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
    return [];
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Record a single article view event. Never throws — engagement is a
 * non-critical enrichment, so a backend failure should not block rendering
 * or response.
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
 * within the given window (default 7 days) for efficiency. Returns an
 * empty array if the backend is unreachable.
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
