# THAT PART — Sportswear Store

Next.js storefront with Supabase (products, auth, orders) and Paymob (Egypt) for checkout.

## Setup

1. **Supabase**
   - Create a project at [supabase.com](https://supabase.com/dashboard).
   - In the SQL editor, run `supabase/schema.sql` to create tables, RLS policies, and the stock-decrement function.
   - Project Settings → API: copy the Project URL, `anon` key, and `service_role` key into `.env.local`.

2. **Paymob**
   - Create an account at [accept.paymob.com](https://accept.paymob.com) (sandbox/test mode is available).
   - Settings tab → copy your **API Key** into `PAYMOB_API_KEY`.
   - Integrations tab → copy the id of your card integration into `PAYMOB_INTEGRATION_ID`.
   - iFrames tab → copy your iframe id into `PAYMOB_IFRAME_ID`, and the **HMAC secret** (shown in the same iframe's settings) into `PAYMOB_HMAC_SECRET`.
   - In the iframe/integration settings, set:
     - **Transaction Processed Callback** → `https://<your-domain>/api/webhooks/paymob` (this is what actually confirms orders — use a tunnel like `ngrok` for local testing since Paymob needs a public URL to reach you)
     - **Transaction Response Callback** → `https://<your-domain>/checkout/success` (where the customer's browser is redirected after paying)

3. **Products**
   - Edit `data/products.json` with your real catalog (see the example entry for the shape). Prices are in EGP piastres (cents) — e.g. `89900` = 899 EGP.
   - Run `npm run seed` to upsert them into Supabase. Re-run any time the file changes.

4. **Run it**
   ```
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Test checkout

Paymob's sandbox provides test cards in your dashboard's test integration. Since Paymob calls your webhook directly (no local CLI forwarder like Stripe's), you'll need a public URL during local testing — run `ngrok http 3000` and point the Transaction Processed Callback at the ngrok URL. A successful payment creates an `orders` row (status `paid`) and appears under `/account`.

## Project layout

- `src/app` — pages and API routes
- `src/lib/supabase` — browser/server/admin Supabase clients
- `src/lib/paymob.ts` — Paymob auth/order/payment-key/HMAC helpers
- `src/lib/cart-store.ts` — client-side cart (Zustand, persisted to localStorage)
- `supabase/schema.sql` — database schema + RLS policies
- `scripts/seed-products.ts` — product seed script
