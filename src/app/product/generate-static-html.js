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

// Generate product static HTML files
function generateProductFiles() {
  console.log('Generating product static HTML files...');
  
  // Load product data
  const products = JSON.parse(fs.readFileSync('./src/app/product/products_list_mk.json', 'utf8'));
  
  // Create products directory in root
  const productsDir = './static-products';
  ensureDirectoryExists(productsDir);

  products.forEach(product => {
    const id = product.id;
    const name = escapeHtml(product.name);
    const description = escapeHtml(product.description[0] || '');
    
    // Get the first product image or use default
    let imageUrl = DOMAIN + 'assets/favorit-logo.png';
    if (product.pictures && product.pictures[0]) {
      // Clean up the image path and encode it properly
      const imagePath = product.pictures[0].replace(/ /g, '%20');
      imageUrl = DOMAIN + imagePath;
    }

    const url = `${DOMAIN}product/${id}`;
    const currentUrl = `${DOMAIN}new/p/${id}?lang=mk`;

    const html = `<!DOCTYPE html>
<html lang="mk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Favorit Electronics</title>
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="${name}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${name}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${currentUrl}">
  <meta property="og:site_name" content="Favorit Electronics">
  <meta property="og:locale" content="mk">
  <meta property="og:locale:alternate" content="en">
  <meta property="og:locale:alternate" content="sr">
  <meta property="og:locale:alternate" content="al">
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${name}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${name}">
  <meta name="twitter:site" content="@favoritelectronics">
  
  <!-- WhatsApp and Viber Meta Tags -->
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:secure_url" content="${imageUrl}">
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="${description}">
  <meta name="keywords" content="${name}, Favorit Electronics, home appliances, ${product.category || 'electronics'}, Macedonia">
  <meta name="author" content="Favorit Electronics">
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
  <meta name="language" content="Macedonian">
  <meta name="revisit-after" content="7 days">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${currentUrl}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="${DOMAIN}favicon.ico">
  
  <!-- Structured Data for Products -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${name}",
    "description": "${description}",
    "image": "${imageUrl}",
    "brand": {
      "@type": "Brand",
      "name": "Favorit Electronics"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Favorit Electronics"
      }
    }
  }
  </script>
  
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
      text-align: center;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .logo {
      width: 200px;
      margin-bottom: 30px;
    }
    .product-image {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 20px 0;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #204880;
      margin-bottom: 20px;
      font-size: 24px;
    }
    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 30px;
      font-size: 16px;
    }
    .btn {
      background: #204880;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin: 10px;
      transition: background 0.3s;
      font-weight: bold;
    }
    .btn:hover {
      background: #2c5aa0;
    }
    .redirect-info {
      background: #e8f4fd;
      padding: 20px;
      border-radius: 5px;
      margin-top: 20px;
      color: #204880;
    }
    .meta-info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="${DOMAIN}assets/favorit-logo.png" alt="Favorit Electronics" class="logo">
    
    <img src="${imageUrl}" alt="${name}" class="product-image">
    
    <h1>${name}</h1>
    <p>${description}</p>
    
    <div class="meta-info">
      <strong>Product ID:</strong> ${id}<br>
      <strong>Category:</strong> Favorit Electronics<br>
      <strong>Available:</strong> In Stock
    </div>
    
    <div class="redirect-info">
      <p>Redirecting to the full product page...</p>
    </div>
    
    <a href="${url}" class="btn">View Full Product</a>
    <a href="${DOMAIN}" class="btn">Back to Home</a>
  </div>
  
  <script>
    // Redirect after 5 seconds to allow crawlers to read meta tags
    setTimeout(function() {
      window.location.href = "${url}";
    }, 5000);
  </script>
</body>
</html>`;

    // Save to static-products directory
    fs.writeFileSync(`${productsDir}/product-${id}.html`, html, 'utf8');
    
    console.log(`Generated product-${id}.html`);
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
  
  // Create blogs directory in root
  const blogsDir = './static-blogs';
  ensureDirectoryExists(blogsDir);

  // Process blogs for each language
  const languages = [
    { code: 'mk', data: blogs_mk.blogs },
    { code: 'en', data: blogs_en.blogs },
    { code: 'sr', data: blogs_sr.blogs },
    { code: 'al', data: blogs_al.blogs }
  ];

  languages.forEach(lang => {
    const langDir = `${blogsDir}/${lang.code}`;
    ensureDirectoryExists(langDir);

    lang.data.forEach(blog => {
      const id = blog.id;
      const sanitizedId = sanitizeFilename(id);
      const title = escapeHtml(blog.title);
      const excerpt = escapeHtml(blog.excerpt);
      const image = blog.image ? DOMAIN + blog.image : DOMAIN + 'assets/favorit-logo.png';
      const url = `${DOMAIN}blog/${id}?lang=${lang.code}`;
      const currentUrl = `${DOMAIN}new/static-blogs/${lang.code}/blog-${sanitizedId}.html`;
      const publishDate = blog.date || new Date().toISOString().split('T')[0];

      const html = `<!DOCTYPE html>
<html lang="${lang.code}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Favorit Electronics</title>
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${excerpt}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${title}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${currentUrl}">
  <meta property="og:site_name" content="Favorit Electronics">
  <meta property="og:locale" content="${lang.code === 'mk' ? 'mk_MK' : lang.code === 'en' ? 'en_US' : lang.code === 'sr' ? 'sr_RS' : 'sq_AL'}">
  <meta property="article:published_time" content="${publishDate}">
  <meta property="article:author" content="Favorit Electronics">
  <meta property="article:section" content="Blog">
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${excerpt}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${title}">
  <meta name="twitter:site" content="@favoritelectronics">
  
  <!-- Additional Meta Tags -->
  <meta name="description" content="${excerpt}">
  <meta name="keywords" content="Favorit Electronics, blog, ${title}, household appliances, Macedonia">
  <meta name="author" content="Favorit Electronics">
  <meta name="robots" content="index, follow">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${url}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="${DOMAIN}favicon.ico">
  
  <!-- Structured Data for Articles -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title}",
    "description": "${excerpt}",
    "image": "${image}",
    "author": {
      "@type": "Organization",
      "name": "Favorit Electronics"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Favorit Electronics",
      "logo": {
        "@type": "ImageObject",
        "url": "${DOMAIN}assets/favorit-logo.png"
      }
    },
    "datePublished": "${publishDate}",
    "dateModified": "${publishDate}"
  }
  </script>
  
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
      text-align: center;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .logo {
      width: 200px;
      margin-bottom: 30px;
    }
    .blog-image {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 20px 0;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #204880;
      margin-bottom: 20px;
      font-size: 24px;
    }
    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 30px;
      font-size: 16px;
    }
    .btn {
      background: #204880;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin: 10px;
      transition: background 0.3s;
      font-weight: bold;
    }
    .btn:hover {
      background: #2c5aa0;
    }
    .redirect-info {
      background: #e8f4fd;
      padding: 20px;
      border-radius: 5px;
      margin-top: 20px;
      color: #204880;
    }
    .meta-info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="${DOMAIN}assets/favorit-logo.png" alt="Favorit Electronics" class="logo">
    
    <img src="${image}" alt="${title}" class="blog-image">
    
    <h1>${title}</h1>
    <p>${excerpt}</p>
    
    <div class="meta-info">
      <strong>Published:</strong> ${publishDate}<br>
      <strong>Category:</strong> Blog<br>
      <strong>Language:</strong> ${lang.code.toUpperCase()}
    </div>
    
    <div class="redirect-info">
      <p>Redirecting to the full blog post...</p>
    </div>
    
    <a href="${url}" class="btn">Read Full Article</a>
    <a href="${DOMAIN}" class="btn">Back to Home</a>
  </div>
  
  <script>
    // Redirect after 5 seconds to allow crawlers to read meta tags
    setTimeout(function() {
      window.location.href = "${url}";
    }, 5000);
  </script>
</body>
</html>`;

      fs.writeFileSync(`${langDir}/blog-${sanitizedId}.html`, html, 'utf8');
      console.log(`Generated blog-${sanitizedId}.html for language ${lang.code}`);
    });
  });
}

// Main execution
try {
  generateProductFiles();
  generateBlogFiles();
  console.log('Static HTML generation completed successfully!');
  console.log('Files generated in:');
  console.log('- ./static-products/ (optimized product files with SEO + Open Graph)');
  console.log('- ./static-blogs/ (blog files by language)');
} catch (error) {
  console.error('Error generating static HTML files:', error);
}