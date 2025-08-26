import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import contact_mk from './contact_mk.json'
import contact_en from './contact_en.json'
import contact_sr from './contact_sr.json'
import contact_al from './contact_al.json'

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactConstant: any;
  contactForm!: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;
  currentLang = 'en';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.initForm();
    this._activatedRoute.queryParamMap.subscribe(params => {
        const lang = params.get('lang');
        this.currentLang = lang || 'en';
        switch(this.currentLang) {
          case 'mk' :
            this.contactConstant = contact_mk;
            break;
          case 'en' :
            this.contactConstant = contact_en;
            break;
          case 'sr' :
            this.contactConstant = contact_sr;
            break;
          case 'al' :
            this.contactConstant = contact_al;
            break;
        }
      });
  }

  private initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Zа-яА-Я\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]{8,}$/)]],
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitMessage = '';
      
      const formData = this.contactForm.value;
      
      // Create email content based on language
      const emailContent = this.createEmailContent(formData);
      
      // Create mailto link
      const mailtoLink = `mailto:favoritelectro@favoritelectronics.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailContent)}`;
      
      // Simulate form submission delay for better UX
      setTimeout(() => {
        // Open default email client
        window.location.href = mailtoLink;
        
        // Show success message
        this.submitSuccess = true;
        this.submitMessage = this.getSuccessMessage();
        
        // Reset form after a delay
        setTimeout(() => {
          this.contactForm.reset();
          this.submitSuccess = false;
          this.submitMessage = '';
        }, 4000);
        
        this.isSubmitting = false;
      }, 1000);
    } else {
      this.markFormGroupTouched();
      this.submitSuccess = false;
      this.submitMessage = this.getErrorMessage('form');
    }
  }

  private createEmailContent(formData: any): string {
    const labels = {
      'en': {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        subject: 'Subject',
        message: 'Message'
      },
      'mk': {
        name: 'Име',
        email: 'Емаил',
        phone: 'Телефон',
        subject: 'Наслов',
        message: 'Порака'
      },
      'sr': {
        name: 'Име',
        email: 'Емаил',
        phone: 'Телефон',
        subject: 'Наслов',
        message: 'Порука'
      },
      'al': {
        name: 'Emri',
        email: 'Email',
        phone: 'Telefon',
        subject: 'Subjekti',
        message: 'Mesazhi'
      }
    };

    const currentLabels = labels[this.currentLang as keyof typeof labels] || labels['en'];

    return `
${currentLabels.name}: ${formData.name}
${currentLabels.email}: ${formData.email}
${currentLabels.phone}: ${formData.phone}
${currentLabels.subject}: ${formData.subject}

${currentLabels.message}:
${formData.message}
    `;
  }

  private getSuccessMessage(): string {
    const messages = {
      'en': 'Your message has been sent successfully! We will contact you soon.',
      'mk': 'Вашата порака е успешно испратена! Ќе ве контактираме наскоро.',
      'sr': 'Ваша порука је успешно послата! Контактираћемо вас ускоро.',
      'al': 'Mesazhi juaj është dërguar me sukses! Do t\'ju kontaktojmë së shpejti.'
    };
    return messages[this.currentLang as keyof typeof messages] || messages['en'];
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.contactForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return this.getLocalizedMessage('required');
      }
      if (control.errors['email']) {
        return this.getLocalizedMessage('invalidEmail');
      }
      if (control.errors['minlength']) {
        return this.getLocalizedMessage('minLength', control.errors['minlength'].requiredLength);
      }
      if (control.errors['maxlength']) {
        return this.getLocalizedMessage('maxLength', control.errors['maxlength'].requiredLength);
      }
      if (control.errors['pattern']) {
        if (fieldName === 'name') {
          return this.getLocalizedMessage('invalidName');
        }
        if (fieldName === 'phone') {
          return this.getLocalizedMessage('invalidPhone');
        }
        return this.getLocalizedMessage('invalidFormat');
      }
    }
    return '';
  }

  private getLocalizedMessage(key: string, value?: any): string {
    const messages = {
      'en': {
        required: 'This field is required',
        invalidEmail: 'Please enter a valid email address',
        minLength: `Minimum length is ${value} characters`,
        maxLength: `Maximum length is ${value} characters`,
        invalidName: 'Please enter a valid name (letters only)',
        invalidPhone: 'Please enter a valid phone number',
        invalidFormat: 'Please enter a valid format'
      },
      'mk': {
        required: 'Ова поле е задолжително',
        invalidEmail: 'Внесете валидна емаил адреса',
        minLength: `Минимална должина е ${value} карактери`,
        maxLength: `Максимална должина е ${value} карактери`,
        invalidName: 'Внесете валидно име (само букви)',
        invalidPhone: 'Внесете валиден телефонски број',
        invalidFormat: 'Внесете валиден формат'
      },
      'sr': {
        required: 'Ово поље је обавезно',
        invalidEmail: 'Унесите валидну емаил адресу',
        minLength: `Минимална дужина је ${value} карактера`,
        maxLength: `Максимална дужина је ${value} карактера`,
        invalidName: 'Унесите валидно име (само слова)',
        invalidPhone: 'Унесите валидан телефонски број',
        invalidFormat: 'Унесите валидан формат'
      },
      'al': {
        required: 'Kjo fushë është e detyrueshme',
        invalidEmail: 'Ju lutemi vendosni një adresë email të vlefshme',
        minLength: `Gjatësia minimale është ${value} karaktere`,
        maxLength: `Gjatësia maksimale është ${value} karaktere`,
        invalidName: 'Ju lutemi vendosni një emër të vlefshëm (vetëm shkronja)',
        invalidPhone: 'Ju lutemi vendosni një numër telefoni të vlefshëm',
        invalidFormat: 'Ju lutemi vendosni një format të vlefshëm'
      }
    };

    const currentMessages = messages[this.currentLang as keyof typeof messages] || messages['en'];
    return currentMessages[key as keyof typeof currentMessages] || key;
  }

  // Helper method to check if a field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const control = this.contactForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  // Helper method to get field value
  getFieldValue(fieldName: string): any {
    return this.contactForm.get(fieldName)?.value;
  }
}
