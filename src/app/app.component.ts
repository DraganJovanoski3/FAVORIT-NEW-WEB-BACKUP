import { Component, Directive, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { HomeComponent } from "./home/home.component";
import { CategoryComponent } from './category/category.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { filter, map, tap } from 'rxjs/operators';
import { FooterFavorit } from './footer/footer.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from './popup/popup.component';
import { Meta, Title } from '@angular/platform-browser';

const components = [
  NavbarComponent,
  HomeComponent,
  CategoryComponent,
  FooterFavorit
];

// @Directive({ selector: 'img' })
// export class LazyImgDirective {
//   constructor({ nativeElement }: ElementRef<HTMLImageElement>) {
//     const supports = 'loading' in HTMLImageElement.prototype;

//     if (supports) {
//       nativeElement.setAttribute('loading', 'lazy');
//     }
//   }
// }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, RouterOutlet, RouterLink, RouterLinkActive, ...components],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Favorit Electronics';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private meta: Meta,
    private titleService: Title
  ) {
    this.ensureLangQueryParam();
    this.listenToRouteChanges();
  }

  ngOnInit(): void {
    setTimeout(() => {
      // this.openPopup();
    }, 2000);
  }

  openPopup(): void {
    this.dialog.open(PopupComponent, {});
  }

  /**
   * Ensures the "lang" query parameter is always present in the URL.
   * If missing, it defaults to "mk".
   */
  ensureLangQueryParam() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      map(route => route.snapshot.queryParams),
      tap((queryParams: { [x: string]: any; }) => {
        const validLangs = ['mk', 'sr', 'al', 'en'];
        const currentLang = queryParams['lang'];
        if (!validLangs.includes(currentLang)) {
          this.router.navigate([], {
            queryParams: { lang: 'mk' },
            queryParamsHandling: 'merge',
            replaceUrl: true
          });
        }
      })
    ).subscribe();
  }

  /**
   * Listens for route changes and updates meta tags dynamically.
   */
  private listenToRouteChanges() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      map(route => route?.snapshot?.data || {})
    ).subscribe((data: any) => {
      this.updateMetaTags(data);
    });
  }

  /**
   * Updates the meta tags based on the route data.
   */
  private updateMetaTags(data: any) {
    const defaultTitle = 'Favorit Electronics';
    const defaultDescription = 'Your trusted electronics partner';
    const defaultImage = 'https://favoritelectronics.com/assets/default-image.jpg';
    const currentUrl = window.location.href;

    // Set page title
    this.titleService.setTitle(data?.title || defaultTitle);

    // Update Open Graph and Twitter meta tags
    this.meta.updateTag({ name: 'description', content: data?.description || defaultDescription });
    this.meta.updateTag({ property: 'og:title', content: data?.title || defaultTitle });
    this.meta.updateTag({ property: 'og:description', content: data?.description || defaultDescription });
    this.meta.updateTag({ property: 'og:image', content: data?.image || defaultImage });
    this.meta.updateTag({ property: 'og:url', content: currentUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    this.meta.updateTag({ name: 'twitter:title', content: data?.title || defaultTitle });
    this.meta.updateTag({ name: 'twitter:description', content: data?.description || defaultDescription });
    this.meta.updateTag({ name: 'twitter:image', content: data?.image || defaultImage });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }
}
