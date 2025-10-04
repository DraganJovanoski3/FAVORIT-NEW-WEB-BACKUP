import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

    // Meta tags handling removed
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
