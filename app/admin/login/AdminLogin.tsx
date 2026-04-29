"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="max-w-md mx-auto px-5 pt-24 pb-24">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">Vinea HQ</div>
      <h1 className="font-display text-5xl mt-2">Admin login</h1>
      <p className="mt-3 text-[var(--color-ink-dim)] text-sm">Single-password gate. For the demo: <span className="font-mono text-[var(--color-gold-bright)]">vinea-admin-2026</span></p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          start(async () => {
            const r = await fetch("/api/admin/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ password })
            });
            if (r.ok) { router.push("/admin"); router.refresh(); }
            else setError("Wrong password");
          });
        }}
        className="mt-8 space-y-4"
      >
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-dim)]" />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-12 pr-5 py-4 rounded-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-gold)]/50"
          />
        </div>
        {error && <div className="text-sm text-red-300">{error}</div>}
        <button disabled={pending} className="w-full py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] font-medium hover:bg-[var(--color-gold-bright)] transition disabled:opacity-60">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
