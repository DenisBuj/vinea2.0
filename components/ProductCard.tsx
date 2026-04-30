import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/supabase";
import { money, typeLabel } from "@/lib/format";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/shop/${p.slug}`}
      className="group block rounded-2xl border border-[var(--color-line)] bg-white hover:border-[var(--color-accent)]/40 hover:shadow-lg shadow-sm transition-all overflow-hidden"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-soft)]">
        {p.image_url && (
          <Image
            src={p.image_url}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full bg-white/95 backdrop-blur text-[var(--color-accent)] border border-[var(--color-accent)]/20 font-medium">
            {typeLabel(p.type)}
          </span>
          {p.featured && (
            <span className="text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full bg-[var(--color-cta)] text-white font-medium">
              Hype
            </span>
          )}
        </div>
        {p.stock <= 5 && p.stock > 0 && (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-medium">
            Nog {p.stock}
          </span>
        )}
        {p.stock === 0 && (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full bg-stone-200 text-stone-700 font-medium">
            Uitverkocht
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
          <span className="font-display text-xl text-[var(--color-cta)]">{money(p.price_cents)}</span>
          <span className="text-xs text-[var(--color-ink-dim)] group-hover:text-[var(--color-accent)] transition">
            Bekijk →
          </span>
        </div>
      </div>
    </Link>
  );
}
