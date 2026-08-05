# GumClean registratietool

Registratie van klanten, opdrachten en nacalculatie voor GumClean
(buitenreiniging, Hoofddorp). Eén React-component, draait op Vercel.

Lees eerst `DESTINATION-registratietool.md` — daar staan de gemaakte keuzes en
waarom. Dit bestand beschrijft alleen hoe de code in elkaar zit.

## Live

https://gumclean-registratietool.vercel.app/ — achter een wachtwoordpoort
(HTTP Basic Auth, gebruikersnaam maakt niet uit). Wachtwoord staat als
`REGISTRATIE_GATE_PASSWORD` in de Vercel-projectinstellingen
(bas-projects-c4d9b250/gumclean-registratietool) en in de wachtwoordmanager.

Opnieuw deployen na een wijziging:

```
cd app
vercel deploy --prod
```

## Lokaal draaien

```
cd app
npm install
npm run dev
```

Opent op http://localhost:5173/. Dit draait zonder de `/api`-laag (alleen
`vite dev`, geen serverless functions), dus valt automatisch terug op
`localStorage` in de browser — handig om snel aan de UI te sleutelen zonder de
live data te raken. Wil je de echte opslag ook lokaal testen: `vercel dev`
in plaats van `npm run dev` (na `vercel env pull` voor de env vars).

`npm run build` zet een production build in `app/dist`.

## Bestanden

- `gumclean-werkbon.jsx` — het originele artifact-bestand (Claude, met
  `window.storage`). Blijft staan als referentie/fallback voor in een
  Claude-artifact.
- `app/` — het Vite-project dat op Vercel draait.
  - `src/App.jsx` — dezelfde component, geport naar de `/api/data`-laag i.p.v.
    `window.storage`.
  - `middleware.js` — de wachtwoordpoort (HTTP Basic Auth), draait vóór elke
    request. Zelfde patroon als de poort op de hoofdsite
    (`SITE_GATE_PASSWORD`), maar dan met Vercel Routing Middleware in plaats
    van een Next.js proxy, en een eigen env var omdat het een apart project
    is. Zonder `REGISTRATIE_GATE_PASSWORD` staat de poort open (bijv. lokaal).
  - `api/data.js` — GET/POST van de hele state als één JSON-blob in Vercel
    Blob (private store, niet publiek benaderbaar). Checkt de wachtwoordpoort
    nogmaals zelf, naast de middleware — Vercel raadt dat expliciet aan voor
    private blobs.
  - `lib/auth.js` — gedeelde wachtwoordcheck voor middleware en API.

Wijzigingen aan de component maak je voortaan in `app/src/App.jsx`.

**Schermcomponenten (`Overzicht`, `KlantScherm`, `PandScherm`, `ExportScherm`)
staan op module-niveau, niet genest in `App()`.** Ooit stonden ze binnen
`App()` — dat gaf op elke toetsaanslag een volledige remount van het scherm
(React zag een "nieuw" componenttype omdat de functie opnieuw werd aangemaakt
bij elke render), met als zichtbaar gevolg dat de pagina tijdens typen naar
beneden sprong en de focus kwijtraakte. Nieuwe schermen dus altijd op
module-niveau toevoegen, met `data` en de wijzigfuncties als props — nooit als
functie-binnen-`App()`.

## Opslag

Eén Blob-bestand, `gumclean-registratie-v1.json`, in een private Vercel Blob
store (`gumclean-registratietool-data`) gekoppeld aan het project. De hele
state staat als JSON in dat ene bestand — bewust, want elke losse call kost
een round trip en de dataset is klein. Vervangt de vorige `localStorage`-versie
(en daarvoor `window.storage` in de artifact-versie): nu deelt elk apparaat
dezelfde data via de server, in plaats van los per browser.

```js
GET  /api/data   -> hele state als JSON (of null als er nog niets is)
POST /api/data   -> hele state als JSON body, overschrijft het bestand
```

Geen database (Supabase/Postgres) nodig — Blob is voldoende voor één simpel
JSON-bestand en zit in de gratis Vercel-laag. Als de dataset ooit query's,
concurrent schrijven door meerdere gebruikers, of relaties nodig heeft, is dat
het moment om alsnog naar een database te kijken (zie hieronder).

De frontend valt terug op `localStorage` als `/api/data` niet bereikbaar is
(bijv. bij `npm run dev` zonder `vercel dev`) — zie `bewaar()` in `App.jsx`.

## Datamodel

```
instellingen   thuisadres, dieselprijs, verbruik (l/100km), btwPercentage,
               reserveringAov, reserveringPensioen, reserveringWeer,
               reserveringInvestering (alle vier % van omzet),
               reserveringBelasting (% van winst)
klant          naam, contactpersoon, kvk, dagtarief, uurloon, betaaltermijn
  └ route      naam, tenaamstelling, adres, btw, email, notitie
pand           klantId, routeId, naam, adres, filiaalnummer, grootboek,
               begrootMandagen, begrootEenheid (dag|uur), voorrijkosten,
               werkelijkeMandagen, werkelijkeEenheid (dag|uur), afstandEnkel,
               hoogwerker, doorbelast
  ├ uren       datum, uren, omschrijving
  ├ ritten     datum, km, type (zakelijk|prive), doel
  ├ materieel  array van labels
  └ verbruik   omschrijving, aantal, prijs
```

Twee verschillende tarieven, niet te verwarren:

- **Dagtarief** (`k.dagtarief`, standaard € 540) — verkoop, wat aan de klant
  wordt gefactureerd per mandag. Bij een offerte in uren wordt dit prorata
  (÷ 8) gebruikt als verkooptarief per uur, dus € 67,50.
- **Uurloon** (`k.uurloon`, standaard € 25) — inkoop/kostprijs, wat Antons uur
  de zaak "kost" als rekenprijs in de nacalculatie (`arbeid`-regel). Gaat nooit
  naar de klant of de boekhouding, zie DESTINATION-registratietool.md.

Staan allebei per klant, net als dagtarief — verschillen per klant, dus geen
zinvolle globale instelling.

`begrootMandagen` + `begrootEenheid` is de afgesproken offerte, in mandagen à
dagtarief óf in uren à dagtarief/8 (prorata) — sommige klussen worden per uur
afgesproken in plaats van per mandag. `voorrijkosten` is een los, vast bedrag
bovenop die offerte (bijv. een aparte voorrijkostenafspraak), telt mee in de
omzet maar niet in het uur-/dagtarief.

`werkelijkeMandagen` + `werkelijkeEenheid` op het pand is een snelkoppeling
naast de urenlijst: vul óf losse uren in (`uren`), óf in één keer het aantal
werkelijk gewerkte dagen/uren — niet allebei. `cijfers()` gebruikt de urenlijst
als die iets bevat, anders `werkelijkeMandagen` omgerekend naar uren.

Panden staan plat in `data.panden` met een `klantId`, niet genest onder de
klant. Dat maakt filteren en optellen over alle klanten heen makkelijker.

## De twee functies die ertoe doen

**`controle(data, pand)`** geeft de go/no-go terug: een lijst punten met
`{v, t}` waarbij `v` de check is en `t` het label dat de gebruiker ziet. Een
nieuw vereist veld voeg je hier toe, nergens anders — de UI leest dit
rechtstreeks.

**`cijfers(data, pand)`** rekent alles door. De volgorde is bewust:

```
omzet      = (begrootMandagen × dagtarief, of × dagtarief/8 als uren) + voorrijkosten
reiskosten = zakelijke km × 0,25
marge      = omzet − reiskosten − verbruik      ← fiscaal relevant
arbeid     = effectieve uren × uurloon           ← rekenprijs, geen kostenpost
             (effectieve uren = uren, of anders werkelijkeMandagen × 8)
resultaat  = marge − arbeid                      ← stuurgetal, al gebaseerd op omzet ex btw
reserveringAov/        = omzet × betreffend percentage      ← vuistregel, geen offerte
 pensioen/weer/
 investering
reserveringBelasting   = max(0, resultaat) × belastingPercentage  ← % van de winst, niet van omzet
nettoBeschikbaar       = resultaat − (aov + pensioen + weer + investering + belasting)

omzetInclBtw = omzet + (omzet × btwPercentage)   ← puur informatief, telt niet mee in resultaat/nettoBeschikbaar
```

Reserveringen zijn, net als `uurloon`, interne rekenprijzen — ze gaan nooit naar de
klant of de boekhouding. AOV, pensioen, weer/winterbuffer en investering
(gereedschap/bedrijfsauto Anton) zijn een percentage van de omzet; de
belastingreservering (inkomstenbelasting + Zvw) is een percentage van de winst
(`resultaat`, met een bodem op 0 — geen belastingreservering bij een pand dat
verlies draait). Staan als instelling (`data.instellingen`), niet per klant, want
het zijn bedrijfsbrede percentages.

**Btw telt niet mee in `nettoBeschikbaar`.** `omzet` is overal al ex btw — de btw die
er bovenop binnenkomt zat dus nooit in `resultaat`, en hem dan bij de reserveringen
nóg een keer aftrekken zou 'm dubbel tellen. `omzetInclBtw` en de bijbehorende
btw-reservering staan er alleen ter info bij Opbrengst (hoeveel van het bedrag dat
binnenkomt niet van jou is), en tellen niet mee in het rekensommetje naar
`nettoBeschikbaar`.

`KM_TARIEF` staat als constante bovenaan (€ 0,25, tarief 2026). Bij een
tariefwijziging alleen daar aanpassen. Let op: historische ritten worden dan
met terugwerkende kracht anders gerekend — bij een volgend belastingjaar het
tarief per jaar opslaan in plaats van als constante.

Hoogwerkerhuur (`doorbelast`) loopt buiten de marge om: één op één doorbelast
aan de klant, dus per saldo nul.

## Startdata

`START()` vult Action met beide factuurroutes en de tien panden uit offerte
2026-002. De vastgoedroute is bewust incompleet gelaten — de tenaamstelling is
echt nog onbekend, en zo demonstreert de tool meteen waar hij voor is.

Afstanden zijn schattingen vanaf Manenburgdreef 93. Corrigeren zodra Anton er
geweest is.

## Als dit naar een echte webapp gaat

Trigger: Anton moet zelf invoeren. Dan:

1. Supabase-project met tabellen die het model hierboven volgen.
2. Row-level security op gebruiker; Anton krijgt schrijfrechten op uren en
   ritten, leesrechten op panden, geen toegang tot tarieven en marges.
3. Login toevoegen (nu is er alleen de gedeelde wachtwoordpoort).
4. `api/data.js` vervangen door Supabase-queries. De rest van de component
   kan blijven — state en berekeningen zijn niet aan de opslag gekoppeld.

Doe dit niet eerder. De tool moet eerst een maand echt gebruikt zijn.

## Wat je niet moet doen

- De rekenprijs van € 25 per uur in de boekhouding opnemen. Anton is de
  eenmanszaak; hij declareert niet bij zichzelf.
- Brandstofkosten als aftrekpost naast het kilometertarief zetten. Dubbelop.
- Factureren vanuit deze tool. Dat blijft Jortt.
