import Link from "next/link";
import Image from "next/image";

export default function BedrijvenPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=2000" alt="" fill className="object-cover opacity-12" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/80 to-[var(--color-bg)]" />
        </div>
        <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-24 pb-24">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Voor teams</div>
          <h1 className="font-display text-6xl md:text-8xl mt-3 leading-[0.95] text-[var(--color-ink)]">Bedrijven</h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-soft)]">
            Eindejaarsboxen, klantgeschenken, kick-off events. Wijnen die iets interessants zeggen namens jou — nooit een generieke mand.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="mailto:hello@vinea.be" className="px-7 py-4 rounded-full btn-cta font-medium">Vraag een voorstel</Link>
            <Link href="/shop" className="px-7 py-4 rounded-full btn-outline">Bekijk de selectie</Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 lg:px-10 py-16 grid md:grid-cols-3 gap-5">
        {[
          { t: "Custom boxen", d: "Branded, themed, op maat — van 5 tot 5000." },
          { t: "Logistiek geregeld", d: "Heel België, getrackt, met een persoonlijke notekaart." },
          { t: "Tasting events", d: "On-site of virtueel. Verhalen die je team onthoudt." }
        ].map(c => (
          <div key={c.t} className="p-6 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
            <div className="font-display text-xl text-[var(--color-ink)]">{c.t}</div>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
