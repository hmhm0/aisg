import Link from "next/link";
import type { NewsPost } from "@/lib/types";

type Props = {
  posts: NewsPost[];
  selectedTag?: string;
  currentPage: number;
};

const PAGE_SIZE = 6;

function getUniqueTags(posts: NewsPost[]) {
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b));
}

function buildArchiveHref(selectedTag?: string, nextPage = 1) {
  const params = new URLSearchParams();

  if (selectedTag) {
    params.set("tag", selectedTag);
  }

  if (nextPage > 1) {
    params.set("page", String(nextPage));
  }

  const query = params.toString();
  return query ? `/archive?${query}` : "/archive";
}

export function ArchiveBrowser({ posts, selectedTag, currentPage }: Props) {
  const tags = Array.from(new Set(["All", ...getUniqueTags(posts)])).sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return a.localeCompare(b);
  });

  const filtered = selectedTag ? posts.filter((post) => post.tags.includes(selectedTag)) : posts;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const pagedPosts = filtered.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

  const visiblePages = (() => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set<number>([1, totalPages, safeCurrentPage]);
    if (safeCurrentPage > 1) pages.add(safeCurrentPage - 1);
    if (safeCurrentPage < totalPages) pages.add(safeCurrentPage + 1);
    if (safeCurrentPage > 2) pages.add(2);
    if (safeCurrentPage < totalPages - 1) pages.add(totalPages - 1);
    return Array.from(pages).sort((a, b) => a - b);
  })();

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Archive</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Browse the full story index</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Filter by tag, move through pages, and jump directly to any story that catches your eye.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-600">
            Showing {filtered.length} story{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = tag === selectedTag || (!selectedTag && tag === "All");
            const href = tag === "All" ? buildArchiveHref(undefined, 1) : buildArchiveHref(tag, 1);

            return (
              <Link
                key={tag}
                href={href as never}
                className={[
                  "rounded-full border px-4 py-2 text-sm transition",
                  active
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-stone-200 bg-white text-slate-600 hover:border-stone-300 hover:bg-stone-50 hover:text-slate-900"
                ].join(" ")}
              >
                {tag}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pagedPosts.length > 0 ? pagedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/news/${post.slug}`}
            className="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white transition hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
          >
            <div className="p-4">
              <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
                <span>{post.displayDate}</span>
                <span>•</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-slate-900 transition group-hover:text-slate-950">{post.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        )) : (
          <div className="col-span-full rounded-[1.75rem] border border-stone-200 bg-white p-6 text-sm leading-7 text-slate-600">
            No stories are available for this tag or page yet. Try another tag or go back to page 1.
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-stone-200 bg-white px-4 py-4">
        <Link
          href={buildArchiveHref(selectedTag, Math.max(1, safeCurrentPage - 1)) as never}
          className={[
            "rounded-full border px-4 py-2 text-sm transition",
            safeCurrentPage === 1
              ? "pointer-events-none border-stone-200 bg-stone-50 text-slate-300"
              : "border-stone-200 bg-white text-slate-700 hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950"
          ].join(" ")}
        >
          Previous
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {visiblePages.map((page, index) => {
            const previous = visiblePages[index - 1];
            const gap = previous && page - previous > 1;
            const active = page === safeCurrentPage;

            return (
              <span key={page} className="inline-flex items-center gap-2">
                {gap ? <span className="px-1 text-slate-400">…</span> : null}
                <Link
                  href={buildArchiveHref(selectedTag, page) as never}
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
        </div>

        <Link
          href={buildArchiveHref(selectedTag, Math.min(totalPages, safeCurrentPage + 1)) as never}
          className={[
            "rounded-full border px-4 py-2 text-sm transition",
            safeCurrentPage === totalPages
              ? "pointer-events-none border-stone-200 bg-stone-50 text-slate-300"
              : "border-stone-200 bg-white text-slate-700 hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950"
          ].join(" ")}
        >
          Next
        </Link>
      </div>
    </section>
  );
}
