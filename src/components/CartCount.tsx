"use client";

import { useCartStore } from "@/lib/cart-store";

export function CartCount() {
  const items = useCartStore((state) => state.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return <span>Cart{count > 0 ? ` (${count})` : ""}</span>;
}
