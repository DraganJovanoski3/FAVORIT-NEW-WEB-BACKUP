# WhatsApp and Viber Sharing Optimization Guide

This guide explains how the Open Graph meta tags are optimized for WhatsApp and Viber sharing.

## WhatsApp and Viber Requirements

### **WhatsApp Sharing**
WhatsApp uses Open Graph meta tags to generate rich previews when sharing links. Key requirements:

- **Image Size**: 1200x630 pixels (minimum)
- **Image Format**: PNG, JPG, or GIF
- **File Size**: Under 5MB
- **Secure URLs**: HTTPS required for images

### **Viber Sharing**
Viber also uses Open Graph meta tags but has slightly different requirements:

- **Image Size**: 1200x630 pixels (recommended)
- **Image Format**: PNG or JPG
- **File Size**: Under 8MB
- **Secure URLs**: HTTPS required

## Meta Tags Added for WhatsApp/Viber

### **Enhanced Open Graph Tags**
```html
<!-- WhatsApp and Viber Meta Tags -->
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:image:secure_url" content="https://favoritelectronics.com/...">
<meta property="og:image:alt" content="Product/Blog Title">
```

### **Key Features Added**
1. **`og:image:width` and `og:image:height`** - Explicit image dimensions
2. **`og:image:type`** - Image format specification
3. **`og:image:secure_url`** - HTTPS version of image URL
4. **`og:image:alt`** - Alt text for accessibility

## Testing WhatsApp and Viber Sharing

### **WhatsApp Testing**
1. **Desktop**: Use WhatsApp Web and paste your URL
2. **Mobile**: Share URL in WhatsApp chat
3. **Expected Result**: Rich preview with image, title, and description

### **Viber Testing**
1. **Desktop**: Use Viber Desktop and paste your URL
2. **Mobile**: Share URL in Viber chat
3. **Expected Result**: Rich preview with image, title, and description

## Example URLs to Test

### **Products**
- `https://favoritelectronics.com/new/p/70?lang=mk`
- `https://favoritelectronics.com/new/p/1?lang=mk`
- `https://favoritelectronics.com/new/p/159?lang=mk`

### **Blogs**
- `https://favoritelectronics.com/new/blog/Why-do-air-conditioners-freeze-the-most-at-an-outdoor-temperature-of-around-zero-degrees-Celsius?lang=en`
- `https://favoritelectronics.com/new/blog/Зошто-климатизерите-најмногу-замрзнуваат-при-надворешна-температура-од-околу-нула-степени?lang=mk`

## Image Optimization for WhatsApp/Viber

### **Best Practices**
1. **Aspect Ratio**: 1.91:1 (1200x630 pixels)
2. **File Format**: PNG for transparency, JPG for photos
3. **File Size**: Keep under 5MB for WhatsApp, 8MB for Viber
4. **Content**: Clear, high-quality images with good contrast
5. **Text**: Avoid small text that won't be readable in preview

### **Image Requirements**
- **Minimum Size**: 300x200 pixels
- **Recommended Size**: 1200x630 pixels
- **Maximum Size**: 5MB (WhatsApp), 8MB (Viber)
- **Format**: PNG, JPG, or GIF

## Troubleshooting

### **Common Issues**

#### **No Preview Shows**
- Check if image URL is accessible
- Verify HTTPS is used for image URLs
- Ensure image file size is under limits
- Check if image dimensions are reasonable

#### **Wrong Image Shows**
- Clear WhatsApp/Viber cache
- Wait 24 hours for cache refresh
- Verify `og:image` URL is correct
- Check if image is publicly accessible

#### **No Description Shows**
- Verify `og:description` is present
- Check if description is under 200 characters
- Ensure no special characters break the meta tag

### **Debugging Tools**
1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
2. **WhatsApp Debug**: Use WhatsApp Web to test sharing
3. **Viber Debug**: Use Viber Desktop to test sharing

## Implementation Status

### **✅ Completed**
- Enhanced Open Graph meta tags for WhatsApp/Viber
- Image dimension specifications
- Secure URL requirements
- Alt text for accessibility
- Multi-language support

### **📁 Files Updated**
- `static-p/` - Product files with WhatsApp/Viber meta tags
- `static-products/` - Product files with enhanced meta tags
- `static-blogs/` - Blog files with WhatsApp/Viber meta tags

### **🔄 Generation Scripts Updated**
- `src/app/product/generate-static-html.js` - Enhanced for WhatsApp/Viber
- `src/app/blog/generate-blog-static-html.js` - Enhanced for WhatsApp/Viber

## Usage

### **Generate Updated Files**
```bash
# Generate products with WhatsApp/Viber support
npm run generate-product-static

# Generate blogs with WhatsApp/Viber support
npm run generate-blog-static
```

### **Deploy to Server**
Upload the updated static files to your web server:
- `static-p/` directory
- `static-products/` directory  
- `static-blogs/` directory

## Results Expected

### **WhatsApp Sharing**
- Rich preview with product/blog image
- Clear title and description
- Professional appearance in chats

### **Viber Sharing**
- Rich preview with product/blog image
- Clear title and description
- Professional appearance in chats

## Monitoring

### **Track Sharing Performance**
1. Monitor URL shares in WhatsApp/Viber
2. Check preview quality and accuracy
3. Test with different devices and platforms
4. Verify multi-language support works correctly

### **Regular Maintenance**
- Update images to meet size requirements
- Test new products/blogs for sharing
- Monitor for any meta tag issues
- Keep generation scripts updated 