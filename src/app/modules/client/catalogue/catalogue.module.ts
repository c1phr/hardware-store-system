import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogueRoutingModule } from './catalogue-routing.module';
import { CategoryViewComponent } from './category-view/category-view.component';
import { SubCategoryViewComponent } from './sub-category-view/sub-category-view.component';
import { ProductViewComponent } from './product-view/product-view.component';


@NgModule({
  declarations: [
    CategoryViewComponent,
    SubCategoryViewComponent,
    ProductViewComponent
  ],
  imports: [
    CommonModule,
    CatalogueRoutingModule,
  ]
})
export class CatalogueModule { }
