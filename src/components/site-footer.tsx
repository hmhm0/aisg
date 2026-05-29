import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/search", label: "Search" },
  { href: "/archive", label: "Archive" },
  { href: "/newsletter", label: "Newsletter" }
] as const;

const categories = [
  { label: "Singapore", href: "/archive?tag=Singapore" },
  { label: "AI", href: "/archive?tag=AI" },
  { label: "GovTech", href: "/archive?tag=GovTech" },
  { label: "Startups", href: "/archive?tag=Startups" },
  { label: "Policy", href: "/archive?tag=Policy" },
  { label: "Cybersecurity", href: "/archive?tag=Cybersecurity" }
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white/45 pt-10">
      <div className="mx-auto max-w-[1440px] px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid items-start gap-x-12 gap-y-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <p className="font-display text-3xl text-slate-950">AISG</p>
            <p className="max-w-sm text-sm leading-7 text-slate-600">
              A calm Singapore technology desk covering AI, startups, public sector tech, and the stories shaping the local digital landscape.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Tags</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.label}
                  href={category.href as never}
                  className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-slate-950"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Quick Links</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              {footerLinks.map((item) => (
                <Link key={item.href} href={item.href} className="block transition hover:text-slate-950">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Subscribe</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              Stay updated with our latest stories and highlights.
            </p>
            <div className="mt-5">
              <NewsletterForm id="footer-newsletter-email" />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-200 pt-6 text-center text-sm text-slate-500">
          <p>© 2026 AISG. All rights reserved.</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <Link href="/about" className="transition hover:text-slate-950">
              About
            </Link>
            <Link href="/contact" className="transition hover:text-slate-950">
              Contact
            </Link>
            <Link href="/search" className="transition hover:text-slate-950">
              Search
            </Link>
            <Link href="/archive" className="transition hover:text-slate-950">
              Archive
            </Link>
            <Link href="/newsletter" className="transition hover:text-slate-950">
              Newsletter
            </Link>
            <Link href="/privacy" className="transition hover:text-slate-950">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-slate-950">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
