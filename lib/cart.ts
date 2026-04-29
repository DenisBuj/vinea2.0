"use server";

import { cookies } from "next/headers";

export type CartLine = { productId: string; qty: number };
const COOKIE = "vinea_cart";

export async function getCart(): Promise<CartLine[]> {
  const c = await cookies();
  const raw = c.get(COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(l => l && l.productId && l.qty > 0);
    return [];
  } catch { return []; }
}

export async function setCart(lines: CartLine[]) {
  const c = await cookies();
  c.set(COOKIE, JSON.stringify(lines), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax"
  });
}

export async function addToCart(productId: string, qty: number = 1) {
  const cart = await getCart();
  const existing = cart.find(l => l.productId === productId);
  if (existing) existing.qty += qty;
  else cart.push({ productId, qty });
  await setCart(cart);
}

export async function updateQty(productId: string, qty: number) {
  let cart = await getCart();
  if (qty <= 0) cart = cart.filter(l => l.productId !== productId);
  else {
    const line = cart.find(l => l.productId === productId);
    if (line) line.qty = qty;
  }
  await setCart(cart);
}

export async function removeFromCart(productId: string) {
  const cart = (await getCart()).filter(l => l.productId !== productId);
  await setCart(cart);
}

export async function clearCart() {
  await setCart([]);
}

export async function cartCount(): Promise<number> {
  const cart = await getCart();
  return cart.reduce((s, l) => s + l.qty, 0);
}
