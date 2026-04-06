export const COMPANY = {
  name: "GumClean",
  tagline: "De kauwgumspecialist van Haarlemmermeer",
  location: "Hoofddorp",
  region: "Haarlemmermeer",
  phone: "+31 (0)23 000 0000",
  email: "info@gumclean.nl",
  website: "gumclean.nl",
  kvk: "00000000",
  btw: "NL000000000B01",
} as const;

export const NAV_ITEMS = [
  { label: "Diensten", href: "#diensten" },
  { label: "Waarom wij", href: "#waarom" },
  { label: "Doelgroepen", href: "#doelgroepen" },
  { label: "Contact", href: "#offerte" },
] as const;

export const SERVICES = [
  {
    title: "Eenmalige Reiniging",
    description:
      "Professionele kauwgumverwijdering op elke ondergrond. Stoomreiniging bij 150\u00B0C zonder schade aan tegels, beton of bestrating.",
    emoji: "\uD83E\uDDF9",
    color: "pink" as const,
  },
  {
    title: "Periodiek Onderhoud",
    description:
      "Vaste onderhoudsfrequentie op maat. Maandelijks, per kwartaal of op afroep \u2014 inclusief rapportage.",
    emoji: "\uD83D\uDD04",
    color: "purple" as const,
  },
  {
    title: "Entr\u00E9e Management",
    description:
      "Vaste prijs per maand voor altijd een schone entree. Ideaal voor winkels, kantoren en zorginstellingen.",
    emoji: "\uD83C\uDFE2",
    color: "teal" as const,
  },
] as const;

export const USPS = [
  {
    title: "Lokaal in Hoofddorp",
    description: "Wij kennen de regio. Korte lijnen, snelle respons, geen gedoe.",
    emoji: "\uD83D\uDCCD",
    color: "pink" as const,
  },
  {
    title: "Schiphol-referentie",
    description: "Ervaring op \u00E9\u00E9n van de drukste locaties van Nederland.",
    emoji: "\u2708\uFE0F",
    color: "yellow" as const,
  },
  {
    title: "Milieuvriendelijk",
    description: "Biologisch afbreekbare middelen, minimaal waterverbruik.",
    emoji: "\uD83C\uDF3F",
    color: "teal" as const,
  },
  {
    title: "Binnen 48 uur ter plaatse",
    description: "U belt, wij komen. Geen wachttijden, geen excuses.",
    emoji: "\u26A1",
    color: "purple" as const,
  },
] as const;

export const TARGET_AUDIENCES = [
  {
    title: "Winkelcentra & Retail",
    description: "Schone winkelstraten verhogen bezoekersaantallen.",
    emoji: "\uD83D\uDECD\uFE0F",
    image: "/winkelcentrum.png",
  },
  {
    title: "Gemeenten",
    description: "Voldoe aan reinigingsnormen zonder eigen personeel in te zetten.",
    emoji: "\uD83C\uDFDB\uFE0F",
    image: "/gemeente.png",
  },
  {
    title: "Scholen & Sportlocaties",
    description: "Veilige en schone buitenruimtes voor leerlingen.",
    emoji: "\uD83C\uDFEB",
    image: "/school.png",
  },
  {
    title: "Bedrijventerreinen",
    description: "Professionele uitstraling van uw terrein en entree.",
    emoji: "\uD83C\uDFE2",
    image: "/bedrijventerrein.png",
  },
] as const;

export const STATS = [
  { value: "5.000+", label: "m\u00B2 gereinigd", emoji: "\uD83E\uDEB7" },
  { value: "1", label: "Schiphol-referentie", emoji: "\u2708\uFE0F" },
  { value: "100%", label: "Milieuvriendelijk", emoji: "\uD83C\uDF3F" },
  { value: "Hoofddorp", label: "Lokaal gevestigd", emoji: "\uD83D\uDCCD" },
] as const;
