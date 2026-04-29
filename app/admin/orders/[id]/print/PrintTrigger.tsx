"use client";
import { useEffect } from "react";

export default function PrintTrigger() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="no-print fixed top-4 right-4 flex gap-2">
      <button onClick={() => window.print()} className="px-4 py-2 rounded-full bg-black text-white text-sm">Print</button>
      <button onClick={() => history.back()} className="px-4 py-2 rounded-full border border-black/30 text-sm">Close</button>
    </div>
  );
}
