import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterLink } from '@angular/router';
import { AppComponent } from './app.component';
import { CategoryComponent } from './category/category.component';
import { MatCardModule } from '@angular/material/card';
import { AppRoutes } from './app.routes';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    RouterLink,
    BrowserAnimationsModule,
    MatCardModule,
    AppRoutes
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
