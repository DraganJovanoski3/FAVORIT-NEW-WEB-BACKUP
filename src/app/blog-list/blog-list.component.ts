import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import blogs_mk from './blogs_mk.json';
import blogs_en from './blogs_en.json';
import blogs_sr from './blogs_sr.json';
import blogs_al from './blogs_al.json';

import translations_mk from '../blog/translations_mk.json'
import translations_en from '../blog/translations_en.json'
import translations_sr from '../blog/translations_sr.json'
import translations_al from '../blog/translations_al.json'


@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs: any[] = [];
  currentLang: string = 'en';
  translations: any = {};

  constructor(private _activatedRoute: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      this.currentLang = params['lang'] || 'en';
      this.loadBlogs();
      this.loadTranslations();
    });
  }

  private loadBlogs() {
    switch (this.currentLang) {
      case 'mk':
        this.blogs = blogs_mk.blogs;
        break;
      case 'sr':
        this.blogs = blogs_sr.blogs;
        break;
      case 'al':
        this.blogs = blogs_al.blogs;
        break;
      default:
        this.blogs = blogs_en.blogs;
    }
  }
  private loadTranslations() {
    switch (this.currentLang) {
      case 'mk':
        this.translations = translations_mk;
        break;
      case 'sr':
        this.translations = translations_sr;
        break;
      case 'al':
        this.translations = translations_al;
        break;
      default:
        this.translations = translations_en;
    }
  }

  navigateToBlog(blogId: string) {
    this._router.navigate([`/blog/${blogId}`], { queryParamsHandling: 'merge' });
  }
}
