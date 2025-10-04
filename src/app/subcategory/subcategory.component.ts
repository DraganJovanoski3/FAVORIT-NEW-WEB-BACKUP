import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { combineLatest, filter } from "rxjs";

// Translation JSON imports
import product_names_mk from './product_names_mk.json';
import product_names_en from './product_names_en.json';
import product_names_al from './product_names_al.json';
import product_names_sr from './product_names_sr.json';

import subcategories_mk from './subcategories_mk_new.json';
import subcategories_en from './subcategories_en_new.json';
import subcategories_al from './subcategories_al_new.json';
import subcategories_sr from './subcategories_sr_new.json';

import larnmore_translations_mk from '../category/larnmore_translations_mk.json';
import larnmore_translations_en from '../category/larnmore_translations_en.json';
import larnmore_translations_al from '../category/larnmore_translations_al.json';
import larnmore_translations_sr from '../category/larnmore_translations_sr.json';

import all_products_al from '../all-products/all_products_al.json';
import all_products_mk from '../all-products/all_products_mk.json';
import all_products_en from '../all-products/all_products_en.json';
import all_products_sr from '../all-products/all_products_sr.json';

import filter_subcategory_al from "./filter_subcategory_al.json";
import filter_subcategory_mk from "./filter_subcategory_mk.json";
import filter_subcategory_en from "./filter_subcategory_en.json";
import filter_subcategory_sr from "./filter_subcategory_sr.json";

interface Product {
  id: number;
  name: string;
  picture: string;
  pictureHover: string;
  subcategory: string;
  backgroundColorproduct?: string;
  currentPicture?: string;
  isHovered?: boolean;
  group?: string;
}

@Component({
  selector: 'app-subcategory',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, RouterModule],
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent implements OnInit, OnDestroy {
  productTranslations: any;
  subcategoriesComponentConstant: any;
  larnmoreTranslations: any;
  breadcrumbs: { label: string, url: string }[] = [];
  cookieTranslations: any;
  showFilters: boolean = false;
  isMobileView: boolean = false;
  showButton: boolean = false;
  subcategories: string[] = [];
  filterSubcategory: any;
  constructor(private _route: ActivatedRoute, private _router: Router, private elementRef: ElementRef) {}

  category!: string;
  subcategory!: string;
  backgroundStyle!: string;
  subcategoryName!: string;
  currentLang!: string;

  products: Product[] = [];
  displayedProducts: Product[] = [];
  pageSize = 122;
  pageSizeOptions: number[] = [12, 24, 36, 48];

  ngOnDestroy(): void {
    document.body.removeEventListener('click', this.onBodyClick.bind(this));
  }

  onBodyClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showFilters = false;
    }
  }

  onResize(event: any) {
    this.checkIsMobileView();
  }

  checkMobile() {
    this.checkIsMobileView();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  private checkIsMobileView() {
    this.isMobileView = window.innerWidth < 768;
    if (!this.isMobileView) {
      this.showFilters = false;
    }
  }

  checkShowButton() {
    if (this.isMobileView && window.scrollY > 100) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }

  ngOnInit(): void {
    // Initialize with default translations first
    this.updateTranslations('en');
    
    combineLatest([this._route.params, this._route.queryParams]).subscribe(([params, queryParams]) => {
      this.category = params['category'];
      this.subcategory = params['subcategory'];
      this.currentLang = queryParams['lang'] || 'en';
      this.updateTranslations(this.currentLang);
      this.updateProducts();
      this.updateDisplayedProducts();
      this.setupBreadcrumbs();
      this.subcategoryName = this.getTranslatedNameBread(this.subcategory);
      this.checkIsMobileView();
      this.checkShowButton();
    });
    
    document.body.addEventListener('click', this.onBodyClick.bind(this));
  }

  private updateTranslations(lang: string) {
    // Load the translation data based on the current language
    switch (lang) {
      case 'mk':
        this.filterSubcategory = filter_subcategory_mk;
        this.subcategoriesComponentConstant = subcategories_mk;
        this.productTranslations = product_names_mk;
        this.larnmoreTranslations = larnmore_translations_mk;
        this.cookieTranslations = all_products_mk;
        break;
      case 'en':
        this.filterSubcategory = filter_subcategory_en;
        this.subcategoriesComponentConstant = subcategories_en;
        this.productTranslations = product_names_en; // Use English product names
        this.larnmoreTranslations = larnmore_translations_en;
        this.cookieTranslations = all_products_en;
        break;
      case 'sr':
        this.filterSubcategory = filter_subcategory_sr;
        this.subcategoriesComponentConstant = subcategories_sr;
        this.productTranslations = product_names_sr;
        this.larnmoreTranslations = larnmore_translations_sr;
        this.cookieTranslations = all_products_sr;
        break;
      case 'al':
        this.filterSubcategory = filter_subcategory_al;
        this.subcategoriesComponentConstant = subcategories_al;
        this.productTranslations = product_names_al;
        this.larnmoreTranslations = larnmore_translations_al;
        this.cookieTranslations = all_products_al;
        break;
      default:
        // Default to English if language is not recognized
        this.filterSubcategory = filter_subcategory_en;
        this.subcategoriesComponentConstant = subcategories_en;
        this.productTranslations = product_names_en; // Use English as default
        this.larnmoreTranslations = larnmore_translations_en;
        this.cookieTranslations = all_products_en;
        break;
    }
  }

  private getTranslatedNameBread(key: string, isCategory: boolean = false): string {
    if (!key) return '';

    // Handle "Home" translation explicitly
    if (key === 'Home') {
      return this.currentLang === 'mk' ? 'Почетна' :
             this.currentLang === 'sr' ? 'Домa' :
             this.currentLang === 'al' ? 'Shtëpi' : 'Home';
    }

    // Format the key to match JSON structure
    const formattedKey = this.formatKey(key);
    const translationData = this.subcategoriesComponentConstant;

    // Use categoryNamesTranslations if it's a main category
    if (isCategory) {
        return translationData?.categoryNamesTranslations?.[formattedKey] || key;
    }

    // Otherwise, retrieve it as a subcategory within the specified main category
    const subcategoryTranslations = translationData?.[this.formatKey(this.category)];
    return subcategoryTranslations?.[formattedKey] || key;
  }

  private formatKey(key: string): string {
    return key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  }

  private getProductTranslation(id: string): string {
    return (this.productTranslations && this.productTranslations[id]) || '';
  }

  private setupBreadcrumbs() {
    // If subcategory is 'air-conditioners', 'televisions', or 'hoods', do not show the last breadcrumb
    if (this.subcategory === 'air-conditioners' || this.subcategory === 'televisions' || this.subcategory === 'hoods') {
      this.breadcrumbs = [
        { label: this.getTranslatedNameBread('Home'), url: '/' },
        { label: this.getTranslatedNameBread(this.category, true), url: `/c/${this.category}` }
      ];
    } else {
      this.breadcrumbs = [
        { label: this.getTranslatedNameBread('Home'), url: '/' },
        { label: this.getTranslatedNameBread(this.category, true), url: `/c/${this.category}` },
        { label: this.getTranslatedNameBread(this.subcategory), url: `/c/${this.category}/${this.subcategory}` }
      ];
    }
  }

  private updateProducts() {
    const allLabel = this.filterSubcategory.all;
    switch (this.subcategory) {
      
        // Case for 'boilers'
      case 'boilers':
        this.subcategories = [ this.subcategoriesComponentConstant.homeAppliances.boilers, allLabel ];
        this.backgroundStyle = 'linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.27)), url("assets/subcategories/boilers.jpg")';
        this.subcategoryName = this.subcategoriesComponentConstant.homeAppliances.boilers;
        this.products = [
          // WATER HEATER
          {
            // KEEP
            id: 60,
            name: this.productTranslations['60'] ||'WATER HEATER TE80B20',
            picture: 'assets/Home appliances/WATER HEATER TE80B20/1-BOLJER-01-800x450-1-500x375-1.png',  
            pictureHover: 'assets/',
            subcategory: this.subcategoriesComponentConstant.homeAppliances.boilers,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            // KEEP
            id: 58,
            name: this.productTranslations['58'] ||'WATER HEATER TE50B20',
            picture: 'assets/Home appliances/WATER HEATER TE50B20/TE50B20-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: this.subcategoriesComponentConstant.homeAppliances.boilers,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            // KEEP
            id: 59,
            name: this.productTranslations['59'] ||'WATER HEATER TE80A20',
            picture: 'assets/Home appliances/WATER HEATER TE80A20/1-BOLJER-04-scaled-1-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: this.subcategoriesComponentConstant.homeAppliances.boilers,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            // KEEP
            id: 57,
            name: this.productTranslations['57'] ||'WATER HEATER TE50A20',
            picture: 'assets/Home appliances/WATER HEATER TE50A20/TE50A20-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: this.subcategoriesComponentConstant.homeAppliances.boilers,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
      ];
        break;  
        case 'washing-and-drying-machines':
            const washingLabel  = this.filterSubcategory.homeAppliances.washingMachines;
            const dryerLabel = this.filterSubcategory.homeAppliances.dryers;
            this.subcategories   = [ washingLabel, dryerLabel, allLabel ];
            this.subcategoryName = washingLabel;
            this.backgroundStyle = 'linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.27)), url("assets/subcategories/washing-machines.jpg")';
            this.subcategoryName = this.subcategoriesComponentConstant.homeAppliances.washingMachines;
            this.products = [
            // WASHING MACHINES
          // {
          //   // KEEP
          //   id: 44,
          //   name: this.productTranslations['44'] ||'WASHING MACHINE A – 5101N',
          //   picture: 'assets/Home appliances/WASHING MACHINE A – 5101N/MASINA-ZA-ALISTA-01-1-1024x576.png',  
          //   pictureHover: 'assets/Home appliances/WASHING MACHINE A – 5101N/FAVORIT-A-5101-1-1024x576.png',
          //   subcategory: washingLabel, 
          //   backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          // },
          {
            id: 152,
            name: this.productTranslations['152'] ||'WASHING MACHINE A – 5100',
            picture: 'assets/Home appliances/WASHING MACHINE A – 5100/MASINA-ZA-ALISTA-5100.png',  
            pictureHover: 'assets/Home appliances/WASHING MACHINE A – 5100/MASINA-ZA-ALISTA-5100.png',
            subcategory: washingLabel,
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 45,
            name: this.productTranslations['45'] ||'WASHING MACHINE N - 6100',
            picture: 'assets/Home appliances/WASHING MACHINE L – 6100N/L-6100-02-1-1024x576.png',  
            pictureHover: 'assets/Home appliances/WASHING MACHINE L – 6100N/FAVORIT-L-6100-1024x576.png',
            subcategory: washingLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 49,
            name: this.productTranslations['49'] ||'WASHING MACHINE W – 6101N',
            picture: 'assets/Home appliances/WASHING MACHINE W – 6101N/W-6101-06-1024x576.png',  
            pictureHover: 'assets/Home appliances/WASHING MACHINE W – 6101N/FAVORIT-W-6101-1-1024x576.png',
            subcategory: washingLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 46,
            name: this.productTranslations['46'] ||'WASHING MACHINE W-7101',
            picture: 'assets/Home appliances/WASHING MACHINE L – 7101N/W-7101-05-1024x576.png',  
            pictureHover: 'assets/Home appliances/WASHING MACHINE L – 7101N/FAVORIT-L-7101-1024x576.png',
            subcategory: washingLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 50,
            name: this.productTranslations['50'] ||'WASHING MACHINE W – 7122N',
            picture: 'assets/Home appliances/WASHING MACHINE W – 7122N/W-7122-07-1024x576.png',  
            pictureHover: 'assets/Home appliances/WASHING MACHINE W – 7122N/FAVORIT-W-7122-1024x576.png',
            subcategory: washingLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 47,
            name: this.productTranslations['47'] ||'WASHING MACHINE L – 8101',
            picture: 'assets/Home appliances/WASHING MACHINE L – 8101N/L-8101-04-1024x576.png',  
            pictureHover: 'assets/Home appliances/WASHING MACHINE L – 8101N/FAVORIT-L-8101-1024x576.png',
            subcategory: washingLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 48,
            name: this.productTranslations['48'] ||'WASHING MACHINE C - 9102',
            picture: 'assets/Home appliances/WASHING MACHINE L – 9101N/L-9101-03-1024x576.png',  
            pictureHover: 'assets/Home appliances/WASHING MACHINE L – 9101N/FAVORIT-L-9101-1-1024x576.png',
            subcategory: washingLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 51,
            name: this.productTranslations['51'] ||'WASHING MACHINE L-7121 BLDC',
            picture: 'assets/Home appliances/WASHING MACHINE W – 7122N BLDC/W7122BLDC-1024x576.png',  
            pictureHover: 'assets/Home appliances/WASHING MACHINE W – 7122N BLDC/FAVORIT-W-7122-BLDC-1024x576.png',
            subcategory: washingLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 154,
            name: this.productTranslations['154'] ||'WASHING MACHINE N-7122T BLDC',
            picture: 'assets/Home appliances/WASHING MACHINE N-7122T BLDC/5. FAVORIT N-7122T BLDC.png',
            pictureHover: 'assets/Home appliances/WASHING MACHINE N-7122T BLDC/5. FAVORIT N-7122T BLDC.png',
            subcategory: washingLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 53,
            name: this.productTranslations['53'] ||'WASHING MACHINE W-8121 BLDC',
            picture: 'assets/Home appliances/WASHING MACHINE W – 8122N BLDC/W-8122-BLDC-11-1024x576.png',  
            pictureHover: 'assets/Home appliances/WASHING MACHINE W – 8122N BLDC/FAVORIT-W-8122-BLDC-1024x576.png',
            subcategory: washingLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 155,
            name: this.productTranslations['155'] ||'WASHING MACHINE C-8143 BLDC',
            picture: 'assets/Home appliances/WASHING MACHINE C-8143 BLDC/8. FAVORIT C-8143 BLDC.png',
            pictureHover: 'assets/Home appliances/WASHING MACHINE C-8143 BLDC/8. FAVORIT C-8143 BLDC.png',
            subcategory: washingLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 56,
            name: this.productTranslations['56'] ||'WASHING MACHINE W-9122N BLDC',
            picture: 'assets/Home appliances/WASHING MACHINE W-9122N BLDC/W-9122N-BLDC-16-1024x576.png',  
            pictureHover: 'assets/Home appliances/WASHING MACHINE W-9122N BLDC/W-9122N-BLDC-16-1024x576.png',
            subcategory: washingLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 55,
            name: this.productTranslations['55'] ||'WASHING MACHINE W – 9142ТN BLDC',
            picture: 'assets/Home appliances/WASHING MACHINE W – 9142ТN BLDC/W9142T-BLDC-1024x576.png',  
            pictureHover: 'assets/Home appliances/WASHING MACHINE W – 9142ТN BLDC/FAVORIT-W-9142T-BLDC-12-1024x576.png',
            subcategory: washingLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 160,
            name: this.productTranslations['160'] ||'WASHING MACHINE A-9143 BLDC',
            picture: 'assets/Home appliances/WASHING MACHINE A-9143 BLDC/10. FAVORIT A-9143 BLDC.png',
            pictureHover: 'assets/Home appliances/WASHING MACHINE A-9143 BLDC/10. FAVORIT A-9143 BLDC.png',
            subcategory: washingLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },

           // DRYERS
          {
            // KEEP
            id: 19,
            name: this.productTranslations['19'] ||'Dryer W-71 C',
            picture: 'assets/Home appliances/Dryer L – 71 C/W-71 C.png',  
            pictureHover: 'assets/Home appliances/Dryer L – 71 C/W-71 C.png',
            subcategory: dryerLabel,
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 161,
            name: this.productTranslations['161'] ||'Dryer L-71 HP',
            picture: 'assets/Home appliances/Dryer L-71 HP/2. FAVORIT L-71HP.png',  
            pictureHover: 'assets/Home appliances/Dryer L-71 HP/2. FAVORIT L-71HP.png',
            subcategory: dryerLabel,
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          // {
          //   // KEEP
          //   id: 21,
          //   name: this.productTranslations['21'] ||'Dryer W – 72 C',
          //   picture: 'assets/Home appliances/Dryer W – 72 C/3.W-72-C-nova-ispraven-izgled-10-1024x576.png',  
          //   pictureHover: 'assets/Home appliances/Dryer W – 72 C/3.W-72-C-nova-ispraven-izgled-22-1024x576.png',
          //   subcategory: dryerLabel,
          //   backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'

          // },
          {
            // KEEP
            id: 20,
            name: this.productTranslations['20'] ||'Dryer N-82 C',
            picture: 'assets/Home appliances/Dryer L – 81 C/N-82 C.png',  
            pictureHover: 'assets/Home appliances/Dryer L – 81 C/N-82 C.png',
            subcategory: dryerLabel,
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'

          },
          {
            // KEEP
            id: 22,
            name: this.productTranslations['22'] ||'Dryer C-82T HP',
            picture: 'assets/Home appliances/Dryer W – 82 HP (with HEAT PUMP)/C-82T HP.png',  
            pictureHover: 'assets/Home appliances/Dryer W – 82 HP (with HEAT PUMP)/C-82T HP.png',
            subcategory: dryerLabel,
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
        ];
          break;
      case 'stoves-and-mini-stoves':
        const stovesLabel = this.filterSubcategory.homeAppliances.stoves;
        const miniStovesLabel = this.filterSubcategory.homeAppliances.miniStoves;
        const stovesGlassLabel = this.filterSubcategory.homeAppliances.stovesGlassLabel;
        this.subcategories = [stovesLabel, stovesGlassLabel, miniStovesLabel, allLabel];
        this.backgroundStyle = 'linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.27)), url("assets/subcategories/stoves.jpg")';
        this.subcategoryName = stovesLabel;
        this.products = [
          // Regular stoves
          {
            id: 24,
            name: this.productTranslations['24'] ||'Electric Cooker EC 640 WWFT',
            picture: 'assets/Home appliances/Electric Freestanding Cooker EC 640 WWFT/FAVORIT-EC-640-WWFT-10-scaled (1).png',
            pictureHover: 'assets/Home appliances/Electric Freestanding Cooker EC 640 WWFT/FAVORIT-EC-640-WWFT-10-scaled (1).png',
            subcategory: stovesLabel,
            backgroundColorproduct:'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            id: 7,
            name: this.productTranslations['7'] ||'Combined Cooker К 622 WWFT',
            picture: 'assets/Home appliances/COMBINED FREESTANDING COOKERS К 622 WWFT/FAVORIT-K-622-WWFT-10-1-1024x576.png',  
            pictureHover: 'assets/Home appliances/COMBINED FREESTANDING COOKERS К 622 WWFT/FAVORIT-K-622-WWFT-10-1-1024x576.png',  
            subcategory: stovesLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            id: 23,
            name: this.productTranslations['23'] ||'Electric Cooker EC 640 WWF',
            picture: 'assets/Home appliances/Electric Freestanding Cooker EC 640 WWF/FAVORIT-EC-640-WWF-10-1024x576.png',  
            pictureHover: '',
            subcategory: stovesLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            id: 27,
            name: this.productTranslations['27'] ||'ELECTRIC COOKER EC 640 SF',
            picture: 'assets/Home appliances/ELECTRIC INDEPENDENT COOKER EC 640 SF/FAVORIT-EC-640-SF-10-1024x576.png',  
            pictureHover: 'assets/Home appliances/ELECTRIC INDEPENDENT COOKER EC 640 SF/4-9.jpg',
            subcategory: stovesLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            id: 9,
            name: this.productTranslations['9'] ||'COMBINED COOKER K 622 SF',
            picture: 'assets/Home appliances/COMBINED INDEPENDENT COOKER К 622 SF/FAVORIT-K-622-SF-10-1024x576.png',  
            pictureHover: 'assets/Home appliances/COMBINED INDEPENDENT COOKER К 622 SF/3-14.png',
            subcategory: stovesLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            id: 26,
            name: this.productTranslations['26'] ||'Electric Independent Cooker EC 540 WWFT',
            picture: 'assets/Home appliances/Electric Independent Cooker EC 540 WWFT/Elektricen-sporet-EC-540-WWFT-44-1024x576.png',  pictureHover: 'assets/',
            subcategory: stovesLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          // KEEP
          {
            id: 25,
            name: this.productTranslations['25'] ||'Electric Independent Cooker EC 540 SF',
            picture: 'assets/Home appliances/Electric Independent Cooker EC 540 SF/Elektricen-sporet-EC-540-SF-43-1024x576.png',  pictureHover: 'assets/',
            subcategory: stovesLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            id: 10,
            name: this.productTranslations['10'] ||'COMBINED COOKER К 622 WWF',
            picture: 'assets/Home appliances/COMBINED INDEPENDENT COOKER К 622 WWF/FAVORIT-K-622-WWF-10-1024x576.png',  
            pictureHover: 'assets/Home appliances/COMBINED INDEPENDENT COOKER К 622 WWF/FAVORIT-K-622-WWF-10-1024x576.png',
            subcategory: stovesLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },




          // GLASS-CERAMIC COOKERS
          {
            id: 32,
            name: this.productTranslations['32'] ||'GLASS-CERAMIC COOKER CC 600 WWF',
            picture: 'assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 600 WWF/FAVORIT-CC-600-WWF-10-1024x576.png',  
            pictureHover: 'assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 600 WWF/2-26.png',
            subcategory: stovesGlassLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            id: 31,
            name: this.productTranslations['31'] ||'GLASS-CERAMIC COOKER CC 600 SF',
            picture: 'assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 600 SF/FAVORIT-CC-600-SF-10-1024x576.png',  
            pictureHover: 'assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 600 SF/FAVORIT-CC-600-SF-10-1024x576.png',
            subcategory: stovesGlassLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            id: 30,
            name: this.productTranslations['30'] ||'GLASS-CERAMIC COOKER CC 600 IF',
            picture: 'assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 600 IF/FAVORIT-CC-600-IF-10-1024x576.png',  
            pictureHover: 'assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 600 IF/3-16.png',
            subcategory: stovesGlassLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            id: 29,
            name: this.productTranslations['29'] ||'GLASS-CERAMIC COOKER CC 500 WWF',
            picture: 'assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 500 WWF/FAVORIT-CC-500-WWF-10-1024x576.png',  
            pictureHover: 'assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 500 WWF/FAVORIT-CC-500-WWF-10-1024x576.png',
            subcategory: stovesGlassLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            id: 28,
            name: this.productTranslations['28'] ||'GLASS-CERAMIC COOKER CC 500 SF',
            picture: 'assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 500 SF/FAVORIT-CC-500-SF-10-1024x576.png',  
            pictureHover: 'assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 500 SF/FAVORIT-CC-500-SF-10-1024x576.png',
            subcategory: stovesGlassLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          // {
          //   id: 26,
          //   name: this.productTranslations['26'] ||'Electric Independent Cooker EC 540 WWFT',
          //   picture: 'assets/Home appliances/Electric Independent Cooker EC 540 WWFT/Elektricen-sporet-EC-540-WWFT-44-1024x576.png',  pictureHover: 'assets/',
          //   subcategory: this.subcategoriesComponentConstant.homeAppliances.stoves, 
          //   backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          // },

          // MINI STOVES
          {
            // KEEP
            id: 8,
            name: this.productTranslations['8'] ||'MINI STOVE MO-42W',
            picture: 'assets/Home appliances/MINI STOVE MO-42W/FAVORIT-MO42W-1024x576.png',  
            pictureHover: 'assets/Home appliances/MINI STOVE MO-42W/FAVORIT-MO42W-1024x576.png',  
            subcategory: miniStovesLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
          {
            // KEEP
            id: 37,
            name: this.productTranslations['37'] ||'MINI STOVE MO-42B',
            picture: 'assets/Home appliances/MINI STOVE MO-42B (BLACK)/FAVORIT-MO42B-1024x576.png',
            pictureHover: 'assets/Home appliances/MINI STOVE MO-42B (BLACK)/FAVORIT-MO42B-1024x576.png',
            subcategory: miniStovesLabel,
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
          },
        ];
        break;
      case 'dishwashers':
        const dishwashersLabel = this.filterSubcategory.homeAppliances.dishwashers;
        this.subcategories = [dishwashersLabel, allLabel];
        this.backgroundStyle = 'linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.27)), url("assets/boilers.jpg")';
        this.subcategoryName = this.filterSubcategory.homeAppliances.dishwashers;
        this.products = [
          // DISHWASHERS
          // {
          //   // KEEP
          //   id: 142,
          //   name: this.productTranslations['17'] ||'Dishwasher F45 – Y15N',
          //   picture: 'assets/Home appliances/Dishwasher F45 – Y15N/F45-Y15-S-04-1024x576.png',  
          //   pictureHover: 'assets/Home appliances/Dishwasher F45 – Y15N/F45-Y15-S-05-1024x576.png',
          //   // CHANGE PHOTO
          //   subcategory: dishwasherLabel, 
          //   backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          // },
          {
            // KEEP
            id: 17,
            name: this.productTranslations['17'] ||'Dishwasher F45 – Y15N S',
            picture: 'assets/Home appliances/Dishwasher F45 – Y15N S/F45-Y15 S-04.png',  
            pictureHover: 'assets/Home appliances/Dishwasher F45 – Y15N S/F45-Y15 S-05.png',
            subcategory: dishwashersLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 18,
            name: this.productTranslations['18'] ||'Dishwasher F60 – Y14N',
            picture: 'assets/Home appliances/Dishwasher F60 – Y14N/F60-Y14-04-1024x576.png',  
            pictureHover: 'assets/Home appliances/Dishwasher F60 – Y14N/F60-Y14-S-05-1024x576.png',
            subcategory: dishwashersLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 135,
            name: this.productTranslations['135'] ||'Dishwasher F60 – Y14N S',
            picture: 'assets/Home appliances/Dishwasher F60 – Y14N S/F60-Y14_S-04.png',  
            pictureHover: 'assets/Home appliances/Dishwasher F60 – Y14N S/F60-Y14_S-05.png',
            subcategory: dishwashersLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 15,
            name: this.productTranslations['15'] ||'Dishwasher E60-A1FN',
            picture: 'assets/Home appliances/Dishwasher E60-A1FN/RABOTEN-16.9-31-1024x576.png',  
            pictureHover: 'assets/Home appliances/Dishwasher E60-A1FN/RABOTEN-16.9-34-1024x576.png',
            subcategory: dishwashersLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 136,
            name: this.productTranslations['136'] ||'Dishwasher E60-A1FN X',
            picture: 'assets/Home appliances/Dishwasher E60-A1FN X/RABOTEN-16.9-33-1024x576.png',  
            pictureHover: 'assets/Home appliances/Dishwasher E60-A1FN X/RABOTEN-16.9-30-1024x576.png',
            subcategory: dishwashersLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 14,
            name: this.productTranslations['14'] ||'Dishwasher E60 – A22',
            picture: 'assets/Home appliances/Dishwasher E60 – A22/E60-A22-04-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: dishwashersLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 16,
            name: this.productTranslations['16'] ||'DISHWASHER E60-A24N BLDC',
            picture: 'assets/Home appliances/DISHWASHER E60-A24N BLDC with inverter motor/E60-A24-BLDC-04-1-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: this.subcategoriesComponentConstant.homeAppliances.dishwashers, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
        ];
        break;
      case 'fridges-and-freezers':
        const fridgeLabel = this.filterSubcategory.homeAppliances.fridges;
        const horizontalFreezerLabel = this.filterSubcategory.homeAppliances.horizontalFreezers;
        const verticalFreezerLabel = this.filterSubcategory.homeAppliances.verticalFreezers;
        this.subcategories = [fridgeLabel, horizontalFreezerLabel, verticalFreezerLabel, allLabel];
        this.subcategoryName = fridgeLabel;
        this.backgroundStyle = 'linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.27)), url("assets/boilers.jpg")';
        this.products = [
                   // REFRIGERATORS
          {
            // KEEP
            id: 38,
            name: this.productTranslations['38'] ||'REFRIGERATOR WITH CHAMBER R1001N',
            picture: 'assets/Home appliances/REFRIGERATOR WITH CHAMBER R1001N/FAVORIT-R-1001-01-1024x576.png',  
            pictureHover: 'assets/Home appliances/REFRIGERATOR WITH CHAMBER R1001N/FAVORIT-R-1001-02-1024x576.png',
            subcategory: fridgeLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 39,
            name: this.productTranslations['39'] ||'REFRIGERATOR WITHOUT CHAMBER L1002E',
            picture: 'assets/Home appliances/REFRIGERATOR WITHOUT CHAMBER L1002N/FAVORIT-L-1002-01-1024x576.png',  
            pictureHover: 'assets/Home appliances/REFRIGERATOR WITHOUT CHAMBER L1002N/FAVORIT-L-1002-02-1024x576.png',
            subcategory: fridgeLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 40,
            name: this.productTranslations['40'] ||'REFRIGERATOR WITHOUT CHAMBER L2653E',
            picture: 'assets/Home appliances/REFRIGERATOR WITHOUT CHAMBER L2653N/FAVORIT-L-2653-01-1024x576.png',  
            pictureHover: 'assets/Home appliances/REFRIGERATOR WITHOUT CHAMBER L2653N/FAVORIT-L-2653-02-1024x576.png',
                subcategory: fridgeLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 137,
            name: this.productTranslations['137'] ||'REFRIGERATOR WITHOUT CHAMBER L2653E S',
            picture: 'assets/Home appliances/REFRIGERATOR WITHOUT CHAMBER L2653N/FAVORIT-L-2653-S-01-1024x576.png',  
            pictureHover: 'assets/Home appliances/REFRIGERATOR WITHOUT CHAMBER L2653N/FAVORIT-L-2653-S-02-1024x576.png',
            subcategory: fridgeLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 42,
            name: this.productTranslations['42'] ||'VERTICAL FREEZER F1005E',
            picture: 'assets/Home appliances/VERTICAL FREEZER F1005N/FAVORIT-F-1005-01-1024x576.png',  
            pictureHover: 'assets/Home appliances/VERTICAL FREEZER F1005N/FAVORIT-F-1005-02-1024x576.png',
                subcategory: verticalFreezerLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 43,
                name: this.productTranslations['43'] ||'VERTICAL FREEZER F2451N',
            picture: 'assets/Home appliances/VERTICAL FREEZER F 2451N/FAVORIT-F-2451-01-1024x576.png',  
            pictureHover: 'assets/Home appliances/VERTICAL FREEZER F 2451N/FAVORIT-F-2451-02-1024x576.png',
                subcategory: verticalFreezerLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 41,
            name: this.productTranslations['41'] ||'VERTICAL FREEZER F2451E',
            picture: 'assets/Home appliances/VERTICAL FREEZER F 2451N/FAVORIT-F-2451-01-1024x576.png',  
            pictureHover: 'assets/Home appliances/VERTICAL FREEZER F 2451N/FAVORIT-F-2451-02-1024x576.png',
            subcategory: verticalFreezerLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 138,
            name: this.productTranslations['138'] ||'TWO CHAMBER REFRIGERATOR RF 263E S',
            picture: 'assets/Home appliances/TWO CHAMBER REFRIGERATOR RF 263N/FAVORIT-RF-263-S-01-1-1024x576.png',  
            pictureHover: 'assets/Home appliances/TWO CHAMBER REFRIGERATOR RF 263N/FAVORIT-RF-263-S-02-1024x576.png',
            subcategory: verticalFreezerLabel,  
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 11,
            name: this.productTranslations['11'] ||'COMBINED REFRIGERATOR CF 278E',
            picture: 'assets/Home appliances/COMBINED REFRIGERATOR CF 278N/FAVORIT-CF-278-01-1024x576.png',  
            pictureHover: 'assets/Home appliances/COMBINED REFRIGERATOR CF 278N/FAVORIT-CF-278-02-1024x576.png',
                subcategory: fridgeLabel, 
           backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'            
         },
          {
              // KEEP
            id: 139,
            name: this.productTranslations['139'] ||'COMBINED REFRIGERATOR CF 278E S',
            picture: 'assets/Home appliances/COMBINED REFRIGERATOR CF 278N/FAVORIT-CF-278-S-01-1024x576.png',  
            pictureHover: 'assets/Home appliances/COMBINED REFRIGERATOR CF 278N/FAVORIT-CF-278-S-02-1024x576.png',
            subcategory: this.subcategoriesComponentConstant.homeAppliances.Fridges, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'            
          },
          {
             // KEEP
            id: 12,
            name: this.productTranslations['12'] ||'COMBINED REFRIGERATOR CF 374E',
            picture: 'assets/Home appliances/COMBINED REFRIGERATOR CF 374N/FAVORIT-CF-374-01-1024x576.png',  
            pictureHover: 'assets/Home appliances/COMBINED REFRIGERATOR CF 374N/FAVORIT-CF-374-02-1024x576.png',
            subcategory: fridgeLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
           id: 140,
           name: this.productTranslations['140'] ||'COMBINED REFRIGERATOR CF 374E I',
           picture: 'assets/Home appliances/COMBINED REFRIGERATOR CF 374N/FAVORIT-CF-374-I-01-1024x576.png',  
           pictureHover: 'assets/Home appliances/COMBINED REFRIGERATOR CF 374N/FAVORIT-CF-374-I-02-1024x576.png',
           subcategory: fridgeLabel, 
           backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
         },
          {
            // KEEP
            id: 13,
            name: this.productTranslations['13'] ||'COMBINED REFRIGERATOR NF 379E',
            picture: 'assets/Home appliances/COMBINED REFRIGERATOR NF 379N – NO FROST without dispensary/FAVORIT-NF-373-01-1024x576.png',  
            pictureHover: 'assets/Home appliances/COMBINED REFRIGERATOR NF 379N – NO FROST without dispensary/FAVORIT-NF-373-02-1024x576.png',
            subcategory: fridgeLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 141,
            name: this.productTranslations['141'] ||'COMBINED REFRIGERATOR NF 379E I',
            picture: 'assets/Home appliances/COMBINED REFRIGERATOR NF 379N – NO FROST without dispensary/FAVORIT-NF-373-I-01-1024x576.png',  
            pictureHover: 'assets/Home appliances/COMBINED REFRIGERATOR NF 379N – NO FROST without dispensary/FAVORIT-NF-373-I-02-1024x576.png',
            subcategory: fridgeLabel,  
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 33,
            name: this.productTranslations['33'] ||'HCF 150',
            picture: 'assets/Home appliances/HCF 150/150-ZATVOREN-1024x576.png',  
            pictureHover: 'assets/Home appliances/HCF 150/150-OTVOREN-1024x576.png',
            subcategory: horizontalFreezerLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 34,
            name: this.productTranslations['34'] ||'HCF 200',
            picture: 'assets/Home appliances/HCF 200/200-ZATVOREN-1024x576.png',  
            pictureHover: 'assets/Home appliances/HCF 200/200-OTVOREN-1024x576.png',
            subcategory: horizontalFreezerLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 151,
            name: this.productTranslations['151'] ||'HCF 250',
            picture: 'assets/Home appliances/HCF 250/250-ZATVOREN-1024x576.png',  
            pictureHover: 'assets/Home appliances/HCF 250/250-OTVOREN-1024x576.png',
            subcategory: horizontalFreezerLabel,
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 35,
            name: this.productTranslations['35'] ||'HCF 300',
            picture: 'assets/Home appliances/HCF 300/300-ZATVOREN-1024x576.png',  
            pictureHover: 'assets/Home appliances/HCF 300/300-OTVOREN-1024x576.png',
            subcategory: horizontalFreezerLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 36,
            name: this.productTranslations['36'] ||'HCF 400',
            picture: 'assets/Home appliances/HCF 400/400-ZATVOREN-1024x576.png', 
            pictureHover: 'assets/Home appliances/HCF 400/400-OTVOREN-1024x576.png',
                subcategory: horizontalFreezerLabel, 
            backgroundColorproduct: 'linear-gradient(#84daff 0%, #ffffff 90%, #ffffff 100%)'
            }
          ]; 
          break;
      case 'built-in-dishwashers':
        const builtInDishwashersLabel = this.filterSubcategory.builtInAppliances.builtInDishwashers;
        const fullyBuiltInDishwashersLabel = this.filterSubcategory.builtInAppliances.fullyBuiltInDishwashersLabel;
        const semiBuiltInDishwashersLabel = this.filterSubcategory.builtInAppliances.semiBuiltInDishwashersLabel;
        this.subcategories = [fullyBuiltInDishwashersLabel, semiBuiltInDishwashersLabel, allLabel];
        this.backgroundStyle = 'linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.27)), #f5f5f5';
        this.subcategoryName = builtInDishwashersLabel;
        this.products = [
          {
            id: 63,
            name: (this.productTranslations && this.productTranslations['63']) || 'Built-in dishwasher BI45-I1E',
            picture: 'assets/Built In Appliances/Built-in dishwasher BI45-I1E (fully integrated)/BI-45-I1E-08-1024x576.png',
            pictureHover: 'assets/',
            subcategory: fullyBuiltInDishwashersLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 64,
            name: this.productTranslations['64'] ||'Built-in dishwasher SI60 – I14N',
            picture: 'assets/Built In Appliances/Built-in dishwasher BI60 – I14 (fully integrated)/SI60-I14-11-1024x576.png',
            pictureHover: 'assets/',
            subcategory: semiBuiltInDishwashersLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 65,
            name: this.productTranslations['65'] ||'Built-in dishwasher BI60 – I14N',
            picture: 'assets/Built In Appliances/Built-in dishwasher BI60 – I14 (fully integrated)/SI60-I14-11-1024x576.png',  pictureHover: 'assets/',
            subcategory: fullyBuiltInDishwashersLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'

          },
          // {
          //   id: 65,
          //   name: this.productTranslations['65'] ||'Built-in dishwasher BI60 – I14N',
          //   picture: 'assets/Built In Appliances/Built-in dishwasher FAVORIT BI60-I1FN/RABOTEN-16.9-29-2-1024x576.png',
          //   pictureHover: 'assets/',
          //   subcategory: fullyBuiltInDishwashersLabel,
          //   backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          // },
          {
            id: 66,
            name: this.productTranslations['66'] ||'Built-in dishwasher SI60 – I14',
            picture: 'assets/Built In Appliances/Built-in dishwasher SI60 – I14/BI60-I14-02-1024x576.png',
            pictureHover: 'assets/',
            subcategory: semiBuiltInDishwashersLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          }
        ];
        break;
      case 'built-in-cooking-appliences':
        const cookingMicrowavesLabel = this.filterSubcategory.builtInAppliances.builtInMicrowaves;
        const cookingStoveTopsLabel = this.filterSubcategory.builtInAppliances.builtInStoveTops;
        const cookingBuiltInStovesLabel = this.filterSubcategory.builtInAppliances.builtInStoves;
        this.subcategories = [cookingBuiltInStovesLabel, cookingMicrowavesLabel, cookingStoveTopsLabel, allLabel];
        this.backgroundStyle = 'linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.27)), url("assets/subcategories/built-in-ovens.jpg")';
        this.subcategoryName = this.filterSubcategory.builtInAppliances.builtInCookingAppliences;
        this.products = [
          // BUILT-IN OVENS
          {
            // KEEP
            id: 70,
            name: this.productTranslations['70'] ||'Built-in oven FAVORIT BIO 65-B',
            picture: 'assets/Built In Appliances/Built-in oven FAVORIT BIO 65-B/BIO-65-B-PHOTO-1-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: cookingBuiltInStovesLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 153,
            name: this.productTranslations['153'] ||'Built-in oven BIO-65M B',
            picture: 'assets/Built In Appliances/Built-in oven FAVORIT BIO-65M B/BIO-65-X-PHOTO-1-1024x576.png',
            pictureHover: 'assets/',
            subcategory: cookingBuiltInStovesLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 71,
            name: this.productTranslations['71'] ||'Built-in oven FAVORIT BIO 65-X',
            picture: 'assets/Built In Appliances/Built-in oven FAVORIT BIO 65-X/BIO-65-X-PHOTO-1-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: cookingBuiltInStovesLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 72,
            name: this.productTranslations['72'] ||'Built-in oven FAVORIT BIO 65-XB',
            picture: 'assets/Built In Appliances/Built-in oven FAVORIT BIO 78-D LUX B/BIO-78-D-LUX-B-PHOTO-1-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: cookingBuiltInStovesLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
            // KEEP
          {
            id: 73,
            name: this.productTranslations['73'] ||'Built-in oven FAVORIT BIO 65-XS',
            picture: 'assets/Built In Appliances/Built-in oven FAVORIT BIO 78-D LUX X/BIO-78-D-LUX-X-PHOTO-1-1024x576.png',
            pictureHover: 'assets/',
            subcategory: cookingBuiltInStovesLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 61,
            name: this.productTranslations['61'] ||'BUILT-IN COOKER 4 – J BLACK',
            picture: 'assets/Built In Appliances/BUILT-IN COOKER 4 – J BLACK/FAVORIT-4-J-BLACK-01-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: cookingBuiltInStovesLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 62,
            name: this.productTranslations['62'] ||'BUILT-IN COOKER 4 – J INOX-B',
            picture: 'assets/Built In Appliances/BUILT-IN COOKER 4 – J INOX-B/FAVORIT-4-J-INOX-B-05-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: cookingBuiltInStovesLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          // BUILT-IN MICROWAVES
          {
            id: 68,
            name: this.productTranslations['68'] ||'Built-in Microwave Oven BIMW-20 BLACK',
            picture: 'assets/Built In Appliances/BUILT-IN MICROWAVE OVEN BIMW-20 BLACK/FAVORIT-BIMW-20-BLACK-1-scaled-1-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: cookingMicrowavesLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
            // KEEP
          {
            id: 69,
            name: this.productTranslations['69'] ||'Built-in Microwave Oven BIMW-20 INOX',
            picture: 'assets/Built In Appliances/BUILT-IN MICROWAVE OVEN BIMW-20 INOX/FAVORIT-BIMW-20-INOX-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: cookingMicrowavesLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 77,
            name: this.productTranslations['77'] ||'Vitro ceramic hob FAVORIT BIH-40',
            picture: 'assets/Built In Appliances/Vitro ceramic hob FAVORIT BIH-40/BIH-40-PHOTO-1-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: cookingStoveTopsLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 78,
            name: this.productTranslations['78'] ||'Vitro ceramic hob FAVORIT BIH-210X',
            picture: 'assets/Built In Appliances/Vitro ceramic hob FAVORIT BIH-210X/BIH-210X-PHOTO-1-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: cookingStoveTopsLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 67,
            name: this.productTranslations['67'] ||'Built-in domino plate D2',
            picture: 'assets/Built In Appliances/Built-in domino plate D2/FAVORIT-DOMINO-D2-07-1024x576.png',  
            pictureHover: 'assets/',
            subcategory: cookingStoveTopsLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },

        ];
        break;
      case 'built-in-fridges':
        const builtInFridgesLabel = this.filterSubcategory.builtInAppliances.builtInFridges;
        this.subcategories = [builtInFridgesLabel, allLabel];
        this.backgroundStyle = 'linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.27)), url("assets/subcategories/built-in-fridges.jpg")';
        this.subcategoryName = builtInFridgesLabel;
        this.products = [
          {
            id: 74,
            name: this.productTranslations['74'] ||'Built-in refrigerator UCF 2764N',
            picture: 'assets/Built In Appliances/Built-in refrigerator UCF 2764N/FAVORIT-UCF-2760-01-1024x576.png',
            pictureHover: 'assets/Built In Appliances/Built-in refrigerator UCF 2764N/FAVORIT-UCF-2760-02-1024x576.png',
            subcategory: builtInFridgesLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 150,
            name: this.productTranslations['150'] ||'Built-in refrigerator UF2795N',
            picture: 'assets/Built In Appliances/Built-in refrigerator UF2795N/Built-in refrigerator UF2795N.png',
            pictureHover: 'assets/Built In Appliances/Built-in refrigerator UF2795N/Built-in refrigerator UF2795N-opend.png',
            subcategory: builtInFridgesLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 75,
            name: this.productTranslations['75'] ||'Built-in refrigerator URF 263N',
            picture: 'assets/Built In Appliances/Built-in refrigerator URF 263N/Vgraden-frizider-URF-263N-43-1024x576.png',
            pictureHover: 'assets/Built In Appliances/Built-in refrigerator URF 263N/Vgraden-frizider-URF-263N-44-1024x576.png',
            subcategory: builtInFridgesLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 76,
            name: this.productTranslations['76'] ||'Built-in refrigerator URF 1600N',
            picture: 'assets/Built In Appliances/Built-in refrigerator URF 1600N/Vgraden-frizider-URF-1600N-43-1024x576.png',
            pictureHover: 'assets/Built In Appliances/Built-in refrigerator URF 1600N/Vgraden-frizider-URF-1600N-44-1024x576.png',
            subcategory: builtInFridgesLabel,
            backgroundColorproduct: 'linear-gradient(#9f9f9f 0%, #ffffff 90%, #ffffff 100%)'
          }
        ];
        break;
      case 'air-conditioners':
        const inverter15CLabel = this.filterSubcategory.airConditioners.inverter15C;
        const inverter25CLabel = this.filterSubcategory.airConditioners.inverter25C;
        const inverter35CLabel = this.filterSubcategory.airConditioners.inverter35C;
        this.backgroundStyle = '';
        this.subcategoryName = this.subcategoriesComponentConstant.airConditioners.airConitioners;
        this.products = [
          {
            // KEEP
            id: 84,
            name: this.productTranslations['84'] || 'AIR CONDITIONER INVERTER 12000BTU FF (-15 °C)',
            picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 12000BTU FF/12000BTU-FF-18000BTU-FF-1.png',
            pictureHover: 'assets/',
            subcategory: inverter15CLabel,
            backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            // KEEP
            id: 88,
            name: this.productTranslations['88'] || 'AIR CONDITIONER INVERTER 18000BTU FF (-15 °C)',
            picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 18000BTU FF/12000BTU-FF-18000BTU-FF-1.png',
            pictureHover: 'assets/',
            subcategory: inverter15CLabel,
            backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 125,
            name: this.productTranslations['125'] || 'AIR CONDITIONER 24000BTU FF (-15 °C)',
            picture: 'assets/Ait Conditioners/AIR CONDITIONER 24000BTU FF (-15 °C)/12000BTU-QB-HE-HB-18000BTU-QB-HE-HB-vnatresna-edinica-800x335.png',
            pictureHover: 'assets/',
            subcategory: inverter15CLabel,
            backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 85,
            name: this.productTranslations['85'] || 'AIR CONDITIONER INVERTER 12000BTU JD HB (-25°C)',
            picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 12000BTU JD HB/12000BTU-JD-HB-18000BTU-JD-HB.png',
            pictureHover: 'assets/',
            subcategory: inverter25CLabel,
            backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 89,
            name: this.productTranslations['89'] || 'AIR CONDITIONER INVERTER 18000BTU JD HB (-25°C)',
            picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 18000BTU JD HB/12000BTU-JD-HB-18000BTU-JD-HB.png',
            pictureHover: 'assets/',
            subcategory: inverter25CLabel,
            backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 127,
            name: this.productTranslations['127'] || 'AIR CONDITIONER INVERTER 24000BTU JD HB (-25°C)',
            picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 24000BTU JD HB/12000BTU-QB-HE-HB-18000BTU-QB-HE-HB-vnatresna-edinica-1024x429 (1).png',
            pictureHover: 'assets/',
            subcategory: inverter25CLabel,
            backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 128,
            name: this.productTranslations['128'] || 'AIR CONDITIONER 12000 BTU QB HE HB (-35°C)',
            picture: 'assets/Ait Conditioners/AIR CONDITIONER 12000 BTU QB HE HB/12000BTU-QB-HE-HB-18000BTU-QB-HE-HB-vnatresna-edinica-1024x429.png',
            pictureHover: 'assets/',
            subcategory: inverter35CLabel,
            backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          },
          {
            id: 129,
            name: this.productTranslations['129'] || 'AIR CONDITIONER 18000 BTU QB HE HB (-35°C)',
            picture: 'assets/Ait Conditioners/AIR CONDITIONER 18000 BTU QB HE HB/12000BTU-QB-HE-HB-18000BTU-QB-HE-HB-vnatresna-edinica-1024x429.png',
            pictureHover: 'assets/',
            subcategory: inverter35CLabel,
            backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          },

          // INVERTER
          // {
          //   id: 79,
          //   name: this.productTranslations['79'] || 'AIR CONDITIONER FAVORIT 12K SUPER INVERTER NORDIC',
          //   picture: 'assets/Ait Conditioners/AIR CONDITIONER FAVORIT 12K SUPER INVERTER NORDIC/KLIMA-21-1024x576-1.png',
          //   pictureHover: 'assets/',
          //   subcategory: inverterLabel,
          //   backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          // },
          // {
          //   id: 80,
          //   name: this.productTranslations['80'] || 'AIR CONDITIONER FAVORIT 18K SUPER INVERTER NORDIC',
          //   picture: 'assets/Ait Conditioners/AIR CONDITIONER FAVORIT 18K SUPER INVERTER NORDIC/18K-Nordic-1024x576.png',
          //   pictureHover: 'assets/',
          //   subcategory: inverterLabel,
          //   backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          // },
          // {
          //   id: 81,
          //   name: this.productTranslations['81'] || 'AIR CONDITIONER FAVORIT 24K SUPER INVERTER NORDIC',
          //   picture: 'assets/Ait Conditioners/AIR CONDITIONER FAVORIT 24K SUPER INVERTER NORDIC/24K-Nordic-1024x576.png',
          //   pictureHover: 'assets/',
          //   subcategory: inverterLabel,
          //   backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          // }
          // {
          //   id: 82,
          //   name: this.productTranslations['82'] ||'AIR CONDITIONER INVERTER 12000 BTU',
          //   picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 12000 BTU/FAVORIT-18000-BTU-KLIMA-01-scaled-1-1024x576.png',  pictureHover: 'assets/',
          //   subcategory: this.subcategoriesComponentConstant.airConditioners.inverter,
          //   backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'

          // },
           // {
          //   id: 86,
          //   name: this.productTranslations['86'] ||'AIR CONDITIONER INVERTER 18000 BTU',
          //   picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 18000 BTU/FAVORIT-18000-BTU-KLIMA-01-1024x576.png',  pictureHover: 'assets/',
          //   subcategory: this.subcategoriesComponentConstant.airConditioners.inverter,
          //   backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'

          // },

          // },
          // {
          //   id: 90,
          //   name: this.productTranslations['90'] ||'AIR CONDITIONER INVERTER 24000 BTU',
          //   picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 24000 BTU/FAVORIT-24000-BTU-KLIMA-02-1-1024x576.png',  pictureHover: 'assets/',
          //   subcategory: this.subcategoriesComponentConstant.airConditioners.inverter,
          //   backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          // },

          // // INVERTER WI-FI
          // {
          //   id: 83,
          //   name: this.productTranslations['83'] || 'AIR CONDITIONER INVERTER 12000 BTU WI-FI',
          //   picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 12000 BTU WI-FI/FAVORIT-KLIMA-12000-BTU-INVERTER-WI-FI-01-1024x576.png',
          //   pictureHover: 'assets/',
          //   subcategory: inverterWifiLabel,
          //   backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          // },
          // {
          //   id: 87,
          //   name: this.productTranslations['87'] || 'AIR CONDITIONER INVERTER 18000 BTU WI-FI',
          //   picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 18000 BTU WI-FI/FAVORIT-KLIMA-18000-BTU-INVERTER-WI-FI-01-1024x576.png',
          //   pictureHover: 'assets/',
          //   subcategory: inverterWifiLabel,
          //   backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          // },
          // {
          //   id: 91,
          //   name: this.productTranslations['91'] || 'AIR CONDITIONER INVERTER 24000 BTU WI-FI',
          //   picture: 'assets/Ait Conditioners/КЛИМА УРЕД ИНВЕРТЕР 24000 BTU WI-FI/FAVORIT-KLIMA-24000-BTU-INVERTER-WI-FI-01-500x375.png',
          //   pictureHover: 'assets/',
          //   subcategory: inverterWifiLabel,
          //   backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          // },
          // // INVERTER -15C
          // {
          //   id: 126,
          //   name: this.productTranslations['126'] || 'AIR CONDITIONER INVERTER 24000BTU FF (-15 °C)',
          //   picture: 'assets/Ait Conditioners/AIR CONDITIONER INVERTER 24000BTU FF (-15°C)/12000BTU-QB-HE-HB-18000BTU-QB-HE-HB-vnatresna-edinica-1024x429.png',
          //   pictureHover: 'assets/',
          //   subcategory: inverter15CLabel,
          //   backgroundColorproduct: 'linear-gradient(#33BBC6 0%, #ffffff 90%, #ffffff 100%)'
          // },
          // INVERTER -25C
          // INVERTER -35C
          // KEEP COMMENTED PRODUCTS

        ]; 
        // Only show subcategories (filters) that have at least one product
        const filterLabels = [inverter15CLabel, inverter25CLabel, inverter35CLabel];
        this.subcategories = filterLabels.filter(label => this.products.some(p => p.subcategory === label));
        this.subcategories.push(allLabel);
        this.displayedProducts = this.products;
        break;
        
        case 'televisions':
          const tvFilters = this.filterSubcategory.televisions;
          this.subcategories = [tvFilters.size32, tvFilters.size43, tvFilters.size50, tvFilters.size55, tvFilters.size65, tvFilters.size75, this.filterSubcategory.all];
          this.backgroundStyle = 'linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.27)), url("assets/category-photos/kategorija-tv.jpg")';
          this.subcategoryName = this.subcategoriesComponentConstant.categoryNamesTranslations.televisions;
          this.products = [
            {
              // KEEP
              id: 146,
              name: this.productTranslations['146'] ||'LED TV 75U20B-G1',
              picture: 'assets/TV/LED TV 75U20B-G1/7. FAVORIT TV 75U20B-G1-1.png',  
              pictureHover: 'assets/TV/LED TV 75U20B-G1/7. FAVORIT TV 75U20B-G1-2.png',
              subcategory: tvFilters.size75,
              backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
            },
            {
              // KEEP
              id: 145,
              name: this.productTranslations['145'] ||'LED TV 65U20B-G1',
              picture: 'assets/TV/LED TV 65U20B-G1/6.-FAVORIT-TV-50F135R-F-1.png',  
              pictureHover: 'assets/TV/LED TV 65U20B-G1/6.-FAVORIT-TV-50F135R-F-2.png',
              subcategory: tvFilters.size65,
              backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
            },
            {
              // KEEP
              id: 147,
              name: this.productTranslations['147'] ||'LED TV 55U20B-G1',
              picture: 'assets/TV/LED TV 55U20B-G1/5. FAVORIT TV 55U20B-G1-1.png',  
              pictureHover: 'assets/TV/LED TV 55U20B-G1/5. FAVORIT TV 55U20B-G1-2.png',
              subcategory: tvFilters.size55,
              backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
            },
            {
              // KEEP
              id: 123,
              name: this.productTranslations['123'] ||'LED TV 55DK5JM2T2S2A -11UHD 4K ANDROI',
              picture: 'assets/TV/LED ТЕЛЕВИЗОР 55DK5JM2T2S2A-11UHD 4K ANDROID(11)/11.-FAVORIT-LED-TV-55DK5JM2T2S2A-90UHD-ANDROID-55-SMART-Android-tv-01-1024x576.png',  
              pictureHover: 'assets/TV/LED ТЕЛЕВИЗОР 55DK5JM2T2S2A-11UHD 4K ANDROID(11)/7.-FAVORIT-LED-TV-55DK5JM2T2S2A-90UHD-ANDROID-55-SMART-Android-tv-1024x645.png',
              subcategory: tvFilters.size55,
              backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
            },
            {
              // KEEP
              id: 124,
              name: this.productTranslations['124'] ||'LED TV 55DЕ2М1T2S2A-13UHD 4K ANDROID',
              picture: 'assets/TV/LED ТЕЛЕВИЗОР 55DЕ2М1T2S2A-13UHD 4K ANDROID/TV-55DEM1T2S2A-13UHD-44-1024x576.png',  pictureHover: 'assets/',
              subcategory: tvFilters.size55,
              backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
            },
            {
              // KEEP
              id: 144,
              name: this.productTranslations['144'] ||'LED TV 50U20B-20D',
              picture: 'assets/TV/LED TV 50U20B-20D/TV 50U20B-20D-front.png',  
              pictureHover: 'assets/TV/LED TV 50U20B-20D/TV 50U20B-20D-back.png',
              subcategory: tvFilters.size50,
              backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
            },
            {
              // KEEP
              id: 121,
              name: this.productTranslations['121'] ||'LED TV 43DF3PHT2S2A-13FHD ANDROID',
              picture: 'assets/TV/LED ТЕЛЕВИЗОР 43DF3PHT2S2A-13FHD ANDROID/TV-43DF3PHT2S2A-13FHD-44-1024x576.png', 
              pictureHover: 'assets/',
              subcategory: tvFilters.size43,
              backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
            },
            {
              id: 148,
              name: this.productTranslations['148'] ||'LED TV 43U20B-20D',
              picture: 'assets/TV/LED TV 43U20B-20D/2. FAVORIT TV 43U20B-20D-1.png',  
              pictureHover: 'assets/TV/LED TV 43U20B-20D/2. FAVORIT TV 43U20B-20D-2.png',
              subcategory: tvFilters.size43,
              backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
            },
            {
              id: 149,
              name: this.productTranslations['149'] ||'LED TV 32U20B-20D',
              picture: 'assets/TV/LED TV 32U20B-20D/1. FAVORIT TV 32U20B-20D-1.png',  
              pictureHover: 'assets/TV/LED TV 32U20B-20D/1. FAVORIT TV 32U20B-20D-5.png',
              subcategory: tvFilters.size32,
              backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
            },
            {
              // KEEP
              id: 117,
              name: this.productTranslations['117'] ||'LED TV 32DF1P4T2HD',
              picture: 'assets/TV/LED ТЕЛЕВИЗОР 32DF1P4T2HD/32DF1P4T2HD-44-1024x576.png',  pictureHover: 'assets/',
              subcategory: tvFilters.size32,
              backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
            },
            {
              // KEEP
              id: 116,
              name: this.productTranslations['116'] ||'LED TV 32DF1M1T2S2A-13HD ANDROID',
              picture: 'assets/TV/LED ТЕЛЕВИЗОР 32DF1M1T2S2A-13HD ANDROID/TV-32DF1M1T2S2A-13HD-44-1024x576.png',  pictureHover: 'assets/',
              subcategory: tvFilters.size32,
              backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
              // #4900E4 0%, #D681C6 100%
            },
  
            // {
            //   id: 119,
            //   name: this.productTranslations['119'] ||'LED TV 32DN4P4T2HD',
            //   picture: 'assets/TV/LED ТЕЛЕВИЗОР 32DN4P4T2HD/1.-FAVORIT-LED-TV-32DN4P4T2HD-32-Digital-tv-01-1-1024x576.png',  pictureHover: 'assets/',
            //   subcategory: '32"',
            //   backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
  
            // },
            // {
            //   id: 118,
            //   name: this.productTranslations['118'] ||'LED ТЕЛЕВИЗОР 32DN4M3T2S2A – 11HD ANDROID',
            //   picture: 'assets/TV/LED ТЕЛЕВИЗОР 32DN4M3T2S2A – 11HD ANDROID/FAVORIT-LED-TV-32DN4M3T2A-70HD-ANDROID-32-SMART-Android (1).png',  pictureHover: 'assets/',
            //   subcategory: '32"',
            //   backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
  
            // },
            // {
            //   id: 120,
            //   name: this.productTranslations['120'] ||'LED TV 40DN4JM3T2A – ANDROID (7.0)',
            //   picture: 'assets/TV/LED ТЕЛЕВИЗОР 40DN4JM3T2A – ANDROID (7.0)/6.-FAVORIT-LED-TV-40DN4JM3T2A-70FHD-ANDROID-40-SMART-Android-tv-01-1024x576.png',  pictureHover: 'assets/',
            //   subcategory: '40"',
            //   backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
  
            // },
            // {
            //   id: 122,
            //   name: this.productTranslations['122'] ||'LED TV 43DN4JM2T2S2A 11FHD ANDROID (11)',
            //   picture: 'assets/TV/LED ТЕЛЕВИЗОР 43DN4JM2T2S2A – 11FHD ANDROID (11)/123456-1024x576.png',  pictureHover: 'assets/',
            //   subcategory: '43"',
            //   backgroundColorproduct: 'linear-gradient(#928EE1 0%, #ffffff 50%, #ffffff 100%)'
  
            // },
          ]; //tuka kje idat televizori
          break;
        case 'hoods': {
        const hoodsFilters = this.filterSubcategory.hoods;
        const allLabel = this.filterSubcategory.all;
        this.subcategories = [hoodsFilters.decorativeHoods, hoodsFilters.telescopicHoods, allLabel];
        this.backgroundStyle = 'linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.27)), url("assets/category-photos/kategorija-apiratori.jpg")';
        this.subcategoryName = this.subcategoriesComponentConstant.categoryNamesTranslations.hoods;
        this.products = [
          // Decorative Hoods
          {
            id: 133,
            name: this.productTranslations['133'] || 'Decorative Cooker Hood LD46BB-60',
            picture: 'assets/Hoods/Decorative Cooker Hood LD46BB-60/Dekorativen-aspirator-LD46BB-60-1024x1024.png',
            pictureHover: '',
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)',
            subcategory: hoodsFilters.decorativeHoods
          },
          // Telescopic Hoods
          {
            id: 130,
            name: this.productTranslations['130'] || 'Telescopic Cooker Hood 7062 W',
            picture: 'assets/Hoods/Telescopic Cooker Hood 7062 W/Teleskopski-aspirator-7062-W-2-1024x1024.png',
            pictureHover: 'assets/Hoods/Telescopic Cooker Hood 7062 W/Teleskopski-aspirator-7062-W-2-1024x1024.png',
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)',
            subcategory: hoodsFilters.telescopicHoods
          },
          {
            id: 131,
            name: this.productTranslations['131'] || 'Telescopic Cooker Hood 7062 B',
            picture: 'assets/Hoods/Telescopic Cooker Hood 7062 B/Teleskopski-aspirator-7062-B-1024x1024.png',
            pictureHover: 'assets/Hoods/Telescopic Cooker Hood 7062 B/Teleskopski-aspirator-7062-B-1024x1024.png',
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)',
            subcategory: hoodsFilters.telescopicHoods
          },
          {
            id: 132,
            name: this.productTranslations['132'] || 'Telescopic Cooker Hood 7062 X',
            picture: 'assets/Hoods/Telescopic Cooker Hood 7062 X/ASPIRATORI-03-1536x864-2.png',
            pictureHover: 'assets/Hoods/Telescopic Cooker Hood 7062 X/ASPIRATORI-03-1536x864-2.png',
            backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)',
            subcategory: hoodsFilters.telescopicHoods
          }
        ];
        }
        break;
        case 'cooking-heating-appliances': {
          const filters = this.filterSubcategory.smallDomesticAppliances;
          const constants = this.subcategoriesComponentConstant.smallDomesticAppliances;
          this.subcategories = [filters.airFryer, filters.microwaves,filters.grills, filters.toasters, allLabel];
          this.backgroundStyle = 'linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.27)), url("assets/category-photos/kategorija-mali-aparati.jpg")';
          this.subcategoryName = this.subcategoriesComponentConstant.smallDomesticAppliances.cookingHeatingAppliances || 'Cooking & Heating Appliances';
          this.products = [
            // Air Fryer
            {
              id: 92,
              name: this.productTranslations['92'] || 'Air fryer AF9001',
              picture: 'assets/Small domestic appliances/Air fryer AF9001/Air-fryer-AF9001-45-1-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.airFryer,
              backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
            },
            // Microwaves
            {
              id: 101,
              name: this.productTranslations['101'] || 'MICROWAVE OVEN MW-20 S',
              picture: 'assets/Small domestic appliances/MICROWAVE OVEN MW-20 S/MW-20-S-min-1024x630.png',
              pictureHover: 'assets/',
              subcategory: filters.microwaves,
              backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
            },
            {
              id: 102,
              name: this.productTranslations['102'] || 'MICROWAVE OVEN MW-20 W',
              picture: 'assets/Small domestic appliances/MICROWAVE OVEN MW-20 W/MW-20-White-min-1024x630.png',
              pictureHover: 'assets/',
              subcategory: filters.microwaves,
              backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
            },
            // Grills
            {
              id: 96,
              name: this.productTranslations['96'] || 'ELECTRIC GRILL GR-573',
              picture: 'assets/Small domestic appliances/ELECTRIC GRILL GR-573/GR-573-1024x791-1.png',
              pictureHover: 'assets/',
              subcategory: filters.grills,
              backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
            },
            // Toasters
            {
              id: 107,
              name: this.productTranslations['107'] || 'Toaster S1604',
              picture: 'assets/Small domestic appliances/Toaster S1604/thumbnail_TOSTER-NOV-44-1-1024x575.png',
              pictureHover: 'assets/',
              subcategory: filters.toasters,
              backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
            },
            // {
            //   id: 109,
            //   name: this.productTranslations['109'] || 'Toster TA01101',
            //   picture: 'assets/Small domestic appliances/Toster TA01101/toster-za-dvopek-TA01101-45-1024x576.png',
            //   pictureHover: 'assets/',
            //   subcategory: filters.toasters,
            //   backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
            // },
            {
              id: 108,
              name: this.productTranslations['108'] || 'Toaster TR-1800',
              picture: 'assets/Small domestic appliances/Toaster TR-1800/toster-TR1800-01-1-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.toasters,
              backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
            }
          ];
          break;
        }
        case 'food-beverage-preparation': {
          const filters = this.filterSubcategory.smallDomesticAppliances;
          const constants = this.subcategoriesComponentConstant.smallDomesticAppliances;
          const allLabel = this.filterSubcategory.all;
          this.subcategories = [filters.blenders, filters.mixers, filters.chop, filters.thermalJugs, filters.colanders, allLabel];
          this.backgroundStyle = 'linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.27)), url("assets/category-photos/kategorija-mali-aparati.jpg")';
          this.subcategoryName = this.subcategoriesComponentConstant.smallDomesticAppliances.foodBeveragePreparation || 'Food & Beverage Preparation';
          this.products = [
            // Blenders
            {
              id: 97,
              name: this.productTranslations['97'] || 'Hand blender HB5006',
              picture: 'assets/Small domestic appliances/Hand blender HB5006/Racen-blender-HB5006-45-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.blenders,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            {
              id: 93,
              name: this.productTranslations['93'] || 'Blender BL9006',
              picture: 'assets/Small domestic appliances/Blender BL9006/Blender-BL9006-45-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.blenders,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            {
              id: 94,
              name: this.productTranslations['94'] || 'Blender BL9702X',
              picture: 'assets/Small domestic appliances/Blender BL9702X/Blender-BL9702X-45-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.blenders,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            // Mixers
            {
              id: 98,
              name: this.productTranslations['98'] || 'Hand mixer HM 9105',
              picture: 'assets/Small domestic appliances/Hand mixer HM 9105/Racen-mikser-HM9105-45-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.mixers,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            {
              id: 103,
              name: this.productTranslations['103'] || 'Stand mixer HM9109',
              picture: 'assets/Small domestic appliances/Stand mixer HM9109/Mikser-so-postolje-HM9109-45-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.mixers,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            // Chopper
            {
              id: 95,
              name: this.productTranslations['95'] || 'Chopper CH-363',
              picture: 'assets/Small domestic appliances/Chopper CH-363/SECKO-CH-363-01-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.chop,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            // Thermal Jugs
            {
              id: 105,
              name: this.productTranslations['105'] || 'THERMAL KETTLE Т-1798 White',
              picture: 'assets/Small domestic appliances/THERMAL KETTLE Т-1798 БЕЛ/TERMO-BOKAL-T-1798-01-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.thermalJugs,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            {
              id: 106,
              name: this.productTranslations['106'] || 'THERMAL KETTLE Т-4028A INOX',
              picture: 'assets/Small domestic appliances/THERMAL KETTLE Т-4028A INOX/TERMO-BOKAL-INOX-01-1-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.thermalJugs,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            // Colanders
            {
              id: 104,
              name: this.productTranslations['104'] || 'Strainer J-3000',
              picture: 'assets/Small domestic appliances/Strainer J-3000/CEDALKA-J-3000-01-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.colanders,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
          ];
          break;
        }
        case 'home-care-cleaning': {
          const filters = this.filterSubcategory.smallDomesticAppliances;
          const constants = this.subcategoriesComponentConstant.smallDomesticAppliances;
          const allLabel = this.filterSubcategory.all;
          this.subcategories = [filters.irons, filters.vacuumCleaners, allLabel];
          this.backgroundStyle = 'linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.27)), url("assets/category-photos/kategorija-mali-aparati.jpg")';
          this.subcategoryName = this.subcategoriesComponentConstant.smallDomesticAppliances.homeCareCleaning || 'Home Care & Cleaning';
          this.products = [
            // Irons
            {
              id: 99,
              name: this.productTranslations['99'] || 'IRON PL-501',
              picture: 'assets/Small domestic appliances/IRON PL-501/PEGLA-PL-501-01-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.irons,
              backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
            },
            {
              id: 100,
              name: this.productTranslations['100'] || 'IRON PL-619',
              picture: 'assets/Small domestic appliances/IRON PL-619/PEGLA-PL-619-01-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.irons,
              backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
            },
            {
              id: 143,
              name: this.productTranslations['143'] || 'IRON PL-607',
              picture: 'assets/Small domestic appliances/IRON PL-607/viber_image_2024-03-25_13-19-07-518-1.png',
              pictureHover: 'assets/',
              subcategory: filters.irons,
              backgroundColorproduct: 'linear-gradient(#ffa87d 0%,#ffffff 90%,#ffffff 100%)'
            },
            // Vacuum Cleaners
            {
              id: 156,
              name: this.productTranslations['156'] ||'VACUUM CLEANER VC-09 (1600W)',
              picture: 'assets/Small domestic appliances/VACUUM CLEANER VC-09 (1600W)/1. FAVORIT VC-09 -ispravena.png',
              pictureHover: "assets/Small domestic appliances/VACUUM CLEANER VC-09 (1600W)/2. FAVORIT VC-09-komplet so crevo i papuca.png",
              subcategory: filters.vacuumCleaners,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)',
            },
            {
              id: 157,
              name: this.productTranslations['157'] ||'VACUUM CLEANER VC-17 (1800W)',
              picture: 'assets/Small domestic appliances/VACUUM CLEANER VC-17 (1800W)/6. FAVORIT VC-17- ispravena.png',
              pictureHover: "assets/Small domestic appliances/VACUUM CLEANER VC-17 (1800W)/4. FAVORIT VC-17 - so crevo i papuca.png",
              subcategory: filters.vacuumCleaners,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)',
            },
            {
              id: 158,
              name: this.productTranslations['158'] ||'VACUUM CLEANER VC-19 (2200W)',
              picture: 'assets/Small domestic appliances/VACUUM CLEANER VC-19 (2200W)/8. FAVORIT VC-19-legnata.png',
              pictureHover: "assets/Small domestic appliances/VACUUM CLEANER VC-19 (2200W)/7. FAVORIT VC-19-so crevo i papuca.png",
              subcategory: filters.vacuumCleaners,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)',
            },
            {
              id: 159,
              name: this.productTranslations['159'] ||'VACUUM CLEANER VC-33 (2400W)',
              picture: 'assets/Small domestic appliances/VACUUM CLEANER VC-33 (2400W)/9. FAVORIT VC-33-legnata.png',
              pictureHover: "assets/Small domestic appliances/VACUUM CLEANER VC-33 (2400W)/11. FAVORIT VC-33-so crevo i papuca.png",
              subcategory: filters.vacuumCleaners,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)',
            },
            {
              id: 110,
              name: this.productTranslations['110'] || 'VACUUM CLEANER FVC 123 RED',
              picture: 'assets/Small domestic appliances/VACUUM CLEANER FVC 123/FVC123-HD-01-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.vacuumCleaners,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            {
              id: 110,
              name: this.productTranslations['110'] || 'VACUUM CLEANER FVC 123 BLUE',
              picture: 'assets/Small domestic appliances/VACUUM CLEANER FVC 123/FVC123-HD-01-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.vacuumCleaners,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            {
              id: 114,
              name: this.productTranslations['114'] || 'VACUUM CLEANER FVC 306 GREY/ORANGE',
              picture: 'assets/Small domestic appliances/VACUUM CLEANER FVC 306/FVC306-HD-10-1024x577.png',
              pictureHover: 'assets/',
              subcategory: filters.vacuumCleaners,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            {
              id: 113,
              name: this.productTranslations['113'] || 'VACUUM CLEANER FVC 245 RED',
              picture: 'assets/Small domestic appliances/VACUUM CLEANER FVC 245/FVC245-HD-01-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.vacuumCleaners,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            {
              id: 111,
              name: this.productTranslations['111'] || 'VACUUM CLEANER FVC 156',
              picture: 'assets/Small domestic appliances/VACUUM CLEANER FVC 156/FVC156-HD-01-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.vacuumCleaners,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            {
              id: 112,
              name: this.productTranslations['112'] || 'VACUUM CLEANER FVC 160',
              picture: 'assets/Small domestic appliances/VACUUM CLEANER FVC 160/2-FAVORIT-pravosmukalka-FVC-160-01-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.vacuumCleaners,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            },
            {
              id: 115,
              name: this.productTranslations['115'] || 'VACUUM CLEANER FVC 585',
              picture: 'assets/Small domestic appliances/VACUUM CLEANER FVC 585/7.1-FAVORIT-pravosmukalka-FVC-585-CELOSNA-01-1024x576.png',
              pictureHover: 'assets/',
              subcategory: filters.vacuumCleaners,
              backgroundColorproduct: 'linear-gradient(#5FC261 0%, #ffffff 90%, #ffffff 100%)'
            }
          ];
          break;
        }
  }
}


  updateDisplayedProducts(pageIndex: number = 0, pageSize: number = this.pageSize) {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.displayedProducts = this.products.slice(startIndex, endIndex);
  }

  onHover(product: Product, isHovering: boolean) {
    product.isHovered = isHovering;
    if (isHovering && product.pictureHover && product.pictureHover.trim().length >= 8) {
      product.currentPicture = product.pictureHover;
    } else {
      product.currentPicture = product.picture;
    }
  }

  onPageEvent(event: PageEvent) {
    this.updateDisplayedProducts(event.pageIndex, event.pageSize);
  }

  onNavigate(category: string, subcategory: string, productId: number) {
    this._router.navigate([`/p/${productId}`], { queryParamsHandling: 'merge' })
    .then(() => {
      window.scrollTo(0, 0);
    });
  }
  

  onEnter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.displayedProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(value)
    );
  }
  onChooseSubcategory(selected: string) {
    if (selected === this.filterSubcategory.all) {
      this.displayedProducts = this.products;
    } else {
      this.displayedProducts = this.products.filter(
        p => p.subcategory && p.subcategory.toLowerCase().trim() === selected.toLowerCase().trim()
      );
    }
    // Close filter menu and scroll to top on mobile
    if (this.isMobileView) {
      this.showFilters = false;
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
  }
  
}
