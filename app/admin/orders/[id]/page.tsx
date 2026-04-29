import { isAdmin } from "@/lib/admin";
import AdminLogin from "../../login/AdminLogin";
import { supabase, Order, OrderItem } from "@/lib/supabase";
import { money, statusColor, statusLabel } from "@/lib/format";
import { notFound } from "next/navigation";
import Link from "next/link";
import OrderStatusControl from "./OrderStatusControl";
import { Printer } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return <AdminLogin />;
  const { id } = await params;
  const { data: orderData } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (!orderData) return notFound();
  const order = orderData as Order;

  const { data: itemsData } = await supabase.from("order_items").select("*").eq("order_id", order.id);
  const items = (itemsData ?? []) as OrderItem[];

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-[var(--color-ink-dim)]">← Back to orders</Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">Order</div>
          <h1 className="font-display text-4xl mt-1 font-mono">{order.order_number}</h1>
          <div className="mt-2"><span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-[0.15em] ${statusColor(order.status)}`}>{statusLabel(order.status)}</span></div>
        </div>
        <Link href={`/admin/orders/${order.id}/print`} className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-bg)] font-medium hover:bg-[var(--color-cream)]">
          <Printer size={16} /> Print packing slip
        </Link>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--color-line)]">
            <h3 className="font-display text-2xl">Items</h3>
            <ul className="mt-4 divide-y divide-[var(--color-line)]">
              {items.map(it => (
                <li key={it.id} className="py-3 flex justify-between text-sm">
                  <span>{it.product_name}{it.product_vintage ? ` ${it.product_vintage}` : ""} × {it.qty}</span>
                  <span>{money(it.line_total_cents)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 pt-4 border-t border-[var(--color-line)] space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-[var(--color-ink-dim)]">Subtotal</dt><dd>{money(order.subtotal_cents)}</dd></div>
              <div className="flex justify-between"><dt className="text-[var(--color-ink-dim)]">Shipping</dt><dd>{order.shipping_cents === 0 ? "Free" : money(order.shipping_cents)}</dd></div>
              <div className="flex justify-between font-display text-lg pt-2 border-t border-[var(--color-line)]">
                <dt>Total</dt><dd className="text-[var(--color-gold-bright)]">{money(order.total_cents)}</dd>
              </div>
            </dl>
          </div>

          {order.notes && (
            <div className="p-6 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/40">
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Customer note</div>
              <p className="mt-2 italic">{order.notes}</p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--color-line)]">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Status</div>
            <div className="mt-3"><OrderStatusControl orderId={order.id} status={order.status} /></div>
          </div>
          <div className="p-6 rounded-2xl border border-[var(--color-line)]">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Customer</div>
            <div className="mt-2 font-display text-lg">{order.guest_name}</div>
            <div className="text-sm">{order.guest_email}</div>
            {order.guest_phone && <div className="text-sm text-[var(--color-ink-dim)]">{order.guest_phone}</div>}
          </div>
          <div className="p-6 rounded-2xl border border-[var(--color-line)]">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Shipping</div>
            <div className="mt-2 text-sm">
              {order.shipping_street}<br />
              {order.shipping_postal_code} {order.shipping_city}<br />
              {order.shipping_country}
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-[var(--color-line)] text-xs text-[var(--color-ink-dim)]">
            <div>Placed {new Date(order.created_at).toLocaleString("en-GB")}</div>
            <div>Payment: {order.payment_method}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
