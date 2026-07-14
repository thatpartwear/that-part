"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";

export function AddToCartForm({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const outOfStock = product.stock <= 0;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        addItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          priceCents: product.price_cents,
          image: product.images[0] ?? null,
          size,
          color,
          quantity,
        });
        setAdded(true);
        router.refresh();
      }}
    >
      {product.sizes.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium">Size</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s);
                  setAdded(false);
                }}
                aria-pressed={size === s}
                className={`min-w-11 rounded-md border px-3 py-2 text-sm font-medium ${
                  size === s
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 hover:border-black"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium">Color</label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  setAdded(false);
                }}
                aria-pressed={color === c}
                className={`rounded-md border px-3 py-2 text-sm font-medium ${
                  color === c
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 hover:border-black"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Quantity</label>
        <div className="inline-flex items-center rounded-md border border-neutral-300">
          <button
            type="button"
            onClick={() => {
              setQuantity((q) => Math.max(1, q - 1));
              setAdded(false);
            }}
            disabled={quantity <= 1}
            className="px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:text-neutral-300"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() => {
              setQuantity((q) => Math.min(product.stock, q + 1));
              setAdded(false);
            }}
            disabled={quantity >= product.stock}
            className="px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:text-neutral-300"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={outOfStock}
        className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {outOfStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
      </button>
    </form>
  );
}
