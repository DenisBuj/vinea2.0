import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _public: SupabaseClient | null = null;
let _server: SupabaseClient | null = null;

function getPublic(): SupabaseClient {
  if (_public) return _public;
  if (!url || !anon) {
    throw new Error(
      "Supabase env missing — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  _public = createClient(url, anon, { auth: { persistSession: false } });
  return _public;
}

/**
 * Server-only client. Uses SUPABASE_SERVICE_ROLE_KEY when present (bypasses RLS for trusted writes).
 * Falls back to anon if service role is missing — those writes will only succeed where RLS allows.
 * NEVER import this from a Client Component.
 */
export function getServerClient(): SupabaseClient {
  if (_server) return _server;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL missing");
  const key = service || anon;
  if (!key) throw new Error("Supabase keys missing");
  _server = createClient(url, key, { auth: { persistSession: false } });
  return _server;
}

/**
 * Lazy-loading proxy that defers client creation until first use.
 * Prevents module-load crashes during Vercel's static-page collection
 * if env vars happen to be missing.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop: string) {
    const c = getPublic() as any;
    const v = c[prop];
    return typeof v === "function" ? v.bind(c) : v;
  }
}) as SupabaseClient;

// ── Types ─────────────────────────────────────────────────────────────────
export type Product = {
  id: string;
  slug: string;
  name: string;
  producer: string;
  region: string | null;
  country: string | null;
  type: "red" | "white" | "rose" | "sparkling" | "champagne" | "orange" | "dessert";
  grape: string | null;
  vintage: number | null;
  description: string | null;
  tasting_notes: string | null;
  food_pairings: string[] | null;
  alcohol_pct: number | null;
  price_cents: number;
  stock: number;
  image_url: string | null;
  featured: boolean;
  hype_score: number;
  created_at: string;
};

export type Order = {
  id: string;
  order_number: string;
  customer_id: string | null;
  guest_email: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  shipping_street: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_method: string;
  notes: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_vintage: number | null;
  qty: number;
  unit_price_cents: number;
  line_total_cents: number;
};
