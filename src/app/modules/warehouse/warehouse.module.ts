import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseRoutingModule } from './warehouse-routing.module';
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { WarehouseDashboardComponent } from './warehouse-dashboard/warehouse-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WarehouseReportsComponent } from './warehouse-reports/warehouse-reports.component';
import { RegisterProductComponent } from './product-manager/register-product/register-product.component';


@NgModule({
  declarations: [
    ProductManagerComponent,
    WarehouseDashboardComponent,
    WarehouseReportsComponent,
    RegisterProductComponent
  ],
  imports: [
    CommonModule,
    WarehouseRoutingModule,
    SharedModule
  ]
})
export class WarehouseModule { }
