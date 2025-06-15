import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import contact_mk from './contact_mk.json'
import contact_en from './contact_en.json'
import contact_sr from './contact_sr.json'
import contact_al from './contact_al.json'
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactConstant: any;

  constructor(private _activatedRoute:ActivatedRoute){}
  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe(params => {
        const lang = params.get('lang');
        switch(lang) {
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

}
