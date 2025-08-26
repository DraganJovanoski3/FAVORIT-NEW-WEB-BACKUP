import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import about_us_mk from './about_us_mk.json'
import about_us_en from './about_us_en.json'
import about_us_sr from './about_us_sr.json'
import about_us_al from './about_us_al.json'




@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  aboutUsConstant: any;

  constructor(private _activatedRoute:ActivatedRoute, private titleService: Title){}
  ngOnInit(): void {    
    this._activatedRoute.queryParamMap.subscribe(params => {
      const lang = params.get('lang');
      switch(lang) {
        case 'mk' :
          this.aboutUsConstant = about_us_mk;
          break;
        case 'en' :
          this.aboutUsConstant = about_us_en;
          break;
        case 'sr' :
          this.aboutUsConstant = about_us_sr;
          break;
        case 'al' :
          this.aboutUsConstant = about_us_al;
          break;
      }
    });
    
  }
}


