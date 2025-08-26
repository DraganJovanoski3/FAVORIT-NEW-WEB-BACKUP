import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

// Import blog translations
import blogs_mk from '../blog-list/blogs_mk.json';
import blogs_en from '../blog-list/blogs_en.json';
import blogs_sr from '../blog-list/blogs_sr.json';
import blogs_al from '../blog-list/blogs_al.json';

// Import UI translations
import translations_mk from './translations_mk.json';
import translations_en from './translations_en.json';
import translations_sr from './translations_sr.json';
import translations_al from './translations_al.json';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  blog: any;
  currentLang: string = 'en';
  translations: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const blogId = params.get('id');

      this.route.queryParams.subscribe(queryParams => {
        this.currentLang = queryParams['lang'] || 'en';
        this.loadBlog(blogId);
        this.loadTranslations();
      });
    });
  }

  private loadBlog(blogId: string | null) {
    if (!blogId) {
      this.redirectToBlogs();
      return;
    }

    const blogData = this.getBlogsByLanguage();
    this.blog = blogData.find(blog => blog.id === blogId);

    if (!this.blog) {
      this.redirectToBlogs();
      return;
    }

    this.updateMetaTags();
  }

  private getBlogsByLanguage(): any[] {
    switch (this.currentLang) {
      case 'mk': return blogs_mk.blogs;
      case 'sr': return blogs_sr.blogs;
      case 'al': return blogs_al.blogs;
      default: return blogs_en.blogs;
    }
  }

  private loadTranslations() {
    switch (this.currentLang) {
      case 'mk': this.translations = translations_mk; break;
      case 'sr': this.translations = translations_sr; break;
      case 'al': this.translations = translations_al; break;
      default: this.translations = translations_en;
    }
  }

  private updateMetaTags() {
    const imageUrl = this.blog.image.startsWith('http') ? this.blog.image : `https://favoritelectronics.com/${this.blog.image}`;
    const currentUrl = window.location.href;
    
    // Update page title
    this.titleService.setTitle(this.blog.title);
    
    // Update meta description
    this.meta.updateTag({ name: 'description', content: this.blog.excerpt });
    
    // Update Open Graph meta tags
    this.meta.updateTag({ property: 'og:title', content: this.blog.title });
    this.meta.updateTag({ property: 'og:description', content: this.blog.excerpt });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:url', content: currentUrl });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Favorit Electronics' });
    this.meta.updateTag({ property: 'og:locale', content: this.getLocale() });
    
    // Update Twitter Card meta tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: this.blog.title });
    this.meta.updateTag({ name: 'twitter:description', content: this.blog.excerpt });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    
    // Update article specific meta tags
    this.meta.updateTag({ property: 'article:published_time', content: `${this.blog.date}T00:00:00Z` });
    this.meta.updateTag({ property: 'article:author', content: 'Favorit Electronics' });
    this.meta.updateTag({ property: 'article:section', content: 'Blog' });
    
    // Update canonical URL
    this.meta.updateTag({ rel: 'canonical', href: currentUrl });
  }

  private getLocale(): string {
    const locales: { [key: string]: string } = {
      mk: 'mk',
      en: 'en',
      sr: 'sr',
      al: 'al'
    };
    return locales[this.currentLang] || 'en';
  }

  private redirectToBlogs() {
    this.router.navigate(['/blogs'], { queryParamsHandling: 'merge' });
  }

  goBack() {
    this.router.navigate(['/blogs'], { queryParamsHandling: 'merge' });
  }
}
