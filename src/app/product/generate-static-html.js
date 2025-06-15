const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://favoritelectronics.com/';

// Load product data
const products = JSON.parse(fs.readFileSync('./src/app/product/products_list_mk.json', 'utf8'));
// Helper to escape HTML
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

products.forEach(product => {
  const id = product.id;
  const name = escapeHtml(product.name);
  const description = escapeHtml(product.description[0] || '');
  const image = product.pictures && product.pictures[0]
    ? DOMAIN + product.pictures[0].replace(/ /g, '%20')
    : '';

  const url = `${DOMAIN}product/${id}`;

  const html = `<!DOCTYPE html>
<html lang="mk">
<head>
  <meta charset="UTF-8">
  <title>${name}</title>
  <meta property="og:title" content="${name}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${url}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${name}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
</head>
<body>
  <script>
    window.location = "/product/${id}?from_static=true";
  </script>
  <noscript>
    <meta http-equiv="refresh" content="0; url=/product/${id}?from_static=true">
  </noscript>
</body>
</html>`;

  fs.writeFileSync(`product-${id}.html`, html, 'utf8');
  console.log(`Generated product-${id}.html`);
});