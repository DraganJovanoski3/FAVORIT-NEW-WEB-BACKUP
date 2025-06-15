import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import {NgOptimizedImage, CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import navbar_mk from './navbar_mk.json'
import navbar_en from './navbar_en.json'
import navbar_sr from './navbar_sr.json'
import navbar_al from './navbar_al.json'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    CommonModule,
    MatIconModule 
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  isOpen = false;
  navbarConstant: any;
  selectedLanguageFlag: string = '/assets/macedonia.png'; // Default flag
  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  handleDropdownItemClick(): void {
    this.isDropdownOpen = false; // Close the dropdown
  }
  constructor(
    private _router:Router,
    private _activatedRoute:ActivatedRoute,
    private elementRef: ElementRef
  ){

  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
    document.body.removeEventListener('click', this.onBodyClick.bind(this));

  }
  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe(params => {
      const lang = params.get('lang');
      switch(lang) {
        case 'mk':
          this.navbarConstant = navbar_mk;
          this.selectedLanguageFlag = '/assets/macedonia.png';
          break;
        case 'en':
          this.navbarConstant = navbar_en;
          this.selectedLanguageFlag = '/assets/english.png';
          break;
        case 'sr':
          this.navbarConstant = navbar_sr;
          this.selectedLanguageFlag = '/assets/serbia.png';
          break;
        case 'al':
          this.navbarConstant = navbar_al;
          this.selectedLanguageFlag = '/assets/albania.png';
          break;
        default:
          this.navbarConstant = {}; 
      }
    });
  
    const navLink = document.querySelector('.nav-link');
    if (navLink) {
      navLink.classList.add('clicked');
    }
    document.body.addEventListener('click', this.onBodyClick.bind(this));
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;

    const hamburgerMenu = document.querySelector('.hamburger-menu');
    hamburgerMenu?.classList.toggle('open');
  }
  
  onBodyClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;

      const hamburgerMenu = document.querySelector('.hamburger-menu');
      hamburgerMenu?.classList.remove('open');
    }
  }

  onNavigate(navigateParam:string) {
    this._router.navigate([navigateParam],{queryParamsHandling: 'merge'});
    const clickedElements = document.querySelectorAll('.nav-link.clicked');
    clickedElements.forEach((element: Element) => {
      element.classList.remove('clicked');
    });
    
    const clickedTarget = event?.target as HTMLElement; 
    clickedTarget?.classList.add('clicked');
    window.scrollTo(0, 0);
  }

  changeLanguage(lang: string): void {
    this._router.navigate([], {
      queryParams: { lang: lang },
      queryParamsHandling: 'merge', 
    });
  
    this.isDropdownOpen = false;
  }
}