import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Singapore AI & Tech News",
  description: "Get in touch with tips, story suggestions, corrections, or collaboration ideas for Singapore's AI and technology news platform.",
  alternates: { canonical: "/contact" }
};

export default function ContactPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2.25rem] border border-stone-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Contact</p>
        <h1 className="mt-3 text-4xl leading-tight text-slate-950 sm:text-5xl">Reach out with a tip, correction, or collaboration idea.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          If you have a Singapore technology story worth tracking, a source suggestion, or feedback about the layout and coverage, we&apos;d love to hear it.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Email</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">hello@aisg.news</p>
          </div>

          <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Topics of interest</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              AI, GovTech, startups, digital policy, cybersecurity, and source suggestions from Singapore-focused publications.
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
