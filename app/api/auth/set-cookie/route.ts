import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { token } = await req.json() as { token: string };

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("c_token", token, {
    httpOnly: true,
    secure:   true,
    sameSite: "lax",
    maxAge:   60 * 60 * 24 * 30, // 30 days — matches JWT TTL
    path:     "/",
  });

  return res;
}
