import { NextResponse } from "next/server";
import { storeLoad, storeRecord } from "@/lib/engagement-store";

export const runtime = "nodejs";

/**
 * TEMPORARY diagnostic endpoint. Reports whether the engagement
 * persistence layer is configured and whether a round-trip read+write
 * succeeds. Returns no secrets — only booleans and counts.
 *
 * Remove this file once Redis wiring is verified in production.
 */
export async function GET() {
  const hasUrl = Boolean(process.env.UPSTASH_REDIS_REST_URL);
  const hasToken = Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

  // Prefix that uniquely identifies a debug ping so we can distinguish
  // it from real traffic and verify the round-trip.
  const debugSlug = `__debug-${Date.now()}`;

  let writeError: string | null = null;
  let readError: string | null = null;
  let readCount = 0;
  let foundDebug = false;

  try {
    await storeRecord(debugSlug);
  } catch (error) {
    writeError = error instanceof Error ? error.message : String(error);
  }

  try {
    const events = await storeLoad(1);
    readCount = events.length;
    foundDebug = events.some((e) => e.slug === debugSlug);
  } catch (error) {
    readError = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json({
    config: {
      UPSTASH_REDIS_REST_URL: hasUrl,
      UPSTASH_REDIS_REST_TOKEN: hasToken,
      backend: hasUrl && hasToken ? "redis" : "local-fallback"
    },
    roundTrip: {
      wrote: debugSlug,
      readCount,
      foundDebugInRead: foundDebug,
      writeError,
      readError
    }
  });
}
