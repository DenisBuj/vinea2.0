"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderLookup() {
  const router = useRouter();
  const [order, setOrder] = useState("");
  return (
    <div className="max-w-md mx-auto px-5 pt-20 pb-24">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">Track</div>
      <h1 className="font-display text-5xl mt-2">Find your order</h1>
      <p className="mt-3 text-[var(--color-ink-dim)] text-sm">Enter the order number we sent to your email — looks like <span className="font-mono">VN-2026-00001</span>.</p>
      <form
        onSubmit={(e) => { e.preventDefault(); if (order) router.push(`/order/${encodeURIComponent(order.trim())}`); }}
        className="mt-6 flex gap-2"
      >
        <input
          value={order}
          onChange={e => setOrder(e.target.value)}
          placeholder="VN-2026-00001"
          className="flex-1 bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-full px-5 py-3 focus:outline-none focus:border-[var(--color-gold)]/50"
        />
        <button className="px-6 py-3 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] font-medium">Find</button>
      </form>
    </div>
  );
}
