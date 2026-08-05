import { timingSafeEqual } from "node:crypto";

// Alleen het wachtwoord telt, de gebruikersnaam in de Basic Auth-prompt is vrij.
export function passwordFromBasicAuth(header) {
  const match = /^Basic\s+(.+)$/i.exec(header || "");
  if (!match) return null;
  let decoded;
  try {
    decoded = atob(match[1]);
  } catch {
    return null;
  }
  const idx = decoded.indexOf(":");
  return idx >= 0 ? decoded.slice(idx + 1) : decoded;
}

// Vaste-tijd vergelijking: een simpele === lekt via de responstijd hoeveel
// tekens van het wachtwoord al kloppen. Beide kanten padden naar dezelfde
// lengte zodat ook de lengte zelf niet via een vroege return lekt.
function constantTimeEqual(a, b) {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  const maxLen = Math.max(bufA.length, bufB.length, 1);
  const paddedA = Buffer.alloc(maxLen);
  const paddedB = Buffer.alloc(maxLen);
  bufA.copy(paddedA);
  bufB.copy(paddedB);
  return bufA.length === bufB.length && timingSafeEqual(paddedA, paddedB);
}

export function isAuthorized(request) {
  const password = process.env.REGISTRATIE_GATE_PASSWORD;
  if (!password) {
    // Geen wachtwoord ingesteld -> poort staat open, bedoeld voor lokaal draaien.
    // Op productie nooit fail-open, ook niet als de env var per ongeluk ontbreekt.
    return process.env.VERCEL_ENV !== "production";
  }
  const supplied = passwordFromBasicAuth(request.headers.get("authorization"));
  return supplied !== null && constantTimeEqual(supplied, password);
}

export function unauthorizedResponse() {
  return new Response("Authenticatie vereist", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="GumClean registratietool"' },
  });
}
