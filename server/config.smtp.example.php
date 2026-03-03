<?php
/**
 * SMTP configuration for warranty confirmation emails.
 * Copy this file to config.smtp.php and fill in your WebMail SMTP details.
 * Use the same host / username / password you use for warranty_confirmation@favoritelectronics.com in WebMail.
 *
 * Do NOT commit config.smtp.php (with real password) to version control.
 */
return [
    'host'     => 'mail.favoritelectronics.com',
    'port'     => 465,                             // Your server: 465 (SSL). Use 587 for TLS.
    'secure'   => 'ssl',                           // ssl for port 465, tls for port 587
    'username' => 'warranty_confirmation@favoritelectronics.com',
    'password' => 'YOUR_WEBMAIL_PASSWORD_HERE',    // Use the email account's password
];
