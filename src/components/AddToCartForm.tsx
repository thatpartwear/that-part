"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";

export function AddToCartForm({
  product,
  color,
  onColorChange,
}: {
  product: Product;
  color: string;
  onColorChange: (color: string) => void;
}) {
  const [size, setSize] = useState(product.sizes[0] ?? "");
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
          image: product.color_images[color] ?? product.images[0] ?? null,
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
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">Size</label>
            <a
              href="/size-guide"
              className="text-sm text-neutral-400 underline hover:text-white"
            >
              Size guide
            </a>
          </div>
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
                    ? "border-white bg-white text-black"
                    : "border-neutral-700 text-white hover:border-white"
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
                  onColorChange(c);
                  setAdded(false);
                }}
                aria-pressed={color === c}
                className={`rounded-md border px-3 py-2 text-sm font-medium ${
                  color === c
                    ? "border-white bg-white text-black"
                    : "border-neutral-700 text-white hover:border-white"
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
        <div className="inline-flex items-center rounded-md border border-neutral-700">
          <button
            type="button"
            onClick={() => {
              setQuantity((q) => Math.max(1, q - 1));
              setAdded(false);
            }}
            disabled={quantity <= 1}
            className="px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:text-neutral-600"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-sm text-white">{quantity}</span>
          <button
            type="button"
            onClick={() => {
              setQuantity((q) => Math.min(product.stock, q + 1));
              setAdded(false);
            }}
            disabled={quantity >= product.stock}
            className="px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:text-neutral-600"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={outOfStock}
        className="rounded-md bg-white px-6 py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
      >
        {outOfStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
      </button>
    </form>
  );
}
