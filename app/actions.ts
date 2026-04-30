"use server";

import { revalidatePath } from "next/cache";
import { addToCart, removeFromCart, updateQty, clearCart, getCart } from "@/lib/cart";
import { toggleWishlist } from "@/lib/wishlist";
import { getServerClient } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin";

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
  if (cart.length === 0) return { ok: false, error: "Mand is leeg" };

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

  const { data, error } = await sb.rpc("place_order", { p_payload: payload });
  if (error) return { ok: false, error: error.message };
  const orderNumber = (data as any)?.order_number as string | undefined;
  if (!orderNumber) return { ok: false, error: "Bestelling kreeg geen nummer" };

  await clearCart();
  revalidatePath("/", "layout");
  return { ok: true, orderNumber };
}

// ── Admin actions (server client uses service role → bypasses RLS) ────────
async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Niet geautoriseerd");
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  await requireAdmin();
  const sb = getServerClient();
  await sb.from("orders").update({ status }).eq("id", orderId);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function updateStockAction(productId: string, stock: number) {
  await requireAdmin();
  const sb = getServerClient();
  await sb.from("products").update({ stock }).eq("id", productId);
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
}

export async function addStockAction(productId: string, qty: number): Promise<number> {
  await requireAdmin();
  if (qty <= 0) throw new Error("Aantal moet > 0 zijn");
  const sb = getServerClient();
  const { data: cur } = await sb.from("products").select("stock").eq("id", productId).maybeSingle();
  const newStock = (cur?.stock ?? 0) + qty;
  await sb.from("products").update({ stock: newStock }).eq("id", productId);
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  return newStock;
}

// ── Product CRUD ─────────────────────────────────────────────────────────
type ProductInput = {
  slug: string;
  name: string;
  producer: string;
  region: string | null;
  country: string | null;
  type: string;
  grape: string | null;
  vintage: number | null;
  description: string | null;
  tasting_notes: string | null;
  food_pairings: string[];
  alcohol_pct: number | null;
  price_cents: number;
  stock: number;
  image_url: string | null;
  featured: boolean;
  hype_score: number;
};

export async function createProductAction(
  input: ProductInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  await requireAdmin();
  const sb = getServerClient();
  const { data, error } = await sb.from("products").insert(input).select("id").single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/shop");
  revalidatePath("/");
  return { ok: true, id: data.id as string };
}

export async function updateProductAction(
  id: string,
  input: ProductInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  const sb = getServerClient();
  const { error } = await sb.from("products").update(input).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/shop");
  revalidatePath(`/shop/${input.slug}`);
  revalidatePath("/");
  return { ok: true };
}

export async function deleteProductAction(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  const sb = getServerClient();
  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/shop");
  revalidatePath("/");
  return { ok: true };
}
