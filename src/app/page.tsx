import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { TagFilterPills } from "@/components/tag-filter-pills";
import { StoryCard } from "@/components/story-card";
import { NewsImage } from "@/components/news-image";
import { loadEngagementEvents, rankPopularPosts, rankTopReadPosts } from "@/lib/engagement";
import { getPosts, getTagCounts } from "@/lib/news";
import type { NewsPost } from "@/lib/types";

export const dynamic = "force-dynamic";

const LATEST_PAGE_SIZE = 10;
const sectionLinks = [
  ["/#top-stories", "Top stories"],
  ["/#latest-news", "Latest News"],
  ["/#topics", "Topics"],
  ["/about", "About"],
  ["/contact", "Contact"]
] as const;

function clampPage(value: string | undefined, totalPages: number) {
  const parsed = Number.parseInt(value || "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.min(parsed, totalPages);
}

function buildPageHref(page: number, tag?: string) {
  const query: Record<string, string> = {};
  if (tag) {
    query.tag = tag;
  }

  if (page > 1) {
    query.page = String(page);
  }

  return Object.keys(query).length ? { pathname: "/", query } : "/";
}

function PageNumbers({
  currentPage,
  totalPages,
  selectedTag
}: {
  currentPage: number;
  totalPages: number;
  selectedTag?: string;
}) {
  const visiblePages = (() => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set<number>([1, totalPages, currentPage]);
    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);
    if (currentPage > 2) pages.add(2);
    if (currentPage < totalPages - 1) pages.add(totalPages - 1);
    return Array.from(pages).sort((a, b) => a - b);
  })();

  return (
    <nav aria-label="Story pages" className="flex flex-wrap items-center justify-center gap-2">
      <Link
        href={buildPageHref(Math.max(1, currentPage - 1), selectedTag)}
        className={[
          "rounded-full border px-4 py-2 text-sm transition",
          currentPage === 1
            ? "pointer-events-none border-stone-200 bg-stone-50 text-slate-300"
            : "border-stone-200 bg-white text-slate-600 hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950"
        ].join(" ")}
      >
        Prev
      </Link>

      {visiblePages.map((page, index) => {
        const previous = visiblePages[index - 1];
        const active = page === currentPage;
        const gap = previous && page - previous > 1;

        return (
          <span key={page} className="inline-flex items-center gap-2">
            {gap ? <span className="px-1 text-slate-400">…</span> : null}
            <Link
              href={buildPageHref(page, selectedTag)}
              aria-current={active ? "page" : undefined}
              className={[
                "min-w-10 rounded-full border px-4 py-2 text-sm transition",
                active
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-stone-200 bg-white text-slate-600 hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950"
              ].join(" ")}
            >
              {page}
            </Link>
          </span>
        );
      })}

      <Link
        href={buildPageHref(Math.min(totalPages, currentPage + 1), selectedTag)}
        className={[
          "rounded-full border px-4 py-2 text-sm transition",
          currentPage === totalPages
            ? "pointer-events-none border-stone-200 bg-stone-50 text-slate-300"
            : "border-stone-200 bg-white text-slate-600 hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950"
        ].join(" ")}
      >
        Next
      </Link>
    </nav>
  );
}

function CompactRead({ post }: { post: NewsPost }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="group flex items-start gap-4 py-3 transition first:pt-0 last:pb-0 hover:opacity-90"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[0.8rem] border border-stone-200 bg-stone-100">
        <NewsImage
          src={post.image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="64px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[0.72rem] font-medium leading-[1.15] text-slate-900 transition group-hover:text-slate-950 line-clamp-2 md:text-[0.74rem]">
          {post.title}
        </p>
      </div>
    </Link>
  );
}

export default async function HomePage({
  searchParams
}: {
  searchParams?: Promise<{ page?: string; tag?: string }>;
}) {
  const posts = getPosts();
  const params = searchParams ? await searchParams : undefined;
  const selectedTag = params?.tag?.trim() || undefined;
  const filteredPosts = selectedTag ? posts.filter((post) => post.tags.includes(selectedTag)) : posts;
  const engagementEvents = await loadEngagementEvents();
  const lead = rankTopReadPosts(filteredPosts, engagementEvents)[0] ?? filteredPosts[0];
  const latestPosts = filteredPosts.filter((post) => post.slug !== lead?.slug);
  const filteredTotalPages = Math.max(1, Math.ceil(latestPosts.length / LATEST_PAGE_SIZE));
  const currentPage = clampPage(params?.page, filteredTotalPages);
  const startIndex = (currentPage - 1) * LATEST_PAGE_SIZE;
  const pagePosts = latestPosts.slice(startIndex, startIndex + LATEST_PAGE_SIZE);

  const railPosts = rankPopularPosts(filteredPosts, engagementEvents)
    .filter((post) => post.slug !== lead?.slug)
    .slice(0, 4);
  const tagCounts = getTagCounts(posts);
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag)
    .slice(0, 8);
  const visibleTags = selectedTag && !topTags.includes(selectedTag) ? [selectedTag, ...topTags] : topTags;

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-stone-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] scroll-mt-28">
        <div className="absolute inset-0 textural-grid opacity-40" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />

        <div className="relative flex flex-col gap-4 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl leading-tight text-slate-950 sm:text-4xl">Singapore&apos;s leading AI and technology news platform.</h1>
          </div>

          <div className="max-w-xl text-sm leading-7 text-slate-600">
            Breaking news and in-depth analysis on Singapore&apos;s technology sector. Coverage includes AI adoption, startup ecosystem, government digital initiatives, cybersecurity, enterprise innovation, and policy developments shaping the region&apos;s digital future.
          </div>
        </div>
      </section>

      <nav className="sticky top-[73px] z-30 mt-5 rounded-[1.75rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,248,243,0.92))] px-4 py-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl scroll-mt-28 sm:px-5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {sectionLinks.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,248,243,0.96))] px-4 py-2.5 text-sm font-medium tracking-[-0.01em] text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition duration-300 hover:-translate-y-0.5 hover:border-stone-300 hover:text-slate-950 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <section id="top-stories" className="mt-8 scroll-mt-36">
        <div className="flex items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Today&apos;s top read</h2>
          </div>
        </div>

        {lead ? (
          <StoryCard post={lead} featured />
        ) : (
          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 text-sm leading-7 text-slate-600">
            {selectedTag ? (
              <>
                No stories match this tag right now. Try a different tag or return to{" "}
                <Link href="/" className="font-semibold text-slate-900 underline underline-offset-4">
                  all stories
                </Link>
                .
              </>
            ) : (
              "No stories are available right now."
            )}
          </div>
        )}
      </section>

      <section id="latest-news" className="mt-12 scroll-mt-36">
        <div className="flex items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Latest stories</h2>
          </div>
        </div>

        <div className="mt-6 grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1.75fr)_360px]">
          <div className="min-w-0">
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
              {pagePosts.length > 0 ? (
                pagePosts.map((post) => <StoryCard key={post.slug} post={post} />)
              ) : (
                <div className="col-span-full rounded-[1.75rem] border border-stone-200 bg-white p-5 text-sm leading-7 text-slate-600">
                  {selectedTag
                    ? "No more latest stories are available for this tag right now."
                    : "No more latest stories are available on this page."}
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-center border-t border-stone-200 pt-6">
              <PageNumbers currentPage={currentPage} totalPages={filteredTotalPages} selectedTag={selectedTag} />
            </div>
          </div>

          <aside className="space-y-6">
            <section id="topics" className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] scroll-mt-36">
              <h2 className="text-lg font-semibold text-slate-950">Browse by tags</h2>
              <TagFilterPills tags={visibleTags} selectedTag={selectedTag} />
            </section>

            <section className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              <h2 className="text-lg font-semibold text-slate-950">Popular Articles</h2>

              <div className="mt-4 divide-y divide-stone-100">
                {railPosts.map((post) => (
                  <CompactRead key={post.slug} post={post} />
                ))}
              </div>
            </section>

            <section id="newsletter" className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] scroll-mt-36">
              <h2 className="text-lg font-semibold text-slate-950">Newsletter</h2>
              <p className="mt-2 text-sm text-slate-600">Get the latest news and updates delivered to your inbox.</p>
              <div className="mt-4">
                <NewsletterForm />
              </div>
            </section>
          </aside>
        </div>
      </section>

    </main>
  );
}
