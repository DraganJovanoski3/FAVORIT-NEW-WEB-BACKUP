import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import sales_partners_mk from './sales_partners_mk.json';
import sales_partners_en from './sales_partners_en.json';
import sales_partners_sr from './sales_partners_sr.json';
import sales_partners_al from './sales_partners_al.json';

@Component({
  selector: 'app-sales-partners',
  standalone: true,
  imports: [],
  templateUrl: './sales-partners.component.html',
  styleUrls: ['./sales-partners.component.css']
})
export class SalesPartnersComponent implements OnInit {

  salesPartnersConstant: any;

  constructor(private _activatedRoute:ActivatedRoute){}
  
  ngOnInit(): void {

    this._activatedRoute.queryParamMap.subscribe(params => {
      const lang = params.get('lang');
      switch(lang) {
        case 'mk' :
          this.salesPartnersConstant = sales_partners_mk;
          break;
        case 'en' :
          this.salesPartnersConstant = sales_partners_en;
          break;
        case 'sr' :
          this.salesPartnersConstant = sales_partners_sr;
          break;
        case 'al' :
          this.salesPartnersConstant = sales_partners_al;
          break;
      }
    });
  }
}
