import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/supabase";
import { money, typeLabel } from "@/lib/format";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/shop/${p.slug}`}
      className="group block rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/40 hover:border-[var(--color-gold)]/40 hover:bg-[var(--color-bg-soft)] transition-all overflow-hidden"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-[var(--color-bg-soft)] to-[var(--color-bg)]">
        {p.image_url && (
          <Image
            src={p.image_url}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full bg-black/60 backdrop-blur text-[var(--color-gold-bright)] border border-[var(--color-gold)]/30">
            {typeLabel(p.type)}
          </span>
          {p.featured && (
            <span className="text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full bg-[var(--color-wine)]/80 text-[var(--color-cream)]">
              Hype
            </span>
          )}
        </div>
        {p.stock <= 5 && p.stock > 0 && (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-200 border border-yellow-400/30">
            Only {p.stock} left
          </span>
        )}
        {p.stock === 0 && (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full bg-black/70 text-white/70">
            Sold out
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs text-[var(--color-ink-dim)]">
          {p.producer} · {p.region ?? p.country}
        </div>
        <div className="font-display text-lg leading-snug mt-1 text-[var(--color-ink)]">
          {p.name} {p.vintage && <span className="text-[var(--color-ink-dim)] text-sm">{p.vintage}</span>}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-xl text-[var(--color-gold-bright)]">{money(p.price_cents)}</span>
          <span className="text-xs text-[var(--color-ink-dim)] group-hover:text-[var(--color-gold-bright)] transition">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
