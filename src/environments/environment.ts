export const environment = {
  production: false,
  supabase: {
    url: 'https://gyfjzivzwogkfofzumnl.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5Zmp6aXZ6d29na2ZvZnp1bW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDYxMDQsImV4cCI6MjA4NjQ4MjEwNH0.8MNSw8lNzl89GtENmLAaHrrFAvKhcwhhME79WK3_g_w'
  },
  /** Optional: URL of your server endpoint that sends warranty confirmation email (e.g. https://yoursite.com/api/send-warranty-confirmation.php). Leave empty to skip sending confirmation email. */
  warrantyConfirmationApiUrl: 'https://favoritelectronics.com/api/send-warranty-confirmation.php',
  /** Only this email can see and use the Edit button on warranty submissions in admin. */
  superAdminEmail: 'draganjovanoski54@gmail.com'
};
