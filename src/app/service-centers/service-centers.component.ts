import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import service_centers_mk from './service_centers_mk.json';
import service_centers_en from './service_centers_en.json';
import service_centers_sr from './service_centers_sr.json';
import service_centers_al from './service_centers_al.json';

const SEND_SERVICE_CONTACT_URL = '/send-service-contact.php';

@Component({
  selector: 'app-service-centers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-centers.component.html',
  styleUrls: ['./service-centers.component.css']
})
export class ServiceCentersComponent implements OnInit {
  serviceCentersConstant: any = service_centers_en;
  serviceForm!: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;
  currentLang = 'en';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
    this._activatedRoute.queryParamMap.subscribe(params => {
      const lang = params.get('lang') || 'en';
      this.currentLang = lang;
      switch (lang) {
        case 'mk':
          this.serviceCentersConstant = service_centers_mk;
          break;
        case 'en':
          this.serviceCentersConstant = service_centers_en;
          break;
        case 'sr':
          this.serviceCentersConstant = service_centers_sr;
          break;
        case 'al':
          this.serviceCentersConstant = service_centers_al;
          break;
        default:
          this.serviceCentersConstant = service_centers_en;
      }
    });
  }

  private initForm(): void {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Zа-яА-Я\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]{8,}$/)]],
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      this.isSubmitting = true;
      this.submitMessage = '';
      const formData = this.serviceForm.value;

      this.http.post<{ success: boolean; error?: string }>(SEND_SERVICE_CONTACT_URL, formData, {
        responseType: 'json',
        headers: { 'Content-Type': 'application/json' }
      }).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          if (res && res.success) {
            this.submitSuccess = true;
            this.submitMessage = this.serviceCentersConstant.successMessage;
            this.serviceForm.reset();
            setTimeout(() => {
              this.submitSuccess = false;
              this.submitMessage = '';
            }, 5000);
          } else {
            this.submitSuccess = false;
            this.submitMessage = (res && res.error) ? res.error : this.getLocalizedMessage('submitError');
          }
        },
        error: () => {
          this.isSubmitting = false;
          this.submitSuccess = false;
          this.submitMessage = this.getLocalizedMessage('submitError');
        }
      });
    } else {
      Object.keys(this.serviceForm.controls).forEach(key => {
        this.serviceForm.get(key)?.markAsTouched();
      });
      this.submitSuccess = false;
      this.submitMessage = '';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.serviceForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.serviceForm.get(fieldName);
    if (!control?.errors || !control.touched) return '';
    if (control.errors['required']) return this.getLocalizedMessage('required');
    if (control.errors['email']) return this.getLocalizedMessage('invalidEmail');
    if (control.errors['minlength']) return this.getLocalizedMessage('minLength', control.errors['minlength'].requiredLength);
    if (control.errors['maxlength']) return this.getLocalizedMessage('maxLength', control.errors['maxlength'].requiredLength);
    if (control.errors['pattern']) {
      if (fieldName === 'name') return this.getLocalizedMessage('invalidName');
      if (fieldName === 'phone') return this.getLocalizedMessage('invalidPhone');
      return this.getLocalizedMessage('invalidFormat');
    }
    return '';
  }

  private getLocalizedMessage(key: string, value?: number): string {
    const n = value ?? 0;
    const messages: Record<string, Record<string, string>> = {
      en: {
        required: 'This field is required',
        invalidEmail: 'Please enter a valid email address',
        minLength: `Minimum length is ${n} characters`,
        maxLength: `Maximum length is ${n} characters`,
        invalidName: 'Please enter a valid name (letters only)',
        invalidPhone: 'Please enter a valid phone number',
        invalidFormat: 'Please enter a valid format',
        submitError: 'This field is required.',
      },
      mk: {
        required: 'Ова поле е задолжително',
        invalidEmail: 'Внесете валидна емаил адреса',
        minLength: `Минимална должина е ${n} карактери`,
        maxLength: `Максимална должина е ${n} карактери`,
        invalidName: 'Внесете валидно име (само букви)',
        invalidPhone: 'Внесете валиден телефонски број',
        invalidFormat: 'Внесете валиден формат',
        submitError: 'Ова поле е задолжително.',
      },
      sr: {
        required: 'Ово поље је обавезно',
        invalidEmail: 'Унесите валидну емаил адресу',
        minLength: `Минимална дужина је ${n} карактера`,
        maxLength: `Максимална дужина је ${n} карактера`,
        invalidName: 'Унесите валидно име (само слова)',
        invalidPhone: 'Унесите валидан телефонски број',
        invalidFormat: 'Унесите валидан формат',
        submitError: 'Ово поље је обавезно.',
      },
      al: {
        required: 'Kjo fushë është e detyrueshme',
        invalidEmail: 'Ju lutemi vendosni një adresë email të vlefshme',
        minLength: `Gjatësia minimale është ${n} karaktere`,
        maxLength: `Gjatësia maksimale është ${n} karaktere`,
        invalidName: 'Ju lutemi vendosni një emër të vlefshëm (vetëm shkronja)',
        invalidPhone: 'Ju lutemi vendosni një numër telefoni të vlefshëm',
        invalidFormat: 'Ju lutemi vendosni një format të vlefshëm',
        submitError: 'Kjo fushë është e detyrueshme.',
      },
    };
    const lang = messages[this.currentLang] || messages['en'];
    return lang[key] || lang['required'] || 'This field is required';
  }
}
