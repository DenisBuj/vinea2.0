import { getCart } from "@/lib/cart";
import { supabase, Product } from "@/lib/supabase";
import { money } from "@/lib/format";
import CheckoutForm from "./CheckoutForm";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const cart = await getCart();
  const ids = cart.map(l => l.productId);
  let products: Product[] = [];
  if (ids.length > 0) {
    const { data } = await supabase.from("products").select("*").in("id", ids);
    products = (data ?? []) as Product[];
  }

  const lines = cart.map(l => ({ ...l, product: products.find(p => p.id === l.productId)! })).filter(x => x.product);
  const subtotal = lines.reduce((s, l) => s + l.product.price_cents * l.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 25000 ? 0 : 1500;
  const total = subtotal + shipping;

  if (lines.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Je mand is leeg</h1>
        <Link href="/shop" className="mt-6 inline-block px-6 py-3 rounded-full btn-cta">Terug naar shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-10 pt-12 pb-24">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Stap 2 van 2</div>
      <h1 className="font-display text-5xl md:text-6xl mt-2 text-[var(--color-ink)]">Betalen</h1>
      <p className="mt-3 text-[var(--color-ink-dim)] text-sm">
        ⚠️ Dit is een testomgeving. Geen echte betaling — vul wat je wil.
      </p>

      <div className="mt-10 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <CheckoutForm />
        </div>

        <aside className="lg:col-span-2 self-start rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-sm">
          <h3 className="font-display text-2xl">Bestelling</h3>
          <ul className="mt-5 space-y-4">
            {lines.map(l => (
              <li key={l.productId} className="flex gap-3">
                <div className="relative w-14 h-18 shrink-0 rounded-md overflow-hidden bg-[var(--color-bg-soft)]">
                  {l.product.image_url && <Image src={l.product.image_url} alt={l.product.name} fill className="object-cover" />}
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-medium">{l.product.name}</div>
                  <div className="text-xs text-[var(--color-ink-dim)]">{l.qty} × {money(l.product.price_cents)}</div>
                </div>
                <div className="text-sm">{money(l.product.price_cents * l.qty)}</div>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-[var(--color-line)] pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-[var(--color-ink-dim)]">Subtotaal</dt><dd>{money(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--color-ink-dim)]">Levering</dt><dd>{shipping === 0 ? "Gratis" : money(shipping)}</dd></div>
            <div className="flex justify-between border-t border-[var(--color-line)] pt-3 text-lg font-display">
              <dt>Totaal</dt><dd className="text-[var(--color-cta)]">{money(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
