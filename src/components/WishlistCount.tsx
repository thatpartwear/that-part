"use client";

import { useWishlistStore } from "@/lib/wishlist-store";
import { HeartIcon } from "@/components/icons";

export function WishlistCount() {
  const count = useWishlistStore((state) => state.items.length);

  return (
    <span className="relative inline-block h-5 w-5" aria-label="Wishlist">
      <HeartIcon className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-medium text-white">
          {count}
        </span>
      )}
    </span>
  );
}
