import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

/**
 * TEMPORARY diagnostic endpoint. Bypasses the engagement-store wrapper
 * and talks to Redis directly so we can isolate where the persistence
 * is breaking.
 *
 * Remove this file once Redis wiring is verified in production.
 */
export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return NextResponse.json({
      config: { hasUrl: Boolean(url), hasToken: Boolean(token) },
      error: "Env vars missing"
    });
  }

  const redis = new Redis({ url, token });
  const REDIS_KEY = "engagement:views";

  const result: Record<string, unknown> = {
    config: { hasUrl: true, hasToken: true, urlLooksValid: url.startsWith("https://") }
  };

  // Step 1: Ping
  try {
    const pong = await redis.ping();
    result.ping = pong;
  } catch (error) {
    result.pingError = error instanceof Error ? error.message : String(error);
    return NextResponse.json(result);
  }

  // Step 2: How many entries does the sorted set already have?
  try {
    result.cardBefore = await redis.zcard(REDIS_KEY);
  } catch (error) {
    result.cardBeforeError = error instanceof Error ? error.message : String(error);
  }

  // Step 3: Write a single test entry
  const testMember = `__debug-${Date.now()}`;
  const testScore = Date.now();
  try {
    const added = await redis.zadd(REDIS_KEY, { score: testScore, member: testMember });
    result.zaddResult = added;
  } catch (error) {
    result.zaddError = error instanceof Error ? error.message : String(error);
  }

  // Step 4: How many entries does the sorted set have now?
  try {
    result.cardAfter = await redis.zcard(REDIS_KEY);
  } catch (error) {
    result.cardAfterError = error instanceof Error ? error.message : String(error);
  }

  // Step 5: Read back ALL members (no byScore filter) so we can see what's actually stored
  try {
    const all = await redis.zrange(REDIS_KEY, 0, -1);
    result.zrangeAll = all;
    result.zrangeAllCount = Array.isArray(all) ? all.length : null;
  } catch (error) {
    result.zrangeAllError = error instanceof Error ? error.message : String(error);
  }

  // Step 6: Read back with byScore (the way storeLoad does it)
  try {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const byScore = await redis.zrange(REDIS_KEY, cutoff, "+inf", { byScore: true });
    result.zrangeByScore = byScore;
    result.zrangeByScoreCount = Array.isArray(byScore) ? byScore.length : null;
  } catch (error) {
    result.zrangeByScoreError = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json(result);
}
