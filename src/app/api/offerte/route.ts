import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

// Waar de aanvragen heen gaan en namens wie ze verzonden worden. Beide via env
// zodat je het bezorgadres en (later) een geverifieerd afzenderdomein kunt
// omzetten zonder code te wijzigen.
const TO = process.env.OFFERTE_TO ?? "gumclean@gmail.com";
const FROM = process.env.OFFERTE_FROM ?? "GumClean <onboarding@resend.dev>";

const FIELDS: [key: string, label: string][] = [
  ["naam", "Naam"],
  ["bedrijf", "Bedrijf"],
  ["telefoon", "Telefoon"],
  ["email", "E-mail"],
  ["locatie", "Locatie"],
  ["dienst", "Dienst"],
  ["locaties", "Aantal locaties"],
  ["oppervlakte", "Oppervlakte"],
  ["bericht", "Bericht"],
];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Header-injectie voorkomen (CR/LF in subject/replyTo) en absurd lange input afkappen.
function sanitizeField(value: string, maxLength = 200) {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, maxLength);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort in-memory rate limit per IP: geen zware afhankelijkheid nodig
// voor het verkeersvolume van deze site. Reset zichzelf elk uur.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Te veel aanvragen. Probeer het later opnieuw." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot: bots vullen dit verborgen veld in. Doe alsof het lukte, zodat
    // ze geen signaal krijgen dat hun inzending geweigerd is.
    if (body?._honeypot) {
      return NextResponse.json({ success: true });
    }

    const { naam, bedrijf, telefoon, email, locatie } = body ?? {};
    if (!naam || !bedrijf || !telefoon || !email || !locatie) {
      return NextResponse.json(
        { error: "Vul alle verplichte velden in." },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Vul een geldig e-mailadres in." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("OFFERTE: RESEND_API_KEY ontbreekt — e-mail niet verstuurd.");
      return NextResponse.json(
        { error: "E-mailservice is nog niet geconfigureerd." },
        { status: 500 }
      );
    }

    const rows = FIELDS.map(
      ([key, label]) => [label, String(body[key] ?? "").trim()] as const
    ).filter(([, value]) => value.length > 0);

    const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
    const html = `<h2 style="font-family:sans-serif;color:#1f2937">Nieuwe offerteaanvraag</h2>
<table style="font-family:sans-serif;border-collapse:collapse">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;vertical-align:top"><strong>${escapeHtml(
        label
      )}</strong></td><td style="padding:4px 0;color:#1f2937">${escapeHtml(
        value
      ).replace(/\n/g, "<br>")}</td></tr>`
  )
  .join("\n")}
</table>`;

    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: sanitizeField(email, 254),
      subject: `Nieuwe offerteaanvraag — ${sanitizeField(bedrijf, 100)}`,
      text,
      html,
    });

    if (error) {
      console.error("OFFERTE: Resend-fout:", error);
      return NextResponse.json(
        { error: "Versturen van de aanvraag is mislukt." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }
}
