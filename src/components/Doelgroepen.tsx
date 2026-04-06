import Image from "next/image";
import { TARGET_AUDIENCES } from "@/lib/constants";

export default function Doelgroepen() {
  return (
    <section id="doelgroepen" className="scroll-mt-20 py-20 sm:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal-dark font-semibold text-sm rounded-full mb-4">
            Voor wie
          </span>
          <h2 className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl lg:text-6xl font-bold text-dark">
            Onze doelgroepen
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TARGET_AUDIENCES.map((audience) => (
            <div
              key={audience.title}
              className="group relative rounded-[2rem] overflow-hidden border-3 border-pink/20 hover:border-pink/40 transition-all hover:scale-[1.02] hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <Image
                  src={audience.image}
                  alt={audience.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{audience.emoji}</span>
                  <h3 className="font-[family-name:var(--font-fredoka)] text-xl sm:text-2xl font-bold text-white">
                    {audience.title}
                  </h3>
                </div>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  {audience.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
