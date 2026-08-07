import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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

const VERBRUIK_OPTIES = [
  "Reinigingsmiddel (pH-neutraal)",
  "Reinigingsmiddel (biologisch afbreekbaar)",
  "Impregneermiddel gevel",
  "Anti-graffiti coating",
  "Graffitiverwijderaar",
  "Ontgroeningsmiddel (mos/algen)",
  "Osmosefilter / DI-hars",
  "Microvezeldoeken",
  "Afplaktape / afdekfolie",
  "Wegwerphandschoenen",
  "Afvalzakken",
];

const LEEG_ROUTE = () => ({
  id: crypto.randomUUID(), naam: "", tenaamstelling: "", tav: "", adres: "",
  btw: "", email: "", notitie: ""
});

const LEEG_KLANT = () => ({
  id: crypto.randomUUID(), naam: "", contactpersoon: "", kvk: "",
  dagtarief: 540, uurloon: 25, betaaltermijn: 60, routes: [LEEG_ROUTE()]
});

const LEEG_PAND = (klantId) => ({
  id: crypto.randomUUID(), klantId, routeId: "", naam: "", adres: "",
  filiaalnummer: "", grootboek: "",
  begrootMandagen: 0, begrootEenheid: "dag", voorrijkosten: 0,
  werkelijkeMandagen: 0, werkelijkeEenheid: "dag", afstandEnkel: 0,
  hoogwerker: false, doorbelast: 0, status: "open",
  startdatum: "", reispatroon: "dagelijks",
  soortWerk: "Groot onderhoud", werkzaamheden: "", diensten: [],
  onderhoudsintervalMaanden: 0,
  contactpersoonTerPlaatse: "", telefoonTerPlaatse: "", instructies: "",
  voorOmschrijving: "", voorFotos: [], naFotos: [], afgerondOp: "",
  materieel: [], uren: [], ritten: [], verbruik: [], extraWerkzaamheden: [], geoffreerdeKosten: [],
  // Opleverrapport vergrendelen bevriest het (zie OpleverrapportDocument):
  // snapshot vangt werkzaamheden/extraWerkzaamheden/foto's/afgerondOp op het
  // moment van vergrendelen, zodat latere wijzigingen een al verstuurd
  // rapport niet met terugwerkende kracht veranderen — zelfde reden als de
  // offerte-snapshot (zie DESTINATION-registratietool.md).
  opleverrapportVergrendeld: false, opleverrapportSnapshot: null,
});

const STANDAARD_WERKWIJZE = "Wij reinigen gevels, glas en lichtreclame met osmosetechniek en hoogwaardig "
  + "materiaal. Osmose en zuiver water laten glas en gevel streeploos opdrogen, zonder kalkranden en zonder "
  + "nawerk. Wij werken met de juiste druk en methode per ondergrond, veilig voor gevelbeplating, voegen en "
  + "kozijnen. Als gespecialiseerde partij plannen wij per regio, zodat meerdere panden in een route worden "
  + "meegenomen. U ontvangt voor- en na-fotodocumentatie per pand, vrij te gebruiken voor uw eigen communicatie.";
const STANDAARD_WAT_U_KRIJGT = "Een vast aanspreekpunt voor alle panden\nVoor- en na-fotodocumentatie per pand\n"
  + "Streeploos resultaat door osmosetechniek, zonder nawerk\nPlanning in overleg, afgestemd op uw winkeltijden";
const STANDAARD_VOORWAARDEN = "Deze offerte is geldig tot {geldigDagen} dagen na dagtekening.\n"
  + "Genoemde prijzen zijn exclusief 21% btw" + ".\n"
  + "Hoogwerkerhuur wordt, waar nodig, een op een doorbelast tegen kostprijs.\n"
  + "Facturatie per uitgevoerde beurt, betaaltermijn 60 dagen.\n"
  + "Op al onze werkzaamheden zijn onze algemene voorwaarden van toepassing.";

// Offertenummer is doorlopend per jaar (2026-001, 2026-002...) — hoogste bestaande + 1.
const volgendOffertenummer = (offertes) => {
  const jaar = new Date().getFullYear();
  const nummers = offertes
    .map((o) => /^(\d{4})-(\d{3})$/.exec(o.offertenummer || ""))
    .filter((m) => m && Number(m[1]) === jaar)
    .map((m) => Number(m[2]));
  const volgende = (nummers.length ? Math.max(...nummers) : 0) + 1;
  return jaar + "-" + String(volgende).padStart(3, "0");
};

const LEEG_OFFERTE = (klantId, type = "meerdere-panden") => ({
  id: crypto.randomUUID(), klantId, type,
  offertenummer: "", datum: "", geldigDagen: type === "spoedopdracht" ? 14 : 30,
  titel: "", samenvatting: "", aanhef: "", inleiding: "",
  // Aan wie de offerte gericht is — los van de factuurroute, want dat is vaak
  // een ander adres (bv. hoofdkantoor of specifiek filiaal bij een spoedklus).
  voorNaam: "", voorTav: "", voorAdres: "",
  status: "concept",
  // Gezet zodra "Zet om naar opdracht" is gebruikt — voorkomt dat nogmaals
  // klikken een dubbel pand aanmaakt (spoedopdracht) of nogmaals dezelfde
  // panden overschrijft (meerdere-panden, onschadelijk maar overbodig).
  omgezetNaarPandId: null,
  // Meerdere panden: regels is een momentopname (naam/mandagen/hoogwerker/prijs)
  // van de geselecteerde panden op het moment van overnemen — geen live
  // koppeling, want een later gewijzigd pand mag een verstuurde offerte niet
  // met terugwerkende kracht veranderen.
  pandIds: [], regels: [],
  werkwijze: STANDAARD_WERKWIJZE, watUKrijgt: STANDAARD_WAT_U_KRIJGT,
  onderhoudContract: false,
  // Losse, vrij te definiëren keuze-opties (bv. lichtreclame reinigen, extra
  // glazenwas) — de klant kan ze los aan- of afvinken in het akkoordblok.
  // Voor beide offertetypes bruikbaar, niet alleen "meerdere panden".
  opties: [],
  // Spoedopdracht: grotendeels vrije tekst, want elke situatie is anders.
  situatie: "", aanpak: "", risicos: "", praktisch: "",
  prijsregels: [], voorrijkosten: 0,
  // Toelichting bij de voorrijkosten, bv. "Hoofddorp – Geldrop v.v., ca. 240 km".
  voorrijkostenOmschrijving: "",
  voorwaarden: STANDAARD_VOORWAARDEN,
});

const START = () => {
  const action = { ...LEEG_KLANT(), naam: "Action Nederland B.V.", contactpersoon: "Udo Blauw", kvk: "", dagtarief: 540, uurloon: 25, betaaltermijn: 60 };
  const rA = { ...LEEG_ROUTE(), naam: "Eigen vastgoed (OG-winkels)", email: "APinvoiceVGWI@action.eu",
    tenaamstelling: "Action OG Winkels BV", tav: "Financiële administratie", adres: "Perenmarkt 15, 1681 PG Zwaagdijk",
    notitie: "Btw-nummer nog opvragen bij Udo" };
  const rB = { ...LEEG_ROUTE(), naam: "Huurpanden (Store Facility)", email: "InvoiceNL@action.nl",
    tenaamstelling: "Action Nederland BV", adres: "Perenmarkt 15, 1681 PG Zwaagdijk-Oost", btw: "NL813233409B01",
    notitie: "Pdf 300 dpi, kostenplaats en contactpersoon verplicht" };
  action.routes = [rA, rB];

  const p = (naam, md, km, hw, routeId = "", extra = {}) => ({
    ...LEEG_PAND(action.id), naam, begrootMandagen: md, afstandEnkel: km, hoogwerker: hw, routeId,
    grootboek: "Omzet Gevelreiniging", ...extra
  });

  const panden = [
    p("Spakenburg (UT)", 3, 55, false),
    p("Zwaagdijk (NH)", 6, 50, true),
    p("Wolvega (FR)", 6, 135, true),
    p("Drachten (FR)", 6, 165, true, rA.id, {
      filiaalnummer: "1021", adres: "Moleneind ZZ 63, 9203 ZW Drachten",
      werkzaamheden: "Reinigen gevel, en graffiti op gebouw", diensten: ["Gevelreiniging", "Graffitiverwijdering"],
    }),
    p("Surhuisterveen (FR)", 6, 175, true),
    p("Dokkum (FR)", 8, 175, true),
    p("Uithuizen (GR)", 3, 215, false),
    p("Leek (GR)", 4, 170, false, rA.id, {
      filiaalnummer: "1048", adres: "Synagogeplein 34, 9351 AW Leek",
      werkzaamheden: "Reinigen gevel, en graffiti op gebouw", diensten: ["Gevelreiniging", "Graffitiverwijdering"],
    }),
    p("Assen (DR)", 4, 180, true),
    p("Geldrop (NB)", 6, 135, false, rB.id, { filiaalnummer: "1441", begrootEenheid: "uur", voorrijkosten: 195 }),
  ];
  return {
    klanten: [action],
    panden,
    offertes: [],
    instellingen: {
      thuisadres: "Manenburgdreef 93, 2135 GV Hoofddorp", dieselprijs: 1.95, verbruik: 8.5,
      btwPercentage: 21, reserveringAov: 0, reserveringPensioen: 0, reserveringWeer: 0, reserveringInvestering: 0,
      reserveringBelasting: 0, reissnelheid: 80, werkurenPerDag: 8, onderhoudsPercentage: 60
    }
  };
};

const STORAGE_KEY = "gumclean:registratie:v1";
const eur = (n) => "€ " + (n || 0).toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const eur0 = (n) => "€ " + Math.round(n || 0).toLocaleString("nl-NL");
const num = (v) => (v === "" || v === null || v === undefined ? 0 : Number(v) || 0);
const datumNL = (d) => d ? d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "";
// Datum + tijd, voor de vergrendel-tijdstempel op het opleverrapport (ISO-string in, nette tekst uit).
const datumTijdNL = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return datumNL(d) + " om " + d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
};

// Telt aantal werkdagen (ma–vr) op bij een startdatum, en rolt een startdatum die
// zelf in het weekend valt eerst door naar de eerstvolgende maandag.
const berekenEinddatum = (startdatum, werkdagenNodig) => {
  if (!startdatum || !isFinite(werkdagenNodig) || werkdagenNodig <= 0) return null;
  const d = new Date(startdatum + "T00:00:00");
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  let geteld = 1;
  while (geteld < werkdagenNodig) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) geteld++;
  }
  return d;
};

// Verkleint en comprimeert een foto in de browser vóór upload — telefoonfoto's
// zijn al snel 5-10 MB, en die hoeft niemand ongewijzigd in Blob-opslag te zetten.
async function comprimeerAfbeelding(file, maxAfmeting = 1600, kwaliteit = 0.8) {
  const bitmap = await createImageBitmap(file);
  const schaal = Math.min(1, maxAfmeting / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * schaal);
  canvas.height = Math.round(bitmap.height * schaal);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", kwaliteit));
}

// ---- data helpers: puur, nemen `data` expliciet mee i.p.v. closure ----
const klantVan = (data, p) => data.klanten.find((k) => k.id === p.klantId);
const routeVan = (data, p) => klantVan(data, p)?.routes.find((r) => r.id === p.routeId);

// ---- de kern: wat ontbreekt er nog ----
const controle = (data, p) => {
  const k = klantVan(data, p), r = routeVan(data, p);
  const punten = [
    { v: !!k?.naam, t: "Klantnaam" },
    { v: !!p.naam, t: "Pandnaam" },
    { v: !!p.adres, t: "Pandadres" },
    { v: !!p.routeId, t: "Factuurroute gekozen" },
    { v: !!r?.tenaamstelling, t: "Tenaamstelling factuurroute" },
    { v: !!r?.adres, t: "Factuuradres" },
    { v: !!r?.btw, t: "Btw-nummer factuurroute" },
    { v: !!r?.email, t: "Factuur-mailadres" },
    { v: !!p.grootboek, t: "Grootboeknummer" },
    { v: !!p.filiaalnummer, t: "Filiaalnummer" },
    { v: !!k?.contactpersoon, t: "Contactpersoon bij klant" },
    { v: num(p.begrootMandagen) > 0, t: "Afgesproken offerte (mandagen/uren)" },
    { v: num(p.afstandEnkel) > 0, t: "Afstand enkele reis" },
    { v: p.materieel.length > 0, t: "Materieellijst" },
    { v: !!p.werkzaamheden, t: "Uitgevoerde werkzaamheden" },
  ];
  return { punten, ontbreekt: punten.filter((x) => !x.v) };
};

const cijfers = (data, p) => {
  const k = klantVan(data, p);
  const tarief = num(k?.dagtarief) || 540;
  const uurloon = num(k?.uurloon) || 25; // kostprijs Anton (inkoop) — niet het verkooptarief
  const gewerkteUren = p.uren.reduce((s, u) => s + num(u.uren), 0);
  // Of losse uren invullen, of in één keer werkelijke mandagen/uren — niet allebei tegelijk.
  const werkelijkeUren = num(p.werkelijkeMandagen) * (p.werkelijkeEenheid === "uur" ? 1 : 8);
  const effectieveUren = gewerkteUren > 0 ? gewerkteUren : werkelijkeUren;
  const kmZakelijk = p.ritten.filter((r) => r.type !== "prive").reduce((s, r) => s + num(r.km), 0);
  const kmPrive = p.ritten.filter((r) => r.type === "prive").reduce((s, r) => s + num(r.km), 0);
  const materiaal = p.verbruik.reduce((s, v) => s + num(v.aantal) * num(v.prijs), 0);

  // Offerte is óf in mandagen à dagtarief, óf in uren à dagtarief/8 (prorata) — plus evt. voorrijkosten.
  const begroteEenheidUur = p.begrootEenheid === "uur";
  const begroteMandagen = begroteEenheidUur ? num(p.begrootMandagen) / 8 : num(p.begrootMandagen);
  const omzetBasis = begroteEenheidUur ? num(p.begrootMandagen) * (tarief / 8) : num(p.begrootMandagen) * tarief;
  const voorrijkosten = num(p.voorrijkosten);
  // Twee soorten doorbelaste kosten, allebei omschrijving+bedrag maar met een
  // ander verhaal: geoffreerdeKosten zat al in de offerte (bv. materiaal en
  // verbruik, osmosewater — een vooraf bekende kostenpost, geen verrassing),
  // extraWerkzaamheden is wat Anton er onderweg bij heeft gedaan en dus niet
  // in de offerte stond (graffiti, grofvuil, extra vieze stoep). Beide tellen
  // mee in de omzet, anders oogt de nacalculatie te negatief bij een klus met
  // extra's die wél gefactureerd worden. (|| []) omdat oudere panden deze
  // velden nog niet hebben.
  const geoffreerdeKostenOmzet = (p.geoffreerdeKosten || []).reduce((s, x) => s + num(x.bedrag), 0);
  const extraWerkzaamhedenOmzet = (p.extraWerkzaamheden || []).reduce((s, x) => s + num(x.bedrag), 0);
  const extraOmzet = geoffreerdeKostenOmzet + extraWerkzaamhedenOmzet;
  const omzet = omzetBasis + voorrijkosten + extraOmzet;

  const reiskosten = kmZakelijk * KM_TARIEF;
  const arbeid = effectieveUren * uurloon;
  const kosten = reiskosten + materiaal;
  const marge = omzet - kosten;
  const resultaat = marge - arbeid;
  const liters = kmZakelijk * (num(data.instellingen.verbruik) / 100);

  // Reserveringen: interne buffers, geen kostenpost — komen bovenop het resultaat af.
  // Aov/pensioen/weer/investering als % van omzet, belasting als % van winst (resultaat), btw als % van omzet.
  const pctAov = num(data.instellingen.reserveringAov);
  const pctPensioen = num(data.instellingen.reserveringPensioen);
  const pctWeer = num(data.instellingen.reserveringWeer);
  const pctInvestering = num(data.instellingen.reserveringInvestering);
  const pctBelasting = num(data.instellingen.reserveringBelasting);
  const btwPercentage = num(data.instellingen.btwPercentage) || 21;

  const reserveringAov = omzet * (pctAov / 100);
  const reserveringPensioen = omzet * (pctPensioen / 100);
  const reserveringWeer = omzet * (pctWeer / 100);
  const reserveringInvestering = omzet * (pctInvestering / 100);
  const reserveringBelasting = Math.max(0, resultaat) * (pctBelasting / 100);
  // Btw komt bovenop de (ex-btw) omzet binnen en gaat er ook weer af — resultaat is al
  // op ex-btw omzet gebaseerd, dus btw telt niet mee in wat je van je resultaat afhaalt.
  // Anders reserveer je 'm dubbel: één keer omdat resultaat 'm nooit meerekende, en nog
  // eens hier. Alleen ter info tonen hoeveel van het incl-btw bedrag niet van jou is.
  const reserveringBtw = omzet * (btwPercentage / 100);
  const omzetInclBtw = omzet + reserveringBtw;
  const reservering = reserveringAov + reserveringPensioen + reserveringWeer + reserveringInvestering;
  const reserveringTotaal = reservering + reserveringBelasting;
  const nettoBeschikbaar = resultaat - reserveringTotaal;

  // Planning: hoeveel werkdagen heeft Anton nodig, rekening houdend met reistijd?
  // Werkdag = 8 uur werk (los van de 08:30-starttijd en pauze, die veranderen de
  // beschikbare 8 uur niet). Bij "dagelijks" gaat de heen-en-terugreis er iedere
  // dag vanaf; bij "overnachten" (blijft in de buurt) telt de reis maar één keer
  // mee voor de hele klus, verdeeld over de benodigde dagcapaciteit.
  const werkurenPerDag = num(data.instellingen.werkurenPerDag) || 8;
  const reissnelheid = num(data.instellingen.reissnelheid) || 80;
  const reistijdEnkeleReis = num(p.afstandEnkel) / reissnelheid;
  const totaleWerkurenNodig = begroteMandagen * 8;
  let werkdagenNodig = 0;
  if (totaleWerkurenNodig > 0) {
    if (p.reispatroon === "overnachten") {
      werkdagenNodig = Math.ceil((totaleWerkurenNodig + 2 * reistijdEnkeleReis) / werkurenPerDag);
    } else {
      const effectieveUrenPerDag = Math.max(0, werkurenPerDag - 2 * reistijdEnkeleReis);
      werkdagenNodig = effectieveUrenPerDag > 0 ? Math.ceil(totaleWerkurenNodig / effectieveUrenPerDag) : Infinity;
    }
  }
  const verwachteEinddatum = berekenEinddatum(p.startdatum, werkdagenNodig);
  // "Loopt achter": er is een verwachte einddatum (dus een bekende startdatum), de
  // klus is niet handmatig afgerond (`afgerondOp`), en vandaag ligt al voorbij die
  // verwachte einddatum. Een afgerond pand loopt nooit achter, ongeacht de datum.
  const loopAchter = !!verwachteEinddatum && !p.afgerondOp && new Date() > verwachteEinddatum;

  // Onderhoudsbeurt: een vervolgbezoek na de 0-beurt kost minder werk (minder
  // vervuiling om weg te halen) maar evenveel reistijd — dus alleen het
  // werk-aandeel van de omzet schaalt mee met het percentage, reiskosten en
  // voorrijkosten blijven vol staan (nieuwe rit, nieuwe afspraak).
  const onderhoudsPercentage = num(data.instellingen.onderhoudsPercentage) || 60;
  const onderhoudMandagen = begroteMandagen * (onderhoudsPercentage / 100);
  const onderhoudOmzet = omzetBasis * (onderhoudsPercentage / 100) + voorrijkosten;
  const onderhoudBeurtenPerJaar = num(p.onderhoudsintervalMaanden) > 0 ? 12 / num(p.onderhoudsintervalMaanden) : 0;
  const onderhoudOmzetPerJaar = onderhoudOmzet * onderhoudBeurtenPerJaar;

  return {
    tarief, uurloon, gewerkteUren, effectieveUren, mandagenWerkelijk: effectieveUren / 8, kmZakelijk, kmPrive,
    materiaal, omzetBasis, voorrijkosten, geoffreerdeKostenOmzet, extraWerkzaamhedenOmzet, extraOmzet, omzet,
    reiskosten, arbeid, kosten, marge, resultaat, liters,
    diesel: liters * num(data.instellingen.dieselprijs),
    effectief: effectieveUren > 0 ? marge / effectieveUren : 0,
    dekking: arbeid > 0 ? marge / arbeid : 0,
    afwijking: effectieveUren / 8 - begroteMandagen,
    pctAov, pctPensioen, pctWeer, pctInvestering, pctBelasting, btwPercentage, omzetInclBtw,
    reserveringAov, reserveringPensioen, reserveringWeer, reserveringInvestering, reserveringBelasting,
    reservering, reserveringBtw, reserveringTotaal, nettoBeschikbaar,
    reistijdEnkeleReis, werkdagenNodig, verwachteEinddatum, loopAchter,
    onderhoudsPercentage, onderhoudMandagen, onderhoudOmzet, onderhoudBeurtenPerJaar, onderhoudOmzetPerJaar,
  };
};

function Veld({ label, value, onChange, type = "text", placeholder, breed }) {
  return (
    <label className={"block " + (breed ? "col-span-2" : "")}>
      <span className="block text-xs mb-1" style={{ color: "#6B5B7B" }}>{label}</span>
      <input
        type={type} value={value ?? ""} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
        style={{ borderColor: "#E4DCEA", background: "white", color: INK }}
      />
    </label>
  );
}

function TekstVeld({ label, value, onChange, placeholder, rijen = 3, breed }) {
  return (
    <label className={"block " + (breed ? "col-span-2" : "")}>
      <span className="block text-xs mb-1" style={{ color: "#6B5B7B" }}>{label}</span>
      <textarea
        value={value ?? ""} placeholder={placeholder} rows={rijen}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
        style={{ borderColor: "#E4DCEA", background: "white", color: INK, fontFamily: "inherit" }}
      />
    </label>
  );
}

// Getal + dagen/uren-toggle, voor zowel de afgesproken offerte als de werkelijk gewerkte tijd.
function MandagenOfUrenVeld({ label, waarde, eenheid, onWaarde, onEenheid, breed }) {
  return (
    <div className={breed ? "col-span-2" : ""}>
      <span className="block text-xs mb-1" style={{ color: "#6B5B7B" }}>{label}</span>
      <div className="flex gap-2">
        <input type="number" step="0.5" value={waarde ?? ""} onChange={(e) => onWaarde(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none border"
          style={{ borderColor: "#E4DCEA", background: "white", color: INK }} />
        <div className="flex rounded-lg overflow-hidden border shrink-0" style={{ borderColor: "#E4DCEA" }}>
          {[["dag", "dagen"], ["uur", "uren"]].map(([val, lab]) => (
            <button key={val} onClick={() => onEenheid(val)}
              className="px-3 py-2 text-sm transition"
              style={(eenheid ?? "dag") === val ? { background: INK, color: "white" } : { background: "white", color: INK }}>
              {lab}
            </button>
          ))}
        </div>
      </div>
    </div>
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

// Grid met geüploade foto's (voor of na), elk met een eigen omschrijving.
// Beeld komt uit de privé Blob-opslag via /api/fotos — de browser stuurt de
// Basic Auth die al voor de pagina zelf is ingevoerd automatisch mee bij het
// laden van <img>. Zonder onVerwijder/onOmschrijving is de grid read-only
// (voor in de werkbeschrijving-preview); de omschrijving staat er dan als
// platte tekst i.p.v. een invoerveld.
// dienstOpties/onDienst laat elke foto taggen met welke dienst (uit
// p.diensten) 'm documenteert, default "" (algemeen/ongetagd) — het
// opleverrapport groepeert de voor/na-sectie hierop. Voor/na-koppeling zelf
// gebeurt niet hier maar in FotoKoppelen (klikken/slepen) — een dropdown met
// tekstlabels bleek onhandig: je moet steeds omhoog scrollen om te zien welke
// foto erbij hoort.
function FotoGrid({ fotos, onVerwijder, onOmschrijving, dienstOpties, onDienst }) {
  if (!fotos.length) return null;
  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {fotos.map((f) => (
        <div key={f.id} className="relative print-avoid-break">
          <img src={"/api/fotos?pad=" + encodeURIComponent(f.pathname)} alt=""
            className="w-full aspect-square object-cover rounded-lg" style={{ border: "1px solid #E4DCEA" }} />
          {onVerwijder && (
            <button onClick={() => onVerwijder(f)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(26,10,46,.7)" }}>
              <Trash2 size={12} color="white" />
            </button>
          )}
          {onOmschrijving ? (
            <input value={f.omschrijving ?? ""} placeholder="omschrijving bij deze foto"
              onChange={(e) => onOmschrijving(f, e.target.value)}
              className="w-full mt-1 px-2 py-1 rounded text-xs outline-none border"
              style={{ borderColor: "#E4DCEA", background: "white", color: INK }} />
          ) : f.omschrijving ? (
            <p className="text-xs mt-1" style={{ color: "#6B5B7B" }}>{f.omschrijving}</p>
          ) : null}
          {dienstOpties && (
            <select value={f.dienst ?? ""} onChange={(e) => onDienst(f, e.target.value)}
              className="w-full mt-1 px-1 py-1 rounded text-xs outline-none border"
              style={{ borderColor: "#E4DCEA", background: "white", color: INK }}>
              <option value="">Algemeen (niet aan een dienst gekoppeld)</option>
              {dienstOpties.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          )}
        </div>
      ))}
    </div>
  );
}

function FotoUpload({ label, bezig, onFiles }) {
  return (
    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs cursor-pointer"
      style={{ background: "#F5EFF8", color: INK }}>
      <Package size={13} />
      {bezig ? "Uploaden…" : label}
      {/* Geen capture-attribuut: dat dwingt op mobiel vaak de camera af en
          blokkeert dan juist het in één keer selecteren van meerdere foto's
          uit de galerij/bestanden — met multiple alleen kan allebei. */}
      <input type="file" accept="image/*" multiple className="hidden" disabled={bezig}
        onChange={(e) => { if (e.target.files.length) onFiles(e.target.files); e.target.value = ""; }} />
    </label>
  );
}

// Voor/na-foto's koppelen door te klikken (of te slepen): eerst een losse
// foto aanklikken (krijgt een roze rand), dan de bijpassende foto uit de
// andere kolom aanklikken om ze te koppelen. Sleep kan ook, als bonus op
// desktop — maar klikken werkt overal, ook op de telefoon, waar slepen
// tussen twee scrollende grids sowieso niet prettig werkt. Vervangt een
// eerdere dropdown-met-tekstlabel: die dwong steeds omhoog scrollen om te
// zien welke foto bij welke hoort.
function FotoKoppelen({ voorFotos, naFotos, selectie, onSelecteer, onKoppel, onOntkoppel }) {
  const gekoppeldeVoorIds = new Set(naFotos.filter((n) => n.voorFotoId).map((n) => n.voorFotoId));
  const losseVoor = voorFotos.filter((v) => !gekoppeldeVoorIds.has(v.id));
  const losseNa = naFotos.filter((n) => !n.voorFotoId);
  const paren = naFotos
    .filter((n) => n.voorFotoId && voorFotos.some((v) => v.id === n.voorFotoId))
    .map((n) => ({ na: n, voor: voorFotos.find((v) => v.id === n.voorFotoId) }));

  const klik = (type, id) => {
    if (!selectie) return onSelecteer({ type, id });
    if (selectie.type === type) return onSelecteer(selectie.id === id ? null : { type, id });
    onKoppel(type === "voor" ? id : selectie.id, type === "na" ? id : selectie.id);
    onSelecteer(null);
  };
  const sleepStart = (e, type, id) => e.dataTransfer.setData("text/plain", JSON.stringify({ type, id }));
  const drop = (e, type, id) => {
    e.preventDefault();
    let bron;
    try { bron = JSON.parse(e.dataTransfer.getData("text/plain")); } catch { return; }
    if (!bron || bron.type === type) return;
    onKoppel(type === "voor" ? id : bron.id, type === "na" ? id : bron.id);
  };

  const Thumb = ({ foto, type }) => {
    const aan = selectie?.type === type && selectie.id === foto.id;
    return (
      <img src={"/api/fotos?pad=" + encodeURIComponent(foto.pathname)} alt=""
        draggable onDragStart={(e) => sleepStart(e, type, foto.id)}
        onDragOver={(e) => e.preventDefault()} onDrop={(e) => drop(e, type, foto.id)}
        onClick={() => klik(type, foto.id)}
        className="w-full aspect-square object-cover rounded-lg cursor-pointer transition"
        style={{ outline: aan ? "3px solid " + ROZE : "1px solid #E4DCEA", outlineOffset: aan ? "-1px" : 0 }} />
    );
  };

  if (!voorFotos.length && !naFotos.length) return null;
  return (
    <div className="mt-4">
      <span className="text-sm font-medium" style={{ color: INK }}>Voor/na koppelen</span>
      <p className="text-xs mt-1 mb-2" style={{ color: "#8A7B98" }}>
        Tik een losse voor-foto en dan de bijpassende na-foto (of andersom) om ze te koppelen — op desktop kan ook
        slepen. Anton maakt soms zelf ook een extra voor/na-setje van iets dat hij tegenkomt; die koppel je hier net zo.
      </p>
      {paren.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {paren.map(({ voor, na }) => (
            <div key={na.id} className="flex items-center gap-2 p-1.5 rounded-lg" style={{ background: PAPIER }}>
              <img src={"/api/fotos?pad=" + encodeURIComponent(voor.pathname)} alt="" className="w-12 h-12 object-cover rounded-lg shrink-0" />
              <span style={{ color: "#B9A9C4" }}>↔</span>
              <img src={"/api/fotos?pad=" + encodeURIComponent(na.pathname)} alt="" className="w-12 h-12 object-cover rounded-lg shrink-0" />
              <span className="text-xs flex-1 truncate" style={{ color: "#6B5B7B" }}>
                {voor.omschrijving || na.omschrijving || "gekoppeld"}
              </span>
              <button onClick={() => onOntkoppel(na)} className="shrink-0"><Trash2 size={14} style={{ color: "#B9A9C4" }} /></button>
            </div>
          ))}
        </div>
      )}
      {(losseVoor.length > 0 || losseNa.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-xs" style={{ color: "#8A7B98" }}>Losse voor-foto's</span>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {losseVoor.map((v) => <Thumb key={v.id} foto={v} type="voor" />)}
            </div>
          </div>
          <div>
            <span className="text-xs" style={{ color: "#8A7B98" }}>Losse na-foto's</span>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {losseNa.map((n) => <Thumb key={n.id} foto={n} type="na" />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Rendert children in een portal direct onder <body>, buiten #root — zie de
// toelichting in index.css bij #print-portal. Zonder dit blijft geprinte
// content de layout-hoogte van de rest van de (verborgen) app meeslepen,
// wat als een stapel lege pagina's op papier komt.
function PrintPortaal({ actief, children }) {
  if (!actief || typeof document === "undefined") return null;
  return createPortal(<div id="print-portal">{children}</div>, document.body);
}

// =================== OVERZICHT ===================
function Overzicht({ data, setScherm, bewaar }) {
  const totaal = data.panden.reduce((s, p) => s + cijfers(data, p).omzet, 0);
  const klaar = data.panden.filter((p) => controle(data, p).ontbreekt.length === 0).length;
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
          const c = cijfers(data, p);
          return { omzet: a.omzet + c.omzet, marge: a.marge + c.marge, resultaat: a.resultaat + c.resultaat,
            kosten: a.kosten + c.kosten + c.arbeid, km: a.km + c.kmZakelijk, uren: a.uren + c.effectieveUren,
            reserveringTotaal: a.reserveringTotaal + c.reserveringTotaal, nettoBeschikbaar: a.nettoBeschikbaar + c.nettoBeschikbaar,
            loopAchter: a.loopAchter + (c.loopAchter ? 1 : 0) };
        }, { omzet: 0, marge: 0, resultaat: 0, kosten: 0, km: 0, uren: 0, reserveringTotaal: 0, nettoBeschikbaar: 0, loopAchter: 0 });
        return (
          <div key={k.id}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <Building2 size={18} style={{ color: ROZE }} className="shrink-0" />
                <h2 className="text-lg truncate" style={{ fontFamily: "Fredoka", color: INK }}>{k.naam || "Naamloze klant"}</h2>
              </div>
              <Knop variant="wit" klein onClick={() => setScherm({ naam: "klant", id: k.id })}>Klantgegevens</Knop>
            </div>
            <span className="inline-block text-xs px-2 py-0.5 rounded-full mb-2" style={{ background: "#F3ECF7", color: "#6B5B7B" }}>
              {eur0(k.dagtarief)} verkoop/mandag · {eur(k.uurloon ?? 25)} kostprijs Anton/uur
            </span>

            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EDE6F2", background: "white" }}>
              {panden.map((p, i) => {
                const c = controle(data, p), g = cijfers(data, p);
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
                      {p.startdatum && (
                        <span className="block text-xs truncate" style={{ color: "#8A7B98" }}>
                          Start {datumNL(new Date(p.startdatum + "T00:00:00"))}
                          {g.verwachteEinddatum && " · verwacht klaar " + datumNL(g.verwachteEinddatum)}
                        </span>
                      )}
                      {g.loopAchter && (
                        <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-1"
                          style={{ background: GEEL, color: INK }}>
                          Loopt achter
                        </span>
                      )}
                    </span>
                    <span className="text-right shrink-0">
                      <span className="block text-sm" style={{ color: INK }}>{eur0(g.omzet)}</span>
                      <span className="block text-xs" style={{ color: g.effectieveUren > 0 ? (g.resultaat >= 0 ? GROEN : ROZE) : "#8A7B98" }}>
                        {g.effectieveUren > 0
                          ? eur0(g.resultaat) + " resultaat"
                          : p.begrootMandagen + (p.begrootEenheid === "uur" ? " uur" : " mandagen") + " · " + p.afstandEnkel + " km"}
                      </span>
                    </span>
                  </button>
                );
              })}
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: "1px solid #EDE6F2", background: "#FBF7FD" }}>
                <span className="text-xs" style={{ color: "#6B5B7B" }}>
                  Totaal {panden.length} panden · {Math.round(som.km)} km zakelijk · {som.uren} uur geregistreerd
                  {som.loopAchter > 0 && <span style={{ color: INK }}> · {som.loopAchter} loopt achter</span>}
                </span>
                <span className="text-sm" style={{ fontFamily: "Fredoka", color: INK }}>
                  {eur0(som.omzet)} opbrengst · {eur0(som.kosten)} kosten ·{" "}
                  <span style={{ color: som.resultaat >= 0 ? GROEN : ROZE }}>{eur0(som.resultaat)} resultaat</span>
                  {som.reserveringTotaal > 0 && (
                    <>
                      {" · "}{eur0(som.reserveringTotaal)} reservering ·{" "}
                      <span style={{ color: som.nettoBeschikbaar >= 0 ? GROEN : ROZE }}>{eur0(som.nettoBeschikbaar)} netto</span>
                    </>
                  )}
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
}

// =================== KLANT ===================
function KlantScherm({ id, data, wijzigKlant }) {
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
          <Veld label="Dagtarief verkoop (excl. btw)" type="number" value={k.dagtarief} onChange={(v) => wijzigKlant(k.id, { dagtarief: v })} />
          <Veld label="Kostprijs Anton per uur (inkoop, rekenprijs)" type="number" value={k.uurloon ?? 25} onChange={(v) => wijzigKlant(k.id, { uurloon: v })} />
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
                  <Veld label="T.a.v." value={r.tav} onChange={(v) => zetRoute(r.id, { tav: v })} />
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
}

function WerkbeschrijvingDocument({ p }) {
  return (
    <div className="text-sm space-y-3" style={{ color: INK }}>
      <div>
        <div className="font-medium" style={{ fontFamily: "Fredoka" }}>{p.naam || "Naamloos pand"}</div>
        <div style={{ color: "#6B5B7B" }}>{p.adres || "[pandadres ontbreekt]"}</div>
      </div>
      <div>
        <span style={{ color: "#6B5B7B" }}>Melden bij: </span>
        {p.contactpersoonTerPlaatse || "[nog niet ingevuld]"}
        {p.telefoonTerPlaatse ? " · " + p.telefoonTerPlaatse : ""}
      </div>
      {p.startdatum && (
        <div><span style={{ color: "#6B5B7B" }}>Startdatum: </span>{datumNL(new Date(p.startdatum + "T00:00:00"))}</div>
      )}
      <div>
        <span style={{ color: "#6B5B7B" }}>Materieel mee: </span>
        {p.materieel.length ? p.materieel.join(", ") : "[nog niets aangevinkt]"}
      </div>
      {p.voorOmschrijving && (
        <div>
          <div style={{ color: "#6B5B7B" }}>Algemene omschrijving:</div>
          <div>{p.voorOmschrijving}</div>
        </div>
      )}
      {p.voorFotos.length > 0 && (
        <div>
          <div style={{ color: "#6B5B7B" }} className="mb-1">Foto's van Udo, met omschrijving per foto:</div>
          <FotoGrid fotos={p.voorFotos} />
        </div>
      )}
      {p.instructies && (
        <div>
          <div style={{ color: "#6B5B7B" }}>Overige instructies:</div>
          <div>{p.instructies}</div>
        </div>
      )}
    </div>
  );
}

function FotoCel({ foto, label }) {
  return (
    <div className="print-avoid-break">
      <img src={"/api/fotos?pad=" + encodeURIComponent(foto.pathname)} alt={label}
        className="w-full aspect-square object-cover" style={{ borderRadius: 20, boxShadow: "0 1px 2px rgba(26,10,46,.06)" }} />
      <p className="text-xs mt-1 text-center" style={{ color: "#6B6076" }}>
        {label}{foto.omschrijving ? " — " + foto.omschrijving : ""}
      </p>
    </div>
  );
}

function OpleverrapportDocument({ p, k }) {
  // Vergrendeld (zie 'Rapport vergrendelen' in PandScherm): render vanaf de
  // bevroren snapshot, niet vanaf de live p-velden — zelfde reden als
  // offerte.regels (zie DESTINATION-registratietool.md): een al verstuurd
  // rapport mag niet stilletjes veranderen als Bas daarna werkzaamheden of
  // foto's aanpast. Nog niet vergrendeld: gewoon live uit p, zoals voorheen.
  // p.diensten (de indeling zelf, niet de foto-inhoud) blijft altijd live —
  // zit bewust niet in de snapshot, zie de toelichting bij de groepering.
  const r = p.opleverrapportVergrendeld && p.opleverrapportSnapshot
    ? p.opleverrapportSnapshot
    : {
        werkzaamheden: p.werkzaamheden, extraWerkzaamheden: p.extraWerkzaamheden, geoffreerdeKosten: p.geoffreerdeKosten,
        voorFotos: p.voorFotos, naFotos: p.naFotos, afgerondOp: p.afgerondOp, gegenereerdOp: null,
      };

  return (
    <div className="rounded-xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E4DEE9", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <img src="/logo.png" alt="GumClean" style={{ height: 32 }} />
        <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#FFE8F3", color: "#CC317B" }}>
          Opleverrapport
        </span>
      </div>
      <h1 style={{ fontFamily: "Fredoka", fontWeight: 600, fontSize: "1.5rem", color: "#1A0A2E" }}>{p.naam || "Naamloos pand"}</h1>
      <p style={{ color: "#6B6076" }}>{p.adres}{p.filiaalnummer ? " · filiaalnummer " + p.filiaalnummer : ""}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm" style={{ color: "#6B6076" }}>
        <span>Opdrachtgever: {k?.contactpersoon || "—"}</span>
        {r.afgerondOp && <span style={{ color: "#1E8E5A" }}>Afgerond op {datumNL(new Date(r.afgerondOp + "T00:00:00"))}</span>}
      </div>

      {r.werkzaamheden && (
        <div className="mt-5">
          <h2 style={{ fontFamily: "Fredoka", fontSize: "1.125rem", color: "#1A0A2E" }}>Uitgevoerde werkzaamheden</h2>
          <p style={{ color: "#1A0A2E" }}>{r.werkzaamheden}</p>
        </div>
      )}

      {(r.geoffreerdeKosten || []).length > 0 && (
        <div className="mt-5">
          <h2 style={{ fontFamily: "Fredoka", fontSize: "1.125rem", color: "#1A0A2E" }}>Gebruikt materiaal en kosten (in de offerte)</h2>
          <ul style={{ color: "#1A0A2E" }}>
            {r.geoffreerdeKosten.map((x, i) => (
              <li key={i}>{x.omschrijving}{num(x.bedrag) > 0 ? " — " + eur(x.bedrag) + " excl. btw" : ""}</li>
            ))}
          </ul>
        </div>
      )}

      {r.extraWerkzaamheden.length > 0 && (
        <div className="mt-5">
          <h2 style={{ fontFamily: "Fredoka", fontSize: "1.125rem", color: "#1A0A2E" }}>Extra uitgevoerd, buiten de offerte</h2>
          <ul style={{ color: "#1A0A2E" }}>
            {r.extraWerkzaamheden.map((x, i) => (
              <li key={i}>{x.omschrijving}{num(x.bedrag) > 0 ? " — " + eur(x.bedrag) + " excl. btw" : ""}</li>
            ))}
          </ul>
        </div>
      )}

      {(() => {
        // Koppeling is expliciet (na.voorFotoId), niet op uploadvolgorde —
        // anders staan foto's willekeurig naast elkaar zodra de aantallen
        // niet gelijk zijn (bijna altijd het geval: Anton stuurt meestal
        // meer na-foto's dan Udo voor-foto's stuurde). Groepering is nu
        // eerst per dienst (foto.dienst, in de volgorde van p.diensten), de
        // koppeling zelf wordt daarna binnen elke dienst-groep gedaan — een
        // voor/na-paar hoort dus alleen bij elkaar in het rapport als Bas ze
        // aan dezelfde dienst heeft getagd. Wat overblijft (ongetagd, of een
        // dienst die niet meer in p.diensten staat) komt als "Algemeen"
        // achteraan — elke foto komt zo altijd exact één keer voor, nooit
        // stilzwijgend kwijt.
        const matchGroep = (voorSubset, naSubset) => {
          const gekoppeld = naSubset.filter((n) => n.voorFotoId && voorSubset.some((v) => v.id === n.voorFotoId));
          const naLos = naSubset.filter((n) => !gekoppeld.includes(n));
          const gekoppeldeVoorIds = new Set(gekoppeld.map((n) => n.voorFotoId));
          const voorLos = voorSubset.filter((v) => !gekoppeldeVoorIds.has(v.id));
          return { gekoppeld, voorLos, naLos };
        };
        const getagd = new Set(p.diensten);
        const groepen = p.diensten
          .map((dienst) => {
            const voorSubset = r.voorFotos.filter((v) => (v.dienst || "") === dienst);
            const naSubset = r.naFotos.filter((n) => (n.dienst || "") === dienst);
            return { titel: dienst, ...matchGroep(voorSubset, naSubset) };
          })
          .filter((gr) => gr.gekoppeld.length || gr.voorLos.length || gr.naLos.length);
        const voorAlgemeen = r.voorFotos.filter((v) => !getagd.has(v.dienst || ""));
        const naAlgemeen = r.naFotos.filter((n) => !getagd.has(n.dienst || ""));
        if (voorAlgemeen.length || naAlgemeen.length) {
          groepen.push({ titel: "Algemeen", ...matchGroep(voorAlgemeen, naAlgemeen) });
        }
        if (!groepen.length) return null;
        // Geen subkopjes tonen als er toch maar één groep is en dat de
        // ongetagde restgroep is — dan is er niets te onderscheiden en blijft
        // het rapport zoals voorheen (vóór dienst-tagging bestond).
        const toonSubkoppen = !(groepen.length === 1 && groepen[0].titel === "Algemeen");
        return (
          <div className="mt-5">
            <h2 style={{ fontFamily: "Fredoka", fontSize: "1.125rem", color: "#1A0A2E" }} className="mb-2">Voor en na</h2>
            {groepen.map((gr) => (
              <div key={gr.titel} className="mt-3 first:mt-0">
                {toonSubkoppen && (
                  <h3 className="text-sm font-medium mb-2" style={{ color: "#6B5B7B" }}>{gr.titel}</h3>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {gr.gekoppeld.map((n) => {
                    const v = r.voorFotos.find((vv) => vv.id === n.voorFotoId);
                    return (
                      <React.Fragment key={n.id}>
                        <FotoCel foto={v} label="voor" />
                        <FotoCel foto={n} label="na" />
                      </React.Fragment>
                    );
                  })}
                  {gr.voorLos.map((v) => <FotoCel key={v.id} foto={v} label="voor" />)}
                  {gr.naLos.map((n) => <FotoCel key={n.id} foto={n} label="na" />)}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      <p className="text-xs mt-8 pt-3" style={{ color: "#6B6076", borderTop: "1px solid #E4DEE9" }}>
        Antoni Hristov · gumclean.nl · 06 4221 0739 · info@gumclean.nl · KvK 42082782
        <br />
        {r.gegenereerdOp
          ? "Rapport gegenereerd op " + datumTijdNL(r.gegenereerdOp)
          : <span style={{ color: "#B3A8BC" }}>(nog niet vergrendeld)</span>}
      </p>
    </div>
  );
}

// =================== PAND ===================
function PandScherm({ id, data, wijzigPand, bewaar, setScherm, gekopieerd, kopieer }) {
  const pRaw = data.panden.find((x) => x.id === id);
  if (!pRaw) return null;
  // Panden opgeslagen vóór nieuwe velden (bv. voorFotos/naFotos) bestonden
  // missen die anders — hier aanvullen met de standaardwaarden uit LEEG_PAND,
  // zonder de bestaande data te overschrijven.
  const p = { ...LEEG_PAND(pRaw.klantId), ...pRaw };
  const k = klantVan(data, p), r = routeVan(data, p);
  const c = controle(data, p), g = cijfers(data, p);
  const ok = c.ontbreekt.length === 0;

  const voegToe = (veld, item) => wijzigPand(p.id, { [veld]: [...p[veld], item] });
  const wijzigRij = (veld, i, patch) =>
    wijzigPand(p.id, { [veld]: p[veld].map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const weg = (veld, i) => wijzigPand(p.id, { [veld]: p[veld].filter((_, j) => j !== i) });

  const [uploadBezig, setUploadBezig] = useState(false);
  const [selectieFoto, setSelectieFoto] = useState(null); // { type: "voor" | "na", id } — voor het klikken-om-te-koppelen
  const [printKaart, setPrintKaart] = useState(null);
  useEffect(() => {
    if (!printKaart) return;
    const t = setTimeout(() => window.print(), 50);
    const reset = () => setPrintKaart(null);
    window.addEventListener("afterprint", reset);
    return () => { clearTimeout(t); window.removeEventListener("afterprint", reset); };
  }, [printKaart]);

  const uploadFotos = async (type, files) => {
    const veld = type === "voor" ? "voorFotos" : "naFotos";
    setUploadBezig(true);
    const nieuw = [];
    try {
      for (const file of files) {
        const blob = await comprimeerAfbeelding(file);
        const res = await fetch("/api/fotos?pandId=" + p.id + "&type=" + type, {
          method: "POST", headers: { "Content-Type": "image/jpeg" }, body: blob,
        });
        if (res.ok) nieuw.push({ id: crypto.randomUUID(), pathname: (await res.json()).pathname, omschrijving: "", voorFotoId: "", dienst: "" });
      }
    } finally {
      setUploadBezig(false);
    }
    if (nieuw.length) wijzigPand(p.id, { [veld]: [...p[veld], ...nieuw] });
  };
  const verwijderFoto = async (type, foto) => {
    const veld = type === "voor" ? "voorFotos" : "naFotos";
    wijzigPand(p.id, { [veld]: p[veld].filter((f) => f.id !== foto.id) });
    await fetch("/api/fotos?pad=" + encodeURIComponent(foto.pathname), { method: "DELETE" });
  };
  const wijzigFotoOmschrijving = (type, foto, omschrijving) => {
    const veld = type === "voor" ? "voorFotos" : "naFotos";
    wijzigPand(p.id, { [veld]: p[veld].map((f) => (f.id === foto.id ? { ...f, omschrijving } : f)) });
  };
  // Welke na-foto bij welke voor-foto hoort — expliciet gekoppeld, niet op
  // uploadvolgorde. Anders staan de foto's willekeurig naast elkaar zodra
  // Anton meer (of andere) na-foto's stuurt dan er voor-foto's zijn.
  const koppelFotos = (voorId, naId) =>
    wijzigPand(p.id, { naFotos: p.naFotos.map((f) => (f.id === naId ? { ...f, voorFotoId: voorId } : f)) });
  const ontkoppelFotos = (naFoto) => koppelFotos("", naFoto.id);
  // Welke dienst (uit p.diensten) een foto documenteert — bepaalt de
  // groepering in het opleverrapport, zie OpleverrapportDocument.
  const wijzigFotoDienst = (type, foto, dienst) => {
    const veld = type === "voor" ? "voorFotos" : "naFotos";
    wijzigPand(p.id, { [veld]: p[veld].map((f) => (f.id === foto.id ? { ...f, dienst } : f)) });
  };
  // Opleverrapport vergrendelen/ontgrendelen — zie OpleverrapportDocument
  // voor de reden (zelfde snapshot-patroon als offerte.regels).
  const vergrendelRapport = () => wijzigPand(p.id, {
    opleverrapportVergrendeld: true,
    opleverrapportSnapshot: {
      werkzaamheden: p.werkzaamheden, extraWerkzaamheden: p.extraWerkzaamheden, geoffreerdeKosten: p.geoffreerdeKosten,
      voorFotos: p.voorFotos, naFotos: p.naFotos, afgerondOp: p.afgerondOp,
      gegenereerdOp: new Date().toISOString(),
    },
  });
  const ontgrendelRapport = () => wijzigPand(p.id, { opleverrapportVergrendeld: false, opleverrapportSnapshot: null });

  const begroteEenheidUur = p.begrootEenheid === "uur";
  const factuurtekst = [
    r?.tenaamstelling || "[tenaamstelling ontbreekt]",
    r?.tav ? "T.a.v. " + r.tav : "",
    r?.adres || "[factuuradres ontbreekt]",
    "Btw: " + (r?.btw || "[btw ontbreekt]"),
    "",
    "Pand: " + p.naam + (p.filiaalnummer ? " · filiaalnummer " + p.filiaalnummer : ""),
    "Pandadres: " + (p.adres || "[pandadres ontbreekt]"),
    "Grootboek: " + (p.grootboek || "[grootboeknummer ontbreekt]"),
    "Soort werk: " + (p.soortWerk || "[soort werk ontbreekt]"),
    "Opdrachtgever: " + (k?.contactpersoon || "[onbekend]"),
    "",
    "Uitgevoerde werkzaamheden: " + (p.werkzaamheden || "[werkzaamheden ontbreekt]"),
    (p.geoffreerdeKosten || []).length > 0 ? "Doorbelaste kosten (in de offerte):" : "",
    ...(p.geoffreerdeKosten || []).map((x) => "  - " + (x.omschrijving || "[omschrijving ontbreekt]") + (num(x.bedrag) > 0 ? " (" + eur(x.bedrag) + ")" : "")),
    p.extraWerkzaamheden.length > 0 ? "Extra werkzaamheden (buiten de offerte):" : "",
    ...p.extraWerkzaamheden.map((x) => "  - " + (x.omschrijving || "[omschrijving ontbreekt]") + (num(x.bedrag) > 0 ? " (" + eur(x.bedrag) + ")" : "")),
    "",
    p.begrootMandagen + (begroteEenheidUur ? " uur à " + eur0(g.tarief / 8) : " mandagen à " + eur0(g.tarief))
      + (num(p.voorrijkosten) > 0 ? " + " + eur(p.voorrijkosten) + " voorrijkosten" : "")
      + (g.extraOmzet > 0 ? " + " + eur(g.extraOmzet) + " kosten en extra werkzaamheden" : "")
      + " = " + eur(g.omzet) + " excl. btw",
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
          <Veld label="Soort werk" value={p.soortWerk} onChange={(v) => wijzigPand(p.id, { soortWerk: v })} />
          <Veld breed label="Uitgevoerde werkzaamheden" value={p.werkzaamheden} onChange={(v) => wijzigPand(p.id, { werkzaamheden: v })} />
          <div className="col-span-2">
            <span className="block text-xs mb-1" style={{ color: "#6B5B7B" }}>Diensten (0-beurt)</span>
            <div className="flex flex-wrap gap-2">
              {["Gevelreiniging", "Terreinreiniging (stoep)", "Winkelpui/ramen reinigen", "Graffitiverwijdering"].map((t) => {
                const aan = p.diensten.includes(t);
                return (
                  <button key={t} onClick={() => wijzigPand(p.id, { diensten: aan ? p.diensten.filter((x) => x !== t) : [...p.diensten, t] })}
                    className="px-3 py-1.5 rounded-full text-xs transition"
                    style={aan ? { background: INK, color: "white" } : { background: "#F5EFF8", color: "#6B5B7B" }}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
          <Veld label="Afstand enkele reis (km)" type="number" value={p.afstandEnkel} onChange={(v) => wijzigPand(p.id, { afstandEnkel: v })} />
          <MandagenOfUrenVeld breed label="Afgesproken offerte: mandagen of uren"
            waarde={p.begrootMandagen} eenheid={p.begrootEenheid}
            onWaarde={(v) => wijzigPand(p.id, { begrootMandagen: v })}
            onEenheid={(v) => wijzigPand(p.id, { begrootEenheid: v })} />
          {p.begrootEenheid === "uur" && (
            <p className="col-span-2 text-xs -mt-2" style={{ color: "#8A7B98" }}>
              Verkooptarief bij uren: {eur(g.tarief / 8)} per uur (dagtarief ÷ 8) — dit is het factuurtarief, niet Antons kostprijs.
            </p>
          )}
          <Veld label="Voorrijkosten (afgesproken, excl. btw)" type="number" value={p.voorrijkosten} onChange={(v) => wijzigPand(p.id, { voorrijkosten: v })} />
          <Veld label="Doorbelaste hoogwerkerhuur" type="number" value={p.doorbelast} onChange={(v) => wijzigPand(p.id, { doorbelast: v })} />
        </div>
        <label className="flex items-center gap-2 mt-3 text-sm" style={{ color: INK }}>
          <input type="checkbox" checked={p.hoogwerker} onChange={(e) => wijzigPand(p.id, { hoogwerker: e.target.checked })} />
          Hoogwerker nodig
        </label>
      </Kaart>

      {/* Planning */}
      <Kaart>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} style={{ color: ROZE }} />
          <h3 style={{ fontFamily: "Fredoka", color: INK }}>Planning</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Veld label="Startdatum" type="date" value={p.startdatum} onChange={(v) => wijzigPand(p.id, { startdatum: v })} />
          <label className="block">
            <span className="block text-xs mb-1" style={{ color: "#6B5B7B" }}>Reispatroon</span>
            <select value={p.reispatroon} onChange={(e) => wijzigPand(p.id, { reispatroon: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
              style={{ borderColor: "#E4DCEA", background: "white", color: INK }}>
              <option value="dagelijks">Elke dag heen en terug</option>
              <option value="overnachten">Blijft in de buurt (overnachten)</option>
            </select>
          </label>
          <Veld label="Contactpersoon ter plaatse" value={p.contactpersoonTerPlaatse}
            placeholder="waar Anton zich meldt, kan afwijken van de opdrachtgever"
            onChange={(v) => wijzigPand(p.id, { contactpersoonTerPlaatse: v })} />
          <Veld label="Telefoon ter plaatse" value={p.telefoonTerPlaatse}
            onChange={(v) => wijzigPand(p.id, { telefoonTerPlaatse: v })} />
          <Veld breed label="Instructies voor Anton" value={p.instructies}
            placeholder="bijzonderheden, toegang, parkeren, veiligheid..."
            onChange={(v) => wijzigPand(p.id, { instructies: v })} />
        </div>
        {num(p.afstandEnkel) > 0 && num(p.begrootMandagen) > 0 && (
          <p className="text-xs mt-3" style={{ color: "#8A7B98" }}>
            {p.reispatroon === "overnachten"
              ? "Reistijd (" + g.reistijdEnkeleReis.toFixed(1) + " uur enkele reis) telt maar één keer mee voor de hele klus."
              : "Reistijd (" + g.reistijdEnkeleReis.toFixed(1) + " uur enkele reis, " + (g.reistijdEnkeleReis * 2).toFixed(1) + " uur retour) gaat er elke werkdag vanaf."}
            {" "}Bij {data.instellingen.werkurenPerDag ?? 8} werkbare uren per dag (ma–vr) kost deze klus{" "}
            {isFinite(g.werkdagenNodig) ? g.werkdagenNodig + " werkdag" + (g.werkdagenNodig === 1 ? "" : "en") : "meer dagen dan de reistijd toelaat — overweeg overnachten"}.
          </p>
        )}
        {p.startdatum && g.verwachteEinddatum && (
          <div className="mt-3 p-3 rounded-xl" style={{ background: PAPIER }}>
            <span className="text-sm" style={{ fontFamily: "Fredoka", color: INK }}>
              Start {datumNL(new Date(p.startdatum + "T00:00:00"))} · verwacht klaar rond {datumNL(g.verwachteEinddatum)}
            </span>
          </div>
        )}
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

      {/* Foto's */}
      <Kaart>
        <div className="flex items-center gap-2 mb-3">
          <Package size={16} style={{ color: ROZE }} />
          <h3 style={{ fontFamily: "Fredoka", color: INK }}>Foto's</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Veld breed label="Algemene omschrijving (van Udo)" value={p.voorOmschrijving}
            placeholder="korte samenvatting — de omschrijving per foto vul je hieronder in"
            onChange={(v) => wijzigPand(p.id, { voorOmschrijving: v })} />
          <Veld label="Afgerond op" type="date" value={p.afgerondOp}
            onChange={(v) => wijzigPand(p.id, { afgerondOp: v })} />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: INK }}>Voor-foto's</span>
            <FotoUpload label="Foto's toevoegen" bezig={uploadBezig} onFiles={(files) => uploadFotos("voor", files)} />
          </div>
          <FotoGrid fotos={p.voorFotos} onVerwijder={(f) => verwijderFoto("voor", f)}
            onOmschrijving={(f, v) => wijzigFotoOmschrijving("voor", f, v)}
            dienstOpties={p.diensten} onDienst={(f, v) => wijzigFotoDienst("voor", f, v)} />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: INK }}>Na-foto's (opgeleverd)</span>
            <FotoUpload label="Foto's toevoegen" bezig={uploadBezig} onFiles={(files) => uploadFotos("na", files)} />
          </div>
          <FotoGrid fotos={p.naFotos} onVerwijder={(f) => verwijderFoto("na", f)}
            onOmschrijving={(f, v) => wijzigFotoOmschrijving("na", f, v)}
            dienstOpties={p.diensten} onDienst={(f, v) => wijzigFotoDienst("na", f, v)} />
          <p className="text-xs mt-1" style={{ color: "#8A7B98" }}>
            Tag voor- én na-foto met dezelfde dienst om ze in het rapport bij elkaar te houden; ongetagde foto's
            komen onder "Algemeen".
          </p>
        </div>
        <FotoKoppelen voorFotos={p.voorFotos} naFotos={p.naFotos} selectie={selectieFoto} onSelecteer={setSelectieFoto}
          onKoppel={koppelFotos} onOntkoppel={ontkoppelFotos} />
      </Kaart>

      {/* Uren */}
      <Kaart>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} style={{ color: ROZE }} />
          <h3 style={{ fontFamily: "Fredoka", color: INK }}>Uren</h3>
          <span className="ml-auto text-sm" style={{ color: "#6B5B7B" }}>{g.effectieveUren} uur · {g.mandagenWerkelijk.toFixed(2)} mandagen</span>
        </div>
        <div className="mb-3">
          <MandagenOfUrenVeld label="Of: werkelijk gewerkt in dagen of uren (in plaats van losse regels hieronder)"
            waarde={p.werkelijkeMandagen} eenheid={p.werkelijkeEenheid}
            onWaarde={(v) => wijzigPand(p.id, { werkelijkeMandagen: v })}
            onEenheid={(v) => wijzigPand(p.id, { werkelijkeEenheid: v })} />
          {num(p.werkelijkeMandagen) > 0 && g.gewerkteUren > 0 && (
            <p className="text-xs mt-1" style={{ color: ROZE }}>
              Er staan ook losse uren ingevuld — die tellen dan mee, niet dit veld.
            </p>
          )}
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
        <datalist id="verbruik-opties">
          {VERBRUIK_OPTIES.map((o) => <option key={o} value={o} />)}
        </datalist>
        {p.verbruik.map((v, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
            <input value={v.omschrijving} placeholder="omschrijving" list="verbruik-opties" onChange={(e) => wijzigRij("verbruik", i, { omschrijving: e.target.value })}
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

      {/* Doorbelaste kosten, al in de offerte */}
      <Kaart>
        <div className="flex items-center gap-2 mb-3">
          <Package size={16} style={{ color: ROZE }} />
          <h3 style={{ fontFamily: "Fredoka", color: INK }}>Doorbelaste kosten (in de offerte)</h3>
          {g.geoffreerdeKostenOmzet > 0 && <span className="ml-auto text-sm" style={{ color: "#6B5B7B" }}>{eur(g.geoffreerdeKostenOmzet)}</span>}
        </div>
        <p className="text-xs mb-3" style={{ color: "#8A7B98" }}>
          Kosten die al onderdeel waren van de afgesproken prijs, zoals materiaal en verbruik (bv. osmosewater) of
          gehuurde apparatuur — geen verrassing voor de klant. Telt mee in de omzet hieronder én in de factuurregels.
        </p>
        {(p.geoffreerdeKosten || []).map((x, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
            <input value={x.omschrijving} placeholder="omschrijving" onChange={(e) => wijzigRij("geoffreerdeKosten", i, { omschrijving: e.target.value })}
              className="col-span-8 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
            <input type="number" step="0.01" value={x.bedrag} placeholder="bedrag" onChange={(e) => wijzigRij("geoffreerdeKosten", i, { bedrag: e.target.value })}
              className="col-span-3 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
            <button onClick={() => weg("geoffreerdeKosten", i)} className="col-span-1 flex justify-center"><Trash2 size={14} style={{ color: "#B9A9C4" }} /></button>
          </div>
        ))}
        <Knop variant="wit" klein onClick={() => voegToe("geoffreerdeKosten", { omschrijving: "", bedrag: "" })}>
          <span className="flex items-center gap-1"><Plus size={13} /> Regel toevoegen</span>
        </Knop>
      </Kaart>

      {/* Extra werkzaamheden, buiten de offerte */}
      <Kaart>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} style={{ color: ROZE }} />
          <h3 style={{ fontFamily: "Fredoka", color: INK }}>Extra werkzaamheden (buiten de offerte)</h3>
          {g.extraWerkzaamhedenOmzet > 0 && <span className="ml-auto text-sm" style={{ color: "#6B5B7B" }}>{eur(g.extraWerkzaamhedenOmzet)}</span>}
        </div>
        <p className="text-xs mb-3" style={{ color: "#8A7B98" }}>
          Wat Anton er onderweg bij heeft gedaan, boven op de offerte — graffiti, grofvuil, een extra vieze stoep.
          Bedrag is optioneel; met bedrag telt het mee in de omzet hieronder én in de factuurregels.
        </p>
        {p.extraWerkzaamheden.map((x, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
            <input value={x.omschrijving} placeholder="omschrijving" onChange={(e) => wijzigRij("extraWerkzaamheden", i, { omschrijving: e.target.value })}
              className="col-span-8 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
            <input type="number" step="0.01" value={x.bedrag} placeholder="bedrag" onChange={(e) => wijzigRij("extraWerkzaamheden", i, { bedrag: e.target.value })}
              className="col-span-3 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
            <button onClick={() => weg("extraWerkzaamheden", i)} className="col-span-1 flex justify-center"><Trash2 size={14} style={{ color: "#B9A9C4" }} /></button>
          </div>
        ))}
        <Knop variant="wit" klein onClick={() => voegToe("extraWerkzaamheden", { omschrijving: "", bedrag: "" })}>
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
            <span style={{ color: "#6B5B7B" }}>
              Opbrengst · {p.begrootMandagen} {begroteEenheidUur ? "uur à " + eur0(g.tarief / 8) : "mandagen à " + eur0(g.tarief)}
            </span>
            <span style={{ color: INK }}>{eur(g.omzetBasis)}</span>
          </div>
          {g.reserveringBtw > 0 && (
            <p className="text-xs py-1" style={{ color: "#8A7B98" }}>
              Incl. {g.btwPercentage}% btw ontvang je hierover {eur(g.omzetInclBtw)} — waarvan {eur(g.reserveringBtw)} btw is
              en niet van jou: die draag je af. Telt niet mee in resultaat of reserveringen hieronder, want die rekenen al
              met het bedrag ex btw.
            </p>
          )}
          {num(p.voorrijkosten) > 0 && (
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #F3EDF7" }}>
              <span style={{ color: "#6B5B7B" }}>Voorrijkosten (afgesproken)</span>
              <span style={{ color: INK }}>{eur(g.voorrijkosten)}</span>
            </div>
          )}
          {g.geoffreerdeKostenOmzet > 0 && (
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #F3EDF7" }}>
              <span style={{ color: "#6B5B7B" }}>Doorbelaste kosten (in de offerte)</span>
              <span style={{ color: INK }}>{eur(g.geoffreerdeKostenOmzet)}</span>
            </div>
          )}
          {g.extraWerkzaamhedenOmzet > 0 && (
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #F3EDF7" }}>
              <span style={{ color: "#6B5B7B" }}>Extra werkzaamheden (buiten de offerte)</span>
              <span style={{ color: INK }}>{eur(g.extraWerkzaamhedenOmzet)}</span>
            </div>
          )}
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
            <span style={{ color: "#6B5B7B" }}>Arbeid Anton · {g.effectieveUren} uur × {eur(g.uurloon)}</span>
            <span style={{ color: INK }}>− {eur(g.arbeid)}</span>
          </div>
          <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #E4DCEA" }}>
            <span className="font-medium" style={{ color: INK }}>Resultaat</span>
            <span className="font-medium" style={{ color: g.resultaat >= 0 ? GROEN : ROZE }}>{eur(g.resultaat)}</span>
          </div>
          {[
            ["Reservering AOV · " + g.pctAov + "% van omzet", g.reserveringAov],
            ["Reservering pensioen · " + g.pctPensioen + "% van omzet", g.reserveringPensioen],
            ["Reservering weer/winter · " + g.pctWeer + "% van omzet", g.reserveringWeer],
            ["Reservering investering (tools/bus) · " + g.pctInvestering + "% van omzet", g.reserveringInvestering],
            ["Reservering belasting (IB/Zvw) · " + g.pctBelasting + "% van winst", g.reserveringBelasting],
          ].filter(([, v]) => v > 0).map(([l, v]) => (
            <div key={l} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #F3EDF7" }}>
              <span style={{ color: "#6B5B7B" }}>{l}</span><span style={{ color: INK }}>− {eur(v)}</span>
            </div>
          ))}
          {g.reserveringTotaal > 0 && (
            <div className="flex justify-between py-2">
              <span className="font-medium" style={{ color: INK }}>Netto beschikbaar</span>
              <span className="font-medium" style={{ color: g.nettoBeschikbaar >= 0 ? GROEN : ROZE }}>{eur(g.nettoBeschikbaar)}</span>
            </div>
          )}
          {num(p.doorbelast) > 0 && (
            <p className="text-xs pt-1" style={{ color: "#8A7B98" }}>
              Hoogwerkerhuur {eur(p.doorbelast)} loopt er buitenom: één op één doorbelast, dus per saldo nul.
            </p>
          )}
        </div>
        <div className="mt-4 p-4 rounded-xl" style={{ background: PAPIER }}>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl" style={{ fontFamily: "Fredoka", color: g.effectief >= g.tarief / 8 ? GROEN : ROZE }}>
              {g.effectieveUren > 0 ? eur(g.effectief) : "—"}
            </span>
            <span className="text-sm" style={{ color: "#6B5B7B" }}>
              overgehouden per gewerkt uur · begroot {eur(g.tarief / 8)}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "#8A7B98" }}>
            {g.effectieveUren === 0
              ? "Vul uren of werkelijke mandagen in om te zien of het tarief klopt."
              : g.afwijking > 0.05
                ? "Je stond " + g.afwijking.toFixed(2) + " mandag langer op locatie dan begroot. Bij de volgende offerte meenemen."
                : "Binnen de begroting gebleven. Tarief van " + eur0(g.tarief) + " per mandag houdt stand."}
          </p>
          {g.effectieveUren > 0 && (
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

      {/* Onderhoud */}
      <Kaart>
        <div className="flex items-center gap-2 mb-3">
          <Calculator size={16} style={{ color: ROZE }} />
          <h3 style={{ fontFamily: "Fredoka", color: INK }}>Onderhoudsbeurt (na deze 0-beurt)</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Veld label="Onderhoudsbeurt elke ... maanden" type="number" value={p.onderhoudsintervalMaanden}
            onChange={(v) => wijzigPand(p.id, { onderhoudsintervalMaanden: v })} />
        </div>
        {num(p.begrootMandagen) > 0 && (
          <p className="text-xs mt-3" style={{ color: "#8A7B98" }}>
            Een onderhoudsbeurt is geschat op {g.onderhoudsPercentage}% van het werk van deze 0-beurt
            (≈ {g.onderhoudMandagen.toFixed(1)} mandagen), reiskosten en voorrijkosten blijven vol staan omdat
            dat een nieuwe rit is. Geschatte omzet per beurt: {eur(g.onderhoudOmzet)} excl. btw.
            {num(p.onderhoudsintervalMaanden) > 0 && (
              " Bij elke " + p.onderhoudsintervalMaanden + " maanden is dat " + g.onderhoudBeurtenPerJaar.toFixed(1)
              + "× per jaar ≈ " + eur0(g.onderhoudOmzetPerJaar) + " per jaar excl. btw."
            )}
          </p>
        )}
        <p className="text-xs mt-1" style={{ color: "#8A7B98" }}>
          Percentage is een vuistregel, aan te passen bij Export → Planning.
        </p>
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

      {/* Werkbeschrijving voor Anton */}
      <Kaart>
        <div className="flex items-center gap-2 mb-3">
          <Route size={16} style={{ color: ROZE }} />
          <h3 style={{ fontFamily: "Fredoka", color: INK }}>Werkbeschrijving voor Anton</h3>
          <span className="ml-auto">
            <Knop variant="wit" klein onClick={() => setPrintKaart("werk")}>Print / naar Anton appen</Knop>
          </span>
        </div>
        <WerkbeschrijvingDocument p={p} />
      </Kaart>
      <PrintPortaal actief={printKaart === "werk"}><WerkbeschrijvingDocument p={p} /></PrintPortaal>

      {/* Opleverrapport voor de klant, in GumClean-huisstijl (design system v2) */}
      <Kaart className="overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={16} style={{ color: ROZE }} />
          <h3 style={{ fontFamily: "Fredoka", color: INK }}>Opleverrapport voor de klant</h3>
          <span className="ml-auto flex items-center gap-2">
            {p.opleverrapportVergrendeld ? (
              <Knop variant="wit" klein onClick={ontgrendelRapport}>Ontgrendelen</Knop>
            ) : (
              <Knop variant="wit" klein onClick={vergrendelRapport}>Rapport vergrendelen</Knop>
            )}
            <Knop variant="wit" klein onClick={() => setPrintKaart("oplever")}>Print / opslaan als pdf</Knop>
          </span>
        </div>
        {p.opleverrapportVergrendeld && p.opleverrapportSnapshot && (
          <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "#F5EFF8", color: "#6B5B7B" }}>
            Rapport vergrendeld op {datumNL(new Date(p.opleverrapportSnapshot.gegenereerdOp))}, latere wijzigingen
            aan werkzaamheden/foto's komen hier niet meer in.
          </p>
        )}
        <OpleverrapportDocument p={p} k={k} />
      </Kaart>
      <PrintPortaal actief={printKaart === "oplever"}><OpleverrapportDocument p={p} k={k} /></PrintPortaal>

      <Knop variant="wit" onClick={() => {
        bewaar({ ...data, panden: data.panden.filter((x) => x.id !== p.id) });
        setScherm({ naam: "overzicht" });
      }}>
        <span className="flex items-center gap-1" style={{ color: "#8A7B98" }}><Trash2 size={13} /> Opdracht verwijderen</span>
      </Knop>
    </div>
  );
}

// =================== OFFERTES ===================
function OffertesScherm({ data, bewaar, setScherm }) {
  const nieuweOfferte = (klantId, type) => {
    const k = data.klanten.find((x) => x.id === klantId);
    const offerte = {
      ...LEEG_OFFERTE(klantId, type),
      offertenummer: volgendOffertenummer(data.offertes),
      datum: new Date().toISOString().slice(0, 10),
      voorNaam: k?.naam || "",
      voorTav: k?.contactpersoon ? "T.a.v. " + k.contactpersoon : "",
    };
    bewaar({ ...data, offertes: [...data.offertes, offerte] });
    setScherm({ naam: "offerte", id: offerte.id });
  };
  return (
    <div className="space-y-6">
      {data.klanten.map((k) => {
        const offertes = data.offertes.filter((o) => o.klantId === k.id);
        return (
          <div key={k.id}>
            <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
              <h2 className="text-lg" style={{ fontFamily: "Fredoka", color: INK }}>{k.naam || "Naamloze klant"}</h2>
              <div className="flex gap-2">
                <Knop variant="wit" klein onClick={() => nieuweOfferte(k.id, "meerdere-panden")}>
                  <span className="flex items-center gap-1"><Plus size={13} /> Meerdere panden</span>
                </Knop>
                <Knop variant="wit" klein onClick={() => nieuweOfferte(k.id, "spoedopdracht")}>
                  <span className="flex items-center gap-1"><Plus size={13} /> Spoedopdracht</span>
                </Knop>
              </div>
            </div>
            {offertes.length === 0 ? (
              <p className="text-sm" style={{ color: "#8A7B98" }}>Nog geen offertes voor deze klant.</p>
            ) : (
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EDE6F2", background: "white" }}>
                {offertes.map((o, i) => (
                  <button key={o.id} onClick={() => setScherm({ naam: "offerte", id: o.id })}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition"
                    style={{ borderTop: i ? "1px solid #F1EAF5" : "none" }}>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate" style={{ color: INK }}>
                        {o.offertenummer || "(geen nummer)"} — {o.titel || (o.type === "spoedopdracht" ? "Spoedopdracht" : "Meerdere panden")}
                      </span>
                      <span className="block text-xs truncate" style={{ color: "#8A7B98" }}>
                        {o.type === "spoedopdracht" ? "Spoedopdracht" : o.regels.length + " pand" + (o.regels.length === 1 ? "" : "en")} · {o.status}
                      </span>
                    </span>
                    {o.datum && <span className="text-xs shrink-0" style={{ color: "#8A7B98" }}>{datumNL(new Date(o.datum + "T00:00:00"))}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Het genummerde sectiekop-blok uit het design system (§4 Sectiekop-blok):
// vlak nummerblok links, titel rechts. Herbruikbaar element, ook op de site.
function OfferteSectie({ nummer, titel, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
          style={{ background: "#FF3D9A", color: "white", fontFamily: "Fredoka" }}>{nummer}</span>
        <h2 style={{ fontFamily: "Fredoka", fontSize: "1.125rem", color: "#1A0A2E" }}>{titel}</h2>
      </div>
      <div style={{ color: "#1A0A2E", marginLeft: "2.5rem" }}>{children}</div>
    </div>
  );
}

// Meerdere regels tekst, gescheiden door een lege regel of \n, als losse <p>'s.
function TekstBlok({ tekst }) {
  return tekst.split("\n").filter(Boolean).map((regel, i) => <p key={i} className="mb-1">{regel}</p>);
}

// Vrij te definiëren keuze-opties op een offerte (bv. lichtreclame reinigen,
// extra glazenwas) — losse regels i.p.v. een vast veld per optie, zodat het
// niet per se over lichtreclame hoeft te gaan. Zelfde regel-editor-patroon
// als prijsregels/extraWerkzaamheden elders in het bestand.
function OptiesEditor({ opties, onWijzig, onWeg, onToevoegen }) {
  return (
    <div>
      <span className="block text-xs mb-1" style={{ color: "#6B5B7B" }}>Opties (optioneel, klant kiest zelf welke)</span>
      {opties.map((opt, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
          <input value={opt.omschrijving} placeholder="omschrijving, bv. lichtreclame reinigen" onChange={(e) => onWijzig(i, { omschrijving: e.target.value })}
            className="col-span-8 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
          <input type="number" step="0.01" value={opt.bedrag} placeholder="bedrag" onChange={(e) => onWijzig(i, { bedrag: e.target.value })}
            className="col-span-3 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
          <button onClick={() => onWeg(i)} className="col-span-1 flex justify-center"><Trash2 size={14} style={{ color: "#B9A9C4" }} /></button>
        </div>
      ))}
      <Knop variant="wit" klein onClick={onToevoegen}>
        <span className="flex items-center gap-1"><Plus size={13} /> Optie toevoegen</span>
      </Knop>
    </div>
  );
}

function OfferteDocument({ o, k, data, nrs, totaalMeerderePanden, onderhoudTotaal, totaalSpoedopdracht }) {
  return (
    <div className="rounded-xl p-8" style={{ background: "#FFFFFF", border: "1px solid #E4DEE9", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <img src="/logo.png" alt="GumClean" style={{ height: 32 }} />
        <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#FFE8F3", color: "#CC317B" }}>
          OFFERTE · {o.offertenummer || "(nummer)"}
        </span>
      </div>
      <h1 style={{ fontFamily: "Fredoka", fontWeight: 600, fontSize: "1.5rem", color: "#1A0A2E" }}>
        {o.titel || (o.type === "spoedopdracht" ? "Spoedopdracht" : "0-beurt")}
      </h1>
      {o.samenvatting && <p style={{ color: "#6B6076" }}>{o.samenvatting}</p>}

      <div className="grid grid-cols-2 gap-6 mt-5 text-sm" style={{ color: "#1A0A2E" }}>
        <div>
          <p className="font-medium" style={{ fontFamily: "Fredoka" }}>Van</p>
          <p style={{ fontWeight: 600 }}>GumClean</p>
          <p>Antoni Hristov</p>
          <p>{data.instellingen.thuisadres}</p>
          <p>KvK 42082782 · 06 4221 0739</p>
          <p>info@gumclean.nl</p>
        </div>
        <div>
          <p className="font-medium" style={{ fontFamily: "Fredoka" }}>Voor</p>
          <p style={{ fontWeight: 600 }}>{o.voorNaam || k?.naam || "—"}</p>
          {o.voorTav && <p>{o.voorTav}</p>}
          {o.voorAdres && <p style={{ whiteSpace: "pre-line" }}>{o.voorAdres}</p>}
          <p className="mt-2">Offertenummer {o.offertenummer || "—"}</p>
          <p>Datum {o.datum ? datumNL(new Date(o.datum + "T00:00:00")) : "—"} · Geldig {o.geldigDagen} dagen</p>
        </div>
      </div>

      {o.aanhef && <p className="mt-5" style={{ color: "#1A0A2E" }}>{o.aanhef}</p>}
      {o.inleiding && <div className="mt-2"><TekstBlok tekst={o.inleiding} /></div>}

      {o.type === "meerdere-panden" ? (
        <>
          <div className="mt-5"><OfferteSectie nummer={nrs.werkwijze} titel="Onze werkwijze"><TekstBlok tekst={o.werkwijze} /></OfferteSectie></div>
          <OfferteSectie nummer={nrs.prijs} titel="Prijs per pand, 0-beurt">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#FAF7FB" }}>
                    <th className="text-left px-3 py-2 font-medium">Pand</th>
                    <th className="text-right px-3 py-2 font-medium">Mandagen</th>
                    <th className="text-left px-3 py-2 font-medium">Hoogwerker</th>
                    <th className="text-right px-3 py-2 font-medium">0-beurt</th>
                  </tr>
                </thead>
                <tbody>
                  {o.regels.map((r, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #E4DEE9" }}>
                      <td className="px-3 py-2">{r.naam}</td>
                      <td className="text-right px-3 py-2">{r.mandagen}</td>
                      <td className="px-3 py-2" style={r.hoogwerker ? { fontWeight: 600, color: "#B45309" } : {}}>{r.hoogwerker ? "Ja" : "Nee"}</td>
                      <td className="text-right px-3 py-2">{eur0(r.prijs)}</td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: "1.5px solid #E4DEE9" }}>
                    <td className="px-3 py-2" style={{ fontWeight: 600 }}>Totaal 0-beurt ({o.regels.length} panden)</td>
                    <td className="text-right px-3 py-2" style={{ fontWeight: 600 }}>{o.regels.reduce((s, r) => s + num(r.mandagen), 0)}</td>
                    <td></td>
                    <td className="text-right px-3 py-2" style={{ fontWeight: 600 }}>{eur0(totaalMeerderePanden)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2" style={{ color: "#6B6076" }}>Alle bedragen exclusief btw.</p>
          </OfferteSectie>
          {o.onderhoudContract && (
            <OfferteSectie nummer={nrs.onderhoud} titel="Optioneel: onderhoudscontract">
              <p>Na de 0-beurt is elk pand schoon. Met periodiek onderhoud houdt u dat resultaat vast tegen
                een lager tarief van {data.instellingen.onderhoudsPercentage ?? 60}% van de 0-beurt per ronde.</p>
              <p className="mt-2" style={{ fontWeight: 600 }}>Onderhoudsronde: {eur0(onderhoudTotaal)} excl. btw</p>
            </OfferteSectie>
          )}
          {o.opties.length > 0 && (
            <OfferteSectie nummer={nrs.opties} titel="Opties">
              <ul className="list-disc pl-4">
                {o.opties.map((opt, i) => (
                  <li key={i}>{opt.omschrijving}{num(opt.bedrag) > 0 ? " — " + eur(opt.bedrag) + " excl. btw" : ""}</li>
                ))}
              </ul>
              <p className="text-xs mt-2" style={{ color: "#6B6076" }}>U kiest zelf welke opties u afneemt.</p>
            </OfferteSectie>
          )}
          <OfferteSectie nummer={nrs.watUKrijgt} titel="Wat u van ons krijgt">
            <ul className="list-disc pl-4">
              {o.watUKrijgt.split("\n").filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </OfferteSectie>
        </>
      ) : (
        <>
          {o.situatie && (
            <OfferteSectie nummer={nrs.situatie} titel="De situatie">
              <ul className="list-disc pl-4">{o.situatie.split("\n").filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}</ul>
            </OfferteSectie>
          )}
          {o.aanpak && (
            <OfferteSectie nummer={nrs.aanpak} titel="Onze aanpak">
              <ol className="list-decimal pl-4">{o.aanpak.split("\n").filter(Boolean).map((r, i) => <li key={i} className="mb-1">{r}</li>)}</ol>
            </OfferteSectie>
          )}
          {o.risicos && (
            <OfferteSectie nummer={nrs.risicos} titel="Waar wij rekening mee houden">
              <ul className="list-disc pl-4">{o.risicos.split("\n").filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}</ul>
            </OfferteSectie>
          )}
          <OfferteSectie nummer={nrs.prijs} titel="Prijs">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <tbody>
                {o.prijsregels.map((x, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #E4DEE9" }}>
                    <td className="px-3 py-2">{x.omschrijving}</td>
                    <td className="text-right px-3 py-2">{eur(x.bedrag)}</td>
                  </tr>
                ))}
                {num(o.voorrijkosten) > 0 && (
                  <tr style={{ borderBottom: "1px solid #E4DEE9" }}>
                    <td className="px-3 py-2">{o.voorrijkostenOmschrijving || "Voorrijkosten"}</td>
                    <td className="text-right px-3 py-2">{eur(o.voorrijkosten)}</td>
                  </tr>
                )}
                <tr>
                  <td className="px-3 py-2" style={{ fontWeight: 600 }}>Totaal, excl. btw</td>
                  <td className="text-right px-3 py-2" style={{ fontWeight: 600 }}>{eur(totaalSpoedopdracht)}</td>
                </tr>
              </tbody>
            </table>
          </OfferteSectie>
          {o.opties.length > 0 && (
            <OfferteSectie nummer={nrs.opties} titel="Opties">
              <ul className="list-disc pl-4">
                {o.opties.map((opt, i) => (
                  <li key={i}>{opt.omschrijving}{num(opt.bedrag) > 0 ? " — " + eur(opt.bedrag) + " excl. btw" : ""}</li>
                ))}
              </ul>
              <p className="text-xs mt-2" style={{ color: "#6B6076" }}>U kiest zelf welke opties u afneemt.</p>
            </OfferteSectie>
          )}
          {o.praktisch && (
            <OfferteSectie nummer={nrs.praktisch} titel="Praktisch">
              <ul className="list-disc pl-4">{o.praktisch.split("\n").filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}</ul>
            </OfferteSectie>
          )}
        </>
      )}

      <OfferteSectie nummer={nrs.voorwaarden} titel="Voorwaarden">
        <ul className="list-disc pl-4">
          {o.voorwaarden.replace("{geldigDagen}", o.geldigDagen).split("\n").filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </OfferteSectie>

      <OfferteSectie nummer={nrs.akkoord} titel="Akkoord">
        <p className="mb-3">Gaat u akkoord? Bel of mail gerust bij vragen.</p>
        {o.type === "meerdere-panden" ? (
          <div className="space-y-1">
            <p>☐ 0-beurt, {o.regels.length} panden ({eur0(totaalMeerderePanden)} excl. btw)</p>
            {o.onderhoudContract && <p>☐ Optioneel onderhoudscontract ({eur0(onderhoudTotaal)} per ronde excl. btw)</p>}
            {o.opties.map((opt, i) => <p key={i}>☐ {opt.omschrijving}{num(opt.bedrag) > 0 ? " (" + eur(opt.bedrag) + ")" : ""}</p>)}
          </div>
        ) : (
          <div className="space-y-1">
            <p>☐ Akkoord, totaal {eur(totaalSpoedopdracht)} excl. btw</p>
            {o.opties.map((opt, i) => <p key={i}>☐ {opt.omschrijving}{num(opt.bedrag) > 0 ? " (" + eur(opt.bedrag) + ")" : ""}</p>)}
          </div>
        )}
        <div className="grid grid-cols-2 gap-6 mt-5 text-sm">
          <div>
            <p className="font-medium" style={{ fontFamily: "Fredoka" }}>Namens {o.voorNaam || k?.naam || "de klant"}</p>
            <p>Naam:</p><p>Datum:</p><p>Handtekening:</p>
          </div>
          <div>
            <p className="font-medium" style={{ fontFamily: "Fredoka" }}>Namens GumClean</p>
            <p>Naam: Antoni Hristov</p><p>Datum:</p><p>Handtekening:</p>
          </div>
        </div>
      </OfferteSectie>

      <p className="text-xs mt-8 pt-3" style={{ color: "#6B6076", borderTop: "1px solid #E4DEE9" }}>
        Antoni Hristov · gumclean.nl · 06 4221 0739 · info@gumclean.nl · KvK 42082782
      </p>
    </div>
  );
}

function OfferteScherm({ id, data, wijzigOfferte, bewaar, setScherm }) {
  const oRaw = data.offertes.find((x) => x.id === id);
  if (!oRaw) return null;
  // Offertes opgeslagen vóór nieuwe velden (bv. opties) bestonden missen die
  // anders — zelfde patroon als bij PandScherm: aanvullen met de
  // standaardwaarden uit LEEG_OFFERTE, zonder bestaande data te overschrijven.
  const o = { ...LEEG_OFFERTE(oRaw.klantId, oRaw.type), ...oRaw };
  const k = data.klanten.find((x) => x.id === o.klantId);
  const pandenVanKlant = data.panden.filter((x) => x.klantId === o.klantId);

  const [printActief, setPrintActief] = useState(false);
  useEffect(() => {
    if (!printActief) return;
    const t = setTimeout(() => window.print(), 50);
    const reset = () => setPrintActief(false);
    window.addEventListener("afterprint", reset);
    return () => { clearTimeout(t); window.removeEventListener("afterprint", reset); };
  }, [printActief]);

  const totaalMeerderePanden = o.regels.reduce((s, r) => s + num(r.prijs), 0);
  const onderhoudTotaal = totaalMeerderePanden * (num(data.instellingen.onderhoudsPercentage) || 60) / 100;
  const totaalSpoedopdracht = o.prijsregels.reduce((s, x) => s + num(x.bedrag), 0) + num(o.voorrijkosten);

  // Sectienummers doorlopend berekenen i.p.v. hardcoden — optionele secties
  // worden per offerte aan/uit gezet, dus vaste nummers zouden gaten of
  // dubbele nummers geven zodra niet alle secties getoond worden.
  let volgnr = 0;
  const nrs = {};
  if (o.type === "meerdere-panden") {
    nrs.werkwijze = ++volgnr;
    nrs.prijs = ++volgnr;
    if (o.onderhoudContract) nrs.onderhoud = ++volgnr;
    if (o.opties.length > 0) nrs.opties = ++volgnr;
    nrs.watUKrijgt = ++volgnr;
  } else {
    if (o.situatie) nrs.situatie = ++volgnr;
    if (o.aanpak) nrs.aanpak = ++volgnr;
    if (o.risicos) nrs.risicos = ++volgnr;
    nrs.prijs = ++volgnr;
    if (o.opties.length > 0) nrs.opties = ++volgnr;
    if (o.praktisch) nrs.praktisch = ++volgnr;
  }
  nrs.voorwaarden = ++volgnr;
  nrs.akkoord = ++volgnr;

  const pandTogglen = (pandId) =>
    wijzigOfferte(o.id, { pandIds: o.pandIds.includes(pandId) ? o.pandIds.filter((x) => x !== pandId) : [...o.pandIds, pandId] });

  const regelsOvernemen = () => {
    const regels = o.pandIds.map((pandId) => {
      const p = pandenVanKlant.find((x) => x.id === pandId);
      if (!p) return null;
      const g = cijfers(data, p);
      const mandagen = p.begrootEenheid === "uur" ? num(p.begrootMandagen) / 8 : num(p.begrootMandagen);
      return { pandId: p.id, naam: p.naam, mandagen, hoogwerker: p.hoogwerker, prijs: g.omzetBasis };
    }).filter(Boolean);
    wijzigOfferte(o.id, { regels });
  };
  const wijzigRegel = (i, patch) =>
    wijzigOfferte(o.id, { regels: o.regels.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
  const wegRegel = (i) => wijzigOfferte(o.id, { regels: o.regels.filter((_, j) => j !== i) });

  const voegPrijsregelToe = () => wijzigOfferte(o.id, { prijsregels: [...o.prijsregels, { omschrijving: "", bedrag: "" }] });
  const wijzigPrijsregel = (i, patch) =>
    wijzigOfferte(o.id, { prijsregels: o.prijsregels.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const wegPrijsregel = (i) => wijzigOfferte(o.id, { prijsregels: o.prijsregels.filter((_, j) => j !== i) });

  const voegOptieToe = () => wijzigOfferte(o.id, { opties: [...o.opties, { omschrijving: "", bedrag: "" }] });
  const wijzigOptie = (i, patch) =>
    wijzigOfferte(o.id, { opties: o.opties.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const wegOptie = (i) => wijzigOfferte(o.id, { opties: o.opties.filter((_, j) => j !== i) });

  // Akkoord → opdracht, zodat Bas niet dubbel hoeft te typen wat al in de
  // offerte staat. Bij "meerdere panden" bestaan de panden al (dat is waar
  // de regels vandaan komen bij "Regels overnemen") — hier schrijven we
  // alleen de uiteindelijk afgesproken mandagen/hoogwerker terug, voor het
  // geval er tijdens het onderhandelen iets afweek van de eerste regel (zie
  // de Drachten-discrepantie in DESTINATION-registratietool.md). Bij
  // "spoedopdracht" bestaat er nog geen pand — die wordt hier aangemaakt,
  // met zoveel mogelijk voorbereiding voor Anton al ingevuld uit de offerte.
  const zetOmNaarOpdracht = () => {
    if (o.type === "meerdere-panden") {
      const panden = data.panden.map((p) => {
        const regel = o.regels.find((r) => r.pandId === p.id);
        return regel ? { ...p, begrootMandagen: regel.mandagen, hoogwerker: regel.hoogwerker } : p;
      });
      bewaar({
        ...data,
        panden,
        offertes: data.offertes.map((x) => (x.id === o.id ? { ...x, omgezetNaarPandId: "meerdere" } : x)),
      });
      setScherm({ naam: "overzicht" });
    } else {
      const nieuw = {
        ...LEEG_PAND(o.klantId),
        naam: o.titel || o.offertenummer || "Nieuwe opdracht",
        adres: o.voorAdres,
        voorrijkosten: o.voorrijkosten,
        begrootEenheid: "uur",
        instructies: [o.aanpak, o.praktisch].filter(Boolean).join("\n\n"),
        voorOmschrijving: o.situatie,
        // Een spoedopdracht heeft geen mandagen/dagtarief — de prijsregels (bv.
        // materiaal en verbruik, osmosewater) zíjn de afgesproken prijs, dus
        // gaan ze mee als geoffreerdeKosten (niet extraWerkzaamheden — dat is
        // voor werk dat juist niét in de offerte stond). Zonder deze overname
        // verdwijnt dat bedrag zodra de offerte een opdracht wordt, want de
        // opdracht heeft dan alleen nog voorrijkosten.
        geoffreerdeKosten: o.prijsregels.filter((x) => x.omschrijving || num(x.bedrag) > 0),
      };
      bewaar({
        ...data,
        panden: [...data.panden, nieuw],
        offertes: data.offertes.map((x) => (x.id === o.id ? { ...x, omgezetNaarPandId: nieuw.id } : x)),
      });
      setScherm({ naam: "pand", id: nieuw.id });
    }
  };

  return (
    <div className="space-y-5">
      <Kaart>
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ fontFamily: "Fredoka", color: INK }}>Offerte</h3>
          <label className="text-xs">
            <select value={o.status} onChange={(e) => wijzigOfferte(o.id, { status: e.target.value })}
              className="px-2 py-1 rounded-lg text-xs border" style={{ borderColor: "#E4DCEA", color: INK }}>
              <option value="concept">Concept</option>
              <option value="verstuurd">Verstuurd</option>
              <option value="akkoord">Akkoord</option>
              <option value="afgewezen">Afgewezen</option>
            </select>
          </label>
        </div>
        {o.status === "akkoord" && (
          <div className="mb-3 p-3 rounded-xl flex items-center justify-between gap-3" style={{ background: "#EAF7ED" }}>
            {o.omgezetNaarPandId ? (
              <p className="text-sm" style={{ color: "#14652A" }}>
                Al omgezet naar {o.type === "meerdere-panden" ? "de gekoppelde panden" : "een opdracht"}.
                {o.type === "spoedopdracht" && (
                  <> <button onClick={() => setScherm({ naam: "pand", id: o.omgezetNaarPandId })}
                    className="underline" style={{ color: "#14652A" }}>Ga ernaartoe</button></>
                )}
              </p>
            ) : (
              <>
                <p className="text-sm" style={{ color: "#14652A" }}>
                  {o.type === "meerdere-panden"
                    ? "Schrijft de definitieve mandagen/hoogwerker terug naar de gekoppelde panden."
                    : "Maakt een nieuwe opdracht aan met adres, voorrijkosten en aanpak/praktisch als voorbereiding voor Anton."}
                </p>
                <Knop klein onClick={zetOmNaarOpdracht}>Zet om naar opdracht</Knop>
              </>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Veld label="Offertenummer" value={o.offertenummer} onChange={(v) => wijzigOfferte(o.id, { offertenummer: v })} />
          <Veld label="Datum" type="date" value={o.datum} onChange={(v) => wijzigOfferte(o.id, { datum: v })} />
          <Veld label="Geldig (dagen)" type="number" value={o.geldigDagen} onChange={(v) => wijzigOfferte(o.id, { geldigDagen: v })} />
          <Veld label="Titel" value={o.titel} placeholder={o.type === "spoedopdracht" ? "bv. Verwijderen verfvlekken — Action Geldrop" : "bv. 9 panden · 0-beurt"}
            onChange={(v) => wijzigOfferte(o.id, { titel: v })} />
          <Veld breed label="Samenvatting (onder de titel)" value={o.samenvatting} onChange={(v) => wijzigOfferte(o.id, { samenvatting: v })} />
          <Veld label="Voor: naam" value={o.voorNaam} onChange={(v) => wijzigOfferte(o.id, { voorNaam: v })} />
          <Veld label="Voor: t.a.v." value={o.voorTav} onChange={(v) => wijzigOfferte(o.id, { voorTav: v })} />
          <Veld breed label="Voor: adres" value={o.voorAdres} onChange={(v) => wijzigOfferte(o.id, { voorAdres: v })} />
          <Veld breed label="Aanhef (volledige regel)" value={o.aanhef} placeholder="bv. Geachte heer Blauw, beste Udo," onChange={(v) => wijzigOfferte(o.id, { aanhef: v })} />
          <TekstVeld breed label="Inleiding" value={o.inleiding} onChange={(v) => wijzigOfferte(o.id, { inleiding: v })} />
        </div>
      </Kaart>

      {o.type === "meerdere-panden" ? (
        <>
          <Kaart>
            <h3 className="mb-3" style={{ fontFamily: "Fredoka", color: INK }}>Panden</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {pandenVanKlant.map((p) => {
                const aan = o.pandIds.includes(p.id);
                return (
                  <button key={p.id} onClick={() => pandTogglen(p.id)}
                    className="px-3 py-1.5 rounded-full text-xs transition"
                    style={aan ? { background: INK, color: "white" } : { background: "#F5EFF8", color: "#6B5B7B" }}>
                    {p.naam || "naamloos"}
                  </button>
                );
              })}
            </div>
            <Knop variant="wit" klein onClick={regelsOvernemen}>Regels overnemen ({o.pandIds.length} geselecteerd)</Knop>
            <p className="text-xs mt-2" style={{ color: "#8A7B98" }}>
              Neemt mandagen, hoogwerker en prijs over van de geselecteerde panden. Daarna een momentopname — een
              latere wijziging aan een pand past de regel hieronder niet met terugwerkende kracht aan, pas 'm
              handmatig aan als de prijs alsnog afwijkt.
            </p>
            {o.regels.length > 0 && (
              <div className="mt-4">
                {o.regels.map((r, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
                    <input value={r.naam} placeholder="pand" onChange={(e) => wijzigRegel(i, { naam: e.target.value })}
                      className="col-span-5 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
                    <input type="number" value={r.mandagen} placeholder="mandagen" onChange={(e) => wijzigRegel(i, { mandagen: e.target.value })}
                      className="col-span-2 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
                    <label className="col-span-2 flex items-center gap-1 text-xs" style={{ color: "#6B5B7B" }}>
                      <input type="checkbox" checked={r.hoogwerker} onChange={(e) => wijzigRegel(i, { hoogwerker: e.target.checked })} />
                      Hoogwerker
                    </label>
                    <input type="number" step="0.01" value={r.prijs} placeholder="prijs" onChange={(e) => wijzigRegel(i, { prijs: e.target.value })}
                      className="col-span-2 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
                    <button onClick={() => wegRegel(i)} className="col-span-1 flex justify-center"><Trash2 size={14} style={{ color: "#B9A9C4" }} /></button>
                  </div>
                ))}
                <p className="text-sm mt-2" style={{ color: INK }}>Totaal: {eur0(totaalMeerderePanden)} excl. btw</p>
              </div>
            )}
          </Kaart>
          <Kaart>
            <h3 className="mb-3" style={{ fontFamily: "Fredoka", color: INK }}>Tekst en opties</h3>
            <div className="grid grid-cols-1 gap-3">
              <TekstVeld breed label="Onze werkwijze" rijen={4} value={o.werkwijze} onChange={(v) => wijzigOfferte(o.id, { werkwijze: v })} />
              <TekstVeld breed label="Wat u van ons krijgt (één per regel)" rijen={4} value={o.watUKrijgt} onChange={(v) => wijzigOfferte(o.id, { watUKrijgt: v })} />
              <label className="flex items-center gap-2 text-sm" style={{ color: INK }}>
                <input type="checkbox" checked={o.onderhoudContract} onChange={(e) => wijzigOfferte(o.id, { onderhoudContract: e.target.checked })} />
                Optioneel onderhoudscontract tonen ({data.instellingen.onderhoudsPercentage ?? 60}% van de 0-beurt, {eur0(onderhoudTotaal)} per ronde)
              </label>
              <OptiesEditor opties={o.opties} onWijzig={wijzigOptie} onWeg={wegOptie} onToevoegen={voegOptieToe} />
            </div>
          </Kaart>
        </>
      ) : (
        <>
          <Kaart>
            <h3 className="mb-3" style={{ fontFamily: "Fredoka", color: INK }}>Situatie en aanpak</h3>
            <div className="grid grid-cols-1 gap-3">
              <TekstVeld breed label="De situatie (één punt per regel)" rijen={4} value={o.situatie} onChange={(v) => wijzigOfferte(o.id, { situatie: v })} />
              <TekstVeld breed label="Onze aanpak (één stap per regel)" rijen={5} value={o.aanpak} onChange={(v) => wijzigOfferte(o.id, { aanpak: v })} />
              <TekstVeld breed label="Waar wij rekening mee houden (één punt per regel)" rijen={4} value={o.risicos} onChange={(v) => wijzigOfferte(o.id, { risicos: v })} />
              <TekstVeld breed label="Praktisch (uitvoering, wat nodig van klant, facturatie...)" rijen={4} value={o.praktisch} onChange={(v) => wijzigOfferte(o.id, { praktisch: v })} />
            </div>
          </Kaart>
          <Kaart>
            <h3 className="mb-3" style={{ fontFamily: "Fredoka", color: INK }}>Prijs</h3>
            {o.prijsregels.map((x, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <input value={x.omschrijving} placeholder="omschrijving" onChange={(e) => wijzigPrijsregel(i, { omschrijving: e.target.value })}
                  className="col-span-8 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
                <input type="number" step="0.01" value={x.bedrag} placeholder="bedrag" onChange={(e) => wijzigPrijsregel(i, { bedrag: e.target.value })}
                  className="col-span-3 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "#E4DCEA", color: INK }} />
                <button onClick={() => wegPrijsregel(i)} className="col-span-1 flex justify-center"><Trash2 size={14} style={{ color: "#B9A9C4" }} /></button>
              </div>
            ))}
            <Knop variant="wit" klein onClick={voegPrijsregelToe}>
              <span className="flex items-center gap-1"><Plus size={13} /> Regel toevoegen</span>
            </Knop>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Veld label="Voorrijkosten" type="number" value={o.voorrijkosten} onChange={(v) => wijzigOfferte(o.id, { voorrijkosten: v })} />
              <Veld label="Toelichting bij voorrijkosten" value={o.voorrijkostenOmschrijving}
                placeholder="bv. Hoofddorp – Geldrop v.v., ca. 240 km, incl. reistijd en brandstof"
                onChange={(v) => wijzigOfferte(o.id, { voorrijkostenOmschrijving: v })} />
            </div>
            <p className="text-sm mt-2" style={{ color: INK }}>Totaal: {eur0(totaalSpoedopdracht)} excl. btw</p>
          </Kaart>
          <Kaart>
            <h3 className="mb-3" style={{ fontFamily: "Fredoka", color: INK }}>Opties</h3>
            <OptiesEditor opties={o.opties} onWijzig={wijzigOptie} onWeg={wegOptie} onToevoegen={voegOptieToe} />
          </Kaart>
        </>
      )}

      <Kaart>
        <TekstVeld breed label="Voorwaarden (één per regel; {geldigDagen} wordt vervangen)" rijen={5} value={o.voorwaarden}
          onChange={(v) => wijzigOfferte(o.id, { voorwaarden: v })} />
      </Kaart>

      {/* Gerenderde offerte, printbaar */}
      <Kaart>
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} style={{ color: ROZE }} />
          <h3 style={{ fontFamily: "Fredoka", color: INK }}>Offerte-document</h3>
          <span className="ml-auto">
            <Knop variant="wit" klein onClick={() => setPrintActief(true)}>Print / opslaan als pdf</Knop>
          </span>
        </div>
        <OfferteDocument o={o} k={k} data={data} nrs={nrs}
          totaalMeerderePanden={totaalMeerderePanden} onderhoudTotaal={onderhoudTotaal} totaalSpoedopdracht={totaalSpoedopdracht} />
      </Kaart>
      <PrintPortaal actief={printActief}>
        <OfferteDocument o={o} k={k} data={data} nrs={nrs}
          totaalMeerderePanden={totaalMeerderePanden} onderhoudTotaal={onderhoudTotaal} totaalSpoedopdracht={totaalSpoedopdracht} />
      </PrintPortaal>

      <Knop variant="wit" onClick={() => {
        bewaar({ ...data, offertes: data.offertes.filter((x) => x.id !== o.id) });
        setScherm({ naam: "offertes" });
      }}>
        <span className="flex items-center gap-1" style={{ color: "#8A7B98" }}><Trash2 size={13} /> Offerte verwijderen</span>
      </Knop>
    </div>
  );
}

// =================== EXPORT ===================
function ExportScherm({ data, bewaar, gekopieerd, kopieer }) {
  const regels = [["Klant", "Pand", "Datum", "Soort", "Aantal", "Eenheid", "Omschrijving"]];
  data.panden.forEach((p) => {
    const kn = klantVan(data, p)?.naam || "";
    p.uren.forEach((u) => regels.push([kn, p.naam, u.datum, "uren", u.uren, "uur", u.omschrijving]));
    if (num(p.werkelijkeMandagen) > 0) regels.push([kn, p.naam, "", "werkelijk", p.werkelijkeMandagen, p.werkelijkeEenheid === "uur" ? "uur" : "dag", ""]);
    p.ritten.forEach((r) => regels.push([kn, p.naam, r.datum, r.type === "prive" ? "km privé" : "km zakelijk", r.km, "km", r.doel]));
    p.verbruik.forEach((v) => regels.push([kn, p.naam, "", "verbruik", v.aantal, "stuks", v.omschrijving + " à " + eur(v.prijs)]));
  });
  const csv = regels.map((r) => r.map((c) => '"' + String(c ?? "").replace(/"/g, '""') + '"').join(";")).join("\n");
  const totKm = data.panden.reduce((s, p) => s + cijfers(data, p).kmZakelijk, 0);

  // Backup: de hele state als downloadbaar JSON-bestand. Enige vangnet tegen
  // een verdwenen/losgekoppelde Blob-store (zoals begin augustus 2026) — geen
  // automatische herstelknop, gewoon een bestand dat je zelf ergens bewaart en
  // er bij een volgend probleem handmatig weer in kunt zetten (kopiëren in
  // /api/data via de browser-devtools, of vraag het na te zetten).
  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gumclean-registratie-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <Kaart>
        <div className="flex items-center gap-2 mb-1">
          <h3 style={{ fontFamily: "Fredoka", color: INK }}>Backup</h3>
          <span className="ml-auto">
            <Knop variant="wit" klein onClick={downloadBackup}>Backup downloaden</Knop>
          </span>
        </div>
        <p className="text-sm" style={{ color: "#6B5B7B" }}>
          Downloadt de hele huidige stand (klanten, panden, offertes, instellingen) als één JSON-bestand. Doe dit af
          en toe, en zeker vóór je iets groots wijzigt — de server-opslag (Vercel Blob) bleek begin augustus 2026
          zomaar verdwenen te zijn, zonder waarschuwing. Dit bestand is je enige weg terug als dat weer gebeurt.
        </p>
      </Kaart>
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
        </div>
        <p className="text-xs mt-2" style={{ color: "#8A7B98" }}>
          Uurloon (rekenprijs arbeid) staat per klant, bij Klantgegevens — verschilt niet per instelling maar per klant.
        </p>
      </Kaart>
      <Kaart>
        <h3 className="mb-1" style={{ fontFamily: "Fredoka", color: INK }}>Planning</h3>
        <p className="text-xs mb-3" style={{ color: "#8A7B98" }}>
          Voor de "verwacht klaar op"-datum per opdracht. Anton werkt in principe vanaf 08:30 met 30 minuten
          pauze — dat verandert de 8 werkbare uren niet, dus telt hier niet apart mee. Alleen maandag t/m
          vrijdag geldt als werkdag.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Veld label="Werkbare uren per dag" type="number" value={data.instellingen.werkurenPerDag ?? 8}
            onChange={(v) => bewaar({ ...data, instellingen: { ...data.instellingen, werkurenPerDag: v } })} />
          <Veld label="Gemiddelde reissnelheid (km/h)" type="number" value={data.instellingen.reissnelheid ?? 80}
            onChange={(v) => bewaar({ ...data, instellingen: { ...data.instellingen, reissnelheid: v } })} />
          <Veld label="Onderhoudsbeurt: % van het werk van een 0-beurt" type="number"
            value={data.instellingen.onderhoudsPercentage ?? 60}
            onChange={(v) => bewaar({ ...data, instellingen: { ...data.instellingen, onderhoudsPercentage: v } })} />
        </div>
      </Kaart>
      <Kaart>
        <h3 className="mb-1" style={{ fontFamily: "Fredoka", color: INK }}>Reserveringen</h3>
        <p className="text-xs mb-3" style={{ color: "#8A7B98" }}>
          Interne buffers, geen kostenpost — worden nooit doorgegeven aan de klant of de boekhouding.
          Alle bedragen ex btw. AOV, pensioen, weer/winter, investering en btw als percentage van de omzet;
          belasting als percentage van de winst (resultaat). Vuistregels, geen offertes — check de echte
          bedragen bij boekhouder/verzekeraar.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Veld label="Btw-percentage van omzet" type="number" value={data.instellingen.btwPercentage ?? 21}
            onChange={(v) => bewaar({ ...data, instellingen: { ...data.instellingen, btwPercentage: v } })} />
          <Veld label="Belasting (IB/Zvw) % van winst" type="number" value={data.instellingen.reserveringBelasting ?? 0}
            onChange={(v) => bewaar({ ...data, instellingen: { ...data.instellingen, reserveringBelasting: v } })} />
          <Veld label="AOV % van omzet" type="number" value={data.instellingen.reserveringAov ?? 0}
            onChange={(v) => bewaar({ ...data, instellingen: { ...data.instellingen, reserveringAov: v } })} />
          <Veld label="Pensioen % van omzet" type="number" value={data.instellingen.reserveringPensioen ?? 0}
            onChange={(v) => bewaar({ ...data, instellingen: { ...data.instellingen, reserveringPensioen: v } })} />
          <Veld label="Weer/winter % van omzet" type="number" value={data.instellingen.reserveringWeer ?? 0}
            onChange={(v) => bewaar({ ...data, instellingen: { ...data.instellingen, reserveringWeer: v } })} />
          <Veld label="Investering (tools/bus) % van omzet" type="number" value={data.instellingen.reserveringInvestering ?? 0}
            onChange={(v) => bewaar({ ...data, instellingen: { ...data.instellingen, reserveringInvestering: v } })} />
        </div>
      </Kaart>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [scherm, setScherm] = useState({ naam: "overzicht" });
  const [bezig, setBezig] = useState(true);
  const [gekopieerd, setGekopieerd] = useState("");
  // Of de laatste keer laden/opslaan écht via /api/data ging, of stilzwijgend
  // op localStorage terugviel. Die terugval bestond al (handig lokaal zonder
  // vercel dev) maar was onzichtbaar — een storing in de Blob-store (zoals
  // begin augustus 2026, de store bleek verdwenen) merkte je daardoor pas op
  // toen foto's leeg bleven, dagen later. Zie ook het "Backup"-blok in Export.
  const [serverVerbonden, setServerVerbonden] = useState(true);

  // offertes bestond niet in eerder opgeslagen data — hier aanvullen zodat de
  // rest van de app altijd een array mag verwachten.
  const metDefaults = (d) => ({ offertes: [], ...d });

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/data");
        if (!r.ok) throw new Error("api niet beschikbaar");
        const json = await r.json();
        setData(json ? metDefaults(json) : START());
        setServerVerbonden(true);
      } catch {
        setServerVerbonden(false);
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          setData(raw ? metDefaults(JSON.parse(raw)) : START());
        } catch { setData(START()); }
      }
      setBezig(false);
    })();
  }, []);

  const bewaar = async (nieuw) => {
    setData(nieuw);
    try {
      const r = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nieuw),
      });
      if (!r.ok) throw new Error("opslaan mislukt");
      setServerVerbonden(true);
    } catch {
      setServerVerbonden(false);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nieuw)); } catch { /* blijft in geheugen */ }
    }
  };

  const wijzigPand = (id, patch) =>
    bewaar({ ...data, panden: data.panden.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const wijzigKlant = (id, patch) =>
    bewaar({ ...data, klanten: data.klanten.map((k) => (k.id === id ? { ...k, ...patch } : k)) });
  const wijzigOfferte = (id, patch) =>
    bewaar({ ...data, offertes: data.offertes.map((o) => (o.id === id ? { ...o, ...patch } : o)) });

  const kopieer = (tekst, id) => {
    navigator.clipboard?.writeText(tekst);
    setGekopieerd(id);
    setTimeout(() => setGekopieerd(""), 1600);
  };

  if (bezig || !data) return <div className="p-8 text-sm" style={{ color: INK }}>Bezig met laden…</div>;

  const titel = scherm.naam === "pand"
    ? data.panden.find((p) => p.id === scherm.id)?.naam || "Opdracht"
    : scherm.naam === "klant" ? data.klanten.find((k) => k.id === scherm.id)?.naam || "Klant"
    : scherm.naam === "export" ? "Export"
    : scherm.naam === "offertes" ? "Offertes"
    : scherm.naam === "offerte" ? (data.offertes.find((o) => o.id === scherm.id)?.offertenummer || "Offerte")
    : "Opdrachten";
  const terug = scherm.naam === "offerte" ? "offertes" : "overzicht";

  return (
    <div className="min-h-screen p-6" style={{ background: PAPIER, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="max-w-4xl mx-auto">
        {!serverVerbonden && (
          <div className="mb-4 p-3 rounded-xl text-sm flex items-center gap-2"
            style={{ background: "#FFE8F3", color: "#8C1D4F", border: "1px solid #FFD0E5" }}>
            <AlertTriangle size={16} className="shrink-0" />
            Niet verbonden met de server — wijzigingen blijven nu alleen in deze browser bewaard, niet gedeeld met
            andere apparaten. Ververs de pagina om het opnieuw te proberen; maak zo nodig een backup (Export).
          </div>
        )}
        <header className="flex items-center gap-3 mb-6 flex-wrap">
          {scherm.naam !== "overzicht" && (
            <button onClick={() => setScherm({ naam: terug })}
              className="p-2 rounded-lg shrink-0" style={{ background: "white", border: "1px solid #EDE6F2" }}>
              <ChevronLeft size={16} style={{ color: INK }} />
            </button>
          )}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="w-7 h-7 rounded-full inline-block shrink-0" style={{ background: ROZE }} />
            <span className="text-xl truncate min-w-0" style={{ fontFamily: "Fredoka", color: INK }}>{titel}</span>
          </div>
          <div className="flex gap-2 shrink-0">
            <Knop variant={scherm.naam === "overzicht" ? "geel" : "wit"} klein onClick={() => setScherm({ naam: "overzicht" })}>
              <span className="flex items-center gap-1"><Truck size={13} /> <span className="hidden sm:inline">Opdrachten</span></span>
            </Knop>
            <Knop variant={scherm.naam === "offertes" || scherm.naam === "offerte" ? "geel" : "wit"} klein onClick={() => setScherm({ naam: "offertes" })}>
              <span className="flex items-center gap-1"><FileText size={13} /> <span className="hidden sm:inline">Offertes</span></span>
            </Knop>
            <Knop variant={scherm.naam === "export" ? "geel" : "wit"} klein onClick={() => setScherm({ naam: "export" })}>
              <span className="flex items-center gap-1"><Settings size={13} /> <span className="hidden sm:inline">Export</span></span>
            </Knop>
          </div>
        </header>

        {scherm.naam === "overzicht" && <Overzicht data={data} setScherm={setScherm} bewaar={bewaar} />}
        {scherm.naam === "klant" && <KlantScherm id={scherm.id} data={data} wijzigKlant={wijzigKlant} />}
        {scherm.naam === "pand" && (
          <PandScherm id={scherm.id} data={data} wijzigPand={wijzigPand} bewaar={bewaar}
            setScherm={setScherm} gekopieerd={gekopieerd} kopieer={kopieer} />
        )}
        {scherm.naam === "offertes" && <OffertesScherm data={data} bewaar={bewaar} setScherm={setScherm} />}
        {scherm.naam === "offerte" && (
          <OfferteScherm id={scherm.id} data={data} wijzigOfferte={wijzigOfferte} bewaar={bewaar} setScherm={setScherm} />
        )}
        {scherm.naam === "export" && <ExportScherm data={data} bewaar={bewaar} gekopieerd={gekopieerd} kopieer={kopieer} />}
      </div>
    </div>
  );
}
