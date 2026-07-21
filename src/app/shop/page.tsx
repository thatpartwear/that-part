import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; gender?: string }>;
}) {
  const { category, q, gender } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("products").select("*").order("name");
  if (category) {
    query = query.eq("category", category);
  }
  if (gender) {
    query = query.eq("gender", gender);
  }
  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  let categoryQuery = supabase.from("products").select("category");
  if (gender) {
    categoryQuery = categoryQuery.eq("gender", gender);
  }

  let products: Product[] | null = null;
  let categoryRows: { category: string }[] | null = null;
  try {
    [{ data: products }, { data: categoryRows }] = await Promise.all([
      query.returns<Product[]>(),
      categoryQuery.returns<{ category: string }[]>(),
    ]);
  } catch {
    // Supabase not configured yet — show the empty state below.
  }

  const categories = Array.from(
    new Set((categoryRows ?? []).map((row) => row.category))
  ).sort();

  const genderPrefix = gender ? `?gender=${encodeURIComponent(gender)}` : "";
  const categoryHref = (c: string) =>
    `/shop?category=${encodeURIComponent(c)}${gender ? `&gender=${encodeURIComponent(gender)}` : ""}`;

  const heading = q
    ? `Search results for "${q}"`
    : gender === "women"
      ? "Women"
      : gender === "men"
        ? "Men"
        : "Shop";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">{heading}</h1>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2 text-sm">
          <a
            href={`/shop${genderPrefix}`}
            className={`rounded-full border px-4 py-1.5 ${
              !category
                ? "border-black bg-black text-white"
                : "border-neutral-300"
            }`}
          >
            All
          </a>
          {categories.map((c) => (
            <a
              key={c}
              href={categoryHref(c)}
              className={`rounded-full border px-4 py-1.5 capitalize ${
                category === c
                  ? "border-black bg-black text-white"
                  : "border-neutral-300"
              }`}
            >
              {c}
            </a>
          ))}
        </div>
      )}

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-neutral-500">
          {gender === "women"
            ? "Women's items are coming soon — check back shortly."
            : (
                <>
                  No products found
                  {category ? ` in "${category}"` : ""}
                  {q ? ` for "${q}"` : ""}.
                </>
              )}
        </p>
      )}
    </div>
  );
}
