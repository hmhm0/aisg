import type { Metadata } from "next";
import { IBM_Plex_Sans, Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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

export const metadata: Metadata = {
  title: "Singapore AI & Tech News | Latest Coverage of AI, Startups & GovTech",
  description: "Breaking news and in-depth analysis on Singapore's technology sector. Coverage includes AI adoption, startup ecosystem, government digital initiatives, cybersecurity, enterprise innovation, and policy developments."
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
