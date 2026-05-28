import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SupabaseService } from '../core/supabase.service';
import { HomeAppliancesProductsService, WarrantyProductOption } from '../core/home-appliances-products.service';
import { WarrantySubmission } from './warranty.model';
import { environment } from '../../environments/environment';

import warranty_en from './warranty_registration_en.json';
import warranty_mk from './warranty_registration_mk.json';
import warranty_al from './warranty_registration_al.json';
import warranty_sr from './warranty_registration_sr.json';

const TEXTS: Record<string, any> = {
  en: warranty_en,
  mk: warranty_mk,
  al: warranty_al,
  sr: warranty_sr
};

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const YEAR_START = 2026;
const YEARS = Array.from({ length: 20 }, (_, i) => YEAR_START + i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

@Component({
  selector: 'app-warranty-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './warranty-registration.component.html',
  styleUrls: ['./warranty-registration.component.css']
})
export class WarrantyRegistrationComponent implements OnInit {
  t: any = warranty_en;
  form: FormGroup;
  isSubmitting = false;
  message = '';
  success = false;
  currentLang = 'en';
  months = MONTHS;
  years = YEARS;
  days = DAYS;
  categoryName = 'Home Appliances';
  allProducts: WarrantyProductOption[] = [];
  showProductDropdown = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private supabase: SupabaseService,
    private homeAppliancesProducts: HomeAppliancesProductsService
  ) {
    this.form = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{3}-[0-9]{3}-[0-9]{3,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      device_type: ['home-appliances', Validators.required],
      device_model: ['', Validators.required],
      serial_number: ['', Validators.required],
      purchase_day: [null as number | null, Validators.required],
      purchase_month: [null as number | null, Validators.required],
      purchase_year: [null as number | null, Validators.required],
      place_of_purchase: ['', Validators.required],
      city_of_purchase: ['', Validators.required],
      fiscal_receipt_number: ['', Validators.required],
      terms_accepted: [false, Validators.requiredTrue]
    });
  }

  /** Normalize text for search so Cyrillic and Latin lookalikes (e.g. К/K) match. */
  private normalizeForSearch(text: string): string {
    const cyrToLat: Record<string, string> = {
      'А': 'A', 'В': 'B', 'С': 'C', 'Е': 'E', 'Н': 'H', 'К': 'K', 'М': 'M', 'О': 'O',
      'Р': 'P', 'Т': 'T', 'У': 'Y', 'Х': 'X',
      'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x'
    };
    let out = '';
    for (const ch of text) {
      out += cyrToLat[ch] ?? ch;
    }
    return out.toLowerCase();
  }

  get filteredProducts(): WarrantyProductOption[] {
    const q = (this.form.get('device_model')?.value || '').trim();
    if (!q) return this.allProducts;
    const qNorm = this.normalizeForSearch(q);
    return this.allProducts.filter(p =>
      this.normalizeForSearch(p.name).includes(qNorm) ||
      this.normalizeForSearch(p.subcategory).includes(qNorm)
    );
  }

  selectProduct(p: WarrantyProductOption): void {
    this.form.patchValue({ device_model: p.name });
    this.showProductDropdown = false;
  }

  onProductInputFocus(): void {
    this.showProductDropdown = true;
  }

  closeProductDropdown(): void {
    setTimeout(() => this.showProductDropdown = false, 150);
  }

  /** Call server endpoint to send confirmation email to the customer (if warrantyConfirmationApiUrl is set). */
  private sendConfirmationEmail(data: WarrantySubmission): void {
    const url = (environment as any).warrantyConfirmationApiUrl;
    if (!url || typeof url !== 'string' || !url.trim()) return;
    const payload = { ...data, lang: this.currentLang };
    this.http.post(url.trim(), payload, {
      responseType: 'json',
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  /** Format phone as XXX-XXX-XXX (e.g. 070-123-456) as user types. */
  private formatPhoneInput(value: string): string {
    const digits = (value || '').replace(/\D/g, '').slice(0, 12);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return digits.slice(0, 3) + '-' + digits.slice(3);
    return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
  }

  ngOnInit(): void {
    const phoneControl = this.form.get('phone');
    if (phoneControl) {
      phoneControl.valueChanges.subscribe(val => {
        const formatted = this.formatPhoneInput(val || '');
        if (formatted !== val) {
          phoneControl.patchValue(formatted, { emitEvent: false });
        }
      });
    }
    this.route.queryParamMap.subscribe(params => {
      const lang = params.get('lang') || 'en';
      this.currentLang = ['mk', 'en', 'sr', 'al'].includes(lang) ? lang : 'en';
      this.t = TEXTS[this.currentLang] || warranty_en;
      this.categoryName = this.homeAppliancesProducts.getCategoryName(this.currentLang);
      this.allProducts = this.homeAppliancesProducts.getWarrantyProducts(this.currentLang);
    });
  }

  private buildPurchaseDate(): string | null {
    const d = this.form.get('purchase_day')?.value;
    const m = this.form.get('purchase_month')?.value;
    const y = this.form.get('purchase_year')?.value;
    if (d == null || m == null || y == null) return null;
    const month = String(m).padStart(2, '0');
    const day = String(d).padStart(2, '0');
    return `${y}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const purchaseDate = this.buildPurchaseDate();
    if (!purchaseDate) {
      this.form.get('purchase_day')?.markAsTouched();
      this.form.get('purchase_month')?.markAsTouched();
      this.form.get('purchase_year')?.markAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.message = '';
    this.success = false;

    const v = this.form.value;
    const data: WarrantySubmission = {
      first_name: v.first_name,
      last_name: v.last_name,
      address: v.address,
      city: v.city,
      postal_code: v.postal_code,
      phone: v.phone,
      email: v.email,
      device_type: v.device_type,
      device_model: v.device_model,
      serial_number: v.serial_number,
      purchase_date: purchaseDate,
      place_of_purchase: v.place_of_purchase,
      city_of_purchase: v.city_of_purchase,
      fiscal_receipt_number: v.fiscal_receipt_number,
      terms_accepted: true
    };

    this.supabase.isSerialNumberAlreadyRegistered(data.serial_number).then(exists => {
      if (exists) {
        this.isSubmitting = false;
        this.success = false;
        this.message = this.t.serialAlreadyRegistered || 'This serial number is already registered.';
        return;
      }
      this.supabase.submitWarranty(data).then(result => {
        this.isSubmitting = false;
        if (result.success) {
          this.success = true;
          this.message = this.t.successMessage;
          this.form.reset({ terms_accepted: false });
          this.sendConfirmationEmail(data);
        } else {
          this.success = false;
          this.message = this.t.errorMessage + (result.error ? ' ' + result.error : '');
        }
      });
    });
  }

  isFieldInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!(c && c.invalid && c.touched);
  }
}
