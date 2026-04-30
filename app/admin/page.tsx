import { isAdmin } from "@/lib/admin";
import AdminLogin from "./login/AdminLogin";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { money, statusColor, statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

type RecentOrder = {
  id: string;
  order_number: string;
  guest_name: string | null;
  status: string;
  total_cents: number;
};
type LowStock = { id: string; name: string; stock: number };

export default async function AdminHome() {
  if (!(await isAdmin())) return <AdminLogin />;

  const [{ count: ordersCount }, { count: paidCount }, { data: revenueRows }, { data: lowStock }, { data: recentOrders }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "paid"),
    supabase.from("orders").select("total_cents"),
    supabase.from("products").select("id, name, stock").lte("stock", 10).order("stock", { ascending: true }).limit(8),
    supabase.from("orders").select("id, order_number, guest_name, status, total_cents").order("created_at", { ascending: false }).limit(8)
  ]);

  const revenue = (revenueRows ?? []).reduce((s: number, r: any) => s + (r.total_cents ?? 0), 0);

  const Card = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
    <div className="p-6 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">{label}</div>
      <div className="font-display text-4xl mt-2 text-[var(--color-ink)]">{value}</div>
      {hint && <div className="text-xs text-[var(--color-ink-dim)] mt-2">{hint}</div>}
    </div>
  );

  return (
    <div>
      <h1 className="font-display text-4xl md:text-5xl text-[var(--color-ink)]">Dashboard</h1>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Orders" value={String(ordersCount ?? 0)} />
        <Card label="Betaald" value={String(paidCount ?? 0)} />
        <Card label="Omzet" value={money(revenue)} />
        <Card label="Lage stock SKU's" value={String((lowStock ?? []).length)} hint="≤ 10 flessen" />
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-[var(--color-ink)]">Recente bestellingen</h3>
            <Link href="/admin/orders" className="text-sm text-[var(--color-accent)]">Alle →</Link>
          </div>
          <ul className="mt-4 divide-y divide-[var(--color-line)]">
            {((recentOrders ?? []) as RecentOrder[]).map((o) => (
              <li key={o.id} className="py-3 flex items-center justify-between text-sm gap-3">
                <Link href={`/admin/orders/${o.id}`} className="font-mono text-[var(--color-accent)]">{o.order_number}</Link>
                <span className="text-[var(--color-ink-dim)] truncate flex-1">{o.guest_name}</span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] ${statusColor(o.status)}`}>{statusLabel(o.status)}</span>
                <span className="font-display text-[var(--color-cta)]">{money(o.total_cents)}</span>
              </li>
            ))}
            {(!recentOrders || recentOrders.length === 0) && (
              <li className="text-sm text-[var(--color-ink-dim)] py-3">Nog geen bestellingen.</li>
            )}
          </ul>
        </div>
        <div className="p-6 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-[var(--color-ink)]">Lage voorraad</h3>
            <Link href="/admin/inventory" className="text-sm text-[var(--color-accent)]">Beheer →</Link>
          </div>
          <ul className="mt-4 divide-y divide-[var(--color-line)]">
            {((lowStock ?? []) as LowStock[]).map((p) => (
              <li key={p.id} className="py-3 flex items-center justify-between text-sm">
                <span>{p.name}</span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] ${p.stock === 0 ? "bg-red-50 text-red-800 border-red-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}>
                  {p.stock} over
                </span>
              </li>
            ))}
            {(!lowStock || lowStock.length === 0) && (
              <li className="text-sm text-[var(--color-ink-dim)] py-3">Alles op niveau.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
