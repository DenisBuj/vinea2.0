"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBrowserClient } from "@/lib/supabase-browser";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="max-w-md mx-auto px-5 pt-20 pb-24">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Welkom terug</div>
      <h1 className="font-display text-5xl mt-2 text-[var(--color-ink)]">Inloggen</h1>
      <p className="mt-3 text-[var(--color-ink-soft)] text-sm">
        Log in om je bestellingen live te volgen en oude gastbestellingen automatisch op te halen.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          start(async () => {
            const sb = getBrowserClient();
            const { error } = await sb.auth.signInWithPassword({ email, password });
            if (error) {
              setError(error.message);
              return;
            }
            router.push("/account");
            router.refresh();
          });
        }}
        className="mt-8 space-y-4"
      >
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-dim)]" />
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="E-mailadres"
            className="w-full pl-12 pr-5 py-4 rounded-full bg-white border border-[var(--color-line-strong)] focus:outline-none focus:border-[var(--color-cta)]"
          />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-dim)]" />
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Wachtwoord"
            className="w-full pl-12 pr-5 py-4 rounded-full bg-white border border-[var(--color-line-strong)] focus:outline-none focus:border-[var(--color-cta)]"
          />
        </div>
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
        <button
          disabled={pending}
          className="w-full py-4 rounded-full btn-cta font-medium disabled:opacity-60"
        >
          {pending ? "Inloggen…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--color-ink-soft)] text-center">
        Nog geen account? <Link href="/account/register" className="text-[var(--color-accent)] font-medium">Registreer</Link>
      </p>
    </div>
  );
}
