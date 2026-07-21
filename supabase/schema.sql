-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query).

-- Profiles: one row per auth user, extra fields beyond what Supabase Auth stores.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, marketing_opt_in)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'marketing_opt_in')::boolean, false)
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  category text not null,
  gender text not null default 'men',
  images text[] not null default '{}',
  color_images jsonb not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  paymob_order_id text unique,
  status text not null default 'pending',
  total_cents integer not null check (total_cents >= 0),
  discount_cents integer not null default 0,
  shipping_cents integer not null default 0,
  email text,
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  price_cents integer not null check (price_cents >= 0),
  size text,
  color text
);

-- Atomically decrement stock after a paid order (called from the Paymob webhook via the service role key).
create or replace function public.decrement_product_stock(product_id uuid, amount integer)
returns void as $$
begin
  update public.products
  set stock = greatest(stock - amount, 0)
  where id = product_id;
end;
$$ language plpgsql security definer set search_path = public;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles: users can read/update only their own row.
create policy "Profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id);
create policy "Profiles are updatable by owner" on public.profiles
  for update using (auth.uid() = id);

-- Products: publicly readable, no client writes (writes happen via the seed script using the service role key).
create policy "Products are publicly readable" on public.products
  for select using (true);

-- Orders: users can read only their own orders. All writes go through the service role key (checkout route + Paymob webhook), which bypasses RLS.
create policy "Orders are viewable by owner" on public.orders
  for select using (auth.uid() = user_id);

-- Order items: users can read only items belonging to their own orders.
create policy "Order items are viewable by owner" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where public.orders.id = order_items.order_id
      and public.orders.user_id = auth.uid()
    )
  );
