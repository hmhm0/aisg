import Link from "next/link";

type Props = {
  searchParams?: Promise<{ email?: string }>;
};

export const metadata = {
  title: "Thanks for Subscribing | Singapore AI & Tech News",
  description: "You've successfully subscribed to Singapore's leading AI and tech news newsletter."
};

export default async function NewsletterThanksPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : undefined;
  const email = params?.email?.trim();

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2.25rem] border border-stone-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Newsletter</p>
        <h1 className="mt-3 text-4xl leading-tight text-slate-950 sm:text-5xl">Thanks for joining the list.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Your signup flow is ready. Once the Beehiiv endpoint is connected, this page can become the final confirmation step for live subscriptions.
        </p>

        {email ? (
          <div className="mt-8 rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5 text-sm text-slate-600">
            <span className="font-semibold text-slate-950">Email captured:</span> {email}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link href="/" className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5 transition hover:border-stone-300 hover:bg-stone-100">
            <h2 className="text-lg font-semibold text-slate-950">Back to stories</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Return to the homepage and keep reading the latest coverage.</p>
          </Link>
          <Link href="/search" className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5 transition hover:border-stone-300 hover:bg-stone-100">
            <h2 className="text-lg font-semibold text-slate-950">Search archive</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Look up stories by keyword, source, or topic.</p>
          </Link>
          <Link href="/archive" className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5 transition hover:border-stone-300 hover:bg-stone-100">
            <h2 className="text-lg font-semibold text-slate-950">Browse archive</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Move through the full story index with tags and pages.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
