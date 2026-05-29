import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import Parser from "rss-parser";

const projectRoot = process.cwd();
const contentDir = path.join(projectRoot, "content", "posts");
const FALLBACK_IMAGE_PATH = "/news-images/placeholder-news.svg";
const IMAGE_SKIP_PATTERN = /(logo|sprite|icon|avatar|placeholder|pixel|badge|advert|ads?\b|tracking|spinner|favicon|watermark|emblem|brand)/i;
const IMAGE_SRCSET_ATTRS = ["data-srcset", "data-lazy-srcset", "data-original-srcset", "data-full-srcset", "srcset"];
const IMAGE_ATTRS = [
  "data-src",
  "data-original",
  "data-original-src",
  "data-lazy-src",
  "data-url",
  "data-large-src",
  "data-image",
  "data-thumb",
  "data-fallback-src",
  "data-bg",
  "data-background",
  "data-zoom-image",
  "src"
];

const RSS_FEEDS = (process.env.RSS_FEEDS || "https://vulcanpost.com/feed/,https://www.dealstreetasia.com/feed/")
  .split(",")
  .map((feed) => feed.trim())
  .filter(Boolean);
const KEYWORDS = (process.env.NEWS_KEYWORDS || "singapore,singaporean,s'pore,sg,ai,artificial intelligence,ml,machine learning,tech,technology,startup,founder,venture,fintech,policy,governance,chip,semiconductor,cloud,robotics,cybersecurity,software,hardware,enterprise,govtech,smart nation")
  .split(",")
  .map((keyword) => keyword.trim().toLowerCase())
  .filter(Boolean);

const SINGAPORE_KEYWORDS = (process.env.SINGAPORE_KEYWORDS || "singapore,singaporean,s'pore,sg")
  .split(",")
  .map((keyword) => keyword.trim().toLowerCase())
  .filter(Boolean);

const TECH_KEYWORDS = (process.env.TECH_KEYWORDS || "ai,artificial intelligence,ml,machine learning,tech,technology,startup,founder,venture,fintech,chip,semiconductor,cloud,robotics,cybersecurity,software,hardware,innovation,digital,govtech,smart nation,data center,datacenter,openai,nvidia,layoff,layoffs,acquisition,merger,ipo,telecom,education,healthtech,mobility,e-commerce")
  .split(",")
  .map((keyword) => keyword.trim().toLowerCase())
  .filter(Boolean);

const RELEVANCE_BLACKLIST = (process.env.RELEVANCE_BLACKLIST || "snow city,restaurant,cafe,food,durian,musang king,fruit,stall,bakery,travel,concert,event,lifestyle,shopping,mall,festival,recipe,parenting,education,aeromodelling,state visit,world championships,f1,sports,property,cruise,cruises,eatery,weather,traffic,crime,obituary,celebrity,entertainment,food review,live-streaming,livestream,streamer,influencer,viral,tiktok,beauty,salon,makeup,skincare,spa,nightlife,bar,club")
  .split(",")
  .map((keyword) => keyword.trim().toLowerCase())
  .filter(Boolean);

const NEWS_API_URL = process.env.NEWS_API_URL || "https://newsapi.org/v2/everything";
const NEWS_API_KEY = process.env.NEWS_API_KEY || "";
const NEWS_API_QUERY = process.env.NEWS_API_QUERY || "Singapore AI technology startup fintech govtech cybersecurity";

const parser = new Parser({
  timeout: 30000
});

const PAGE_SOURCES = [
  {
    name: "CNA Singapore",
    url: "https://www.channelnewsasia.com/singapore",
    kind: "listing",
    limit: 14,
    extractLinks: extractCnaLinks
  },
  {
    name: "GovTech TechNews",
    url: "https://www.tech.gov.sg/technews/",
    kind: "listing",
    limit: 12,
    extractLinks: extractTechGovLinks
  },
  {
    name: "STOMP",
    url: "https://www.stomp.sg/sitemap.xml",
    kind: "sitemap",
    limit: 12,
    extractLinks: extractStompLinks
  },
  {
    name: "GovInsider",
    url: "https://govinsider.asia",
    kind: "listing",
    limit: 12,
    extractLinks: extractGovInsiderLinks
  }
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsTerm(text, term) {
  const lowerText = text.toLowerCase();
  const lowerTerm = term.toLowerCase();

  if (!lowerTerm) {
    return false;
  }

  if (lowerTerm.includes(" ") || /[^a-z0-9]/.test(lowerTerm)) {
    return lowerText.includes(lowerTerm);
  }

  return new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(lowerTerm)}(?:$|[^a-z0-9])`, "i").test(lowerText);
}

function anyTerm(text, terms) {
  return terms.some((term) => containsTerm(text, term));
}

function titleCase(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/\b([a-z])/g, (match) => match.toUpperCase());
}

function isNoisyPhrase(value) {
  const lower = value.toLowerCase();
  if (lower.length < 4) return true;
  if (/^\d+$/.test(lower)) return true;
  return false;
}

function extractTitleTags(title) {
  const raw = normalizeText(title).replace(/[“”"']/g, "");
  const base = raw
    .replace(/^\b(what is|what are|how to|why|when|where|who is|who are)\b\s+/i, "")
    .replace(/\b(preparing for|the future of|the age of)\b/i, "")
    .replace(/[?!]/g, "")
    .trim();

  const candidates = base
    .split(/[:–—-]/)
    .map((part) => part.trim())
    .filter(Boolean);

  const tags = [];
  for (const candidate of candidates) {
    const words = candidate.split(/\s+/).filter(Boolean);
    if (words.length < 2 || words.length > 4) {
      continue;
    }

    const firstWord = words[0].toLowerCase();
    const lastWord = words[words.length - 1].toLowerCase();
    const allowList = [
      "digital",
      "automated",
      "software",
      "ai",
      "artificial",
      "cybersecurity",
      "govtech",
      "smart",
      "data",
      "cloud",
      "enterprise",
      "startup",
      "tech",
      "technology",
      "platform",
      "applications",
      "application",
      "services",
      "testing",
      "governance",
      "security",
      "robotics",
      "fintech",
      "mobility",
      "health",
      "education"
    ];

    if (!allowList.some((term) => firstWord === term || lastWord === term)) {
      continue;
    }

    const phrase = titleCase(words.join(" "));
    if (!isNoisyPhrase(phrase)) {
      tags.push(phrase);
    }
  }

  return Array.from(new Set(tags));
}

function isSingaporeTechStory(text, sourceHint = "", url = "") {
  const combined = `${text} ${sourceHint} ${url}`;
  const lowerSource = sourceHint.toLowerCase();
  const hasSingaporeSignal =
    anyTerm(combined, SINGAPORE_KEYWORDS) ||
    lowerSource.includes("vulcanpost") ||
    lowerSource.includes("straitstimes");
  const hasTechSignal =
    anyTerm(combined, TECH_KEYWORDS) ||
    url.toLowerCase().includes("/tech/") ||
    url.toLowerCase().includes("/technology/");
  const hasBlacklistedSignal = anyTerm(combined, RELEVANCE_BLACKLIST);
  return hasSingaporeSignal && hasTechSignal && !hasBlacklistedSignal;
}

function deriveTags(text, sourceHint = "") {
  const combined = `${text} ${sourceHint}`;
  const tags = new Set();

  tags.add("Singapore");

  if (anyTerm(combined, ["ai", "artificial intelligence", "machine learning", "ml", "openai"])) tags.add("AI");
  if (anyTerm(combined, ["startup", "founder", "venture", "funding", "accelerator", "seed", "series a", "series b"])) tags.add("Startups");
  if (anyTerm(combined, ["fintech", "payments", "e-payment", "e-wallet", "banking", "wallet"])) tags.add("Fintech");
  if (anyTerm(combined, ["policy", "regulation", "law", "governance", "review"])) tags.add("Policy");
  if (anyTerm(combined, ["chip", "semiconductor", "nvidia", "silicon"])) tags.add("Semiconductors");
  if (anyTerm(combined, ["cloud", "software", "hardware", "digital", "platform", "product"])) tags.add("Tech");
  if (containsTerm(combined, "robotics")) tags.add("Robotics");
  if (containsTerm(combined, "cybersecurity")) tags.add("Cybersecurity");
  if (anyTerm(combined, ["govtech", "public sector", "government", "smart nation", "digital services"])) tags.add("GovTech");
  if (anyTerm(combined, ["data center", "datacenter", "infrastructure", "infra"])) tags.add("Infrastructure");
  if (anyTerm(combined, ["open source", "developer", "engineering", "devtools"])) tags.add("Developers");
  if (anyTerm(combined, ["enterprise", "b2b", "enterprise software"])) tags.add("Enterprise");
  if (anyTerm(combined, ["consumer", "app", "mobile"])) tags.add("Consumer Tech");
  if (anyTerm(combined, ["smart nation", "digital government", "public service"])) tags.add("Smart Nation");
  if (anyTerm(combined, ["mobility", "transport", "ev", "charging", "autonomous"])) tags.add("Mobility");
  if (anyTerm(combined, ["e-commerce", "ecommerce", "online retail", "marketplace"])) tags.add("E-commerce");
  if (anyTerm(combined, ["climate", "energy", "green", "sustainability", "decarbon", "emission"])) tags.add("Sustainability");
  if (anyTerm(combined, ["education", "school", "teacher", "learning"])) tags.add("EdTech");
  if (anyTerm(combined, ["health", "hospital", "medical", "patient", "care"])) tags.add("HealthTech");
  if (anyTerm(combined, ["telecom", "telco", "5g", "network", "connectivity"])) tags.add("Connectivity");

  for (const tag of extractTitleTags(text)) {
    if (!isNoisyPhrase(tag)) {
      tags.add(tag);
    }
  }

  return Array.from(tags);
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function resolveUrl(candidate, baseUrl = "") {
  const normalized = normalizeText(candidate);
  if (!normalized) {
    return "";
  }

  try {
    return new URL(normalized, baseUrl || undefined).toString();
  } catch {
    return normalized;
  }
}

function extractAttribute(tag, names) {
  for (const name of names) {
    const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));
    if (match?.[1]) {
      return match[1];
    }
  }

  return "";
}

function pickBestSrcsetCandidate(srcset) {
  if (!srcset) {
    return "";
  }

  const entries = srcset
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const parts = entry.split(/\s+/).filter(Boolean);
      const url = parts.shift() || "";
      const descriptor = parts.shift() || "";
      const parsed = Number.parseFloat(descriptor);
      const score = descriptor.endsWith("w") || descriptor.endsWith("x") ? (Number.isFinite(parsed) ? parsed : 1) : 1;

      return { url, score };
    })
    .filter((entry) => Boolean(entry.url));

  if (!entries.length) {
    return "";
  }

  entries.sort((a, b) => b.score - a.score || b.url.length - a.url.length);
  return entries[0].url;
}

function collectTagImageCandidates(tag) {
  const candidates = [];

  for (const attr of IMAGE_SRCSET_ATTRS) {
    const srcset = extractAttribute(tag, [attr]);
    const candidate = pickBestSrcsetCandidate(srcset);
    if (candidate) {
      candidates.push(candidate);
    }
  }

  for (const attr of IMAGE_ATTRS) {
    const candidate = extractAttribute(tag, [attr]);
    if (candidate) {
      candidates.push(candidate);
    }
  }

  return Array.from(new Set(candidates));
}

function isUsableImageCandidate(candidate, tag = "") {
  if (!candidate || /^data:/i.test(candidate) || /\.svg(?:$|\?)/i.test(candidate)) {
    return false;
  }

  const lowerCandidate = candidate.toLowerCase();
  const lowerTag = tag.toLowerCase();
  if (IMAGE_SKIP_PATTERN.test(lowerCandidate) || IMAGE_SKIP_PATTERN.test(lowerTag)) {
    return false;
  }

  const width = Number.parseInt(extractAttribute(tag, ["width"]), 10);
  const height = Number.parseInt(extractAttribute(tag, ["height"]), 10);
  if ((Number.isFinite(width) && width > 0 && width < 120) || (Number.isFinite(height) && height > 0 && height < 120)) {
    return false;
  }

  return true;
}

function extractFirstMeaningfulImage(html, baseUrl = "") {
  const searchableBlocks = [];
  const articleBlock = html.match(/<article\b[\s\S]*?<\/article>/i)?.[0];
  const mainBlock = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0];

  if (articleBlock) searchableBlocks.push(articleBlock);
  if (mainBlock && mainBlock !== articleBlock) searchableBlocks.push(mainBlock);
  searchableBlocks.push(html);

  for (const block of searchableBlocks) {
    const images = block.match(/<img\b[^>]*>/gi) || [];

    for (const tag of images) {
      const candidates = collectTagImageCandidates(tag);
      for (const candidate of candidates) {
        if (isUsableImageCandidate(candidate, tag)) {
          return resolveUrl(candidate, baseUrl);
        }
      }
    }
  }

  for (const block of searchableBlocks) {
    const sources = block.match(/<source\b[^>]*>/gi) || [];

    for (const tag of sources) {
      const candidates = collectTagImageCandidates(tag);
      for (const candidate of candidates) {
        if (isUsableImageCandidate(candidate, tag)) {
          return resolveUrl(candidate, baseUrl);
        }
      }
    }
  }

  for (const block of searchableBlocks) {
    const lazyTags = block.match(/<[^>]+(?:data-srcset|data-lazy-srcset|data-original-srcset|data-full-srcset|data-src|data-original|data-original-src|data-lazy-src|data-url|data-large-src|data-image|data-thumb|data-fallback-src|data-bg|data-background|data-zoom-image)[^>]*>/gi) || [];

    for (const tag of lazyTags) {
      const candidates = collectTagImageCandidates(tag);
      for (const candidate of candidates) {
        if (isUsableImageCandidate(candidate, tag)) {
          return resolveUrl(candidate, baseUrl);
        }
      }
    }
  }

  for (const block of searchableBlocks) {
    const matches = [...block.matchAll(/background-image\s*:\s*url\((['"]?)([^'")]+)\1\)/gi)];

    for (const match of matches) {
      const candidate = match[2];
      if (!isUsableImageCandidate(candidate, match[0])) {
        continue;
      }

      return resolveUrl(candidate, baseUrl);
    }
  }

  return "";
}

function splitSentences(value) {
  return normalizeText(value)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function sentenceCase(value) {
  const text = normalizeText(value);
  if (!text) {
    return "";
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function expandTitleFragments(value) {
  return normalizeText(value)
    .replace(/[“”"']/g, "")
    .replace(/\bAI\b/g, "artificial intelligence")
    .replace(/\bGovTech\b/g, "government technology")
    .replace(/\bSG\b/g, "Singapore")
    .replace(/\bS’pore\b/gi, "Singapore")
    .replace(/\bS'pore\b/gi, "Singapore");
}

function stripFillerPhrases(value) {
  return normalizeText(value)
    .replace(/^(find out|learn|discover)\s+how\s+/i, "")
    .replace(/^(this story|this article|the article)\s+(looks at|covers|explores|explains)\s+/i, "")
    .replace(/^how\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function simplifyForReader(value) {
  const text = stripFillerPhrases(expandTitleFragments(value));
  return sentenceCase(text).replace(/[.?!]+$/, "");
}

function shortenForLead(value, maxLength = 120) {
  const text = simplifyForReader(value);
  if (text.length <= maxLength) {
    return text;
  }

  const trimmed = text.slice(0, maxLength).replace(/\s+\S*$/, "").trim();
  return trimmed ? `${trimmed}…` : text.slice(0, maxLength);
}

function buildContextBullet({ title, description, sourceName }) {
  const text = `${title} ${description} ${sourceName}`.toLowerCase();

  if (text.includes("career") || text.includes("upskill") || text.includes("skills")) {
    return "It also points to a more practical job market, where upskilling can open clearer paths forward.";
  }

  if (text.includes("public officers") || text.includes("government services") || text.includes("public service")) {
    return "The broader story is about faster services and less friction for citizens.";
  }

  if (text.includes("cybersecurity") || text.includes("security")) {
    return "The bigger picture is stronger digital systems that help protect data and keep services running.";
  }

  if (text.includes("ai")) {
    return "The wider signal is that AI is moving deeper into daily work, public service, and business decisions.";
  }

  return "";
}

function buildWhyItMatters({ title, description, sourceName }) {
  const text = `${title} ${description} ${sourceName}`.toLowerCase();

  if (text.includes("career") || text.includes("upskill") || text.includes("skills")) {
    return "For readers, it points to a more practical job market, where upskilling can open clearer paths forward.";
  }

  if (text.includes("public officers") || text.includes("government services") || text.includes("public service")) {
    return "For citizens, that can mean faster services and less friction when dealing with government.";
  }

  if (text.includes("cybersecurity") || text.includes("security")) {
    return "For readers and businesses alike, stronger systems help protect data and keep essential services running.";
  }

  if (text.includes("ai")) {
    return "For Singapore, it shows how AI is moving deeper into daily work, public service, and business decisions.";
  }

  return "For readers, it highlights how technology is shaping everyday work and services.";
}

function buildSummaryBullets({ title, description, sourceName }) {
  const descriptionSentences = splitSentences(description)
    .map((sentence) => simplifyForReader(sentence))
    .filter(Boolean);

  const bullets = [];
  if (descriptionSentences[0]) {
    bullets.push(descriptionSentences[0]);
  }
  if (descriptionSentences[1] && descriptionSentences[1] !== bullets[0]) {
    bullets.push(descriptionSentences[1]);
  }
  if (bullets.length < 3 && descriptionSentences[2] && descriptionSentences[2] !== bullets[1]) {
    bullets.push(descriptionSentences[2]);
  }
  if (bullets.length < 2) {
    const contextBullet = buildContextBullet({ title, description, sourceName });
    if (contextBullet && contextBullet !== bullets[0]) {
      bullets.push(contextBullet);
    }
  }

  return bullets.slice(0, 3);
}

function buildStoryBody({ title, description, sourceName, link }) {
  const bullets = buildSummaryBullets({ title, description, sourceName });
  const whyItMatters = buildWhyItMatters({ title, description, sourceName });

  return [
    "**In brief -**",
    "",
    ...bullets.map((bullet) => `- ${bullet}`),
    "",
    "**Why it matters:**",
    "",
    whyItMatters,
    "",
    "**Source:**",
    "",
    link
  ].join("\n");
}

function uniqueSlug(date, title, link) {
  const hash = createHash("sha1").update(link || title).digest("hex").slice(0, 8);
  const safeDate = String(date).replace(/[^0-9-]/g, "");
  return `${safeDate}-${slugify(title)}-${hash}`;
}

async function persistRemoteImage(url, slugSeed, referer = "") {
  if (!url) {
    return FALLBACK_IMAGE_PATH;
  }

  if (String(url).startsWith("/news-images/")) {
    return url;
  }

  const resolvedUrl = resolveUrl(url);
  if (!resolvedUrl) {
    return FALLBACK_IMAGE_PATH;
  }

  try {
    const response = await fetch(resolvedUrl, {
      headers: {
        accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        referer: referer || resolvedUrl,
        "user-agent": "Mozilla/5.0 (compatible; SingaporeTechNewsBot/1.0)"
      }
    });
    if (!response.ok) {
      return resolvedUrl;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      return resolvedUrl;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const ext = contentType.includes("png") ? "png" : contentType.includes("gif") ? "gif" : contentType.includes("webp") ? "webp" : "jpg";
    const safeSeed = slugSeed.replace(/[^a-z0-9-]/g, "");
    const fileName = `${safeSeed}.${ext}`;
    const imagesDir = path.join(projectRoot, "public", "news-images");
    await fs.mkdir(imagesDir, { recursive: true });
    await fs.writeFile(path.join(imagesDir, fileName), buffer);
    return `/news-images/${fileName}`;
  } catch {
    return resolvedUrl;
  }
}

function toMarkdown({ title, date, publishedAt, excerpt, tags, source, link, body, image = "", featured = false }) {
  const displayDate = typeof date === "string" ? date : String(date);
  const displayPublishedAt = typeof publishedAt === "string" && publishedAt ? publishedAt : displayDate;
  const safeTitle = JSON.stringify(title);
  const safeDate = JSON.stringify(displayDate);
  const safePublishedAt = JSON.stringify(displayPublishedAt);
  const safeExcerpt = JSON.stringify(excerpt);
  const safeSource = JSON.stringify(source);
  const safeLink = JSON.stringify(link);
  const safeImage = JSON.stringify(image);

  return `---
title: ${safeTitle}
date: ${safeDate}
publishedAt: ${safePublishedAt}
excerpt: ${safeExcerpt}
tags:
${tags.map((tag) => `  - ${tag}`).join("\n")}
source: ${safeSource}
link: ${safeLink}
image: ${safeImage}
featured: ${featured}
---

${body.trim()}
`;
}

async function ensureContentDir() {
  await fs.mkdir(contentDir, { recursive: true });
}

async function saveStory(story) {
  const slug = uniqueSlug(story.date, story.title, story.link);
  const filePath = path.join(contentDir, `${slug}.md`);

  await fs.writeFile(filePath, toMarkdown(story), "utf8");
  return { slug, created: true };
}

function normalizeRssItem(item) {
  const title = item.title?.trim();
  const link = item.link?.trim();
  const timestamp = normalizeTimestampForStorage(item.isoDate || item.pubDate || new Date().toISOString());
  const description = item.contentSnippet || item.summary || item.content || "";
  const excerpt = description.replace(/\s+/g, " ").trim().slice(0, 220);
  const imageUrl =
    item.enclosure?.url ||
    item.media?.content?.url ||
    item["media:content"]?.url ||
    item.image?.url ||
    "";
  const tags = deriveTags(`${title} ${description}`, item.creator || item.author || "");

  return {
    title,
    date: timestamp.date || new Date().toISOString(),
    publishedAt: timestamp.publishedAt || timestamp.date,
    excerpt: excerpt || title,
    tags: Array.from(new Set(tags)),
    source: item.creator || item.author || "RSS feed",
    link,
    image: imageUrl || FALLBACK_IMAGE_PATH,
    body: [
      `## Summary`,
      description || excerpt || title,
      `## Source`,
      link
    ].join("\n\n")
  };
}

async function extractImageUrl(url) {
  if (!url) {
    return "";
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        referer: url,
        "user-agent": "Mozilla/5.0 (compatible; SingaporeTechNewsBot/1.0)"
      }
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return "";
    }

    const html = await response.text();
    const candidates = [
      /<meta[^>]+property=["']og:image(?::url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']parsely-image-url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']thumbnail["'][^>]+content=["']([^"']+)["']/i,
      /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i
    ];

    const imageCandidates = [];
    for (const pattern of candidates) {
      const match = html.match(pattern);
      if (match?.[1]) {
        imageCandidates.push({ candidate: resolveUrl(match[1], url), tag: match[0] });
      }
    }

    const jsonLdImage = extractJsonLdMeta(html).image;
    if (jsonLdImage) {
      imageCandidates.push({ candidate: resolveUrl(jsonLdImage, url), tag: jsonLdImage });
    }

    const bodyImage = extractFirstMeaningfulImage(html, url);
    if (bodyImage) {
      imageCandidates.push({ candidate: bodyImage, tag: "" });
    }

    for (const { candidate, tag } of imageCandidates) {
      if (isUsableImageCandidate(candidate, tag)) {
        return candidate;
      }
    }

    return "";
  } catch {
    return "";
  }

  return "";
}

function extractMetaContent(html, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return normalizeText(match[1]);
    }
  }

  return "";
}

function extractJsonLdMeta(html) {
  const datePublished = extractMetaContent(html, [
    /"datePublished"\s*:\s*"([^"]+)"/i,
    /"dateCreated"\s*:\s*"([^"]+)"/i,
    /"dateModified"\s*:\s*"([^"]+)"/i
  ]);
  const headline = extractMetaContent(html, [
    /"headline"\s*:\s*"([^"]+)"/i
  ]);
  const description = extractMetaContent(html, [
    /"description"\s*:\s*"([^"]+)"/i
  ]);
  const articleBody = extractMetaContent(html, [
    /"articleBody"\s*:\s*"([^"]+)"/i
  ]);
  const image = extractMetaContent(html, [
    /"image"\s*:\s*{[\s\S]*?"url"\s*:\s*"([^"]+)"/i,
    /"image"\s*:\s*\[\s*{[\s\S]*?"url"\s*:\s*"([^"]+)"/i,
    /"image"\s*:\s*(?:"([^"]+)")/i,
    /"image"\s*:\s*\[\s*"([^"]+)"/i
  ]);

  return {
    datePublished,
    headline,
    description,
    articleBody,
    image
  };
}

function parseHumanDate(value) {
  const match = String(value || "").match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!match) {
    return "";
  }

  const monthMap = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12"
  };

  const day = match[1].padStart(2, "0");
  const month = monthMap[match[2].toLowerCase()];
  const year = match[3];

  return month ? `${year}-${month}-${day}` : "";
}

function normalizeTimestampForStorage(value) {
  const raw = normalizeText(value);
  if (!raw) {
    return { date: "", publishedAt: "" };
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return {
      date: `${raw}T00:00:00.000Z`,
      publishedAt: raw
    };
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return {
      date: raw,
      publishedAt: raw
    };
  }

  return {
    date: parsed.toISOString(),
    publishedAt: raw
  };
}

async function extractArticleMeta(url) {
  if (!url) {
    return {};
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        referer: url,
        "user-agent": "Mozilla/5.0 (compatible; SingaporeTechNewsBot/1.0)"
      }
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return {};
    }

    const html = await response.text();
    const jsonLd = extractJsonLdMeta(html);
    const title = extractMetaContent(html, [
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
      /<title>([^<]+)<\/title>/i,
      /"headline"\s*:\s*"([^"]+)"/i
    ]);
    const description = extractMetaContent(html, [
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:description["'][^>]+content=["']([^"']+)["']/i,
      /"description"\s*:\s*"([^"]+)"/i
    ]);
    const imageCandidates = [
      /<meta[^>]+property=["']og:image(?::url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']parsely-image-url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']thumbnail["'][^>]+content=["']([^"']+)["']/i,
      /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i,
      /"image"\s*:\s*"([^"]+)"/i
    ]
      .map((pattern) => {
        const match = html.match(pattern);
        return match?.[1] ? resolveUrl(match[1], url) : "";
      })
      .filter(Boolean);

    const jsonLdImage = resolveUrl(jsonLd.image, url);
    if (jsonLdImage) {
      imageCandidates.unshift(jsonLdImage);
    }

    const bodyImage = extractFirstMeaningfulImage(html, url);
    if (bodyImage) {
      imageCandidates.push(bodyImage);
    }

    const image = imageCandidates.find((candidate) => isUsableImageCandidate(candidate)) || "";
    const publishedAt = extractMetaContent(html, [
      /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']og:updated_time["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']published_time["'][^>]+content=["']([^"']+)["']/i,
      /<time[^>]+datetime=["']([^"']+)["']/i,
      /"datePublished"\s*:\s*"([^"]+)"/i,
      /"dateCreated"\s*:\s*"([^"]+)"/i,
      /"dateModified"\s*:\s*"([^"]+)"/i
    ]);
    const articleBody = extractMetaContent(html, [
      /"articleBody"\s*:\s*"([^"]+)"/i
    ]);
    const lastUpdated = extractMetaContent(html.replace(/<!--[\s\S]*?-->/g, ""), [
      /last updated\s+(\d{1,2}\s+[A-Za-z]+\s+\d{4})/i
    ]);
    const siteName = extractMetaContent(html, [
      /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']application-name["'][^>]+content=["']([^"']+)["']/i
    ]);

    return {
      title: title || jsonLd.headline,
      description: description || jsonLd.description,
      articleBody: articleBody || jsonLd.articleBody,
      image,
      publishedAt: publishedAt || jsonLd.datePublished || parseHumanDate(lastUpdated),
      siteName
    };
  } catch {
    return {};
  }
}

function extractCnaLinks(html) {
  const matches = html.match(/https:\/\/www\.channelnewsasia\.com\/[^"'<> ]+/g) || [];
  return Array.from(
    new Set(
      matches
        .map((url) => url.replace(/&amp;/g, "&"))
        .filter((url) => /\/singapore\//.test(url) && !url.includes("watch?") && !url.includes("commentary/") && !url.includes("entertainment/"))
    )
  );
}

function extractTechGovLinks(html) {
  const matches = html.match(/\/technews\/[a-z0-9-]+\/?/gi) || [];
  return Array.from(
    new Set(matches.map((url) => `https://www.tech.gov.sg${url.endsWith("/") ? url : `${url}/`}`))
  );
}

function extractGovInsiderLinks(html) {
  const matches = html.match(/https:\/\/govinsider\.asia\/(?:intl-en\/)?[^"'\\s<>]+/g) || [];
  return Array.from(
    new Set(
      matches
        .map((url) => url.replace(/\\\/$/, ""))
        .filter((url) => !url.includes("/event/") && !url.includes("/author/") && !url.includes("/tag/") && !url.endsWith("/feed/"))
    )
  );
}

async function extractStompLinks() {
  const indexResponse = await fetch("https://www.stomp.sg/sitemap.xml", {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; SingaporeTechNewsBot/1.0)"
    }
  });

  if (!indexResponse.ok) {
    return [];
  }

  const indexXml = await indexResponse.text();
  const sitemapUrls = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/gi)]
    .map((match) => match[1].trim())
    .filter((url) => /sitemap-articles-\d{4}-\d{2}\.xml$/.test(url))
    .slice(0, 2);

  const articleUrls = [];
  for (const sitemapUrl of sitemapUrls) {
    try {
      const sitemapResponse = await fetch(sitemapUrl, {
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; SingaporeTechNewsBot/1.0)"
        }
      });

      if (!sitemapResponse.ok) {
        continue;
      }

      const sitemapXml = await sitemapResponse.text();
      for (const match of sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/gi)) {
        const url = match[1].trim();
        if (url.includes("stomp.sg/") && !url.includes("/tag/") && !url.includes("/category/")) {
          articleUrls.push(url);
        }
      }
    } catch {
      continue;
    }
  }

  return Array.from(new Set(articleUrls));
}

function extractStoryLinks(source, html) {
  if (source.kind === "listing") {
    return source.extractLinks(html).slice(0, source.limit || 12);
  }

  return [];
}

async function buildStoryFromUrl({ url, sourceName, fallbackTitle = "", fallbackDescription = "", fallbackDate = "" }) {
  const meta = await extractArticleMeta(url);
  const title = normalizeText(meta.title || fallbackTitle);
  const description = normalizeText(meta.articleBody || meta.description || fallbackDescription || title);
  const timestamp = normalizeTimestampForStorage(meta.publishedAt || fallbackDate || new Date().toISOString());
  const siteName = meta.siteName || sourceName;
  const image = await persistRemoteImage(meta.image, uniqueSlug(timestamp.date || timestamp.publishedAt, title, url), url);

  return {
    title,
    date: timestamp.date || new Date().toISOString(),
    publishedAt: timestamp.publishedAt || timestamp.date,
    excerpt: description.slice(0, 280) || title,
    tags: Array.from(new Set(deriveTags(`${title} ${description}`, `${siteName} ${sourceName}`))),
    source: siteName || sourceName || "RSS feed",
    link: url,
    image,
    body: buildStoryBody({
      title,
      description,
      sourceName: siteName || sourceName || "Source",
      link: url
    })
  };
}

async function ingestRssFeeds() {
  const stories = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const feedName = feed.title || feedUrl;

      for (const item of feed.items.slice(0, 12)) {
        const title = item.title?.trim();
        const link = item.link?.trim();
        if (!title || !link) continue;

        const builtStory = await buildStoryFromUrl({
          url: link,
          sourceName: feedName,
          fallbackTitle: title,
          fallbackDescription: item.contentSnippet || item.summary || item.content || "",
          fallbackDate: item.isoDate || item.pubDate || ""
        });

        if (builtStory.title && isSingaporeTechStory(`${builtStory.title} ${builtStory.excerpt}`, builtStory.source, builtStory.link)) {
          stories.push({
            ...builtStory,
            source: feedName
          });
        }
      }
    } catch (error) {
      console.warn(`RSS feed failed: ${feedUrl}`);
      console.warn(error instanceof Error ? error.message : String(error));
    }
  }

  return stories;
}

async function ingestPageSources() {
  const stories = [];

  for (const source of PAGE_SOURCES) {
    try {
      const links =
        source.kind === "sitemap"
          ? await Promise.resolve(source.extractLinks())
          : await (async () => {
              const response = await fetch(source.url, {
                headers: {
                  "user-agent": "Mozilla/5.0 (compatible; SingaporeTechNewsBot/1.0)"
                }
              });

              if (!response.ok) {
                console.warn(`Page source failed: ${source.url}`);
                return [];
              }

              const html = await response.text();
              return source.extractLinks(html);
            })();

      const uniqueLinks = Array.from(new Set(links)).slice(0, source.limit || 12);

      for (const link of uniqueLinks) {
        const builtStory = await buildStoryFromUrl({
          url: link,
          sourceName: source.name,
          fallbackTitle: source.name,
          fallbackDescription: ""
        });

        if (builtStory.title && isSingaporeTechStory(`${builtStory.title} ${builtStory.excerpt}`, builtStory.source, builtStory.link)) {
          stories.push({
            ...builtStory,
            source: builtStory.source || source.name
          });
        }
      }
    } catch (error) {
      console.warn(`Page source failed: ${source.url}`);
      console.warn(error instanceof Error ? error.message : String(error));
    }
  }

  return stories;
}

async function ingestNewsApiFallback() {
  if (!NEWS_API_KEY) {
    return [];
  }

  const url = new URL(NEWS_API_URL);
  url.searchParams.set("q", NEWS_API_QUERY);
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "20");
  if (!url.searchParams.has("apiKey")) {
    url.searchParams.set("apiKey", NEWS_API_KEY);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`News API request failed with ${response.status}`);
  }

  const json = await response.json();
  const articles = Array.isArray(json.articles) ? json.articles : [];

  return Promise.all(
    articles
      .filter((article) => article?.title && article?.url)
      .filter((article) => isSingaporeTechStory(`${article.title} ${article.description || ""}`, String(article.source?.name || ""), String(article.url)))
      .map(async (article) => {
        const timestamp = normalizeTimestampForStorage(article.publishedAt || Date.now());

        return {
          title: article.title.trim(),
          date: timestamp.date || new Date().toISOString(),
          publishedAt: timestamp.publishedAt || timestamp.date,
          excerpt: String(article.description || article.content || article.title).replace(/\s+/g, " ").trim().slice(0, 220),
          tags: deriveTags(`${article.title} ${article.description || article.content || ""}`, String(article.source?.name || "")),
          source: String(article.source?.name || "News API"),
          link: String(article.url),
          image: await persistRemoteImage(
            String(article.urlToImage || (await extractImageUrl(article.url)) || ""),
            uniqueSlug(timestamp.date || timestamp.publishedAt || new Date().toISOString(), article.title, article.url),
            String(article.url)
          ),
          body: [
            `## Summary`,
            String(article.description || article.content || article.title),
            `## Why it matters`,
            `This fallback item was collected through the News API layer because it matched the Singapore tech keyword filter.`,
            `## Source`,
            String(article.url)
          ].join("\n\n")
        };
      })
  );
}

function dedupeStories(stories) {
  const seen = new Set();
  return stories.filter((story) => {
    const key = story.link || story.title;
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

async function main() {
  await ensureContentDir();

  const [rssStories, pageStories, apiStories] = await Promise.all([
    ingestRssFeeds(),
    ingestPageSources(),
    ingestNewsApiFallback()
  ]);
  const stories = dedupeStories([...rssStories, ...pageStories, ...apiStories]);

  let created = 0;
  for (const story of stories) {
    await saveStory({
      ...story,
      featured: false
    });
    created += 1;
  }

  console.log(`Ingestion complete. Prepared ${stories.length} stories, created ${created} new markdown files.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
