import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";

process.loadEnvFile(path.resolve(process.cwd(), ".env.local"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const productsPath = path.resolve(process.cwd(), "data/products.json");
const products = JSON.parse(readFileSync(productsPath, "utf-8"));

async function main() {
  console.log(`Seeding ${products.length} product(s) from data/products.json...`);

  const { data, error } = await supabase
    .from("products")
    .upsert(products, { onConflict: "slug" })
    .select();

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Done. Upserted ${data?.length ?? 0} product(s).`);
}

main();
