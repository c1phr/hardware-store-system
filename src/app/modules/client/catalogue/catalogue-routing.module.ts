import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogueComponent } from './catalogue.component';
import { CategoryViewComponent } from './category-view/category-view.component';
import { SubCategoryViewComponent } from './sub-category-view/sub-category-view.component';
import { ProductViewComponent } from './product-view/product-view.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: CatalogueComponent },
      { path: ':id_cat/:name_cat', component: CategoryViewComponent},
      { path: ':id_cat/:id_sub/:name_sub', component: SubCategoryViewComponent},
      { path: ':id_cat/:id_sub/:id_product', component: ProductViewComponent},
      { path: '**', redirectTo: ''}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule { }
