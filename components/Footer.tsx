import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] mt-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-16 grid md:grid-cols-4 gap-12">
        <div>
          <div className="font-display text-3xl text-[var(--color-gold-bright)]">Vinea</div>
          <p className="mt-3 text-sm text-[var(--color-ink-dim)] max-w-xs">
            Wines and bubbles, taste-curated. Unique domains, unique wines — for those who actually care what's in the glass.
          </p>
          <div className="flex items-center gap-2 mt-5 text-[var(--color-ink-dim)]">
            <Instagram size={16} />
            <span className="text-sm">@vinea.wines</span>
          </div>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-[var(--color-ink-dim)]">
            <li><Link href="/shop">All wines</Link></li>
            <li><Link href="/shop?type=red">Red</Link></li>
            <li><Link href="/shop?type=white">White</Link></li>
            <li><Link href="/shop?type=rose">Rosé</Link></li>
            <li><Link href="/shop?type=sparkling">Sparkling</Link></li>
            <li><Link href="/shop?type=champagne">Champagne</Link></li>
            <li><Link href="/shop?type=orange">Orange</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-4">For</h4>
          <ul className="space-y-2 text-sm text-[var(--color-ink-dim)]">
            <li><Link href="/particulier">Particulier</Link></li>
            <li><Link href="/bedrijven">Bedrijven</Link></li>
            <li><Link href="/horeca">Horeca</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/quiz">Sommelier Quiz</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-[var(--color-ink-dim)]">
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5"/> Brussels, BE</li>
            <li className="flex items-start gap-2"><Mail size={14} className="mt-0.5"/> hello@vinea.be</li>
            <li><Link href="/order">Track an order</Link></li>
            <li><Link href="/admin">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-line)] py-6 text-center text-xs text-[var(--color-ink-dim)]">
        © {new Date().getFullYear()} Vinea 2.0 — Crafted with care. Drink responsibly.
      </div>
    </footer>
  );
}
