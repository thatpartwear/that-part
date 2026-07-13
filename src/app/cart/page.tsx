"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;
      const fullName = (user.user_metadata?.full_name as string) ?? "";
      const [firstName = "", ...rest] = fullName.split(" ");
      setContact((c) => ({
        ...c,
        email: user.email ?? c.email,
        firstName: firstName || c.firstName,
        lastName: rest.join(" ") || c.lastName,
      }));
    });
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, contact }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const contactComplete =
    contact.firstName && contact.lastName && contact.email && contact.phone;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Your cart</h1>

      <ul className="divide-y divide-neutral-200">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.size}-${item.color}`}
            className="flex items-center gap-4 py-4"
          >
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-neutral-500">
                {item.size} / {item.color}
              </p>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <div className="inline-flex items-center rounded-md border border-neutral-300">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        item.productId,
                        item.size,
                        item.color,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    disabled={item.quantity <= 1}
                    className="px-2 py-1 font-medium disabled:cursor-not-allowed disabled:text-neutral-300"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        item.productId,
                        item.size,
                        item.color,
                        item.quantity + 1
                      )
                    }
                    className="px-2 py-1 font-medium"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() =>
                    removeItem(item.productId, item.size, item.color)
                  }
                  className="text-neutral-500 underline hover:text-black"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-medium">
              {formatPrice(item.priceCents * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-lg font-semibold">{formatPrice(total)}</span>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6">
        <h2 className="mb-4 text-lg font-semibold">Contact details</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First name"
            value={contact.firstName}
            onChange={(e) =>
              setContact((c) => ({ ...c, firstName: e.target.value }))
            }
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Last name"
            value={contact.lastName}
            onChange={(e) =>
              setContact((c) => ({ ...c, lastName: e.target.value }))
            }
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            value={contact.email}
            onChange={(e) =>
              setContact((c) => ({ ...c, email: e.target.value }))
            }
            className="col-span-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="tel"
            placeholder="Phone (e.g. +20 100 000 0000)"
            value={contact.phone}
            onChange={(e) =>
              setContact((c) => ({ ...c, phone: e.target.value }))
            }
            className="col-span-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={loading || !contactComplete}
        className="mt-6 w-full rounded-md bg-black px-6 py-3 text-sm font-medium text-white disabled:bg-neutral-400"
      >
        {loading ? "Redirecting to checkout…" : "Checkout"}
      </button>
    </div>
  );
}
