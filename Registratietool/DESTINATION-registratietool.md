# GumClean registratietool

Status: v1 gebouwd, in gebruik vanaf augustus 2026. Archiveren zodra de tool
verhuist naar een echte webapp of na drie maanden ongebruikt blijkt.

## Problem

Informatie raakt kwijt tussen offerte, uitvoering en factuur. Bij Action bleek
dat concreet: een factuur ging naar het verkeerde adres omdat de tenaamstelling
van het Financial Shared Service Center niet vastlag, en de tenaamstelling van
de vastgoedroute is nog steeds onbekend. Bij 60 dagen betaaltermijn kost elke
afgekeurde factuur weken.

Aan de andere kant: uren, kilometers en materiaalverbruik worden nergens
vastgelegd. Daardoor is de volgende offerte weer een Google Maps-inschatting in
plaats van een onderbouwde prijs, en is niet zichtbaar welke panden geld kosten.

## Who it's for

Bas, als enige invoerder. Anton levert de cijfers aan (appje, bonnetje), Bas
verwerkt ze. Anton heeft geen toegang tot de tool.

## The solution (in plain language)

Eén plek waar per pand vastligt wat er nodig is om te mogen rijden en wat het
achteraf heeft opgeleverd. Een klant kan meerdere factuurroutes hebben met een
eigen tenaamstelling en btw-nummer; elk pand wijst er één aan. Per pand worden
uren, ritten, materieel en verbruik geregistreerd.

Dezelfde data levert vier uitkomsten:

1. **Go of no-go vooraf** — staat alles vast om straks te kunnen factureren?
2. **Nacalculatie** — opbrengst min kosten min arbeid, per pand.
3. **Export** — kilometerstaat en urenstaat als CSV voor de boekhouder.
4. **Factuurregels** — tenaamstelling, grootboek, filiaalnummer, bedrag; klaar
   om over te tikken in Jortt.

## Definition of done

- Als Bas kan ik een nieuwe klant aanmaken met meerdere factuurroutes, zodat
  Action's vastgoed- en huurroute los van elkaar staan.
- Als Bas zie ik per opdracht direct wat er nog ontbreekt, zodat ik het weet
  vóórdat de bus rijdt in plaats van bij de factuur.
- Als Bas registreer ik per pand uren, ritten, materieel en verbruik.
- Als Bas zie ik per pand opbrengst, kosten en resultaat, zodat ik weet of
  € 540 per mandag klopte voor dát pand.
- Als Bas zie ik per pand en per klant wat er na reservering (AOV, pensioen,
  weer/winterbuffer, investering, btw) netto overblijft, zodat het resultaat
  niet oogt als vrij besteedbaar geld.
- Als Bas zie ik de optelling per klant, zodat ik weet wat Action als geheel
  oplevert.
- Als Bas kopieer ik de factuurregels met de juiste tenaamstelling naar Jortt.
- Als Bas exporteer ik een kilometerstaat voor de aangifte.
- Als Bas vul ik een startdatum en reispatroon per pand in, zodat ik zie wanneer
  een klus ongeveer klaar is — voor Anton's planning, inclusief de reistijd die
  anders wordt vergeten.
- Als Bas zet ik Udo's voor-foto's en instructies om in een werkbeschrijving die
  Anton alles geeft wat hij nodig heeft: waar, bij wie melden, wat meenemen,
  wat er moet gebeuren.
- Als Bas maak ik na afloop, met de na-foto's, een opleverrapport in
  GumClean-huisstijl om naar Udo/de klant te sturen, gegroepeerd per dienst
  als ik de foto's zo getagd heb, en vergrendel ik het rapport zodra het echt
  verstuurd is zodat latere wijzigingen het niet meer met terugwerkende
  kracht veranderen.
- Als Bas geef ik per pand aan welke diensten de 0-beurt omvatte
  (gevelreiniging, terreinreiniging, ramen, graffiti) en hoe vaak een
  onderhoudsbeurt daarna realistisch is, zodat ik een vervolgvoorstel kan
  onderbouwen in plaats van gokken.
- Als Bas stel ik een offerte op vanuit de tool — meerdere panden in één
  0-beurt-offerte met tabel, of een spoedopdracht voor één klus — en
  exporteer die in GumClean-huisstijl, in plaats van los in Word te werken.
- De data blijft bewaard tussen sessies.

## Key decisions

- **Eenheid van rekenen is het pand, met optelling per klant.** Per pand kun je
  altijd optellen; andersom valt het niet meer uit elkaar te trekken. De vraag
  is niet "verdien ik aan Action" maar "waarom verlies ik geld in Friesland".
- **Factuurroute hangt aan de klant, niet aan de opdracht.** Action heeft er
  twee; SOHC straks één. De completeness-check leest hieruit zijn belangrijkste
  vraag.
- **Kilometers uit een vaste afstandentabel, niet live berekend.** Een artifact
  kan geen routeplanner aanroepen. Voor tien tot vijftien vaste panden is een
  tabel nauwkeuriger én sneller. Afstanden zijn nu schattingen en bewerkbaar.
- **De bus staat in privévermogen (Anton).** Zakelijke kilometers leveren
  € 0,25 per km aftrek op (tarief 2026, verhoogd van € 0,23). Brandstofbonnen
  worden wél geregistreerd voor de btw-teruggaaf en het kostprijsinzicht, maar
  tellen niet mee als aftrekpost — dat zou dubbel zijn.
- **Privéritten worden ook geregistreerd.** Nodig om aan te tonen dat het
  privégebruik boven de 10% ligt en de bus dus terecht privé staat.
- **Arbeid Anton à € 25 per uur is een rekenprijs, geen kostenpost.** Anton is
  de eenmanszaak en kan niet bij zichzelf declareren. Het getal bestaat alleen
  in de tool, om te kunnen sturen. Nooit doorgeven aan de boekhouding.
- **Reserveringen (AOV, pensioen, weer/winterbuffer, investering) zijn een
  percentage van de omzet; belasting (IB/Zvw) is een percentage van de winst;
  btw telt niet mee in het eindtotaal.** Eerste opzet rekende
  AOV/pensioen/weer/investering per gewerkt uur (net als de € 25 kostprijs),
  maar dat past niet bij hoe die posten in de praktijk werken — premies en
  spaardoelen worden normaal uitgedrukt als percentage van omzet of winst,
  niet per uur. Belasting is de grootste ontbrekende post gebleken en zit
  apart, want die wordt over de winst geheven, niet over de omzet — met een
  bodem op € 0 zodat een verlieslatend pand geen belastingreservering krijgt.
  Btw stond eerst óók als reservering die van het resultaat afging, maar dat
  was dubbelop: `omzet` is overal al ex btw, dus resultaat bevatte die btw
  nooit — 'm er dan nog een keer af trekken telt 'm dubbel. Btw staat nu alleen
  informatief bij de opbrengst (hoeveel van het bedrag incl. btw dat binnenkomt
  niet van jou is), niet in de aftrek naar nettoBeschikbaar. Allemaal
  vuistregels/instellingen (niet per klant), geen daadwerkelijke reserveringen
  bij een verzekeraar of de fiscus — die moeten apart geregeld worden, en de
  percentages laten toetsen door boekhouder/verzekeraar voor ze ergens op
  gestuurd wordt.
- **Opbrengst rekent met begrote mandagen, niet met werkelijke.** Dat is wat er
  gefactureerd wordt. Uitloop hoort in het resultaat te landen, niet in een
  opgeblazen omzet.
- **Reispatroon (dagelijks forenzen of in de buurt overnachten) staat per pand,
  niet als één vaste regel.** Verschilt te veel per klus om globaal te zetten —
  dichtbij forenst Anton altijd, ver weg wisselt het. Reistijd komt bij
  "dagelijks" elke werkdag terug (heen én terug), bij "overnachten" maar één
  keer voor de hele klus. Anton's starttijd (08:30) en pauze (30 min)
  veranderen de 8 werkbare uren zelf niet — ze bepalen alleen hóe laat die
  vallen, dus die twee tellen niet apart mee in de berekening. Vuistregel op
  basis van een aanneembare reissnelheid (standaard 80 km/h, instelbaar), geen
  exacte routeplanning — past bij de eerdere beslissing om ook kilometers uit
  een vaste tabel te halen in plaats van een live routeplanner.
- **Eén React-bestand met browseropslag.** Bas is de enige gebruiker, dus een
  database is nu overinvesteren.
- **Werkbeschrijving en opleverrapport blijven achter de wachtwoordpoort, geen
  deelbare publieke links.** Bas stuurt ze zelf door (kopiëren, printen naar
  pdf, appen) — kleinste beveiligingsoppervlak, geen nieuwe publieke pagina's
  nodig. Foto's zijn om dezelfde reden ook private Blob-opslag, nooit publiek.
- **Het opleverrapport volgt `gumclean-design-system-v2.md`, niet het interne
  roze/paarse palet van de rest van de tool.** Die twee lijken op elkaar maar
  zijn niet gelijk (het interne palet heeft geen AA-veilige `pink-interactive`
  variant en een net iets ander groen) — een klantdocument moet het echte,
  canonieke merk zijn, de tool zelf mag intern afwijken.
- **Een onderhoudsbeurt is een vuistregel-percentage van het werk van de
  0-beurt (standaard 60%, instelbaar), reiskosten en voorrijkosten blijven
  vol staan.** Minder vervuiling om weg te halen bij een vervolgbezoek, maar
  dezelfde rit. Puur een schatting voor het maken van een vervolgvoorstel —
  geen offerte, geen aparte nacalculatie zoals de 0-beurt zelf krijgt.
- **Extra werkzaamheden buiten de offerte (graffiti, grofvuil, extra vieze
  stoep — wat Anton er soms bij doet) tellen mee in de omzet als er een
  bedrag bij staat.** Anders oogt de nacalculatie te negatief bij een klus met
  extra's die wél gefactureerd worden. Bedrag is optioneel: zonder bedrag is
  het puur een vermelding op het opleverrapport en de factuurregels.
- **Een offerte snapshot't de pandregels bij het overnemen, in plaats van
  live uit `cijfers()` te blijven berekenen.** Bij het bouwen bleek waarom dit
  moet: de geaccepteerde opdracht wijkt soms af van wat oorspronkelijk
  geoffreerd is (Drachten ging van 4 naar 6 mandagen na Udo's akkoord, zie
  Open questions). Een live-gekoppelde offerte zou dat met terugwerkende
  kracht stilletjes herschrijven — een verstuurde offerte moet een
  historisch document blijven, ook als het pand daarna verandert.
- **Twee offertetypes met heel verschillende vorm: meerdere panden
  (tabel, uit tooldata) en spoedopdracht (situatie/aanpak/risico's, vrije
  tekst).** Bleek uit de bestaande offertes in `/offertes` — een 0-beurt voor
  meerdere panden is bijna volledig data-gedreven, een spoedopdracht is
  grotendeels een verhaal dat Bas zelf schrijft. Eén sjabloon voor beide had
  het een van de twee slecht laten passen.
- **Offerte en opleverrapport/werkbeschrijving blijven allebei achter de
  wachtwoordpoort, geen publieke deelbare links.** Zelfde afweging als
  eerder bij de foto's: kleinste beveiligingsoppervlak, Bas is de
  tussenpersoon (printen, kopiëren, appen, mailen).
- **Voor/na-foto's koppelen via een expliciete `voorFotoId`, niet op
  uploadvolgorde.** Eerste versie paarde simpelweg foto-index i uit
  `voorFotos` met index i uit `naFotos` — leek te werken, maar Anton stuurt
  bijna altijd meer/andere na-foto's dan Udo voor-foto's stuurde (zie het
  Leek-opleverrapport: vanaf de vierde foto stonden willekeurige combinaties
  naast elkaar). Bas koppelt nu zelf elke na-foto aan een voor-foto in de
  tool; foto's zonder koppeling komen los te staan in plaats van naast een
  verkeerde of lege partner.
- **Het opleverrapport vergrendelt op een expliciete knop, niet automatisch
  bij printen/previewen — en snapshot't dezelfde manier als de offerte.**
  `OpleverrapportDocument` rendert normaal live uit het pand: handig tijdens
  het opstellen, maar riskant erna. Zonder vergrendeling zou een werkzaamheid
  of foto die Bas ná het versturen nog aanpast (of verwijdert) stilletjes in
  een heropend/herprint rapport verschijnen — precies het probleem dat de
  offerte-snapshot al oploste voor `offerte.regels` (zie hierboven), nu
  opnieuw voor `p.werkzaamheden`/`p.extraWerkzaamheden`/`p.voorFotos`/
  `p.naFotos`/`p.afgerondOp`. Bewust géén auto-lock op het print-moment: Bas
  print/bekijkt de preview vaak nog terwijl hij aan het draft is, en dat mag
  vrij blijven — vergrendelen ("Rapport vergrendelen"-knop) is een aparte,
  bewuste stap met een eigen "Ontgrendelen" terug-knop voor als het per
  ongeluk gebeurde. De snapshot vangt ook een `gegenereerdOp`-tijdstempel op
  het moment van vergrendelen, getoond in de voetregel van het rapport — een
  live `new Date()` op elke render was géén optie, want dan toont een
  heropende preview morgen "vandaag" in plaats van het echte verstuurmoment.
- **Foto's krijgen een optioneel `dienst`-veld, en het opleverrapport
  groepeert de voor/na-sectie daarop in plaats van één platte grid.** Bij
  panden met meerdere diensten in één 0-beurt (bijv. gevelreiniging én
  graffitiverwijdering, zoals Leek en Drachten) stonden alle voor/na-paren
  door elkaar, terwijl Udo per dienst wil kunnen zien wat er gedaan is. Elke
  dienst uit `p.diensten` krijgt nu een eigen kopje met zijn eigen
  voorFotoId-matching (nu gescoped per dienst — een paar hoort alleen bij
  elkaar in dezelfde dienst-groep als beide foto's zo getagd zijn); wat
  ongetagd blijft (of getagd is op een dienst die er inmiddels weer af is)
  valt terug op een "Algemeen"-groep aan het eind, exact het oude
  fallback-gedrag. `p.diensten` zelf komt niet in de snapshot hierboven te
  staan — de foto's en hun tags wel, maar de volgorde/indeling zelf mag altijd
  meebewegen met het pand, want dat is puur presentatie, geen inhoud die naar
  de klant is gegaan.

## Explicitly out of scope

- Koppeling met Jortt. Facturen blijven daar; deze tool levert alleen de regels.
- Live routeplanner of Maps-API.
- Toegang voor Anton, inlog, gebruikersbeheer.
- Voorraadbeheer, urenregistratie voor derden.
- Automatische btw-berekening of aangifte.
- Deelbare publieke offerte-/rapportlinks zonder wachtwoord (zie ook
  werkbeschrijving/opleverrapport hierboven) — Bas blijft de tussenpersoon.

**Was hier tot 2026-08-05 uitgesloten, nu wél gebouwd: offertegeneratie.** Bas
maakte offertes tot dan toe los in Word (zie `/offertes` in de hoofdrepo).
Aanleiding om dat om te draaien: hij vroeg er expliciet om, en de meerdere-
panden-offerte bleek bijna letterlijk de data die al in de tool zit
(pand × mandagen × hoogwerker × dagtarief). Zie "Offertes" hieronder.

## Open questions

- Btw-nummer van Action's vastgoedroute (APinvoiceVGWI@action.eu) — nog
  uitstaand bij Udo Blauw. Tenaamstelling ("Action OG Winkels BV", t.a.v.
  Financiële administratie) en adres (Perenmarkt 15, 1681 PG Zwaagdijk) zijn
  inmiddels wel bekend en staan in `START()`.
- Welke van de negen panden onder welke route vallen. Leek (filiaal 1048),
  Drachten (filiaal 1021, beide eigen vastgoed) en Geldrop (huur, filiaal
  1441) zijn bevestigd, met filiaalnummer en adres. De rest nog na te vragen.
- ~~Discrepantie Drachten~~ — bevestigd: na offerte 2026-002 (4 mandagen,
  € 2.160) is Drachten opgehoogd naar 6 mandagen (€ 3.240), conform Udo's
  opdrachtbevestiging van 27-07-2026. `START()` staat nu op 6.
- Werkelijke afstanden per pand. Nu schattingen vanaf Manenburgdreef 93.
- Overschrijving bus van B.J. Hof naar Anton privé is nog niet gedaan.
- Klopt de vermogensetikettering fiscaal? Laten toetsen door de boekhouder
  vóór de eerste aangifte.

## Verhuizen naar Claude Code wanneer

Eén van deze drie waar wordt: Anton moet zelf invoeren · je durft niet meer te
wijzigen zonder versiebeheer · het wordt meer dan één bestand.
