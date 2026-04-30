import { supabase, Order, OrderItem } from "@/lib/supabase";
import { notFound } from "next/navigation";
import OrderTrackerClient from "./OrderTrackerClient";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const { data } = await supabase.from("orders").select("*").eq("order_number", number).maybeSingle();
  if (!data) return notFound();
  const order = data as Order;
  const { data: itemsData } = await supabase.from("order_items").select("*").eq("order_id", order.id);
  const items = (itemsData ?? []) as OrderItem[];

  return <OrderTrackerClient order={order} items={items} />;
}
