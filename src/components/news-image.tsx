"use client";

import Image from "next/image";
import { useState } from "react";
import { DEFAULT_NEWS_IMAGE } from "@/lib/placeholders";

type Props = {
  src?: string;
  alt: string;
  className: string;
  /**
   * Controls priority hint for the underlying <Image>. Use `eager` for
   * above-the-fold images (lead story, article hero) so Next.js marks
   * them with `priority`. Defaults to lazy.
   */
  loading?: "eager" | "lazy";
  /** Optional extra classes applied only when the placeholder is shown. */
  fallbackClassName?: string;
  /**
   * Responsive `sizes` hint for srcset generation. Tune per usage so
   * Next.js doesn't ship a 1600px image to a phone showing a 64px
   * thumbnail. The default is conservative for full-width hero use.
   */
  sizes?: string;
};

const FALLBACK_SIZES = "(max-width: 768px) 100vw, 50vw";

/**
 * Image wrapper used everywhere story artwork is rendered.
 *
 * Built on next/image with `fill` so each consumer sets the aspect
 * ratio via its own positioned container. Falls back to the local
 * placeholder when `src` is missing or fails to load.
 */
export function NewsImage({
  src,
  alt,
  className,
  loading = "lazy",
  fallbackClassName = "",
  sizes = FALLBACK_SIZES
}: Props) {
  const [failed, setFailed] = useState(false);

  const showFallback = !src || failed;
  const resolvedSrc = showFallback ? DEFAULT_NEWS_IMAGE : src;
  const isPriority = loading === "eager";

  return (
    <Image
      src={resolvedSrc}
      alt={showFallback ? "" : alt}
      aria-hidden={showFallback ? true : undefined}
      fill
      sizes={sizes}
      className={[className, showFallback ? fallbackClassName : ""].join(" ").trim()}
      onError={() => setFailed(true)}
      priority={isPriority}
      // The placeholder asset is an SVG; Next.js handles it but
      // unoptimized avoids generating raster variants of vector art.
      unoptimized={resolvedSrc.endsWith(".svg")}
    />
  );
}
