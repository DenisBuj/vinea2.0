import { getWishlistIds } from "@/lib/wishlist";
import { supabase, Product } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const ids = await getWishlistIds();
  let products: Product[] = [];
  if (ids.length > 0) {
    const { data } = await supabase.from("products").select("*").in("id", ids);
    products = (data ?? []) as Product[];
  }
  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-12 pb-24">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">Saved for later</div>
      <h1 className="font-display text-5xl md:text-6xl mt-2">Wishlist</h1>

      {products.length === 0 ? (
        <div className="mt-16 p-10 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/30 text-center">
          <p className="text-[var(--color-ink-dim)]">Tap the heart on any wine to save it here.</p>
          <Link href="/shop" className="mt-5 inline-block px-6 py-3 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)]">Shop the roster</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
