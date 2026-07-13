import { createHmac } from "node:crypto";

const PAYMOB_API = "https://accept.paymob.com/api";

export type PaymobBillingData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  apartment?: string;
  floor?: string;
  street?: string;
  building?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  shipping_method?: string;
};

export type PaymobOrderItem = {
  name: string;
  amount_cents: string;
  description: string;
  quantity: string;
};

async function paymobFetch(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${PAYMOB_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paymob request to ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function getAuthToken(): Promise<string> {
  const data = await paymobFetch("/auth/tokens", {
    api_key: process.env.PAYMOB_API_KEY,
  });
  return data.token;
}

export async function createOrder(
  authToken: string,
  amountCents: number,
  items: PaymobOrderItem[]
): Promise<number> {
  const data = await paymobFetch("/ecommerce/orders", {
    auth_token: authToken,
    delivery_needed: "false",
    amount_cents: String(amountCents),
    currency: "EGP",
    items,
  });
  return data.id;
}

export async function createPaymentKey(
  authToken: string,
  amountCents: number,
  paymobOrderId: number,
  billingData: PaymobBillingData
): Promise<string> {
  const data = await paymobFetch("/acceptance/payment_keys", {
    auth_token: authToken,
    amount_cents: String(amountCents),
    expiration: 3600,
    order_id: paymobOrderId,
    billing_data: {
      apartment: "NA",
      floor: "NA",
      street: "NA",
      building: "NA",
      city: "NA",
      state: "NA",
      country: "EG",
      postal_code: "NA",
      shipping_method: "PKG",
      ...billingData,
    },
    currency: "EGP",
    integration_id: Number(process.env.PAYMOB_INTEGRATION_ID),
  });
  return data.token;
}

export function getIframeUrl(paymentToken: string): string {
  return `${PAYMOB_API}/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;
}

// Field order is fixed by Paymob's HMAC spec: https://docs.paymob.com/docs/hmac-calculation
const HMAC_FIELDS = [
  "amount_cents",
  "created_at",
  "currency",
  "error_occured",
  "has_parent_transaction",
  "id",
  "integration_id",
  "is_3d_secure",
  "is_auth",
  "is_capture",
  "is_refunded",
  "is_standalone_payment",
  "is_voided",
  "order_id",
  "owner",
  "pending",
  "source_data_pan",
  "source_data_sub_type",
  "source_data_type",
  "success",
] as const;

export type PaymobTransactionObj = {
  amount_cents: number;
  created_at: string;
  currency: string;
  error_occured: boolean;
  has_parent_transaction: boolean;
  id: number;
  integration_id: number;
  is_3d_secure: boolean;
  is_auth: boolean;
  is_capture: boolean;
  is_refunded: boolean;
  is_standalone_payment: boolean;
  is_voided: boolean;
  order: { id: number };
  owner: number;
  pending: boolean;
  source_data: { pan: string; sub_type: string; type: string };
  success: boolean;
};

export function verifyTransactionHmac(
  obj: PaymobTransactionObj,
  hmacFromRequest: string
): boolean {
  const flat: Record<string, unknown> = {
    ...obj,
    order_id: obj.order.id,
    source_data_pan: obj.source_data.pan,
    source_data_sub_type: obj.source_data.sub_type,
    source_data_type: obj.source_data.type,
  };

  const concatenated = HMAC_FIELDS.map((field) => flat[field]).join("");
  const computed = createHmac("sha512", process.env.PAYMOB_HMAC_SECRET ?? "")
    .update(concatenated)
    .digest("hex");

  return computed === hmacFromRequest;
}
