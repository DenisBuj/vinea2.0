import Link from "next/link";
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
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Jouw selectie</div>
      <h1 className="font-display text-5xl md:text-6xl mt-2 text-[var(--color-ink)]">Mand</h1>

      {lines.length === 0 ? (
        <div className="mt-16 text-center py-20 rounded-3xl border border-[var(--color-line)] bg-white">
          <ShoppingBag size={32} className="mx-auto text-[var(--color-cta)]" />
          <p className="mt-4 text-[var(--color-ink-soft)]">Je mand is leeg.</p>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full btn-cta font-medium">
            Ontdek de selectie <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {lines.map(({ line, product }) => (
              <CartLineRow key={product.id} product={product} qty={line.qty} />
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 self-start rounded-2xl border border-[var(--color-line)] bg-white p-6 h-fit shadow-sm">
            <h3 className="font-display text-2xl text-[var(--color-ink)]">Overzicht</h3>

            {freeShipDelta > 0 && (
              <div className="mt-5 p-3 rounded-lg bg-[var(--color-cta)]/8 border border-[var(--color-cta)]/30 text-sm">
                Voeg <span className="text-[var(--color-cta)] font-semibold">{money(freeShipDelta)}</span> toe voor gratis levering.
              </div>
            )}

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-[var(--color-ink-dim)]">Subtotaal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-[var(--color-ink-dim)]">Levering</dt><dd>{shipping === 0 ? "Gratis" : money(shipping)}</dd></div>
              <div className="flex justify-between border-t border-[var(--color-line)] pt-3 text-lg font-display">
                <dt>Totaal</dt><dd className="text-[var(--color-cta)]">{money(total)}</dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full btn-cta font-medium"
            >
              Betalen <ArrowRight size={16} />
            </Link>
            <Link href="/shop" className="mt-3 w-full inline-flex items-center justify-center text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">
              Verder winkelen
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
