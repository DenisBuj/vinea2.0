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
          ? "bg-[var(--color-cta)]/10 border-[var(--color-cta)]/40 text-[var(--color-cta)]"
          : "bg-white border-[var(--color-line-strong)] hover:border-[var(--color-accent)] text-[var(--color-ink-dim)] hover:text-[var(--color-accent)]"
      }`}
      aria-label="Wishlist"
    >
      <Heart size={18} fill={on ? "currentColor" : "none"} />
    </button>
  );
}
