export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/new-look", "/models", "/settings"];
const AUTH_ONLY_PREFIXES = ["/auth/login", "/auth/signup", "/auth/verify"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("c_token")?.value ?? null;

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  const isAuthOnly  = AUTH_ONLY_PREFIXES.some(p => pathname.startsWith(p));

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthOnly && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png).*)"],
};
