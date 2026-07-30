import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Tijdelijke afscherming van de hele site (KVK/UWV "onder constructie"-omgeving).
//
// De poort is actief zolang de env-var SITE_GATE_PASSWORD bestaat, MAAR gaat
// sowieso automatisch uit vanaf de officiële startdatum van de UWV-startperiode
// (1 augustus 2026), ook als iemand vergeet de env-var op te ruimen.
// - Wachtwoord instellen  -> hele site achter een wachtwoordprompt (tot de startdatum).
// - Var verwijderen + redeploy -> site is direct weer publiek.
//
// In Next.js 16 heet de voormalige "middleware" nu "proxy" (zelfde functie).

// Alleen ASCII: HTTP-headerwaarden mogen geen tekens > 255 bevatten.
const REALM = 'GumClean - tijdelijk afgeschermd'

// UWV-startperiode gaat in op 1 augustus 2026 (Europe/Amsterdam, UTC+2 in de zomer).
const GATE_EXPIRES_AT = new Date('2026-08-01T00:00:00+02:00')

export function proxy(request: NextRequest) {
  const password = process.env.SITE_GATE_PASSWORD

  // Geen wachtwoord ingesteld, of startdatum bereikt -> poort uit, site volledig publiek.
  if (!password || Date.now() >= GATE_EXPIRES_AT.getTime()) {
    return NextResponse.next()
  }

  const header = request.headers.get('authorization')

  if (header?.startsWith('Basic ')) {
    const decoded = atob(header.slice('Basic '.length))
    // Gebruikersnaam negeren we; alleen het wachtwoord telt.
    const provided = decoded.slice(decoded.indexOf(':') + 1)
    if (provided === password) {
      return NextResponse.next()
    }
  }

  return new Response('Deze site is tijdelijk afgeschermd.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
    },
  })
}

export const config = {
  // Alles afschermen: pagina's, API en statische assets.
  matcher: '/:path*',
}
