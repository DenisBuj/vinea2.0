import { isAdmin } from "@/lib/admin";
import AdminLogin from "../../login/AdminLogin";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  if (!(await isAdmin())) return <AdminLogin />;
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Nieuwe wijn</div>
      <h1 className="font-display text-4xl mt-2 text-[var(--color-ink)]">Voeg een fles toe</h1>
      <p className="mt-3 text-sm text-[var(--color-ink-dim)]">Vul wat je weet — slug wordt automatisch gegenereerd uit de naam.</p>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
