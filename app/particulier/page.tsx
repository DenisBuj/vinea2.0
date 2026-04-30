import Link from "next/link";
import Image from "next/image";

export default function ParticulierPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=2000" alt="" fill className="object-cover opacity-12" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/80 to-[var(--color-bg)]" />
        </div>
        <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-24 pb-24">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Voor jou</div>
          <h1 className="font-display text-6xl md:text-8xl mt-3 leading-[0.95] text-[var(--color-ink)]">Particulier</h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-soft)]">
            Wijnen voor je tafel, je cadeaus, je avonden. Gratis levering in België vanaf €250 en een sommelier in je berichten — geen chatbot.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/shop" className="px-7 py-4 rounded-full btn-cta font-medium">Shop nu</Link>
            <Link href="/quiz" className="px-7 py-4 rounded-full btn-outline">Doe de quiz</Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 lg:px-10 py-16 grid md:grid-cols-3 gap-5">
        {[
          { t: "Gecureerd, nooit overvol", d: "Een selectie, geen catalogus. Elke fles verdient zijn plaats." },
          { t: "Gratis vanaf €250", d: "In België. €15 forfait daaronder. Discreet, ingetogen verpakt." },
          { t: "Sommelier-on-call", d: "DM ons. Échte mensen, échte meningen, snelle antwoorden." }
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
