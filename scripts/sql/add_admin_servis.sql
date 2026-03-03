-- =============================================================================
-- Grant admin access to servis@centrounion.com.mk
-- Run in Supabase Dashboard → SQL Editor
-- =============================================================================
-- Prerequisite: The user must already exist in Supabase Auth.
-- If not, create them first: Authentication → Users → "Add user"
--   Email: servis@centrounion.com.mk
--   Password: (set a secure password and share it securely with the user)
-- Then run this script.
-- =============================================================================

-- Option A: User already has a profile (created by trigger on signup)
-- This updates their role to admin.
update public.profiles
set role = 'admin'
where email = 'servis@centrounion.com.mk';

-- If the user was created manually in Auth and has no profile row yet, use Option B instead.

-- Option B: If no row exists (e.g. user was created in Auth before the trigger existed),
-- insert a profile with admin role. Replace YOUR_USER_UUID with the actual id from
-- Authentication → Users → click the user → copy "User UID".
--
-- insert into public.profiles (id, email, role)
-- values ('YOUR_USER_UUID', 'servis@centrounion.com.mk', 'admin')
-- on conflict (id) do update set role = 'admin', email = 'servis@centrounion.com.mk';

-- Verify (optional): should return one row with role = admin
-- select id, email, role from public.profiles where email = 'servis@centrounion.com.mk';
