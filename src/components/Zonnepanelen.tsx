import RendementCalculator from "./RendementCalculator";

const BENEFITS = [
  "Gedemineraliseerd water, geen kalkaanslag",
  "Zachte borstels, geen beschadiging coating",
  "Toegang tot platte en schuine daken",
  "Rapportage per pand",
];

const STATS = [
  { value: "tot 25%", label: "minder opbrengst door vervuiling" },
  { value: "1x per jaar", label: "aanbevolen reiniging voor optimaal rendement" },
];

export default function Zonnepanelen() {
  return (
    <section
      id="zonnepanelen"
      className="scroll-mt-20 py-20 sm:py-28"
      style={{ backgroundColor: "#f0f7f4" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f5a623]/15 text-[#a86c08] font-semibold text-sm rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
            Specialisme
          </span>
          <h2 className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl lg:text-6xl font-bold text-dark">
            Zonnepanelen, de stille energielek
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left, statistics + uitleg */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {STATS.map((stat) => (
                <div
                  key={stat.value}
                  className="bg-white rounded-[2rem] p-7 border-3 border-teal/20 shadow-teal"
                >
                  <div className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl font-bold text-teal-dark mb-3 leading-none">
                    {stat.value}
                  </div>
                  <p className="text-muted text-base leading-relaxed">{stat.label}</p>
                </div>
              ))}
            </div>

            <p className="text-dark/80 text-lg leading-relaxed mb-6">
              Stof, vogeluitwerpselen en groenaanslag verminderen de lichtopvang van
              zonnepanelen significant. Professionele reiniging met gedemineraliseerd
              water herstelt het volledige rendement, zonder krassen, zonder
              kalkranden.
            </p>

            <ul className="space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-teal-dark/15 text-teal-dark">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-dark/80 text-base leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right, interactieve rendement-calculator */}
          <RendementCalculator />
        </div>
      </div>
    </section>
  );
}
