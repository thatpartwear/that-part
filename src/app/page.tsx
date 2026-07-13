import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  let products: Product[] | null = null;
  try {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4)
      .returns<Product[]>();
    products = data;
  } catch {
    // Supabase not configured yet — show the empty state below.
  }

  return (
    <div>
      <section
        className="relative border-b border-neutral-200 bg-cover bg-center"
        style={{ backgroundImage: "url(/hero/hero-1.png)" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Train harder. Move faster.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-200">
            Performance sportswear built for every workout, from the studio
            to the trail.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-md bg-white px-8 py-3 text-sm font-medium text-black"
          >
            Shop now
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-xl font-semibold">New arrivals</h2>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500">
            No products yet — seed the catalog to see items here.
          </p>
        )}
      </section>
    </div>
  );
}
