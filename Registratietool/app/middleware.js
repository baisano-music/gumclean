import { next } from "@vercel/functions";
import { isAuthorized, unauthorizedResponse } from "./lib/auth.js";

export default function middleware(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();
  return next();
}

export const config = {
  runtime: "nodejs",
};
