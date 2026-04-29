"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Boxes, LogOut } from "lucide-react";

export default function AdminNav() {
  const path = usePathname();
  const item = (href: string, label: string, Icon: any, exact = false) => {
    const active = exact ? path === href : path.startsWith(href);
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
          active
            ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
            : "border border-[var(--color-line)] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
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
        {item("/admin/inventory", "Inventory", Boxes)}
      </div>
      <form action="/api/admin/logout" method="post">
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-line)] text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-wine-bright)]">
          <LogOut size={14} /> Sign out
        </button>
      </form>
    </nav>
  );
}
