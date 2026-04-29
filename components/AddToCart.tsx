"use client";

import { useState, useTransition } from "react";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { addToCartAction } from "@/app/actions";

export default function AddToCart({ productId, stock }: { productId: string; stock: number }) {
  const [qty, setQty] = useState(1);
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  if (stock === 0) {
    return (
      <button disabled className="w-full py-4 rounded-full bg-white/5 text-[var(--color-ink-dim)] cursor-not-allowed">
        Sold out — back soon
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center rounded-full border border-[var(--color-line)] bg-[var(--color-bg-soft)]">
        <button
          aria-label="decrease"
          onClick={() => setQty(q => Math.max(1, q - 1))}
          className="px-4 py-3 hover:text-[var(--color-gold-bright)]"
        >
          <Minus size={14} />
        </button>
        <span className="px-3 min-w-8 text-center">{qty}</span>
        <button
          aria-label="increase"
          onClick={() => setQty(q => Math.min(stock, q + 1))}
          className="px-4 py-3 hover:text-[var(--color-gold-bright)]"
        >
          <Plus size={14} />
        </button>
      </div>
      <button
        onClick={() =>
          start(async () => {
            await addToCartAction(productId, qty);
            setDone(true);
            setTimeout(() => setDone(false), 1800);
          })
        }
        disabled={pending}
        className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] font-medium hover:bg-[var(--color-gold-bright)] transition disabled:opacity-60"
      >
        {done ? (
          <>
            <Check size={16} /> Added to cart
          </>
        ) : (
          <>
            <ShoppingBag size={16} /> {pending ? "Adding…" : "Add to cart"}
          </>
        )}
      </button>
    </div>
  );
}
