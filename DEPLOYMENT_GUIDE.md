# Favorit Electronics - Production Deployment Guide

## Overview

This guide explains how to deploy the hybrid static/dynamic Favorit Electronics application to production. The system combines static HTML files for SEO optimization with a dynamic Angular application for users.

## Prerequisites

- Apache web server with mod_rewrite enabled
- Python 3.x installed
- Node.js and npm installed
- Access to production server

## Deployment Steps

### 1. Build the Application

Run the production build script:

```bash
# Windows
build_production.bat

# Or manually:
npm run build
python generate_static_html.py
python generate_sitemap.py
```

### 2. Upload Files to Server

Upload the following files to your web server:

```
production-server/
├── .htaccess                    # Bot detection and routing
├── sitemap.xml                  # SEO sitemap
├── robots.txt                   # Search engine directives
├── product-*.html              # Static HTML files (all products)
├── browser/                    # Angular application
│   ├── index.html
│   ├── main-*.js
│   ├── styles-*.css
│   ├── polyfills-*.js
│   └── assets/
└── static/                     # Static HTML files directory
    └── product-*.html
```

### 3. Server Configuration

#### Apache Configuration

Ensure your Apache server has the following modules enabled:
- mod_rewrite
- mod_headers
- mod_deflate

#### .htaccess Configuration

The provided `.htaccess` file includes:
- Bot detection for search engines and social media
- URL rewriting rules
- Cache control headers
- Compression settings

### 4. Test the Deployment

#### Test Bot Detection

```bash
# Test with Googlebot
curl -H "User-Agent: Googlebot/2.1" http://yourdomain.com/product/1

# Test with Facebook
curl -H "User-Agent: facebookexternalhit/1.1" http://yourdomain.com/product/1

# Test with regular user
curl -H "User-Agent: Mozilla/5.0" http://yourdomain.com/product/1
```

#### Test Social Media Sharing

1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

### 5. SEO Verification

#### Google Search Console

1. Add your domain to Google Search Console
2. Submit the sitemap: `https://yourdomain.com/sitemap.xml`
3. Monitor indexing status
4. Check for crawl errors

#### Social Media Testing

Test product sharing on:
- Facebook
- Twitter
- LinkedIn
- WhatsApp
- Viber

## File Structure

```
production-server/
├── .htaccess                    # Apache configuration
├── sitemap.xml                  # XML sitemap
├── robots.txt                   # Robots.txt
├── product-1.html              # Static HTML for product 1
├── product-2.html              # Static HTML for product 2
├── ...                         # More product files
├── browser/                    # Angular application
│   ├── index.html
│   ├── main-*.js
│   ├── styles-*.css
│   ├── polyfills-*.js
│   └── assets/
│       ├── images/
│       ├── PDF-Specifications/
│       └── ...
└── static/                     # Static HTML files
    └── product-*.html
```

## URL Structure

### For Search Engines and Bots
- Product pages: `https://yourdomain.com/product/1`
- Category pages: `https://yourdomain.com/category/hoods`

### For Users
- Angular app: `https://yourdomain.com/new/product/1`
- All other pages: `https://yourdomain.com/new/...`

## Maintenance

### Adding New Products

1. Update JSON files in `src/app/product/`
2. Run `python generate_static_html.py`
3. Upload new `product-*.html` files
4. Update sitemap: `python generate_sitemap.py`
5. Upload new `sitemap.xml`

### Updating Existing Products

1. Update JSON files
2. Regenerate static HTML files
3. Upload updated files
4. Clear CDN cache if applicable

### Regular Maintenance

- Weekly: Test social media sharing
- Monthly: Check Google Search Console
- Quarterly: Review and update meta tags
- As needed: Update product data

## Troubleshooting

### Common Issues

#### Static Files Not Serving
**Problem**: Bots getting Angular app instead of static HTML
**Solution**: 
- Check .htaccess file is uploaded
- Verify mod_rewrite is enabled
- Test bot detection rules

#### Social Media Previews Not Working
**Problem**: Incorrect or missing previews
**Solution**:
- Validate meta tags
- Check image URLs
- Test with debug tools
- Clear social media caches

#### SEO Not Working
**Problem**: Pages not indexed
**Solution**:
- Submit sitemap to Search Console
- Check robots.txt
- Verify canonical URLs
- Test with different user agents

### Debug Tools

- **Google Search Console**: Monitor indexing
- **Facebook Sharing Debugger**: Test social sharing
- **Twitter Card Validator**: Test Twitter cards
- **Google PageSpeed Insights**: Check performance
- **GTmetrix**: Performance analysis

## Performance Optimization

### Server Configuration

1. **Enable Gzip Compression**
2. **Set Appropriate Cache Headers**
3. **Use CDN for Static Assets**
4. **Optimize Images**

### Monitoring

- Page load times
- Server response times
- CDN performance
- Search engine indexing

## Security Considerations

1. **HTTPS**: Use SSL certificates
2. **Headers**: Set security headers
3. **Updates**: Keep server software updated
4. **Monitoring**: Monitor for security issues

## Backup Strategy

1. **Regular Backups**: Backup all files
2. **Database Backups**: If using database
3. **Version Control**: Keep code in version control
4. **Disaster Recovery**: Have recovery plan

## Support

For technical support:
1. Check this documentation
2. Review server logs
3. Test with provided tools
4. Contact development team

---

*This deployment guide ensures proper setup of the hybrid static/dynamic architecture for optimal SEO and user experience.*

