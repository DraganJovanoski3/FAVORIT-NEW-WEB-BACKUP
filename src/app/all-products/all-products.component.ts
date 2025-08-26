import {CommonModule} from '@angular/common';
import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatCardModule,} from '@angular/material/card';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import all_products_mk from './all_products_mk.json'
import all_products_en from './all_products_en.json'
import all_products_sr from './all_products_sr.json'
import all_products_al from './all_products_al.json'
import {identifierName} from '@angular/compiler';

export interface Product {
  id: number,
  name: string;
  picture: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatCardModule, FormsModule, MatIconModule],
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
  searchText: any;
  allProductsComponentConstant: any;

  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute) {
                this._router.events.subscribe(event => {
                  if (event instanceof NavigationStart) {
                    window.scrollTo(0, 0);
                  }
                });
  }

  displayedColumns: string[] = ['name', 'picture'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  products: Product[] = [];
  displayedProducts: Product[] = [];

  pageSize = 12;
  pageSizeOptions: number[] = [12, 24, 48, 64, 128];

  categories: any;

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


  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe(params => {
      const lang = params.get('lang');
      switch (lang) {
        case 'mk' :
          this.allProductsComponentConstant = all_products_mk;
          this.categories = [
            {
              name: this.allProductsComponentConstant.category.homeAppliances,
              image: 'assets/category-for-products/kategorija-bela-tehnika.jpg',
              category: 'home-appliances',
              subcategory: ''
            },
            {
              name: this.allProductsComponentConstant.category.buildInAppliances,
              image: 'assets/category-for-products/kategorija-vgradni.jpg',
              category: 'built-in-appliances',
              subcategory: ''
            },
            {
              name: this.allProductsComponentConstant.category.airConditioners,
              image: 'assets/category-for-products/kategorija-klima-uredi.jpg',
              category: 'air-conditioners',
              subcategory: ''
            },
            {
              name: this.allProductsComponentConstant.category.televisions,
              image: 'assets/category-for-products/kategorija-tv.jpg',
              category: 'televisions',
              subcategory: ''
            },
            {
              name: this.allProductsComponentConstant.category.hoods,
              image: 'assets/category-for-products/kategorija-apiratori.jpg',
              category: 'hoods',
              subcategory: 'Cornner hoods'
            },
            {
              name: this.allProductsComponentConstant.category.smallDomesticAppliances,
              image: 'assets/category-for-products/kategorija-mali-proizvodi.jpg',
              category: 'small-domestic-appliances',
              subcategory: ''
            },
          ]
          break;
        case 'en' :
          this.allProductsComponentConstant = all_products_en;
          this.categories = [
            {
              name: this.allProductsComponentConstant.category.homeAppliances,
              image: 'assets/category-for-products/kategorija-bela-tehnika.jpg',
              category: 'home-appliances',
              subcategory: ''
            },
            {
              name: this.allProductsComponentConstant.category.buildInAppliances,
              image: 'assets/category-for-products/kategorija-vgradni.jpg',
              category: 'built-in-appliances',
              subcategory: ''
            },
            {
              name: this.allProductsComponentConstant.category.airConditioners, 
              image: 'assets/category-for-products/kategorija-klima-uredi.jpg',
              category: 'air-conditioners'
            },
            {
              name: this.allProductsComponentConstant.category.televisions,
              image: 'assets/category-for-products/kategorija-tv.jpg',
              category: 'televisions',
              subcategory: ''
            },
            {
              name: this.allProductsComponentConstant.category.hoods, 
              image: 'assets/category-for-products/kategorija-apiratori.jpg',
              category: 'hoods',
            },
            {
              name: this.allProductsComponentConstant.category.smallDomesticAppliances,
              image: 'assets/category-for-products/kategorija-mali-proizvodi.jpg',
              category: 'small-domestic-appliances',
              subcategory: ''
            }
          ]
          break;
        case 'sr' :
          this.allProductsComponentConstant = all_products_sr;
          this.categories = [
            {
              name: this.allProductsComponentConstant.category.homeAppliances, 
              image: 'assets/category-for-products/kategorija-bela-tehnika.jpg',
              category: 'home-appliances'
            },
            {
              name: this.allProductsComponentConstant.category.buildInAppliances,
              image: 'assets/category-for-products/kategorija-vgradni.jpg',
              category: 'built-in-appliances'
            },
            {name: this.allProductsComponentConstant.category.airConditioners, 
              image: 'assets/category-for-products/kategorija-klima-uredi.jpg',
              category: 'air-conditioners'
            },
            {
              name: this.allProductsComponentConstant.category.televisions, 
              image: 'assets/category-for-products/kategorija-tv.jpg',
              category: 'televisions'
            },
            {
              name: this.allProductsComponentConstant.category.hoods, 
              image: 'assets/category-for-products/kategorija-apiratori.jpg',
              category: 'hoods'
            },
            {
              name: this.allProductsComponentConstant.category.smallDomesticAppliances,
              image: 'assets/category-for-products/kategorija-mali-proizvodi.jpg',
              category: 'small-domestic-appliances'
            },
          ]
          break;
        case 'al' :
          this.allProductsComponentConstant = all_products_al;
          this.categories = [
            {
              name: this.allProductsComponentConstant.category.homeAppliances, 
              image: 'assets/category-for-products/kategorija-bela-tehnika.jpg',
              category: 'home-appliances'
            },
            {
              name: this.allProductsComponentConstant.category.buildInAppliances,
              image: 'assets/category-for-products/kategorija-vgradni.jpg',
              category: 'built-in-appliances'
            },
            {
              name: this.allProductsComponentConstant.category.airConditioners, 
              image: 'assets/category-for-products/kategorija-klima-uredi.jpg',
              category: 'air-conditioners'
            },
            {
              name: this.allProductsComponentConstant.category.televisions, 
              image: 'assets/category-for-products/kategorija-tv.jpg',
              category: 'televisions'
            },
            {
              name: this.allProductsComponentConstant.category.hoods, 
              image: 'assets/category-for-products/kategorija-apiratori.jpg',
              category: 'hoods'
            },
            {
              name: this.allProductsComponentConstant.category.smallDomesticAppliances,
              image: 'assets/category-for-products/kategorija-mali-proizvodi.jpg',
              category: 'small-domestic-appliances'
            }
          ]
          break;
      }
    });
  }

}
