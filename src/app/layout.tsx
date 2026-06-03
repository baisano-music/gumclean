import type { Metadata } from "next";
import { Fredoka, DM_Sans } from "next/font/google";
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
  },
  alternates: {
    canonical: "https://gumclean.nl",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "GumClean",
  description:
    "Professionele buitenreiniging voor winkelpuien & gevels, zonnepanelen en kauwgumverwijdering in Hoofddorp en Haarlemmermeer",
  url: "https://gumclean.nl",
  email: "info@gumclean.nl",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hoofddorp",
    addressRegion: "Noord-Holland",
    addressCountry: "NL",
  },
  areaServed: {
    "@type": "Place",
    name: "Haarlemmermeer",
  },
  serviceType: ["Gevelreiniging", "Zonnepanelen reinigen", "Kauwgumverwijdering"],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
