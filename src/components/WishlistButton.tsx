"use client";

import { useWishlistStore } from "@/lib/wishlist-store";
import { HeartIcon } from "@/components/icons";
import type { Product } from "@/lib/types";

export function WishlistButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const inWishlist = useWishlistStore((state) =>
    state.items.some((i) => i.productId === product.id)
  );
  const toggleItem = useWishlistStore((state) => state.toggleItem);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          priceCents: product.price_cents,
          image:
            product.color_images[product.colors[0]] ??
            product.images[0] ??
            null,
        });
      }}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={inWishlist}
      className={className}
    >
      <HeartIcon
        className="h-5 w-5"
        fill={inWishlist ? "currentColor" : "none"}
      />
    </button>
  );
}
