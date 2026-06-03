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

export async function POST(request: Request) {
  try {
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
      replyTo: email,
      subject: `Nieuwe offerteaanvraag — ${bedrijf}`,
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
