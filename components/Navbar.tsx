import Link from "next/link";
import { ShoppingBag, Heart, User, Search } from "lucide-react";
import { cartCount } from "@/lib/cart";

export default async function Navbar() {
  const count = await cartCount();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-bg)]/70 border-b border-[var(--color-line)]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="font-display text-2xl tracking-tight">
          <span className="text-[var(--color-gold-bright)]">Vinea</span>
          <span className="text-[var(--color-ink-dim)] ml-1 text-sm align-super">2.0</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--color-ink-dim)]">
          <Link href="/shop" className="hover:text-[var(--color-ink)] transition">Shop</Link>
          <Link href="/shop?type=red" className="hover:text-[var(--color-ink)] transition">Reds</Link>
          <Link href="/shop?type=white" className="hover:text-[var(--color-ink)] transition">Whites</Link>
          <Link href="/shop?type=sparkling" className="hover:text-[var(--color-ink)] transition">Bubbles</Link>
          <Link href="/quiz" className="hover:text-[var(--color-gold-bright)] transition">Sommelier Quiz</Link>
          <Link href="/horeca" className="hover:text-[var(--color-ink)] transition">Horeca</Link>
          <Link href="/bedrijven" className="hover:text-[var(--color-ink)] transition">Bedrijven</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/shop" aria-label="Search" className="p-2 rounded-full hover:bg-white/5">
            <Search size={18} />
          </Link>
          <Link href="/account/wishlist" aria-label="Wishlist" className="p-2 rounded-full hover:bg-white/5">
            <Heart size={18} />
          </Link>
          <Link href="/account" aria-label="Account" className="p-2 rounded-full hover:bg-white/5">
            <User size={18} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative p-2 rounded-full hover:bg-white/5"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[var(--color-wine-bright)] text-[var(--color-cream)] text-[10px] font-medium rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
