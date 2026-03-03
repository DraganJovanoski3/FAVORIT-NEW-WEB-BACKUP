import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/supabase.service';
import { HomeAppliancesProductsService } from '../../core/home-appliances-products.service';
import { WarrantySubmission } from '../../warranty/warranty.model';

import warranty_check_en from './warranty_check_en.json';
import warranty_check_mk from './warranty_check_mk.json';
import warranty_check_al from './warranty_check_al.json';
import warranty_check_sr from './warranty_check_sr.json';

const TEXTS: Record<string, any> = {
  en: warranty_check_en,
  mk: warranty_check_mk,
  al: warranty_check_al,
  sr: warranty_check_sr
};

@Component({
  selector: 'app-admin-warranty-check',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-warranty-check.component.html',
  styleUrls: ['./admin-warranty-check.component.css']
})
export class AdminWarrantyCheckComponent implements OnInit {
  t: any = warranty_check_en;
  currentLang = 'en';
  searchType: 'serial' | 'email' = 'serial';
  searchValue = '';
  results: WarrantySubmission[] = [];
  loading = false;
  searched = false;

  filterName = '';
  filterDeviceModel = '';
  filterCity = '';
  filterCityOfPurchase = '';
  filterPurchaseDateFrom = '';
  filterPurchaseDateTo = '';
  filterRegisteredFrom = '';
  filterRegisteredTo = '';
  showFilters = false;
  modelOptions: string[] = [];
  loadingModels = false;

  constructor(
    private supabase: SupabaseService,
    private homeAppliances: HomeAppliancesProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const lang = params.get('lang') || 'en';
      const newLang = ['mk', 'en', 'sr', 'al'].includes(lang) ? lang : 'en';
      if (this.currentLang !== newLang) this.modelOptions = []; // reload model list when language changes
      this.currentLang = newLang;
      this.t = TEXTS[this.currentLang] || warranty_check_en;
    });
  }

  loadModelOptions(): void {
    if (this.modelOptions.length > 0) return;
    this.loadingModels = false;
    const lang = this.currentLang || 'en';
    const fromCatalog = this.homeAppliances.getProducts(lang).map(p => p.name.trim()).filter(Boolean);
    this.modelOptions = [...new Set(fromCatalog)].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }

  get filteredModelList(): string[] {
    const q = (this.filterDeviceModel || '').trim().toLowerCase();
    if (!q) return this.modelOptions.slice(0, 80);
    return this.modelOptions.filter(m => m.toLowerCase().includes(q)).slice(0, 80);
  }

  selectModel(model: string): void {
    this.filterDeviceModel = model;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (this.showFilters) this.loadModelOptions();
  }

  onSearch(): void {
    const v = (this.searchValue || '').trim();
    if (!v) return;
    this.loading = true;
    this.searched = true;
    this.results = [];
    const promise = this.searchType === 'serial'
      ? this.supabase.searchWarrantyBySerial(v)
      : this.supabase.searchWarrantyByEmail(v);
    promise.then(data => {
      this.results = data;
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  loadAll(): void {
    this.loading = true;
    this.searched = true;
    this.supabase.getAllWarrantySubmissions(500).then(data => {
      this.results = data;
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  applyFilters(): void {
    this.loading = true;
    this.searched = true;
    const filters: any = {};
    if (this.searchType === 'serial' && this.searchValue?.trim()) filters.serial = this.searchValue.trim();
    if (this.searchType === 'email' && this.searchValue?.trim()) filters.email = this.searchValue.trim();
    if (this.filterName?.trim()) filters.name = this.filterName.trim();
    if (this.filterDeviceModel?.trim()) filters.device_model = this.filterDeviceModel.trim();
    if (this.filterCity?.trim()) filters.city = this.filterCity.trim();
    if (this.filterCityOfPurchase?.trim()) filters.city_of_purchase = this.filterCityOfPurchase.trim();
    if (this.filterPurchaseDateFrom) filters.purchase_date_from = this.filterPurchaseDateFrom;
    if (this.filterPurchaseDateTo) filters.purchase_date_to = this.filterPurchaseDateTo;
    if (this.filterRegisteredFrom) filters.registered_from = this.filterRegisteredFrom + 'T00:00:00.000Z';
    if (this.filterRegisteredTo) filters.registered_to = this.filterRegisteredTo + 'T23:59:59.999Z';
    this.supabase.searchWarrantyWithFilters(filters, 500).then(data => {
      this.results = data;
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  clearFilters(): void {
    this.searchValue = '';
    this.filterName = '';
    this.filterDeviceModel = '';
    this.filterCity = '';
    this.filterCityOfPurchase = '';
    this.filterPurchaseDateFrom = '';
    this.filterPurchaseDateTo = '';
    this.filterRegisteredFrom = '';
    this.filterRegisteredTo = '';
    this.results = [];
    this.searched = false;
  }

  signOut(): void {
    this.supabase.signOut();
    this.router.navigate(['/admin/login']);
  }

  /** Format as day, month, year (DD.MM.YYYY). Parses date-only (YYYY-MM-DD) as local to avoid timezone shift. */
  formatDate(d: string | undefined): string {
    if (!d) return '—';
    try {
      const match = String(d).match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const [, y, m, day] = match;
        return `${day}.${m}.${y}`;
      }
      const date = new Date(d);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    } catch {
      return d;
    }
  }

  /** Format as day, month, year and time (DD.MM.YYYY, HH:mm). */
  formatDateTime(d: string | undefined): string {
    if (!d) return '—';
    try {
      const date = new Date(d);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}.${month}.${year}, ${hours}:${minutes}`;
    } catch {
      return d;
    }
  }

  getDeviceTypeLabel(value: string | undefined): string {
    if (!value) return '';
    const map = this.t?.deviceTypes;
    return (map && map[value]) ? map[value] : value;
  }
}
