import BeforeAfterSlider from "./BeforeAfterSlider";

export default function VoorNa() {
  return (
    <section id="voor-na" className="relative scroll-mt-20 py-20 sm:py-28 bg-dark overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-pink/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-pink/20 text-pink font-semibold text-sm rounded-full mb-4">
            Resultaten
          </span>
          <h2 className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Van vies naar vlekkeloos
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Resultaat na één behandeling, zonder schade aan de ondergrond.
          </p>
        </div>

        <BeforeAfterSlider />
      </div>

      {/* Wave divider to next section */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[60px] sm:h-[80px]">
          <path
            d="M0,40 C480,120 960,0 1440,60 L1440,120 L0,120 Z"
            fill="#FFF5FB"
          />
        </svg>
      </div>
    </section>
  );
}
