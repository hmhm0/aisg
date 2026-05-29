/**
 * Site-wide constants used by SEO surfaces (sitemap, robots, Open Graph,
 * canonical URLs, JSON-LD structured data).
 *
 * The production URL is read from `NEXT_PUBLIC_SITE_URL` so the same code
 * works on the Vercel deployment, custom domains, and local dev. Falls
 * back to the current Vercel URL.
 */

const FALLBACK_SITE_URL = "https://aisg-vert.vercel.app";

function normaliseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export const SITE_URL = normaliseUrl(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK_SITE_URL
);

export const SITE_NAME = "Singapore AI & Tech News";

export const SITE_TAGLINE =
  "Breaking news and in-depth analysis on Singapore's technology sector.";

export const SITE_DESCRIPTION =
  "Breaking news and in-depth analysis on Singapore's technology sector. Coverage includes AI adoption, startup ecosystem, government digital initiatives, cybersecurity, enterprise innovation, and policy developments.";

export const SITE_LOCALE = "en_SG";

export const DEFAULT_OG_IMAGE = "/news-images/placeholder-news.svg";

/**
 * Build an absolute URL from a path. Accepts both already-absolute URLs
 * (returned unchanged) and root-relative paths starting with "/".
 */
export function absoluteUrl(pathOrUrl: string) {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}
