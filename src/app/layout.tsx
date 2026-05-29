import type { Metadata } from "next";
import { IBM_Plex_Sans, Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL
} from "@/lib/site";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-manrope"
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cormorant"
});

const HOMEPAGE_TITLE =
  "Singapore AI & Tech News | Latest Coverage of AI, Startups & GovTech";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOMEPAGE_TITLE,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Singapore tech news",
    "Singapore AI",
    "GovTech Singapore",
    "Singapore startups",
    "Singapore fintech",
    "cybersecurity Singapore",
    "Singapore digital transformation",
    "Smart Nation",
    "Southeast Asia tech"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: HOMEPAGE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: HOMEPAGE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  verification: {
    google: "w2P4Yg2C-HRbEMX1-qcFOBdnw-KSTOTKWvZibbNqiX0"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${newsreader.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
