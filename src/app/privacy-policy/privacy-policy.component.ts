import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import privacy_policy_mk from './privacy_policy_mk.json';
import privacy_policy_en from './privacy_policy_en.json';
import privacy_policy_sr from './privacy_policy_sr.json';
import privacy_policy_al from './privacy_policy_al.json';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent implements OnInit {
  privacyPolicy: any;

  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe(params => {
      const lang = params.get('lang');
      switch(lang) {
        case 'mk':
          this.privacyPolicy = privacy_policy_mk;
          break;
        case 'en':
          this.privacyPolicy = privacy_policy_en;
          break;
        case 'sr':
          this.privacyPolicy = privacy_policy_sr;
          break;
        case 'al':
          this.privacyPolicy = privacy_policy_al;
          break;
        default:
          this.privacyPolicy = privacy_policy_mk; // Default to Macedonian
      }
    });
  }
}
