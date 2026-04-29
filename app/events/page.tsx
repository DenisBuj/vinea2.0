import Link from "next/link";
import Image from "next/image";

export default function EventsPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="https://images.unsplash.com/photo-1592156328757-067ed09a2b0c?w=2000" alt="" fill className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/60 to-[var(--color-bg)]" />
        </div>
        <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-24 pb-24">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">Events</div>
          <h1 className="font-display text-6xl md:text-8xl mt-3 leading-[0.95]">
            Wine flies <span className="font-italic-display text-[var(--color-gold-bright)]">free</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-dim)]">
            Weddings, launches, dinner parties, after-parties. We bring the bottles, the glasses (free rental), and the curiosity. You bring the people.
          </p>
          <Link href="mailto:events@vinea.be" className="mt-8 inline-block px-7 py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] font-medium">Book a tasting</Link>
        </div>
      </section>
    </div>
  );
}
