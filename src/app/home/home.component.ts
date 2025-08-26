import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import home_mk from './home_mk.json';
import home_en from './home_en.json';
import home_sr from './home_sr.json';
import home_al from './home_al.json';

// Import blog data
import blogs_mk from '../blog-list/blogs_mk.json';
import blogs_en from '../blog-list/blogs_en.json';
import blogs_sr from '../blog-list/blogs_sr.json';
import blogs_al from '../blog-list/blogs_al.json';

// Import blog translations
import translations_mk from '../blog/translations_mk.json';
import translations_en from '../blog/translations_en.json';
import translations_sr from '../blog/translations_sr.json';
import translations_al from '../blog/translations_al.json';

interface Product {
  id: number;
  name: string;
  picture: string;
}

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  homeComponentConstant: any;
  categories: any;
  latestBlogs: any[] = [];
  blogTranslations: any = {};
  slides: string[] = [
    'assets/slider-photos/web-slider (10).jpg', 
    'assets/slider-photos/web-slider (7).jpg', 
    'assets/slider-photos/web-slider (2).jpg', 
    'assets/slider-photos/web-slider-2.jpg'
  ]; // Add more slide images as needed
  currentIndex = 0;
  translateValue = 0;
  intervalId: any;
  
  displayedColumns: string[] = ['name', 'picture'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  products: Product[] = [];
  displayedProducts: Product[] = [];
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 40, 50, 100];

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe(params => {
      const lang = params.get('lang');
      switch(lang) {
        case 'mk' :
          this.homeComponentConstant = home_mk;
          this.loadBlogs('mk');
          this.loadBlogTranslations('mk');
          this.categories = [
            { name: this.homeComponentConstant.category.hoods, 
              image: 'assets/category-for-products/kategorija-apiratori.jpg',
              category:'hoods' },
            { name: this.homeComponentConstant.category.homeAppliances, 
              image: 'assets/category-for-products/kategorija-bela-tehnika.jpg',
              category:'home-appliances' },
            { name: this.homeComponentConstant.category.buildInAppliances, 
              image: 'assets/category-for-products/kategorija-vgradni.jpg',
              category:'built-in-appliances' },
            { name: this.homeComponentConstant.category.airConditioners, 
              image: 'assets/category-for-products/kategorija-klima-uredi.jpg',
              category:'air-conditioners' },
            { name: this.homeComponentConstant.category.smallDomesticAppliances, 
              image: 'assets/category-for-products/kategorija-mali-proizvodi.jpg',
              category:'small-domestic-appliances' },
            { name: this.homeComponentConstant.category.televisions, 
              image: 'assets/category-for-products/kategorija-tv.jpg',
              category:'televisions' }
          ];
          break;
        case 'en' :
          this.homeComponentConstant = home_en;
          this.loadBlogs('en');
          this.loadBlogTranslations('en');
          this.categories = [
            { name: this.homeComponentConstant.category.hoods, 
              image: 'assets/category-for-products/kategorija-apiratori.jpg',
              category:'hoods' },
            { name: this.homeComponentConstant.category.homeAppliances, 
              image: 'assets/category-for-products/kategorija-bela-tehnika.jpg',
              category:'home-appliances' },
            { name: this.homeComponentConstant.category.buildInAppliances, 
              image: 'assets/category-for-products/kategorija-vgradni.jpg',
              category:'built-in-appliances' },
            { name: this.homeComponentConstant.category.airConditioners, 
              image: 'assets/category-for-products/kategorija-klima-uredi.jpg',
              category:'air-conditioners' },
            { name: this.homeComponentConstant.category.smallDomesticAppliances, 
              image: 'assets/category-for-products/kategorija-mali-proizvodi.jpg',
              category:'small-domestic-appliances' },
            { name: this.homeComponentConstant.category.televisions, 
              image: 'assets/category-for-products/kategorija-tv.jpg',
              category:'televisions' }
          ];
          break;
        case 'sr' :
          this.homeComponentConstant = home_sr;
          this.loadBlogs('sr');
          this.loadBlogTranslations('sr');
          this.categories = [
            { name: this.homeComponentConstant.category.hoods, 
              image: 'assets/category-for-products/kategorija-apiratori.jpg',
              category:'hoods' },
            { name: this.homeComponentConstant.category.homeAppliances, 
              image: 'assets/category-for-products/kategorija-bela-tehnika.jpg',
              category:'home-appliances' },
            { name: this.homeComponentConstant.category.buildInAppliances, 
              image: 'assets/category-for-products/kategorija-vgradni.jpg',
              category:'built-in-appliances' },
            { name: this.homeComponentConstant.category.airConditioners, 
              image: 'assets/category-for-products/kategorija-klima-uredi.jpg',
              category:'air-conditioners' },
            { name: this.homeComponentConstant.category.smallDomesticAppliances, 
              image: 'assets/category-for-products/kategorija-mali-proizvodi.jpg',
              category:'small-domestic-appliances' },
            { name: this.homeComponentConstant.category.televisions, 
              image: 'assets/category-for-products/kategorija-tv.jpg',
              category:'televisions' }
          ];
          break;
        case 'al' :
          this.homeComponentConstant = home_al;
          this.loadBlogs('al');
          this.loadBlogTranslations('al');
          this.categories = [
            { name: this.homeComponentConstant.category.hoods, 
              image: 'assets/category-for-products/kategorija-apiratori.jpg',
              category:'hoods' },
            { name: this.homeComponentConstant.category.homeAppliances, 
              image: 'assets/category-for-products/kategorija-bela-tehnika.jpg',
              category:'home-appliances' },
            { name: this.homeComponentConstant.category.buildInAppliances, 
              image: 'assets/category-for-products/kategorija-vgradni.jpg',
              category:'built-in-appliances' },
            { name: this.homeComponentConstant.category.airConditioners, 
              image: 'assets/category-for-products/kategorija-klima-uredi.jpg',
              category:'air-conditioners' },
            { name: this.homeComponentConstant.category.smallDomesticAppliances, 
              image: 'assets/category-for-products/kategorija-mali-proizvodi.jpg',
              category:'small-domestic-appliances' },
            { name: this.homeComponentConstant.category.televisions, 
              image: 'assets/category-for-products/kategorija-tv.jpg',
              category:'televisions' }
          ];
          break;
      }
    });

    this.startAutoSlide();
  }

  private loadBlogs(lang: string) {
    let blogsData: any;
    switch (lang) {
      case 'mk':
        blogsData = blogs_mk;
        break;
      case 'sr':
        blogsData = blogs_sr;
        break;
      case 'al':
        blogsData = blogs_al;
        break;
      default:
        blogsData = blogs_en;
    }
    
    // Get the latest 3 blogs
    this.latestBlogs = blogsData.blogs.slice(0, 3);
  }

  private loadBlogTranslations(lang: string) {
    switch (lang) {
      case 'mk':
        this.blogTranslations = translations_mk;
        break;
      case 'sr':
        this.blogTranslations = translations_sr;
        break;
      case 'al':
        this.blogTranslations = translations_al;
        break;
      default:
        this.blogTranslations = translations_en;
    }
  }

  navigateToBlog(blogId: string) {
    this._router.navigate([`/blog/${blogId}`], { queryParamsHandling: 'merge' });
  }

  navigateToBlogs() {
    this._router.navigate(['/blogs'], { queryParamsHandling: 'merge' })
      .then(() => {
        window.scrollTo(0, 0);
      });
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 100000); // Change slide every 3 seconds
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateTranslateValue();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateTranslateValue();
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.updateTranslateValue();
    this.stopAutoSlide(); // Stop auto-slide when manually navigating
    this.startAutoSlide(); // Restart auto-slide after manual navigation
  }

  updateTranslateValue() {
    const slideWidth = document.querySelector('.slide')?.clientWidth || 0;
    this.translateValue = -this.currentIndex * slideWidth;
  }

  onNavigate(navigateParam: string) {
    this._router.navigate([navigateParam], { queryParamsHandling: 'merge' });
    const clickedElements = document.querySelectorAll('.nav-link.clicked');
    clickedElements.forEach((element: Element) => {
      element.classList.remove('clicked');
    });

    const clickedTarget = event?.target as HTMLElement; // Explicitly cast to HTMLElement
    clickedTarget?.classList.add('clicked');
  }

  onNavigateCategories(navigateParam: string, category: string) {
    if (category === 'air-conditioners') {
      this._router.navigate([navigateParam, category, 'subcategory', 'air-conditioners'], { queryParamsHandling: 'merge' })
        .then(() => {
          window.scrollTo(0, 0);
        });
    } else if (category === 'televisions') {
      this._router.navigate([navigateParam, category, 'subcategory', 'televisions'], { queryParamsHandling: 'merge' })
        .then(() => {
          window.scrollTo(0, 0);
        });
    } else if (category === 'hoods') {
      this._router.navigate([navigateParam, category, 'subcategory', 'hoods'], { queryParamsHandling: 'merge' })
        .then(() => {
          window.scrollTo(0, 0);
        });
    } else {
      this._router.navigate([navigateParam, category], { queryParamsHandling: 'merge' })
        .then(() => {
          window.scrollTo(0, 0);
        });
    }
  }
}

