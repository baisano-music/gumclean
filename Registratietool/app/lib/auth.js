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

export function isAuthorized(request) {
  const password = process.env.REGISTRATIE_GATE_PASSWORD;
  if (!password) return true; // geen wachtwoord ingesteld -> poort staat open
  return passwordFromBasicAuth(request.headers.get("authorization")) === password;
}

export function unauthorizedResponse() {
  return new Response("Authenticatie vereist", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="GumClean registratietool"' },
  });
}
