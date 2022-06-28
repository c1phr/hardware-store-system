import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { GenerateSaleComponent } from './generate-sale/generate-sale.component';
import { ConsultProductComponent } from './consult-product/consult-product.component';
import { ReceiptManagerComponent } from './receipt-manager/receipt-manager.component';
import { SalesReportsComponent } from './sales-reports/sales-reports.component';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';


@NgModule({
  declarations: [
    GenerateSaleComponent,
    ConsultProductComponent,
    ReceiptManagerComponent,
    SalesReportsComponent,
    SalesDashboardComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule
  ]
})
export class SalesModule { }
