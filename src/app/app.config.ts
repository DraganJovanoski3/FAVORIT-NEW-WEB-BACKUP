import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy  } from '@angular/common';
import { NgImageSliderModule } from 'ng-image-slider';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), provideAnimations(), NgImageSliderModule,
    {provide : LocationStrategy , useClass: PathLocationStrategy }
  ]
};
