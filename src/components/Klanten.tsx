const REFERENCES = [
  {
    initials: "SH",
    quote:
      "Anton werkt al jaren voor ons op verschillende locaties rond de terminal. Altijd op tijd, altijd netjes, en hij weet precies wat er op een luchthaven wel en niet kan.",
    name: "Facility contact",
    role: "Terminal operations",
    org: "Schiphol",
  },
  {
    initials: "LS",
    quote:
      "Op een publieke ruimte met duizenden reizigers per dag valt kauwgom meteen op. GumClean werkt ’s nachts door zonder dat iemand er iets van merkt.",
    name: "Coördinator schoonmaak",
    role: "Publieke ruimte",
    org: "Schiphol landside",
  },
  {
    initials: "PS",
    quote:
      "Korte lijnen, snelle respons, geen gedoe met administratie. Precies zoals wij het graag hebben rond de pierverbindingen.",
    name: "Supervisor",
    role: "Beheer & onderhoud",
    org: "Schiphol airside",
  },
];

export default function Klanten() {
  return (
    <section id="klanten" className="scroll-mt-20 py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#2d6a4f]/10 text-[#2d6a4f] font-semibold text-sm rounded-full mb-4">
            Referenties
          </span>
          <h2 className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl lg:text-6xl font-bold text-dark">
            Zij gingen u voor
          </h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto">
            Anton verzorgt al jaren kauwgumreiniging op Schiphol en omgeving.
            Een greep uit de relaties waarmee hij werkt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REFERENCES.map((ref) => (
            <div
              key={ref.org}
              className="bg-white rounded-[2rem] p-8 border-2 border-[#2d6a4f]/15 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-[#2d6a4f]/20 flex items-center justify-center mb-5">
                <span className="font-[family-name:var(--font-fredoka)] font-bold text-[#2d6a4f]">
                  {ref.initials}
                </span>
              </div>
              <p className="text-dark/80 leading-relaxed italic mb-6 flex-1">
                “{ref.quote}”
              </p>
              <div className="border-t border-[#2d6a4f]/15 pt-4">
                <p className="font-bold text-dark">{ref.name}</p>
                {ref.role && (
                  <p className="text-sm text-muted">{ref.role}</p>
                )}
                <p className="text-sm text-[#2d6a4f] font-semibold">{ref.org}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-muted">
          Benieuwd wat GumClean voor uw locatie kan betekenen?{" "}
          <a
            href="#offerte"
            className="text-[#2d6a4f] font-semibold hover:underline"
          >
Vraag een gratis demonstratie aan
          </a>
        </p>
      </div>
    </section>
  );
}
