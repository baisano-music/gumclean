import type { Metadata } from "next";
import PaginaIntro from "@/components/seo/PaginaIntro";
import Vraag from "@/components/seo/Vraag";
import GerelateerdeLinks from "@/components/seo/GerelateerdeLinks";
import OfferteFormulier from "@/components/OfferteFormulier";
import { faqJsonLd, serviceJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "Wat kost gevelreiniging? Prijzen per m² en per uur | GumClean",
  description:
    "Gevelreiniging kost € 67,50 per uur of € 540 per mandag, excl. btw. Rekenvoorbeeld per pandtype en wat wel en niet is inbegrepen.",
  alternates: { canonical: "https://gumclean.nl/gevelreiniging/kosten" },
};

const VRAGEN = [
  {
    vraag: "Wat kost gevelreiniging?",
    antwoord:
      "Gevelreiniging kost bij GumClean € 540 per mandag van 8 uur, of € 67,50 per uur, excl. btw. Voor de meeste winkelpuien en kantoorentrees is geen hele dag nodig — reken hieronder mee met uw pandtype.",
  },
  {
    vraag: "Wat kost gevelreiniging per m²?",
    antwoord:
      "Er is geen vast bedrag per m² — de prijs volgt uit de tijd die de klus kost, keer het uurtarief. Een grote, vlakke gevel gaat sneller per m² dan een klein, gedetailleerd oppervlak.",
  },
  {
    vraag: "Wat vraagt een gevelreiniger per uur?",
    antwoord:
      "€ 67,50 per uur, excl. btw. Daarin zitten reistijd, brandstof, water, osmose en verbruiksmateriaal; hoogwerkerhuur is exclusief en wordt 1-op-1 doorbelast tegen kostprijs.",
  },
  {
    vraag: "Bieden jullie ook gevel impregneren aan?",
    antwoord:
      "Nee. GumClean reinigt gevels; impregneren (waterafstotend maken) en voegwerk vallen niet onder onze dienstverlening. Zoekt u dat, dan bent u bij een gevelrenovatiebedrijf beter af.",
  },
];

export default function GevelreinigingKosten() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({
              id: "service-gevelreiniging-kosten",
              name: "Gevelreiniging — prijsopgave",
              serviceType: "Gevelreiniging",
              description:
                "Prijsopgave voor gevelreiniging van bedrijfspanden: dagtarief en uurtarief, excl. btw.",
              url: "/gevelreiniging/kosten",
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
              "faq-gevelreiniging-kosten"
            )
          ),
        }}
      />

      <PaginaIntro
        eyebrow="Prijzen"
        h1="Wat kost gevelreiniging? Prijzen per m² en per uur"
        intro="Vaste tarieven, geen offertetraject van weken. Hieronder het uur- en dagtarief, en een rekenvoorbeeld per pandtype."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Vraag vraag={VRAGEN[0].vraag}>
          <p>{VRAGEN[0].antwoord}</p>
        </Vraag>

        <Vraag vraag={VRAGEN[1].vraag}>
          <p>{VRAGEN[1].antwoord}</p>
          <p>
            Reken zelf mee: (aantal uur × uurtarief) ÷ aantal m² = richtprijs
            per m². Een klein, gedetailleerd gevelgedeelte kost per m² dus meer
            dan een grote, vlakke gevel in één doorgaande beweging.
          </p>
        </Vraag>

        <Vraag vraag="Rekenvoorbeeld per pandtype">
          <p>
            Onderstaande tijden zijn een vakinschatting, geen vaste norm — de
            definitieve prijs volgt na een korte inschatting ter plaatse.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-pink/15 my-2">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left font-semibold text-dark px-4 py-3">Pandtype</th>
                  <th className="text-left font-semibold text-dark px-4 py-3">Geschat oppervlak</th>
                  <th className="text-left font-semibold text-dark px-4 py-3">Geschatte tijd</th>
                  <th className="text-right font-semibold text-dark px-4 py-3">Richtprijs (excl. btw)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink/10">
                <tr>
                  <td className="px-4 py-3 align-top">Kleine winkelpui</td>
                  <td className="px-4 py-3 align-top">tot 30 m²</td>
                  <td className="px-4 py-3 align-top">± 1,5 uur</td>
                  <td className="px-4 py-3 align-top text-right font-semibold text-dark">€ 101,25</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Gemiddelde winkelpui / kantoorentree</td>
                  <td className="px-4 py-3 align-top">30-80 m²</td>
                  <td className="px-4 py-3 align-top">± 3 uur</td>
                  <td className="px-4 py-3 align-top text-right font-semibold text-dark">€ 202,50</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Bedrijfspand, één gevelzijde</td>
                  <td className="px-4 py-3 align-top">80-200 m²</td>
                  <td className="px-4 py-3 align-top">± 4 uur (halve mandag)</td>
                  <td className="px-4 py-3 align-top text-right font-semibold text-dark">€ 270,00</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Bedrijfsverzamelgebouw / meerdere gevelzijden</td>
                  <td className="px-4 py-3 align-top">200 m²+</td>
                  <td className="px-4 py-3 align-top">1 mandag of meer</td>
                  <td className="px-4 py-3 align-top text-right font-semibold text-dark">vanaf € 540,00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-dark/60">
            Aanname om te checken: de geschatte tijd per pandtype hierboven is
            door mij ingeschat op basis van het uurtarief, niet aangeleverd
            door GumClean. Controleer of deze tijden kloppen met de praktijk.
          </p>
        </Vraag>

        <Vraag vraag={VRAGEN[2].vraag}>
          <p>{VRAGEN[2].antwoord}</p>
          <div className="overflow-x-auto rounded-2xl border border-pink/15 my-2">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left font-semibold text-dark px-4 py-3">Inbegrepen</th>
                  <th className="text-left font-semibold text-dark px-4 py-3">Exclusief</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink/10">
                <tr>
                  <td className="px-4 py-3 align-top">Reistijd</td>
                  <td className="px-4 py-3 align-top">Hoogwerkerhuur (1-op-1 doorbelast tegen kostprijs)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Brandstof</td>
                  <td className="px-4 py-3 align-top">Btw</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Water &amp; osmose</td>
                  <td className="px-4 py-3 align-top">—</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">Verbruiksmateriaal</td>
                  <td className="px-4 py-3 align-top">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Vraag>

        <Vraag vraag={VRAGEN[3].vraag}>
          <p>{VRAGEN[3].antwoord}</p>
        </Vraag>

        <GerelateerdeLinks
          links={[
            { href: "/gevelreiniging", label: "Gevelreiniging voor bedrijven" },
            { href: "/voor-en-na", label: "Voor en na — resultaten" },
            { href: "/bedrijfspand-reinigen", label: "Bedrijfspand reinigen" },
          ]}
        />
      </div>

      <OfferteFormulier />
    </>
  );
}
