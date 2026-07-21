"use client";

import Link from "next/link";
import { useWishlistStore } from "@/lib/wishlist-store";
import { formatPrice } from "@/lib/format";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mt-3 text-sm text-neutral-500">
          Tap the heart on any product to save it here.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Your wishlist</h1>

      <ul className="divide-y divide-neutral-200">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 py-4">
            <Link
              href={`/products/${item.slug}`}
              className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100"
            >
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              )}
            </Link>
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="font-medium">
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-neutral-500">
                {formatPrice(item.priceCents)}
              </p>
              <button
                onClick={() => removeItem(item.productId)}
                className="mt-2 text-sm text-neutral-500 underline hover:text-black active:font-semibold active:text-black"
              >
                Remove
              </button>
            </div>
            <Link
              href={`/products/${item.slug}`}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:border-black"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
