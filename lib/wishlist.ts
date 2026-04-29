"use server";

import { cookies } from "next/headers";
import { supabase } from "./supabase";
import { randomBytes } from "crypto";

const SESSION = "vinea_session";

export async function getOrCreateSession(): Promise<string> {
  const c = await cookies();
  const existing = c.get(SESSION)?.value;
  if (existing) return existing;
  const id = randomBytes(16).toString("hex");
  c.set(SESSION, id, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return id;
}

export async function toggleWishlist(productId: string): Promise<boolean> {
  const session = await getOrCreateSession();
  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("session_id", session)
    .eq("product_id", productId)
    .maybeSingle();
  if (existing) {
    await supabase.from("wishlists").delete().eq("id", existing.id);
    return false;
  }
  await supabase.from("wishlists").insert({ session_id: session, product_id: productId });
  return true;
}

export async function getWishlistIds(): Promise<string[]> {
  const c = await cookies();
  const session = c.get(SESSION)?.value;
  if (!session) return [];
  const { data } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("session_id", session);
  return (data ?? []).map(d => d.product_id);
}
