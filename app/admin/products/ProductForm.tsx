"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/lib/supabase";
import { createProductAction, updateProductAction, deleteProductAction } from "@/app/actions";
import { Trash2 } from "lucide-react";

const TYPES = ["red", "white", "rose", "sparkling", "champagne", "orange", "dessert"];

const Field = ({ label, children, span = 1 }: { label: string; children: React.ReactNode; span?: 1 | 2 }) => (
  <label className={`block ${span === 2 ? "sm:col-span-2" : ""}`}>
    <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-dim)] block mb-2">{label}</span>
    {children}
  </label>
);
const inp =
  "w-full bg-white border border-[var(--color-line-strong)] rounded-xl px-4 py-3 text-sm placeholder:text-[var(--color-ink-dim)] focus:outline-none focus:border-[var(--color-accent)]";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export default function ProductForm({ initial }: { initial?: Product }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      slug: slug || slugify(String(fd.get("name") || "")),
      name: String(fd.get("name") || "").trim(),
      producer: String(fd.get("producer") || "").trim(),
      region: String(fd.get("region") || "") || null,
      country: String(fd.get("country") || "") || null,
      type: String(fd.get("type") || "red"),
      grape: String(fd.get("grape") || "") || null,
      vintage: fd.get("vintage") ? Number(fd.get("vintage")) : null,
      description: String(fd.get("description") || "") || null,
      tasting_notes: String(fd.get("tasting_notes") || "") || null,
      food_pairings: String(fd.get("food_pairings") || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
      alcohol_pct: fd.get("alcohol_pct") ? Number(fd.get("alcohol_pct")) : null,
      price_cents: Math.round(parseFloat(String(fd.get("price_eur") || "0")) * 100),
      stock: Number(fd.get("stock") || 0),
      image_url: String(fd.get("image_url") || "") || null,
      featured: fd.get("featured") === "on",
      hype_score: Number(fd.get("hype_score") || 0)
    };

    if (!data.name || !data.producer || !data.slug || data.price_cents <= 0) {
      setError("Naam, producent, slug en geldige prijs zijn verplicht.");
      return;
    }

    setError(null);
    start(async () => {
      const res = initial
        ? await updateProductAction(initial.id, data)
        : await createProductAction(data);
      if (!res.ok) { setError(res.error); return; }
      router.push("/admin/products");
      router.refresh();
    });
  };

  const onDelete = () => {
    if (!initial) return;
    if (!confirm(`"${initial.name}" definitief verwijderen?`)) return;
    start(async () => {
      const res = await deleteProductAction(initial.id);
      if (!res.ok) { setError(res.error); return; }
      router.push("/admin/products");
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4 p-6 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
        <Field label="Naam *">
          <input
            className={inp}
            name="name"
            required
            value={name}
            onChange={e => {
              setName(e.target.value);
              if (!initial) setSlug(slugify(e.target.value));
            }}
          />
        </Field>
        <Field label="Slug *">
          <input className={inp} name="slug" required value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto" />
        </Field>
        <Field label="Producent *"><input className={inp} name="producer" required defaultValue={initial?.producer ?? ""} /></Field>
        <Field label="Type *">
          <select className={inp} name="type" defaultValue={initial?.type ?? "red"}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Regio"><input className={inp} name="region" defaultValue={initial?.region ?? ""} /></Field>
        <Field label="Land"><input className={inp} name="country" defaultValue={initial?.country ?? ""} /></Field>
        <Field label="Druif"><input className={inp} name="grape" defaultValue={initial?.grape ?? ""} /></Field>
        <Field label="Jaar"><input className={inp} name="vintage" type="number" min={1900} max={2100} defaultValue={initial?.vintage ?? ""} /></Field>
        <Field label="Prijs (€) *"><input className={inp} name="price_eur" type="number" step="0.01" min="0" required defaultValue={initial ? (initial.price_cents / 100).toFixed(2) : ""} /></Field>
        <Field label="Stock"><input className={inp} name="stock" type="number" min={0} defaultValue={initial?.stock ?? 0} /></Field>
        <Field label="Alcohol %"><input className={inp} name="alcohol_pct" type="number" step="0.1" min={0} max={25} defaultValue={initial?.alcohol_pct ?? ""} /></Field>
        <Field label="Hype score"><input className={inp} name="hype_score" type="number" min={0} max={100} defaultValue={initial?.hype_score ?? 80} /></Field>
        <Field label="Beschrijving" span={2}>
          <textarea className={inp} name="description" rows={3} defaultValue={initial?.description ?? ""} />
        </Field>
        <Field label="Tasting notes" span={2}>
          <textarea className={inp} name="tasting_notes" rows={2} defaultValue={initial?.tasting_notes ?? ""} />
        </Field>
        <Field label="Food pairings (komma-gescheiden)" span={2}>
          <input className={inp} name="food_pairings" placeholder="Steak, Aged cheeses, Mushroom risotto" defaultValue={initial?.food_pairings?.join(", ") ?? ""} />
        </Field>
        <Field label="Featured" span={2}>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={initial?.featured ?? false} className="w-4 h-4 accent-[var(--color-accent)]" />
            Toon op homepage als featured drop
          </label>
        </Field>
      </div>

      <aside className="space-y-4">
        <div className="p-6 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
          <Field label="Afbeelding URL" span={2}>
            <input className={inp} name="image_url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." />
          </Field>
          <div className="mt-3 relative aspect-[4/5] rounded-xl overflow-hidden bg-[var(--color-bg-soft)]">
            {imageUrl ? (
              <Image src={imageUrl} alt="preview" fill className="object-cover" unoptimized />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-[var(--color-ink-dim)]">Geen afbeelding</div>
            )}
          </div>
          <p className="mt-2 text-xs text-[var(--color-ink-dim)]">Tip: gebruik een Unsplash URL of host de fles op Supabase Storage.</p>
        </div>

        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">{error}</div>}

        <button type="submit" disabled={pending} className="w-full py-4 rounded-full btn-cta font-medium disabled:opacity-60">
          {pending ? "Opslaan…" : initial ? "Bewaar wijzigingen" : "Voeg wijn toe"}
        </button>

        {initial && (
          <button type="button" onClick={onDelete} disabled={pending} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border border-red-300 bg-white text-red-700 hover:bg-red-50 transition disabled:opacity-60">
            <Trash2 size={16} /> Verwijder
          </button>
        )}
      </aside>
    </form>
  );
}
