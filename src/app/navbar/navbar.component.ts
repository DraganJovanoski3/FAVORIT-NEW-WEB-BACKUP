import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import {NgOptimizedImage, CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import navbar_mk from './navbar_mk.json'
import navbar_en from './navbar_en.json'
import navbar_sr from './navbar_sr.json'
import navbar_al from './navbar_al.json'
import productsList_sr from '../product/products_list_sr.json';
import productsList_en from '../product/products_list_en.json';
import productsList_mk from '../product/products_list_mk.json';
import productsList_al from '../product/products_list_al.json';
import all_products_sr from '../all-products/all_products_sr.json';
import all_products_en from '../all-products/all_products_en.json';
import all_products_mk from '../all-products/all_products_mk.json';
import all_products_al from '../all-products/all_products_al.json';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  isOpen = false;
  isSearchOpen = false;
  searchText: string = '';
  filteredProducts: any[] = [];
  allProducts: any[] = [];
  categories: any[] = [];
  navbarConstant: any;
  selectedLanguageFlag: string = '/assets/macedonia.png'; // Default flag
  isDropdownOpen = false;
  currentLang: string = 'en';

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  handleDropdownItemClick(): void {
    this.isDropdownOpen = false; // Close the dropdown
  }
  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (!this.isSearchOpen) {
      this.searchText = '';
      this.filteredProducts = [];
    } else {
      // Close mobile menu when search is opened
      this.isOpen = false;
      const hamburgerMenu = document.querySelector('.hamburger-menu');
      hamburgerMenu?.classList.remove('open');
    }
  }

  onSearchInput(): void {
    const value = this.searchText.toLowerCase();
    this.filteredProducts = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(value)
    );
  }

  onCategoryClick(category: any): void {
    if (category.category === 'air-conditioners') {
      // Redirect directly to the air-conditioners subcategory that shows all products
      this._router.navigate([`/category/air-conditioners/subcategory/air-conditioners`], { queryParamsHandling: 'merge' })
        .then(() => window.scrollTo(0, 0));
    } else {
      this._router.navigate([`/category/${category.category}`], { queryParamsHandling: 'merge' })
        .then(() => window.scrollTo(0, 0));
    }
    this.isSearchOpen = false;
  }

  onProductClick(product: any): void {
    // Try to find category and subcategory for the product
    let category = product.category || '';
    let subcategory = product.subcategory || '';
    // If not present, try to infer from product (if you have mapping logic, add here)
    // Fallback: just go to product page by id
    if (category && subcategory) {
      this._router.navigate([`/category/${category}/subcategory/${subcategory}/product/${product.id}`], { queryParamsHandling: 'merge' })
        .then(() => window.scrollTo(0, 0));
    } else if (category) {
      this._router.navigate([`/category/${category}/product/${product.id}`], { queryParamsHandling: 'merge' })
        .then(() => window.scrollTo(0, 0));
    } else {
      this._router.navigate([`/product/${product.id}`], { queryParamsHandling: 'merge' })
        .then(() => window.scrollTo(0, 0));
    }
    this.isSearchOpen = false;
  }

  constructor(
    private _router:Router,
    private _activatedRoute:ActivatedRoute,
    private elementRef: ElementRef
  ){

  }
  ngOnDestroy(): void {
    document.body.removeEventListener('click', this.onBodyClick.bind(this));
  }
  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe(params => {
      const lang = params.get('lang') || 'en';
      this.currentLang = lang;
      switch(lang) {
        case 'mk':
          this.navbarConstant = navbar_mk;
          this.selectedLanguageFlag = '/assets/macedonia.png';
          this.allProducts = this.addCategoryAndSubcategory(productsList_mk, 'mk');
          this.categories = [
            { name: all_products_mk.category.homeAppliances, category: 'home-appliances' },
            { name: all_products_mk.category.buildInAppliances, category: 'built-in-appliances' },
            { name: all_products_mk.category.airConditioners, category: 'air-conditioners' },
            { name: all_products_mk.category.televisions, category: 'televisions' },
            { name: all_products_mk.category.hoods, category: 'hoods' },
            { name: all_products_mk.category.smallDomesticAppliances, category: 'small-domestic-appliances' }
          ];
          break;
        case 'en':
          this.navbarConstant = navbar_en;
          this.selectedLanguageFlag = '/assets/english.png';
          this.allProducts = this.addCategoryAndSubcategory(productsList_en, 'en');
          this.categories = [
            { name: all_products_en.category.homeAppliances, category: 'home-appliances' },
            { name: all_products_en.category.buildInAppliances, category: 'built-in-appliances' },
            { name: all_products_en.category.airConditioners, category: 'air-conditioners' },
            { name: all_products_en.category.televisions, category: 'televisions' },
            { name: all_products_en.category.hoods, category: 'hoods' },
            { name: all_products_en.category.smallDomesticAppliances, category: 'small-domestic-appliances' }
          ];
          break;
        case 'sr':
          this.navbarConstant = navbar_sr;
          this.selectedLanguageFlag = '/assets/serbia.png';
          this.allProducts = this.addCategoryAndSubcategory(productsList_sr, 'sr');
          this.categories = [
            { name: all_products_sr.category.homeAppliances, category: 'home-appliances' },
            { name: all_products_sr.category.buildInAppliances, category: 'built-in-appliances' },
            { name: all_products_sr.category.airConditioners, category: 'air-conditioners' },
            { name: all_products_sr.category.televisions, category: 'televisions' },
            { name: all_products_sr.category.hoods, category: 'hoods' },
            { name: all_products_sr.category.smallDomesticAppliances, category: 'small-domestic-appliances' }
          ];
          break;
        case 'al':
          this.navbarConstant = navbar_al;
          this.selectedLanguageFlag = '/assets/albania.png';
          this.allProducts = this.addCategoryAndSubcategory(productsList_al, 'al');
          this.categories = [
            { name: all_products_al.category.homeAppliances, category: 'home-appliances' },
            { name: all_products_al.category.buildInAppliances, category: 'built-in-appliances' },
            { name: all_products_al.category.airConditioners, category: 'air-conditioners' },
            { name: all_products_al.category.televisions, category: 'televisions' },
            { name: all_products_al.category.hoods, category: 'hoods' },
            { name: all_products_al.category.smallDomesticAppliances, category: 'small-domestic-appliances' }
          ];
          break;
        default:
          this.navbarConstant = {};
          this.allProducts = [];
          this.categories = [];
      }
    });
  
    const navLink = document.querySelector('.nav-link');
    if (navLink) {
      navLink.classList.add('clicked');
    }
    document.body.addEventListener('click', this.onBodyClick.bind(this));
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;

    const hamburgerMenu = document.querySelector('.hamburger-menu');
    hamburgerMenu?.classList.toggle('open');
  }
  
  onBodyClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.isSearchOpen = false; // Close search area when clicking outside

      const hamburgerMenu = document.querySelector('.hamburger-menu');
      hamburgerMenu?.classList.remove('open');
    }
  }

  onNavigate(navigateParam:string) {
    this._router.navigate([navigateParam],{queryParamsHandling: 'merge'});
    const clickedElements = document.querySelectorAll('.nav-link.clicked');
    clickedElements.forEach((element: Element) => {
      element.classList.remove('clicked');
    });
    
    const clickedTarget = event?.target as HTMLElement; 
    clickedTarget?.classList.add('clicked');
    window.scrollTo(0, 0);
  }

  changeLanguage(lang: string): void {
    this._router.navigate([], {
      queryParams: { lang: lang },
      queryParamsHandling: 'merge', 
    });
  
    this.isDropdownOpen = false;
  }

  // Add this method to map category and subcategory to each product
  addCategoryAndSubcategory(products: any[], lang: string): any[] {
    return products.map(product => {
      let category = '';
      let subcategory = '';
      const name = product.name ? product.name.toLowerCase() : '';
      // Built-in appliances (multilingual)
      if (name.includes('built-in') || name.includes('вграден') || name.includes('вградена') || name.includes('ugradni') || name.includes('ugradna') || name.includes('ngulitur')) {
        category = 'built-in-appliances';
        if (name.includes('dishwasher') || name.includes('машина за садови') || name.includes('lavastovilje') || name.includes('mašina za sudove')) subcategory = 'built-in-dishwashers';
        else if (name.includes('microwave') || name.includes('микробранова') || name.includes('mikrotalasna') || name.includes('mikrovalë')) subcategory = 'built-in-microwaves';
        else if (name.includes('fridge') || name.includes('фрижидер') || name.includes('frižider') || name.includes('frigorifer')) subcategory = 'built-in-fridges';
        else if (name.includes('stove') || name.includes('шпорет') || name.includes('šporet')) subcategory = 'built-in-stoves';
        else if (name.includes('oven') || name.includes('рерна') || name.includes('pećnica') || name.includes('furrë')) subcategory = 'built-in-cooking-appliences';
        else subcategory = 'built-in-appliances';
      }
      // ... rest of the mapping logic ...
      else if (
        name.includes('klima') ||
        name.includes('клима') ||
        name.includes('air conditioner') ||
        name.includes('uređaj') ||
        name.includes('kondicioner') ||
        name.includes('condicioner')
      ) {
        category = 'air-conditioners';
        subcategory = 'air-conditioners';
      } else if (name.includes('aspirator') || name.includes('hood')) {
        category = 'hoods';
        subcategory = 'hoods';
      } else if (name.includes('tv') || name.includes('televizor')) {
        category = 'televisions';
        subcategory = 'televisions';
      } else if (name.includes('shporet') || name.includes('stove') || name.includes('oven')) {
        category = 'home-appliances';
        subcategory = 'stoves-and-mini-stoves';
      } else if (name.includes('fridge') || name.includes('freezer') || name.includes('frigorifer')) {
        category = 'home-appliances';
        subcategory = 'fridges-and-freezers';
      } else if (name.includes('dishwasher') || name.includes('lavastovilje')) {
        category = 'home-appliances';
        subcategory = 'dishwashers';
      } else if (name.includes('washing machine') || name.includes('makina për larje') || name.includes('машина за перење')) {
        category = 'home-appliances';
        subcategory = 'washing-and-drying-machines';
      } else if (name.includes('boiler') || name.includes('bojler')) {
        category = 'home-appliances';
        subcategory = 'boilers';
      } else if (name.includes('blender')) {
        category = 'small-domestic-appliances';
        subcategory = 'blenders';
      } else if (name.includes('microwave')) {
        category = 'small-domestic-appliances';
        subcategory = 'microwaves';
      } else if (name.includes('mixer')) {
        category = 'small-domestic-appliances';
        subcategory = 'mixers';
      } else if (name.includes('iron')) {
        category = 'small-domestic-appliances';
        subcategory = 'irons';
      } else if (name.includes('vacuum')) {
        category = 'small-domestic-appliances';
        subcategory = 'vacuum-cleaners';
      } else if (name.includes('grill')) {
        category = 'small-domestic-appliances';
        subcategory = 'grills';
      } else if (name.includes('toaster')) {
        category = 'small-domestic-appliances';
        subcategory = 'toasters';
      } else if (name.includes('air fryer')) {
        category = 'small-domestic-appliances';
        subcategory = 'air-fryers';
      } else if (name.includes('chopper') || name.includes('seckalica')) {
        category = 'small-domestic-appliances';
        subcategory = 'chop';
      } else if (name.includes('thermal jug')) {
        category = 'small-domestic-appliances';
        subcategory = 'thermal-jugs';
      } else if (name.includes('colander')) {
        category = 'small-domestic-appliances';
        subcategory = 'colanders';
      }
      // Fallbacks
      if (!category) category = 'home-appliances';
      if (!subcategory) subcategory = 'other';
      return { ...product, category, subcategory };
    });
  }
}