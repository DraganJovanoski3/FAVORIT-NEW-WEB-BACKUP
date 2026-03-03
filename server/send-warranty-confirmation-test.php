<?php
/**
 * One-time test script for warranty confirmation SMTP.
 * Upload to the same folder as send-warranty-confirmation.php and open in browser:
 *   https://favoritelectronics.com/api/send-warranty-confirmation-test.php
 * Replace YOUR_TEST_EMAIL below with your Gmail (or any email) to receive a test message.
 * Delete this file after debugging (it exposes error details).
 */
header('Content-Type: text/plain; charset=utf-8');

define('TEST_TO_EMAIL', 'YOUR_TEST_EMAIL@gmail.com'); // <-- Put your email here

$configPath = __DIR__ . '/config.smtp.php';
if (!file_exists($configPath)) {
  echo "ERROR: config.smtp.php not found in " . __DIR__ . "\n";
  echo "Copy config.smtp.example.php to config.smtp.php and set your SMTP password.\n";
  exit;
}

$smtp = require $configPath;
if (!is_array($smtp) || empty($smtp['host']) || empty($smtp['username']) || empty($smtp['password'])) {
  echo "ERROR: config.smtp.php must return array with host, username, password.\n";
  exit;
}

// Use the same send_via_smtp logic - we need to include it or reimplement minimal
// Instead we'll do a minimal connection test and then suggest they check the real script response
echo "Config found: host={$smtp['host']} port=" . ($smtp['port'] ?? 465) . " user={$smtp['username']}\n\n";

$host = $smtp['host'];
$port = (int) ($smtp['port'] ?? 465);
$protocol = ($port === 465) ? 'ssl' : 'tcp';
$ctx = stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]]);
$errno = 0; $errstr = '';
$sock = @stream_socket_client($protocol . '://' . $host . ':' . $port, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);

if (!$sock) {
  echo "CONNECTION FAILED: [{$errno}] {$errstr}\n";
  echo "\nTry: port 587 with secure=tls (edit config.smtp.php: port 587, secure tls)\n";
  exit;
}

echo "Connected to {$host}:{$port}.\n";
$line = @fgets($sock, 512);
echo "Server: " . trim($line) . "\n";
@fclose($sock);

echo "\nConnection OK. To see the full error when sending:\n";
echo "1. Submit the warranty form on the site.\n";
echo "2. Open DevTools (F12) -> Network tab -> click the POST to send-warranty-confirmation.php -> Response.\n";
echo "3. The JSON will show 'detail' with the exact SMTP error (e.g. wrong password).\n";
echo "\nOr set TEST_TO_EMAIL above to your email and run this test again after adding the send call.\n";
