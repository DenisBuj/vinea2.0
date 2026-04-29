import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import AdminNav from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Allow only login page when not authed
  // We can't read the path here easily, so use a child gate component pattern:
  return <AdminGate>{children}</AdminGate>;
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  const ok = await isAdmin();
  // Login page handles its own UI, the layout only renders nav when authed
  if (!ok) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-8 pb-24">
      <AdminNav />
      <div className="mt-8">{children}</div>
    </div>
  );
}
