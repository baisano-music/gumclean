import { FAQ_ITEMS } from "./constants";

const SITE = "https://gumclean.nl";

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
        "Professionele, milieuvriendelijke buitenreiniging voor winkelpuien & gevels, zonnepanelen en kauwgumverwijdering in Hoofddorp en de regio Haarlemmermeer.",
    },
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": `${SITE}/#business`,
      name: "GumClean",
      parentOrganization: { "@id": `${SITE}/#organization` },
      url: SITE,
      email: "info@gumclean.nl",
      image: `${SITE}/hero-bg.png`,
      priceRange: "€€",
      description:
        "Professionele buitenreiniging voor retail, vastgoed en gemeenten: winkelpuien & gevels, zonnepanelen reinigen en kauwgumverwijdering in de regio Haarlemmermeer.",
      address: {
        "@type": "PostalAddress",
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

// FAQPage-schema, opgebouwd uit dezelfde FAQ_ITEMS als de zichtbare sectie zodat
// schema en pagina-inhoud altijd overeenkomen (vereiste van Google/AI-engines).
export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE}/#faq`,
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};
