import { cookies } from "next/headers";

const COOKIE = "vinea_admin";

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  const v = c.get(COOKIE)?.value;
  return !!v && v === expectedToken();
}

export function expectedToken(): string {
  // Simple deterministic token derived from password.
  const pw = process.env.ADMIN_PASSWORD || "vinea-admin-2026";
  // tiny non-crypto hash; this is a demo gate, not real auth
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (h * 31 + pw.charCodeAt(i)) | 0;
  return "vn-" + (h >>> 0).toString(36);
}

export async function setAdminCookie() {
  const c = await cookies();
  c.set(COOKIE, expectedToken(), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 12
  });
}

export async function clearAdminCookie() {
  const c = await cookies();
  c.delete(COOKIE);
}
