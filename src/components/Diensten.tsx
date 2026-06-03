import { SERVICES } from "@/lib/constants";
import { DoodleBroom, DoodleBuilding, DoodleSun } from "./DoodleIcons";

const colorMap = {
  pink: {
    bg: "bg-pink",
    text: "text-white",
    desc: "text-white/90",
    icon: "text-white/80",
    chip: "bg-white/15 text-white",
  },
  purple: {
    bg: "bg-purple",
    text: "text-white",
    desc: "text-white/90",
    icon: "text-white/80",
    chip: "bg-white/15 text-white",
  },
  teal: {
    bg: "bg-teal",
    text: "text-dark",
    desc: "text-dark/80",
    icon: "text-dark/60",
    chip: "bg-dark/10 text-dark",
  },
} as const;

const icons = [DoodleBuilding, DoodleSun, DoodleBroom];

export default function Diensten() {
  return (
    <section id="diensten" className="scroll-mt-20 py-20 sm:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-pink/10 text-pink font-semibold text-sm rounded-full mb-4">
            Onze diensten
          </span>
          <h2 className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl lg:text-6xl font-bold text-dark">
            Onze drie kerndiensten
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service, i) => {
            const colors = colorMap[service.color];
            const Icon = icons[i];
            return (
              <div
                key={service.title}
                className={`relative ${colors.bg} rounded-[2rem] p-8 sm:p-10 transition-transform hover:scale-[1.04] hover:-translate-y-1 shadow-lg`}
              >
                {service.badge && (
                  <span className="absolute top-5 right-5 px-3 py-1 rounded-full bg-[#f5a623] text-white text-xs font-bold shadow-sm">
                    {service.badge}
                  </span>
                )}
                <div className={`${colors.icon} mb-6`}>
                  <Icon className="w-16 h-16" />
                </div>
                <h3 className={`font-[family-name:var(--font-fredoka)] text-2xl sm:text-3xl font-bold ${colors.text} mb-4`}>
                  {service.title}
                </h3>
                <p className={`${colors.desc} leading-relaxed text-base`}>
                  {service.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {service.labels.map((label) => (
                    <span
                      key={label}
                      className={`${colors.chip} text-xs font-semibold px-3 py-1 rounded-full`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
