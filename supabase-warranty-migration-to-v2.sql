-- Run this ONLY if you already have the OLD warranty_submissions table
-- and want to switch to the new form fields. Otherwise use supabase-warranty-setup.sql from scratch.

-- Option A: Drop and recreate (you lose existing data)
-- drop table if exists public.warranty_submissions;
-- then run the create table from supabase-warranty-setup.sql

-- Option B: Add new columns (keeps old data; old columns remain)
alter table public.warranty_submissions add column if not exists first_name text;
alter table public.warranty_submissions add column if not exists last_name text;
alter table public.warranty_submissions add column if not exists address text;
alter table public.warranty_submissions add column if not exists city text;
alter table public.warranty_submissions add column if not exists postal_code text;
alter table public.warranty_submissions add column if not exists device_type text;
alter table public.warranty_submissions add column if not exists device_model text;
alter table public.warranty_submissions add column if not exists place_of_purchase text;
alter table public.warranty_submissions add column if not exists city_of_purchase text;
alter table public.warranty_submissions add column if not exists fiscal_receipt_number text;
alter table public.warranty_submissions add column if not exists terms_accepted boolean default true;
alter table public.warranty_submissions add column if not exists receipt_image_url text;
