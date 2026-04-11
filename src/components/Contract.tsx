export default function Contract() {
  return (
    <section id="contract" className="scroll-mt-20 py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#2d6a4f]/10 text-[#2d6a4f] font-semibold text-sm rounded-full mb-4">
            Onderhoudscontract
          </span>
          <h2 className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl lg:text-6xl font-bold text-dark">
            Eén contract. Altijd schoon.
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-muted text-lg leading-relaxed">
            Geen verrassingen, geen facturen die uit het niets komen — gewoon
            een vaste prijs voor een structureel schoon centrum of terrein.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Kaart A */}
          <div className="bg-white rounded-[2rem] p-8 sm:p-10 border-2 border-[#2d6a4f]/20 shadow-lg flex flex-col">
            <span className="inline-block self-start px-3 py-1 bg-gray-100 text-dark text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
              Populair als start
            </span>
            <h3 className="font-[family-name:var(--font-fredoka)] text-2xl sm:text-3xl font-bold text-dark mb-6">
              Eenmalige basisreiniging
            </h3>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Verwijdering van jarenlange accumulatie",
                "Volledige foto-documentatie voor/na",
                "Locatierapport met behandeld oppervlak",
                "Gratis demonstratie vooraf mogelijk",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-dark/80">
                  <span className="text-[#2d6a4f] font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#offerte"
              className="inline-flex justify-center items-center px-6 py-3 bg-white text-[#2d6a4f] text-sm font-bold rounded-full border-2 border-[#2d6a4f] hover:bg-[#2d6a4f] hover:text-white transition-colors"
            >
              Vraag offerte aan
            </a>
          </div>

          {/* Kaart B — highlighted */}
          <div className="bg-[#2d6a4f] rounded-[2rem] p-8 sm:p-10 shadow-2xl flex flex-col relative md:-translate-y-4">
            <span className="inline-block self-start px-3 py-1 bg-white text-[#2d6a4f] text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
Aanbevolen
            </span>
            <h3 className="font-[family-name:var(--font-fredoka)] text-2xl sm:text-3xl font-bold text-white mb-6">
              Kwartaalonderhoudscontract
            </h3>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "4x per jaar professionele behandeling",
                "Inclusief kwartaalrapportage (voor/na + tellingen)",
                "Opzegbaar per kwartaal met 30 dagen opzegtermijn",
                "Prioriteit bij evenementen op aanvraag",
                "Vaste contactpersoon, binnen 48 uur beschikbaar",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-white/90">
                  <span className="text-white font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#offerte"
              className="inline-flex justify-center items-center px-6 py-3 bg-white text-[#2d6a4f] text-sm font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start het gesprek
            </a>
          </div>
        </div>

        <p className="text-center mt-12 text-muted text-sm sm:text-base">
          Klanten met een onderhoudscontract betalen gemiddeld 20% minder per
          behandeling dan bij losse opdrachten.
        </p>
      </div>
    </section>
  );
}
