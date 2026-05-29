import Link from "next/link";
import { ArchiveBrowser } from "@/components/archive-browser";
import { getPosts } from "@/lib/news";

type Props = {
  searchParams?: Promise<{ page?: string; tag?: string }>;
};

function clampPage(value: string | undefined, totalPages: number) {
  const parsed = Number.parseInt(value || "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.min(parsed, totalPages);
}

export const metadata = {
  title: "Archive | Singapore AI & Tech News",
  description: "Browse the complete archive of Singapore AI, technology, startup, and GovTech news stories. Filter by topic, date, and source.",
  alternates: { canonical: "/archive" }
};

export default async function ArchivePage({ searchParams }: Props) {
  const posts = getPosts();
  const params = searchParams ? await searchParams : undefined;
  const selectedTag = params?.tag?.trim() || undefined;
  const filtered = selectedTag ? posts.filter((post) => post.tags.includes(selectedTag)) : posts;
  const totalPages = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = clampPage(params?.page, totalPages);

  const topTags = Array.from(new Set(posts.flatMap((post) => post.tags)))
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 8);

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2.25rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Archive</p>
            <h1 className="mt-3 text-4xl leading-tight text-slate-950 sm:text-5xl">A full index of Singapore&apos;s tech coverage.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Browse by tag, move through pages, and jump straight into any story. Everything here stays focused on Singapore technology and AI.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Quick links</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {topTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/archive?tag=${encodeURIComponent(tag)}` as never}
                  className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-stone-300 hover:bg-stone-100 hover:text-slate-950"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ArchiveBrowser posts={posts} selectedTag={selectedTag} currentPage={currentPage} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-stone-200 pt-6 text-sm">
          <Link href="/" className="rounded-full border border-stone-200 bg-white px-4 py-2 text-slate-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950">
            Back to homepage
          </Link>
          <Link href="/search" className="rounded-full border border-stone-200 bg-white px-4 py-2 text-slate-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950">
            Search stories
          </Link>
          <Link href="/newsletter" className="rounded-full border border-stone-200 bg-white px-4 py-2 text-slate-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950">
            Subscribe
          </Link>
        </div>
      </section>
    </main>
  );
}
