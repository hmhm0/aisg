"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Props = {
  tags: string[];
  selectedTag?: string;
};

function buildHref(searchParams: ReturnType<typeof useSearchParams>, nextTag?: string) {
  const params = new URLSearchParams(searchParams.toString());

  if (nextTag) {
    params.set("tag", nextTag);
  } else {
    params.delete("tag");
  }

  params.delete("page");

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function TagFilterPills({ tags, selectedTag }: Props) {
  const searchParams = useSearchParams();

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Link
        href={buildHref(searchParams, undefined) as never}
        className={[
          "rounded-full border px-4 py-2 text-sm transition",
          !selectedTag
            ? "border-slate-950 bg-slate-950 text-white"
            : "border-stone-200 bg-white text-slate-600 hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950"
        ].join(" ")}
      >
        All
      </Link>

      {tags.map((tag) => {
        const active = tag === selectedTag;

        return (
          <Link
            key={tag}
            href={buildHref(searchParams, active ? undefined : tag) as never}
            className={[
              "rounded-full border px-4 py-2 text-sm transition",
              active
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-stone-200 bg-white text-slate-600 hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950"
            ].join(" ")}
          >
            {tag}
          </Link>
        );
      })}
    </div>
  );
}
