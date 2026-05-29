import Link from "next/link";
import type { Metadata } from "next";
import { SITE_CONTACT_EMAIL, SITE_LAST_UPDATED, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use | Singapore AI & Tech News",
  description:
    "Terms of use for AISG, including editorial principles, source attribution, third-party content, and fair-use guidelines.",
  alternates: { canonical: "/terms" }
};

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <article className="rounded-[2.25rem] border border-stone-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Terms of Use</p>
        <h1 className="mt-3 text-4xl leading-tight text-slate-950 sm:text-5xl">Using AISG.</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: {SITE_LAST_UPDATED}</p>

        <p className="mt-8 text-base leading-8 text-slate-700">
          {SITE_NAME} is a reader-first aggregator that curates Singapore-relevant AI and technology news. By using this site, you agree to the terms below. They are short, written in plain language, and exist to make the site&apos;s relationship with publishers and readers explicit.
        </p>

        <Section title="What this site is">
          <p>
            AISG is a curated front page. We surface stories from established Singapore technology publishers, present a short editorial summary, and link readers to the original article. We do not republish full articles. We do not claim authorship of the underlying reporting.
          </p>
        </Section>

        <Section title="Source attribution and copyright">
          <p>
            Every story on AISG names the original publisher and links to the source article. Headlines, excerpts, and short summaries are used under fair-use principles for the purpose of curation and commentary. All copyrights belong to the original publishers.
          </p>
          <p>
            If you are a publisher and would like a story removed, your link adjusted, or any aspect of your coverage corrected, email us at{" "}
            <a className="underline" href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a> and we will respond within a few business days.
          </p>
        </Section>

        <Section title="Editorial summaries">
          <p>
            The &ldquo;In brief&rdquo; and &ldquo;Why it matters&rdquo; sections on each story are short editorial framings written for AISG. They are intended as a quick orientation, not a replacement for the original reporting. For accuracy, depth, and the reporter&apos;s full perspective, please follow the source link.
          </p>
        </Section>

        <Section title="No professional advice">
          <p>
            Nothing on AISG should be taken as legal, financial, medical, or professional advice. Stories cover policy, regulation, and technology, but the framing is journalistic, not advisory.
          </p>
        </Section>

        <Section title="Third-party links and content">
          <p>
            AISG links to external publishers. We do not control those websites and are not responsible for their content, accuracy, or policies. Visiting external links is at your own discretion.
          </p>
        </Section>

        <Section title="Acceptable use">
          <p>
            You may read, share, and link to AISG pages freely. Please do not:
          </p>
          <ul>
            <li>Scrape the site at scale or attempt to bypass rate limits.</li>
            <li>Republish AISG&apos;s editorial summaries verbatim without credit and a link back.</li>
            <li>Misrepresent AISG content as your own original reporting.</li>
          </ul>
        </Section>

        <Section title="Changes">
          <p>
            We may update these terms from time to time. The &ldquo;Last updated&rdquo; date at the top of this page reflects the most recent revision.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            These terms are governed by the laws of the Republic of Singapore. Any disputes arising from use of the site will be handled under Singapore jurisdiction.
          </p>
        </Section>

        <div className="mt-12 border-t border-stone-200 pt-6">
          <Link href="/" className="text-sm text-slate-500 transition hover:text-slate-950">
            ← Back to homepage
          </Link>
        </div>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-8 text-slate-700 [&_li]:leading-8 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </div>
    </section>
  );
}
