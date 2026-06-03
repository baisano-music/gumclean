export const COMPANY = {
  name: "GumClean",
  tagline: "Buitenreiniging voor retail, vastgoed en gemeenten in Haarlemmermeer en omgeving.",
  location: "Hoofddorp",
  region: "Haarlemmermeer",
  phone: "",
  email: "info@gumclean.nl",
  website: "gumclean.nl",
  kvk: "00000000",
  btw: "NL000000000B01",
} as const;

export const NAV_ITEMS = [
  { label: "Diensten", href: "#diensten" },
  { label: "Zonnepanelen", href: "#zonnepanelen" },
  { label: "Doelgroepen", href: "#doelgroepen" },
  { label: "Werkwijze", href: "#waarom" },
  { label: "Offerte", href: "#offerte" },
] as const;

export const SERVICES = [
  {
    title: "Winkelpuien & gevels",
    description:
      "Vieze puien kosten klanten, letterlijk. Wij reinigen winkelpuien, luifels, gevels en buitengevels van winkelketens en kantoorpanden professioneel en zonder schade.",
    labels: ["Retailketens", "Vastgoedbeheerders", "Gemeenten"],
    badge: null,
    color: "pink" as const,
  },
  {
    title: "Zonnepanelen",
    description:
      "Vuile zonnepanelen leveren tot 25% minder energie. Wij reinigen zonnepanelen op daken van winkels en bedrijfspanden met gedemineraliseerd water, geen schade, geen kalkranden, maximaal rendement.",
    labels: ["Retailpanden", "Bedrijfsdaken", "Woningcorporaties"],
    badge: "Specialisme",
    color: "purple" as const,
  },
  {
    title: "Kauwgumverwijdering",
    description:
      "Kauwgum verdwijnt nooit vanzelf. Wij verwijderen het professioneel met stoom op 150°C, geen chemicaliën, geen schade aan bestrating. Inclusief voor/na documentatie.",
    labels: ["Centrumgebieden", "Winkelcentra", "Gemeenten"],
    badge: null,
    color: "teal" as const,
  },
] as const;

export const USPS = [
  {
    title: "Lokaal in Hoofddorp",
    description: "Wij kennen de regio. Korte lijnen, snelle respons, geen gedoe.",
    emoji: "📍",
    color: "pink" as const,
  },
  {
    title: "Alles in één hand",
    description: "Winkelpuien, gevels, zonnepanelen én kauwgom. U regelt uw buitenreiniging via één vast aanspreekpunt.",
    emoji: "🤝",
    color: "yellow" as const,
  },
  {
    title: "Milieuvriendelijk",
    description: "Biologisch afbreekbare middelen, minimaal waterverbruik.",
    emoji: "🌿",
    color: "teal" as const,
  },
  {
    title: "Binnen 48 uur ter plaatse",
    description: "U vraagt, wij komen. Geen wachttijden, geen excuses.",
    emoji: "⚡",
    color: "purple" as const,
  },
] as const;

export const TARGET_AUDIENCES = [
  {
    title: "Retailketens",
    description:
      "Van 1 filiaal tot landelijk raamcontract. Wij kennen de planning en werkwijze van grote retailers. Vroeg in de ochtend, geen hinder voor klanten.",
    emoji: "🛒",
    image: "/winkelcentrum.png",
  },
  {
    title: "Winkelcentra & vastgoedbeheerders",
    description:
      "Periodieke reiniging van buitengebieden, passages en gevels. Inclusief kwartaalrapportage voor uw portefeuille.",
    emoji: "🏬",
    image: "/entree.png",
  },
  {
    title: "Gemeenten & BIZ-fondsen",
    description:
      "Schone openbare ruimte is geen luxe maar een basisvereiste. Wij werken samen met gemeenten en ondernemersfondsen aan structurele aanpakken.",
    emoji: "🏛️",
    image: "/gemeente.png",
  },
  {
    title: "Bedrijventerreinen",
    description:
      "Regelmatige buitenreiniging van bedrijfspanden en terreinen. Collectieve contracten mogelijk via parkmanagement.",
    emoji: "🏢",
    image: "/bedrijventerrein.png",
  },
] as const;

export const STATS = [
  { value: "5.000+", label: "m² gereinigd", emoji: "🪣" },
  { value: "100%", label: "Milieuvriendelijk", emoji: "🌿" },
  { value: "Hoofddorp", label: "Lokaal gevestigd", emoji: "📍" },
] as const;
