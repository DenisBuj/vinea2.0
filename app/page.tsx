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
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/60 via-[var(--color-bg)]/40 to-[var(--color-bg)]" />
        </div>
        <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-24 pb-32">
          <div className="rise inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-gold-bright)] border border-[var(--color-gold)]/30 rounded-full px-3 py-1.5 mb-8">
            <Sparkles size={12} /> Vinea 2.0 · Drop 01
          </div>
          <h1 className="rise font-display text-[15vw] md:text-[8vw] leading-[0.95] tracking-tight max-w-5xl">
            Wines that <span className="font-italic-display text-[var(--color-gold-bright)]">mean</span>
            <br /> something.
          </h1>
          <p className="rise-2 mt-8 max-w-xl text-lg text-[var(--color-ink-dim)] leading-relaxed">
            Belgian-curated, soul-built. Not a catalogue — a tight roster of producers we believe in. Bottles that age, bottles that party, bottles that mean something the next morning.
          </p>
          <div className="rise-3 mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] font-medium hover:bg-[var(--color-gold-bright)] transition"
            >
              Shop the roster <ArrowRight size={16} />
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-[var(--color-gold)]/40 text-[var(--color-ink)] hover:bg-white/5 transition"
            >
              Take the sommelier quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y border-[var(--color-line)] py-5 overflow-hidden bg-[var(--color-bg-soft)]/30">
        <div className="flex marquee whitespace-nowrap gap-12 text-xl md:text-2xl font-display text-[var(--color-ink-dim)]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12 shrink-0">
              <span>· Piemonte</span>
              <span>· Champagne</span>
              <span>· Mosel</span>
              <span>· Wachau</span>
              <span>· Wallonie</span>
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
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">The roster</div>
            <h2 className="font-display text-4xl md:text-5xl mt-2">
              Featured <span className="font-italic-display">drops</span>
            </h2>
          </div>
          <Link href="/shop" className="text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-gold-bright)] flex items-center gap-1">
            See all <ArrowRight size={14} />
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
          <Link href="/particulier" className="group rounded-2xl border border-[var(--color-line)] p-8 hover:border-[var(--color-gold)]/40 hover:bg-[var(--color-bg-soft)]/40 transition">
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">For You</div>
            <h3 className="font-display text-3xl mt-3">Particulier</h3>
            <p className="mt-3 text-[var(--color-ink-dim)] text-sm">
              Free delivery in Belgium over €250. Curated boxes, monthly drops, sommelier-on-call.
            </p>
            <div className="mt-6 text-sm text-[var(--color-ink)] group-hover:text-[var(--color-gold-bright)] flex items-center gap-1">
              Discover →
            </div>
          </Link>
          <Link href="/bedrijven" className="group rounded-2xl border border-[var(--color-line)] p-8 hover:border-[var(--color-gold)]/40 hover:bg-[var(--color-bg-soft)]/40 transition">
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">For Teams</div>
            <h3 className="font-display text-3xl mt-3">Bedrijven</h3>
            <p className="mt-3 text-[var(--color-ink-dim)] text-sm">
              Corporate gifts, end-of-year boxes, and tasting events. Memorable beats expected, every time.
            </p>
            <div className="mt-6 text-sm text-[var(--color-ink)] group-hover:text-[var(--color-gold-bright)] flex items-center gap-1">
              Discover →
            </div>
          </Link>
          <Link href="/horeca" className="group rounded-2xl border border-[var(--color-line)] p-8 hover:border-[var(--color-gold)]/40 hover:bg-[var(--color-bg-soft)]/40 transition">
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">For Pros</div>
            <h3 className="font-display text-3xl mt-3">Horeca</h3>
            <p className="mt-3 text-[var(--color-ink-dim)] text-sm">
              Wine lists with edge. Producer storytelling, training, and the wine flies free at fun events.
            </p>
            <div className="mt-6 text-sm text-[var(--color-ink)] group-hover:text-[var(--color-gold-bright)] flex items-center gap-1">
              Discover →
            </div>
          </Link>
        </div>
      </section>

      {/* Service strip */}
      <section className="border-y border-[var(--color-line)] py-12 bg-[var(--color-bg-soft)]/30">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 grid md:grid-cols-3 gap-10">
          <div className="flex items-start gap-4">
            <Truck className="text-[var(--color-gold-bright)] mt-1" size={24} />
            <div>
              <div className="font-display text-lg">Free delivery over €250</div>
              <div className="text-sm text-[var(--color-ink-dim)] mt-1">Across Belgium. €15 flat under that. Discreet, dressed-down packaging.</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Wine className="text-[var(--color-gold-bright)] mt-1" size={24} />
            <div>
              <div className="font-display text-lg">Glass rental, free</div>
              <div className="text-sm text-[var(--color-ink-dim)] mt-1">Hosting? We lend you the right glasses for the right wines. No deposit.</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Award className="text-[var(--color-gold-bright)] mt-1" size={24} />
            <div>
              <div className="font-display text-lg">Sommelier-on-call</div>
              <div className="text-sm text-[var(--color-ink-dim)] mt-1">Stuck choosing? Ping us. Real humans, real opinions, fast replies.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 py-24">
        <div className="rounded-3xl bg-gradient-to-br from-[var(--color-wine)]/40 via-[var(--color-bg-soft)] to-[var(--color-bg-soft)] border border-[var(--color-gold)]/20 p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[var(--color-gold)]/10 blur-3xl" />
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">90 seconds</div>
          <h3 className="font-display text-4xl md:text-6xl mt-3 max-w-2xl leading-[1.05]">
            What kind of wine person <span className="font-italic-display text-[var(--color-gold-bright)]">are you</span>?
          </h3>
          <p className="mt-5 max-w-xl text-[var(--color-ink-dim)]">
            Six questions, zero gatekeeping. We'll match you to three bottles from the roster — picked, not generated.
          </p>
          <Link
            href="/quiz"
            className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[var(--color-ink)] text-[var(--color-bg)] font-medium hover:bg-[var(--color-cream)] transition"
          >
            Start the quiz <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
