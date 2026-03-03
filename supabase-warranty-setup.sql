-- ============================================================
-- FAVORIT WARRANTY – Supabase setup (full schema)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1) Table for warranty submissions (all fields)
create table if not exists public.warranty_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  address text not null,
  city text not null,
  postal_code text not null,
  phone text not null,
  email text not null,
  device_type text not null,
  device_model text not null,
  serial_number text not null,
  purchase_date date not null,
  place_of_purchase text not null,
  city_of_purchase text not null,
  fiscal_receipt_number text not null,
  terms_accepted boolean not null default true,
  receipt_image_url text,
  created_at timestamptz default now()
);

-- If you already had the OLD table, run this migration instead (adds new columns):
-- alter table public.warranty_submissions add column if not exists first_name text;
-- alter table public.warranty_submissions add column if not exists last_name text;
-- alter table public.warranty_submissions add column if not exists address text;
-- alter table public.warranty_submissions add column if not exists city text;
-- alter table public.warranty_submissions add column if not exists postal_code text;
-- alter table public.warranty_submissions add column if not exists device_type text;
-- alter table public.warranty_submissions add column if not exists device_model text;
-- alter table public.warranty_submissions add column if not exists place_of_purchase text;
-- alter table public.warranty_submissions add column if not exists city_of_purchase text;
-- alter table public.warranty_submissions add column if not exists fiscal_receipt_number text;
-- alter table public.warranty_submissions add column if not exists terms_accepted boolean default true;
-- alter table public.warranty_submissions add column if not exists receipt_image_url text;

-- 2) Enable RLS
alter table public.warranty_submissions enable row level security;

-- 3) Anyone can INSERT (public form)
create policy "Allow public insert"
  on public.warranty_submissions for insert
  with check (true);

-- 4) Only authenticated users can SELECT (admin)
create policy "Allow authenticated read"
  on public.warranty_submissions for select
  to authenticated
  using (true);

-- 5) Profiles table for admin role
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('admin', 'user'))
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

-- 6) Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7) Indexes
create index if not exists idx_warranty_serial on public.warranty_submissions(serial_number);
create index if not exists idx_warranty_email on public.warranty_submissions(email);
create index if not exists idx_warranty_created on public.warranty_submissions(created_at desc);
