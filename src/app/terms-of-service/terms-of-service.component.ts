import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import terms_of_service_mk from './terms_of_service_mk.json';
import terms_of_service_en from './terms_of_service_en.json';
import terms_of_service_sr from './terms_of_service_sr.json';
import terms_of_service_al from './terms_of_service_al.json';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms-of-service.component.html',
  styleUrl: './terms-of-service.component.css'
})
export class TermsOfServiceComponent implements OnInit {
  termsOfService: any;

  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe(params => {
      const lang = params.get('lang');
      switch(lang) {
        case 'mk':
          this.termsOfService = terms_of_service_mk;
          break;
        case 'en':
          this.termsOfService = terms_of_service_en;
          break;
        case 'sr':
          this.termsOfService = terms_of_service_sr;
          break;
        case 'al':
          this.termsOfService = terms_of_service_al;
          break;
        default:
          this.termsOfService = terms_of_service_mk; // Default to Macedonian
      }
    });
  }
}
