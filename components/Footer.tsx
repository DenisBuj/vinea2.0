import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] mt-32 bg-[var(--color-bg-soft)]/40">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-16 grid md:grid-cols-4 gap-12">
        <div>
          <div className="font-display text-3xl text-[var(--color-accent)]">Vinea</div>
          <p className="mt-3 text-sm text-[var(--color-ink-dim)] max-w-xs">
            Wijnen en bubbels op smaak geselecteerd. Unieke domeinen, unieke wijnen — voor wie écht geeft om wat in het glas zit.
          </p>
          <div className="flex items-center gap-2 mt-5 text-[var(--color-ink-dim)]">
            <Instagram size={16} />
            <span className="text-sm">@vinea.wines</span>
          </div>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-[var(--color-ink-dim)]">
            <li><Link href="/shop">Alle wijnen</Link></li>
            <li><Link href="/shop?type=red">Rood</Link></li>
            <li><Link href="/shop?type=white">Wit</Link></li>
            <li><Link href="/shop?type=rose">Rosé</Link></li>
            <li><Link href="/shop?type=sparkling">Bubbels</Link></li>
            <li><Link href="/shop?type=champagne">Champagne</Link></li>
            <li><Link href="/shop?type=orange">Oranje</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4">Voor</h4>
          <ul className="space-y-2 text-sm text-[var(--color-ink-dim)]">
            <li><Link href="/particulier">Particulier</Link></li>
            <li><Link href="/bedrijven">Bedrijven</Link></li>
            <li><Link href="/horeca">Horeca</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/quiz">Sommelier Quiz</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-[var(--color-ink-dim)]">
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5"/> Brussel, BE</li>
            <li className="flex items-start gap-2"><Mail size={14} className="mt-0.5"/> hello@vinea.be</li>
            <li><Link href="/account">Mijn account</Link></li>
            <li><Link href="/order">Bestelling volgen</Link></li>
            <li><Link href="/admin">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-line)] py-6 text-center text-xs text-[var(--color-ink-dim)]">
        © {new Date().getFullYear()} Vinea 2.0 — Met zorg gemaakt. Drink met mate.
      </div>
    </footer>
  );
}
