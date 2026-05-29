import Link from "next/link";
import type { Metadata } from "next";
import { SITE_CONTACT_EMAIL, SITE_LAST_UPDATED, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Singapore AI & Tech News",
  description:
    "How AISG handles visitor data, cookies, analytics, and newsletter subscriptions. Compliant with Singapore PDPA and standard EU GDPR practices.",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <article className="rounded-[2.25rem] border border-stone-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Privacy Policy</p>
        <h1 className="mt-3 text-4xl leading-tight text-slate-950 sm:text-5xl">How we handle your data.</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: {SITE_LAST_UPDATED}</p>

        <p className="mt-8 text-base leading-8 text-slate-700">
          {SITE_NAME} (&ldquo;AISG&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a curated reading site for Singapore technology news. We aim to collect as little personal data as the site needs to function. This page explains exactly what we collect, why, and what your choices are.
        </p>

        <Section title="What we collect">
          <p>
            We collect three types of information, all of which are minimised by design:
          </p>
          <ul>
            <li>
              <strong>Anonymous visit data.</strong> Page views, referrer, country, browser, and approximate device type, captured by Vercel Analytics. This data is aggregated and contains no information that identifies you personally.
            </li>
            <li>
              <strong>Engagement signals.</strong> When you open an article, the site records that the article was viewed once per browser session. This is stored as a slug and a timestamp only — no IP address, user agent, or cookie is attached. We use this to power the &ldquo;Today&apos;s top read&rdquo; and &ldquo;Popular Articles&rdquo; surfaces on the homepage.
            </li>
            <li>
              <strong>Newsletter email.</strong> If you submit your email through the newsletter form, we record that email so we can deliver the newsletter. You can unsubscribe at any time.
            </li>
          </ul>
        </Section>

        <Section title="What we do not collect">
          <p>
            We do not run third-party advertising trackers, fingerprinting scripts, or social pixels. We do not sell, rent, or share visitor data with brokers. We do not build profiles of individual readers.
          </p>
        </Section>

        <Section title="Cookies and storage">
          <p>
            The site uses one piece of browser storage:
          </p>
          <ul>
            <li>
              A <code>sessionStorage</code> entry per article you visit, used to make sure each article only counts once per session in the engagement tally. This entry is cleared when you close the tab.
            </li>
          </ul>
          <p>
            Vercel Analytics may set a single first-party identifier for visit deduplication. It does not follow you across other sites and is automatically deleted by Vercel after 30 days.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>
            We use a small number of third-party services to operate the site:
          </p>
          <ul>
            <li>
              <strong>Vercel</strong> hosts the site and provides anonymous analytics.{" "}
              <a className="underline" href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel privacy policy</a>.
            </li>
            <li>
              <strong>Upstash</strong> stores anonymous engagement counts.{" "}
              <a className="underline" href="https://upstash.com/trust/privacy.pdf" target="_blank" rel="noreferrer">Upstash privacy policy</a>.
            </li>
            <li>
              <strong>Google Search Console</strong> for search-performance insights about our own URLs. Search Console does not receive personal data about visitors.
            </li>
          </ul>
          <p>
            Article body text and images may be loaded from the original publishers we link to (such as Channel NewsAsia, Vulcan Post, GovTech, and others). Visiting those external links is governed by their privacy policies.
          </p>
        </Section>

        <Section title="Your rights (PDPA and GDPR)">
          <p>
            Under Singapore&apos;s Personal Data Protection Act and the EU General Data Protection Regulation, you have the right to ask us:
          </p>
          <ul>
            <li>What personal data we hold about you.</li>
            <li>To correct or delete that data.</li>
            <li>To withdraw your consent (for example, by unsubscribing from the newsletter).</li>
          </ul>
          <p>
            For any of the above, email us at <a className="underline" href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a> with the subject line &ldquo;Data request&rdquo;.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If our practices change in any meaningful way, we will update the &ldquo;Last updated&rdquo; date at the top of this page and, where appropriate, post a note on the homepage.
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
