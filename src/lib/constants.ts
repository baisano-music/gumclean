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
    color: "pink" as const,
  },
  {
    title: "Alles in één hand",
    description: "Winkelpuien, gevels, zonnepanelen én kauwgom. U regelt uw buitenreiniging via één vast aanspreekpunt.",
    color: "yellow" as const,
  },
  {
    title: "Milieuvriendelijk",
    description: "Biologisch afbreekbare middelen, minimaal waterverbruik.",
    color: "teal" as const,
  },
  {
    title: "Binnen 48 uur ter plaatse",
    description: "U vraagt, wij komen. Geen wachttijden, geen excuses.",
    color: "purple" as const,
  },
] as const;

export const TARGET_AUDIENCES = [
  {
    title: "Retailketens",
    description:
      "Van 1 filiaal tot landelijk raamcontract. Wij kennen de planning en werkwijze van grote retailers. Vroeg in de ochtend, geen hinder voor klanten.",
    image: "/winkelcentrum.png",
  },
  {
    title: "Winkelcentra & vastgoedbeheerders",
    description:
      "Periodieke reiniging van buitengebieden, passages en gevels. Inclusief kwartaalrapportage voor uw portefeuille.",
    image: "/entree.png",
  },
  {
    title: "Gemeenten & BIZ-fondsen",
    description:
      "Schone openbare ruimte is geen luxe maar een basisvereiste. Wij werken samen met gemeenten en ondernemersfondsen aan structurele aanpakken.",
    image: "/gemeente.png",
  },
  {
    title: "Bedrijventerreinen",
    description:
      "Regelmatige buitenreiniging van bedrijfspanden en terreinen. Collectieve contracten mogelijk via parkmanagement.",
    image: "/bedrijventerrein.png",
  },
] as const;

export const STATS = [
  { value: "5.000+", label: "m² gereinigd" },
  { value: "100%", label: "Milieuvriendelijk" },
  { value: "Hoofddorp", label: "Lokaal gevestigd" },
] as const;

// Gebruikt door zowel de zichtbare FAQ-sectie als de FAQPage structured data.
// Houd vraag/antwoord identiek zodat schema en pagina overeenkomen.
export const FAQ_ITEMS = [
  {
    question: "In welke regio werkt GumClean?",
    answer:
      "GumClean is gevestigd in Hoofddorp en werkt in de hele regio Haarlemmermeer en omgeving, waaronder Nieuw-Vennep, Badhoevedorp en de rest van Noord-Holland.",
  },
  {
    question: "Welke diensten biedt GumClean aan?",
    answer:
      "GumClean biedt drie kerndiensten: het reinigen van winkelpuien en gevels, het reinigen van zonnepanelen, en het milieuvriendelijk verwijderen van kauwgum van bestrating, gevels en entrees.",
  },
  {
    question: "Hoe snel kan GumClean ter plaatse zijn?",
    answer:
      "Omdat GumClean lokaal in Hoofddorp zit, zijn wij doorgaans binnen 48 uur ter plaatse. Een vrijblijvende offerte ontvangt u binnen 24 uur.",
  },
  {
    question: "Werkt GumClean milieuvriendelijk?",
    answer:
      "Ja. GumClean werkt milieuvriendelijk en zet in op voorkomen, verwijderen en recyclen, zodat reiniging zo min mogelijk belastend is voor de omgeving.",
  },
  {
    question: "Voor welke organisaties werkt GumClean?",
    answer:
      "GumClean werkt voor retailketens, winkelcentra en vastgoedbeheerders, gemeenten en BIZ-fondsen, en beheerders van bedrijventerreinen.",
  },
  {
    question: "Hoe vaak moeten zonnepanelen gereinigd worden?",
    answer:
      "Vervuilde zonnepanelen leveren minder op. Een periodieke reiniging — vaak één tot twee keer per jaar — herstelt het rendementsverlies. Met de rekentool op de site berekent u uw verlies.",
  },
  {
    question: "Biedt GumClean onderhoudscontracten aan?",
    answer:
      "Ja. U kunt kiezen voor een eenmalige basisreiniging of een kwartaalonderhoudscontract, zodat uw pand of locatie het hele jaar door schoon blijft.",
  },
  {
    question: "Hoe vraag ik een offerte aan?",
    answer:
      "Vraag een vrijblijvende offerte aan via het offerteformulier of mail naar info@gumclean.nl. U ontvangt binnen 24 uur een reactie.",
  },
] as const;
