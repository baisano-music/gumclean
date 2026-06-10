import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Tijdelijke afscherming van de hele site (KVK/UWV "onder constructie"-omgeving).
//
// De poort is ALLEEN actief zolang de env-var SITE_GATE_PASSWORD bestaat.
// - Wachtwoord instellen  -> hele site achter een wachtwoordprompt.
// - Var verwijderen + redeploy -> site is direct weer publiek.
//
// In Next.js 16 heet de voormalige "middleware" nu "proxy" (zelfde functie).

// Alleen ASCII: HTTP-headerwaarden mogen geen tekens > 255 bevatten.
const REALM = 'GumClean - tijdelijk afgeschermd'

export function proxy(request: NextRequest) {
  const password = process.env.SITE_GATE_PASSWORD

  // Geen wachtwoord ingesteld -> poort uit, site volledig publiek.
  if (!password) {
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
