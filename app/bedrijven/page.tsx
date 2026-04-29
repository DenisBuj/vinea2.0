import Link from "next/link";
import Image from "next/image";

export default function BedrijvenPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=2000" alt="" fill className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/60 to-[var(--color-bg)]" />
        </div>
        <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-24 pb-24">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">For Teams</div>
          <h1 className="font-display text-6xl md:text-8xl mt-3 leading-[0.95]">Bedrijven</h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-dim)]">
            End-of-year boxes, client gifts, kickoff events. Wines that say something interesting on your behalf — and never feel like a generic basket.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="mailto:hello@vinea.be" className="px-7 py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] font-medium">Request a proposal</Link>
            <Link href="/shop" className="px-7 py-4 rounded-full border border-[var(--color-gold)]/40">Browse the roster</Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 lg:px-10 py-16 grid md:grid-cols-3 gap-5">
        {[
          { t: "Custom boxes", d: "Branded, themed, scaled — from 5 to 5000." },
          { t: "Logistics handled", d: "Belgium-wide delivery, tracked, with note cards." },
          { t: "Tasting events", d: "On-site or virtual. We tell stories your team will remember." }
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
