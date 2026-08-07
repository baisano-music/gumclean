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
    is. Zonder `REGISTRATIE_GATE_PASSWORD` staat de poort open (bijv. lokaal) —
    behalve op Vercel-productie (`VERCEL_ENV === "production"`), daar blijft de
    poort dicht als de env var ooit per ongeluk ontbreekt. Wachtwoord staat als
    vaste-tijd-vergelijking, geen `===`, om timing-aanvallen op het wachtwoord
    onmogelijk te maken (zie `lib/auth.js`).
  - `api/data.js` — GET/POST van de hele state als één JSON-blob in Vercel
    Blob (private store, niet publiek benaderbaar). Checkt de wachtwoordpoort
    nogmaals zelf, naast de middleware — Vercel raadt dat expliciet aan voor
    private blobs.
  - `api/fotos.js` — GET/POST/DELETE van voor-/na-foto's, ook private Blob,
    zelfde wachtwoordcheck. Zie "Foto's" hieronder.
  - `lib/auth.js` — gedeelde wachtwoordcheck voor middleware en API.
  - `public/logo.png` — GumClean-woordmerk, gebruikt in het opleverrapport.

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

### Sync-status en backup

Begin augustus 2026 bleek de Vercel Blob store zonder waarschuwing volledig
leeg (0 bestanden) — zowel foto's als de opgeslagen state waren weg. Omdat de
`localStorage`-fallback hierboven stil en onzichtbaar is, viel dat pas na een
tijd op. Twee vangnetten daartegen, beide in `App.jsx`:

- **Sync-statusbanner** — `serverVerbonden` state, gezet op basis van of de
  laatste `/api/data` GET/POST is gelukt. Bij falen verschijnt een banner
  bovenaan de app: wijzigingen blijven dan alleen lokaal in de browser staan,
  niet gedeeld met andere apparaten.
- **Backup-download** — knop "Backup downloaden" in het Export-scherm
  (`downloadBackup` in `ExportScherm`), zet de hele `data`-state om naar een
  gedateerd `.json`-bestand voor handmatige download. Geen automatisch
  herstel — bij een volgende Blob-uitval is dit bestand de enige weg terug
  (handmatig terugzetten via de browser-devtools of een nieuwe `POST
  /api/data`).

Geen database toegevoegd naar aanleiding van dit incident — lost de
onderliggende faalmodus (stille fallback, geen zichtbaarheid) niet op en is
buiten proportie voor deze schaal. Zie "Als dit naar een echte webapp gaat"
hieronder voor wanneer dat wél de moeite waard wordt.

## Datamodel

```
instellingen   thuisadres, dieselprijs, verbruik (l/100km), btwPercentage,
               reserveringAov, reserveringPensioen, reserveringWeer,
               reserveringInvestering (alle vier % van omzet),
               reserveringBelasting (% van winst),
               werkurenPerDag (standaard 8), reissnelheid (km/h, standaard 80),
               onderhoudsPercentage (standaard 60)
klant          naam, contactpersoon, kvk, dagtarief, uurloon, betaaltermijn
  └ route      naam, tenaamstelling, tav, adres, btw, email, notitie
pand           klantId, routeId, naam, adres, filiaalnummer, grootboek,
               soortWerk (standaard "Groot onderhoud"), werkzaamheden,
               diensten (array: Gevelreiniging, Terreinreiniging (stoep),
               Winkelpui/ramen reinigen, Graffitiverwijdering),
               onderhoudsintervalMaanden,
               begrootMandagen, begrootEenheid (dag|uur), factureerWerkelijkeUren, voorrijkosten,
               werkelijkeMandagen, werkelijkeEenheid (dag|uur), afstandEnkel,
               hoogwerker, doorbelast, startdatum, reispatroon (dagelijks|overnachten),
               contactpersoonTerPlaatse, telefoonTerPlaatse, instructies,
               voorOmschrijving, afgerondOp,
               opleverrapportVergrendeld, opleverrapportSnapshot (zie
               "Werkbeschrijving en opleverrapport" hieronder)
  ├ uren       datum, uren, omschrijving
  ├ ritten     datum, km, type (zakelijk|prive), doel
  ├ materieel  array van labels
  ├ geoffreerdeKosten    { omschrijving, bedrag } — zat al in de offerte
  │                        (materiaal en verbruik, gehuurde apparatuur...),
  │                        bedrag telt mee in omzet
  ├ extraWerkzaamheden  { omschrijving, bedrag } — buiten de offerte gedaan
  │                        (graffiti, grofvuil...), bedrag telt mee in omzet
  ├ voorFotos  { id, pathname, omschrijving, dienst } — foto's van Udo, wat er
  │              moet gebeuren; dienst (optioneel, één van p.diensten, "" =
  │              algemeen) groepeert de foto in het opleverrapport
  ├ naFotos    { id, pathname, omschrijving, voorFotoId, dienst } — opgeleverde
  │              foto's; voorFotoId koppelt 'm expliciet aan een
  │              voorFotos-item, dienst zoals hierboven
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

`factureerWerkelijkeUren` (alleen relevant bij `begrootEenheid: "uur"`) schakelt
de omzetberekening om van de begrote uren naar de werkelijk gewerkte uren
(`effectieveUren`, incl. reistijd/pauze — uit `p.uren`). Staat standaard aan
voor een pand dat via "Zet om naar opdracht" uit een spoedopdracht-offerte is
ontstaan; voor elk ander pand met uren-eenheid is het een losse checkbox. Zie
"Opbrengst rekent met begrote mandagen, niet met werkelijke" in
DESTINATION-registratietool.md voor waarom dit niet de standaard is.

`werkelijkeMandagen` + `werkelijkeEenheid` op het pand is een snelkoppeling
naast de urenlijst: vul óf losse uren in (`uren`), óf in één keer het aantal
werkelijk gewerkte dagen/uren — niet allebei. `cijfers()` gebruikt de urenlijst
als die iets bevat, anders `werkelijkeMandagen` omgerekend naar uren.

De factuurregels (`factuurtekst` in `PandScherm`) bevatten de vermeldingen die
Action vraagt: pandadres, grootboek, soort werk en de uitgevoerde
werkzaamheden, met de klantcontactpersoon als "Opdrachtgever". `soortWerk`
staat standaard op "Groot onderhoud" (Actions eigen classificatie voor
gevelreiniging) maar is per pand aanpasbaar voor werk dat daar niet onder valt
(bijv. graffitiverwijdering). `grootboek` staat voor Action's panden standaard
op "Omzet Gevelreiniging" (`START()`); nieuwe panden of andere klanten vullen
dit zelf in.

Panden staan plat in `data.panden` met een `klantId`, niet genest onder de
klant. Dat maakt filteren en optellen over alle klanten heen makkelijker.

## De twee functies die ertoe doen

**`controle(data, pand)`** geeft de go/no-go terug: een lijst punten met
`{v, t}` waarbij `v` de check is en `t` het label dat de gebruiker ziet. Een
nieuw vereist veld voeg je hier toe, nergens anders — de UI leest dit
rechtstreeks.

**`cijfers(data, pand)`** rekent alles door. De volgorde is bewust:

```
omzet      = (gefactureerdeUren × dagtarief, of × dagtarief/8 als uren) + voorrijkosten
             + extraOmzet (som van geoffreerdeKosten[].bedrag + extraWerkzaamheden[].bedrag —
               resp. kosten die al in de offerte zaten, en werk/kosten daarbuiten)
             gefactureerdeUren = begrootMandagen, tenzij factureerWerkelijkeUren aanstaat
             (alleen bij uren-eenheid) — dan effectieveUren (spoedklus, geen aangenomen werk)
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

**Onderhoudsbeurt** (ook in `cijfers()`, een schatting voor het vervolgvoorstel
na een 0-beurt):

```
onderhoudMandagen  = begroteMandagen × onderhoudsPercentage       ← standaard 60%
onderhoudOmzet     = omzetBasis × onderhoudsPercentage + voorrijkosten
                                                          ← reiskosten/voorrijkosten blijven vol,
                                                            nieuwe rit, geen minder werk daaraan
onderhoudBeurtenPerJaar = 12 / onderhoudsintervalMaanden
onderhoudOmzetPerJaar   = onderhoudOmzet × onderhoudBeurtenPerJaar
```

`diensten` (welke van gevelreiniging/terreinreiniging/ramen/graffiti de
0-beurt omvatte) is puur informatief — telt niet mee in een berekening, staat
op het pand voor bij het opstellen van een vervolgvoorstel. Het gros van de
huidige opdrachten is een combinatie van gevelreiniging, terreinreiniging en
ramen in één 0-beurt (zie `START()`).

**Planning** (ook in `cijfers()`, voor Anton's inplanning):

```
totaleWerkurenNodig  = begroteMandagen × 8
reistijdEnkeleReis   = afstandEnkel / reissnelheid                ← uren, reissnelheid standaard 80 km/h

dagelijks (forenzen):
  effectieveUrenPerDag = werkurenPerDag − 2 × reistijdEnkeleReis   ← heen+terug elke werkdag
  werkdagenNodig       = totaleWerkurenNodig ÷ effectieveUrenPerDag, naar boven afgerond

overnachten (blijft in de buurt):
  werkdagenNodig = (totaleWerkurenNodig + 2 × reistijdEnkeleReis) ÷ werkurenPerDag, naar boven afgerond
                                                                     ← reis telt maar 1× voor de hele klus

verwachteEinddatum = startdatum + werkdagenNodig werkdagen (ma–vr, weekend overgeslagen)
```

`reispatroon` (`dagelijks` | `overnachten`) staat per pand, want dat verschilt
per klus — dichtbij forenst Anton, ver weg blijft hij soms in de buurt. Anton's
starttijd (08:30) en pauze (30 min) veranderen de 8 werkbare uren niet en
worden dus niet apart doorgerekend — ze bepalen alleen hóe laat die 8 uur
vallen, niet hoeveel het er zijn. `werkurenPerDag` en `reissnelheid` zijn
instellingen, aanpasbaar bij Export → Planning. Vuistregel, geen exacte
routeplanning — zie ook de bestaande beslissing om kilometers uit een vaste
tabel te halen in plaats van een live routeplanner.

`loopAchter` (ook in `cijfers()`) is `true` als er een `verwachteEinddatum` is
(dus een bekende `startdatum`), het pand niet handmatig is afgerond
(`p.afgerondOp` leeg) én vandaag al voorbij die verwachte einddatum ligt. Een
afgerond pand loopt nooit achter, ongeacht de datum. Overzicht toont dit als
een geel "Loopt achter"-badge op de pandregel, plus een telling in de
klant-footer als er panden van die klant achterlopen.

## Foto's

Voor- en na-foto's staan private in dezelfde Vercel Blob store als `data.js`,
onder `foto/{pandId}/{voor|na}/{uuid}.jpg` — nooit publiek, alleen te bekijken
via `/api/fotos?pad=...` (checkt de wachtwoordpoort net als `api/data.js`).
`<img src="/api/fotos?pad=...">` werkt zonder extra JS-gedoe met blob-URL's,
omdat de browser de Basic Auth-credentials die al voor de pagina zijn
ingevoerd automatisch meestuurt bij het laden van de afbeelding.

Foto's worden in de browser verkleind en gecomprimeerd vóór upload
(`comprimeerAfbeelding()` in `App.jsx`, max 1600px, JPEG kwaliteit 0,8) — een
telefoonfoto is al snel 5-10 MB, en dat hoeft niemand ongewijzigd in Blob-
opslag te zetten.

**Werkt niet met `npm run dev`.** Net als `/api/data` heeft `/api/fotos` de
`/api`-laag nodig — lokaal alleen bereikbaar via `vercel dev` (na
`vercel env pull` voor de Blob-token). Onder gewone `npm run dev` faalt de
upload stil (geen `/api`-fallback voor foto's, in tegenstelling tot de
JSON-data die op `localStorage` terugvalt).

**Voor/na-koppeling is expliciet, niet op uploadvolgorde.** Eerste versie
paarde `voorFotos[i]` met `naFotos[i]` puur op array-index — leek te werken
bij het testen, maar viel in de praktijk plat: Anton stuurt vrijwel altijd
meer (of andere) na-foto's dan Udo voor-foto's stuurde, dus na een paar
foto's stonden willekeurige combinaties naast elkaar in het opleverrapport.
Elke na-foto heeft nu een `voorFotoId`; `OpleverrapportDocument` groepeert op
basis daarvan: gekoppelde paren eerst, dan losse voor-foto's zonder match,
dan losse na-foto's zonder match — nooit een lege "voor"-cel naast een foto
die er niet bij hoort.

**Koppelen gaat via `FotoKoppelen` (klikken of slepen), niet via een
dropdown.** Eerste versie van de koppeling was een `<select>` met
tekstlabels ("Hoort bij: gevel noordkant") onder elke na-foto — werkte, maar
voelde onhandig: om te zien welke voor-foto bij welke tekst hoorde, moest je
steeds omhoog scrollen naar de voor-foto-grid en weer terug. `FotoKoppelen`
toont in plaats daarvan twee kolommen met losse (nog ongekoppelde) voor- en
na-foto's naast elkaar: klik een foto (roze rand = geselecteerd), klik
daarna de bijpassende foto in de andere kolom om ze te koppelen — of sleep
een foto op de andere. Klikken werkt overal, ook op de telefoon; slepen (HTML5
drag-and-drop) is een bonus die alleen op desktop werkt, dus nooit de enige
manier. Gekoppelde paren verschijnen als rij bovenaan (voor-thumb ↔ na-thumb),
met een knop om te ontkoppelen. Dekt ook het geval dat Anton zelf ter plekke
een extra voor/na-setje maakt van iets dat niet in de oorspronkelijke
voor-foto's van Udo stond — die foto's staan gewoon los totdat ze gekoppeld
worden, ongeacht wie ze uploadde of wanneer.

**Elke foto (voor én na) heeft ook een optioneel `dienst`-veld**, een dropdown
onder de thumbnail in de "Foto's"-kaart (`dienstOpties`/`onDienst`-props op
`FotoGrid`, zelfde patroon als `koppelOpties`/`onKoppel`), met als opties
`p.diensten` van dat pand en "" als default (algemeen/ongetagd). Bepaalt hoe
`OpleverrapportDocument` de "Voor en na"-sectie groepeert, zie hieronder —
zonder tag komt een foto gewoon bij "Algemeen" terecht, dus oude foto's zonder
`dienst`-veld blijven werken zoals voorheen.

## Werkbeschrijving en opleverrapport

Twee documenten, allebei op het pand-scherm, allebei achter de wachtwoordpoort
en handmatig door Bas doorgestuurd — geen deelbare publieke links, dat hield
het beveiligingsoppervlak klein.

- **Werkbeschrijving** (voor Anton): pandadres, contactpersoon ter plaatse,
  materieellijst, wat er moet gebeuren + Udo's foto's, overige instructies.
  Functioneel opgemaakt, geen huisstijl nodig — Anton heeft geen toegang tot de
  tool en krijgt dit via appje/screenshot/print.
- **Opleverrapport** (voor Udo/de klant): huisstijl volgens
  `gumclean-design-system-v2.md` (het echte, canonieke systeem — dus met
  `brand/pink-interactive` (`#CC317B`) voor accenten, niet het felle
  `brand/pink` (`#FF3D9A`), want wit-op-fel-roze haalt geen WCAG AA). Bevat de
  uitgevoerde werkzaamheden en een voor/na-sectie die het "voor/na-kaart"-
  component uit het design system volgt: voor en na naast elkaar, met "voor"
  en "na" als zichtbare tekstlabels, niet alleen visueel naast elkaar gezet.
  Sluit af met de voetregel-indeling uit het design system (§5).

**"Voor en na" groepeert nu per dienst.** Voor elke dienst in `p.diensten`
(in die volgorde) een lichte `<h3>`-subkop, gevolgd door de gekoppelde
voor/na-paren en losse foto's die op díe dienst getagd zijn (zelfde
voorFotoId-matchlogica als voorheen, nu gescoped per dienst — een paar hoort
dus alleen bij elkaar in het rapport als beide foto's dezelfde dienst-tag
hebben). Wat overblijft — ongetagd, of getagd op een dienst die inmiddels uit
`p.diensten` is gehaald — komt daarna als "Algemeen" te staan, met dezelfde
matchlogica. Subkopjes blijven weg zolang er maar één groep is en dat de
Algemeen-groep is (dus: geen enkele foto getagd) — dan ziet het rapport er
precies zo uit als vóór deze functie bestond. Geen enkele foto valt weg,
ongeacht tagging.

**Opleverrapport vergrendelen bevriest de inhoud.** Zelfde reden als de
offerte-snapshot (zie DESTINATION-registratietool.md): zonder vergrendeling
rendert `OpleverrapportDocument` altijd live uit `p`, dus als Bas na het
versturen nog een werkzaamheid of foto aanpast, laat een heropend/herprint
rapport stilletjes iets anders zien dan wat er echt naar de klant ging. De
knop "Rapport vergrendelen" op de Opleverrapport-kaart zet
`opleverrapportVergrendeld: true` en vangt een snapshot
(`opleverrapportSnapshot`) van `werkzaamheden`, `extraWerkzaamheden`,
`geoffreerdeKosten`, `voorFotos`, `naFotos`, `afgerondOp` en een vers
`gegenereerdOp`-tijdstempel
(ISO-string, `new Date().toISOString()` op vergrendelmoment). Zolang
vergrendeld, rendert het document uit die snapshot in plaats van uit de live
pandvelden; een "Ontgrendelen"-knop zet beide velden terug naar
false/null als Bas per ongeluk vergrendelde of opnieuw wil beginnen.
`p.diensten` zelf (de indeling, niet de foto-inhoud) blijft altijd live — zit
bewust niet in de snapshot, want de groepering mag wél meebewegen zolang de
gesnapshotte foto's en tags niet veranderen. De voetregel van het rapport
toont het vergrendel-tijdstip (`gegenereerdOp`) als het gezet is, anders een
lichte "(nog niet vergrendeld)"-hint — nooit een live `new Date()`, dat zou bij
elke heropening "vandaag" tonen. Vergrendelen gebeurt **niet** automatisch bij
printen/previewen — dat blijft vrij, zodat Bas kan blijven bijschaven terwijl
hij concept-versies bekijkt; vergrendelen is een aparte, bewuste actie.

Beide printen via `window.print()` en een `PrintPortaal`-component: het
document wordt via `createPortal` (react-dom) direct in `<body>` gerenderd,
buiten `#root`. In print media (`index.css`) krijgt `#root` `display: none`
en de portal `display: block`. **Bewust niet** de gebruikelijkere
`visibility: hidden` op `body *`-truc — die verbergt de rest van de tool wel
optisch, maar laat 'm zijn layout-hoogte behouden, en de browser paginate't
nog steeds over die volledige (onzichtbare) hoogte. Bij een tool met veel
Kaart-secties gaf dat tientallen lege pagina's vóór en na het eigenlijke
document. Met `display: none` op `#root` bestaat die hoogte niet meer.

De drie printbare documenten staan als losse componenten
(`WerkbeschrijvingDocument`, `OpleverrapportDocument`, `OfferteDocument`),
elk twee keer gerenderd: één keer gewoon inline in de Kaart (voor de
live-preview op het scherm) en één keer in de `PrintPortaal` (voor het
printmoment) — dezelfde JSX, geen duplicatie van de opmaak zelf.

## Offertes

`data.offertes` staat plat naast `data.panden`, met een `klantId` — zelfde
patroon. Twee types (`offerte.type`), qua vorm en databehoefte compleet
verschillend, gebaseerd op de bestaande offertes in `/offertes` in de
hoofdrepo:

- **`meerdere-panden`** — een 0-beurt-offerte voor meerdere panden van één
  klant, zoals offerte 2026-002 (9 Action-panden). Kies panden aan op het
  offerte-scherm, klik "Regels overnemen": dat zet mandagen, hoogwerker-vlag
  en prijs (`omzetBasis` uit `cijfers()`) over in `offerte.regels` — een
  **momentopname**, geen live koppeling. Reden: de uiteindelijk geaccepteerde
  opdracht wijkt soms af van de offerte (zie de Drachten-discrepantie in
  DESTINATION-registratietool.md), en een live-berekende offerte zou zo'n
  latere pandwijziging met terugwerkende kracht in een al verstuurd document
  laten verschijnen. Optionele secties (onderhoudscontract, opties) aan/uit
  per offerte.
- **`spoedopdracht`** — een eenmalige klus voor één pand/klant, zoals offerte
  2026-003 (verfvlekken Geldrop). Grotendeels vrije tekst (`situatie`,
  `aanpak`, `risicos`, `praktisch`) — dat schrijft Bas zelf, elke situatie is
  anders. Prijs is een losse regelslijst (`prijsregels`, net als
  `geoffreerdeKosten`/`extraWerkzaamheden` op het pand) plus `voorrijkosten`
  met een optionele `voorrijkostenOmschrijving` (bv. "Hoofddorp – Geldrop
  v.v., ca. 240 km") — niet gekoppeld aan een pand se `begrootMandagen`.

Sectienummers in het gerenderde document (`nrs` in `OfferteScherm`) worden
doorgeteld i.p.v. hardgecodeerd, want optionele secties (onderhoudscontract,
opties, of lege vrije-tekstvelden bij een spoedopdracht) verschuiven de
nummering — een vast nummer zou gaten of dubbele nummers geven zodra niet
alle secties getoond worden.

**`aanhef` is de volledige, vrij te typen groetregel** (bv. "Geachte heer
Blauw, beste Udo,"), niet alleen een naam-suffix. Eerdere versie plakte er
automatisch "Geachte " voor, wat niet altijd de gewenste toon was (bv.
"Beste Udo," bij een bekende klant) — nu typt Bas de hele regel zelf.

**`opties`** is een vrije regelslijst (`{omschrijving, bedrag}`, zelfde
add/remove-patroon als `prijsregels`/`extraWerkzaamheden`) voor optionele
keuzes die de klant kan afnemen — bv. lichtreclame reinigen, extra
glazenwas. Vervangt de eerdere vaste `lichtreclameOptie`-checkbox: niet elke
offerte heeft dezelfde optionele extra's nodig. Werkt voor beide
offertetypes, staat als eigen sectie + eigen ☐-regels in het akkoordblok.

**"Zet om naar opdracht"** verschijnt zodra de status op "Akkoord" staat
(zie hieronder), en voorkomt dubbel typen van wat al in de offerte staat:

- Bij `meerdere-panden` bestaan de panden al (dat is waar de regels
  vandaan komen bij "Regels overnemen") — de knop schrijft alleen de
  uiteindelijk afgesproken `mandagen`/`hoogwerker` uit `offerte.regels`
  terug naar die panden, voor het geval er tijdens het onderhandelen iets
  afweek van de eerste regel (zie de Drachten-discrepantie hieronder).
- Bij `spoedopdracht` bestaat er nog geen pand — de knop maakt er een aan
  (`LEEG_PAND(o.klantId)`) met `adres` (uit `voorAdres`), `voorrijkosten`,
  `begrootEenheid: "uur"`, en `instructies` gevuld met `aanpak` + `praktisch`
  samengevoegd — de voorbereiding voor Anton staat er dus al zonder dat Bas
  het opnieuw hoeft te typen. Navigeert meteen naar het nieuwe pand.
  `prijsregels` (bv. "Materiaal en verbruik, incl. osmosewater") gaan mee
  als `geoffreerdeKosten` op het nieuwe pand — een spoedopdracht heeft geen
  mandagen/dagtarief, dus zonder deze overname verdween het hele
  doorbelaste bedrag zodra de offerte een opdracht werd.

`offerte.omgezetNaarPandId` onthoudt dat het al gebeurd is (voorkomt een
dubbel pand bij nogmaals klikken); de knop toont daarna een link naar het
resultaat in plaats van zichzelf opnieuw aan te bieden.

Offertenummers zijn doorlopend per jaar (`2026-001`, `2026-002`...),
`volgendOffertenummer()` pakt het hoogste bestaande nummer van het huidige
jaar + 1 als startwaarde bij het aanmaken — het offertenummer-veld zelf is
daarna gewoon een tekstveld, vrij aan te passen.

Opmaak volgt `gumclean-design-system-v2.md`, inclusief het genummerde
sectiekop-blok (`OfferteSectie`, roze nummerblok + titel — §4) en de
prijstabel-conventies uit §5 (header-rij lichte achtergrond, hoogwerker "Ja"
vet + `semantic/warning`-kleur, bedragen rechts uitgelijnd, altijd "excl.
btw"). Akkoordblok met ☐-checkboxes en een handtekeningvak per partij, net
als in de Word-versie — maar puur getypte tekst/print, geen digitale
handtekening. Print/pdf-export via dezelfde `PrintPortaal` als het
opleverrapport.

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
