import { USPS } from "@/lib/constants";
import { DoodlePin, DoodleBuilding, DoodleLeaf, DoodleBolt } from "./DoodleIcons";

const colorMap = {
  pink: {
    bg: "bg-white",
    border: "border-pink/20",
    icon: "text-pink",
    title: "text-dark",
  },
  yellow: {
    bg: "bg-white",
    border: "border-yellow/40",
    icon: "text-purple",
    title: "text-dark",
  },
  teal: {
    bg: "bg-white",
    border: "border-teal/30",
    icon: "text-teal-dark",
    title: "text-dark",
  },
  purple: {
    bg: "bg-white",
    border: "border-purple/20",
    icon: "text-purple",
    title: "text-dark",
  },
} as const;

const icons = [DoodlePin, DoodleBuilding, DoodleLeaf, DoodleBolt];

export default function WaaromGumClean() {
  return (
    <section id="waarom" className="scroll-mt-20 py-20 sm:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-purple/10 text-purple font-semibold text-sm rounded-full mb-4">
            Waarom wij
          </span>
          <h2 className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl lg:text-6xl font-bold text-dark">
            Waarom GumClean?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {USPS.map((usp, i) => {
            const colors = colorMap[usp.color];
            const Icon = icons[i];
            return (
              <div
                key={usp.title}
                className={`${colors.bg} ${colors.border} border-2 rounded-[2rem] p-8 sm:p-10 transition-all hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className={`${colors.icon} mb-5`}>
                  <Icon className="w-14 h-14" />
                </div>
                <h3 className={`font-[family-name:var(--font-fredoka)] text-xl sm:text-2xl font-bold ${colors.title} mb-3`}>
                  {usp.title}
                </h3>
                <p className="text-muted leading-relaxed">
                  {usp.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
