# Warranty feature – setup guide

---

## Test on localhost first

Use this order to run and test everything locally before deploying.

1. **Create a Supabase project**  
   Go to [supabase.com](https://supabase.com) → New project. Wait until it’s ready.

2. **Get API keys**  
   In the project: **Project Settings** (gear) → **API**. Copy:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
   - **anon public** key

3. **Configure local env**  
   Edit `src/environments/environment.ts` and replace the placeholders with the URL and anon key you copied. Save the file.

4. **Create database tables**  
   In Supabase: **SQL Editor** → New query. Paste the full contents of **`supabase-warranty-setup.sql`** (in your project root) and run it.

5. **Create an admin user**  
   In Supabase: **Authentication** → **Users** → **Add user**. Enter email and password, then create the user.  
   In **SQL Editor** run (use the same email):
   ```sql
   update public.profiles set role = 'admin' where email = 'your-email@example.com';
   ```

6. **Start the app**  
   In your project folder run:
   ```bash
   npm run start
   ```
   Wait until you see `Local: http://localhost:4200/`.

7. **Test in the browser**  
   - **Warranty form:** open [http://localhost:4200/warranty-register](http://localhost:4200/warranty-register)  
     Fill and submit the form. You should see a success message.  
   - **Admin panel:** open [http://localhost:4200/admin/login](http://localhost:4200/admin/login)  
     Sign in with the admin email and password. You should be redirected to the warranty-check page. Search by serial or email, or click “Show all”, and confirm the submission you made appears.

If any step fails, check the browser console (F12 → Console) and the Supabase project logs.

---

## 1. Supabase project

1. Go to [supabase.com](https://supabase.com), sign in, and create a new project.
2. In **Project Settings → API** copy:
   - **Project URL**
   - **anon public** key

## 2. Environment config

Put these in your Angular app:

- **Development:** edit `src/environments/environment.ts`
- **Production:** edit `src/environments/environment.prod.ts`

Replace placeholders:

```ts
supabase: {
  url: 'https://YOUR_PROJECT_REF.supabase.co',
  anonKey: 'YOUR_ANON_KEY'
}
```

## 3. Database (Supabase SQL Editor)

In Supabase Dashboard → **SQL Editor**, run the contents of **`supabase-warranty-setup.sql`** (create table, RLS policies, profiles, indexes).

## 4. First admin user

1. In Supabase Dashboard go to **Authentication → Users** and click **Add user**. Create a user with the desired admin email and password.
2. In **SQL Editor** run (replace with the admin email you used):

```sql
update public.profiles set role = 'admin' where email = 'your-admin@example.com';
```

3. In your app go to **/admin/login** and sign in with that email and password.

**Note:** If you prefer to allow sign-up from the app, enable **Authentication → Providers → Email → Confirm email** as needed, then sign up once and run the same `update` SQL to set `role = 'admin'`.

## 5. Routes

| URL | Description |
|-----|-------------|
| `/warranty-register` | Public form – customers submit warranty data |
| `/admin/login` | Admin sign in |
| `/admin/warranty-check` | Admin panel – search by serial or email, view all, **edit submissions** |

Footer link “Warranty Registration” points to `/warranty-register`. Admin panel is only for logged-in users with `role = 'admin'` in `profiles`. On the warranty-check page, admins can click **Edit** on any submission to change customer data; changes are saved to the database.

**Existing projects:** If you already ran `supabase-warranty-setup.sql` before the admin-edit feature was added, run **`supabase-warranty-allow-admin-update.sql`** in the SQL Editor once to allow admins to update warranty submissions.

## 6. Build & run

```bash
npm run start
```

Production build:

```bash
npm run build
```

Ensure production env uses the same Supabase URL and anon key in `src/environments/environment.prod.ts`.
