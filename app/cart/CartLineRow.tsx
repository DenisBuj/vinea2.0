"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/supabase";
import { money } from "@/lib/format";
import { Minus, Plus, X } from "lucide-react";
import { useTransition } from "react";
import { updateQtyAction, removeFromCartAction } from "@/app/actions";

export default function CartLineRow({ product, qty }: { product: Product; qty: number }) {
  const [, start] = useTransition();
  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
      <Link href={`/shop/${product.slug}`} className="relative w-24 h-32 shrink-0 rounded-lg overflow-hidden bg-[var(--color-bg-soft)]">
        {product.image_url && <Image src={product.image_url} alt={product.name} fill className="object-cover" />}
      </Link>
      <div className="flex-1">
        <Link href={`/shop/${product.slug}`} className="font-display text-lg text-[var(--color-ink)]">
          {product.name} {product.vintage && <span className="text-[var(--color-ink-dim)] text-sm">{product.vintage}</span>}
        </Link>
        <div className="text-xs text-[var(--color-ink-dim)]">{product.producer} · {product.region}</div>
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center rounded-full border border-[var(--color-line-strong)]">
            <button
              aria-label="decrease"
              onClick={() => start(() => updateQtyAction(product.id, qty - 1))}
              className="px-3 py-2 hover:text-[var(--color-cta)]"
            >
              <Minus size={12} />
            </button>
            <span className="px-3 text-sm">{qty}</span>
            <button
              aria-label="increase"
              onClick={() => start(() => updateQtyAction(product.id, Math.min(product.stock, qty + 1)))}
              className="px-3 py-2 hover:text-[var(--color-cta)]"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="font-display text-xl text-[var(--color-cta)]">{money(product.price_cents * qty)}</div>
        </div>
      </div>
      <button
        aria-label="Remove"
        onClick={() => start(() => removeFromCartAction(product.id))}
        className="self-start text-[var(--color-ink-dim)] hover:text-[var(--color-cta)] p-2"
      >
        <X size={16} />
      </button>
    </div>
  );
}
