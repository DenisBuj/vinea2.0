import Link from "next/link";
import Image from "next/image";

export default function HorecaPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=2000" alt="" fill className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/60 to-[var(--color-bg)]" />
        </div>
        <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-24 pb-24">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">For Pros</div>
          <h1 className="font-display text-6xl md:text-8xl mt-3 leading-[0.95]">Horeca</h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-dim)]">
            Wine lists with edge. Producer storytelling, staff training, fair pricing, and unrepeated SKUs. Wine flies free at fun events.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="mailto:horeca@vinea.be" className="px-7 py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] font-medium">Talk to a sommelier</Link>
            <Link href="/shop" className="px-7 py-4 rounded-full border border-[var(--color-gold)]/40">Browse the roster</Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 lg:px-10 py-16 grid md:grid-cols-3 gap-5">
        {[
          { t: "Real producer stories", d: "Each wine ships with the why. Your floor learns it in 5 minutes." },
          { t: "Fair, transparent pricing", d: "No mystery, no slabs of margin you'll need to argue around." },
          { t: "Staff training", d: "We run quick, useful tastings — not lectures." }
        ].map(c => (
          <div key={c.t} className="p-6 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/40">
            <div className="font-display text-xl">{c.t}</div>
            <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
