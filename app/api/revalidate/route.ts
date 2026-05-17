import { NextRequest, NextResponse } from "next/server";
import { revalidateTag }             from "next/cache";

export const runtime = "edge";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tags } = await req.json() as { tags: string[] };

  if (!Array.isArray(tags) || tags.length === 0) {
    return NextResponse.json({ error: "tags array required" }, { status: 400 });
  }

  const allowed = /^(feed|creator-[a-z0-9_]{3,30})$/;
  const invalid  = tags.filter(t => !allowed.test(t));

  if (invalid.length > 0) {
    return NextResponse.json(
      { error: `Invalid tags: ${invalid.join(", ")}` },
      { status: 400 }
    );
  }

  tags.forEach(tag => revalidateTag(tag, "page"));

  return NextResponse.json({
    revalidated: true,
    tags,
    timestamp:   new Date().toISOString(),
  });
}
