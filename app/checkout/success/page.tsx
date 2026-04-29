import Link from "next/link";
import { CheckCircle2, Package, Truck } from "lucide-react";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ o?: string }> }) {
  const sp = await searchParams;
  const order = sp.o ?? "VN-XXXX";
  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-10 pt-20 pb-24 text-center">
      <CheckCircle2 size={56} className="mx-auto text-[var(--color-gold-bright)]" />
      <h1 className="font-display text-5xl md:text-6xl mt-6 leading-[1.05]">
        Cheers — your order is <span className="font-italic-display text-[var(--color-gold-bright)]">in</span>.
      </h1>
      <p className="mt-4 text-[var(--color-ink-dim)]">
        Order <span className="font-mono text-[var(--color-ink)]">{order}</span> · A confirmation will land in your inbox shortly.
      </p>

      <div className="mt-12 grid sm:grid-cols-2 gap-4 text-left">
        <div className="p-5 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/40">
          <Package size={20} className="text-[var(--color-gold-bright)]" />
          <h3 className="font-display text-xl mt-3">We're prepping your order</h3>
          <p className="text-sm text-[var(--color-ink-dim)] mt-2">Hand-packed, temperature-aware, no plastic where we can avoid it.</p>
        </div>
        <div className="p-5 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/40">
          <Truck size={20} className="text-[var(--color-gold-bright)]" />
          <h3 className="font-display text-xl mt-3">Delivered in 2–4 working days</h3>
          <p className="text-sm text-[var(--color-ink-dim)] mt-2">Belgium & Benelux. Track from your inbox or right here at any time.</p>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
        <Link href={`/order/${order}`} className="px-6 py-3 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] font-medium">Track this order</Link>
        <Link href="/shop" className="px-6 py-3 rounded-full border border-[var(--color-line)]">Keep shopping</Link>
      </div>
    </div>
  );
}
