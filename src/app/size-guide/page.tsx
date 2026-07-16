import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

const sizes = ["S", "M", "L", "XL"];

const bottomCategories = new Set(["shorts", "sweatpants"]);

function measurementsFor(category: string) {
  if (bottomCategories.has(category)) {
    return ["Waist (cm)", "Hip (cm)", "Inseam (cm)"];
  }
  if (category === "tank-tops") {
    return ["Chest (cm)", "Length (cm)"];
  }
  return ["Chest (cm)", "Length (cm)", "Sleeve (cm)"];
}

export default async function SizeGuidePage() {
  const supabase = await createClient();
  let products: Product[] | null = null;
  try {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("name")
      .returns<Product[]>();
    products = data;
  } catch {
    // Supabase not configured yet.
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-2xl font-bold">Size Guide</h1>
      <p className="mb-10 text-sm text-neutral-400">
        Measurements coming soon for each item below. If you&apos;re between
        sizes, we recommend sizing up.
      </p>

      {products && products.length > 0 ? (
        <div className="space-y-10">
          {products.map((product) => {
            const measurements = measurementsFor(product.category);
            return (
              <div key={product.id}>
                <h2 className="mb-3 text-lg font-semibold">{product.name}</h2>
                <div className="overflow-x-auto rounded-lg border border-neutral-800">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-neutral-800">
                        <th className="px-4 py-3 font-medium text-neutral-400">
                          Size
                        </th>
                        {sizes.map((size) => (
                          <th key={size} className="px-4 py-3 font-medium">
                            {size}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {measurements.map((measurement) => (
                        <tr
                          key={measurement}
                          className="border-b border-neutral-800 last:border-0"
                        >
                          <td className="px-4 py-3 text-neutral-400">
                            {measurement}
                          </td>
                          {sizes.map((size) => (
                            <td key={size} className="px-4 py-3 text-neutral-500">
                              —
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-neutral-400">No products yet.</p>
      )}

      <p className="mt-10 text-sm text-neutral-400">
        Still not sure what size to get?{" "}
        <a href="/contact" className="underline">
          Contact us
        </a>{" "}
        and we&apos;ll help you out.
      </p>
    </div>
  );
}
