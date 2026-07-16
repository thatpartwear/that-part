import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";

const TOP_CATEGORIES = ["t-shirts", "tank-tops", "quarter-zips"];
const BOTTOM_CATEGORIES = ["shorts", "sweatpants"];

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

  let complementary: Product[] | null = null;
  const isTop = TOP_CATEGORIES.includes(product.category);
  const isBottom = BOTTOM_CATEGORIES.includes(product.category);
  if (isTop || isBottom) {
    const opposingCategories = isTop ? BOTTOM_CATEGORIES : TOP_CATEGORIES;
    try {
      const { data } = await supabase
        .from("products")
        .select("*")
        .in("category", opposingCategories)
        .neq("id", product.id)
        .limit(4)
        .returns<Product[]>();
      complementary = data;
    } catch {
      // Supabase not configured yet.
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <ProductDetail product={product} />

      {complementary && complementary.length > 0 && (
        <div className="mt-16 border-t border-neutral-800 pt-16">
          <h2 className="mb-8 text-xl font-semibold text-white">
            Complete your look
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {complementary.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
