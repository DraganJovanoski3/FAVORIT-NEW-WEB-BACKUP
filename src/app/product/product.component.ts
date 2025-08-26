import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from "@angular/core"; 
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { combineLatest } from "rxjs";
import { CommonModule } from "@angular/common";
import { Location } from '@angular/common';

// Product lists and specification translations
import productList_en from './products_list_en.json';
import productList_mk from './products_list_mk.json';
import productList_sr from './products_list_sr.json';
import productList_al from './products_list_al.json';
import specificationTranslations_mk from './specification_translations_mk.json';
import specificationTranslations_en from './specification_translations_en.json';
import specificationTranslations_al from './specification_translations_al.json';
import specificationTranslations_sr from './specification_translations_sr.json';

// Breadcrumb translation JSON files (for Home, category, subcategory)
import subcategories_mk from '../subcategory/subcategories_mk_new.json';
import subcategories_en from '../subcategory/subcategories_en_new.json';
import subcategories_al from '../subcategory/subcategories_al_new.json';
import subcategories_sr from '../subcategory/subcategories_sr_new.json';

// Product names for subcategory products
import product_names_mk from '../subcategory/product_names_mk.json';
import product_names_sr from '../subcategory/product_names_sr.json';
import product_names_al from '../subcategory/product_names_al.json';

interface ProductListInterface {
  id: number;
  name: string;
  pictures?: string[];
  description: string | string[];
  specifications?: { [key: string]: string | number | string[] | undefined };
  specificationsDoc?: string;
  discount?: string;
  originalPrice?: number;
  category?: string; // Added for breadcrumbs
  subcategory?: string; // Added for breadcrumbs
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit {
  @ViewChild('modal') modal?: ElementRef<HTMLElement>;
  @ViewChild('modalImage') modalImage?: ElementRef<HTMLImageElement>;

  productId!: number;
  productList!: ProductListInterface[];
  specificationTranslations: any;
  product: ProductListInterface | undefined;
  allSpecifications: any[] = [];
  displayedSpecifications: any[] = [];
  firstFiveSpecifications: { label: string; value: string }[] = [];
  showAll: boolean = false;
  initialSpecificationCount: number = 999;
  relatedProducts: ProductListInterface[] = [];
  companyName: string = 'Favorit Eletronics';

  // Breadcrumbs for the product page
  breadcrumbs: { label: string, url: string }[] = [];

  // Extracted from the route parameters
  category: string = '';
  subcategory: string = '';
  currentLang: string = 'en';

  currentImageIndex: number = 0;

  // --- Modal Zoom & Drag State ---
  isZoomed: boolean = false;
  isDragging: boolean = false;
  imageOffsetX: number = 0;
  imageOffsetY: number = 0;
  dragStartX: number = 0;
  dragStartY: number = 0;
  zoomScale: number = 1;
  private hasDragged: boolean = false;
  private mouseMoveListener: (() => void) | null = null;
  private mouseUpListener: (() => void) | null = null;
  private touchMoveListener: (() => void) | null = null;
  private touchEndListener: (() => void) | null = null;

  // This property will hold the translation data for the breadcrumbs.
  subcategoriesComponentConstant: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private renderer: Renderer2,
    private _location: Location
  ) {}

  ngOnInit(): void {
    combineLatest([this._route.params, this._route.queryParams]).subscribe(([params, queryParams]) => {
      this.category = params['category'] || '';
      this.subcategory = params['subcategory'] || '';
      this.productId = +params['productId'];
      this.currentLang = queryParams['lang'] || 'en';

      switch (this.currentLang) {
        case 'mk':
          this.productList = productList_mk;
          this.specificationTranslations = specificationTranslations_mk;
          this.subcategoriesComponentConstant = subcategories_mk;
          break;
        case 'en':
          this.productList = productList_en;
          this.specificationTranslations = specificationTranslations_en;
          this.subcategoriesComponentConstant = subcategories_en;
          break;
        case 'sr':
          this.productList = productList_sr;
          this.specificationTranslations = specificationTranslations_sr;
          this.subcategoriesComponentConstant = subcategories_sr;
          break;
        case 'al':
          this.productList = productList_al;
          this.specificationTranslations = specificationTranslations_al;
          this.subcategoriesComponentConstant = subcategories_al;
          break;
        default:
          this.productList = productList_en;
          this.specificationTranslations = specificationTranslations_en;
          this.subcategoriesComponentConstant = subcategories_en;
          break;
      }

      this.product = this.productList.find(p => p.id === this.productId);

      // Only show product name in breadcrumbs
      this.breadcrumbs = [{ label: this.product?.name || '', url: '' }];

      if (this.product && this.product.specifications) {
        this.allSpecifications = Object.entries(this.product.specifications).map(
          ([key, value]) => ({ label: key, value })
        );
        this.displayedSpecifications = this.allSpecifications.slice(0, this.initialSpecificationCount);
        this.firstFiveSpecifications = this.extractFirstFiveSpecifications(this.product.specifications);
      }

      this.findRelatedProducts();
    });
  }

  ngAfterViewInit(): void {
    this.updateModalCursor();
  }

  /**
   * Sets up the breadcrumb navigation for the product page.
   * The first three items (Home, category, subcategory) are translated,
   * while the product name is displayed as-is.
   */
  private setupBreadcrumbs(): void {
    this.breadcrumbs = [];
    
    // Add Home breadcrumb
    this.breadcrumbs.push({ label: this.getTranslatedNameBread('Home'), url: '/' });
    
    // Add Category breadcrumb
    this.breadcrumbs.push({ label: this.getTranslatedNameBread(this.category, true), url: `/c/${this.category}` });
    
    // If category and subcategory are both 'air-conditioners', 'televisions', or 'hoods', skip subcategory
    if (
      (this.category === 'air-conditioners' && this.subcategory === 'air-conditioners') ||
      (this.category === 'televisions' && this.subcategory === 'televisions') ||
      (this.category === 'hoods' && this.subcategory === 'hoods')
    ) {
      // Skip subcategory breadcrumb for these special cases
    } else {
      // Add Subcategory breadcrumb
      if (this.subcategory && this.subcategory !== 'other') {
        this.breadcrumbs.push({ label: this.getTranslatedNameBread(this.subcategory), url: `/c/${this.category}/${this.subcategory}` });
      }
    }
    
    // Add Product name (no link)
    this.breadcrumbs.push({ label: this.product?.name || '', url: '' });
  }

  /**
   * Translates breadcrumb labels.
   * For "Home", returns a language-specific value.
   * For main categories, it uses the "categoryNamesTranslations" section.
   * For subcategories, it retrieves the translation within the current category.
   */
  private getTranslatedNameBread(key: string, isCategory: boolean = false): string {
    if (!key) return '';

    // Handle "Home" explicitly
    if (key === 'Home') {
      return this.currentLang === 'mk' ? 'Почетна' :
             this.currentLang === 'sr' ? 'Домa' :
             this.currentLang === 'al' ? 'Shtëpi' : 'Home';
    }

    const formattedKey = this.formatKey(key);
    const translationData = this.subcategoriesComponentConstant;

    if (isCategory) {
      return translationData?.categoryNamesTranslations?.[formattedKey] || key;
    }

    // For subcategories, use the current category to lookup translations.
    const subcategoryTranslations = translationData?.[this.formatKey(this.category)];
    return subcategoryTranslations?.[formattedKey] || key;
  }

  /**
   * Formats the key to match the JSON structure.
   * For example, it can convert dashes to camelCase.
   */
  private formatKey(key: string): string {
    return key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  }

  // --- Modal & Slider Methods ---

  turnModalOn(): void {
    if (this.modal) {
      this.renderer.addClass(this.modal.nativeElement, 'active');
      this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
    }
  }

  closeModal(): void {
    if (this.modal) {
      this.renderer.removeClass(this.modal.nativeElement, 'active');
      this.isZoomed = false;
      this.isDragging = false;
      this.resetOffsets();
      this.zoomScale = 1;
      this.updateModalCursor();
      this.updateModalTransform();
      this.renderer.setStyle(document.body, 'overflow-y', 'auto');
      this.removeGlobalListeners();
      this.removeTouchListeners();
    }
  }

  handleClickThumbnail(event: MouseEvent, index: number): void {
    this.currentImageIndex = index;
    this.isZoomed = false;
    this.zoomScale = 1;
    this.resetOffsets();
    this.updateModalCursor();
    this.updateModalTransform();
  }

  handleClickModalThumbnail(event: MouseEvent, index: number): void {
    this.currentImageIndex = index;
    this.isZoomed = false;
    this.zoomScale = 1;
    this.resetOffsets();
    this.updateModalCursor();
    this.updateModalTransform();
  }

  // --- Modal Zoom & Drag Methods (Mouse) ---

  onImageClick(): void {
    if (this.hasDragged) {
      this.hasDragged = false;
      return;
    }
    this.toggleZoom();
  }

  onImageMouseDown(event: MouseEvent): void {
    if (this.isZoomed) {
      event.preventDefault();
      this.isDragging = false;
      this.hasDragged = false;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.mouseMoveListener = this.renderer.listen('window', 'mousemove', (e: MouseEvent) => {
        this.handleGlobalMouseMove(e);
      });
      this.mouseUpListener = this.renderer.listen('window', 'mouseup', (e: MouseEvent) => {
        this.handleGlobalMouseUp(e);
      });
    }
  }

  onImageMouseMove(event: MouseEvent): void {}
  onImageMouseUp(event: MouseEvent): void {}

  handleGlobalMouseMove(event: MouseEvent): void {
    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;
    if (!this.isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      this.isDragging = true;
      this.hasDragged = true;
    }
    if (this.isDragging) {
      this.imageOffsetX += dx;
      this.imageOffsetY += dy;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.updateModalTransform();
    }
  }

  handleGlobalMouseUp(event: MouseEvent): void {
    this.removeGlobalListeners();
    this.isDragging = false;
  }

  removeGlobalListeners(): void {
    if (this.mouseMoveListener) {
      this.mouseMoveListener();
      this.mouseMoveListener = null;
    }
    if (this.mouseUpListener) {
      this.mouseUpListener();
      this.mouseUpListener = null;
    }
  }

  // --- Modal Zoom & Drag Methods (Touch) ---

  onImageTouchStart(event: TouchEvent): void {
    if (this.isZoomed && event.touches.length > 0) {
      event.preventDefault();
      this.isDragging = false;
      this.hasDragged = false;
      this.dragStartX = event.touches[0].clientX;
      this.dragStartY = event.touches[0].clientY;
      this.touchMoveListener = this.renderer.listen('window', 'touchmove', (e: TouchEvent) => {
        this.handleGlobalTouchMove(e);
      });
      this.touchEndListener = this.renderer.listen('window', 'touchend', (e: TouchEvent) => {
        this.handleGlobalTouchEnd(e);
      });
    }
  }

  onImageTouchMove(event: TouchEvent): void {}
  onImageTouchEnd(event: TouchEvent): void {}

  handleGlobalTouchMove(event: TouchEvent): void {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const dx = touch.clientX - this.dragStartX;
      const dy = touch.clientY - this.dragStartY;
      if (!this.isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        this.isDragging = true;
        this.hasDragged = true;
      }
      if (this.isDragging) {
        this.imageOffsetX += dx;
        this.imageOffsetY += dy;
        this.dragStartX = touch.clientX;
        this.dragStartY = touch.clientY;
        this.updateModalTransform();
      }
    }
  }

  handleGlobalTouchEnd(event: TouchEvent): void {
    this.removeTouchListeners();
    this.isDragging = false;
  }

  removeTouchListeners(): void {
    if (this.touchMoveListener) {
      this.touchMoveListener();
      this.touchMoveListener = null;
    }
    if (this.touchEndListener) {
      this.touchEndListener();
      this.touchEndListener = null;
    }
  }

  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
    if (this.isZoomed) {
      if (this.modalImage && this.modalImage.nativeElement) {
        const currentWidth = this.modalImage.nativeElement.offsetWidth;
        this.zoomScale = (currentWidth + 600) / currentWidth;
      } else {
        this.zoomScale = 2;
      }
    } else {
      this.zoomScale = 1;
      this.resetOffsets();
    }
    this.updateModalCursor();
    this.updateModalTransform();
  }

  resetOffsets(): void {
    this.imageOffsetX = 0;
    this.imageOffsetY = 0;
  }

  updateModalTransform(): void {
    if (this.modalImage && this.modalImage.nativeElement) {
      const transformValue = this.isZoomed
        ? `translate(calc(-50% + ${this.imageOffsetX}px), calc(-50% + ${this.imageOffsetY}px)) scale(${this.zoomScale})`
        : 'translate(-50%, -50%) scale(1)';
      this.renderer.setStyle(this.modalImage.nativeElement, 'transform', transformValue);
    }
  }

  updateModalCursor(): void {
    if (this.modalImage && this.modalImage.nativeElement) {
      const cursorStyle = this.isZoomed ? 'grab' : 'zoom-in';
      this.renderer.setStyle(this.modalImage.nativeElement, 'cursor', cursorStyle);
    }
  }

  // --- Specifications & Related Products Methods ---

  toggleSpecificationsView(): void {
    this.showAll = !this.showAll;
    this.displayedSpecifications = this.showAll 
      ? this.allSpecifications 
      : this.allSpecifications.slice(0, this.initialSpecificationCount);
  }

  goToProduct(productId: number): void {
    window.scrollTo(0, 0);
    this._router.navigate([`/p/${productId}`], { queryParamsHandling: 'merge' });
  }

  extractFirstFiveSpecifications(specs: { [key: string]: string | number | string[] | undefined }): { label: string; value: string }[] {
    const firstFive: { label: string; value: string }[] = [];
    let count = 0;
    for (const key in specs) {
      if (count >= 5) break;
      if (specs.hasOwnProperty(key)) {
        const value = specs[key];
        if (value !== undefined && value !== null && value !== '') {
          firstFive.push({ label: key, value: String(value) });
          count++;
        }
      }
    }
    return firstFive;
  }

  findRelatedProducts(): void {
    if (this.product && this.product.specifications) {
      // Get products from the same subcategory
      const subcategoryProducts = this.getSubcategoryProducts();
      
      if (subcategoryProducts.length > 0) {
        // Filter out the current product and products without specifications
        const availableProducts = subcategoryProducts.filter(otherProduct => 
          otherProduct.id !== this.product!.id && otherProduct.specifications
        );
        
        if (availableProducts.length > 0) {
          // Find products with similar specifications
          const relatedProductsWithCount = availableProducts.map(otherProduct => {
            const currentSpecs = this.product!.specifications;
            const otherSpecs = otherProduct.specifications || {};
            let matchingSpecCount = 0;
            for (const key in currentSpecs) {
              if (
                currentSpecs.hasOwnProperty(key) &&
                otherSpecs.hasOwnProperty(key) &&
                currentSpecs[key] === otherSpecs[key]
              ) {
                matchingSpecCount++;
              }
            }
            return { product: otherProduct, matchingSpecCount };
          })
          .filter(item => item.matchingSpecCount > 0);
          
          relatedProductsWithCount.sort((a, b) => b.matchingSpecCount - a.matchingSpecCount);
          this.relatedProducts = relatedProductsWithCount.slice(0, 3).map(item => item.product);
        } else {
          // If no products with specifications, just show other products from the same subcategory
          this.relatedProducts = availableProducts.slice(0, 3);
        }
      } else {
        // Fallback to original method if no subcategory products found
        const excludedProductIds = [1, 3, 4];
        const relatedProductsWithCount = this.productList
          .filter(otherProduct => {
            if (
              excludedProductIds.includes(otherProduct.id) ||
              otherProduct.id === this.product!.id ||
              !otherProduct.specifications
            ) {
              return false;
            }
            return true;
          })
          .map(otherProduct => {
            const currentSpecs = this.product!.specifications;
            const otherSpecs = otherProduct.specifications || {};
            let matchingSpecCount = 0;
            for (const key in currentSpecs) {
              if (
                currentSpecs.hasOwnProperty(key) &&
                otherSpecs.hasOwnProperty(key) &&
                currentSpecs[key] === otherSpecs[key]
              ) {
                matchingSpecCount++;
              }
            }
            return { product: otherProduct, matchingSpecCount };
          })
          .filter(item => item.matchingSpecCount > 0);
        relatedProductsWithCount.sort((a, b) => b.matchingSpecCount - a.matchingSpecCount);
        this.relatedProducts = relatedProductsWithCount.slice(0, 3).map(item => item.product);
      }
    }
  }

  private getSubcategoryProducts(): ProductListInterface[] {
    // Get the appropriate translation files based on language
    let productTranslations: any;
    
    switch (this.currentLang) {
      case 'mk':
        productTranslations = product_names_mk;
        break;
      case 'en':
        productTranslations = product_names_mk; // Use Macedonian as fallback for English
        break;
      case 'sr':
        productTranslations = product_names_sr;
        break;
      case 'al':
        productTranslations = product_names_al;
        break;
      default:
        productTranslations = product_names_mk;
        break;
    }

    // Get products based on subcategory (similar to subcategory component logic)
    const products: ProductListInterface[] = [];
    
    switch (this.subcategory) {
      case 'boilers':
        products.push(
          { id: 60, name: productTranslations['60'] || 'WATER HEATER TE80B20', pictures: ['assets/Home appliances/WATER HEATER TE80B20/1-BOLJER-01-800x450-1-500x375-1.png'], description: ['Water heater'], specifications: {} },
          { id: 58, name: productTranslations['58'] || 'WATER HEATER TE50B20', pictures: ['assets/Home appliances/WATER HEATER TE50B20/TE50B20-1024x576.png'], description: ['Water heater'], specifications: {} },
          { id: 59, name: productTranslations['59'] || 'WATER HEATER TE80A20', pictures: ['assets/Home appliances/WATER HEATER TE80A20/1-BOLJER-04-scaled-1-1024x576.png'], description: ['Water heater'], specifications: {} },
          { id: 57, name: productTranslations['57'] || 'WATER HEATER TE50A20', pictures: ['assets/Home appliances/WATER HEATER TE50A20/TE50A20-1024x576.png'], description: ['Water heater'], specifications: {} }
        );
        break;
      case 'washing-and-drying-machines':
        products.push(
          { id: 152, name: productTranslations['152'] || 'WASHING MACHINE A – 5100', pictures: ['assets/Home appliances/WASHING MACHINE A – 5100/MASINA-ZA-ALISTA-5100.png'], description: ['Washing machine'], specifications: {} },
          { id: 45, name: productTranslations['45'] || 'WASHING MACHINE L – 6100N', pictures: ['assets/Home appliances/WASHING MACHINE L – 6100N/L-6100-02-1-1024x576.png'], description: ['Washing machine'], specifications: {} },
          { id: 49, name: productTranslations['49'] || 'WASHING MACHINE W – 6101N', pictures: ['assets/Home appliances/WASHING MACHINE W – 6101N/W-6101-06-1024x576.png'], description: ['Washing machine'], specifications: {} },
          { id: 46, name: productTranslations['46'] || 'WASHING MACHINE L – 7101N', pictures: ['assets/Home appliances/WASHING MACHINE L – 7101N/W-7101-05-1024x576.png'], description: ['Washing machine'], specifications: {} },
          { id: 50, name: productTranslations['50'] || 'WASHING MACHINE W – 7122N', pictures: ['assets/Home appliances/WASHING MACHINE W – 7122N/W-7122-06-1024x576.png'], description: ['Washing machine'], specifications: {} },
          { id: 47, name: productTranslations['47'] || 'WASHING MACHINE L – 8101', pictures: ['assets/Home appliances/WASHING MACHINE L – 8101/W-8101-05-1024x576.png'], description: ['Washing machine'], specifications: {} },
          { id: 48, name: productTranslations['48'] || 'WASHING MACHINE L – 9101N', pictures: ['assets/Home appliances/WASHING MACHINE L – 9101N/W-9101-05-1024x576.png'], description: ['Washing machine'], specifications: {} },
          { id: 51, name: productTranslations['51'] || 'WASHING MACHINE W – 7122N BLDC', pictures: ['assets/Home appliances/WASHING MACHINE W – 7122N BLDC/W-7122-BLDC-06-1024x576.png'], description: ['Washing machine'], specifications: {} },
          { id: 53, name: productTranslations['53'] || 'WASHING MACHINE W – 8122N BLDC', pictures: ['assets/Home appliances/WASHING MACHINE W – 8122N BLDC/W-8122-BLDC-06-1024x576.png'], description: ['Washing machine'], specifications: {} },
          { id: 56, name: productTranslations['56'] || 'WASHING MACHINE W-9122N BLDC', pictures: ['assets/Home appliances/WASHING MACHINE W-9122N BLDC/W-9122-BLDC-06-1024x576.png'], description: ['Washing machine'], specifications: {} },
          { id: 55, name: productTranslations['55'] || 'WASHING MACHINE W – 9142ТN BLDC', pictures: ['assets/Home appliances/WASHING MACHINE W – 9142ТN BLDC/W-9142-BLDC-06-1024x576.png'], description: ['Washing machine'], specifications: {} },
          { id: 19, name: productTranslations['19'] || 'Dryer L – 71 C', pictures: ['assets/Home appliances/Dryer L – 71 C/DRYER-L-71-C-01-1024x576.png'], description: ['Dryer'], specifications: {} },
          { id: 21, name: productTranslations['21'] || 'Dryer W – 72 C', pictures: ['assets/Home appliances/Dryer W – 72 C/DRYER-W-72-C-01-1024x576.png'], description: ['Dryer'], specifications: {} },
          { id: 20, name: productTranslations['20'] || 'Dryer L – 81 C', pictures: ['assets/Home appliances/Dryer L – 81 C/DRYER-L-81-C-01-1024x576.png'], description: ['Dryer'], specifications: {} },
          { id: 22, name: productTranslations['22'] || 'Dryer W – 82 HP', pictures: ['assets/Home appliances/Dryer W – 82 HP/DRYER-W-82-HP-01-1024x576.png'], description: ['Dryer'], specifications: {} }
        );
        break;
      case 'built-in-dishwashers':
        products.push(
          { id: 63, name: productTranslations['63'] || 'Built-in dishwasher BI45-I1E', pictures: ['assets/Built In Appliances/Built-in dishwasher BI45-I1E (fully integrated)/BI-45-I1E-08-1024x576.png'], description: ['Built-in dishwasher'], specifications: {} },
          { id: 64, name: productTranslations['64'] || 'Built-in dishwasher SI60 – I14N', pictures: ['assets/Built In Appliances/Built-in dishwasher BI60 – I14 (fully integrated)/SI60-I14-11-1024x576.png'], description: ['Built-in dishwasher'], specifications: {} },
          { id: 65, name: productTranslations['65'] || 'Built-in dishwasher BI60 – I14N', pictures: ['assets/Built In Appliances/Built-in dishwasher FAVORIT BI60-I1FN/RABOTEN-16.9-29-2-1024x576.png'], description: ['Built-in dishwasher'], specifications: {} },
          { id: 66, name: productTranslations['66'] || 'Built-in dishwasher SI60 – I14', pictures: ['assets/Built In Appliances/Built-in dishwasher SI60 – I14/BI60-I14-02-1024x576.png'], description: ['Built-in dishwasher'], specifications: {} }
        );
        break;
      case 'stoves-and-mini-stoves':
        products.push(
          { id: 24, name: productTranslations['24'] || 'Electric Cooker EC 640 WWFT', pictures: ['assets/Home appliances/Electric Freestanding Cooker EC 640 WWFT/FAVORIT-EC-640-WWFT-10-scaled (1).png'], description: ['Electric cooker'], specifications: {} },
          { id: 7, name: productTranslations['7'] || 'Combined Cooker К 622 WWFT', pictures: ['assets/Home appliances/COMBINED FREESTANDING COOKERS К 622 WWFT/FAVORIT-K-622-WWFT-10-1-1024x576.png'], description: ['Combined cooker'], specifications: {} },
          { id: 23, name: productTranslations['23'] || 'Electric Cooker EC 640 WWF', pictures: ['assets/Home appliances/Electric Freestanding Cooker EC 640 WWF/FAVORIT-EC-640-WWF-10-1024x576.png'], description: ['Electric cooker'], specifications: {} },
          { id: 27, name: productTranslations['27'] || 'ELECTRIC COOKER EC 640 SF', pictures: ['assets/Home appliances/ELECTRIC INDEPENDENT COOKER EC 640 SF/FAVORIT-EC-640-SF-10-1024x576.png'], description: ['Electric cooker'], specifications: {} },
          { id: 9, name: productTranslations['9'] || 'COMBINED COOKER K 622 SF', pictures: ['assets/Home appliances/COMBINED INDEPENDENT COOKER К 622 SF/FAVORIT-K-622-SF-10-1-1024x576.png'], description: ['Combined cooker'], specifications: {} },
          { id: 10, name: productTranslations['10'] || 'COMBINED COOKER К 622 WWF', pictures: ['assets/Home appliances/COMBINED INDEPENDENT COOKER К 622 WWF/FAVORIT-K-622-WWF-10-1-1024x576.png'], description: ['Combined cooker'], specifications: {} },
          { id: 26, name: productTranslations['26'] || 'Electric Independent Cooker EC 540 WWFT', pictures: ['assets/Home appliances/Electric Independent Cooker EC 540 WWFT/FAVORIT-EC-540-WWFT-10-1024x576.png'], description: ['Electric cooker'], specifications: {} },
          { id: 25, name: productTranslations['25'] || 'Electric Independent Cooker EC 540 SF', pictures: ['assets/Home appliances/Electric Independent Cooker EC 540 SF/FAVORIT-EC-540-SF-10-1024x576.png'], description: ['Electric cooker'], specifications: {} },
          { id: 32, name: productTranslations['32'] || 'GLASS-CERAMIC COOKER CC 600 WWF', pictures: ['assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 600 WWF/FAVORIT-CC-600-WWF-10-1-1024x576.png'], description: ['Glass-ceramic cooker'], specifications: {} },
          { id: 31, name: productTranslations['31'] || 'GLASS-CERAMIC COOKER CC 600 SF', pictures: ['assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 600 SF/FAVORIT-CC-600-SF-10-1-1024x576.png'], description: ['Glass-ceramic cooker'], specifications: {} },
          { id: 30, name: productTranslations['30'] || 'GLASS-CERAMIC COOKER CC 600 IF', pictures: ['assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 600 IF/FAVORIT-CC-600-IF-10-1-1024x576.png'], description: ['Glass-ceramic cooker'], specifications: {} },
          { id: 29, name: productTranslations['29'] || 'GLASS-CERAMIC COOKER CC 500 WWF', pictures: ['assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 500 WWF/FAVORIT-CC-500-WWF-10-1-1024x576.png'], description: ['Glass-ceramic cooker'], specifications: {} },
          { id: 28, name: productTranslations['28'] || 'GLASS-CERAMIC COOKER CC 500 SF', pictures: ['assets/Home appliances/GLASS-CERAMIC INDEPENDENT COOKER CC 500 SF/FAVORIT-CC-500-SF-10-1-1024x576.png'], description: ['Glass-ceramic cooker'], specifications: {} },
          { id: 8, name: productTranslations['8'] || 'MINI STOVE MO-42W', pictures: ['assets/Home appliances/MINI STOVE MO-42W/FAVORIT-MO-42W-10-1-1024x576.png'], description: ['Mini stove'], specifications: {} },
          { id: 37, name: productTranslations['37'] || 'MINI STOVE MO-42B', pictures: ['assets/Home appliances/MINI STOVE MO-42B/FAVORIT-MO-42B-10-1-1024x576.png'], description: ['Mini stove'], specifications: {} }
        );
        break;
      case 'dishwashers':
        products.push(
          { id: 17, name: productTranslations['17'] || 'Dishwasher F45 – Y15N S', pictures: ['assets/Home appliances/Dishwasher F45 – Y15N S/F45-Y15 S-04.png'], description: ['Dishwasher'], specifications: {} },
          { id: 18, name: productTranslations['18'] || 'Dishwasher F60 – Y14N', pictures: ['assets/Home appliances/Dishwasher F60 – Y14N/F60-Y14-04-1024x576.png'], description: ['Dishwasher'], specifications: {} },
          { id: 135, name: productTranslations['135'] || 'Dishwasher F60 – Y14N S', pictures: ['assets/Home appliances/Dishwasher F60 – Y14N S/F60-Y14_S-04.png'], description: ['Dishwasher'], specifications: {} },
          { id: 15, name: productTranslations['15'] || 'Dishwasher E60-A1FN', pictures: ['assets/Home appliances/Dishwasher E60-A1FN/E60-A1FN-04-1024x576.png'], description: ['Dishwasher'], specifications: {} },
          { id: 136, name: productTranslations['136'] || 'Dishwasher E60-A1FN X', pictures: ['assets/Home appliances/Dishwasher E60-A1FN X/E60-A1FN-X-04.png'], description: ['Dishwasher'], specifications: {} },
          { id: 14, name: productTranslations['14'] || 'Dishwasher E60 – A22', pictures: ['assets/Home appliances/Dishwasher E60 – A22/E60-A22-04-1024x576.png'], description: ['Dishwasher'], specifications: {} },
          { id: 16, name: productTranslations['16'] || 'DISHWASHER E60-A24N BLDC', pictures: ['assets/Home appliances/DISHWASHER E60-A24N BLDC/E60-A24N-BLDC-04-1024x576.png'], description: ['Dishwasher'], specifications: {} }
        );
        break;
      case 'fridges-and-freezers':
        products.push(
          { id: 38, name: productTranslations['38'] || 'REFRIGERATOR WITH CHAMBER R1001N', pictures: ['assets/Home appliances/REFRIGERATOR WITH CHAMBER R1001N/FAVORIT-R-1001-01-1024x576.png'], description: ['Refrigerator'], specifications: {} },
          { id: 39, name: productTranslations['39'] || 'REFRIGERATOR WITHOUT CHAMBER L1002E', pictures: ['assets/Home appliances/REFRIGERATOR WITHOUT CHAMBER L1002N/FAVORIT-L-1002-01-1024x576.png'], description: ['Refrigerator'], specifications: {} },
          { id: 40, name: productTranslations['40'] || 'REFRIGERATOR WITHOUT CHAMBER L2653E', pictures: ['assets/Home appliances/REFRIGERATOR WITHOUT CHAMBER L2653E/FAVORIT-L-2653-01-1024x576.png'], description: ['Refrigerator'], specifications: {} },
          { id: 41, name: productTranslations['41'] || 'VERTICAL FREEZER F2451E', pictures: ['assets/Home appliances/VERTICAL FREEZER F2451E/FAVORIT-F-2451-01-1024x576.png'], description: ['Freezer'], specifications: {} },
          { id: 42, name: productTranslations['42'] || 'VERTICAL FREEZER F1005E', pictures: ['assets/Home appliances/VERTICAL FREEZER F1005E/FAVORIT-F-1005-01-1024x576.png'], description: ['Freezer'], specifications: {} },
          { id: 43, name: productTranslations['43'] || 'VERTICAL FREEZER F2451N', pictures: ['assets/Home appliances/VERTICAL FREEZER F2451N/FAVORIT-F-2451-01-1024x576.png'], description: ['Freezer'], specifications: {} },
          { id: 11, name: productTranslations['11'] || 'COMBINED REFRIGERATOR CF 278E', pictures: ['assets/Home appliances/COMBINED REFRIGERATOR CF 278N/FAVORIT-CF-278-01-1024x576.png'], description: ['Combined refrigerator'], specifications: {} },
          { id: 12, name: productTranslations['12'] || 'COMBINED REFRIGERATOR CF 374E', pictures: ['assets/Home appliances/COMBINED REFRIGERATOR CF 374N/FAVORIT-CF-374-01-1024x576.png'], description: ['Combined refrigerator'], specifications: {} },
          { id: 13, name: productTranslations['13'] || 'COMBINED REFRIGERATOR NF 379E', pictures: ['assets/Home appliances/COMBINED REFRIGERATOR NF 379N – NO FROST without dispensary/FAVORIT-NF-379-01-1024x576.png'], description: ['Combined refrigerator'], specifications: {} },
          { id: 33, name: productTranslations['33'] || 'HCF 150', pictures: ['assets/Home appliances/HCF 150/HCF-150-01-1024x576.png'], description: ['Horizontal freezer'], specifications: {} },
          { id: 34, name: productTranslations['34'] || 'HCF 200', pictures: ['assets/Home appliances/HCF 200/HCF-200-01-1024x576.png'], description: ['Horizontal freezer'], specifications: {} },
          { id: 35, name: productTranslations['35'] || 'HCF 300', pictures: ['assets/Home appliances/HCF 300/HCF-300-01-1024x576.png'], description: ['Horizontal freezer'], specifications: {} },
          { id: 36, name: productTranslations['36'] || 'HCF 400', pictures: ['assets/Home appliances/HCF 400/HCF-400-01-1024x576.png'], description: ['Horizontal freezer'], specifications: {} }
        );
        break;
      // Add more cases for other subcategories as needed
      default:
        // Return empty array if subcategory not found
        break;
    }
    
    return products;
  }

  getEnglishName(): string {
    if (this.specificationTranslations === specificationTranslations_en) {
      return this.product!.name;
    } else {
      const englishProduct = productList_en.find((prod: { id: number; }) => prod.id === this.product!.id);
      return englishProduct ? englishProduct.name : this.product!.name;
    }
  }

  onImageClickHandler(): void {
    this.onImageClick();
  }

  goBack(): void {
    this._location.back();
  }
}
