import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import service_centers_mk from './service_centers_mk.json'
import service_centers_en from './service_centers_en.json'
import service_centers_sr from './service_centers_sr.json'
import service_centers_al from './service_centers_al.json'

@Component({
  selector: 'app-service-centers',
  standalone: true,
  imports: [],
  templateUrl: './service-centers.component.html',
  styleUrl: './service-centers.component.css'
})
export class ServiceCentersComponent implements OnInit {

  constructor(private _activatedRoute:ActivatedRoute){}

  serviceCentersConstant:any;
  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe(params => {
      const lang = params.get('lang');
      switch(lang) {
        case 'mk' :
          this.serviceCentersConstant = service_centers_mk;
          break;
        case 'en' :
          this.serviceCentersConstant = service_centers_en;
          break;
        case 'sr' :
          this.serviceCentersConstant = service_centers_sr;
          break;
        case 'al' :
          this.serviceCentersConstant = service_centers_al;
          break;
      }
    });
  }

}
