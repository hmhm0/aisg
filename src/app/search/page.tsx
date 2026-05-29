import Link from "next/link";
import { NewsSearch } from "@/components/news-search";
import { getPosts, getTagCounts } from "@/lib/news";

export const metadata = {
  title: "Search | Singapore AI & Tech News",
  description: "Search Singapore's AI, technology, startup, and GovTech news archive by keyword, source, topic, or date."
};

export default function SearchPage() {
  const posts = getPosts();
  const tagCounts = getTagCounts(posts);
  const trendingTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag)
    .slice(0, 8);
  const recentPosts = posts.slice(0, 4);

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2.25rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Search</p>
            <h1 className="mt-3 text-4xl leading-tight text-slate-950 sm:text-5xl">Search the archive with room to breathe.</h1>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            Use a keyword, topic, or source name to find stories quickly. The search page stays focused on reading rather than settings.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]">
          <NewsSearch posts={posts} />

          <aside className="space-y-6">
            <section className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Popular topics</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Jump into a theme</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/archive?tag=${encodeURIComponent(tag)}` as never}
                    className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-stone-300 hover:bg-stone-100 hover:text-slate-950"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-stone-200 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Recent stories</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Latest entries</h2>
              <div className="mt-4 space-y-4">
                {recentPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/news/${post.slug}`}
                    className="block rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4 transition hover:border-stone-300 hover:bg-stone-100"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{post.displayDate}</p>
                    <h3 className="mt-2 text-sm font-semibold leading-6 text-slate-900">{post.title}</h3>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-stone-200 pt-6 text-sm">
          <Link href="/" className="rounded-full border border-stone-200 bg-white px-4 py-2 text-slate-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950">
            Back to homepage
          </Link>
          <Link href="/archive" className="rounded-full border border-stone-200 bg-white px-4 py-2 text-slate-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950">
            Open archive
          </Link>
          <Link href="/newsletter" className="rounded-full border border-stone-200 bg-white px-4 py-2 text-slate-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950">
            Join newsletter
          </Link>
        </div>
      </section>
    </main>
  );
}
