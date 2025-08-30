const fs = require('fs');
const path = require('path');

// Import blog data
const blogs_mk = require('./app/blog-list/blogs_mk.json');
const blogs_en = require('./app/blog-list/blogs_en.json');
const blogs_sr = require('./app/blog-list/blogs_sr.json');
const blogs_al = require('./app/blog-list/blogs_al.json');

const baseUrl = 'http://new.favoritelectronics.com';

// HTML template for blog posts
function generateBlogHTML(blog, lang) {
  const langSuffix = lang ? `?lang=${lang}` : '';
  const blogUrl = `/blog/${blog.id}${langSuffix}`;
  const fullUrl = `${baseUrl}${blogUrl}`;
  
  // Get blog image
  const blogImage = blog.image && blog.image.startsWith('http') 
    ? blog.image 
    : `${baseUrl}${blog.image}`;
  
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${blog.title} - Favorit Electronics Blog</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  
  <!-- Open Graph Meta Tags for Facebook -->
  <meta property="og:title" content="${blog.title} - Favorit Electronics Blog" />
  <meta property="og:description" content="${blog.excerpt}" />
  <meta property="og:image" content="${blogImage}" />
  <meta property="og:url" content="${fullUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Favorit Electronics" />
  <meta property="og:locale" content="${lang}" />
  
  <!-- Article specific meta tags -->
  <meta property="article:published_time" content="${blog.date}T00:00:00Z" />
  <meta property="article:author" content="Favorit Electronics" />
  <meta property="article:section" content="Blog" />
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${blog.title} - Favorit Electronics Blog" />
  <meta name="twitter:description" content="${blog.excerpt}" />
  <meta name="twitter:image" content="${blogImage}" />
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="${blog.excerpt}" />
  <meta name="keywords" content="${blog.title}, Favorit Electronics, blog, ${blog.excerpt}" />
  <meta name="author" content="Favorit Electronics" />
  <meta name="robots" content="index, follow" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${fullUrl}" />
  
  <!-- Redirect to Angular app -->
  <meta http-equiv="refresh" content="0;url=${blogUrl}" />
  
  <style>
    body { 
      font-family: Arial, sans-serif; 
      text-align: center; 
      padding: 50px; 
      background: #f5f5f5; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white; 
      padding: 30px; 
      border-radius: 10px; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
    }
    .blog-image { 
      max-width: 300px; 
      height: auto; 
      margin: 20px 0; 
    }
    .redirect { 
      color: #666; 
      margin-top: 20px; 
    }
    .date {
      color: #888;
      font-size: 14px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${blog.title}</h1>
    <div class="date">${blog.date}</div>
    <img src="${blogImage}" alt="${blog.title}" class="blog-image">
    <p>${blog.excerpt}</p>
    <div class="redirect">
      Redirecting to blog post...<br>
      <a href="${blogUrl}">Click here if not redirected automatically</a>
    </div>
  </div>
</body>
</html>`;
}

// Generate static blog files
function generateStaticBlogs() {
  const outputDir = 'dist/favorit-app/static-blog-pages';
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const languages = [
    { code: 'en', data: blogs_en.blogs },
    { code: 'mk', data: blogs_mk.blogs },
    { code: 'sr', data: blogs_sr.blogs },
    { code: 'al', data: blogs_al.blogs }
  ];
  
  let totalFiles = 0;
  
  languages.forEach(({ code, data }) => {
    data.forEach(blog => {
      const html = generateBlogHTML(blog, code);
      
      // Create a safe filename by using blog ID instead of title
      const filename = `blog-${blog.id}-${code}.html`;
      const filepath = path.join(outputDir, filename);
      
      try {
        fs.writeFileSync(filepath, html);
        totalFiles++;
        console.log(`Generated: ${filename}`);
      } catch (error) {
        console.error(`Error generating ${filename}:`, error.message);
      }
    });
  });
  
  console.log(`\n✅ Generated ${totalFiles} static blog HTML files`);
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`🌐 These files can be accessed directly for Facebook scraping`);
}

// Run the generator
generateStaticBlogs();
