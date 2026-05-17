import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(): Promise<NextResponse> {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("c_token");
  return res;
}
