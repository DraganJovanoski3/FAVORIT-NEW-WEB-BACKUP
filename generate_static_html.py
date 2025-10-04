#!/usr/bin/env python3
"""
Static HTML Generator for Favorit Electronics
Generates SEO-optimized static HTML files from JSON product data
"""

import json
import os
import re
from datetime import datetime
from urllib.parse import quote

class StaticHTMLGenerator:
    def __init__(self, base_url="https://favoritelectronics.com"):
        self.base_url = base_url
        self.languages = ['sr', 'mk', 'en', 'al']
        self.output_dir = "."
        
    def load_product_data(self, language):
        """Load product data for specific language"""
        file_path = f"src/app/product/products_list_{language}.json"
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: {file_path} not found")
            return []
    
    def generate_meta_tags(self, product, language):
        """Generate comprehensive meta tags for social media"""
        
        # Clean and prepare data
        title = self.clean_text(product['name'])
        description = self.clean_text(product['description'][0]) if product['description'] else ""
        image_url = self.get_primary_image(product)
        product_url = f"{self.base_url}/product/{product['id']}"
        
        # Language-specific settings
        lang_codes = {'sr': 'sr', 'mk': 'mk', 'en': 'en', 'al': 'sq'}
        lang_code = lang_codes.get(language, 'en')
        
        meta_tags = f"""
  <meta charset="UTF-8">
  <title>{title} - Favorit Electronics</title>
  <meta name="description" content="{description[:160]}">
  <meta name="keywords" content="favorit, electronics, {self.extract_keywords(title)}">
  <meta name="robots" content="index, follow">
  <meta name="language" content="{lang_code}">
  <meta name="author" content="Favorit Electronics">
  <link rel="canonical" href="{product_url}">
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description[:200]}">
  <meta property="og:image" content="{image_url}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="{title}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:type" content="product">
  <meta property="og:url" content="{product_url}">
  <meta property="og:site_name" content="Favorit Electronics">
  <meta property="og:locale" content="{self.get_og_locale(language)}">
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description[:200]}">
  <meta name="twitter:image" content="{image_url}">
  <meta name="twitter:image:alt" content="{title}">
  <meta name="twitter:site" content="@favoritelectronics">
  <meta name="twitter:creator" content="@favoritelectronics">
  
  <!-- Additional SEO Meta Tags -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#1976d2">
  <meta name="msapplication-TileColor" content="#1976d2">
  
  <!-- Facebook App ID (replace with your actual Facebook App ID) -->
  <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID">
  
  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "{title}",
    "description": "{description}",
    "image": "{image_url}",
    "brand": {{
      "@type": "Brand",
      "name": "Favorit Electronics"
    }},
    "manufacturer": {{
      "@type": "Organization",
      "name": "Favorit Electronics"
    }},
    "offers": {{
      "@type": "Offer",
      "url": "{product_url}",
      "availability": "https://schema.org/InStock"
    }}
  }}
  </script>"""
        
        return meta_tags
    
    def clean_text(self, text):
        """Clean text for meta tags"""
        if not text:
            return ""
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        # Clean quotes and special characters
        text = text.replace('"', '&quot;').replace("'", '&#39;')
        # Remove extra whitespace
        text = ' '.join(text.split())
        return text
    
    def get_primary_image(self, product):
        """Get the primary product image URL"""
        if product.get('pictures') and len(product['pictures']) > 0:
            image_path = product['pictures'][0]
            # Ensure proper URL encoding
            encoded_path = quote(image_path, safe='/')
            return f"{self.base_url}/{encoded_path}"
        return f"{self.base_url}/assets/default-product.png"
    
    def extract_keywords(self, title):
        """Extract keywords from product title"""
        # Simple keyword extraction
        words = re.findall(r'\b\w+\b', title.lower())
        return ', '.join(words[:5])
    
    def get_og_locale(self, language):
        """Get Open Graph locale for language"""
        locales = {'sr': 'sr_RS', 'mk': 'mk_MK', 'en': 'en_US', 'al': 'sq_AL'}
        return locales.get(language, 'en_US')
    
    def get_macedonian_title(self, product):
        """Get Macedonian title for product"""
        mk_products = self.load_product_data('mk')
        for p in mk_products:
            if p['id'] == product['id']:
                return self.clean_text(p['name'])
        return self.clean_text(product['name'])
    
    def get_macedonian_description(self, product):
        """Get Macedonian description for product"""
        mk_products = self.load_product_data('mk')
        for p in mk_products:
            if p['id'] == product['id']:
                return self.clean_text(p['description'][0]) if p['description'] else ''
        return self.clean_text(product['description'][0]) if product['description'] else ''
    
    def get_serbian_title(self, product):
        """Get Serbian title for product"""
        sr_products = self.load_product_data('sr')
        for p in sr_products:
            if p['id'] == product['id']:
                return self.clean_text(p['name'])
        return self.clean_text(product['name'])
    
    def get_serbian_description(self, product):
        """Get Serbian description for product"""
        sr_products = self.load_product_data('sr')
        for p in sr_products:
            if p['id'] == product['id']:
                return self.clean_text(p['description'][0]) if p['description'] else ''
        return self.clean_text(product['description'][0]) if product['description'] else ''
    
    def get_english_title(self, product):
        """Get English title for product"""
        en_products = self.load_product_data('en')
        for p in en_products:
            if p['id'] == product['id']:
                return self.clean_text(p['name'])
        return self.clean_text(product['name'])
    
    def get_english_description(self, product):
        """Get English description for product"""
        en_products = self.load_product_data('en')
        for p in en_products:
            if p['id'] == product['id']:
                return self.clean_text(p['description'][0]) if p['description'] else ''
        return self.clean_text(product['description'][0]) if product['description'] else ''
    
    def get_albanian_title(self, product):
        """Get Albanian title for product"""
        al_products = self.load_product_data('al')
        for p in al_products:
            if p['id'] == product['id']:
                return self.clean_text(p['name'])
        return self.clean_text(product['name'])
    
    def get_albanian_description(self, product):
        """Get Albanian description for product"""
        al_products = self.load_product_data('al')
        for p in al_products:
            if p['id'] == product['id']:
                return self.clean_text(p['description'][0]) if p['description'] else ''
        return self.clean_text(product['description'][0]) if product['description'] else ''
    
    def generate_html_content(self, product, language):
        """Generate complete HTML content for a product"""
        
        meta_tags = self.generate_meta_tags(product, language)
        product_url = f"{self.base_url}/product/{product['id']}"
        
        html_content = f"""<!DOCTYPE html>
<html lang="{language}">
<head>
{meta_tags}
</head>
    <body>
      <script>
        // Redirect users to Angular app immediately
        setTimeout(() => {{
          window.location = "{product_url}?from_static=true";
        }}, 100);
      </script>
      <noscript>
        <!-- Fallback for users with JavaScript disabled -->
        <meta http-equiv="refresh" content="0; url={product_url}?from_static=true">
      </noscript>
      
      <!-- Fallback content for search engines -->
      <div style="display: none;">
        <h1>{product['name']}</h1>
        <p>{product['description'][0] if product['description'] else ''}</p>
        <img src="{self.get_primary_image(product)}" alt="{product['name']}">
      </div>
    </body>
</html>"""
        
        return html_content
    
    def generate_all_static_files(self):
        """Generate static HTML files for all products in Macedonian only"""
        
        print("Starting static HTML generation...")
        print("Processing mk language only...")
        
        # Only process Macedonian language
        language = 'mk'
        products = self.load_product_data(language)
        
        if not products:
            print(f"No products found for {language}")
            return
        
        for product in products:
            try:
                html_content = self.generate_html_content(product, language)
                filename = f"product-{product['id']}.html"
                
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                    
                print(f"Generated: {filename}")
                    
            except Exception as e:
                print(f"Error generating {filename}: {e}")
        
        print("Static HTML generation completed!")
    
    def generate_multi_language_html(self, product_id, language_data):
        """Generate HTML with language detection"""
        
        # Get default language data
        default_lang = list(language_data.keys())[0]
        default_product = language_data[default_lang]
        
        # Create language-specific meta tags
        meta_tags_by_lang = {}
        for lang, product in language_data.items():
            meta_tags_by_lang[lang] = self.generate_meta_tags(product, lang)
        
        # Generate JavaScript for language detection
        lang_detection_js = self.generate_language_detection_js(product_id, language_data)
        
        html_content = f"""<!DOCTYPE html>
<html lang="{default_lang}">
<head>
{meta_tags_by_lang[default_lang]}
</head>
<body>
  <script>
    {lang_detection_js}
  </script>
  <noscript>
    <!-- Fallback for users with JavaScript disabled -->
    <meta http-equiv="refresh" content="0; url={self.base_url}/product/{product_id}?lang={default_lang}&from_static=true">
  </noscript>
  
  <!-- Fallback content for search engines -->
  <div style="display: none;">
    <h1>{default_product['name']}</h1>
    <p>{default_product['description'][0] if default_product['description'] else ''}</p>
    <img src="{self.get_primary_image(default_product)}" alt="{default_product['name']}">
  </div>
</body>
</html>"""
        
        return html_content
    
    def generate_language_detection_js(self, product_id, language_data):
        """Generate JavaScript for language detection and meta tag updates"""
        
        js_code = f"""
    // Language detection and meta tag updates
    const urlParams = new URLSearchParams(window.location.search);
    const requestedLang = urlParams.get('lang') || 'mk';
    const supportedLangs = {list(language_data.keys())};
    const lang = supportedLangs.includes(requestedLang) ? requestedLang : 'mk';
    
    // Update meta tags based on language
    const metaData = {self.get_meta_data_json(language_data)};
    
    if (metaData[lang]) {{
      const data = metaData[lang];
      
      // Update title
      document.title = data.title;
      
      // Update meta tags
      document.querySelector('meta[name="description"]').setAttribute('content', data.description);
      document.querySelector('meta[property="og:title"]').setAttribute('content', data.title);
      document.querySelector('meta[property="og:description"]').setAttribute('content', data.description);
      document.querySelector('meta[property="og:url"]').setAttribute('content', data.url);
      document.querySelector('meta[property="og:locale"]').setAttribute('content', data.locale);
      document.querySelector('meta[name="twitter:title"]').setAttribute('content', data.title);
      document.querySelector('meta[name="twitter:description"]').setAttribute('content', data.description);
      
      // Update hidden content
      document.querySelector('h1').textContent = data.title;
      document.querySelector('p').textContent = data.description;
      document.querySelector('img').setAttribute('alt', data.title);
    }}
    
    // Redirect to Angular app
    window.location = '{self.base_url}/product/{product_id}?lang=' + lang + '&from_static=true';
"""
        return js_code
    
    def get_meta_data_json(self, language_data):
        """Get meta data as JSON for JavaScript"""
        import json
        meta_data = {}
        
        for lang, product in language_data.items():
            meta_data[lang] = {
                'title': self.clean_text(product['name']),
                'description': self.clean_text(product['description'][0]) if product['description'] else '',
                'url': f"{self.base_url}/product/{product['id']}",
                'locale': self.get_og_locale(lang)
            }
        
        return json.dumps(meta_data, ensure_ascii=False)

# Usage
if __name__ == "__main__":
    generator = StaticHTMLGenerator()
    generator.generate_all_static_files()

