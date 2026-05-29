import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { DEFAULT_NEWS_IMAGE } from "@/lib/placeholders";
import type { NewsPost } from "@/lib/types";

const contentDir = path.join(process.cwd(), "content", "posts");

// Keywords to extract from titles and content
const DOMAIN_KEYWORDS = [
  "GovTech",
  "cybersecurity",
  "fintech",
  "healthtech",
  "edtech",
  "e-commerce",
  "blockchain",
  "web3",
  "metaverse",
  "cloud",
  "infrastructure",
  "5g",
  "iot",
  "robotics",
  "automation",
  "machine learning",
  "deep learning",
  "data science",
  "startup",
  "venture",
  "innovation",
  "digital transformation",
  "smart nation",
  "policy",
  "regulation",
  "security",
  "privacy",
  "sustainability",
  "green tech",
  "mobility",
  "autonomous",
  "developer",
  "enterprise",
  "sme",
  "government",
  "public sector"
];

function extractKeywordsFromText(text: string): string[] {
  if (!text) return [];
  
  const lowerText = text.toLowerCase();
  const extracted: string[] = [];
  
  for (const keyword of DOMAIN_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, "gi");
    if (regex.test(lowerText)) {
      extracted.push(keyword);
    }
  }
  
  return extracted;
}

function deriveTags(title: string, body: string, existingTags: string[]): string[] {
  const tagSet = new Set(existingTags);
  
  // Extract from title
  const titleKeywords = extractKeywordsFromText(title);
  titleKeywords.forEach(tag => tagSet.add(tag));
  
  // Extract from body (first 500 chars for efficiency)
  const bodySnippet = body.substring(0, 500);
  const bodyKeywords = extractKeywordsFromText(bodySnippet);
  bodyKeywords.forEach(tag => tagSet.add(tag));
  
  return Array.from(tagSet);
}

export function getPosts(): NewsPost[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
      const { data, content } = matter(raw);
      const excerpt = String(data.excerpt || content.split("\n").find(Boolean) || "").trim();
      const title = String(data.title || slug);
      const existingTags = Array.isArray(data.tags) ? data.tags.map(String) : [];
      
      // Derive additional tags from title and content
      const allTags = deriveTags(title, content, existingTags);

      return {
        slug,
        title,
        date: String(data.date || ""),
        publishedAt: data.publishedAt ? String(data.publishedAt) : undefined,
        displayDate: formatPublishedAt(data.publishedAt ? String(data.publishedAt) : String(data.date || "")),
        excerpt,
        tags: allTags,
        source: String(data.source || "News API fallback"),
        link: String(data.link || "#"),
        image: String(data.image || "").trim() || DEFAULT_NEWS_IMAGE,
        body: content.trim(),
        featured: Boolean(data.featured)
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): NewsPost | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export function getTagCounts(posts: NewsPost[]): Record<string, number> {
  return posts.reduce<Record<string, number>>((acc, post) => {
    for (const tag of post.tags) {
      acc[tag] = (acc[tag] ?? 0) + 1;
    }
    return acc;
  }, {});
}

export function formatPublishedAt(value: string | undefined) {
  if (!value) {
    return "";
  }

  const raw = String(value).trim();
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw);
  const isMidnightIso = /^\d{4}-\d{2}-\d{2}T00:00:00(?:\.000)?(?:Z|[+-]\d{2}:\d{2})$/.test(raw);
  const hasExplicitTime = /T\d{2}:\d{2}/.test(raw) || /\b\d{1,2}:\d{2}\b/.test(raw);

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  const dateFormatter = new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const dateParts = Object.fromEntries(dateFormatter.formatToParts(date).map((part) => [part.type, part.value]));

  if (isDateOnly || isMidnightIso || !hasExplicitTime) {
    return `${dateParts.day} ${dateParts.month} ${dateParts.year}`;
  }

  const timeFormatter = new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
  const timeParts = Object.fromEntries(timeFormatter.formatToParts(date).map((part) => [part.type, part.value]));
  const time = `${timeParts.hour}:${timeParts.minute} ${String(timeParts.dayPeriod || "").toUpperCase()}`.trim();

  return `${dateParts.day} ${dateParts.month} ${dateParts.year} at ${time}`;
}

export function getDisplayPublishedAt(post: { publishedAt?: string; date: string }) {
  return formatPublishedAt(post.publishedAt || post.date);
}
