export default function PaginaIntro({
  eyebrow,
  h1,
  intro,
}: {
  eyebrow: string;
  h1: string;
  intro: string;
}) {
  return (
    <div className="pt-32 pb-16 sm:pb-20 bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-4 py-1.5 bg-pink/10 text-pink-dark font-semibold text-sm rounded-full mb-4">
          {eyebrow}
        </span>
        <h1 className="font-[family-name:var(--font-fredoka)] text-3xl sm:text-5xl font-bold text-dark mb-5">
          {h1}
        </h1>
        <p className="text-lg text-dark/70 leading-relaxed">{intro}</p>
      </div>
    </div>
  );
}
