import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon, {
  auth: { persistSession: false }
});

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
