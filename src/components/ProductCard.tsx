import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { WishlistButton } from "@/components/WishlistButton";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            No image
          </div>
        )}
        <WishlistButton
          product={product}
          className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-black shadow-sm hover:bg-white"
          iconClassName="h-3.5 w-3.5"
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="font-medium">{product.name}</span>
        <span className="text-neutral-600">
          {formatPrice(product.price_cents)}
        </span>
      </div>
    </Link>
  );
}
