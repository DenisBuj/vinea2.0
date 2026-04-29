"use server";

import { revalidatePath } from "next/cache";
import { addToCart, removeFromCart, updateQty, clearCart, getCart } from "@/lib/cart";
import { toggleWishlist } from "@/lib/wishlist";
import { supabase } from "@/lib/supabase";

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

export async function placeOrderAction(input: ShippingInput): Promise<{ ok: true; orderNumber: string } | { ok: false; error: string }> {
  const cart = await getCart();
  if (cart.length === 0) return { ok: false, error: "Cart is empty" };

  const ids = cart.map(l => l.productId);
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id, name, vintage, price_cents, stock")
    .in("id", ids);

  if (prodErr || !products) return { ok: false, error: "Could not load products" };

  // Validate stock
  for (const line of cart) {
    const p = products.find(x => x.id === line.productId);
    if (!p) return { ok: false, error: "Unknown product in cart" };
    if (p.stock < line.qty) return { ok: false, error: `Not enough stock for ${p.name}` };
  }

  let subtotal = 0;
  const items = cart.map(line => {
    const p = products.find(x => x.id === line.productId)!;
    const lineTotal = p.price_cents * line.qty;
    subtotal += lineTotal;
    return {
      product_id: p.id,
      product_name: p.name,
      product_vintage: p.vintage,
      qty: line.qty,
      unit_price_cents: p.price_cents,
      line_total_cents: lineTotal
    };
  });

  const shipping = subtotal >= 25000 ? 0 : 1500;
  const total = subtotal + shipping;

  // Generate order number
  const { data: numRow } = await supabase.rpc("generate_order_number");
  const orderNumber = (numRow as string) ?? `VN-${Date.now()}`;

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      guest_email: input.email,
      guest_name: input.name,
      guest_phone: input.phone ?? null,
      shipping_street: input.street,
      shipping_city: input.city,
      shipping_postal_code: input.postal_code,
      shipping_country: input.country,
      subtotal_cents: subtotal,
      shipping_cents: shipping,
      total_cents: total,
      status: "paid",
      payment_method: "card_test",
      notes: input.notes ?? null
    })
    .select("id")
    .single();

  if (orderErr || !order) return { ok: false, error: "Could not create order: " + (orderErr?.message ?? "") };

  const itemsWithOrder = items.map(it => ({ ...it, order_id: order.id }));
  const { error: itemsErr } = await supabase.from("order_items").insert(itemsWithOrder);
  if (itemsErr) return { ok: false, error: "Could not create order items: " + itemsErr.message };

  // Decrement stock
  for (const line of cart) {
    const p = products.find(x => x.id === line.productId)!;
    await supabase.from("products").update({ stock: p.stock - line.qty }).eq("id", p.id);
  }

  await clearCart();
  revalidatePath("/", "layout");
  return { ok: true, orderNumber };
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  await supabase.from("orders").update({ status }).eq("id", orderId);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function updateStockAction(productId: string, stock: number) {
  await supabase.from("products").update({ stock }).eq("id", productId);
  revalidatePath("/admin/inventory");
}
