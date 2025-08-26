import { Component, OnInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {NgOptimizedImage, CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import navbar_mk from './navbar_mk.json'
import navbar_en from './navbar_en.json'
import navbar_sr from './navbar_sr.json'
import navbar_al from './navbar_al.json'
import all_products_sr from '../all-products/all_products_sr.json';
import all_products_en from '../all-products/all_products_en.json';
import all_products_mk from '../all-products/all_products_mk.json';
import all_products_al from '../all-products/all_products_al.json';
import { FormsModule } from '@angular/forms';

// Import subcategory translation files
import subcategories_mk from '../subcategory/subcategories_mk_new.json';
import subcategories_en from '../subcategory/subcategories_en_new.json';
import subcategories_al from '../subcategory/subcategories_al_new.json';
import subcategories_sr from '../subcategory/subcategories_sr_new.json';

import filter_subcategory_al from '../subcategory/filter_subcategory_al.json';
import filter_subcategory_mk from '../subcategory/filter_subcategory_mk.json';
import filter_subcategory_en from '../subcategory/filter_subcategory_en.json';
import filter_subcategory_sr from '../subcategory/filter_subcategory_sr.json';

import product_names_mk from '../subcategory/product_names_mk.json';
import product_names_en from '../subcategory/product_names_en.json';
import product_names_sr from '../subcategory/product_names_sr.json';
import product_names_al from '../subcategory/product_names_al.json';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
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
  @ViewChild('searchPanel') searchPanelRef: ElementRef | undefined;
  @ViewChild('mobileSearchPanel') mobileSearchPanelRef: ElementRef | undefined;
  searchPanelReady = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  handleDropdownItemClick(): void {
    this.isDropdownOpen = false; // Close the dropdown
  }
  toggleSearch(): void {
    if (!this.isSearchOpen) {
      // Opening search
      this.isSearchOpen = true;
      this.searchPanelReady = false;
      setTimeout(() => {
        this.searchPanelReady = true;
      }, 50);
    } else {
      // Closing search
      this.isSearchOpen = false;
      this.searchPanelReady = false;
      this.searchText = '';
      this.filteredProducts = [];
    }
    // Close mobile menu when search is opened
    if (this.isSearchOpen === true) {
      this.isOpen = false;
      const hamburgerMenu = document.querySelector('.hamburger-menu');
      hamburgerMenu?.classList.remove('open');
    }
  }

  onSearchInput(): void {
    const value = this.searchText.toLowerCase();
    this.filteredProducts = this.allProducts.filter(product =>
      typeof product.name === 'string' && product.name.toLowerCase().includes(value)
    );
    console.log('All products:', this.allProducts);
    console.log('Filtered products:', this.filteredProducts);
  }

  onCategoryClick(category: any): void {
    if (category.category === 'air-conditioners') {
      // Redirect directly to the air-conditioners subcategory that shows all products
      this._router.navigate([`/c/air-conditioners/air-conditioners`], { queryParamsHandling: 'merge' })
        .then(() => window.scrollTo(0, 0));
    } else if (category.category === 'televisions') {
      // Redirect directly to the televisions subcategory that shows all products
      this._router.navigate([`/c/televisions/televisions`], { queryParamsHandling: 'merge' })
        .then(() => window.scrollTo(0, 0));
    } else if (category.category === 'hoods') {
      // Redirect directly to the hoods subcategory that shows all products
      this._router.navigate([`/c/hoods/hoods`], { queryParamsHandling: 'merge' })
        .then(() => window.scrollTo(0, 0));
    } else {
      this._router.navigate([`/c/${category.category}`], { queryParamsHandling: 'merge' })
        .then(() => window.scrollTo(0, 0));
    }
    this.isSearchOpen = false;
  }

  onProductClick(product: any): void {
    // Use the shorter product route
    this._router.navigate([`/p/${product.id}`], { queryParamsHandling: 'merge' })
      .then(() => window.scrollTo(0, 0));
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
          this.allProducts = this.getSubcategoryProducts('mk');
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
          this.allProducts = this.getSubcategoryProducts('en');
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
          this.allProducts = this.getSubcategoryProducts('sr');
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
          this.allProducts = this.getSubcategoryProducts('al');
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
    // If search is open, check if click is outside the search panel (desktop or mobile)
    if (this.isSearchOpen && this.searchPanelReady) {
      const target = event.target as Node;
      const searchPanel = this.searchPanelRef?.nativeElement;
      const mobileSearchPanel = this.mobileSearchPanelRef?.nativeElement;
      // If click is inside either panel, do nothing
      if ((searchPanel && searchPanel.contains(target)) || (mobileSearchPanel && mobileSearchPanel.contains(target))) {
        return;
      }
      // Otherwise, close search
      this.isSearchOpen = false;
      this.searchPanelReady = false;
    }
    // For menu, keep existing logic
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
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

  private getSubcategoryProducts(lang: string): any[] {
    let productTranslations: any;
    let subcategoriesComponentConstant: any;
    let filterSubcategory: any;
    
    switch (lang) {
      case 'mk':
        productTranslations = product_names_mk;
        subcategoriesComponentConstant = subcategories_mk;
        filterSubcategory = filter_subcategory_mk;
        break;
      case 'en':
        productTranslations = product_names_en;
        subcategoriesComponentConstant = subcategories_en;
        filterSubcategory = filter_subcategory_en;
        break;
      case 'sr':
        productTranslations = product_names_sr;
        subcategoriesComponentConstant = subcategories_sr;
        filterSubcategory = filter_subcategory_sr;
        break;
      case 'al':
        productTranslations = product_names_al;
        subcategoriesComponentConstant = subcategories_al;
        filterSubcategory = filter_subcategory_al;
        break;
      default:
        productTranslations = product_names_mk;
        subcategoriesComponentConstant = subcategories_en;
        filterSubcategory = filter_subcategory_en;
        break;
    }

    const allProducts: any[] = [];

    // Add all products from subcategory.component.ts
    // --- BOILERS ---
    const boilersLabel = subcategoriesComponentConstant.homeAppliances.boilers;
    allProducts.push(
      { id: 60, name: productTranslations['60'] || 'WATER HEATER TE80B20', picture: 'assets/Home appliances/WATER HEATER TE80B20/1-BOLJER-01-800x450-1-500x375-1.png', subcategory: boilersLabel, category: 'home-appliances' },
      { id: 58, name: productTranslations['58'] || 'WATER HEATER TE50B20', picture: 'assets/Home appliances/WATER HEATER TE50B20/TE50B20-1024x576.png', subcategory: boilersLabel, category: 'home-appliances' },
      { id: 59, name: productTranslations['59'] || 'WATER HEATER TE80A20', picture: 'assets/Home appliances/WATER HEATER TE80A20/1-BOLJER-04-scaled-1-1024x576.png', subcategory: boilersLabel, category: 'home-appliances' },
      { id: 57, name: productTranslations['57'] || 'WATER HEATER TE50A20', picture: 'assets/Home appliances/WATER HEATER TE50A20/TE50A20-1024x576.png', subcategory: boilersLabel, category: 'home-appliances' }
    );

    // --- WASHING MACHINES ---
    const washingLabel = filterSubcategory.homeAppliances.washingMachines;
    allProducts.push(
      { id: 152, name: productTranslations['152'] || 'WASHING MACHINE A – 5100', picture: 'assets/Home appliances/WASHING MACHINE A – 5100/MASINA-ZA-ALISTA-5100.png', subcategory: washingLabel, category: 'home-appliances' },
      { id: 154, name: productTranslations['154'] || 'WASHING MACHINE N-7122T BLDC', picture: 'assets/Home appliances/WASHING MACHINE N-7122T BLDC/5. FAVORIT N-7122T BLDC.png', subcategory: washingLabel, category: 'home-appliances' },
      { id: 155, name: productTranslations['155'] || 'WASHING MACHINE C-8143 BLDC', picture: 'assets/Home appliances/WASHING MACHINE C-8143 BLDC/8. FAVORIT C-8143 BLDC.png', subcategory: washingLabel, category: 'home-appliances' }
    );

    // --- FRIDGES & FREEZERS ---
    const fridgeLabel = filterSubcategory.homeAppliances.fridges;
    const verticalFreezerLabel = filterSubcategory.homeAppliances.verticalFreezers;
    const horizontalFreezerLabel = filterSubcategory.homeAppliances.horizontalFreezers;
    allProducts.push(
      { id: 38, name: productTranslations['38'] || 'REFRIGERATOR WITH CHAMBER R1001N', picture: 'assets/Home appliances/REFRIGERATOR WITH CHAMBER R1001N/FAVORIT-R-1001-01-1024x576.png', subcategory: fridgeLabel, category: 'home-appliances' },
      { id: 39, name: productTranslations['39'] || 'REFRIGERATOR WITHOUT CHAMBER L1002E', picture: 'assets/Home appliances/REFRIGERATOR WITHOUT CHAMBER L1002N/FAVORIT-L-1002-01-1024x576.png', subcategory: fridgeLabel, category: 'home-appliances' },
      { id: 40, name: productTranslations['40'] || 'REFRIGERATOR WITHOUT CHAMBER L2653E', picture: 'assets/Home appliances/REFRIGERATOR WITHOUT CHAMBER L2653N/FAVORIT-L-2653-01-1024x576.png', subcategory: fridgeLabel, category: 'home-appliances' },
      { id: 11, name: productTranslations['11'] || 'COMBINED REFRIGERATOR CF 278E', picture: 'assets/Home appliances/COMBINED REFRIGERATOR CF 278N/FAVORIT-CF-278-01-1024x576.png', subcategory: fridgeLabel, category: 'home-appliances' },
      { id: 12, name: productTranslations['12'] || 'COMBINED REFRIGERATOR CF 374E', picture: 'assets/Home appliances/COMBINED REFRIGERATOR CF 374N/FAVORIT-CF-374-01-1024x576.png', subcategory: fridgeLabel, category: 'home-appliances' },
      { id: 13, name: productTranslations['13'] || 'COMBINED REFRIGERATOR NF 379E', picture: 'assets/Home appliances/COMBINED REFRIGERATOR NF 379N – NO FROST without dispensary/FAVORIT-NF-373-01-1024x576.png', subcategory: fridgeLabel, category: 'home-appliances' },
      { id: 41, name: productTranslations['41'] || 'VERTICAL FREEZER F2451E', picture: 'assets/Home appliances/VERTICAL FREEZER F 2451N/FAVORIT-F-2451-01-1024x576.png', subcategory: verticalFreezerLabel, category: 'home-appliances' },
      { id: 42, name: productTranslations['42'] || 'VERTICAL FREEZER F1005E', picture: 'assets/Home appliances/VERTICAL FREEZER F1005N/FAVORIT-F-1005-01-1024x576.png', subcategory: verticalFreezerLabel, category: 'home-appliances' },
      { id: 43, name: productTranslations['43'] || 'VERTICAL FREEZER F2451N', picture: 'assets/Home appliances/VERTICAL FREEZER F 2451N/FAVORIT-F-2451-01-1024x576.png', subcategory: verticalFreezerLabel, category: 'home-appliances' },
      { id: 33, name: productTranslations['33'] || 'HCF 150', picture: 'assets/Home appliances/HCF 150/150-ZATVOREN-1024x576.png', subcategory: horizontalFreezerLabel, category: 'home-appliances' },
      { id: 34, name: productTranslations['34'] || 'HCF 200', picture: 'assets/Home appliances/HCF 200/200-ZATVOREN-1024x576.png', subcategory: horizontalFreezerLabel, category: 'home-appliances' },
      { id: 35, name: productTranslations['35'] || 'HCF 300', picture: 'assets/Home appliances/HCF 300/300-ZATVOREN-1024x576.png', subcategory: horizontalFreezerLabel, category: 'home-appliances' },
      { id: 36, name: productTranslations['36'] || 'HCF 400', picture: 'assets/Home appliances/HCF 400/400-ZATVOREN-1024x576.png', subcategory: horizontalFreezerLabel, category: 'home-appliances' },
      { id: 137, name: productTranslations['137'] || 'REFRIGERATOR WITHOUT CHAMBER L2653E S', picture: 'assets/Home appliances/REFRIGERATOR WITHOUT CHAMBER L2653N/FAVORIT-L-2653-S-01-1024x576.png', subcategory: fridgeLabel, category: 'home-appliances' },
      { id: 138, name: productTranslations['138'] || 'TWO CHAMBER REFRIGERATOR RF 263E S', picture: 'assets/Home appliances/TWO CHAMBER REFRIGERATOR RF 263N/FAVORIT-RF-263-S-01-1-1024x576.png', subcategory: verticalFreezerLabel, category: 'home-appliances' },
      { id: 139, name: productTranslations['139'] || 'COMBINED REFRIGERATOR CF 278E S', picture: 'assets/Home appliances/COMBINED REFRIGERATOR CF 278N/FAVORIT-CF-278-S-01-1024x576.png', subcategory: fridgeLabel, category: 'home-appliances' },
      { id: 140, name: productTranslations['140'] || 'COMBINED REFRIGERATOR CF 374E I', picture: 'assets/Home appliances/COMBINED REFRIGERATOR CF 374N/FAVORIT-CF-374-I-01-1024x576.png', subcategory: fridgeLabel, category: 'home-appliances' },
      { id: 141, name: productTranslations['141'] || 'COMBINED REFRIGERATOR NF 379E I', picture: 'assets/Home appliances/COMBINED REFRIGERATOR NF 379N – NO FROST without dispensary/FAVORIT-NF-373-I-01-1024x576.png', subcategory: fridgeLabel, category: 'home-appliances' },
      { id: 151, name: productTranslations['151'] || 'HCF 250', picture: 'assets/Home appliances/HCF 250/250-ZATVOREN-1024x576.png', subcategory: horizontalFreezerLabel, category: 'home-appliances' }
    );

    // Add dishwashers
    const dishwashersLabel = filterSubcategory.homeAppliances.dishwashers;
    allProducts.push(
      { id: 17, name: productTranslations['17'] || 'Dishwasher F45 – Y15N S', picture: 'assets/Home appliances/Dishwasher F45 – Y15N S/F45-Y15 S-04.png', subcategory: dishwashersLabel, category: 'home-appliances' },
      { id: 18, name: productTranslations['18'] || 'Dishwasher F60 – Y14N', picture: 'assets/Home appliances/Dishwasher F60 – Y14N/F60-Y14-04-1024x576.png', subcategory: dishwashersLabel, category: 'home-appliances' },
      { id: 135, name: productTranslations['135'] || 'Dishwasher F60 – Y14N S', picture: 'assets/Home appliances/Dishwasher F60 – Y14N S/F60-Y14_S-04.png', subcategory: dishwashersLabel, category: 'home-appliances' },
      { id: 15, name: productTranslations['15'] || 'Dishwasher E60-A1FN', picture: 'assets/Home appliances/Dishwasher E60-A1FN/RABOTEN-16.9-31-1024x576.png', subcategory: dishwashersLabel, category: 'home-appliances' },
      { id: 136, name: productTranslations['136'] || 'Dishwasher E60-A1FN X', picture: 'assets/Home appliances/Dishwasher E60-A1FN X/RABOTEN-16.9-33-1024x576.png', subcategory: dishwashersLabel, category: 'home-appliances' },
      { id: 14, name: productTranslations['14'] || 'Dishwasher E60 – A22', picture: 'assets/Home appliances/Dishwasher E60 – A22/E60-A22-04-1024x576.png', subcategory: dishwashersLabel, category: 'home-appliances' },
      { id: 16, name: productTranslations['16'] || 'DISHWASHER E60-A24N BLDC', picture: 'assets/Home appliances/DISHWASHER E60-A24N BLDC with inverter motor/E60-A24-BLDC-04-1-1024x576.png', subcategory: dishwashersLabel, category: 'home-appliances' }
    );

    // Add built-in appliances
    const cookingBuiltInStovesLabel = filterSubcategory.builtInAppliances.builtInStoves;
    const cookingMicrowavesLabel = filterSubcategory.builtInAppliances.builtInMicrowaves;
    const cookingStoveTopsLabel = filterSubcategory.builtInAppliances.builtInStoveTops;
    const builtInFridgesLabel = filterSubcategory.builtInAppliances.builtInFridges;
    allProducts.push(
      { id: 70, name: productTranslations['70'] || 'Built-in oven FAVORIT BIO 65-B', picture: 'assets/Built In Appliances/Built-in oven FAVORIT BIO 65-B/BIO-65-B-PHOTO-1-1024x576.png', subcategory: cookingBuiltInStovesLabel, category: 'built-in-appliances' },
      { id: 153, name: productTranslations['153'] || 'Built-in oven BIO-65M B', picture: 'assets/Built In Appliances/Built-in oven FAVORIT BIO-65M B/BIO-65-X-PHOTO-1-1024x576.png', subcategory: cookingBuiltInStovesLabel, category: 'built-in-appliances' },
      { id: 71, name: productTranslations['71'] || 'Built-in oven FAVORIT BIO 65-X', picture: 'assets/Built In Appliances/Built-in oven FAVORIT BIO 65-X/BIO-65-X-PHOTO-1-1024x576.png', subcategory: cookingBuiltInStovesLabel, category: 'built-in-appliances' },
      { id: 72, name: productTranslations['72'] || 'Built-in oven FAVORIT BIO 65-XB', picture: 'assets/Built In Appliances/Built-in oven FAVORIT BIO 78-D LUX B/BIO-78-D-LUX-B-PHOTO-1-1024x576.png', subcategory: cookingBuiltInStovesLabel, category: 'built-in-appliances' },
      { id: 73, name: productTranslations['73'] || 'Built-in oven FAVORIT BIO 65-XS', picture: 'assets/Built In Appliances/Built-in oven FAVORIT BIO 78-D LUX X/BIO-78-D-LUX-X-PHOTO-1-1024x576.png', subcategory: cookingBuiltInStovesLabel, category: 'built-in-appliances' },
      { id: 61, name: productTranslations['61'] || 'BUILT-IN COOKER 4 – J BLACK', picture: 'assets/Built In Appliances/BUILT-IN COOKER 4 – J BLACK/FAVORIT-4-J-BLACK-01-1024x576.png', subcategory: cookingBuiltInStovesLabel, category: 'built-in-appliances' },
      { id: 62, name: productTranslations['62'] || 'BUILT-IN COOKER 4 – J INOX-B', picture: 'assets/Built In Appliances/BUILT-IN COOKER 4 – J INOX-B/FAVORIT-4-J-INOX-B-05-1024x576.png', subcategory: cookingBuiltInStovesLabel, category: 'built-in-appliances' },
      { id: 68, name: productTranslations['68'] || 'Built-in Microwave Oven BIMW-20 BLACK', picture: 'assets/Built In Appliances/BUILT-IN MICROWAVE OVEN BIMW-20 BLACK/FAVORIT-BIMW-20-BLACK-1-scaled-1-1024x576.png', subcategory: cookingMicrowavesLabel, category: 'built-in-appliances' },
      { id: 69, name: productTranslations['69'] || 'Built-in Microwave Oven BIMW-20 INOX', picture: 'assets/Built In Appliances/BUILT-IN MICROWAVE OVEN BIMW-20 INOX/FAVORIT-BIMW-20-INOX-1024x576.png', subcategory: cookingMicrowavesLabel, category: 'built-in-appliances' },
      { id: 77, name: productTranslations['77'] || 'Vitro ceramic hob FAVORIT BIH-40', picture: 'assets/Built In Appliances/Vitro ceramic hob FAVORIT BIH-40/BIH-40-PHOTO-1-1024x576.png', subcategory: cookingStoveTopsLabel, category: 'built-in-appliances' },
      { id: 78, name: productTranslations['78'] || 'Vitro ceramic hob FAVORIT BIH-210X', picture: 'assets/Built In Appliances/Vitro ceramic hob FAVORIT BIH-210X/BIH-210X-PHOTO-1-1024x576.png', subcategory: cookingStoveTopsLabel, category: 'built-in-appliances' },
      { id: 67, name: productTranslations['67'] || 'Built-in domino plate D2', picture: 'assets/Built In Appliances/Built-in domino plate D2/FAVORIT-DOMINO-D2-07-1024x576.png', subcategory: cookingStoveTopsLabel, category: 'built-in-appliances' },
      { id: 74, name: productTranslations['74'] || 'Built-in refrigerator UCF 2764N', picture: 'assets/Built In Appliances/Built-in refrigerator UCF 2764N/FAVORIT-UCF-2760-01-1024x576.png', subcategory: builtInFridgesLabel, category: 'built-in-appliances' },
      { id: 150, name: productTranslations['150'] || 'Built-in refrigerator UF2795N', picture: 'assets/Built In Appliances/Built-in refrigerator UF2795N/Built-in refrigerator UF2795N.png', subcategory: builtInFridgesLabel, category: 'built-in-appliances' },
      { id: 75, name: productTranslations['75'] || 'Built-in refrigerator URF 263N', picture: 'assets/Built In Appliances/Built-in refrigerator URF 263N/Vgraden-frizider-URF-263N-43-1024x576.png', subcategory: builtInFridgesLabel, category: 'built-in-appliances' },
      { id: 76, name: productTranslations['76'] || 'Built-in refrigerator URF 1600N', picture: 'assets/Built In Appliances/Built-in refrigerator URF 1600N/Vgraden-frizider-URF-1600N-43-1024x576.png', subcategory: builtInFridgesLabel, category: 'built-in-appliances' }
    );

    // Add built-in dishwashers
    const fullyBuiltInDishwashersLabel = subcategoriesComponentConstant.builtInAppliances.fullyBuiltInDishwashers;
    allProducts.push(
      { id: 63, name: productTranslations['63'] || 'Built-in dishwasher BI45-I1E', picture: 'assets/Built In Appliances/Built-in dishwasher BI45-I1E (fully integrated)/BI-45-I1E-08-1024x576.png', subcategory: fullyBuiltInDishwashersLabel, category: 'built-in-appliances' },
      { id: 64, name: productTranslations['64'] || 'Built-in dishwasher SI60 – I14N', picture: 'assets/Built In Appliances/Built-in dishwasher BI60 – I14 (fully integrated)/SI60-I14-11-1024x576.png', subcategory: fullyBuiltInDishwashersLabel, category: 'built-in-appliances' },
      { id: 65, name: productTranslations['65'] || 'Built-in dishwasher BI60 – I14N', picture: 'assets/Built In Appliances/Built-in dishwasher FAVORIT BI60-I1FN/RABOTEN-16.9-29-2-1024x576.png', subcategory: fullyBuiltInDishwashersLabel, category: 'built-in-appliances' },
      { id: 66, name: productTranslations['66'] || 'Built-in dishwasher SI60 – I14', picture: 'assets/Built In Appliances/Built-in dishwasher SI60 – I14/SI60-I14-11-1024x576.png', subcategory: fullyBuiltInDishwashersLabel, category: 'built-in-appliances' },
      { id: 143, name: productTranslations['143'] || 'Hekur PL-607', picture: '', subcategory: fullyBuiltInDishwashersLabel, category: 'built-in-appliances' }
    );

    // Add air conditioners
    const inverter15CLabel = filterSubcategory.airConditioners.inverter15C;
    const inverter25CLabel = filterSubcategory.airConditioners.inverter25C;
    const inverter35CLabel = filterSubcategory.airConditioners.inverter35C;
    allProducts.push(
      { id: 84, name: productTranslations['84'] || 'AIR CONDITIONER INVERTER 12000BTU FF (-15 °C)', picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 12000BTU FF/12000BTU-FF-18000BTU-FF-1.png', subcategory: inverter15CLabel, category: 'air-conditioners' },
      { id: 88, name: productTranslations['88'] || 'AIR CONDITIONER INVERTER 18000BTU FF (-15 °C)', picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 18000BTU FF/12000BTU-FF-18000BTU-FF-1.png', subcategory: inverter15CLabel, category: 'air-conditioners' },
      { id: 125, name: productTranslations['125'] || 'AIR CONDITIONER 24000BTU FF (-15 °C)', picture: 'assets/Ait Conditioners/AIR CONDITIONER 24000BTU FF (-15 °C)/12000BTU-QB-HE-HB-18000BTU-QB-HE-HB-vnatresna-edinica-800x335.png', subcategory: inverter15CLabel, category: 'air-conditioners' },
      { id: 85, name: productTranslations['85'] || 'AIR CONDITIONER INVERTER 12000BTU JD HB (-25°C)', picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 12000BTU JD HB/12000BTU-JD-HB-18000BTU-JD-HB.png', subcategory: inverter25CLabel, category: 'air-conditioners' },
      { id: 89, name: productTranslations['89'] || 'AIR CONDITIONER INVERTER 18000BTU JD HB (-25°C)', picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 18000BTU JD HB/12000BTU-JD-HB-18000BTU-JD-HB.png', subcategory: inverter25CLabel, category: 'air-conditioners' },
      { id: 127, name: productTranslations['127'] || 'AIR CONDITIONER INVERTER 24000BTU JD HB (-25°C)', picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 24000BTU JD HB/12000BTU-QB-HE-HB-18000BTU-QB-HE-HB-vnatresna-edinica-1024x429 (1).png', subcategory: inverter25CLabel, category: 'air-conditioners' },
      { id: 128, name: productTranslations['128'] || 'AIR CONDITIONER 12000 BTU QB HE HB (-35°C)', picture: 'assets/Ait Conditioners/AIR CONDITIONER 12000 BTU QB HE HB/12000BTU-QB-HE-HB-18000BTU-QB-HE-HB-vnatresna-edinica-1024x429.png', subcategory: inverter35CLabel, category: 'air-conditioners' },
      { id: 129, name: productTranslations['129'] || 'AIR CONDITIONER 18000 BTU QB HE HB (-35°C)', picture: 'assets/Ait Conditioners/AIR CONDITIONER 18000 BTU QB HE HB/12000BTU-QB-HE-HB-18000BTU-QB-HE-HB-vnatresna-edinica-1024x429.png', subcategory: inverter35CLabel, category: 'air-conditioners' }
    );

    // Add hoods
    const hoodsLabel = subcategoriesComponentConstant.hoods.hoods;
    allProducts.push(
      { id: 133, name: productTranslations['133'] || 'Decorative Cooker Hood LD46BB-60', picture: 'assets/Hoods/Decorative Cooker Hood LD46BB-60/Dekorativen-aspirator-LD46BB-60-1024x1024.png', subcategory: hoodsLabel, category: 'hoods' },
      { id: 130, name: productTranslations['130'] || 'Telescopic Cooker Hood 7062 W', picture: 'assets/Hoods/Telescopic Cooker Hood 7062 W/Teleskopski-aspirator-7062-W-2-1024x1024.png', subcategory: hoodsLabel, category: 'hoods' },
      { id: 131, name: productTranslations['131'] || 'Telescopic Cooker Hood 7062 B', picture: 'assets/Hoods/Telescopic Cooker Hood 7062 B/Teleskopski-aspirator-7062-B-1024x1024.png', subcategory: hoodsLabel, category: 'hoods' },
      { id: 132, name: productTranslations['132'] || 'Telescopic Cooker Hood 7062 X', picture: 'assets/Hoods/Telescopic Cooker Hood 7062 X/ASPIRATORI-03-1536x864-2.png', subcategory: hoodsLabel, category: 'hoods' }
    );

    // Add televisions
    const tvFilters = filterSubcategory.televisions;
    allProducts.push(
      { id: 146, name: productTranslations['146'] || 'LED TV 75U20B-G1', picture: 'assets/TV/LED TV 75U20B-G1/7. FAVORIT TV 75U20B-G1-1.png', subcategory: tvFilters.size75, category: 'televisions' },
      { id: 145, name: productTranslations['145'] || 'LED TV 65U20B-G1', picture: 'assets/TV/LED TV 65U20B-G1/6.-FAVORIT-TV-50F135R-F-1.png', subcategory: tvFilters.size65, category: 'televisions' },
      { id: 147, name: productTranslations['147'] || 'LED TV 55U20B-G1', picture: 'assets/TV/LED TV 55U20B-G1/5. FAVORIT TV 55U20B-G1-1.png', subcategory: tvFilters.size55, category: 'televisions' },
      { id: 123, name: productTranslations['123'] || 'LED TV 55DK5JM2T2S2A -11UHD 4K ANDROI', picture: 'assets/TV/LED ТЕЛЕВИЗОР 55DK5JM2T2S2A-11UHD 4K ANDROID(11)/11.-FAVORIT-LED-TV-55DK5JM2T2S2A-90UHD-ANDROID-55-SMART-Android-tv-01-1024x576.png', subcategory: tvFilters.size55, category: 'televisions' },
      { id: 124, name: productTranslations['124'] || 'LED TV 55DЕ2М1T2S2A-13UHD 4K ANDROID', picture: 'assets/TV/LED ТЕЛЕВИЗОР 55DЕ2М1T2S2A-13UHD 4K ANDROID/TV-55DEM1T2S2A-13UHD-44-1024x576.png', subcategory: tvFilters.size55, category: 'televisions' },
      { id: 144, name: productTranslations['144'] || 'LED TV D50F135R-F (FHD ANDROID 14)', picture: 'assets/TV/LED TV D50F135R FHD/6.-FAVORIT-TV-50F135R-F.png', subcategory: tvFilters.size50, category: 'televisions' },
      { id: 121, name: productTranslations['121'] || 'LED TV 43DF3PHT2S2A-13FHD ANDROID', picture: 'assets/TV/LED ТЕЛЕВИЗОР 43DF3PHT2S2A-13FHD ANDROID/TV-43DF3PHT2S2A-13FHD-44-1024x576.png', subcategory: tvFilters.size43, category: 'televisions' },
      { id: 148, name: productTranslations['148'] || 'LED TV 43U20B-20D', picture: 'assets/TV/LED TV 43U20B-20D/2. FAVORIT TV 43U20B-20D-1.png', subcategory: tvFilters.size43, category: 'televisions' },
      { id: 149, name: productTranslations['149'] || 'LED TV 32U20B-20D', picture: 'assets/TV/LED TV 32U20B-20D/1. FAVORIT TV 32U20B-20D-1.png', subcategory: tvFilters.size32, category: 'televisions' },
      { id: 117, name: productTranslations['117'] || 'LED TV 32DF1P4T2HD', picture: 'assets/TV/LED ТЕЛЕВИЗОР 32DF1P4T2HD/32DF1P4T2HD-44-1024x576.png', subcategory: tvFilters.size32, category: 'televisions' },
      { id: 116, name: productTranslations['116'] || 'LED TV 32DF1M1T2S2A-13HD ANDROID', picture: 'assets/TV/LED ТЕЛЕВИЗОР 32DF1M1T2S2A-13HD ANDROID/TV-32DF1M1T2S2A-13HD-44-1024x576.png', subcategory: tvFilters.size32, category: 'televisions' }
    );

    // Add small domestic appliances
    const smallAppliancesFilters = filterSubcategory.smallDomesticAppliances;
    allProducts.push(
      { id: 92, name: productTranslations['92'] || 'Air fryer AF9001', picture: 'assets/Small domestic appliances/Air fryer AF9001/Air-fryer-AF9001-45-1-1024x576.png', subcategory: smallAppliancesFilters.airFryer, category: 'small-domestic-appliances' },
      { id: 101, name: productTranslations['101'] || 'MICROWAVE OVEN MW-20 S', picture: 'assets/Small domestic appliances/MICROWAVE OVEN MW-20 S/MW-20-S-min-1024x630.png', subcategory: smallAppliancesFilters.microwaves, category: 'small-domestic-appliances' },
      { id: 102, name: productTranslations['102'] || 'MICROWAVE OVEN MW-20 W', picture: 'assets/Small domestic appliances/MICROWAVE OVEN MW-20 W/MW-20-White-min-1024x630.png', subcategory: smallAppliancesFilters.microwaves, category: 'small-domestic-appliances' },
      { id: 96, name: productTranslations['96'] || 'ELECTRIC GRILL GR-573', picture: 'assets/Small domestic appliances/ELECTRIC GRILL GR-573/GR-573-1024x791-1.png', subcategory: smallAppliancesFilters.grills, category: 'small-domestic-appliances' },
      { id: 107, name: productTranslations['107'] || 'Toaster S1604', picture: 'assets/Small domestic appliances/Toaster S1604/thumbnail_TOSTER-NOV-44-1-1024x575.png', subcategory: smallAppliancesFilters.toasters, category: 'small-domestic-appliances' },
      { id: 109, name: productTranslations['109'] || 'Toster TA01101', picture: 'assets/Small domestic appliances/Toster TA01101/toster-za-dvopek-TA01101-45-1024x576.png', subcategory: smallAppliancesFilters.toasters, category: 'small-domestic-appliances' },
      { id: 108, name: productTranslations['108'] || 'Toaster TR-1800', picture: 'assets/Small domestic appliances/Toaster TR-1800/toster-TR1800-01-1-1024x576.png', subcategory: smallAppliancesFilters.toasters, category: 'small-domestic-appliances' },
      { id: 97, name: productTranslations['97'] || 'Hand blender HB5006', picture: 'assets/Small domestic appliances/Hand blender HB5006/Racen-blender-HB5006-45-1024x576.png', subcategory: smallAppliancesFilters.blenders, category: 'small-domestic-appliances' },
      { id: 93, name: productTranslations['93'] || 'Blender BL9006', picture: 'assets/Small domestic appliances/Blender BL9006/Blender-BL9006-45-1024x576.png', subcategory: smallAppliancesFilters.blenders, category: 'small-domestic-appliances' },
      { id: 94, name: productTranslations['94'] || 'Blender BL9702X', picture: 'assets/Small domestic appliances/Blender BL9702X/Blender-BL9702X-45-1024x576.png', subcategory: smallAppliancesFilters.blenders, category: 'small-domestic-appliances' },
      { id: 98, name: productTranslations['98'] || 'Hand mixer HM 9105', picture: 'assets/Small domestic appliances/Hand mixer HM 9105/Racen-mikser-HM9105-45-1024x576.png', subcategory: smallAppliancesFilters.mixers, category: 'small-domestic-appliances' },
      { id: 103, name: productTranslations['103'] || 'Stand mixer HM9109', picture: 'assets/Small domestic appliances/Stand mixer HM9109/Mikser-so-postolje-HM9109-45-1024x576.png', subcategory: smallAppliancesFilters.mixers, category: 'small-domestic-appliances' },
      { id: 95, name: productTranslations['95'] || 'Chopper CH-363', picture: 'assets/Small domestic appliances/Chopper CH-363/SECKO-CH-363-01-1024x576.png', subcategory: smallAppliancesFilters.chop, category: 'small-domestic-appliances' },
      { id: 105, name: productTranslations['105'] || 'THERMAL KETTLE Т-1798 White', picture: 'assets/Small domestic appliances/THERMAL KETTLE Т-1798 БЕЛ/TERMO-BOKAL-T-1798-01-1024x576.png', subcategory: smallAppliancesFilters.thermalJugs, category: 'small-domestic-appliances' },
      { id: 106, name: productTranslations['106'] || 'THERMAL KETTLE Т-4028A INOX', picture: 'assets/Small domestic appliances/THERMAL KETTLE Т-4028A INOX/TERMO-BOKAL-INOX-01-1-1024x576.png', subcategory: smallAppliancesFilters.thermalJugs, category: 'small-domestic-appliances' },
      { id: 104, name: productTranslations['104'] || 'Strainer J-3000', picture: 'assets/Small domestic appliances/Strainer J-3000/CEDALKA-J-3000-01-1024x576.png', subcategory: smallAppliancesFilters.colanders, category: 'small-domestic-appliances' },
      { id: 99, name: productTranslations['99'] || 'IRON PL-501', picture: 'assets/Small domestic appliances/IRON PL-501/PEGLA-PL-501-01-1024x576.png', subcategory: smallAppliancesFilters.irons, category: 'small-domestic-appliances' },
      { id: 100, name: productTranslations['100'] || 'IRON PL-619', picture: 'assets/Small domestic appliances/IRON PL-619/PEGLA-PL-619-01-1024x576.png', subcategory: smallAppliancesFilters.irons, category: 'small-domestic-appliances' },
      { id: 110, name: productTranslations['110'] || 'VACUUM CLEANER FVC 123 RED', picture: 'assets/Small domestic appliances/VACUUM CLEANER FVC 123/FVC123-HD-01-1024x576.png', subcategory: smallAppliancesFilters.vacuumCleaners, category: 'small-domestic-appliances' },
      { id: 114, name: productTranslations['114'] || 'VACUUM CLEANER FVC 306 GREY/ORANGE', picture: 'assets/Small domestic appliances/VACUUM CLEANER FVC 306/FVC306-HD-10-1024x577.png', subcategory: smallAppliancesFilters.vacuumCleaners, category: 'small-domestic-appliances' },
      { id: 113, name: productTranslations['113'] || 'VACUUM CLEANER FVC 245 RED', picture: 'assets/Small domestic appliances/VACUUM CLEANER FVC 245/FVC245-HD-01-1024x576.png', subcategory: smallAppliancesFilters.vacuumCleaners, category: 'small-domestic-appliances' },
      { id: 111, name: productTranslations['111'] || 'VACUUM CLEANER FVC 156', picture: 'assets/Small domestic appliances/VACUUM CLEANER FVC 156/FVC156-HD-01-1024x576.png', subcategory: smallAppliancesFilters.vacuumCleaners, category: 'small-domestic-appliances' },
      { id: 112, name: productTranslations['112'] || 'VACUUM CLEANER FVC 160', picture: 'assets/Small domestic appliances/VACUUM CLEANER FVC 160/2-FAVORIT-pravosmukalka-FVC-160-01-1024x576.png', subcategory: smallAppliancesFilters.vacuumCleaners, category: 'small-domestic-appliances' },
      { id: 115, name: productTranslations['115'] || 'VACUUM CLEANER FVC 585', picture: 'assets/Small domestic appliances/VACUUM CLEANER FVC 585/7.1-FAVORIT-pravosmukalka-FVC-585-CELOSNA-01-1024x576.png', subcategory: smallAppliancesFilters.vacuumCleaners, category: 'small-domestic-appliances' }
    );

    return allProducts;
  }

}
