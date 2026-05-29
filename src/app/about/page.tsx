import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Singapore AI & Tech News",
  description: "Learn about AISG: a curated platform for Singapore's AI, GovTech, startup, and technology news. Clean, editorial coverage focused on clarity and relevance."
};

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2.25rem] border border-stone-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.34em] text-slate-500">About</p>
        <h1 className="mt-3 text-4xl leading-tight text-slate-950 sm:text-5xl">A calmer way to read Singapore&apos;s tech news.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          AISG is built to gather Singapore-relevant AI and technology stories into a clean, editorial front page. The focus is on clarity, usefulness, and a reading experience that feels more like a newsroom than a dashboard.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6">
            <h2 className="text-2xl font-semibold text-slate-950">What we cover</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              AI, GovTech, startups, digital policy, cybersecurity, infrastructure, and the broader technology changes shaping life and work in Singapore.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6">
            <h2 className="text-2xl font-semibold text-slate-950">How it works</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Stories are collected from Singapore-relevant sources, filtered for tech relevance, then surfaced in a reader-first layout with clean summaries and source links.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-sm text-slate-500 transition hover:text-slate-950">
            ← Back to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
