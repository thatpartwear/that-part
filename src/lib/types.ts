export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  category: string;
  images: string[];
  color_images: Record<string, string>;
  sizes: string[];
  colors: string[];
  stock: number;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string | null;
  paymob_order_id: string | null;
  status: string;
  total_cents: number;
  email: string | null;
  shipping_address: Record<string, unknown> | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price_cents: number;
  size: string | null;
  color: string | null;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  image: string | null;
  size: string;
  color: string;
  quantity: number;
};
