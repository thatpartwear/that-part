"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { AddToCartForm } from "@/components/AddToCartForm";
import { formatPrice } from "@/lib/format";

export function ProductDetail({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0] ?? "");
  const image = product.color_images[color] ?? product.images[0];

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-lg bg-neutral-900">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={`${product.name} in ${color}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-500">
            No image
          </div>
        )}
      </div>

      <div>
        <p className="text-sm uppercase tracking-wide text-neutral-400">
          {product.category}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">{product.name}</h1>
        <p className="mt-2 text-xl text-white">{formatPrice(product.price_cents)}</p>
        {product.description && (
          <p className="mt-4 text-neutral-400">{product.description}</p>
        )}

        <div className="mt-8">
          <AddToCartForm product={product} color={color} onColorChange={setColor} />
        </div>
      </div>
    </div>
  );
}
