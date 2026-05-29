/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    // Modern formats first; Next.js negotiates with the browser.
    formats: ["image/avif", "image/webp"],
    // Trusted remote hosts for article artwork. The ingest pipeline
    // tries to persist images locally, but falls back to the remote
    // URL when the source blocks downloads. Keep this list scoped to
    // sources we actually pull from.
    remotePatterns: [
      { protocol: "https", hostname: "vulcanpost.com" },
      { protocol: "https", hostname: "**.vulcanpost.com" },
      { protocol: "https", hostname: "www.channelnewsasia.com" },
      { protocol: "https", hostname: "**.channelnewsasia.com" },
      { protocol: "https", hostname: "www.straitstimes.com" },
      { protocol: "https", hostname: "**.straitstimes.com" },
      { protocol: "https", hostname: "www.hardwarezone.com.sg" },
      { protocol: "https", hostname: "**.hardwarezone.com.sg" },
      { protocol: "https", hostname: "www.tech.gov.sg" },
      { protocol: "https", hostname: "**.tech.gov.sg" },
      { protocol: "https", hostname: "opengovasia.com" },
      { protocol: "https", hostname: "**.opengovasia.com" },
      { protocol: "https", hostname: "news.microsoft.com" },
      { protocol: "https", hostname: "**.microsoft.com" },
      { protocol: "https", hostname: "mothership.sg" },
      { protocol: "https", hostname: "**.mothership.sg" },
      { protocol: "https", hostname: "govinsider.asia" },
      { protocol: "https", hostname: "**.govinsider.asia" },
      { protocol: "https", hostname: "www.stomp.sg" },
      { protocol: "https", hostname: "**.stomp.sg" },
      { protocol: "https", hostname: "techinasia.com" },
      { protocol: "https", hostname: "**.techinasia.com" },
      { protocol: "https", hostname: "e27.co" },
      { protocol: "https", hostname: "**.e27.co" },
      { protocol: "https", hostname: "www.businesstimes.com.sg" },
      { protocol: "https", hostname: "**.businesstimes.com.sg" }
    ]
  }
};

export default nextConfig;
