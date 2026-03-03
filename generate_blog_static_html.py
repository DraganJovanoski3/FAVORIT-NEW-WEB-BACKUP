#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Blog Static HTML Generator for Favorit Electronics
Generates SEO-optimized static HTML files from JSON blog data
"""

import json
import os
import re
import sys
from datetime import datetime
from urllib.parse import quote

# Set UTF-8 encoding for stdout
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

class BlogStaticHTMLGenerator:
    def __init__(self, base_url="https://favoritelectronics.com"):
        self.base_url = base_url
        self.languages = ['sr', 'mk', 'en', 'al']
        self.output_dir = "."
        
        # Cyrillic to Latin Macedonian conversion mapping
        self.cyrillic_to_latin = {
            'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v',
            'Г': 'G', 'г': 'g', 'Д': 'D', 'д': 'd', 'Ѓ': 'Gj', 'ѓ': 'gj',
            'Е': 'E', 'е': 'e', 'Ж': 'Zh', 'ж': 'zh', 'З': 'Z', 'з': 'z',
            'Ѕ': 'Dz', 'ѕ': 'dz', 'И': 'I', 'и': 'i', 'Ј': 'J', 'ј': 'j',
            'К': 'K', 'к': 'k', 'Л': 'L', 'л': 'l', 'Љ': 'Lj', 'љ': 'lj',
            'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n', 'Њ': 'Nj', 'њ': 'nj',
            'О': 'O', 'о': 'o', 'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r',
            'С': 'S', 'с': 's', 'Т': 'T', 'т': 't', 'Ќ': 'Kj', 'ќ': 'kj',
            'У': 'U', 'у': 'u', 'Ф': 'F', 'ф': 'f', 'Х': 'H', 'х': 'h',
            'Ц': 'C', 'ц': 'c', 'Ч': 'Ch', 'ч': 'ch', 'Џ': 'Dzh', 'џ': 'dzh',
            'Ш': 'Sh', 'ш': 'sh', ' ': '-', '?': '', '!': '', '.': '',
            ',': '', ':': '', ';': '', '(': '', ')': '', '[': '', ']': '',
            '{': '', '}': '', '"': '', "'": '', '`': '', '~': '', '^': '',
            '&': '', '*': '', '+': '', '=': '', '|': '', '\\': '', '/': '-',
            '<': '', '>': '', '%': '', '$': '', '#': '', '@': '', '№': ''
        }
    
    def convert_cyrillic_to_latin(self, text):
        """Convert Cyrillic Macedonian text to Latin Macedonian"""
        if not text:
            return ""
        
        result = ""
        for char in text:
            if char in self.cyrillic_to_latin:
                result += self.cyrillic_to_latin[char]
            else:
                result += char
        
        # Clean up multiple dashes and trim
        result = re.sub(r'-+', '-', result)
        result = result.strip('-')
        
        return result
        
    def load_blog_data(self, language):
        """Load blog data for specific language"""
        file_path = f"src/app/blog-list/blogs_{language}.json"
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: {file_path} not found")
            return {"blogs": []}
    
    def generate_meta_tags(self, blog, language):
        """Generate comprehensive meta tags for blog posts"""
        
        # Clean and prepare data
        title = self.clean_text(blog['title'])
        
        # Use first section content as description if available, otherwise use excerpt
        if blog.get('sections') and len(blog['sections']) > 0 and blog['sections'][0].get('content'):
            description = self.clean_text(blog['sections'][0]['content'])
        else:
            description = self.clean_text(blog['excerpt'])
        
        # Limit description length for meta tags
        if len(description) > 160:
            description = description[:157] + "..."
        
        image_url = self.get_blog_image(blog)
        
        # Use Latin Macedonian URL for Macedonian blogs
        if language == 'mk':
            blog_id_latin = self.convert_cyrillic_to_latin(blog['id'])
            blog_url = f"{self.base_url}/blog/{blog_id_latin}"
        else:
            blog_url = f"{self.base_url}/blog/{blog['id']}"
        
        # Language-specific settings
        lang_codes = {'sr': 'sr', 'mk': 'mk', 'en': 'en', 'al': 'sq'}
        lang_code = lang_codes.get(language, 'en')
        
        meta_tags = f"""
  <meta charset="UTF-8">
  <title>{title} - Favorit Electronics Blog</title>
  <meta name="description" content="{description[:160]}">
  <meta name="keywords" content="favorit, electronics, blog, {self.extract_keywords(title)}">
  <meta name="robots" content="index, follow">
  <meta name="language" content="{lang_code}">
  <meta name="author" content="Favorit Electronics">
  <meta name="publish_date" content="{blog['date']}">
  <link rel="canonical" href="{blog_url}">
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description[:200]}">
  <meta property="og:image" content="{image_url}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="{title}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{blog_url}">
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
  
  <!-- Facebook App ID (optional - remove if not using Facebook SDK) -->
  <!-- <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID"> -->
  
  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "{title}",
    "description": "{description}",
    "image": "{image_url}",
    "author": {{
      "@type": "Organization",
      "name": "Favorit Electronics"
    }},
    "publisher": {{
      "@type": "Organization",
      "name": "Favorit Electronics",
      "logo": {{
        "@type": "ImageObject",
        "url": "{self.base_url}/assets/logo.png"
      }}
    }},
    "datePublished": "{blog['date']}",
    "dateModified": "{blog['date']}",
    "mainEntityOfPage": {{
      "@type": "WebPage",
      "@id": "{blog_url}"
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
    
    def get_blog_image(self, blog):
        """Get the blog image URL"""
        if blog.get('image'):
            image_path = blog['image']
            # Ensure proper URL encoding
            encoded_path = quote(image_path, safe='/')
            return f"{self.base_url}/{encoded_path}"
        elif blog.get('sections') and len(blog['sections']) > 0 and blog['sections'][0].get('image'):
            # Use first section image if no main blog image
            image_path = blog['sections'][0]['image']
            encoded_path = quote(image_path, safe='/')
            return f"{self.base_url}/{encoded_path}"
        return f"{self.base_url}/assets/default-blog.png"
    
    def extract_keywords(self, title):
        """Extract keywords from blog title"""
        # Simple keyword extraction
        words = re.findall(r'\b\w+\b', title.lower())
        return ', '.join(words[:5])
    
    def get_og_locale(self, language):
        """Get Open Graph locale for language"""
        locales = {'sr': 'sr_RS', 'mk': 'mk_MK', 'en': 'en_US', 'al': 'sq_AL'}
        return locales.get(language, 'en_US')
    
    def generate_blog_content(self, blog):
        """Generate blog content HTML"""
        content_html = ""
        
        # Add excerpt
        if blog.get('excerpt'):
            content_html += f'<p class="blog-excerpt">{blog["excerpt"]}</p>\n'
        
        # Add sections
        if blog.get('sections'):
            for section in blog['sections']:
                if section.get('title'):
                    content_html += f'<h2>{section["title"]}</h2>\n'
                if section.get('content'):
                    content_html += f'<p>{section["content"]}</p>\n'
                if section.get('image'):
                    content_html += f'<img src="{section["image"]}" alt="{section.get("title", "")}" style="max-width: 100%; height: auto;">\n'
        
        # Add other causes if exists
        if blog.get('other_causes'):
            content_html += '<h3>Other Causes:</h3>\n<ul>\n'
            for cause in blog['other_causes']:
                content_html += f'<li>{cause}</li>\n'
            content_html += '</ul>\n'
        
        # Add action steps if exists
        if blog.get('action_steps'):
            content_html += f'<h3>Action Steps:</h3>\n<p>{blog["action_steps"]}</p>\n'
        
        # Add conclusion
        if blog.get('conclusion'):
            content_html += f'<h3>Conclusion:</h3>\n<p>{blog["conclusion"]}</p>\n'
        
        return content_html
    
    def generate_html_content(self, blog, language):
        """Generate complete HTML content for a blog post"""
        
        meta_tags = self.generate_meta_tags(blog, language)
        
        # Use Latin Macedonian URL for Macedonian blogs
        if language == 'mk':
            blog_id_latin = self.convert_cyrillic_to_latin(blog['id'])
            blog_url = f"{self.base_url}/blog/{blog_id_latin}"
        else:
            blog_url = f"{self.base_url}/blog/{blog['id']}"
            
        blog_content = self.generate_blog_content(blog)
        
        html_content = f"""<!DOCTYPE html>
<html lang="{language}">
<head>
{meta_tags}
</head>
<body>
  <!-- Content for search engines and bots -->
  <div>
    <h1>{blog['title']}</h1>
    <div class="blog-meta">
      <span class="blog-date">Published: {blog['date']}</span>
    </div>
    <div class="blog-content">
      {blog_content}
    </div>
    <img src="{self.get_blog_image(blog)}" alt="{blog['title']}" style="max-width: 100%; height: auto;">
  </div>
</body>
</html>"""
        
        return html_content
    
    def generate_all_static_files(self):
        """Generate static HTML files for all blogs in Macedonian only"""
        
        print("Starting blog static HTML generation...")
        print("Processing mk language only...")
        
        # Only process Macedonian language
        language = 'mk'
        blog_data = self.load_blog_data(language)
        blogs = blog_data.get('blogs', [])
        
        if not blogs:
            print(f"No blogs found for {language}")
            return
        
        for blog in blogs:
            try:
                html_content = self.generate_html_content(blog, language)
                
                # Convert blog ID to Latin Macedonian if it's Macedonian
                if language == 'mk':
                    blog_id_latin = self.convert_cyrillic_to_latin(blog['id'])
                    filename = f"blog-{blog_id_latin}.html"
                else:
                    filename = f"blog-{blog['id']}.html"
                
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                    
                print(f"Generated: {filename}")
                    
            except Exception as e:
                print(f"Error generating blog file: {str(e)}")
        
        print("Blog static HTML generation completed!")
    
    def generate_multi_language_html(self, blog_id, language_data):
        """Generate HTML with language detection"""
        
        # Get default language data
        default_lang = list(language_data.keys())[0]
        default_blog = language_data[default_lang]
        
        # Create language-specific meta tags
        meta_tags_by_lang = {}
        for lang, blog in language_data.items():
            meta_tags_by_lang[lang] = self.generate_meta_tags(blog, lang)
        
        # Generate JavaScript for language detection
        lang_detection_js = self.generate_language_detection_js(blog_id, language_data)
        
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
    <meta http-equiv="refresh" content="0; url={self.base_url}/blog/{blog_id}?lang={default_lang}&from_static=true">
  </noscript>
  
  <!-- Fallback content for search engines -->
  <div style="display: none;">
    <h1>{default_blog['title']}</h1>
    <p>{default_blog['excerpt']}</p>
    <img src="{self.get_blog_image(default_blog)}" alt="{default_blog['title']}">
  </div>
</body>
</html>"""
        
        return html_content
    
    def generate_language_detection_js(self, blog_id, language_data):
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
    window.location = '{self.base_url}/blog/{blog_id}?lang=' + lang + '&from_static=true';
"""
        return js_code
    
    def get_meta_data_json(self, language_data):
        """Get meta data as JSON for JavaScript"""
        import json
        meta_data = {}
        
        for lang, blog in language_data.items():
            meta_data[lang] = {
                'title': self.clean_text(blog['title']),
                'description': self.clean_text(blog['excerpt']),
                'url': f"{self.base_url}/blog/{blog['id']}",
                'locale': self.get_og_locale(lang)
            }
        
        return json.dumps(meta_data, ensure_ascii=False)

# Usage
if __name__ == "__main__":
    generator = BlogStaticHTMLGenerator()
    generator.generate_all_static_files()
