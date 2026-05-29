import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";

export const metadata = {
  title: "Newsletter | Singapore AI & Tech News",
  description: "Subscribe to our daily newsletter for curated Singapore AI, tech, startup, and GovTech news delivered to your inbox."
};

const highlights = [
  {
    title: "A readable morning brief",
    description: "A calm, focused digest of the most relevant Singapore AI, startup, GovTech, and technology policy stories."
  },
  {
    title: "Curated with care",
    description: "Every story is filtered for Singapore relevance and rewritten in a clear, newsroom style for easy reading."
  },
  {
    title: "No clutter",
    description: "Clean, distraction-free reading experience. Just the stories that matter to Singapore's tech ecosystem."
  }
];

export default function NewsletterPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2.25rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Newsletter</p>
            <h1 className="mt-3 text-4xl leading-tight text-slate-950 sm:text-5xl">Get the day&apos;s most useful Singapore tech stories in one calm digest.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              The newsletter is designed to feel like a newsroom desk note: short, warm, and focused on what matters to readers.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                  <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Subscribe</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Join the list</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Enter your email and we&apos;ll take you to a confirmation page. The provider integration can be wired in once the Beehiiv endpoint is ready.
            </p>
            <div className="mt-5">
              <NewsletterForm id="newsletter-page-email" />
            </div>
          </aside>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-stone-200 pt-6 text-sm">
          <Link href="/" className="rounded-full border border-stone-200 bg-white px-4 py-2 text-slate-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950">
            Back to homepage
          </Link>
          <Link href="/search" className="rounded-full border border-stone-200 bg-white px-4 py-2 text-slate-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950">
            Search stories
          </Link>
          <Link href="/archive" className="rounded-full border border-stone-200 bg-white px-4 py-2 text-slate-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950">
            Browse archive
          </Link>
        </div>
      </section>
    </main>
  );
}
