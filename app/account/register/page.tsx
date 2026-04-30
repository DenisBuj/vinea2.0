"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBrowserClient } from "@/lib/supabase-browser";
import { Mail, Lock, User, Package } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [linkedCount, setLinkedCount] = useState<number | null>(null);

  return (
    <div className="max-w-md mx-auto px-5 pt-20 pb-24">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Word lid</div>
      <h1 className="font-display text-5xl mt-2 text-[var(--color-ink)]">Account aanmaken</h1>
      <p className="mt-3 text-[var(--color-ink-soft)] text-sm">
        Registreer met het e-mailadres dat je gebruikte bij eerdere bestellingen — die worden automatisch aan je account gelinkt mét live statusupdates.
      </p>

      {linkedCount !== null ? (
        <div className="mt-10 p-6 rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 text-center">
          <Package size={32} className="mx-auto text-[var(--color-accent)]" />
          <h2 className="mt-4 font-display text-2xl text-[var(--color-ink)]">Welkom bij Vinea</h2>
          {linkedCount > 0 ? (
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
              We vonden <strong className="text-[var(--color-cta)]">{linkedCount}</strong> eerdere {linkedCount === 1 ? "bestelling" : "bestellingen"} op dit e-mailadres en hebben {linkedCount === 1 ? "die" : "ze"} gelinkt aan je account.
            </p>
          ) : (
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
              Je account is klaar. Tijd om iets goeds te ontdekken.
            </p>
          )}
          <Link href="/account/orders" className="mt-6 inline-block px-6 py-3 rounded-full btn-cta font-medium">
            Naar mijn bestellingen
          </Link>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            if (password.length < 6) {
              setError("Wachtwoord moet minstens 6 tekens lang zijn.");
              return;
            }
            start(async () => {
              const sb = getBrowserClient();
              const { data, error } = await sb.auth.signUp({
                email,
                password,
                options: { data: { full_name: name } }
              });
              if (error) {
                setError(error.message);
                return;
              }
              const userId = data.user?.id;
              if (userId) {
                // Link any past guest orders matching this email
                const { data: linkData } = await sb.rpc("link_guest_orders", {
                  p_email: email,
                  p_user_id: userId
                });
                setLinkedCount(typeof linkData === "number" ? linkData : 0);
              } else {
                setLinkedCount(0);
              }
            });
          }}
          className="mt-8 space-y-4"
        >
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-dim)]" />
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Volledige naam"
              className="w-full pl-12 pr-5 py-4 rounded-full bg-white border border-[var(--color-line-strong)] focus:outline-none focus:border-[var(--color-cta)]"
            />
          </div>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-dim)]" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="E-mailadres (gebruik dezelfde als bij je bestellingen!)"
              className="w-full pl-12 pr-5 py-4 rounded-full bg-white border border-[var(--color-line-strong)] focus:outline-none focus:border-[var(--color-cta)]"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-dim)]" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Wachtwoord (min. 6 tekens)"
              className="w-full pl-12 pr-5 py-4 rounded-full bg-white border border-[var(--color-line-strong)] focus:outline-none focus:border-[var(--color-cta)]"
            />
          </div>
          {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
          <button
            disabled={pending}
            className="w-full py-4 rounded-full btn-cta font-medium disabled:opacity-60"
          >
            {pending ? "Account aanmaken…" : "Maak account aan"}
          </button>
        </form>
      )}

      {linkedCount === null && (
        <p className="mt-6 text-sm text-[var(--color-ink-soft)] text-center">
          Heb je al een account? <Link href="/account/login" className="text-[var(--color-accent)] font-medium">Log in</Link>
        </p>
      )}
    </div>
  );
}
