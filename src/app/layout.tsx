import type { Metadata } from "next";
import { Fredoka, DM_Sans } from "next/font/google";
import { siteJsonLd, faqJsonLd } from "@/lib/structuredData";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gumclean.nl"),
  title: "GumClean | Buitenreiniging in Haarlemmermeer & Hoofddorp",
  description:
    "Professionele buitenreiniging voor retail, vastgoed en gemeenten: winkelpuien & gevels, zonnepanelen en kauwgumverwijdering in de regio Haarlemmermeer. Vraag direct een offerte aan.",
  keywords: [
    "buitenreiniging Haarlemmermeer",
    "gevelreiniging Hoofddorp",
    "zonnepanelen reinigen",
    "winkelpui reinigen",
    "kauwgum verwijderen Haarlemmermeer",
    "professionele reiniging",
    "GumClean",
  ],
  openGraph: {
    title: "GumClean | Buitenreiniging in Haarlemmermeer & Hoofddorp",
    description:
      "Professionele buitenreiniging voor retail, vastgoed en gemeenten: winkelpuien & gevels, zonnepanelen en kauwgumverwijdering in de regio Haarlemmermeer.",
    url: "https://gumclean.nl",
    siteName: "GumClean",
    locale: "nl_NL",
    type: "website",
    images: [
      {
        url: "/hero-bg.png",
        alt: "GumClean — buitenreiniging in Haarlemmermeer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GumClean | Buitenreiniging in Haarlemmermeer & Hoofddorp",
    description:
      "Professionele buitenreiniging voor retail, vastgoed en gemeenten: winkelpuien & gevels, zonnepanelen en kauwgumverwijdering in de regio Haarlemmermeer.",
    images: ["/hero-bg.png"],
  },
  alternates: {
    canonical: "https://gumclean.nl",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${fredoka.variable} ${dmSans.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
