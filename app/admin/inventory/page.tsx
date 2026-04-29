import { isAdmin } from "@/lib/admin";
import AdminLogin from "../login/AdminLogin";
import { supabase, Product } from "@/lib/supabase";
import { money, typeLabel } from "@/lib/format";
import StockInput from "./StockInput";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  if (!(await isAdmin())) return <AdminLogin />;
  const { data } = await supabase.from("products").select("*").order("stock", { ascending: true });
  const products = (data ?? []) as Product[];

  return (
    <div>
      <h1 className="font-display text-4xl">Inventory</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-dim)]">Click a number to update stock. Saves automatically.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--color-line)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg-soft)]/50 text-[var(--color-ink-dim)]">
            <tr>
              <th className="text-left p-4">Wine</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Region</th>
              <th className="text-right p-4">Price</th>
              <th className="text-right p-4">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-[var(--color-line)] hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="font-display">{p.name}{p.vintage ? ` ${p.vintage}` : ""}</div>
                  <div className="text-xs text-[var(--color-ink-dim)]">{p.producer}</div>
                </td>
                <td className="p-4">{typeLabel(p.type)}</td>
                <td className="p-4 text-[var(--color-ink-dim)]">{p.region}</td>
                <td className="p-4 text-right">{money(p.price_cents)}</td>
                <td className="p-4 text-right"><StockInput productId={p.id} initial={p.stock} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
