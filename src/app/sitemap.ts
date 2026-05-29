import type { MetadataRoute } from "next";
import { getPosts, getTagCounts } from "@/lib/news";
import { absoluteUrl } from "@/lib/site";

/**
 * Generates /sitemap.xml at build/request time.
 *
 * Includes the homepage, every article, every tag-filtered archive page,
 * and the static surfaces. Article entries use the article's published
 * date so search engines can prioritise fresh content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1.0
    },
    {
      url: absoluteUrl("/archive"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.8
    },
    {
      url: absoluteUrl("/search"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4
    },
    {
      url: absoluteUrl("/newsletter"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3
    }
  ];

  const articleEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const lastModifiedSource = post.publishedAt || post.date;
    const parsed = new Date(lastModifiedSource);
    return {
      url: absoluteUrl(`/news/${post.slug}`),
      lastModified: Number.isNaN(parsed.getTime()) ? now : parsed,
      changeFrequency: "weekly",
      priority: 0.7
    };
  });

  const tagEntries: MetadataRoute.Sitemap = Object.keys(getTagCounts(posts)).map((tag) => ({
    url: `${absoluteUrl("/archive")}?tag=${encodeURIComponent(tag)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5
  }));

  return [...staticEntries, ...articleEntries, ...tagEntries];
}
