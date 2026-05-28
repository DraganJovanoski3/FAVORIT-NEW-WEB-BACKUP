<?php
/**
 * Warranty confirmation email endpoint.
 * Upload this file to your server (e.g. in /api/ or /server/) and set
 * environment.warrantyConfirmationApiUrl in the Angular app to this URL.
 *
 * Sends a confirmation email to the customer from no_reply@favoritelectronics.com
 * stating that the warranty extension is in effect (if details are correct) and listing
 * the submitted data as a reminder.
 *
 * Requires: PHP with mail() or configure SMTP (see below).
 * Optional: For WebMail/SMTP, use PHPMailer or your host's mail API.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// GET = simple check (e.g. opening URL in browser). Only POST sends the email.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode([
    'ok' => true,
    'message' => 'Warranty confirmation endpoint. Use POST with JSON body to send confirmation email.'
  ]);
  exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data) || empty($data['email'])) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid or missing data']);
  exit;
}

$to = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid email']);
  exit;
}

$fromEmail = 'no_reply@favoritelectronics.com';
$fromName = 'Favorit Electronics - Warranty';

$lang = isset($data['lang']) && in_array($data['lang'], ['en', 'mk', 'sr', 'al'], true) ? $data['lang'] : 'en';

$deviceTypeLabels = [
  'en' => ['home-appliances' => 'Home Appliances'],
  'mk' => ['home-appliances' => 'Бела Техника'],
  'sr' => ['home-appliances' => 'Kućni aparati'],
  'al' => ['home-appliances' => 'Pajisje shtëpiake']
];
$dt = $data['device_type'] ?? '';
$deviceTypeDisplay = isset($deviceTypeLabels[$lang][$dt]) ? $deviceTypeLabels[$lang][$dt] : (isset($deviceTypeLabels['en'][$dt]) ? $deviceTypeLabels['en'][$dt] : $dt);

$t = [
  'en' => [
    'dear' => 'Dear', 'intro1' => 'Thank you for registering your product for warranty extension.',
    'intro2' => 'Your warranty extension is in effect provided all the details you submitted are correct.',
    'reminder' => 'Below is a reminder of the information you entered on our website:',
    'yourSubmission' => 'Your submission', 'ifIncorrect' => 'If any of the above is incorrect, please contact us.',
    'bestRegards' => 'Best regards', 'firstName' => 'First name', 'lastName' => 'Last name', 'address' => 'Address',
    'city' => 'City', 'postalCode' => 'Postal code', 'phone' => 'Phone', 'email' => 'Email', 'deviceType' => 'Device type',
    'deviceModel' => 'Device model', 'serialNumber' => 'Serial number', 'purchaseDate' => 'Purchase date',
    'placeOfPurchase' => 'Place of purchase', 'cityOfPurchase' => 'City of purchase', 'fiscalReceipt' => 'Fiscal receipt number'
  ],
  'mk' => [
    'dear' => 'Почитуван', 'intro1' => 'Ви благодариме што ја регистриравте вашата гаранција за продолжување.',
    'intro2' => 'Продолжената гаранција е во сила доколку сите податоци се точни.',
    'reminder' => 'Подолу е потсетник на податоците што ги внесовте:',
    'yourSubmission' => 'Вашиот поднесок', 'ifIncorrect' => 'Доколку нешто не е точно, контактирајте не.',
    'bestRegards' => 'Со почит', 'firstName' => 'Име', 'lastName' => 'Презиме', 'address' => 'Адреса',
    'city' => 'Град', 'postalCode' => 'Поштенски број', 'phone' => 'Телефон', 'email' => 'Е-пошта', 'deviceType' => 'Вид уред',
    'deviceModel' => 'Модел', 'serialNumber' => 'Сериски број', 'purchaseDate' => 'Датум на купување',
    'placeOfPurchase' => 'Место на купување', 'cityOfPurchase' => 'Град на купување', 'fiscalReceipt' => 'Број на фискална сметка'
  ],
  'sr' => [
    'dear' => 'Poštovani', 'intro1' => 'Hvala vam što ste registovali produženje garancije.',
    'intro2' => 'Produžena garancija važi pod uslovom da su svi podaci tačni.',
    'reminder' => 'Ispod je podsetnik podataka koje ste uneli:',
    'yourSubmission' => 'Vaš unos', 'ifIncorrect' => 'Ako nešto nije tačno, kontaktirajte nas.',
    'bestRegards' => 'S poštovanjem', 'firstName' => 'Ime', 'lastName' => 'Prezime', 'address' => 'Adresa',
    'city' => 'Grad', 'postalCode' => 'Poštanski broj', 'phone' => 'Telefon', 'email' => 'Email', 'deviceType' => 'Vrsta uređaja',
    'deviceModel' => 'Model', 'serialNumber' => 'Serijski broj', 'purchaseDate' => 'Datum kupovine',
    'placeOfPurchase' => 'Mesto kupovine', 'cityOfPurchase' => 'Grad kupovine', 'fiscalReceipt' => 'Broj fiskalnog računa'
  ],
  'al' => [
    'dear' => 'I nderuar', 'intro1' => 'Faleminderit që regjistruat garancinë e zgjatur.',
    'intro2' => 'Zgjatja e garancisë është në fuqi nëse të gjitha të dhënat janë të sakta.',
    'reminder' => 'Më poshtë është një kujtesë e të dhënave që keni futur:',
    'yourSubmission' => 'Të dhënat tuaja', 'ifIncorrect' => 'Nëse diçka nuk është e saktë, na kontaktoni.',
    'bestRegards' => 'Me respekt', 'firstName' => 'Emri', 'lastName' => 'Mbiemri', 'address' => 'Adresa',
    'city' => 'Qyteti', 'postalCode' => 'Kodi postar', 'phone' => 'Telefoni', 'email' => 'Email', 'deviceType' => 'Lloji i pajisjes',
    'deviceModel' => 'Modeli', 'serialNumber' => 'Numri serik', 'purchaseDate' => 'Data e blerjes',
    'placeOfPurchase' => 'Vendi i blerjes', 'cityOfPurchase' => 'Qyteti i blerjes', 'fiscalReceipt' => 'Numri i faturës fiskale'
  ]
];
$L = isset($t[$lang]) ? $t[$lang] : $t['en'];

$subject = 'Warranty registration confirmation - Favorit Electronics';

$eol = "\r\n";
$firstName = $data['first_name'] ?? 'Customer';
$body = $L['dear'] . ' ' . $firstName . ',' . $eol . $eol;
$body .= $L['intro1'] . $eol . $eol;
$body .= $L['intro2'] . $eol . $eol;
$body .= $L['reminder'] . $eol . $eol;
$body .= "----------------------------------------" . $eol;
$body .= $L['yourSubmission'] . $eol;
$body .= "----------------------------------------" . $eol . $eol;
$body .= $L['firstName'] . ": " . ($data['first_name'] ?? '') . $eol;
$body .= $L['lastName'] . ": " . ($data['last_name'] ?? '') . $eol;
$body .= $L['address'] . ": " . ($data['address'] ?? '') . $eol;
$body .= $L['city'] . ": " . ($data['city'] ?? '') . $eol;
$body .= $L['postalCode'] . ": " . ($data['postal_code'] ?? '') . $eol;
$body .= $L['phone'] . ": " . ($data['phone'] ?? '') . $eol;
$body .= $L['email'] . ": " . ($data['email'] ?? '') . $eol;
$body .= $L['deviceType'] . ": " . $deviceTypeDisplay . $eol;
$body .= $L['deviceModel'] . ": " . ($data['device_model'] ?? '') . $eol;
$body .= $L['serialNumber'] . ": " . ($data['serial_number'] ?? '') . $eol;
$body .= $L['purchaseDate'] . ": " . ($data['purchase_date'] ?? '') . $eol;
$body .= $L['placeOfPurchase'] . ": " . ($data['place_of_purchase'] ?? '') . $eol;
$body .= $L['cityOfPurchase'] . ": " . ($data['city_of_purchase'] ?? '') . $eol;
$body .= $L['fiscalReceipt'] . ": " . ($data['fiscal_receipt_number'] ?? '') . $eol . $eol;
$body .= "----------------------------------------" . $eol . $eol;
$body .= $L['ifIncorrect'] . $eol . $eol;
$body .= $L['bestRegards'] . "," . $eol . "Favorit Electronics" . $eol;

$sent = false;
$sentVia = '';
$sendError = '';
$configPath = __DIR__ . '/config.smtp.php';

$useSmtp = false;
if (file_exists($configPath)) {
  $smtp = require $configPath;
  if (is_array($smtp) && !empty($smtp['host']) && !empty($smtp['username']) && !empty($smtp['password'])) {
    $useSmtp = true;
    list($sent, $sendError) = send_via_smtp($smtp, $fromEmail, $fromName, $to, $subject, $body, $fromEmail);
    if ($sent) $sentVia = 'smtp';
  } else {
    $sendError = 'config.smtp.php exists but missing host/username/password';
  }
} else {
  $sendError = 'config.smtp.php not found in ' . __DIR__;
}

// Only fall back to mail() if SMTP is NOT configured. If SMTP is configured but failed, return the error.
if (!$sent && !$useSmtp) {
  $headers = [];
  $headers[] = 'MIME-Version: 1.0';
  $headers[] = 'Content-Type: text/plain; charset=UTF-8';
  $headers[] = 'From: ' . $fromName . ' <' . $fromEmail . '>';
  $headers[] = 'Reply-To: ' . $fromEmail;
  $headerStr = implode("\r\n", $headers);
  $sent = @mail($to, $subject, $body, $headerStr);
  if ($sent) $sentVia = 'mail';
  if (!$sent) $sendError = $sendError ?: 'mail() failed (use config.smtp.php for SMTP)';
}

if ($sent) {
  echo json_encode(['ok' => true, 'sent_via' => $sentVia ?: 'mail']);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Failed to send email.', 'detail' => $sendError]);
}

/**
 * Send email via SMTP (AUTH LOGIN). Returns [success, error_message].
 */
function send_via_smtp(array $cfg, $fromEmail, $fromName, $to, $subject, $body, $bcc = null) {
  $host = $cfg['host'];
  $port = (int) ($cfg['port'] ?? 587);
  $user = $cfg['username'];
  $pass = $cfg['password'];
  $secure = isset($cfg['secure']) ? strtolower($cfg['secure']) : 'tls';

  $errno = 0;
  $errstr = '';
  $protocol = ($port === 465 && $secure === 'ssl') ? 'ssl' : 'tcp';
  $ctx = stream_context_create([
    'ssl' => ['verify_peer' => false, 'verify_peer_name' => false]
  ]);
  $sock = @stream_socket_client(
    $protocol . '://' . $host . ':' . $port,
    $errno,
    $errstr,
    20,
    STREAM_CLIENT_CONNECT,
    $ctx
  );
  if (!$sock) {
    return [false, "SMTP connect to {$host}:{$port} failed: [{$errno}] {$errstr}"];
  }

  $lastLine = '';
  // SMTP can send multi-line replies (e.g. 220-line1, 220-line2, 220 done). Read until final line (code + space, not code + hyphen).
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
  $wr = function($sock, $line) {
    return @fwrite($sock, $line . "\r\n") !== false;
  };

  $sent = false;
  $err = '';

  if (!$ok($sock, 220)) { $err = "Bad welcome: {$lastLine}"; goto out; }
  $localName = 'localhost';
  if (!$wr($sock, "EHLO $localName") || !$ok($sock, 250)) { $err = "EHLO: {$lastLine}"; goto out; }

  if ($port === 587 && $secure === 'tls') {
    if (!$wr($sock, 'STARTTLS') || !$ok($sock, 220)) { $err = "STARTTLS: {$lastLine}"; goto out; }
    if (!@stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
      $err = 'STARTTLS crypto failed'; goto out;
    }
    if (!$wr($sock, "EHLO $localName") || !$ok($sock, 250)) { $err = "EHLO after TLS: {$lastLine}"; goto out; }
  }

  if (!$wr($sock, 'AUTH LOGIN') || !$ok($sock, 334)) { $err = "AUTH: {$lastLine}"; goto out; }
  if (!$wr($sock, base64_encode($user)) || !$ok($sock, 334)) { $err = "AUTH user: {$lastLine}"; goto out; }
  if (!$wr($sock, base64_encode($pass)) || !$ok($sock, 235)) { $err = "AUTH pass (wrong password?): {$lastLine}"; goto out; }

  if (!$wr($sock, "MAIL FROM:<$fromEmail>") || !$ok($sock, 250)) { $err = "MAIL FROM: {$lastLine}"; goto out; }
  if (!$wr($sock, "RCPT TO:<$to>") || !$ok($sock, 250)) { $err = "RCPT TO: {$lastLine}"; goto out; }
  if ($bcc && $bcc !== $to) {
    if (!$wr($sock, "RCPT TO:<$bcc>") || !$ok($sock, 250)) { $err = "RCPT BCC: {$lastLine}"; goto out; }
  }
  if (!$wr($sock, 'DATA') || !$ok($sock, 354)) { $err = "DATA: {$lastLine}"; goto out; }

  $msg = "From: $fromName <$fromEmail>\r\nTo: $to\r\nSubject: $subject\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";
  if ($bcc && $bcc !== $to) $msg .= "Bcc: $bcc\r\n";
  $msg .= "\r\n$body\r\n.\r\n";
  if (!$wr($sock, $msg)) { $err = 'Send body failed'; goto out; }
  if (!$ok($sock, 250)) { $err = "Server after DATA: {$lastLine}"; goto out; }
  $sent = true;

  out:
  $wr($sock, 'QUIT');
  @fclose($sock);
  return [$sent, $err];
}
