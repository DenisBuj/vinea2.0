"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBrowserClient } from "@/lib/supabase-browser";
import { Heart, Package, LogOut, User as UserIcon } from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getBrowserClient();
    sb.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUser({
          email: data.user.email,
          name: (data.user.user_metadata as any)?.full_name
        });
      }
      setLoading(false);
    });
  }, []);

  const logout = async () => {
    const sb = getBrowserClient();
    await sb.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-5 pt-20 pb-24 text-[var(--color-ink-dim)]">Laden…</div>;
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-5 lg:px-10 pt-12 pb-24">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Account</div>
        <h1 className="font-display text-5xl md:text-6xl mt-2 text-[var(--color-ink)]">Welkom</h1>
        <p className="mt-4 text-[var(--color-ink-soft)] max-w-lg">
          Log in voor je bestellingsgeschiedenis met live updates, of bestel als gast en volg je order met je ordernummer.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          <Link href="/account/login" className="group rounded-2xl p-6 border border-[var(--color-line)] bg-white hover:border-[var(--color-accent)] hover:shadow-lg transition shadow-sm">
            <UserIcon className="text-[var(--color-accent)]" />
            <h3 className="font-display text-2xl mt-3 text-[var(--color-ink)]">Inloggen</h3>
            <p className="text-sm text-[var(--color-ink-soft)] mt-2">Naar je dashboard met live order-updates.</p>
          </Link>
          <Link href="/account/register" className="group rounded-2xl p-6 border border-[var(--color-line)] bg-white hover:border-[var(--color-accent)] hover:shadow-lg transition shadow-sm">
            <Package className="text-[var(--color-accent)]" />
            <h3 className="font-display text-2xl mt-3 text-[var(--color-ink)]">Account aanmaken</h3>
            <p className="text-sm text-[var(--color-ink-soft)] mt-2">Eerdere gastbestellingen worden automatisch gelinkt.</p>
          </Link>
        </div>

        <div className="mt-12 text-center text-sm text-[var(--color-ink-dim)]">
          Of <Link href="/order" className="text-[var(--color-accent)] underline">volg een gastbestelling</Link> met je ordernummer.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 pt-12 pb-24">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Account</div>
      <h1 className="font-display text-5xl md:text-6xl mt-2 text-[var(--color-ink)]">
        Hey {user.name?.split(" ")[0] ?? user.email.split("@")[0]}
      </h1>
      <p className="mt-3 text-[var(--color-ink-soft)] text-sm">{user.email}</p>

      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        <Link href="/account/orders" className="group rounded-2xl p-6 border border-[var(--color-line)] bg-white hover:border-[var(--color-accent)] hover:shadow-lg transition shadow-sm">
          <Package className="text-[var(--color-accent)]" />
          <h3 className="font-display text-xl mt-3 text-[var(--color-ink)]">Bestellingen</h3>
          <p className="text-sm text-[var(--color-ink-soft)] mt-2">Live status updates.</p>
        </Link>
        <Link href="/account/wishlist" className="group rounded-2xl p-6 border border-[var(--color-line)] bg-white hover:border-[var(--color-accent)] hover:shadow-lg transition shadow-sm">
          <Heart className="text-[var(--color-accent)]" />
          <h3 className="font-display text-xl mt-3 text-[var(--color-ink)]">Wishlist</h3>
          <p className="text-sm text-[var(--color-ink-soft)] mt-2">Bewaarde flessen.</p>
        </Link>
        <button onClick={logout} className="rounded-2xl p-6 border border-[var(--color-line)] bg-white hover:border-[var(--color-cta)] hover:shadow-lg transition text-left shadow-sm">
          <LogOut className="text-[var(--color-cta)]" />
          <h3 className="font-display text-xl mt-3 text-[var(--color-ink)]">Uitloggen</h3>
          <p className="text-sm text-[var(--color-ink-soft)] mt-2">Sluit deze sessie.</p>
        </button>
      </div>
    </div>
  );
}
