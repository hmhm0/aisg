"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { NewsPost } from "@/lib/types";

type Props = {
  posts: NewsPost[];
};

export function NewsSearch({ posts }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return posts;
    }

    return posts.filter((post) => {
      const haystack = [post.title, post.excerpt, post.source, post.tags.join(" ")].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }, [posts, query]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:flex-row md:items-end">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Search archive</p>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search AI, startups, policy, chips..."
            className="mt-3 w-full border-b border-stone-200 bg-transparent pb-3 text-xl text-slate-900 outline-none placeholder:text-slate-400 focus:border-stone-400"
          />
        </div>
        <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-600">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length > 0 ? filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/news/${post.slug}`}
            className="group rounded-[1.75rem] border border-stone-200 bg-white p-5 transition hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
          >
            <div className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] text-slate-500">
              <span>{post.displayDate}</span>
              <span>•</span>
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900 transition group-hover:text-slate-950">{post.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        )) : (
          <div className="col-span-full rounded-[1.75rem] border border-stone-200 bg-white p-6 text-sm leading-7 text-slate-600">
            No stories matched that search. Try a shorter keyword, a source name, or a tag from the sidebar.
          </div>
        )}
      </div>
    </section>
  );
}
