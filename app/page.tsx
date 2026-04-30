import Link from "next/link";
import Image from "next/image";
import { supabase, Product } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Sparkles, Wine, Truck, Award } from "lucide-react";

export const revalidate = 60;

export default async function Home() {
  const { data: featured } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("hype_score", { ascending: false })
    .limit(8);

  const products = (featured ?? []) as Product[];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=2000&q=80"
            alt=""
            fill
            priority
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/70 via-[var(--color-bg)]/85 to-[var(--color-bg)]" />
        </div>
        <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-24 pb-32">
          <div className="rise inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] border border-[var(--color-accent)]/30 rounded-full px-3 py-1.5 mb-8">
            <Sparkles size={12} /> Vinea 2.0 · Drop 01
          </div>
          <h1 className="rise font-display text-[15vw] md:text-[8vw] leading-[0.95] tracking-tight max-w-5xl text-[var(--color-ink)]">
            Wijnen die <span className="font-italic-display text-[var(--color-cta)]">iets</span>
            <br /> betekenen.
          </h1>
          <p className="rise-2 mt-8 max-w-xl text-lg text-[var(--color-ink-soft)] leading-relaxed">
            Belgisch gecureerd, met ziel gebouwd. Geen catalogus — een strakke selectie producenten waar we in geloven. Flessen die ouder worden, flessen die feesten, flessen die de volgende ochtend nog iets betekenen.
          </p>
          <div className="rise-3 mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full btn-cta font-medium"
            >
              Shop de selectie <ArrowRight size={16} />
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full btn-outline"
            >
              Doe de sommelier-quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y border-[var(--color-line)] py-5 overflow-hidden bg-[var(--color-bg-soft)]/60">
        <div className="flex marquee whitespace-nowrap gap-12 text-xl md:text-2xl font-display text-[var(--color-accent)]/60">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12 shrink-0">
              <span>· Piemonte</span>
              <span>· Champagne</span>
              <span>· Mosel</span>
              <span>· Wachau</span>
              <span>· Wallonië</span>
              <span>· Mendoza</span>
              <span>· Etna</span>
              <span>· Roero</span>
              <span>· Loire</span>
              <span>· Bandol</span>
              <span>· Rioja</span>
              <span>· Penedès</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">De selectie</div>
            <h2 className="font-display text-4xl md:text-5xl mt-2 text-[var(--color-ink)]">
              Featured <span className="font-italic-display">drops</span>
            </h2>
          </div>
          <Link href="/shop" className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] flex items-center gap-1">
            Alles bekijken <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* Three pillars */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 py-24">
        <div className="grid md:grid-cols-3 gap-5">
          <Link href="/particulier" className="group rounded-2xl border border-[var(--color-line)] bg-white p-8 hover:border-[var(--color-accent)] hover:shadow-lg transition">
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Voor jou</div>
            <h3 className="font-display text-3xl mt-3 text-[var(--color-ink)]">Particulier</h3>
            <p className="mt-3 text-[var(--color-ink-soft)] text-sm">
              Gratis levering in België vanaf €250. Curated boxes, maandelijkse drops, sommelier-on-call.
            </p>
            <div className="mt-6 text-sm text-[var(--color-accent)] group-hover:text-[var(--color-accent-bright)] flex items-center gap-1">
              Ontdek →
            </div>
          </Link>
          <Link href="/bedrijven" className="group rounded-2xl border border-[var(--color-line)] bg-white p-8 hover:border-[var(--color-accent)] hover:shadow-lg transition">
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Voor teams</div>
            <h3 className="font-display text-3xl mt-3 text-[var(--color-ink)]">Bedrijven</h3>
            <p className="mt-3 text-[var(--color-ink-soft)] text-sm">
              Eindejaarsboxen, klantgeschenken, kick-off events. Elke keer iets dat blijft hangen — nooit een generieke mand.
            </p>
            <div className="mt-6 text-sm text-[var(--color-accent)] group-hover:text-[var(--color-accent-bright)] flex items-center gap-1">
              Ontdek →
            </div>
          </Link>
          <Link href="/horeca" className="group rounded-2xl border border-[var(--color-line)] bg-white p-8 hover:border-[var(--color-accent)] hover:shadow-lg transition">
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Voor pros</div>
            <h3 className="font-display text-3xl mt-3 text-[var(--color-ink)]">Horeca</h3>
            <p className="mt-3 text-[var(--color-ink-soft)] text-sm">
              Wijnkaarten met karakter. Producent-storytelling, training, en gratis glasverhuur bij events.
            </p>
            <div className="mt-6 text-sm text-[var(--color-accent)] group-hover:text-[var(--color-accent-bright)] flex items-center gap-1">
              Ontdek →
            </div>
          </Link>
        </div>
      </section>

      {/* Service strip */}
      <section className="border-y border-[var(--color-line)] py-12 bg-[var(--color-bg-soft)]/60">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 grid md:grid-cols-3 gap-10">
          <div className="flex items-start gap-4">
            <Truck className="text-[var(--color-accent)] mt-1" size={24} />
            <div>
              <div className="font-display text-lg text-[var(--color-ink)]">Gratis levering vanaf €250</div>
              <div className="text-sm text-[var(--color-ink-dim)] mt-1">Heel België. €15 forfait daaronder. Discreet, ingetogen verpakt.</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Wine className="text-[var(--color-accent)] mt-1" size={24} />
            <div>
              <div className="font-display text-lg text-[var(--color-ink)]">Glasverhuur, gratis</div>
              <div className="text-sm text-[var(--color-ink-dim)] mt-1">Hosting? Wij lenen u de juiste glazen voor de juiste wijnen. Geen waarborg.</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Award className="text-[var(--color-accent)] mt-1" size={24} />
            <div>
              <div className="font-display text-lg text-[var(--color-ink)]">Sommelier-on-call</div>
              <div className="text-sm text-[var(--color-ink-dim)] mt-1">Vast in de keuze? Stuur ons een berichtje. Échte mensen, échte meningen.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 py-24">
        <div className="rounded-3xl bg-gradient-to-br from-[var(--color-accent)]/10 via-[var(--color-bg-soft)] to-[var(--color-bg-warm)]/60 border border-[var(--color-line)] p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[var(--color-accent)]/8 blur-3xl" />
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">90 seconden</div>
          <h3 className="font-display text-4xl md:text-6xl mt-3 max-w-2xl leading-[1.05] text-[var(--color-ink)]">
            Wat voor wijnpersoon <span className="font-italic-display text-[var(--color-cta)]">ben jij</span>?
          </h3>
          <p className="mt-5 max-w-xl text-[var(--color-ink-soft)]">
            Zes vragen, geen gatekeeping. We matchen je aan drie flessen uit de selectie — gekozen, niet gegenereerd.
          </p>
          <Link
            href="/quiz"
            className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full btn-accent font-medium"
          >
            Start de quiz <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
