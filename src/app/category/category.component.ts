import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Import the translation JSON files
import subcategoriesMk from './subcategories_mk.json';
import subcategoriesEn from './subcategories_en.json';
import subcategoriesSr from './subcategories_sr.json';
import subcategoriesAl from './subcategories_al.json';

import learnmore_translations_al from './larnmore_translations_al.json';
import learnmore_translations_en from './larnmore_translations_en.json';
import learnmore_translations_mk from './larnmore_translations_mk.json';
import learnmore_translations_sr from './larnmore_translations_sr.json';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatCardModule, FormsModule, MatIconModule, RouterModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  searchText: any;
  subcategories: any[] = [];
  displayedSubcategories: any[] = [];
  pageSize = 12;
  pageSizeOptions: number[] = [12, 24, 48, 64, 128];
  category: string = '';
  currentLang: string = 'en';
  subcategoriesComponentConstant: any;
  subcategoryName: string = '';
  subcategory: string = '';
  breadcrumbs: { label: string, url: string }[] = [];
  larnmoreTranslations: any;
  categoryImage: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // Initialize with default translations first
    this.updateTranslations('en');
    
    this._activatedRoute.paramMap.subscribe(params => {
      this.category = params.get('category') || ''; // Fetch the clicked category from route
      this.categoryImage = this.getCategoryImage(this.category);
      this.loadSubcategories(); // Ensure subcategories update on category change
      this.setupBreadcrumbs(); // Call to update breadcrumbs
    });

    this._activatedRoute.queryParamMap.subscribe(queryParams => {
      this.currentLang = queryParams.get('lang') || 'en'; // Default language is English
      this.updateTranslations(this.currentLang); // Update translations based on the current language
      this.loadSubcategories();
      this.setupBreadcrumbs();
    });
  }
  getCategoryImage(category: string): string {
    const images: { [key: string]: string } = {
      'home-appliances': 'assets/bela-tehnika-1.jpg',
      'built-in-appliances': 'assets/VGRADENI-ELEMENTI-scaled.jpg',
      'small-domestic-appliances': 'assets/mali-kujnski-aparaturi.jpg'
    }
    return images[category] || 'assets/'
  }
  private setupBreadcrumbs() {
    // Translate "Home"
    const homeLabel = this.getTranslatedNameBread('Home');

    // Translate category
    const categoryLabel = this.getTranslatedNameBread(this.category);

    // Translate subcategory if available
    const subcategoryLabel = this.subcategory ? this.getTranslatedNameBread(this.subcategory) : '';

    // Set up the breadcrumbs structure
    this.breadcrumbs = [
      { label: homeLabel, url: '/' }, // Home
      { label: categoryLabel, url: `/category/${this.category}` } // Category
    ];

    // If subcategory exists, add it to the breadcrumbs
    if (this.subcategory) {
      this.breadcrumbs.push({ label: subcategoryLabel, url: `/category/${this.category}` });
    }
  }

  public getTranslatedNameBread(key: string, isCategory: boolean = false): string {
    if (!key) return '';
  
    // Special case for "Home"
    if (key === 'Home') {
      return this.currentLang === 'mk' ? 'Почетна' :
             this.currentLang === 'sr' ? 'Дом' :
             this.currentLang === 'al' ? 'Shtëpi' : 'Home';
    }
  
    const translationData = this.subcategoriesComponentConstant;
    if (translationData) {
      const translatedCategory = translationData.categoryNamesTranslations?.[key];
      const translatedSubcategory = translationData[this.formatKey(this.category)]?.[key];
      return translatedCategory || translatedSubcategory || key;
    }
  
    return key;
  }

  getTranslatedDescription(id: string): string {
    const translationData = this.subcategoriesComponentConstant;
    if (!translationData) return '';
    return translationData[this.category]?.[`${id}-desc`] || '';
  }

  private formatKey(key: string): string {
    return key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  }

  // Function to update translations based on the selected language
  private updateTranslations(lang: string) {
    switch (lang) {
      case 'mk':
        this.subcategoriesComponentConstant = subcategoriesMk;
        this.larnmoreTranslations = learnmore_translations_mk;
        break;
      case 'en':
        this.subcategoriesComponentConstant = subcategoriesEn;
        this.larnmoreTranslations = learnmore_translations_en;
        break;
      case 'sr':
        this.subcategoriesComponentConstant = subcategoriesSr;
        this.larnmoreTranslations = learnmore_translations_sr;
        break;
      case 'al':
        this.subcategoriesComponentConstant = subcategoriesAl;
        this.larnmoreTranslations = learnmore_translations_al;
        break;
      default:
        this.subcategoriesComponentConstant = subcategoriesEn; // Default to English
        this.larnmoreTranslations = learnmore_translations_en;
        break;
    }
  }

  // Function to fetch the translated name of the subcategory
  getTranslatedName(subcategoryId: string): string {
    const translationData = this.subcategoriesComponentConstant;
    // Access the subcategory name from the JSON structure, fall back to ID if translation is not available
    const subcategoryTranslation = translationData?.[this.category]?.[subcategoryId];
    // Fallback to subcategory ID if translation is not available
    return subcategoryTranslation || subcategoryId || 'Unknown Subcategory';
  }

  // Load subcategories dynamically with translated names
  loadSubcategories(): void {
    const subcategoryDefinitions: { [key: string]: any[] } = {
      'home-appliances': [
        { id: 'washing-and-drying-machines', image: 'assets/subcategorys/washing-machines.png' },
        { id: 'fridges-and-freezers', image: 'assets/subcategorys/fridges.png' },
        { id: 'boilers', image: 'assets/subcategorys/boilers.png' },
        { id: 'dishwashers', image: 'assets/subcategorys/dishwashers.png' },
        // { id: 'mini-stoves', image: 'assets/subcategorys/mini-stoves.png' },
        // { id: 'dryers', image: 'assets/subcategorys/dryers.jpg' },
        { id: 'stoves-and-mini-stoves', image: 'assets/subcategorys/stoves.png' },
        // { id: 'freezers', image: 'assets/subcategorys/freezers.jpg' }
      ],
      'built-in-appliances': [
        { id: 'built-in-dishwashers', image: 'assets/subcategorys/built-in-dishwashers.png' },
        { id: 'built-in-cooking-appliences', image: 'assets/subcategorys/built-in-cooking-appliences.png' },
        { id: 'built-in-fridges', image: 'assets/subcategorys/built-in-fridges.png' }
      ],
      'air-conditioners': [
        { id: 'inverter', image: 'assets/subcategorys/inverter.jpg' },
        { id: 'inverter-wifi', image: 'assets/subcategorys/inverter-wifi.jpg' },
        { id: 'inverter-15C', image: 'assets/subcategorys/inverter-15C.jpg' },
        { id: 'inverter-25C', image: 'assets/subcategorys/inverter-25C.jpg' },
        { id: 'inverter-35C', image: 'assets/subcategorys/inverter-35C.jpg' }
      ],
      'small-domestic-appliances': [
        { id: 'cooking-heating-appliances', image: 'assets/subcategorys/cooking-heating-appliances.png', name: 'Cooking & Heating Appliances' },
        { id: 'food-beverage-preparation', image: 'assets/subcategorys/food-beverage-preparation.png', name: 'Food & Beverage Preparation' },
        { id: 'home-care-cleaning', image: 'assets/subcategorys/home-care-cleaning.png', name: 'Home Care & Cleaning' }
      ],
      'hoods': [
        { id: 'decorative-hoods', image: 'assets/subcategorys/decorative-hoods.jpg' },
        { id: 'telescopic-hoods', image: 'assets/subcategorys/telescopic-hoods.jpg' }
      ],
      'televisions': [
        // Add televisions subcategories if needed
      ]
    };

    console.log('Subcategory Keys:', Object.keys(this.subcategoriesComponentConstant[this.category] || {}));

    // Assign translated names to subcategories
    this.subcategories = subcategoryDefinitions[this.category] || [];
    this.subcategories.forEach(subcategory => {
      subcategory.name = this.getTranslatedName(subcategory.id);
    });

    console.log('Loaded Subcategories:', this.subcategories);

    // Initialize pagination
    this.updateDisplayedSubcategories();
  }

  updateDisplayedSubcategories(pageIndex: number = 0, pageSize: number = this.pageSize): void {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.displayedSubcategories = this.subcategories.slice(startIndex, endIndex);
    console.log('Displayed Subcategories:', this.displayedSubcategories);
  }

  onPageEvent(event: PageEvent): void {
    this.updateDisplayedSubcategories(event.pageIndex, event.pageSize);
  }

  // Navigate to subcategory using its translated name and ID
  onNavigateSubcategory(id: string): void {
    const lowerSubcategoryId = id.toLowerCase().replace(/\s+/g, '-');
    this._router.navigate([`/category/${this.category}/subcategory/${lowerSubcategoryId}`], { queryParamsHandling: 'merge' })
      .then(() => window.scrollTo({ top: 0 }));
  }
}
