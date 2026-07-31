import type { MetadataRoute } from "next";

const SITE = "https://gumclean.nl";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/gevelreiniging`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/gevelreiniging/kosten`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/bedrijfspand-reinigen`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/voor-en-na`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];
}
