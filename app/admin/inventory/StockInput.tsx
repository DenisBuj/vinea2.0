"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { updateStockAction, addStockAction } from "@/app/actions";

export default function StockInput({
  productId,
  initial,
  mode = "set"
}: { productId: string; initial: number; mode?: "set" | "add" }) {
  const [v, setV] = useState(mode === "set" ? initial : 0);
  const [stock, setStock] = useState(initial);
  const [, start] = useTransition();
  const [saved, setSaved] = useState(false);

  if (mode === "set") {
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
              setStock(v);
              setSaved(true);
              setTimeout(() => setSaved(false), 1200);
            });
          }}
          className={`w-20 text-right px-3 py-1.5 rounded-lg bg-white border focus:outline-none ${
            v === 0 ? "border-red-300" : v <= 10 ? "border-amber-300" : "border-[var(--color-line)]"
          } focus:border-[var(--color-accent)]`}
        />
        {saved && <span className="text-xs text-emerald-600">✓</span>}
      </div>
    );
  }

  // mode === "add"
  return (
    <div className="inline-flex items-center gap-2 justify-end">
      <input
        type="number"
        min={1}
        placeholder="0"
        value={v || ""}
        onChange={e => setV(Math.max(0, parseInt(e.target.value || "0", 10)))}
        className="w-16 text-right px-2 py-1.5 rounded-lg bg-white border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-accent)]"
      />
      <button
        disabled={v <= 0}
        onClick={() => {
          start(async () => {
            const newTotal = await addStockAction(productId, v);
            setStock(newTotal);
            setV(0);
            setSaved(true);
            setTimeout(() => setSaved(false), 1200);
          });
        }}
        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[var(--color-accent)] text-white text-xs disabled:opacity-40"
      >
        <Plus size={12} /> Voeg toe
      </button>
      {saved && <span className="text-xs text-emerald-600">+{stock}</span>}
    </div>
  );
}
