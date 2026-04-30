import { isAdmin } from "@/lib/admin";
import AdminLogin from "../login/AdminLogin";
import { supabase, Product } from "@/lib/supabase";
import { money, typeLabel } from "@/lib/format";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsList() {
  if (!(await isAdmin())) return <AdminLogin />;

  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  const products = (data ?? []) as Product[];

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-4xl text-[var(--color-ink)]">Wijnen</h1>
          <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{products.length} flessen in catalogus.</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-5 py-3 rounded-full btn-accent font-medium">
          <Plus size={16} /> Nieuwe wijn
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <Link
            key={p.id}
            href={`/admin/products/${p.id}`}
            className="rounded-2xl border border-[var(--color-line)] bg-white overflow-hidden hover:border-[var(--color-accent)] hover:shadow-lg transition shadow-sm flex"
          >
            <div className="relative w-32 h-40 shrink-0 bg-[var(--color-bg-soft)]">
              {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-cover" />}
            </div>
            <div className="p-4 flex-1 min-w-0">
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">{typeLabel(p.type)}</div>
              <div className="font-display text-lg mt-1 truncate">{p.name}</div>
              <div className="text-xs text-[var(--color-ink-dim)] truncate">{p.producer}</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-display text-lg text-[var(--color-cta)]">{money(p.price_cents)}</span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] ${p.stock === 0 ? "bg-red-50 text-red-800 border-red-200" : p.stock <= 10 ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`}>
                  {p.stock} stock
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
