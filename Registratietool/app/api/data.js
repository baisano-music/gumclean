import { get, put } from "@vercel/blob";
import { isAuthorized, unauthorizedResponse } from "../lib/auth.js";

const PATHNAME = "gumclean-registratie-v1.json";

export async function GET(request) {
  // Nogmaals checken naast de middleware-poort: Vercel raadt af om voor
  // private blobs alleen op middleware te vertrouwen.
  if (!isAuthorized(request)) return unauthorizedResponse();

  const result = await get(PATHNAME, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) {
    return new Response("null", {
      headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" },
    });
  }
  const text = await new Response(result.stream).text();
  return new Response(text, {
    headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" },
  });
}

export async function POST(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  const body = await request.text();
  await put(PATHNAME, body, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  return new Response("ok");
}
