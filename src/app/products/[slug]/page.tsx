import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddToCartForm } from "@/components/AddToCartForm";
import { formatPrice } from "@/lib/format";
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

  const image = product.images[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg bg-neutral-100">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              No image
            </div>
          )}
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-neutral-500">
            {product.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-xl">{formatPrice(product.price_cents)}</p>
          {product.description && (
            <p className="mt-4 text-neutral-600">{product.description}</p>
          )}

          <div className="mt-8">
            <AddToCartForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
