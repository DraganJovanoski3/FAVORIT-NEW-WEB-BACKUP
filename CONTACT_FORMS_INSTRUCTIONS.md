# Contact Forms – Instructions

This document describes how the **Contact** page form and the **Service Centre** contact form work, and what you need for deployment.

**Production site:** [https://favoritelectronics.com/](https://favoritelectronics.com/)

---

## 1. Contact component (main contact form)

**Route:** `/new/contact` (or `/contact` depending on your routing)

**Purpose:** General inquiries to the main office.

### Behaviour

- **Fields:** Full Name, Email, Phone, Subject, Message (all required with validation).
- **Submission:** Sends a **POST** request to `/send-contact.php` with JSON body:  
  `{ name, email, phone, subject, message }`.
- **Backend:** `send-contact.php` (in site root) receives the data and sends an email to **favoritelectro@favoritelectronics.com**.
- **Languages:** Labels and messages use `?lang=en|mk|sr|al` (from `contact_*.json` and component code).

### Files involved

| Item | Path |
|------|------|
| Component | `src/app/contact/contact.component.ts` |
| Template | `src/app/contact/contact.component.html` |
| Styles | `src/app/contact/contact.component.css` |
| Translations | `src/app/contact/contact_en.json`, `contact_mk.json`, `contact_sr.json`, `contact_al.json` |
| Backend script | `public_html_root/send-contact.php` → copied to `dist/public_html/send-contact.php` on build |

### Changing the contact endpoint

In `contact.component.ts`:

```ts
const SEND_CONTACT_URL = '/send-contact.php';
```

Change this only if you move or rename the PHP file (e.g. different path on server).

---

## 2. Service centre contact form

**Route:** `/new/service-centers` (or `/service-centers` depending on your routing)

**Purpose:** Messages to the service department (repairs, spare parts, etc.).

### Behaviour

- **Fields:** Full Name, Email, Phone, Subject, Message (same structure as main contact form).
- **Submission:** Sends a **POST** request to `/send-service-contact.php` with JSON:  
  `{ name, email, phone, subject, message }`.
- **Backend:** `send-service-contact.php` (in site root) sends the email to **servis@centrounion.com.mk**.
- **Languages:** Labels from `service_centers_*.json`; error/success messages in the component.

### Files involved

| Item | Path |
|------|------|
| Component | `src/app/service-centers/service-centers.component.ts` |
| Template | `src/app/service-centers/service-centers.component.html` |
| Styles | `src/app/service-centers/service-centers.component.css` |
| Translations | `src/app/service-centers/service_centers_en.json`, `_mk`, `_sr`, `_al` |
| Backend script | `public_html_root/send-service-contact.php` → copied to `dist/public_html/send-service-contact.php` on build |

### Changing the service endpoint

In `service-centers.component.ts`:

```ts
const SEND_SERVICE_CONTACT_URL = '/send-service-contact.php';
```

---

## 3. Backend (PHP) – summary

Both scripts:

- Accept **POST** only.
- Expect **JSON** body (or fallback to `$_POST`).
- Validate: `name`, `email`, `message` required; `email` must be valid.
- **Use SMTP when available:** if `public_html/api/smtp-helper.php` and `public_html/api/config.smtp.php` exist, emails are sent via SMTP (same config as warranty). Otherwise fall back to PHP `mail()`.

| Script | Recipient email |
|--------|------------------|
| `send-contact.php` | favoritelectro@favoritelectronics.com |
| `send-service-contact.php` | servis@centrounion.com.mk |

**SMTP setup:** Upload **`server/smtp-helper.php`** to **`public_html/api/`** so contact and service forms use the same SMTP as the warranty form.

To change recipient: edit the `$to = '...';` line in the corresponding PHP file in **`public_html_root/`**. After the next build, the updated file will be in `dist/public_html/`.

---

## 4. Deploying to https://favoritelectronics.com/

When you deploy to the **main URL** [https://favoritelectronics.com/](https://favoritelectronics.com/):

- **Angular app** is served from: `https://favoritelectronics.com/browser/` (production build uses `baseHref: "/browser/"`).
- **Contact form page:** `https://favoritelectronics.com/browser/contact` (or `/browser/contact?lang=mk`, etc.).
- **Service centre form page:** `https://favoritelectronics.com/browser/service-centers`.
- **Form submissions** go to the **same origin**:
  - Contact → `https://favoritelectronics.com/send-contact.php`
  - Service centre → `https://favoritelectronics.com/send-service-contact.php`

So on the server, the **document root** (e.g. `public_html`) must contain:

- `.htaccess`
- `send-contact.php`
- `send-service-contact.php`
- `browser/` (the Angular build: `index.html`, `main-*.js`, `styles-*.css`, etc.)
- Any other root-level files (e.g. `sitemap.xml`, `product-*.html` if you use static HTML there).

No code changes are needed for the main URL; the app already uses relative paths (`/send-contact.php`, `/send-service-contact.php`), so they resolve correctly on favoritelectronics.com.

---

## 5. Build and deploy

### Build (includes contact scripts)

```bash
npm run build
```

This:

1. Builds the Angular app to `dist/public_html/`.
2. Copies into `dist/public_html/`:
   - `public_html_root/.htaccess`
   - `public_html_root/send-contact.php`
   - `public_html_root/send-service-contact.php`

So the contact and service centre forms will work only if you deploy the contents of **`dist/public_html/`** (including those two PHP files and `.htaccess`) to your **site root** (e.g. `public_html` on cPanel).

### Deploy checklist

1. Upload **all** of `dist/public_html/` to the **document root** for [favoritelectronics.com](https://favoritelectronics.com/) (e.g. cPanel `public_html`).
2. Ensure **`send-contact.php`** and **`send-service-contact.php`** are in the **same directory** as **`.htaccess`** (site root).
3. Server must run **PHP** and allow **`mail()`** (or equivalent). If mail does not send, check:
   - PHP mail settings in cPanel
   - Or configure an SMTP forwarder / plugin so that `mail()` actually delivers.

### Testing after deploy (favoritelectronics.com)

- **Contact form:** Open [https://favoritelectronics.com/browser/contact](https://favoritelectronics.com/browser/contact), fill and submit. Check inbox of **favoritelectro@favoritelectronics.com**.
- **Service centre form:** Open [https://favoritelectronics.com/browser/service-centers](https://favoritelectronics.com/browser/service-centers), fill and submit. Emails go to **servis@centrounion.com.mk**.

If the request fails (e.g. 404), confirm the PHP files are in the document root and that your server executes `.php` files.

---

## 6. Quick reference

| Form | Page | POST URL | Recipient |
|------|------|----------|-----------|
| Contact | Contact | `/send-contact.php` | favoritelectro@favoritelectronics.com |
| Service centre | Service Centers | `/send-service-contact.php` | servis@centrounion.com.mk |

Both forms send: `name`, `email`, `phone`, `subject`, `message` (JSON).  
Backend expects these in the same directory as `.htaccess` in production.
