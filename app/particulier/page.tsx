import Link from "next/link";
import Image from "next/image";

export default function ParticulierPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=2000" alt="" fill className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/60 to-[var(--color-bg)]" />
        </div>
        <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-24 pb-24">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">For You</div>
          <h1 className="font-display text-6xl md:text-8xl mt-3 leading-[0.95]">Particulier</h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-dim)]">
            Wines for your table, your gifts, your evenings. Free delivery in Belgium over €250 and a sommelier in your messages, not a chatbot.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/shop" className="px-7 py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] font-medium">Shop now</Link>
            <Link href="/quiz" className="px-7 py-4 rounded-full border border-[var(--color-gold)]/40">Take the quiz</Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 lg:px-10 py-16 grid md:grid-cols-3 gap-5">
        {[
          { t: "Curated, never bloated", d: "A roster, not a catalog. Every bottle earns its spot." },
          { t: "Free over €250", d: "In Belgium. €15 flat under that. Discreet, dressed-down packaging." },
          { t: "Sommelier-on-call", d: "DM us. Real humans, real opinions, fast replies." }
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
