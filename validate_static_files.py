#!/usr/bin/env python3
"""
Static Files Validator for Favorit Electronics
Validates generated static HTML files for correctness
"""

import os
import re
import json
from bs4 import BeautifulSoup

class StaticFilesValidator:
    def __init__(self):
        self.errors = []
        self.warnings = []
        
    def validate_html_syntax(self, file_path):
        """Validate HTML syntax using BeautifulSoup"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # Check for required meta tags
            required_meta_tags = [
                'og:title', 'og:description', 'og:image', 'og:type', 'og:url',
                'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'
            ]
            
            for tag in required_meta_tags:
                if not soup.find('meta', property=tag) and not soup.find('meta', attrs={'name': tag}):
                    self.errors.append(f"{file_path}: Missing required meta tag: {tag}")
            
            # Check for structured data
            if not soup.find('script', type='application/ld+json'):
                self.warnings.append(f"{file_path}: Missing structured data")
            
            # Check for redirect script
            if not soup.find('script', string=re.compile(r'window\.location')):
                self.errors.append(f"{file_path}: Missing redirect script")
            
            return True
            
        except Exception as e:
            self.errors.append(f"{file_path}: HTML validation error - {e}")
            return False
    
    def validate_all_files(self):
        """Validate all generated static HTML files"""
        print("Validating static HTML files...")
        
        # Find all product HTML files
        html_files = [f for f in os.listdir('.') if f.startswith('product-') and f.endswith('.html')]
        
        if not html_files:
            self.errors.append("No static HTML files found")
            return False
        
        print(f"Found {len(html_files)} static HTML files")
        
        # Validate each file
        valid_count = 0
        for file_path in html_files:
            if self.validate_html_syntax(file_path):
                valid_count += 1
                print(f"✓ {file_path}")
            else:
                print(f"✗ {file_path}")
        
        # Print results
        print(f"\nValidation Results:")
        print(f"Valid files: {valid_count}/{len(html_files)}")
        
        if self.errors:
            print(f"\nErrors ({len(self.errors)}):")
            for error in self.errors:
                print(f"  - {error}")
        
        if self.warnings:
            print(f"\nWarnings ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"  - {warning}")
        
        return len(self.errors) == 0

if __name__ == "__main__":
    validator = StaticFilesValidator()
    success = validator.validate_all_files()
    
    if success:
        print("\n✓ All static files are valid!")
        exit(0)
    else:
        print("\n✗ Some static files have errors!")
        exit(1)

