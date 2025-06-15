import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private subcategoriesSource = new BehaviorSubject<string[]>([]);
  currentSubcategories = this.subcategoriesSource.asObservable();

  private categorySource = new BehaviorSubject<string>('');
  currentCategory = this.categorySource.asObservable();

  private subcategorySource = new BehaviorSubject<string>('');
  currentSubcategory = this.subcategorySource.asObservable();

  constructor() { }

  changeSubcategories(subcategories: string[]) {
    this.subcategoriesSource.next(subcategories);
  }

  changeCategory(category: string) {
    this.categorySource.next(category);
  }

  changeSubcategory(subcategory: string) {
    this.subcategorySource.next(subcategory);
  }
}
