"use client";

import { useState, useTransition } from "react";
import { updateStockAction } from "@/app/actions";

export default function StockInput({ productId, initial }: { productId: string; initial: number }) {
  const [v, setV] = useState(initial);
  const [, start] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <div className="inline-flex items-center gap-2 justify-end">
      <input
        type="number"
        min={0}
        value={v}
        onChange={e => setV(Math.max(0, parseInt(e.target.value || "0", 10)))}
        onBlur={() => {
          start(async () => {
            await updateStockAction(productId, v);
            setSaved(true);
            setTimeout(() => setSaved(false), 1200);
          });
        }}
        className={`w-20 text-right px-3 py-1.5 rounded-lg bg-[var(--color-bg-soft)] border focus:outline-none ${
          v === 0 ? "border-red-500/40" : v <= 10 ? "border-yellow-500/40" : "border-[var(--color-line)]"
        } focus:border-[var(--color-gold)]/50`}
      />
      {saved && <span className="text-xs text-emerald-300">✓</span>}
    </div>
  );
}
