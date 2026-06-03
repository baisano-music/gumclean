"use client";

import { useState } from "react";

// Indicatieve specifieke opbrengst in Nederland: ~900 kWh per kWp per jaar.
const KWH_PER_KWP_PER_JAAR = 900;

const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const getal = new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 0 });

function clamp(value: number, min: number) {
  return Number.isFinite(value) ? Math.max(min, value) : min;
}

export default function RendementCalculator() {
  const [panelen, setPanelen] = useState(24);
  const [wattpiek, setWattpiek] = useState(400);
  const [stroomprijs, setStroomprijs] = useState(0.28);
  const [verlies, setVerlies] = useState(12);

  const kWp = (clamp(panelen, 0) * clamp(wattpiek, 0)) / 1000;
  const jaaropbrengst = kWp * KWH_PER_KWP_PER_JAAR;
  const verliesKwh = jaaropbrengst * (verlies / 100);
  const verliesEuro = verliesKwh * clamp(stroomprijs, 0);

  const inputClass =
    "w-full px-4 py-2.5 bg-surface border-2 border-teal/20 rounded-xl text-dark placeholder-muted focus:outline-none focus:border-teal-dark focus:ring-2 focus:ring-teal/20 transition-colors";

  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 border-3 border-teal/20 shadow-teal">
      <h3 className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-dark mb-1">
        Bereken uw rendementsverlies
      </h3>
      <p className="text-muted text-sm mb-6">
        Een indicatie van wat vervuiling u per jaar kost.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="panelen" className="block text-sm font-semibold text-dark mb-1.5">
            Aantal panelen
          </label>
          <input
            id="panelen"
            type="number"
            min={0}
            value={panelen}
            onChange={(e) => setPanelen(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="wattpiek" className="block text-sm font-semibold text-dark mb-1.5">
            Vermogen per paneel (Wp)
          </label>
          <input
            id="wattpiek"
            type="number"
            min={0}
            value={wattpiek}
            onChange={(e) => setWattpiek(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="stroomprijs" className="block text-sm font-semibold text-dark mb-1.5">
            Stroomprijs (€ per kWh)
          </label>
          <input
            id="stroomprijs"
            type="number"
            min={0}
            step={0.01}
            value={stroomprijs}
            onChange={(e) => setStroomprijs(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="verlies" className="flex items-center justify-between text-sm font-semibold text-dark mb-1.5">
            <span>Geschat verlies door vervuiling</span>
            <span className="text-teal-dark font-bold">{verlies}%</span>
          </label>
          <input
            id="verlies"
            type="range"
            min={0}
            max={25}
            step={1}
            value={verlies}
            onChange={(e) => setVerlies(Number(e.target.value))}
            className="w-full accent-teal-dark"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>0%</span>
            <span>tot 25%</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-teal-dark/10 p-5 text-center">
        <p className="text-sm text-dark/70 mb-1">Geschat verlies per jaar</p>
        <p className="font-[family-name:var(--font-fredoka)] text-4xl sm:text-5xl font-bold text-teal-dark leading-none">
          {euro.format(verliesEuro)}
        </p>
        <p className="text-sm text-dark/70 mt-2">≈ {getal.format(verliesKwh)} kWh aan opbrengst</p>
      </div>

      <p className="text-xs text-muted mt-4">
        Indicatieve berekening op basis van circa {getal.format(KWH_PER_KWP_PER_JAAR)} kWh per kWp per jaar.
        Werkelijke cijfers verschillen per dak en situatie.
      </p>

      <a
        href="#offerte"
        className="mt-5 inline-flex w-full items-center justify-center px-6 py-3 bg-teal-dark text-white text-base font-bold rounded-full hover:bg-teal shadow-lg shadow-teal-dark/30 transition-all hover:scale-[1.02]"
      >
        Vraag een offerte aan →
      </a>
    </div>
  );
}
