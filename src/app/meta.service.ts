import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  updateMetaTags(data: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    keywords?: string;
  }) {
    const baseUrl = 'http://new.favoritelectronics.com';
    
    // Update title
    if (data.title) {
      this.title.setTitle(data.title);
      this.meta.updateTag({ property: 'og:title', content: data.title });
      this.meta.updateTag({ name: 'twitter:title', content: data.title });
    }

    // Update description
    if (data.description) {
      this.meta.updateTag({ name: 'description', content: data.description });
      this.meta.updateTag({ property: 'og:description', content: data.description });
      this.meta.updateTag({ name: 'twitter:description', content: data.description });
    }

    // Update image
    if (data.image) {
      const fullImageUrl = data.image.startsWith('http') ? data.image : `${baseUrl}${data.image}`;
      this.meta.updateTag({ property: 'og:image', content: fullImageUrl });
      this.meta.updateTag({ name: 'twitter:image', content: fullImageUrl });
    }

    // Update URL
    if (data.url) {
      const fullUrl = `${baseUrl}${data.url}`;
      this.meta.updateTag({ property: 'og:url', content: fullUrl });
    }

    // Update type
    if (data.type) {
      this.meta.updateTag({ property: 'og:type', content: data.type });
    }

    // Update keywords
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }
  }

  updateProductMetaTags(product: {
    name: string;
    description: string;
    image: string;
    id: string;
    lang: string;
  }) {
    const langSuffix = product.lang ? `?lang=${product.lang}` : '';
    const productUrl = `/p/${product.id}${langSuffix}`;
    
    this.updateMetaTags({
      title: `${product.name} - Favorit Electronics`,
      description: product.description,
      image: product.image,
      url: productUrl,
      type: 'product',
      keywords: `${product.name}, Favorit Electronics, ${product.description}`
    });
  }

  updateBlogMetaTags(blog: {
    title: string;
    description: string;
    image: string;
    id: string;
    lang: string;
  }) {
    const langSuffix = blog.lang ? `?lang=${blog.lang}` : '';
    const blogUrl = `/blog/${blog.id}${langSuffix}`;
    
    this.updateMetaTags({
      title: `${blog.title} - Favorit Electronics Blog`,
      description: blog.description,
      image: blog.image,
      url: blogUrl,
      type: 'article',
      keywords: `${blog.title}, Favorit Electronics, blog, ${blog.description}`
    });
  }

  resetToDefault() {
    this.title.setTitle('Favorit Electronics');
    this.updateMetaTags({
      title: 'Favorit Electronics',
      description: 'Your trusted electronics partner',
      image: '/assets/512X512.png',
      url: '/',
      type: 'website',
      keywords: 'Favorit Electronics, electronics, appliances, trusted partner'
    });
  }
}
