"use server";

import { revalidatePath } from "next/cache";
import { addToCart, removeFromCart, updateQty, clearCart, getCart } from "@/lib/cart";
import { toggleWishlist } from "@/lib/wishlist";
import { getServerClient } from "@/lib/supabase";

// ── Cart actions ──────────────────────────────────────────────────────────
export async function addToCartAction(productId: string, qty: number) {
  await addToCart(productId, qty);
  revalidatePath("/", "layout");
}

export async function updateQtyAction(productId: string, qty: number) {
  await updateQty(productId, qty);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function removeFromCartAction(productId: string) {
  await removeFromCart(productId);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function toggleWishlistAction(productId: string): Promise<boolean> {
  const next = await toggleWishlist(productId);
  revalidatePath("/account/wishlist");
  return next;
}

// ── Order placement (atomic, server-side validated) ───────────────────────
type ShippingInput = {
  name: string;
  email: string;
  phone?: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  notes?: string;
};

export async function placeOrderAction(
  input: ShippingInput
): Promise<{ ok: true; orderNumber: string } | { ok: false; error: string }> {
  const cart = await getCart();
  if (cart.length === 0) return { ok: false, error: "Cart is empty" };

  const sb = getServerClient();
  const payload = {
    customer: {
      name: input.name,
      email: input.email,
      phone: input.phone ?? "",
      street: input.street,
      city: input.city,
      postal_code: input.postal_code,
      country: input.country
    },
    items: cart.map(l => ({ product_id: l.productId, qty: l.qty })),
    notes: input.notes ?? ""
  };

  // Single transactional RPC: validates stock, calculates totals server-side,
  // creates order + items + decrements stock atomically.
  const { data, error } = await sb.rpc("place_order", { p_payload: payload });
  if (error) return { ok: false, error: error.message };
  const orderNumber = (data as any)?.order_number as string | undefined;
  if (!orderNumber) return { ok: false, error: "Order returned no number" };

  await clearCart();
  revalidatePath("/", "layout");
  return { ok: true, orderNumber };
}

// ── Admin actions (use server client → service role bypasses RLS) ─────────
export async function updateOrderStatusAction(orderId: string, status: string) {
  const sb = getServerClient();
  await sb.from("orders").update({ status }).eq("id", orderId);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function updateStockAction(productId: string, stock: number) {
  const sb = getServerClient();
  await sb.from("products").update({ stock }).eq("id", productId);
  revalidatePath("/admin/inventory");
}
