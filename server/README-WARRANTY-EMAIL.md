# Warranty confirmation email (server)

**Quick steps:** Create a folder (e.g. `api`) inside **public_html** on your server, then upload **`send-warranty-confirmation.php`** into that folder. Set `warrantyConfirmationApiUrl` in the Angular app to `https://yourdomain.com/api/send-warranty-confirmation.php`.

---

## What it does

When a customer submits the warranty registration form:

1. Data is saved to Supabase (unchanged).
2. If `warrantyConfirmationApiUrl` is set in the Angular environment, the app calls this endpoint with the submission data.
3. This script sends an email **to the customer** from `no_reply@favoritelectronics.com` saying the warranty extension is in effect (if details are correct) and listing what they entered as a reminder.

## Setup

### 1. Create a folder and add the PHP file on your server

On your hosting (e.g. cPanel, FTP):

1. Go to **public_html** (the root folder of your website).
2. Create a new folder, for example **`api`** (you can use another name like `warranty` if you prefer).
3. Upload **`send-warranty-confirmation.php`** into that folder.

Your file path on the server will look like:

```
public_html/
  api/
    send-warranty-confirmation.php
```

The URL to use in the app will be:

- `https://yourdomain.com/api/send-warranty-confirmation.php`  
  (replace `yourdomain.com` with your real domain, and `api` with the folder name you chose)

### 2. Configure the Angular app

In **production** set the API URL:

- **`src/environments/environment.prod.ts`**  
  Set:
  ```ts
  warrantyConfirmationApiUrl: 'https://favoritelectronics.com/api/send-warranty-confirmation.php'
  ```
  (Use your real domain and path.)

### 3. Emails not arriving (e.g. Gmail)? Use SMTP

PHP `mail()` often does not deliver to Gmail/Outlook. To fix: copy **config.smtp.example.php** to **config.smtp.php** in the same folder, set the password for **no_reply@favoritelectronics.com** (host: mail.favoritelectronics.com, SMTP port: 465, SSL), then upload both the script and config.smtp.php. The script will then send via SMTP.
- **If using SMTP**: If `mail()` does not work or you want to use your WebMail account, replace the `mail()` call with your host’s SMTP or a library like **PHPMailer** and use the same “from” address and credentials you use in WebMail.

### 4. CORS (if API is on another domain)

The script sends `Access-Control-Allow-Origin: *` so the Angular app can call it from the browser. For production you can restrict this to your site’s origin (e.g. `https://favoritelectronics.com`).

## Summary

| Step | Action |
|------|--------|
| 1 | Upload `send-warranty-confirmation.php` to your server. |
| 2 | Set `warrantyConfirmationApiUrl` in `environment.prod.ts` to that URL. |
| 3 | Ensure the server can send mail (mail() or SMTP/WebMail). |

The customer receives one email per submission with the “warranty in effect” message and a reminder of their submitted details.
