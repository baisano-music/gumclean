import type { Metadata } from "next";
import PaginaIntro from "@/components/seo/PaginaIntro";
import Vraag from "@/components/seo/Vraag";
import GerelateerdeLinks from "@/components/seo/GerelateerdeLinks";
import OfferteFormulier from "@/components/OfferteFormulier";
import { faqJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "Voor en na — resultaten uit de praktijk | GumClean",
  description:
    "Voor- en na-documentatie van gevelreiniging door GumClean: resultaat per project, inclusief oppervlak en duur van de klus.",
  alternates: { canonical: "https://gumclean.nl/voor-en-na" },
};

const VRAGEN = [
  {
    vraag: "Hoe ziet het resultaat van gevelreiniging eruit?",
    antwoord:
      "Direct zichtbaar verschil: aanslag, verkleuring en vervuiling zijn weg, de oorspronkelijke kleur van gevel of pui komt terug. Per project leggen wij dat vast met een foto vooraf en een foto na afloop, vanuit dezelfde hoek.",
  },
  {
    vraag: "Waarom laat GumClean voor- en na-foto's zien?",
    antwoord:
      "Omdat het controleerbaar bewijs is in plaats van een belofte. U ziet precies wat er is gedaan, op welk oppervlak en in hoeveel tijd, voordat u zelf een aanvraag doet.",
  },
];

type Project = {
  titel: string;
  oppervlak: string;
  duur: string;
};

const PROJECTEN: Project[] = [
  { titel: "Winkelpui, centrumgebied", oppervlak: "nog in te vullen", duur: "nog in te vullen" },
  { titel: "Kantoorpand, entree en gevel", oppervlak: "nog in te vullen", duur: "nog in te vullen" },
  { titel: "Bedrijfsverzamelgebouw", oppervlak: "nog in te vullen", duur: "nog in te vullen" },
];

export default function VoorEnNa() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(
              VRAGEN.map((v) => ({ question: v.vraag, answer: v.antwoord })),
              "faq-voor-en-na"
            )
          ),
        }}
      />

      <PaginaIntro
        eyebrow="Bewijs"
        h1="Voor en na — resultaten uit de praktijk"
        intro="Per project leggen wij het resultaat vast: een foto vooraf, een foto na afloop, vanuit dezelfde hoek."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Vraag vraag={VRAGEN[0].vraag}>
          <p>{VRAGEN[0].antwoord}</p>
        </Vraag>

        <div className="mb-12">
          <h2 className="font-[family-name:var(--font-fredoka)] text-2xl sm:text-3xl font-bold text-dark mb-2">
            Projecten
          </h2>
          <p className="text-dark/60 text-sm mb-6">
            Placeholder — onderstaande kaarten worden na elk project gevuld met
            een echte voor/na-foto, het gereinigde oppervlak in m² en de duur
            van de klus. Nog geen verzonnen cijfers of foto&apos;s.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PROJECTEN.map((project) => (
              <div
                key={project.titel}
                className="rounded-2xl border-2 border-dashed border-pink/30 bg-surface p-6"
              >
                <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-pink/30 flex items-center justify-center text-center text-sm text-dark/50 mb-4">
                  Voor/na-foto volgt
                </div>
                <p className="font-semibold text-dark mb-1">{project.titel}</p>
                <p className="text-sm text-dark/60">Oppervlak: {project.oppervlak}</p>
                <p className="text-sm text-dark/60">Duur: {project.duur}</p>
              </div>
            ))}
          </div>
        </div>

        <Vraag vraag={VRAGEN[1].vraag}>
          <p>{VRAGEN[1].antwoord}</p>
        </Vraag>

        <GerelateerdeLinks
          links={[
            { href: "/gevelreiniging", label: "Gevelreiniging voor bedrijven" },
            { href: "/gevelreiniging/kosten", label: "Wat kost gevelreiniging" },
            { href: "/bedrijfspand-reinigen", label: "Bedrijfspand reinigen" },
          ]}
        />
      </div>

      <OfferteFormulier />
    </>
  );
}
