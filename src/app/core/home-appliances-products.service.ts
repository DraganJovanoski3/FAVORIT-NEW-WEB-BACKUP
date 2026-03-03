import { Injectable } from '@angular/core';

import product_names_mk from '../subcategory/product_names_mk.json';
import product_names_en from '../subcategory/product_names_en.json';
import product_names_al from '../subcategory/product_names_al.json';
import product_names_sr from '../subcategory/product_names_sr.json';

import subcategories_mk from '../subcategory/subcategories_mk_new.json';
import subcategories_en from '../subcategory/subcategories_en_new.json';
import subcategories_al from '../subcategory/subcategories_al_new.json';
import subcategories_sr from '../subcategory/subcategories_sr_new.json';

import filter_subcategory_mk from '../subcategory/filter_subcategory_mk.json';
import filter_subcategory_en from '../subcategory/filter_subcategory_en.json';
import filter_subcategory_al from '../subcategory/filter_subcategory_al.json';
import filter_subcategory_sr from '../subcategory/filter_subcategory_sr.json';

import all_products_mk from '../all-products/all_products_mk.json';
import all_products_en from '../all-products/all_products_en.json';
import all_products_al from '../all-products/all_products_al.json';
import all_products_sr from '../all-products/all_products_sr.json';

export interface WarrantyProductOption {
  id: number;
  name: string;
  subcategory: string;
}

@Injectable({
  providedIn: 'root'
})
export class HomeAppliancesProductsService {

  getCategoryName(lang: string): string {
    const cat = lang === 'mk' ? all_products_mk.category : lang === 'sr' ? all_products_sr.category : lang === 'al' ? all_products_al.category : all_products_en.category;
    return (cat as any).homeAppliances || 'Home Appliances';
  }

  /** Full product list (used e.g. by admin warranty check). */
  getProducts(lang: string): WarrantyProductOption[] {
    const { list } = this.buildProductLists(lang);
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Products eligible for warranty registration: built-in appliances, freestanding cookers, washing machines, dryers, dishwashers, refrigerators, freezers. */
  getWarrantyProducts(lang: string): WarrantyProductOption[] {
    const { warrantyList } = this.buildProductLists(lang);
    return warrantyList.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Builds full product list and warranty-eligible list.
   * To add a new product to the warranty form Device Model search:
   * 1. Add the product id to the correct category array below with push(id, label, true).
   * 2. Add the product name in product_names_mk.json, product_names_en.json, product_names_sr.json, product_names_al.json (key = id as string).
   * For new categories: use the right label from filterSubcategory (e.g. filterSubcategory.homeAppliances.xxx or builtIn.builtInXxx).
   */
  private buildProductLists(lang: string): { list: WarrantyProductOption[]; warrantyList: WarrantyProductOption[] } {
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
        productTranslations = product_names_en;
        subcategoriesComponentConstant = subcategories_en;
        filterSubcategory = filter_subcategory_en;
    }

    const list: WarrantyProductOption[] = [];
    const warrantyList: WarrantyProductOption[] = [];
    const push = (id: number, subcategory: string, forWarranty: boolean) => {
      const item = { id, name: productTranslations[String(id)] || String(id), subcategory };
      list.push(item);
      if (forWarranty) warrantyList.push(item);
    };

    const boilersLabel = subcategoriesComponentConstant.homeAppliances.boilers;
    [60, 58, 59, 57].forEach(id => push(id, boilersLabel, false));

    const washingLabel = filterSubcategory.homeAppliances.washingMachines;
    const dryerLabel = filterSubcategory.homeAppliances.dryers;
    [174, 173, 172, 152, 45, 44, 49, 46, 50, 47, 48, 51, 52, 154, 53, 155, 56, 55, 160, 186, 188, 187].forEach(id => push(id, washingLabel, true));
    [19, 161, 21, 20, 22, 191, 189, 190].forEach(id => push(id, dryerLabel, true));

    const fridgeLabel = filterSubcategory.homeAppliances.fridges;
    const verticalFreezerLabel = filterSubcategory.homeAppliances.verticalFreezers;
    const horizontalFreezerLabel = filterSubcategory.homeAppliances.horizontalFreezers;
    [38, 39, 40, 11, 12, 13, 137, 139, 140, 141, 175, 176, 178, 179, 180, 181, 182, 183, 184].forEach(id => push(id, fridgeLabel, true));
    [41, 42, 43, 138, 177].forEach(id => push(id, verticalFreezerLabel, true));
    [33, 34, 35, 36, 151].forEach(id => push(id, horizontalFreezerLabel, true));

    const dishwashersLabel = filterSubcategory.homeAppliances.dishwashers;
    [142, 171, 170, 169, 168, 165, 164, 17, 18, 135, 15, 136].forEach(id => push(id, dishwashersLabel, true));

    const stovesLabel = filterSubcategory.homeAppliances.stoves;
    const stovesGlassLabel = filterSubcategory.homeAppliances.stovesGlassLabel;
    const miniStovesLabel = filterSubcategory.homeAppliances.miniStoves;
    [24, 7, 23, 27, 9, 26, 25, 10].forEach(id => push(id, stovesLabel, true));
    [32, 31, 30, 29, 28].forEach(id => push(id, stovesGlassLabel, true));
    [8, 37].forEach(id => push(id, miniStovesLabel, false));

    const builtIn = filterSubcategory.builtInAppliances || {};
    const builtInDishwashersLabel = builtIn.builtInDishwashers || 'Built-In Dishwashers';
    const builtInOvensLabel = builtIn.builtInOvens || builtIn.builtInCookingAppliences || 'Built-In Cooking Appliances';
    const builtInStovesAndTopsLabel = builtIn.builtInStovesAndTops || 'Built-In Stove With Stove Tops';
    const builtInStoveTopsLabel = builtIn.builtInStoveTops || 'Built-In Stove Tops';
    const builtInFridgesLabel = builtIn.builtInFridges || 'Built-In Refrigerators';
    [167, 166, 63, 64, 65, 162].forEach(id => push(id, builtInDishwashersLabel, true));
    [70, 153, 71, 72, 73, 163].forEach(id => push(id, builtInOvensLabel, true)); // 163 = Built-in oven with stove top S 70MTB-40
    [77, 78, 67].forEach(id => push(id, builtInStoveTopsLabel, true));
    [74, 150, 75, 76, 185].forEach(id => push(id, builtInFridgesLabel, true));

    return { list, warrantyList };
  }
}
