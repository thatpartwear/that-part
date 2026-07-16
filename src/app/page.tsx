import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";

const collections = [
  { label: "T-Shirts", category: "t-shirts", image: "/products/core-black.png" },
  { label: "Quarter-Zips", category: "quarter-zips", image: "/products/apex-black.png" },
  { label: "Shorts", category: "shorts", image: "/products/motion-black.png" },
  { label: "Pants", category: "sweatpants", image: "/products/utility-black.png" },
  { label: "Tank Tops", category: "tank-tops", image: "/products/flex-black.png" },
];

const reviews = [
  {
    name: "Ahmed S.",
    rating: 5,
    quote:
      "Placeholder review — great fit and the material holds up after a lot of washes.",
  },
  {
    name: "Mariam K.",
    rating: 5,
    quote:
      "Placeholder review — ordered the Core tee and it's now in my regular rotation.",
  },
  {
    name: "Youssef R.",
    rating: 4,
    quote:
      "Placeholder review — comfortable for training, true to size.",
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  let products: Product[] | null = null;
  let memberOptedIn = false;
  let signedIn = false;
  try {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4)
      .returns<Product[]>();
    products = data;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      signedIn = true;
      const { data: profile } = await supabase
        .from("profiles")
        .select("marketing_opt_in")
        .eq("id", user.id)
        .maybeSingle<{ marketing_opt_in: boolean }>();
      memberOptedIn = profile?.marketing_opt_in ?? false;
    }
  } catch {
    // Supabase not configured yet — show the empty state below.
  }

  return (
    <div>
      <section
        className="relative border-b border-neutral-800 bg-cover bg-center"
        style={{ backgroundImage: "url(/hero/hero-1.png)" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Train harder. Move faster.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-200">
            Performance sportswear built for every workout, from the studio
            to the trail.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-md bg-white px-8 py-3 text-sm font-medium text-black"
          >
            Shop now
          </Link>
        </div>
      </section>

      <section className="border-b border-neutral-800 px-4 py-8">
        <div className="mx-auto grid max-w-6xl gap-6 text-center sm:grid-cols-3 sm:text-left">
          <div>
            <p className="font-semibold text-white">Free shipping</p>
            <p className="mt-1 text-sm text-neutral-400">
              On orders over EGP 1,000.00
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">5% off bigger orders</p>
            <p className="mt-1 text-sm text-neutral-400">
              Automatically applied over EGP 2,000.00
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">5% off for members</p>
            <p className="mt-1 text-sm text-neutral-400">
              {memberOptedIn ? (
                "You're a member — the discount is applied at checkout."
              ) : signedIn ? (
                <>
                  <Link href="/account" className="underline">
                    Opt into emails
                  </Link>{" "}
                  in your account to unlock it.
                </>
              ) : (
                <>
                  <Link href="/signup" className="underline">
                    Sign up
                  </Link>{" "}
                  and opt into emails to unlock it.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-xl font-semibold text-white">New arrivals</h2>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-400">
            No products yet — seed the catalog to see items here.
          </p>
        )}
      </section>

      <section className="border-t border-neutral-800 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-xl font-semibold text-white">
            Shop by collection
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {collections.map((collection) => (
              <Link
                key={collection.category}
                href={`/shop?category=${collection.category}`}
                className="group"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={collection.image}
                    alt={collection.label}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-center text-sm font-medium">
                  {collection.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-800 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-xl font-semibold text-white">
            Customer reviews
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="rounded-lg border border-neutral-800 p-5"
              >
                <div className="mb-2 text-white">
                  {"★".repeat(review.rating)}
                  <span className="text-neutral-700">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="text-sm text-neutral-300">{review.quote}</p>
                <p className="mt-3 text-sm font-medium">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
