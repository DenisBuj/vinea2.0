import { supabase, Order, OrderItem } from "@/lib/supabase";
import { money, statusColor, statusLabel } from "@/lib/format";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";

const STEPS = ["paid", "processing", "shipped", "delivered"] as const;

export default async function OrderPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const { data } = await supabase.from("orders").select("*").eq("order_number", number).maybeSingle();
  if (!data) return notFound();
  const order = data as Order;

  const { data: itemsData } = await supabase.from("order_items").select("*").eq("order_id", order.id);
  const items = (itemsData ?? []) as OrderItem[];

  const stepIdx = STEPS.indexOf(order.status as any);

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 pt-12 pb-24">
      <Link href="/order" className="text-sm text-[var(--color-ink-dim)]">← Look up another order</Link>
      <div className="mt-3 text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">Order</div>
      <h1 className="font-display text-5xl mt-2 font-mono tracking-tight">{order.order_number}</h1>
      <div className={`inline-flex mt-3 px-3 py-1 rounded-full border text-xs uppercase tracking-[0.2em] ${statusColor(order.status)}`}>
        {statusLabel(order.status)}
      </div>

      {order.status !== "cancelled" && (
        <div className="mt-10 grid grid-cols-4 gap-2">
          {[
            { k: "paid", label: "Paid", Icon: CheckCircle2 },
            { k: "processing", label: "Prepping", Icon: Package },
            { k: "shipped", label: "Shipped", Icon: Truck },
            { k: "delivered", label: "Delivered", Icon: Home }
          ].map(({ k, label, Icon }, i) => {
            const done = i <= stepIdx;
            return (
              <div key={k} className="text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${done ? "bg-[var(--color-gold)] text-[var(--color-bg)]" : "bg-[var(--color-bg-soft)] border border-[var(--color-line)] text-[var(--color-ink-dim)]"}`}>
                  <Icon size={18} />
                </div>
                <div className={`mt-2 text-xs ${done ? "text-[var(--color-gold-bright)]" : "text-[var(--color-ink-dim)]"}`}>{label}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 grid sm:grid-cols-2 gap-6 text-sm">
        <div className="p-5 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/40">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Shipping to</div>
          <div className="mt-2 font-display text-lg">{order.guest_name}</div>
          <div className="text-[var(--color-ink-dim)]">
            {order.shipping_street}<br />
            {order.shipping_postal_code} {order.shipping_city}<br />
            {order.shipping_country}
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/40">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Contact</div>
          <div className="mt-2">{order.guest_email}</div>
          {order.guest_phone && <div className="text-[var(--color-ink-dim)]">{order.guest_phone}</div>}
          <div className="text-[var(--color-ink-dim)] mt-2 text-xs">Placed {new Date(order.created_at).toLocaleString("en-GB")}</div>
        </div>
      </div>

      <div className="mt-8 p-5 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/40">
        <h3 className="font-display text-2xl">Items</h3>
        <ul className="mt-4 space-y-3">
          {items.map(it => (
            <li key={it.id} className="flex justify-between text-sm">
              <span>{it.product_name} {it.product_vintage ?? ""} × {it.qty}</span>
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
    </div>
  );
}
