import { isAdmin } from "@/lib/admin";
import AdminLogin from "../login/AdminLogin";
import { supabase, Product } from "@/lib/supabase";
import { money, typeLabel } from "@/lib/format";
import StockInput from "./StockInput";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  if (!(await isAdmin())) return <AdminLogin />;
  const { data } = await supabase.from("products").select("*").order("stock", { ascending: true });
  const products = (data ?? []) as Product[];

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-4xl text-[var(--color-ink)]">Voorraad</h1>
          <p className="mt-2 text-sm text-[var(--color-ink-dim)]">Pas een aantal aan of voeg flessen toe — bewaart automatisch.</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-5 py-3 rounded-full btn-accent font-medium">
          <Plus size={16} /> Nieuwe wijn
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg-soft)] text-[var(--color-ink-soft)]">
            <tr>
              <th className="text-left p-4">Wijn</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Regio</th>
              <th className="text-right p-4">Prijs</th>
              <th className="text-right p-4">Stock</th>
              <th className="text-right p-4">Bijvullen</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-[var(--color-line)] hover:bg-[var(--color-bg-soft)]/50">
                <td className="p-4">
                  <div className="font-display">{p.name}{p.vintage ? ` ${p.vintage}` : ""}</div>
                  <div className="text-xs text-[var(--color-ink-dim)]">{p.producer}</div>
                </td>
                <td className="p-4">{typeLabel(p.type)}</td>
                <td className="p-4 text-[var(--color-ink-dim)]">{p.region}</td>
                <td className="p-4 text-right">{money(p.price_cents)}</td>
                <td className="p-4 text-right"><StockInput productId={p.id} initial={p.stock} mode="set" /></td>
                <td className="p-4 text-right"><StockInput productId={p.id} initial={p.stock} mode="add" /></td>
                <td className="p-4 text-right"><Link href={`/admin/products/${p.id}`} className="text-[var(--color-accent)]">Bewerk →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
