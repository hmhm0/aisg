import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleEngagementTracker } from "@/components/article-engagement-tracker";
import { RelatedStories } from "@/components/related-stories";
import { NewsImage } from "@/components/news-image";
import { getDisplayPublishedAt, getPostBySlug, getPosts } from "@/lib/news";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_LOCALE, SITE_NAME } from "@/lib/site";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function renderBody(body: string) {
  const blocks = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const elements: React.ReactNode[] = [];

  blocks.forEach((block, index) => {
    if (/^\*\*.+\*\*$/.test(block)) {
      elements.push(
        <p key={index} className="mt-6 text-base font-semibold text-slate-950">
          {block.replace(/^\*\*(.+)\*\*$/, "$1")}
        </p>
      );
      return;
    }

    if (block.startsWith("# ")) {
      elements.push(
        <h2 key={index} className="mt-8 text-2xl font-semibold text-slate-950">
          {block.replace(/^#\s+/, "")}
        </h2>
      );
      return;
    }

    if (block.startsWith("## ")) {
      elements.push(
        <h3 key={index} className="mt-6 text-xl font-semibold text-slate-950">
          {block.replace(/^##\s+/, "")}
        </h3>
      );
      return;
    }

    if (block.match(/^- /m)) {
      const items = block
        .split("\n")
        .map((line) => line.replace(/^- /, "").trim())
        .filter(Boolean);

      elements.push(
        <ul key={index} className="mt-5 space-y-3 text-slate-700">
          {items.map((item) => (
            <li key={item} className="leading-8">
              {item}
            </li>
          ))}
        </ul>
      );
      return;
    }

    elements.push(
      <p key={index} className="mt-5 text-base leading-8 text-slate-700">
        {block}
      </p>
    );
  });

  return elements;
}

export function generateStaticParams() {
  return getPosts().map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Story not found"
    };
  }

  const canonicalPath = `/news/${post.slug}`;
  const articleUrl = absoluteUrl(canonicalPath);
  const ogImage = post.image || DEFAULT_OG_IMAGE;
  const publishedTime = post.publishedAt || post.date;
  const ogTitle = post.title;
  const ogDescription = post.excerpt;

  return {
    title: ogTitle,
    description: ogDescription,
    keywords: post.tags,
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      type: "article",
      locale: SITE_LOCALE,
      url: articleUrl,
      siteName: SITE_NAME,
      title: ogTitle,
      description: ogDescription,
      publishedTime,
      tags: post.tags,
      images: [
        {
          url: ogImage,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage]
    }
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const hasImage = Boolean(post?.image);

  if (!post) {
    notFound();
  }

  const articleUrl = absoluteUrl(`/news/${post.slug}`);
  const articleImage = absoluteUrl(post.image || DEFAULT_OG_IMAGE);
  const publishedIso = (() => {
    const raw = post.publishedAt || post.date;
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? raw : parsed.toISOString();
  })();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl
    },
    headline: post.title,
    description: post.excerpt,
    image: [articleImage],
    datePublished: publishedIso,
    dateModified: publishedIso,
    author: {
      "@type": "Organization",
      name: post.source
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/")
    },
    keywords: post.tags.join(", "),
    isAccessibleForFree: true,
    inLanguage: "en-SG"
  };

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        // Structured data for Google rich results. Stringified once at render time.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="rounded-[2.25rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <ArticleEngagementTracker slug={post.slug} />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-sm text-slate-500 transition hover:text-slate-900">
            ← Back to homepage
          </Link>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={["mt-8 grid gap-6", hasImage ? "lg:grid-cols-[1.2fr_0.8fr]" : ""].join(" ")}>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              {getDisplayPublishedAt(post)} • {post.source}
            </p>
            <h1 className="text-4xl leading-tight text-slate-950 sm:text-5xl">{post.title}</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">{post.excerpt}</p>
          </div>

          {hasImage ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-100 lg:aspect-auto lg:min-h-[280px]">
              <NewsImage
                src={post.image}
                alt={post.title}
                className="object-cover"
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-8 border-t border-stone-200 pt-8 lg:grid-cols-[1fr_260px]">
          <div className="prose max-w-none prose-p:text-slate-700 prose-headings:text-slate-950 prose-li:text-slate-700 prose-a:text-slate-900">
            {renderBody(post.body)}
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Source link</p>
              <a
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex break-all text-sm text-slate-900 transition hover:text-slate-700"
              >
                Open original article
              </a>
            </div>
          </aside>
        </div>

        <RelatedStories posts={getPosts()} currentSlug={post.slug} currentTags={post.tags} />
      </article>
    </main>
  );
}
