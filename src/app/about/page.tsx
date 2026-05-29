import Link from "next/link";
import type { Metadata } from "next";
import { SITE_CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About | Singapore AI & Tech News",
  description:
    "AISG is a curated reading site for Singapore AI, GovTech, startup, and technology news. Short editorial summaries, full credit to the original publishers, and an editorial-first reading experience.",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <article className="rounded-[2.25rem] border border-stone-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.34em] text-slate-500">About</p>
        <h1 className="mt-3 text-4xl leading-tight text-slate-950 sm:text-5xl">A reader-first front page for Singapore tech.</h1>
        <p className="mt-6 text-lg leading-8 text-slate-700">
          {SITE_NAME} (AISG) is a curated technology desk for readers who want a clean, fast way to keep up with Singapore&apos;s AI, startup, and government technology stories without the noise.
        </p>

        <Section title="What we do">
          <p>
            We monitor a focused list of Singapore-relevant publishers, surface stories that genuinely belong on a tech desk, write a short editorial summary, and link readers straight to the original article. The goal is to act as a calmer second front page — not a replacement for the journalism happening at the source.
          </p>
        </Section>

        <Section title="What we cover">
          <ul>
            <li><strong>AI and machine learning:</strong> deployment in Singapore, governance, model launches, applied research.</li>
            <li><strong>Government technology:</strong> GovTech, IMDA, CSA, Smart Nation programs, public-sector platforms.</li>
            <li><strong>Startup ecosystem:</strong> founders, funding, M&amp;A, talent, accelerators, exits.</li>
            <li><strong>Cybersecurity:</strong> incidents, regulation, identity, privacy, and platform trust.</li>
            <li><strong>Digital policy:</strong> data, payments, telecoms, content moderation, cross-border rules.</li>
            <li><strong>Enterprise and infrastructure:</strong> cloud, semiconductors, data centres, fintech rails.</li>
          </ul>
          <p>
            We deliberately stay narrow. Lifestyle, entertainment, and broad consumer news are filtered out at the ingest layer so the front page stays useful.
          </p>
        </Section>

        <Section title="Where the stories come from">
          <p>
            Our current source mix includes Channel NewsAsia, Vulcan Post, HardwareZone, Mothership, OpenGov Asia, Microsoft Singapore, GovTech TechNews, GovInsider, and indexed coverage from The Straits Times, The Business Times, Tech in Asia, and e27. The list grows as we find Singapore-relevant publishers we trust.
          </p>
          <p>
            We do not republish articles. Each story on AISG names the original publisher prominently and links straight to the source. Full reporting credit belongs to the journalists who did the work.
          </p>
        </Section>

        <Section title="How we curate">
          <p>
            Stories are pulled regularly from the source list, filtered against a Singapore-tech relevance signal, and de-duplicated. We score reader engagement to surface the genuinely-read stories on the homepage, while the &ldquo;Latest stories&rdquo; section stays strictly chronological so nothing gets buried.
          </p>
          <p>
            The summaries — &ldquo;In brief&rdquo; and &ldquo;Why it matters&rdquo; — are written for orientation, not as a substitute for the original article. If a story matters to you, please open the source link.
          </p>
        </Section>

        <Section title="Editorial principles">
          <ul>
            <li><strong>Credit the source.</strong> Every story names the publisher and links out.</li>
            <li><strong>Stay narrow.</strong> Singapore tech, AI, and adjacent policy. Other beats stay off the front page.</li>
            <li><strong>Be quiet.</strong> No popups, no autoplay, no engagement bait. The reading experience is the product.</li>
            <li><strong>Respect attention.</strong> Summaries should orient quickly; depth lives at the source.</li>
            <li><strong>Move fast on corrections.</strong> Email us and we&apos;ll fix.</li>
          </ul>
        </Section>

        <Section title="Get in touch">
          <p>
            For story tips, source suggestions, takedowns, or corrections, email{" "}
            <a className="underline" href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>. For data and privacy questions, see our{" "}
            <Link href="/privacy" className="underline">privacy policy</Link>.
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
