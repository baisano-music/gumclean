"use client";

import { useState } from "react";

export default function OfferteFormulier() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot check
    if (data.get("_honeypot")) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/offerte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });

      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section id="offerte" className="scroll-mt-20 py-20 sm:py-28 bg-surface">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-teal/10 border-3 border-teal/30 rounded-[2rem] p-10 sm:p-14">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="font-[family-name:var(--font-fredoka)] text-3xl sm:text-4xl font-bold text-dark mb-4">
              Aanvraag verstuurd!
            </h2>
            <p className="text-muted text-lg">
              Bedankt voor uw aanvraag. Wij nemen binnen 24 uur contact met u op.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="offerte" className="relative scroll-mt-20 py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple/5 via-surface to-pink/5" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-pink/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-yellow/20 text-dark font-semibold text-sm rounded-full mb-4">
            Offerte aanvragen
          </span>
          <h2 className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-4">
            Ontvang binnen 24 uur een vrijblijvende offerte
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[2rem] p-8 sm:p-10 border-3 border-pink/20 shadow-pink"
        >
          {/* Honeypot */}
          <input type="text" name="_honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Naam *</label>
              <input
                name="naam"
                required
                className="w-full px-5 py-3 bg-surface border-2 border-pink/20 rounded-xl text-dark placeholder-muted focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-colors"
                placeholder="Uw naam"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Bedrijfsnaam *</label>
              <input
                name="bedrijf"
                required
                className="w-full px-5 py-3 bg-surface border-2 border-pink/20 rounded-xl text-dark placeholder-muted focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-colors"
                placeholder="Uw bedrijf"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Telefoonnummer *</label>
                <input
                  name="telefoon"
                  type="tel"
                  required
                  className="w-full px-5 py-3 bg-surface border-2 border-pink/20 rounded-xl text-dark placeholder-muted focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-colors"
                  placeholder="+31 6..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">E-mailadres *</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-5 py-3 bg-surface border-2 border-pink/20 rounded-xl text-dark placeholder-muted focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-colors"
                  placeholder="info@bedrijf.nl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Locatie / adres *</label>
              <input
                name="locatie"
                required
                className="w-full px-5 py-3 bg-surface border-2 border-pink/20 rounded-xl text-dark placeholder-muted focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-colors"
                placeholder="Adres of locatiebeschrijving"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Waar heeft u behoefte aan?</label>
                <select
                  name="dienst"
                  className="w-full px-5 py-3 bg-surface border-2 border-pink/20 rounded-xl text-dark focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-colors"
                >
                  <option value="">Selecteer...</option>
                  <option value="Kauwgumverwijdering">Kauwgumverwijdering</option>
                  <option value="Winkelpui / gevelreiniging">Winkelpui / gevelreiniging</option>
                  <option value="Zonnepanelen reiniging">Zonnepanelen reiniging</option>
                  <option value="Combinatie / meerdere diensten">Combinatie / meerdere diensten</option>
                  <option value="Weet ik nog niet">Weet ik nog niet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Aantal locaties (optioneel)</label>
                <input
                  name="locaties"
                  type="number"
                  min={1}
                  className="w-full px-5 py-3 bg-surface border-2 border-pink/20 rounded-xl text-dark placeholder-muted focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-colors"
                  placeholder="bijv. 1 of 21"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Geschatte oppervlakte</label>
              <select
                name="oppervlakte"
                className="w-full px-5 py-3 bg-surface border-2 border-pink/20 rounded-xl text-dark focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-colors"
              >
                <option value="">Selecteer...</option>
                <option value="<100m²">&lt;100 m²</option>
                <option value="100-500m²">100 - 500 m²</option>
                <option value="500m²+">500 m²+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Bericht / toelichting</label>
              <textarea
                name="bericht"
                rows={4}
                className="w-full px-5 py-3 bg-surface border-2 border-pink/20 rounded-xl text-dark placeholder-muted focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-colors resize-none"
                placeholder="Eventuele details over uw situatie..."
              />
            </div>
          </div>

          {status === "error" && (
            <div className="mt-4 p-4 bg-pink/10 border border-pink/30 rounded-xl text-pink-dark text-sm">
              Er ging iets mis. Probeer het opnieuw of mail ons direct op info@gumclean.nl.
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-8 w-full px-8 py-4 bg-pink text-white text-lg font-bold rounded-full hover:bg-pink-dark shadow-lg shadow-pink/30 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          >
            {status === "loading" ? "Versturen..." : "Verstuur aanvraag →"}
          </button>
        </form>
      </div>
    </section>
  );
}
