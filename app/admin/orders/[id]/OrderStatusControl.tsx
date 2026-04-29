"use client";

import { useTransition, useState } from "react";
import { updateOrderStatusAction } from "@/app/actions";

const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export default function OrderStatusControl({ orderId, status }: { orderId: string; status: string }) {
  const [s, setS] = useState(status);
  const [, start] = useTransition();
  return (
    <select
      value={s}
      onChange={e => {
        const v = e.target.value;
        setS(v);
        start(() => updateOrderStatusAction(orderId, v));
      }}
      className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)]/50"
    >
      {STATUSES.map(x => <option key={x} value={x}>{x.charAt(0).toUpperCase() + x.slice(1)}</option>)}
    </select>
  );
}
