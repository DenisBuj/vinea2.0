import { supabase, Product } from "@/lib/supabase";
import QuizClient from "./QuizClient";

export const revalidate = 60;

export default async function QuizPage() {
  const { data } = await supabase.from("products").select("*");
  const products = (data ?? []) as Product[];
  return <QuizClient products={products} />;
}
