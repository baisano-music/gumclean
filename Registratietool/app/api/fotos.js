import { put, get, del } from "@vercel/blob";
import { isAuthorized, unauthorizedResponse } from "../lib/auth.js";

const MAX_BYTES = 8 * 1024 * 1024;

// Foto's staan private in dezelfde Blob store als de rest van de data, onder
// foto/{pandId}/{voor|na}/{uuid}.{ext} — nooit publiek, altijd door deze route
// heen (die de wachtwoordpoort nogmaals checkt, zelfde patroon als api/data.js).
function geldigPad(pathname) {
  return typeof pathname === "string" && /^foto\/[^/]+\/(voor|na)\/[^/]+\.(jpg|png)$/.test(pathname);
}

// pandId komt altijd uit crypto.randomUUID() (zie LEEG_PAND in App.jsx), dus
// hex + streepjes is genoeg — voorkomt dat iemand met de wachtwoordpoort-
// toegang een pad met "/" of ".." het pad buiten foto/ laat opbouwen.
function geldigId(id) {
  return typeof id === "string" && /^[A-Za-z0-9_-]+$/.test(id);
}

// Nooit de Content-Type van de aanvrager vertrouwen voor wat we straks weer
// terugserveren (anders kan iemand met wachtwoordtoegang een html/js-bestand
// als "foto" uploaden en het via /api/fotos same-origin laten uitvoeren, een
// stored-XSS-route). Alleen echte JPEG/PNG magic bytes worden geaccepteerd,
// en we stempelen zelf het content-type — nooit wat de client claimt.
function detecteerAfbeeldingType(bytes) {
  const b = new Uint8Array(bytes);
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47
    && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) return "image/png";
  return null;
}

export async function GET(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();
  const pathname = new URL(request.url).searchParams.get("pad");
  if (!geldigPad(pathname)) return new Response("Ongeldig pad", { status: 400 });

  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode !== 200) return new Response("Niet gevonden", { status: 404 });
  // Ook op de weg terug het content-type zelf afdwingen (nooit doorgeven wat
  // ooit is opgeslagen als het geen van beide bekende types is), plus headers
  // die uitvoering als html/script in de browser onmogelijk maken.
  const safeType = result.contentType === "image/png" ? "image/png" : "image/jpeg";
  return new Response(result.stream, {
    headers: {
      "Content-Type": safeType,
      "Content-Disposition": 'inline; filename="foto.' + (safeType === "image/png" ? "png" : "jpg") + '"',
      "Content-Security-Policy": "default-src 'none'; img-src 'self'",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, max-age=3600",
    },
  });
}

export async function POST(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();
  const url = new URL(request.url);
  const pandId = url.searchParams.get("pandId");
  const type = url.searchParams.get("type");
  if (!geldigId(pandId) || (type !== "voor" && type !== "na")) {
    return new Response("Ongeldige parameters", { status: 400 });
  }

  const body = await request.arrayBuffer();
  if (body.byteLength === 0 || body.byteLength > MAX_BYTES) {
    return new Response("Ongeldige of te grote afbeelding", { status: 400 });
  }
  const contentType = detecteerAfbeeldingType(body);
  if (!contentType) return new Response("Alleen JPEG- of PNG-afbeeldingen toegestaan", { status: 400 });

  const ext = contentType === "image/png" ? "png" : "jpg";
  const pathname = `foto/${pandId}/${type}/${crypto.randomUUID()}.${ext}`;
  await put(pathname, body, { access: "private", addRandomSuffix: false, contentType });
  return new Response(JSON.stringify({ pathname }), { headers: { "Content-Type": "application/json" } });
}

export async function DELETE(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();
  const pathname = new URL(request.url).searchParams.get("pad");
  if (!geldigPad(pathname)) return new Response("Ongeldig pad", { status: 400 });

  await del(pathname);
  return new Response("ok");
}
