import Link from "next/link";
import { CheckCircle2, Package, Truck, UserPlus } from "lucide-react";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ o?: string }> }) {
  const sp = await searchParams;
  const order = sp.o ?? "VN-XXXX";
  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-10 pt-20 pb-24 text-center">
      <CheckCircle2 size={56} className="mx-auto text-[var(--color-cta)]" />
      <h1 className="font-display text-5xl md:text-6xl mt-6 leading-[1.05] text-[var(--color-ink)]">
        Proost — je bestelling is <span className="font-italic-display text-[var(--color-cta)]">binnen</span>.
      </h1>
      <p className="mt-4 text-[var(--color-ink-soft)]">
        Bestelling <span className="font-mono text-[var(--color-ink)]">{order}</span> · Een bevestiging komt zo in je inbox.
      </p>

      <div className="mt-12 grid sm:grid-cols-2 gap-4 text-left">
        <div className="p-5 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
          <Package size={20} className="text-[var(--color-accent)]" />
          <h3 className="font-display text-xl mt-3">We bereiden je bestelling voor</h3>
          <p className="text-sm text-[var(--color-ink-soft)] mt-2">Met de hand gepakt, temperatuur-bewust, plasticvrij waar mogelijk.</p>
        </div>
        <div className="p-5 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
          <Truck size={20} className="text-[var(--color-accent)]" />
          <h3 className="font-display text-xl mt-3">Geleverd in 2–4 werkdagen</h3>
          <p className="text-sm text-[var(--color-ink-soft)] mt-2">België & Benelux. Volg vanuit je inbox of hier op elk moment.</p>
        </div>
      </div>

      <div className="mt-10 p-5 rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 text-left">
        <div className="flex items-start gap-3">
          <UserPlus size={20} className="text-[var(--color-accent)] mt-1" />
          <div className="flex-1">
            <h3 className="font-display text-lg text-[var(--color-ink)]">Maak een account aan</h3>
            <p className="text-sm text-[var(--color-ink-soft)] mt-1">Registreer met hetzelfde e-mailadres en deze bestelling verschijnt automatisch in je dashboard met live statusupdates.</p>
            <Link href="/account/register" className="mt-3 inline-block text-sm text-[var(--color-accent)] font-medium hover:underline">Account aanmaken →</Link>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link href={`/order/${order}`} className="px-6 py-3 rounded-full btn-cta font-medium">Volg deze bestelling</Link>
        <Link href="/shop" className="px-6 py-3 rounded-full btn-outline">Verder winkelen</Link>
      </div>
    </div>
  );
}
