import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Diensten from "@/components/Diensten";
import WaaromGumClean from "@/components/WaaromGumClean";
import VoorNa from "@/components/VoorNa";
import Doelgroepen from "@/components/Doelgroepen";
import OfferteFormulier from "@/components/OfferteFormulier";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Diensten />
        <WaaromGumClean />
        <VoorNa />
        <Doelgroepen />
        <OfferteFormulier />
      </main>
      <Footer />
    </>
  );
}
