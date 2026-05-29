import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Generates /robots.txt at request time.
 *
 * Allows all major crawlers, blocks the engagement API surface (which
 * has no SEO value), and points at the dynamic sitemap so search engines
 * can discover articles as they're added.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"]
      }
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/")
  };
}
