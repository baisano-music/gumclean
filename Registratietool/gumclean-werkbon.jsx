import React, { useState, useEffect, useMemo } from "react";
import {
  Truck, Building2, CheckCircle2, AlertTriangle, Plus, Trash2,
  Clock, Route, Wrench, Package, FileText, Settings, ChevronLeft,
  Calculator, Copy, Check
} from "lucide-react";

const INK = "#1A0A2E";
const ROZE = "#FF3D9A";
const GEEL = "#FFE03D";
const GROEN = "#1E9E3A";
const PAPIER = "#FDF9FB";

const KM_TARIEF = 0.25;

const LEEG_ROUTE = () => ({
  id: crypto.randomUUID(), naam: "", tenaamstelling: "", adres: "",
  btw: "", email: "", notitie: ""
});

const LEEG_KLANT = () => ({
  id: crypto.randomUUID(), naam: "", contactpersoon: "", kvk: "",
  dagtarief: 540, betaaltermijn: 60, routes: [LEEG_ROUTE()]
});

const LEEG_PAND = (klantId) => ({
  id: crypto.randomUUID(), klantId, routeId: "", naam: "", adres: "",
  filiaalnummer: "", grootboek: "", begrootMandagen: 0, afstandEnkel: 0,
  hoogwerker: false, doorbelast: 0, status: "open",
  materieel: [], uren: [], ritten: [], verbruik: []
});

const START = () => {
  const action = { ...LEEG_KLANT(), naam: "Action Nederland B.V.", contactpersoon: "Udo Blauw", kvk: "", dagtarief: 540, betaaltermijn: 60 };
  const rA = { ...LEEG_ROUTE(), naam: "Eigen vastgoed (OG-winkels)", email: "APinvoiceVGWI@action.eu", notitie: "Tenaamstelling nog opvragen bij Udo" };
  const rB = { ...LEEG_ROUTE(), naam: "Huurpanden (Store Facility)", email: "InvoiceNL@action.nl",
    tenaamstelling: "Action Nederland BV", adres: "Perenmarkt 15, 1681 PG Zwaagdijk-Oost", btw: "NL813233409B01",
    notitie: "Pdf 300 dpi, kostenplaats en contactpersoon verplicht" };
  action.routes = [rA, rB];

  const p = (naam, md, km, hw, routeId = "", extra = {}) => ({
    ...LEEG_PAND(action.id), naam, begrootMandagen: md, afstandEnkel: km, hoogwerker: hw, routeId, ...extra
  });

  const panden = [
    p("Spakenburg (UT)", 3, 55, false),
    p("Zwaagdijk (NH)", 6, 50, true),
    p("Wolvega (FR)", 6, 135, true),
    p("Drachten (FR)", 4, 165, true, rA.id),
    p("Surhuisterveen (FR)", 6, 175, true),
    p("Dokkum (FR)", 8, 175, true),
    p("Uithuizen (GR)", 3, 215, false),
    p("Leek (GR)", 4, 170, false, rA.id),
    p("Assen (DR)", 4, 180, true),
    p("Geldrop (NB)", 4, 135, false, rB.id, { filiaalnummer: "1441" }),
  ];
  return {
    klanten: [action],
    panden,
    instellingen: { thuisadres: "Manenburgdreef 93, 2135 GV Hoofddorp", dieselprijs: 1.95, verbruik: 8.5, uurloon: 25 }
  };
};

const STORAGE_KEY = "gumclean:registratie:v1";
const eur = (n) => "€ " + (n || 0).toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const eur0 = (n) => "€ " + Math.round(n || 0).toLocaleString("nl-NL");
const num = (v) => (v === "" || v === null || v === undefined ? 0 : Number(v) || 0);

function Veld({ label, value, onChange, type = "text", placeholder, breed }) {
  return (
    <label className={"block " + (breed ? "col-span-2" : "")}>
      <span className="block text-xs mb-1" style={{ color: "#6B5B7B" }}>{label}</span>
      <input
        type={type} value={value ?? ""} placeholder={placeholder}
        onChange={(e) => onChange(type === "number" ? e.target.value : e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
        style={{ borderColor: "#E4DCEA", background: "white", color: INK }}
      />
    </label>
  );
}

function Knop({ children, onClick, variant = "roze", klein }) {
  const s = variant === "roze"
    ? { background: ROZE, color: "white" }
    : variant === "geel" ? { background: GEEL, color: INK }
    : { background: "white", color: INK, border: "1px solid #E4DCEA" };
  return (
    <button onClick={onClick} style={s}
      className={"rounded-lg font-medium transition hover:opacity-90 " + (klein ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm")}>
      {children}
    </button>
  );
}

function Kaart({ children, className = "" }) {
  return <div className={"rounded-2xl p-5 " + className} style={{ background: "white", border: "1px solid #EDE6F2" }}>{children}</div>;
}

export default function App() {
  const [data, setData] = useState(null);
  const [scherm, setScherm] = useState({ naam: "overzicht" });
  const [bezig, setBezig] = useState(true);
  const [gekopieerd, setGekopieerd] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        setData(r ? JSON.parse(r.value) : START());
      } catch { setData(START()); }
      setBezig(false);
    })();
  }, []);

  const bewaar = async (nieuw) => {
    setData(nieuw);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(nieuw)); } catch { /* blijft in geheugen */ }
  };

  const wijzigPand = (id, patch) =>
    bewaar({ ...data, panden: data.panden.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const wijzigKlant = (id, patch) =>
    bewaar({ ...data, klanten: data.klanten.map((k) => (k.id === id ? { ...k, ...patch } : k)) });

  if (bezig || !data) return <div className="p-8 text-sm" style={{ color: INK }}>Bezig met laden…</div>;

  const klantVan = (p) => data.klanten.find((k) => k.id === p.klantId);
  const routeVan = (p) => klantVan(p)?.routes.find((r) => r.id === p.routeId);

  // ---- de kern: wat ontbreekt er nog ----
  const controle = (p) => {
    const k = klantVan(p), r = routeVan(p);
    const punten = [
      { v: !!k?.naam, t: "Klantnaam" },
      { v: !!p.naam, t: "Pandnaam" },
      { v: !!p.routeId, t: "Factuurroute gekozen" },
      { v: !!r?.tenaamstelling, t: "Tenaamstelling factuurroute" },
      { v: !!r?.adres, t: "Factuuradres" },
      { v: !!r?.btw, t: "Btw-nummer factuurroute" },
      { v: !!r?.email, t: "Factuur-mailadres" },
      { v: !!p.grootboek, t: "Grootboeknummer" },
      { v: !!p.filiaalnummer, t: "Filiaalnummer" },
      { v: !!k?.contactpersoon, t: "Contactpersoon bij klant" },
      { v: num(p.begrootMandagen) > 0, t: "Begrote mandagen" },
      { v: num(p.afstandEnkel) > 0, t: "Afstand enkele reis" },
      { v: p.materieel.length > 0, t: "Materieellijst" },
    ];
    return { punten, ontbreekt: punten.filter((x) => !x.v) };
  };

  const cijfers = (p) => {
    const k = klantVan(p);
    const tarief = num(k?.dagtarief) || 540;
    const gewerkteUren = p.uren.reduce((s, u) => s + num(u.uren), 0);
    const kmZakelijk = p.ritten.filter((r) => r.type !== "prive").reduce((s, r) => s + num(r.km), 0);
    const kmPrive = p.ritten.filter((r) => r.type === "prive").reduce((s, r) => s + num(r.km), 0);
    const materiaal = p.verbruik.reduce((s, v) => s + num(v.aantal) * num(v.prijs), 0);
    const uurloon = num(data.instellingen.uurloon) || 25;
    const omzet = num(p.begrootMandagen) * tarief;
    const reiskosten = kmZakelijk * KM_TARIEF;
    const arbeid = gewerkteUren * uurloon;
    const kosten = reiskosten + materiaal;
    const marge = omzet - kosten;
    const resultaat = marge - arbeid;
    const liters = kmZakelijk * (num(data.instellingen.verbruik) / 100);
    return {
      tarief, uurloon, gewerkteUren, mandagenWerkelijk: gewerkteUren / 8, kmZakelijk, kmPrive,
      materiaal, omzet, reiskosten, arbeid, kosten, marge, resultaat, liters,
      diesel: liters * num(data.instellingen.dieselprijs),
      effectief: gewerkteUren > 0 ? marge / gewerkteUren : 0,
      dekking: arbeid > 0 ? marge / arbeid : 0,
      afwijking: gewerkteUren / 8 - num(p.begrootMandagen),
    };
  };

  const kopieer = (tekst, id) => {
    navigator.clipboard?.writeText(tekst);
    setGekopieerd(id);
    setTimeout(() => setGekopieerd(""), 1600);
  };

  // =================== OVERZICHT ===================
  const Overzicht = () => {
    const totaal = data.panden.reduce((s, p) => s + cijfers(p).omzet, 0);
    const klaar = data.panden.filter((p) => controle(p).ontbreekt.length === 0).length;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <Kaart><div className="text-xs" style={{ color: "#6B5B7B" }}>Opdrachten</div>
            <div className="text-2xl" style={{ fontFamily: "Fredoka", color: INK }}>{data.panden.length}</div></Kaart>
          <Kaart><div className="text-xs" style={{ color: "#6B5B7B" }}>Klaar om te rijden</div>
            <div className="text-2xl" style={{ fontFamily: "Fredoka", color: klaar ? GROEN : INK }}>{klaar}</div></Kaart>
          <Kaart><div className="text-xs" style={{ color: "#6B5B7B" }}>Begrote omzet</div>
            <div className="text-2xl" style={{ fontFamily: "Fredoka", color: INK }}>{eur0(totaal)}</div></Kaart>
        </div>

        {data.klanten.map((k) => {
          const panden = data.panden.filter((p) => p.klantId === k.id);
          const som = panden.reduce((a, p) => {
            const c = cijfers(p);
            return { omzet: a.omzet + c.omzet, marge: a.marge + c.marge, resultaat: a.resultaat + c.resultaat,
              kosten: a.kosten + c.kosten + c.arbeid, km: a.km + c.kmZakelijk, uren: a.uren + c.gewerkteUren };
          }, { omzet: 0, marge: 0, resultaat: 0, kosten: 0, km: 0, uren: 0 });
          return (
            <div key={k.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 size={18} style={{ color: ROZE }} />
                  <h2 className="text-lg" style={{ fontFamily: "Fredoka", color: INK }}>{k.naam || "Naamloze klant"}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#F3ECF7", color: "#6B5B7B" }}>
                    {eur0(k.dagtarief)} per mandag
                  </span>
                </div>
                <Knop variant="wit" klein onClick={() => setScherm({ naam: "klant", id: k.id })}>Klantgegevens</Knop>
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EDE6F2", background: "white" }}>
                {panden.map((p, i) => {
                  const c = controle(p), g = cijfers(p);
                  const ok = c.ontbreekt.length === 0;
                  return (
                    <button key={p.id} onClick={() => setScherm({ naam: "pand", id: p.id })}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition"
                      style={{ borderTop: i ? "1px solid #F1EAF5" : "none" }}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ok ? GROEN : ROZE }} />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium truncate" style={{ color: INK }}>{p.naam}</span>
                        <span className="block text-xs truncate" style={{ color: "#8A7B98" }}>
                          {ok ? "Compleet" : c.ontbreekt.length + " ontbreekt: " + c.ontbreekt.map((x) => x.t).join(", ")}
                        </span>
                      </span>
                      <span className="text-right shrink-0">
                        <span className="block text-sm" style={{ color: INK }}>{eur0(g.omzet)}</span>
                        <span className="block text-xs" style={{ color: g.gewerkteUren > 0 ? (g.resultaat >= 0 ? GROEN : ROZE) : "#8A7B98" }}>
                          {g.gewerkteUren > 0
                            ? eur0(g.resultaat) + " resultaat"
                            : p.begrootMandagen + " mandagen · " + p.afstandEnkel + " km"}
                        </span>
                      </span>
                    </button>
                  );
                })}
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: "1px solid #EDE6F2", background: "#FBF7FD" }}>
                  <span className="text-xs" style={{ color: "#6B5B7B" }}>
                    Totaal {panden.length} panden · {Math.round(som.km)} km zakelijk · {som.uren} uur geregistreerd
                  </span>
                  <span className="text-sm" style={{ fontFamily: "Fredoka", color: INK }}>
                    {eur0(som.omzet)} opbrengst · {eur0(som.kosten)} kosten ·{" "}
                    <span style={{ color: som.resultaat >= 0 ? GROEN : ROZE }}>{eur0(som.resultaat)} resultaat</span>
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <Knop variant="wit" klein onClick={() => bewaar({ ...data, panden: [...data.panden, LEEG_PAND(k.id)] })}>
                  <span className="flex items-center gap-1"><Plus size={13} /> Opdracht toevoegen</span>
                </Knop>
              </div>
            </div>
          );
        })}

        <Knop variant="wit" onClick={() => {
          const k = LEEG_KLANT();
          bewaar({ ...data, klanten: [...data.klanten, k] });
          setScherm({ naam: "klant", id: k.id });
        }}>
          <span className="flex items-center gap-1"><Plus size={14} /> Nieuwe klant</span>
        </Knop>
      </div>
    );
  };

  // =================== KLANT ===================
  const KlantScherm = ({ id }) => {
    const k = data.klanten.find((x) => x.id === id);
    if (!k) return null;
    const zetRoute = (rid, patch) =>
      wijzigKlant(k.id, { routes: k.routes.map((r) => (r.id === rid ? { ...r, ...patch } : r)) });
    return (
      <div className="space-y-5">
        <Kaart>
          <h3 className="mb-3" style={{ fontFamily: "Fredoka", color: INK }}>Klantgegevens</h3>
          <div className="grid grid-cols-2 gap-3">
            <Veld label="Bedrijfsnaam" value={k.naam} onChange={(v) => wijzigKlant(k.id, { naam: v })} />
            <Veld label="Contactpersoon" value={k.contactpersoon} onChange={(v) => wijzigKlant(k.id, { contactpersoon: v })} />
            <Veld label="KvK-nummer" value={k.kvk} onChange={(v) => wijzigKlant(k.id, { kvk: v })} />
            <Veld label="Dagtarief (excl. btw)" type="number" value={k.dagtarief} onChange={(v) => wijzigKlant(k.id, { dagtarief: v })} />
            <Veld label="Betaaltermijn in dagen" type="number" value={k.betaaltermijn} onChange={(v) => wijzigKlant(k.id, { betaaltermijn: v })} />
          </div>
        </Kaart>

        <div>
          <h3 className="mb-2" style={{ fontFamily: "Fredoka", color: INK }}>Factuurroutes</h3>
          <p className="text-xs mb-3" style={{ color: "#8A7B98" }}>
            Eén klant kan meerdere routes hebben met een eigen tenaamstelling en btw-nummer. Elke opdracht wijst er één aan.
          </p>
          <div className="space-y-3">
            {k.routes.map((r) => {
              const compleet = r.tenaamstelling && r.adres && r.btw && r.email;
              return (
                <Kaart key={r.id}>
                  <div className="flex items-center gap-2 mb-3">
                    {compleet ? <CheckCircle2 size={16} style={{ color: GROEN }} /> : <AlertTriangle size={16} style={{ color: ROZE }} />}
                    <span className="text-sm font-medium" style={{ color: INK }}>{r.naam || "Naamloze route"}</span>
                    {!compleet && <span className="text-xs" style={{ color: ROZE }}>onvolledig</span>}
                    <span className="ml-auto">
                      <Knop variant="wit" klein onClick={() => wijzigKlant(k.id, { routes: k.routes.filter((x) => x.id !== r.id) })}>
                        <Trash2 size={13} />
                      </Knop>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Veld label="Naam route" value={r.naam} onChange={(v) => zetRoute(r.id, { naam: v })} />
                    <Veld label="Factuur-mailadres" value={r.email} onChange={(v) => zetRoute(r.id, { email: v })} />
                    <Veld label="Tenaamstelling" value={r.tenaamstelling} onChange={(v) => zetRoute(r.id, { tenaamstelling: v })} />
                    <Veld label="Btw-nummer" value={r.btw} onChange={(v) => zetRoute(r.id, { btw: v })} />
                    <Veld breed label="Factuuradres" value={r.adres} onChange={(v) => zetRoute(r.id, { adres: v })} />
                    <Veld breed label="Notitie" value={r.notitie} onChange={(v) => zetRoute(r.id, { notitie: v })} />
                  </div>
                </Kaart>
              );
            })}
          </div>
          <div className="mt-3">
            <Knop variant="wit" klein onClick={() => wijzigKlant(k.id, { routes: [...k.routes, LEEG_ROUTE()] })}>
              <span className="flex items-center gap-1"><Plus size={13} /> Route toevoegen</span>
            </Knop>
          </div>
        </div>
      </div>
    );
  };

  // =================== PAND ===================
  const PandScherm = ({ id }) => {
    const p = data.panden.find((x) => x.id === id);
    if (!p) return null;
    const k = klantVan(p), r = routeVan(p);
    const c = controle(p), g = cijfers(p);
    const ok = c.ontbreekt.length === 0;

    const rij = (lijst, veld) => (nieuw) => wijzigPand(p.id, { [veld]: nieuw });
    const voegToe = (veld, item) => wijzigPand(p.id, { [veld]: [...p[veld], item] });
    const wijzigRij = (veld, i, patch) =>
      wijzigPand(p.id, { [veld]: p[veld].map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    const weg = (veld, i) => wijzigPand(p.id, { [veld]: p[veld].filter((_, j) => j !== i) });

    const factuurtekst = [
      r?.tenaamstelling || "[tenaamstelling ontbreekt]",
      r?.adres || "[factuuradres ontbreekt]",
      "Btw: " + (r?.btw || "[btw ontbreekt]"),
      "",
      "Pand: " + p.naam + (p.filiaalnummer ? " · filiaalnummer " + p.filiaalnummer : ""),
      "Grootboek: " + (p.grootboek || "[grootboeknummer ontbreekt]"),
      "Contactpersoon: " + (k?.contactpersoon || "[onbekend]"),
      "",
      p.begrootMandagen + " mandagen à " + eur0(g.tarief) + " = " + eur(g.omzet) + " excl. btw",
      p.hoogwerker ? "Hoogwerkerhuur doorbelast: " + eur(p.doorbelast) : "",
      "Betaaltermijn: " + (k?.betaaltermijn || 60) + " dagen",
      "Verstuur naar: " + (r?.email || "[mailadres ontbreekt]"),
    ].filter(Boolean).join("\n");

    return (
      <div className="space-y-5">
        {/* Signature: de rijden-of-niet strip */}
        <div className="rounded-2xl p-5" style={{ background: ok ? "#EAF7ED" : "#FFF0F7", border: "1px solid " + (ok ? "#BFE5C8" : "#FFD0E5") }}>
          <div className="flex items-start gap-3">
            <Truck size={26} style={{ color: ok ? GROEN : ROZE }} className="shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-lg" style={{ fontFamily: "Fredoka", color: ok ? "#14652A" : "#8C1D4F" }}>
                {ok ? "Compleet — je mag rijden" : "Nog niet compleet"}
              </div>
              {ok ? (
                <p className="text-sm mt-0.5" style={{ color: "#2F6B41" }}>
                  Alles wat je na afloop nodig hebt om te factureren, staat vast.
                </p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {c.ontbreekt.map((x) => (
                    <li key={x.t} className="text-sm flex items-center gap-2" style={{ color: "#8C1D4F" }}>
                      <span className="w-1 h-1 rounded-full" style={{ background: ROZE }} />{x.t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs" style={{ color: "#8A7B98" }}>{c.punten.length - c.ontbreekt.length} van {c.punten.length}</div>
            </div>
          </div>
        </div>

        <Kaart>
          <h3 className="mb-3" style={{ fontFamily: "Fredoka", color: INK }}>Opdracht</h3>
          <div className="grid grid-cols-2 gap-3">
            <Veld label="Pand" value={p.naam} onChange={(v) => wijzigPand(p.id, { naam: v })} />
            <Veld label="Adres pand" value={p.adres} onChange={(v) => wijzigPand(p.id, { adres: v })} />
            <label className="block">
              <span className="block text-xs mb-1" style={{ color: "#6B5B7B" }}>Factuurroute</span>
              <select value={p.routeId} onChange={(e) => wijzigPand(p.id, { routeId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                style={{ borderColor: "#E4DCEA", background: "white", color: INK }}>
                <option value="">— kies een route —</option>
                {k?.routes.map((x) => <option key={x.id} value={x.id}>{x.naam || "naamloos"}</option>)}
              </select>
            </label>
            <Veld label="Filiaalnummer" value={p.filiaalnummer} onChange={(v) => wijzigPand(p.id, { filiaalnummer: v })} />
            <Veld label="Grootboeknummer" value={p.grootboek} onChange={(v) => wijzigPand(p.id, { grootboek: v })} />
            <Veld label="Begrote mandagen" type="number" value={p.begrootMandagen} onChange={(v) => wijzigPand(p.id, { begrootMandagen: v })} />
            <Veld label="Afstand enkele reis (km)" type="number" value={p.afstandEnkel} onChange={(v) => wijzigPand(p.id, { afstandEnkel: v })} />
            <Veld label="Doorbelaste hoogwerkerhuur" type="number" value={p.doorbelast} onChange={(v) => wijzigPand(p.id, { doorbelast: v })} />
          </div>
          <label className="flex items-center gap-2 mt-3 text-sm" style={{ color: INK }}>
            <input type="checkbox" checked={p.hoogwerker} onChange={(e) => wijzigPand(p.id, { hoogwerker: e.target.checked })} />
            Hoogwerker nodig
          </label>
        </Kaart>

        {/* Materieel */}
        <Kaart>
          <div className="flex items-center gap-2 mb-3">
            <Wrench size={16} style={{ color: ROZE }} />
            <h3 style={{ fontFamily: "Fredoka", color: INK }}>Materieel mee</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {["Osmose-unit", "Hogedrukreiniger", "Stoomapparaat", "Telescoopsteel", "Slangen", "Zonnepaneelborstel", "Verlengsnoer", "Waterslang", "Veiligheidsschoenen", "Hoogwerker"].map((t) => {
              const aan = p.materieel.includes(t);
              return (
                <button key={t} onClick={() => wijzigPand(p.id, { materieel: aan ? p.materieel.filter((x) => x !== t) : [...p.materieel, t] })}
                  className="px-3 py-1.5 rounded-full text-xs transition"
                  style={aan ? { background: INK, color: "white" } : { background: "#F5EFF8", color: "#6B5B7B" }}>
                  {t}
                </button>
              );
            })}
          </div>
        </Kaart>

        {/* Uren */}
        <Kaart>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} style={{ color: ROZE }} />
            <h3 style={{ fontFamily: "Fredoka", color: INK }}>Uren</h3>
            <span className="ml-auto text-sm" style={{ color: "#6B5B7B" }}>{g.gewerkteUren} uur · {g.mandagenWerkelijk.toFixed(2)} mandagen</span>
          </div>
          {p.uren.map((u, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
              <input type="date" value={u.datum} onChange={(e) => wijzigRij("uren", i, { datum: e.target.value })}
                className="col-span-3 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
              <input type="number" step="0.5" value={u.uren} placeholder="uren" onChange={(e) => wijzigRij("uren", i, { uren: e.target.value })}
                className="col-span-2 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
              <input value={u.omschrijving} placeholder="werkzaamheden" onChange={(e) => wijzigRij("uren", i, { omschrijving: e.target.value })}
                className="col-span-6 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
              <button onClick={() => weg("uren", i)} className="col-span-1 flex justify-center"><Trash2 size={14} style={{ color: "#B9A9C4" }} /></button>
            </div>
          ))}
          <Knop variant="wit" klein onClick={() => voegToe("uren", { datum: "", uren: "", omschrijving: "" })}>
            <span className="flex items-center gap-1"><Plus size={13} /> Dag toevoegen</span>
          </Knop>
        </Kaart>

        {/* Ritten */}
        <Kaart>
          <div className="flex items-center gap-2 mb-1">
            <Route size={16} style={{ color: ROZE }} />
            <h3 style={{ fontFamily: "Fredoka", color: INK }}>Ritten</h3>
            <span className="ml-auto text-sm" style={{ color: "#6B5B7B" }}>
              {g.kmZakelijk} km zakelijk · {eur(g.reiskosten)} aftrek
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: "#8A7B98" }}>
            De bus staat in privévermogen. Zakelijke kilometers leveren {eur(KM_TARIEF)} per km aftrek op.
            Registreer ook privéritten — die heb je nodig om aan te tonen dat de bus terecht privé staat.
          </p>
          {p.ritten.map((rt, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
              <input type="date" value={rt.datum} onChange={(e) => wijzigRij("ritten", i, { datum: e.target.value })}
                className="col-span-3 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
              <input type="number" value={rt.km} placeholder="km" onChange={(e) => wijzigRij("ritten", i, { km: e.target.value })}
                className="col-span-2 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
              <select value={rt.type} onChange={(e) => wijzigRij("ritten", i, { type: e.target.value })}
                className="col-span-2 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }}>
                <option value="zakelijk">zakelijk</option>
                <option value="prive">privé</option>
              </select>
              <input value={rt.doel} placeholder="van — naar" onChange={(e) => wijzigRij("ritten", i, { doel: e.target.value })}
                className="col-span-4 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
              <button onClick={() => weg("ritten", i)} className="col-span-1 flex justify-center"><Trash2 size={14} style={{ color: "#B9A9C4" }} /></button>
            </div>
          ))}
          <div className="flex gap-2">
            <Knop variant="wit" klein onClick={() => voegToe("ritten", { datum: "", km: "", type: "zakelijk", doel: "" })}>
              <span className="flex items-center gap-1"><Plus size={13} /> Rit toevoegen</span>
            </Knop>
            {num(p.afstandEnkel) > 0 && (
              <Knop variant="geel" klein onClick={() => voegToe("ritten", {
                datum: "", km: num(p.afstandEnkel) * 2, type: "zakelijk",
                doel: data.instellingen.thuisadres.split(",")[0] + " — " + p.naam + " v.v."
              })}>
                Retour {num(p.afstandEnkel) * 2} km invullen
              </Knop>
            )}
          </div>
        </Kaart>

        {/* Verbruik */}
        <Kaart>
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} style={{ color: ROZE }} />
            <h3 style={{ fontFamily: "Fredoka", color: INK }}>Verbruik</h3>
            <span className="ml-auto text-sm" style={{ color: "#6B5B7B" }}>{eur(g.materiaal)}</span>
          </div>
          {p.verbruik.map((v, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
              <input value={v.omschrijving} placeholder="omschrijving" onChange={(e) => wijzigRij("verbruik", i, { omschrijving: e.target.value })}
                className="col-span-6 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
              <input type="number" value={v.aantal} placeholder="aantal" onChange={(e) => wijzigRij("verbruik", i, { aantal: e.target.value })}
                className="col-span-2 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
              <input type="number" step="0.01" value={v.prijs} placeholder="prijs" onChange={(e) => wijzigRij("verbruik", i, { prijs: e.target.value })}
                className="col-span-3 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
              <button onClick={() => weg("verbruik", i)} className="col-span-1 flex justify-center"><Trash2 size={14} style={{ color: "#B9A9C4" }} /></button>
            </div>
          ))}
          <Knop variant="wit" klein onClick={() => voegToe("verbruik", { omschrijving: "", aantal: 1, prijs: "" })}>
            <span className="flex items-center gap-1"><Plus size={13} /> Regel toevoegen</span>
          </Knop>
        </Kaart>

        {/* Nacalculatie */}
        <Kaart>
          <div className="flex items-center gap-2 mb-3">
            <Calculator size={16} style={{ color: ROZE }} />
            <h3 style={{ fontFamily: "Fredoka", color: INK }}>Nacalculatie</h3>
          </div>
          <div className="text-sm">
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #F3EDF7" }}>
              <span style={{ color: "#6B5B7B" }}>Opbrengst · {p.begrootMandagen} mandagen à {eur0(g.tarief)}</span>
              <span style={{ color: INK }}>{eur(g.omzet)}</span>
            </div>
            {[
              ["Reiskosten · " + g.kmZakelijk + " km × " + eur(KM_TARIEF), g.reiskosten],
              ["Verbruik en materiaal", g.materiaal],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #F3EDF7" }}>
                <span style={{ color: "#6B5B7B" }}>{l}</span><span style={{ color: INK }}>− {eur(v)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #E4DCEA" }}>
              <span className="font-medium" style={{ color: INK }}>Marge vóór arbeid</span>
              <span className="font-medium" style={{ color: INK }}>{eur(g.marge)}</span>
            </div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #F3EDF7" }}>
              <span style={{ color: "#6B5B7B" }}>Arbeid Anton · {g.gewerkteUren} uur × {eur(g.uurloon)}</span>
              <span style={{ color: INK }}>− {eur(g.arbeid)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium" style={{ color: INK }}>Resultaat</span>
              <span className="font-medium" style={{ color: g.resultaat >= 0 ? GROEN : ROZE }}>{eur(g.resultaat)}</span>
            </div>
            {num(p.doorbelast) > 0 && (
              <p className="text-xs pt-1" style={{ color: "#8A7B98" }}>
                Hoogwerkerhuur {eur(p.doorbelast)} loopt er buitenom: één op één doorbelast, dus per saldo nul.
              </p>
            )}
          </div>
          <div className="mt-4 p-4 rounded-xl" style={{ background: PAPIER }}>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl" style={{ fontFamily: "Fredoka", color: g.effectief >= g.tarief / 8 ? GROEN : ROZE }}>
                {g.gewerkteUren > 0 ? eur(g.effectief) : "—"}
              </span>
              <span className="text-sm" style={{ color: "#6B5B7B" }}>
                overgehouden per gewerkt uur · begroot {eur(g.tarief / 8)}
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: "#8A7B98" }}>
              {g.gewerkteUren === 0
                ? "Vul uren in om te zien of het tarief klopt."
                : g.afwijking > 0.05
                  ? "Je stond " + g.afwijking.toFixed(2) + " mandag langer op locatie dan begroot. Bij de volgende offerte meenemen."
                  : "Binnen de begroting gebleven. Tarief van " + eur0(g.tarief) + " per mandag houdt stand."}
            </p>
            {g.gewerkteUren > 0 && (
              <p className="text-xs mt-1" style={{ color: "#8A7B98" }}>
                De marge dekt Antons uren {g.dekking.toFixed(1)}×. Onder de 1,0 kost deze klus geld.
              </p>
            )}
            <p className="text-xs mt-2" style={{ color: "#8A7B98" }}>
              Diesel ter info: {Math.round(g.liters)} liter ≈ {eur(g.diesel)} bij {data.instellingen.verbruik} l/100 km.
              Niet aftrekbaar naast het kilometertarief — wel de btw over het zakelijke deel.
            </p>
          </div>
        </Kaart>

        {/* Factuurregels */}
        <Kaart>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} style={{ color: ROZE }} />
            <h3 style={{ fontFamily: "Fredoka", color: INK }}>Factuurregels</h3>
            <span className="ml-auto">
              <Knop variant={gekopieerd === p.id ? "geel" : "roze"} klein onClick={() => kopieer(factuurtekst, p.id)}>
                <span className="flex items-center gap-1">
                  {gekopieerd === p.id ? <Check size={13} /> : <Copy size={13} />}
                  {gekopieerd === p.id ? "Gekopieerd" : "Kopieer"}
                </span>
              </Knop>
            </span>
          </div>
          <pre className="text-xs whitespace-pre-wrap p-4 rounded-xl" style={{ background: PAPIER, color: INK, fontFamily: "ui-monospace, monospace" }}>
            {factuurtekst}
          </pre>
          <p className="text-xs mt-2" style={{ color: "#8A7B98" }}>Overtikken in Jortt. Deze tool factureert niet zelf.</p>
        </Kaart>

        <Knop variant="wit" onClick={() => {
          bewaar({ ...data, panden: data.panden.filter((x) => x.id !== p.id) });
          setScherm({ naam: "overzicht" });
        }}>
          <span className="flex items-center gap-1" style={{ color: "#8A7B98" }}><Trash2 size={13} /> Opdracht verwijderen</span>
        </Knop>
      </div>
    );
  };

  // =================== EXPORT ===================
  const ExportScherm = () => {
    const regels = [["Klant", "Pand", "Datum", "Soort", "Aantal", "Eenheid", "Omschrijving"]];
    data.panden.forEach((p) => {
      const kn = klantVan(p)?.naam || "";
      p.uren.forEach((u) => regels.push([kn, p.naam, u.datum, "uren", u.uren, "uur", u.omschrijving]));
      p.ritten.forEach((r) => regels.push([kn, p.naam, r.datum, r.type === "prive" ? "km privé" : "km zakelijk", r.km, "km", r.doel]));
      p.verbruik.forEach((v) => regels.push([kn, p.naam, "", "verbruik", v.aantal, "stuks", v.omschrijving + " à " + eur(v.prijs)]));
    });
    const csv = regels.map((r) => r.map((c) => '"' + String(c ?? "").replace(/"/g, '""') + '"').join(";")).join("\n");
    const totKm = data.panden.reduce((s, p) => s + cijfers(p).kmZakelijk, 0);
    return (
      <div className="space-y-5">
        <Kaart>
          <h3 className="mb-1" style={{ fontFamily: "Fredoka", color: INK }}>Kilometerstaat</h3>
          <p className="text-sm" style={{ color: "#6B5B7B" }}>
            {totKm} zakelijke kilometers · {eur(totKm * KM_TARIEF)} aftrekbaar over alle opdrachten.
          </p>
        </Kaart>
        <Kaart>
          <div className="flex items-center gap-2 mb-3">
            <h3 style={{ fontFamily: "Fredoka", color: INK }}>Export voor de boekhouder</h3>
            <span className="ml-auto">
              <Knop variant={gekopieerd === "csv" ? "geel" : "roze"} klein onClick={() => kopieer(csv, "csv")}>
                <span className="flex items-center gap-1">
                  {gekopieerd === "csv" ? <Check size={13} /> : <Copy size={13} />}
                  {gekopieerd === "csv" ? "Gekopieerd" : "Kopieer als CSV"}
                </span>
              </Knop>
            </span>
          </div>
          <pre className="text-xs whitespace-pre-wrap p-4 rounded-xl max-h-80 overflow-auto"
            style={{ background: PAPIER, color: INK, fontFamily: "ui-monospace, monospace" }}>{csv}</pre>
          <p className="text-xs mt-2" style={{ color: "#8A7B98" }}>Plakken in Excel, kolommen scheiden op puntkomma.</p>
        </Kaart>
        <Kaart>
          <h3 className="mb-3" style={{ fontFamily: "Fredoka", color: INK }}>Instellingen</h3>
          <div className="grid grid-cols-2 gap-3">
            <Veld breed label="Vertrekadres" value={data.instellingen.thuisadres}
              onChange={(v) => bewaar({ ...data, instellingen: { ...data.instellingen, thuisadres: v } })} />
            <Veld label="Dieselprijs per liter" type="number" value={data.instellingen.dieselprijs}
              onChange={(v) => bewaar({ ...data, instellingen: { ...data.instellingen, dieselprijs: v } })} />
            <Veld label="Verbruik bus (l/100 km)" type="number" value={data.instellingen.verbruik}
              onChange={(v) => bewaar({ ...data, instellingen: { ...data.instellingen, verbruik: v } })} />
            <Veld label="Rekenprijs arbeid per uur" type="number" value={data.instellingen.uurloon ?? 25}
              onChange={(v) => bewaar({ ...data, instellingen: { ...data.instellingen, uurloon: v } })} />
          </div>
        </Kaart>
      </div>
    );
  };

  const titel = scherm.naam === "pand"
    ? data.panden.find((p) => p.id === scherm.id)?.naam || "Opdracht"
    : scherm.naam === "klant" ? data.klanten.find((k) => k.id === scherm.id)?.naam || "Klant"
    : scherm.naam === "export" ? "Export" : "Opdrachten";

  return (
    <div className="min-h-screen p-6" style={{ background: PAPIER, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&family=DM+Sans:wght@400;500&display=swap');`}</style>
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          {scherm.naam !== "overzicht" && (
            <button onClick={() => setScherm({ naam: "overzicht" })}
              className="p-2 rounded-lg" style={{ background: "white", border: "1px solid #EDE6F2" }}>
              <ChevronLeft size={16} style={{ color: INK }} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full inline-block" style={{ background: ROZE }} />
            <span className="text-xl" style={{ fontFamily: "Fredoka", color: INK }}>{titel}</span>
          </div>
          <div className="ml-auto flex gap-2">
            <Knop variant={scherm.naam === "overzicht" ? "geel" : "wit"} klein onClick={() => setScherm({ naam: "overzicht" })}>Opdrachten</Knop>
            <Knop variant={scherm.naam === "export" ? "geel" : "wit"} klein onClick={() => setScherm({ naam: "export" })}>
              <span className="flex items-center gap-1"><Settings size={13} /> Export</span>
            </Knop>
          </div>
        </header>

        {scherm.naam === "overzicht" && <Overzicht />}
        {scherm.naam === "klant" && <KlantScherm id={scherm.id} />}
        {scherm.naam === "pand" && <PandScherm id={scherm.id} />}
        {scherm.naam === "export" && <ExportScherm />}
      </div>
    </div>
  );
}
