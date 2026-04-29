import { supabase, Product } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const revalidate = 30;

const TYPES = [
  { value: "", label: "All" },
  { value: "red", label: "Red" },
  { value: "white", label: "White" },
  { value: "rose", label: "Rosé" },
  { value: "sparkling", label: "Sparkling" },
  { value: "champagne", label: "Champagne" },
  { value: "orange", label: "Orange" }
];

const SORTS = [
  { value: "hype", label: "Hype" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
  { value: "vintage", label: "Vintage ↓" }
];

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ type?: string; sort?: string; q?: string }> }) {
  const sp = await searchParams;
  const type = sp.type ?? "";
  const sort = sp.sort ?? "hype";
  const q = sp.q ?? "";

  let query = supabase.from("products").select("*");

  if (type) query = query.eq("type", type);
  if (q) query = query.or(`name.ilike.%${q}%,producer.ilike.%${q}%,region.ilike.%${q}%,grape.ilike.%${q}%`);

  switch (sort) {
    case "price_asc": query = query.order("price_cents", { ascending: true }); break;
    case "price_desc": query = query.order("price_cents", { ascending: false }); break;
    case "vintage": query = query.order("vintage", { ascending: false, nullsFirst: false }); break;
    default: query = query.order("hype_score", { ascending: false });
  }

  const { data } = await query;
  const products = (data ?? []) as Product[];

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-12 pb-24">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">Shop</div>
      <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[0.95]">
        The <span className="font-italic-display text-[var(--color-gold-bright)]">roster</span>
      </h1>
      <p className="mt-4 text-[var(--color-ink-dim)] max-w-xl">{products.length} bottles in rotation. Curated, never bloated.</p>

      <form className="mt-10 flex flex-col md:flex-row md:items-center gap-4 border-y border-[var(--color-line)] py-6">
        <div className="flex flex-wrap gap-2">
          {TYPES.map(t => (
            <Link
              key={t.value}
              href={{ pathname: "/shop", query: { ...(t.value && { type: t.value }), ...(sort !== "hype" && { sort }), ...(q && { q }) } }}
              className={`px-4 py-2 rounded-full border text-sm transition ${
                t.value === type
                  ? "bg-[var(--color-gold)] text-[var(--color-bg)] border-[var(--color-gold)]"
                  : "border-[var(--color-line)] text-[var(--color-ink-dim)] hover:border-[var(--color-gold)]/40 hover:text-[var(--color-ink)]"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <div className="md:ml-auto flex items-center gap-3">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search wines, producers, regions…"
            className="bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-full px-4 py-2 text-sm placeholder:text-[var(--color-ink-dim)]/60 focus:outline-none focus:border-[var(--color-gold)]/50 min-w-64"
          />
          {type && <input type="hidden" name="type" value={type} />}
          <select
            name="sort"
            defaultValue={sort}
            className="bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)]/50"
          >
            {SORTS.map(s => (
              <option key={s.value} value={s.value}>Sort: {s.label}</option>
            ))}
          </select>
          <button type="submit" className="px-4 py-2 rounded-full bg-[var(--color-ink)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-cream)] transition">
            Apply
          </button>
        </div>
      </form>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map(p => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-24 text-[var(--color-ink-dim)]">
          Nothing matches that filter. <Link href="/shop" className="text-[var(--color-gold-bright)]">Reset</Link>
        </div>
      )}
    </div>
  );
}
