"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase-browser";
import { money, statusColor, statusLabel } from "@/lib/format";
import { Package, Wifi } from "lucide-react";

type Order = {
  id: string;
  order_number: string;
  status: string;
  total_cents: number;
  created_at: string;
  guest_email: string | null;
};

export default function OrdersPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getBrowserClient();

    let channel: ReturnType<typeof sb.channel> | null = null;

    sb.auth.getUser().then(async ({ data }) => {
      const userEmail = data.user?.email;
      if (!userEmail) {
        router.push("/account/login");
        return;
      }
      setEmail(userEmail);

      const { data: rows } = await sb
        .from("orders")
        .select("id, order_number, status, total_cents, created_at, guest_email")
        .ilike("guest_email", userEmail)
        .order("created_at", { ascending: false });
      setOrders((rows ?? []) as Order[]);
      setLoading(false);

      // Realtime subscription — push when any of these orders changes
      channel = sb
        .channel("orders-" + userEmail)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `guest_email=eq.${userEmail}`
          },
          (payload) => {
            const updated = payload.new as Order;
            setOrders((prev) =>
              prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o))
            );
          }
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "orders",
            filter: `guest_email=eq.${userEmail}`
          },
          (payload) => {
            setOrders((prev) => [payload.new as Order, ...prev]);
          }
        )
        .subscribe();
    });

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-5 pt-20 pb-24 text-[var(--color-ink-dim)]">Laden…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-10 pt-12 pb-24">
      <Link href="/account" className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">← Account</Link>
      <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Bestellingen</div>
          <h1 className="font-display text-5xl mt-2 text-[var(--color-ink)]">Mijn orders</h1>
          {email && <div className="text-sm text-[var(--color-ink-dim)] mt-1">{email}</div>}
        </div>
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
          <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          Live updates aan
          <Wifi size={12} />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="mt-12 p-10 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm text-center">
          <Package size={32} className="mx-auto text-[var(--color-accent)]" />
          <p className="mt-4 text-[var(--color-ink-soft)]">Nog geen bestellingen op dit e-mailadres.</p>
          <Link href="/shop" className="mt-5 inline-block px-6 py-3 rounded-full btn-cta font-medium">Naar de shop</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {orders.map(o => (
            <Link
              key={o.id}
              href={`/order/${o.order_number}`}
              className="block p-5 rounded-2xl border border-[var(--color-line)] bg-white hover:border-[var(--color-accent)] hover:shadow-md transition shadow-sm"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="font-mono text-[var(--color-ink)]">{o.order_number}</div>
                  <div className="text-xs text-[var(--color-ink-dim)] mt-1">{new Date(o.created_at).toLocaleString("nl-BE")}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-[0.15em] ${statusColor(o.status)}`}>
                    {statusLabel(o.status)}
                  </span>
                  <span className="font-display text-lg text-[var(--color-cta)]">{money(o.total_cents)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
