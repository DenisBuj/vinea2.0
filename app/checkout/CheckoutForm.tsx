"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { placeOrderAction } from "@/app/actions";
import { Lock, CreditCard } from "lucide-react";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-dim)] block mb-2">{label}</span>
    {children}
  </label>
);
const inp =
  "w-full bg-white border border-[var(--color-line-strong)] rounded-xl px-4 py-3 text-sm placeholder:text-[var(--color-ink-dim)] focus:outline-none focus:border-[var(--color-cta)]";

export default function CheckoutForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const input = {
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          phone: String(fd.get("phone") || ""),
          street: String(fd.get("street") || ""),
          city: String(fd.get("city") || ""),
          postal_code: String(fd.get("postal_code") || ""),
          country: String(fd.get("country") || "België"),
          notes: String(fd.get("notes") || "")
        };
        if (!input.name || !input.email || !input.street || !input.city || !input.postal_code) {
          setError("Vul alle verplichte velden in.");
          return;
        }
        setError(null);
        start(async () => {
          const res = await placeOrderAction(input);
          if (res.ok) router.push(`/checkout/success?o=${res.orderNumber}`);
          else setError(res.error);
        });
      }}
      className="space-y-8"
    >
      <section>
        <h3 className="font-display text-2xl">1 · Contact</h3>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <Field label="Volledige naam *"><input className={inp} name="name" required defaultValue="Denis Bujorean" /></Field>
          <Field label="E-mail *"><input className={inp} name="email" type="email" required defaultValue="denbuj04@gmail.com" /></Field>
          <Field label="Telefoon"><input className={inp} name="phone" defaultValue="+32 470 00 00 00" /></Field>
        </div>
      </section>

      <section>
        <h3 className="font-display text-2xl">2 · Levering</h3>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <Field label="Straat + nr *"><input className={inp} name="street" required defaultValue="Avenue Louise 100" /></Field>
          <Field label="Stad *"><input className={inp} name="city" required defaultValue="Brussel" /></Field>
          <Field label="Postcode *"><input className={inp} name="postal_code" required defaultValue="1050" /></Field>
          <Field label="Land *">
            <select className={inp} name="country" defaultValue="België">
              <option>België</option><option>Nederland</option><option>Frankrijk</option><option>Luxemburg</option><option>Duitsland</option>
            </select>
          </Field>
        </div>
      </section>

      <section>
        <h3 className="font-display text-2xl flex items-center gap-2">3 · Betaling <Lock size={14} className="text-[var(--color-cta)]" /></h3>
        <div className="mt-4 p-5 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/50">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--color-cta)] font-medium">
            <CreditCard size={14} /> Testkaart · Auto-goedgekeurd
          </div>
          <div className="mt-3 grid sm:grid-cols-3 gap-3">
            <input className={inp} placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" disabled />
            <input className={inp} placeholder="12 / 28" defaultValue="12 / 28" disabled />
            <input className={inp} placeholder="123" defaultValue="123" disabled />
          </div>
          <p className="mt-3 text-xs text-[var(--color-ink-dim)]">Geen echte betaling. Dit is een demo van de bestelflow.</p>
        </div>
      </section>

      <section>
        <Field label="Notities (optioneel)"><textarea name="notes" rows={3} className={inp} placeholder="Cadeau? Specifieke leverinstructies?" /></Field>
      </section>

      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">{error}</div>}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-4 rounded-full btn-cta font-medium disabled:opacity-60"
      >
        {pending ? "Bestelling bevestigen…" : "Plaats bestelling (test)"}
      </button>
    </form>
  );
}
