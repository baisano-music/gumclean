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
- **Eén React-bestand met browseropslag.** Bas is de enige gebruiker, dus een
  database is nu overinvesteren.

## Explicitly out of scope

- Koppeling met Jortt. Facturen blijven daar; deze tool levert alleen de regels.
- Live routeplanner of Maps-API.
- Toegang voor Anton, inlog, gebruikersbeheer.
- Voorraadbeheer, offertegeneratie, urenregistratie voor derden.
- Automatische btw-berekening of aangifte.

## Open questions

- Tenaamstelling, adres en btw-nummer van Action's vastgoedroute
  (APinvoiceVGWI@action.eu) — uitstaand bij Udo Blauw.
- Welke van de negen panden onder welke route vallen. Alleen Leek en Drachten
  (eigen vastgoed) en Geldrop (huur, filiaal 1441) zijn bevestigd.
- Werkelijke afstanden per pand. Nu schattingen vanaf Manenburgdreef 93.
- Overschrijving bus van B.J. Hof naar Anton privé is nog niet gedaan.
- Klopt de vermogensetikettering fiscaal? Laten toetsen door de boekhouder
  vóór de eerste aangifte.

## Verhuizen naar Claude Code wanneer

Eén van deze drie waar wordt: Anton moet zelf invoeren · je durft niet meer te
wijzigen zonder versiebeheer · het wordt meer dan één bestand.
