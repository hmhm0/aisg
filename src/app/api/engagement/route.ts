import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/news";
import { recordArticleView } from "@/lib/engagement";
import { storePrune } from "@/lib/engagement-store";

export const runtime = "nodejs";

// Prune stale events roughly once every 100 requests
let requestCount = 0;
const PRUNE_INTERVAL = 100;

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { slug?: unknown } | null;
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";

    if (!slug) {
      return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
    }

    if (!getPostBySlug(slug)) {
      return NextResponse.json({ ok: false, error: "Story not found" }, { status: 404 });
    }

    await recordArticleView(slug);

    // Opportunistic pruning of events older than 14 days
    requestCount += 1;
    if (requestCount % PRUNE_INTERVAL === 0) {
      storePrune(14).catch(() => undefined);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to record article engagement", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
