#!/usr/bin/env python3
"""
Sitemap Generator for Favorit Electronics
Generates XML sitemap for all products and pages
"""

import json
import os
from datetime import datetime

class SitemapGenerator:
    def __init__(self, base_url="https://favoritelectronics.com"):
        self.base_url = base_url
        self.languages = ['sr', 'mk', 'en', 'al']
        
    def load_products(self):
        """Load all products from JSON files"""
        all_products = set()
        
        for language in self.languages:
            file_path = f"src/app/product/products_list_{language}.json"
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    products = json.load(f)
                    for product in products:
                        all_products.add(product['id'])
            except FileNotFoundError:
                print(f"Warning: {file_path} not found")
                continue
        
        return sorted(list(all_products))
    
    def generate_sitemap(self):
        """Generate XML sitemap"""
        products = self.load_products()
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        # Add main pages
        main_pages = [
            {'url': '/', 'priority': '1.0', 'changefreq': 'daily'},
            {'url': '/new/home', 'priority': '0.9', 'changefreq': 'daily'},
            {'url': '/new/about-us', 'priority': '0.8', 'changefreq': 'monthly'},
            {'url': '/new/contact', 'priority': '0.8', 'changefreq': 'monthly'},
            {'url': '/new/all-products', 'priority': '0.9', 'changefreq': 'weekly'},
            {'url': '/new/sales-partners', 'priority': '0.7', 'changefreq': 'monthly'},
            {'url': '/new/service-centers', 'priority': '0.7', 'changefreq': 'monthly'},
            {'url': '/new/blogs', 'priority': '0.8', 'changefreq': 'weekly'}
        ]
        
        for page in main_pages:
            sitemap += f'  <url>\n'
            sitemap += f'    <loc>{self.base_url}{page["url"]}</loc>\n'
            sitemap += f'    <lastmod>{current_date}</lastmod>\n'
            sitemap += f'    <changefreq>{page["changefreq"]}</changefreq>\n'
            sitemap += f'    <priority>{page["priority"]}</priority>\n'
            sitemap += f'  </url>\n'
        
        # Add product pages
        for product_id in products:
            sitemap += f'  <url>\n'
            sitemap += f'    <loc>{self.base_url}/product/{product_id}</loc>\n'
            sitemap += f'    <lastmod>{current_date}</lastmod>\n'
            sitemap += f'    <changefreq>weekly</changefreq>\n'
            sitemap += f'    <priority>0.8</priority>\n'
            sitemap += f'  </url>\n'
        
        # Add category pages
        categories = [
            'built-in-appliances', 'home-appliances', 'small-domestic-appliances',
            'air-conditioners', 'televisions', 'hoods'
        ]
        
        for category in categories:
            sitemap += f'  <url>\n'
            sitemap += f'    <loc>{self.base_url}/c/{category}</loc>\n'
            sitemap += f'    <lastmod>{current_date}</lastmod>\n'
            sitemap += f'    <changefreq>weekly</changefreq>\n'
            sitemap += f'    <priority>0.7</priority>\n'
            sitemap += f'  </url>\n'
        
        sitemap += '</urlset>'
        
        return sitemap
    
    def save_sitemap(self, filename='sitemap.xml'):
        """Save sitemap to file"""
        sitemap_content = self.generate_sitemap()
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(sitemap_content)
        
        print(f"Sitemap generated: {filename}")
        print(f"Total URLs: {sitemap_content.count('<url>')}")

if __name__ == "__main__":
    generator = SitemapGenerator()
    generator.save_sitemap()

