import { isAdmin } from "@/lib/admin";
import AdminLogin from "./login/AdminLogin";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { money, statusColor, statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) return <AdminLogin />;

  // KPIs
  const [{ count: ordersCount }, { count: paidCount }, { data: revenueRows }, { data: lowStock }, { data: recentOrders }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "paid"),
    supabase.from("orders").select("total_cents"),
    supabase.from("products").select("id, name, stock").lte("stock", 10).order("stock", { ascending: true }).limit(8),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(8)
  ]);

  const revenue = (revenueRows ?? []).reduce((s: number, r: any) => s + (r.total_cents ?? 0), 0);

  const Card = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
    <div className="p-6 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/40">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">{label}</div>
      <div className="font-display text-4xl mt-2">{value}</div>
      {hint && <div className="text-xs text-[var(--color-ink-dim)] mt-2">{hint}</div>}
    </div>
  );

  return (
    <div>
      <h1 className="font-display text-4xl md:text-5xl">Dashboard</h1>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Orders" value={String(ordersCount ?? 0)} />
        <Card label="Paid" value={String(paidCount ?? 0)} />
        <Card label="Revenue" value={money(revenue)} />
        <Card label="Low stock SKUs" value={String((lowStock ?? []).length)} hint="≤ 10 bottles left" />
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-[var(--color-line)]">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl">Recent orders</h3>
            <Link href="/admin/orders" className="text-sm text-[var(--color-gold-bright)]">All →</Link>
          </div>
          <ul className="mt-4 divide-y divide-[var(--color-line)]">
            {(recentOrders ?? []).map((o: any) => (
              <li key={o.id} className="py-3 flex items-center justify-between text-sm">
                <Link href={`/admin/orders/${o.id}`} className="font-mono">{o.order_number}</Link>
                <span className="text-[var(--color-ink-dim)]">{o.guest_name}</span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] ${statusColor(o.status)}`}>{statusLabel(o.status)}</span>
                <span className="font-display">{money(o.total_cents)}</span>
              </li>
            ))}
            {(!recentOrders || recentOrders.length === 0) && (
              <li className="text-sm text-[var(--color-ink-dim)] py-3">No orders yet — place a test order from the storefront.</li>
            )}
          </ul>
        </div>
        <div className="p-6 rounded-2xl border border-[var(--color-line)]">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl">Low stock</h3>
            <Link href="/admin/inventory" className="text-sm text-[var(--color-gold-bright)]">Manage →</Link>
          </div>
          <ul className="mt-4 divide-y divide-[var(--color-line)]">
            {(lowStock ?? []).map((p: any) => (
              <li key={p.id} className="py-3 flex items-center justify-between text-sm">
                <span>{p.name}</span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] ${p.stock === 0 ? "bg-red-500/15 text-red-300 border-red-500/30" : "bg-yellow-500/15 text-yellow-300 border-yellow-500/30"}`}>
                  {p.stock} left
                </span>
              </li>
            ))}
            {(!lowStock || lowStock.length === 0) && (
              <li className="text-sm text-[var(--color-ink-dim)] py-3">All bottles healthy.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
