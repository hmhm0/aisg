import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[rgba(250,248,243,0.9)] backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="inline-flex items-baseline gap-3">
            <span className="font-display text-2xl leading-none text-slate-950">AISG</span>
            <span className="hidden text-[0.68rem] uppercase tracking-[0.34em] text-slate-500 sm:inline">
              Singapore AI & Tech News
            </span>
          </Link>

          <Link
            href="/search"
            aria-label="Search stories"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-slate-600 shadow-[0_6px_18px_rgba(15,23,42,0.04)] transition hover:bg-stone-100 hover:text-slate-950"
          >
            <span className="text-lg leading-none">⌕</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
