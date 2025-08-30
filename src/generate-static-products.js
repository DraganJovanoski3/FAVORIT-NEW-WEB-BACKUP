const fs = require('fs');
const path = require('path');

// Import product data
const productList_en = require('./app/product/products_list_en.json');
const productList_mk = require('./app/product/products_list_mk.json');
const productList_sr = require('./app/product/products_list_sr.json');
const productList_al = require('./app/product/products_list_al.json');

const baseUrl = 'http://new.favoritelectronics.com';

// HTML template for products
function generateProductHTML(product, lang) {
  const langSuffix = lang ? `?lang=${lang}` : '';
  const productUrl = `/p/${product.id}${langSuffix}`;
  const fullUrl = `${baseUrl}${productUrl}`;
  
  // Get product image
  const productImage = product.pictures && product.pictures.length > 0 
    ? (product.pictures[0].startsWith('http') ? product.pictures[0] : `${baseUrl}/${product.pictures[0]}`)
    : `${baseUrl}/assets/512X512.png`;
  
  // Get product description
  const description = Array.isArray(product.description) 
    ? product.description.join(' ') 
    : product.description;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${product.name} - Favorit Electronics</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  
  <!-- Open Graph Meta Tags for Facebook -->
  <meta property="og:title" content="${product.name} - Favorit Electronics" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${productImage}" />
  <meta property="og:url" content="${fullUrl}" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Favorit Electronics" />
  <meta property="og:locale" content="${lang}" />
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${product.name} - Favorit Electronics" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${productImage}" />
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="${description}" />
  <meta name="keywords" content="${product.name}, Favorit Electronics, ${description}" />
  <meta name="author" content="Favorit Electronics" />
  <meta name="robots" content="index, follow" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${fullUrl}" />
  
  <!-- Redirect to Angular app -->
  <meta http-equiv="refresh" content="0;url=${productUrl}" />
  
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
    .product-image { 
      max-width: 300px; 
      height: auto; 
      margin: 20px 0; 
    }
    .redirect { 
      color: #666; 
      margin-top: 20px; 
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${product.name}</h1>
    <img src="${productImage}" alt="${product.name}" class="product-image">
    <p>${description}</p>
    <div class="redirect">
      Redirecting to product page...<br>
      <a href="${productUrl}">Click here if not redirected automatically</a>
    </div>
  </div>
</body>
</html>`;
}

// Generate static product files
function generateStaticProducts() {
  const outputDir = 'dist/favorit-app/static-product-pages';
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const languages = [
    { code: 'en', data: productList_en },
    { code: 'mk', data: productList_mk },
    { code: 'sr', data: productList_sr },
    { code: 'al', data: productList_al }
  ];
  
  let totalFiles = 0;
  
  languages.forEach(({ code, data }) => {
    data.forEach(product => {
      const html = generateProductHTML(product, code);
      const filename = `product-${product.id}-${code}.html`;
      const filepath = path.join(outputDir, filename);
      
      fs.writeFileSync(filepath, html);
      totalFiles++;
      console.log(`Generated: ${filename}`);
    });
  });
  
  console.log(`\n✅ Generated ${totalFiles} static product HTML files`);
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`🌐 These files can be accessed directly for Facebook scraping`);
}

// Run the generator
generateStaticProducts();
