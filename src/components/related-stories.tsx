import Link from "next/link";
import type { NewsPost } from "@/lib/types";

type Props = {
  posts: NewsPost[];
  currentSlug: string;
  currentTags: string[];
};

export function RelatedStories({ posts, currentSlug, currentTags }: Props) {
  const related = posts
    .filter((post) => post.slug !== currentSlug)
    .sort((a, b) => {
      const aScore = a.tags.filter((tag) => currentTags.includes(tag)).length;
      const bScore = b.tags.filter((tag) => currentTags.includes(tag)).length;
      return bScore - aScore || b.date.localeCompare(a.date);
    })
    .slice(0, 3);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Related stories</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">More to read</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/news/${post.slug}`}
            className="rounded-[1.5rem] border border-stone-200 bg-white p-4 transition hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{post.displayDate}</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{post.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
