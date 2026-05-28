<?php
/**
 * Contact form handler for cPanel deployment.
 * Sends form data to favoritelectro@favoritelectronics.com
 * Place this file in your site root (e.g. public_html) next to the .htaccess.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!is_array($data)) {
    $data = $_POST;
}

$name    = isset($data['name'])    ? trim(strip_tags((string) $data['name']))    : '';
$email   = isset($data['email'])   ? trim((string) $data['email'])               : '';
$phone   = isset($data['phone'])   ? trim(strip_tags((string) $data['phone']))   : '';
$subject = isset($data['subject']) ? trim(strip_tags((string) $data['subject']))  : '';
$message = isset($data['message']) ? trim(strip_tags((string) $data['message'])) : '';

if ($name === '' || $email === '' || $message === '') {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Invalid email']);
    exit;
}

$to      = 'favoritelectro@favoritelectronics.com';
$subj    = 'Contact form: ' . (strlen($subject) > 0 ? $subject : '(No subject)');
$body    = "Name: $name\n";
$body   .= "Email: $email\n";
$body   .= "Phone: $phone\n";
$body   .= "Subject: $subject\n\n";
$body   .= "Message:\n$message\n";

$sent = false;
$helperPath = __DIR__ . '/api/smtp-helper.php';
if (file_exists($helperPath)) {
    require_once $helperPath;
    if (function_exists('send_mail_smtp')) {
        $sent = send_mail_smtp($to, $subj, $body, 'no_reply@favoritelectronics.com', 'Favorit Electronics - Contact', $email);
    }
}
if (!$sent) {
    $headers = "From: noreply@" . ($_SERVER['HTTP_HOST'] ?? 'favoritelectronics.com') . "\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $sent = @mail($to, $subj, $body, $headers);
}

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Server could not send email. Try again or use the email address on the page.']);
}
