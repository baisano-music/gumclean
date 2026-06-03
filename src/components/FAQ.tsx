import { FAQ_ITEMS } from "@/lib/constants";

export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-titel"
      className="scroll-mt-20 py-20 sm:py-28 bg-surface"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-purple/10 text-purple font-semibold text-sm rounded-full mb-4">
            Veelgestelde vragen
          </span>
          <h2
            id="faq-titel"
            className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl lg:text-6xl font-bold text-dark"
          >
            Vragen &amp; antwoorden
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group bg-white rounded-[1.5rem] border-2 border-pink/15 p-6 sm:p-7"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-[family-name:var(--font-fredoka)] text-lg sm:text-xl font-bold text-dark">
                {item.question}
                <span
                  className="shrink-0 text-2xl leading-none text-pink transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-muted leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
