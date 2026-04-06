import { SERVICES } from "@/lib/constants";
import { DoodleBroom, DoodleCalendar, DoodleBuilding } from "./DoodleIcons";

const colorMap = {
  pink: {
    bg: "bg-pink",
    text: "text-white",
    desc: "text-white/90",
    icon: "text-white/80",
  },
  purple: {
    bg: "bg-purple",
    text: "text-white",
    desc: "text-white/90",
    icon: "text-white/80",
  },
  teal: {
    bg: "bg-teal",
    text: "text-dark",
    desc: "text-dark/80",
    icon: "text-dark/60",
  },
} as const;

const icons = [DoodleBroom, DoodleCalendar, DoodleBuilding];

export default function Diensten() {
  return (
    <section id="diensten" className="scroll-mt-20 py-20 sm:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-pink/10 text-pink font-semibold text-sm rounded-full mb-4">
            Onze diensten
          </span>
          <h2 className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl lg:text-6xl font-bold text-dark">
            Wat wij doen
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service, i) => {
            const colors = colorMap[service.color];
            const Icon = icons[i];
            return (
              <div
                key={service.title}
                className={`${colors.bg} rounded-[2rem] p-8 sm:p-10 transition-transform hover:scale-[1.04] hover:-translate-y-1 shadow-lg`}
              >
                <div className={`${colors.icon} mb-6`}>
                  <Icon className="w-16 h-16" />
                </div>
                <h3 className={`font-[family-name:var(--font-fredoka)] text-2xl sm:text-3xl font-bold ${colors.text} mb-4`}>
                  {service.title}
                </h3>
                <p className={`${colors.desc} leading-relaxed text-base`}>
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
