import Link from "next/link";
import { ShoppingBag, Heart, User, Search } from "lucide-react";
import { cartCount } from "@/lib/cart";

export default async function Navbar() {
  const count = await cartCount();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-bg)]/85 border-b border-[var(--color-line)]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="font-display text-2xl tracking-tight">
          <span className="text-[var(--color-accent)]">Vinea</span>
          <span className="text-[var(--color-ink-dim)] ml-1 text-sm align-super">2.0</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--color-ink-soft)]">
          <Link href="/shop" className="hover:text-[var(--color-accent)] transition">Shop</Link>
          <Link href="/shop?type=red" className="hover:text-[var(--color-accent)] transition">Reds</Link>
          <Link href="/shop?type=white" className="hover:text-[var(--color-accent)] transition">Whites</Link>
          <Link href="/shop?type=sparkling" className="hover:text-[var(--color-accent)] transition">Bubbles</Link>
          <Link href="/quiz" className="hover:text-[var(--color-accent)] transition">Sommelier Quiz</Link>
          <Link href="/horeca" className="hover:text-[var(--color-accent)] transition">Horeca</Link>
          <Link href="/bedrijven" className="hover:text-[var(--color-accent)] transition">Bedrijven</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/shop" aria-label="Search" className="p-2 rounded-full hover:bg-[var(--color-bg-soft)] text-[var(--color-ink-soft)]">
            <Search size={18} />
          </Link>
          <Link href="/account/wishlist" aria-label="Wishlist" className="p-2 rounded-full hover:bg-[var(--color-bg-soft)] text-[var(--color-ink-soft)]">
            <Heart size={18} />
          </Link>
          <Link href="/account" aria-label="Account" className="p-2 rounded-full hover:bg-[var(--color-bg-soft)] text-[var(--color-ink-soft)]">
            <User size={18} />
          </Link>
          <Link
            href="/cart"
            aria-label="Mand"
            className="relative p-2 pl-3 pr-3 ml-1 rounded-full btn-cta inline-flex items-center gap-2 text-sm"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Mand</span>
            {count > 0 && (
              <span className="bg-white/95 text-[var(--color-cta)] text-[11px] font-semibold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
