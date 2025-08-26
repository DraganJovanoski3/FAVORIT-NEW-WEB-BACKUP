const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://favoritelectronics.com/';

// Helper to escape HTML
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Helper to sanitize filename for Windows
function sanitizeFilename(filename) {
  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remove Windows forbidden characters
    .replace(/[čćđšžČĆĐŠŽ]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-\.]/g, '') // Keep only alphanumeric, hyphens, and dots
    .substring(0, 200); // Limit length
}

// Helper to create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper to encode URL properly
function encodeUrl(url) {
  return encodeURIComponent(url).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

// Generate blog static HTML files
function generateBlogFiles() {
  console.log('Generating blog static HTML files...');
  
  // Load blog data for all languages
  const blogs_mk = JSON.parse(fs.readFileSync('./src/app/blog-list/blogs_mk.json', 'utf8'));
  const blogs_en = JSON.parse(fs.readFileSync('./src/app/blog-list/blogs_en.json', 'utf8'));
  const blogs_sr = JSON.parse(fs.readFileSync('./src/app/blog-list/blogs_sr.json', 'utf8'));
  const blogs_al = JSON.parse(fs.readFileSync('./src/app/blog-list/blogs_al.json', 'utf8'));
  
  const blogData = {
    mk: blogs_mk.blogs,
    en: blogs_en.blogs,
    sr: blogs_sr.blogs,
    al: blogs_al.blogs
  };
  
  // Create static-blogs directory in root
  const blogsDir = './static-blogs';
  ensureDirectoryExists(blogsDir);
  
  // Create language subdirectories
  Object.keys(blogData).forEach(lang => {
    const langDir = `${blogsDir}/${lang}`;
    ensureDirectoryExists(langDir);
    
    blogData[lang].forEach(blog => {
      const blogUrl = `blog-${sanitizeFilename(blog.id)}.html`;
      const fullUrl = `${DOMAIN}new/blog/${encodeUrl(blog.id)}?lang=${lang}`;
      
      const htmlContent = generateBlogHTML(blog, lang, fullUrl);
      fs.writeFileSync(`${langDir}/${blogUrl}`, htmlContent, 'utf8');
      
      console.log(`Generated: ${langDir}/${blogUrl}`);
    });
  });
  
  console.log('Blog static HTML generation completed!');
}

function generateBlogHTML(blog, lang, fullUrl) {
  const imageUrl = blog.image.startsWith('http') ? blog.image : `${DOMAIN}${blog.image}`;
  
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(blog.title)} - Favorit Electronics</title>
  <base href="/new/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="${escapeHtml(blog.title)}" />
  <meta property="og:description" content="${escapeHtml(blog.excerpt)}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="${fullUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Favorit Electronics" />
  <meta property="og:locale" content="${getLocale(lang)}" />
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(blog.title)}" />
  <meta name="twitter:description" content="${escapeHtml(blog.excerpt)}" />
  <meta name="twitter:image" content="${imageUrl}" />
  
  <!-- WhatsApp and Viber Meta Tags -->
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:alt" content="${escapeHtml(blog.title)}" />
  
  <!-- Additional Meta Tags -->
  <meta name="description" content="${escapeHtml(blog.excerpt)}" />
  <meta name="author" content="Favorit Electronics" />
  <meta name="robots" content="index, follow" />
  
  <!-- Article Specific Meta Tags -->
  <meta property="article:published_time" content="${blog.date}T00:00:00Z" />
  <meta property="article:author" content="Favorit Electronics" />
  <meta property="article:section" content="Blog" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${fullUrl}" />
  
  <!-- Redirect to Angular app -->
  <script>
    window.location.href = '${fullUrl}';
  </script>
</head>
<body>
  <div id="loading">
    <h1>${escapeHtml(blog.title)}</h1>
    <p>${escapeHtml(blog.excerpt)}</p>
    <p>Redirecting to the full article...</p>
  </div>
</body>
</html>`;
}

function getLocale(lang) {
  const locales = {
    mk: 'mk',
    en: 'en',
    sr: 'sr',
    al: 'al'
  };
  return locales[lang] || 'en';
}

// Run the generation
generateBlogFiles(); 