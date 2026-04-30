"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderLookup() {
  const router = useRouter();
  const [order, setOrder] = useState("");
  return (
    <div className="max-w-md mx-auto px-5 pt-20 pb-24">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Volgen</div>
      <h1 className="font-display text-5xl mt-2 text-[var(--color-ink)]">Vind je bestelling</h1>
      <p className="mt-3 text-[var(--color-ink-soft)] text-sm">
        Voer het ordernummer in dat we naar je e-mail stuurden — formaat: <span className="font-mono">VN-2026-00001</span>.
      </p>
      <form
        onSubmit={(e) => { e.preventDefault(); if (order) router.push(`/order/${encodeURIComponent(order.trim())}`); }}
        className="mt-6 flex gap-2"
      >
        <input
          value={order}
          onChange={e => setOrder(e.target.value)}
          placeholder="VN-2026-00001"
          className="flex-1 bg-white border border-[var(--color-line-strong)] rounded-full px-5 py-3 focus:outline-none focus:border-[var(--color-cta)]"
        />
        <button className="px-6 py-3 rounded-full btn-cta font-medium">Zoek</button>
      </form>
    </div>
  );
}
