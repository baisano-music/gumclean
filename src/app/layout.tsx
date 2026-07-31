import type { Metadata } from "next";
import { Fredoka, DM_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteJsonLd } from "@/lib/structuredData";
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
    "Professionele buitenreiniging in Haarlemmermeer: gevels, zonnepanelen, kauwgum- en graffitiverwijdering voor retail, vastgoed en gemeenten.",
  keywords: [
    "buitenreiniging Haarlemmermeer",
    "gevelreiniging Hoofddorp",
    "zonnepanelen reinigen",
    "winkelpui reinigen",
    "kauwgum verwijderen Haarlemmermeer",
    "graffiti verwijderen Haarlemmermeer",
    "terreinreiniging Hoofddorp",
    "professionele reiniging",
    "GumClean",
  ],
  openGraph: {
    title: "GumClean | Buitenreiniging in Haarlemmermeer & Hoofddorp",
    description:
      "Professionele buitenreiniging voor retail, vastgoed en gemeenten: winkelpuien & gevels, zonnepanelen, kauwgum- en graffitiverwijdering in de regio Haarlemmermeer.",
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
      "Professionele buitenreiniging voor retail, vastgoed en gemeenten: winkelpuien & gevels, zonnepanelen, kauwgum- en graffitiverwijdering in de regio Haarlemmermeer.",
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
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
