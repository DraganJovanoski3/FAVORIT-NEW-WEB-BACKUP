import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from "@angular/core"; 
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { combineLatest } from "rxjs";
import { CommonModule } from "@angular/common";

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

interface ProductListInterface {
  id: number;
  name: string;
  pictures: string[];
  description: string[];
  specifications?: { [key: string]: string };
  specificationsDoc?: string;
  discount?: string;
  originalPrice?: number;
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
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    combineLatest([this._route.params, this._route.queryParams]).subscribe(([params, queryParams]) => {
      // Extract category and subcategory from route parameters
      this.category = params['category'] || '';
      this.subcategory = params['subcategory'] || '';
      this.productId = +params['productId'];
      this.currentLang = queryParams['lang'] || 'en';

      // Set product list and specification translations based on language
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

      // Setup breadcrumbs only if the product exists.
      if (this.product) {
        this.setupBreadcrumbs();
      }

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
    this.breadcrumbs = [
      { label: this.getTranslatedNameBread('Home'), url: '/' },
      { label: this.getTranslatedNameBread(this.category, true), url: `/category/${this.category}` },
      { label: this.getTranslatedNameBread(this.subcategory), url: `/category/${this.category}/subcategory/${this.subcategory}` },
      { label: this.product?.name || '', url: '' } // Product name (no link)
    ];
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
    this._router.navigate(['/product', productId]);
  }

  extractFirstFiveSpecifications(specs: { [key: string]: string }): { label: string; value: string }[] {
    const firstFive: { label: string; value: string }[] = [];
    let count = 0;
    for (const key in specs) {
      if (count >= 5) break;
      if (specs.hasOwnProperty(key)) {
        firstFive.push({ label: key, value: specs[key] });
        count++;
      }
    }
    return firstFive;
  }

  findRelatedProducts(): void {
    if (this.product && this.product.specifications) {
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
}
