"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleWishlistAction } from "@/app/actions";

export default function WishlistButton({ productId, initiallyOn = false }: { productId: string; initiallyOn?: boolean }) {
  const [on, setOn] = useState(initiallyOn);
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() =>
        start(async () => {
          const next = await toggleWishlistAction(productId);
          setOn(next);
        })
      }
      disabled={pending}
      className={`inline-flex items-center justify-center w-12 h-12 rounded-full border transition ${
        on
          ? "bg-[var(--color-wine)]/40 border-[var(--color-wine-bright)]/60 text-[var(--color-wine-bright)]"
          : "border-[var(--color-line)] hover:border-[var(--color-gold)]/40 text-[var(--color-ink-dim)] hover:text-[var(--color-gold-bright)]"
      }`}
      aria-label="Add to wishlist"
    >
      <Heart size={18} fill={on ? "currentColor" : "none"} />
    </button>
  );
}
