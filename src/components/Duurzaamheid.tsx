const STEPS = [
  {
    title: "Voorkomen",
    text: "Goede afvalvoorzieningen en bewustwording op drukke plekken houden kauwgom in de bak, niet op straat.",
  },
  {
    title: "Verwijderen",
    text: "Wat toch op straat belandt, verwijdert GumClean professioneel met stoom op 150°C, geen chemicaliën, geen schade.",
  },
  {
    title: "Recyclen",
    text: "Onze ambitie: ingezamelde kauwgom hergebruiken in nieuwe producten. Hier werken we naartoe richting een volledig circulaire aanpak.",
  },
];

export default function Duurzaamheid() {
  return (
    <section
      id="duurzaamheid"
      className="scroll-mt-20 py-20 sm:py-28 bg-surface"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#2d6a4f]/10 text-[#2d6a4f] font-semibold text-sm rounded-full mb-4">
            Circulair
          </span>
          <h2 className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl lg:text-6xl font-bold text-dark">
            Schoon én groen, van vuil naar nieuw
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-muted text-lg leading-relaxed">
            Kauwgum bevat plastic en blijft 20 tot 100 jaar op straat liggen.
            GumClean verwijdert het milieuvriendelijk en onderzoekt
            mogelijkheden om ingezamelde kauwgom te hergebruiken in nieuwe producten.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-2">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col md:flex-row items-center flex-1">
              <div className="bg-white rounded-[2rem] p-8 border-2 border-[#2d6a4f]/20 shadow-lg flex-1 w-full">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#2d6a4f] text-white font-[family-name:var(--font-fredoka)] font-bold text-lg mb-4">
                  {i + 1}
                </div>
                <h3 className="font-[family-name:var(--font-fredoka)] text-xl font-bold text-[#2d6a4f] mb-3">
                  {step.title}
                </h3>
                <p className="text-dark/75 leading-relaxed text-sm">
                  {step.text}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex items-center justify-center p-2 text-[#2d6a4f] text-3xl font-bold shrink-0"
                  aria-hidden="true"
                >
                  <svg
                    className="hidden md:block w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
                  </svg>
                  <svg
                    className="md:hidden w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7M12 5v15" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-3 bg-[#2d6a4f]/10 text-[#2d6a4f] font-semibold px-6 py-3 rounded-full border border-[#2d6a4f]/20 text-sm sm:text-base">
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>
              GumClean gebruikt uitsluitend biologisch afbreekbare middelen en
              minimaal water (4–8 liter per dag vs. 30.000 liter
              hogedrukreiniging)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
