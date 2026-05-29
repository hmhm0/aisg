"use client";

import { useState } from "react";
import { DEFAULT_NEWS_IMAGE } from "@/lib/placeholders";

type Props = {
  src?: string;
  alt: string;
  className: string;
  loading?: "eager" | "lazy";
  fallbackClassName?: string;
};

export function NewsImage({ src, alt, className, loading = "lazy", fallbackClassName = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <img
        aria-hidden="true"
        alt=""
        src={DEFAULT_NEWS_IMAGE}
        className={[className, fallbackClassName].join(" ")}
      />
    );
  }

  return <img src={src} alt={alt} className={className} loading={loading} onError={() => setFailed(true)} />;
}
