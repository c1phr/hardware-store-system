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
import { RegisterUserComponent } from './users-manager/register-user/register-user.component';
import { SharedModule } from '../../shared/shared.module';
import { RegisterSupplierComponent } from './suppliers-manager/register-supplier/register-supplier.component';
import { RegisterCategoryComponent } from './categories-manager/register-category/register-category.component';
import { UploadCtgImageComponent } from './categories-manager/upload-ctg-image/upload-ctg-image.component';
import { ProductManageDialogComponent } from './admin-products/product-manage-dialog/product-manage-dialog.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    UsersManagerComponent,
    SuppliersManagerComponent,
    CategoriesManagerComponent,
    StockManagerComponent,
    AdminReportsComponent,
    AdminProductsComponent,
    ClearRegistryComponent,
    RegisterUserComponent,
    RegisterSupplierComponent,
    RegisterCategoryComponent,
    UploadCtgImageComponent,
    ProductManageDialogComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
