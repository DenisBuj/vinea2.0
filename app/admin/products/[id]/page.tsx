import { isAdmin } from "@/lib/admin";
import AdminLogin from "../../login/AdminLogin";
import { supabase, Product } from "@/lib/supabase";
import ProductForm from "../ProductForm";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return <AdminLogin />;
  const { id } = await params;
  const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (!data) return notFound();
  const p = data as Product;

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">← Terug naar wijnen</Link>
      <div className="mt-3 text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Bewerken</div>
      <h1 className="font-display text-4xl mt-2 text-[var(--color-ink)]">{p.name}</h1>
      <div className="mt-8">
        <ProductForm initial={p} />
      </div>
    </div>
  );
}
