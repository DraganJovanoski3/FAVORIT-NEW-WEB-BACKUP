@echo off
echo 🚀 Building Favorit Electronics with static files for Facebook scraping...

echo 📝 Generating static product HTML files...
node src/generate-static-products.js

echo 📝 Generating static blog HTML files...
node src/generate-static-blogs.js

echo 🏗️ Building Angular application...
ng build --configuration production

echo ✅ Build complete! Static files are included for Facebook scraping.
echo 📁 Check dist/favorit-app/static-product-pages/ for product HTML files
echo 📁 Check dist/favorit-app/static-blog-pages/ for blog HTML files
pause
