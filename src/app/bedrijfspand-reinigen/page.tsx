import type { Metadata } from "next";
import PaginaIntro from "@/components/seo/PaginaIntro";
import Vraag from "@/components/seo/Vraag";
import GerelateerdeLinks from "@/components/seo/GerelateerdeLinks";
import OfferteFormulier from "@/components/OfferteFormulier";
import { faqJsonLd, serviceJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "Bedrijfspand reinigen (buitenkant) | GumClean",
  description:
    "Bedrijfspand reinigen aan de buitenkant: gevel, entree, glas en terrein. Vaste tarieven vanaf € 67,50 per uur, excl. btw. Geen interieurschoonmaak.",
  alternates: { canonical: "https://gumclean.nl/bedrijfspand-reinigen" },
};

const VRAGEN = [
  {
    vraag: "Wat is bedrijfspand reinigen bij GumClean?",
    antwoord:
      "Bedrijfspand reinigen is het schoonmaken van de buitenkant van uw pand: gevel, entree, glas en het terrein eromheen. GumClean doet dit voor kantoorpanden, winkelcentra en bedrijfsverzamelgebouwen in Haarlemmermeer, Aalsmeer en Amstelveen.",
  },
  {
    vraag: "Doet GumClean ook interieurschoonmaak van kantoren?",
    antwoord:
      "Nee. GumClean reinigt uitsluitend de buitenkant van een pand — gevel, entree, glas en terrein. Voor dagelijkse interieurschoonmaak (bureaus, vloeren, sanitair) verwijst u naar een schoonmaakbedrijf dat dat als kerntaak heeft.",
  },
  {
    vraag: "Wat kost bedrijfspand reinigen?",
    antwoord:
      "Vanaf € 67,50 per uur of € 540 per mandag van 8 uur, excl. btw. Op de kostenpagina voor gevelreiniging staat een uitgebreid rekenvoorbeeld; hieronder een indicatie voor de buitenkant als geheel.",
  },
];

export default function BedrijfspandReinigen() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({
              id: "service-bedrijfspand-reinigen",
              name: "Bedrijfspand reinigen (buitenkant)",
              serviceType: "Bedrijfspand reiniging",
              description:
                "Reiniging van de buitenkant van bedrijfspanden: gevel, entree, glas en terrein.",
              url: "/bedrijfspand-reinigen",
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
              "faq-bedrijfspand-reinigen"
            )
          ),
        }}
      />

      <PaginaIntro
        eyebrow="Bedrijfspand"
        h1="Bedrijfspand reinigen"
        intro="De buitenkant van uw pand is de eerste indruk. Wij reinigen gevel, entree, glas en terrein — geen interieurschoonmaak."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Vraag vraag={VRAGEN[0].vraag}>
          <p>{VRAGEN[0].antwoord}</p>
        </Vraag>

        <Vraag vraag="Wat behandelen we aan uw bedrijfspand?">
          <p>
            Vier onderdelen komen het meest voor bij een bedrijfspand. Welke
            combinatie u nodig heeft, hangt af van het type pand en de locatie.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-pink/15 my-2">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left font-semibold text-dark px-4 py-3">Onderdeel</th>
                  <th className="text-left font-semibold text-dark px-4 py-3">Werkzaamheden</th>
                  <th className="text-left font-semibold text-dark px-4 py-3">Richtfrequentie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink/10">
                <tr>
                  <td className="px-4 py-3 align-top">Gevel &amp; winkelpui</td>
                  <td className="px-4 py-3 align-top">Hogedruk- of lagedrukreiniging, afgestemd op de ondergrond</td>
                  <td className="px-4 py-3 align-top">1x per jaar</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Entree &amp; glas</td>
                  <td className="px-4 py-3 align-top">Glasbewassing van entreepartij en beglazing begane grond</td>
                  <td className="px-4 py-3 align-top">1x per maand tot 1x per kwartaal</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Terrein &amp; parkeerplaats</td>
                  <td className="px-4 py-3 align-top">Reiniging van bestrating, opritten en parkeerplaats</td>
                  <td className="px-4 py-3 align-top">1-2x per jaar</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Kauwgom (indien aanwezig)</td>
                  <td className="px-4 py-3 align-top">Stoomverwijdering bij entree en looppaden</td>
                  <td className="px-4 py-3 align-top">Naar behoefte</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-dark/60">
            Aanname om te checken: de richtfrequenties zijn een vakinschatting,
            geen vaste GumClean-norm.
          </p>
        </Vraag>

        <Vraag vraag={VRAGEN[1].vraag}>
          <p>{VRAGEN[1].antwoord}</p>
        </Vraag>

        <Vraag vraag={VRAGEN[2].vraag}>
          <p>{VRAGEN[2].antwoord}</p>
          <div className="overflow-x-auto rounded-2xl border border-pink/15 my-2">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left font-semibold text-dark px-4 py-3">Pandtype</th>
                  <th className="text-left font-semibold text-dark px-4 py-3">Voorbeeldscope</th>
                  <th className="text-right font-semibold text-dark px-4 py-3">Richtprijs (excl. btw)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink/10">
                <tr>
                  <td className="px-4 py-3 align-top">Klein kantoorpand met entree</td>
                  <td className="px-4 py-3 align-top">Gevel, entree en glas begane grond, ± 3 uur</td>
                  <td className="px-4 py-3 align-top text-right font-semibold text-dark">€ 202,50</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Gemiddeld bedrijfspand</td>
                  <td className="px-4 py-3 align-top">Gevel, entree, glas en klein terrein, ± 1 mandag</td>
                  <td className="px-4 py-3 align-top text-right font-semibold text-dark">€ 540,00</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Bedrijfsverzamelgebouw</td>
                  <td className="px-4 py-3 align-top">Meerdere units, gevel en gezamenlijk terrein</td>
                  <td className="px-4 py-3 align-top text-right font-semibold text-dark">vanaf € 540,00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-dark/60">
            Aanname om te checken: net als op de kostenpagina is de geschatte
            tijd per pandtype hier door mij ingeschat, niet aangeleverd door
            GumClean.
          </p>
        </Vraag>

        <GerelateerdeLinks
          links={[
            { href: "/gevelreiniging", label: "Gevelreiniging voor bedrijven" },
            { href: "/gevelreiniging/kosten", label: "Wat kost gevelreiniging" },
            { href: "/voor-en-na", label: "Voor en na — resultaten" },
          ]}
        />
      </div>

      <OfferteFormulier />
    </>
  );
}
