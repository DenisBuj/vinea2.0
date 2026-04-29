import Link from "next/link";
import Image from "next/image";
import { getCart } from "@/lib/cart";
import { supabase, Product } from "@/lib/supabase";
import { money } from "@/lib/format";
import CartLineRow from "./CartLineRow";
import { ArrowRight, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCart();
  const ids = cart.map(l => l.productId);

  let products: Product[] = [];
  if (ids.length > 0) {
    const { data } = await supabase.from("products").select("*").in("id", ids);
    products = (data ?? []) as Product[];
  }

  const lines = cart
    .map(l => ({ line: l, product: products.find(p => p.id === l.productId) }))
    .filter(x => !!x.product) as { line: { productId: string; qty: number }; product: Product }[];

  const subtotal = lines.reduce((s, x) => s + x.product.price_cents * x.line.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 25000 ? 0 : 1500;
  const total = subtotal + shipping;
  const freeShipDelta = Math.max(0, 25000 - subtotal);

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-12 pb-24">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">Your selection</div>
      <h1 className="font-display text-5xl md:text-6xl mt-2">Cart</h1>

      {lines.length === 0 ? (
        <div className="mt-16 text-center py-20 rounded-3xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/30">
          <ShoppingBag size={32} className="mx-auto text-[var(--color-gold-bright)]" />
          <p className="mt-4 text-[var(--color-ink-dim)]">Your cart is empty.</p>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] font-medium">
            Discover the roster <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {lines.map(({ line, product }) => (
              <CartLineRow key={product.id} product={product} qty={line.qty} />
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 self-start rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/40 p-6 h-fit">
            <h3 className="font-display text-2xl">Summary</h3>

            {freeShipDelta > 0 && (
              <div className="mt-5 p-3 rounded-lg bg-[var(--color-wine)]/15 border border-[var(--color-wine)]/30 text-sm">
                Add <span className="text-[var(--color-gold-bright)] font-medium">{money(freeShipDelta)}</span> more for free delivery.
              </div>
            )}

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-[var(--color-ink-dim)]">Subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-[var(--color-ink-dim)]">Shipping</dt><dd>{shipping === 0 ? "Free" : money(shipping)}</dd></div>
              <div className="flex justify-between border-t border-[var(--color-line)] pt-3 text-lg font-display">
                <dt>Total</dt><dd className="text-[var(--color-gold-bright)]">{money(total)}</dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] font-medium hover:bg-[var(--color-gold-bright)] transition"
            >
              Checkout <ArrowRight size={16} />
            </Link>
            <Link href="/shop" className="mt-3 w-full inline-flex items-center justify-center text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">
              Keep shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
