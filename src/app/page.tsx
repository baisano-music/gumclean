import Hero from "@/components/Hero";
import Diensten from "@/components/Diensten";
import WaaromGumClean from "@/components/WaaromGumClean";
import VoorNa from "@/components/VoorNa";
import Klanten from "@/components/Klanten";
import Doelgroepen from "@/components/Doelgroepen";
import Zonnepanelen from "@/components/Zonnepanelen";
import Duurzaamheid from "@/components/Duurzaamheid";
import Contract from "@/components/Contract";
import DemoCTA from "@/components/DemoCTA";
import FAQ from "@/components/FAQ";
import OfferteFormulier from "@/components/OfferteFormulier";
import { faqJsonLd } from "@/lib/structuredData";
import { FAQ_ITEMS } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ_ITEMS, "faq")) }}
      />
      <Hero />
      <Diensten />
      <WaaromGumClean />
      <VoorNa />
      <Klanten />
      <Doelgroepen />
      <Zonnepanelen />
      <Duurzaamheid />
      <Contract />
      <DemoCTA />
      <FAQ />
      <OfferteFormulier />
    </>
  );
}
