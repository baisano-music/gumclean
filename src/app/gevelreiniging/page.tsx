import type { Metadata } from "next";
import PaginaIntro from "@/components/seo/PaginaIntro";
import Vraag from "@/components/seo/Vraag";
import GerelateerdeLinks from "@/components/seo/GerelateerdeLinks";
import OfferteFormulier from "@/components/OfferteFormulier";
import { faqJsonLd, serviceJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "Gevelreiniging voor bedrijven | GumClean",
  description:
    "Gevelreiniging voor winkelpuien, kantoorpanden en bedrijfsgebouwen in Haarlemmermeer. Baksteen, metselwerk en gevelbeplating professioneel gereinigd.",
  alternates: { canonical: "https://gumclean.nl/gevelreiniging" },
};

const VRAGEN = [
  {
    vraag: "Wat is gevelreiniging?",
    antwoord:
      "Gevelreiniging is het professioneel reinigen van de buitenkant van een pand: metselwerk, gevelbeplating, kozijnen en entree. Het verwijdert vervuiling, aanslag en verkleuring zonder de ondergrond te beschadigen.",
  },
  {
    vraag: "Kunt u elke gevel reinigen?",
    antwoord:
      "Ja, met een methode die past bij de ondergrond. Baksteen, metselwerk, gevelbeplating en geverfde gevels vragen elk een andere aanpak in druk en middel.",
  },
  {
    vraag: "Hoe vaak moet een gevel gereinigd worden?",
    antwoord:
      "Voor de meeste bedrijfspanden is één keer per jaar voldoende. Panden langs een drukke straat of onder bomen vervuilen sneller en hebben vaker onderhoud nodig.",
  },
  {
    vraag: "Kan ik mijn gevel zelf reinigen?",
    antwoord:
      "Met een tuinslang en zeep krijgt u oppervlaktevuil weg, maar ingesleten aanslag en verkleuring vragen professionele apparatuur en de juiste druk per ondergrond. Verkeerde druk beschadigt voegwerk en coatings.",
  },
  {
    vraag: "Wat kost gevelreiniging voor een bedrijfspand?",
    antwoord:
      "Wij werken op basis van een dagtarief van € 540 (mandag van 8 uur) of € 67,50 per uur, excl. btw. Op de kostenpagina staat een rekenvoorbeeld per pandtype.",
  },
];

export default function Gevelreiniging() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({
              id: "service-gevelreiniging",
              name: "Gevelreiniging",
              serviceType: "Gevelreiniging",
              description:
                "Professionele reiniging van winkelpuien, gevels en buitengevels van bedrijfspanden.",
              url: "/gevelreiniging",
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(
              VRAGEN.map((v) => ({ question: v.vraag, answer: v.antwoord })),
              "faq-gevelreiniging"
            )
          ),
        }}
      />

      <PaginaIntro
        eyebrow="Gevelreiniging"
        h1="Gevelreiniging voor bedrijven"
        intro="Wij reinigen winkelpuien, kantoorgevels en bedrijfspanden in Haarlemmermeer, Aalsmeer en Amstelveen. Vaste tarieven, geen verrassingen achteraf."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Vraag vraag={VRAGEN[0].vraag}>
          <p>{VRAGEN[0].antwoord}</p>
          <p>
            Onder gevelreiniging vallen onder meer het schoonmaken van winkelpuien,
            het reinigen van buitenmuren en het verwijderen van aanslag op
            bakstenen en metselwerk. Het resultaat is een pand dat er weer
            uitziet zoals bij oplevering.
          </p>
        </Vraag>

        <Vraag vraag={VRAGEN[1].vraag}>
          <p>{VRAGEN[1].antwoord}</p>
          <div className="overflow-x-auto rounded-2xl border border-pink/15 my-2">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left font-semibold text-dark px-4 py-3">Ondergrond</th>
                  <th className="text-left font-semibold text-dark px-4 py-3">Methode</th>
                  <th className="text-left font-semibold text-dark px-4 py-3">Let op</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink/10">
                <tr>
                  <td className="px-4 py-3 align-top">Baksteen &amp; metselwerk</td>
                  <td className="px-4 py-3 align-top">Hogedruk met reinigingsmiddel, naspoelen</td>
                  <td className="px-4 py-3 align-top text-dark/70">Meest voorkomend, weinig risico op schade</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Gevelbeplating (kunststof/composiet)</td>
                  <td className="px-4 py-3 align-top">Lagedruk met zachte borstel</td>
                  <td className="px-4 py-3 align-top text-dark/70">Hogedruk kan de coating beschadigen</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Witte &amp; geverfde gevels</td>
                  <td className="px-4 py-3 align-top">Lagedruk, mild middel, handmatig nawerk</td>
                  <td className="px-4 py-3 align-top text-dark/70">Verkleuring valt sneller op</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Natuursteen</td>
                  <td className="px-4 py-3 align-top">Lagedruk, pH-neutraal middel</td>
                  <td className="px-4 py-3 align-top text-dark/70">Nooit hogedruk direct op de voeg</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-dark/60">
            Aanname om te checken: bovenstaande methodekeuze per ondergrond is
            algemene vakpraktijk. Als GumClean op onderdelen een afwijkende
            werkwijze hanteert, hoor ik dat graag.
          </p>
        </Vraag>

        <Vraag vraag={VRAGEN[2].vraag}>
          <p>{VRAGEN[2].antwoord}</p>
          <div className="overflow-x-auto rounded-2xl border border-pink/15 my-2">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left font-semibold text-dark px-4 py-3">Situatie</th>
                  <th className="text-left font-semibold text-dark px-4 py-3">Aanbevolen frequentie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink/10">
                <tr>
                  <td className="px-4 py-3">Winkelpui in centrumgebied</td>
                  <td className="px-4 py-3">1x per jaar</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Kantoorpand, rustige locatie</td>
                  <td className="px-4 py-3">1x per 1-2 jaar</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Pand onder bomen of langs drukke weg</td>
                  <td className="px-4 py-3">1-2x per jaar</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-dark/60">
            Aanname om te checken: deze frequenties zijn een indicatie op basis
            van locatie en vervuilingsgraad, geen vaste GumClean-norm.
          </p>
        </Vraag>

        <Vraag vraag={VRAGEN[3].vraag}>
          <p>{VRAGEN[3].antwoord}</p>
        </Vraag>

        <Vraag vraag={VRAGEN[4].vraag}>
          <p>{VRAGEN[4].antwoord}</p>
          <p>
            Alle bedragen zijn excl. btw en inclusief reistijd, brandstof,
            water, osmose en verbruiksmateriaal. Hoogwerkerhuur is exclusief en
            wordt 1-op-1 doorbelast tegen kostprijs.
          </p>
        </Vraag>

        <GerelateerdeLinks
          links={[
            { href: "/gevelreiniging/kosten", label: "Wat kost gevelreiniging" },
            { href: "/voor-en-na", label: "Voor en na — resultaten" },
            { href: "/bedrijfspand-reinigen", label: "Bedrijfspand reinigen" },
          ]}
        />
      </div>

      <OfferteFormulier />
    </>
  );
}
