import { supabase, Product } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { money, typeLabel } from "@/lib/format";
import AddToCart from "@/components/AddToCart";
import WishlistButton from "@/components/WishlistButton";
import { getWishlistIds } from "@/lib/wishlist";
import ProductCard from "@/components/ProductCard";
import { Wine, Grape, MapPin, Calendar } from "lucide-react";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (!data) return notFound();
  const p = data as Product;

  const wishIds = await getWishlistIds();
  const onWishlist = wishIds.includes(p.id);

  const { data: relatedData } = await supabase
    .from("products")
    .select("*")
    .eq("type", p.type)
    .neq("id", p.id)
    .limit(4);
  const related = (relatedData ?? []) as Product[];

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-12 pb-24">
      <Link href="/shop" className="text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-gold-bright)]">← Back to shop</Link>

      <div className="mt-6 grid lg:grid-cols-2 gap-12">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[var(--color-bg-soft)]">
          {p.image_url && (
            <Image src={p.image_url} alt={p.name} fill priority className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--color-gold-bright)]">
            <span className="px-3 py-1 rounded-full border border-[var(--color-gold)]/40">{typeLabel(p.type)}</span>
            {p.region && <span>· {p.region}</span>}
            {p.country && <span>· {p.country}</span>}
          </div>

          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mt-5">{p.name}</h1>
          <div className="mt-2 text-[var(--color-ink-dim)] text-lg">
            {p.producer}{p.vintage ? ` · ${p.vintage}` : ""}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {p.grape && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--color-bg-soft)]/50 border border-[var(--color-line)]">
                <Grape size={16} className="text-[var(--color-gold-bright)]" />
                <span>{p.grape}</span>
              </div>
            )}
            {p.region && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--color-bg-soft)]/50 border border-[var(--color-line)]">
                <MapPin size={16} className="text-[var(--color-gold-bright)]" />
                <span>{p.region}</span>
              </div>
            )}
            {p.vintage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--color-bg-soft)]/50 border border-[var(--color-line)]">
                <Calendar size={16} className="text-[var(--color-gold-bright)]" />
                <span>{p.vintage}</span>
              </div>
            )}
            {p.alcohol_pct != null && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--color-bg-soft)]/50 border border-[var(--color-line)]">
                <Wine size={16} className="text-[var(--color-gold-bright)]" />
                <span>{p.alcohol_pct}% ABV</span>
              </div>
            )}
          </div>

          {p.description && (
            <p className="mt-8 text-[var(--color-ink-dim)] text-lg leading-relaxed">{p.description}</p>
          )}

          {p.tasting_notes && (
            <div className="mt-6 p-5 rounded-2xl bg-[var(--color-wine)]/10 border border-[var(--color-wine)]/30">
              <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-bright)]">Tasting</div>
              <p className="mt-2 italic font-display text-lg">{p.tasting_notes}</p>
            </div>
          )}

          {p.food_pairings && p.food_pairings.length > 0 && (
            <div className="mt-6">
              <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] mb-3">Pairs with</div>
              <div className="flex flex-wrap gap-2">
                {p.food_pairings.map(f => (
                  <span key={f} className="px-3 py-1.5 rounded-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] text-sm">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-10">
            <div className="flex items-end justify-between mb-4">
              <div className="font-display text-4xl text-[var(--color-gold-bright)]">{money(p.price_cents)}</div>
              <div className="text-sm text-[var(--color-ink-dim)]">
                {p.stock > 0 ? `${p.stock} bottles in stock` : "Sold out"}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <AddToCart productId={p.id} stock={p.stock} />
              </div>
              <WishlistButton productId={p.id} initiallyOn={onWishlist} />
            </div>
            <p className="mt-3 text-xs text-[var(--color-ink-dim)]">
              Free delivery in Belgium over €250 · €15 flat below.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h3 className="font-display text-3xl mb-6">More <span className="font-italic-display">{typeLabel(p.type).toLowerCase()}</span> from the roster</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map(r => <ProductCard key={r.id} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
