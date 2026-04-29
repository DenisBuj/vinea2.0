import { isAdmin } from "@/lib/admin";
import AdminLogin from "../../../login/AdminLogin";
import { supabase, Order, OrderItem } from "@/lib/supabase";
import { money } from "@/lib/format";
import { notFound } from "next/navigation";
import PrintTrigger from "./PrintTrigger";

export const dynamic = "force-dynamic";

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return <AdminLogin />;
  const { id } = await params;
  const { data: orderData } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (!orderData) return notFound();
  const order = orderData as Order;
  const { data: itemsData } = await supabase.from("order_items").select("*").eq("order_id", order.id);
  const items = (itemsData ?? []) as OrderItem[];

  return (
    <div className="bg-white text-black min-h-screen p-10 font-sans">
      <PrintTrigger />

      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between border-b border-black/20 pb-6">
          <div>
            <div className="text-3xl font-serif tracking-tight">Vinea</div>
            <div className="text-sm">Brussels, Belgium · hello@vinea.be</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.3em] text-black/60">Packing slip</div>
            <div className="font-mono text-lg mt-1">{order.order_number}</div>
            <div className="text-xs">{new Date(order.created_at).toLocaleString("en-GB")}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-6 text-sm">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-black/60">Ship to</div>
            <div className="mt-1 font-medium">{order.guest_name}</div>
            <div>{order.shipping_street}</div>
            <div>{order.shipping_postal_code} {order.shipping_city}</div>
            <div>{order.shipping_country}</div>
            <div className="mt-2">{order.guest_email}</div>
            {order.guest_phone && <div>{order.guest_phone}</div>}
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-black/60">Payment</div>
            <div className="mt-1">{order.payment_method}</div>
            <div className="mt-3 text-xs uppercase tracking-[0.2em] text-black/60">Status</div>
            <div className="mt-1 capitalize">{order.status}</div>
          </div>
        </div>

        <table className="w-full mt-8 text-sm">
          <thead className="border-y border-black/30">
            <tr><th className="text-left py-2">Item</th><th className="text-right py-2">Qty</th><th className="text-right py-2">Price</th><th className="text-right py-2">Total</th></tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="border-b border-black/10">
                <td className="py-2">{it.product_name}{it.product_vintage ? ` ${it.product_vintage}` : ""}</td>
                <td className="py-2 text-right">{it.qty}</td>
                <td className="py-2 text-right">{money(it.unit_price_cents)}</td>
                <td className="py-2 text-right">{money(it.line_total_cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 ml-auto w-64 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{money(order.subtotal_cents)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{order.shipping_cents === 0 ? "Free" : money(order.shipping_cents)}</span></div>
          <div className="flex justify-between border-t border-black/30 mt-2 pt-2 font-bold text-lg"><span>Total</span><span>{money(order.total_cents)}</span></div>
        </div>

        {order.notes && (
          <div className="mt-8 p-4 border border-black/20 text-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-black/60">Customer note</div>
            <p className="mt-1 italic">{order.notes}</p>
          </div>
        )}

        <div className="mt-12 text-center text-xs text-black/60 italic">Cheers — drink responsibly.</div>
      </div>
    </div>
  );
}
