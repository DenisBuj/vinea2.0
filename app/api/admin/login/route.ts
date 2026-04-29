import { NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/admin";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}));
  const expected = process.env.ADMIN_PASSWORD || "vinea-admin-2026";
  if (password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
