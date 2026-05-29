"use client";

import { useEffect } from "react";

function markArticleSeen(slug: string) {
  const key = `aisg:viewed:${slug}`;

  try {
    if (window.sessionStorage.getItem(key)) {
      return false;
    }

    window.sessionStorage.setItem(key, "1");
    return true;
  } catch {
    return true;
  }
}

function sendViewEvent(slug: string) {
  const body = JSON.stringify({ slug });
  const payload = new Blob([body], { type: "application/json" });

  if (typeof navigator.sendBeacon === "function" && navigator.sendBeacon("/api/engagement", payload)) {
    return;
  }

  void fetch("/api/engagement", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body,
    keepalive: true
  }).catch(() => undefined);
}

export function ArticleEngagementTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug || !markArticleSeen(slug)) {
      return;
    }

    sendViewEvent(slug);
  }, [slug]);

  return null;
}
