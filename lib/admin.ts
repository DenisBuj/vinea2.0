import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "vinea_admin";

/**
 * Secret used to sign admin cookies. Set ADMIN_SECRET in production.
 * If absent, falls back to ADMIN_PASSWORD (still better than nothing — but use a separate, long ADMIN_SECRET).
 */
function getSecret(): string {
  const s = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_SECRET (or ADMIN_PASSWORD) must be set");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/** Constant-time cookie verification to avoid timing attacks. */
function verify(token: string | undefined): boolean {
  if (!token) return false;
  const expected = sign("admin:v1");
  try {
    const a = Buffer.from(token, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return verify(c.get(COOKIE)?.value);
}

export async function setAdminCookie() {
  const c = await cookies();
  c.set(COOKIE, sign("admin:v1"), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12
  });
}

export async function clearAdminCookie() {
  const c = await cookies();
  c.delete(COOKIE);
}
