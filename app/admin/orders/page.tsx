import { isAdmin } from "@/lib/admin";
import AdminLogin from "../login/AdminLogin";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { money, statusColor, statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  order_number: string;
  guest_name: string | null;
  guest_email: string | null;
  status: string;
  total_cents: number;
  created_at: string;
};

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  if (!(await isAdmin())) return <AdminLogin />;
  const sp = await searchParams;
  const status = sp.status;

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data: orders } = await query;

  const filters = [
    { v: "", l: "Alle" },
    { v: "paid", l: "Betaald" },
    { v: "processing", l: "In voorbereiding" },
    { v: "shipped", l: "Verzonden" },
    { v: "delivered", l: "Geleverd" },
    { v: "cancelled", l: "Geannuleerd" }
  ];

  return (
    <div>
      <h1 className="font-display text-4xl text-[var(--color-ink)]">Bestellingen</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map(f => (
          <Link
            key={f.v}
            href={f.v ? `/admin/orders?status=${f.v}` : "/admin/orders"}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              (status ?? "") === f.v
                ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                : "bg-white border-[var(--color-line-strong)] text-[var(--color-ink-soft)] hover:border-[var(--color-accent)]"
            }`}
          >
            {f.l}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg-soft)] text-[var(--color-ink-soft)]">
            <tr>
              <th className="text-left p-4">Order #</th>
              <th className="text-left p-4">Klant</th>
              <th className="text-left p-4">Datum</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Totaal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {((orders ?? []) as Row[]).map((o) => (
              <tr key={o.id} className="border-t border-[var(--color-line)] hover:bg-[var(--color-bg-soft)]/50">
                <td className="p-4 font-mono text-[var(--color-accent)]">{o.order_number}</td>
                <td className="p-4">
                  <div>{o.guest_name}</div>
                  <div className="text-xs text-[var(--color-ink-dim)]">{o.guest_email}</div>
                </td>
                <td className="p-4 text-[var(--color-ink-dim)]">{new Date(o.created_at).toLocaleString("nl-BE")}</td>
                <td className="p-4"><span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-[0.15em] ${statusColor(o.status)}`}>{statusLabel(o.status)}</span></td>
                <td className="p-4 text-right font-display text-[var(--color-cta)]">{money(o.total_cents)}</td>
                <td className="p-4 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="text-[var(--color-accent)]">Open →</Link>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr><td colSpan={6} className="p-10 text-center text-[var(--color-ink-dim)]">Geen bestellingen.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
