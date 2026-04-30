"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Boxes, Wine, LogOut } from "lucide-react";

export default function AdminNav() {
  const path = usePathname();
  const item = (href: string, label: string, Icon: any, exact = false) => {
    const active = exact ? path === href : path.startsWith(href);
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
          active
            ? "bg-[var(--color-accent)] text-white"
            : "bg-white border border-[var(--color-line-strong)] text-[var(--color-ink-soft)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        }`}
      >
        <Icon size={14} /> {label}
      </Link>
    );
  };
  return (
    <nav className="flex flex-wrap gap-3 items-center justify-between border-b border-[var(--color-line)] pb-6">
      <div className="flex flex-wrap gap-3">
        {item("/admin", "Dashboard", LayoutDashboard, true)}
        {item("/admin/orders", "Orders", Package)}
        {item("/admin/products", "Wijnen", Wine)}
        {item("/admin/inventory", "Stock", Boxes)}
      </div>
      <form action="/api/admin/logout" method="post">
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-line-strong)] bg-white text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-cta)] hover:text-[var(--color-cta)]">
          <LogOut size={14} /> Uitloggen
        </button>
      </form>
    </nav>
  );
}
