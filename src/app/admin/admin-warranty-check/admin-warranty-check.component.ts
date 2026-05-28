import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/supabase.service';
import { HomeAppliancesProductsService } from '../../core/home-appliances-products.service';
import { WarrantySubmission } from '../../warranty/warranty.model';
import { environment } from '../../../environments/environment';

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
  searchType: 'serial' | 'email' | 'phone' = 'serial';
  searchValue = '';
  results: WarrantySubmission[] = [];
  loading = false;
  searched = false;
  downloadingCsv = false;

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

  /** Edit modal state */
  editingSubmission: WarrantySubmission | null = null;
  editForm: Partial<WarrantySubmission> = {};
  savingEdit = false;
  editMessage = '';
  editSuccess = false;

  /** True only for the super admin email – only they see the Edit button. */
  canEditWarranty = false;

  constructor(
    private supabase: SupabaseService,
    private homeAppliances: HomeAppliancesProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const superAdmin = (environment as { superAdminEmail?: string }).superAdminEmail;
    if (superAdmin) {
      this.supabase.getCurrentUserEmail().then(email => {
        this.canEditWarranty = (email?.toLowerCase() === superAdmin.toLowerCase());
      });
    }
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
    let promise: Promise<WarrantySubmission[]>;
    if (this.searchType === 'serial') promise = this.supabase.searchWarrantyBySerial(v);
    else if (this.searchType === 'phone') promise = this.supabase.searchWarrantyByPhone(v);
    else promise = this.supabase.searchWarrantyByEmail(v);
    promise!.then(data => {
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
    if (this.searchType === 'phone' && this.searchValue?.trim()) filters.phone = this.searchValue.trim();
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

  openEdit(r: WarrantySubmission): void {
    if (!r?.id) return;
    this.editingSubmission = r;
    this.editForm = {
      first_name: r.first_name ?? '',
      last_name: r.last_name ?? '',
      address: r.address ?? '',
      city: r.city ?? '',
      postal_code: r.postal_code ?? '',
      phone: r.phone ?? '',
      email: r.email ?? '',
      device_type: r.device_type ?? '',
      device_model: r.device_model ?? r.product_name ?? '',
      serial_number: r.serial_number ?? '',
      purchase_date: r.purchase_date ? String(r.purchase_date).slice(0, 10) : '',
      place_of_purchase: r.place_of_purchase ?? r.purchase_place ?? '',
      city_of_purchase: r.city_of_purchase ?? '',
      fiscal_receipt_number: r.fiscal_receipt_number ?? '',
      receipt_image_url: r.receipt_image_url ?? ''
    };
    this.editMessage = '';
    this.editSuccess = false;
  }

  closeEdit(): void {
    this.editingSubmission = null;
    this.editForm = {};
    this.editMessage = '';
  }

  saveEdit(): void {
    if (!this.editingSubmission?.id) return;
    this.savingEdit = true;
    this.editMessage = '';
    this.editSuccess = false;
    this.supabase.updateWarrantySubmission(this.editingSubmission.id, this.editForm).then(({ success, error }) => {
      this.savingEdit = false;
      if (success) {
        const idx = this.results.findIndex(x => x.id === this.editingSubmission!.id);
        if (idx !== -1) {
          this.results[idx] = { ...this.results[idx], ...this.editForm };
        }
        this.editSuccess = true;
        this.editMessage = this.t.editSaved ?? 'Saved.';
        setTimeout(() => this.closeEdit(), 1200);
      } else {
        this.editMessage = error ?? (this.t.editError ?? 'Failed to save.');
      }
    }).catch(() => {
      this.savingEdit = false;
      this.editMessage = this.t.editError ?? 'Failed to save.';
    });
  }

  get deviceTypeOptions(): string[] {
    const types = this.t?.deviceTypes;
    return types ? Object.keys(types) : [];
  }


  /** RFC 4180-style CSV cell; quotes if needed. */
  private csvCell(value: unknown): string {
    const s = String(value ?? '');
    if (/[",\r\n]/.test(s)) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  /**
   * Force text in spreadsheets (Excel/Sheets) to prevent scientific notation
   * and preserve exact user-entered values like long serial/invoice numbers.
   */
  private csvSpreadsheetTextCell(value: unknown): string {
    const s = String(value ?? '');
    const escaped = s.replace(/"/g, '""');
    return `"=""${escaped}"""`;
  }

  private buildSubmissionsCsv(rows: WarrantySubmission[]): string {
    const headers = [
      'id',
      'first_name',
      'last_name',
      'address',
      'city',
      'postal_code',
      'phone',
      'email',
      'device_type',
      'device_model',
      'serial_number',
      'purchase_date',
      'place_of_purchase',
      'city_of_purchase',
      'fiscal_receipt_number',
      'terms_accepted',
      'receipt_image_url',
      'created_at'
    ];
    const lines: string[] = [headers.join(',')];
    for (const row of rows) {
      const vals = [
        row.id,
        row.first_name ?? row.customer_name,
        row.last_name,
        row.address,
        row.city,
        this.csvSpreadsheetTextCell(row.postal_code),
        this.csvSpreadsheetTextCell(row.phone),
        row.email,
        row.device_type,
        row.device_model ?? row.product_name,
        this.csvSpreadsheetTextCell(row.serial_number),
        row.purchase_date,
        row.place_of_purchase ?? row.purchase_place,
        row.city_of_purchase,
        this.csvSpreadsheetTextCell(row.fiscal_receipt_number),
        row.terms_accepted,
        row.receipt_image_url,
        row.created_at
      ].map(v => this.csvCell(v));
      lines.push(vals.join(','));
    }
    // UTF-8 BOM helps Excel open Cyrillic correctly on Windows
    return '\ufeff' + lines.join('\r\n');
  }

  downloadCsv(): void {
    this.downloadingCsv = true;
    this.supabase.getAllWarrantySubmissionsPaged(1000).then(rows => {
      const csv = this.buildSubmissionsCsv(rows);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const date = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
      const link = document.createElement('a');
      link.href = url;
      link.download = `warranty-submissions-${date}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.downloadingCsv = false;
    }).catch(() => {
      this.downloadingCsv = false;
    });
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
