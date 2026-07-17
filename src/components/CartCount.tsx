"use client";

import { useCartStore } from "@/lib/cart-store";
import { CartIcon } from "@/components/icons";

export function CartCount() {
  const items = useCartStore((state) => state.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <span className="relative inline-block h-5 w-5" aria-label="Cart">
      <CartIcon className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-medium text-white">
          {count}
        </span>
      )}
    </span>
  );
}
