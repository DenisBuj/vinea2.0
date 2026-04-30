"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Package, Truck, Home, Wifi } from "lucide-react";
import { Order, OrderItem } from "@/lib/supabase";
import { getBrowserClient } from "@/lib/supabase-browser";
import { money, statusColor, statusLabel } from "@/lib/format";

const STEPS = ["paid", "processing", "shipped", "delivered"] as const;

export default function OrderTrackerClient({ order: initial, items }: { order: Order; items: OrderItem[] }) {
  const [order, setOrder] = useState<Order>(initial);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const sb = getBrowserClient();
    const channel = sb
      .channel(`order-${initial.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${initial.id}`
        },
        (payload) => {
          setOrder((prev) => ({ ...prev, ...(payload.new as Order) }));
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setLive(true);
      });

    return () => {
      channel.unsubscribe();
    };
  }, [initial.id]);

  const stepIdx = STEPS.indexOf(order.status as typeof STEPS[number]);

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 pt-12 pb-24">
      <Link href="/order" className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">← Andere bestelling opzoeken</Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Bestelling</div>
          <h1 className="font-display text-5xl mt-2 font-mono tracking-tight text-[var(--color-ink)]">{order.order_number}</h1>
          <div className={`inline-flex mt-3 px-3 py-1 rounded-full border text-xs uppercase tracking-[0.2em] font-medium ${statusColor(order.status)}`}>
            {statusLabel(order.status)}
          </div>
        </div>
        {live && (
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
            <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            Live updates aan
            <Wifi size={12} />
          </div>
        )}
      </div>

      {order.status !== "cancelled" && (
        <div className="mt-10 grid grid-cols-4 gap-2">
          {[
            { k: "paid", label: "Betaald", Icon: CheckCircle2 },
            { k: "processing", label: "In voorbereiding", Icon: Package },
            { k: "shipped", label: "Verzonden", Icon: Truck },
            { k: "delivered", label: "Geleverd", Icon: Home }
          ].map(({ k, label, Icon }, i) => {
            const done = i <= stepIdx;
            const current = i === stepIdx;
            return (
              <div key={k} className="text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  done
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-white border border-[var(--color-line)] text-[var(--color-ink-dim)]"
                } ${current ? "ring-4 ring-[var(--color-accent)]/20 scale-110" : ""}`}>
                  <Icon size={18} />
                </div>
                <div className={`mt-2 text-xs ${done ? "text-[var(--color-accent)] font-medium" : "text-[var(--color-ink-dim)]"}`}>{label}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 grid sm:grid-cols-2 gap-6 text-sm">
        <div className="p-5 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">Levering</div>
          <div className="mt-2 font-display text-lg text-[var(--color-ink)]">{order.guest_name}</div>
          <div className="text-[var(--color-ink-soft)]">
            {order.shipping_street}<br />
            {order.shipping_postal_code} {order.shipping_city}<br />
            {order.shipping_country}
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">Contact</div>
          <div className="mt-2">{order.guest_email}</div>
          {order.guest_phone && <div className="text-[var(--color-ink-soft)]">{order.guest_phone}</div>}
          <div className="text-[var(--color-ink-dim)] mt-2 text-xs">Geplaatst {new Date(order.created_at).toLocaleString("nl-BE")}</div>
        </div>
      </div>

      <div className="mt-8 p-5 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
        <h3 className="font-display text-2xl text-[var(--color-ink)]">Items</h3>
        <ul className="mt-4 space-y-3">
          {items.map(it => (
            <li key={it.id} className="flex justify-between text-sm">
              <span>{it.product_name} {it.product_vintage ?? ""} × {it.qty}</span>
              <span>{money(it.line_total_cents)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 pt-4 border-t border-[var(--color-line)] space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-[var(--color-ink-dim)]">Subtotaal</dt><dd>{money(order.subtotal_cents)}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--color-ink-dim)]">Levering</dt><dd>{order.shipping_cents === 0 ? "Gratis" : money(order.shipping_cents)}</dd></div>
          <div className="flex justify-between font-display text-lg pt-2 border-t border-[var(--color-line)]">
            <dt>Totaal</dt><dd className="text-[var(--color-cta)]">{money(order.total_cents)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 p-5 rounded-2xl bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 text-sm text-center">
        Geen account nog? <Link href="/account/register" className="text-[var(--color-accent)] font-medium underline">Registreer met dit e-mailadres</Link> en al je bestellingen verschijnen automatisch in je dashboard.
      </div>
    </div>
  );
}
