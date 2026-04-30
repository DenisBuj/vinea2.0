import { supabase, Product } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const revalidate = 30;

const TYPES = [
  { value: "", label: "Alle" },
  { value: "red", label: "Rood" },
  { value: "white", label: "Wit" },
  { value: "rose", label: "Rosé" },
  { value: "sparkling", label: "Bubbels" },
  { value: "champagne", label: "Champagne" },
  { value: "orange", label: "Oranje" }
];

const SORTS = [
  { value: "hype", label: "Hype" },
  { value: "price_asc", label: "Prijs ↑" },
  { value: "price_desc", label: "Prijs ↓" },
  { value: "vintage", label: "Jaar ↓" }
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
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Shop</div>
      <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[0.95] text-[var(--color-ink)]">
        De <span className="font-italic-display text-[var(--color-cta)]">selectie</span>
      </h1>
      <p className="mt-4 text-[var(--color-ink-soft)] max-w-xl">{products.length} flessen in roulatie. Gecureerd, nooit overvol.</p>

      <form className="mt-10 flex flex-col md:flex-row md:items-center gap-4 border-y border-[var(--color-line)] py-6">
        <div className="flex flex-wrap gap-2">
          {TYPES.map(t => (
            <Link
              key={t.value}
              href={{ pathname: "/shop", query: { ...(t.value && { type: t.value }), ...(sort !== "hype" && { sort }), ...(q && { q }) } }}
              className={`px-4 py-2 rounded-full border text-sm transition ${
                t.value === type
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                  : "bg-white border-[var(--color-line-strong)] text-[var(--color-ink-soft)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
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
            placeholder="Zoek wijnen, producenten, regio's…"
            className="bg-white border border-[var(--color-line-strong)] rounded-full px-4 py-2 text-sm placeholder:text-[var(--color-ink-dim)] focus:outline-none focus:border-[var(--color-accent)] min-w-64"
          />
          {type && <input type="hidden" name="type" value={type} />}
          <select
            name="sort"
            defaultValue={sort}
            className="bg-white border border-[var(--color-line-strong)] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
          >
            {SORTS.map(s => (
              <option key={s.value} value={s.value}>Sorteer: {s.label}</option>
            ))}
          </select>
          <button type="submit" className="px-4 py-2 rounded-full btn-accent text-sm font-medium">
            Toepassen
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
          Geen wijnen gevonden. <Link href="/shop" className="text-[var(--color-accent)]">Reset filter</Link>
        </div>
      )}
    </div>
  );
}
