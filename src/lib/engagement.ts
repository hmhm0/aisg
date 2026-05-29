import { storeLoad, storeRecord } from "@/lib/engagement-store";
import type { NewsPost } from "@/lib/types";

export type EngagementEvent = {
  slug: string;
  at: string;
};

const dayInMs = 24 * 60 * 60 * 1000;

function getPostTimestamp(post: Pick<NewsPost, "publishedAt" | "date">) {
  const value = post.publishedAt || post.date;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Load all recent engagement events from the configured store.
 */
export async function loadEngagementEvents(): Promise<EngagementEvent[]> {
  return storeLoad(7);
}

/**
 * Record a single article view.
 */
export async function recordArticleView(slug: string) {
  await storeRecord(slug);
}

function rankPostsByScore(posts: NewsPost[], scores: Map<string, number>) {
  return [...posts].sort((a, b) => {
    const scoreDelta = (scores.get(b.slug) ?? 0) - (scores.get(a.slug) ?? 0);
    if (Math.abs(scoreDelta) > 1e-9) {
      return scoreDelta;
    }

    const timeDelta = getPostTimestamp(b) - getPostTimestamp(a);
    if (timeDelta !== 0) {
      return timeDelta;
    }

    return a.title.localeCompare(b.title);
  });
}

function buildValidSlugSet(posts: NewsPost[]) {
  return new Set(posts.map((post) => post.slug));
}

export function rankTopReadPosts(posts: NewsPost[], events: EngagementEvent[]) {
  const validSlugs = buildValidSlugSet(posts);
  const scores = new Map<string, number>();
  const cutoff = Date.now() - dayInMs;

  for (const event of events) {
    const timestamp = Date.parse(event.at);
    if (!validSlugs.has(event.slug) || !Number.isFinite(timestamp) || timestamp < cutoff) {
      continue;
    }

    scores.set(event.slug, (scores.get(event.slug) ?? 0) + 1);
  }

  return rankPostsByScore(posts, scores);
}

export function rankPopularPosts(posts: NewsPost[], events: EngagementEvent[]) {
  const validSlugs = buildValidSlugSet(posts);
  const scores = new Map<string, number>();
  const cutoff = Date.now() - 7 * dayInMs;

  for (const event of events) {
    const timestamp = Date.parse(event.at);
    if (!validSlugs.has(event.slug) || !Number.isFinite(timestamp) || timestamp < cutoff) {
      continue;
    }

    const ageDays = (Date.now() - timestamp) / dayInMs;
    const weight = Math.exp(-ageDays / 2.75);
    scores.set(event.slug, (scores.get(event.slug) ?? 0) + weight);
  }

  return rankPostsByScore(posts, scores);
}
