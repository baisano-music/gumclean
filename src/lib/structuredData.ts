import { COMPANY } from "./constants";

export const SITE = "https://gumclean.nl";

// Eén @graph dat Organization + LocalBusiness + WebSite + de drie diensten aan
// elkaar koppelt via @id — de "kennisgraaf" die AI-zoekmachines uitlezen.
export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "GumClean",
      url: SITE,
      email: "info@gumclean.nl",
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
      image: `${SITE}/hero-bg.png`,
      description:
        "Professionele, milieuvriendelijke buitenreiniging voor winkelpuien & gevels, zonnepanelen, kauwgum- en graffitiverwijdering in Hoofddorp en de regio Haarlemmermeer.",
    },
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": `${SITE}/#business`,
      name: "GumClean",
      parentOrganization: { "@id": `${SITE}/#organization` },
      url: SITE,
      email: "info@gumclean.nl",
      telephone: COMPANY.phoneHref,
      image: `${SITE}/hero-bg.png`,
      priceRange: "€€",
      description:
        "Professionele buitenreiniging voor retail, vastgoed en gemeenten: winkelpuien & gevels, zonnepanelen reinigen, kauwgum- en graffitiverwijdering in de regio Haarlemmermeer.",
      address: {
        "@type": "PostalAddress",
        streetAddress: COMPANY.street,
        postalCode: COMPANY.postalCode,
        addressLocality: "Hoofddorp",
        addressRegion: "Noord-Holland",
        addressCountry: "NL",
      },
      geo: { "@type": "GeoCoordinates", latitude: 52.303, longitude: 4.6889 },
      areaServed: [
        { "@type": "City", name: "Hoofddorp" },
        { "@type": "AdministrativeArea", name: "Haarlemmermeer" },
        { "@type": "City", name: "Nieuw-Vennep" },
        { "@type": "City", name: "Badhoevedorp" },
        { "@type": "AdministrativeArea", name: "Noord-Holland" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "16:00",
        },
      ],
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Winkelpuien & gevels reinigen",
            serviceType: "Gevelreiniging",
            description:
              "Professionele reiniging van winkelpuien en gevels voor een verzorgde uitstraling.",
            areaServed: { "@type": "AdministrativeArea", name: "Haarlemmermeer" },
            provider: { "@id": `${SITE}/#business` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Zonnepanelen reinigen",
            serviceType: "Zonnepanelen reinigen",
            description:
              "Vakkundige reiniging van zonnepanelen om rendementsverlies door vervuiling te herstellen.",
            areaServed: { "@type": "AdministrativeArea", name: "Haarlemmermeer" },
            provider: { "@id": `${SITE}/#business` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Kauwgumverwijdering",
            serviceType: "Kauwgumverwijdering",
            description:
              "Milieuvriendelijke verwijdering van kauwgum van bestrating, gevels en entrees.",
            areaServed: { "@type": "AdministrativeArea", name: "Haarlemmermeer" },
            provider: { "@id": `${SITE}/#business` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Terreinreiniging & graffitiverwijdering",
            serviceType: "Terreinreiniging en graffitiverwijdering",
            description:
              "Professionele reiniging van terreinen, opritten en verhardingen, en verwijdering van graffiti van gevels en muren zonder schade aan de ondergrond.",
            areaServed: { "@type": "AdministrativeArea", name: "Haarlemmermeer" },
            provider: { "@id": `${SITE}/#business` },
          },
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "GumClean",
      publisher: { "@id": `${SITE}/#organization` },
      inLanguage: "nl-NL",
    },
  ],
};

// Generieke FAQPage-schema-builder. Geef 'm dezelfde vraag/antwoord-array die
// ook zichtbaar op de pagina staat, zodat schema en inhoud altijd overeenkomen
// (vereiste van Google/AI-engines om als bron te mogen dienen).
export function faqJsonLd(
  items: readonly { question: string; answer: string }[],
  id: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE}/#${id}`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

// Generieke Service-schema-builder voor dienstpagina's. Koppelt altijd terug
// aan de bestaande LocalBusiness via provider @id.
export function serviceJsonLd(opts: {
  id: string;
  name: string;
  serviceType: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/#${opts.id}`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: `${SITE}${opts.url}`,
    provider: { "@id": `${SITE}/#business` },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Haarlemmermeer" },
      { "@type": "City", name: "Aalsmeer" },
      { "@type": "City", name: "Amstelveen" },
    ],
  };
}
