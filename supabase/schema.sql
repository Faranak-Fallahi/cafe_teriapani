create extension if not exists pgcrypto;

create table if not exists public.categories (
  id text primary key,
  name text not null,
  fun_title text not null default '',
  mascot_message text not null default '',
  icon text not null default '☕',
  sort_order integer not null default 0,
  tone text not null default 'cream',
  sticker_tone text,
  is_featured boolean not null default false,
  is_wide boolean not null default false,
  badge text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric(12, 0) not null default 0 check (price >= 0),
  description text not null default '',
  ingredients text not null default '',
  allergens text not null default '',
  image_url text,
  is_available boolean not null default true,
  mascot_message text not null default '',
  pairing_product_id text references public.products(id) on delete set null,
  subcategory_id text,
  badge text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_categories (
  product_id text not null references public.products(id) on delete cascade,
  category_id text not null references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create index if not exists product_categories_category_id_idx on public.product_categories(category_id);
create index if not exists products_available_idx on public.products(is_available);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_categories enable row level security;
alter table public.user_roles enable row level security;

grant select on public.categories, public.products, public.product_categories to anon, authenticated;
grant insert, update, delete on public.categories, public.products, public.product_categories to authenticated;
grant select on public.user_roles to authenticated;

drop policy if exists "public can read categories" on public.categories;
create policy "public can read categories" on public.categories for select to anon, authenticated using (true);
drop policy if exists "admins can insert categories" on public.categories;
create policy "admins can insert categories" on public.categories for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "admins can update categories" on public.categories;
create policy "admins can update categories" on public.categories for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "admins can delete categories" on public.categories;
create policy "admins can delete categories" on public.categories for delete to authenticated using ((select public.is_admin()));

drop policy if exists "public can read products" on public.products;
create policy "public can read products" on public.products for select to anon, authenticated using (true);
drop policy if exists "admins can insert products" on public.products;
create policy "admins can insert products" on public.products for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "admins can update products" on public.products;
create policy "admins can update products" on public.products for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "admins can delete products" on public.products;
create policy "admins can delete products" on public.products for delete to authenticated using ((select public.is_admin()));

drop policy if exists "public can read product categories" on public.product_categories;
create policy "public can read product categories" on public.product_categories for select to anon, authenticated using (true);
drop policy if exists "admins can insert product categories" on public.product_categories;
create policy "admins can insert product categories" on public.product_categories for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "admins can update product categories" on public.product_categories;
create policy "admins can update product categories" on public.product_categories for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "admins can delete product categories" on public.product_categories;
create policy "admins can delete product categories" on public.product_categories for delete to authenticated using ((select public.is_admin()));

drop policy if exists "users can read own role" on public.user_roles;
create policy "users can read own role" on public.user_roles for select to authenticated using (user_id = (select auth.uid()));

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public can view product images" on storage.objects;
create policy "public can view product images" on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
drop policy if exists "admins can upload product images" on storage.objects;
create policy "admins can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and (select public.is_admin()));
drop policy if exists "admins can update product images" on storage.objects;
create policy "admins can update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and (select public.is_admin())) with check (bucket_id = 'product-images' and (select public.is_admin()));
drop policy if exists "admins can delete product images" on storage.objects;
create policy "admins can delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and (select public.is_admin()));
