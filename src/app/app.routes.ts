import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { SalesPartnersComponent } from './sales-partners/sales-partners.component';
import { ServiceCentersComponent } from './service-centers/service-centers.component';
import { CategoryComponent } from './category/category.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { ProductComponent } from './product/product.component';
import { NgModule } from '@angular/core';
import { BlogComponent } from './blog/blog.component';
import { BlogListComponent } from './blog-list/blog-list.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'all-products', component: AllProductsComponent },
  { path: 'sales-partners', component: SalesPartnersComponent },
  { path: 'service-centers', component: ServiceCentersComponent },
  { path: 'blogs', component: BlogListComponent },
  { path: 'blog/:id', component: BlogComponent },

  // Route for Category and Subcategory Navigation
  { path: 'category/:category', component: CategoryComponent },  // Shows all subcategories in a category
  { path: 'category/:category/subcategory/:subcategory', component: SubcategoryComponent },  // Shows products in a subcategory
  
  { path: 'category/:category/subcategory/:subcategory/product/:productId', component: ProductComponent },  // Product details
  
  { path: '', redirectTo: '/home', pathMatch: 'full' },  // Default redirect to home
  { path: '**', redirectTo: '/home' }  // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutes { }
