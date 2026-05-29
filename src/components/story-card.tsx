import Link from "next/link";
import { getDisplayPublishedAt } from "@/lib/news";
import type { NewsPost } from "@/lib/types";
import { NewsImage } from "@/components/news-image";

type Props = {
  post: NewsPost;
  featured?: boolean;
};

export function StoryCard({ post, featured = false }: Props) {
  const displayDate = getDisplayPublishedAt(post);

  return (
    <article
      className={[
        "group relative self-start overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]",
        featured ? "md:col-span-2" : "h-[294px]"
      ].join(" ")}
    >
      <Link href={`/news/${post.slug}`} className="block h-full">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent opacity-0 transition group-hover:opacity-100" />

        {featured ? (
          <div className="flex h-full flex-col lg:grid lg:gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-between p-5 sm:p-6 lg:p-7">
              <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
                <span>{displayDate}</span>
                <span>•</span>
                <span className="max-w-[14rem] truncate">{post.source}</span>
              </div>

              <div className="mt-6 space-y-4">
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-500">Today&apos;s top read</p>
                <h3 className="text-3xl leading-[1.02] text-slate-900 transition group-hover:text-slate-950 sm:text-4xl xl:text-[2.9rem]">
                  {post.title}
                </h3>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[0.7rem] text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative min-h-[280px] overflow-hidden border-t border-stone-200 bg-stone-100 lg:border-l lg:border-t-0">
              <NewsImage
                src={post.image}
                alt={post.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="relative h-40 w-full overflow-hidden border-b border-stone-200 bg-stone-100">
              <NewsImage
                src={post.image}
                alt={post.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/15 via-transparent to-transparent" />
            </div>

            <div className="flex flex-1 flex-col justify-between p-3">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">
                  <span>{displayDate}</span>
                  <span>•</span>
                  <span className="max-w-[10rem] truncate">{post.source}</span>
                </div>

                <h3 className="mt-1.5 text-sm font-semibold leading-snug text-slate-900 transition group-hover:text-slate-950 line-clamp-2">
                  {post.title}
                </h3>

                <p className="mt-1 text-xs leading-4 text-slate-600 line-clamp-1">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[0.6rem] text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Link>
    </article>
  );
}
