import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import popup_mk from './popup_mk.json';
import popup_en from './popup_en.json';
import popup_sr from './popup_sr.json';
import popup_al from './popup_al.json';
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent implements OnInit {

  popupConstent: any;
  constructor(public dialogRef: MatDialogRef<PopupComponent>, private _activatedRoute:ActivatedRoute)
  {} 
  ngOnInit(): void {

    this._activatedRoute.queryParamMap.subscribe(params => {
      const lang = params.get('lang');
      switch(lang) {
        case 'mk' :
          this.popupConstent = popup_mk;
          break;
        case 'en' :
          this.popupConstent = popup_en;
          break;
        case 'sr' :
          this.popupConstent = popup_sr;
          break;
        case 'al' :
          this.popupConstent = popup_al;
          break;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
