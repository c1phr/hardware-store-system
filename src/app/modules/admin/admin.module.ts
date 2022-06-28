import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UsersManagerComponent } from './users-manager/users-manager.component';
import { SuppliersManagerComponent } from './suppliers-manager/suppliers-manager.component';
import { CategoriesManagerComponent } from './categories-manager/categories-manager.component';
import { StockManagerComponent } from './stock-manager/stock-manager.component';
import { AdminReportsComponent } from './admin-reports/admin-reports.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { ClearRegistryComponent } from './clear-registry/clear-registry.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    UsersManagerComponent,
    SuppliersManagerComponent,
    CategoriesManagerComponent,
    StockManagerComponent,
    AdminReportsComponent,
    AdminProductsComponent,
    ClearRegistryComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
