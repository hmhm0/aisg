"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id?: string;
};

export function NewsletterForm({ id = "newsletter-email" }: Props) {
  const [email, setEmail] = useState("");
  const router = useRouter();

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/newsletter/thanks?email=${encodeURIComponent(email.trim())}`);
      }}
    >
      <label className="sr-only" htmlFor={id}>
        Email address
      </label>
      <input
        id={id}
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email"
        autoComplete="email"
        required
        className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-stone-300 focus:bg-stone-50"
      />
      <button
        type="submit"
        className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Subscribe
      </button>
    </form>
  );
}
