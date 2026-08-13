import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "@/styles/globals.scss";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SAWADESIGN | rising creativity with gumption.",
  description: "TAKAHIRO SAWADA's engineering & design portfolio launched in 2026",
  icons: {
    icon: [{ url: "/assets/base/favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/assets/base/favicon.svg"],
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title: "SAWADESIGN | rising creativity with gumption.",
    description: "TAKAHIRO SAWADA's engineering & design portfolio launched in 2026",
    siteName: "SAWADESIGN",
    images: [
      {
        url: "/assets/base/ogp-sawadesign.jpg",
        width: 1200,
        height: 630,
        alt: "SAWADESIGN | rising creativity with gumption.",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SAWADESIGN | rising creativity with gumption.",
    description: "TAKAHIRO SAWADA's engineering & design portfolio launched in 2026",
    images: ["/assets/base/ogp-sawadesign.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body>{children}</body>
    </html>
  );
}
