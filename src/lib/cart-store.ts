import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  setQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  clear: () => void;
};

const sameVariant = (
  a: Pick<CartItem, "productId" | "size" | "color">,
  b: Pick<CartItem, "productId" | "size" | "color">
) => a.productId === b.productId && a.size === b.size && a.color === b.color;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => sameVariant(i, item));
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameVariant(i, item)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !sameVariant(i, { productId, size, color })
          ),
        })),
      setQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            sameVariant(i, { productId, size, color }) ? { ...i, quantity } : i
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
);
