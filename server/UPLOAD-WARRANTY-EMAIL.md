# What to upload for warranty confirmation email (no_reply@favoritelectronics.com)

Upload these to your **public_html** on the server (cPanel File Manager or FTP).

---

## 1. Create the `api` folder (if it doesn’t exist)

- Path on server: **`public_html/api/`**

---

## 2. Upload the warranty script

| From (your project)           | To (on server)                    |
|------------------------------|------------------------------------|
| `server/send-warranty-confirmation.php` | `public_html/api/send-warranty-confirmation.php` |

This script sends the confirmation from **no_reply@favoritelectronics.com** and uses SMTP when `config.smtp.php` is present.

---

## 3. Add SMTP config (required for delivery)

1. On your computer: copy **`server/config.smtp.example.php`** and rename the copy to **`config.smtp.php`**.
2. Open **`config.smtp.php`** and set **`password`** to the real password for **no_reply@favoritelectronics.com** (the one from cPanel WebMail).
3. Upload **`config.smtp.php`** to **`public_html/api/`**.

**Important:** Do **not** upload `config.smtp.example.php` with the real password. Upload only your filled-in **`config.smtp.php`** (and keep it out of git).

Result on server:

```
public_html/
  api/
    send-warranty-confirmation.php   ← from step 2
    config.smtp.php                  ← from step 3 (with real password)
```

---

## 4. Check the app URL (already set)

The app calls:

- **`https://favoritelectronics.com/api/send-warranty-confirmation.php`**

This is already set in `src/environments/environment.prod.ts`. After you build and deploy the Angular app, no extra upload is needed for the URL. If you haven’t deployed the latest build yet, deploy the built app as usual.

---

## Summary

| Upload to server                         | Purpose                                      |
|-----------------------------------------|----------------------------------------------|
| `public_html/api/send-warranty-confirmation.php` | Sends the warranty confirmation email        |
| `public_html/api/config.smtp.php`       | SMTP login for no_reply@favoritelectronics.com (password inside) |

After both files are in place, warranty confirmations are sent via SMTP from **no_reply@favoritelectronics.com**.
