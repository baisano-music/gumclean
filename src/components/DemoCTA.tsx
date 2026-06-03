export default function DemoCTA() {
  return (
    <section id="demo" className="scroll-mt-20 py-20 sm:py-28 bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2d6a4f] rounded-[2.5rem] px-8 py-16 sm:px-16 sm:py-20 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none"
               style={{
                 backgroundImage:
                   "radial-gradient(circle at 20% 30%, white 0%, transparent 40%), radial-gradient(circle at 80% 70%, white 0%, transparent 40%)",
               }}
          />

          <div className="relative">
            <h2 className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Zien is geloven.
            </h2>
            <p className="text-white/90 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              Wij komen gratis langs voor een demonstratie op uw locatie,
              50 m², 20 minuten, geen verplichtingen. U ziet het resultaat
              met eigen ogen voordat u iets beslist.
            </p>

            <div className="flex justify-center items-center">
              <a
                href="#offerte"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#2d6a4f] text-base font-bold rounded-full hover:bg-gray-100 shadow-lg transition-all hover:scale-105 w-full sm:w-auto"
              >
                Plan een gratis demo →
              </a>
            </div>

            <p className="text-white/70 text-sm mt-8">
              Wij zijn actief in heel gemeente Haarlemmermeer en omgeving.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
