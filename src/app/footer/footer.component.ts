import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import footer_mk from './footer_mk.json'
import footer_en from './footer_en.json'
import footer_sr from './footer_sr.json'
import footer_al from './footer_al.json'


@Component({
    selector:'footer-favorit',
    standalone:true,
    imports:[],
    templateUrl:'./footer.component.html',
    styleUrls: ['./footer.component.css']
})

export class FooterFavorit implements OnInit {
    footerConstant: any;

    constructor(private _activatedRoute:ActivatedRoute){}
    ngOnInit(): void {
        this._activatedRoute.queryParamMap.subscribe(params => {
            const lang = params.get('lang');
            switch(lang) {
              case 'mk' :
                this.footerConstant = footer_mk;
                break;
              case 'en' :
                this.footerConstant = footer_en;
                break;
              case 'sr' :
                this.footerConstant = footer_sr;
                break;
              case 'al' :
                this.footerConstant = footer_al;
                break;
                default:
                  this.footerConstant = {}; 
            }
          });
    }
}
