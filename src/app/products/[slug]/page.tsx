import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductDetail } from "@/components/ProductDetail";
import type { Product } from "@/lib/types";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  let product: Product | null = null;
  try {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle<Product>();
    product = data;
  } catch {
    // Supabase not configured yet, or product genuinely missing.
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <ProductDetail product={product} />
    </div>
  );
}
