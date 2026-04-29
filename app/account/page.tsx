import Link from "next/link";
import { Heart, Package } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 pt-12 pb-24">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">Account</div>
      <h1 className="font-display text-5xl md:text-6xl mt-2">Your space</h1>
      <p className="mt-4 text-[var(--color-ink-dim)] max-w-lg">
        Vinea 2.0 keeps it simple — no signup walls. Track orders by number, save bottles to your wishlist using your browser session.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <Link href="/account/wishlist" className="group rounded-2xl p-6 border border-[var(--color-line)] bg-[var(--color-bg-soft)]/40 hover:border-[var(--color-gold)]/40 transition">
          <Heart className="text-[var(--color-gold-bright)]" />
          <h3 className="font-display text-2xl mt-3">Wishlist</h3>
          <p className="text-sm text-[var(--color-ink-dim)] mt-2">Bottles you've saved for the next round.</p>
        </Link>
        <Link href="/order" className="group rounded-2xl p-6 border border-[var(--color-line)] bg-[var(--color-bg-soft)]/40 hover:border-[var(--color-gold)]/40 transition">
          <Package className="text-[var(--color-gold-bright)]" />
          <h3 className="font-display text-2xl mt-3">Track an order</h3>
          <p className="text-sm text-[var(--color-ink-dim)] mt-2">Look up by order number — no login needed.</p>
        </Link>
      </div>
    </div>
  );
}
