<?php
/**
 * Shared SMTP sender for contact and service forms.
 * Upload this file to public_html/api/ next to config.smtp.php.
 * Uses config.smtp.php in the same directory (api/).
 *
 * Returns true if sent, false otherwise.
 */
if (!function_exists('send_mail_smtp')) {
function send_mail_smtp($to, $subject, $body, $fromEmail, $fromName, $replyTo = null) {
  $configPath = __DIR__ . '/config.smtp.php';
  if (!file_exists($configPath)) return false;
  $smtp = require $configPath;
  if (!is_array($smtp) || empty($smtp['host']) || empty($smtp['username']) || empty($smtp['password'])) return false;
  list($sent, ) = send_via_smtp($smtp, $fromEmail, $fromName, $to, $subject, $body, $replyTo);
  return $sent;
}
}

if (!function_exists('send_via_smtp')) {
function send_via_smtp(array $cfg, $fromEmail, $fromName, $to, $subject, $body, $replyTo = null) {
  $host = $cfg['host'];
  $port = (int) ($cfg['port'] ?? 587);
  $user = $cfg['username'];
  $pass = $cfg['password'];
  $secure = isset($cfg['secure']) ? strtolower($cfg['secure']) : 'tls';

  $protocol = ($port === 465 && $secure === 'ssl') ? 'ssl' : 'tcp';
  $ctx = stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]]);
  $errno = 0; $errstr = '';
  $sock = @stream_socket_client($protocol . '://' . $host . ':' . $port, $errno, $errstr, 20, STREAM_CLIENT_CONNECT, $ctx);
  if (!$sock) return [false, "SMTP connect failed: $errstr"];

  $lastLine = '';
  $ok = function($sock, $code) use (&$lastLine) {
    $expected = (int) $code;
    while (true) {
      $line = @fgets($sock, 512);
      if ($line === false) return false;
      $lastLine = trim($line);
      $lineCode = (int) substr($line, 0, 3);
      $fourth = isset($line[3]) ? $line[3] : ' ';
      if ($lineCode === $expected && $fourth === ' ') return true;
      if ($lineCode !== $expected && $fourth === ' ') return false;
    }
  };
  $wr = function($sock, $line) { return @fwrite($sock, $line . "\r\n") !== false; };

  $sent = false; $err = '';
  if (!$ok($sock, 220)) { $err = "Bad welcome: $lastLine"; goto out; }
  if (!$wr($sock, "EHLO localhost") || !$ok($sock, 250)) { $err = "EHLO: $lastLine"; goto out; }
  if ($port === 587 && $secure === 'tls') {
    if (!$wr($sock, 'STARTTLS') || !$ok($sock, 220)) { $err = "STARTTLS: $lastLine"; goto out; }
    if (!@stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) { $err = 'STARTTLS failed'; goto out; }
    if (!$wr($sock, "EHLO localhost") || !$ok($sock, 250)) { $err = "EHLO TLS: $lastLine"; goto out; }
  }
  if (!$wr($sock, 'AUTH LOGIN') || !$ok($sock, 334)) { $err = "AUTH: $lastLine"; goto out; }
  if (!$wr($sock, base64_encode($user)) || !$ok($sock, 334)) { $err = "AUTH user: $lastLine"; goto out; }
  if (!$wr($sock, base64_encode($pass)) || !$ok($sock, 235)) { $err = "AUTH pass: $lastLine"; goto out; }
  if (!$wr($sock, "MAIL FROM:<$fromEmail>") || !$ok($sock, 250)) { $err = "MAIL FROM: $lastLine"; goto out; }
  if (!$wr($sock, "RCPT TO:<$to>") || !$ok($sock, 250)) { $err = "RCPT TO: $lastLine"; goto out; }
  if (!$wr($sock, 'DATA') || !$ok($sock, 354)) { $err = "DATA: $lastLine"; goto out; }
  $msg = "From: $fromName <$fromEmail>\r\nTo: $to\r\nSubject: $subject\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";
  if ($replyTo) $msg .= "Reply-To: $replyTo\r\n";
  $msg .= "\r\n$body\r\n.\r\n";
  if (!$wr($sock, $msg) || !$ok($sock, 250)) { $err = "Send: $lastLine"; goto out; }
  $sent = true;
  out:
  $wr($sock, 'QUIT');
  @fclose($sock);
  return [$sent, $err];
}
}
