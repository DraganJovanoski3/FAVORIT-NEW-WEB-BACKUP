-- ============================================================
-- Allow ONLY the super admin email to UPDATE warranty submissions.
-- Run this in Supabase Dashboard → SQL Editor.
-- Replace the email below if you need a different super admin.
-- ============================================================

drop policy if exists "Allow admin update warranty" on public.warranty_submissions;

create policy "Allow admin update warranty"
  on public.warranty_submissions for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and email = 'draganjovanoski54@gmail.com'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and email = 'draganjovanoski54@gmail.com'
    )
  );
