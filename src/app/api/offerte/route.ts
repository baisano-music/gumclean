import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { naam, locatie, telefoon } = body;
    if (!naam || !locatie || !telefoon) {
      return NextResponse.json(
        { error: "Vul alle verplichte velden in." },
        { status: 400 }
      );
    }

    // TODO: Integrate with email service (e.g. Resend, Nodemailer)
    // to send the quote request to info@gumclean.nl
    console.log("Nieuwe offerte aanvraag:", body);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Ongeldig verzoek." },
      { status: 400 }
    );
  }
}
