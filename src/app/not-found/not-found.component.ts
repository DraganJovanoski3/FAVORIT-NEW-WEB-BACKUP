import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-code">{{ translations.errorCode }}</div>
        <h1 class="error-title">{{ translations.errorTitle }}</h1>
        <p class="error-message">
          {{ translations.errorMessage }}
        </p>
        <div class="error-actions">
          <a routerLink="/home" class="btn btn-primary">{{ translations.goHomeButton }}</a>
          <button (click)="goBack()" class="btn btn-secondary">{{ translations.goBackButton }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .not-found-content {
      text-align: center;
      background: white;
      padding: 60px 40px;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 100%;
    }

    .error-code {
      font-size: 120px;
      font-weight: bold;
      color: #667eea;
      line-height: 1;
      margin-bottom: 20px;
    }

    .error-title {
      font-size: 32px;
      color: #333;
      margin-bottom: 20px;
      font-weight: 600;
    }

    .error-message {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 40px;
    }

    .error-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      font-size: 16px;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #333;
      border: 2px solid #e9ecef;
    }

    .btn-secondary:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .not-found-content {
        padding: 40px 20px;
      }

      .error-code {
        font-size: 80px;
      }

      .error-title {
        font-size: 24px;
      }

      .error-actions {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 100%;
        max-width: 200px;
      }
    }
  `]
})
export class NotFoundComponent implements OnInit {
  translations: any = {
    errorCode: '404',
    errorTitle: 'Page Not Found',
    errorMessage: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
    goHomeButton: 'Go to Home',
    goBackButton: 'Go Back'
  };
  currentLang: string = 'mk';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadTranslations();
  }

  loadTranslations() {
    // Get language from query params, default to 'mk'
    this.route.queryParams.subscribe(params => {
      this.currentLang = params['lang'] || 'mk';
      this.loadTranslationFile();
    });
  }

  loadTranslationFile() {
    const validLangs = ['mk', 'en', 'sr', 'al'];
    const lang = validLangs.includes(this.currentLang) ? this.currentLang : 'mk';
    
    // Try to load translation file
    fetch(`/assets/not-found/not_found_${lang}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Translation file not found');
        }
        return response.json();
      })
      .then(data => {
        this.translations = { ...this.translations, ...data };
      })
      .catch(error => {
        console.warn('Using default translations for 404 page');
        // Keep the default translations that are already set
      });
  }

  goBack() {
    window.history.back();
  }
}





